# GoJapan 24hours - Japanese ISP Services & E-Commerce Platform

A production-grade web application in Khmer and English for **GoJapan 24hours**, showcasing Japanese high-speed internet packages, pocket Wi-Fi, eSIMs, and network hardware with full customer/agent ordering, live order tracking, an authenticated Admin Dashboard, and automated Google Sheets integration via Google Apps Script Web App API.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The user confirmed the following key architectural and domain decisions:
> - **Product Focus**: Internet Service Provider (ISP) & Telecom hardware: Pocket Wi-Fi, 5G/LTE SIMs & eSIMs, Fiber Optic Home/Office Plans (1Gbps/10Gbps NTT/SoftBank lines), High-Speed Routers, and 24/7 Multilingual Support.
> - **Currency Display**: Japanese Yen exclusively (¥ / JPY) with formatted tabular figures (`tabular-nums`).
> - **Google Sheets Integration Strategy**: Pre-configured with copy-ready Google Apps Script (`Code.gs`) generator, step-by-step setup walkthrough, interactive connection tester, and resilient local sync buffering so the app works immediately out of the box and seamlessly streams orders directly into Google Sheets once deployed.
> - **Language**: Khmer (ភាសាខ្មែរ) as primary default with seamless English (EN) toggle.

---

## 1. Overview & Core Concept

**GoJapan 24hours** delivers a streamlined digital ordering and service management platform for Cambodians and international travelers/expats needing reliable Japanese telecom services (travel pocket Wi-Fi, long-term fiber subscriptions, high-speed SIMs, and enterprise network routers) with 24/7 customer care.

### Target Personas
1. **Individual Customers**: Travelers, students, and expatriates ordering Pocket Wi-Fi, travel eSIMs, or home fiber connections with delivery across Cambodia or pickup in Japan.
2. **Sales Agents & Partners**: Registered agents placing bulk orders or client referrals with dedicated Agent IDs, commission tracking, and specialized partner pricing.
3. **Business Administrators**: Store managers and operations teams managing inventory, tracking orders across fulfillment stages, exporting CSV/Excel reports, and synchronizing with Google Sheets.

---

## 2. User Experience & Visual Design

### Key User Flows

```
┌────────────────────────────────────────────────────────────────────────┐
│                        GoJapan 24hours Navigation                      │
├─────────────────┬──────────────────┬─────────────────┬─────────────────┤
│ Catalog & Plans │  Order Form      │  Track Order    │ Admin Portal    │
│ (Pocket WiFi,   │  (Customer/Agent,│  (Status, Line  │ (Auth, Orders,  │
│ SIMs, Fiber)    │   Address, JPY)  │   Items, Notes) │  Products, Sync)│
└────────┬────────┴────────┬─────────┴────────┬────────┴────────┬────────┘
         ▼                 ▼                  ▼                 ▼
   Card Details ──► Add to Order Basket ──► Confirmation ──► Google Sheets
```

1. **Catalog Showcase (ទំព័រដើម / Catalog)**:
   - Hero campaign with key value propositions (High-speed Docomo/SoftBank networks, 24/7 technical support in Khmer & Japanese).
   - Category filtering (Pocket Wi-Fi, Travel SIM & eSIM, Fiber Internet Plans, Routers & Network Accessories).
   - Clean product cards with SKU, JPY pricing, carrier network badges, technical specs (Speed, Data allowance, Rental vs Purchase), and quick "Order Now" action.
2. **Order Placement Form (ទម្រង់បែបបទកម្មង់ទំនិញ)**:
   - Customer vs. Agent switcher (with optional Agent ID / Partner Code).
   - Auto-generated Order ID (e.g., `GJ-2026-9482`).
   - Customer information: Name, Phone, optional Telegram contact (`@username` or phone link for 1-click confirmation).
   - Full Cambodia address hierarchy: Province/City (ខេត្ត/ក្រុង), District/Khan (ស្រុក/ខណ្ឌ), Commune/Sangkat (ឃុំ/សង្កាត់), Village (ភូមិ), and Street/Home details.
   - Multi-item order table with quantity steppers, item subtotal, shipping fee calculation, order remarks, and final JPY total.
   - Instant success modal with receipt breakdown, printable invoice view, and direct Telegram notification link.
