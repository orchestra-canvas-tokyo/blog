import { getPosts } from '$lib/posts';
import { PostCountInOnePage } from '$lib/util';

import type { PageLoad } from './$types';

export const load: PageLoad = () => {
  const posts = getPosts();

  const totalNumberOfPages = Math.ceil(posts.length / PostCountInOnePage);

  return {
    posts: posts.slice(0, PostCountInOnePage),
    currentPageNumber: 1,
    totalNumberOfPages: totalNumberOfPages
  };
};
