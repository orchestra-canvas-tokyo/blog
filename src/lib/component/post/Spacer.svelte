<!--
@component
スペーサー
- 12`--spacing-unit`のマージンをもつ

@example
```svelte
<p>ここでひと段落</p>
<Spacer />
<p>次の日</p>
```
-->

<div></div>

<style>
  div {
    margin: calc(var(--spacing-unit) * 12) 0;
  }
</style>
