import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateText, generateObject } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";
import type { ResumeContent, AtsAnalysis } from "./resume-types";

const MODEL = "google/gemini-3-flash-preview";

const resumeContentSchema = z.object({
  personal: z.object({
    fullName: z.string(),
    email: z.string(),
    phone: z.string().optional(),
    location: z.string().optional(),
    linkedin: z.string().optional(),
    website: z.string().optional(),
    headline: z.string().optional(),
  }),
  summary: z.string(),
  experience: z.array(z.object({
    company: z.string(),
    role: z.string(),
    location: z.string().optional(),
    startDate: z.string(),
    endDate: z.string().optional(),
    current: z.boolean().optional(),
    bullets: z.array(z.string()),
  })),
  education: z.array(z.object({
    school: z.string(),
    degree: z.string(),
    field: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    gpa: z.string().optional(),
  })),
  skills: z.array(z.string()),
  projects: z.array(z.object({
    name: z.string(),
    description: z.string(),
    link: z.string().optional(),
  })).optional(),
  certifications: z.array(z.object({
    name: z.string(),
    issuer: z.string(),
    date: z.string().optional(),
  })).optional(),
});

const atsAnalysisSchema = z.object({
  score: z.number().min(0).max(100),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  missingKeywords: z.array(z.string()),
  recommendations: z.array(z.string()),
  keywordMatch: z.number().min(0).max(100),
  formatScore: z.number().min(0).max(100),
  contentScore: z.number().min(0).max(100),
});

function gateway() {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("LOVABLE_API_KEY missing");
  return createLovableAiGatewayProvider(key);
}

/** Generate a complete resume from user inputs. */
export const generateResume = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({
    targetRole: z.string().min(1),
    targetJobDescription: z.string().optional(),
    rawExperience: z.string().min(10),
    fullName: z.string().min(1),
    email: z.string().email(),
  }).parse(data))
  .handler(async ({ data }) => {
    const gw = gateway();
    const { object } = await generateObject({
      model: gw(MODEL),
      schema: resumeContentSchema,
      system: `You are a world-class executive resume writer trained on 50,000+ successful hires at top-tier companies (Google, Stripe, Meta, OpenAI). You write ATS-optimized resumes using the STAR method with quantified, action-verb-led achievement bullets. Always return realistic, professional content even if input is sparse — infer reasonable details from the role and experience provided.`,
      prompt: `Generate a complete, ATS-optimized resume for the role "${data.targetRole}".

Candidate name: ${data.fullName}
Email: ${data.email}
${data.targetJobDescription ? `\nTarget job description:\n${data.targetJobDescription}\n` : ""}
Raw experience/background:
${data.rawExperience}

Generate:
- A compelling 2-3 sentence professional summary aligned to the target role
- 2-4 experience entries with 3-5 quantified achievement bullets each (use STAR method, action verbs, metrics)
- 1-2 education entries
- 10-15 relevant technical and soft skills
- Optional 1-2 standout projects

Be specific. Use real-sounding metrics (% growth, $ saved, team size). Match keywords from the job description when provided.`,
    });
    return object as ResumeContent;
  });

/** Rewrite a single experience bullet to be ATS-friendly. */
export const enhanceBullet = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({
    bullet: z.string().min(1),
    role: z.string().optional(),
  }).parse(data))
  .handler(async ({ data }) => {
    const gw = gateway();
    const { text } = await generateText({
      model: gw(MODEL),
      system: "You rewrite resume bullets into ATS-optimized, achievement-focused STAR format. Return ONLY the rewritten bullet text, no preamble, no quotes. Start with a strong action verb. Include metrics where possible.",
      prompt: `Rewrite this resume bullet${data.role ? ` for a ${data.role} role` : ""}:\n\n"${data.bullet}"`,
    });
    return { bullet: text.trim().replace(/^["']|["']$/g, "") };
  });

/** Suggest skills based on a target role. */
export const suggestSkills = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({
    targetRole: z.string().min(1),
    existingSkills: z.array(z.string()).default([]),
  }).parse(data))
  .handler(async ({ data }) => {
    const gw = gateway();
    const { object } = await generateObject({
      model: gw(MODEL),
      schema: z.object({ skills: z.array(z.string()) }),
      system: "You suggest the most ATS-critical hard and soft skills for a target role. Return 10-15 skills, no duplicates of existing.",
      prompt: `Target role: ${data.targetRole}\nExisting skills: ${data.existingSkills.join(", ") || "none"}\n\nReturn the top missing, high-impact skills for this role.`,
    });
    return object;
  });

/** Run ATS analysis on a resume. */
export const analyzeAts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({
    content: z.any(),
    targetRole: z.string().optional(),
    targetJobDescription: z.string().optional(),
  }).parse(data))
  .handler(async ({ data }) => {
    const gw = gateway();
    const { object } = await generateObject({
      model: gw(MODEL),
      schema: atsAnalysisSchema,
      system: `You are an ATS (Applicant Tracking System) analyzer trained on Workday, Greenhouse, Lever, and Taleo parsers. Score resumes for keyword density, structural parseability, semantic alignment to job descriptions, action-verb usage, and quantified achievements. Be honest and specific.`,
      prompt: `Analyze this resume for ATS compatibility${data.targetRole ? ` against the role "${data.targetRole}"` : ""}.
${data.targetJobDescription ? `\nJob description:\n${data.targetJobDescription}\n` : ""}
Resume content:
${JSON.stringify(data.content, null, 2)}

Score 0-100. Identify strengths, weaknesses, missing keywords from the JD, and concrete recommendations. Be specific — name actual missing skills.`,
    });
    return object as AtsAnalysis;
  });

/** Generate a cover letter. */
export const generateCoverLetter = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({
    resumeContent: z.any(),
    targetRole: z.string(),
    company: z.string(),
    jobDescription: z.string().optional(),
  }).parse(data))
  .handler(async ({ data }) => {
    const gw = gateway();
    const { text } = await generateText({
      model: gw(MODEL),
      system: "You write concise, compelling cover letters in the voice of the candidate. 3-4 paragraphs. No clichés. Open with a hook, prove fit with specific resume evidence, close with confident call to action.",
      prompt: `Candidate resume:\n${JSON.stringify(data.resumeContent)}\n\nTarget role: ${data.targetRole} at ${data.company}\n${data.jobDescription ? `Job description:\n${data.jobDescription}` : ""}`,
    });
    return { letter: text.trim() };
  });
