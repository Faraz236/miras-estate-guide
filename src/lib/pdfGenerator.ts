// File: src/lib/pdfGenerator.ts
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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
    if (yPos + height > pageHeight - margin - 20) { // leave space for footer
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
    lineSpacing = 5,
    align: 'left' | 'center' | 'right' = 'left'
  ) => {
    pdf.setFontSize(fontSize);
    pdf.setFont('times', isBold ? 'bold' : 'normal');
    pdf.setTextColor(color[0], color[1], color[2]);
    const lines = pdf.splitTextToSize(text, contentWidth);
    lines.forEach((line: string) => {
      addPageIfNeeded(fontSize * 0.5 + lineSpacing);
      let x = margin;
      if (align === 'center') x = pageWidth / 2;
      if (align === 'right') x = pageWidth - margin;
      pdf.text(line, x, yPos, { align });
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

  const underlineText = (text: string, fontSize: number, yOffset = 0) => {
    const width = pdf.getTextWidth(text);
    pdf.setLineWidth(0.7);
    pdf.line((pageWidth - width) / 2, yPos + yOffset + 1, (pageWidth + width) / 2, yPos + yOffset + 1);
  };

  const drawPageBorder = () => {
    pdf.setDrawColor(15, 122, 117); // signature teal
    pdf.setLineWidth(2);
    pdf.rect(5, 5, pageWidth - 10, pageHeight - 10, 'S');
  };

  // ---------------------
  // Page 1: Cover
  // ---------------------
  pdf.setFont('times', 'bold');
  pdf.setFontSize(38);
  pdf.setTextColor(15, 122, 117);
  pdf.text('Miras', pageWidth / 2, pageHeight / 2 - 30, { align: 'center' });

  pdf.setFontSize(20);
  pdf.setFont('times', 'normal');
  pdf.text('Action Packet', pageWidth / 2, pageHeight / 2, { align: 'center' });

  pdf.setFontSize(14);
  pdf.setTextColor(11, 21, 32);
  pdf.text(`Date: 2nd November 2025`, pageWidth / 2, pageHeight / 2 + 20, { align: 'center' });
  pdf.text(`State: Illinois`, pageWidth / 2, pageHeight / 2 + 30, { align: 'center' });
  pdf.text(`For: Ahmad Khan`, pageWidth / 2, pageHeight / 2 + 40, { align: 'center' });

  // Disclaimer box at bottom
  const disclaimerHeight = 25;
  pdf.setDrawColor(217, 83, 79);
  pdf.setLineWidth(1);
  pdf.setFillColor(255, 245, 245);
  pdf.rect(margin, pageHeight - margin - disclaimerHeight, contentWidth, disclaimerHeight, 'F');
  pdf.rect(margin, pageHeight - margin - disclaimerHeight, contentWidth, disclaimerHeight, 'S');
  pdf.setFont('times', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(217, 83, 79);
  pdf.text('IMPORTANT DISCLAIMER', margin + 5, pageHeight - margin - disclaimerHeight + 7);
  pdf.setFont('times', 'normal');
  pdf.setTextColor(11, 21, 32);
  const disclaimerText =
    'This packet is educational and not legal advice. Consult an Illinois-licensed estate attorney and a qualified Islamic scholar before implementing any plan.';
  pdf.text(disclaimerText, margin + 5, pageHeight - margin - disclaimerHeight + 15, { maxWidth: contentWidth - 10 });

  // ---------------------
  // Page 2: Asset Summary, Wassiyah & Charity, Sharia Distribution
  // ---------------------
  pdf.addPage();
  drawPageBorder();
  yPos = margin + 5;

  // Asset Summary
  addText('Asset Summary', 16, true, [0, 0, 0], 5, 'center');
  underlineText('Asset Summary', 16);
  yPos += 5;

  const tableStartX = margin + 10;
  const tableWidth = contentWidth - 20;
  const colWidths = [60, 40, 40]; // Name, Value, Status
  pdf.setFont('times', 'normal');
  pdf.setFontSize(12);

  // Table header
  pdf.setDrawColor(0);
  pdf.setFillColor(240, 240, 240);
  pdf.rect(tableStartX, yPos, tableWidth, 10, 'F');
  pdf.text('Asset Name', tableStartX + 2, yPos + 7);
  pdf.text('Value', tableStartX + colWidths[0] + 2, yPos + 7);
  pdf.text('Status', tableStartX + colWidths[0] + colWidths[1] + 2, yPos + 7);
  yPos += 10;

  data.assets.forEach(asset => {
    addPageIfNeeded(12);
    pdf.setFillColor(255, 255, 255);
    pdf.rect(tableStartX, yPos, tableWidth, 10, 'F');
    pdf.setDrawColor(0);
    pdf.rect(tableStartX, yPos, tableWidth, 10, 'S');

    pdf.text(asset.name, tableStartX + 2, yPos + 7);
    pdf.text(`$${asset.value.toLocaleString()}`, tableStartX + colWidths[0] + 2, yPos + 7);
    const status = asset.ownerType !== 'sole' || asset.beneficiaries.length > 0 ? 'Non-Probate' : 'Probate';
    pdf.text(status, tableStartX + colWidths[0] + colWidths[1] + 2, yPos + 7);
    yPos += 10;
  });

  yPos += 5;

  // Wassiyah & Charity
  addText('Wassiyah & Charity Allocation', 16, true, [0, 0, 0], 5, 'center');
  underlineText('Wassiyah & Charity Allocation', 16);
  yPos += 5;

  if (data.preferences.wasiyyahPercent) {
    addText(`Wassiyah Allocation: ${data.preferences.wasiyyahPercent}%`, 12, false, [0, 0, 0], 4, 'center');
  }
  if (data.preferences.charityAmount) {
    addText(`Charity Amount: $${data.preferences.charityAmount.toLocaleString()}`, 12, false, [0, 0, 0], 4, 'center');
  } else if (data.preferences.charityPercent) {
    addText(`Charity Percentage: ${data.preferences.charityPercent}%`, 12, false, [0, 0, 0], 4, 'center');
  }

  yPos += 5;

  // Sharia Distribution
  addText('Sharia Distribution', 16, true, [0, 0, 0], 5, 'center');
  underlineText('Sharia Distribution', 16);
  yPos += 5;

  // Table with Heir, Relation, Fraction, Percentage
  const colWidthsSharia = [50, 40, 30, 30];
  pdf.setFontSize(12);
  pdf.setFont('times', 'bold');
  pdf.rect(tableStartX, yPos, tableWidth, 10, 'F');
  pdf.text('Heir', tableStartX + 2, yPos + 7);
  pdf.text('Relation', tableStartX + colWidthsSharia[0] + 2, yPos + 7);
  pdf.text('Fraction', tableStartX + colWidthsSharia[0] + colWidthsSharia[1] + 2, yPos + 7);
  pdf.text('Percentage', tableStartX + colWidthsSharia[0] + colWidthsSharia[1] + colWidthsSharia[2] + 2, yPos + 7);
  yPos += 10;

  pdf.setFont('times', 'normal');
  data.computed.shariaShares.forEach(share => {
    addPageIfNeeded(12);
    pdf.rect(tableStartX, yPos, tableWidth, 10, 'S');
    pdf.text(share.heirName || '', tableStartX + 2, yPos + 7);
    pdf.text(share.relation || '', tableStartX + colWidthsSharia[0] + 2, yPos + 7);
    pdf.text(share.fraction, tableStartX + colWidthsSharia[0] + colWidthsSharia[1] + 2, yPos + 7);
    pdf.text(`${share.percentage.toFixed(2)}%`, tableStartX + colWidthsSharia[0] + colWidthsSharia[1] + colWidthsSharia[2] + 2, yPos + 7);
    yPos += 10;
  });

  // ---------------------
  // Page 3: Legal Checklist + Action Steps
  // ---------------------
  pdf.addPage();
  drawPageBorder();
  yPos = margin + 5;

  // Legal Checklist
  addText('Illinois Legal Checklist', 16, true, [0, 0, 0], 5, 'center');
  underlineText('Illinois Legal Checklist', 16);
  yPos += 5;

  pdf.setFont('times', 'normal');
  pdf.setFontSize(12);
  const checklist = [
    'Two-witness rule: A valid Illinois will requires your signature plus two witnesses who are not beneficiaries.',
    'Holographic wills: Handwritten wills without proper witnesses are NOT valid in Illinois.',
    'Surviving spouse statutory share: If your spouse survives, Illinois law allows them to claim an elective share of approximately one-third of your estate if descendants exist.',
    'Signature formalities: The will must be signed by you (or someone at your direction in your presence) and by two witnesses in your presence.',
    'Non-probate assets: Assets with beneficiary designations or held in joint tenancy pass outside your will and are not subject to its provisions.'
  ];

  checklist.forEach(item => {
    addPageIfNeeded(12);
    pdf.text(`• ${item}`, margin + 5, yPos);
    yPos += 7;
  });

  yPos += 5; // leave a line

  // Prioritized Action Steps
  addText('Prioritized Action Steps', 16, true, [0, 0, 0], 5, 'center');
  underlineText('Prioritized Action Steps', 16);
  yPos += 5;

  data.computed.actionItems.forEach(item => {
    addPageIfNeeded(30);
    pdf.setFont('times', 'bold');
    pdf.text(`${item.priority}. ${item.title}`, margin + 5, yPos);
    yPos += 6;

    pdf.setFont('times', 'normal');
    pdf.setFontSize(12);
    const wrapped = pdf.splitTextToSize(item.description, contentWidth - 10);
    wrapped.forEach(line => {
      pdf.text(line, margin + 10, yPos);
      yPos += 5;
    });

    if (item.script) {
      yPos += 2;
      pdf.setFontSize(11);
      const scriptLines = pdf.splitTextToSize(item.script, contentWidth - 20);
      scriptLines.forEach(line => {
        pdf.text(line, margin + 12, yPos);
        yPos += 5;
      });
      yPos += 3;
    }

    yPos += 5;
  });

  // ---------------------
  // Footer for all pages
  // ---------------------
  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(7);
    pdf.setTextColor(150, 150, 150);
    pdf.setLineWidth(0.5);
    pdf.line(margin, pageHeight - 18, pageWidth - margin, pageHeight - 18); // move up from border
    pdf.setFontSize(8);
    pdf.text('Miras | www.miras.com | support@miras.com', margin, pageHeight - 14);
    pdf.setFontSize(7);
    pdf.text('Created by Ahmed Faraz & Yazaan Shaikh', margin, pageHeight - 9);
    pdf.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 20, pageHeight - 14);
  }

  pdf.save(`Miras-Action-Packet-${data.date}.pdf`);
}
