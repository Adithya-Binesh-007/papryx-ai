import jsPDF from "jspdf";

export interface PaperQuestion { number: string | number; text: string; marks?: number; type?: string }
export interface PaperSection { name: string; instructions?: string; questions: PaperQuestion[] }
export interface QuestionPaper {
  title: string;
  subject?: string;
  course?: string;
  totalMarks?: number;
  duration?: string;
  instructions?: string[];
  sections: PaperSection[];
}
export interface AnswerItem { number: string | number; answer: string }

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 18;

function checkPage(doc: jsPDF, y: number, needed = 10): number {
  if (y + needed > PAGE_H - MARGIN) {
    doc.addPage();
    return MARGIN;
  }
  return y;
}

function wrapText(doc: jsPDF, text: string, maxWidth: number): string[] {
  return doc.splitTextToSize(text, maxWidth);
}

export function downloadPaperPdf(paper: QuestionPaper, answerKey?: AnswerItem[]) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = MARGIN;

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(paper.title || "Question Paper", PAGE_W / 2, y, { align: "center" });
  y += 8;

  // Sub-header
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  const meta: string[] = [];
  if (paper.subject) meta.push(`Subject: ${paper.subject}`);
  if (paper.course) meta.push(`Course: ${paper.course}`);
  if (meta.length) { doc.text(meta.join("   |   "), PAGE_W / 2, y, { align: "center" }); y += 6; }
  const meta2: string[] = [];
  if (paper.duration) meta2.push(`Time: ${paper.duration}`);
  if (paper.totalMarks) meta2.push(`Max Marks: ${paper.totalMarks}`);
  if (meta2.length) { doc.text(meta2.join("   |   "), PAGE_W / 2, y, { align: "center" }); y += 8; }

  doc.setDrawColor(180); doc.line(MARGIN, y, PAGE_W - MARGIN, y); y += 6;

  if (paper.instructions?.length) {
    doc.setFont("helvetica", "bold"); doc.setFontSize(11);
    doc.text("Instructions:", MARGIN, y); y += 5;
    doc.setFont("helvetica", "normal"); doc.setFontSize(10);
    for (const ins of paper.instructions) {
      const lines = wrapText(doc, `• ${ins}`, PAGE_W - 2 * MARGIN);
      for (const l of lines) { y = checkPage(doc, y); doc.text(l, MARGIN, y); y += 5; }
    }
    y += 3;
  }

  // Sections
  for (const section of paper.sections) {
    y = checkPage(doc, y, 14);
    doc.setFont("helvetica", "bold"); doc.setFontSize(13);
    doc.text(section.name, MARGIN, y); y += 6;
    if (section.instructions) {
      doc.setFont("helvetica", "italic"); doc.setFontSize(10);
      const lines = wrapText(doc, section.instructions, PAGE_W - 2 * MARGIN);
      for (const l of lines) { y = checkPage(doc, y); doc.text(l, MARGIN, y); y += 5; }
      y += 1;
    }
    doc.setFont("helvetica", "normal"); doc.setFontSize(11);
    for (const q of section.questions) {
      const marks = q.marks ? `[${q.marks}]` : "";
      const prefix = `${q.number}. `;
      const textWidth = PAGE_W - 2 * MARGIN - 14;
      const lines = wrapText(doc, prefix + q.text, textWidth);
      y = checkPage(doc, y, lines.length * 5 + 2);
      for (let i = 0; i < lines.length; i++) {
        doc.text(lines[i], MARGIN, y);
        if (i === 0 && marks) doc.text(marks, PAGE_W - MARGIN, y, { align: "right" });
        y += 5;
      }
      y += 2;
    }
    y += 4;
  }

  // Page numbers
  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    doc.setFontSize(9); doc.setTextColor(140);
    doc.text(`Page ${p} of ${total}`, PAGE_W / 2, PAGE_H - 8, { align: "center" });
    doc.setTextColor(0);
  }

  // Answer key
  if (answerKey?.length) {
    doc.addPage(); y = MARGIN;
    doc.setFont("helvetica", "bold"); doc.setFontSize(16);
    doc.text("Answer Key", PAGE_W / 2, y, { align: "center" }); y += 8;
    doc.setDrawColor(180); doc.line(MARGIN, y, PAGE_W - MARGIN, y); y += 6;
    doc.setFont("helvetica", "normal"); doc.setFontSize(11);
    for (const a of answerKey) {
      const lines = wrapText(doc, `${a.number}. ${a.answer}`, PAGE_W - 2 * MARGIN);
      y = checkPage(doc, y, lines.length * 5 + 2);
      for (const l of lines) { y = checkPage(doc, y); doc.text(l, MARGIN, y); y += 5; }
      y += 2;
    }
  }

  const fname = (paper.title || "question-paper").replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  doc.save(`${fname}.pdf`);
}
