import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { generateResume } from "@/lib/resume.functions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles, Loader2, Check } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/resumes/new")({
  head: () => ({ meta: [{ title: "New Resume — ResumeAI Pro" }] }),
  component: NewResumeWizard,
});

const STEPS = ["Target Role", "Your Background", "Personal Info", "AI Generation"];

function NewResumeWizard() {
  const navigate = useNavigate();
  const generate = useServerFn(generateResume);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    targetRole: "",
    targetJobDescription: "",
    rawExperience: "",
    fullName: "",
    email: "",
  });

  const canNext =
    (step === 0 && form.targetRole.trim().length > 1) ||
    (step === 1 && form.rawExperience.trim().length > 20) ||
    (step === 2 && form.fullName.trim() && form.email.includes("@"));

  async function handleGenerate() {
    setStep(3);
    setLoading(true);
    try {
      const content = await generate({ data: form });
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Not signed in");
      const { data: row, error } = await supabase
        .from("resumes")
        .insert({
          user_id: u.user.id,
          title: `${form.targetRole} — Resume`,
          target_role: form.targetRole,
          target_job_description: form.targetJobDescription || null,
          content,
          status: "complete",
        })
        .select()
        .single();
      if (error) throw error;
      toast.success("Resume generated!");
      navigate({ to: "/resumes/$id", params: { id: row.id } });
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : "Generation failed");
      setLoading(false);
      setStep(2);
    }
  }

  return (
    <div className="min-h-full p-6 lg:p-10 max-w-3xl mx-auto">
      <button onClick={() => navigate({ to: "/resumes" })} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="size-4" /> Back to resumes
      </button>

      <div className="mb-10">
        <p className="font-mono text-xs text-primary uppercase tracking-widest mb-2">[ Step {step + 1} of {STEPS.length} ]</p>
        <h1 className="text-3xl font-bold tracking-tight mb-4">{STEPS[step]}</h1>
        <Progress value={((step + 1) / STEPS.length) * 100} className="h-1.5" />
      </div>

      <Card>
        <CardContent className="p-6 lg:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.3 }}
            >
              {step === 0 && (
                <div className="space-y-5">
                  <div>
                    <Label className="text-base">What role are you targeting?</Label>
                    <p className="text-sm text-muted-foreground mb-3">Be specific — "Senior Product Manager at FAANG" beats "PM".</p>
                    <Input
                      autoFocus
                      placeholder="e.g. Senior Software Engineer, Backend Infrastructure"
                      value={form.targetRole}
                      onChange={(e) => setForm({ ...form, targetRole: e.target.value })}
                      className="h-12 text-base"
                    />
                  </div>
                  <div>
                    <Label className="text-base">Paste the job description (optional)</Label>
                    <p className="text-sm text-muted-foreground mb-3">The AI will tune keywords and structure to match.</p>
                    <Textarea
                      placeholder="Paste full JD here for maximum ATS optimization..."
                      value={form.targetJobDescription}
                      onChange={(e) => setForm({ ...form, targetJobDescription: e.target.value })}
                      rows={6}
                    />
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <Label className="text-base">Tell us about your background</Label>
                    <p className="text-sm text-muted-foreground mb-3">Stream-of-consciousness is fine — companies, roles, dates, big wins. The AI handles the polish.</p>
                    <Textarea
                      autoFocus
                      placeholder="e.g. Worked at Acme Corp 2021-2024 as Engineering Manager, led team of 8 backend engineers, shipped real-time analytics platform serving 50M users, reduced infra cost 40%. Before that..."
                      value={form.rawExperience}
                      onChange={(e) => setForm({ ...form, rawExperience: e.target.value })}
                      rows={12}
                    />
                    <p className="text-xs text-muted-foreground mt-2 font-mono">{form.rawExperience.length} characters</p>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <div>
                    <Label htmlFor="fn" className="text-base">Full name</Label>
                    <Input id="fn" autoFocus value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Sarah Jenkins" className="h-12 text-base mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="em" className="text-base">Email</Label>
                    <Input id="em" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="sarah@example.com" className="h-12 text-base mt-2" />
                  </div>
                  <div className="rounded-xl bg-primary/5 border border-primary/15 p-4">
                    <p className="text-xs font-mono text-primary uppercase tracking-widest mb-1">[ Ready to generate ]</p>
                    <p className="text-sm">We'll create a complete resume targeting <span className="font-semibold">{form.targetRole}</span> using your background. Takes ~15 seconds.</p>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="py-12 text-center">
                  {loading ? (
                    <>
                      <div className="relative size-16 mx-auto mb-6">
                        <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
                        <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                        <Sparkles className="absolute inset-0 m-auto size-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Generating your resume...</h3>
                      <p className="text-muted-foreground text-sm">Analyzing your background, optimizing for ATS, structuring achievements.</p>
                    </>
                  ) : (
                    <>
                      <div className="size-16 mx-auto rounded-full bg-accent/10 grid place-items-center mb-6">
                        <Check className="size-7 text-accent" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Ready!</h3>
                    </>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {step < 3 && (
            <div className="flex justify-between mt-10 pt-6 border-t">
              <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
                <ArrowLeft className="size-4 mr-1" /> Back
              </Button>
              {step === 2 ? (
                <Button onClick={handleGenerate} disabled={!canNext} className="rounded-xl font-semibold">
                  <Sparkles className="size-4 mr-1" /> Generate with AI
                </Button>
              ) : (
                <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext} className="rounded-xl font-semibold">
                  Continue <ArrowRight className="size-4 ml-1" />
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
