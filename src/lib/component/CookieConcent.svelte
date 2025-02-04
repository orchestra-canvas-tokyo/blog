<script lang="ts">
  import { onMount } from 'svelte';

  let showToast = $state(false);
  let concentObtained: boolean | null = $state(false);
  let contentType = $derived.by(() =>
    concentObtained === true ? 'text/javascript' : 'text/plain'
  );

  onMount(() => {
    const cookieConcentStateController = new CookieConcentStateController();

    if (cookieConcentStateController.needToShowToast) {
      // Cookie同意が必要な場合はCookieConcentを表示
      showToast = true;
    } else {
      // Cookie同意が取得されているかを取得
      concentObtained = CookieConcentStateController.getConcentObtained();
    }
  });

  class CookieConcentStateController {
    needToShowToast: boolean;

    constructor() {
      this.needToShowToast = this.confirmIfRequiredCookieConcent();
      this.updateLastAccessedAt();
    }

    /**
     * Cookie同意が必要かどうかを判定する
     *
     * Cookie同意が取得されていない場合、
     * 最終アクセス日時が7日経過している場合に
     * Cookie同意が必要と判定する
     *
     * @returns Cookie同意が必要な場合はtrue
     */
    private confirmIfRequiredCookieConcent(): boolean {
      const rawLastAccessedAt = localStorage.getItem('lastAccessedAt') || '';
      const lastAccessedAt = new Date(rawLastAccessedAt ? parseInt(rawLastAccessedAt) : 0);
      const sevenDays = 7 * 24 * 60 * 60 * 1000;

      if (CookieConcentStateController.getConcentObtained() === null) {
        return true;
      }

      if (lastAccessedAt.getTime() + sevenDays < Date.now()) {
        return true;
      }

      return false;
    }

    /**
     * Cookie同意が取得されているかを取得する
     *
     * @returns Cookie同意が取得されている場合はtrue
     */
    static getConcentObtained(): boolean | null {
      const rawConcentObtained = localStorage.getItem('concentObtained');

      if (rawConcentObtained === null) {
        return null;
      }
      return rawConcentObtained === 'true';
    }

    /**
     * Cookie同意が取得されているかを更新する
     *
     * @param concentObtained Cookie同意が取得されているか
     */
    static updateConcentObtained(concentObtained: boolean): void {
      localStorage.setItem('concentObtained', concentObtained.toString());
    }

    /**
     * 最終アクセス日時を更新する
     */
    private updateLastAccessedAt(): void {
      localStorage.setItem('lastAccessedAt', Date.now().toString());
    }
  }
</script>

<svelte:head>
  <!-- Cloudflare Web Analytics -->
  <script
    defer
    src="https://static.cloudflareinsights.com/beacon.min.js"
    data-cf-beacon={'{"token": "8e430284c5e94ef491ba76c2e90509c2"}'}
    type={contentType}
  ></script>
  <!-- End Cloudflare Web Analytics -->

  <!-- Google tag (gtag.js) -->
  <script
    async
    src="https://www.googletagmanager.com/gtag/js?id=G-FEL3WFK0YW"
    type={contentType}
  ></script>
  <script type={contentType}>
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag('js', new Date());

    gtag('config', 'G-FEL3WFK0YW');
  </script>

  <!-- Clarify -->
  <script type={contentType}>
    (function (c, l, a, r, i, t, y) {
      c[a] =
        c[a] ||
        function () {
          (c[a].q = c[a].q || []).push(arguments);
        };
      t = l.createElement(r);
      t.async = 1;
      t.src = 'https://www.clarity.ms/tag/' + i;
      y = l.getElementsByTagName(r)[0];
      y.parentNode.insertBefore(t, y);
      // cspell: disable-next-line
    })(window, document, 'clarity', 'script', 'q3jweqrwcn');
  </script>
</svelte:head>

{#if showToast}
  <div>
    <p>Cookieの利用に同意してください。</p>
    <button
      onclick={function () {
        CookieConcentStateController.updateConcentObtained(true);
        concentObtained = CookieConcentStateController.getConcentObtained();
        showToast = false;
      }}
    >
      同意する
    </button>

    <button
      onclick={function () {
        CookieConcentStateController.updateConcentObtained(false);
        concentObtained = CookieConcentStateController.getConcentObtained();
        showToast = false;
      }}
    >
      同意しない
    </button>
  </div>
{/if}

<button
  onclick={function () {
    showToast = true;
  }}
>
  Cookieの設定を変更
  {contentType}
</button>

<style>
  button {
    background: none;
    border: none;
  }
</style>
