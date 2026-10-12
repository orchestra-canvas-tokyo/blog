import { getPostMarkdown, markdownResponse } from '$lib/server/markdown';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) =>
  markdownResponse(await getPostMarkdown(params.slug));
