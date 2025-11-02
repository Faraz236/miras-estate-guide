// File: src/lib/pdfGenerator.ts
import jsPDF from 'jspdf';
import { SessionData } from '@/types/miras';

export async function generateActionPacketPDF(data: SessionData) {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let yPos = margin;

  // ---------------------
  // Helper functions
  // ---------------------
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
    color: [number, number, number] = [11, 21, 32],
    lineSpacing = 5
  ) => {
    pdf.setFontSize(fontSize);
    pdf.setFont('times', isBold ? 'bold' : 'normal');
    pdf.setTextColor(color[0], color[1], color[2]);
    const lines = pdf.splitTextToSize(text, contentWidth);
    lines.forEach((line: string) => {
      addPageIfNeeded(fontSize * 0.5 + lineSpacing);
      pdf.text(line, pageWidth / 2, yPos, { align: 'center' });
      yPos += fontSize * 0.5 + lineSpacing / 2;
    });
    yPos += 3;
  };

  const addLine = () => {
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPos, margin + contentWidth, yPos);
    yPos += 4;
  };

  // ---------------------
  // Page 1: Cover
  // ---------------------
  yPos = margin;
  pdf.setFillColor(0, 191, 166); // teal top banner
  pdf.rect(0, 0, pageWidth, 70, 'F');

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(38);
  pdf.setFont('times', 'bold');
  pdf.text('Miras', pageWidth / 2, 35, { align: 'center' });

  pdf.setFontSize(20);
  pdf.setFont('times', 'normal');
  pdf.text('Action Packet', pageWidth / 2, 50, { align: 'center' });

  yPos = 75;

  // Black border around cover info
  pdf.setDrawColor(0, 0, 0);
  pdf.setLineWidth(1);
  pdf.rect(margin, yPos, contentWidth, 60, 'S');

  yPos += 10;
  addText(`Date: ${data.date}`, 12);
  addText(`State: ${data.state === 'IL' ? 'Illinois' : data.state}`, 12);

  if (data.decedent?.name) {
    addText(`For: ${data.decedent.name}`, 12, true);
  }

  // List stakeholders
  if (data.heirs?.length || data.spouses?.length) {
    addText(
      `Stakeholders: Heirs - ${data.heirs?.map(h => h.name).join(', ') || 'N/A'}; Spouses - ${data.spouses?.map(s => s.name).join(', ') || 'N/A'}`,
      12
    );
  }

  // Disclaimer Box at bottom
  const disclaimerHeight = 30;
  const disclaimerY = pageHeight - margin - disclaimerHeight - 10;
  pdf.setDrawColor(0, 0, 0);
  pdf.setLineWidth(1);
  pdf.setFillColor(255, 245, 245);
  pdf.rect(margin, disclaimerY, contentWidth, disclaimerHeight, 'F');
  pdf.rect(margin, disclaimerY, contentWidth, disclaimerHeight, 'S');

  pdf.setFont('times', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(217, 83, 79);
  pdf.text('IMPORTANT DISCLAIMER', pageWidth / 2, disclaimerY + 8, { align: 'center' });

  pdf.setFont('times', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(11, 21, 32);
  const disclaimerText =
    'This packet is educational and not legal advice. Consult an Illinois-licensed estate attorney and a qualified Islamic scholar before implementing any plan generated here.';
  pdf.splitTextToSize(disclaimerText, contentWidth - 10).forEach((line, i) => {
    pdf.text(line, pageWidth / 2, disclaimerY + 15 + i * 4, { align: 'center' });
  });

  // ---------------------
  // Page 2: Sharia Distribution + Wassiyah + Asset Summary
  // ---------------------
  pdf.addPage();
  yPos = margin;

  addText('Sharia Distribution', 20, true, [0, 191, 166]);
  addText('Calculated using Sunni fiqh rules based on your heirs', 12);

  yPos += 5;

  // Table: Sharia Shares
  const tableStartX = margin;
  const tableStartY = yPos;
  const tableWidth = contentWidth;
  const rowHeight = 10;
  const colWidths = [70, 50, 50];

  pdf.setFont('times', 'bold');
  const headers = ['Heir', 'Fraction', 'Percentage'];
  headers.forEach((header, i) => {
    pdf.rect(tableStartX + colWidths.slice(0, i).reduce((a, b) => a + b, 0), tableStartY, colWidths[i], rowHeight, 'S');
    pdf.text(
      header,
      tableStartX + colWidths.slice(0, i).reduce((a, b) => a + b, 0) + colWidths[i] / 2,
      tableStartY + 7,
      { align: 'center' }
    );
  });

  pdf.setFont('times', 'normal');
  data.computed.shariaShares.forEach((share, rowIndex) => {
    const rowY = tableStartY + rowHeight * (rowIndex + 1);
    const rowData = [share.heirName || share.relation, share.fraction, `${share.percentage.toFixed(2)}%`];
    rowData.forEach((cell, colIndex) => {
      pdf.rect(
        tableStartX + colWidths.slice(0, colIndex).reduce((a, b) => a + b, 0),
        rowY,
        colWidths[colIndex],
        rowHeight,
        'S'
      );
      pdf.text(
        cell,
        tableStartX + colWidths.slice(0, colIndex).reduce((a, b) => a + b, 0) + colWidths[colIndex] / 2,
        rowY + 7,
        { align: 'center' }
      );
    });
  });

  yPos = tableStartY + rowHeight * (data.computed.shariaShares.length + 1) + 10;

  addText('Wassiyah & Charity Allocation', 14, true);
  if (data.preferences.wasiyyahPercent) {
    addText(`Wassiyah Allocation: ${data.preferences.wasiyyahPercent}%`, 12);
  }
  if (data.preferences.charityAmount) {
    addText(`Charity Amount: $${data.preferences.charityAmount.toLocaleString()}`, 12);
  } else if (data.preferences.charityPercent) {
    addText(`Charity Percentage: ${data.preferences.charityPercent}%`, 12);
  }

  // Asset Summary Table
  yPos += 5;
  addText('Asset Summary', 16, true);
  yPos += 5;

  const assetColWidths = [70, 50, 50];
  pdf.setFont('times', 'bold');
  ['Asset Name', 'Value', 'Status'].forEach((header, i) => {
    pdf.rect(tableStartX + assetColWidths.slice(0, i).reduce((a, b) => a + b, 0), yPos, assetColWidths[i], rowHeight, 'S');
    pdf.text(
      header,
      tableStartX + assetColWidths.slice(0, i).reduce((a, b) => a + b, 0) + assetColWidths[i] / 2,
      yPos + 7,
      { align: 'center' }
    );
  });

  yPos += rowHeight;
  pdf.setFont('times', 'normal');
  data.assets.forEach((asset, index) => {
    const status = asset.ownerType !== 'sole' || asset.beneficiaries.length > 0 ? 'Non-Probate' : 'Probate';
    const rowY = yPos + index * rowHeight;
    const rowData = [asset.name, `$${asset.value.toLocaleString()}`, status];
    rowData.forEach((cell, colIndex) => {
      pdf.rect(
        tableStartX + assetColWidths.slice(0, colIndex).reduce((a, b) => a + b, 0),
        rowY,
        assetColWidths[colIndex],
        rowHeight,
        'S'
      );
      pdf.text(
        cell,
        tableStartX + assetColWidths.slice(0, colIndex).reduce((a, b) => a + b, 0) + assetColWidths[colIndex] / 2,
        rowY + 7,
        { align: 'center' }
      );
    });
  });

  yPos += rowHeight * data.assets.length + 10;

  // ---------------------
  // Page 4: Illinois Legal Checklist + Action Steps
  // ---------------------
  pdf.addPage();
  yPos = margin;

  addText('Illinois Legal Checklist', 16, true);
  pdf.setFont('times', 'normal');
  const checklist = [
    'Two-witness rule: A valid Illinois will requires your signature plus two witnesses who are not beneficiaries.',
    'Holographic wills: Handwritten wills without proper witnesses are NOT valid in Illinois.',
    'Surviving spouse statutory share: Illinois law allows them to claim an elective share if descendants exist.',
    'Signature formalities: The will must be signed by you (or someone at your direction) and by two witnesses in your presence.',
    'Non-probate assets: Assets with beneficiary designations or held in joint tenancy pass outside your will.'
  ];
  checklist.forEach(item => {
    addPageIfNeeded(12);
    pdf.text('•', margin, yPos);
    pdf.splitTextToSize(item, contentWidth - 10).forEach(line => {
      pdf.text(line, margin + 5, yPos);
      yPos += 4;
    });
    yPos += 2;
  });

  addText('Prioritized Action Steps', 16, true);
  data.computed.actionItems.forEach(item => {
    addPageIfNeeded(25);
    // Priority number
    pdf.setFillColor(0, 191, 166);
    pdf.circle(margin + 5, yPos, 4, 'F');
    pdf.setFont('times', 'bold');
    pdf.setTextColor(255, 255, 255);
    pdf.text(item.priority.toString(), margin + 3, yPos + 1);

    // Title
    pdf.setFont('times', 'normal');
    pdf.setTextColor(11, 21, 32);
    pdf.text(item.title, margin + 12, yPos);
    yPos += 6;

    // Description
    pdf.setFontSize(9);
    pdf.splitTextToSize(item.description, contentWidth - 15).forEach(line => {
      pdf.text(line, margin + 12, yPos);
      yPos += 4;
    });

    // Sample script box
    if (item.script) {
      const boxHeight = pdf.splitTextToSize(item.script, contentWidth - 30).length * 4 + 6;
      pdf.setFillColor(245, 245, 245);
      pdf.rect(margin + 12, yPos - 2, contentWidth - 24, boxHeight, 'F');
      pdf.setFontSize(8);
      pdf.setTextColor(80, 80, 80);
      pdf.text('Sample script:', margin + 14, yPos);
      pdf.splitTextToSize(item.script, contentWidth - 30).forEach(line => {
        pdf.text(line, margin + 14, yPos + 4);
        yPos += 4;
      });
      yPos += 5;
    }
    yPos += 5;
    pdf.setFontSize(10);
  });

  // ---------------------
  // Footer
  // ---------------------
  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(7);
    pdf.setTextColor(150, 150, 150);
    pdf.setLineWidth(0.5);
    pdf.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
    pdf.setFontSize(8);
    pdf.text('Miras | www.miras.com | support@miras.com', margin, pageHeight - 10);
    pdf.setFontSize(7);
    pdf.text('Created by Ahmed Faraz & Yazaan Shaikh', margin, pageHeight - 5);
    pdf.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 20, pageHeight - 10);
  }

  pdf.save(`Miras-Action-Packet-${data.date}.pdf`);
}
