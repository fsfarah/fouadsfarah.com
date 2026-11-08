/**
 * The single source of every fact and every line of copy on the site.
 * The page, the JSON-LD, /resume.md, /llms.txt and the curl text are all
 * generated from this file. Never hard-code a fact in a component.
 */

export interface Role {
  id: string;
  employer: string;
  title: string;
  /** e.g. "Remote, US" */
  location?: string;
  /** "YYYY-MM" */
  start: string;
  /** "YYYY-MM", or null for the current role */
  end: string | null;
  /** Full CV bullets (for /resume.md and the curl text, not the page). */
  bullets: string[];
  /** Full CV stack line. */
  stack: string[];
  /** Shorter stack line shown on the page; never adds a technology the CV lacks. */
  siteStack: string[];
}

export interface Card {
  employer: string;
  /** Display years, e.g. "2019–2023". */
  years: string;
  title: string;
  body: string;
  link?: { label: string; href: string };
}

export const site = {
  name: 'Fouad Farah',
  url: 'https://fouadsfarah.com',
  title: 'Fouad Farah · Senior Software Engineer',
  description:
    'Senior software engineer in Beirut, working remotely, across web, infrastructure and networking. Selected work, experience and CV.',
  headline: 'Senior Software Engineer · Full-Stack & Systems Engineering',
  /** Used on phones, where the middle dot is dropped and the line breaks in two. */
  headlineLines: ['Senior Software Engineer', 'Full-Stack & Systems Engineering'],
  focus: ['Web', 'Infrastructure', 'Networking'],
  location: 'Beirut, Lebanon · Remote',
  locationParts: { city: 'Beirut', country: 'Lebanon', countryCode: 'LB' },
  /** Month shown in the footer; set at launch. */
  updated: 'Nov 2026',
} as const;

/** Years of experience: the CV counts from May 2010. Change "over 15" here only. */
export const hero = {
  statement: {
    plain: 'I build and run production software, ',
    accent: 'from the browser down to the router.',
  },
  intro:
    "I've spent over 15 years building software, including a startup I co-founded and remote roles at US companies.",
  cv: { label: 'Download CV (PDF)', href: '/cv' },
} as const;

/**
 * The email address is stored in parts and assembled by script in the browser.
 * It never appears as one string and never as a mailto: link.
 */
export const email = {
  user: 'hello',
  domain: 'fouadsfarah',
  tld: 'com',
} as const;

/**
 * Cloudflare Web Analytics (cookieless). The token is public by design: it is sent
 * to every visitor in the page source. The CSP in integrations/security-headers.mjs
 * allows its script and reporting hosts.
 */
export const analytics = {
  script: 'https://static.cloudflareinsights.com/beacon.min.js',
  token: 'ea6fe3c603ba4621be8093945190fc82',
} as const;

export const links = {
  linkedin: { label: 'LinkedIn', href: 'https://www.linkedin.com/in/fouad-s-farah' },
  zima: { label: 'zima.cloud', href: 'https://zima.cloud' },
  // GitHub is deferred to launch (open decision).
} as const;

export const cards: Card[] = [
  {
    employer: 'ZIMA Cloud',
    years: '2019–2023',
    title: 'From zero to a product sold worldwide',
    body: 'We built ZIMA Cloud from scratch as a multi-tenant cloud service, and today internet service providers on every continent run their business on it daily, from their subscribers to their routers. I led all the engineering, hands-on, and ran it in production.',
    link: links.zima,
  },
  {
    employer: 'ZIMA Cloud',
    years: '2019–2023',
    title: 'Keeping hundreds of routers in sync',
    body: "Every router had to match what the platform said it should be. I built the router management around an authenticated connection to each router, changes pushed as asynchronous jobs, and a reconciliation loop that compared each router's live configuration with its desired state and corrected any drift.",
  },
  {
    employer: 'Firenode',
    years: '2012–2019',
    title: "Upgrading software on servers we didn't own",
    body: "Our software ran on customers' own servers, so every upgrade had to be safe to ship remotely. I built the system that made those upgrades routine, and turned a week of hands-on server setup into a 40-minute self-serve install that just worked.",
  },
  {
    employer: 'UN-ESCWA',
    years: '2023–2024',
    title: 'Mapping an undocumented platform, then moving it',
    body: 'A multi-service system had to move from on-premises servers to Azure, with no documentation to start from. With our team lead, I worked out how each service was set up, including its undocumented authentication, and got the whole system running on a local Kubernetes environment first. Then we moved it to Azure, coordinating with the infrastructure team.',
  },
];

export const contact = {
  lines: [
    'Happy to talk about interesting engineering work.',
    'I work from Beirut and overlap comfortably with European and US East Coast hours.',
  ],
} as const;

