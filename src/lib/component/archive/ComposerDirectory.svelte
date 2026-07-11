<script lang="ts">
  import { resolve } from '$app/paths';
  import type { ComposerDirectoryGroup } from '$lib/posts/directory';
  import type { Tag } from '$lib/posts/tags';

  interface Props {
    composers: ComposerDirectoryGroup[];
  }

  let { composers }: Props = $props();
</script>

<div class="composer-directory">
  {#each composers as composer (composer.slug)}
    <section class="composer-row" aria-labelledby={`composer-${composer.slug}`}>
      <div class="composer-heading">
        <p class="article-count">{composer.posts.length} ARTICLES</p>
        <h3 id={`composer-${composer.slug}`}>
          <a href={resolve('/tag/[tag=tag]', { tag: composer.shortName as Tag })}>
            {composer.shortName}
          </a>
        </h3>
        <p class="full-name">{composer.fullName}</p>
        {#if Number.isFinite(composer.yearOfBirth)}
          <p class="lifespan">
            {composer.yearOfBirth}&ndash;{composer.yearOfDeath ?? ''}
          </p>
        {/if}
      </div>

      <ul class="note-list">
        {#each composer.posts as post (post.slug)}
          <li>
            <a href={resolve('/post/[slug]', { slug: post.slug })}>
              <span class="concert-title">{post.concertTitle}</span>
              <span class="post-title">{post.title}</span>
              <span class="arrow" aria-hidden="true">&#8594;</span>
            </a>
          </li>
        {/each}
      </ul>
    </section>
  {/each}
</div>

<style>
  .composer-directory {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: clamp(32px, 7vw, 88px);
    border-top: 1px solid var(--color-border);
  }

  .composer-row {
    min-width: 0;
    border-bottom: 1px solid var(--color-border);
    padding: calc(var(--spacing-unit) * 10) 0 calc(var(--spacing-unit) * 12);
  }

  .composer-heading {
    min-height: 9.5rem;
  }

  .article-count,
  .full-name,
  .lifespan {
    margin: 0;
    color: var(--color-text-secondary);
  }

  .article-count {
    margin-bottom: calc(var(--spacing-unit) * 3);
    font-family: var(--display-font);
    font-size: 0.7rem;
  }

  h3 {
    margin: 0 0 calc(var(--spacing-unit) * 2);
    font-family: var(--serif);
    font-size: 1.55rem;
    font-weight: 500;
    line-height: 1.4;
  }

  h3 a {
    border-bottom: 1px solid transparent;
  }

  h3 a:hover {
    border-color: currentColor;
    text-decoration: none;
  }

  .full-name,
  .lifespan {
    font-size: 0.78rem;
    line-height: 1.6;
  }

  .note-list {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .note-list li {
    border-top: 1px solid var(--color-border);
  }

  .note-list a {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 1.25rem;
    gap: calc(var(--spacing-unit) * 3);
    min-height: 44px;
    padding: calc(var(--spacing-unit) * 3) 0;
    align-items: center;
  }

  .concert-title,
  .post-title {
    grid-column: 1;
  }

  .concert-title {
    color: var(--color-text-secondary);
    font-size: 0.7rem;
  }

  .post-title {
    font-family: var(--serif);
    line-height: 1.55;
  }

  .arrow {
    grid-column: 2;
    grid-row: 1 / span 2;
    color: var(--color-text-secondary);
    justify-self: end;
  }

  @media (max-width: 760px) {
    .composer-directory {
      grid-template-columns: minmax(0, 1fr);
    }

    .composer-heading {
      min-height: 0;
      margin-bottom: calc(var(--spacing-unit) * 7);
    }

    .composer-row {
      padding-top: calc(var(--spacing-unit) * 9);
    }
  }
</style>
