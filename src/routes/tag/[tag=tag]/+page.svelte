<script lang="ts">
  import type { PageData } from './$types';
  import PostList from '$lib/component/PostList.svelte';
  import Meta from '$lib/component/Meta.svelte';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
</script>

<Meta title={`#${data.tag}の記事一覧`} canonical={`/tag/${data.tag}`} />

<p>#&thinsp;{data.tag}の記事：{data.totalNumberOfPosts}件</p>

<PostList
  posts={data.posts}
  baseUrl="/tag/{data.tag}/"
  currentPageNumber={data.currentPageNumber}
  totalNumberOfPages={data.totalNumberOfPages}
/>

<style>
  p {
    text-indent: 0;
    margin-left: calc(var(--spacing-unit) * 4);
  }
  @media (max-width: 576px) {
    p {
      margin-left: 0;
    }
  }
</style>
