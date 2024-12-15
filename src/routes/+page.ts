import { getPosts } from '$lib/posts';
import { PostCountInOnePage } from '$lib/util';
import { error, redirect } from '@sveltejs/kit';

import type { PageLoad } from './$types';

export const load: PageLoad = ({ url }) => {
  // URLからpageNumberを取得
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
      // ?p=1の場合、クエリパラメータがないURLへリダイレクト
      url.searchParams.delete('p');
      redirect(301, url.href);
    }
  }

  // ポストを取得する
  const posts = getPosts();
  const totalNumberOfPages = Math.ceil(posts.length / PostCountInOnePage);
  // インデックス範囲外には404を
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
