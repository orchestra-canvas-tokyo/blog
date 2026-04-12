<script lang="ts">
  import type { PageData } from './$types';
  import Meta from '$lib/component/Meta.svelte';
  import SearchablePostList from '$lib/component/SearchablePostList.svelte';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
</script>

<Meta title="" canonical="/" />

<SearchablePostList
  heading="記事一覧"
  posts={data.posts}
  currentPageNumber={data.currentPageNumber}
  totalNumberOfPages={data.totalNumberOfPages}
/>
