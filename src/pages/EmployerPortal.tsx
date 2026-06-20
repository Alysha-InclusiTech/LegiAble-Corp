import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";

type Answer = "not-yet" | "working-on-it" | "yes" | null;

const questions: {
  id: number;
  text: string;
  tips: { "not-yet": string; "working-on-it": string };
}[] = [
  {
    id: 1,
    text: "Have you asked employees what helps them work best in the last 6 months?",
    tips: {
      "not-yet":
        "Book a 15-minute 1-on-1 with an employee this week. Ask: 'What's one thing I could change about how we communicate that would help you work better?'",
      "working-on-it":
        "After your next 1-on-1, write down one thing you'll change and share it back with that employee.",
    },
  },
  {
    id: 2,
    text: "Have you acted on at least one piece of accessibility feedback you have received?",
    tips: {
      "not-yet":
        "Take 15 minutes to create a document where you can write any accessibility feedback you receive from now on.",
      "working-on-it":
        "Take one piece of feedback from your log and write down the specific change you'll make and who's responsible.",
    },
  },
  {
    id: 3,
    text: "Is your language clear, simple, and free of jargon or acronyms?",
    tips: {
      "not-yet":
        "Pick your last internal email and highlight every word that only makes sense if you already work there. That's your jargon list.",
      "working-on-it":
        "Before sending your next three internal messages, paste them into Hemingway App to check the readability score.",
    },
  },
  {
    id: 4,
    text: "Do you include a short summary for internal messages longer than 3 paragraphs?",
    tips: {
      "not-yet":
        "Before you send your next internal message, check if it's more than 3 paragraphs — if it is, add at least a 3 bullet point summary.",
      "working-on-it":
        "For your next internal message, create the summary section before you start writing the main sections.",
    },
  },
  {
    id: 5,
    text: "Do you use formatting (bullet points, short paragraphs, white space) to make documents easier to read?",
    tips: {
      "not-yet":
        "Open your last company-wide document and take a look at the formatting. Make note of how you normally structure documents.",
      "working-on-it":
        "Open one company-wide document. Break paragraphs into 2–3 sentences max, and add white space between sections.",
    },
  },
  {
    id: 6,
    text: "Do you share documents in editable formats employees can adjust (Word or Google Docs)?",
    tips: {
      "not-yet":
        "Find one document in PDF format and copy it into Google Docs. Make sure that everyone has edit access.",
      "working-on-it":
        "Set a reminder on your calendar for the first Monday of every month: 'Check — are all shared documents in editable format?'",
    },
  },
  {
    id: 7,
    text: "Do you share agendas at least 24 hours before meetings?",
    tips: {
      "not-yet":
        "Send a company-wide email saying that from now on you will be sharing the meeting agenda 24 hours in advance.",
      "working-on-it":
        "Schedule a recurring 10-minute calendar block every Friday to draft agendas for the following week's meetings.",
    },
  },
  {
    id: 8,
    text: "Do you offer async options (recorded updates, written summaries) so people can contribute at their best?",
    tips: {
      "not-yet":
        "On your next video call, press record and share the recording with participants after the meeting has concluded.",
      "working-on-it":
        "Input the video transcription into a summariser to receive a written summary of the meeting to share with the team.",
    },
  },
  {
    id: 9,
    text: "Do you offer flexible options (quiet zones or flexible hours) to support focused work?",
    tips: {
      "not-yet":
        "Walk around your office and identify two places that could be changed to a quiet zone.",
      "working-on-it":
        "Email the company stating that the area you identified is the quiet zone and that everyone is welcome to use that space.",
    },
  },
  {
    id: 10,
    text: "Does your team have one clear place where tasks and information live, rather than scattered across email and chat?",
    tips: {
      "not-yet":
        "Do an internal audit and tally where the majority of information lives. Send a company-wide email to note where information will now be stored.",
      "working-on-it":
        "Delegate the migration process to one central hub. Every time a new document is created, link it to its new home.",
    },
  },
  {
    id: 11,
    text: "Have you shared your company's adjustment/accommodation policy with your team?",
    tips: {
      "not-yet":
        "Look up your company's HR policy on workplace adjustments. If you can't find it in 5 minutes, neither can your team.",
      "working-on-it":
        "Schedule a 1-on-1 with HR to review your accommodation policy and identify one gap to address.",
    },
  },
  {
    id: 12,
    text: "Do you set and review small accessibility goals regularly?",
    tips: {
      "not-yet":
        "Accessibility goals should be specific, measurable, attainable and timely. Use this framework to write 1 accessibility goal somewhere easily accessible.",
      "working-on-it":
        "At your next team meeting, share your accessibility goal out loud and ask someone to check in with you on it in two weeks.",
    },
  },
];

