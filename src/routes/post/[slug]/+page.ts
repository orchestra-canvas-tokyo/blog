import { error } from '@sveltejs/kit';

import { getAdjacentPostListItemsBySlug, getPostBySlug } from '$lib/posts';

import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, parent }) => {
  // slugが一致する記事がない、未publishの場合は404
  const post = getPostBySlug(params.slug);
  if (post === null) error(404);
  if (!post.metadata.published) error(404);

  const adjacentPostListItems = getAdjacentPostListItemsBySlug(params.slug);

  const { useCloudflareImages } = await parent();

  return {
    post: post,
    slug: params.slug,
    adjacentPostListItems: adjacentPostListItems,
    useCloudflareImages
  };
};
