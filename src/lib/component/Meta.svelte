<script lang="ts">
  import { page } from '$app/state';
  import { MetaTags } from 'svelte-meta-tags';

  interface Props {
    /** ページのタイトル。ルートは空文字列を指定 */
    title: string;
    /** 正規URL。相対URLを指定。e.g. '/tag/example' */
    canonical: string;
    description?: string;
    image?: string;
    imageAlt?: string;
    type?: 'website' | 'article';
  }

  let {
    title,
    canonical,
    image = '/ogp/default.png',
    imageAlt = 'Orchestra Canvas Tokyo Blog — 音楽を、もっと深く。',
    type = 'website',
    description = 'Orchestra Canvas Tokyoの公式ブログ。演奏会の曲目解説・プログラムノートを、作曲家や演奏会から探せます。'
  }: Props = $props();

  let fullTitle = $derived(
    title !== '' ? `${title} - Orchestra Canvas Tokyo Blog` : 'Orchestra Canvas Tokyo Blog'
  );
  // Preview cards must resolve on the preview deployment before the PR is merged.
  let imageUrl = $derived(new URL(image, page.url.origin).href);
  let fullCanonical = $derived(`https://blog.orch-canvas.tokyo${canonical}`);
</script>

<MetaTags
  title={fullTitle}
  {description}
  openGraph={{
    type,
    images: [{ url: imageUrl, width: 1200, height: 630, type: 'image/png', alt: imageAlt }],
    title: fullTitle,
    description,
    url: fullCanonical,
    locale: 'ja_JP',
    siteName: 'Orchestra Canvas Tokyo Blog'
  }}
  canonical={fullCanonical}
  twitter={{
    site: '@Orch_canvas',
    cardType: 'summary_large_image',
    title: fullTitle,
    description,
    image: imageUrl,
    imageAlt
  }}
/>
