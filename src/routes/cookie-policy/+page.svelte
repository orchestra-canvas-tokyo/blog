<script>
  import Meta from '$lib/component/Meta.svelte';
</script>

<Meta title="Cookieポリシー" canonical="/cookie-policy" />

<h2>Cookieポリシー</h2>

<main>
  <p>
    Orchestra Canvas Tokyoのブログでは、Google AnalyticsおよびMicrosoft
    Clarityによるアクセス解析を終了し、これらのタグを読み込んでいません。
    アクセス解析のためのCookie同意バナーとCookie設定機能も廃止しました。
  </p>

  <h3>1. アクセス解析について</h3>
  <p>
    当ブログでは、利用状況やページのパフォーマンスを把握するためにCloudflare Web
    Analyticsを使用しています。このサービスはCookieやlocalStorageを使用しません。 詳細は<a
      href="https://developers.cloudflare.com/speed/observatory/rum-beacon/">Cloudflareの説明</a
    >をご確認ください。
  </p>

  <h3>2. 外部サービスについて</h3>
  <p>
    記事内のYouTube動画はプライバシー強化モードで埋め込んでいます。
    動画の再生や外部サイトの利用時の情報の取り扱いについては、各サービスのポリシーをご確認ください。
  </p>

  <h3>3. 以前保存された情報について</h3>
  <p>
    以前のアクセス解析で保存されたCookieや、Cookie同意設定として保存されたブラウザ内のデータが残っている場合があります。
    当ブログでは以前の同意設定を読み取ったり更新したりしません。
    保存済みの情報を削除する場合は、ブラウザの設定から当ブログのCookieとサイトデータを削除してください。
  </p>
</main>

<style>
  h2 {
    margin: 0;
    font-size: 2.2rem;
  }
  @media (max-width: 576px) {
    h2 {
      font-size: 2rem;
    }
  }

  main {
    * {
      letter-spacing: 0.04em;
    }

    h3 {
      margin-top: calc(var(--spacing-unit) * 12);
      font-size: 1.5em;
    }

    p {
      text-align: justify;
      line-height: 1.75;
    }
  }
</style>
