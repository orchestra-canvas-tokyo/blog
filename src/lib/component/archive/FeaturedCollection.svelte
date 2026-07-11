<script lang="ts">
  import { resolve } from '$app/paths';
  import { getFullTitle, type PostListItem } from '$lib/posts';
  import type { ConcertDirectoryGroup } from '$lib/posts/directory';
  import { formatDate2JpStyle } from '$lib/util';
  import Flyer from '../Flyer.svelte';

  interface Props {
    concert: ConcertDirectoryGroup;
    posts: PostListItem[];
  }

  let { concert, posts }: Props = $props();
</script>

<section class="featured-collection" aria-labelledby="featured-collection-title">
  <div class="collection-copy">
    <p class="section-label">LATEST COLLECTION</p>
    <div class="collection-heading">
      <h2 id="featured-collection-title">{concert.title}演奏会</h2>
      <time datetime={concert.date}>{formatDate2JpStyle(concert.date)}</time>
    </div>

    <ol class="program-list">
      {#each posts as post, index (post.slug)}
        <li>
          <a href={resolve('/post/[slug]', { slug: post.slug })}>
            <span class="program-number" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span>{getFullTitle(post)}</span>
            <span class="arrow" aria-hidden="true">&#8594;</span>
          </a>
        </li>
      {/each}
    </ol>

    <a class="concert-link" href={concert.url} rel="external">
      演奏会情報
      <span aria-hidden="true">&#8599;</span>
    </a>
  </div>

  <a
    class="flyer-link"
    href={concert.url}
    rel="external"
    aria-label={`${concert.title}の演奏会情報`}
  >
    <Flyer src={concert.flyer} alt={`${concert.title}のフライヤー`} loading="eager" />
  </a>
</section>

<style>
  .featured-collection {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(210px, 300px);
    gap: clamp(32px, 7vw, 88px);
    align-items: start;
    border-top: 1px solid var(--color-border);
    border-bottom: 1px solid var(--color-border);
    padding: clamp(32px, 6vw, 72px) 0;
  }

  .collection-copy {
    min-width: 0;
  }

  .section-label {
    margin: 0 0 calc(var(--spacing-unit) * 6);
    font-family: var(--display-font);
    font-size: 0.75rem;
    color: var(--color-text-secondary);
  }

  .collection-heading {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: calc(var(--spacing-unit) * 3) calc(var(--spacing-unit) * 6);
    align-items: baseline;
    margin-bottom: calc(var(--spacing-unit) * 8);
  }

  h2 {
    margin: 0;
    font-size: 2.25rem;
    font-weight: 500;
  }

  time {
    color: var(--color-text-secondary);
    font-size: 0.82rem;
  }

  .program-list {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .program-list li {
    border-top: 1px solid var(--color-border);
  }

  .program-list li:last-child {
    border-bottom: 1px solid var(--color-border);
  }

  .program-list a {
    display: grid;
    grid-template-columns: 2rem minmax(0, 1fr) 1.5rem;
    gap: calc(var(--spacing-unit) * 3);
    align-items: baseline;
    min-height: 44px;
    padding: calc(var(--spacing-unit) * 4) 0;
    font-family: var(--serif);
    line-height: 1.55;
    transition:
      color 180ms ease,
      padding 180ms ease;
  }

  .program-list a:hover {
    padding-left: calc(var(--spacing-unit) * 2);
    text-decoration: none;
  }

  .program-number,
  .arrow {
    font-family: var(--display-font);
    color: var(--color-text-secondary);
    font-size: 0.75rem;
  }

  .arrow {
    justify-self: end;
  }

  .concert-link {
    display: inline-flex;
    gap: calc(var(--spacing-unit) * 2);
    align-items: center;
    min-height: 44px;
    margin-top: calc(var(--spacing-unit) * 6);
    border-bottom: 1px solid currentColor;
    font-size: 0.85rem;
  }

  .flyer-link {
    display: block;
    aspect-ratio: 1 / 1.4142;
    border: 0;
    line-height: 0;
  }

  .flyer-link :global(img) {
    display: block;
    width: 100%;
    height: auto;
    max-height: none;
    object-fit: contain;
  }

  @media (max-width: 680px) {
    .featured-collection {
      grid-template-columns: minmax(0, 1fr);
      gap: calc(var(--spacing-unit) * 10);
    }

    .flyer-link {
      width: min(72vw, 300px);
      justify-self: center;
    }

    h2 {
      font-size: 1.5rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .program-list a {
      transition: none;
    }
  }
</style>
