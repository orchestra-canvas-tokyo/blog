<script lang="ts">
  import { resolve } from '$app/paths';
  import { getFullTitle, type PostListItem } from '$lib/posts';
  import { concerts } from '$lib/posts/concerts';
  import type { Tag } from '$lib/posts/tags';
  import { formatDate2JpStyle } from '$lib/util';
  import TagList from './TagList.svelte';

  interface Props {
    /** 表示するポストの配列 */
    posts: PostListItem[];
    /** タグページの場合のタグ名 */
    tag?: Tag;
    /** 現在のページ数（1始まり） */
    currentPageNumber: number;
    /** 総ページ数 */
    totalNumberOfPages: number;
    /** 記事タイトルの見出しレベル */
    headingLevel?: 2 | 3;
  }

  let {
    posts,
    tag = undefined,
    currentPageNumber,
    totalNumberOfPages,
    headingLevel = 2
  }: Props = $props();
</script>

<!--
@component
ポスト一覧を描画するコンポーネント
- ページネーション機能をもつ

ページネーションのURLは以下の仕様
- 1ページ目：ベースURLそのまま
- nページ目(n>1)：ベースURLに `?p={n}` を付与

総ページ数の取得、範囲外URL指定時の挙動はこのコンポーネントの責務外とする

@example
```svelte
<PostList {posts} tag="hoge" {currentPageNumber} {totalNumberOfPages}>
```
-->

<div class="article-list">
  {#each posts as post (post.slug)}
    <article class="article">
      <header class="meta-container">
        <span>{concerts[post.metadata.concertSlug].title}</span>
        <time datetime={post.metadata.publicatedAt}>
          {formatDate2JpStyle(post.metadata.publicatedAt)}
        </time>
      </header>

      <a href={resolve('/post/[slug]', { slug: post.slug })} class="article-link">
        {#if headingLevel === 3}
          <h3 class="title">{getFullTitle(post)}</h3>
        {:else}
          <h2 class="title">{getFullTitle(post)}</h2>
        {/if}

        <p class="description">
          {post.description}&hellip;
        </p>
      </a>

      <footer><TagList tags={post.metadata.tags} /></footer>
    </article>
  {/each}

  {#if totalNumberOfPages > 1}
    <nav class="page-control" aria-label="記事一覧のページ">
      <div class="page-button">
        {#if currentPageNumber === 2}
          {#if tag}
            <a href={resolve('/tag/[tag=tag]', { tag })} rel="prev">&#8592; 前へ</a>
          {:else}
            <a href={resolve('/')} rel="prev">&#8592; 前へ</a>
          {/if}
        {:else if currentPageNumber > 2}
          {#if tag}
            <a
              href={resolve(`/tag/${tag}?p=${currentPageNumber - 1}` as `/tag/${string}?${string}`)}
              rel="prev"
            >
              &#8592; 前へ
            </a>
          {:else}
            <a href={resolve(`/?p=${currentPageNumber - 1}` as `/?${string}`)} rel="prev">
              &#8592; 前へ
            </a>
          {/if}
        {/if}
      </div>
      <p class="page-number" aria-current="page">
        <span class="sr-only">ページ</span>
        {currentPageNumber} / {totalNumberOfPages}
      </p>
      <div class="page-button right">
        {#if currentPageNumber < totalNumberOfPages}
          {#if tag}
            <a
              href={resolve(`/tag/${tag}?p=${currentPageNumber + 1}` as `/tag/${string}?${string}`)}
              rel="next"
            >
              次へ &#8594;
            </a>
          {:else}
            <a href={resolve(`/?p=${currentPageNumber + 1}` as `/?${string}`)} rel="next">
              次へ &#8594;
            </a>
          {/if}
        {/if}
      </div>
    </nav>
  {/if}
</div>

<style>
  .article-list {
    border-top: 1px solid var(--color-border);
  }

  .article {
    border-bottom: 1px solid var(--color-border);
    padding: calc(var(--spacing-unit) * 8) 0;
  }

  .article-link {
    display: block;
    font-family: var(--serif);
    padding: calc(var(--spacing-unit) * 5) 0;
  }

  .article-link:hover,
  .article-link:focus-visible {
    text-decoration: none;
  }

  .article-link:hover .title,
  .article-link:focus-visible .title {
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 0.18em;
  }

  .title {
    margin: 0;
    font-size: 1.65rem;
    font-weight: 500;
    line-height: 1.5;
  }

  .description {
    margin: calc(var(--spacing-unit) * 4) 0 0;
    -webkit-box-orient: vertical;
    color: var(--color-text-secondary);
    font-size: 0.95rem;
    text-align: left;
    line-height: 1.8;
    letter-spacing: 0;
    line-clamp: 3;
    -webkit-line-clamp: 3;
    display: -webkit-box;
    overflow: hidden;
  }

  .meta-container {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: calc(var(--spacing-unit) * 2) calc(var(--spacing-unit) * 5);
    font-family: var(--display-font);
    font-size: 0.72rem;
    color: var(--color-text-secondary);
  }

  footer {
    color: var(--color-text-secondary);
    font-size: 0.76rem;
  }

  .page-control {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    align-items: center;
    gap: calc(var(--spacing-unit) * 5);
    margin-top: calc(var(--spacing-unit) * 12);
    font-family: var(--display-font);
    font-size: 0.8rem;
  }

  .page-number {
    margin: 0;
    color: var(--color-text-secondary);
  }

  .page-button {
    min-width: 0;
  }

  .page-button a {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    border-bottom: 1px solid currentColor;
  }

  .right {
    text-align: right;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  @media (max-width: 576px) {
    .article {
      padding: calc(var(--spacing-unit) * 7) 0;
    }

    .title {
      font-size: 1.35rem;
    }

    .description {
      line-clamp: 4;
      -webkit-line-clamp: 4;
    }

    .page-control {
      gap: calc(var(--spacing-unit) * 2);
    }
  }
</style>
