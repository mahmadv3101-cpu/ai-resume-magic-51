import { jsPDF } from "jspdf";
import type { ResumeContent, TemplateId } from "./resume-types";

export function exportResumePdf(content: ResumeContent, template: TemplateId = "executive-minimal", filename = "resume.pdf") {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 48;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const isModern = template === "modern-tech";
  const accentColor: [number, number, number] = isModern ? [20, 184, 166] : [37, 99, 235];

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(15, 23, 42);
  doc.text(content.personal.fullName || "Your Name", margin, y);
  y += 8;

  if (content.personal.headline) {
    y += 14;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(...accentColor);
    doc.text(content.personal.headline, margin, y);
  }

  y += 16;
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  const contactParts = [
    content.personal.email,
    content.personal.phone,
    content.personal.location,
    content.personal.linkedin,
    content.personal.website,
  ].filter(Boolean);
  doc.text(contactParts.join("  •  "), margin, y);
  y += 16;

  // Divider
  doc.setDrawColor(...accentColor);
  doc.setLineWidth(1.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 18;

  const section = (title: string) => {
    if (y > 720) { doc.addPage(); y = margin; }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...accentColor);
    doc.text(title.toUpperCase(), margin, y);
    y += 4;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 14;
  };

  const writeWrapped = (text: string, opts: { size?: number; bold?: boolean; color?: [number, number, number]; indent?: number } = {}) => {
    doc.setFont("helvetica", opts.bold ? "bold" : "normal");
    doc.setFontSize(opts.size ?? 10);
    doc.setTextColor(...(opts.color ?? [30, 41, 59]));
    const lines = doc.splitTextToSize(text, contentWidth - (opts.indent ?? 0));
    lines.forEach((line: string) => {
      if (y > 740) { doc.addPage(); y = margin; }
      doc.text(line, margin + (opts.indent ?? 0), y);
      y += (opts.size ?? 10) * 1.3;
    });
  };

  if (content.summary) {
    section("Summary");
    writeWrapped(content.summary, { size: 10 });
    y += 8;
  }

  if (content.experience?.length) {
    section("Experience");
    content.experience.forEach((exp) => {
      if (y > 700) { doc.addPage(); y = margin; }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text(exp.role, margin, y);
      const dateStr = `${exp.startDate}${exp.current ? " — Present" : exp.endDate ? ` — ${exp.endDate}` : ""}`;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(dateStr, pageWidth - margin, y, { align: "right" });
      y += 13;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...accentColor);
      doc.text(`${exp.company}${exp.location ? ` · ${exp.location}` : ""}`, margin, y);
      y += 14;
      exp.bullets.forEach((b) => {
        if (y > 740) { doc.addPage(); y = margin; }
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(51, 65, 85);
        doc.text("•", margin, y);
        const lines = doc.splitTextToSize(b, contentWidth - 14);
        lines.forEach((line: string, i: number) => {
          if (y > 740) { doc.addPage(); y = margin; }
          doc.text(line, margin + 12, y);
          if (i < lines.length - 1) y += 12;
        });
        y += 13;
      });
      y += 8;
    });
  }

  if (content.education?.length) {
    section("Education");
    content.education.forEach((ed) => {
      if (y > 720) { doc.addPage(); y = margin; }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(15, 23, 42);
      doc.text(`${ed.degree}${ed.field ? `, ${ed.field}` : ""}`, margin, y);
      if (ed.endDate) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text(ed.endDate, pageWidth - margin, y, { align: "right" });
      }
      y += 13;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...accentColor);
      doc.text(ed.school, margin, y);
      y += 18;
    });
  }

  if (content.skills?.length) {
    section("Skills");
    writeWrapped(content.skills.join("  •  "), { size: 10 });
    y += 6;
  }

  if (content.projects?.length) {
    section("Projects");
    content.projects.forEach((p) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(15, 23, 42);
      doc.text(p.name, margin, y);
      y += 13;
      writeWrapped(p.description, { size: 9.5 });
      y += 6;
    });
  }

  doc.save(filename);
}
