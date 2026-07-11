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

<section class="references">
  <h3>参考文献</h3>

  <ol>
    {@render children?.()}
  </ol>
</section>

<style>
  ol {
    margin: 0 0 calc(var(--spacing-unit) * 8);
    padding-inline-start: 1.5em;
    color: var(--color-text-secondary);
    font-size: 0.85em;
    line-height: 1.75;
  }

  ol :global(li)::marker {
    font-family: var(--sans-serif);
  }
</style>
