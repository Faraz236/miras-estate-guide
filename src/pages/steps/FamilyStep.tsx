import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Users, Plus, Edit, Trash2 } from 'lucide-react';
import { FamilyMember } from '@/types/miras';

interface FamilyStepProps {
  family: FamilyMember[];
  onUpdate: (family: FamilyMember[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function FamilyStep({ family, onUpdate, onNext, onBack }: FamilyStepProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [newMember, setNewMember] = useState<Partial<FamilyMember>>({
    relation: 'spouse',
    name: '',
    sex: 'male',
    alive: true,
    adopted: false
  });

  const resetNewMember = () => {
    setNewMember({
      relation: 'spouse',
      name: '',
      sex: 'male',
      alive: true,
      adopted: false
    });
  };

  const handleAddMember = () => {
    if (editingMember) {
      onUpdate(family.map(m => m.id === editingMember.id ? { ...newMember as FamilyMember, id: editingMember.id } : m));
      setEditingMember(null);
    } else {
      onUpdate([...family, { ...newMember as FamilyMember, id: crypto.randomUUID() }]);
    }
    resetNewMember();
    setShowAddDialog(false);
  };

  const handleEditMember = (member: FamilyMember) => {
    setEditingMember(member);
    setNewMember(member);
    setShowAddDialog(true);
  };

  const handleDeleteMember = (id: string) => {
    onUpdate(family.filter(m => m.id !== id));
  };

  const handleQuickAdd = () => {
    const spouse: FamilyMember = {
      id: crypto.randomUUID(),
      relation: 'spouse',
      name: 'Spouse',
      sex: 'female',
      alive: true,
      adopted: false
    };
    const son: FamilyMember = {
      id: crypto.randomUUID(),
      relation: 'child',
      name: 'Son',
      sex: 'male',
      alive: true,
      adopted: false
    };
    const daughter: FamilyMember = {
      id: crypto.randomUUID(),
      relation: 'child',
      name: 'Daughter',
      sex: 'female',
      alive: true,
      adopted: false
    };
    onUpdate([...family, spouse, son, daughter]);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <h2 className="text-2xl font-semibold">Family & Heirs</h2>
              <p className="text-sm text-muted-foreground">Add living heirs for Sharia calculation</p>
            </div>
          </div>
          <Button onClick={handleQuickAdd} variant="outline" size="sm">
            Quick Add (Spouse + 2 children)
          </Button>
        </div>

        <div className="space-y-6">
          {family.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-16 w-16 mx-auto mb-4 opacity-20" />
              <p>No family members added yet</p>
              <p className="text-sm">Click "Add heir" to get started</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {family.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      member.sex === 'male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                    }`}>
                      {member.sex === 'male' ? '♂' : '♀'}
                    </div>
                    <div>
                      <p className="font-medium">{member.name || 'Unnamed'}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {member.relation} • {member.alive ? 'Living' : 'Deceased'}
                        {member.adopted && ' • Adopted'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEditMember(member)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteMember(member.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Dialog open={showAddDialog} onOpenChange={(open) => {
            setShowAddDialog(open);
            if (!open) {
              setEditingMember(null);
              resetNewMember();
            }
          }}>
            <DialogTrigger asChild>
              <Button className="w-full" size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Add heir
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingMember ? 'Edit' : 'Add'} Family Member</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Relation</Label>
                  <RadioGroup
                    value={newMember.relation}
                    onValueChange={(value) => setNewMember({ ...newMember, relation: value as any })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="spouse" id="rel-spouse" />
                      <Label htmlFor="rel-spouse" className="font-normal cursor-pointer">Spouse</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="child" id="rel-child" />
                      <Label htmlFor="rel-child" className="font-normal cursor-pointer">Child</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="parent" id="rel-parent" />
                      <Label htmlFor="rel-parent" className="font-normal cursor-pointer">Parent</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sibling" id="rel-sibling" />
                      <Label htmlFor="rel-sibling" className="font-normal cursor-pointer">Sibling</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="rel-other" />
                      <Label htmlFor="rel-other" className="font-normal cursor-pointer">Other</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Name (optional)</Label>
                  <Input
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    placeholder="Enter name"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Sex</Label>
                  <RadioGroup
                    value={newMember.sex}
                    onValueChange={(value) => setNewMember({ ...newMember, sex: value as any })}
                  >
                    <div className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="sex-male" />
                        <Label htmlFor="sex-male" className="font-normal cursor-pointer">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="sex-female" />
                        <Label htmlFor="sex-female" className="font-normal cursor-pointer">Female</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="alive"
                    checked={newMember.alive}
                    onCheckedChange={(checked) => setNewMember({ ...newMember, alive: checked as boolean })}
                  />
                  <Label htmlFor="alive" className="font-normal cursor-pointer">Currently alive</Label>
                </div>

                {newMember.relation === 'child' && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="adopted"
                      checked={newMember.adopted}
                      onCheckedChange={(checked) => setNewMember({ ...newMember, adopted: checked as boolean })}
                    />
                    <Label htmlFor="adopted" className="font-normal cursor-pointer">
                      Adopted child
                    </Label>
                  </div>
                )}
              </div>
              <div className="flex gap-3 mt-4">
                <Button variant="outline" onClick={() => setShowAddDialog(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleAddMember} className="flex-1">
                  {editingMember ? 'Update' : 'Add'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              Enter living heirs you want the Sharia calculation to consider. Deceased parent/child options available in advanced mode.
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onBack} size="lg">
              Back
            </Button>
            <Button onClick={onNext} size="lg" className="flex-1" disabled={family.length === 0}>
              Next: Assets
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
