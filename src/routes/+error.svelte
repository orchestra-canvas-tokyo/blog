<script lang="ts">
  import { page } from '$app/stores';
</script>

<div>
  {#if $page.status === 404}
    <h2>404: Not Found</h2>
    {#if $page.error?.message}
      <p>{$page.error.message}</p>
    {:else}
      <p>お探しのページは見つかりませんでした。</p>
    {/if}
  {:else}
    <h2>{$page.status}</h2>
    {#if $page.error?.message}
      <p>{$page.error.message}</p>
    {/if}
  {/if}
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: calc(var(--spacing-unit) * 28) 0;
  }
  h2 {
    margin: calc(var(--spacing-unit) * 4) 0;
  }
  p {
    margin: 0;
    text-indent: 0;
  }
</style>
