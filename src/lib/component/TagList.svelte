<script lang="ts">
  import { resolve } from '$app/paths';
  import type { Tag } from '$lib/posts/tags';

  interface Props {
    /**
     * タグ文字列の配列
     * ハッシュタグを含まない。
     */
    tags: Tag[];
  }

  let { tags }: Props = $props();
</script>

<!--
@component
タグのリストを描画するコンポーネント

@example
```svelte
<TagList tags={['hoge', 'fuga']}>
```
-->

<ul class="tag" aria-label="記事のタグ">
  {#each tags as tag (tag)}
    <li class="tag-item">
      <a href={resolve('/tag/[tag=tag]', { tag })}><span class="sharp">#&thinsp;</span>{tag}</a>
    </li>
  {/each}
</ul>

<style>
  .tag {
    display: flex;
    flex-wrap: wrap;
    gap: calc(var(--spacing-unit) * 1) calc(var(--spacing-unit) * 5);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .tag-item {
    display: flex;
  }

  a {
    display: inline-flex;
    align-items: center;
    min-height: 32px;
    border-bottom: 1px solid transparent;
  }

  a:hover {
    border-color: currentColor;
    text-decoration: none;
  }

  .sharp {
    color: var(--color-text-secondary);
  }
</style>
