<script lang="ts">
  interface Props {
    /** 事前生成した譜例 SVG の URL */
    src: string;
    /** モバイル用に改行して生成した SVG */
    mobileSrc?: string;
    /** 原稿のキャプション。画像の代替テキストにも使用する。 */
    caption: string;
  }

  let { src, mobileSrc, caption }: Props = $props();
</script>

<!-- @component 譜例を表示する。画面幅に合わせて譜面を表示し、リンクから原寸で開ける。 -->
<figure>
  <!-- SVG URLs are emitted by Vite and are not SvelteKit route paths. -->
  <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
  <a href={src} target="_blank" rel="noopener" aria-label={`${caption}を拡大表示`}>
    <picture>
      {#if mobileSrc}
        <source media="(max-width: 600px)" srcset={mobileSrc} />
      {/if}
      <img {src} alt={caption} loading="lazy" decoding="async" />
    </picture>
  </a>
  <figcaption>{caption}</figcaption>
</figure>

<style>
  figure {
    margin: calc(var(--spacing-unit) * 12) 0;
  }
  a {
    display: block;
    background: white;
    padding: 0.5rem;
  }
  img {
    display: block;
    width: 100%;
    height: auto;
    margin-inline: auto;
  }
  figcaption {
    margin-top: calc(var(--spacing-unit) * 2);
    font-size: 0.85em;
    text-align: center;
  }
</style>
