## Goal

When someone submits the Tally "Inclusion Check", we score their answers, pick the 3 most relevant tips, save it, and email it.

## Flow

```text
Tally form ─► tally-webhook edge function ─┬─► compute score (Yes=5, Working=2, Not yet=0)
                                            ├─► pick top 3 tips
                                            ├─► save to employer_results
                                            └─► send email with score + 3 tips
```

## Tip selection rule (your choice)

1. Collect every question answered **Not yet** in question order (Q1 → Q9).
2. If fewer than 3, fill the remaining slots with **Working on it** tips picked **at random** from the remaining questions.
3. **Yes** answers never generate a tip.
4. Cap at 3.

So if someone answers Not yet to Q2, Q5, Q7, Q8 → they get the Q2, Q5, Q7 tips (first three in order). If they answer Not yet to only Q5 and Working on it to Q1, Q3, Q9 → they get the Q5 tip plus 2 random tips from {Q1, Q3, Q9}.

## What I need from you

**1. The suggestions table** — paste in chat in this exact shape:

```
Q# | Question short label | Answer (Not yet) tip | Working on it tip
1  | Asked employees about needs | "Send a 3-question pulse survey today using..." | "Add one more question this week..."
2  | ... | ... | ...
...
9  | ... | ... | ...
```

You can leave any cell blank — blanks are skipped.

**2. Tally field IDs** — once your form is final, I'll need the question→field mapping from a test webhook payload. I can fetch it after you wire the webhook URL, or you can paste one sample Tally POST and I'll map it.

**3. Email** — confirm: send from the existing email setup, subject "Your Inclusion Check results", body = score (e.g. "28 / 45 — 62%") + the 3 tips as a bulleted list. Yes or change?

## What I'll build (once you send the table)

1. **DB migration**: add `suggestions jsonb` and `percentage int` columns to `employer_results`.
2. **Edge function `tally-webhook`** (public, no JWT):
   - Parses Tally payload
   - Maps each answer to score 5/2/0
   - Computes total + percentage
   - Runs the tip-selection rule above against the embedded suggestions table
   - Inserts row into `employer_results`
   - Sends email to the submitter
3. **Frontend `/employer`**: keep the Tally embed; listen for `Tally.FormSubmitted` postMessage and show a "Check your inbox" confirmation.
4. **Give you the webhook URL** to paste into Tally → Integrations → Webhooks.

Send the suggestions table and I'll build it in one pass.
