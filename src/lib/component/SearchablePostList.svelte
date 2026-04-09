<script lang="ts">
  import { browser } from '$app/environment';
  import { resolve } from '$app/paths';
  import { onMount, tick } from 'svelte';
  import type { Post } from '$lib/posts';
  import { searchBlog } from '$lib/posts/search';
  import type { Tag } from '$lib/posts/tags';
  import { formatDate2JpStyle } from '$lib/util';
  import PostList from './PostList.svelte';

  interface Props {
    heading: string;
    summary?: string;
    posts: Post[];
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

  let isSearchOpen = $state(false);
  let searchQuery = $state('');
  let searchTrigger = $state<HTMLInputElement | null>(null);
  let searchInput = $state<HTMLInputElement | null>(null);
  let searchDialog = $state<HTMLDivElement | null>(null);
  let focusRestoreTarget: HTMLElement | null = null;

  const searchResults = $derived(searchBlog(searchQuery));
  const hasAnyResults = $derived(
    searchResults.articles.length > 0 ||
      searchResults.tags.length > 0 ||
      searchResults.composers.length > 0 ||
      searchResults.concerts.length > 0
  );

  const openSearch = async ({
    restoreFocusTarget = null,
    selectQuery = true
  }: {
    restoreFocusTarget?: HTMLElement | null;
    selectQuery?: boolean;
  } = {}) => {
    if (!isSearchOpen) {
      focusRestoreTarget = restoreFocusTarget;
      isSearchOpen = true;
    }

    await tick();
    searchInput?.focus();
    if (selectQuery) searchInput?.select();
  };

  const closeSearch = async ({ restoreFocus = false }: { restoreFocus?: boolean } = {}) => {
    isSearchOpen = false;
    await tick();

    if (
      restoreFocus &&
      focusRestoreTarget &&
      focusRestoreTarget !== searchTrigger &&
      focusRestoreTarget !== document.body
    ) {
      focusRestoreTarget.focus();
    }

    focusRestoreTarget = null;
  };

  const getFocusableElements = () => {
    if (searchDialog === null) return [];

    return [
      ...searchDialog.querySelectorAll<HTMLElement>('a[href], button, input, [tabindex]')
    ].filter((element) => {
      const tabindex = element.getAttribute('tabindex');
      return !element.hasAttribute('disabled') && tabindex !== '-1';
    });
  };

  onMount(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.isComposing) return;
      if (event.altKey || event.shiftKey) return;
      if (!event.ctrlKey && !event.metaKey) return;
      if (event.key.toLowerCase() !== 'k') return;

      event.preventDefault();
      const activeElement =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
      openSearch({
        restoreFocusTarget: activeElement
      });
    };

    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  });

  $effect(() => {
    if (!browser) return;

    document.body.style.overflow = isSearchOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  });
</script>

