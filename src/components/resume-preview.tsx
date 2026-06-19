import type { ResumeContent } from "@/lib/resume-types";

export function ResumePreview({ content }: { content: ResumeContent }) {
  const p = content.personal ?? ({} as ResumeContent["personal"]);
  const contact = [p.email, p.phone, p.location, p.linkedin, p.website].filter(Boolean);

  return (
    <div className="bg-white text-slate-900 shadow-2xl rounded-md mx-auto max-w-[8.5in] p-12 font-serif text-[11px] leading-relaxed border print:shadow-none print:border-0">
      <header className="border-b-2 border-primary pb-4 mb-5">
        <h1 className="text-3xl font-extrabold tracking-tight font-sans">{p.fullName || "Your Name"}</h1>
        {p.headline && <p className="text-primary font-semibold mt-1 font-sans text-sm">{p.headline}</p>}
        {contact.length > 0 && (
          <p className="text-slate-500 mt-2 text-[10px] font-sans">{contact.join("  •  ")}</p>
        )}
      </header>

      {content.summary && (
        <Section title="Summary">
          <p className="text-slate-700">{content.summary}</p>
        </Section>
      )}

      {content.experience?.length > 0 && (
        <Section title="Experience">
          <div className="space-y-4">
            {content.experience.map((exp, i) => (
              <div key={i}>
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-bold text-[13px] font-sans">{exp.role}</h3>
                  <span className="text-[10px] text-slate-500 font-mono shrink-0">{exp.startDate}{exp.current ? " — Present" : exp.endDate ? ` — ${exp.endDate}` : ""}</span>
                </div>
                <p className="text-primary font-semibold text-[11px] font-sans">{exp.company}{exp.location ? ` · ${exp.location}` : ""}</p>
                <ul className="mt-1.5 space-y-1 list-disc list-outside ml-4 text-slate-700">
                  {exp.bullets.map((b, bi) => <li key={bi}>{b}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      )}

      {content.education?.length > 0 && (
        <Section title="Education">
          {content.education.map((ed, i) => (
            <div key={i} className="mb-2">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-bold font-sans">{ed.degree}{ed.field ? `, ${ed.field}` : ""}</h3>
                <span className="text-[10px] text-slate-500 font-mono shrink-0">{ed.endDate}</span>
              </div>
              <p className="text-primary font-sans">{ed.school}{ed.gpa ? ` · GPA ${ed.gpa}` : ""}</p>
            </div>
          ))}
        </Section>
      )}

      {content.skills?.length > 0 && (
        <Section title="Skills">
          <p className="text-slate-700">{content.skills.join("  •  ")}</p>
        </Section>
      )}

      {content.projects && content.projects.length > 0 && (
        <Section title="Projects">
          {content.projects.map((proj, i) => (
            <div key={i} className="mb-2">
              <h3 className="font-bold font-sans">{proj.name}</h3>
              <p className="text-slate-700">{proj.description}</p>
            </div>
          ))}
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-5">
      <h2 className="text-[10px] font-bold text-primary uppercase tracking-[0.15em] font-sans mb-2 pb-1 border-b border-slate-200">{title}</h2>
      {children}
    </section>
  );
}
