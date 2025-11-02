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

  const teal = [15, 122, 117];
  const red = [217, 83, 79];

  const addPageBorder = () => {
    pdf.setDrawColor(...teal);
    pdf.setLineWidth(2);
    pdf.rect(5, 5, pageWidth - 10, pageHeight - 10);
  };

  const addText = (text: string, fontSize: number, isBold = false, lineSpacing = 6, align: 'center' | 'left' = 'center', x?: number) => {
    pdf.setFont('times', isBold ? 'bold' : 'normal');
    pdf.setFontSize(fontSize);
    const lines = pdf.splitTextToSize(text, contentWidth - 20);
    lines.forEach(line => {
      addPageIfNeeded(fontSize * 0.6 + lineSpacing);
      const textX = x ?? (align === 'center' ? pageWidth / 2 : margin);
      pdf.text(line, textX, yPos, { align });
      yPos += fontSize * 0.6 + lineSpacing / 2;
    });
    yPos += 3;
  };

  const addPageIfNeeded = (height: number) => {
    if (yPos + height > pageHeight - margin - 25) {
      pdf.addPage();
      yPos = margin;
      addPageBorder();
      return true;
    }
    return false;
  };

  const addLine = (length?: number) => {
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPos, (length ?? contentWidth) + margin, yPos);
    yPos += 5;
  };

  // ---------------------
  // Page 1: Cover
  // ---------------------
  pdf.setFillColor(...teal);
  pdf.rect(0, 0, pageWidth, 70, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(38);
  pdf.setFont('times', 'bold');
  pdf.text('Miras', pageWidth / 2, 35, { align: 'center' });
  pdf.setFontSize(24);
  pdf.setFont('times', 'normal');
  pdf.text('Action Packet', pageWidth / 2, 55, { align: 'center' });

  // Disclaimer Box near bottom
  const disclaimerHeight = 40;
  const disclaimerY = pageHeight - margin - disclaimerHeight - 10;
  pdf.setDrawColor(...red);
  pdf.setLineWidth(1);
  pdf.setFillColor(255, 245, 245);
  pdf.rect(margin, disclaimerY, contentWidth, disclaimerHeight, 'F');
  pdf.rect(margin, disclaimerY, contentWidth, disclaimerHeight, 'S');

  pdf.setTextColor(...red);
  pdf.setFontSize(12);
  pdf.setFont('times', 'bold');
  pdf.text('IMPORTANT DISCLAIMER', pageWidth / 2, disclaimerY + 12, { align: 'center' });

  pdf.setFont('times', 'normal');
  pdf.setTextColor(0, 0, 0);
  const disclaimerText =
    'This packet is educational and not legal advice. Consult an Illinois-licensed estate attorney and a qualified Islamic scholar before implementing any plan generated here.';
  pdf.splitTextToSize(disclaimerText, contentWidth - 20).forEach((line, i) => {
    pdf.text(line, pageWidth / 2, disclaimerY + 20 + i * 6, { align: 'center' });
  });

  // ---------------------
  // Page 2: Asset Summary + Wassiyah + Sharia Distribution
  // ---------------------
  pdf.addPage();
  yPos = margin;
  addPageBorder();
  addText('Asset Summary', 20, true);

  pdf.setFontSize(12);
  pdf.setFont('times', 'bold');
  const tableStartX = pageWidth / 2 - 60;
  const colWidths = [60, 40, 40];
  const headers = ['Asset Name', 'Value', 'Status'];
  headers.forEach((h, i) => pdf.text(h, tableStartX + colWidths.slice(0, i).reduce((a, b) => a + b, 0) + colWidths[i]/2, yPos, { align: 'center' }));
  yPos += 8;
  addLine();

  pdf.setFont('times', 'normal');
  data.assets.forEach(asset => {
    addPageIfNeeded(10);
    const status = asset.ownerType !== 'sole' || asset.beneficiaries.length > 0 ? 'Non-Probate' : 'Probate';
    const values = [asset.name, `$${asset.value.toLocaleString()}`, status];
    values.forEach((v, i) => {
      pdf.text(v, tableStartX + colWidths.slice(0, i).reduce((a,b)=>a+b,0)+colWidths[i]/2, yPos, { align: 'center' });
    });
    yPos += 10;
  });

  yPos += 5;
  addText('Wassiyah & Charity Allocation', 16, true);
  if (data.preferences.wasiyyahPercent) addText(`Wassiyah Allocation: ${data.preferences.wasiyyahPercent}%`, 12);
  if (data.preferences.charityAmount) addText(`Charity Amount: $${data.preferences.charityAmount.toLocaleString()}`, 12);
  else if (data.preferences.charityPercent) addText(`Charity Percentage: ${data.preferences.charityPercent}%`, 12);

  // Sharia Distribution table below
  yPos += 5;
  addText('Sharia Distribution', 16, true);
  addText('Calculated using Sunni fiqh rules based on your heirs', 12);
  pdf.setFontSize(12);
  pdf.setFont('times', 'bold');
  const shariaX = pageWidth/2 - 90;
  const shariaCols = [50, 40, 40, 30];
  const shariaHeaders = ['Heir', 'Relation', 'Fraction', 'Percentage'];
  shariaHeaders.forEach((h,i) => pdf.text(h, shariaX + shariaCols.slice(0,i).reduce((a,b)=>a+b,0)+shariaCols[i]/2, yPos, { align:'center' }));
  yPos += 8;
  addLine();

  pdf.setFont('times', 'normal');
  data.computed.shariaShares.forEach(share => {
    addPageIfNeeded(10);
    const values = [share.heirName || share.relation, share.relation || '', share.fraction, `${share.percentage.toFixed(2)}%`];
    values.forEach((v,i) => pdf.text(v, shariaX + shariaCols.slice(0,i).reduce((a,b)=>a+b,0)+shariaCols[i]/2, yPos, { align:'center' }));
    yPos += 10;
  });

  // ---------------------
  // Page 3: Legal Checklist + Action Steps
  // ---------------------
  pdf.addPage();
  yPos = margin;
  addPageBorder();
  addText('Illinois Legal Checklist', 18, true);
  pdf.setFontSize(12);
  pdf.setFont('times','normal');
  const checklist = [
    'Two-witness rule: A valid Illinois will requires your signature plus two witnesses who are not beneficiaries.',
    'Holographic wills: Handwritten wills without proper witnesses are NOT valid in Illinois.',
    'Surviving spouse statutory share: If your spouse survives, Illinois law allows them to claim an elective share of approximately one-third of your estate if descendants exist.',
    'Signature formalities: The will must be signed by you (or someone at your direction in your presence) and by two witnesses in your presence.',
    'Non-probate assets: Assets with beneficiary designations or held in joint tenancy pass outside your will and are not subject to its provisions.'
  ];

  checklist.forEach((item,i)=>{
    addPageIfNeeded(12);
    pdf.text(`${i+1}.`, margin+5, yPos);
    pdf.splitTextToSize(item, contentWidth - 30).forEach((line,j)=>{
      pdf.text(line, margin+15, yPos + j*6);
    });
    yPos += pdf.splitTextToSize(item, contentWidth-30).length*6 + 5;
  });

  // Prioritized Action Steps
  addText('Prioritized Action Steps', 18, true);
  addText('Top recommendations based on your estate structure', 12);

  data.computed.actionItems.forEach((item,i)=>{
    addPageIfNeeded(30);
    pdf.setFont('times','bold');
    pdf.text(`${i+1}. ${item.title}`, pageWidth/2, yPos, { align:'center' });
    yPos += 8;
    pdf.setFont('times','normal');
    pdf.setFontSize(11);
    pdf.splitTextToSize(item.description, contentWidth-40).forEach(line=>{
      pdf.text(line, pageWidth/2, yPos, { align:'center' });
      yPos += 6;
    });

    if(item.script){
      yPos += 4;
      pdf.setFillColor(245,245,245);
      pdf.rect(margin+20, yPos-2, contentWidth-40, 20, 'F');
      pdf.setFontSize(10);
      pdf.setTextColor(80,80,80);
      pdf.text('Sample script:', pageWidth/2, yPos+4, { align:'center' });
      yPos += 8;
      pdf.splitTextToSize(item.script, contentWidth-50).forEach(line=>{
        pdf.text(line, pageWidth/2, yPos, { align:'center' });
        yPos += 6;
      });
      yPos += 4;
      pdf.setTextColor(0,0,0);
    }
    yPos += 10;
  });

  // ---------------------
  // Footer for all pages
  // ---------------------
  const pageCount = pdf.getNumberOfPages();
  for(let i=1;i<=pageCount;i++){
    pdf.setPage(i);
    pdf.setFontSize(7);
    pdf.setTextColor(150,150,150);
    pdf.setLineWidth(0.5);
    pdf.line(margin, pageHeight-18,pageWidth-margin,pageHeight-18);
    pdf.setFontSize(8);
    pdf.text('Miras | www.miras.com | support@miras.com', margin, pageHeight-13);
    pdf.setFontSize(7);
    pdf.text('Created by Ahmed Faraz & Yazaan Shaikh', margin, pageHeight-8);
    pdf.text(`Page ${i} of ${pageCount}`, pageWidth-margin-20, pageHeight-13);
  }

  pdf.save(`Miras-Action-Packet.pdf`);
}
