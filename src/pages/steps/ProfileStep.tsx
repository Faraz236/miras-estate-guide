import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { User } from 'lucide-react';

interface ProfileStepProps {
  decedent: {
    name: string;
    relationToUser: 'self' | 'spouse' | 'executor' | 'other';
  };
  date: string;
  onUpdate: (decedent: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function ProfileStep({ decedent, date, onUpdate, onNext, onBack }: ProfileStepProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <User className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-2xl font-semibold">Profile Information</h2>
            <p className="text-sm text-muted-foreground">Basic details about the estate</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label>Relationship to decedent (required)</Label>
            <RadioGroup
              value={decedent.relationToUser}
              onValueChange={(value) => onUpdate({ ...decedent, relationToUser: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="self" id="self" />
                <Label htmlFor="self" className="font-normal cursor-pointer">
                  Self (I'm planning my own estate)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="spouse" id="spouse" />
                <Label htmlFor="spouse" className="font-normal cursor-pointer">
                  Spouse
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="executor" id="executor" />
                <Label htmlFor="executor" className="font-normal cursor-pointer">
                  Executor/Administrator
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other" className="font-normal cursor-pointer">
                  Other
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="decedent-name">Name (optional for demo)</Label>
            <Input
              id="decedent-name"
              placeholder="Optional for demo"
              value={decedent.name}
              onChange={(e) => onUpdate({ ...decedent, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Input
              type="text"
              value={date}
              disabled
              className="bg-muted"
            />
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              <strong>Privacy note:</strong> We only store data for this session. No PII saved for hackathon demo.
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onBack} size="lg">
              Back
            </Button>
            <Button onClick={onNext} size="lg" className="flex-1">
              Next: Family
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
