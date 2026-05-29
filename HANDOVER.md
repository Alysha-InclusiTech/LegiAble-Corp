# LegiAble — export & handover runbook

This document describes how to move the project off Lovable to your own
domain + your own Supabase project. Following this end-to-end should take
under an afternoon.

---

## 0. Before you start

Have these accounts ready:
- Your own Supabase project (free tier is fine to start)
- A hosting account: Vercel, Netlify, Cloudflare Pages, or similar
- A Google Cloud / Gemini API key (replaces `LOVABLE_API_KEY`)
- DNS access to your domain
- Access to your Tally account

---

## 1. Get the code

In Lovable: top-right → GitHub → **Connect to GitHub** → push to a new repo,
then `git clone` it locally.

```sh
git clone <your-new-repo-url>
cd legiable
npm install
```

---

## 2. Create the new Supabase project

1. Go to https://supabase.com → new project. Pick a region close to your users.
2. From **Project Settings → API** copy:
   - Project URL
   - `anon` public key
   - `service_role` key (keep secret — never commit)

3. Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL="https://YOUR-NEW-REF.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="YOUR-NEW-ANON-KEY"
VITE_SUPABASE_PROJECT_ID="YOUR-NEW-REF"
```

> Lovable's `src/integrations/supabase/client.ts` already reads from these
> env vars — no code change needed.

---

## 3. Apply the database schema

The `supabase/migrations/` folder contains every migration in order. Run
them against your new project:

```sh
npx supabase login
npx supabase link --project-ref YOUR-NEW-REF
npx supabase db push
```

If `supabase db push` fails because the new project has no migration
history, use the Supabase dashboard SQL editor: open each migration file in
`supabase/migrations/` in chronological order and paste/run.

After running, verify in the Supabase Table Editor that these tables exist:
- `employer_results`
- `waitlist`
- `user_roles`
- `licenses`

---

## 4. Deploy the edge functions

```sh
npx supabase functions deploy tally-webhook --no-verify-jwt
npx supabase functions deploy accessibility-suggestions
npx supabase functions deploy ocr-extract
```

`supabase/config.toml` already sets `verify_jwt = false` for
`tally-webhook` — the `--no-verify-jwt` flag is belt-and-braces.

---

## 5. Set edge function secrets

In the Supabase dashboard → **Edge Functions → Secrets**, add:

| Name | Value | Used by |
|---|---|---|
| `GEMINI_API_KEY` | from Google AI Studio | `accessibility-suggestions`, `ocr-extract` |
| `TALLY_SIGNING_SECRET` | from Tally → form → Integrations → Webhooks → Signing secret | `tally-webhook` |

> **Swap `LOVABLE_API_KEY` → `GEMINI_API_KEY`:** search the repo for
> `LOVABLE_API_KEY` — every hit is in `supabase/functions/*/index.ts`.
> Replace the env var name AND change the endpoint from
> `https://ai.gateway.lovable.dev/v1/chat/completions` (OpenAI-compatible)
> to a direct Gemini call. The Gemini docs have a 5-line example.

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are automatically injected
by Supabase into every edge function — don't add them manually.

---

## 6. Repoint Tally

1. Open your form in Tally → **Integrations → Webhooks**.
2. Replace the old webhook URL with:
   `https://YOUR-NEW-REF.supabase.co/functions/v1/tally-webhook`
3. Copy the **Signing secret** that Tally shows you and paste it into
   the `TALLY_SIGNING_SECRET` edge function secret (step 5).
4. Send a test submission. Check **Edge Function logs** in Supabase — you
   should see a successful run and a new row in `employer_results`.

---

## 7. Email (optional but recommended)

The `tally-webhook` calls `send-transactional-email` to email the user
their score. That function does not exist in the codebase yet — set up
emails on your new infrastructure:

- **Easiest:** install Resend (`npm i resend`), create an account, verify
  your sending domain, add `RESEND_API_KEY` as an edge-function secret,
  then create a `send-transactional-email` edge function that calls
  `resend.emails.send(...)`. The webhook will pick it up automatically.

---

## 8. Build & deploy the frontend

```sh
npm run build
```

Deploy `dist/` to Vercel / Netlify / Cloudflare Pages. Set the same
three `VITE_*` env vars from step 2 in the host's environment settings.

Point your domain DNS at the host (each host has a one-click guide).

---

## 9. Bootstrap your admin account

1. Sign up on your live site at `/login` with your own email.
2. In Supabase **SQL editor**, find your user id and grant admin:

```sql
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users WHERE email = 'you@yourdomain.com';
```

3. Sign in, go to `/admin`, and start creating licenses for pilot
   companies. Each company signs up at `/login` with their own email —
   send them their user id from **Cloud → Users**, then add their license
   in `/admin` and toggle it active once they've paid.

---

## What you can throw away after the move

- The Lovable project itself (no migration of data — pilots will be fresh)
- This `HANDOVER.md` file
- Anything in `.lovable/`

---

## Files to grep on move day

- `LOVABLE_API_KEY` — replace with `GEMINI_API_KEY` and a direct Gemini call
- `fnfacuzynwitczjkasfc` — old Supabase project ref, should only appear
  in `.env` and `supabase/config.toml`; update both
- `lovable.app` — any leftover preview URLs (should be none)
