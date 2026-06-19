import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Check, Zap, Target, Sparkles, FileText, BarChart3, Download, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import templateExec from "@/assets/template-executive.jpg";
import templateModern from "@/assets/template-modern.jpg";
import templateClassic from "@/assets/template-classic.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ResumeAI Pro — AI resumes engineered for ATS" },
      { name: "description", content: "Generate enterprise-grade, ATS-optimized resumes with AI. Real-time scoring, smart rewrites, instant PDF export. Used by candidates at Google, Stripe, and SpaceX." },
      { property: "og:title", content: "ResumeAI Pro — AI resumes engineered for ATS" },
      { property: "og:description", content: "Real-time ATS scoring, AI rewriting, and instant PDF export." },
    ],
  }),
  component: LandingPage,
});

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
};

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/10">
      <Nav />
      <Hero />
      <LogoCloud />
      <Features />
      <AiDemo />
      <Templates />
      <AtsSection />
      <Testimonials />
      <Pricing />
      <Faq />
      <FinalCta />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-bold tracking-tighter text-xl text-primary flex items-center gap-1">
            ResumeAI <span className="text-accent">Pro</span>
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#templates" className="hover:text-foreground transition-colors">Templates</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/auth" className="text-sm font-medium hover:text-primary transition-colors hidden sm:inline">Log in</Link>
          <Button asChild className="rounded-full font-semibold shadow-sm hover:shadow-md hover:shadow-primary/20 transition-all">
            <Link to="/auth">Get Started</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="pt-20 pb-16 px-6 overflow-hidden relative">
      <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)] pointer-events-none" />
      <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-mono mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            V2.0 NOW LIVE
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[0.95] text-balance mb-8">
            Stop guessing.{" "}
            <span className="text-primary">Start hiring.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-[45ch] mb-10 text-pretty">
            Generate enterprise-grade resumes engineered for ATS algorithms. Used by candidates at Google, Stripe, and SpaceX.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild size="lg" className="rounded-xl font-bold text-base h-12 px-7 shadow-xl shadow-primary/15 hover:scale-[1.02] active:scale-[0.98] transition-transform">
              <Link to="/auth">Build my Resume <ArrowRight className="ml-1 size-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-xl font-bold text-base h-12 px-7">
              <a href="#templates">View Examples</a>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="relative bg-secondary rounded-2xl p-4 shadow-2xl border overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-accent/40 animate-scan z-10" />
            <div className="bg-card rounded-lg shadow-sm border p-8 min-h-[500px] flex flex-col gap-6">
              <div>
                <div className="h-5 w-2/5 bg-foreground/90 rounded mb-2" />
                <div className="h-2 w-1/3 bg-muted rounded" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "ATS SCORE", value: "98", color: "primary" },
                  { label: "REACH", value: "High", color: "accent" },
                  { label: "KEYWORDS", value: "24", color: "muted" },
                ].map((m) => (
                  <div key={m.label} className={`h-20 rounded-lg border flex flex-col items-center justify-center ${m.color === "primary" ? "bg-primary/5 border-primary/15" : m.color === "accent" ? "bg-accent/5 border-accent/15" : "bg-secondary border-border"}`}>
                    <span className={`text-[10px] font-mono uppercase tracking-widest ${m.color === "primary" ? "text-primary" : m.color === "accent" ? "text-accent" : "text-muted-foreground"}`}>{m.label}</span>
                    <span className="text-2xl font-bold mt-1">{m.value}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3 pt-2">
                {[1,2,3].map((i) => (
                  <div key={i} className="flex items-start gap-4 p-3 bg-secondary/60 rounded-lg border">
                    <div className="size-4 rounded-full bg-accent mt-0.5 shrink-0" />
                    <div className="space-y-1.5 flex-1">
                      <div className="h-2 w-24 bg-foreground/30 rounded" />
                      <div className="h-2 w-full bg-muted rounded" />
                      <div className="h-2 w-3/4 bg-muted rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="absolute -bottom-6 -right-4 sm:-right-6 bg-card p-3 rounded-xl shadow-xl border"
          >
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-primary/10 grid place-items-center text-primary font-bold text-xs">AI</div>
              <div>
                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Optimization Active</p>
                <p className="text-sm font-bold">Parsing for Senior Role</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function LogoCloud() {
  return (
    <section className="py-12 border-y">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-xs font-mono text-muted-foreground uppercase tracking-[0.2em] mb-8">Trusted by talent at</p>
        <div className="flex flex-wrap justify-center items-center gap-x-12 sm:gap-x-16 gap-y-6 opacity-50">
          {["STRIPE","LINEAR","VERCEL","FIGMA","OPENAI","NOTION"].map((b) => (
            <div key={b} className="text-lg sm:text-xl font-black tracking-tighter">{b}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    { num: "01", icon: Target, color: "primary", title: "Real-time ATS Scoring", desc: "Instant feedback on how well your resume matches target job descriptions before you hit apply." },
    { num: "02", icon: Sparkles, color: "accent", title: "Smart Rewriting", desc: "Convert passive duties into achievement-based bullet points using the STAR method automatically." },
    { num: "03", icon: Zap, color: "muted", title: "Keyword Extraction", desc: "Our engine identifies missing technical skills required for the role and suggests where to add them." },
  ] as const;
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div {...fadeUp} className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Engineered for the modern recruiter.</h2>
            <p className="text-muted-foreground text-lg">Our AI doesn't just write; it maps your experience to what hiring managers and software actually look for.</p>
          </div>
          <div className="font-mono text-sm text-primary">[01] THE PROCESS</div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((it, i) => (
            <motion.div
              key={it.num}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.1 }}
              className="group p-8 rounded-2xl bg-secondary/60 border hover:bg-card hover:shadow-xl transition-all"
            >
              <div className={`size-12 rounded-xl grid place-items-center font-bold mb-6 group-hover:scale-110 transition-transform ${it.color === "primary" ? "bg-primary/10 text-primary" : it.color === "accent" ? "bg-accent/10 text-accent" : "bg-foreground/5 text-foreground"}`}>
                <it.icon className="size-5" />
              </div>
              <div className="font-mono text-xs text-muted-foreground mb-2">[{it.num}]</div>
              <h3 className="text-xl font-bold mb-3">{it.title}</h3>
              <p className="text-muted-foreground">{it.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AiDemo() {
  return (
    <section className="py-24 px-6 bg-secondary/40 border-y">
      <div className="max-w-7xl mx-auto">
        <motion.div {...fadeUp} className="max-w-2xl mb-12">
          <div className="font-mono text-sm text-primary mb-4">[02] AI REWRITING</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Watch passive duties become achievements.</h2>
          <p className="text-muted-foreground text-lg">Our model rewrites in your voice, in your context, with metrics that pass scrutiny.</p>
        </motion.div>
        <motion.div {...fadeUp} className="bg-foreground text-background rounded-2xl shadow-2xl overflow-hidden border">
          <div className="flex items-center gap-2 px-6 py-3 border-b border-white/10">
            <div className="flex gap-1.5">
              <div className="size-2.5 rounded-full bg-rose-500/60" />
              <div className="size-2.5 rounded-full bg-amber-500/60" />
              <div className="size-2.5 rounded-full bg-emerald-500/60" />
            </div>
            <span className="ml-3 text-[10px] font-mono text-white/40 uppercase tracking-widest">AI Optimizer v2.0</span>
          </div>
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10">
            <div className="p-8">
              <div className="text-[10px] font-mono text-accent uppercase tracking-widest mb-3">Raw Input</div>
              <p className="text-sm text-white/70 leading-relaxed">
                "I managed a team of five people and we increased our sales by about 20% over the last year using some new software tools we implemented."
              </p>
            </div>
            <div className="p-8 bg-white/[0.03]">
              <div className="text-[10px] font-mono text-accent uppercase tracking-widest mb-3 flex items-center gap-2">
                AI Optimized
                <span className="ml-auto text-emerald-400">98% ATS Match</span>
              </div>
              <p className="text-sm text-white leading-relaxed">
                "Spearheaded a cross-functional team of 5 to execute a digital transformation strategy, resulting in a <span className="text-accent font-semibold">20% YoY revenue increase</span> via Salesforce-driven pipeline optimization."
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Templates() {
  const tpls = [
    { img: templateExec, name: "Executive Minimal", tag: "Senior Leadership" },
    { img: templateModern, name: "Modern Tech", tag: "Engineering & Product" },
    { img: templateClassic, name: "Classic Ledger", tag: "Law & Finance" },
  ];
  return (
    <section id="templates" className="py-24 bg-slate-950 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div {...fadeUp} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
          <div>
            <div className="font-mono text-sm text-accent mb-4">[03] TEMPLATES</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Precision templates.</h2>
            <p className="text-slate-400 text-lg max-w-lg">Battle-tested layouts that parse perfectly through every major ATS.</p>
          </div>
          <Button asChild variant="outline" className="rounded-lg border-white/10 bg-white/5 hover:bg-white/10 text-white">
            <Link to="/auth">Browse all templates <ArrowRight className="size-4" /></Link>
          </Button>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {tpls.map((t, i) => (
            <motion.div
              key={t.name}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="aspect-[3/4] rounded-xl overflow-hidden border border-white/10 bg-white shadow-2xl group-hover:scale-[1.02] transition-transform">
                <img src={t.img} alt={t.name} loading="lazy" width={512} height={704} className="w-full h-full object-cover" />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="font-bold">{t.name}</p>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">{t.tag}</p>
                </div>
                <ArrowRight className="size-4 text-slate-500 group-hover:text-accent group-hover:translate-x-1 transition-all" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AtsSection() {
  const stats = [
    { v: "98%", l: "Average ATS pass rate" },
    { v: "3.2x", l: "More interview callbacks" },
    { v: "50K+", l: "Resumes generated" },
    { v: "<2min", l: "From signup to PDF" },
  ];
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <motion.div {...fadeUp}>
          <div className="font-mono text-sm text-primary mb-4">[04] ATS OPTIMIZATION</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Pass every automated screen.</h2>
          <p className="text-muted-foreground text-lg mb-8">75% of resumes are rejected by ATS before a human ever sees them. We reverse-engineer Workday, Greenhouse, Lever, and Taleo so yours isn't one of them.</p>
          <ul className="space-y-3">
            {[
              "Keyword frequency balancing for NLP parsers",
              "Semantic structure validation across major ATS platforms",
              "Live compatibility scoring against any job description",
              "Format checks for fonts, columns, and parseable section names",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3">
                <Check className="size-5 text-accent mt-0.5 shrink-0" />
                <span className="text-foreground/80">{t}</span>
              </li>
            ))}
          </ul>
        </motion.div>
        <motion.div {...fadeUp} className="grid grid-cols-2 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.l}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.08 }}
              className="p-6 rounded-2xl border bg-card shadow-sm"
            >
              <div className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary">{s.v}</div>
              <div className="text-xs text-muted-foreground mt-2 font-medium">{s.l}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Testimonials() {
  const t = [
    { q: "Went from 0 interviews to 4 callbacks in a single week. The AI found keywords I didn't even know were missing.", n: "Sarah Jenkins", r: "Senior PM @ Meta" },
    { q: "The transition from finance to tech seemed impossible until I used ResumeAI. Output is indistinguishable from a $500 writer.", n: "Marcus Zhao", r: "Software Engineer @ Stripe" },
    { q: "ResumeAI Pro is the only tool I recommend to coaching clients. The ATS scoring is brutally honest and that's exactly what people need.", n: "Elena Rodriguez", r: "Design Lead @ Vercel" },
  ];
  return (
    <section className="py-24 px-6 bg-secondary/40 border-y">
      <div className="max-w-7xl mx-auto">
        <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto mb-16">
          <div className="font-mono text-sm text-primary mb-4">[05] LOVED BY OPERATORS</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Trusted by professionals at the world's best companies.</h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {t.map((it, i) => (
            <motion.div
              key={it.n}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.1 }}
              className="bg-card p-8 rounded-2xl border shadow-sm"
            >
              <p className="text-foreground/90 leading-relaxed mb-6">"{it.q}"</p>
              <div className="flex items-center gap-3 pt-4 border-t">
                <div className="size-10 rounded-full bg-gradient-to-br from-primary to-accent" />
                <div>
                  <p className="text-sm font-bold">{it.n}</p>
                  <p className="text-xs text-muted-foreground">{it.r}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const tiers = [
    { name: "Starter", price: "$0", desc: "Get started and see what's possible.", features: ["1 active resume", "Standard templates", "Basic ATS score", "PDF export"], cta: "Start for free", highlight: false },
    { name: "Professional", price: "$19", desc: "For active job seekers at top companies.", features: ["Unlimited resumes", "Premium templates", "Full ATS analysis", "AI rewriting", "Cover letter generator", "Keyword optimization"], cta: "Get started", highlight: true },
    { name: "Executive", price: "$49", desc: "For senior leaders & career switchers.", features: ["Everything in Professional", "Dedicated career coach AI", "Priority generations", "1-on-1 review credits", "Export to Word & LinkedIn"], cta: "Contact sales", highlight: false },
  ];
  return (
    <section id="pricing" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto mb-16">
          <div className="font-mono text-sm text-primary mb-4">[06] PRICING</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Predictable career investment.</h2>
          <p className="text-muted-foreground text-lg">Choose the plan that matches your search velocity.</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {tiers.map((t, i) => (
            <motion.div
              key={t.name}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.1 }}
              className={`relative p-8 rounded-2xl border ${t.highlight ? "bg-card shadow-2xl border-primary/30 ring-1 ring-primary/20 scale-[1.02]" : "bg-card"}`}
            >
              {t.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary text-primary-foreground px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest">
                  Most Popular
                </div>
              )}
              <h3 className="font-bold text-lg">{t.name}</h3>
              <p className="text-xs text-muted-foreground mt-1 mb-6">{t.desc}</p>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-extrabold tracking-tight">{t.price}</span>
                <span className="text-sm text-muted-foreground">/mo</span>
              </div>
              <Button asChild className={`w-full rounded-xl font-semibold ${t.highlight ? "" : "bg-secondary text-foreground hover:bg-secondary/80"}`}>
                <Link to="/auth">{t.cta}</Link>
              </Button>
              <ul className="mt-8 space-y-3">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="size-4 text-accent mt-0.5 shrink-0" />
                    <span className="text-foreground/80">{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const items = [
    { q: "How does the ATS scoring actually work?", a: "We analyze your resume against the parsing logic of major ATS platforms (Workday, Greenhouse, Lever, Taleo). When you provide a job description, we compute keyword density, semantic alignment, action verb usage, and structural parseability — then give you a 0-100 score with concrete fixes." },
    { q: "Is my data private?", a: "Yes. Your resume content is stored encrypted, scoped to your account by row-level security. We never sell or share your data, and you can delete it anytime." },
    { q: "Can I edit AI-generated content?", a: "Absolutely. Every section of every resume is fully editable. The AI gives you a strong first draft; you stay in control of the final words." },
    { q: "What formats can I export?", a: "PDF (perfectly ATS-parseable) on every plan. Word and LinkedIn JSON exports on Executive." },
    { q: "Do you support all industries?", a: "Yes — from software engineering to law, finance, healthcare, education, and creative roles. The AI adapts tone and structure to the target role." },
  ];
  return (
    <section id="faq" className="py-24 px-6 bg-secondary/40 border-y">
      <div className="max-w-3xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-12">
          <div className="font-mono text-sm text-primary mb-4">[07] FAQ</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Questions, answered.</h2>
        </motion.div>
        <Accordion type="single" collapsible className="space-y-3">
          {items.map((it, i) => (
            <AccordionItem key={i} value={`q-${i}`} className="bg-card border rounded-xl px-5">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">{it.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">{it.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)] pointer-events-none" />
      <motion.div {...fadeUp} className="max-w-4xl mx-auto text-center relative">
        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-8 text-balance">Ready to land that dream offer?</h2>
        <p className="text-lg md:text-xl text-muted-foreground mb-10 text-pretty max-w-2xl mx-auto">Join 50,000+ professionals who upgraded their careers with AI-powered resume engineering.</p>
        <Button asChild size="lg" className="rounded-2xl font-bold text-lg h-14 px-10 shadow-2xl shadow-primary/25 hover:scale-[1.03] active:scale-[0.98] transition-transform">
          <Link to="/auth">Build My Free Resume <ArrowRight className="ml-1 size-5" /></Link>
        </Button>
        <p className="mt-6 text-xs font-mono text-muted-foreground uppercase tracking-widest">No credit card required • 100% privacy focused</p>
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-12 border-t">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <span className="font-bold tracking-tighter text-primary">ResumeAI <span className="text-accent">Pro</span></span>
        <div className="flex gap-8 text-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground">Privacy</a>
          <a href="#" className="hover:text-foreground">Terms</a>
          <a href="#" className="hover:text-foreground">Security</a>
          <a href="#" className="hover:text-foreground">Twitter</a>
        </div>
        <p className="text-xs text-muted-foreground font-mono">© 2026 RESUMEAI PRO</p>
      </div>
    </footer>
  );
}
