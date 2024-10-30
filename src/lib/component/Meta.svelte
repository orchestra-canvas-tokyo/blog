<script lang="ts">
  import { MetaTags } from 'svelte-meta-tags';

  /** ページのタイトル。ルートは空文字列を指定 */
  export let title: string;
  /** 正規URL。絶対URLを指定 */
  export let canonical: string;

  $: fullTitle =
    title !== '' ? `${title} - Orchestra Canvas Tokyo Blog` : 'Orchestra Canvas Tokyo Blog';
  $: fullCanonical = `https://blog.orch-canvas.tokyo${canonical}`;
</script>

<MetaTags
  title={fullTitle}
  canonical={fullCanonical}
  twitter={{
    site: '@Orch_canvas',
    cardType: 'summary',
    title: fullTitle,
    image: 'https://blog.orch-canvas.tokyo/favicon.png',
    imageAlt: 'Orchestra Canvas Tokyoのロゴ'
  }}
/>
