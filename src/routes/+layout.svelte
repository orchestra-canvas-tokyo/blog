<script lang="ts">
  import { page } from '$app/state';
  import { resolve } from '$app/paths';
  import headerLarge from './header-large.svg';
  import logo from './orchestra-canvas-tokyo.svg';
  import instagram from './sns-instagram.svg';
  import facebook from './sns-facebook.svg';
  import x from './sns-x.svg';
  import youtube from './sns-youtube.svg';
  import BlogSearch from '$lib/component/BlogSearch.svelte';
  import CookieConcent from '$lib/component/CookieConcent.svelte';

  interface Props {
    children?: import('svelte').Snippet;
  }

  interface BrowseLink {
    label: string;
    view: 'latest' | 'concerts' | 'composers';
  }

  let { children }: Props = $props();

  const browseLinks: BrowseLink[] = [
    { label: 'LATEST', view: 'latest' },
    { label: 'CONCERTS', view: 'concerts' },
    { label: 'COMPOSERS', view: 'composers' }
  ];
  const rootPath = resolve('/');
  const activeView = $derived(
    page.url.pathname === rootPath ? (page.url.searchParams.get('view') ?? 'latest') : null
  );
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;600;700&display=swap"
    rel="stylesheet"
  />
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/yakuhanjp@4.1.1/dist/css/yakuhanmp_s.css"
  />
</svelte:head>

<a class="skip-link" href="#main-content">本文へ移動</a>

