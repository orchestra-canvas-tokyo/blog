import { error, redirect } from '@sveltejs/kit';

import { getPosts } from '$lib/posts';
import { PostCountInOnePage } from '$lib/util';

import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
  // params.pageNumberが自然数であることはparam matcherで確認済み
  const pageNumber = parseInt(params.pageNumber);
  if (pageNumber === 1) redirect(301, '/'); // /page/0は許さない

  // インデックス範囲外には404を
  const posts = getPosts();
  const totalNumberOfPages = Math.ceil(posts.length / PostCountInOnePage);
  if (totalNumberOfPages < pageNumber) error(404);

  return {
    posts: posts.slice(
      PostCountInOnePage * (pageNumber - 1),
      PostCountInOnePage * (pageNumber + 1)
    ),
    currentPageNumber: pageNumber,
    totalNumberOfPages: totalNumberOfPages
  };
};
