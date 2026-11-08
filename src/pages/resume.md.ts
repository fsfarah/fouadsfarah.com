import { resumeMarkdown } from '../data/outputs';

export const GET = () => new Response(resumeMarkdown(), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
