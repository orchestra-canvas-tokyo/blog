<script>
  import Meta from '$lib/component/Meta.svelte';
</script>

<Meta title="Cookieポリシー" canonical="/cookie-policy" />

<h2>Cookieポリシー</h2>

<main>
  <p>
    Orchestra Canvas
    Tokyo（以下、「当団」といいます。）は、お客様のウェブサイト利用状況を分析し、または個々のお客様に対してカスタマイズされたサービスを提供する等の目的のため、クッキーを使用して一定の情報を収集します。
  </p>

  <h3>1. クッキーについて</h3>

  <p>
    クッキーとはお客様のウェブサイト閲覧情報を、そのお客様のコンピューター（PCやスマートフォン、タブレットなどインターネット接続可能な機器）に記憶させる機能のことです。
  </p>

  <p>
    クッキーには、当団によって設定されるもの（ファーストパーティークッキー）と、当団と提携する第三者によって設定されるもの（サードパーティークッキー）があります。
  </p>

  <h3>2. クッキーの利用目的</h3>

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
        <li>Microsoft Clarify</li>
      </ul>
    </li>
  </ol>

  <h3>3. クッキーの拒否方法</h3>

  <p>画面下部の「Cookieの設定を変更」のリンクより、クッキーを拒否することが可能です。</p>

  <p>
    また、お客様がブラウザの設定を変更することによりクッキーを無効にすることが可能です。ただし、クッキーを無効にした場合は、一部のサービスが受けられない場合があります。
    <br />
    クッキーの設定の変更方法については、各ブラウザの製造元へご確認ください。
  </p>

  <h3>4. サードパーティークッキーによる送信情報</h3>

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
            <a href="https://policies.google.com/privacy?hl=ja#whycollect">Googleのウェブサイト</a> をご参照ください。
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
      text-indent: 1rem;
      text-align: justify;
      line-height: 1.75;
    }
  }

  .align-right {
    text-align: right;
  }

  .horizontal-scroll {
    overflow: auto;
    white-space: nowrap;
    display: flex;
  }

  table {
    border-collapse: collapse;
    border-top: 2px solid;
    border-bottom: 2px solid;
    flex-shrink: 0;
  }

  thead {
    border-bottom: 2px solid;
  }

  th,
  td {
    border: 1px solid #ccc;
    padding: 5px 15px;
    text-align: center;
    vertical-align: middle;
    text-wrap: balance;
  }

  td:nth-child(2) {
    width: 80px;
  }

  td pre {
    display: inline;
    margin: 0;
  }

  td a {
    text-decoration: underline;
  }
</style>
