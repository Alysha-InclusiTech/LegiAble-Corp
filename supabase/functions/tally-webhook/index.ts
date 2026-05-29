// Tally webhook: scores The Inclusion Check, picks top 3 tips, saves + emails result.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type Tip = { notYet: string; workingOn: string };

// Match each question by a lowercased keyword that appears in the Tally field label.
const QUESTIONS: { key: string; match: string; label: string; tips: Tip }[] = [
  {
    key: "q1", match: "what helps them work best",
    label: "Asked employees what helps them work best",
    tips: {
      notYet: "Book a 15-minute 1-on-1 with an employee this week. Ask: 'What's one thing I could change about how we communicate that would help you work better?'",
      workingOn: "After your next 1-on-1, write down one thing you'll change and share it back with that employee.",
    },
  },
  {
    key: "q2", match: "acted on at least one piece of accessibility feedback",
    label: "Acted on accessibility feedback",
    tips: {
      notYet: "Take 15 minutes to create a document where you can log any accessibility feedback you receive from now on.",
      workingOn: "Take one piece of feedback from your log and write down the specific change you'll make and who's responsible.",
    },
  },
  {
    key: "q3", match: "clear, simple, and free of jargon",
    label: "Clear, jargon-free language",
    tips: {
      notYet: "Pick your last internal email and highlight every word that only makes sense if you already work there. That's your jargon list.",
      workingOn: "Before sending your next three internal messages, paste them into Hemingway App to check the readability score.",
    },
  },
  {
    key: "q4", match: "short summary for internal messages",
    label: "Summary for long internal messages",
    tips: {
      notYet: "Before you send your next internal message, check if it is more than 3 paragraphs — if it is, add at least a 3-bullet-point summary.",
      workingOn: "For your next internal message, create the summary section before you start writing the main sections.",
    },
  },
  {
    key: "q5", match: "formatting",
    label: "Readable formatting",
    tips: {
      notYet: "Open your last company-wide document and review the formatting. Make note of how you normally structure documents.",
      workingOn: "Open one company-wide document. Break paragraphs into 2–3 sentences max, and add white space between sections.",
    },
  },
  {
    key: "q6", match: "editable formats",
    label: "Editable document formats",
    tips: {
      notYet: "Find one document that's in PDF format and copy-paste it into a Google Doc. Make sure everyone has edit access.",
      workingOn: "Set a reminder on your calendar for the first Monday of every month that says \"Check: are all shared documents in editable format?\"",
    },
  },
  {
    key: "q7", match: "agendas at least 24 hours",
    label: "Agendas shared 24h ahead",
    tips: {
      notYet: "Send a company-wide email saying that from now on you will be sharing meeting agendas 24 hours in advance.",
      workingOn: "Schedule a recurring 10-minute calendar block every Friday to draft agendas for the following week's meetings.",
    },
  },
  {
    key: "q8", match: "async options",
    label: "Async options",
    tips: {
      notYet: "On your next video call, press record. Share the recording with the participants after the meeting has concluded.",
      workingOn: "Run the video transcription through a summarizer to produce a written summary of the meeting.",
    },
  },
  {
    key: "q9", match: "flexible options",
    label: "Flexible / quiet work options",
    tips: {
      notYet: "Walk around your office and identify two places that can be turned into a quiet zone.",
      workingOn: "Email the company stating that the area you identified is the quiet zone and that everyone is welcome to use that space.",
    },
  },
  {
    key: "q10", match: "one clear place where tasks",
    label: "One source of truth for tasks/info",
    tips: {
      notYet: "Do an internal audit and tally where the majority of information lives. Send a company-wide email noting where information will now be stored.",
      workingOn: "Delegate the migration process to one central hub. Every time a new document is created, link it to its new home.",
    },
  },
  {
    key: "q11", match: "adjustment/accommodation policy",
    label: "Shared accommodation policy",
    tips: {
      notYet: "Look up your company's HR policy on workplace adjustments. If you can't find it in 5 minutes, neither can your team.",
      workingOn: "Schedule a 1-on-1 with HR to review your accommodation policy and identify one gap to address.",
    },
  },
  {
    key: "q12", match: "small accessibility goals",
    label: "Reviewing accessibility goals",
    tips: {
      notYet: "Accessibility goals should be specific, measurable, attainable and timely. Use this framework to write 1 accessibility goal and keep it somewhere easily visible.",
      workingOn: "At your next team meeting, share your accessibility goal out loud and ask someone to check in with you on it in two weeks.",
    },
  },
];

