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

  // ---- Utility ----
  const teal = [15, 122, 117];

  const addPageBorder = () => {
    pdf.setDrawColor(teal[0], teal[1], teal[2]);
    pdf.setLineWidth(0.8);
    pdf.rect(8, 8, pageWidth - 16, pageHeight - 16);
  };

  const addUnderline = (y: number, width: number = contentWidth) => {
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.3);
    pdf.line(margin, y + 2, margin + width, y + 2);
  };

  const addTitle = (text: string, y: number) => {
    pdf.setFont('times', 'bold');
    pdf.setFontSize(18);
    pdf.text(text, pageWidth / 2, y, { align: 'center' });
    addUnderline(y + 2, 90);
    return y + 10;
  };

  const addCenteredText = (text: string, size: number = 12, bold = false) => {
    pdf.setFont('times', bold ? 'bold' : 'normal');
    pdf.setFontSize(size);
    const lines = pdf.splitTextToSize(text, contentWidth - 10);
    lines.forEach(line => {
      pdf.text(line, pageWidth / 2, yPos, { align: 'center' });
      yPos += size * 0.5 + 3;
    });
  };

  const addFooter = (pageNum: number, total: number) => {
    pdf.setFont('times', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Miras | www.miras.com | support@miras.com', margin, pageHeight - 13);
    pdf.text('Created by Ahmed Faraz & Yazaan Shaikh', margin, pageHeight - 8);
    pdf.text(`Page ${pageNum} of ${total}`, pageWidth - margin - 20, pageHeight - 10);
  };

  const addTable = (headers: string[], rows: string[][], startY: number) => {
    const cellHeight = 8;
    const colWidth = contentWidth / headers.length;
    pdf.setLineWidth(0.5);

    // Header
    pdf.setFillColor(240, 240, 240);
    pdf.rect(margin, startY, contentWidth, cellHeight, 'FD');
    pdf.setFont('times', 'bold');
    pdf.setFontSize(11);
    headers.forEach((h, i) => {
      pdf.text(h, margin + i * colWidth + 2, startY + 5);
    });

    // Rows
    pdf.setFont('times', 'normal');
    pdf.setFontSize(10);
    let y = startY + cellHeight;
    rows.forEach(r => {
      pdf.rect(margin, y, contentWidth, cellHeight, 'S');
      r.forEach((c, i) => {
        pdf.text(String(c), margin + i * colWidth + 2, y + 5);
      });
      y += cellHeight;
    });
    return y + 4;
  };

  // --------------------------
  // PAGE 1 – Cover
  // --------------------------
  pdf.setFillColor(teal[0], teal[1], teal[2]);
  pdf.rect(0, 0, pageWidth, 70, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('times', 'bold');
  pdf.setFontSize(38);
  pdf.text('Miras', pageWidth / 2, 35, { align: 'center' });
  pdf.setFontSize(20);
  pdf.text('Action Packet', pageWidth / 2, 50, { align: 'center' });

  pdf.setTextColor(0, 0, 0);
  yPos = 85;
  pdf.setFont('times', 'normal');
  pdf.setFontSize(14);
  pdf.text(`Date: 2nd November 2025`, pageWidth / 2, yPos, { align: 'center' });
  yPos += 8;
  pdf.text(`State: Illinois`, pageWidth / 2, yPos, { align: 'center' });
  yPos += 8;
  pdf.text(`For: Ahmad Khan`, pageWidth / 2, yPos, { align: 'center' });

  // Disclaimer box
  const boxY = pageHeight - 60;
  pdf.setDrawColor(217, 83, 79);
  pdf.setLineWidth(1);
  pdf.setFillColor(255, 245, 245);
  pdf.rect(margin, boxY, contentWidth, 28, 'FD');
  pdf.setTextColor(217, 83, 79);
  pdf.setFont('times', 'bold');
  pdf.text('IMPORTANT DISCLAIMER', margin + 5, boxY + 7);
  pdf.setTextColor(0, 0, 0);
  pdf.setFont('times', 'normal');
  pdf.setFontSize(10);
  const disclaimer =
    'This packet is educational and not legal advice. Consult an Illinois-licensed estate attorney and a qualified Islamic scholar before implementing any plan generated here.';
  pdf.text(pdf.splitTextToSize(disclaimer, contentWidth - 10), margin + 5, boxY + 14);

  addPageBorder();

  // --------------------------
  // PAGE 2 – Asset Summary + Wasiyyah + Sharia
  // --------------------------
  pdf.addPage();
  addPageBorder();
  yPos = margin;

  yPos = addTitle('Asset Summary', yPos);

  const assetRows = data.assets.map(a => [
    a.name,
    `$${a.value.toLocaleString()}`,
    a.ownerType === 'sole' ? 'Probate' : 'Non-Probate',
  ]);
  yPos = addTable(['Asset Name', 'Value', 'Status'], assetRows, yPos + 5);

  yPos = addTitle('Wassiyah & Charity Allocation', yPos + 5);
  addCenteredText(`Wassiyah Allocation: ${data.preferences.wasiyyahPercent || 0}%`);
  addCenteredText(
    data.preferences.charityPercent
      ? `Charity Allocation: ${data.preferences.charityPercent}%`
      : `Charity Amount: $${data.preferences.charityAmount || 0}`
  );

  yPos = addTitle('Sharia Distribution', yPos + 8);
  const shariaRows = data.computed.shariaShares.map(s => [
    s.heirName || s.relation,
    s.relation,
    s.fraction,
    `${s.percentage.toFixed(2)}%`,
  ]);
  addTable(['Heir', 'Relation', 'Fraction', 'Percentage'], shariaRows, yPos + 5);

  // --------------------------
  // PAGE 3 – Legal + Actions
  // --------------------------
  pdf.addPage();
  addPageBorder();
  yPos = margin;

  yPos = addTitle('Illinois Legal Checklist', yPos);
  pdf.setFont('times', 'normal');
  pdf.setFontSize(11);
  const checklist = [
    'Two-witness rule: A valid Illinois will requires your signature plus two witnesses who are not beneficiaries.',
    'Holographic wills: Handwritten wills without proper witnesses are NOT valid in Illinois.',
    'Surviving spouse statutory share: If your spouse survives, Illinois law allows them to claim an elective share of approximately one-third of your estate if descendants exist.',
    'Signature formalities: The will must be signed by you (or someone at your direction in your presence) and by two witnesses in your presence.',
    'Non-probate assets: Assets with beneficiary designations or held in joint tenancy pass outside your will and are not subject to its provisions.',
  ];
  const listX = margin + 5;
  checklist.forEach(item => {
    const wrapped = pdf.splitTextToSize(item, contentWidth - 15);
    pdf.text('•', listX - 5, yPos);
    pdf.text(wrapped, listX, yPos);
    yPos += wrapped.length * 5 + 2;
  });

  yPos = addTitle('Prioritized Action Steps', yPos + 5);
  data.computed.actionItems.forEach((item, idx) => {
    pdf.setFont('times', 'bold');
    pdf.setFontSize(12);
    pdf.text(`${idx + 1}. ${item.title}`, margin, yPos);
    yPos += 6;
    pdf.setFont('times', 'normal');
    pdf.setFontSize(11);
    const wrapped = pdf.splitTextToSize(item.description, contentWidth - 10);
    wrapped.forEach(line => {
      pdf.text(line, margin, yPos);
      yPos += 5;
    });
    if (item.script) {
      pdf.setFontSize(10);
      const script = pdf.splitTextToSize(item.script, contentWidth - 15);
      script.forEach(line => {
        pdf.text(line, margin, yPos);
        yPos += 4;
      });
    }
    yPos += 6;
  });

  // ---- Footer ----
  const total = pdf.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    pdf.setPage(i);
    addFooter(i, total);
  }

  pdf.save(`Miras-Action-Packet-${data.date}.pdf`);
}
