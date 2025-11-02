import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Plus, Edit, Trash2, AlertTriangle, Info } from 'lucide-react';
import { Asset, FamilyMember, Beneficiary } from '@/types/miras';
import { Badge } from '@/components/ui/badge';

interface AssetStepProps {
  assets: Asset[];
  family: FamilyMember[];
  onUpdate: (assets: Asset[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function AssetStep({ assets, family, onUpdate, onNext, onBack }: AssetStepProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [newAsset, setNewAsset] = useState<Partial<Asset>>({
    name: '',
    type: 'bank_account',
    value: 0,
    ownerType: 'sole',
    beneficiaries: [],
    acquiredDuringMarriage: false,
    notes: ''
  });

  const resetNewAsset = () => {
    setNewAsset({
      name: '',
      type: 'bank_account',
      value: 0,
      ownerType: 'sole',
      beneficiaries: [],
      acquiredDuringMarriage: false,
      notes: ''
    });
  };

  const handleAddAsset = () => {
    if (editingAsset) {
      onUpdate(assets.map(a => a.id === editingAsset.id ? { ...newAsset as Asset, id: editingAsset.id } : a));
      setEditingAsset(null);
    } else {
      onUpdate([...assets, { ...newAsset as Asset, id: crypto.randomUUID() }]);
    }
    resetNewAsset();
    setShowAddDialog(false);
  };

  const handleEditAsset = (asset: Asset) => {
    setEditingAsset(asset);
    setNewAsset(asset);
    setShowAddDialog(true);
  };

  const handleDeleteAsset = (id: string) => {
    onUpdate(assets.filter(a => a.id !== id));
  };

  const getAssetStatus = (asset: Asset) => {
    if (asset.ownerType !== 'sole' || asset.beneficiaries.length > 0) {
      return 'non-probate';
    }
    return 'probate';
  };

  return (
    <div className="max-w-5xl mx-auto">
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-2xl font-semibold">Assets & Property</h2>
            <p className="text-sm text-muted-foreground">List all assets in your estate</p>
          </div>
        </div>

        <div className="space-y-6">
          {assets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-16 w-16 mx-auto mb-4 opacity-20" />
              <p>No assets added yet</p>
              <p className="text-sm">Click "Add asset" to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Type</th>
                    <th className="text-right py-3 px-4">Value</th>
                    <th className="text-left py-3 px-4">Owner</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-right py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map((asset) => {
                    const status = getAssetStatus(asset);
                    return (
                      <tr key={asset.id} className={`border-b ${status === 'non-probate' ? 'bg-destructive/5' : ''}`}>
                        <td className="py-3 px-4 font-medium">{asset.name}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground capitalize">
                          {asset.type.replace('_', ' ')}
                        </td>
                        <td className="py-3 px-4 text-right">
                          ${asset.value.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-sm capitalize">
                          {asset.ownerType.replace('_', ' ')}
                        </td>
                        <td className="py-3 px-4">
                          {status === 'non-probate' ? (
                            <Badge variant="destructive" className="gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Non-probate
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Probate</Badge>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex gap-2 justify-end">
                            <Button variant="ghost" size="icon" onClick={() => handleEditAsset(asset)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteAsset(asset.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <Dialog open={showAddDialog} onOpenChange={(open) => {
            setShowAddDialog(open);
            if (!open) {
              setEditingAsset(null);
              resetNewAsset();
            }
          }}>
            <DialogTrigger asChild>
              <Button className="w-full" size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Add asset
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingAsset ? 'Edit' : 'Add'} Asset</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Asset name</Label>
                  <Input
                    value={newAsset.name}
                    onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                    placeholder="e.g., Primary Home, 401(k), Savings Account"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Asset type</Label>
                  <Select 
                    value={newAsset.type} 
                    onValueChange={(value) => setNewAsset({ ...newAsset, type: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="real_estate">Real Estate</SelectItem>
                      <SelectItem value="bank_account">Bank Account</SelectItem>
                      <SelectItem value="retirement">Retirement (401k/IRA)</SelectItem>
                      <SelectItem value="life_insurance">Life Insurance</SelectItem>
                      <SelectItem value="personal_property">Personal Property</SelectItem>
                      <SelectItem value="business_interest">Business Interest</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Approximate value (optional)</Label>
                  <Input
                    type="number"
                    value={newAsset.value || ''}
                    onChange={(e) => setNewAsset({ ...newAsset, value: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Owner type</Label>
                  <RadioGroup
                    value={newAsset.ownerType}
                    onValueChange={(value) => setNewAsset({ ...newAsset, ownerType: value as any })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sole" id="owner-sole" />
                      <Label htmlFor="owner-sole" className="font-normal cursor-pointer">Sole ownership</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="joint_tenancy" id="owner-joint" />
                      <Label htmlFor="owner-joint" className="font-normal cursor-pointer">Joint tenancy</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="tenancy_in_common" id="owner-tenancy" />
                      <Label htmlFor="owner-tenancy" className="font-normal cursor-pointer">Tenancy in common</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="trust" id="owner-trust" />
                      <Label htmlFor="owner-trust" className="font-normal cursor-pointer">Trust</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Has beneficiary designation?</Label>
                  <RadioGroup
                    value={newAsset.beneficiaries && newAsset.beneficiaries.length > 0 ? 'yes' : 'no'}
                    onValueChange={(value) => {
                      if (value === 'no') {
                        setNewAsset({ ...newAsset, beneficiaries: [] });
                      } else {
                        setNewAsset({ ...newAsset, beneficiaries: [{ name: '', percent: 100 }] });
                      }
                    }}
                  >
                    <div className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="ben-no" />
                        <Label htmlFor="ben-no" className="font-normal cursor-pointer">No</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="ben-yes" />
                        <Label htmlFor="ben-yes" className="font-normal cursor-pointer">Yes</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {newAsset.beneficiaries && newAsset.beneficiaries.length > 0 && (
                  <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                    <Label>Beneficiary name</Label>
                    <Input
                      value={newAsset.beneficiaries[0]?.name || ''}
                      onChange={(e) => setNewAsset({ 
                        ...newAsset, 
                        beneficiaries: [{ ...newAsset.beneficiaries![0], name: e.target.value }] 
                      })}
                      placeholder="Beneficiary name"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Acquired during marriage?</Label>
                  <RadioGroup
                    value={newAsset.acquiredDuringMarriage ? 'yes' : 'no'}
                    onValueChange={(value) => setNewAsset({ ...newAsset, acquiredDuringMarriage: value === 'yes' })}
                  >
                    <div className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="marriage-yes" />
                        <Label htmlFor="marriage-yes" className="font-normal cursor-pointer">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="marriage-no" />
                        <Label htmlFor="marriage-no" className="font-normal cursor-pointer">No</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Notes (optional)</Label>
                  <Textarea
                    value={newAsset.notes}
                    onChange={(e) => setNewAsset({ ...newAsset, notes: e.target.value })}
                    placeholder="Additional notes about this asset"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <Button variant="outline" onClick={() => setShowAddDialog(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleAddAsset} className="flex-1" disabled={!newAsset.name}>
                  {editingAsset ? 'Update' : 'Add'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 flex gap-3">
            <Info className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium mb-1">Non-probate assets</p>
              <p className="text-muted-foreground">
                Assets with beneficiary designations or held in joint tenancy pass outside your will. 
                These need special attention to align with your Sharia-compliant estate plan.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onBack} size="lg">
              Back
            </Button>
            <Button onClick={onNext} size="lg" className="flex-1" disabled={assets.length === 0}>
              Next: Preferences
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
