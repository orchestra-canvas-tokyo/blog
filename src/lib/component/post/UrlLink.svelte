<script lang="ts">
  interface Props {
    /** リンク先URL */
    url: string;
  }

  let { url }: Props = $props();
</script>

<!--
@component
リンク先URLがそのまま描画文字列のリンク

@example
```svelte
<UrlLink url="https://example.com" />
```
-->

<a href={url} rel="external">{url}</a>

<style>
  a {
    overflow-wrap: anywhere;
    text-decoration-thickness: 1px;
    text-underline-offset: 0.2em;
  }
</style>
