# Google Play Store Listing Specification
**Project:** Hutano Mudanga (Mobile-first Animal Health & Vet Directory Platform)  
**Document Version:** 1.0.0  
**Date:** May 2026  

This document contains all the copy, settings, metadata, and asset guidelines required to publish **Hutano Mudanga** (Project X) on the Google Play Store Console.

---

## 1. Store Listing Metadata

### App Title (Max 30 characters)
*The official name of the app as it appears on the Google Play Store.*

* **Option 1 (Recommended - Shona/English Mix):**
  `Hutano Mudanga - Animal Health` *(30 characters)*
* **Option 2 (Focus on Vet Access):**
  `Hutano Mudanga - Find a Vet` *(26 characters)*
* **Option 3 (Brand Only):**
  `Hutano Mudanga` *(14 characters)*

---

### Short Description (Max 80 characters)
*A brief, catchy overview of the app's core value proposition to entice downloads.*

* **Option 1 (Recommended):**
  `Connect with vets, track livestock records, and get instant AI health advice.` *(79 characters)*
* **Option 2 (Action-Oriented):**
  `Consult veterinary doctors, run AI health checks, and manage your livestock.` *(78 characters)*
* **Option 3 (Community Focus):**
  `Your local livestock health companion: Connect with vets and manage your farm.` *(79 characters)*

---

### Full Description (Max 4,000 characters)
*A comprehensive overview of what the app does, its target audience, key features, benefits, and important disclaimers.*

```text
Keep your livestock healthy, track your farm records, and connect with trusted veterinary experts—all in one place. 

Hutano Mudanga (which translates to "Animal Health in the Kraal/Pen") is a mobile-first digital health platform specifically designed for livestock farmers in Southern Africa. Whether you manage cattle, sheep, goats, pigs, or poultry, Hutano Mudanga equips you with the modern tools and expert networks needed to safeguard your livestock, improve productivity, and maximize your farm's success.

Why Choose Hutano Mudanga?

🐾 INSTANT AI LIVESTOCK ASSISTANT
Got a question about animal care, sudden symptoms, or nutritional needs? Our interactive AI health assistant provides localized, contextualized veterinary and management advice in seconds. Get instant guidance on immediate first-aid, breeding, vaccine schedules, and disease management.

📍 GEOLOCATION VET DIRECTORY
Never feel stranded in a veterinary emergency. Use our interactive map to locate registered, verified veterinary doctors near you. Filter vets by distance, specialties (cattle, poultry, small ruminants, etc.), language, and rating. Connect instantly to book consultations, coordinate visits, or get advice.

📋 DIGITAL LIVESTOCK RECORDS
Ditch the paper registries. Keep clean, structured digital profiles for your entire herd or flock. 
- Create individual or group profiles (cattle, sheep, goats, pigs, chickens, and more).
- Log medical histories, breeding dates, weight tracking, and vaccination logs.
- Share your animal records directly with your veterinarian to enable quick, accurate diagnoses.

💬 DIRECT CHAT & IN-APP CONSULTATION
Communicate in real-time with veterinary professionals. Send text messages, voice notes, and share high-resolution photos of animal symptoms or injuries. Keep an active log of your consultations so you can review previous treatment guidance at any time.

📶 OFFLINE-FIRST SYNCHRONIZATION
Farming doesn’t always happen where there is a strong internet connection. Hutano Mudanga is built with an offline-first database. Save your animal profiles, update records, and browse saved health checks completely offline. Your data will automatically sync with the cloud as soon as you reconnect.

🔔 SMART REMINDERS & NOTIFICATIONS
Stay ahead of critical farm management tasks. Receive real-time alerts and push notifications for vaccine reminders, scheduled vet visits, diagnostic report updates, and new message alerts from veterinarians.

Are you a Veterinary Professional?
Hutano Mudanga is also a dedicated workspace for vets! Sign up as a veterinary practitioner to:
- Receive and manage incoming consultation requests from local farmers.
- View comprehensive health reports and history shared by farmers before you arrive on the farm.
- Build your client base, manage customer reviews, and coordinate multiple cases easily using your Vet Dashboard.

Important Disclaimer:
Hutano Mudanga's AI assistant provides preliminary educational guidance and health assessments based on user inputs. It does not replace professional veterinary diagnostics, tests, or physical examinations. Always consult a qualified veterinary doctor for official treatments and clinical assessments.
```

---

## 2. Categorization, Tags, and Store Info

### App Categorization
* **Main Store Category:** `Medical` OR `Business` (Medical is highly recommended due to the clinical/veterinary health, chat, and diagnostic nature. Alternatively, `Productivity` can be chosen).
* **App Type:** `App`

