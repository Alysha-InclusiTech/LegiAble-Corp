import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BookOpen, Briefcase, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import legiableLogo from "@/assets/legiable-logo.png";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    reason: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('waitlist')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            reason: formData.reason,
          }
        ]);

      if (error) throw error;

      toast({
        title: "Thank you for joining!",
        description: "We'll be in touch soon.",
      });
      setOpen(false);
      setFormData({ name: "", email: "", reason: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="border-b border-border/40 bg-background">
        <div className="max-w-6xl mx-auto px-4 py-5">
          <div className="flex items-center gap-2">
            <div className="h-12 w-12 rounded-md flex items-center justify-center">
              <img src={legiableLogo} alt="LegiAble Logo" className="h-12 w-12" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">LegiAble</h1>
              <p className="text-xs text-muted-foreground font-medium tracking-wide">BY INCLUSITECH</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        {/* Hero Content */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Making Inclusion Practical and Human
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            Empowering employees with dyslexia and educating employers about inclusive workplace design
          </p>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="mt-2 h-14 px-10 text-lg font-semibold">
                Join Waitlist
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Join Our Waitlist</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Which best describes you?</Label>
                  <RadioGroup
                    value={formData.reason}
                    onValueChange={(value) => setFormData({ ...formData, reason: value })}
                    required
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dyslexia" id="dyslexia" />
                      <Label htmlFor="dyslexia" className="font-normal cursor-pointer">
                        I have dyslexia
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="workplace" id="workplace" />
                      <Label htmlFor="workplace" className="font-normal cursor-pointer">
                        I want to make my workplaces more inclusive
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="schools" id="schools" />
                      <Label htmlFor="schools" className="font-normal cursor-pointer">
                        I want to see this in schools/universities
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Two-Path Selection */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Employee Path */}
          <Card 
            className="p-8 hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={() => navigate("/employee")}
          >
            <div className="flex flex-col items-center text-center">
              <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <BookOpen className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">I'm an Employee</h3>
              <p className="text-muted-foreground mb-6">
                Upload images with text using OCR technology to convert to dyslexic-friendly fonts with a reading ruler to aid employees with dyslexia or ADHD
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 mb-6 text-left">
                <li className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-accent" />
                  OCR text extraction
                </li>
                <li className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-accent" />
                  OpenDyslexic font rendering
                </li>
                <li className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-accent" />
                  Interactive reading ruler
                </li>
              </ul>
              <Button className="w-full" size="lg">
                Open Reader
              </Button>
            </div>
          </Card>

          {/* Employer Path */}
          <Card 
            className="p-8 hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={() => navigate("/employer")}
          >
            <div className="flex flex-col items-center text-center">
              <div className="h-20 w-20 bg-secondary/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-secondary/20 transition-colors">
                <Briefcase className="h-10 w-10 text-secondary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">I'm an Employer</h3>
              <p className="text-muted-foreground mb-6">
                Learn how to create an inclusive workplace with our accessibility checklist and empathy tools
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 mb-6 text-left">
                <li className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-accent" />
                  Empathy preview mode
                </li>
                <li className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-accent" />
                  Accessibility checklist
                </li>
                <li className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-accent" />
                  Best practices guide
                </li>
              </ul>
              <Button variant="secondary" className="w-full" size="lg">
                Explore Toolkit
              </Button>
            </div>
          </Card>
        </div>

        {/* Info Section */}
        <div className="mt-20 text-center max-w-3xl mx-auto">
          <h3 className="text-2xl font-semibold mb-4">About Dyslexia in the Workplace</h3>
          <p className="text-muted-foreground leading-relaxed">
            Dyslexia affects approximately 10-15% of the population, yet many workplaces lack proper 
            accommodations. LegiAble bridges this gap by providing accessible reading tools for employees 
            and educational resources for employers to create truly inclusive environments.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>© 2025 InclusiTech. Building accessible solutions for everyone.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
