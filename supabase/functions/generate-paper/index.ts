import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are ExamForge AI, an expert exam paper designer for schools, colleges and universities.

Your job: produce a professional, well-structured question paper plus a separate answer key, returned via the provided tool call.

CORE RULES:
- Generate ORIGINAL, fresh questions. Never copy questions verbatim from any provided previous paper.
- When a previous question paper is supplied, analyze its STRUCTURE only — sections, marks distribution, question style, difficulty mix, choice/optional patterns — and create a NEW paper that mirrors that pattern with brand-new questions.
- When a syllabus is supplied, ground all questions in the listed topics.
- Match the requested difficulty (Easy / Medium / Hard / Mixed). For "Mixed", balance across difficulty levels.
- Honor the requested number of questions and total marks. Distribute marks logically across sections.
- Number questions sequentially within each section (1, 2, 3…).
- Group questions into clearly named sections (e.g. "Part A", "Part B", "Section A — Short Answer").
- Always also produce an answer key / solution outline that maps to every question by number.
- Use the question types requested. If "Mixed" is included, blend types intelligently.

CHOICE / OPTIONAL PATTERNS (VERY IMPORTANT):
Many real exams have "attempt N of M" rules. Examples:
  - KTU university pattern: Part A = compulsory short-answer questions (attempt all). Part B = for EACH module, two long-answer questions are given and the student must answer ONLY ONE. So with 4 modules, Part B has 8 questions but the student attempts 4 (one per module).
  - CBSE / state board pattern: many sections give choice e.g. "Attempt any 5 out of 7" or "Either / Or" pairs.
- When the user specifies a paper pattern, an exam type like "KTU", or a previous paper that uses such a structure, REPLICATE it faithfully:
   * Generate the FULL set of questions (e.g. all 8 Part B questions across modules), NOT just the ones to attempt.
   * Use clear section instructions stating exactly how many to attempt, e.g. "Answer ALL questions" or "Answer ANY ONE question from each module".
   * For "either/or" main questions, emit BOTH as separate top-level questions (e.g. number "9" and "10") and set "or_with_next": true on the FIRST of the pair so the renderer draws an OR divider between them.
- The answer key must include answers for EVERY question generated (including the optional alternates), not only the ones meant to be attempted.
- Keep questions academically sound and exam-appropriate for the subject and course.

SUB-QUESTIONS (IMPORTANT):
- A main question can have up to 3 sub-parts (a), (b), (c). Use the "sub_questions" array on the question for this — do NOT cram sub-parts into "text" with line breaks.
- Each sub-part is an object: { "label": "a", "text": "...", "marks": <number> }. Give EACH sub-part its own marks.
- When a question has sub_questions, leave "text" empty (or use it only for a short shared stem). The total "marks" on the question is optional — sub-part marks should sum to the intended total.
- If a main question has no sub-parts, put the question in "text" and the marks in "marks".

FORMATTING RULES (follow strictly so the paper renders cleanly):
- Question text must be plain text. NO markdown — no **bold**, no *italics*, no backticks, no "###" headings, no bullet dashes.
- "number" is the main question number only — just an integer like "9" or "10". Do NOT include "(a)" inside "number"; sub-parts live in "sub_questions".
- Do not embed marks inside any text field — always use the dedicated "marks" field on the question or sub-part.
- Section "name" should be short, e.g. "PART A", "Section B — Long Answer". Put attempt rules in the section "instructions" field.
- Top-level "instructions" array is for general exam-wide rules (time, calculator allowed, etc.). One rule per array item, no numbering inside the string.
- Always set "duration" (e.g. "3 Hours") and "totalMarks" on the paper object when known.

ANSWER KEY:
- For questions with sub-parts, use answer key entries like number "9a", "9b" so each sub-part has its own answer.`;

const TOOL = {
  type: "function",
  function: {
    name: "submit_question_paper",
    description: "Return the generated question paper and answer key in structured form.",
    parameters: {
      type: "object",
      properties: {
        paper: {
          type: "object",
          properties: {
            title: { type: "string" },
            subject: { type: "string" },
            course: { type: "string" },
            totalMarks: { type: "number" },
            duration: { type: "string" },
            instructions: { type: "array", items: { type: "string" } },
            sections: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  instructions: { type: "string" },
                  questions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        number: { type: "string" },
                        text: { type: "string" },
                        marks: { type: "number" },
                        type: { type: "string" },
                      },
                      required: ["number", "text"],
                    },
                  },
                },
                required: ["name", "questions"],
              },
            },
          },
          required: ["title", "sections"],
        },
        answerKey: {
          type: "array",
          items: {
            type: "object",
            properties: {
              number: { type: "string" },
              answer: { type: "string" },
            },
            required: ["number", "answer"],
          },
        },
      },
      required: ["paper", "answerKey"],
    },
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const body = await req.json();
    const {
      mode, subject, course, modules, examType, difficulty, questionTypes,
      totalMarks, numQuestions, syllabus, previousPaper, customPrompt, additional,
    } = body ?? {};

    if (!subject && !syllabus && !previousPaper && !customPrompt) {
      return new Response(JSON.stringify({ error: "Provide a syllabus, previous paper, or custom prompt" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userMsg = `
Generate a question paper.

Mode: ${mode}
Subject: ${subject}
${course ? `Course/Class: ${course}` : ""}
${modules ? `Number of modules: ${modules}` : ""}
Exam type: ${examType}
Difficulty: ${difficulty}
Question types requested: ${(questionTypes ?? []).join(", ")}
Total marks: ${totalMarks}
Number of questions: ${numQuestions}

${syllabus ? `SYLLABUS:\n${syllabus}\n` : ""}
${previousPaper ? `PREVIOUS QUESTION PAPER (analyze pattern only, DO NOT copy):\n${previousPaper}\n` : ""}
${customPrompt ? `CUSTOM PROMPT:\n${customPrompt}\n` : ""}
${additional ? `ADDITIONAL INSTRUCTIONS:\n${additional}\n` : ""}

Now produce the paper plus answer key by calling submit_question_paper.
`.trim();

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMsg },
        ],
        tools: [TOOL],
        tool_choice: { type: "function", function: { name: "submit_question_paper" } },
      }),
    });

    if (aiResp.status === 429) {
      return new Response(JSON.stringify({ error: "Rate limit reached. Please try again in a moment." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (aiResp.status === 402) {
      return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to your workspace." }), {
        status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!aiResp.ok) {
      const t = await aiResp.text();
      console.error("AI error", aiResp.status, t);
      return new Response(JSON.stringify({ error: "AI generation failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await aiResp.json();
    const call = data?.choices?.[0]?.message?.tool_calls?.[0];
    if (!call?.function?.arguments) {
      console.error("No tool call in response", JSON.stringify(data));
      return new Response(JSON.stringify({ error: "AI did not return a structured paper" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const parsed = JSON.parse(call.function.arguments);

    return new Response(JSON.stringify(parsed), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-paper error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
