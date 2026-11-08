// Text outputs generated from the data file: /resume.md, /llms.txt, JSON-LD.
import { site, profile, skills, roles, education, languages, links, llms, jobTitle, periodLabel, hero } from './site';

/** The CV in Markdown: full content, including the CV's numbers. No phone, no email. */
export function resumeMarkdown(): string {
  const out: string[] = [];
  out.push(`# ${site.name}`, '');
  out.push(`${site.headline}  `, `${site.location}`, '');
  out.push(`- Website: ${site.url}`, `- LinkedIn: ${links.linkedin.href}`, '');
  out.push('## Profile', '', profile, '');
  out.push('## Technical expertise', '');
  for (const [group, items] of Object.entries(skills)) out.push(`- **${group}:** ${items.join(', ')}`);
  out.push('', '## Experience', '');
  for (const r of roles) {
    out.push(`### ${r.employer} · ${r.title}${r.location ? ` · ${r.location}` : ''}`, '');
    out.push(`${periodLabel(r)}`, '');
    for (const b of r.bullets) out.push(`- ${b}`);
    out.push('', `Stack: ${r.stack.join(', ')}`, '');
  }
  out.push('## Education', '');
  for (const e of education) out.push(`- ${e.degree}, ${e.field} · ${e.school}, ${e.place} · ${e.years}`);
  out.push('', '## Languages', '', languages.map((l) => `${l.name} (${l.level})`).join(' · '), '');
  return out.join('\n');
}

/** /llms.txt, following the llmstxt.org convention. */
export function llmsText(): string {
  const list = (items: readonly { label: string; note: string; href?: string; path?: string }[]) =>
    items.map((i) => `- [${i.label}](${i.href ?? new URL(i.path!, site.url).href}): ${i.note}`).join('\n');
  return [
    `# ${site.name}`,
    '',
    `> ${llms.summary}`,
    '',
    llms.body,
    '',
    '## CV',
    '',
    list(llms.cv),
    '',
    '## Contact',
    '',
    list(llms.contact),
    '',
    '## Optional',
    '',
    list(llms.optional),
    '',
  ].join('\n');
}

/** Schema.org Person: CV-supported fields only, no worksFor. */
export function personJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    url: site.url,
    jobTitle,
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.locationParts.city,
      addressCountry: site.locationParts.countryCode,
    },
    alumniOf: education.map((e) => ({ '@type': 'CollegeOrUniversity', name: e.school })),
    knowsLanguage: languages.map((l) => l.name),
    knowsAbout: [...new Set(Object.values(skills).flat())],
    sameAs: [links.linkedin.href],
  };
}

/** Wraps text to `width` columns, indenting continuation lines by `indent`. */
function wrap(text: string, width: number, indent = ''): string {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    if (line && (line + ' ' + w).length > width) {
      lines.push(line);
      line = indent + w;
    } else {
      line = line ? `${line} ${w}` : w;
    }
  }
  if (line) lines.push(line);
  return lines.join('\n');
}

/** The plain-text CV served to curl, wget and HTTPie. No phone, no email. */
export function cvText(): string {
  const W = 78;
  const rule = (title: string) => `${title.toUpperCase()}\n${'-'.repeat(title.length)}`;
  const out: string[] = [];
  out.push(site.name.toUpperCase(), site.headline, site.location, '');
  out.push(`Web       ${site.url}`, `LinkedIn  ${links.linkedin.href}`, `CV (PDF)  ${new URL(hero.cv.href, site.url).href}`, '');
  out.push(rule('Profile'), wrap(profile, W), '');
  out.push(rule('Experience'));
  for (const r of roles) {
    out.push('', `${r.employer} · ${r.title}${r.location ? ` · ${r.location}` : ''}`, periodLabel(r));
    for (const b of r.bullets) out.push(wrap(`- ${b}`, W, '  '));
    out.push(wrap(`Stack: ${r.stack.join(', ')}`, W, '       '));
  }
  out.push('', rule('Technical expertise'));
  for (const [group, items] of Object.entries(skills)) out.push(wrap(`${group}: ${items.join(', ')}`, W, '  '));
  out.push('', rule('Education'));
  for (const e of education) out.push(`${e.degree}, ${e.field} · ${e.school}, ${e.place} · ${e.years}`);
  out.push('', rule('Languages'), languages.map((l) => `${l.name} (${l.level})`).join(' · '), '');
  return out.join('\n');
}
