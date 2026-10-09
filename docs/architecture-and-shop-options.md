# Ball & Stick: architecture review and additions

Reviewed 8 October 2026. This is a source-code audit; production database schema, RLS policies, Auth configuration and payment accounts were not accessible for verification.

## Current architecture

```text
Vite-built React SPA (Vercel SPA rewrite)
  ├─ Public routes: Home, About, What We Do, Projects, Events, Schools,
  │                Stories, Gallery, People, Partners, Get Involved, Contact
  ├─ /admin: Supabase login + dashboard + content editors + settings
  ├─ src/lib/api.ts → Supabase PostgREST → PostgreSQL content tables
  ├─ Supabase Auth → session lifecycle and admin route guard
  ├─ Supabase Storage → public bs-images bucket
  └─ Contact form → EmailJS HTTP API
```

There is no Express, Nest, Django, Next.js server, custom API server, payment backend or Supabase Edge Function checked in. Supabase provides the backend. The browser uses its public project URL and anonymous key; access control must be enforced by database and Storage policies.

| Layer | Repository dependencies / behavior |
| --- | --- |
| UI | React 19, React DOM 19, TypeScript 6 |
| Build | Vite 8 and React plugin; static build in dist |
| Styling | Tailwind CSS 4, custom CSS, Lucide icons |
| Routing | React Router 7; pathname-keyed page transitions |
| Animation | Framer Motion 13, Lenis 1 smooth scrolling, react-type-animation |
| Data and sessions | supabase-js 2; useState/useEffect and React Context |
| Content | bs_events, bs_gallery, bs_gallery_images, bs_stories, bs_partners, bs_people, bs_projects, bs_settings |
| Media | bs-images uploads; image URLs stored on content records; JSON settings hold page images |
| Asset utilities | Jimp, Potrace, opentype.js and Python scripts for logo/font processing |
| Quality tooling | TypeScript build and ESLint; no pre-existing automated test suite |
| Hosting | vercel.json routes requests to index.html; no SSR or prerendering configured |

Versions above describe package.json major versions, not an assertion that these are the latest releases.

## Algorithms and data flow

- CRUD calls select whole tables, generally ordered by created_at descending; collection images are filtered by collection_id and ordered ascending. No pagination or shared query cache.
- Public pages use linear array filtering for categories and publication flags. Featured items use find with a first-item fallback. These are O(n) passes, appropriate for a small content site, not recommendation or ranking algorithms.
- Schools now uses case-insensitive substring matching over CMS school partners, replacing 12 invented demo entries and their fictional region/level metadata.
- Lenis uses exponential easing with a requestAnimationFrame loop. That loop is not cancelled during cleanup in the existing implementation; revisiting public/admin surfaces can retain a callback loop.
- Framer Motion drives viewport reveals and route transitions. Home uses timed carousel/text effects. Preloader playback is remembered in sessionStorage.
- Admin sessions use Supabase Auth and a 30-minute browser activity timeout. The route guard checks whether a session exists.
- Contact validates required fields, email format and message length in the browser before submitting to EmailJS.

## Material findings before commerce

1. **Admin authorization needs backend verification.** AdminContext assigns SUPER_ADMIN to every authenticated session, regardless of server-side role. This label is not authorization. Production RLS may protect data, but policies are absent from this checkout, so that protection cannot be established here. Shop access must use server-controlled claims or an admin membership table enforced in RLS/functions, never editable user metadata.
2. **No database baseline was checked in.** The new migration extends existing bs_partners; it does not recreate the whole application database or change existing permissions. Export/version the existing schema, RLS and Storage policies before commerce work.
3. **Draft visibility needs review.** Stories filters published rows in the browser after fetching. RLS must prevent anonymous reads of drafts if they are confidential.
4. **Failure handling is inconsistent.** Some pages can remain in a loading state after API errors. Partners and Schools now have explicit error/loading handling; other pages need a separate pass.
5. **Types are loose.** API mutations use any; generated Supabase database types would make schema changes safer.
6. **Performance/SEO:** public and admin routes are eagerly imported; current build emits roughly 805 kB JS (216 kB gzip). Lazy loading routes is a straightforward next improvement. No server-rendered SEO content is configured.
7. **Configuration:** EmailJS falls back to placeholder service/template IDs. Production configuration should be verified. Storage upload naming currently uses Math.random and does not validate file size/type in the client; bucket restrictions must enforce accepted uploads.
8. **Baseline lint:** 36 errors and 2 warnings before changes, unchanged after this work. These include existing any types, hook issues and unused variables. Build passes.

## Implemented additions

### Event flyer

Native HTML dialog, with no new dependency. Admin Settings includes flyer upload, title, link, enable switch and start/expiry times in UTC (Ghana time). Data is stored as event_promotion inside the existing bs_settings.data JSON object; image uploads reuse bs-images.

The dialog waits until the opening preloader is gone, appears once per session for a given campaign, traps focus through showModal, supports Escape and close-button dismissal, restores focus, constrains image size for mobile, blocks body overflow while open, and closes when expired. It never renders on admin routes. Local paths and HTTPS links are accepted. An enabled campaign requires a future expiry and a start before expiry. The supplied NextGen Hockey Festival flyer is now the default active promotion: 24 October 2026, Tema International School, strictly by invitation. It expires at 00:00 UTC on 25 October. Existing saved campaign settings take precedence. Desktop opens after 15 seconds and minimises into a header button; mobile shows a floating button after 15 seconds without automatically opening the flyer.

