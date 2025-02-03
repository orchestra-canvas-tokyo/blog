<script lang="ts">
  import { MetaTags } from 'svelte-meta-tags';

  interface Props {
    /** ページのタイトル。ルートは空文字列を指定 */
    title: string;
    /** 正規URL。相対URLを指定。e.g. '/tag/example' */
    canonical: string;
  }

  let { title, canonical }: Props = $props();

  let fullTitle = $derived(
    title !== '' ? `${title} - Orchestra Canvas Tokyo Blog` : 'Orchestra Canvas Tokyo Blog'
  );
  let fullCanonical = $derived(`https://blog.orch-canvas.tokyo${canonical}`);
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
