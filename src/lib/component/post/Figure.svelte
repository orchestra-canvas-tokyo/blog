<script lang="ts">
  interface Props {
    /** 表示する画像 */
    src: string;
    /** キャプション */
    caption?: string | undefined;
    /** 画像の最大高さ(px単位、オプション) */
    maxHeightPx?: number | undefined;
  }

  let { src, caption = undefined, maxHeightPx = undefined }: Props = $props();

  let maxHeightStyle = maxHeightPx !== undefined ? `--max-height-px: ${maxHeightPx}px;` : '';
</script>

<!--
@component
画像を描画するコンポーネント
キャプションや最大高さを指定できる。

@example
```svelte
<Figure src={image} caption="ほげほげ" maxHeightPx={200}>
<Figure src={simpleImage}>
```
-->

<figure style={maxHeightStyle}>
  <img {src} alt="" class="image" />
  {#if caption}
    <figcaption>{caption}</figcaption>
  {/if}
</figure>

<style>
  figure {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: calc(var(--spacing-unit) * 2);
    margin: calc(var(--spacing-unit) * 12) 0;
  }
  .image {
    height: auto;
    max-height: var(--max-height-px);
    width: auto;
    max-width: 100%;
  }
  figcaption {
    font-size: 0.85em;
    text-align: center;
  }
</style>
