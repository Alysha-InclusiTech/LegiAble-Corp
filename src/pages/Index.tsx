import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import legiableLogo from "@/assets/legiable-logo.png";

const pilotSteps = [
  {
    week: "Weeks 1–4",
    title: "12-Question Inclusion Check",
    description: "Each week, up to 5 managers complete a short 12-question check covering communication, workload, and accessibility practices in their team.",
  },
  {
    week: "Every week",
    title: "3 Personalised Actions",
    description: "Based on their answers, each manager receives 3 simple, actionable steps tailored to their team — no jargon, no lengthy reports.",
  },
  {
    week: "Up to 5 managers",
    title: "Team-Wide Coverage",
    description: "The pilot supports up to 5 managers per organisation, giving you a broad picture of where inclusion is strong and where to focus.",
  },
  {
    week: "Day 30",
    title: "Your Inclusion Report",
    description: "At the end of the 30-day pilot you receive a full report — scores, trends, and a prioritised roadmap for your next steps.",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={legiableLogo} alt="LegiAble" className="h-10 w-10" />
            <div>
              <span className="text-xl font-semibold tracking-tight text-gray-900">LegiAble</span>
              <p className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">by InclusiTech</p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm" className="rounded-full border-gray-300 text-gray-700 hover:bg-gray-50">
            <Link to="/login">Sign in</Link>
          </Button>
        </div>
      </header>

      <section className="flex flex-col items-center justify-center text-center px-6 py-24">
        <span className="inline-block mb-6 text-xs font-semibold tracking-widest uppercase text-gray-400 border border-gray-200 rounded-full px-4 py-1.5">
          Private pilot — limited places
        </span>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight max-w-3xl">
          Making inclusion<br />practical and human
        </h1>
        <p className="mt-6 text-lg text-gray-500 max-w-xl">
          LegiAble helps managers take one small, meaningful step toward accessibility every week — no training days, no consultants.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg" className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-8">
            <a href="mailto:hello@legiable.com?subject=LegiAble%20pilot%20enquiry">Request pilot access →</a>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full px-8 border-gray-300 text-gray-700 hover:bg-gray-50">
            <Link to="/login">Sign in</Link>
          </Button>
        </div>
        <p className="mt-4 text-xs text-gray-400">No commitment. We'll be in touch within 2 business days.</p>
      </section>

      <section className="bg-gray-50 border-t border-gray-100 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900">How the 30-day pilot works</h2>
            <p className="mt-3 text-gray-500 max-w-lg mx-auto">
              Four weeks. Five managers. One clear picture of where your organisation stands on inclusion.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pilotSteps.map((step, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-3 shadow-sm">
                <span className="text-xs font-semibold tracking-widest uppercase text-gray-400">{step.week}</span>
                <div className="text-3xl font-bold text-gray-900 leading-none">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="font-semibold text-gray-900">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to start your pilot?</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">Get in touch and we'll set up your organisation within 48 hours.</p>
        <Button asChild size="lg" className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-8">
          <a href="mailto:hello@legiable.com?subject=LegiAble%20pilot%20enquiry">Get in touch →</a>
        </Button>
      </section>

      <footer className="border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-8 text-center text-sm text-gray-400">
          © 2026 InclusiTech. Building accessible solutions for everyone.
        </div>
      </footer>
    </div>
  );
};

export default Index;
