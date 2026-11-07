# FAQ Section with Admin Dashboard Configuration

Interactive, bilingual FAQ section situated directly below the "Why Choose Us" section on the GoJapan 24hours storefront, powered by category filtering tabs and full administrative management (CRUD, reordering, and bilingual translation) within the Admin Dashboard.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following product choices were confirmed during Phase 1 clarification:
> - **Display Style**: Collapsible accordion with interactive category filter tabs (`All`, `SIM & eSIM`, `Pocket Wi-Fi & Routers`, `Delivery & Returns`, `Payment & Support`).
> - **Admin Capabilities**: Complete management in Admin Dashboard (create new questions, edit bilingual text, assign categories, reorder items, and delete questions).
> - **Preloaded Knowledge Base**: Comprehensive telecom set initialized out-of-the-box (SIM APN setup, eSIM QR delivery, Pocket Wi-Fi return envelope policy, airport pickup, and payment methods).

---

## 1. Overview & Core Concept

- **What It Does**: Provides travelers, expats, and customers with instant answers to common questions about Japanese telecom services (how to activate travel SIMs, scan eSIM QR codes, return rented pocket Wi-Fi units via postbox, and track deliveries). Administrators can customize, expand, and reorganize these FAQs at any time through the Admin Dashboard settings tab without touching code.
- **Target Audience**: Cambodian and international travelers, students, and workers traveling to or residing in Japan who require clear technical and logistical guidance in Khmer or English.
- **Key Value**: Reduces customer support inquiry volume on Telegram and Hotline while building purchase confidence and providing transparency regarding rental return rules.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Browsing Customers (Storefront)**:
   - Scroll past the "Why Choose Us" tier-1 telecom highlights.
   - Encounter the FAQ section featuring an editorial headline ("សំណួរដែលសួរញឹកញាប់" / "Frequently Asked Questions") and subtitle.
   - Click category filter tabs (`All`, `SIM & eSIM`, `Pocket Wi-Fi`, `Delivery & Returns`) to narrow down relevant topics with smooth transitions.
   - Click an accordion item to expand and reveal the detailed answer with clean typography, helpful step-by-step guidance, and relevant icon accents.
   - Click again to collapse or click another question to smoothly toggle answers.
   - Switch language between Khmer and English to see instant localized question and answer text.

2. **Administrator (Admin Dashboard > Settings)**:
   - Navigate to the **Settings** tab in the Admin Dashboard.
   - See a dedicated **Group: FAQ & Customer Guidance Manager** with real-time count of active questions.
   - View all existing questions arranged by category with quick preview cards.
   - Click **"+ បន្ថែមសំណួរថ្មី (+ Add New FAQ)"** to open a modal or inline form with fields: Category, Khmer Question, English Question, Khmer Answer, English Answer, and Sort Order.
   - Edit any existing FAQ inline or via modal.
   - Reorder questions using up/down controls or sort order values.
   - Delete outdated or promotional FAQs with instant confirmation.
   - Click **"💾 រក្សាទុកសំណួរចម្លើយ (Save FAQs)"** or the top sticky save bar to instantly persist changes to localStorage and broadcast live updates to the storefront.

### Visual Identity & Theme

- **Color Palette & Styling**:
   - Section background: Clean off-white (`bg-white` or subtle `bg-slate-50/60`) alternating with the slate-100 Why Choose Us container.
   - Accent & Active Highlights: GoJapan magenta (`#FF259D` / `text-gojapan-600` / `ring-gojapan-500/20`) for active category tabs and open accordion indicators.
   - Accordion items: Clean hairline borders (`border border-slate-200 hover:border-slate-300`), rounded corners matching the product card design language (`rounded-xl`), and subtle soft shadow on expansion.
- **Zero-Pill Discipline & Typographic Hierarchy**:
   - Category filter tabs use functional segmented button pills with active states (`bg-gojapan-500 text-white font-semibold shadow-xs` vs `bg-slate-100 text-slate-600 hover:text-slate-900`).
   - Metadata (category name, question number) is rendered as clean unboxed text with typographic bullet separators (`SIM & eSIM · 4 steps`).
   - Headlines use `Plus Jakarta Sans` / `Kantumruy Pro` in bold weight (`text-slate-900 text-sm sm:text-base font-bold`).
- **Interactive Motion**:
   - Accordion toggle uses smooth expansion/collapse with CSS transitions (`max-h`, `opacity`, and chevron rotation `180deg`).
   - Micro-interaction response $\le 150\text{ms}$ with smooth settling curves (`cubic-bezier(0.16, 1, 0.3, 1)`).

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Accordion with Category Tabs vs Single Static List**
  - *Chosen*: Interactive category tabs (`All`, `SIM & eSIM`, `Pocket Wi-Fi`, `Delivery & Return`, `Billing`) with collapsible accordion cards.
  - *Why*: Accommodates 8–15 in-depth telecom instructions without overwhelming the vertical viewport or forcing excessive scrolling.
  - *Alternatives Considered*: Multi-column grid (difficult to scan on mobile) or static text list (clutters the landing page).

- **Decision 2: Storage Architecture & Persistence**
  - *Chosen*: Integrated inside `SiteSettings` as `faqs: FAQItem[]` stored in `localStorage` under `gojapan_site_settings_v1`.
  - *Why*: Ensures atomic saving with existing Site Settings, leverages established `window.dispatchEvent('gojapan_site_settings_updated')`, and maintains synchronization across open browser tabs without database migrations.
  - *Alternatives Considered*: Separate localStorage key (risks fragmented saving and unsynchronized state updates).

