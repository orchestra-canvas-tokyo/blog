<script lang="ts">
  import TagList from '$lib/component/TagList.svelte';
  import { getFullTitle, getUrl } from '$lib/posts';
  import { composers } from '$lib/posts/composers';
  import { concerts } from '$lib/posts/concerts';
  import { formatDate2JpStyle } from '$lib/util';
  import type { PageData } from './$types';
  import type { Composer } from '$lib/posts/composers';
  import Meta from '$lib/component/Meta.svelte';
  // import regular15Flyer from './regular-15.png';
  import Flyer from '$lib/component/Flyer.svelte';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
  let metadata = $derived(data.post.metadata);
  let composer = $derived(metadata.composerSlug ? composers[metadata.composerSlug] : null);
  let arranger = $derived(metadata.arrangerSlug ? composers[metadata.arrangerSlug] : null);
  let concert = $derived(concerts[metadata.concertSlug]);

  const hasYearOfDeath = (composer: Composer): composer is Composer & { yearOfDeath: number } => {
    return Object.keys(composer).includes('yearOfDeath');
  };
</script>

<Meta title={getFullTitle(data.post)} canonical={`/post/${data.slug}`} />

<div class="meta meta-container for-small-screen">
  <div></div>
  <div class="date">{formatDate2JpStyle(metadata.publicatedAt)}</div>
</div>

<div class="meta meta-container">
  <TagList tags={metadata.tags} />
  <div class="date for-large-screen">{formatDate2JpStyle(metadata.publicatedAt)}</div>
</div>

<h2>
  {metadata.title}
</h2>

