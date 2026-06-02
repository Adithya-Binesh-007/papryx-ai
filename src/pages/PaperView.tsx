import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlowOrb } from "@/components/GlowOrb";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  ArrowLeft, Download, Copy, Pencil, Save, X, Loader2, FileText,
} from "lucide-react";
import { downloadPaperPdf, QuestionPaper, AnswerItem } from "@/lib/pdf";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface Row {
  id: string; title: string; subject: string; course: string | null;
  difficulty: string | null; marks: number | null; exam_type: string | null;
  question_paper: QuestionPaper; answer_key: AnswerItem[] | null;
}

function paperToText(paper: QuestionPaper): string {
  let out = `${paper.title}\n`;
  if (paper.subject) out += `Subject: ${paper.subject}\n`;
  if (paper.totalMarks) out += `Total Marks: ${paper.totalMarks}\n`;
  out += "\n";
  for (const s of paper.sections) {
    out += `\n${s.name}\n`;
    if (s.instructions) out += `${s.instructions}\n`;
    for (const q of s.questions) {
      const subs = q.sub_questions ?? [];
      if (subs.length > 0) {
        if (q.text) out += `${q.number}) ${q.text}\n`;
        else out += `${q.number})\n`;
        subs.forEach((sp, i) => {
          const label = sp.label ?? String.fromCharCode(97 + i);
          out += `   ${label}) ${sp.text}${sp.marks ? `  [${sp.marks}]` : ""}\n`;
        });
      } else {
        out += `${q.number}) ${q.text ?? ""}${q.marks ? `  [${q.marks}]` : ""}\n`;
      }
      if (q.or_with_next) out += `\nOR\n\n`;
    }
  }
  return out;
}

