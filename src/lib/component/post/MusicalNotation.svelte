<script lang="ts">
  interface Props {
    /** 描画する音楽記号 */
    content: 'fortissimo' | 'fortississimo' | 'fortissississimo' | 'pianissimo';
  }

  let { content }: Props = $props();
</script>

<!--
@component
音楽記号を描画するコンポーネント
Noto Musicフォントを使用。

@example
```svelte
<MusicNotation content="fortissimo" />
```
-->

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link href="https://fonts.googleapis.com/css2?family=Noto+Music&display=swap" rel="stylesheet" />
</svelte:head>

<span>
  {#if content === 'fortissimo'}
    𝆑𝆑
  {:else if content === 'fortississimo'}
    𝆑𝆑𝆑
  {:else if content === 'fortissississimo'}
    𝆑𝆑𝆑𝆑
  {:else if content === 'pianissimo'}
    𝆏𝆏
  {/if}
</span>

<style>
  span {
    display: inline-block;
    margin: 0 5px;
    transform: translateY(8px);

    font-family: 'Noto Music', serif !important;
    font-weight: 400;
    font-style: normal;

    font-size: 1.6em;
    line-height: 0;
    text-indent: 0;
  }
</style>
