import { error, redirect } from '@sveltejs/kit';

import { getPosts } from '$lib/posts';
import { PostCountInOnePage } from '$lib/util';

import type { PageLoad } from './$types';

export const load: PageLoad = ({ params, url }) => {
  // URLからpageNumberを取得
  console.log({ url });
  const rawPageNumber = url.searchParams.get('p');
  let pageNumber: number;
  if (rawPageNumber === null) {
    pageNumber = 1; // パラメータがない場合は1ページ目想定
  } else {
    pageNumber = parseInt(rawPageNumber);
    // 自然数のみに絞る
    if (isNaN(pageNumber) || pageNumber !== parseFloat(rawPageNumber) || pageNumber <= 0)
      error(404);
    if (pageNumber === 1) {
      url.searchParams.delete('p');
      console.log({ url });
      redirect(301, url.href);
    }
  }

  // ポストを取得する
  const posts = getPosts(params.tag);
  if (posts.length === 0) error(404); // 該当するタグの記事がなければ404

  // インデックス範囲外には404を
  const totalNumberOfPages = Math.ceil(posts.length / PostCountInOnePage);
  if (totalNumberOfPages < pageNumber) error(404);

  return {
    tag: params.tag,
    totalNumberOfPosts: posts.length,
    posts: posts.slice(
      PostCountInOnePage * (pageNumber - 1),
      PostCountInOnePage * (pageNumber + 1)
    ),
    currentPageNumber: pageNumber,
    totalNumberOfPages: totalNumberOfPages
  };
};
