<script lang="ts">
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>

<!--
@component
参考文献を描画するコンポーネント
- liタグをslotに指定する。

@example
```svelte
<Reference>
  <li>参考文献1</li>
  <li>参考文献2</li>
</Reference>
```
-->

<h3>参考文献</h3>

<ol>
  {@render children?.()}
</ol>

<style>
  ol {
    margin: 0 0 calc(var(--spacing-unit) * 8) 0;
    font-size: 0.85em;
    list-style-type: '・';
  }
</style>
