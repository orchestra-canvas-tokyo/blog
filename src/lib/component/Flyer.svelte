<script lang="ts">
  import { onMount } from 'svelte';

  interface Props {
    src: string;
    alt: string;
  }

  let { src, alt }: Props = $props();
  const commonOptions = [
    ['format', 'auto'],
    ['fit', 'scale-down']
  ] satisfies [string, string][];

  let useCloudflareImages = $state(false);

  onMount(() => {
    useCloudflareImages = new URL(window.location.href).hostname === 'blog.orch-canvas.tokyo';
  });

  function getCloudflareSrc(src: string, options: [string, string][]): string {
    const optionsString = options.map(([key, value]) => `${key}=${value}`).join(',');

    // '/' 始まりの場合は除去
    return `https://blog.orch-canvas.tokyo/cdn-cgi/image/${optionsString}/${src.startsWith('/') ? src.slice(1) : src}`;
  }
</script>

{#if useCloudflareImages === true}
  <img
    src={getCloudflareSrc(src, [...commonOptions, ['height', '400']])}
    srcset={`${getCloudflareSrc(src, [...commonOptions, ['height', '800']])} 2x`}
    {alt}
  />
{:else if useCloudflareImages === false}
  <img {src} {alt} />
{/if}

<style>
  img {
    max-height: 400px;
    width: 100%;
  }
</style>
