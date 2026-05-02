import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlowOrb } from "@/components/GlowOrb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Sparkles, BookOpen, FileSearch, Wand2, Layers, Loader2, Upload, X,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

type Mode = "syllabus" | "previous" | "prompt" | "syllabus_previous";

const modes: { id: Mode; icon: any; label: string; desc: string }[] = [
  { id: "syllabus", icon: BookOpen, label: "From Syllabus", desc: "Generate based on your topic list" },
  { id: "previous", icon: FileSearch, label: "From Previous Paper", desc: "Match the structure of a past paper" },
  { id: "prompt", icon: Wand2, label: "From Custom Prompt", desc: "Describe what you want in plain English" },
  { id: "syllabus_previous", icon: Layers, label: "Syllabus + Previous Paper", desc: "Combine both for best results" },
];

const QTYPES = ["Short Answer", "Long Answer", "MCQ", "Numerical", "Mixed"];

const STATUSES = [
  "Analyzing your inputs…",
  "Studying paper patterns…",
  "Drafting questions…",
  "Balancing difficulty…",
  "Building answer key…",
  "Polishing the final paper…",
];

export default function Generate() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<Mode>("syllabus");
  const [subject, setSubject] = useState("");
  const [course, setCourse] = useState("");
  const [modules, setModules] = useState("");
  const [examType, setExamType] = useState("Internal Exam");
  const [difficulty, setDifficulty] = useState("Medium");
  const [qtypes, setQtypes] = useState<string[]>(["Mixed"]);
  const [totalMarks, setTotalMarks] = useState("100");
  const [numQuestions, setNumQuestions] = useState("15");
  const [syllabus, setSyllabus] = useState("");
  const [previousPaper, setPreviousPaper] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [extra, setExtra] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusIdx, setStatusIdx] = useState(0);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrFileName, setOcrFileName] = useState<string | null>(null);

  const toggleQtype = (q: string) => {
    setQtypes((cur) => cur.includes(q) ? cur.filter((x) => x !== q) : [...cur, q]);
  };

  const fileToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve((r.result as string).split(",")[1]);
    r.onerror = reject;
    r.readAsDataURL(file);
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) return toast.error("File must be under 10 MB");
    setOcrLoading(true);
    setOcrFileName(file.name);
    try {
      const base64 = await fileToBase64(file);
      const { data, error } = await supabase.functions.invoke("extract-paper", {
        body: { fileBase64: base64, mimeType: file.type },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      const text = data?.text ?? "";
      setPreviousPaper((cur) => cur ? `${cur}\n\n${text}` : text);
      toast.success("Extracted text from your file");
    } catch (err: any) {
      toast.error(err.message || "Failed to extract file");
      setOcrFileName(null);
    } finally {
      setOcrLoading(false);
      e.target.value = "";
    }
  };

  const validate = (): string | null => {
    if (!subject.trim()) return "Subject is required";
    if (mode === "syllabus" && !syllabus.trim()) return "Please add your syllabus";
    if (mode === "previous" && !previousPaper.trim()) return "Please paste or upload a previous paper";
    if (mode === "prompt" && !customPrompt.trim()) return "Please enter a custom prompt";
    if (mode === "syllabus_previous" && !syllabus.trim() && !previousPaper.trim()) return "Add a syllabus or previous paper";
    if (qtypes.length === 0) return "Pick at least one question type";
    return null;
  };

  const startStatusLoop = () => {
    setStatusIdx(0);
    const id = setInterval(() => setStatusIdx((i) => (i + 1) % STATUSES.length), 2200);
    return () => clearInterval(id);
  };

  const handleGenerate = async () => {
    const err = validate();
    if (err) return toast.error(err);
    if (!user) return;
    setLoading(true);
    const stop = startStatusLoop();
    try {
      const payload = {
        mode, subject, course, modules: modules ? Number(modules) : undefined,
        examType, difficulty, questionTypes: qtypes,
        totalMarks: Number(totalMarks) || 100,
        numQuestions: Number(numQuestions) || 10,
        syllabus, previousPaper, customPrompt, additional: extra,
      };
      const { data, error } = await supabase.functions.invoke("generate-paper", { body: payload });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const paper = data.paper;
      const answerKey = data.answerKey ?? [];

      const { data: inserted, error: insErr } = await supabase
        .from("generated_papers")
        .insert({
          user_id: user.id,
          title: paper.title || `${subject} ${examType}`,
          subject, course: course || null,
          syllabus: syllabus || null,
          previous_paper_input: previousPaper || null,
          custom_prompt: customPrompt || null,
          input_mode: mode,
          exam_type: examType,
          difficulty,
          marks: Number(totalMarks) || null,
          question_paper: paper as any,
          answer_key: answerKey as any,
        })
        .select("id")
        .single();
      if (insErr) throw insErr;

      toast.success("Question paper ready!");
      navigate(`/papers/${inserted.id}`);
    } catch (e: any) {
      toast.error(e.message || "Failed to generate paper");
    } finally {
      stop();
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navbar variant="app" />
      <GlowOrb className="-top-40 -left-40" color="blue" size={500} />
      <GlowOrb className="-top-20 right-0" color="violet" size={400} />

      <main className="container pt-32 pb-10 relative max-w-5xl">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">
            Generate a <span className="gradient-text">question paper</span>
          </h1>
          <p className="text-muted-foreground">Pick a mode, give some context, and let AI do the heavy lifting.</p>
        </div>

        {/* Mode selector */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {modes.map((m) => {
            const active = mode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setMode(m.id)}
                className={`text-left p-5 rounded-2xl transition-all ${active ? "gradient-border bg-card shadow-glow" : "glass hover:-translate-y-0.5"}`}
              >
                <m.icon className={`h-6 w-6 mb-3 ${active ? "text-primary" : "text-muted-foreground"}`} />
                <div className="font-semibold mb-1">{m.label}</div>
                <div className="text-xs text-muted-foreground">{m.desc}</div>
              </button>
            );
          })}
        </div>

        <div className="space-y-6">
          {/* Basic */}
          <div className="glass rounded-2xl p-6">
            <h2 className="font-display text-lg font-semibold mb-4">Basic info</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Subject *</Label>
                <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Physics" />
              </div>
              <div>
                <Label>Course / Class</Label>
                <Input value={course} onChange={(e) => setCourse(e.target.value)} placeholder="e.g. Class 12 / B.Tech S3" />
              </div>
              <div>
                <Label>Number of modules / topics (optional)</Label>
                <Input type="number" min={0} value={modules} onChange={(e) => setModules(e.target.value)} placeholder="e.g. 5" />
              </div>
              <div>
                <Label>Exam type</Label>
                <Select value={examType} onValueChange={setExamType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Internal Exam">Internal Exam</SelectItem>
                    <SelectItem value="Model Exam">Model Exam</SelectItem>
                    <SelectItem value="Final Exam">Final Exam</SelectItem>
                    <SelectItem value="Custom Pattern">Custom Pattern</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Difficulty</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Easy", "Medium", "Hard", "Mixed"].map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Total marks</Label>
                <Input type="number" min={1} value={totalMarks} onChange={(e) => setTotalMarks(e.target.value)} />
              </div>
              <div>
                <Label>Number of questions</Label>
                <Input type="number" min={1} value={numQuestions} onChange={(e) => setNumQuestions(e.target.value)} />
              </div>
            </div>

            <div className="mt-4">
              <Label className="mb-2 block">Question types</Label>
              <div className="flex flex-wrap gap-2">
                {QTYPES.map((q) => {
                  const active = qtypes.includes(q);
                  return (
                    <button
                      key={q}
                      type="button"
                      onClick={() => toggleQtype(q)}
                      className={`px-4 py-2 rounded-full text-sm border transition-all ${active ? "bg-gradient-primary text-white border-transparent shadow-glow" : "border-border bg-secondary/50 text-muted-foreground hover:text-foreground"}`}
                    >
                      {q}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mode-specific inputs */}
          {(mode === "syllabus" || mode === "syllabus_previous") && (
            <div className="glass rounded-2xl p-6">
              <h2 className="font-display text-lg font-semibold mb-4">Syllabus {mode === "syllabus" && <span className="text-destructive">*</span>}</h2>
              <Textarea rows={6} value={syllabus} onChange={(e) => setSyllabus(e.target.value)} placeholder="Paste your syllabus, topic list, or chapter outline here…" />
            </div>
          )}

          {(mode === "previous" || mode === "syllabus_previous") && (
            <div className="glass rounded-2xl p-6">
              <h2 className="font-display text-lg font-semibold mb-4">Previous question paper {mode === "previous" && <span className="text-destructive">*</span>}</h2>
              <Textarea rows={6} value={previousPaper} onChange={(e) => setPreviousPaper(e.target.value)} placeholder="Paste a previous paper here, or upload a PDF / image below…" />
              <div className="mt-3 flex items-center gap-3">
                <label className="cursor-pointer">
                  <input type="file" accept="application/pdf,image/*" onChange={handleUpload} className="hidden" />
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-secondary/50 text-sm hover:bg-secondary transition-colors">
                    {ocrLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    {ocrLoading ? "Extracting…" : "Upload PDF or image"}
                  </span>
                </label>
                {ocrFileName && !ocrLoading && (
                  <span className="text-xs text-muted-foreground flex items-center gap-2">
                    <span>{ocrFileName}</span>
                    <button onClick={() => { setOcrFileName(null); setPreviousPaper(""); }}><X className="h-3 w-3" /></button>
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">AI will analyze the structure and write fresh, original questions in the same style.</p>
            </div>
          )}

          {mode === "prompt" && (
            <div className="glass rounded-2xl p-6">
              <h2 className="font-display text-lg font-semibold mb-4">Custom prompt *</h2>
              <Textarea rows={5} value={customPrompt} onChange={(e) => setCustomPrompt(e.target.value)} placeholder="Describe the paper you want. e.g. 'Generate a class 10 physics paper focused on light, electricity and magnetism with 5 short and 5 long questions.'" />
            </div>
          )}

          <div className="glass rounded-2xl p-6">
            <h2 className="font-display text-lg font-semibold mb-4">Additional instructions (optional)</h2>
            <Textarea rows={3} value={extra} onChange={(e) => setExtra(e.target.value)} placeholder="Any extra rules — e.g. include a numerical section, no diagrams, follow CBSE pattern…" />
          </div>

          <div className="flex justify-center pt-2">
            <Button onClick={handleGenerate} disabled={loading} size="lg" className="btn-gradient text-white border-0 h-14 px-10 text-base">
              {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating…</> : <><Sparkles className="mr-2 h-5 w-5" /> Generate Question Paper</>}
            </Button>
          </div>
        </div>
      </main>

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="glass rounded-3xl p-10 text-center max-w-md mx-4 gradient-border">
            <div className="relative mx-auto mb-6 h-20 w-20">
              <div className="absolute inset-0 bg-gradient-primary rounded-full blur-xl opacity-60 animate-pulse" />
              <div className="relative h-20 w-20 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
                <Sparkles className="h-9 w-9 text-white animate-pulse" />
              </div>
            </div>
            <h3 className="font-display text-xl font-bold mb-2">Forging your paper</h3>
            <p className="text-muted-foreground transition-all">{STATUSES[statusIdx]}</p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
