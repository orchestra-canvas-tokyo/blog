<script lang="ts">
  import { resolve } from '$app/paths';
  import type { PageData } from './$types';
  import Meta from '$lib/component/Meta.svelte';
  import PostList from '$lib/component/PostList.svelte';
  import FeaturedCollection from '$lib/component/archive/FeaturedCollection.svelte';
  import ConcertDirectory from '$lib/component/archive/ConcertDirectory.svelte';
  import ComposerDirectory from '$lib/component/archive/ComposerDirectory.svelte';
  import UpcomingConcert from '$lib/component/archive/UpcomingConcert.svelte';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
</script>

<Meta title="" canonical="/" />

<main class="archive-page">
  <header class="archive-header">
    <p class="organization-name">ORCHESTRA CANVAS TOKYO</p>
    <div class="archive-title-group">
      <h1>program notes</h1>
      <div class="archive-summary">
        <p>曲目解説アーカイブ</p>
        <p>{data.totalNumberOfPosts} ARTICLES</p>
      </div>
    </div>
  </header>

  <nav class="browse-tabs" aria-label="曲目解説の表示方法">
    <a
      href={resolve('/')}
      class:active={data.view === 'latest'}
      aria-current={data.view === 'latest' ? 'page' : undefined}
    >
      LATEST
    </a>
    <a
      href={resolve('/?view=concerts' as `/?${string}`)}
      class:active={data.view === 'concerts'}
      aria-current={data.view === 'concerts' ? 'page' : undefined}
    >
      CONCERTS
    </a>
    <a
      href={resolve('/?view=composers' as `/?${string}`)}
      class:active={data.view === 'composers'}
      aria-current={data.view === 'composers' ? 'page' : undefined}
    >
      COMPOSERS
    </a>
  </nav>

  {#if data.view === 'latest'}
    {#if data.featuredCollection?.concert}
      <FeaturedCollection
        concert={data.featuredCollection.concert}
        posts={data.featuredCollection.posts}
      />
    {/if}

    <section class="recent-notes" aria-labelledby="recent-notes-title">
      <div class="section-heading">
        <p>RECENT NOTES</p>
        <h2 id="recent-notes-title">
          {data.currentPageNumber === 1 ? '新着記事' : `記事一覧 ${data.currentPageNumber}`}
        </h2>
      </div>
      <PostList
        posts={data.posts}
        currentPageNumber={data.currentPageNumber}
        totalNumberOfPages={data.totalNumberOfPages}
        headingLevel={3}
      />
    </section>
  {:else if data.view === 'concerts'}
    <section class="directory-section" aria-labelledby="concert-directory-title">
      <div class="section-heading">
        <p>BY CONCERT</p>
        <h2 id="concert-directory-title">演奏会別</h2>
      </div>
      <ConcertDirectory concerts={data.concertGroups} />
    </section>
  {:else}
    <section class="directory-section" aria-labelledby="composer-directory-title">
      <div class="section-heading">
        <p>BY COMPOSER</p>
        <h2 id="composer-directory-title">作曲家別</h2>
      </div>
      <ComposerDirectory composers={data.composerGroups} />
    </section>
  {/if}

  {#if data.upcomingConcert}
    <UpcomingConcert concert={data.upcomingConcert} />
  {/if}
</main>

<style>
  .archive-header {
    padding: clamp(36px, 7vw, 88px) 0 clamp(40px, 8vw, 96px);
  }

  .organization-name,
  .archive-summary,
  .section-heading > p {
    font-family: var(--display-font);
    color: var(--color-text-secondary);
  }

  .organization-name {
    margin: 0 0 calc(var(--spacing-unit) * 6);
    font-size: 0.72rem;
  }

  .archive-title-group {
    display: flex;
    justify-content: space-between;
    gap: calc(var(--spacing-unit) * 8);
    align-items: flex-end;
  }

  h1 {
    margin: 0;
    font-family: var(--display-font);
    font-size: 3rem;
    font-weight: 500;
    line-height: 1;
    text-transform: uppercase;
  }

  .archive-summary {
    text-align: right;
    font-size: 0.78rem;
  }

  .archive-summary p {
    margin: 0;
  }

  .browse-tabs {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1px;
    margin-bottom: clamp(40px, 7vw, 88px);
    background: var(--color-border);
    border: 1px solid var(--color-border);
  }

  .browse-tabs a {
    display: grid;
    place-items: center;
    min-height: 48px;
    padding: calc(var(--spacing-unit) * 2) calc(var(--spacing-unit) * 3);
    background: var(--color-background);
    font-family: var(--display-font);
    font-size: 0.78rem;
    transition:
      background-color 180ms ease,
      color 180ms ease;
  }

  .browse-tabs a:hover,
  .browse-tabs a.active {
    background: var(--color-text-primary);
    color: var(--color-background);
    text-decoration: none;
  }

  .recent-notes,
  .directory-section {
    margin-top: clamp(64px, 10vw, 120px);
  }

  .section-heading {
    display: flex;
    justify-content: space-between;
    gap: calc(var(--spacing-unit) * 6);
    align-items: baseline;
    margin-bottom: calc(var(--spacing-unit) * 8);
  }

  .section-heading > p {
    margin: 0;
    font-size: 0.72rem;
  }

  .section-heading h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 500;
  }

  @media (max-width: 600px) {
    .archive-header {
      padding-top: calc(var(--spacing-unit) * 10);
    }

    .archive-title-group {
      flex-direction: column;
      align-items: flex-start;
      gap: calc(var(--spacing-unit) * 6);
    }

    h1 {
      font-size: 2.2rem;
    }

    .archive-summary {
      display: flex;
      flex-wrap: wrap;
      gap: calc(var(--spacing-unit) * 2) calc(var(--spacing-unit) * 5);
      text-align: left;
    }

    .browse-tabs a {
      font-size: 0.67rem;
    }

    .section-heading {
      flex-direction: column;
      gap: calc(var(--spacing-unit) * 2);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .browse-tabs a {
      transition: none;
    }
  }
</style>
