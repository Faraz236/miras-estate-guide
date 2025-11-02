import jsPDF from 'jspdf';
import { SessionData } from '@/types/miras';

export async function generateActionPacketPDF(data: SessionData) {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (2 * margin);
  let yPos = margin;

  // Helper functions
  const addPageIfNeeded = (height: number) => {
    if (yPos + height > pageHeight - margin) {
      pdf.addPage();
      yPos = margin;
      return true;
    }
    return false;
  };

  const addText = (text: string, fontSize: number, isBold = false, color: [number, number, number] = [11, 21, 32]) => {
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
    pdf.setTextColor(color[0], color[1], color[2]);
    const lines = pdf.splitTextToSize(text, contentWidth);
    lines.forEach((line: string) => {
      addPageIfNeeded(fontSize * 0.5);
      pdf.text(line, margin, yPos);
      yPos += fontSize * 0.5;
    });
    yPos += 3;
  };

  // Page 1: Cover
  pdf.setFillColor(15, 122, 117);
  pdf.rect(0, 0, pageWidth, 60, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(34);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Miras', margin, 30);
  
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Action Packet', margin, 42);
  
  pdf.setTextColor(11, 21, 32);
  yPos = 75;
  
  addText('Sharia-informed Illinois advisory export — Educational only', 14, true);
  addText(`Date: ${data.date}`, 12);
  addText(`State: ${data.state}`, 12);
  if (data.decedent.name) {
    addText(`For: ${data.decedent.name}`, 12);
  }
  
  yPos += 10;
  
  // Disclaimer box
  pdf.setDrawColor(217, 83, 79);
  pdf.setLineWidth(1);
  pdf.rect(margin, yPos, contentWidth, 30);
  pdf.setFillColor(255, 245, 245);
  pdf.rect(margin, yPos, contentWidth, 30, 'F');
  pdf.rect(margin, yPos, contentWidth, 30, 'S');
  
  yPos += 8;
  pdf.setTextColor(217, 83, 79);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('IMPORTANT DISCLAIMER', margin + 5, yPos);
  yPos += 6;
  pdf.setFont('helvetica', 'normal');
  const disclaimerText = 'This packet is educational and not legal advice. Consult an Illinois-licensed estate attorney and a qualified Islamic scholar before implementing any plan generated here.';
  const disclaimerLines = pdf.splitTextToSize(disclaimerText, contentWidth - 10);
  disclaimerLines.forEach((line: string) => {
    pdf.text(line, margin + 5, yPos);
    yPos += 5;
  });

  // Page 2: Sharia Distribution
  pdf.addPage();
  yPos = margin;
  
  addText('Sharia Distribution', 20, true);
  addText('Calculated using Sunni fiqh rules based on your heirs', 12);
  
  yPos += 5;
  
  // Add shares table
  const tableStartY = yPos;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Heir', margin, yPos);
  pdf.text('Fraction', margin + 60, yPos);
  pdf.text('Percentage', margin + 100, yPos);
  yPos += 6;
  
  pdf.setLineWidth(0.5);
  pdf.line(margin, yPos, margin + contentWidth, yPos);
  yPos += 6;
  
  pdf.setFont('helvetica', 'normal');
  data.computed.shariaShares.forEach(share => {
    addPageIfNeeded(15);
    pdf.text(share.heirName || share.relation, margin, yPos);
    pdf.text(share.fraction, margin + 60, yPos);
    pdf.text(`${share.percentage.toFixed(2)}%`, margin + 100, yPos);
    yPos += 5;
    
    // Add explanation
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    const explLines = pdf.splitTextToSize(share.explanation, contentWidth - 20);
    explLines.forEach((line: string) => {
      pdf.text(line, margin + 10, yPos);
      yPos += 4;
    });
    pdf.setFontSize(10);
    pdf.setTextColor(11, 21, 32);
    yPos += 4;
  });

  // Page 3: Asset Summary
  pdf.addPage();
  yPos = margin;
  
  addText('Asset Summary', 20, true);
  yPos += 5;
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Asset Name', margin, yPos);
  pdf.text('Value', margin + 70, yPos);
  pdf.text('Status', margin + 120, yPos);
  yPos += 6;
  
  pdf.line(margin, yPos, margin + contentWidth, yPos);
  yPos += 6;
  
  pdf.setFont('helvetica', 'normal');
  data.assets.forEach(asset => {
    addPageIfNeeded(15);
    const status = asset.ownerType !== 'sole' || asset.beneficiaries.length > 0 ? 'NON-PROBATE' : 'Probate';
    
    if (status === 'NON-PROBATE') {
      pdf.setFillColor(255, 240, 240);
      pdf.rect(margin, yPos - 4, contentWidth, 8, 'F');
    }
    
    pdf.text(asset.name, margin, yPos);
    pdf.text(`$${asset.value.toLocaleString()}`, margin + 70, yPos);
    
    if (status === 'NON-PROBATE') {
      pdf.setTextColor(217, 83, 79);
      pdf.setFont('helvetica', 'bold');
    }
    pdf.text(status, margin + 120, yPos);
    pdf.setTextColor(11, 21, 32);
    pdf.setFont('helvetica', 'normal');
    
    yPos += 10;
  });

  // Page 4: Illinois Legal Checklist
  pdf.addPage();
  yPos = margin;
  
  addText('Illinois Legal Checklist', 20, true);
  yPos += 5;
  
  const checklist = [
    'Two-witness rule: A valid Illinois will requires your signature plus two witnesses who are not beneficiaries.',
    'Holographic wills: Handwritten wills without proper witnesses are NOT valid in Illinois.',
    'Surviving spouse statutory share: If your spouse survives, Illinois law allows them to claim an elective share of approximately one-third of your estate if descendants exist. Your attorney can compute the exact effect.',
    'Signature formalities: The will must be signed by you (or someone at your direction in your presence) and by two witnesses in your presence.',
    'Non-probate assets: Assets with beneficiary designations or held in joint tenancy pass outside your will and are not subject to its provisions.'
  ];
  
  checklist.forEach(item => {
    addPageIfNeeded(20);
    pdf.text('•', margin, yPos);
    const lines = pdf.splitTextToSize(item, contentWidth - 10);
    lines.forEach((line: string, index: number) => {
      pdf.text(line, margin + 5, yPos + (index * 5));
    });
    yPos += (lines.length * 5) + 5;
  });

  // Page 5: Prioritized Action Steps
  pdf.addPage();
  yPos = margin;
  
  addText('Prioritized Action Steps', 20, true);
  addText('Top recommendations based on your estate structure', 12);
  yPos += 5;
  
  data.computed.actionItems.forEach((item, index) => {
    addPageIfNeeded(30);
    
    // Priority number
    pdf.setFillColor(15, 122, 117);
    pdf.circle(margin + 5, yPos, 4, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.text(item.priority.toString(), margin + 3, yPos + 1);
    
    // Title
    pdf.setTextColor(11, 21, 32);
    pdf.text(item.title, margin + 12, yPos);
    yPos += 6;
    
    // Description
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    const descLines = pdf.splitTextToSize(item.description, contentWidth - 15);
    descLines.forEach((line: string) => {
      pdf.text(line, margin + 12, yPos);
      yPos += 4;
    });
    
    // Script if available
    if (item.script) {
      yPos += 2;
      pdf.setFillColor(245, 245, 245);
      pdf.rect(margin + 12, yPos - 2, contentWidth - 12, 15, 'F');
      pdf.setFontSize(8);
      pdf.setTextColor(80, 80, 80);
      pdf.text('Sample script:', margin + 14, yPos);
      yPos += 4;
      const scriptLines = pdf.splitTextToSize(item.script, contentWidth - 20);
      scriptLines.forEach((line: string) => {
        pdf.text(line, margin + 14, yPos);
        yPos += 3.5;
      });
      yPos += 3;
    }
    
    pdf.setFontSize(10);
    yPos += 8;
  });

  // Footer on every page
  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text('Miras — Educational only. For legal questions, consult an Illinois-licensed estate attorney.', margin, pageHeight - 10);
    pdf.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 20, pageHeight - 10);
  }

  // Save the PDF
  pdf.save(`Miras-Action-Packet-${data.date}.pdf`);
}
