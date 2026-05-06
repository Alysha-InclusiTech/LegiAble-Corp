## Goal

After the user clicks "Submit & View Score" on the Employer Accessibility Checklist, hide the score, progress bar, success message, and AI suggestions from the page. Instead, show only an email capture form. Once they submit their email, confirm their results have been sent — without ever displaying the score on screen.

## Changes

**1. Employer Portal (`src/pages/EmployerPortal.tsx`)**

After submit, instead of showing:
- Accessibility score percentage + progress bar
- "Great job!" green banner (80%+)
- "Top 3 Things You Can Do Today" AI suggestions list

Show a single email capture card:
- Headline: "Get your accessibility results"
- Short copy: "Enter your email and we'll send your score plus your top 3 personalized improvements."
- Email input + "Send My Results" button (required field)
- AI suggestions are still generated in the background and saved with the submission, but never rendered

After email submission:
- Replace the form with a confirmation: "✓ Your results are on their way to {email}."
- Score, suggestions, and progress bar remain hidden

**2. Database (`employer_results` table)**

Already exists with `email`, `score`, `answers`. Add an `ai_suggestions` JSONB column so the suggestions get saved alongside the score for future email delivery.

## Out of scope (ask after)

- Actually sending the email. Right now the data is saved to the backend; results are not yet emailed. If you want real email delivery, that's a follow-up step (would set up email infrastructure on your domain).

## Technical notes

- Remove the `Progress` import and the `{isSubmitted && !isLoading && (...)}` block that renders score/suggestions.
- Keep `handleSubmit` calling the AI suggestions function so we capture them in state, then include them in the `employer_results` insert payload.
- Keep the loading spinner on the submit button while AI suggestions are being generated, so the email form only appears once everything is ready to be saved.
