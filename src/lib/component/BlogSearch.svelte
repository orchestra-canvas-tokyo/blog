<script lang="ts">
  import { browser } from '$app/environment';
  import { pushState, replaceState } from '$app/navigation';
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import { onMount, tick } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import type { Page } from '@sveltejs/kit';
  import type { BlogSearchResults } from '$lib/posts/search';
  import { formatDate2JpStyle } from '$lib/util';

  type SearchPageState = Page['state'] & {
    blogSearchOpen?: boolean;
  };

  let isSearchOpen = $state(false);
  let searchQuery = $state('');
  let searchTrigger = $state<HTMLButtonElement | null>(null);
  let searchInput = $state<HTMLInputElement | null>(null);
  let searchDialog = $state<HTMLDivElement | null>(null);
  let searchBlogFn = $state<typeof import('$lib/posts/search').searchBlog | null>(null);
  let isSearchLoading = $state(false);
  let searchLoadFailed = $state(false);
  let focusRestoreTarget: HTMLElement | null = null;
  let searchLoadPromise: Promise<void> | null = null;
  let hasSearchHistoryEntry = false;
  let isClosingSearchHistory = false;

  const emptySearchResults: BlogSearchResults = {
    articles: [],
    tags: [],
    composers: [],
    concerts: []
  };
  const trimmedSearchQuery = $derived(searchQuery.trim());
  const searchResults = $derived(searchBlogFn ? searchBlogFn(searchQuery) : emptySearchResults);
  const hasAnyResults = $derived(
    searchResults.articles.length > 0 ||
      searchResults.tags.length > 0 ||
      searchResults.composers.length > 0 ||
      searchResults.concerts.length > 0
  );
  const resultCount = $derived(
    searchResults.articles.length +
      searchResults.tags.length +
      searchResults.composers.length +
      searchResults.concerts.length
  );
  const resultStatusText = $derived(
    searchLoadFailed
      ? '検索を読み込めませんでした。ページを再読み込みしてください。'
      : isSearchLoading && searchBlogFn === null
        ? '検索を読み込んでいます。'
        : trimmedSearchQuery.length === 0
          ? ''
          : hasAnyResults
            ? `${resultCount}件の候補があります。`
            : `「${searchQuery}」に一致する結果は見つかりませんでした。`
  );

  const loadSearch = () => {
    if (searchBlogFn !== null) return Promise.resolve();
    if (searchLoadPromise !== null) return searchLoadPromise;

    isSearchLoading = true;
    searchLoadFailed = false;
    searchLoadPromise = import('$lib/posts/search')
      .then(async ({ loadBlogSearchIndex, searchBlog }) => {
        await loadBlogSearchIndex();
        searchBlogFn = searchBlog;
      })
      .catch(() => {
        searchLoadFailed = true;
      })
      .finally(() => {
        isSearchLoading = false;
        searchLoadPromise = null;
      });

    return searchLoadPromise;
  };

  const reloadSearch = () => {
    // A reload must not leave a stale open-dialog entry behind in history.
    replaceState('', { ...page.state, blogSearchOpen: false });
    window.location.reload();
  };

  const pushSearchHistoryEntry = () => {
    if (!browser || hasSearchHistoryEntry) return;

    pushState('', { ...(page.state as SearchPageState), blogSearchOpen: true });
    hasSearchHistoryEntry = true;
  };

  const isSearchPageState = () => (page.state as SearchPageState).blogSearchOpen === true;

  const openSearch = async ({
    restoreFocusTarget = null,
    selectQuery = true,
    pushHistory = true
  }: {
    restoreFocusTarget?: HTMLElement | null;
    selectQuery?: boolean;
    pushHistory?: boolean;
  } = {}) => {
    if (!isSearchOpen) {
      focusRestoreTarget = restoreFocusTarget;
      isSearchOpen = true;
      if (pushHistory) pushSearchHistoryEntry();
    }
    void loadSearch();

    await tick();
    searchInput?.focus();
    if (selectQuery) searchInput?.select();
  };

  const closeSearch = async ({
    restoreFocus = false,
    syncHistory = true
  }: {
    restoreFocus?: boolean;
    syncHistory?: boolean;
  } = {}) => {
    const shouldRestoreHistory = browser && syncHistory && hasSearchHistoryEntry;

    if (shouldRestoreHistory) {
      isClosingSearchHistory = true;
      hasSearchHistoryEntry = false;
      history.back();
    }

    isSearchOpen = false;
    await tick();

    if (restoreFocus && focusRestoreTarget && focusRestoreTarget !== document.body) {
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
    const handlePopstate = () => {
      if (isClosingSearchHistory) {
        isClosingSearchHistory = false;
        return;
      }

      window.setTimeout(() => {
        if (isSearchPageState()) {
          hasSearchHistoryEntry = true;
          openSearch({ restoreFocusTarget: searchTrigger, pushHistory: false });
          return;
        }

        if (isSearchOpen) {
          hasSearchHistoryEntry = false;
          closeSearch({ restoreFocus: true, syncHistory: false });
        }
      });
    };

    window.addEventListener('popstate', handlePopstate);
    if (isSearchPageState()) {
      hasSearchHistoryEntry = true;
      openSearch({ restoreFocusTarget: searchTrigger, pushHistory: false });
    }

    return () => {
      window.removeEventListener('keydown', handleKeydown);
      window.removeEventListener('popstate', handlePopstate);
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

<button
  bind:this={searchTrigger}
  type="button"
  class="search-trigger"
  aria-label="記事を検索"
  aria-haspopup="dialog"
  aria-expanded={isSearchOpen}
  aria-controls="blog-search-dialog"
  aria-keyshortcuts="Control+K Meta+K"
  onclick={(event) => openSearch({ restoreFocusTarget: event.currentTarget })}
>
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path
      d="M10.8 5.2a5.6 5.6 0 1 0 0 11.2 5.6 5.6 0 0 0 0-11.2Zm-7.2 5.6a7.2 7.2 0 1 1 12.7 4.6l4 4a.8.8 0 0 1-1.1 1.1l-4-4A7.2 7.2 0 0 1 3.6 10.8Z"
    />
  </svg>
  <span>記事を検索</span>
</button>

{#if isSearchOpen}
  <div class="search-layer" role="presentation">
    <button
      type="button"
      class="search-backdrop"
      tabindex="-1"
      aria-label="検索を閉じる"
      onclick={() => closeSearch({ restoreFocus: true })}
      transition:fade={{ duration: 140 }}
    ></button>
    <div
      bind:this={searchDialog}
      id="blog-search-dialog"
      class="search-dialog"
      role="dialog"
      tabindex="-1"
      aria-modal="true"
      aria-labelledby="blog-search-heading"
      transition:fly={{ y: -12, duration: 160 }}
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
        </div>

        <button
          type="button"
          class="close-button"
          aria-label="検索を閉じる"
          onclick={() => closeSearch({ restoreFocus: true })}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
              d="M6.2 5.1 12 10.9l5.8-5.8a.8.8 0 0 1 1.1 1.1L13.1 12l5.8 5.8a.8.8 0 0 1-1.1 1.1L12 13.1l-5.8 5.8a.8.8 0 1 1-1.1-1.1l5.8-5.8-5.8-5.8a.8.8 0 1 1 1.1-1.1Z"
            />
          </svg>
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
          aria-keyshortcuts="Control+K Meta+K"
        />
        <span class="input-shortcut-hint" aria-hidden="true">
          <kbd>Ctrl</kbd>
          <span>+</span>
          <kbd>K</kbd>
          <span class="mac-shortcut">/ ⌘K</span>
        </span>
      </div>
      <p class="sr-only" role="status" aria-live="polite">{resultStatusText}</p>

      {#if searchLoadFailed}
        <div class="search-empty-state">
          <p>検索を読み込めませんでした。接続を確認してページを再読み込みしてください。</p>
          <button type="button" onclick={reloadSearch}>ページを再読み込み</button>
        </div>
      {:else if trimmedSearchQuery.length === 0}
        <div class="search-empty-state">
          <p>気になる曲名や作曲家名を入力してください。</p>
          <p>例：ベートーヴェン、交響曲、第17回定期</p>
        </div>
      {:else if trimmedSearchQuery.length > 0}
        <div class="search-results">
          {#if isSearchLoading && searchBlogFn === null}
            <div class="search-empty-state">
              <p>検索を読み込んでいます。</p>
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
                          onclick={() => closeSearch({ syncHistory: false })}
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
                          onclick={() => closeSearch({ syncHistory: false })}
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
                          onclick={() => closeSearch({ syncHistory: false })}
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
                          onclick={() => closeSearch({ syncHistory: false })}
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
      {/if}
    </div>
  </div>
{/if}

<style>
  .search-trigger {
    flex: 0 0 auto;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    padding-inline: 12px;
    font-size: 13px;
    height: calc(var(--spacing-unit) * 11);
    border: 1px solid rgba(0, 0, 0, 0.16);
    border-radius: calc(var(--spacing-unit) * 2);
    background-color: transparent;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition:
      background-color 0.2s ease,
      border-color 0.2s ease,
      color 0.2s ease;
  }

  .search-trigger svg,
  .close-button svg {
    width: 1.25rem;
    height: 1.25rem;
    fill: currentColor;
  }

  .search-trigger:hover {
    background-color: rgba(0, 0, 0, 0.06);
    border-color: rgba(0, 0, 0, 0.28);
    color: var(--color-text-primary);
  }

  .search-trigger:focus-visible {
    outline: 2px solid var(--color-text-primary);
    outline-offset: 4px;
    background-color: rgba(0, 0, 0, 0.08);
    border-color: rgba(0, 0, 0, 0.32);
    color: var(--color-text-primary);
  }

  .close-button:hover {
    border-color: var(--color-text-primary);
    background-color: rgba(238, 238, 238, 0.8);
  }

  .close-button:focus-visible {
    outline: 2px solid var(--color-text-primary);
    outline-offset: 2px;
  }

  .search-input {
    box-sizing: border-box;
    width: 100%;
    border: 1px solid var(--color-text-primary);
    border-radius: calc(var(--spacing-unit) * 2);
    padding: calc(var(--spacing-unit) * 4) calc(var(--spacing-unit) * 34)
      calc(var(--spacing-unit) * 4) calc(var(--spacing-unit) * 5);
    font: inherit;
    font-size: 1.05rem;
    background-color: rgba(255, 255, 255, 0.92);
    color: inherit;
  }

  .search-input::placeholder {
    color: var(--color-text-secondary);
    opacity: 1;
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
    align-items: center;
  }

  .search-dialog-title-group {
    display: flex;
    flex-direction: column;
    gap: calc(var(--spacing-unit) * 1);
  }

  .search-dialog-title {
    font-family: var(--serif);
    font-size: 1.25rem;
    margin: 0;
  }

  .close-button {
    flex: 0 0 auto;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: calc(var(--spacing-unit) * 10);
    height: calc(var(--spacing-unit) * 10);
    border: 1px solid var(--color-text-primary);
    border-radius: calc(var(--spacing-unit) * 2);
    padding: 0;
    background: transparent;
    color: inherit;
    cursor: pointer;
    transition:
      background-color 0.2s ease,
      border-color 0.2s ease;
  }

  .search-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .input-shortcut-hint {
    position: absolute;
    right: calc(var(--spacing-unit) * 4);
    display: inline-flex;
    align-items: center;
    gap: calc(var(--spacing-unit) * 1);
    font-size: 0.78em;
    color: var(--color-text-secondary);
    pointer-events: none;
  }

  .input-shortcut-hint kbd {
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: calc(var(--spacing-unit) * 1.5);
    padding: 0 calc(var(--spacing-unit) * 1.5);
    font-family: inherit;
    font-size: 0.95em;
    background-color: rgba(255, 255, 255, 0.75);
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
  .compact-result:hover {
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
    .search-layer {
      padding: calc(var(--spacing-unit) * 4);
    }

    .search-dialog {
      min-height: calc(100dvh - var(--spacing-unit) * 8);
      max-height: calc(100dvh - var(--spacing-unit) * 8);
      padding: calc(var(--spacing-unit) * 5);
    }

    .search-dialog-header {
      gap: calc(var(--spacing-unit) * 3);
    }

    .close-button {
      align-self: flex-end;
    }

    .search-input {
      padding: 12px;
    }

    .input-shortcut-hint {
      display: none;
    }

    .article-result-meta {
      align-items: flex-start;
      flex-direction: column;
      gap: calc(var(--spacing-unit) * 1);
    }
  }
</style>
