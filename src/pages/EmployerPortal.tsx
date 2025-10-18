import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Eye, Check, AlertCircle } from "lucide-react";

interface ChecklistItem {
  id: string;
  label: string;
  status: "pass" | "warning";
  met: boolean;
}

const EmployerPortal = () => {
  const [showEmpathyView, setShowEmpathyView] = useState(false);
  const [emailText, setEmailText] = useState("");
  const [inclusiveMode, setInclusiveMode] = useState(false);

  // Calculate sentence lengths
  const sentences = emailText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const hasLongSentences = sentences.some(s => s.trim().split(/\s+/).length > 20);

  // Checklist items
  const checklist: ChecklistItem[] = [
    {
      id: "1",
      label: "Font is dyslexia-friendly",
      status: "pass",
      met: inclusiveMode,
    },
    {
      id: "2",
      label: "Line spacing is comfortable",
      status: "pass",
      met: inclusiveMode,
    },
    {
      id: "3",
      label: "Try shorter sentences (< 20 words)",
      status: "warning",
      met: !hasLongSentences && emailText.length > 0,
    },
    {
      id: "4",
      label: "Contrast meets readability standards",
      status: "pass",
      met: inclusiveMode,
    },
  ];

  const completionPercentage = emailText.length > 0 
    ? Math.round((checklist.filter(item => item.met).length / checklist.length) * 100)
    : 0;

  const sampleText = "Reading with dyslexia can be challenging. Letters may appear to move or swap positions. Words can blur together, making it difficult to focus on a single line. This simulation helps you understand the daily experience.";

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Employer Portal</h1>
          <p className="text-muted-foreground">Create an inclusive workplace for employees with dyslexia</p>
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

          {/* Inclusive Email Mode */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Inclusive Email Mode</h2>
              <div className="flex items-center gap-2">
                <Label htmlFor="inclusive-mode" className="text-sm">
                  🧠 Inclusive Mode
                </Label>
                <Switch
                  id="inclusive-mode"
                  checked={inclusiveMode}
                  onCheckedChange={setInclusiveMode}
                />
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Help make your emails easier for dyslexic employees to read
            </p>

            <Textarea
              placeholder="Write your email here…"
              value={emailText}
              onChange={(e) => setEmailText(e.target.value)}
              className="min-h-[200px] mb-4 transition-all duration-300"
              style={
                inclusiveMode
                  ? {
                      fontFamily: "OpenDyslexic, Arial, sans-serif",
                      lineHeight: "1.5",
                      backgroundColor: "#FFF7E6",
                      color: "#222222",
                    }
                  : {}
              }
            />

            {emailText.length > 0 && (
              <>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      Dyslexia-Friendly Score
                    </span>
                    <span className="text-sm font-semibold text-primary">
                      {completionPercentage}%
                    </span>
                  </div>
                  <Progress value={completionPercentage} className="h-2" />
                </div>

                <div className="space-y-2 mb-4">
                  {checklist.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      {item.met ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : item.status === "warning" ? (
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                      ) : (
                        <div className="h-4 w-4" />
                      )}
                      <span
                        className={
                          item.met
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }
                      >
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>

                {inclusiveMode && completionPercentage >= 75 && (
                  <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-sm text-green-800 dark:text-green-200">
                      🎉 Your email is now easier to read for dyslexic employees!
                    </p>
                  </div>
                )}
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployerPortal;