### Partners and sponsors

bs_partners gains a category column: partner, school, sponsor. Existing rows default to partner. Admin Partners provides a category selector and the same logo upload/edit/delete flow for all categories. The public Partners page renders three separate sections. The Schools page reads the same school records.

The migration seeds all 15 requested schools and Verna/Choco with duplicate-name protection. Fourteen school logos were downloaded from official school sites and checked visually. Source URLs are recorded in partner-logo-sources.json. Akosombo's official site returned 404 during retrieval; its record uses initials pending an approved crest. Verna and Choco currently use initials; Choco's exact brand is awaiting clarification. Missing or broken logos fall back to initials without hiding the school name. Downloaded logos are local static assets, not runtime hotlinks.

## Shop options

A payment button is only checkout: product variants, stock, carts, shipping, orders, fulfilment and refunds still need a commerce system.

| Option | Paystack | Admin and fit | Tradeoff |
| --- | --- | --- | --- |
| WooCommerce | Established Paystack plugin; Ghana supported | Ready product, stock and order admin in WordPress; link from current admin | Fast practical prebuilt store, but introduces WordPress/PHP and a separate admin. Can live on a shop subdomain; headless integration needs more work. |
| Shopify | Paystack provides a documented Shopify integration | Hosted store and Shopify admin | Low operations burden; separate admin, recurring subscription and applicable third-party gateway fees. Confirm current Ghana plan/gateway terms. |
| Medusa | Paystack lists an integration; validate provider compatibility with chosen Medusa version | Headless Node commerce with its own admin; React storefront can match B&S | More infrastructure and implementation work. Integration existence does not guarantee compatibility with the current Medusa major version. |
| Paystack Storefront | Native Paystack commerce | Products managed in Paystack dashboard | Fastest small-catalog pilot; external hosted shopping experience and less control over site/admin integration. |
| React + Supabase + Paystack | Direct Paystack integration | Extend this exact /admin with products, stock and orders | Best fit for one integrated admin, but a custom commerce build rather than a ready-made shop module. |

**Initial recommendation (superseded by the user’s selection of Paystack Storefront):** choose WooCommerce if a ready-made shop is the priority and a separate store admin is acceptable. If products/orders must be managed inside the current B&S admin, retain React/Supabase and implement a small dedicated shop, using Paystack's checkout rather than implementing payment collection yourself. Medusa is worth evaluating for a larger catalog or more complex fulfilment; it is not the lowest-effort choice here.

For a custom shop, add products, variants/SKUs, inventory reservations, orders, immutable order-item snapshots and payment-events tables. Server-side functions must calculate totals from trusted product records, initialize Paystack in GHS, protect secret keys, validate webhook signatures, verify reference/amount/currency/status, and finalize payments and stock atomically with idempotency. A client success callback must not mark an order paid. Plan for asynchronous Mobile Money, abandoned checkout reservations, duplicate webhooks, shipping/pickup, refunds and fulfilment status. Anonymous users must not read other customers' orders.

The user selected Paystack Storefront. A /shop landing page, navigation entry and /admin/shop configuration page are implemented. Admin can save the public https://paystack.shop/... URL in bs_settings.data.shop_url and open the Paystack dashboard for products/orders. The user supplied https://paystack.shop/ball-and-stick-shop. This is now the frontend default; migration 202610080002_shop_storefront.sql sets the same URL in existing Supabase settings without replacing other settings. Apply this migration when deploying, including when a previously saved empty shop_url overrides the frontend default. No API keys or custom payment processing are used. Catalog size, size/length variants, stock handling, delivery areas/rates, pickup, refund policy and whether a separate admin is acceptable determine the next implementation.

Sources checked 8 October 2026:
- [WooCommerce Paystack documentation](https://woocommerce.com/document/paystack/)
- [Paystack Shopify setup](https://support.paystack.com/en/articles/2132226)
- [Paystack integrations](https://paystack.com/gh/integrations)
- [Paystack Commerce / Storefronts](https://paystack.com/gh/commerce)
- [Medusa payment provider interface](https://docs.medusajs.com/resources/commerce-modules/payment/payment-provider)
- [Paystack payment verification](https://paystack.com/docs/payments/verify-payments/)
- [Paystack signed webhooks](https://paystack.com/docs/payments/webhooks/)

## Deployment and verification

1. Review/apply supabase/migrations/202610080001_partner_categories.sql to the existing Supabase project using a database owner connection or the SQL editor. This has **not** been applied to the live database. This checkout has no established Supabase CLI configuration or privileged database connection.
2. Confirm existing bs_partners and bs_settings policies allow public reads and only authorized staff writes; confirm the same for bs-images uploads. The migration deliberately preserves existing policies.
3. Deploy the frontend with public/partners assets. Until the migration is applied, new school/sponsor records will not appear.
4. The supplied event is configured as the frontend default. In Admin → Settings, review or override the campaign and save if desired. Confirm it in a fresh browser session. Verify Escape, Tab focus, mobile scrolling, no repeat on navigation, and expiry.
5. Verify all categories in Admin → Partners and replace missing brand artwork when supplied.

Validation performed: TypeScript + production build passed; logo file signatures checked and raster contact sheet visually inspected; promotion timing, disabled/invalid configuration and unsafe-link checks passed; lint compared against the pre-existing baseline. Browser checks confirmed the coming-soon shop, mobile launcher, uncropped flyer, desktop header launcher, minimise and Escape/focus restoration. Live database mutations and authenticated browser CRUD were not tested.
