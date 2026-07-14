export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      animals: {
        Row: {
          age: string | null
          breed: string | null
          created_at: string
          farmer_id: string
          id: string
          notes: string | null
          sex: string | null
          species: string
          tag_number: string | null
        }
        Insert: {
          age?: string | null
          breed?: string | null
          created_at?: string
          farmer_id: string
          id?: string
          notes?: string | null
          sex?: string | null
          species: string
          tag_number?: string | null
        }
        Update: {
          age?: string | null
          breed?: string | null
          created_at?: string
          farmer_id?: string
          id?: string
          notes?: string | null
          sex?: string | null
          species?: string
          tag_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "animals_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_messages: {
        Row: {
          assessment_id: string
          created_at: string
          id: string
          message: string
          metadata: Json | null
          role: string
        }
        Insert: {
          assessment_id: string
          created_at?: string
          id?: string
          message: string
          metadata?: Json | null
          role: string
        }
        Update: {
          assessment_id?: string
          created_at?: string
          id?: string
          message?: string
          metadata?: Json | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_messages_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      assessments: {
        Row: {
          ai_summary: string | null
          animal_id: string | null
          certainty_level: string | null
          created_at: string
          disclaimer: string | null
          farmer_id: string
          id: string
          likely_condition: string | null
          possible_causes: string[] | null
          prevention_tips: string[] | null
          raw_farmer_input: string
          structured_symptoms: Json | null
          suggested_next_steps: string[] | null
          urgency_level: string | null
        }
        Insert: {
          ai_summary?: string | null
          animal_id?: string | null
          certainty_level?: string | null
          created_at?: string
          disclaimer?: string | null
          farmer_id: string
          id?: string
          likely_condition?: string | null
          possible_causes?: string[] | null
          prevention_tips?: string[] | null
          raw_farmer_input: string
          structured_symptoms?: Json | null
          suggested_next_steps?: string[] | null
          urgency_level?: string | null
        }
        Update: {
          ai_summary?: string | null
          animal_id?: string | null
          certainty_level?: string | null
          created_at?: string
          disclaimer?: string | null
          farmer_id?: string
          id?: string
          likely_condition?: string | null
          possible_causes?: string[] | null
          prevention_tips?: string[] | null
          raw_farmer_input?: string
          structured_symptoms?: Json | null
          suggested_next_steps?: string[] | null
          urgency_level?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assessments_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessments_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          assessment_id: string | null
          booking_type: string
          created_at: string
          farmer_id: string
          id: string
          notes: string | null
          scheduled_at: string
          status: string | null
          vet_id: string
        }
        Insert: {
          assessment_id?: string | null
          booking_type: string
          created_at?: string
          farmer_id: string
          id?: string
          notes?: string | null
          scheduled_at: string
          status?: string | null
          vet_id: string
        }
        Update: {
          assessment_id?: string | null
          booking_type?: string
          created_at?: string
          farmer_id?: string
          id?: string
          notes?: string | null
          scheduled_at?: string
          status?: string | null
          vet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_vet_id_fkey"
            columns: ["vet_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          chat_id: string
          created_at: string
          id: string
          message: string
          message_type: string | null
          related_assessment_id: string | null
          sender_id: string
        }
        Insert: {
          chat_id: string
          created_at?: string
          id?: string
          message: string
          message_type?: string | null
          related_assessment_id?: string | null
          sender_id: string
        }
        Update: {
          chat_id?: string
          created_at?: string
          id?: string
          message?: string
          message_type?: string | null
          related_assessment_id?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_related_assessment_id_fkey"
            columns: ["related_assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chats: {
        Row: {
          created_at: string
          farmer_id: string
          id: string
          last_message_at: string
          vet_id: string
        }
        Insert: {
          created_at?: string
          farmer_id: string
          id?: string
          last_message_at?: string
          vet_id: string
        }
        Update: {
          created_at?: string
          farmer_id?: string
          id?: string
          last_message_at?: string
          vet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chats_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chats_vet_id_fkey"
            columns: ["vet_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      farmers: {
        Row: {
          created_at: string
          district: string | null
          farm_name: string | null
          id: string
          livestock_types: string[] | null
          notes: string | null
          profile_id: string
        }
        Insert: {
          created_at?: string
          district?: string | null
          farm_name?: string | null
          id?: string
          livestock_types?: string[] | null
          notes?: string | null
          profile_id: string
        }
        Update: {
          created_at?: string
          district?: string | null
          farm_name?: string | null
          id?: string
          livestock_types?: string[] | null
          notes?: string | null
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "farmers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string
          created_at: string
          id: string
          is_read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          location: string | null
          phone: string | null
          role: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name: string
          id: string
          location?: string | null
          phone?: string | null
          role: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          location?: string | null
          phone?: string | null
          role?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          farmer_id: string
          id: string
          rating: number
          vet_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          farmer_id: string
          id?: string
          rating: number
          vet_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          farmer_id?: string
          id?: string
          rating?: number
          vet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_vet_id_fkey"
            columns: ["vet_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vet_availability: {
        Row: {
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          is_active: boolean | null
          start_time: string
          vet_id: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          is_active?: boolean | null
          start_time: string
          vet_id: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_active?: boolean | null
          start_time?: string
          vet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vet_availability_vet_id_fkey"
            columns: ["vet_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vet_shares: {
        Row: {
          assessment_id: string
          farmer_id: string
          id: string
          shared_at: string
          status: string | null
          vet_id: string
        }
        Insert: {
          assessment_id: string
          farmer_id: string
          id?: string
          shared_at?: string
          status?: string | null
          vet_id: string
        }
        Update: {
          assessment_id?: string
          farmer_id?: string
          id?: string
          shared_at?: string
          status?: string | null
          vet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vet_shares_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vet_shares_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vet_shares_vet_id_fkey"
            columns: ["vet_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      veterinarians: {
        Row: {
          available_now: boolean | null
          bio: string | null
          consultation_fee: number | null
          consultation_methods: string[] | null
          created_at: string
          id: string
          license_number: string | null
          profile_id: string
          qualification: string
          rating_average: number | null
          region: string | null
          specializations: string[] | null
          total_reviews: number | null
          verification_status: string | null
        }
        Insert: {
          available_now?: boolean | null
          bio?: string | null
          consultation_fee?: number | null
          consultation_methods?: string[] | null
          created_at?: string
          id?: string
          license_number?: string | null
          profile_id: string
          qualification: string
          rating_average?: number | null
          region?: string | null
          specializations?: string[] | null
          total_reviews?: number | null
          verification_status?: string | null
        }
        Update: {
          available_now?: boolean | null
          bio?: string | null
          consultation_fee?: number | null
          consultation_methods?: string[] | null
          created_at?: string
          id?: string
          license_number?: string | null
          profile_id?: string
          qualification?: string
          rating_average?: number | null
          region?: string | null
          specializations?: string[] | null
          total_reviews?: number | null
          verification_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "veterinarians_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
