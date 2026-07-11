<script lang="ts">
  import { resolve } from '$app/paths';
  import Flyer from '$lib/component/Flyer.svelte';
  import Meta from '$lib/component/Meta.svelte';
  import TagList from '$lib/component/TagList.svelte';
  import { getFullTitle } from '$lib/posts';
  import { composers } from '$lib/posts/composers';
  import { concerts } from '$lib/posts/concerts';
  import { formatDate2JpStyle } from '$lib/util';
  import type { Composer } from '$lib/posts/composers';
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  type TableOfContentsEntry = {
    id: string;
    level: 3 | 4;
    title: string;
  };

  let { data }: Props = $props();
  let articleBody: HTMLElement;
  let tableOfContents = $state<TableOfContentsEntry[]>([]);
  let authors = $state<string[]>([]);

  let metadata = $derived(data.post.metadata);
  let composer = $derived(metadata.composerSlug ? composers[metadata.composerSlug] : null);
  let arranger = $derived(metadata.arrangerSlug ? composers[metadata.arrangerSlug] : null);
  let concert = $derived(concerts[metadata.concertSlug]);

  const hasYearOfDeath = (composer: Composer): composer is Composer & { yearOfDeath: number } => {
    return Object.keys(composer).includes('yearOfDeath');
  };

  const todayInJapan = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date());
  const concertsByDate = [...Object.values(concerts)].sort((a, b) => a.date.localeCompare(b.date));
  const upcomingConcert = concertsByDate.find((item) => item.date >= todayInJapan);
  const featuredConcert = upcomingConcert ?? concertsByDate.at(-1)!;
  const featuredConcertLabel = upcomingConcert ? 'NEXT CONCERT' : 'LATEST CONCERT';

  $effect(() => {
    const slug = data.slug;
    const headings = Array.from(articleBody.querySelectorAll<HTMLHeadingElement>('h3, h4'));
    tableOfContents = headings.map((heading, index) => {
      const id = heading.id || `${slug}-section-${index + 1}`;
      heading.id = id;

      return {
        id,
        level: heading.tagName === 'H3' ? 3 : 4,
        title: heading.textContent?.replace(/\s+/g, ' ').trim() || `セクション ${index + 1}`
      };
    });

    authors = Array.from(articleBody.querySelectorAll<HTMLElement>('.post-author'))
      .map((author) => author.textContent?.replace(/[（）]/g, '').trim() ?? '')
      .filter((author, index, allAuthors) => author !== '' && allAuthors.indexOf(author) === index);
  });
</script>

<Meta title={getFullTitle(data.post)} canonical={`/post/${data.slug}`} />

