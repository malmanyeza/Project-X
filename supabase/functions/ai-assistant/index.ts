import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { symptoms, history, assessment_id, species = "Livestock" } = body;

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        global: {
          headers: req.headers.get("Authorization") ? { Authorization: req.headers.get("Authorization")! } : {},
        },
      }
    );

    const openAiKey = Deno.env.get("OPENAI_API_KEY");

    if (!openAiKey) {
      return new Response(JSON.stringify({
        role: "assistant",
        content: "API Key missing. Please configure Supabase Secrets.",
        metadata: { stage: "error" }
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 });
    }

    const systemPrompt = `
You are Mudanga, a friendly and knowledgeable livestock health advisor. You talk like a real person — warm, natural, and easy to understand. You are NOT a robot. You do NOT ask multiple questions at once. You do NOT sound like a form or questionnaire.

HOW YOU TALK:
- If someone says "Hi" or greets you, greet them back warmly and ask what's going on with their animal — just ONE simple question, naturally.
- Respond like a helpful friend who knows about animals, not a doctor reading from a checklist.
- Ask only ONE follow-up question at a time, woven naturally into your response.
- When you have enough info to make a reasonable assessment, just do it — don't keep asking questions forever.
- Keep responses short and clear. No bullet points. No formal lists in your chat message. Just talk normally.

WHEN TO ASSESS:
- After 2-4 messages of back-and-forth, you should have enough to give a preliminary assessment.
- Even if you're not 100% sure, give your best guess and say so naturally.

ALWAYS return valid JSON:
{
  "ai_summary": "Your natural conversational reply here",
  "thought_process": "Brief internal note on what you're thinking (optional)",
  "stage": "gathering_info" OR "preliminary" OR "assessment",
  "likely_condition": "Your best guess at the condition",
  "certainty_level": "Low / Medium / High",
  "urgency_level": "low / medium / high / critical",
  "possible_causes": ["cause 1", "cause 2"],
  "suggested_next_steps": ["step 1", "step 2"],
  "prevention_tips": ["tip 1", "tip 2"]
}

For a simple greeting like "hi", set stage to "gathering_info" and leave medical fields empty strings or empty arrays.
    `;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${openAiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-5.4-nano",
        messages: [{ role: "system", content: systemPrompt }, ...(history || []), { role: "user", content: symptoms || "Hello" }],
        response_format: { type: "json_object" }
      }),
    });

    const aiData = await response.json();
    if (!response.ok) throw new Error(aiData.error?.message || "OpenAI error");

    const content = JSON.parse(aiData.choices[0].message.content);
    const messageText = content.ai_summary;

    // Database Sync
    try {
      await supabaseClient.from("assessment_messages").insert({
        assessment_id,
        role: "assistant",
        message: messageText,
        metadata: content
      });

      if (content.stage === "assessment" || content.stage === "preliminary") {
        await supabaseClient.from("assessments").update({
          ai_summary: content.ai_summary,
          likely_condition: content.likely_condition,
          certainty_level: content.certainty_level,
          possible_causes: content.possible_causes,
          suggested_next_steps: content.suggested_next_steps,
          prevention_tips: content.prevention_tips,
          urgency_level: content.urgency_level?.toLowerCase()
        }).eq("id", assessment_id);
      }
    } catch (dbErr) {
      console.warn("DB update skipped:", dbErr.message);
    }

    return new Response(JSON.stringify({
      role: "assistant",
      content: messageText,
      metadata: content
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 });

  } catch (error: any) {
    console.error("EDGE FUNCTION ERROR:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 });
  }
});
