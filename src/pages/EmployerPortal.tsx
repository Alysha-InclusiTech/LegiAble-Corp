import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, Eye } from "lucide-react";

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  checked: boolean;
}

const EmployerPortal = () => {
  const [showEmpathyView, setShowEmpathyView] = useState(false);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    {
      id: "1",
      title: "Offer dyslexia-friendly fonts",
      description: "Provide OpenDyslexic or other accessible fonts in documents and software",
      checked: false,
    },
    {
      id: "2",
      title: "Use high-contrast colors",
      description: "Ensure text stands out clearly from backgrounds with proper contrast ratios",
      checked: false,
    },
    {
      id: "3",
      title: "Provide reading aids",
      description: "Implement reading rulers, text-to-speech, and adjustable line spacing",
      checked: false,
    },
    {
      id: "4",
      title: "Allow flexible formatting",
      description: "Let employees customize text size, spacing, and background colors",
      checked: false,
    },
    {
      id: "5",
      title: "Offer training materials",
      description: "Provide accessibility training for all staff members",
      checked: false,
    },
    {
      id: "6",
      title: "Create quiet workspaces",
      description: "Reduce distractions and provide focused work environments",
      checked: false,
    },
  ]);

  const toggleItem = (id: string) => {
    setChecklist(prev =>
      prev.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const completionPercentage = Math.round(
    (checklist.filter(item => item.checked).length / checklist.length) * 100
  );

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
                      filter: 'blur(0.8px)',
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
                            filter: Math.random() > 0.85 ? 'blur(1px)' : 'none',
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

          {/* Accessibility Checklist */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Accessibility Checklist</h2>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Progress</span>
                <span className="text-sm font-semibold text-primary">{completionPercentage}%</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </div>

            <div className="space-y-4">
              {checklist.map((item) => (
                <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <Checkbox
                    id={item.id}
                    checked={item.checked}
                    onCheckedChange={() => toggleItem(item.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={item.id} className="cursor-pointer font-medium">
                        {item.title}
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">{item.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployerPortal;
