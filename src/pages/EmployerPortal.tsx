import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Eye, Loader2, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ChecklistQuestion {
  id: string;
  question: string;
}

const EmployerPortal = () => {
  const [showEmpathyView, setShowEmpathyView] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<Array<{ action: string; impact: string }>>([]);
  const [email, setEmail] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();
  
  const questions: ChecklistQuestion[] = [
    { id: "1", question: "Have I asked employees what helps them work best in the past 6 months?" },
    { id: "2", question: "Is my language clear, simple, and free of jargon or acronyms when I talk and write?" },
    { id: "3", question: "Do I use clear formatting — like bullet points, short paragraphs, and white space — to make information easier to read?" },
    { id: "4", question: "Do I share documents in flexible formats employees can adjust (e.g., Word, Google Docs, captioned content)?" },
    { id: "5", question: "Do I share agendas and onboarding materials early so everyone can prepare?" },
    { id: "6", question: "Do we offer flexible options — such as quiet zones or flexible hours — to support focused work?" },
    { id: "7", question: "Do team leaders know how to have supportive conversations about work adjustments?" },
    { id: "8", question: "Have I asked for feedback on how easy our materials are to read and understand?" },
    { id: "9", question: "Do we set and review small accessibility goals regularly to stay committed to improvement?" },
  ];

  const [answers, setAnswers] = useState<Record<string, number>>(
    questions.reduce((acc, q) => ({ ...acc, [q.id]: 0 }), {})
  );

  const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);
  const percentageScore = Math.round((totalScore / 45) * 100);

  const handleAnswerChange = (questionId: string, value: string) => {
    const scoreMap: Record<string, number> = {
      "yes": 5,
      "working": 3,
      "not-yet": 0,
    };
    setAnswers(prev => ({ ...prev, [questionId]: scoreMap[value] }));
    setIsSubmitted(false);
  };

  const handleSubmit = async () => {
    setIsSubmitted(true);
    setIsLoading(true);
    setAiSuggestions([]);

    try {
      const { data, error } = await supabase.functions.invoke('accessibility-suggestions', {
        body: { questions, answers }
      });

      if (error) {
        console.error("Error getting suggestions:", error);
        toast({
          title: "Error",
          description: "Failed to generate personalized suggestions. Please try again.",
          variant: "destructive",
        });
      } else if (data?.suggestions) {
        setAiSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to generate personalized suggestions. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

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

          {/* Accessibility Checklist */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-2">Accessibility Checklist</h2>
            <p className="text-sm text-muted-foreground mb-6">Check this list monthly to track your progress</p>

            <div className="space-y-6">
              {questions.map((question) => (
                <div key={question.id} className="space-y-2">
                  <p className="text-sm font-medium">{question.question}</p>
                  <RadioGroup
                    value={
                      answers[question.id] === 5 
                        ? "yes" 
                        : answers[question.id] === 3 
                        ? "working" 
                        : "not-yet"
                    }
                    onValueChange={(value) => handleAnswerChange(question.id, value)}
                  >
                    <div className="grid grid-cols-3 gap-2">
                      <div className="flex items-center space-x-2 border rounded-md p-2 hover:bg-accent">
                        <RadioGroupItem value="yes" id={`${question.id}-yes`} />
                        <Label 
                          htmlFor={`${question.id}-yes`} 
                          className="text-xs cursor-pointer flex-1"
                        >
                          Yes (5 pts)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-md p-2 hover:bg-accent">
                        <RadioGroupItem value="working" id={`${question.id}-working`} />
                        <Label 
                          htmlFor={`${question.id}-working`} 
                          className="text-xs cursor-pointer flex-1"
                        >
                          Working on it (3 pts)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-md p-2 hover:bg-accent">
                        <RadioGroupItem value="not-yet" id={`${question.id}-not-yet`} />
                        <Label 
                          htmlFor={`${question.id}-not-yet`} 
                          className="text-xs cursor-pointer flex-1"
                        >
                          Not yet (0 pts)
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <Button 
                onClick={handleSubmit} 
                disabled={isLoading}
                size="lg"
                className="w-full md:w-auto"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Submit & View Score"
                )}
              </Button>
            </div>

            {isSubmitted && !isLoading && (
              <>
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      Your Accessibility Score
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      {percentageScore}%
                    </span>
                  </div>
                  <Progress value={percentageScore} className="h-3" />
                </div>

                {percentageScore >= 80 && (
                  <div className="mt-6 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-sm text-green-800 dark:text-green-200">
                      🎉 Great job! You're creating an inclusive workplace for employees with dyslexia!
                    </p>
                  </div>
                )}

                {aiSuggestions.length > 0 && (
                  <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <h3 className="font-semibold mb-3">
                      Top 3 Things You Can Do Today:
                    </h3>
                    <div className="space-y-3">
                      {aiSuggestions.map((suggestion, index) => (
                        <div key={index} className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </span>
                          <div>
                            <p className="text-sm font-medium">
                              {suggestion.action}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {suggestion.impact}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
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
