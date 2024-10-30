import { error } from '@sveltejs/kit';

import { getPosts } from '$lib/posts';
import { PostCountInOnePage } from '$lib/util';

import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
  // params.tagが正しいタグであることはparam matcherで確認済み
  // タグをもつ記事がない場合は404
  const posts = getPosts(params.tag);
  if (posts.length === 0) error(404);

  const totalNumberOfPages = Math.ceil(posts.length / PostCountInOnePage);

  return {
    tag: params.tag,
    totalNumberOfPosts: posts.length,
    posts: posts.slice(0, PostCountInOnePage),
    currentPageNumber: 1,
    totalNumberOfPages: totalNumberOfPages
  };
};
