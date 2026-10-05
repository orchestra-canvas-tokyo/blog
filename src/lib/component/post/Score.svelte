<script lang="ts">
  interface Props {
    /** 事前生成した譜例 SVG の URL */
    src: string;
    /** 原稿のキャプション。画像の代替テキストにも使用する。 */
    caption: string;
  }

  let { src, caption }: Props = $props();
</script>

<!-- @component 譜例を表示する。狭い画面では横スクロールし、リンクから原寸で開ける。 -->
<figure>
  <!-- The region must be focusable so keyboard users can scroll the score. -->
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <div class="score-scroll" tabindex="0" role="region" aria-label={caption}>
    <!-- SVG URLs are emitted by Vite and are not SvelteKit route paths. -->
    <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
    <a href={src} target="_blank" rel="noopener" aria-label={`${caption}を拡大表示`}>
      <img {src} alt={caption} loading="lazy" decoding="async" />
    </a>
  </div>
  <figcaption>{caption}</figcaption>
</figure>

<style>
  figure {
    margin: calc(var(--spacing-unit) * 12) 0;
  }
  .score-scroll {
    overflow-x: auto;
    background: white;
    padding: 0.5rem;
  }
  a {
    display: block;
    width: max-content;
    min-width: 100%;
  }
  img {
    display: block;
    width: auto;
    height: 160px;
    max-width: none;
    margin-inline: auto;
  }
  figcaption {
    margin-top: calc(var(--spacing-unit) * 2);
    font-size: 0.85em;
    text-align: center;
  }
</style>
