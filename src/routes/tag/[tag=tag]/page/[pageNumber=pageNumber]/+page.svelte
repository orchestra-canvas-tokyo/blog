<script lang="ts">
  import type { PageData } from './$types';
  import PostList from '$lib/component/PostList.svelte';
  import Meta from '$lib/component/Meta.svelte';

  export let data: PageData;
</script>

<Meta
  title={`ページ${data.currentPageNumber} - #${data.tag}の記事一覧`}
  canonical={`/tag/${data.tag}/page/${data.currentPageNumber}`}
/>

<p>#{data.tag}の記事：{data.totalNumberOfPosts}件</p>

<PostList
  posts={data.posts}
  baseUrl="/tag/{data.tag}/"
  currentPageNumber={data.currentPageNumber}
  totalNumberOfPages={data.totalNumberOfPages}
/>
