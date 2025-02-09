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

<a href={url}>{url}</a>
