import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, Eye, Download, FileText } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export const Route = createFileRoute("/_authenticated/analytics")({
  head: () => ({ meta: [{ title: "Analytics — ResumeAI Pro" }] }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const { data } = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return null;
      const { data: rs } = await supabase
        .from("resumes")
        .select("title, ats_score, download_count, view_count, updated_at")
        .eq("user_id", u.user.id);
      return rs ?? [];
    },
  });

  const chartData = (data ?? []).map((r) => ({
    name: r.title.length > 18 ? r.title.slice(0, 16) + "…" : r.title,
    score: r.ats_score ?? 0,
    downloads: r.download_count ?? 0,
    views: r.view_count ?? 0,
  }));

  const totals = {
    total: data?.length ?? 0,
    avgScore: data?.length ? Math.round(data.reduce((s, r) => s + (r.ats_score ?? 0), 0) / data.length) : 0,
    downloads: data?.reduce((s, r) => s + (r.download_count ?? 0), 0) ?? 0,
    views: data?.reduce((s, r) => s + (r.view_count ?? 0), 0) ?? 0,
  };

  const cards = [
    { label: "Resumes", value: totals.total, icon: FileText },
    { label: "Avg ATS", value: totals.avgScore, icon: TrendingUp },
    { label: "Downloads", value: totals.downloads, icon: Download },
    { label: "Views", value: totals.views, icon: Eye },
  ];

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <div className="mb-8">
        <p className="font-mono text-xs text-primary uppercase tracking-widest mb-2">[ Analytics ]</p>
        <h1 className="text-3xl font-bold tracking-tight">Resume Analytics</h1>
        <p className="text-muted-foreground mt-1">Performance across all your resumes.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <c.icon className="size-4 text-primary" />
              </div>
              <div className="text-3xl font-extrabold">{c.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{c.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ATS Score by Resume</CardTitle>
          <CardDescription>Compare performance across documents.</CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length === 0 ? (
            <div className="py-16 text-center text-sm text-muted-foreground">No data yet. Create a resume to see analytics.</div>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="name" fontSize={11} stroke="currentColor" opacity={0.5} />
                <YAxis fontSize={11} stroke="currentColor" opacity={0.5} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: "white", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="score" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
