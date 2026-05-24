# Technical Department Budget & Cost Estimations
**Project:** Project X (Mobile-first Animal Health & Vet Directory Platform)  
**Date:** May 2026  
**Document Purpose:** Tech budget estimations for investors, focusing on monthly running costs (OpEx) and separate hardware equipment costs (CapEx).

---

## 1. Executive Summary

**Project X** is a mobile-first livestock health platform designed to connect farmers with veterinary doctors and provide AI-driven diagnostics ("Assistant Screen") in Southern Africa.

This budget is divided into two parts to suit an investor's financial model:
1. **Operational Expenditures (OpEx):** Monthly recurring technical costs directly tied to server hosting, databases, AI computation, geocoding maps, and internet connectivity.
2. **Capital Expenditures (CapEx):** Hardware and equipment costs (laptops for developers and mobile test devices for testing in the field), presented separately as upfront asset purchases.

Projections are structured across three growth phases:
* **Phase 1: Pre-Seed / MVP Launch (0 - 2,000 active farmers)**
* **Phase 2: Seed / Growth (2,000 - 15,000 active farmers)**
* **Phase 3: Scale / Series A (15,000 - 100,000+ active farmers)**

---

## 2. Monthly Technical Running Costs (OpEx)

These represent the recurring monthly expenses required to keep the application live and functional for our users.

| Cost Category | Phase 1: MVP (Pre-Seed)<br>0 - 2k Users | Phase 2: Growth (Seed)<br>2k - 15k Users | Phase 3: Scale (Series A)<br>15k - 100k+ Users |
| :--- | :---: | :---: | :---: |
| **Server & Cloud Hosting** (Supabase) | $25 | $110 | $600 |
| **AI LLM API** (Assistant & Diagnostics) | $30 | $350 | $2,200 |
| **Map & Geolocation APIs** (Vet Directory) | $30 | $150 | $800 |
| **Internet & Mobile Data** (Dev & Testing) | $130 | $300 | $800 |
| **TOTAL MONTHLY TECH RUNNING COST** | **$215** | **$910** | **$4,400** |

### Operational Cost Justifications:

* **Server & Cloud Hosting (Supabase):** Powers the central PostgreSQL database, auth systems, edge functions, and secure storage for user uploads (such as high-res photos of animal injuries or symptoms).
* **AI LLM API:** Powers the interactive chat assistant (`AssistantScreen.tsx`) helping farmers diagnose livestock health issues using local context. We leverage highly cost-effective models (e.g., `gpt-4o-mini` or `claude-3-haiku`) to minimize cost-per-query.
* **Map & Geolocation APIs (Google Maps / Mapbox):** Powers the Vet Directory matching (`VetDirectoryScreen.tsx`). These figures represent API lookups for geocoding and proximity calculations to direct farmers to the nearest vet clinic.
* **Internet & Mobile Data:** Dedicated high-speed internet for the core development office, plus mobile data bundles for testing the application's offline-first synchronization logic on regional networks (EDGE/3G/4G).

---

## 3. Technical Equipment & Hardware (CapEx)

These are one-time or milestone-based equipment purchases for the technical team. They are held as company assets and updated as the team size grows.

### Phase 1: MVP Setup (2 Core Developers)
* **Development Laptops ($2,400):** 2x high-performance development laptops (e.g., Apple MacBook Air/Pro M-series) suitable for cross-compiling React Native/Expo builds.
* **Test & QA Devices ($600):** 3x budget Android smartphones (common farmer handsets like Tecno, Itel, Samsung Galaxy A-series) and 1x test iPhone to verify real-world performance.
* **Total Phase 1 Hardware Budget:** **$3,000** *(upfront asset acquisition)*

### Phase 2: Expansion Setup (4 Technical Staff)
* **Additional Laptops ($2,400):** 2x additional developer/designer workstations.
* **Additional QA Devices ($600):** 4x additional low-end and mid-range mobile devices to expand screen resolution and OS-version testing.
* **Total Phase 2 Hardware Budget:** **$3,000** *(cumulative total: $6,000)*

### Phase 3: Scale Setup (8 Technical Staff)
* **Additional Laptops ($6,000):** 4x additional developer/analyst workstations.
* **Device Lab & QA Rack ($1,400):** Upgraded device testing matrix including tablets, rugged devices, and high-frequency usage simulators.
* **Total Phase 3 Hardware Budget:** **$7,400** *(cumulative total: $13,400)*

---

## 4. Key Highlights for Investors

> [!TIP]
> **Extremely Lean Infrastructure Overhead:**
> By keeping core data interactions optimized (using client-side caching via AsyncStorage/SQLite) and separating capital equipment from recurring runtime expenses, the monthly operational cost to support 10,000+ farmers is under **$1,000/month**.

> [!IMPORTANT]
> **Scalable Hardware Lifecycle:**
> Hardware costs scale linearly with developer team size, while server costs scale sub-linearly with user volume. This ensures high operating leverage as Project X expands its farmer network.
