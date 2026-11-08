import { site } from '../data/site';

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${new URL('/', site.url).href}</loc></url>
</urlset>
`;

export const GET = () => new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
