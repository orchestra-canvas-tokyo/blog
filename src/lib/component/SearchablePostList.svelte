<script lang="ts">
  import type { PostListItem } from '$lib/posts';
  import type { Tag } from '$lib/posts/tags';
  import { resolve } from '$app/paths';
  import ArchiveBrowse from './ArchiveBrowse.svelte';
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

{#if tag}<a class="archive-back" href={resolve('/')}>← すべての記事</a>{/if}
<section class="post-list-header">
  <div class="heading-group">
    <p class="eyebrow">PROGRAM NOTES</p>
    <h1>{heading}</h1>
    {#if summary}
      <p class="summary">{summary}</p>
    {/if}
  </div>
</section>

<ArchiveBrowse />

<PostList {posts} {tag} {currentPageNumber} {totalNumberOfPages} />

<style>
  .archive-back {
    display: inline-block;
    margin-bottom: 24px;
    font-size: 14px;
  }
  .eyebrow {
    margin: 0 0 12px;
    font-size: 11px;
    letter-spacing: 0.18em;
  }
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

  h1 {
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

    h1 {
      font-size: 1.7rem;
    }
  }
</style>
