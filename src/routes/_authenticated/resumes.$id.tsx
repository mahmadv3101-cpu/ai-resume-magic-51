import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { analyzeAts, enhanceBullet } from "@/lib/resume.functions";
import type { ResumeContent, AtsAnalysis } from "@/lib/resume-types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Sparkles, Loader2, RefreshCw, Check, X, Wand2, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { exportResumePdf } from "@/lib/pdf";
import { ResumePreview } from "@/components/resume-preview";

export const Route = createFileRoute("/_authenticated/resumes/$id")({
  head: () => ({ meta: [{ title: "Edit Resume — ResumeAI Pro" }] }),
  component: ResumeEditor,
});

function ResumeEditor() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const runAnalysis = useServerFn(analyzeAts);
  const runEnhance = useServerFn(enhanceBullet);

  const { data: resume, isLoading } = useQuery({
    queryKey: ["resume", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("resumes").select("*").eq("id", id).single();
      if (error) throw error;
      return data;
    },
  });

  const save = useMutation({
    mutationFn: async (patch: Record<string, unknown>) => {
      const { error } = await supabase.from("resumes").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["resume", id] });
    },
  });

  const [analyzing, setAnalyzing] = useState(false);

  async function handleAnalyze() {
    if (!resume) return;
    setAnalyzing(true);
    try {
      const analysis = await runAnalysis({
        data: {
          content: resume.content,
          targetRole: resume.target_role ?? undefined,
          targetJobDescription: resume.target_job_description ?? undefined,
        },
      });
      await save.mutateAsync({ ats_score: analysis.score, ats_analysis: analysis });
      toast.success(`ATS Score: ${analysis.score}/100`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  }

  async function handleDownload() {
    if (!resume) return;
    exportResumePdf(resume.content as unknown as ResumeContent, resume.template as "executive-minimal", `${resume.title}.pdf`);
    await save.mutateAsync({ download_count: (resume.download_count ?? 0) + 1 });
    toast.success("PDF downloaded");
  }

  if (isLoading || !resume) {
    return (
      <div className="p-10 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const content = resume.content as unknown as ResumeContent;
  const analysis = resume.ats_analysis as unknown as AtsAnalysis | null;

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="sticky top-14 z-20 bg-background/85 backdrop-blur-md border-b">
        <div className="px-6 lg:px-8 py-3 flex items-center gap-3">
          <button onClick={() => navigate({ to: "/resumes" })} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> Resumes
          </button>
          <div className="h-5 w-px bg-border mx-2" />
          <Input
            value={resume.title}
            onChange={(e) => save.mutate({ title: e.target.value })}
            className="border-0 shadow-none h-8 font-semibold text-base focus-visible:ring-0 max-w-xs"
          />
          <div className="ml-auto flex items-center gap-2">
            {resume.ats_score != null && (
              <Badge variant="secondary" className="gap-1.5 px-2 py-1">
                <TrendingUp className="size-3" />
                ATS {resume.ats_score}/100
              </Badge>
            )}
            <Button size="sm" variant="outline" onClick={handleAnalyze} disabled={analyzing}>
              {analyzing ? <Loader2 className="size-3.5 animate-spin mr-1.5" /> : <Sparkles className="size-3.5 mr-1.5" />}
              Analyze
            </Button>
            <Button size="sm" onClick={handleDownload} className="rounded-full font-semibold">
              <Download className="size-3.5 mr-1.5" /> PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_1fr] xl:grid-cols-[480px_1fr_400px] gap-0 min-h-[calc(100vh-7rem)]">
        {/* Edit panel */}
        <div className="p-6 lg:p-8 border-r overflow-y-auto">
          <Tabs defaultValue="personal">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="personal">Profile</TabsTrigger>
              <TabsTrigger value="experience">Work</TabsTrigger>
              <TabsTrigger value="education">School</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-3">
              <Field label="Full name" value={content.personal?.fullName ?? ""} onChange={(v) => save.mutate({ content: { ...content, personal: { ...content.personal, fullName: v } } })} />
              <Field label="Headline" value={content.personal?.headline ?? ""} onChange={(v) => save.mutate({ content: { ...content, personal: { ...content.personal, headline: v } } })} />
              <Field label="Email" value={content.personal?.email ?? ""} onChange={(v) => save.mutate({ content: { ...content, personal: { ...content.personal, email: v } } })} />
              <Field label="Phone" value={content.personal?.phone ?? ""} onChange={(v) => save.mutate({ content: { ...content, personal: { ...content.personal, phone: v } } })} />
              <Field label="Location" value={content.personal?.location ?? ""} onChange={(v) => save.mutate({ content: { ...content, personal: { ...content.personal, location: v } } })} />
              <Field label="LinkedIn" value={content.personal?.linkedin ?? ""} onChange={(v) => save.mutate({ content: { ...content, personal: { ...content.personal, linkedin: v } } })} />
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Summary</label>
                <Textarea
                  rows={5}
                  value={content.summary ?? ""}
                  onChange={(e) => save.mutate({ content: { ...content, summary: e.target.value } })}
                />
              </div>
            </TabsContent>

            <TabsContent value="experience" className="space-y-4">
              {(content.experience ?? []).map((exp, i) => (
                <Card key={i}>
                  <CardContent className="p-4 space-y-2">
                    <Field label="Role" value={exp.role} onChange={(v) => {
                      const next = [...content.experience]; next[i] = { ...exp, role: v };
                      save.mutate({ content: { ...content, experience: next } });
                    }} />
                    <Field label="Company" value={exp.company} onChange={(v) => {
                      const next = [...content.experience]; next[i] = { ...exp, company: v };
                      save.mutate({ content: { ...content, experience: next } });
                    }} />
                    <div className="grid grid-cols-2 gap-2">
                      <Field label="Start" value={exp.startDate} onChange={(v) => {
                        const next = [...content.experience]; next[i] = { ...exp, startDate: v };
                        save.mutate({ content: { ...content, experience: next } });
                      }} />
                      <Field label="End" value={exp.endDate ?? ""} onChange={(v) => {
                        const next = [...content.experience]; next[i] = { ...exp, endDate: v };
                        save.mutate({ content: { ...content, experience: next } });
                      }} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Bullets</label>
                      {exp.bullets.map((b, bi) => (
                        <BulletRow
                          key={bi}
                          value={b}
                          onChange={(v) => {
                            const next = [...content.experience];
                            const bullets = [...exp.bullets]; bullets[bi] = v;
                            next[i] = { ...exp, bullets };
                            save.mutate({ content: { ...content, experience: next } });
                          }}
                          onEnhance={async () => {
                            try {
                              const res = await runEnhance({ data: { bullet: b, role: exp.role } });
                              const next = [...content.experience];
                              const bullets = [...exp.bullets]; bullets[bi] = res.bullet;
                              next[i] = { ...exp, bullets };
                              await save.mutateAsync({ content: { ...content, experience: next } });
                              toast.success("Bullet enhanced");
                            } catch { toast.error("Enhancement failed"); }
                          }}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="education" className="space-y-4">
              {(content.education ?? []).map((ed, i) => (
                <Card key={i}>
                  <CardContent className="p-4 space-y-2">
                    <Field label="School" value={ed.school} onChange={(v) => {
                      const next = [...content.education]; next[i] = { ...ed, school: v };
                      save.mutate({ content: { ...content, education: next } });
                    }} />
                    <Field label="Degree" value={ed.degree} onChange={(v) => {
                      const next = [...content.education]; next[i] = { ...ed, degree: v };
                      save.mutate({ content: { ...content, education: next } });
                    }} />
                    <Field label="Field" value={ed.field ?? ""} onChange={(v) => {
                      const next = [...content.education]; next[i] = { ...ed, field: v };
                      save.mutate({ content: { ...content, education: next } });
                    }} />
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="skills" className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Skills (comma separated)</label>
                <Textarea
                  rows={6}
                  value={(content.skills ?? []).join(", ")}
                  onChange={(e) => save.mutate({ content: { ...content, skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) } })}
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(content.skills ?? []).map((s) => <Badge key={s} variant="secondary" className="font-normal">{s}</Badge>)}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview */}
        <div className="bg-secondary/40 p-6 lg:p-8 overflow-y-auto border-r">
          <ResumePreview content={content} />
        </div>

        {/* ATS Panel */}
        <div className="p-6 lg:p-8 overflow-y-auto bg-background xl:block hidden">
          <h3 className="text-sm font-mono uppercase tracking-widest text-primary mb-4">[ ATS ANALYSIS ]</h3>
          {!analysis ? (
            <div className="text-center py-12">
              <div className="size-12 mx-auto rounded-xl bg-primary/10 text-primary grid place-items-center mb-4">
                <Sparkles className="size-5" />
              </div>
              <p className="text-sm font-semibold mb-1">Run ATS Analysis</p>
              <p className="text-xs text-muted-foreground mb-4">Get a score, missing keywords, and recommendations.</p>
              <Button size="sm" onClick={handleAnalyze} disabled={analyzing} className="rounded-full">
                {analyzing ? <Loader2 className="size-3.5 animate-spin mr-1.5" /> : <Sparkles className="size-3.5 mr-1.5" />}
                Analyze Resume
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="text-center py-4 bg-secondary/50 rounded-xl">
                <div className="text-5xl font-extrabold tracking-tight text-primary">{analysis.score}</div>
                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">/ 100 ATS Score</p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <Metric label="Keywords" value={analysis.keywordMatch} />
                <Metric label="Format" value={analysis.formatScore} />
                <Metric label="Content" value={analysis.contentScore} />
              </div>
              {analysis.missingKeywords?.length > 0 && (
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-destructive mb-2">Missing Keywords</p>
                  <div className="flex flex-wrap gap-1">
                    {analysis.missingKeywords.map((k) => (
                      <Badge key={k} variant="outline" className="text-destructive border-destructive/30 font-normal">{k}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {analysis.recommendations?.length > 0 && (
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-accent mb-2">Recommendations</p>
                  <ul className="space-y-2">
                    {analysis.recommendations.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <Check className="size-3.5 text-accent shrink-0 mt-0.5" />
                        <span className="text-foreground/80 leading-relaxed">{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {analysis.weaknesses?.length > 0 && (
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">Weaknesses</p>
                  <ul className="space-y-2">
                    {analysis.weaknesses.map((w, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <X className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
                        <span className="text-muted-foreground leading-relaxed">{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <Button size="sm" variant="outline" onClick={handleAnalyze} disabled={analyzing} className="w-full">
                <RefreshCw className="size-3.5 mr-1.5" /> Re-analyze
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} className="h-9" />
    </div>
  );
}

function BulletRow({ value, onChange, onEnhance }: { value: string; onChange: (v: string) => void; onEnhance: () => Promise<void> }) {
  const [loading, setLoading] = useState(false);
  return (
    <div className="flex gap-1.5 items-start">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        className="text-sm flex-1"
      />
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="shrink-0 size-9 text-primary hover:bg-primary/10"
        disabled={loading}
        onClick={async () => { setLoading(true); await onEnhance(); setLoading(false); }}
        title="Enhance with AI"
      >
        {loading ? <Loader2 className="size-3.5 animate-spin" /> : <Wand2 className="size-3.5" />}
      </Button>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-secondary/50 rounded-lg p-2">
      <div className="text-xl font-bold">{value}</div>
      <p className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">{label}</p>
    </div>
  );
}