const MAX_SCORE = QUESTIONS.length * 5;

type AnswerKind = "yes" | "working" | "notyet" | "unknown";

function classifyAnswer(text: string): AnswerKind {
  const t = text.toLowerCase().trim();
  if (t.startsWith("yes")) return "yes";
  if (t.includes("working")) return "working";
  if (t.includes("not yet") || t.startsWith("no")) return "notyet";
  return "unknown";
}

function scoreFor(kind: AnswerKind): number {
  if (kind === "yes") return 5;
  if (kind === "working") return 2;
  return 0;
}

function extractEmail(fields: any[]): string | null {
  for (const f of fields) {
    if ((f.type || "").toUpperCase() === "INPUT_EMAIL" && typeof f.value === "string") return f.value;
    if (typeof f.label === "string" && f.label.toLowerCase().includes("email") && typeof f.value === "string") return f.value;
  }
  return null;
}

function getChoiceText(field: any): string {
  // Multiple-choice / dropdown: value is array of option ids; resolve via options
  if (Array.isArray(field.value) && Array.isArray(field.options)) {
    const ids = new Set(field.value);
    const picked = field.options.filter((o: any) => ids.has(o.id)).map((o: any) => o.text);
    if (picked.length) return picked.join(", ");
  }
  if (typeof field.value === "string") return field.value;
  if (Array.isArray(field.value)) return field.value.join(", ");
  return "";
}

function pickTopThree(answers: Record<string, { kind: AnswerKind; tip: Tip; label: string }>) {
  const ordered = QUESTIONS.map((q) => ({ q, a: answers[q.key] })).filter((x) => x.a);
  const notYet = ordered.filter((x) => x.a.kind === "notyet").map((x) => ({
    question: x.q.label, tip: x.q.tips.notYet, answer: "Not yet",
  }));
  const working = ordered.filter((x) => x.a.kind === "working").map((x) => ({
    question: x.q.label, tip: x.q.tips.workingOn, answer: "Working on it",
  }));

  const chosen = notYet.slice(0, 3);
  if (chosen.length < 3 && working.length) {
    // random fill from working
    const shuffled = [...working].sort(() => Math.random() - 0.5);
    while (chosen.length < 3 && shuffled.length) chosen.push(shuffled.shift()!);
  }
  return chosen;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const payload = await req.json();
    const fields: any[] = payload?.data?.fields ?? [];
    if (!Array.isArray(fields) || !fields.length) {
      return new Response(JSON.stringify({ error: "No fields in payload" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const email = extractEmail(fields);
    if (!email) {
      return new Response(JSON.stringify({ error: "No email field found" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Map each question by matching its keyword inside the Tally field label.
    const answers: Record<string, { kind: AnswerKind; tip: Tip; label: string }> = {};
    const rawAnswers: Record<string, string> = {};
    let score = 0;

    for (const q of QUESTIONS) {
      const field = fields.find(
        (f) => typeof f.label === "string" && f.label.toLowerCase().includes(q.match),
      );
      if (!field) continue;
      const choice = getChoiceText(field);
      const kind = classifyAnswer(choice);
      rawAnswers[q.key] = choice;
      answers[q.key] = { kind, tip: q.tips, label: q.label };
      score += scoreFor(kind);
    }

    const percentage = Math.round((score / MAX_SCORE) * 100);
    const suggestions = pickTopThree(answers);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: inserted, error: insertErr } = await supabase
      .from("employer_results")
      .insert({
        email,
        score,
        max_score: MAX_SCORE,
        percentage,
        answers: rawAnswers,
        suggestions,
      })
      .select("id")
      .single();

    if (insertErr) {
      console.error("DB insert error", insertErr);
      return new Response(JSON.stringify({ error: insertErr.message }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fire-and-forget the email (don't fail the webhook if email sending isn't ready yet)
    try {
      await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "inclusion-check-results",
          recipientEmail: email,
          idempotencyKey: `inclusion-${inserted.id}`,
          templateData: { score, maxScore: MAX_SCORE, percentage, suggestions },
        },
      });
    } catch (e) {
      console.warn("Email send failed (non-fatal):", e);
    }

    return new Response(JSON.stringify({ ok: true, score, percentage, suggestions }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("tally-webhook error", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