{#if arranger && composer}
  <p class="composer">
    {composer.fullName} ({arranger.fullName} 編)
  </p>
{:else if composer}
  <p class="composer">
    {composer.fullName} ({composer.yearOfBirth}&ndash;{#if hasYearOfDeath(composer)}{composer.yearOfDeath}{/if})
  </p>
{/if}

<main>
  <data.post.default />

  {#if metadata.youTubeVideoId}
    <div class="video">
      <iframe
        width="560"
        height="315"
        style="max-width: 100%;"
        src={`https://www.youtube-nocookie.com/embed/${metadata.youTubeVideoId}`}
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
  {/if}
</main>

<div class="fullwidth-gray-background">
  <section class="upcoming-concerts">
    <h3>次回演奏会のご案内</h3>

    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      class="megaphone"
      viewBox="0 0 16 16"
    >
      <path
        d="M13 2.5a1.5 1.5 0 0 1 3 0v11a1.5 1.5 0 0 1-3 0zm-1 .724c-2.067.95-4.539 1.481-7 1.656v6.237a25 25 0 0 1 1.088.085c2.053.204 4.038.668 5.912 1.56zm-8 7.841V4.934c-.68.027-1.399.043-2.008.053A2.02 2.02 0 0 0 0 7v2c0 1.106.896 1.996 1.994 2.009l.496.008a64 64 0 0 1 1.51.048m1.39 1.081q.428.032.85.078l.253 1.69a1 1 0 0 1-.983 1.187h-.548a1 1 0 0 1-.916-.599l-1.314-2.48a66 66 0 0 1 1.692.064q.491.026.966.06"
      />
    </svg>

    <p>
      Orchestra Canvas Tokyo<br />第15回定期演奏会
    </p>
    <p>
      2025年11月24日(月祝)<br />
      ミューザ川崎シンフォニーホール
    </p>
    <p>
      指揮：石﨑真弥奈<br />
      ヴァイオリン：北川千紗
    </p>

    <hr />

    <p>
      チャイコフスキー<br />
      ヴァイオリン協奏曲 ニ長調 作品35
    </p>
    <p>
      ストラヴィンスキー<br />
      バレエ音楽『火の鳥』組曲（1945年版） ほか
    </p>

    <hr />

    <p>
      詳細は<a href="https://www.orch-canvas.tokyo/concerts/regular-15">当団ホームページ</a>にて
    </p>

    <!-- <a href="https://www.orch-canvas.tokyo/concerts/regular-15">
      <Flyer src={regular15Flyer} alt="第15回定期演奏会のフライヤー" />
    </a> -->
  </section>
</div>

<div class="adjacent-posts">
  {#if data.adjacentPostListItems.prev !== null}
    <a href={getUrl(data.adjacentPostListItems.prev.slug)} class="prev">
      前の投稿<br />
      {getFullTitle(data.adjacentPostListItems.prev)}
    </a>
  {/if}
  {#if data.adjacentPostListItems.next !== null}
    <a href={getUrl(data.adjacentPostListItems.next.slug)} class="next">
      次の投稿<br />
      {getFullTitle(data.adjacentPostListItems.next)}
    </a>
  {/if}
</div>

<div class="concert">
  <a href={concert.url}>
    <p>{concert.title}演奏会<br />{formatDate2JpStyle(concert.date)}</p>
    <Flyer src={concert.flyer} alt={`${concert.title}のフライヤー`} />
  </a>
</div>

<style>
  @media (max-width: 576px) {
    .for-large-screen {
      display: none !important;
    }
  }
  @media (min-width: 577px) {
    .for-small-screen {
      display: none !important;
    }
  }

  .meta {
    font-size: 0.85em;
    font-family: var(--sans-serif);
    color: var(--color-text-secondary);
  }
  .meta-container {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    width: 100%;
  }

  h2 {
    margin: 0;
    font-family: var(--serif);
    font-size: 2.2rem;
  }
  @media (max-width: 576px) {
    h2 {
      font-size: 2rem;
    }
  }

  .composer {
    margin-top: 0;
    margin-bottom: calc(var(--spacing-unit) * 8);
    text-align: right;
    font-family: var(--serif);
  }

  .video {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: calc(var(--spacing-unit) * 20);
  }

  .adjacent-posts {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: calc(var(--spacing-unit) * 8);
    margin-top: calc(var(--spacing-unit) * 20);
    font-family: var(--serif);
  }
  .prev {
    margin-left: 2em;
  }
  .next {
    margin-right: 2em;
    margin-left: auto;
    text-align: right;
  }
  .prev,
  .next {
    position: relative;
    display: inline-block;
  }
  .prev::before,
  .next::after {
    content: '';
    width: 1em;
    height: 1em;
    margin-top: -0.5em;
    border-top: solid 1px currentColor;
    border-right: solid 1px currentColor;
    position: absolute;
    top: 50%;
  }
  .prev::before {
    transform: rotate(225deg);
    left: -1.5em;
  }
  .next::after {
    transform: rotate(45deg);
    right: -1.5em;
  }

  .concert {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: calc(var(--spacing-unit) * 20) 0;
    text-align: center;
    font-family: var(--serif);
  }
  .concert a {
    padding: calc(var(--spacing-unit) * 4);
    transition: background-color 0.3s;
  }
  .concert a:hover {
    background-color: var(--color-background-secondary);
    text-decoration: none;
  }
  .concert p {
    text-indent: 0;
    margin: 0;
    margin-bottom: calc(var(--spacing-unit) * 4);
  }

  main {
    margin: calc(var(--spacing-unit) * 12) 0;
  }

  /* 本文に対するスタイル */
  main {
    :global(*) {
      font-family: var(--serif);
      letter-spacing: 0.04em;
    }

    :global(h3) {
      margin-top: calc(var(--spacing-unit) * 12);
      font-size: 1.5em;
    }
    :global(h4) {
      margin-top: calc(var(--spacing-unit) * 8);
      margin-bottom: 0;
      font-size: 1.1em;
    }

    :global(p) {
      text-indent: 1rem;
      text-align: justify;
      line-height: 1.75;
    }

    :global(blockquote) {
      margin-top: calc(var(--spacing-unit) * 12);
      margin-bottom: calc(var(--spacing-unit) * 12);
      font-style: italic;
      text-indent: 1em;
    }
    :global(blockquote h4) {
      text-indent: 0;
    }

    @media (max-width: 576px) {
      :global(blockquote) {
        margin-right: 1em;
        margin-left: 1em;
      }
    }

    :global(li:not(li:last-child)) {
      margin-bottom: calc(var(--spacing-unit) * 2);
    }

    /* 引用元が示されている引用に対するスタイル
		figure	-> blockquote
				-> figcaption */
    :global(figure:has(blockquote)) {
      margin: calc(var(--spacing-unit) * 12) 1em;
    }
    :global(figure blockquote) {
      margin: initial;
    }
    :global(figure:has(blockquote) > figcaption) {
      text-align: right;
      font-size: 0.85em;
    }
  }

  /* 次回演奏会に対するスタイル */
  .fullwidth-gray-background {
    display: flex;
    justify-content: center;
    margin: calc(var(--spacing-unit) * 20) calc(-1 * var(--spacing-unit) * 8) 0;
    padding: calc(var(--spacing-unit) * 6) 0;
    background-color: var(--color-background-secondary);

    @media (max-width: 576px) {
      margin: calc(var(--spacing-unit) * 20) calc(-1 * var(--spacing-unit) * 6) 0;
    }
  }

  .upcoming-concerts {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: calc(var(--spacing-unit) * 2);

    position: relative;

    border-radius: 10px;
    padding: calc(var(--spacing-unit) * 6) calc(var(--spacing-unit) * 12);
    width: min(300px, 50dvw);

    overflow: hidden;

    background-color: #fff;
    font-size: 90%;
    text-align: center;

    > * {
      margin: 0;
      z-index: 2;
    }

    .megaphone {
      position: absolute;
      top: 60px;
      right: 65px;
      z-index: 1;

      transform: rotate(-30deg) scale(5.9);
      fill: var(--color-background-secondary);
    }

    > h3,
    > :global(picture) {
      margin: calc(var(--spacing-unit) * 2) 0;
    }

    a {
      text-decoration: underline;
    }
  }
</style>
