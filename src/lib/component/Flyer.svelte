<script lang="ts">
  export let useCloudflareImages: boolean;
  export let src: string;
  export let alt: string;
  const options = [
    ['format', 'auto'],
    ['fit', 'scale-down'],
    ['height', '400']
  ];
  const optionsString = options.map(([key, value]) => `${key}=${value}`).join(',');
  // '/' 始まりの場合は除去
  $: cloudflareSrc = `https://blog.orch-canvas.tokyo/cdn-cgi/image/${optionsString}/${src.startsWith('/') ? src.slice(1) : src}`;
</script>

{#if useCloudflareImages}
  <img src={cloudflareSrc} {alt} />
{:else}
  <img {src} {alt} />
{/if}

<style>
  img {
    max-height: 400px;
  }
</style>
