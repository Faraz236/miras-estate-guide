import { Scale } from 'lucide-react';
import { Button } from './ui/button';

interface HeaderProps {
  onWipeData?: () => void;
}

export function Header({ onWipeData }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Scale className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-semibold text-foreground">Miras</h1>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            About
          </a>
          <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            How it works
          </a>
          <a href="#resources" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Resources
          </a>
          {onWipeData && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onWipeData}
              className="text-destructive hover:text-destructive"
            >
              End Session
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
