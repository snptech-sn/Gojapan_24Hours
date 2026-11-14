# GoJapan 24hours — Firestore Security Specification (Phase 0 TDD)

## 1. Data Invariants & Access Model

1. **Zero-Trust Default Deny**: Every unmatched path is denied (`allow read, write: if false;`).
2. **Bootstrapped Verified Admin**: Admin privileges require `request.auth != null`, `request.auth.token.email == 'samnangchhoun64@gmail.com'`, AND `request.auth.token.email_verified == true`. Unverified emails or client claims are strictly rejected.
3. **Secrets & Token Isolation**:
   - `/admin_configs/telegram` stores the Telegram `botToken` and `chatId`. Only a verified Admin can `get`, `create`, `update`, or `delete` it. Unauthenticated visitors and non-admin users have ZERO read/write access.
   - `/integration_public/apps_script` stores only the non-secret Google Apps Script Web App relay URL (`webAppUrl` beginning with `https://script.google.com/macros/s/`), allowing storefront order submissions on any device to relay to Google Sheets and server-side Telegram Group notifications without exposing `botToken`. Only verified Admin can write to it; single-doc `get` is permitted for `'apps_script'` (no `list`).
4. **PII Isolation (Split Collection Strategy)**:
   - `/orders/{orderId}` stores customer PII (`customerName`, `phoneNumber`, `streetAddress`, `telegram`). Only verified Admin can `get`, `list`, `update`, or `delete` `/orders`.
   - Public storefront order submission can `create` `/orders/{orderId}` ONLY if `status == 'new'`, `syncedToGoogleSheets == false`, `createdAt == request.time`, `updatedAt == request.time`, all required fields pass strict type/size bounds, no extra ghost fields exist (`keys().hasOnly(...)`), and `/order_tracking/{orderId}` is atomically created in the same batch (`existsAfter(...)`)!
   - `/order_tracking/{orderId}` contains ZERO PII (no name, phone, Telegram handle, or street address). Only single-document `get` by exact valid `orderId` is allowed (`list` is strictly denied to prevent order scraping).
   - `/customers/{customerId}` contains PII and is strictly Admin-only for all operations.
5. **Catalog & Site Settings Integrity**:
   - `/products/{productId}` allows `get` and `list` only when `resource.data.isActive == true` (or `isBootstrappedAdmin()`), with zero `get()`/`exists()` calls inside `allow list`. Writes are strictly Admin-only with `isValidProduct`.
   - `/site_settings/default` allows single-doc `get` only (`list` denied), and writes strictly Admin-only with `isValidSiteSettings`.
6. **Immutability, Action-Based Updates & Terminal State Locking**:
   - Order `id`, `createdAt`, and `customerType` are immutable after creation.
   - Once an order reaches a terminal state (`completed` or `cancelled`), updates are locked (`existing().status != 'completed' && existing().status != 'cancelled'`) unless performed by a verified Admin (`isBootstrappedAdmin()`).
   - `createdAt` and `updatedAt` are strictly validated against `request.time`.

## 2. The "Dirty Dozen" Adversarial Payloads

| # | Attack Vector | Target Path | Malicious Payload / Context | Expected Result |
|---|---------------|-------------|-----------------------------|-----------------|
| 1 | **Bot Token Exfiltration** | `/admin_configs/telegram` | Unauthenticated or non-admin `get` on `/admin_configs/telegram` | `PERMISSION_DENIED` |
| 2 | **PII Order Scraping (`list`)** | `/orders` | Unauthenticated or non-admin `list` query on `/orders` | `PERMISSION_DENIED` |
| 3 | **Email Spoofing Admin Bypass** | `/products/prod-001` | Signed-in user with `email: "samnangchhoun64@gmail.com"` and `email_verified: false` attempts `update` | `PERMISSION_DENIED` |
| 4 | **Shadow Ghost Field Injection** | `/orders/GJ-2026-9999` | Valid new order payload + extra `"isAdminOverride": true` field | `PERMISSION_DENIED` |
| 5 | **ID Poisoning (1KB ID)** | `/orders/<150-char invalid ID>` | Document ID exceeding 128 chars or containing `$` / spaces | `PERMISSION_DENIED` |
| 6 | **State Shortcutting on Order Create** | `/orders/GJ-2026-9998` | Unauthenticated `create` setting `"status": "completed"` instead of `"new"` | `PERMISSION_DENIED` |
| 7 | **Timestamp Spoofing** | `/orders/GJ-2026-9997` | Client passes `"createdAt": "2020-01-01T00:00:00Z"` instead of `request.time` | `PERMISSION_DENIED` |
| 8 | **Type & Value Poisoning** | `/orders/GJ-2026-9996` | Valid order payload except `"totalJPY": -5000` or `"customerName"` > 120 chars | `PERMISSION_DENIED` |
| 9 | **Orphaned Order Without Tracking Projection** | `/orders/GJ-2026-9995` | Non-admin creates `/orders/GJ-2026-9995` without atomically creating `/order_tracking/GJ-2026-9995` (`existsAfter` check fails) | `PERMISSION_DENIED` |
| 10 | **Public Tracking List Scraping** | `/order_tracking` | Unauthenticated `list` query attempting to enumerate all customer orders | `PERMISSION_DENIED` |
| 11 | **Inactive Product Leakage** | `/products/prod-hidden` | Unauthenticated `get` or `list` without `isActive == true` | `PERMISSION_DENIED` |
| 12 | **Customer PII Blanket Read** | `/customers/012889977` | Non-admin signed-in user attempts `get` or `list` on `/customers` | `PERMISSION_DENIED` |