- **Decision 3: Default Curated Knowledge Base**
  - *Chosen*: Preload 6 realistic, practical telecom questions in both Khmer and English:
    1. **SIM Activation**: How to set up APN on iPhone and Android upon landing in Japan.
    2. **eSIM Installation**: When and how to scan the eSIM QR code before departure.
    3. **Pocket Wi-Fi Device Return**: How to drop the prepaid Japan Post envelope into any red street postbox or airport mailbox before boarding.
    4. **Airport Pickup & Delivery**: Locations supported at Narita, Haneda, Kansai, and hotel deliveries.
    5. **Data Limits & Speed**: Explanation of unlimited 5G/4G fair usage on Docomo and SoftBank.
    6. **Customer Assistance**: How to contact 24/7 Khmer & Japanese support via Telegram and Hotline.

---

## 4. Technical Architecture & Data Strategy

### System Component & Data Flow Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                          StorageService                                │
│           (DEFAULT_FAQS + localStorage: gojapan_site_settings_v1)      │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
              ┌────────────────────┴────────────────────┐
              ▼                                         ▼
   ┌──────────────────────┐                  ┌──────────────────────┐
   │       App.tsx        │                  │    AdminDashboard    │
   │   (siteSettings)     │                  │  (Tab: 'settings')   │
   └──────────┬───────────┘                  └──────────┬───────────┘
              │                                         │
              ▼                                         ▼
   ┌──────────────────────┐                  ┌──────────────────────┐
   │      FAQSection      │                  │   FAQManagerSection  │
   │  - Category Tabs     │                  │  - Add / Edit Modal  │
   │  - Accordion Items   │                  │  - Reorder Controls  │
   │  - Bilingual Toggle  │                  │  - Delete & Save     │
   └──────────────────────┘                  └──────────────────────┘
```

### Data Models (`src/types/index.ts`)

```typescript
export type FAQCategory = 'general' | 'sim_esim' | 'pocket_wifi' | 'delivery_return' | 'payment_support';

export interface FAQItem {
  id: string;
  category: FAQCategory;
  questionKm: string;
  questionEn: string;
  answerKm: string;
  answerEn: string;
  order: number;
  isActive: boolean;
}

export interface SiteSettings {
  // Existing properties...
  faqs?: FAQItem[];
}
```

### Component Breakdown

1. **`src/components/FAQSection.tsx`**:
   - Positioned on the homepage immediately following `<section>` "Why Choose GoJapan 24hours".
   - State: `selectedCategory` ('all' or specific `FAQCategory`), `openFaqId` (string | null).
   - Category filtering bar with item count badges.
   - Accordion rows with question title, category kicker, toggle chevron (`ChevronDown`), and smoothly expanding answer text.
   - Empty state fallback if no FAQs match the selected filter.

2. **`src/components/AdminDashboard.tsx` (`adminTab === 'settings'`)**:
   - New section: **Group 6: FAQ & Customer Knowledge Base Manager**.
   - List of all FAQs with category tags, active toggle, reorder up/down buttons, edit button, and delete button.
   - Modal for Adding / Editing FAQ items with Khmer and English input fields.
   - Immediate Save button (`💾 រក្សាទុកសំណួរចម្លើយ`) plus sticky top bar integration.
   - Reset FAQs to defaults button.

3. **`src/services/storageService.ts`**:
   - Definition of `DEFAULT_FAQS: FAQItem[]`.
   - Update `getSiteSettings()` to populate `faqs` from defaults if empty.
   - Update `saveSiteSettings()` to persist updated FAQ lists and dispatch `gojapan_site_settings_updated`.

4. **Build & GitHub Pages Sync**:
   - Compile via `npm run build` to update both `dist/` and `docs/` for GitHub Pages deployment.

---

## 5. Implementation Status & Verification

- [x] **Types & Data Structures**: Added `FAQCategory`, `FAQItem`, and `faqs?: FAQItem[]` to `SiteSettings` in `src/types/index.ts`.
- [x] **Storage & Preloaded FAQs**: Added 6 realistic bilingual telecom FAQs (`DEFAULT_FAQS`) into `src/services/storageService.ts` and integrated persistence inside `getSiteSettings()`, `saveSiteSettings()`, and `resetSiteSettings()`.
- [x] **Storefront Component**: Created `src/components/FAQSection.tsx` with collapsible accordion, category filter tabs (`All`, `SIM & eSIM`, `Pocket Wi-Fi`, `Delivery & Return`, `Support`), bilingual support, and 24/7 Telegram/Hotline contact banner.
- [x] **Storefront Integration**: Rendered `<FAQSection siteSettings={siteSettings} language={language} onGoToOrder={...} />` directly below the "Why Choose Us" component in `src/App.tsx`.
- [x] **Admin Dashboard Management**: Added Group 6: FAQ & Customer Knowledge Base Manager to `src/components/AdminDashboard.tsx` with full CRUD (Add, Edit, Reorder, Delete, Show/Hide Active toggle, Category filtering, and Reset Defaults).
- [x] **Build & GitHub Pages Deployment Sync**: Executed `npm run build` successfully, producing optimized bundles in both `dist/` and `docs/`.
- [x] **Verification**: Zero TypeScript errors (`tsc --noEmit`), dev server running cleanly.
