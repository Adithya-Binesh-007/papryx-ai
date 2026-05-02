
# ExamForge AI — Build Plan

A premium, dark-themed AI SaaS that turns syllabi, past papers, or custom prompts into professional question papers with answer keys.

## 1. Visual Identity & Theme

- **Style**: Dark futuristic, glassmorphism cards, soft glow, blurred gradient orbs in background.
- **Palette** (HSL tokens in `index.css`):
  - Background: deep navy `222 47% 5%`
  - Primary: electric blue `217 91% 60%`
  - Accent: violet `265 89% 66%` and cyan `190 95% 55%`
  - Glass surface: white at 5% opacity with backdrop blur
- **Gradients**: blue → purple → cyan for hero, CTAs, headings, glow rings.
- **Typography**: Inter for body, tighter tracking and large weights for headlines.
- **Motion**: fade-in, scale-in, slide-up on scroll; gradient button hover lift; subtle pulsing hero orbs.
- **Logo/wordmark**: "ExamForge AI" with a small bolt/spark icon, gradient text.

## 2. App Structure & Routes

```text
/                       Landing page (public)
/auth                   Login + Signup (tabs)
/dashboard              Authenticated home (papers list, About Developer)
/generate               Question paper generator (input wizard)
/papers/:id             Generated paper view (PDF, copy, edit, regenerate)
*                       NotFound
```

Protected routes redirect to `/auth` when no session.

## 3. Landing Page

- **Navbar** (glass, sticky): logo, links (Features, How it works, FAQ), Login + Get Started CTAs.
- **Hero**: tagline "From Syllabus to Question Paper in Seconds", gradient headline, dual CTAs, animated glowing orb / abstract AI grid visual.
- **Features grid** (8 glass cards with gradient icons): AI generation, syllabus-based, pattern matching, custom prompt, PDF export, cloud-saved, difficulty selection, smart formatting.
- **How It Works**: 3-step horizontal timeline (Choose mode → Add inputs → Generate & download).
- **Why Choose ExamForge AI**: 4 benefits with icons.
- **FAQ**: accordion (6 common questions).
- **Footer**: brand, quick links, copyright.

## 4. Authentication

- Email + password only (no Google).
- Modern centered glass card with tabs Login / Sign up.
- Uses Lovable Cloud auth; session listener set up before `getSession`; auto-redirect to `/dashboard` when logged in.
- Logout from dashboard navbar avatar menu.
- Each user only sees their own papers (enforced by RLS).

## 5. Dashboard

- Glass top nav with logo, "Generate New Paper" gradient button, avatar menu (Logout).
- Welcome banner: "Welcome back, {name}" + quick stats (papers generated, last created).
- **Recent papers** carousel/grid (last 6).
- **All saved papers** grid with search + filter by subject/difficulty.
- **Paper card**: title, subject, difficulty pill, date, actions (View, Download PDF, Delete with confirm).
- **About the Developer** section at bottom: avatar placeholder, name "Adithya Binesh", role, bio, "Connect on LinkedIn" gradient button linking to the provided URL.
- Empty state with friendly illustration when no papers yet.

## 6. Question Paper Generator (`/generate`)

Stepper-style single page with grouped glass panels:

- **Input mode selector** (segmented buttons):
  1. From Syllabus
  2. From Existing Paper Pattern
  3. From Custom Prompt
  4. Syllabus + Previous Paper
- **Common fields**: Subject, Course/Class, Number of modules (optional), Exam type (Internal / Model / Final / Custom), Difficulty (Easy / Medium / Hard / Mixed), Question types (multi-select chips: Short, Long, MCQ, Numerical, Mixed), Total marks, Number of questions, Additional instructions.
- **Conditional fields**:
  - Syllabus textarea (visible for syllabus modes).
  - Previous paper: paste textarea + file upload (PDF or image). On upload, an edge function sends file to Gemini 2.5 Pro vision for OCR text extraction; extracted text fills the field for review.
  - Custom prompt textarea.
- Syllabus is never required — validation only enforces the minimum needed for the chosen mode.
- Big gradient **Generate** button with loading shimmer.

## 7. AI Generation

- Edge function `generate-paper` calls Lovable AI Gateway with **google/gemini-2.5-pro**.
- Uses tool/function calling to return structured JSON: `{ title, sections: [{ name, instructions, questions: [{ number, text, marks, type }] }], totalMarks, answerKey: [{ number, answer }] }`.
- System prompt instructs: balance difficulty, number questions, include section headers and marks, generate fresh questions when given a previous paper (analyze structure/marks/style, never copy), produce separate answer key.
- Handles 429 (rate limit) and 402 (credits) gracefully with toast messages.
- Loading state: full-screen overlay with animated gradient spinner and rotating status messages ("Analyzing pattern…", "Drafting questions…", "Balancing difficulty…").

## 8. Generated Paper Page

- Beautiful exam-style document layout on a glass canvas: header (title, subject, course, total marks, time), sections with instructions, numbered questions with marks in the right margin.
- Action bar: **Save Paper**, **Download PDF**, **Copy**, **Regenerate** (re-runs with same inputs), **Manual Edit** (toggles inline editable view, save persists changes).
- **Answer Key** in a separate collapsible section below.
- **PDF export**: client-side jsPDF — clean two-column header, sectioned questions, page-numbered footer; answer key on subsequent pages.

## 9. Database (Lovable Cloud)

- `profiles` table: `id (uuid → auth.users)`, `display_name`, `created_at`. Auto-created via trigger on signup.
- `generated_papers` table with all fields from the brief: `id, user_id, title, subject, course, syllabus, previous_paper_input, custom_prompt, input_mode, exam_type, difficulty, marks, question_paper (jsonb), answer_key (jsonb), created_at`.
- RLS enabled: users can `select/insert/update/delete` only rows where `user_id = auth.uid()`.

## 10. Technical Notes

- React + Vite + Tailwind + shadcn/ui (already in stack).
- New deps: `jspdf`, `jspdf-autotable` (PDF), `react-hook-form` + `zod` (form validation).
- Edge functions: `generate-paper` (text generation) and `extract-paper` (OCR for uploaded PDF/image via Gemini vision). Both use `LOVABLE_API_KEY`.
- Reusable components: `GlassCard`, `GradientButton`, `GradientText`, `GlowOrb`, `PaperCard`, `LoadingOverlay`, `Navbar`, `Footer`.
- Folder layout: `src/pages`, `src/components/landing`, `src/components/dashboard`, `src/components/generator`, `src/components/paper`, `src/components/ui`, `src/lib/pdf.ts`, `src/hooks/useAuth.ts`, `src/integrations/supabase/*` (auto-generated).
- Responsive: mobile-first; navbar collapses to sheet menu; generator switches to single column; paper view adapts margins.
- Error handling: toasts for auth, generation, OCR, PDF, delete. Form-level inline errors via zod.
- Performance: lazy-load `/generate` and `/papers/:id`; memoize paper lists.

## 11. Out of Scope (not building)

- Google or social login.
- "About the Team" section.
- Server-side PDF rendering.
- Real-time collaboration.

After approval I'll enable Lovable Cloud, set up auth + tables + RLS, scaffold the design system, build pages in order (Landing → Auth → Dashboard → Generator → Paper view), wire AI + OCR edge functions, and finish with PDF export and polish.
