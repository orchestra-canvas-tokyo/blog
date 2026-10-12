import { error, json } from '@sveltejs/kit';
import { getFullTitle, getUrl, type PostListItem } from '$lib/posts';
import { canonicalUrl } from '$lib/site';

export const publicJson = (data: unknown, contentType = 'application/json') =>
  json(data, {
    headers: {
      'Content-Type': `${contentType}; charset=utf-8`,
      'Access-Control-Allow-Origin': '*',
      'X-Content-Type-Options': 'nosniff'
    }
  });

export const integerParameter = (
  url: URL,
  name: string,
  fallback: number,
  min: number,
  max: number
) => {
  const raw = url.searchParams.get(name);
  if (raw === null) return fallback;
  if (!/^\d+$/.test(raw)) error(400, `Invalid ${name}`);
  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value < min || value > max) error(400, `Invalid ${name}`);
  return value;
};

export const postSummary = (post: PostListItem) => ({
  slug: post.slug,
  title: getFullTitle(post),
  description: post.description,
  publishedAt: post.metadata.publicatedAt,
  tags: post.metadata.tags,
  url: canonicalUrl(getUrl(post.slug)),
  markdownUrl: canonicalUrl(`${getUrl(post.slug)}.md`)
});
