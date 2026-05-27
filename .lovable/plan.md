## Goal

Every public page reachable under both:
- `earworm.co/...` - existing British version (unchanged)
- `earworm.co/us/...` - American mirror (USD pricing, US spelling)

One set of React components powers both. No duplicate page files. Future content edits flow to both versions automatically.

---

## 1. Locale wrapper

**Routing.** Wrap the existing `<Routes>` block once with a `/us` prefix duplicate. Same component tree, different prefix:

```text
/                      → <Index />
/pricing               → <PricingTiers />
/blog/:slug            → <BlogPostPage />
...
/us                    → <Index />
/us/pricing            → <PricingTiers />
/us/blog/:slug         → <BlogPostPage />
...
```

Admin, `/lovable/*`, `/thank-you`, and form-action pages stay UK-only.

**Locale context.** A `LocaleProvider` reads the URL prefix and exposes:
- `locale: 'en-GB' | 'en-US'`
- `currency: 'GBP' | 'USD'`
- `t(key)` - lookup function for translated strings
- `localizePath(path)` - prepends `/us` when in US locale, used by every internal `Link` / `useNavigate` call so users stay in-locale when clicking around.

**Navbar / Footer / CTAs.** A region switcher in the navbar (UK 🇬🇧 / US 🇺🇸) toggles between the equivalent page on the other locale.

---

## 2. American copy - AI generated, DB cached

A new `page_translations` table stores the en-US version of every string keyed by `(locale, page_path, string_key)`. The AI translation runs once per page and is cached. Future tweaks are editable in `/admin`.

**Translation extraction.** Each page wraps user-visible copy in `t('hero.headline', 'Stop chasing reach. Start owning category.')`. The British original is the default fallback; the US version overrides when present.

**Generation pipeline.** A new admin tool ("Translate to US English") in `/admin/translations`:
1. Lists every translatable key per page
2. Sends them in batches to a new `translate-to-us` edge function (Lovable AI Gateway, `google/gemini-2.5-flash`)
3. The model is prompted to: convert British → American spelling, swap idioms ("whilst" → "while", "have a chat" → "hop on a call"), preserve brand voice (sharp Gen Z, no Oxford commas, no em dashes, spaced hyphens), leave proper nouns and product names alone
4. Results land in `page_translations` with `status='pending_review'`
5. Admin can edit inline and mark `approved=true` before they go live

Blog post bodies (long-form markdown in `blog_posts.content`) get the same treatment but stored on a parallel `blog_posts_us` table (or `content_us` column on the existing table) so editors can review each post.

---

## 3. USD pricing - converted and rounded

**The existing `PricingTiers` page already has a USD toggle but renders it inside one page.** Refactor so US locale **forces** USD with no toggle, and the raw GBP figures are run through:

```text
priceUSD = round( priceGBP * FX_RATE / 1000 ) * 1000
```

`FX_RATE` lives in a single config file (`src/lib/fx.ts`) so it can be updated quarterly with one edit. Existing manually-set USD figures in `PricingTiers.tsx` get removed; everything derives from the GBP source of truth + the rate. The "from £x,xxx" copy in `Careers`, `PipelineBoard`, and `landing/PipelineBoard` flows through the same `formatPrice(gbp, locale)` helper.

Cents/sub-thousand values (e.g. £19,500 → $24,765 → $25,000) round to the nearest thousand. Anything under £1,000 rounds to the nearest $50 to avoid awkward $0 results.

---

## 4. SEO - full hreflang

For every public page, both versions get:

```html
<link rel="alternate" hreflang="en-GB" href="https://earworm.co/pricing" />
<link rel="alternate" hreflang="en-US" href="https://earworm.co/us/pricing" />
<link rel="alternate" hreflang="x-default" href="https://earworm.co/pricing" />
<link rel="canonical" href="https://earworm.co/us/pricing" />  <!-- self-canonical -->
```

Implemented via `react-helmet-async` in a single `<LocaleSEO />` component used by every page wrapper, plus the existing `useMetaTags` hook extended to pull from `page_metadata` rows that have `locale='en-US'` variants.

**Sitemap.** `scripts/generate-sitemap.ts` extended to emit both UK and US URLs with `<xhtml:link rel="alternate">` annotations on each entry.

**Edge OG renderer.** The Cloudflare worker already injects `<meta property="og:*">` from the `page_metadata` table - extend the table with a nullable `locale` column so `/us/*` paths fetch the en-US row when present.

---

## 5. Forms, integrations, analytics

- **Lead capture** (`send-demo-request`): add `locale` field to every payload, surfaces in Slack notification and in Pipedrive (as a Lead label `US` or `UK`)
- **Cal.com**: keep the same booking flow; the form passes `locale` in metadata so the team sees which version the lead came from
- **Google Ads conversions**: keep current setup, but tag US conversions with a label so US/UK ROI can be split
- **Page view tracking**: `page_views.page_path` already captures full path, so `/us/pricing` vs `/pricing` separates naturally in the dashboard

---

## 6. Build phases

```text
Phase 1  Foundation (no visible US site yet)
         · Add LocaleProvider, localizePath, t() helper
         · Create page_translations table + admin manager
         · Refactor pricing to derive USD from GBP via fx.ts
         · Replace all internal <Link to="/x"> with localized equivalents

Phase 2  Translate
         · Run extraction across every public page, store British defaults in DB
         · Run translate-to-us edge function over the catalogue
         · Admin review pass (you / team approve copy)

Phase 3  Ship /us routes
         · Mount mirrored routes under /us
         · Add region switcher to navbar
         · Add hreflang + extend sitemap + extend OG worker

Phase 4  Polish
         · Translate published blog posts on demand
         · Lead capture locale tagging
         · QA every /us page in browser, fix any layout/copy issues
```

Recommend shipping Phase 1 and Phase 2 in one pass (since the US site won't be live until phase 3 anyway), then approve copy, then ship phases 3 and 4 together so the launch is clean.

---

## Out of scope (call out explicitly)

- **Currency on Cal.com booking page** - Cal.com pricing UI not editable from this codebase
- **PDF Content Playbook** in US edition - kept as-is unless you want a US-translated PDF too (extra build)
- **Localized timezones** in case studies / "available now" copy - UK time stays everywhere unless you ask
- **Domain-level geo redirect** (auto-send US visitors to `/us`) - intentionally not included; visitors choose via the switcher to avoid Google ranking confusion

---

## Technical notes (for the engineering pass)

- `react-helmet-async` is not currently installed - will add it
- `useMetaTags` hook + `page_metadata` table get a `locale` column (nullable, defaults to NULL = applies to both)
- `LocaleProvider` lives above `<Routes>` but inside `<BrowserRouter>` so it can read `useLocation`
- Every internal `<Link>`, `useNavigate`, and anchor href across ~30 components needs a one-line update to use `localizePath` - mechanical but unavoidable
- AI translation is one-shot per string; no streaming, no rate-limit concerns at our scale
- Blog post markdown translation preserves frontmatter and image URLs literally