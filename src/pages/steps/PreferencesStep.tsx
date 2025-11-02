import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Settings, AlertTriangle } from 'lucide-react';
import { Preferences } from '@/types/miras';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface PreferencesStepProps {
  preferences: Preferences;
  onUpdate: (preferences: Preferences) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function PreferencesStep({ preferences, onUpdate, onNext, onBack }: PreferencesStepProps) {
  const [showWasiyyahWarning, setShowWasiyyahWarning] = useState(false);
  const [confirmHighWasiyyah, setConfirmHighWasiyyah] = useState(false);
  const [showShiaModal, setShowShiaModal] = useState(false);

  const handleWasiyyahChange = (value: number[]) => {
    const percent = value[0];
    if (percent > 33.33 && !confirmHighWasiyyah) {
      setShowWasiyyahWarning(true);
    }
    onUpdate({ ...preferences, wasiyyahPercent: percent });
  };

  const handleFiqhModeChange = (value: string) => {
    if (value === 'shia') {
      setShowShiaModal(true);
    } else {
      onUpdate({ ...preferences, fiqhMode: value as 'sunni' | 'shia' });
    }
  };

  const handleShiaConfirm = () => {
    onUpdate({ ...preferences, fiqhMode: 'shia' });
    setShowShiaModal(false);
  };

  const handleNext = () => {
    if (preferences.wasiyyahPercent > 33.33 && !confirmHighWasiyyah) {
      setShowWasiyyahWarning(true);
      return;
    }
    onNext();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-2xl font-semibold">Preferences & Wasiyyah</h2>
            <p className="text-sm text-muted-foreground">Optional bequests and estate preferences</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="wasiyyah-slider" className="text-base">
                Wasiyyah (non-heir bequest)
              </Label>
              <span className="text-2xl font-semibold text-primary">
                {preferences.wasiyyahPercent.toFixed(1)}%
              </span>
            </div>
            <Slider
              id="wasiyyah-slider"
              min={0}
              max={50}
              step={0.1}
              value={[preferences.wasiyyahPercent]}
              onValueChange={handleWasiyyahChange}
              className="py-4"
            />
            <p className="text-sm text-muted-foreground">
              Wasiyyah = voluntary bequest to non-heirs. Islamic default limit: 33.33% of distributable estate.
            </p>
            {preferences.wasiyyahPercent > 33.33 && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium mb-1">Wasiyyah exceeds 33%</p>
                  <p className="text-muted-foreground">
                    Under Sunni fiqh, amounts over 33.33% may require heirs' consent.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="charity">Charity percentage or amount (optional)</Label>
            <Input
              id="charity"
              type="number"
              value={preferences.charityPercent || ''}
              onChange={(e) => onUpdate({ ...preferences, charityPercent: parseFloat(e.target.value) || 0 })}
              placeholder="0"
              min="0"
              max="100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="executor">Executor name (optional)</Label>
            <Input
              id="executor"
              value={preferences.executor}
              onChange={(e) => onUpdate({ ...preferences, executor: e.target.value })}
              placeholder="Name of executor"
            />
            <p className="text-xs text-muted-foreground">
              The person responsible for administering your estate
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="guardian">Guardian for minors (optional)</Label>
            <Input
              id="guardian"
              value={preferences.guardian}
              onChange={(e) => onUpdate({ ...preferences, guardian: e.target.value })}
              placeholder="Name of guardian"
            />
            <p className="text-xs text-muted-foreground">
              Who will care for your minor children
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fiqh-mode">Fiqh mode</Label>
            <Select value={preferences.fiqhMode} onValueChange={handleFiqhModeChange}>
              <SelectTrigger id="fiqh-mode">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sunni">Sunni (default)</SelectItem>
                <SelectItem value="shia">Shia</SelectItem>
              </SelectContent>
            </Select>
            {preferences.fiqhMode === 'shia' && (
              <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 text-sm">
                <p>Note: This prototype uses Sunni model. Shia calculations coming soon.</p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onBack} size="lg">
              Back
            </Button>
            <Button onClick={handleNext} size="lg" className="flex-1">
              Calculate Sharia Shares
            </Button>
          </div>
        </div>
      </Card>

      <Dialog open={showWasiyyahWarning} onOpenChange={setShowWasiyyahWarning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              High Wasiyyah Amount
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm">
              You have set wasiyyah to over 33.33%. Under Islamic law (Sunni fiqh), bequests to non-heirs 
              are normally limited to one-third of the estate.
            </p>
            <p className="text-sm text-muted-foreground">
              Amounts exceeding this limit may require written consent from all heirs.
            </p>
            <div className="flex items-start space-x-2">
              <Checkbox
                id="confirm-high-wasiyyah"
                checked={confirmHighWasiyyah}
                onCheckedChange={(checked) => setConfirmHighWasiyyah(checked as boolean)}
              />
              <Label htmlFor="confirm-high-wasiyyah" className="text-sm font-normal cursor-pointer">
                I understand Islamic wasiyyah normally limits bequests to 1/3 and &gt;1/3 may require heirs' consent.
              </Label>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                onUpdate({ ...preferences, wasiyyahPercent: 33.33 });
                setShowWasiyyahWarning(false);
                setConfirmHighWasiyyah(false);
              }}
              className="flex-1"
            >
              Reduce to 33%
            </Button>
            <Button
              onClick={() => setShowWasiyyahWarning(false)}
              disabled={!confirmHighWasiyyah}
              className="flex-1"
            >
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showShiaModal} onOpenChange={setShowShiaModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Shia Fiqh Mode</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm">
              Shia inheritance rules differ from Sunni rules. This prototype currently uses the Sunni model by default.
            </p>
            <p className="text-sm text-muted-foreground">
              Shia-specific calculations are coming in a future update. For now, calculations will use Sunni rules 
              but will note this in your Action Packet.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => { 
              setShowShiaModal(false);
              onUpdate({ ...preferences, fiqhMode: 'sunni' });
            }} className="flex-1">
              Use Sunni instead
            </Button>
            <Button onClick={handleShiaConfirm} className="flex-1">
              Proceed (Sunni model)
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
