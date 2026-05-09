<script lang="ts">
  import type { PostListItem } from '$lib/posts';
  import type { Tag } from '$lib/posts/tags';
  import PostList from './PostList.svelte';

  interface Props {
    heading: string;
    summary?: string;
    posts: PostListItem[];
    tag?: Tag;
    currentPageNumber: number;
    totalNumberOfPages: number;
  }

  let {
    heading,
    summary = undefined,
    posts,
    tag = undefined,
    currentPageNumber,
    totalNumberOfPages
  }: Props = $props();
</script>

<section class="post-list-header">
  <div class="heading-group">
    <h2>{heading}</h2>
    {#if summary}
      <p class="summary">{summary}</p>
    {/if}
  </div>
</section>

<PostList {posts} {tag} {currentPageNumber} {totalNumberOfPages} />

<style>
  .post-list-header {
    display: flex;
    justify-content: space-between;
    gap: calc(var(--spacing-unit) * 5);
    align-items: flex-start;
  }

  .heading-group {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: calc(var(--spacing-unit) * 1);
  }

  h2 {
    margin: 0;
    font-family: var(--serif);
    font-size: 2rem;
  }

  .summary {
    margin: 0;
    color: var(--color-text-secondary);
  }

  @media (max-width: 576px) {
    .post-list-header {
      gap: calc(var(--spacing-unit) * 3);
    }

    h2 {
      font-size: 1.7rem;
    }
  }
</style>
