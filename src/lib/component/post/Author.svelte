<script lang="ts">
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>

<p class="post-author">
  （{@render children?.()}）
</p>

<!--
@component
著者の描画を想定したコンポーネント
右寄せ括弧書きで描画する。

@example
```svelte
<Author>Vn. ほげ</Author>
```
-->

<style>
  p {
    margin: calc(var(--spacing-unit) * 10) 0 calc(var(--spacing-unit) * 8);
    color: var(--color-text-secondary);
    text-align: right !important;
    font-family: var(--sans-serif) !important;
    font-size: 0.8em;
    line-height: 1.6 !important;
    letter-spacing: 0;
    text-indent: 0 !important;
  }
</style>
