<p>
  （<slot />）
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
    text-align: right;
  }
</style>
