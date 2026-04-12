<script lang="ts">
  import type { PageData } from './$types';
  import Meta from '$lib/component/Meta.svelte';
  import SearchablePostList from '$lib/component/SearchablePostList.svelte';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
</script>

<Meta title={`#${data.tag}の記事一覧`} canonical={`/tag/${data.tag}`} />

<SearchablePostList
  heading={`#${data.tag}の記事一覧`}
  summary={`${data.totalNumberOfPosts}件`}
  posts={data.posts}
  tag={data.tag}
  currentPageNumber={data.currentPageNumber}
  totalNumberOfPages={data.totalNumberOfPages}
/>
