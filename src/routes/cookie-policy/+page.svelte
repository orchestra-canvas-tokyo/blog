<script>
  import Meta from '$lib/component/Meta.svelte';
</script>

<Meta title="Cookieポリシー" canonical="/cookie-policy" />

<main class="policy-page">
  <header class="page-heading">
    <p>POLICY</p>
    <h1>Cookieポリシー</h1>
  </header>

  <article>
    <p>
      Orchestra Canvas
      Tokyo（以下、「当団」といいます。）は、お客様のウェブサイト利用状況を分析し、または個々のお客様に対してカスタマイズされたサービスを提供する等の目的のため、クッキーを使用して一定の情報を収集します。
    </p>

    <h2>1. クッキーについて</h2>

    <p>
      クッキーとはお客様のウェブサイト閲覧情報を、そのお客様のコンピューター（PCやスマートフォン、タブレットなどインターネット接続可能な機器）に記憶させる機能のことです。
    </p>

    <p>
      クッキーには、当団によって設定されるもの（ファーストパーティークッキー）と、当団と提携する第三者によって設定されるもの（サードパーティークッキー）があります。
    </p>

    <h2>2. クッキーの利用目的</h2>

    <ol>
      <li>
        <p>
          当団では、クッキーを使用して収集した情報を利用して、お客様のウェブサイトの利用状況（アクセス状況、トラフィック、ルーティング等）を分析し、ウェブサイト自体のパフォーマンス改善や、当団からお客様に提供するサービスの向上、改善のために使用することがあります。
        </p>
        <p>
          また、この分析にあたっては、主に以下のツールが利用され、ツール提供者に情報提供されることがあります。
        </p>
        <ul>
          <li>Google Analytics</li>
          <li>Microsoft Clarity</li>
        </ul>
      </li>
    </ol>

    <h2>3. クッキーの拒否方法</h2>

    <p>画面下部の「Cookieの設定を変更」のリンクより、クッキーを拒否することが可能です。</p>

    <p>
      また、お客様がブラウザの設定を変更することによりクッキーを無効にすることが可能です。ただし、クッキーを無効にした場合は、一部のサービスが受けられない場合があります。
      <br />
      クッキーの設定の変更方法については、各ブラウザの製造元へご確認ください。
    </p>

    <h2>4. サードパーティークッキーによる送信情報</h2>

    <p>
      本サービスでは、アクセス解析の目的で、サードパーティークッキーを使用しています。
      <br />
      サードパーティークッキーによる送信情報等は以下のとおりです。
    </p>

    <div class="horizontal-scroll">
      <table>
        <thead>
          <tr>
            <th>サービス名</th>
            <th>クッキー名</th>
            <th>送信先</th>
            <th>当団での利用目的</th>
            <th>送信先での利用目的</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Google Analytics</td>
            <td>
              <pre>_ga</pre>
              /
              <pre>_ga_xxxxxxxxxx</pre>
            </td>
            <td>
              Google LLC<br />
              及びその関係会社
            </td>
            <td>
              利用者による閲覧の傾向や履歴の分析のため。<br />
              詳細は
              <a href="https://policies.google.com/privacy?hl=ja#whycollect">Googleのウェブサイト</a
              > をご参照ください。
            </td>
            <td>同左</td>
          </tr>
          <tr>
            <td>Microsoft Clarity</td>
            <td>
              <pre>_clck</pre>
              /
              <pre>_clsk</pre>
              /
              <pre>CLID</pre>
              /
              <pre>ANONCHK</pre>
              /
              <pre>MR</pre>
              /
              <pre>MUID</pre>
              /
              <pre>SM</pre>
            </td>
            <td>
              Microsoft Corporation<br />
              及びその関連会社
            </td>
            <td>
              利用者による閲覧の傾向や履歴の分析のため。<br />
              詳細は
              <a href="https://clarity.microsoft.com/terms">Microsoftのウェブサイト</a> をご参照ください。
            </td>
            <td>同左</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p class="align-right">以上</p>
  </article>
</main>

<style>
  .page-heading {
    padding: clamp(36px, 7vw, 88px) 0 clamp(32px, 6vw, 72px);
  }

  .page-heading p {
    margin: 0 0 calc(var(--spacing-unit) * 5);
    color: var(--color-text-secondary);
    font-family: var(--display-font);
    font-size: 0.72rem;
  }

  h1 {
    margin: 0;
    font-family: var(--serif);
    font-size: 2.4rem;
    font-weight: 500;
  }

  article {
    max-width: 900px;
    font-family: var(--serif);
    line-height: 1.9;
  }

  article h2 {
    max-width: var(--reading-max-width);
    margin: calc(var(--spacing-unit) * 16) 0 calc(var(--spacing-unit) * 6);
    border-top: 1px solid var(--color-border);
    padding-top: calc(var(--spacing-unit) * 6);
    font-size: 1.35rem;
    font-weight: 600;
  }

  article p,
  article > ol {
    max-width: var(--reading-max-width);
  }

  article p {
    text-align: left;
  }

  .align-right {
    text-align: right;
  }

  .horizontal-scroll {
    overflow: auto;
    display: flex;
    max-width: 100%;
    margin: calc(var(--spacing-unit) * 8) 0;
    border: 1px solid var(--color-border);
  }

  table {
    border-collapse: collapse;
    flex-shrink: 0;
    min-width: 920px;
    font-family: var(--sans-serif);
    font-size: 0.82rem;
  }

  thead {
    background: var(--color-surface-raised);
  }

  th,
  td {
    border: 1px solid var(--color-border);
    padding: calc(var(--spacing-unit) * 3) calc(var(--spacing-unit) * 4);
    text-align: left;
    vertical-align: top;
    white-space: normal;
  }

  td:nth-child(2) {
    width: 80px;
  }

  td pre {
    display: inline;
    margin: 0;
    color: var(--color-text-primary);
  }

  td a {
    text-decoration: underline;
  }

  @media (max-width: 600px) {
    h1 {
      font-size: 1.8rem;
    }

    article h2 {
      font-size: 1.15rem;
    }
  }
</style>