const sampleText =
  "Reading with dyslexia can be challenging. Letters may appear to move or swap positions. Words can blur together, making it difficult to focus on a single line.";

export default function EmployerPortal() {
  const [showEmpathyView, setShowEmpathyView] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>(Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [tips, setTips] = useState<string[]>([]);

  const handleAnswer = (value: Answer) => {
    const updated = [...answers];
    updated[currentQ] = value;
    setAnswers(updated);
  };

  const handleSubmit = () => {
    const scoreMap: Record<string, number> = { yes: 3, "working-on-it": 2, "not-yet": 0 };
    const total = answers.reduce((sum, a) => sum + (a ? scoreMap[a] : 0), 0);
    const max = questions.length * 3;
    setScore(Math.round((total / max) * 100));

    const notYetTips = answers
      .map((a, i) => (a === "not-yet" ? questions[i].tips["not-yet"] : null))
      .filter(Boolean) as string[];
    const workingTips = answers
      .map((a, i) => (a === "working-on-it" ? questions[i].tips["working-on-it"] : null))
      .filter(Boolean) as string[];

    setTips([...notYetTips, ...workingTips].slice(0, 3));
    setSubmitted(true);
  };

  const progress = ((currentQ + 1) / questions.length) * 100;
  const canProceed = answers[currentQ] !== null;
  const isLast = currentQ === questions.length - 1;

  const optionStyle = (value: Answer) =>
    `w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
      answers[currentQ] === value
        ? "bg-gray-900 text-white border-gray-900"
        : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
    }`;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Employer Toolkit</h1>
          <p className="text-gray-500">
            Understand how accessibility feels, assess your materials, and start improving inclusion right now.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Empathy Preview */}
          <Card className="p-6 bg-white border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Empathy Preview</h2>
              <Button
                variant="outline"
                onClick={() => setShowEmpathyView(!showEmpathyView)}
                size="sm"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full"
              >
                <Eye className="h-4 w-4 mr-2" />
                {showEmpathyView ? "Normal view" : "Simulate dyslexia"}
              </Button>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 min-h-[400px]">
              {!showEmpathyView ? (
                <div className="space-y-4">
                  <p className="text-base leading-relaxed text-gray-700">{sampleText}</p>
                  <div className="mt-6 p-4 bg-white rounded-xl border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm">Common challenges:</h3>
                    <ul className="space-y-1.5 text-sm text-gray-500">
                      <li>• Letter reversal (b/d, p/q)</li>
                      <li>• Word jumbling and letter swapping</li>
                      <li>• Difficulty tracking lines of text</li>
                      <li>• Visual stress from high contrast or small fonts</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-base" style={{ lineHeight: "2.5" }}>
                    {sampleText.split("").map((char, i) => {
                      const shouldShift = Math.random() > 0.5;
                      const shouldReverse = Math.random() > 0.75;
                      const shouldFade = Math.random() > 0.6;
                      const shouldRotate = Math.random() > 0.6;
                      let displayChar = char;
                      if (shouldReverse && char !== " ") {
                        const reversals: Record<string, string> = {
                          b: "d", d: "b", p: "q", q: "p", n: "u", u: "n",
                          a: "e", e: "a", w: "m", m: "w", h: "n", i: "l", l: "i",
                        };
                        displayChar = reversals[char.toLowerCase()] || char;
                      }
                      return (
                        <span
                          key={i}
                          style={{
                            display: "inline-block",
                            transform: shouldShift
                              ? `translate(${Math.random() * 16 - 8}px, ${Math.random() * 20 - 10}px) rotate(${shouldRotate ? Math.random() * 30 - 15 : 0}deg)`
                              : `rotate(${shouldRotate ? Math.random() * 30 - 15 : 0}deg)`,
                            opacity: shouldFade ? Math.random() * 0.5 + 0.3 : 1,
                            marginLeft: char === " " ? `${Math.random() * 1.5}em` : `${Math.random() * 0.5}em`,
                          }}
                        >
                          {displayChar}
                        </span>
                      );
                    })}
                  </p>
                  <p className="text-xs text-gray-400 mt-6">
                    This is a simulation. Real experiences vary greatly between individuals.
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Inclusion Check */}
          <Card className="p-6 bg-white border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">The Inclusion Check</h2>

            {submitted ? (
              <div className="flex flex-col items-center justify-center text-center py-8 px-2 space-y-5">
                <CheckCircle2 className="h-10 w-10 text-gray-900" />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Your score</p>
                  <p className="text-6xl font-bold text-gray-900">{score}</p>
                  <p className="text-gray-400 text-sm mt-1">out of 100</p>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-gray-900 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${score}%` }}
                  />
                </div>
                {tips.length > 0 ? (
                  <div className="w-full text-left space-y-3">
                    <p className="text-sm font-semibold text-gray-900">Your actions for this week:</p>
                    {tips.map((tip, i) => (
                      <div key={i} className="flex gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <span className="text-xs font-bold text-gray-400 mt-0.5 shrink-0">{i + 1}</span>
                        <p className="text-sm text-gray-700 leading-relaxed">{tip}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    Excellent — you're already doing everything on the list. Keep it up!
                  </p>
                )}
                <Button
                  onClick={() => {
                    setSubmitted(false);
                    setCurrentQ(0);
                    setAnswers(Array(questions.length).fill(null));
                  }}
                  variant="outline"
                  className="rounded-full border-gray-300 text-gray-700 w-full"
                >
                  Retake check
                </Button>
              </div>
            ) : (
              <div className="space-y-6 mt-4">
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-2">
                    <span>Question {currentQ + 1} of {questions.length}</span>
                    <span>{Math.round(progress)}% complete</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className="bg-gray-900 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <p className="text-base font-medium text-gray-900 leading-relaxed min-h-[60px]">
                  {questions[currentQ].text}
                </p>

                <div className="space-y-2">
                  <button className={optionStyle("yes")} onClick={() => handleAnswer("yes")}>
                    Yes
                  </button>
                  <button className={optionStyle("working-on-it")} onClick={() => handleAnswer("working-on-it")}>
                    Working on it
                  </button>
                  <button className={optionStyle("not-yet")} onClick={() => handleAnswer("not-yet")}>
                    Not yet
                  </button>
                </div>

                <div className="flex justify-between pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentQ((q) => q - 1)}
                    disabled={currentQ === 0}
                    className="rounded-full border-gray-300 text-gray-700"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" /> Back
                  </Button>
                  {isLast ? (
                    <Button
                      onClick={handleSubmit}
                      disabled={!canProceed}
                      className="rounded-full bg-gray-900 hover:bg-gray-800 text-white px-6"
                    >
                      See my results
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setCurrentQ((q) => q + 1)}
                      disabled={!canProceed}
                      className="rounded-full bg-gray-900 hover:bg-gray-800 text-white"
                    >
                      Next <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
