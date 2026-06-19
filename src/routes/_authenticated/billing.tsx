import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/billing")({
  head: () => ({ meta: [{ title: "Billing — ResumeAI Pro" }] }),
  component: BillingPage,
});

const TIERS = [
  { name: "Starter", price: 0, features: ["1 active resume", "Standard templates", "Basic ATS score", "PDF export"], current: true },
  { name: "Professional", price: 19, features: ["Unlimited resumes", "Premium templates", "Full ATS analysis", "AI rewriting", "Cover letter generator", "Keyword optimization"], highlight: true },
  { name: "Executive", price: 49, features: ["Everything in Pro", "Dedicated career coach AI", "Priority generations", "Word & LinkedIn export"] },
];

function BillingPage() {
  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto">
      <div className="mb-8">
        <p className="font-mono text-xs text-primary uppercase tracking-widest mb-2">[ Billing ]</p>
        <h1 className="text-3xl font-bold tracking-tight">Plan & Billing</h1>
        <p className="text-muted-foreground mt-1">You're on the <span className="font-semibold text-foreground">Starter</span> plan.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {TIERS.map((t) => (
          <Card key={t.name} className={`relative ${t.highlight ? "ring-2 ring-primary/30 shadow-xl" : ""}`}>
            {t.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary text-primary-foreground px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest">
                Recommended
              </div>
            )}
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-lg">{t.name}</h3>
                {t.current && <Badge variant="secondary">Current</Badge>}
              </div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold">${t.price}</span>
                <span className="text-sm text-muted-foreground">/mo</span>
              </div>
              <Button className={`w-full mb-6 rounded-xl font-semibold ${t.current ? "" : t.highlight ? "" : "bg-secondary text-foreground hover:bg-secondary/80"}`} disabled={t.current} variant={t.current ? "outline" : "default"}>
                {t.current ? "Current Plan" : <><Sparkles className="size-3.5 mr-1.5" /> Upgrade</>}
              </Button>
              <ul className="space-y-2">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="size-4 text-accent mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-1">Payment method</h3>
          <p className="text-sm text-muted-foreground">No payment method on file. Upgrade to add one.</p>
        </CardContent>
      </Card>
    </div>
  );
}
