// File: src/lib/pdfGenerator.ts
import jsPDF from "jspdf";
import { SessionData } from "@/types/miras";

export async function generateActionPacketPDF(data: SessionData) {
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let yPos = margin;

  // ---------- UTILITIES ----------
  const addPageIfNeeded = (h: number) => {
    if (yPos + h > pageHeight - margin - 20) {
      pdf.addPage();
      drawPageBorder();
      yPos = margin;
    }
  };

  const addText = (
    t: string,
    size = 12,
    bold = false,
    color: [number, number, number] = [0, 0, 0],
    align: "left" | "center" = "left"
  ) => {
    pdf.setFont("times", bold ? "bold" : "normal");
    pdf.setFontSize(size);
    pdf.setTextColor(...color);
    pdf.text(t, pageWidth / 2, yPos, { align });
    yPos += size * 0.5 + 4;
  };

  const underline = (txt: string) => {
    const width = pdf.getTextWidth(txt);
    const y = yPos - 3;
    pdf.setDrawColor(0);
    pdf.setLineWidth(0.5);
    pdf.line((pageWidth - width) / 2, y, (pageWidth + width) / 2, y);
  };

  const drawPageBorder = () => {
    pdf.setDrawColor(15, 122, 117);
    pdf.setLineWidth(2);
    pdf.rect(5, 5, pageWidth - 10, pageHeight - 10, "S");
  };

  // ---------- PAGE 1 ----------
  drawPageBorder();
  pdf.setFont("times", "bold");
  pdf.setFontSize(38);
  pdf.setTextColor(15, 122, 117);
  pdf.text("Miras", pageWidth / 2, pageHeight / 2 - 30, { align: "center" });

  pdf.setFontSize(20);
  pdf.setFont("times", "normal");
  pdf.text("Action Packet", pageWidth / 2, pageHeight / 2, { align: "center" });

  pdf.setFontSize(14);
  pdf.setTextColor(11, 21, 32);
  pdf.text("Date: 2nd November 2025", pageWidth / 2, pageHeight / 2 + 20, {
    align: "center",
  });
  pdf.text("State: Illinois", pageWidth / 2, pageHeight / 2 + 30, {
    align: "center",
  });
  pdf.text("For: Ahmad Khan", pageWidth / 2, pageHeight / 2 + 40, {
    align: "center",
  });

  // Disclaimer box — FIXED (only one visible border)
  const boxH = 25;
  pdf.setDrawColor(217, 83, 79);
  pdf.setFillColor(255, 245, 245);
  pdf.rect(margin, pageHeight - margin - boxH, contentWidth, boxH, "FD"); // single stroke+fill
  pdf.setFont("times", "bold");
  pdf.setFontSize(10);
  pdf.setTextColor(217, 83, 79);
  pdf.text("IMPORTANT DISCLAIMER", margin + 5, pageHeight - margin - boxH + 7);
  pdf.setFont("times", "normal");
  pdf.setTextColor(0, 0, 0);
  pdf.text(
    "This packet is educational and not legal advice. Consult an Illinois-licensed estate attorney and a qualified Islamic scholar before implementing any plan.",
    margin + 5,
    pageHeight - margin - boxH + 15,
    { maxWidth: contentWidth - 10 }
  );

  // ---------- PAGE 2 ----------
  pdf.addPage();
  drawPageBorder();
  yPos = margin + 8;

  // --- Asset Summary ---
  addText("Asset Summary", 16, true, [0, 0, 0], "center");
  underline("Asset Summary");
  yPos += 3;

  const tX = margin + 10;
  const tW = contentWidth - 20;
  const colW = [60, 40, 40];
  pdf.setLineWidth(0.5);
  pdf.setDrawColor(0);

  // Header
  pdf.rect(tX, yPos, tW, 10, "S");
  pdf.setFont("times", "bold");
  pdf.setFontSize(12);
  pdf.text("Asset Name", tX + 2, yPos + 7);
  pdf.text("Value", tX + colW[0] + 2, yPos + 7);
  pdf.text("Status", tX + colW[0] + colW[1] + 2, yPos + 7);
  yPos += 10;

  // Rows
  pdf.setFont("times", "normal");
  data.assets.forEach((a) => {
    addPageIfNeeded(10);
    pdf.rect(tX, yPos, tW, 10, "S");
    pdf.text(a.name, tX + 2, yPos + 7);
    pdf.text(`$${a.value.toLocaleString()}`, tX + colW[0] + 2, yPos + 7);
    const status =
      a.ownerType !== "sole" || a.beneficiaries.length > 0
        ? "Non-Probate"
        : "Probate";
    pdf.text(status, tX + colW[0] + colW[1] + 2, yPos + 7);
    yPos += 10;
  });

  yPos += 8;

  // --- Wassiyah & Charity ---
  addText("Wassiyah & Charity Allocation", 16, true, [0, 0, 0], "center");
  underline("Wassiyah & Charity Allocation");
  yPos += 3;

  if (data.preferences.wasiyyahPercent)
    addText(
      `Wassiyah Allocation: ${data.preferences.wasiyyahPercent}%`,
      12,
      false,
      [0, 0, 0],
      "center"
    );
  if (data.preferences.charityAmount)
    addText(
      `Charity Amount: $${data.preferences.charityAmount.toLocaleString()}`,
      12,
      false,
      [0, 0, 0],
      "center"
    );
  else if (data.preferences.charityPercent)
    addText(
      `Charity Percentage: ${data.preferences.charityPercent}%`,
      12,
      false,
      [0, 0, 0],
      "center"
    );

  yPos += 5;

  // --- Sharia Distribution ---
  addText("Sharia Distribution", 16, true, [0, 0, 0], "center");
  underline("Sharia Distribution");
  yPos += 5;

  const relCols = [50, 40, 30, 30];
  pdf.setFont("times", "bold");
  pdf.setFontSize(12);
  pdf.setLineWidth(0.5);
  pdf.rect(tX, yPos, tW, 10, "S");
  pdf.text("Heir", tX + 2, yPos + 7);
  pdf.text("Relation", tX + relCols[0] + 2, yPos + 7);
  pdf.text("Fraction", tX + relCols[0] + relCols[1] + 2, yPos + 7);
  pdf.text("Percentage", tX + relCols[0] + relCols[1] + relCols[2] + 2, yPos + 7);
  yPos += 10;

  pdf.setFont("times", "normal");
  data.computed.shariaShares.forEach((s) => {
    addPageIfNeeded(10);
    pdf.rect(tX, yPos, tW, 10, "S");
    pdf.text(s.heirName || "", tX + 2, yPos + 7);
    pdf.text(s.relation || "", tX + relCols[0] + 2, yPos + 7);
    pdf.text(s.fraction, tX + relCols[0] + relCols[1] + 2, yPos + 7);
    pdf.text(
      `${s.percentage.toFixed(2)}%`,
      tX + relCols[0] + relCols[1] + relCols[2] + 2,
      yPos + 7
    );
    yPos += 10;
  });

  // ---------- PAGE 3 ----------
  pdf.addPage();
  drawPageBorder();
  yPos = margin + 8;

  // --- Illinois Legal Checklist ---
  addText("Illinois Legal Checklist", 16, true, [0, 0, 0], "center");
  underline("Illinois Legal Checklist");
  yPos += 5;
  pdf.setFont("times", "normal");
  pdf.setFontSize(12);

  const checklist = [
    "Two-witness rule: A valid Illinois will requires your signature plus two witnesses who are not beneficiaries.",
    "Holographic wills: Handwritten wills without proper witnesses are NOT valid in Illinois.",
    "Surviving spouse statutory share: If your spouse survives, Illinois law allows them to claim an elective share of approximately one-third of your estate if descendants exist.",
    "Signature formalities: The will must be signed by you (or someone at your direction in your presence) and by two witnesses in your presence.",
    "Non-probate assets: Assets with beneficiary designations or held in joint tenancy pass outside your will and are not subject to its provisions.",
  ];

  checklist.forEach((c) => {
    addPageIfNeeded(7);
    const wrapped = pdf.splitTextToSize(c, contentWidth - 10); // fixed right margin overflow
    pdf.text(wrapped, margin + 5, yPos);
    yPos += wrapped.length * 6;
  });

  yPos += 8;

  // --- Prioritized Action Steps ---
  addText("Prioritized Action Steps", 16, true, [0, 0, 0], "center");
  underline("Prioritized Action Steps");
  yPos += 6;

  pdf.setFont("times", "normal");
  pdf.setFontSize(12);
  data.computed.actionItems.forEach((i) => {
    addPageIfNeeded(20);
    pdf.setFont("times", "bold");
    pdf.text(`${i.priority}. ${i.title}`, margin + 5, yPos);
    yPos += 6;

    pdf.setFont("times", "normal");
    const desc = pdf.splitTextToSize(i.description, contentWidth - 10);
    desc.forEach((l) => {
      pdf.text(l, margin + 10, yPos);
      yPos += 5;
    });

    if (i.script) {
      const script = pdf.splitTextToSize(i.script, contentWidth - 20);
      script.forEach((l) => {
        pdf.text(l, margin + 12, yPos);
        yPos += 5;
      });
      yPos += 3;
    }

    yPos += 5;
  });

  // ---------- FOOTERS ----------
  const total = pdf.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    pdf.setPage(p);
    pdf.setFontSize(8);
    pdf.setTextColor(150);
    pdf.line(margin, pageHeight - 18, pageWidth - margin, pageHeight - 18);
    pdf.text("Miras | www.miras.com | support@miras.com", margin, pageHeight - 14);
    pdf.text("Created by Ahmed Faraz & Yazaan Shaikh", margin, pageHeight - 9);
    pdf.text(`Page ${p} of ${total}`, pageWidth - margin - 20, pageHeight - 14);
  }

  pdf.save(`Miras-Action-Packet-${data.date}.pdf`);
}
