import { skill } from '$lib/server/discovery';
import { markdownResponse } from '$lib/server/markdown';
export const GET = () => markdownResponse(skill, { 'Access-Control-Allow-Origin': '*' });
