import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { GlowOrb } from "@/components/GlowOrb";
import { Link } from "react-router-dom";
import {
  Sparkles, BookOpen, FileSearch, Wand2, FileDown, Cloud,
  Gauge, Layers, ArrowRight, Brain, Rocket, ShieldCheck, Clock
} from "lucide-react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

const features = [
  { icon: Sparkles, title: "AI Question Paper Generation", desc: "Generate complete, professional papers in seconds with state-of-the-art AI." },
  { icon: BookOpen, title: "Syllabus-Based Questions", desc: "Paste your syllabus and get questions perfectly aligned with topics." },
  { icon: FileSearch, title: "Previous Paper Pattern Matching", desc: "Analyze past papers and generate fresh ones with the same structure." },
  { icon: Wand2, title: "Custom Prompt Generation", desc: "Describe what you need in plain English and let AI handle the rest." },
  { icon: FileDown, title: "PDF Export", desc: "Download exam-ready PDFs formatted for print and sharing." },
  { icon: Cloud, title: "Cloud Saved Papers", desc: "All your generated papers saved securely and accessible anywhere." },
  { icon: Gauge, title: "Difficulty Selection", desc: "Easy, Medium, Hard, or Mixed — generate for any level." },
  { icon: Layers, title: "Smart Exam Formatting", desc: "Sections, marks, instructions and answer keys auto-organized." },
];

const steps = [
  { n: "01", icon: Brain, title: "Choose your mode", desc: "Syllabus, previous paper, custom prompt, or a mix." },
  { n: "02", icon: Wand2, title: "Add your inputs", desc: "Subject, marks, difficulty, question types — your call." },
  { n: "03", icon: Rocket, title: "Generate & download", desc: "Get a polished question paper plus answer key as PDF." },
];

const benefits = [
  { icon: Clock, title: "Save Hours", desc: "What takes a teacher half a day is now done in 30 seconds." },
  { icon: ShieldCheck, title: "Original Content", desc: "Fresh questions every time — never copies your past papers." },
  { icon: Brain, title: "Smarter Patterns", desc: "Learns marks distribution and section style from inputs." },
  { icon: Rocket, title: "Built for Students & Educators", desc: "Designed by a student, polished like a SaaS." },
];

const faqs = [
  { q: "Do I need to provide a syllabus?", a: "No. Syllabus is optional. You can also use a previous question paper, a custom prompt, or any combination." },
  { q: "Will the AI copy questions from the paper I upload?", a: "Never. ExamForge AI analyzes the structure, marks distribution, and style — then writes brand-new original questions." },
  { q: "Can I download the paper as a PDF?", a: "Yes. Every generated paper can be downloaded as a clean, exam-ready PDF including a separate answer key." },
  { q: "Is my data private?", a: "Yes. Authentication and per-user data isolation ensure only you can access your papers." },
  { q: "Which exam types are supported?", a: "Internal, Model, Final, and Custom Pattern exams across any subject or course." },
  { q: "Can I edit the generated paper?", a: "Yes. You can manually edit, regenerate, or copy any generated paper." },
];

export default function Index() {
  return (
    <div className="relative overflow-hidden">
      <Navbar />
      {/* Hero */}
      <section className="relative pt-40 pb-24">
        <GlowOrb className="-top-20 -left-20" color="blue" size={500} />
        <GlowOrb className="-top-40 right-0" color="violet" size={500} />
        <GlowOrb className="top-60 left-1/2 -translate-x-1/2" color="cyan" size={400} />

        <div className="container relative">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-6 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Powered by next-gen AI</span>
            </div>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.05] text-balance mb-6">
              From Syllabus to <br className="hidden sm:block" />
              <span className="gradient-text animate-gradient">Question Paper</span> in Seconds
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-balance">
              ExamForge AI is the smartest way to create professional, exam-ready question papers — powered by AI, designed for students and educators.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="btn-gradient text-white border-0 h-12 px-8 text-base">
                <Link to="/auth?mode=signup">
                  Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base glass border-border/50">
                <Link to="/auth">Login</Link>
              </Button>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative max-w-5xl mx-auto mt-20 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <div className="absolute inset-0 bg-gradient-primary opacity-30 blur-3xl rounded-full" />
            <div className="relative glass rounded-3xl p-6 md:p-10 gradient-border">
              <div className="grid md:grid-cols-3 gap-4 text-left">
                {["Subject: Physics", "Difficulty: Medium", "Marks: 100"].map((t) => (
                  <div key={t} className="rounded-xl bg-secondary/40 p-4 border border-border/40">
                    <div className="text-xs text-muted-foreground mb-1">Input</div>
                    <div className="font-medium">{t}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-xl bg-secondary/40 p-6 border border-border/40">
                <div className="text-xs text-muted-foreground mb-3">Generated Output</div>
                <div className="space-y-2">
                  <div className="font-display font-semibold">Section A — Short Answer (2 marks each)</div>
                  <div className="text-sm text-muted-foreground">1. Define momentum and state its SI unit. <span className="float-right">[2]</span></div>
                  <div className="text-sm text-muted-foreground">2. Differentiate between speed and velocity. <span className="float-right">[2]</span></div>
                  <div className="text-sm text-muted-foreground">3. State Newton's third law of motion. <span className="float-right">[2]</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 relative">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">
              Everything you need to <span className="gradient-text">build great papers</span>
            </h2>
            <p className="text-muted-foreground">A complete toolkit for educators and students.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <div key={f.title} className="glass rounded-2xl p-6 hover:-translate-y-1 transition-transform animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="h-11 w-11 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 shadow-glow">
                  <f.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 relative">
        <GlowOrb className="top-1/2 -left-40 -translate-y-1/2" color="violet" size={500} />
        <div className="container relative">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">How it works</h2>
            <p className="text-muted-foreground">Three steps. Endless papers.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((s) => (
              <div key={s.n} className="glass rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-4 right-4 font-display text-5xl font-bold opacity-10">{s.n}</div>
                <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-5 shadow-glow">
                  <s.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">{s.title}</h3>
                <p className="text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why */}
      <section id="why" className="py-24 relative">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">
              Why choose <span className="gradient-text">ExamForge AI</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {benefits.map((b) => (
              <div key={b.title} className="glass rounded-2xl p-6 text-center">
                <div className="h-12 w-12 mx-auto rounded-full bg-gradient-primary flex items-center justify-center mb-4 shadow-glow-violet">
                  <b.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 relative">
        <div className="container max-w-3xl">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">Frequently asked questions</h2>
          </div>
          <Accordion type="single" collapsible className="glass rounded-2xl px-6">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-border/40">
                <AccordionTrigger className="text-left font-medium hover:no-underline">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container">
          <div className="glass rounded-3xl p-10 md:p-16 text-center relative overflow-hidden gradient-border">
            <GlowOrb className="-top-20 left-1/2 -translate-x-1/2" color="blue" size={400} />
            <div className="relative">
              <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">
                Ready to forge your <span className="gradient-text">first paper</span>?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">Join students and educators using ExamForge AI to create smarter exams.</p>
              <Button asChild size="lg" className="btn-gradient text-white border-0 h-12 px-8">
                <Link to="/auth?mode=signup">Start Generating <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
