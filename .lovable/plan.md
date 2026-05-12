## Goal

Use answers from the embedded Tally form ("The Inclusion Check") to:
1. Calculate a total Inclusion Score (Yes=5, Working on it=2, Not yet=0, max 45 → %)
2. Match each answer to a suggestion from a table you'll provide
3. Save score, answers, suggestions, and email to the database

## Architecture

```text
User fills Tally form ──► Tally webhook ──► Edge Function ──► employer_results table
                                              │
                                              ├─ compute score (5/2/0)
                                              └─ look up suggestions in static map
```

## Steps

### 1. Provide the suggestions table
Send me a table in this shape (one row per question + answer):

| Question ID / text | Answer (Yes / Working / Not yet) | Suggestion text |
|---|---|---|
| Q1 — Asked employees... | Not yet | "Send a 3-question pulse survey today..." |
| Q1 — Asked employees... | Working on it | "..." |
| ... | ... | ... |

Easiest: 9 questions × 3 answers = up to 27 suggestions. You can leave "Yes" rows blank — those won't generate a suggestion.

### 2. Tally form setup (you do this once)
- In your Tally form, make sure each question's answer options are exactly: **Yes**, **Working on it**, **Not yet** (so we can map them reliably)
- Add an **Email** field at the end of the form
- After I deploy the webhook, I'll give you a URL to paste into Tally → Integrations → Webhooks

### 3. Database change
Add a `suggestions` (jsonb) column to `employer_results` so we store the matched suggestions per submission. Existing `score`, `answers`, `email`, `ai_suggestions` columns stay.

### 4. New edge function: `tally-webhook`
- Public (no JWT), receives Tally's POST payload
- Maps each question's answer → score (Yes=5, Working=2, Not yet=0)
- Computes total + percentage (out of 45)
- Looks up suggestions from the static table I'll embed in the function
- Inserts a row into `employer_results` with email, score, answers, suggestions

### 5. Frontend (`/employer`)
- Keep the Tally embed as-is for the form
- Replace the old AI-suggestion path
- After Tally submission, show a "Thanks — your results have been emailed" confirmation (Tally fires a `Tally.FormSubmitted` postMessage we can listen to)
- Optional: add an admin-only results view later

### 6. Score display
Two options — pick one:
- **A.** Don't show the score on the page; only email it (current direction)
- **B.** After submission, fetch the latest result for that email and display the score + matched suggestions on the page

## Open question for you

Once you send the suggestions table and confirm the answer labels in Tally, I'll wire it all up. Also let me know A or B for the score display.
