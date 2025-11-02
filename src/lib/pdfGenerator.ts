import jsPDF from 'jspdf';
import { SessionData } from '@/types/miras';

export async function generateActionPacketPDF(data: SessionData) {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
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

  const addText = (
    text: string,
    fontSize: number,
    isBold = false,
    color: [number, number, number] = [11, 21, 32]
  ) => {
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
    pdf.setTextColor(color[0], color[1], color[2]);
    const lines = pdf.splitTextToSize(text, contentWidth);
    lines.forEach((line: string) => {
      addPageIfNeeded(fontSize * 0.5 + 3);
      pdf.text(line, margin, yPos);
      yPos += fontSize * 0.5;
    });
    yPos += 3;
  };

  // ---------------------
  // Page 1: Cover
  // ---------------------
  pdf.setFillColor(15, 122, 117);
  pdf.rect(0, 0, pageWidth, 70, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(38);
  pdf.setFont('helvetica', 'bold');
  pdf.text('⚖️ Miras', margin, 35);
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Action Packet', margin, 50);

  yPos = 75;
  addText('Sharia-informed Illinois advisory export — Educational only', 14, true);
  addText(`Date: ${data.date}`, 12);
  addText(`State: ${data.state}`, 12);
  if (data.decedent?.name) {
    addText(`For: ${data.decedent.name}`, 12);
  }

  yPos += 10;
  // Disclaimer box
  pdf.setDrawColor(217, 83, 79);
  pdf.setLineWidth(1);
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
  const disclaimerText =
    'This packet is educational and not legal advice. Consult an Illinois-licensed estate attorney and a qualified Islamic scholar before implementing any plan generated here.';
  pdf.splitTextToSize(disclaimerText, contentWidth - 10).forEach(line => {
    pdf.text(line, margin + 5, yPos);
    yPos += 5;
  });

  // ---------------------
  // Page 2: Sharia Distribution
  // ---------------------
  pdf.addPage();
  yPos = margin;
  addText('Sharia Distribution', 20, true, [197, 164, 114]);
  addText('Calculated using Sunni fiqh rules based on your heirs', 12);

  yPos += 5;
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

    // Explanation
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.splitTextToSize(share.explanation, contentWidth - 20).forEach(line => {
      pdf.text(line, margin + 10, yPos);
      yPos += 4;
    });
    pdf.setFontSize(10);
    pdf.setTextColor(11, 21, 32);
    yPos += 4;
  });

  // ---------------------
  // Page 3: Asset Summary
  // ---------------------
  pdf.addPage();
  yPos = margin;
  addText('Asset Summary', 20, true, [197, 164, 114]);
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
    const status = asset.ownerType !== 'sole' || asset.beneficiaries.length > 0 ? 'Non-Probate' : 'Probate';
    if (status === 'Non-Probate') {
      pdf.setFillColor(255, 240, 240);
      pdf.rect(margin, yPos - 4, contentWidth, 8, 'F');
      pdf.setTextColor(217, 83, 79);
      pdf.setFont('helvetica', 'bold');
    }

    pdf.text(asset.name, margin, yPos);
    pdf.text(`$${asset.value.toLocaleString()}`, margin + 70, yPos);
    pdf.text(status, margin + 120, yPos);

    pdf.setTextColor(11, 21, 32);
    pdf.setFont('helvetica', 'normal');
    yPos += 10;
  });

  // ---------------------
  // Page 4: Wasiyyah & Charity
  // ---------------------
  if (data.wasiyyahPercentage || data.charityAmount || data.charityPercentage) {
    pdf.addPage();
    yPos = margin;
    addText('Wasiyyah & Charity Allocation', 20, true, [197, 164, 114]);
    yPos += 5;

    if (data.wasiyyahPercentage) {
      addText(`Wasiyyah Allocation: ${data.wasiyyahPercentage}%`, 12);
    }
    if (data.charityAmount) {
      addText(`Charity Amount: $${data.charityAmount.toLocaleString()}`, 12);
    } else if (data.charityPercentage) {
      addText(`Charity Percentage: ${data.charityPercentage}%`, 12);
    }
  }

  // ---------------------
  // Page 5: Illinois Legal Checklist
  // ---------------------
  pdf.addPage();
  yPos = margin;
  addText('Illinois Legal Checklist', 20, true, [197, 164, 114]);
  yPos += 5;

  const checklist = [
    'Two-witness rule: A valid Illinois will requires your signature plus two witnesses who are not beneficiaries.',
    'Holographic wills: Handwritten wills without proper witnesses are NOT valid in Illinois.',
    'Surviving spouse statutory share: If your spouse survives, Illinois law allows them to claim an elective share of approx. one-third of your estate if descendants exist. Your attorney can compute exact effect.',
    'Signature formalities: The will must be signed by you (or someone at your direction in your presence) and by two witnesses in your presence.',
    'Non-probate assets: Assets with beneficiary designations or held in joint tenancy pass outside your will and are not subject to its provisions.'
  ];
  checklist.forEach(item => {
    addPageIfNeeded(20);
    pdf.text('•', margin, yPos);
    pdf.splitTextToSize(item, contentWidth - 10).forEach((line, i) => {
      pdf.text(line, margin + 5, yPos + i * 5);
    });
    yPos += (pdf.splitTextToSize(item, contentWidth - 10).length * 5) + 5;
  });

  // ---------------------
  // Page 6: Prioritized Action Steps
  // ---------------------
  pdf.addPage();
  yPos = margin;
  addText('Prioritized Action Steps', 20, true, [197, 164, 114]);
  addText('Top recommendations based on your estate structure', 12);
  yPos += 5;

  data.computed.actionItems.forEach(item => {
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
    pdf.splitTextToSize(item.description, contentWidth - 15).forEach(line => {
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
      pdf.splitTextToSize(item.script, contentWidth - 20).forEach(line => {
        pdf.text(line, margin + 14, yPos);
        yPos += 3.5;
      });
      yPos += 3;
    }
    pdf.setFontSize(10);
    yPos += 8;
  });

  // ---------------------
  // Footer
  // ---------------------
  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(7);
    pdf.setTextColor(150, 150, 150);
    pdf.text(
      '────────────────────────────────────────────────────────────────────────────────',
      margin,
      pageHeight - 18
    );
    pdf.setFontSize(8);
    pdf.text('Miras ⚖️ | www.miras.com | support@miras.com', margin, pageHeight - 12);
    pdf.setFontSize(7);
    pdf.text('Created by Ahmed Faraz & Yazaan Shaikh', margin, pageHeight - 7);
    pdf.setFontSize(8);
    pdf.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 20, pageHeight - 12);
  }

  pdf.save(`Miras-Action-Packet-${data.date}.pdf`);
}
