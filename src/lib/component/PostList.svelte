<script lang="ts">
  import { getFullTitle, getUrl, type Post } from '$lib/posts';
  import { formatDate2JpStyle } from '$lib/util';
  import TagList from './TagList.svelte';

  /** 表示するポストの配列 */
  export let posts: Post[];
  /**
   * ページネーションの起点となる、このコンポーネントが配置されるURL
   * スラッシュ始まり、スラッシュ終わりを想定。
   * e.g. '/', '/tag/hoge/'
   * */
  export let baseUrl: string;
  /** 現在のページ数（1始まり） */
  export let currentPageNumber: number;
  /** 総ページ数 */
  export let totalNumberOfPages: number;
</script>

<!--
@component
ポスト一覧を描画するコンポーネント
- ページネーション機能をもつ

ページネーションのURLは以下の仕様
- 1ページ目：{baseUrl}
- nページ目(n>1)：{baseUrl}/page/{n}

総ページ数の取得、範囲外URL指定時の挙動はこのコンポーネントの責務外とする

@example
```svelte
<PostList {posts} baseUrl="/tag/hoge/" {currentPageNumber} {totalNumberOfPages}>
```
-->

<main class="article-list">
  {#each posts as post}
    <div class="article">
      <div class="meta-container">
        <TagList tags={post.metadata.tags} />
        <div class="date for-large-screen">
          {formatDate2JpStyle(post.metadata.publicatedAt)}
        </div>
      </div>

      <a href={getUrl(post.slug)} class="article-link">
        <h2 class="title">{getFullTitle(post)}</h2>

        <p class="description">
          {post.description}……
        </p>
      </a>

      <div class="meta-container bottom-meta-container for-small-screen">
        <div class="date">{formatDate2JpStyle(post.metadata.publicatedAt)}</div>
      </div>
    </div>
  {/each}

  <div class="page-control">
    <div class="page-button">
      {#if currentPageNumber === 2}
        <a href={baseUrl} class="pointer"> &lt; prev </a>
      {:else if currentPageNumber > 2}
        <a href="{baseUrl}?p={currentPageNumber - 1}" class="pointer"> &lt; prev </a>
      {/if}
    </div>
    <div class="page-number">
      {currentPageNumber} / {totalNumberOfPages}
    </div>
    <div class="page-button right">
      {#if currentPageNumber < totalNumberOfPages}
        <a href="{baseUrl}?p={currentPageNumber + 1}" class="pointer"> next &gt; </a>
      {/if}
    </div>
  </div>
</main>

<style>
  @media (max-width: 576px) {
    .for-large-screen {
      display: none !important;
    }
  }
  @media (min-width: 577px) {
    .for-small-screen {
      height: 0;
      display: none !important;
    }
  }

  .article-list {
    margin: calc(var(--spacing-unit) * 10) 0;
  }

  .article {
    display: flex;
    flex-direction: column;
    margin: calc(var(--spacing-unit) * 6) 0;
  }
  .article:not(.article:first-of-type)::before {
    display: block;
    box-sizing: content-box;
    width: 80%;
    height: calc(
      var(--spacing-unit) * 6 + 1em
    ); /* .article:bottom-margin + p:margin-block-end - .article:gap */
    content: '';
    margin: 0 auto;
    border-top: solid 1px var(--color-text-primary);
  }

  .article-link {
    display: block;
    font-family: var(--serif);
    transition: background-color 0.3s;
  }
  .article-link:hover {
    background-color: var(--color-background-secondary);
    text-decoration: none;
  }
  .article-link h2 {
    margin: calc(var(--spacing-unit) * 2) calc(var(--spacing-unit) * 4);
  }
  .description {
    margin: calc(var(--spacing-unit) * 4);
    margin-top: 0;
    -webkit-box-orient: vertical;

    font-size: 0.95em;
    text-align: justify;
    line-height: 1.75;
    letter-spacing: 0.04em;

    line-clamp: 3;
    -webkit-line-clamp: 3;
    display: -webkit-box;
    overflow: hidden;
  }

  @media (max-width: 576px) {
    h2 {
      font-size: 1.5rem;
    }
  }

  .meta-container {
    display: flex;
    justify-content: space-between;
    padding: 0 calc(var(--spacing-unit) * 4);
    font-size: 0.85em;
    color: var(--color-text-secondary);
  }
  .bottom-meta-container {
    flex-direction: row-reverse;
  }

  @media (max-width: 576px) {
    .meta-container {
      padding: 0;
    }
    .article-link h2 {
      margin: calc(var(--spacing-unit) * 2) 0;
    }
    .description {
      margin-left: 0;
      line-clamp: 5;
      -webkit-line-clamp: 5;
    }
  }

  .page-control {
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
    margin: 0 auto;
    margin-top: calc(var(--spacing-unit) * 4);
  }
  .page-number {
    margin: 0 calc(var(--spacing-unit) * 4);
    font-size: 110%;
  }
  @media (max-width: 576px) {
    .page-control {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      width: 100%;
      margin: 0 auto;
    }
    .page-number {
      margin: 0;
    }
  }
  .page-button {
    flex-basis: 4rem;
    font-size: 110%;
    color: var(--color-text-primary);
  }
  .right {
    text-align: right;
  }
  .pointer {
    cursor: pointer;
  }
  .pointer:hover {
    text-decoration: underline;
  }
</style>
