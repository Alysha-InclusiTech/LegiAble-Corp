import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Briefcase, Eye, Glasses } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
              <Glasses className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">LegiAble</h1>
              <p className="text-xs text-muted-foreground">by InclusiTech</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        {/* Hero Content */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Accessible Reading for Everyone
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Empowering employees with dyslexia and educating employers about inclusive workplace design
          </p>
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
                Access our reader tool with dyslexia-friendly fonts, reading rulers, and OCR text extraction
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 mb-6 text-left">
                <li className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-accent" />
                  OpenDyslexic font rendering
                </li>
                <li className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-accent" />
                  Interactive reading ruler
                </li>
                <li className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-accent" />
                  OCR text extraction
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
                  Accessibility checklist
                </li>
                <li className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-accent" />
                  Empathy preview mode
                </li>
                <li className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-accent" />
                  Best practices guide
                </li>
              </ul>
              <Button variant="secondary" className="w-full" size="lg">
                Explore Portal
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
