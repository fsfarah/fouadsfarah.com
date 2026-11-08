# fouadsfarah.com

Fouad Farah's personal website: one static page (selected work, experience, contact) plus a 404 page, a CV download, and a few machine-readable extras. **This repository is public**, and so is this file.

## Source of truth

The design, copy and decisions live in private docs **outside this repository**, added to the session with `--add-dir`. Read that folder's `README.md` first, then the files it points to.

- Design and copy there are final. Match the HTML mockups in its `mockups/` folder; don't reword copy or add claims, numbers or technologies.
- If this file and the private docs disagree, the private docs win. If they leave something open, ask Fouad instead of deciding.
- Record build decisions in the private docs (they're the working copy), never in this repository.

## Never commit

Git history is permanent and this repository is public.

- Nothing from the private folder: no copies, excerpts or summaries of its docs, and none of its mockups.
- No PDFs. The CV is uploaded to Cloudflare separately and served by the `/cv` Worker.
- No phone number, no personal email address, no document IDs. The private docs list what to search for; run that check before committing content changes.
- No secrets or tokens. Deploys run through Cloudflare Workers Builds, so the repository needs none; anything else goes into encrypted secrets (`.dev.vars` locally, never committed).
- The site's email address is stored in parts and assembled by script: never as one string and never as a `mailto:` link.
- Commits use Fouad's GitHub noreply address (set `git config user.email` before the first commit).

`.gitignore` must cover at least: `*.pdf`, `.env*`, `.dev.vars`, `node_modules/`, `dist/`, `.astro/`, `.wrangler/`. Review `git diff --staged` before every commit.

## Stack

- **Astro** with static output, **TypeScript**, **vanilla CSS** with custom properties for the design tokens.
- **Hosting:** a Cloudflare Worker with static assets, deployed by Workers Builds on every push to `main`. The same Worker serves `/cv` (PDF download plus a privacy-friendly counter) and the plain-text CV for `curl`.
- **Analytics:** Cloudflare Web Analytics only (no cookies).
- No client framework, no UI component libraries, no CSS framework. JavaScript only for the theme switch, the command palette, copy-to-clipboard and the analytics script. Ask before adding any dependency.

## Commands

Fill these in as the project takes shape:

- `npm run dev` — local preview
- `npm run build` — static build into `dist/`
- `npx wrangler dev` — run the Worker locally (`/cv`, the curl text)

## How the code is organised

- **One typed data file** holds every fact from the CV (roles, dates, stacks, skills, education, languages, links). The page, the JSON-LD, `/resume.md`, `/llms.txt` and the curl text are all generated from it. Never hard-code a fact in a component.
- Components: Header, Hero, SelectedWork, Experience, Contact, Footer, CommandPalette.
- Design tokens as CSS custom properties for light and dark; sizes in `rem`.

## Quality bar

- Static-first and fast: plain HTML and CSS reach the browser.
- Works without JavaScript; the page is usable and every action has a visible link.
- Accessible: semantic HTML, visible focus, touch targets of at least 44px, the native `<dialog>` for the palette, no sideways scrolling at 320px wide or 400% zoom.
- Motion is CSS only, and everything is still under `prefers-reduced-motion: reduce`.
- Correct in both themes, on phones and desktops, and in print.

## Working style

- Small, focused commits with clear messages. Run the build before each commit.
- Don't change DNS, Email Routing or other Cloudflare dashboard settings; tell Fouad what to change instead.
- When a step needs Fouad (GitHub, Cloudflare, uploading the CV), say exactly what to click or type.
