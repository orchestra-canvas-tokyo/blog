<script lang="ts">
  import { resolve } from '$app/paths';
  import type { Tag } from '$lib/posts/tags';
  import { page } from '$app/state';
  import { getPublishedPostMetadata } from '$lib/posts';
  import { composers } from '$lib/posts/composers';
  import { concerts } from '$lib/posts/concerts';
  const posts = getPublishedPostMetadata();
  const count = (tag: Tag) => posts.filter((post) => post.metadata.tags.includes(tag)).length;
  const groups = [
    {
      title: '演奏会から探す',
      tags: Object.values(concerts)
        .reverse()
        .map((concert) => concert.title)
    },
    {
      title: '作曲家から探す',
      tags: Object.values(composers)
        .map((composer) => composer.shortName)
        .sort((a, b) => a.localeCompare(b, 'ja'))
    }
  ].map((group) => ({
    ...group,
    entries: group.tags
      .map((tag) => ({ tag, count: count(tag) }))
      .filter((entry) => entry.count > 0)
  }));
</script>

<div class="browse">
  {#each groups as group (group.title)}
    <details>
      <summary>{group.title}</summary>
      <nav aria-label={group.title}>
        {#each group.entries as entry (entry.tag)}
          <a
            href={resolve('/tag/[tag=tag]', { tag: entry.tag })}
            aria-current={page.params.tag === entry.tag ? 'page' : undefined}
          >
            {entry.tag}<span>{entry.count}</span>
          </a>
        {/each}
      </nav>
    </details>
  {/each}
</div>

<style>
  .browse {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-top: 32px;
  }
  details {
    border-block: 1px solid var(--color-border);
  }
  summary {
    padding: 14px 4px;
    cursor: pointer;
    font-size: 14px;
  }
  nav {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 0 0 16px;
  }
  a {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    min-height: 44px;
    padding: 6px 12px;
    background: var(--color-background-secondary);
    font-size: 13px;
  }
  a:hover,
  a[aria-current] {
    background: var(--color-text-primary);
    color: white;
    text-decoration: none;
  }
  span {
    font-size: 11px;
    font-variant-numeric: tabular-nums;
  }
  @media (max-width: 576px) {
    .browse {
      grid-template-columns: 1fr;
      gap: 0;
    }
    details + details {
      border-top: 0;
    }
  }
</style>
