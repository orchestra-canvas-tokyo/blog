<script lang="ts">
  import type { PageData } from './$types';
  import Meta from '$lib/component/Meta.svelte';
  import SearchablePostList from '$lib/component/SearchablePostList.svelte';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
</script>

<Meta
  title={data.currentPageNumber > 1 ? `記事一覧 · ${data.currentPageNumber}ページ` : ''}
  canonical={data.currentPageNumber > 1 ? `/?p=${data.currentPageNumber}` : '/'}
/>

<SearchablePostList
  heading="音楽を、もっと深く。"
  summary={`曲目解説・プログラムノート 全${data.totalNumberOfPosts}件`}
  posts={data.posts}
  currentPageNumber={data.currentPageNumber}
  totalNumberOfPages={data.totalNumberOfPages}
/>
