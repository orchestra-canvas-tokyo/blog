import { error, redirect } from '@sveltejs/kit';

import { getPosts } from '$lib/posts';
import { PostCountInOnePage } from '$lib/util';

import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
  const pageNumber = parseInt(params.pageNumber);
  if (pageNumber === 1) redirect(301, `/tag/${encodeURI(params.tag)}`);

  const posts = getPosts(params.tag);
  if (posts.length === 0) error(404);

  const totalNumberOfPages = Math.ceil(posts.length / PostCountInOnePage);

  if (totalNumberOfPages < pageNumber) error(404);
  return {
    tag: params.tag,
    totalNumberOfPosts: posts.length,
    posts: posts.slice(PostCountInOnePage * pageNumber, PostCountInOnePage * (pageNumber + 1)),
    currentPageNumber: pageNumber,
    totalNumberOfPages: totalNumberOfPages
  };
};