export const footer = {
  piano: "When I'm not at one keyboard, I'm usually at another: the piano.",
} as const;

/** /llms.txt (final copy). No email address, no employer named, no scale numbers. */
export const llms = {
  summary:
    'Senior Software Engineer (Full-Stack & Systems Engineering) based in Beirut, Lebanon, working remotely. Over 15 years building and running production software across web, infrastructure and networking.',
  body: 'He co-founded ZIMA Cloud (2019–2023) and led all of its engineering: a multi-tenant SaaS built from scratch and used by internet service providers on every continent. Before that, at Firenode (2012–2019), he extended an on-premises ISP management product and made its installs and upgrades routine. Everything here matches his CV; the Markdown CV below has the full detail.',
  cv: [
    { label: 'CV in Markdown', path: '/resume.md', note: 'roles, dates, technologies, skills, education and languages' },
    { label: 'CV as PDF', path: '/cv', note: 'the downloadable version' },
  ],
  contact: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/fouad-s-farah', note: 'the best way to get in touch' },
    { label: 'Website', href: 'https://fouadsfarah.com', note: 'the email address is on the page' },
  ],
  optional: [
    { label: 'Home page', href: 'https://fouadsfarah.com/', note: 'selected work, experience and contact' },
    { label: 'ZIMA Cloud', href: 'https://zima.cloud', note: 'the platform he co-founded, still in daily use' },
  ],
} as const;

/** Job title for structured data (the headline's first half). */
export const jobTitle = 'Senior Software Engineer';

export const notFound = {
  title: "This page doesn't exist.",
  body: 'The address may be mistyped, or the page may have moved. Everything on this site lives on a single page.',
  home: 'Back to the home page →',
} as const;

/** Reverse-chronological, as on the CV. */
export const roles: Role[] = [
  {
    id: 'liaison',
    employer: 'Liaison International',
    title: 'Senior Software Engineer',
    location: 'Remote, US',
    start: '2024-10',
    end: null,
    bullets: [
      'Single-handedly migrated the single sign-on (SSO) and multi-factor authentication (MFA) flows for Othot, a predictive analytics platform for universities; documented every use case for the team and released it with no login issues reported.',
      'Reviewed code and investigated QA issues, tracking down bugs that had slipped through; supported teammates with advice and interviewed senior engineering candidates.',
      'Worked on moving Othot from Angular to React (MUI) and its APIs to GraphQL, and built new frontend and backend features, cleaning up code and creating reusable components along the way.',
    ],
    stack: ['TypeScript', 'React', 'MUI', 'NestJS', 'GraphQL', 'Angular', 'GCP', 'Docker', 'PostgreSQL'],
    siteStack: ['TypeScript', 'React', 'MUI', 'NestJS', 'GraphQL', 'Angular', 'PostgreSQL', 'Docker', 'GCP'],
  },
  {
    id: 'un-escwa',
    employer: 'UN-ESCWA',
    title: 'Full-Stack Developer (Contract)',
    start: '2023-12',
    end: '2024-10',
    bullets: [
      'Helped move an undocumented system of C# services and supporting infrastructure (PostgreSQL, MinIO, Keycloak, ZooKeeper and more) from on-premises servers to Azure: figured out how each part was set up, ran it on local Kubernetes first, then migrated it with the infrastructure team.',
      'Built a platform for uploading and preparing datasets, requested by the statistics team, with two other developers under a tight two-month deadline; delivered on time and put into use. Led its architecture and UI design and chose the tech stack.',
    ],
    stack: ['Node.js', 'Express', '.NET', 'Python', 'Angular', 'Keycloak', 'PostgreSQL', 'SQL Server', 'Docker', 'Kubernetes', 'Azure'],
    siteStack: ['Node.js', '.NET', 'Python', 'Keycloak', 'SQL Server', 'Docker', 'Kubernetes', 'Azure'],
  },
  {
    id: 'zima',
    employer: 'ZIMA Cloud',
    title: 'CTO & Co-founder',
    start: '2019-08',
    end: '2023-12',
    bullets: [
      'Led all engineering and built the platform from scratch, used by more than 200 internet service providers on every continent and more than 30,000 subscribers by late 2023; seed-funded by Flat6Labs and still in daily use.',
      'Developed router management for 250+ MikroTik routers, with the platform as the client: authenticated connections over OpenVPN, a MikroTik API client built on Node.js streams, asynchronous jobs, and automated configuration reconciliation.',
      "Built a per-minute rules engine tracking every online subscriber's traffic (tens of millions of data points a day) for usage accounting, policy enforcement, and reporting, and replaced its job queue with a lighter Redis-based one that cut resource usage.",
      "Implemented usage-based subscription billing on Stripe: ISPs paid per active subscriber, at one of three regional price tiers matched to their country's purchasing power, with activation and expiry handled automatically.",
      'Created an internal operations console with dashboards on every ISP account and router, covering business data, subscription status, router health, and direct command access.',
      "Hired the company's first engineers: a senior software engineer and a network/support engineer.",
    ],
    stack: ['Node.js', 'Express', 'MongoDB', 'Redis', 'Nginx', 'OpenVPN', 'RouterOS', 'GCP', 'Bootstrap', 'jQuery'],
    siteStack: ['Node.js', 'Express', 'MongoDB', 'Redis', 'Nginx', 'OpenVPN', 'RouterOS', 'GCP'],
  },
  {
    id: 'theguarantors',
    employer: 'TheGuarantors',
    title: 'Senior Node.js Engineer (Contract)',
    location: 'Remote, US',
    start: '2018-11',
    end: '2019-02',
    bullets: ["Built and shipped backend features for a distributed Agile team, and reviewed teammates' code."],
    stack: ['Node.js', 'TypeScript', 'PostgreSQL'],
    siteStack: ['Node.js', 'TypeScript', 'PostgreSQL'],
  },
  {
    id: 'firenode',
    employer: 'Firenode',
    title: 'Founding Engineer',
    start: '2012-03',
    end: '2019-08',
    bullets: [
      'As one of two engineers, extended an on-premises ISP management platform (web app, backend, MikroTik automation), then started the cloud rewrite that became ZIMA Cloud.',
      'Cut setup from a week of hands-on work to a 40-minute self-serve install: one script and a wizard.',
      'Built automated upgrades and licensing with anti-piracy checks for customer-hosted installations.',
    ],
    stack: ['PHP', 'CodeIgniter', 'MySQL', 'Apache', 'FreeRADIUS', 'Linux', 'Bootstrap', 'jQuery', 'GCP'],
    siteStack: ['PHP', 'CodeIgniter', 'MySQL', 'Apache', 'FreeRADIUS', 'Linux', 'GCP'],
  },
  {
    id: 'bsynchro',
    employer: 'BSynchro',
    title: 'Software Developer',
    start: '2010-05',
    end: '2012-02',
    bullets: [
      'Built proof-of-concept applications and internal libraries.',
      'Built insurance-system reporting and features.',
    ],
    stack: ['.NET', 'ASP.NET', 'WPF', 'Silverlight', 'WCF', 'Crystal Reports'],
    siteStack: ['.NET (WPF, Silverlight, WCF)', 'ASP.NET', 'Crystal Reports'],
  },
];

