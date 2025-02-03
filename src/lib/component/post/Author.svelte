<script lang="ts">
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>

<p>
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
    margin-bottom: calc(var(--spacing-unit) * 8);
    text-align: right !important;
    font-size: 0.85em;
  }
</style>
