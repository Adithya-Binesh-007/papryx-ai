import { Logo } from "./Logo";

export const Footer = () => (
  <footer className="border-t border-border/40 mt-20">
    <div className="container py-10 flex flex-col md:flex-row items-center justify-between gap-4">
      <Logo />
      <p className="text-sm text-muted-foreground">
        © {new Date().getFullYear()} ExamForge AI. From syllabus to question paper in seconds.
      </p>
    </div>
  </footer>
);
