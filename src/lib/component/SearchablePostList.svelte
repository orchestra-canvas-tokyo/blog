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
  <p class="section-label">PROGRAM NOTES</p>
  <div class="heading-group">
    <h1>{heading}</h1>
    {#if summary}
      <p class="summary">{summary}</p>
    {/if}
  </div>
</section>

<PostList {posts} {tag} {currentPageNumber} {totalNumberOfPages} />

<style>
  .post-list-header {
    padding: clamp(36px, 7vw, 88px) 0 clamp(32px, 6vw, 72px);
  }

  .heading-group {
    min-width: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: calc(var(--spacing-unit) * 3) calc(var(--spacing-unit) * 8);
    align-items: baseline;
  }

  .section-label {
    margin: 0 0 calc(var(--spacing-unit) * 5);
    color: var(--color-text-secondary);
    font-family: var(--display-font);
    font-size: 0.72rem;
  }

  h1 {
    margin: 0;
    font-family: var(--serif);
    font-size: 2.4rem;
    font-weight: 500;
    line-height: 1.35;
  }

  .summary {
    margin: 0;
    color: var(--color-text-secondary);
  }

  @media (max-width: 600px) {
    h1 {
      font-size: 1.8rem;
    }
  }
</style>
