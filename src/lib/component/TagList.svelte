<script lang="ts">
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
  {#each tags as tag}
    <div class="tag-item">
      <a href="/tag/{tag}"><span class="sharp">#&thinsp;</span>{tag}</a>
    </div>
  {/each}
</div>

<style>
  .tag {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .tag-item {
    display: block;
    margin-right: 1em;
  }
  .sharp {
    font-size: 95%;
  }
</style>
