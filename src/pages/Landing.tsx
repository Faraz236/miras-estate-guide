import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Scale, Shield, FileText, Users, Download, CheckCircle } from 'lucide-react';
import { Header } from '@/components/Header';

interface LandingProps {
  onGetStarted: () => void;
  onUseDemoData: () => void;
}

export default function Landing({ onGetStarted, onUseDemoData }: LandingProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                Plan your Islamic-aware will in 10 minutes — Illinois prototype
              </h1>
              <p className="text-lg text-muted-foreground">
                Calculate Sharia shares, detect legal conflicts, and get a prioritized Action Packet for your lawyer and scholar. Free and educational.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={onGetStarted}
                  className="text-lg px-8 py-6"
                >
                  Get started — It's free
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={onUseDemoData}
                  className="text-lg px-8 py-6"
                >
                  Use demo data
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Miras is advisory only — not a lawyer or scholar.
              </p>
            </div>
            
            <Card className="p-8 bg-card shadow-lg">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-success mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Sharia-Compliant Calculations</h3>
                    <p className="text-sm text-muted-foreground">Sunni fiqh inheritance shares with detailed explanations</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-success mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Illinois Legal Checklist</h3>
                    <p className="text-sm text-muted-foreground">State-specific requirements and conflict detection</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-success mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Action Packet PDF</h3>
                    <p className="text-sm text-muted-foreground">Downloadable guide with prioritized next steps</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Features Section */}
        <section id="how-it-works" className="bg-secondary/30 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-8">
              <Card className="p-6 text-center">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">1. Enter Family</h3>
                <p className="text-sm text-muted-foreground">Add your heirs and family structure</p>
              </Card>
              <Card className="p-6 text-center">
                <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">2. List Assets</h3>
                <p className="text-sm text-muted-foreground">Document your estate and property</p>
              </Card>
              <Card className="p-6 text-center">
                <Scale className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">3. Calculate Shares</h3>
                <p className="text-sm text-muted-foreground">Get Sharia-compliant inheritance distribution</p>
              </Card>
              <Card className="p-6 text-center">
                <Download className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">4. Download Packet</h3>
                <p className="text-sm text-muted-foreground">Receive your Action Packet and next steps</p>
              </Card>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-8">About Miras</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="text-center">
                Miras is an educational tool designed to help Muslim families in Illinois understand Islamic inheritance principles 
                and navigate estate planning requirements. We bridge traditional Sharia wisdom with modern legal requirements.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>No PII stored for hackathon demo. See full disclaimer.</p>
          <p className="mt-2">© {new Date().getFullYear()} Miras. Educational purposes only.</p>
        </div>
      </footer>
    </div>
  );
}