<header class="site-header">
  <div class="site-header__inner">
    <a href={rootPath} class="blog-brand" aria-label="Orchestra Canvas Tokyo Blog ホーム">
      <img src={headerLarge} alt="Orchestra Canvas Tokyo Blog" />
    </a>

    <nav class="browse-navigation" aria-label="ブログを閲覧">
      <ul>
        {#each browseLinks as item (item.view)}
          <li>
            <a
              href={resolve(`/?view=${item.view}` as `/?${string}`)}
              class:active={activeView === item.view}
              aria-current={activeView === item.view ? 'page' : undefined}
            >
              {item.label}
            </a>
          </li>
        {/each}
        <li>
          <a
            class="oct-site-link"
            href="https://www.orch-canvas.tokyo/"
            target="_blank"
            rel="noopener noreferrer"
          >
            OCT SITE <span aria-hidden="true">↗</span>
          </a>
        </li>
      </ul>
    </nav>

    <div class="header-search">
      <BlogSearch />
    </div>
  </div>
</header>

<div id="main-content" class="site-content" tabindex="-1">
  {@render children?.()}
</div>

<footer class="site-footer">
  <div class="site-footer__inner">
    <div class="site-footer__primary">
      <a class="footer-brand" href="https://www.orch-canvas.tokyo/">
        <span aria-hidden="true">&copy;</span>
        <img width="199" height="34" src={logo} alt="Orchestra Canvas Tokyo" />
      </a>

      <nav class="social-navigation" aria-label="ソーシャルメディア">
        <a href="https://www.instagram.com/orchestracanvastokyo/" aria-label="Instagram">
          <img width="24" height="24" src={instagram} alt="" />
        </a>
        <a href="https://www.facebook.com/OrchestraCanvasTokyo" aria-label="Facebook">
          <img width="24" height="24" src={facebook} alt="" />
        </a>
        <a href="https://x.com/Orch_canvas" aria-label="X">
          <img width="22" height="22" src={x} alt="" />
        </a>
        <a href="https://www.youtube.com/channel/UCX2SZ5NViwsaOza3biDNjIw" aria-label="YouTube">
          <img width="25" height="22" src={youtube} alt="" />
        </a>
      </nav>
    </div>

    <CookieConcent />
  </div>
</footer>

<style>
  :global(:root) {
    color-scheme: dark;
    --spacing-unit: 4px;
    --color-background: #0a0606;
    --color-surface: #171313;
    --color-surface-raised: #36312e;
    --color-text-primary: #ffffff;
    --color-text-secondary: #938b87;
    --color-border: #57504c;
    --color-inverse-background: #ffffff;
    --color-inverse-text: #0a0606;
    --sans-serif:
      'Yu Gothic Medium', 'Yu Gothic', YuGothic, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans',
      Meiryo, sans-serif;
    --display-font: Futura, Avenir, 'Century Gothic', 'Helvetica Neue', Arial, sans-serif;
    --serif: YakuHanMPs, 'Noto Serif JP', 'Hiragino Mincho ProN', 'Yu Mincho', YuMincho, serif;
    --content-max-width: 1280px;
    --reading-max-width: 720px;

    /* Compatibility for components being migrated to the shared surface tokens. */
    --color-background-secondary: var(--color-surface-raised);
  }

  :global(*),
  :global(*::before),
  :global(*::after) {
    box-sizing: border-box;
    letter-spacing: 0;
  }

  :global(html) {
    min-width: 320px;
    min-height: 100%;
    background: var(--color-background);
    scroll-behavior: smooth;
  }

  :global(body) {
    min-width: 320px;
    min-height: 100vh;
    margin: 0;
    overflow-wrap: anywhere;
    background: var(--color-background);
    color: var(--color-text-primary);
    font-family: var(--sans-serif);
    font-size: 16px;
    line-height: 1.7;
    line-break: strict;
    word-break: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  :global(a) {
    color: inherit;
    text-decoration-thickness: 1px;
    text-underline-offset: 0.2em;
  }

  :global(button),
  :global(input),
  :global(textarea),
  :global(select) {
    font: inherit;
  }

  :global(img) {
    max-width: 100%;
  }

  :global(:focus-visible) {
    outline: 2px solid var(--color-text-primary);
    outline-offset: 3px;
  }

  .skip-link {
    position: fixed;
    top: calc(var(--spacing-unit) * 3);
    left: calc(var(--spacing-unit) * 3);
    z-index: 100;
    min-height: 44px;
    padding: calc(var(--spacing-unit) * 2.5) calc(var(--spacing-unit) * 4);
    transform: translateY(calc(-100% - var(--spacing-unit) * 4));
    border: 1px solid var(--color-text-primary);
    background: var(--color-inverse-background);
    color: var(--color-inverse-text);
  }

  .skip-link:focus {
    transform: translateY(0);
  }

  .site-header {
    border-bottom: 1px solid var(--color-border);
  }

  .site-header__inner {
    display: grid;
    grid-template-columns: minmax(240px, 1fr) auto 44px;
    align-items: center;
    gap: calc(var(--spacing-unit) * 7);
    width: min(100%, var(--content-max-width));
    min-height: 96px;
    margin: 0 auto;
    padding: calc(var(--spacing-unit) * 5) calc(var(--spacing-unit) * 8);
  }

  .blog-brand {
    display: inline-flex;
    width: min(100%, 318px);
    border: 0;
  }

  .blog-brand img {
    display: block;
    width: 100%;
    height: auto;
    filter: grayscale(1) brightness(0) invert(1);
  }

  .browse-navigation ul {
    display: flex;
    align-items: center;
    gap: calc(var(--spacing-unit) * 6);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .browse-navigation a {
    position: relative;
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    border: 0;
    color: var(--color-text-secondary);
    font-family: var(--display-font);
    font-size: 0.75rem;
    line-height: 1;
    text-decoration: none;
    white-space: nowrap;
    transition: color 160ms ease;
  }

  .browse-navigation a::after {
    position: absolute;
    right: 0;
    bottom: 6px;
    left: 0;
    height: 1px;
    content: '';
    background: currentColor;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 160ms ease;
  }

  .browse-navigation a:hover,
  .browse-navigation a.active {
    color: var(--color-text-primary);
  }

  .browse-navigation a:hover::after,
  .browse-navigation a.active::after {
    transform: scaleX(1);
  }

  .oct-site-link span {
    margin-left: calc(var(--spacing-unit) * 1.5);
    font-size: 0.9em;
  }

  .header-search {
    display: flex;
    justify-content: flex-end;
  }

  .site-content {
    width: min(100%, var(--content-max-width));
    min-height: 50vh;
    margin: 0 auto;
    padding-right: calc(var(--spacing-unit) * 8);
    padding-left: calc(var(--spacing-unit) * 8);
  }

  .site-footer {
    margin-top: calc(var(--spacing-unit) * 24);
    border-top: 1px solid var(--color-border);
  }

  .site-footer__inner {
    display: flex;
    flex-direction: column;
    gap: calc(var(--spacing-unit) * 5);
    width: min(100%, var(--content-max-width));
    margin: 0 auto;
    padding: calc(var(--spacing-unit) * 8);
  }

  .site-footer__primary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: calc(var(--spacing-unit) * 8);
  }

  .footer-brand {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    gap: calc(var(--spacing-unit) * 3);
    color: var(--color-text-secondary);
    font-size: 0.75rem;
    text-decoration: none;
  }

  .footer-brand img {
    width: 185px;
    height: auto;
    filter: grayscale(1) brightness(0) invert(1);
  }

  .social-navigation {
    display: flex;
    align-items: center;
    gap: calc(var(--spacing-unit) * 2);
  }

  .social-navigation a {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 44px;
    height: 44px;
    color: var(--color-text-secondary);
    transition:
      color 160ms ease,
      background-color 160ms ease;
  }

  .social-navigation a:hover {
    background: var(--color-surface-raised);
    color: var(--color-text-primary);
  }

  .social-navigation img {
    max-width: 24px;
    max-height: 24px;
    filter: grayscale(1) brightness(0) invert(1);
  }

  @media (max-width: 900px) {
    .site-header__inner {
      grid-template-areas:
        'brand search'
        'navigation navigation';
      grid-template-columns: minmax(0, 1fr) 44px;
      gap: calc(var(--spacing-unit) * 2) calc(var(--spacing-unit) * 4);
      padding-top: calc(var(--spacing-unit) * 4);
      padding-bottom: calc(var(--spacing-unit) * 3);
    }

    .blog-brand {
      grid-area: brand;
      width: min(100%, 280px);
    }

    .browse-navigation {
      grid-area: navigation;
    }

    .header-search {
      grid-area: search;
    }

    .browse-navigation ul {
      justify-content: space-between;
      gap: calc(var(--spacing-unit) * 3);
    }
  }

  @media (max-width: 576px) {
    .site-header__inner,
    .site-content,
    .site-footer__inner {
      padding-right: calc(var(--spacing-unit) * 4);
      padding-left: calc(var(--spacing-unit) * 4);
    }

    .site-header__inner {
      min-height: 0;
    }

    .blog-brand {
      width: min(100%, 224px);
    }

    .browse-navigation ul {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0 calc(var(--spacing-unit) * 3);
    }

    .browse-navigation li {
      min-width: 0;
    }

    .browse-navigation a {
      width: 100%;
    }

    .site-footer {
      margin-top: calc(var(--spacing-unit) * 16);
    }

    .site-footer__primary {
      align-items: flex-start;
      flex-direction: column;
      gap: calc(var(--spacing-unit) * 3);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :global(html:focus-within) {
      scroll-behavior: auto;
    }

    :global(*),
    :global(*::before),
    :global(*::after) {
      scroll-behavior: auto !important;
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
</style>
