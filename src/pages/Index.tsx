import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { GlowOrb } from "@/components/GlowOrb";
import { TypewriterText } from "@/components/TypewriterText";
import { Reveal } from "@/components/Reveal";
import { FloatingPapers } from "@/components/FloatingPapers";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles, BookOpen, FileSearch, Wand2, FileDown, Cloud,
  Gauge, Layers, ArrowRight, Brain, Rocket, ShieldCheck, Clock, Linkedin
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
  { q: "Will the AI copy questions from the paper I upload?", a: "Never. Papryx AI analyzes the structure, marks distribution, and style — then writes brand-new original questions." },
  { q: "Can I download the paper as a PDF?", a: "Yes. Every generated paper can be downloaded as a clean, exam-ready PDF including a separate answer key." },
  { q: "Is my data private?", a: "Yes. Authentication and per-user data isolation ensure only you can access your papers." },
  { q: "Which exam types are supported?", a: "Internal, Model, Final, and Custom Pattern exams across any subject or course." },
  { q: "Can I edit the generated paper?", a: "Yes. You can manually edit, regenerate, or copy any generated paper." },
];

const previewQuestions = [
  "Define momentum and state its SI unit.",
  "Differentiate between speed and velocity.",
  "State Newton's third law of motion.",
];

export default function Index() {
  return (
    <div className="relative overflow-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 sm:pt-40 pb-20 sm:pb-24">
        <GlowOrb className="-top-20 -left-20" color="blue" size={500} />
        <GlowOrb className="-top-40 right-0" color="violet" size={500} />
        <GlowOrb className="top-60 left-1/2 -translate-x-1/2" color="cyan" size={400} />
        <FloatingPapers />

        <div className="container relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-6 text-sm"
            >
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span>Powered by next-gen AI</span>
            </motion.div>

            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold leading-[1.05] text-balance mb-6">
              <TypewriterText
                text="From Syllabus to "
                speed={32}
                startDelay={150}
                cursor={false}
                triggerOnView={false}
              />
              <br className="hidden sm:block" />
              <TypewriterText
                text="Question Paper"
                speed={55}
                startDelay={750}
                triggerOnView={false}
                className="glow-title"
              />
              <TypewriterText
                text=" in Seconds"
                speed={32}
                startDelay={1700}
                cursor={false}
                triggerOnView={false}
              />
            </h1>

            <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-balance min-h-[3.5rem] sm:min-h-[3rem]">
              <TypewriterText
                text="Papryx AI is the smartest way to create professional, exam-ready question papers — powered by AI, designed for students and educators."
                speed={14}
                startDelay={2200}
                cursor={false}
                triggerOnView={false}
              />
            </p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 2.6 }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Button
                asChild
                size="lg"
                className="btn-gradient animate-btn-glow text-white border-0 h-12 px-8 text-base"
              >
                <Link to="/auth?mode=signup">
                  <TypewriterText
                    text="Generate Question Paper"
                    speed={28}
                    startDelay={2900}
                    cursor={false}
                    triggerOnView={false}
                  />
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base glass border-border/50 hover:border-primary/50 transition-colors">
                <Link to="/auth">Login</Link>
              </Button>
            </motion.div>
          </div>

          {/* Hero visual — AI-generated preview card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.2 }}
            className="relative max-w-5xl mx-auto mt-16 sm:mt-20"
          >
            <div className="absolute inset-0 bg-gradient-primary opacity-30 blur-3xl rounded-full animate-pulse-glow" />
            <div className="relative glass rounded-3xl p-5 sm:p-6 md:p-10 gradient-border">
              <div className="grid sm:grid-cols-3 gap-3 sm:gap-4 text-left">
                {["Subject: Physics", "Difficulty: Medium", "Marks: 100"].map((t, i) => (
                  <motion.div
                    key={t}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 1.4 + i * 0.15 }}
                    className="rounded-xl bg-secondary/40 p-4 border border-border/40"
                  >
                    <div className="text-xs text-muted-foreground mb-1">Input</div>
                    <div className="font-medium">{t}</div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-5 sm:mt-6 rounded-xl bg-secondary/40 p-5 sm:p-6 border border-border/40">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                  </span>
                  Generated Output
                </div>
                <div className="space-y-2">
                  <div className="font-display font-semibold text-sm sm:text-base">
                    <TypewriterText
                      text="Section A — Short Answer (2 marks each)"
                      speed={22}
                      startDelay={2200}
                    />
                  </div>
                  {previewQuestions.map((q, i) => (
                    <div key={i} className="text-xs sm:text-sm text-muted-foreground flex justify-between gap-3">
                      <TypewriterText
                        text={`${i + 1}. ${q}`}
                        speed={14}
                        startDelay={3000 + i * 1500}
                        className="block flex-1"
                      />
                      <span className="shrink-0">[2]</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 sm:py-24 relative">
        <div className="container">
          <Reveal className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
            <h2 className="font-display text-3xl sm:text-5xl font-bold mb-4">
              Everything you need to <span className="gradient-text">build great papers</span>
            </h2>
            <p className="text-muted-foreground">A complete toolkit for educators and students.</p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.05}>
                <div className="glass rounded-2xl p-6 hover-lift h-full">
                  <div className="h-11 w-11 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 shadow-glow">
                    <f.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 sm:py-24 relative">
        <GlowOrb className="top-1/2 -left-40 -translate-y-1/2" color="violet" size={500} />
        <div className="container relative">
          <Reveal className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
            <h2 className="font-display text-3xl sm:text-5xl font-bold mb-4">How it works</h2>
            <p className="text-muted-foreground">Three steps. Endless papers.</p>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-5 sm:gap-6">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.1}>
                <div className="glass rounded-2xl p-7 sm:p-8 relative overflow-hidden hover-lift h-full">
                  <div className="absolute top-4 right-4 font-display text-5xl font-bold opacity-10">{s.n}</div>
                  <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-5 shadow-glow">
                    <s.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2">{s.title}</h3>
                  <p className="text-muted-foreground">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why */}
      <section id="why" className="py-20 sm:py-24 relative">
        <div className="container">
          <Reveal className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
            <h2 className="font-display text-3xl sm:text-5xl font-bold mb-4">
              Why choose <span className="gradient-text">Papryx AI</span>
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {benefits.map((b, i) => (
              <Reveal key={b.title} delay={i * 0.06}>
                <div className="glass rounded-2xl p-6 text-center hover-lift h-full">
                  <div className="h-12 w-12 mx-auto rounded-full bg-gradient-primary flex items-center justify-center mb-4 shadow-glow-violet">
                    <b.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">{b.title}</h3>
                  <p className="text-sm text-muted-foreground">{b.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 sm:py-24 relative">
        <div className="container max-w-3xl">
          <Reveal className="text-center mb-12 sm:mb-14">
            <h2 className="font-display text-3xl sm:text-5xl font-bold mb-4">Frequently asked questions</h2>
          </Reveal>
          <Reveal>
            <Accordion type="single" collapsible className="glass rounded-2xl px-5 sm:px-6">
              {faqs.map((f, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-border/40">
                  <AccordionTrigger className="text-left font-medium hover:no-underline">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      {/* About the developer */}
      <section id="about" className="py-16 sm:py-20 relative">
        <div className="container max-w-5xl">
          <Reveal>
            <div className="glass rounded-3xl p-7 sm:p-8 md:p-12 gradient-border relative overflow-hidden">
              <GlowOrb className="-bottom-20 -right-20" color="violet" size={300} />
              <div className="relative flex flex-col md:flex-row items-start gap-6">
                <div className="h-20 w-20 rounded-2xl bg-gradient-primary flex items-center justify-center text-white text-2xl font-bold font-display shadow-glow shrink-0">
                  AB
                </div>
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">About the Developer</p>
                  <h3 className="font-display text-2xl md:text-3xl font-bold mb-1">Adithya Binesh</h3>
                  <p className="text-sm gradient-text font-medium mb-3">Student Developer & Founder of Papryx AI</p>
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
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20">
        <div className="container">
          <Reveal>
            <div className="glass rounded-3xl p-8 sm:p-10 md:p-16 text-center relative overflow-hidden gradient-border">
              <GlowOrb className="-top-20 left-1/2 -translate-x-1/2" color="blue" size={400} />
              <div className="relative">
                <h2 className="font-display text-3xl sm:text-5xl font-bold mb-4">
                  Ready to forge your <span className="glow-title">first paper</span>?
                </h2>
                <p className="text-muted-foreground mb-8 max-w-xl mx-auto">Join students and educators using Papryx AI to create smarter exams.</p>
                <Button asChild size="lg" className="btn-gradient animate-btn-glow text-white border-0 h-12 px-8">
                  <Link to="/auth?mode=signup">Start Generating <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
