import docs from '$lib/server/api-docs.md?raw';
import { markdownResponse } from '$lib/server/markdown';
export const GET = () => markdownResponse(docs, { 'Access-Control-Allow-Origin': '*' });