3. **Order Status Tracking (តាមដានស្ថានភាពការកម្មង់)**:
   - Quick lookup by Order ID and Phone Number.
   - Visual progress timeline: `New` ➔ `Confirmed` ➔ `Processing` ➔ `Shipping` ➔ `Completed` (or `Cancelled`).
4. **Admin Dashboard (ផ្ទាំងគ្រប់គ្រង Admin)**:
   - Secure login modal (default: `admin` / `gojapan2026` with live session security).
   - Real-time statistics: Total Products, Total Orders, Pending / Processing / Completed orders, Total Revenue in ¥, Customers & Agents count.
   - **Product Management**: Add new packages/hardware, edit specs, upload/set image URLs, set SKU, price in JPY, and toggle visibility.
   - **Order Management**: Search, filter by date/status/type, inspect items, change fulfillment status, and export to CSV/Excel.
   - **Google Sheets Settings & Live Sync**: Test Web App API connection, view sync status, copy full `Code.gs` script, and inspect sheet schema.

### Visual Identity & Theme
- **Aesthetic**: Modern Japanese Minimalist Telecom (inspired by clean Tokyo aesthetics, Docomo, SoftBank, and NTT).
- **Color Palette**:
  - Dominant Neutral: Crisp White (`#FFFFFF`) and Soft Slate (`#F8FAFC` / `#0F172A`).
  - Primary Brand Accent: Japanese Crimson (`#DC2626` / `#E60012`) honoring the Japanese flag motif.
  - Secondary Accents: Deep Indigo / Navy (`#1E293B`) for technical authority and Emerald (`#16A34A`) for active operational indicators.
- **Typography**: `Plus Jakarta Sans` for clean Latin headers, combined with clean modern Khmer typography (`Kantumruy Pro`, `Siemreap`) and tabular numbers (`tabular-nums`) for currency and order counts.
- **Zero-Pill Restraint**: Metadata rendered with clean unboxed text (`·`, `/`) instead of loud pill clusters.

---

## 3. Key Product Decisions & Trade-Offs

| Decision | Chosen Approach | Rationale | Alternatives Considered |
|---|---|---|---|
| **Google Sheets Protocol** | Google Apps Script Web App API (`doPost` / `doGet`) + In-app script generator | Matches the user's explicit specification without requiring client secrets; gives user 100% control over their spreadsheet. | Direct Google Sheets API via OAuth (requires Google Cloud project & service account setup). |
| **Data Resiliency & Buffer** | Hybrid Architecture (Local Storage Buffer + Direct Web App Dispatch) | Ensures zero data loss: if user hasn't yet pasted their Web App URL, orders are safely stored in browser storage and can be batch-synced or exported anytime. | LocalStorage only (violates user requirement) or Web App only (fails if URL isn't configured yet). |
| **Currency Strategy** | Pure Japanese Yen (`¥` / `JPY`) with thousand separators | Strictly conforms to the user's clarifying answer. | Dual USD/KHR toggle (declined by user). |
| **Language Architecture** | Khmer first (ភាសាខ្មែរ) with fast English (EN) toggle | Ensures complete localization as requested while maintaining accessibility for international partners. | Khmer only (hard to audit for non-Khmer speakers). |

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             GoJapan 24hours Frontend                        │
├─────────────────────┬────────────────────┬──────────────────────────────────┤
│ Customer Storefront │ Order Placement &  │ Admin Dashboard                  │
│ • Catalog & Specs   │   Tracking Engine  │ • Stats, Product CRUD            │
│ • ISP Packages      │ • Address Cascades │ • Order Processing & CSV Export  │
│ • Multi-item Cart   │ • Receipt Generator│ • Google Sheets Sync Console     │
└──────────┬──────────┴─────────┬──────────┴────────────────┬─────────────────┘
           │                    │                           │
           ▼                    ▼                           ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Unified Data Sync Engine                           │
