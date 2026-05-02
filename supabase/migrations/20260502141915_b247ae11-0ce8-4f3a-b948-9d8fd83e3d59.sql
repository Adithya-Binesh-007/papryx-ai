
-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Generated papers
CREATE TABLE public.generated_papers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  course TEXT,
  syllabus TEXT,
  previous_paper_input TEXT,
  custom_prompt TEXT,
  input_mode TEXT NOT NULL,
  exam_type TEXT,
  difficulty TEXT,
  marks INTEGER,
  question_paper JSONB NOT NULL,
  answer_key JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.generated_papers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own papers" ON public.generated_papers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own papers" ON public.generated_papers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own papers" ON public.generated_papers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own papers" ON public.generated_papers FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_generated_papers_user_created ON public.generated_papers(user_id, created_at DESC);