### Recommended Google Play Tags (Choose up to 5)
1. `Medical` (Directly represents health & consultation)
2. `Business` (Represents farm management/veterinary practices)
3. `Maps & Navigation` (Represents the Vet Directory search)
4. `Productivity` (Represents record keeping and organization)
5. `Communication` (Represents direct chat between farmers and vets)

---

## 3. Graphic & Media Assets Specifications

To publish the app, you will need the following graphic assets. Use this checklist and specifications when preparing designs:

| Asset Type | Required Dimensions | Format | Key Content Ideas |
| :--- | :--- | :---: | :--- |
| **App Icon** | 512 x 512 px | 32-bit PNG | The clean green and gold/neutral emblem representing a shield, animal silhouette, and leaf/kraal (matching the dark forest green theme `#2F6B3B`). |
| **Feature Graphic** | 1024 x 500 px | PNG or JPEG | A beautiful showcase image. E.g., a high-quality photo of healthy livestock with a farmer holding a phone, styled with a glassmorphism overlay containing the app title "Hutano Mudanga". |
| **Phone Screenshots** | Min: 320 px / Max: 3840 px (Aspect Ratio 16:9 or 9:16) | PNG or JPEG | **2 to 8 screenshots** displaying key screens: <br>1. **Home Screen:** Quick actions & livestock overview.<br>2. **Vet Directory Map:** Beautiful geolocation pins finding nearby vets.<br>3. **AI Assistant Chat:** Interactive diagnostic questions and answers.<br>4. **Livestock Records:** Profile list showing cows, goats, sheep.<br>5. **Vet Consultation Chat:** Active chat sharing pictures of a symptom.<br>6. **Vet Dashboard:** Visual stats and requests (for veterinarians). |

---

## 4. Play Store Data Safety Questionnaire

Google requires a strict disclosure of what user data your app collects, shares, and secures. Below are the values you must declare based on the Hutano Mudanga codebase:

### Data Collection & Sharing Declarations

1. **Location**
   * **Precise Location:** *Collected and Shared.* (Used in the Vet Directory to calculate distances and route veterinary doctors. Shared with veterinarians when a farmer requests a home visit or shares a consultation record).
   * **Approximate Location:** *Collected and Shared.* (Same as above).

2. **Personal Info**
   * **Name:** *Collected.* (Used for user account creation, personalization, and showing who is chatting).
   * **Email Address:** *Collected.* (Required for user authentication and billing).
   * **Phone Number:** *Collected.* (Used as a primary channel for communication between farmer and veterinarian).

3. **Photos and Videos**
   * **Photos:** *Collected.* (Farmers upload photos of symptoms for AI assessments and direct vet consultations. Veterinarians upload certificates and profile photos).

4. **App Activity & Performance Info**
   * **Crash Logs:** *Collected.* (For diagnosing app stability).
   * **Diagnostics / Performance Data:** *Collected.* (To optimize loading speeds).

5. **Device or Other IDs**
   * **Device IDs:** *Collected.* (Used to target push notifications).

### Security Practices to Declare
* **Data encrypted in transit:** **Yes** (All API communication with Supabase and AI engines is forced over HTTPS).
* **Request Data Deletion:** **Yes** (Users can request account and record deletion directly through their settings or support email).

---

## 5. Contact and Legal Listings

### Support Contact Information
* **Public Email:** `support@hutanomudanga.com` (or your domain e.g., `support@projectx.app`)
* **Website URL:** `https://hutanomudanga.com` (or your hosted domain)
* **Privacy Policy URL:** `https://hutanomudanga.com/privacy`  
  *(Note: You can host your current `docs/privacy.html` on GitHub Pages, Vercel, Supabase hosting, or your main web domain. The Play Store requires this link to be public and functional).*

---

## 6. Play Store Release Steps Summary

1. **EAS Build:** Run `eas build --platform android --profile production` to generate a production-signed `.aab` (Android App Bundle).
2. **Play Console Setup:** Create a new application in your Google Play Console dashboard under the name **Hutano Mudanga**.
3. **Store Listing:** Copy and paste the **Title**, **Short Description**, and **Full Description** from Section 1 above.
4. **App Assets:** Upload the App Icon, Feature Graphic, and screenshots (drawn from actual device runs or high-fidelity mockups).
5. **Data Safety:** Complete the Data Safety questionnaire using the answers prepared in Section 4.
6. **Privacy Policy:** Paste the public URL to your privacy policy.
7. **Release Track:** Upload the `.aab` bundle to the Internal Testing track first, promote it to Closed Testing, and finally roll it out to Production!