export const education = [
  { degree: 'MSc', field: 'Computer Science', school: 'Coventry University', place: 'UK', years: '2008–2009' },
  { degree: 'BSc', field: 'Computer Science', school: 'Notre Dame University', place: 'Lebanon', years: '2003–2008' },
] as const;

export const languages = [
  { name: 'English', level: 'fluent' },
  { name: 'Arabic', level: 'native' },
] as const;

export const profile =
  'Senior software engineer with 15+ years building and running production software, from web applications and APIs down to the network devices they manage. Co-founded ZIMA Cloud and built its multi-tenant SaaS platform from scratch, now used by internet service providers on every continent. Currently working remotely with US teams.';

export const skills = {
  Languages: ['TypeScript', 'JavaScript', 'SQL', 'PHP', 'Python', 'C#'],
  Backend: ['Node.js', 'Express', 'REST APIs', 'asynchronous processing', 'message queues', 'NestJS', 'GraphQL'],
  Frontend: ['React', 'Angular', 'UI design and implementation', 'dashboards and data visualization'],
  Data: ['MySQL', 'MongoDB', 'Redis', 'PostgreSQL', 'SQL Server'],
  'Cloud & operations': ['Linux', 'GCP', 'Docker', 'Kubernetes', 'Azure', 'deployment automation', 'monitoring and alerting'],
  Networking: ['MikroTik RouterOS API', 'OpenVPN', 'FreeRADIUS'],
  'Engineering practice': [
    'system design',
    'code review',
    'automated testing',
    'production troubleshooting',
    'AI-assisted development (Claude Code, Copilot, Cursor)',
  ],
} as const satisfies Record<string, readonly string[]>;

// ---- Helpers ---------------------------------------------------------------

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function monthLabel(ym: string): string {
  const [y, m] = ym.split('-');
  return `${MONTHS[Number(m) - 1]} ${y}`;
}

/** "2024–now" for the page. */
export function yearsLabel(role: Role): string {
  const start = role.start.slice(0, 4);
  const end = role.end ? role.end.slice(0, 4) : 'now';
  return start === end ? start : `${start}–${end}`;
}

/** "Oct 2024 – Present" for /resume.md and the curl text. */
export function periodLabel(role: Role): string {
  return `${monthLabel(role.start)} – ${role.end ? monthLabel(role.end) : 'Present'}`;
}
