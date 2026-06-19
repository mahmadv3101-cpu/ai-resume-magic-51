export interface ResumeContent {
  personal: {
    fullName: string;
    email: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    website?: string;
    headline?: string;
  };
  summary: string;
  experience: Array<{
    company: string;
    role: string;
    location?: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
    bullets: string[];
  }>;
  education: Array<{
    school: string;
    degree: string;
    field?: string;
    startDate?: string;
    endDate?: string;
    gpa?: string;
  }>;
  skills: string[];
  projects?: Array<{ name: string; description: string; link?: string }>;
  certifications?: Array<{ name: string; issuer: string; date?: string }>;
}

export interface AtsAnalysis {
  score: number;
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  recommendations: string[];
  keywordMatch: number;
  formatScore: number;
  contentScore: number;
}

export const TEMPLATES = [
  { id: "executive-minimal", name: "Executive Minimal", description: "Clean, recruiter-friendly typography for senior roles." },
  { id: "modern-tech", name: "Modern Tech", description: "Two-column with teal accents for engineering & product." },
  { id: "classic-ledger", name: "Classic Ledger", description: "Traditional serif layout for law, finance, and consulting." },
] as const;

export type TemplateId = typeof TEMPLATES[number]["id"];
