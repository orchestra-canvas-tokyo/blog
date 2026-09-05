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

<div class="tag">
  {#each tags as tag (tag)}
    <div class="tag-item">
      <a href={resolve('/tag/[tag=tag]', { tag })}><span class="sharp">#&thinsp;</span>{tag}</a>
    </div>
  {/each}
</div>

<style>
  .tag {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 4px 12px;
  }
  .tag-item {
    display: block;
  }
  a {
    display: inline-block;
    padding-block: 5px;
  }
  .sharp {
    font-size: 95%;
  }
</style>
