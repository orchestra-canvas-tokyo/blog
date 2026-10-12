import { error } from '@sveltejs/kit';
import { getPostBySlug } from '$lib/posts';
import { getPostMarkdown } from '$lib/server/markdown';
import { postSummary, publicJson } from '$lib/server/public-api';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
  const post = await getPostBySlug(params.slug);
  if (!post?.metadata.published) error(404, 'Article not found');
  return publicJson({ ...postSummary(post), markdown: await getPostMarkdown(post.slug) });
};