export default function PaperView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [row, setRow] = useState<Row | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const [editAnswers, setEditAnswers] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data, error } = await supabase.from("generated_papers").select("*").eq("id", id).maybeSingle();
      if (error || !data) { toast.error("Paper not found"); navigate("/dashboard"); return; }
      setRow(data as unknown as Row);
      setLoading(false);
    })();
  }, [id, navigate]);

  if (loading || !row) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  const paper = row.question_paper;
  const answers = row.answer_key ?? [];

  const handlePdf = () => {
    try { downloadPaperPdf(paper, answers); }
    catch { toast.error("Failed to download PDF"); }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(paperToText(paper));
    toast.success("Paper copied to clipboard");
  };

  const startEdit = () => {
    setEditText(paperToText(paper));
    setEditAnswers(answers.map((a) => `${a.number}. ${a.answer}`).join("\n"));
    setEditing(true);
  };

  const saveEdit = async () => {
    setSaving(true);
    // Build a minimal single-section paper from raw text
    const newPaper: QuestionPaper = {
      title: paper.title,
      subject: paper.subject,
      course: paper.course,
      totalMarks: paper.totalMarks,
      duration: paper.duration,
      instructions: paper.instructions,
      sections: [{
        name: "Question Paper",
        questions: editText.split("\n").filter(Boolean).map((line, i) => ({
          number: i + 1,
          text: line.replace(/^\s*\d+[\.\)]\s*/, ""),
        })),
      }],
    };
    const newAnswers: AnswerItem[] = editAnswers.split("\n").filter(Boolean).map((line, i) => {
      const m = line.match(/^\s*(\d+)[\.\)]\s*(.*)$/);
      return m ? { number: m[1], answer: m[2] } : { number: i + 1, answer: line };
    });
    const { error } = await supabase.from("generated_papers")
      .update({ question_paper: newPaper as any, answer_key: newAnswers as any })
      .eq("id", row.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    setRow({ ...row, question_paper: newPaper, answer_key: newAnswers });
    setEditing(false);
    toast.success("Saved");
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navbar variant="app" />
      <GlowOrb className="-top-40 -left-40" color="blue" size={500} />
      <GlowOrb className="-top-20 -right-20" color="violet" size={400} />

      <main className="container pt-28 pb-10 relative max-w-4xl">
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to dashboard
        </Button>

        {/* Action bar */}
        <div className="glass rounded-2xl p-4 mb-6 flex flex-wrap gap-2 items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center shrink-0 shadow-glow">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="font-semibold truncate">{row.title}</div>
              <div className="text-xs text-muted-foreground truncate">{row.subject} • {row.difficulty} • {row.exam_type}</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {!editing && (
              <>
                <Button variant="outline" size="sm" onClick={handleCopy}><Copy className="mr-2 h-4 w-4" /> Copy</Button>
                <Button variant="outline" size="sm" onClick={startEdit}><Pencil className="mr-2 h-4 w-4" /> Edit</Button>
                <Button size="sm" className="btn-gradient text-white border-0" onClick={handlePdf}><Download className="mr-2 h-4 w-4" /> Download PDF</Button>
              </>
            )}
            {editing && (
              <>
                <Button variant="outline" size="sm" onClick={() => setEditing(false)}><X className="mr-2 h-4 w-4" /> Cancel</Button>
                <Button size="sm" className="btn-gradient text-white border-0" onClick={saveEdit} disabled={saving}>
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Save
                </Button>
              </>
            )}
          </div>
        </div>

        {editing ? (
          <div className="space-y-4">
            <div className="glass rounded-2xl p-6">
              <div className="font-display text-lg font-semibold mb-3">Question paper</div>
              <Textarea rows={20} value={editText} onChange={(e) => setEditText(e.target.value)} className="font-mono text-sm" />
            </div>
            <div className="glass rounded-2xl p-6">
              <div className="font-display text-lg font-semibold mb-3">Answer key</div>
              <Textarea rows={10} value={editAnswers} onChange={(e) => setEditAnswers(e.target.value)} className="font-mono text-sm" />
            </div>
          </div>
        ) : (
          <>
            {/* Paper */}
            <article className="glass rounded-3xl p-8 md:p-12 mb-6">
              <header className="text-center pb-6 border-b border-border/40 mb-6">
                <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">{paper.title}</h1>
                <div className="text-sm text-muted-foreground space-x-3">
                  {paper.subject && <span>Subject: {paper.subject}</span>}
                  {paper.course && <span>• Course: {paper.course}</span>}
                </div>
                <div className="text-sm text-muted-foreground space-x-3 mt-1">
                  {paper.duration && <span>Time: {paper.duration}</span>}
                  {paper.totalMarks && <span>• Max Marks: {paper.totalMarks}</span>}
                </div>
              </header>

              {paper.instructions?.length ? (
                <div className="mb-6">
                  <div className="font-semibold mb-2">Instructions:</div>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {paper.instructions.map((i, idx) => <li key={idx}>{i}</li>)}
                  </ul>
                </div>
              ) : null}

              {paper.sections.map((s, si) => (
                <section key={si} className="mb-8">
                  <h2 className="font-display text-lg font-bold mb-1">{s.name}</h2>
                  {s.instructions && <p className="text-xs text-muted-foreground italic mb-3">{s.instructions}</p>}
                  <div className="space-y-4">
                    {s.questions.map((q, qi) => {
                      const subs = q.sub_questions ?? [];
                      const next = s.questions[qi + 1];
                      return (
                        <div key={qi}>
                          <div className="flex gap-3">
                            <span className="font-semibold w-8 shrink-0">{q.number})</span>
                            <div className="flex-1 space-y-2">
                              {q.text && (
                                <div className="flex gap-3">
                                  <span className="flex-1">{q.text}</span>
                                  {q.marks && subs.length === 0 ? (
                                    <span className="text-muted-foreground shrink-0">[{q.marks}]</span>
                                  ) : null}
                                </div>
                              )}
                              {subs.length > 0 && (
                                <div className="space-y-1.5">
                                  {subs.map((sp, si) => {
                                    const label = sp.label ?? String.fromCharCode(97 + si);
                                    return (
                                      <div key={si} className="flex gap-3">
                                        <span className="font-semibold w-6 shrink-0">{label})</span>
                                        <span className="flex-1">{sp.text}</span>
                                        {sp.marks ? (
                                          <span className="text-muted-foreground shrink-0">[{sp.marks}]</span>
                                        ) : null}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                              {subs.length === 0 && !q.text ? null : null}
                            </div>
                          </div>
                          {next && q.or_with_next && (
                            <div className="my-3 flex items-center gap-3 text-xs font-bold tracking-widest text-muted-foreground">
                              <span className="flex-1 h-px bg-border" />
                              OR
                              <span className="flex-1 h-px bg-border" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}
            </article>

            {/* Answer key */}
            {answers.length > 0 && (
              <Collapsible defaultOpen className="glass rounded-3xl p-6 md:p-8">
                <CollapsibleTrigger className="w-full text-left">
                  <h2 className="font-display text-xl font-bold flex items-center justify-between">
                    Answer Key
                    <span className="text-sm text-muted-foreground">Click to toggle</span>
                  </h2>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4">
                  <ol className="space-y-3">
                    {answers.map((a, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="font-semibold w-6 shrink-0">{a.number}.</span>
                        <span className="flex-1 text-muted-foreground">{a.answer}</span>
                      </li>
                    ))}
                  </ol>
                </CollapsibleContent>
              </Collapsible>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
