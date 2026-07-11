import { getPostCount, getPostListItems } from '$lib/posts';
import { concerts } from '$lib/posts/concerts';
import { getComposerDirectoryGroups, getConcertDirectoryGroups } from '$lib/posts/directory';
import { PostCountInOnePage } from '$lib/util';
import { error, redirect } from '@sveltejs/kit';

import type { PageLoad } from './$types';

const browseViews = ['latest', 'concerts', 'composers'] as const;
type BrowseView = (typeof browseViews)[number];

export const load: PageLoad = async ({ url }) => {
  const rawView = url.searchParams.get('view');
  const view: BrowseView = rawView === null ? 'latest' : (rawView as BrowseView);
  if (!browseViews.includes(view)) error(404);

  // URLからpageNumberを取得
  const rawPageNumber = url.searchParams.get('p');
  let pageNumber: number;

  if (view !== 'latest' && rawPageNumber !== null) {
    url.searchParams.delete('p');
    redirect(302, url.href);
  }

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

  const totalNumberOfPosts = getPostCount();
  const totalNumberOfPages = Math.ceil(totalNumberOfPosts / PostCountInOnePage);
  if (totalNumberOfPages < pageNumber) error(404);

  const paginatedPosts =
    view === 'latest'
      ? await getPostListItems({
          offset: PostCountInOnePage * (pageNumber - 1),
          limit: PostCountInOnePage
        })
      : [];

  const featuredConcertSlug =
    pageNumber === 1 ? paginatedPosts[0]?.metadata.concertSlug : undefined;
  const featuredPosts = featuredConcertSlug
    ? paginatedPosts
        .filter((post) => post.metadata.concertSlug === featuredConcertSlug)
        .sort((a, b) => a.metadata.publicatedAt.localeCompare(b.metadata.publicatedAt))
    : [];
  const posts = featuredConcertSlug
    ? paginatedPosts.filter((post) => post.metadata.concertSlug !== featuredConcertSlug)
    : paginatedPosts;
  const concertGroups = getConcertDirectoryGroups();
  const todayInJapan = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date());
  const upcomingConcert = [...Object.values(concerts)]
    .filter((concert) => concert.date >= todayInJapan)
    .sort((a, b) => a.date.localeCompare(b.date))[0];

  return {
    view,
    posts,
    featuredCollection:
      featuredConcertSlug === undefined
        ? null
        : {
            concert: concertGroups.find((concert) => concert.slug === featuredConcertSlug) ?? null,
            posts: featuredPosts
          },
    concertGroups,
    composerGroups: getComposerDirectoryGroups(),
    upcomingConcert: upcomingConcert ?? null,
    totalNumberOfPosts,
    currentPageNumber: pageNumber,
    totalNumberOfPages: totalNumberOfPages
  };
};
