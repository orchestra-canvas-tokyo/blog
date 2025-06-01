<script lang="ts">
  import { onMount } from 'svelte';
  import { scriptsToManage, type ThirdPartyScript } from '$lib/config/thirdPartyScripts';

  let showToast = $state(false);
  let concentObtained: boolean | null = $state(false);

  function injectScripts() {
    for (const scriptConfig of scriptsToManage) {
      if (document.getElementById(scriptConfig.id)) {
        continue; // Script already exists
      }

      const scriptElement = document.createElement('script');
      scriptElement.id = scriptConfig.id;

      if (scriptConfig.src) {
        scriptElement.src = scriptConfig.src;
      }
      if (scriptConfig.async) {
        scriptElement.async = true;
      }
      if (scriptConfig.defer) {
        scriptElement.defer = true;
      }
      if (scriptConfig.inlineContent) {
        scriptElement.textContent = scriptConfig.inlineContent;
      }

      document.head.appendChild(scriptElement);
    }
  }

  function removeScripts() {
    for (const scriptConfig of scriptsToManage) {
      const scriptElement = document.getElementById(scriptConfig.id);
      if (scriptElement) {
        scriptElement.remove();
      }
    }
  }

  $effect(() => {
    if (concentObtained === true) {
      injectScripts();
    } else {
      // Ensures scripts are removed if consent is not true (i.e., false or null)
      removeScripts();
    }
  });

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
  <!-- 3rd party Cookieを使用していないため、Cookie同意は不要 -->
  <script
    defer
    src="https://static.cloudflareinsights.com/beacon.min.js"
    data-cf-beacon={'{"token": "8044631ab8984a1c90d8d1f3f8fb4d33"}'}
  ></script>
  <!-- End Cloudflare Web Analytics -->
</svelte:head>

<div class="toast" class:show={showToast}>
  <p>
    このブログでは、サービスの品質向上と利用状況の把握のためにCookieを使用しています。<br />
    詳細は<a href="/cookie-policy">Cookieポリシー</a>をご確認ください。
  </p>
  <p>Cookieの使用に同意いただける場合は、「同意する」をクリックしてください。</p>

  <div class="button-container">
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
</div>

<div class="footer-section">
  <button
    onclick={function () {
      showToast = true;
    }}
    class="text-link"
  >
    Cookieの設定を変更
  </button>
  ・
  <a class="secondary-link" href="/cookie-policy">Cookieポリシー</a>
</div>

<style>
  button {
    padding: 0;
    border: none;
    outline: none;
    font: inherit;
    color: inherit;
    background: none;
    cursor: pointer;
  }

  .text-link {
    color: var(--color-text-secondary);
    text-decoration: underline;
  }

  .toast {
    position: fixed;
    bottom: calc(var(--spacing-unit) * 8);

    margin: 0 calc(var(--spacing-unit) * 8);
    border: 1px solid var(--color-text-primary);
    padding: calc(var(--spacing-unit) * 6);

    box-shadow: 0 0 15px rgba(0, 0, 0, 0.25);
    border-radius: var(--spacing-unit);

    background-color: rgba(255, 255, 255, 0.75);
    backdrop-filter: blur(5px);

    animation: fadeOut 0.1s ease-in 0s forwards;
    display: none;
    opacity: 0;

    p {
      margin-top: 0;
      margin-bottom: calc(var(--spacing-unit) * 4);
    }

    button {
      padding: calc(var(--spacing-unit) * 1) calc(var(--spacing-unit) * 4);
      border: 1px solid var(--color-text-primary);
      border-radius: var(--spacing-unit);
    }
  }

  .show {
    animation: fadeIn 0.1s ease-in 0s forwards;

    display: block;
    opacity: 1;
  }

  @keyframes fadeIn {
    0% {
      display: none;
      opacity: 0;
      transform: scale(0.95);
    }
    1% {
      display: block;
      opacity: 0;
    }
    100% {
      display: block;
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes fadeOut {
    0% {
      display: block;
      opacity: 1;
      transform: scale(1);
    }
    99% {
      display: block;
      opacity: 0;
    }
    100% {
      display: none;
      opacity: 0;
      transform: scale(0.95);
    }
  }

  .button-container {
    display: flex;
    justify-content: flex-end;
    gap: calc(var(--spacing-unit) * 6);
  }

  a {
    text-decoration: underline;
  }

  .footer-section {
    color: var(--color-text-secondary);
    font-size: 0.8em;
  }
</style>
