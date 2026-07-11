<script lang="ts">
  import { page } from '$app/stores';
</script>

<main>
  {#if $page.status === 404}
    <p class="section-label">ERROR</p>
    <h1>404: Not Found</h1>
    {#if $page.error?.message}
      <p>{$page.error.message}</p>
    {:else}
      <p>お探しのページは見つかりませんでした。</p>
    {/if}
  {:else}
    <p class="section-label">ERROR</p>
    <h1>{$page.status}</h1>
    {#if $page.error?.message}
      <p>{$page.error.message}</p>
    {/if}
  {/if}
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 52vh;
    padding: calc(var(--spacing-unit) * 16) 0;
    text-align: center;
  }

  .section-label {
    margin: 0 0 calc(var(--spacing-unit) * 4);
    color: var(--color-text-secondary);
    font-family: var(--display-font);
    font-size: 0.72rem;
  }

  h1 {
    margin: 0 0 calc(var(--spacing-unit) * 5);
    font-family: var(--display-font);
    font-size: 2rem;
    font-weight: 500;
  }

  p {
    margin: 0;
    color: var(--color-text-secondary);
  }
</style>
