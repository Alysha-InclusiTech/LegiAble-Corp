import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import legiableLogo from "@/assets/legiable-logo.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border/40 bg-background">
        <div className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={legiableLogo} alt="LegiAble" className="h-12 w-12" />
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">LegiAble</h1>
              <p className="text-xs text-muted-foreground font-medium tracking-wide">BY INCLUSITECH</p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/login">Sign in</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 flex items-center">
        <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold">Making inclusion practical and human</h2>
          <p className="text-xl text-muted-foreground">
            LegiAble is currently in private pilot with selected organisations. Get in touch to license the
            Employee Reader and Employer Toolkit for your team.
          </p>
          <div className="flex gap-3 justify-center pt-4">
            <Button asChild size="lg">
              <a href="mailto:hello@legiable.com?subject=LegiAble%20pilot%20enquiry">Request pilot access</a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/login">Sign in</Link>
            </Button>
          </div>
        </div>
      </main>

      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          © 2025 InclusiTech. Building accessible solutions for everyone.
        </div>
      </footer>
    </div>
  );
};

export default Index;
