import { llmsText } from '../data/outputs';

export const GET = () => new Response(llmsText(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