<section class="post-list-header">
  <div class="heading-group">
    <h2>{heading}</h2>
    {#if summary}
      <p class="summary">{summary}</p>
    {/if}
  </div>

  <div class="search-field">
    <label class="search-label" for="post-search-trigger">記事を検索</label>
    <div class="search-trigger-wrapper">
      <input
        bind:this={searchTrigger}
        id="post-search-trigger"
        class="search-trigger"
        type="text"
        value=""
        placeholder="タイトル・本文・タグから検索"
        readonly
        aria-haspopup="dialog"
        onfocus={() => openSearch()}
        onclick={() => openSearch()}
      />
      <span class="shortcut-hint" aria-hidden="true">
        <kbd>Ctrl</kbd>
        <span>+</span>
        <kbd>K</kbd>
        <span class="mac-shortcut">/ ⌘K</span>
      </span>
    </div>
    <p class="search-note">タイトル・本文・タグ・作曲家・演奏会から検索できます。</p>
  </div>
</section>

{#if isSearchOpen}
  <div class="search-layer" role="presentation">
    <button
      type="button"
      class="search-backdrop"
      tabindex="-1"
      aria-label="検索を閉じる"
      onclick={() => closeSearch({ restoreFocus: true })}
    ></button>
    <div
      bind:this={searchDialog}
      class="search-dialog"
      role="dialog"
      tabindex="-1"
      aria-modal="true"
      aria-labelledby="blog-search-heading"
      onkeydown={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          closeSearch({ restoreFocus: true });
        }
        if (event.key === 'Tab') {
          const focusableElements = getFocusableElements();
          if (focusableElements.length === 0) return;

          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          } else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }}
    >
      <div class="search-dialog-header">
        <div class="search-dialog-title-group">
          <p id="blog-search-heading" class="search-dialog-title">ブログを検索</p>
          <p class="search-dialog-note">
            {#if tag}
              現在は #&thinsp;{tag} の一覧を表示中です。検索対象は全記事です。
            {:else}
              検索対象は全記事です。
            {/if}
          </p>
        </div>

        <button
          type="button"
          class="close-button"
          onclick={() => closeSearch({ restoreFocus: true })}
        >
          閉じる
        </button>
      </div>

      <div class="search-input-wrapper">
        <label class="sr-only" for="blog-search-input">ブログを検索</label>
        <input
          bind:this={searchInput}
          id="blog-search-input"
          class="search-input"
          type="text"
          bind:value={searchQuery}
          placeholder="タイトル・本文・タグ・作曲家・演奏会から検索"
          autocomplete="off"
          autocapitalize="off"
          spellcheck="false"
        />
      </div>

      <div class="search-results">
        {#if searchQuery.trim().length === 0}
          <div class="search-empty-state">
            <p>タイトル・本文・タグ・作曲家・演奏会を横断検索できます。</p>
            <p class="keyboard-help">
              <kbd>Esc</kbd> で閉じます。<span class="divider">/</span><kbd>Ctrl</kbd>+<kbd>K</kbd>
              で再度開けます。
            </p>
          </div>
        {:else if hasAnyResults}
          <div class="search-sections">
            {#if searchResults.articles.length > 0}
              <section class="result-section">
                <h3>記事</h3>
                <ul class="result-list article-result-list">
                  {#each searchResults.articles as article (article.slug)}
                    <li>
                      <a
                        href={resolve('/post/[slug]', { slug: article.slug })}
                        class="article-result"
                        onclick={() => closeSearch()}
                      >
                        <div class="article-result-meta">
                          <span class="match-label">{article.matchedFieldLabel}</span>
                          <span class="published-at">
                            {formatDate2JpStyle(article.publishedAt)}
                          </span>
                        </div>
                        <strong>{article.title}</strong>
                        <p>{article.description}……</p>
                        <div class="article-result-tags">
                          {#each article.tags as articleTag (articleTag)}
                            <span class="article-result-tag">#&thinsp;{articleTag}</span>
                          {/each}
                        </div>
                      </a>
                    </li>
                  {/each}
                </ul>
              </section>
            {/if}

            {#if searchResults.composers.length > 0}
              <section class="result-section">
                <h3>作曲家</h3>
                <ul class="result-list compact-result-list">
                  {#each searchResults.composers as composer (composer.slug)}
                    <li>
                      <a
                        href={resolve('/tag/[tag=tag]', { tag: composer.tag })}
                        class="compact-result"
                        onclick={() => closeSearch()}
                      >
                        <strong>{composer.shortName}</strong>
                        <span>{composer.fullName}</span>
                      </a>
                    </li>
                  {/each}
                </ul>
              </section>
            {/if}

            {#if searchResults.concerts.length > 0}
              <section class="result-section">
                <h3>演奏会</h3>
                <ul class="result-list compact-result-list">
                  {#each searchResults.concerts as concert (concert.slug)}
                    <li>
                      <a
                        href={resolve('/tag/[tag=tag]', { tag: concert.tag })}
                        class="compact-result"
                        onclick={() => closeSearch()}
                      >
                        <strong>{concert.title}</strong>
                        <span>{formatDate2JpStyle(concert.date)}</span>
                      </a>
                    </li>
                  {/each}
                </ul>
              </section>
            {/if}

            {#if searchResults.tags.length > 0}
              <section class="result-section">
                <h3>タグ</h3>
                <ul class="result-list compact-result-list">
                  {#each searchResults.tags as entry (entry.tag)}
                    <li>
                      <a
                        href={resolve('/tag/[tag=tag]', { tag: entry.tag })}
                        class="compact-result"
                        onclick={() => closeSearch()}
                      >
                        <strong>#&thinsp;{entry.tag}</strong>
                        <span>タグページを開く</span>
                      </a>
                    </li>
                  {/each}
                </ul>
              </section>
            {/if}
          </div>
        {:else}
          <div class="search-empty-state">
            <p>「{searchQuery}」に一致する結果は見つかりませんでした。</p>
            <p>キーワードを短くするか、作曲家名・演奏会名でもお試しください。</p>
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<PostList {posts} {tag} {currentPageNumber} {totalNumberOfPages} />

<style>
  .post-list-header {
    display: flex;
    flex-direction: column;
    gap: calc(var(--spacing-unit) * 5);
  }

  .heading-group {
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

  .search-field {
    display: flex;
    flex-direction: column;
    gap: calc(var(--spacing-unit) * 2);
  }

  .search-label {
    font-size: 0.95em;
    color: var(--color-text-secondary);
  }

  .search-trigger-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .search-trigger,
  .search-input {
    box-sizing: border-box;
    width: 100%;
    border: 1px solid var(--color-text-primary);
    border-radius: calc(var(--spacing-unit) * 2);
    padding: calc(var(--spacing-unit) * 4) calc(var(--spacing-unit) * 5);
    font: inherit;
    background-color: rgba(255, 255, 255, 0.92);
    color: inherit;
  }

  .search-trigger {
    cursor: text;
    padding-right: calc(var(--spacing-unit) * 34);
  }

  .search-trigger::placeholder,
  .search-input::placeholder {
    color: var(--color-text-secondary);
    opacity: 1;
  }

  .search-note {
    margin: 0;
    font-size: 0.9em;
    color: var(--color-text-secondary);
  }

  .shortcut-hint {
    position: absolute;
    right: calc(var(--spacing-unit) * 4);
    display: inline-flex;
    align-items: center;
    gap: calc(var(--spacing-unit) * 1);
    font-size: 0.78em;
    color: var(--color-text-secondary);
    pointer-events: none;
  }

  .shortcut-hint kbd,
  .keyboard-help kbd {
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: calc(var(--spacing-unit) * 1.5);
    padding: 0 calc(var(--spacing-unit) * 1.5);
    font-family: inherit;
    font-size: 0.95em;
    background-color: rgba(255, 255, 255, 0.75);
  }

  .search-layer {
    position: fixed;
    inset: 0;
    z-index: 10;
    display: grid;
    place-items: start center;
    overflow-y: auto;
    padding: calc(var(--spacing-unit) * 8);
  }

  .search-backdrop {
    position: fixed;
    inset: 0;
    border: 0;
    padding: 0;
    background: rgba(238, 238, 238, 0.7);
    backdrop-filter: blur(6px);
  }

  .search-dialog {
    position: relative;
    z-index: 1;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: calc(var(--spacing-unit) * 4);
    width: min(100%, 760px);
    max-height: min(80vh, 760px);
    border: 1px solid var(--color-text-primary);
    border-radius: calc(var(--spacing-unit) * 3);
    padding: calc(var(--spacing-unit) * 6);
    background-color: rgba(255, 255, 255, 0.92);
    box-shadow: 0 0 24px rgba(0, 0, 0, 0.16);
  }

  .search-dialog-header {
    display: flex;
    justify-content: space-between;
    gap: calc(var(--spacing-unit) * 4);
    align-items: flex-start;
  }

  .search-dialog-title-group {
    display: flex;
    flex-direction: column;
    gap: calc(var(--spacing-unit) * 1);
  }

  .search-dialog-title,
  .search-dialog-note {
    margin: 0;
  }

  .search-dialog-title {
    font-family: var(--serif);
    font-size: 1.25rem;
  }

  .search-dialog-note {
    color: var(--color-text-secondary);
    font-size: 0.9em;
  }

  .close-button {
    border: 1px solid var(--color-text-primary);
    border-radius: calc(var(--spacing-unit) * 2);
    padding: calc(var(--spacing-unit) * 2) calc(var(--spacing-unit) * 4);
    font: inherit;
    background: transparent;
    cursor: pointer;
  }

  .search-input-wrapper {
    display: flex;
  }

  .search-input {
    font-size: 1.05rem;
  }

  .search-results {
    overflow-y: auto;
  }

  .search-sections {
    display: flex;
    flex-direction: column;
    gap: calc(var(--spacing-unit) * 6);
  }

  .result-section h3 {
    margin-top: 0;
    margin-bottom: calc(var(--spacing-unit) * 3);
    font-size: 1rem;
    color: var(--color-text-secondary);
  }

  .result-list {
    display: flex;
    flex-direction: column;
    gap: calc(var(--spacing-unit) * 3);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .article-result,
  .compact-result {
    display: flex;
    flex-direction: column;
    gap: calc(var(--spacing-unit) * 2);
    border: 1px solid rgba(0, 0, 0, 0.14);
    border-radius: calc(var(--spacing-unit) * 2);
    padding: calc(var(--spacing-unit) * 4);
    transition:
      background-color 0.2s ease,
      border-color 0.2s ease;
  }

  .article-result:hover,
  .compact-result:hover,
  .close-button:hover {
    border-color: var(--color-text-primary);
    background-color: rgba(238, 238, 238, 0.8);
    text-decoration: none;
  }

  .article-result strong,
  .compact-result strong {
    font-family: var(--serif);
  }

  .article-result p,
  .compact-result span,
  .published-at {
    margin: 0;
    color: var(--color-text-secondary);
  }

  .article-result-meta {
    display: flex;
    justify-content: space-between;
    gap: calc(var(--spacing-unit) * 4);
    align-items: center;
    font-size: 0.85em;
  }

  .match-label {
    display: inline-block;
    border: 1px solid rgba(0, 0, 0, 0.18);
    border-radius: 999px;
    padding: 0 calc(var(--spacing-unit) * 2);
    color: var(--color-text-secondary);
  }

  .article-result p {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
  }

  .article-result-tags {
    display: flex;
    flex-wrap: wrap;
    gap: calc(var(--spacing-unit) * 2) calc(var(--spacing-unit) * 3);
    font-size: 0.86em;
    color: var(--color-text-secondary);
  }

  .article-result-tag {
    white-space: nowrap;
  }

  .search-empty-state {
    display: flex;
    flex-direction: column;
    gap: calc(var(--spacing-unit) * 2);
    padding: calc(var(--spacing-unit) * 4) 0;
    color: var(--color-text-secondary);
  }

  .search-empty-state p {
    margin: 0;
  }

  .keyboard-help {
    display: flex;
    align-items: center;
    gap: calc(var(--spacing-unit) * 1.5);
    flex-wrap: wrap;
  }

  .divider {
    color: rgba(0, 0, 0, 0.3);
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
    h2 {
      font-size: 1.7rem;
    }

    .search-trigger {
      padding-right: calc(var(--spacing-unit) * 5);
    }

    .shortcut-hint {
      position: static;
      justify-content: flex-end;
      margin-top: calc(var(--spacing-unit) * 2);
    }

    .search-trigger-wrapper {
      flex-direction: column;
      align-items: stretch;
    }

    .search-layer {
      padding: calc(var(--spacing-unit) * 4);
    }

    .search-dialog {
      min-height: calc(100vh - var(--spacing-unit) * 8);
      max-height: calc(100vh - var(--spacing-unit) * 8);
      padding: calc(var(--spacing-unit) * 5);
    }

    .search-dialog-header {
      flex-direction: column;
    }

    .close-button {
      align-self: flex-end;
    }

    .article-result-meta {
      align-items: flex-start;
      flex-direction: column;
      gap: calc(var(--spacing-unit) * 1);
    }
  }
</style>
