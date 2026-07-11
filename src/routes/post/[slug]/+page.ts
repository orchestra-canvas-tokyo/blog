import { error } from '@sveltejs/kit';

import { getPostBySlug, getRelatedPostListItemsBySlug } from '$lib/posts';

import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
  // slugが一致する記事がない、未publishの場合は404
  const post = await getPostBySlug(params.slug);
  if (post === null) error(404);
  if (!post.metadata.published) error(404);

  const relatedPostListItems = await getRelatedPostListItemsBySlug(params.slug);

  return {
    post: post,
    slug: params.slug,
    relatedPostListItems
  };
};
