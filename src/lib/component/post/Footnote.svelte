<section>
  <slot></slot>
</section>

<!--
@component
脚注、備考などを描画するコンポーネント

@example
```svlete
<Footnote>※エイプリルフール企画</Footnote>
```
-->

<style>
  section {
    margin-top: calc(var(--spacing-unit) * 12);
    margin-bottom: calc(var(--spacing-unit) * 12);
    font-size: 0.85em;
    text-indent: 0;
  }
  section :global(blockquote) {
    margin: calc(var(--spacing-unit) * 6) 1em !important;
  }
</style>
