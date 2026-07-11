<script lang="ts">
  interface Props {
    /** 表示する画像 */
    src: string;
    /** 画像の代替テキスト。装飾・譜例画像では空文字列のまま利用できる。 */
    alt?: string;
    /** キャプション */
    caption?: string | string[];
    /** 全体の最大高さ(px単位、オプション) */
    maxHeightPx?: number | undefined;
  }

  let { src, alt = '', caption = undefined, maxHeightPx = undefined }: Props = $props();

  const maxHeightStyle = $derived(
    maxHeightPx !== undefined ? `--max-height-px: ${maxHeightPx}px;` : ''
  );
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
  <img {src} {alt} class="image" loading="lazy" decoding="async" />
  {#if caption}
    <figcaption>
      {#if typeof caption === 'string'}
        {caption}
      {:else}
        {#each caption as row, index (index)}
          {row}<br />
        {/each}
      {/if}
    </figcaption>
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
    color: var(--color-text-secondary);
    font-family: var(--sans-serif) !important;
    font-size: 0.85em;
    line-height: 1.6;
    letter-spacing: 0;
    text-align: center;
  }
</style>
