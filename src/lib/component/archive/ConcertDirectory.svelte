<script lang="ts">
  import { resolve } from '$app/paths';
  import type { ConcertDirectoryGroup } from '$lib/posts/directory';
  import { formatDate2JpStyle } from '$lib/util';
  import Flyer from '../Flyer.svelte';

  interface Props {
    concerts: ConcertDirectoryGroup[];
  }

  let { concerts }: Props = $props();
</script>

<div class="concert-directory">
  {#each concerts as concert (concert.slug)}
    <section class="concert-row" aria-labelledby={`concert-${concert.slug}`}>
      <div class="concert-copy">
        <div class="concert-meta">
          <time datetime={concert.date}>{formatDate2JpStyle(concert.date)}</time>
          <span>{concert.posts.length} ARTICLES</span>
        </div>

        <h3 id={`concert-${concert.slug}`}>
          <a href={concert.url} rel="external">{concert.title}</a>
        </h3>

        <ul class="note-list">
          {#each concert.posts as post (post.slug)}
            <li>
              <a href={resolve('/post/[slug]', { slug: post.slug })}>
                <span>{post.title}</span>
                <span class="arrow" aria-hidden="true">&#8594;</span>
              </a>
            </li>
          {/each}
        </ul>
      </div>

      <a
        class="flyer-link"
        href={concert.url}
        rel="external"
        aria-label={`${concert.title}の演奏会情報`}
      >
        <Flyer src={concert.flyer} alt={`${concert.title}のフライヤー`} />
      </a>
    </section>
  {/each}
</div>

<style>
  .concert-directory {
    border-top: 1px solid var(--color-border);
  }

  .concert-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(180px, 280px);
    gap: clamp(28px, 7vw, 88px);
    align-items: start;
    border-bottom: 1px solid var(--color-border);
    padding: clamp(32px, 6vw, 72px) 0;
  }

  .concert-copy {
    min-width: 0;
  }

  .concert-meta {
    display: flex;
    flex-wrap: wrap;
    gap: calc(var(--spacing-unit) * 3) calc(var(--spacing-unit) * 6);
    justify-content: space-between;
    margin-bottom: calc(var(--spacing-unit) * 4);
    color: var(--color-text-secondary);
    font-family: var(--display-font);
    font-size: 0.72rem;
  }

  h3 {
    margin: 0 0 calc(var(--spacing-unit) * 8);
    font-size: 1.85rem;
    font-weight: 500;
    line-height: 1.35;
  }

  h3 a {
    border-bottom: 1px solid transparent;
  }

  h3 a:hover {
    border-color: currentColor;
    text-decoration: none;
  }

  .note-list {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .note-list li {
    border-top: 1px solid var(--color-border);
  }

  .note-list li:last-child {
    border-bottom: 1px solid var(--color-border);
  }

  .note-list a {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 1.5rem;
    gap: calc(var(--spacing-unit) * 3);
    align-items: center;
    min-height: 44px;
    padding: calc(var(--spacing-unit) * 3) 0;
    font-family: var(--serif);
    line-height: 1.55;
  }

  .note-list a:hover {
    text-decoration-thickness: 1px;
    text-underline-offset: 0.2em;
  }

  .arrow {
    justify-self: end;
    color: var(--color-text-secondary);
    font-family: var(--display-font);
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

  @media (max-width: 720px) {
    .concert-row {
      grid-template-columns: minmax(0, 1fr) minmax(110px, 35vw);
      gap: calc(var(--spacing-unit) * 5);
    }

    .concert-meta {
      flex-direction: column;
      gap: calc(var(--spacing-unit) * 1);
    }

    h3 {
      margin-bottom: calc(var(--spacing-unit) * 5);
      font-size: 1.25rem;
    }

    .note-list a {
      font-size: 0.85rem;
    }
  }

  @media (max-width: 440px) {
    .concert-row {
      grid-template-columns: minmax(0, 1fr);
    }

    .flyer-link {
      width: min(68vw, 250px);
      justify-self: center;
    }
  }
</style>
