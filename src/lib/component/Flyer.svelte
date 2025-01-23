<script lang="ts">
  export let useCloudflareImages: boolean;
  export let src: string;
  export let alt: string;

  let className: string = '';
  export { className as class };

  const options = [
    ['format', 'auto'],
    ['fit', 'scale-down'],
    ['height', '400']
  ];
  const optionsString = options.map(([key, value]) => `${key}=${value}`).join(',');

  $: cloudflareSrc = `https://blog.orch-canvas.tokyo/cdn-cgi/image/${optionsString}/${src}`;
</script>

{#if useCloudflareImages}
  <img src={cloudflareSrc} {alt} class={className} />
{:else}
  <img {src} {alt} class={className} />
{/if}
