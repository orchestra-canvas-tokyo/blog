<script lang="ts">
  import { formatDate2JpStyle } from '$lib/util';
  import Flyer from '../Flyer.svelte';

  interface Props {
    concert: {
      title: string;
      date: string;
      url: string;
      flyer: string;
    };
  }

  let { concert }: Props = $props();
</script>

<aside class="upcoming-concert" aria-labelledby="upcoming-concert-title">
  <div class="concert-details">
    <p class="section-label">NEXT CONCERT</p>
    <h2 id="upcoming-concert-title">{concert.title}演奏会</h2>
    <time datetime={concert.date}>{formatDate2JpStyle(concert.date)}</time>
    <a href={concert.url} rel="external">
      演奏会情報
      <span aria-hidden="true">&#8599;</span>
    </a>
  </div>

  <a
    class="flyer-link"
    href={concert.url}
    rel="external"
    aria-label={`${concert.title}演奏会の情報`}
  >
    <Flyer src={concert.flyer} alt={`${concert.title}演奏会のフライヤー`} />
  </a>
</aside>

<style>
  .upcoming-concert {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(110px, 180px);
    gap: calc(var(--spacing-unit) * 10);
    align-items: center;
    margin-top: clamp(72px, 11vw, 136px);
    border-top: 1px solid var(--color-border);
    border-bottom: 1px solid var(--color-border);
    padding: calc(var(--spacing-unit) * 10) 0;
  }

  .concert-details {
    min-width: 0;
  }

  .section-label {
    margin: 0 0 calc(var(--spacing-unit) * 4);
    color: var(--color-text-secondary);
    font-family: var(--display-font);
    font-size: 0.72rem;
  }

  h2 {
    margin: 0;
    font-family: var(--serif);
    font-size: 1.65rem;
    font-weight: 500;
    line-height: 1.5;
  }

  time {
    display: block;
    margin-top: calc(var(--spacing-unit) * 2);
    color: var(--color-text-secondary);
    font-size: 0.8rem;
  }

  .concert-details > a {
    display: inline-flex;
    align-items: center;
    gap: calc(var(--spacing-unit) * 2);
    min-height: 44px;
    margin-top: calc(var(--spacing-unit) * 5);
    border-bottom: 1px solid currentColor;
    font-size: 0.8rem;
  }

  .flyer-link {
    display: block;
    aspect-ratio: 1 / 1.4142;
    border: 0;
    line-height: 0;
  }

  .flyer-link :global(img) {
    display: block;
    width: 100%;
    height: auto;
    max-height: none;
  }

  @media (max-width: 520px) {
    .upcoming-concert {
      grid-template-columns: minmax(0, 1fr) 96px;
      gap: calc(var(--spacing-unit) * 5);
    }

    h2 {
      font-size: 1.25rem;
    }
  }
</style>
