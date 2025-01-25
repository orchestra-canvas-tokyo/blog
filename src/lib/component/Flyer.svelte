<script lang="ts">
  export let src: string;
  export let alt: string;
  const commonOptions = [
    ['format', 'auto'],
    ['fit', 'scale-down']
  ] satisfies [string, string][];

  const useCloudflareImages = new URL(window.location.href).hostname === 'blog.orch-canvas.tokyo';

  function getCloudflareSrc(src: string, options: [string, string][]): string {
    const optionsString = options.map(([key, value]) => `${key}=${value}`).join(',');

    // '/' 始まりの場合は除去
    return `https://blog.orch-canvas.tokyo/cdn-cgi/image/${optionsString}/${src.startsWith('/') ? src.slice(1) : src}`;
  }
</script>

{#if useCloudflareImages}
  <img
    src={getCloudflareSrc(src, [...commonOptions, ['height', '400']])}
    srcset={`${getCloudflareSrc(src, [...commonOptions, ['height', '800']])} 2x`}
    {alt}
  />
{:else}
  <img {src} {alt} />
{/if}

<style>
  img {
    max-height: 400px;
  }
</style>
