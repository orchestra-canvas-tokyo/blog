<script lang="ts">
  import { page } from '$app/state';
  import { resolve } from '$app/paths';
</script>

<svelte:head
  ><title>{page.status} — Orchestra Canvas Tokyo Blog</title><meta
    name="robots"
    content="noindex"
  /></svelte:head
>
<section>
  <p class="status">{page.status}</p>
  <h1>{page.status === 404 ? 'ページが見つかりませんでした' : 'ページを表示できませんでした'}</h1>
  <p>
    {page.status === 404
      ? 'URLが変更されたか、記事が公開されていない可能性があります。'
      : '時間をおいて、もう一度お試しください。'}
  </p>
  <a href={resolve('/')}>← 記事一覧へ戻る</a>
</section>

<style>
  section {
    margin: var(--space-section) auto;
    max-width: var(--reading-width);
    padding-block: 40px;
  }
  .status {
    font-size: 14px;
    letter-spacing: 0.16em;
  }
  h1 {
    font-family: var(--serif);
    font-size: clamp(24px, 4vw, 36px);
  }
  p {
    color: var(--color-text-secondary);
  }
  a {
    display: inline-flex;
    padding-block: 16px;
    text-decoration: underline;
  }
</style>
