<script lang="ts">
  /** リンク先URL */
  export let url: string;
</script>

<!--
@component
リンク先URLがそのまま描画文字列のリンク

@example
```svelte
<UrlLink url="https://example.com" />
```
-->

<a href={url}>{url}</a>
