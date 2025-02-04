<script lang="ts">
  import headerSmall from './header-small.svg';
  import headerLarge from './header-large.svg';
  import logo from './orchestra-canvas-tokyo.svg';
  import instagram from './sns-instagram.svg';
  import facebook from './sns-facebook.svg';
  import x from './sns-x.svg';
  import youtube from './sns-youtube.svg';
  import { onMount } from 'svelte';
  import CookieConcent from '$lib/component/CookieConcent.svelte';
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();

  /**
   * 頻繁に呼び出されうる関数を、300msごとの実行に制限する
   * @param func 呼び出される関数
   */
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  function debounce(func: Function) {
    let timer: NodeJS.Timeout;
    const timeout = 300; // funcが呼び出されるまでの遅延時間
    return function (this: Window) {
      const args = arguments;
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  }

  onMount(() => {
    // viewportが375px未満のとき、全体を縮小して表示する
    const adjustViewport = () => {
      const triggerWidth = 375;
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport === null) return;
      const value =
        window.outerWidth < triggerWidth
          ? `width=${triggerWidth}`
          : 'width=device-width, initial-scale=1';
      viewport.setAttribute('content', value);
    };
    const debouncedFunction = debounce(adjustViewport);
    window.addEventListener('resize', debouncedFunction, false);
  });
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" />
  <link
    href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400&family=Noto+Serif+JP:wght@700&display=swap"
    rel="stylesheet"
  />

  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/yakuhanjp@4.1.1/dist/css/yakuhanmp_s.css"
  />
</svelte:head>

<header>
  <!-- header -->
  <a href="/" id="page_top">
    <h1>
      <div class="logo-container">
        <picture>
          <source srcset={headerSmall} media="(max-width: 576px)" />
          <img class="logo-image" src={headerLarge} alt="Orchestra Canvas Tokyo Blog" />
        </picture>
      </div>
    </h1>
  </a>
</header>

{@render children?.()}

<footer>
  <div class="inline-logo-container">
    <a href="https://www.orch-canvas.tokyo/">
      &copy; <img
        class="inline-logo"
        width="199"
        height="33.59"
        src={logo}
        alt="Orchestra Canvas Tokyo"
      />
    </a>
  </div>
  <div class="sns-icon-container">
    <a href="https://www.instagram.com/orchestracanvastokyo/">
      <img class="sns-icon" width="25.59" height="29.25" src={instagram} alt="Instagram" />
    </a>
    <a href="https://www.facebook.com/OrchestraCanvasTokyo">
      <img class="sns-icon" width="25.59" height="29.59" src={facebook} alt="Facebook" />
    </a>
    <a href="https://x.com/Orch_canvas">
      <img class="sns-icon" width="25.59" height="23" src={x} alt="X" />
    </a>
    <a href="https://www.youtube.com/channel/UCX2SZ5NViwsaOza3biDNjIw">
      <img class="sns-icon" width="25.59" height="22.75" src={youtube} alt="YouTube" />
    </a>
  </div>

  <CookieConcent />
</footer>

<style>
  :global(:root) {
    --spacing-unit: 4px;
    --color-background: #fff;
    --color-background-secondary: #eee;
    --color-text-primary: #000;
    --color-text-secondary: #5a5a5a;
    --sans-serif: sans-serif;
    --serif: YakuHanMPs, 'Noto Serif JP', 'Hiragino Mincho ProN', 'Yu Mincho', YuMincho, serif;
  }

  :global(html) {
    background-color: var(--color-background-secondary);
  }

  :global(body) {
    margin: 0 auto;
    max-width: 1000px;
    padding: calc(var(--spacing-unit) * 8);
    font-family: var(--sans-serif);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    background-color: var(--color-background);
    color: var(--color-text-primary);
    line-height: 1.51;
    font-size: 18px;

    overflow-wrap: anywhere; /* 収まらない場合に折りかえす */
    word-break: normal; /* 単語の分割はデフォルトに依存 */
    line-break: strict; /* 禁則処理を厳格に適用 */
  }

  @media (max-width: 567px) {
    :global(body) {
      padding: calc(var(--spacing-unit) * 6);
      font-size: 16px;
    }
  }

  :global(a, a:visited, a:active) {
    color: inherit;
    text-decoration: none;
  }

  :global(a:hover) {
    text-decoration: underline;
  }

  @media (max-width: 567px) {
    :global(ul),
    :global(ol) {
      padding-inline-start: calc(var(--spacing-unit) * 5);
    }
  }

  header {
    /* header.margin-bottom = body.padding-top + h1.margin-top */
    margin-bottom: calc(var(--spacing-unit) * 12 + 0.67em);
  }

  .logo-container > picture {
    aspect-ratio: 459.8 / 90;
  }
  .logo-image {
    margin-bottom: -12.36px;
    margin-left: 13px;
    height: 90px;
  }
  @media (max-width: 576px) {
    header {
      /* header.margin-bottom = body.padding-top */
      margin-bottom: calc(var(--spacing-unit) * 8);
    }
    .logo-container {
      display: grid;
      place-items: center;
    }
    .logo-container > picture {
      aspect-ratio: 200 / 119.2;
    }
    .logo-image {
      margin-bottom: -12.37px;
      margin-left: 0;
      width: 200px;
      height: unset;
    }
  }

  footer {
    margin-top: calc(var(--spacing-unit) * 16);
    margin-bottom: calc(var(--spacing-unit) * 8);
    font-size: 14px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: calc(var(--spacing-unit) * 4);
  }
  .inline-logo-container {
    display: flex;
    align-items: center;
  }
  .inline-logo-container a {
    display: flex;
    align-items: center;
    gap: 0.5em;
  }
  .inline-logo-container a:hover {
    text-decoration: none;
  }
  .sns-icon-container {
    display: flex;
    align-items: center;
    gap: calc(var(--spacing-unit) * 8);
  }
  .sns-icon {
    margin-bottom: -5.13px;
    width: 1.6rem;
  }

  @media (max-width: 300px) {
    .inline-logo {
      margin-left: 0;
    }
  }
</style>
