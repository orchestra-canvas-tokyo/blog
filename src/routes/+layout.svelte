<script lang="ts">
  import { resolve } from '$app/paths';
  import headerSmall from './header-small.svg';
  import headerLarge from './header-large.svg';
  import logo from './orchestra-canvas-tokyo.svg';
  import instagram from './sns-instagram.svg';
  import facebook from './sns-facebook.svg';
  import x from './sns-x.svg';
  import youtube from './sns-youtube.svg';
  import '$lib/styles/design-system.css';
  import BlogSearch from '$lib/component/BlogSearch.svelte';
  import CookieConcent from '$lib/component/CookieConcent.svelte';
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
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

<a class="skip-link" href="#main-content">本文へスキップ</a>
<header id="page_top">
  <a href={resolve('/')} class="brand" aria-label="Orchestra Canvas Tokyo Blog ホーム">
    <picture>
      <source srcset={headerSmall} media="(max-width: 576px)" />
      <img src={headerLarge} alt="Orchestra Canvas Tokyo Blog" width="460" height="90" />
    </picture>
  </a>
  <nav aria-label="メインナビゲーション">
    <a href={resolve('/')}>記事一覧</a>
    <a href="https://www.orch-canvas.tokyo/">公式サイト <span aria-hidden="true">↗</span></a>
    <BlogSearch />
  </nav>
</header>

<main id="main-content" tabindex="-1">
  {@render children?.()}
</main>

<footer>
  <a class="back-to-top" href="#page_top">ページの先頭へ ↑</a>
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
  header {
    padding-block: 28px 24px;
    border-bottom: 1px solid var(--color-border-strong);
    margin-bottom: var(--space-section);
  }
  .brand {
    width: 460px;
    display: inline-block;
    max-width: 100%;
  }
  .brand img {
    display: block;
    width: min(460px, 100%);
    height: auto;
  }
  nav {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 24px;
    margin-top: 24px;
    font-size: 14px;
  }
  nav > a {
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  footer {
    border-top: 1px solid var(--color-border-strong);
    margin-top: var(--space-section);
    padding-block: 24px 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    font-size: 14px;
  }
  .back-to-top {
    align-self: flex-end;
  }
  .inline-logo-container a {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .sns-icon-container {
    display: flex;
    align-items: center;
    gap: 24px;
  }
  .sns-icon-container a {
    display: grid;
    place-items: center;
    min-width: 44px;
    min-height: 44px;
  }
  .sns-icon {
    width: 24px;
    height: 28px;
    object-fit: contain;
  }
  @media (max-width: 576px) {
    header {
      padding-top: 24px;
    }
    .brand {
      display: block;
      width: 200px;
      margin-inline: auto;
    }
    .brand img {
      width: 200px;
      height: auto;
      aspect-ratio: 200 / 119.2;
    }
    nav {
      justify-content: space-between;
      gap: 12px;
    }
  }
</style>
