<script lang="ts">
  import { resolve } from '$app/paths';
  import { onMount } from 'svelte';
  import { scriptsToManage } from '$lib/config/thirdPartyScripts';

  let showToast = $state(false);
  let concentObtained: boolean | null = $state(false);

  function injectScripts() {
    for (const [scriptID, scriptConfig] of Object.entries(scriptsToManage)) {
      if (document.getElementById(scriptID)) {
        continue; // Script already exists
      }

      const scriptElement = document.createElement('script');
      scriptElement.id = scriptID;

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
    for (const scriptID of Object.keys(scriptsToManage)) {
      const scriptElement = document.getElementById(scriptID);
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

<div
  class="toast"
  class:show={showToast}
  role="region"
  aria-live="polite"
  aria-labelledby="cookie-consent-title"
  aria-describedby="cookie-consent-description cookie-consent-request"
  aria-hidden={!showToast}
>
  <h2 id="cookie-consent-title">Cookieの設定</h2>
  <p id="cookie-consent-description">
    このブログでは、サービスの品質向上と利用状況の把握のためにCookieを使用しています。<br />
    詳細は<a href={resolve('/cookie-policy')}>Cookieポリシー</a>をご確認ください。
  </p>
  <p id="cookie-consent-request">
    Cookieの使用に同意いただける場合は、「同意する」を選択してください。
  </p>

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
  <a class="secondary-link" href={resolve('/cookie-policy')}>Cookieポリシー</a>
</div>

<style>
  button {
    padding: 0;
    border: none;
    font: inherit;
    color: inherit;
    background: none;
    cursor: pointer;
  }

  .text-link {
    color: var(--color-text-secondary);
    text-decoration: underline;
    text-underline-offset: 0.2em;
  }

  .toast {
    position: fixed;
    bottom: calc(var(--spacing-unit) * 8);
    left: 50%;
    z-index: 20;

    width: min(calc(100% - var(--spacing-unit) * 8), 720px);
    margin: 0;
    border: 1px solid var(--color-border);
    padding: calc(var(--spacing-unit) * 6);

    box-shadow: 0 20px 56px rgba(0, 0, 0, 0.48);
    border-radius: var(--spacing-unit);

    background-color: var(--color-surface-raised);
    color: var(--color-text-primary);

    display: none;
    opacity: 0;
    transform: translate(-50%, calc(var(--spacing-unit) * 2));

    h2 {
      margin: 0 0 calc(var(--spacing-unit) * 4);
      font-family: var(--display-font);
      font-size: 1rem;
      font-weight: 500;
    }

    p {
      margin-top: 0;
      margin-bottom: calc(var(--spacing-unit) * 4);
    }
  }

  .show {
    animation: fadeIn 160ms ease-out forwards;

    display: block;
    opacity: 1;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translate(-50%, calc(var(--spacing-unit) * 2));
    }
    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }

  .toast a {
    color: var(--color-text-primary);
    text-decoration: underline;
    text-underline-offset: 0.2em;
  }

  .button-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: calc(var(--spacing-unit) * 3);
  }

  .button-container button {
    min-height: 44px;
    border: 1px solid var(--color-text-secondary);
    border-radius: var(--spacing-unit);
    padding: calc(var(--spacing-unit) * 2) calc(var(--spacing-unit) * 5);
    transition:
      background-color 160ms ease,
      border-color 160ms ease,
      color 160ms ease;
  }

  .button-container button:first-child {
    border-color: var(--color-inverse-background);
    background: var(--color-inverse-background);
    color: var(--color-inverse-text);
  }

  .button-container button:hover {
    border-color: var(--color-text-primary);
  }

  .button-container button:not(:first-child):hover {
    background: var(--color-surface);
  }

  .footer-section {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: calc(var(--spacing-unit) * 2) calc(var(--spacing-unit) * 5);
    color: var(--color-text-secondary);
    font-size: 0.75rem;
  }

  .footer-section button,
  .footer-section a {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
  }

  .secondary-link {
    color: var(--color-text-secondary);
    text-decoration: underline;
    text-underline-offset: 0.2em;
  }

  @media (max-width: 576px) {
    .toast {
      bottom: calc(var(--spacing-unit) * 4);
      padding: calc(var(--spacing-unit) * 4);
    }

    .button-container button {
      flex: 1 1 120px;
    }
  }
</style>