<main class="article-page">
  <nav class="breadcrumb" aria-label="パンくずリスト">
    <ol>
      <li><a href={resolve('/')}>PROGRAM NOTES</a></li>
      <li><a href={concert.url} rel="external">{concert.title}演奏会</a></li>
      <li aria-current="page">{metadata.title}</li>
    </ol>
  </nav>

  <header class="article-header">
    <p class="eyebrow">PROGRAM NOTE</p>
    <h1>{metadata.title}</h1>

    {#if arranger && composer}
      <p class="composer-name">{composer.fullName} <span>／ {arranger.fullName} 編</span></p>
    {:else if composer}
      <p class="composer-name">
        {composer.fullName}
        <span>
          ／ {composer.yearOfBirth}&ndash;{#if hasYearOfDeath(composer)}{composer.yearOfDeath}{/if}
        </span>
      </p>
    {/if}

    <div class="article-metadata">
      <div>
        <span class="metadata-label">CONCERT</span>
        <a href={concert.url} rel="external">{concert.title}演奏会</a>
      </div>
      <div>
        <span class="metadata-label">CONCERT DATE</span>
        <time datetime={concert.date}>{formatDate2JpStyle(concert.date)}</time>
      </div>
      <div>
        <span class="metadata-label">PUBLISHED</span>
        <time datetime={metadata.publicatedAt}>{formatDate2JpStyle(metadata.publicatedAt)}</time>
      </div>
      {#if data.post.hasAuthorCredit}
        <div class:metadata-pending={authors.length === 0}>
          <span class="metadata-label">TEXT</span>
          <span>{authors.join(' ／ ')}</span>
        </div>
      {/if}
    </div>

    <div class="article-tags">
      <TagList tags={metadata.tags} />
    </div>
  </header>

  {#if data.post.hasTableOfContents}
    <details class="mobile-toc" class:toc-pending={tableOfContents.length === 0}>
      <summary>目次</summary>
      {#if tableOfContents.length > 0}
        <ol>
          {#each tableOfContents as entry (entry.id)}
            <li class:toc-subsection={entry.level === 4}>
              <a href={`#${entry.id}`}>{entry.title}</a>
            </li>
          {/each}
        </ol>
      {/if}
    </details>
  {/if}

  <div class="reading-layout">
    <aside class="desktop-toc" aria-label="目次">
      {#if tableOfContents.length > 0}
        <p>CONTENTS</p>
        <ol>
          {#each tableOfContents as entry (entry.id)}
            <li class:toc-subsection={entry.level === 4}>
              <a href={`#${entry.id}`}>{entry.title}</a>
            </li>
          {/each}
        </ol>
      {/if}
    </aside>

    <article bind:this={articleBody} class="reading-body">
      <h2 class="sr-only">曲目解説本文</h2>
      <data.post.default />

      {#if metadata.youTubeVideoIds}
        <div class="video-list">
          {#each metadata.youTubeVideoIds as id, index (id)}
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${id}`}
              title={`${metadata.title} 関連動画 ${index + 1}`}
              loading="lazy"
              referrerpolicy="strict-origin-when-cross-origin"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          {/each}
        </div>
      {/if}
    </article>
  </div>

  {#if data.relatedPostListItems.sameConcert.length > 0}
    <section class="related-notes" aria-labelledby="same-concert-heading">
      <p class="section-label">PROGRAM</p>
      <h2 id="same-concert-heading">同じ演奏会の曲目</h2>
      <div class="related-list">
        {#each data.relatedPostListItems.sameConcert as post (post.slug)}
          <a href={resolve('/post/[slug]', { slug: post.slug })}>
            <span>{getFullTitle(post)}</span>
            <time datetime={post.metadata.publicatedAt}>
              {formatDate2JpStyle(post.metadata.publicatedAt)}
            </time>
          </a>
        {/each}
      </div>
    </section>
  {/if}

  {#if data.relatedPostListItems.sameComposer.length > 0}
    <section class="related-notes compact" aria-labelledby="same-composer-heading">
      <p class="section-label">MORE NOTES</p>
      <h2 id="same-composer-heading">同じ作曲家の曲目解説</h2>
      <div class="related-list">
        {#each data.relatedPostListItems.sameComposer as post (post.slug)}
          <a href={resolve('/post/[slug]', { slug: post.slug })}>
            <span>{getFullTitle(post)}</span>
            <time datetime={post.metadata.publicatedAt}>
              {formatDate2JpStyle(post.metadata.publicatedAt)}
            </time>
          </a>
        {/each}
      </div>
    </section>
  {/if}

  <section class="concert-band" aria-labelledby="featured-concert-heading">
    <div class="concert-band-inner">
      <a class="concert-flyer" href={featuredConcert.url} rel="external">
        <Flyer src={featuredConcert.flyer} alt={`${featuredConcert.title}演奏会のフライヤー`} />
      </a>
      <div class="concert-details">
        <p class="section-label">{featuredConcertLabel}</p>
        <h2 id="featured-concert-heading">{featuredConcert.title}演奏会</h2>
        <p>Orchestra Canvas Tokyo</p>
        <time datetime={featuredConcert.date}>{formatDate2JpStyle(featuredConcert.date)}</time>
        <a class="concert-link" href={featuredConcert.url} rel="external">演奏会詳細</a>
      </div>
    </div>
  </section>
</main>

<style>
  .article-page {
    width: 100%;
    color: var(--color-text-primary);
    letter-spacing: 0;
  }

  .breadcrumb,
  .article-header,
  .reading-layout,
  .mobile-toc,
  .related-notes,
  .concert-band-inner {
    width: min(100%, var(--content-max-width));
    margin-inline: auto;
  }

  .breadcrumb {
    margin-bottom: calc(var(--spacing-unit) * 14);
    color: var(--color-text-secondary);
    font-family: var(--sans-serif);
    font-size: 0.7rem;
  }

  .breadcrumb ol {
    display: flex;
    flex-wrap: wrap;
    gap: calc(var(--spacing-unit) * 2);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .breadcrumb li {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: calc(var(--spacing-unit) * 2);
  }

  .breadcrumb li:not(:last-child)::after {
    content: '/';
    color: var(--color-border);
  }

  .breadcrumb li:last-child {
    overflow: hidden;
    max-width: 32ch;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .breadcrumb a,
  .article-metadata a,
  .desktop-toc a,
  .mobile-toc a {
    text-decoration: underline;
    text-decoration-color: transparent;
    text-decoration-thickness: 1px;
    text-underline-offset: 0.25em;
    transition:
      color 160ms ease,
      text-decoration-color 160ms ease;
  }

  .breadcrumb a:hover,
  .article-metadata a:hover,
  .desktop-toc a:hover,
  .mobile-toc a:hover {
    text-decoration-color: currentColor;
  }

  .article-header {
    padding-bottom: calc(var(--spacing-unit) * 14);
    border-bottom: 1px solid var(--color-border);
  }

  .eyebrow,
  .section-label,
  .metadata-label,
  .desktop-toc > p {
    margin: 0;
    color: var(--color-text-secondary);
    font-family: var(--display-font);
    font-size: 0.68rem;
    font-weight: 600;
    line-height: 1.4;
    letter-spacing: 0;
  }

  h1 {
    max-width: 20ch;
    margin: calc(var(--spacing-unit) * 4) 0 0;
    overflow-wrap: anywhere;
    font-family: var(--serif);
    font-size: 3rem;
    font-weight: 500;
    line-height: 1.35;
    letter-spacing: 0;
  }

  .composer-name {
    margin: calc(var(--spacing-unit) * 5) 0 0;
    color: var(--color-text-secondary);
    font-family: var(--serif);
    font-size: 1rem;
    line-height: 1.8;
    letter-spacing: 0;
  }

  .composer-name span {
    font-size: 0.82em;
  }

  .article-metadata {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: calc(var(--spacing-unit) * 7);
    margin-top: calc(var(--spacing-unit) * 12);
    font-family: var(--sans-serif);
    font-size: 0.78rem;
    line-height: 1.6;
  }

  .article-metadata > div {
    display: flex;
    min-width: 0;
    flex-direction: column;
    gap: calc(var(--spacing-unit) * 1.5);
  }

  .metadata-pending {
    visibility: hidden;
  }

  .article-tags {
    margin-top: calc(var(--spacing-unit) * 7);
    color: var(--color-text-secondary);
    font-family: var(--sans-serif);
    font-size: 0.75rem;
  }

  .reading-layout {
    display: grid;
    grid-template-columns: minmax(150px, 210px) minmax(0, var(--reading-max-width));
    gap: calc(var(--spacing-unit) * 14);
    justify-content: center;
    margin-top: calc(var(--spacing-unit) * 16);
  }

  .desktop-toc {
    position: sticky;
    top: calc(var(--spacing-unit) * 8);
    align-self: start;
    max-height: calc(100vh - var(--spacing-unit) * 16);
    overflow-y: auto;
    padding-top: calc(var(--spacing-unit) * 2);
    color: var(--color-text-secondary);
    font-family: var(--sans-serif);
    font-size: 0.7rem;
    line-height: 1.55;
    scrollbar-width: thin;
  }

  .desktop-toc ol,
  .mobile-toc ol {
    margin: calc(var(--spacing-unit) * 4) 0 0;
    padding: 0;
    list-style: none;
  }

  .desktop-toc li + li,
  .mobile-toc li + li {
    margin-top: calc(var(--spacing-unit) * 2.5);
  }

  .desktop-toc .toc-subsection,
  .mobile-toc .toc-subsection {
    padding-inline-start: 1em;
    color: var(--color-text-secondary);
  }

  .mobile-toc {
    display: none;
  }

  .toc-pending {
    visibility: hidden;
  }

  .reading-body {
    min-width: 0;
    max-width: var(--reading-max-width);
    font-family: var(--serif);
    font-size: 1rem;
    line-height: 1.95;
    letter-spacing: 0;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
  }

  .reading-body :global(*) {
    letter-spacing: 0;
  }

  .reading-body :global(h3),
  .reading-body :global(h4) {
    scroll-margin-top: calc(var(--spacing-unit) * 8);
    overflow-wrap: anywhere;
    font-family: var(--serif);
    line-height: 1.55;
  }

  .reading-body :global(h3) {
    margin: calc(var(--spacing-unit) * 18) 0 calc(var(--spacing-unit) * 6);
    padding-top: calc(var(--spacing-unit) * 4);
    border-top: 1px solid var(--color-border);
    font-size: 1.5rem;
    font-weight: 600;
  }

  .reading-body :global(h4) {
    margin: calc(var(--spacing-unit) * 10) 0 calc(var(--spacing-unit) * 4);
    font-size: 1.08rem;
    font-weight: 600;
  }

  .reading-body :global(p) {
    margin: calc(var(--spacing-unit) * 5) 0;
    text-align: left;
    text-indent: 1em;
  }

  .reading-body :global(a) {
    border-radius: 1px;
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 0.22em;
    transition:
      color 160ms ease,
      background-color 160ms ease;
  }

  .reading-body :global(a:hover) {
    background: var(--color-inverse-background);
    color: var(--color-inverse-text);
    text-decoration: none;
  }

  .reading-body :global(blockquote) {
    margin: calc(var(--spacing-unit) * 12) 0;
    padding: calc(var(--spacing-unit) * 2) 0 calc(var(--spacing-unit) * 2)
      calc(var(--spacing-unit) * 6);
    border-inline-start: 1px solid var(--color-border);
    color: var(--color-text-secondary);
    font-style: normal;
  }

  .reading-body :global(blockquote p:first-child) {
    margin-top: 0;
  }

  .reading-body :global(blockquote p:last-child) {
    margin-bottom: 0;
  }

  .reading-body :global(ul),
  .reading-body :global(ol) {
    padding-inline-start: 1.5em;
  }

  .reading-body :global(li + li) {
    margin-top: calc(var(--spacing-unit) * 2);
  }

  .reading-body :global(figure:has(blockquote)) {
    margin: calc(var(--spacing-unit) * 12) 0;
  }

  .reading-body :global(figure blockquote) {
    margin: 0;
  }

  .reading-body :global(figure:has(blockquote) > figcaption) {
    margin-top: calc(var(--spacing-unit) * 3);
    color: var(--color-text-secondary);
    font-family: var(--sans-serif);
    font-size: 0.75rem;
    line-height: 1.6;
    text-align: right;
  }

  .reading-body :global(hr) {
    margin: calc(var(--spacing-unit) * 12) 0;
    border: 0;
    border-top: 1px solid var(--color-border);
  }

  .reading-body :global(table) {
    display: block;
    width: 100%;
    overflow-x: auto;
    border-collapse: collapse;
  }

  .reading-body :global(th),
  .reading-body :global(td) {
    padding: calc(var(--spacing-unit) * 2);
    border-bottom: 1px solid var(--color-border);
    text-align: left;
  }

  .video-list {
    display: grid;
    gap: calc(var(--spacing-unit) * 8);
    margin-top: calc(var(--spacing-unit) * 18);
  }

  .video-list iframe {
    display: block;
    width: 100%;
    height: auto;
    aspect-ratio: 16 / 9;
    border: 0;
    background: var(--color-surface);
  }

  .related-notes {
    margin-top: calc(var(--spacing-unit) * 28);
  }

  .related-notes.compact {
    margin-top: calc(var(--spacing-unit) * 18);
  }

  .related-notes h2,
  .concert-details h2 {
    margin: calc(var(--spacing-unit) * 2) 0 calc(var(--spacing-unit) * 7);
    font-family: var(--serif);
    font-size: 1.7rem;
    font-weight: 500;
    line-height: 1.5;
    letter-spacing: 0;
  }

  .related-list {
    border-top: 1px solid var(--color-border);
  }

  .related-list a {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: calc(var(--spacing-unit) * 6);
    align-items: baseline;
    padding: calc(var(--spacing-unit) * 5) calc(var(--spacing-unit) * 2);
    border-bottom: 1px solid var(--color-border);
    font-family: var(--serif);
    line-height: 1.6;
    text-decoration: none;
    transition:
      color 160ms ease,
      background-color 160ms ease;
  }

  .related-list a:hover {
    background: var(--color-inverse-background);
    color: var(--color-inverse-text);
  }

  .related-list time {
    color: var(--color-text-secondary);
    font-family: var(--sans-serif);
    font-size: 0.7rem;
    white-space: nowrap;
  }

  .related-list a:hover time {
    color: inherit;
  }

  .concert-band {
    margin-top: calc(var(--spacing-unit) * 28);
    padding: calc(var(--spacing-unit) * 12) 0;
    border-top: 1px solid var(--color-border);
    border-bottom: 1px solid var(--color-border);
    background: var(--color-surface);
  }

  .concert-band-inner {
    display: grid;
    grid-template-columns: minmax(140px, 220px) minmax(0, 1fr);
    gap: calc(var(--spacing-unit) * 12);
    align-items: center;
  }

  .concert-flyer {
    display: block;
    min-width: 0;
    aspect-ratio: 1 / 1.4142;
    transition: opacity 160ms ease;
  }

  .concert-flyer :global(img) {
    max-height: none;
  }

  .concert-flyer:hover {
    opacity: 0.82;
  }

  .concert-details {
    display: flex;
    min-width: 0;
    flex-direction: column;
    align-items: flex-start;
  }

  .concert-details h2 {
    margin-bottom: calc(var(--spacing-unit) * 2);
    overflow-wrap: anywhere;
  }

  .concert-details > p:not(.section-label),
  .concert-details time {
    margin: 0;
    font-family: var(--sans-serif);
    font-size: 0.82rem;
    line-height: 1.7;
  }

  .concert-details time {
    color: var(--color-text-secondary);
  }

  .concert-link {
    display: inline-block;
    margin-top: calc(var(--spacing-unit) * 7);
    padding: calc(var(--spacing-unit) * 2.5) calc(var(--spacing-unit) * 4);
    border: 1px solid var(--color-border);
    font-family: var(--sans-serif);
    font-size: 0.72rem;
    text-decoration: none;
    transition:
      color 160ms ease,
      background-color 160ms ease,
      border-color 160ms ease;
  }

  .concert-link:hover {
    border-color: var(--color-inverse-background);
    background: var(--color-inverse-background);
    color: var(--color-inverse-text);
  }

  :is(a, summary):focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 3px;
  }

  @media (max-width: 900px) {
    .article-metadata {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .reading-layout {
      grid-template-columns: minmax(0, var(--reading-max-width));
      gap: 0;
    }

    .desktop-toc {
      display: none;
    }

    .mobile-toc {
      display: block;
      margin-top: calc(var(--spacing-unit) * 8);
      border-top: 1px solid var(--color-border);
      border-bottom: 1px solid var(--color-border);
      color: var(--color-text-secondary);
      font-family: var(--sans-serif);
      font-size: 0.78rem;
    }

    .mobile-toc summary {
      padding: calc(var(--spacing-unit) * 4) 0;
      cursor: pointer;
      color: var(--color-text-primary);
      font-family: var(--display-font);
      font-size: 0.72rem;
      font-weight: 600;
    }

    .mobile-toc ol {
      padding-bottom: calc(var(--spacing-unit) * 5);
    }

    .reading-layout {
      margin-top: calc(var(--spacing-unit) * 12);
    }
  }

  @media (max-width: 620px) {
    .breadcrumb {
      margin-bottom: calc(var(--spacing-unit) * 10);
    }

    .article-header {
      padding-bottom: calc(var(--spacing-unit) * 10);
    }

    h1 {
      max-width: none;
      font-size: 2.15rem;
      line-height: 1.45;
    }

    .composer-name {
      font-size: 0.92rem;
    }

    .article-metadata {
      grid-template-columns: 1fr;
      gap: calc(var(--spacing-unit) * 4);
      margin-top: calc(var(--spacing-unit) * 9);
    }

    .article-metadata > div {
      display: grid;
      grid-template-columns: 7.5rem minmax(0, 1fr);
      gap: calc(var(--spacing-unit) * 3);
    }

    .article-metadata > div:last-child {
      min-height: 3.2em;
    }

    .reading-body {
      line-height: 1.9;
    }

    .reading-body :global(h3) {
      margin-top: calc(var(--spacing-unit) * 14);
      font-size: 1.32rem;
    }

    .reading-body :global(h4) {
      font-size: 1rem;
    }

    .reading-body :global(blockquote) {
      padding-inline-start: calc(var(--spacing-unit) * 4);
    }

    .related-notes {
      margin-top: calc(var(--spacing-unit) * 22);
    }

    .related-notes h2,
    .concert-details h2 {
      font-size: 1.4rem;
    }

    .related-list a {
      grid-template-columns: 1fr;
      gap: calc(var(--spacing-unit) * 1.5);
    }

    .concert-band {
      margin-top: calc(var(--spacing-unit) * 22);
      padding: calc(var(--spacing-unit) * 8) 0;
    }

    .concert-band-inner {
      grid-template-columns: minmax(82px, 105px) minmax(0, 1fr);
      gap: calc(var(--spacing-unit) * 5);
      align-items: start;
    }

    .concert-details h2 {
      margin-top: calc(var(--spacing-unit) * 1.5);
      font-size: 1.18rem;
    }

    .concert-details > p:not(.section-label),
    .concert-details time {
      font-size: 0.72rem;
    }

    .concert-link {
      margin-top: calc(var(--spacing-unit) * 4);
      padding: calc(var(--spacing-unit) * 2) calc(var(--spacing-unit) * 3);
    }
  }

  @media (max-width: 360px) {
    h1 {
      font-size: 1.85rem;
    }

    .article-metadata > div {
      grid-template-columns: 6.5rem minmax(0, 1fr);
    }

    .concert-band-inner {
      grid-template-columns: 82px minmax(0, 1fr);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .article-page * {
      scroll-behavior: auto !important;
      transition-duration: 0.01ms !important;
    }
  }
</style>
