import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import templateExec from "@/assets/template-executive.jpg";
import templateModern from "@/assets/template-modern.jpg";
import templateClassic from "@/assets/template-classic.jpg";

export const Route = createFileRoute("/_authenticated/templates")({
  head: () => ({ meta: [{ title: "Templates — ResumeAI Pro" }] }),
  component: TemplatesPage,
});

const TEMPLATES = [
  { id: "executive-minimal", name: "Executive Minimal", tag: "Senior Leadership", img: templateExec, popular: true },
  { id: "modern-tech", name: "Modern Tech", tag: "Engineering & Product", img: templateModern },
  { id: "classic-ledger", name: "Classic Ledger", tag: "Law & Finance", img: templateClassic },
];

function TemplatesPage() {
  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <div className="mb-8">
        <p className="font-mono text-xs text-primary uppercase tracking-widest mb-2">[ Templates ]</p>
        <h1 className="text-3xl font-bold tracking-tight">Resume Templates</h1>
        <p className="text-muted-foreground mt-1">Battle-tested layouts. Every template is ATS-parseable.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEMPLATES.map((t) => (
          <Card key={t.id} className="group overflow-hidden hover:shadow-xl transition-all">
            <div className="aspect-[3/4] bg-secondary border-b overflow-hidden">
              <img src={t.img} alt={t.name} loading="lazy" width={512} height={704} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700" />
            </div>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold">{t.name}</h3>
                {t.popular && <Badge className="bg-accent/15 text-accent border-accent/20" variant="outline">Popular</Badge>}
              </div>
              <p className="text-xs text-muted-foreground mb-3">{t.tag}</p>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Check className="size-3 text-accent" /> ATS Optimized
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
