<script lang="ts">
  import { resolve } from '$app/paths';
  import { getFullTitle, type PostListItem } from '$lib/posts';
  import type { Tag } from '$lib/posts/tags';
  import { formatDate2JpStyle } from '$lib/util';
  import TagList from './TagList.svelte';
  interface Props {
    posts: PostListItem[];
    tag?: Tag;
    currentPageNumber: number;
    totalNumberOfPages: number;
  }
  let { posts, tag, currentPageNumber, totalNumberOfPages }: Props = $props();
  const pageHref = (number: number): '/' | `/?${string}` | `/tag/${string}` => {
    const base = tag ? (`/tag/${encodeURIComponent(tag)}` as const) : '/';
    return number === 1 ? base : `${base}?p=${number}`;
  };
</script>

<div class="article-list">
  {#each posts as post (post.slug)}
    <article>
      <div class="meta">
        <TagList tags={post.metadata.tags} />
        <time datetime={post.metadata.publicatedAt}
          >{formatDate2JpStyle(post.metadata.publicatedAt)}</time
        >
      </div>
      <a href={resolve('/post/[slug]', { slug: post.slug })} class="article-link">
        <h2>{getFullTitle(post)}</h2>
        <p class="description">{post.description}</p>
        <span class="read-more">続きを読む <span aria-hidden="true">↗</span></span>
      </a>
    </article>
  {/each}
</div>

{#if totalNumberOfPages > 1}
  <nav class="pagination" aria-label="記事一覧のページ切り替え">
    <div>
      {#if currentPageNumber > 1}<a href={resolve(pageHref(currentPageNumber - 1))} rel="prev"
          >← 前へ</a
        >{/if}
    </div>
    <div class="page-numbers">
      {#each Array.from({ length: totalNumberOfPages }, (_, i) => i + 1) as number (number)}
        <a
          href={resolve(pageHref(number))}
          aria-label={`${number}ページ`}
          aria-current={number === currentPageNumber ? 'page' : undefined}>{number}</a
        >
      {/each}
    </div>
    <div>
      {#if currentPageNumber < totalNumberOfPages}<a
          href={resolve(pageHref(currentPageNumber + 1))}
          rel="next">次へ →</a
        >{/if}
    </div>
  </nav>
{/if}

<style>
  .article-list {
    margin-top: 24px;
  }
  article {
    padding: 32px 0;
    border-bottom: 1px solid var(--color-border);
  }
  .meta {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 16px;
    color: var(--color-text-secondary);
    font-size: 12px;
  }
  time {
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }
  .article-link {
    display: block;
    padding-block: 8px;
  }
  .article-link:hover {
    text-decoration: none;
  }
  .article-link:hover h2 {
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 6px;
  }
  h2 {
    margin: 0 0 16px;
    font-family: var(--serif);
    font-size: clamp(21px, 2.4vw, 28px);
    line-height: 1.65;
  }
  .description {
    max-width: 850px;
    margin: 0;
    color: var(--color-text-secondary);
    font-family: var(--serif);
    line-height: 1.9;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    overflow: hidden;
  }
  .read-more {
    display: flex;
    align-items: center;
    gap: 24px;
    margin-top: 16px;
    font-size: 12px;
  }
  .pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-top: 32px;
    font-size: 14px;
  }
  .pagination a {
    min-width: 44px;
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .page-numbers {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 4px;
  }
  [aria-current] {
    background: var(--color-text-primary);
    color: white;
  }
  @media (max-width: 576px) {
    .meta {
      flex-direction: column;
      gap: 4px;
    }
    .pagination {
      flex-wrap: wrap;
    }
    .page-numbers {
      order: 3;
      width: 100%;
    }
  }
</style>
