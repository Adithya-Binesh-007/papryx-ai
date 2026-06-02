import jsPDF from "jspdf";

export interface PaperSubQuestion { label?: string; text: string; marks?: number }
export interface PaperQuestion {
  number: string | number;
  text?: string;
  marks?: number;
  type?: string;
  sub_questions?: PaperSubQuestion[];
  or_with_next?: boolean;
}
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
const CONTENT_W = PAGE_W - 2 * MARGIN;

function ensureSpace(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > PAGE_H - MARGIN - 8) {
    doc.addPage();
    return MARGIN;
  }
  return y;
}

function wrap(doc: jsPDF, text: string, maxWidth: number): string[] {
  return doc.splitTextToSize(text || "", maxWidth);
}

// Normalise leading whitespace and clean stray markdown markers from AI output.
function clean(text: string): string {
  return (text || "")
    .replace(/\*\*/g, "")
    .replace(/^\s+|\s+$/g, "")
    .replace(/\s+\n/g, "\n");
}

export function downloadPaperPdf(paper: QuestionPaper, answerKey?: AnswerItem[]) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = MARGIN;

  // ===== Header block =====
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  const titleLines = wrap(doc, paper.title || "Question Paper", CONTENT_W);
  for (const line of titleLines) {
    doc.text(line, PAGE_W / 2, y, { align: "center" });
    y += 7;
  }
  y += 1;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  const top: string[] = [];
  if (paper.course) top.push(paper.course);
  if (paper.subject) top.push(paper.subject);
  if (top.length) { doc.text(top.join("   |   "), PAGE_W / 2, y, { align: "center" }); y += 5; }

  const bottom: string[] = [];
  if (paper.duration) bottom.push(`Time: ${paper.duration}`);
  if (paper.totalMarks) bottom.push(`Maximum Marks: ${paper.totalMarks}`);
  if (bottom.length) { doc.text(bottom.join("   |   "), PAGE_W / 2, y, { align: "center" }); y += 5; }

  y += 2;
  doc.setDrawColor(60); doc.setLineWidth(0.4);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 6;

  // ===== General instructions =====
  if (paper.instructions?.length) {
    doc.setFont("helvetica", "bold"); doc.setFontSize(11);
    y = ensureSpace(doc, y, 8);
    doc.text("General Instructions", MARGIN, y); y += 5;
    doc.setFont("helvetica", "normal"); doc.setFontSize(10);
    let idx = 1;
    for (const ins of paper.instructions) {
      const prefix = `${idx}. `;
      const lines = wrap(doc, prefix + clean(ins), CONTENT_W - 4);
      y = ensureSpace(doc, y, lines.length * 4.6 + 1);
      for (let i = 0; i < lines.length; i++) {
        doc.text(lines[i], MARGIN + 2, y);
        y += 4.6;
      }
      idx++;
    }
    y += 3;
    doc.setDrawColor(180); doc.setLineWidth(0.2);
    doc.line(MARGIN, y, PAGE_W - MARGIN, y);
    y += 5;
  }

  // ===== Sections =====
  for (const section of paper.sections) {
    y = ensureSpace(doc, y, 16);

    // Section heading
    doc.setFont("helvetica", "bold"); doc.setFontSize(12.5);
    const name = (section.name || "").toUpperCase();
    doc.text(name, PAGE_W / 2, y, { align: "center" });
    y += 5;

    if (section.instructions) {
      doc.setFont("helvetica", "italic"); doc.setFontSize(9.5);
      const lines = wrap(doc, `(${clean(section.instructions)})`, CONTENT_W);
      for (const l of lines) {
        y = ensureSpace(doc, y, 4.4);
        doc.text(l, PAGE_W / 2, y, { align: "center" });
        y += 4.4;
      }
    }
    y += 3;
    doc.setDrawColor(200); doc.setLineWidth(0.15);
    doc.line(MARGIN + 30, y, PAGE_W - MARGIN - 30, y);
    y += 5;

    // Questions
    doc.setFontSize(10.8);
    const baseNum = (n: unknown) => String(n ?? "").match(/^\d+/)?.[0] ?? "";
    for (let qi = 0; qi < section.questions.length; qi++) {
      const q = section.questions[qi];
      const numStr = `${q.number}.`;
      const marksStr = q.marks ? `[${q.marks}]` : "";
      const marksW = marksStr ? doc.getTextWidth(marksStr) + 2 : 0;
      const numW = 10; // reserved width for "12."
      const textW = CONTENT_W - numW - marksW - 2;

      const cleaned = clean(q.text).replace(/\s*\n\s*/g, "\n");
      // Split by newlines first so sub-parts (a) (b) keep on their own lines
      const paragraphs = cleaned.split("\n").filter((p) => p.trim().length > 0);
      const allLines: string[] = [];
      paragraphs.forEach((p, pi) => {
        const wrapped = wrap(doc, p, textW);
        allLines.push(...wrapped);
        if (pi < paragraphs.length - 1) allLines.push("");
      });

      const blockHeight = allLines.length * 5 + 2;
      y = ensureSpace(doc, y, blockHeight);

      // Number
      doc.setFont("helvetica", "bold");
      doc.text(numStr, MARGIN, y);
      // First line text
      doc.setFont("helvetica", "normal");
      for (let i = 0; i < allLines.length; i++) {
        if (allLines[i] !== "") doc.text(allLines[i], MARGIN + numW, y);
        if (i === 0 && marksStr) {
          doc.setFont("helvetica", "bold");
          doc.text(marksStr, PAGE_W - MARGIN, y, { align: "right" });
          doc.setFont("helvetica", "normal");
        }
        y += 5;
      }
      y += 1.5;

      // "OR" divider between paired sub-questions sharing the same base number (e.g., 9(a) OR 9(b))
      const next = section.questions[qi + 1];
      if (next && baseNum(q.number) && baseNum(q.number) === baseNum(next.number)) {
        y = ensureSpace(doc, y, 8);
        doc.setFont("helvetica", "bold"); doc.setFontSize(10);
        doc.text("OR", PAGE_W / 2, y + 2, { align: "center" });
        doc.setFont("helvetica", "normal"); doc.setFontSize(10.8);
        y += 6;
      }
    }
    y += 4;
  }

  // ===== Footer page numbers + brand =====
  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    doc.setFontSize(8.5); doc.setTextColor(130);
    doc.text(`Page ${p} of ${total}`, PAGE_W / 2, PAGE_H - 8, { align: "center" });
    doc.text("Generated by ExamForge AI", PAGE_W - MARGIN, PAGE_H - 8, { align: "right" });
    doc.setTextColor(0);
  }

  // ===== Answer key =====
  if (answerKey?.length) {
    doc.addPage(); y = MARGIN;
    doc.setFont("helvetica", "bold"); doc.setFontSize(15);
    doc.text("Answer Key", PAGE_W / 2, y, { align: "center" }); y += 6;
    if (paper.subject) {
      doc.setFont("helvetica", "normal"); doc.setFontSize(10);
      doc.text(paper.subject + (paper.course ? `  |  ${paper.course}` : ""), PAGE_W / 2, y, { align: "center" });
      y += 5;
    }
    y += 2;
    doc.setDrawColor(60); doc.setLineWidth(0.4);
    doc.line(MARGIN, y, PAGE_W - MARGIN, y);
    y += 6;

    doc.setFont("helvetica", "normal"); doc.setFontSize(10.5);
    const numW = 12;
    for (const a of answerKey) {
      const numStr = `${a.number}.`;
      const cleaned = clean(a.answer).replace(/\s*\n\s*/g, "\n");
      const paragraphs = cleaned.split("\n").filter(Boolean);
      const lines: string[] = [];
      paragraphs.forEach((p, pi) => {
        lines.push(...wrap(doc, p, CONTENT_W - numW));
        if (pi < paragraphs.length - 1) lines.push("");
      });
      const block = lines.length * 5 + 3;
      y = ensureSpace(doc, y, block);
      doc.setFont("helvetica", "bold"); doc.text(numStr, MARGIN, y);
      doc.setFont("helvetica", "normal");
      for (let i = 0; i < lines.length; i++) {
        if (lines[i] !== "") doc.text(lines[i], MARGIN + numW, y);
        y += 5;
      }
      y += 2;
    }

    const totalAfter = doc.getNumberOfPages();
    for (let p = total + 1; p <= totalAfter; p++) {
      doc.setPage(p);
      doc.setFontSize(8.5); doc.setTextColor(130);
      doc.text(`Answer Key — Page ${p - total}`, PAGE_W / 2, PAGE_H - 8, { align: "center" });
      doc.text("Generated by ExamForge AI", PAGE_W - MARGIN, PAGE_H - 8, { align: "right" });
      doc.setTextColor(0);
    }
  }

  const fname = (paper.title || "question-paper").replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  doc.save(`${fname}.pdf`);
}
