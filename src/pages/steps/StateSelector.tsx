import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';

interface StateSelectorProps {
  selectedState: string;
  onStateChange: (state: string) => void;
  onNext: () => void;
}

export default function StateSelector({ selectedState, onStateChange, onNext }: StateSelectorProps) {
  const [showWarning, setShowWarning] = useState(false);

  const handleStateChange = (value: string) => {
    if (value !== 'IL') {
      setShowWarning(true);
    }
    onStateChange(value);
  };

  const handleContinue = () => {
    if (selectedState !== 'IL' && !showWarning) {
      setShowWarning(true);
      return;
    }
    onNext();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <MapPin className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-2xl font-semibold">Where do you live?</h2>
            <p className="text-sm text-muted-foreground">This determines which legal checklists we provide</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="state-select" className="text-base">Select your state (required)</Label>
            <Select value={selectedState} onValueChange={handleStateChange}>
              <SelectTrigger id="state-select" className="w-full">
                <SelectValue placeholder="Select state..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IL">Illinois (recommended)</SelectItem>
                <SelectItem value="CA" disabled>California (coming soon)</SelectItem>
                <SelectItem value="NY" disabled>New York (coming soon)</SelectItem>
                <SelectItem value="TX" disabled>Texas (coming soon)</SelectItem>
                <SelectItem value="FL" disabled>Florida (coming soon)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedState === 'IL' && (
            <div className="rounded-lg bg-green-600 p-4 shadow-md">
              <p className="text-sm text-success-foreground">
                ✓ Illinois selected. You'll receive Illinois-specific legal checklists and requirements.
              </p>
            </div>
          )}

          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              <strong>Why Illinois?</strong> This prototype provides Illinois-specific legal checklists including witness requirements, 
              holographic will rules, and spousal elective share provisions. For other states, we compute Sharia shares but won't provide legal checklists.
            </p>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleContinue} size="lg" className="flex-1">
              Continue
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="lg">
                  Learn more
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Why Illinois?</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 text-sm">
                  <p>This prototype focuses on Illinois for several reasons:</p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Illinois has specific estate law requirements including witness rules and spousal rights</li>
                    <li>Clear statutes on holographic wills (not valid in IL)</li>
                    <li>Well-defined elective share provisions for surviving spouses</li>
                    <li>Representative of many common law states for estate planning</li>
                  </ul>
                  <p className="text-muted-foreground">
                    Future versions will support additional states with their specific requirements.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Card>

      <Dialog open={showWarning && selectedState !== 'IL'} onOpenChange={setShowWarning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Non-Illinois State Selected
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm">
              You've selected a state other than Illinois. Miras will calculate Sharia inheritance shares, 
              but <strong>legal checklists will not be available</strong> for your state.
            </p>
            <p className="text-sm text-muted-foreground">
              You'll still receive the Sharia calculation and can use this for educational purposes.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => { onStateChange('IL'); setShowWarning(false); }} className="flex-1">
              Switch to Illinois
            </Button>
            <Button onClick={() => { setShowWarning(false); onNext(); }} className="flex-1">
              Proceed anyway
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
