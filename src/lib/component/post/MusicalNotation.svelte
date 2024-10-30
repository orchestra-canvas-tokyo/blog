<script lang="ts">
  /** 描画する音楽記号 */
  export let content: 'fortissimo' | 'fortissississimo' | 'pianissimo';
</script>

<!--
@component
音楽記号を描画するコンポーネント
Noto Musicフォントを使用。

@example
```svelte
<MusicNotation content="fortissiomo" />
```
-->

<span>
  {#if content === 'fortissimo'}
    𝆑𝆑
  {:else if content === 'fortissississimo'}
    𝆑𝆑𝆑𝆑
  {:else if content === 'pianissimo'}
    𝆏𝆏
  {/if}
</span>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Music&family=Noto+Sans+JP&display=swap');

  span {
    display: inline-block;
    margin: 0 5px;
    transform: translateY(8px);
    font-family: 'Noto Music', sans-serif;
    font-size: 1.6em;
    line-height: 0;
    text-indent: 0;
  }
</style>
