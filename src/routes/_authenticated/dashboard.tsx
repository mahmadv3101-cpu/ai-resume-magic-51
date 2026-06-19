import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileText, TrendingUp, Eye, Download, ArrowUpRight, Sparkles, Plus } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — ResumeAI Pro" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return null;
      const { data: resumes } = await supabase
        .from("resumes")
        .select("id, title, target_role, ats_score, status, download_count, view_count, updated_at, template")
        .eq("user_id", u.user.id)
        .order("updated_at", { ascending: false });
      const all = resumes ?? [];
      const avgScore = all.length ? Math.round(all.reduce((s, r) => s + (r.ats_score ?? 0), 0) / all.length) : 0;
      const totalDownloads = all.reduce((s, r) => s + (r.download_count ?? 0), 0);
      const totalViews = all.reduce((s, r) => s + (r.view_count ?? 0), 0);
      return { resumes: all, total: all.length, avgScore, totalDownloads, totalViews };
    },
  });

  const cards = [
    { label: "Total Resumes", value: stats?.total ?? 0, icon: FileText, color: "primary" },
    { label: "Avg ATS Score", value: stats?.avgScore ?? 0, suffix: "/100", icon: TrendingUp, color: "accent" },
    { label: "Total Views", value: stats?.totalViews ?? 0, icon: Eye, color: "muted" },
    { label: "Downloads", value: stats?.totalDownloads ?? 0, icon: Download, color: "muted" },
  ];

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="font-mono text-xs text-primary uppercase tracking-widest mb-2">[ Overview ]</p>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back.</h1>
        <p className="text-muted-foreground mt-1">Here's how your resumes are performing.</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="border-border/60">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`size-9 rounded-lg grid place-items-center ${c.color === "primary" ? "bg-primary/10 text-primary" : c.color === "accent" ? "bg-accent/10 text-accent" : "bg-secondary text-foreground"}`}>
                    <c.icon className="size-4" />
                  </div>
                  <ArrowUpRight className="size-3.5 text-muted-foreground" />
                </div>
                <div className="text-3xl font-extrabold tracking-tight">
                  {c.value}<span className="text-base text-muted-foreground font-medium">{c.suffix ?? ""}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{c.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Resumes</CardTitle>
              <CardDescription>Your most recently edited documents.</CardDescription>
            </div>
            <Button asChild size="sm" variant="outline">
              <Link to="/resumes">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {!stats?.resumes.length ? (
              <div className="py-16 text-center">
                <div className="size-12 mx-auto rounded-2xl bg-primary/10 text-primary grid place-items-center mb-4">
                  <Sparkles className="size-5" />
                </div>
                <h3 className="font-bold mb-1">Create your first resume</h3>
                <p className="text-sm text-muted-foreground mb-6">Let AI build an ATS-optimized resume in under 2 minutes.</p>
                <Button asChild className="rounded-full font-semibold">
                  <Link to="/resumes/new"><Plus className="size-4 mr-1" /> New Resume</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {stats.resumes.slice(0, 5).map((r) => (
                  <Link
                    key={r.id}
                    to="/resumes/$id"
                    params={{ id: r.id }}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/60 transition-colors group"
                  >
                    <div className="size-10 rounded-lg bg-secondary border grid place-items-center shrink-0">
                      <FileText className="size-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{r.title}</p>
                      <p className="text-xs text-muted-foreground">{r.target_role ?? "No target role"}</p>
                    </div>
                    <div className="hidden sm:flex flex-col items-end gap-1">
                      <span className="text-xs font-mono text-muted-foreground">ATS</span>
                      <span className={`text-sm font-bold ${(r.ats_score ?? 0) >= 80 ? "text-accent" : (r.ats_score ?? 0) >= 60 ? "text-primary" : "text-muted-foreground"}`}>
                        {r.ats_score ?? "—"}
                      </span>
                    </div>
                    <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ATS Performance</CardTitle>
            <CardDescription>Average score across resumes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <div className="text-6xl font-extrabold tracking-tight text-primary">{stats?.avgScore ?? 0}</div>
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mt-1">out of 100</p>
            </div>
            <Progress value={stats?.avgScore ?? 0} className="h-2 mb-4" />
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground">90-100</span><span className="font-mono">Excellent</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">70-89</span><span className="font-mono">Strong</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{"< 70"}</span><span className="font-mono">Needs work</span></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
