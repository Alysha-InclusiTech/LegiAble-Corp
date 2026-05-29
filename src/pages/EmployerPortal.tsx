import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, CheckCircle2 } from "lucide-react";

const EmployerPortal = () => {
  const [showEmpathyView, setShowEmpathyView] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const existing = document.querySelector<HTMLScriptElement>('script[src="https://tally.so/widgets/embed.js"]');
    if (!existing) {
      const script = document.createElement("script");
      script.src = "https://tally.so/widgets/embed.js";
      script.async = true;
      document.body.appendChild(script);
    } else {
      // @ts-ignore
      window.Tally?.loadEmbeds?.();
    }

    const onMessage = (e: MessageEvent) => {
      if (typeof e.data === "string" && e.data.includes("Tally.FormSubmitted")) {
        setSubmitted(true);
      } else if (e.data?.event === "Tally.FormSubmitted") {
        setSubmitted(true);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const sampleText = "Reading with dyslexia can be challenging. Letters may appear to move or swap positions. Words can blur together, making it difficult to focus on a single line. This simulation helps you understand the daily experience.";

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Employer Toolkit</h1>
          <p className="text-muted-foreground">Understand how accessibility feels, assess your materials, and start improving inclusion right now.</p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Empathy Preview */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Empathy Preview</h2>
              <Button
                variant={showEmpathyView ? "secondary" : "default"}
                onClick={() => setShowEmpathyView(!showEmpathyView)}
                size="sm"
              >
                <Eye className="h-4 w-4 mr-2" />
                {showEmpathyView ? "Normal View" : "Simulate Dyslexia"}
              </Button>
            </div>

            <div className="bg-reader-bg rounded-lg p-6 min-h-[400px]">
              <p className="text-sm text-muted-foreground mb-4">
                Experience how text might appear to someone with dyslexia
              </p>
              
              {!showEmpathyView ? (
                <div className="space-y-4">
                  <p className="text-lg leading-relaxed">
                    {sampleText}
                  </p>
                  <div className="mt-6 p-4 bg-card rounded-lg border border-border">
                    <h3 className="font-semibold mb-2">Common Challenges:</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Letter reversal (b/d, p/q)</li>
                      <li>• Word jumbling and letter swapping</li>
                      <li>• Difficulty tracking lines of text</li>
                      <li>• Visual stress from high contrast or small fonts</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="relative max-w-md">
                  <p 
                    className="text-base"
                    style={{
                      lineHeight: '2.5',
                    }}
                  >
                    {sampleText.split('').map((char, i) => {
                      const shouldShift = Math.random() > 0.5;
                      const shouldReverse = Math.random() > 0.75;
                      const shouldFade = Math.random() > 0.6;
                      const shouldRotate = Math.random() > 0.6;
                      
                      let displayChar = char;
                      if (shouldReverse && char !== ' ') {
                        const reversals: { [key: string]: string } = {
                          'b': 'd', 'd': 'b', 'p': 'q', 'q': 'p',
                          'n': 'u', 'u': 'n', 'a': 'e', 'e': 'a',
                          'w': 'm', 'm': 'w', 'h': 'n', 'g': 'q',
                          'i': 'l', 'l': 'i', 'o': 'c', 'c': 'o',
                          's': 'z', 'z': 's', 'f': 't', 't': 'f'
                        };
                        displayChar = reversals[char.toLowerCase()] || char;
                      }
                      
                      const xShift = Math.random() * 16 - 8;
                      const yShift = Math.random() * 20 - 10;
                      const rotation = shouldRotate ? Math.random() * 30 - 15 : 0;
                      const opacity = shouldFade ? Math.random() * 0.5 + 0.3 : (Math.random() > 0.85 ? 0.5 : 1);
                      const spacing = char === ' ' ? `${Math.random() * 1.5}em` : `${Math.random() * 0.5}em`;
                      
                      return (
                        <span
                          key={i}
                          style={{
                            display: 'inline-block',
                            transform: shouldShift 
                              ? `translate(${xShift}px, ${yShift}px) rotate(${rotation}deg)` 
                              : `rotate(${rotation}deg)`,
                            opacity: opacity,
                            marginLeft: spacing,
                          }}
                        >
                          {displayChar}
                        </span>
                      );
                    })}
                  </p>
                  <div className="mt-6 p-4 bg-secondary/10 border border-secondary rounded-lg">
                    <p className="text-sm">
                      <strong>Note:</strong> This is a dyslexic simulation. The actual experience varies greatly between individuals and can include additional challenges beyond visual distortion.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* The Inclusion Check */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">The Inclusion Check</h2>

            <iframe
              data-tally-src="https://tally.so/embed/0Q1GzB?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
              loading="lazy"
              width="100%"
              height="600"
              frameBorder={0}
              title="Accessibility Checklist"
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployerPortal;
