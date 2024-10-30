<script lang="ts">
  import type { PageData } from './$types';
  import PostList from '$lib/component/PostList.svelte';
  import Meta from '$lib/component/Meta.svelte';

  export let data: PageData;
</script>

<Meta title={`ページ${data.currentPageNumber}`} canonical={`/page/${data.currentPageNumber}`} />

<PostList
  posts={data.posts}
  baseUrl="/"
  currentPageNumber={data.currentPageNumber}
  totalNumberOfPages={data.totalNumberOfPages}
/>
