import { site } from '../data/site';

// Content Signals (contentsignals.org): a stated preference, not enforced.
const text = `# Content Signals: search engines and AI answers may use this site's content; please don't use it to train AI models.
User-agent: *
Content-Signal: search=yes, ai-input=yes, ai-train=no
Allow: /

Sitemap: ${new URL('/sitemap.xml', site.url).href}
`;

export const GET = () => new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
