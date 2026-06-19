import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Trash2, ArrowUpRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/_authenticated/resumes")({
  head: () => ({ meta: [{ title: "My Resumes — ResumeAI Pro" }] }),
  component: ResumesPage,
});

function ResumesPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["resumes"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return [];
      const { data } = await supabase
        .from("resumes")
        .select("*")
        .eq("user_id", u.user.id)
        .order("updated_at", { ascending: false });
      return data ?? [];
    },
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("resumes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["resumes"] });
      qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
      toast.success("Resume deleted");
    },
  });

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-xs text-primary uppercase tracking-widest mb-2">[ Resumes ]</p>
          <h1 className="text-3xl font-bold tracking-tight">My Resumes</h1>
          <p className="text-muted-foreground mt-1">{data?.length ?? 0} {data?.length === 1 ? "resume" : "resumes"}</p>
        </div>
        <Button asChild className="rounded-full font-semibold">
          <Link to="/resumes/new"><Plus className="size-4 mr-1" /> New Resume</Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map((i) => (
            <div key={i} className="h-48 rounded-2xl bg-secondary/60 animate-pulse" />
          ))}
        </div>
      ) : !data?.length ? (
        <Card>
          <CardContent className="py-20 text-center">
            <div className="size-14 mx-auto rounded-2xl bg-primary/10 text-primary grid place-items-center mb-4">
              <Sparkles className="size-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">No resumes yet</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">Let our AI build your first ATS-optimized resume in under 2 minutes.</p>
            <Button asChild size="lg" className="rounded-full font-semibold">
              <Link to="/resumes/new"><Plus className="size-4 mr-1" /> Create Resume</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((r) => (
            <Card key={r.id} className="group hover:shadow-lg transition-all overflow-hidden">
              <div className="aspect-[4/3] bg-gradient-to-br from-secondary to-secondary/40 border-b relative">
                <div className="absolute inset-6 bg-card rounded shadow-sm p-3 space-y-1.5">
                  <div className="h-2 w-1/2 bg-foreground/80 rounded" />
                  <div className="h-1 w-1/3 bg-primary/60 rounded" />
                  <div className="h-px w-full bg-border my-1" />
                  {[1,2,3,4,5].map((i) => (
                    <div key={i} className="h-1 bg-muted rounded" style={{ width: `${80 - i*8}%` }} />
                  ))}
                </div>
                {r.ats_score != null && (
                  <div className="absolute top-3 right-3 bg-card border rounded-lg px-2 py-1 shadow-sm">
                    <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest block leading-none">ATS</span>
                    <span className={`text-sm font-bold ${r.ats_score >= 80 ? "text-accent" : "text-primary"}`}>{r.ats_score}</span>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-bold truncate flex-1">{r.title}</h3>
                  <button
                    onClick={(e) => { e.preventDefault(); if (confirm("Delete this resume?")) del.mutate(r.id); }}
                    className="text-muted-foreground hover:text-destructive transition-colors p-1"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground truncate">{r.target_role ?? "No target role"}</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                    {formatDistanceToNow(new Date(r.updated_at), { addSuffix: true })}
                  </span>
                  <Button asChild size="sm" variant="ghost" className="h-7 px-2 text-xs font-semibold">
                    <Link to="/resumes/$id" params={{ id: r.id }}>
                      Open <ArrowUpRight className="size-3 ml-0.5" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
