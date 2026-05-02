import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlowOrb } from "@/components/GlowOrb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Plus, FileText, Eye, Download, Trash2, Sparkles, Linkedin, FileQuestion, Calendar,
} from "lucide-react";
import { downloadPaperPdf, QuestionPaper, AnswerItem } from "@/lib/pdf";

interface Paper {
  id: string; title: string; subject: string; difficulty: string | null;
  created_at: string; question_paper: QuestionPaper; answer_key: AnswerItem[] | null;
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState<string>("");

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: papersData }, { data: profile }] = await Promise.all([
        supabase.from("generated_papers").select("id,title,subject,difficulty,created_at,question_paper,answer_key").order("created_at", { ascending: false }),
        supabase.from("profiles").select("display_name").eq("id", user.id).maybeSingle(),
      ]);
      setPapers((papersData ?? []) as unknown as Paper[]);
      setDisplayName(profile?.display_name ?? user.email?.split("@")[0] ?? "");
      setLoading(false);
    })();
  }, [user]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("generated_papers").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setPapers((p) => p.filter((x) => x.id !== id));
    toast.success("Paper deleted");
  };

  const handlePdf = (p: Paper) => {
    try {
      downloadPaperPdf(p.question_paper, p.answer_key ?? undefined);
    } catch (e) { toast.error("Failed to generate PDF"); }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navbar variant="app" />
      <GlowOrb className="-top-40 -left-40" color="blue" size={500} />
      <GlowOrb className="-top-20 -right-20" color="violet" size={400} />

      <main className="container pt-32 pb-10 relative">
        {/* Welcome */}
        <section className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <p className="text-muted-foreground text-sm mb-1">Welcome back</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold">
              Hello, <span className="gradient-text">{displayName}</span> 👋
            </h1>
            <p className="text-muted-foreground mt-2">Ready to forge your next question paper?</p>
          </div>
          <Button asChild size="lg" className="btn-gradient text-white border-0 h-12 px-6">
            <Link to="/generate"><Plus className="mr-2 h-5 w-5" /> Generate New Paper</Link>
          </Button>
        </section>

        {/* Stats */}
        <section className="grid sm:grid-cols-3 gap-4 mb-10">
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-3 text-muted-foreground text-sm"><FileText className="h-4 w-4" /> Total papers</div>
            <div className="font-display text-3xl font-bold mt-2">{papers.length}</div>
          </div>
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-3 text-muted-foreground text-sm"><Sparkles className="h-4 w-4" /> AI model</div>
            <div className="font-display text-xl font-semibold mt-2">Gemini 2.5 Pro</div>
          </div>
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-3 text-muted-foreground text-sm"><Calendar className="h-4 w-4" /> Last created</div>
            <div className="font-display text-xl font-semibold mt-2">
              {papers[0] ? new Date(papers[0].created_at).toLocaleDateString() : "—"}
            </div>
          </div>
        </section>

        {/* Papers */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-2xl font-bold">Your saved papers</h2>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="glass rounded-2xl p-6 h-48 animate-pulse" />
              ))}
            </div>
          ) : papers.length === 0 ? (
            <div className="glass rounded-3xl p-12 text-center">
              <div className="h-16 w-16 mx-auto rounded-2xl bg-gradient-primary flex items-center justify-center mb-4 shadow-glow">
                <FileQuestion className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">No papers yet</h3>
              <p className="text-muted-foreground mb-6">Generate your first AI-powered question paper in seconds.</p>
              <Button asChild className="btn-gradient text-white border-0">
                <Link to="/generate"><Plus className="mr-2 h-4 w-4" /> Generate First Paper</Link>
              </Button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {papers.map((p) => (
                <div key={p.id} className="glass rounded-2xl p-5 hover:-translate-y-1 transition-transform flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    {p.difficulty && <Badge variant="secondary" className="capitalize">{p.difficulty}</Badge>}
                  </div>
                  <h3 className="font-semibold line-clamp-2 mb-1">{p.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{p.subject}</p>
                  <p className="text-xs text-muted-foreground mb-4">{new Date(p.created_at).toLocaleDateString()}</p>
                  <div className="mt-auto grid grid-cols-3 gap-2">
                    <Button size="sm" variant="outline" onClick={() => navigate(`/papers/${p.id}`)}><Eye className="h-4 w-4" /></Button>
                    <Button size="sm" variant="outline" onClick={() => handlePdf(p)}><Download className="h-4 w-4" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this paper?</AlertDialogTitle>
                          <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(p.id)} className="bg-destructive">Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* About the developer */}
        <section className="mb-10">
          <div className="glass rounded-3xl p-8 md:p-10 gradient-border relative overflow-hidden">
            <GlowOrb className="-bottom-20 -right-20" color="violet" size={300} />
            <div className="relative flex flex-col md:flex-row items-start gap-6">
              <div className="h-20 w-20 rounded-2xl bg-gradient-primary flex items-center justify-center text-white text-2xl font-bold font-display shadow-glow shrink-0">
                AB
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">About the Developer</p>
                <h3 className="font-display text-2xl font-bold mb-1">Adithya Binesh</h3>
                <p className="text-sm gradient-text font-medium mb-3">Student Developer & Founder of ExamForge AI</p>
                <p className="text-muted-foreground max-w-2xl">
                  Adithya Binesh is a student developer passionate about building AI-powered tools that help students and educators save time, prepare better, and create smarter learning resources.
                </p>
                <Button asChild className="mt-5 btn-gradient text-white border-0">
                  <a href="https://www.linkedin.com/in/adithya-binesh-631270388/" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="mr-2 h-4 w-4" /> Connect on LinkedIn
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
