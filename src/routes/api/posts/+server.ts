import { error } from '@sveltejs/kit';
import { getPostCount, getPostListItems, getPublishedPostMetadata } from '$lib/posts';
import { loadBlogSearchIndex, searchBlog } from '$lib/posts/search';
import { integerParameter, postSummary, publicJson } from '$lib/server/public-api';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
  const limit = integerParameter(url, 'limit', 10, 1, 50);
  const offset = integerParameter(url, 'offset', 0, 0, 10000);
  const query = (url.searchParams.get('q') ?? '').trim();
  if (query.length > 200) error(400, 'q must be at most 200 characters');
  if (query) {
    await loadBlogSearchIndex();
    // Search shares the same published-only index as the browser UI.
    const articles = searchBlog(query, 10000).articles;
    return publicJson({
      posts: articles.slice(offset, offset + limit).map((post) =>
        postSummary({
          slug: post.slug,
          description: post.description,
          metadata: getMetadata(post.slug)
        })
      ),
      total: articles.length,
      limit,
      offset
    });
  }
  return publicJson({
    posts: (await getPostListItems({ offset, limit })).map(postSummary),
    total: getPostCount(),
    limit,
    offset
  });
};

const getMetadata = (slug: string) =>
  getPublishedPostMetadata().find((post) => post.slug === slug)!.metadata;