│  - Local Store & State Orchestration                                        │
│  - Apps Script Payload Formatter (CORS-friendly JSON/FormData)              │
│  - Error Handling & Connection Verifier                                     │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼ HTTP POST/GET
┌─────────────────────────────────────────────────────────────────────────────┐
│                     Google Sheets via Google Apps Script                    │
│                                                                             │
│  Sheet 1: [Orders]      (OrderID, CustomerType, Name, Phone, Total, Status) │
│  Sheet 2: [Order_Items] (OrderID, SKU, ProductName, Qty, UnitPrice, Total)  │
│  Sheet 3: [Products]    (SKU, Name, Category, PriceJPY, Speed, StockStatus)│
│  Sheet 4: [Customers]   (Phone, Name, Type, Telegram, Address, OrdersCount) │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data Schema Specification

#### 1. Sheet `Orders`
- `Order_ID`, `Created_At`, `Customer_Type` (Customer/Agent), `Customer_Name`, `Phone_Number`, `Telegram`, `Province_City`, `District_Khan`, `Commune_Sangkat`, `Village`, `Street_Address`, `Subtotal_JPY`, `Shipping_JPY`, `Total_JPY`, `Status` (New, Confirmed, Processing, Shipping, Completed, Cancelled), `Remarks`

#### 2. Sheet `Order_Items`
- `Order_ID`, `Item_Index`, `Product_ID`, `Product_Code_SKU`, `Product_Name`, `Category`, `Unit_Price_JPY`, `Quantity`, `Subtotal_JPY`

#### 3. Sheet `Products`
- `Product_ID`, `SKU`, `Name_KM`, `Name_EN`, `Category`, `Price_JPY`, `Speed_Quota`, `Carrier_Network`, `Description_KM`, `Description_EN`, `Image_URL`, `Is_Active`

#### 4. Sheet `Customers`
- `Phone_Number`, `Customer_Name`, `Customer_Type`, `Telegram`, `Province_City`, `Total_Orders`, `Total_Spent_JPY`, `Last_Order_Date`

---

## 5. Step-by-Step Implementation Strategy

1. **Data Model & Initial Catalog**:
   - Create types and realistic Japanese ISP catalog (Pocket Wi-Fi 5G Unlimited, Travel SIM 30-Day 50GB, eSIM Data Pass, Hikari NTT 1Gbps Fiber Home Plan, SoftBank Air 5G Home Router, Mobile Dual-Band WiFi 6 Router).
   - Implement Cambodian Administrative Divisions dataset (Phnom Penh, Siem Reap, Battambang, Sihanoukville, Kampong Cham, Kandal, etc. with district/commune options).
2. **Google Apps Script Code Generator & Sync Module**:
   - Ready-to-deploy `Code.gs` script covering all 4 sheets (`Orders`, `Order_Items`, `Products`, `Customers`) with automated sheet creation, header column initialization, `doPost` order ingestion, and `doGet` sync.
   - Interactive configuration modal with connection test ping, step-by-step setup guide with screenshots/steps in Khmer and English.
3. **Storefront & Product Catalog**:
   - Modern hero section with Japanese telecommunication imagery and quick action buttons.
   - Search bar and category filters.
   - Rich product cards with high-speed specs, carrier badges, and JPY pricing.
4. **Order Cart & Checkout Form**:
   - Multi-item selector with live quantity calculation.
   - Customer vs. Agent toggle (with commission/discount preview).
   - Detailed delivery address inputs (Province, District, Commune, Village, Street).
   - Order confirmation modal with printable invoice and Telegram dispatch preview.
5. **Order Tracking View**:
   - Search by Order ID and Phone Number.
   - Real-time status badge and fulfillment timeline.
6. **Admin Dashboard**:
   - Secure login gate.
   - Live analytics cards (Revenue in ¥, Orders count, Product count, Agent breakdown).
   - Product Management: Add, edit, remove, toggle status.
   - Order Management: Status transition workflow, search, filter, CSV/Excel export.
   - Google Sheets Sync Console: Test connection, trigger manual push/pull, view logs.
7. **Verification & Testing**:
   - Run `compile_applet` to ensure TypeScript compilation without errors.
   - Test end-to-end order flow, local persistence, status updates, and Apps Script payload generation.
