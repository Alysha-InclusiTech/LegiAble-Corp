
## Goal

Get this Lovable project into a state where:
1. Companies can only reach the portal (`/employee`, `/employer`) after you manually flip them live following an invoice.
2. The whole thing — code + Supabase schema + edge functions + secrets — is exportable in an afternoon to your own domain and your own Supabase project.

You'll build the landing page yourself next week, so this plan does not include any landing-page design.

## What I'll build

### 1. Auth + license gate

- Add **email/password** auth (no Google, since you'll re-issue OAuth credentials on your own Supabase anyway and that's wasted work here).
- Add a `/login` page and a minimal `/account` page (just shows email + logout).
- New table `licenses`:
  - `user_id`, `company_name`, `is_active`, `plan` (`pilot` | `license`), `expires_at` (nullable), timestamps.
  - RLS: user can read their own row; only admins can insert/update.
- Helper hook `useLicense()` returns `{ active, plan, expiresAt }`.
- `<ProtectedRoute>` wrapper:
  - Not logged in → redirect to `/login`.
  - Logged in but no active license → show "Your pilot isn't active yet — we'll email you when access is enabled."
  - Active → render the page.
- Wrap `/employee` and `/employer` with it.

### 2. Admin toggle (so you can flip companies live after invoice)

- `/admin` page, gated by your existing `admin` role in `user_roles`.
- Table of all users with: email, company name, plan, active toggle, expiry date.
- One button per row to activate / deactivate. That's it — no Stripe, no checkout.

### 3. Lock down `/` so prospects don't see the portal

- Replace the current `/` (if it shows portal content) with a minimal placeholder that just says "LegiAble — pilots by invitation" and a login button.
- You'll replace this placeholder with your real landing page next week.

### 4. Export-readiness pass

Things that bite you on move day if not fixed now:

- Replace any hardcoded `lovable.app` or preview URLs with a `VITE_SITE_URL` env var (used in: Tally embed parent, OG tags, sitemap, any email body links).
- Replace hardcoded Supabase project ref in the Tally webhook URL — document where Tally needs to be repointed after the move.
- Add a `HANDOVER.md` with the exact 8-step migration runbook:
  1. Create new Supabase project, copy URL + anon key into `.env`.
  2. Run the consolidated migration (I'll generate `supabase/migrations/_export.sql` combining everything).
  3. Re-add secrets: `LOVABLE_API_KEY` (or swap to your own Gemini key — see step 7), Tally signing secret if you add one.
  4. Deploy edge functions: `tally-webhook`, `accessibility-suggestions`, `ocr-extract`.
  5. Update Tally → Integrations → Webhooks with new Supabase URL.
  6. Point your domain DNS at your new host (Vercel/Netlify/etc.).
  7. **Lovable AI Gateway won't exist off Lovable** — swap `LOVABLE_API_KEY` calls in `accessibility-suggestions` and `ocr-extract` to a direct Gemini API key. I'll add a `// EXPORT: replace with GEMINI_API_KEY` comment at each call site so it's grep-able.
  8. Create the first admin user manually via SQL, then use `/admin` to onboard pilot companies.

### 5. Security hardening (cheap to do now)

- Add `TALLY_SIGNING_SECRET` verification to the `tally-webhook` function so the public endpoint can't be spammed.
- Enable HIBP password check on auth.

## What I won't do (per your answers)

- No landing page design — you're building it.
- No Stripe / Paddle — manual invoices.
- No Google OAuth — wasted setup since you'll be on your own Supabase.
- No branded email domain on this Lovable project — set that up on your new infra.

## Files that will change

```text
src/
  pages/
    Login.tsx              (new)
    Account.tsx            (new)
    Admin.tsx              (new)
    Index.tsx              (becomes the gated placeholder)
    EmployeeReader.tsx     (wrapped in ProtectedRoute)
    EmployerPortal.tsx     (wrapped in ProtectedRoute)
  components/
    ProtectedRoute.tsx     (new)
  hooks/
    useAuth.ts             (new)
    useLicense.ts          (new)
  App.tsx                  (route additions + guards)
supabase/
  migrations/<new>.sql     (licenses table + RLS)
  functions/tally-webhook/index.ts  (add signature verification)
HANDOVER.md                (new — the export runbook)
```

## After you approve

I'll do it in one pass: migration first (you approve it), then code, then I'll print the admin-bootstrap SQL snippet so you can promote your own account to `admin` and the first pilot to `active`.
