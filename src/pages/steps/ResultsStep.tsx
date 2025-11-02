import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { AlertTriangle, CheckCircle, Info, Download, Mail, Share2, FileText } from 'lucide-react';
import { SessionData, StateFlag } from '@/types/miras';
import { computeSharia } from '@/lib/shariaEngine';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { generateActionPacketPDF } from '@/lib/pdfGenerator';
import { toast } from 'sonner';

interface ResultsStepProps {
  sessionData: SessionData;
  onBack: () => void;
  onEdit: () => void;
}

const COLORS = ['#0F7A75', '#D4AF37', '#4299E1', '#48BB78', '#ED8936', '#9F7AEA', '#ECC94B'];

export default function ResultsStep({ sessionData, onBack, onEdit }: ResultsStepProps) {
  const [computed, setComputed] = useState(sessionData.computed);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [pdfChecks, setPdfChecks] = useState({ check1: false, check2: false });

  useEffect(() => {
    const results = computeSharia(sessionData.family, sessionData.assets, sessionData.preferences);
    setComputed(results);
  }, [sessionData]);

  const chartData = computed.shariaShares.map(share => ({
    name: share.heirName || share.relation,
    value: share.percentage
  }));

  const handleGeneratePDF = async () => {
    if (!pdfChecks.check1 || !pdfChecks.check2) {
      toast.error('Please confirm both checkboxes to proceed');
      return;
    }

    try {
      await generateActionPacketPDF({
        ...sessionData,
        computed
      });
      toast.success('Action Packet PDF generated successfully!');
      setShowPDFModal(false);
    } catch (error) {
      toast.error('Failed to generate PDF. Please try again.');
      console.error('PDF generation error:', error);
    }
  };

  const getIconForFlag = (flag: StateFlag) => {
    switch (flag.type) {
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      default:
        return <Info className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Sharia Distribution Card */}
      <Card className="p-8">
        <h2 className="text-2xl font-semibold mb-2">Sharia Distribution — Sunni Model</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Calculated based on the heirs you entered. Fraction math shown below.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value.toFixed(1)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold mb-3">Heir Distribution</h3>
            <div className="space-y-2">
              {computed.shariaShares.map((share, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div
                    className="w-4 h-4 rounded mt-1 flex-shrink-0"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="font-medium">{share.heirName || share.relation}</span>
                      <span className="text-sm text-muted-foreground">
                        {share.fraction} ({share.percentage.toFixed(2)}%)
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{share.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2">Estate Values</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Probate Estate:</p>
              <p className="text-lg font-semibold">${computed.probateEstateValue.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Non-Probate Assets:</p>
              <p className="text-lg font-semibold">${computed.nonProbateValue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Illinois Legal Checklist & Flags */}
      <Card className="p-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-success" />
              Illinois Legal Checklist
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                <div>
                  <p className="font-medium">Two-witness requirement</p>
                  <p className="text-sm text-muted-foreground">
                    A valid will requires your signature plus two witnesses
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Holographic wills not valid</p>
                  <p className="text-sm text-muted-foreground">
                    Handwritten wills without witnesses are not valid in Illinois
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
                <div>
                  <p className="font-medium">Surviving spouse statutory share</p>
                  <p className="text-sm text-muted-foreground">
                    Illinois law allows spouse to claim approx 1/3 if descendants exist
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
                <div>
                  <p className="font-medium">Non-probate assets</p>
                  <p className="text-sm text-muted-foreground">
                    401(k), life insurance, joint tenancy pass outside will
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-destructive" />
              Flags & Alerts
            </h3>
            {computed.stateFlags.length === 0 ? (
              <div className="flex items-center gap-2 text-success">
                <CheckCircle className="h-5 w-5" />
                <p>No conflicts detected</p>
              </div>
            ) : (
              <div className="space-y-3">
                {computed.stateFlags.map((flag, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      flag.type === 'error'
                        ? 'bg-destructive/10 border-destructive/20'
                        : flag.type === 'warning'
                        ? 'bg-warning/10 border-warning/20'
                        : 'bg-primary/10 border-primary/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {getIconForFlag(flag)}
                      <div className="flex-1">
                        <p className="font-medium mb-1">{flag.title}</p>
                        <p className="text-sm text-muted-foreground">{flag.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Action Items */}
      {computed.actionItems.length > 0 && (
        <Card className="p-8">
          <h3 className="text-xl font-semibold mb-4">Prioritized Action Steps</h3>
          <div className="space-y-3">
            {computed.actionItems.map((item, index) => (
              <div key={index} className="flex gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    {item.priority}
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium mb-1">{item.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                  {item.script && (
                    <div className="mt-2 p-3 bg-card rounded border text-sm">
                      <p className="text-xs text-muted-foreground mb-1">Sample script:</p>
                      <p className="italic">{item.script}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} size="lg">
          Back
        </Button>
        <Button variant="outline" onClick={onEdit} size="lg">
          Edit inputs
        </Button>
        <Button onClick={() => setShowPDFModal(true)} size="lg" className="flex-1">
          <Download className="mr-2 h-5 w-5" />
          Generate Action Packet (PDF)
        </Button>
      </div>

      {/* PDF Generation Modal */}
      <Dialog open={showPDFModal} onOpenChange={setShowPDFModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Action Packet (Educational only)</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm">
              The Action Packet packages your Sharia calculation, asset table, Illinois checklist, 
              prioritized actions, and sample will preview. This is educational and not a legal document.
            </p>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="pdf-check-1"
                  checked={pdfChecks.check1}
                  onCheckedChange={(checked) => setPdfChecks({ ...pdfChecks, check1: checked as boolean })}
                />
                <Label htmlFor="pdf-check-1" className="text-sm font-normal cursor-pointer">
                  I understand this is educational and not legal advice.
                </Label>
              </div>
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="pdf-check-2"
                  checked={pdfChecks.check2}
                  onCheckedChange={(checked) => setPdfChecks({ ...pdfChecks, check2: checked as boolean })}
                />
                <Label htmlFor="pdf-check-2" className="text-sm font-normal cursor-pointer">
                  I will consult a licensed Illinois attorney and a qualified Islamic scholar before using any documents.
                </Label>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowPDFModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleGeneratePDF}
              disabled={!pdfChecks.check1 || !pdfChecks.check2}
              className="flex-1"
            >
              Generate PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
