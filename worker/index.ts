// The site's Worker. Static assets are served by Cloudflare directly; this script
// only runs for /cv (no asset matches it) and for / (run_worker_first in wrangler.jsonc),
// where command-line clients get the plain-text CV instead of HTML.
import { cvText } from '../src/data/outputs';

interface Env {
  ASSETS: Fetcher;
  /** KV namespace: the public CV PDF under `cv.pdf`, and daily download counts. */
  CV: KVNamespace;
}

const CV_KEY = 'cv.pdf';
const CV_FILENAME = 'Fouad Farah - Senior Software Engineer - CV.pdf';

/** curl, wget and HTTPie get text; everything else gets the page. */
const CLI = /^(curl|wget|httpie|xh)\//i;

/** Link-preview fetchers and other bots: served, never counted. */
const BOT =
  /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|discord|slack|linkedin|skype|embedly|quora|pinterest|vkshare|w3c_validator|headless|lighthouse|python|go-http|java\/|okhttp|axios|node-fetch|undici|curl|wget|httpie/i;

function contentDisposition(name: string): string {
  const ascii = name.replace(/[^\x20-\x7e]/g, '_').replace(/["\\]/g, '_');
  return `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(name)}`;
}

/** Counts a download for today: total plus the referring site's host. Never throws. */
async function countDownload(request: Request, env: Env): Promise<void> {
  try {
    const day = new Date().toISOString().slice(0, 10);
    const key = `downloads:${day}`;
    let referrer = 'direct';
    const ref = request.headers.get('Referer');
    if (ref) {
      try {
        referrer = new URL(ref).hostname.replace(/^www\./, '') || 'direct';
      } catch {
        referrer = 'unknown';
      }
    }
    const current = (await env.CV.get<{ total: number; referrers: Record<string, number> }>(key, 'json')) ?? {
      total: 0,
      referrers: {},
    };
    current.total += 1;
    current.referrers[referrer] = (current.referrers[referrer] ?? 0) + 1;
    await env.CV.put(key, JSON.stringify(current));
  } catch {
    // Counting is best-effort (KV's free write limit, a transient error): the download already went out.
  }
}

async function serveCv(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
  }
  const pdf = await env.CV.get(CV_KEY, 'arrayBuffer');
  if (!pdf) {
    // No CV uploaded yet: show the site's 404 page.
    const notFound = await env.ASSETS.fetch(new Request(new URL('/404.html', request.url)));
    return new Response(notFound.body, { status: 404, headers: notFound.headers });
  }

  const ua = request.headers.get('User-Agent') ?? '';
  const prefetch = /prefetch|prerender/i.test(request.headers.get('Sec-Purpose') ?? request.headers.get('Purpose') ?? '');
  if (request.method === 'GET' && ua && !BOT.test(ua) && !prefetch) {
    ctx.waitUntil(countDownload(request, env));
  }

  return new Response(request.method === 'HEAD' ? null : pdf, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Length': String(pdf.byteLength),
      'Content-Disposition': contentDisposition(CV_FILENAME),
      'Cache-Control': 'public, max-age=300',
      'X-Robots-Tag': 'noindex',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      // Worker responses don't get _headers, so the HSTS from there is repeated here.
      'Strict-Transport-Security': 'max-age=31536000',
    },
  });
}

async function serveHome(request: Request, env: Env): Promise<Response> {
  const ua = request.headers.get('User-Agent') ?? '';
  if (CLI.test(ua) && (request.method === 'GET' || request.method === 'HEAD')) {
    return new Response(request.method === 'HEAD' ? null : cvText(), {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=0, must-revalidate',
        Vary: 'User-Agent',
        'X-Content-Type-Options': 'nosniff',
        'Strict-Transport-Security': 'max-age=31536000',
      },
    });
  }
  // Browsers get the normal page; Vary keeps caches from mixing the two versions.
  const page = await env.ASSETS.fetch(request);
  const response = new Response(page.body, page);
  response.headers.append('Vary', 'User-Agent');
  return response;
}

export default {
  async fetch(request, env, ctx): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname === '/cv' || pathname === '/cv/') return serveCv(request, env, ctx);
    if (pathname === '/') return serveHome(request, env);
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
