import { Scale } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Logo and info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              <span className="font-display text-xl font-semibold text-foreground">Miras</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Plan your Islamic-aware will in 10 minutes
            </p>
            <p className="text-sm text-muted-foreground">
              Created by Ahmed Faraz & Yazaan Shaikh
            </p>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              <Link to="/resources" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Resources
              </Link>
              <Link to="/faqs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                FAQs
              </Link>
              <Link to="/disclaimer" target="_blank" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Disclaimer
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Contact</h3>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <a href="https://miras.com" className="hover:text-foreground transition-colors">
                www.miras.com
              </a>
              <a href="mailto:support@miras.com" className="hover:text-foreground transition-colors">
                support@miras.com
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>No PII stored for hackathon demo. See full disclaimer.</p>
          <p className="mt-2">© {new Date().getFullYear()} Miras. Educational purposes only.</p>
        </div>
      </div>
    </footer>
  );
}
