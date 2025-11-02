import { Scale } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onWipeData?: () => void;
}

export function Header({ onWipeData }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <Scale className="h-7 w-7 text-primary transition-transform group-hover:scale-110" />
          <h1 className="font-display text-3xl font-bold text-foreground">Miras</h1>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/#about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            About
          </Link>
          <Link to="/#how-it-works" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            How it works
          </Link>
          <Link to="/resources" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Resources
          </Link>
          <Link to="/faqs" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            FAQs
          </Link>
          {onWipeData && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onWipeData}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              End Session
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
