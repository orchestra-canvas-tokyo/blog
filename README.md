# blog

## 技術概要

| 種類              | 技術仕様                                        | 備考                          |
| ----------------- | ----------------------------------------------- | ----------------------------- |
| フレームワーク    | SvelteKit                                       | Svelte, TypeScript, HTML, CSS |
| Linter, Formatter | svelte-check, Prettier, ESLint                  |                               |
| テンプレート管理  | hygen                                           |                               |
| コード管理        | GitHub                                          |                               |
| CI                | husky, GitHub Actions                           | コミット時、プッシュ時に実行  |
| デプロイ          | Cloudflare Pages                                |                               |
| CD                | Cloudflare PagesのGitHub連携                    | デプロイ条件は後述            |
| アクセス分析      | Cloudflare Web Analytics, Google Search Console |                               |

| 環境       | URL                               | デプロイ条件                                      |
| ---------- | --------------------------------- | ------------------------------------------------- |
| 本番       | [https://blog.orch-canvas.tokyo/] | `production`ブランチへのプッシュ                  |
| プレビュー | ブランチごとに発行                | `main`、`develop/*`ブランチへのプッシュ           |
| 開発       | コンソールに表示                  | `npm run dev`, `npm run build && npm run preview` |

その他、各コミットやブランチに対するプレビューURLが発行されます。
詳細は[Cloudflare ダッシュボード](https://dash.cloudflare.com/940baf35dc60e6a39b351d032b853543/pages/view/blog)を参照。

## 開発環境の構築

```shell
npm install
npm run dev
```

## 日々のメンテナンス

### 曲目解説の作成

```shell
npm run add:program-note -- --number=999 --slug=yyyymmdd-composer-title
```

#### 新しい演奏会の記事を作成したとき

演奏会の情報を各所に追加する必要があります。

1. `src/lib/posts/regular-999`にフライヤー画像を追加
1. `src/lib/posts/concerts.ts`に演奏会情報を追加
   - このとき、フライヤー画像をインポートして使用

演奏会情報を追加することで、記事のタグに`'第○回演奏会'`を使用することができるようになります。

#### 新しい指揮者を追加するとき

`src/lib/posts/composers.ts`に指揮者情報を追加

指揮者情報を追加することで、記事のタグに指揮者名（`shortname`）を使用することができるようになります。

### パッケージの更新

[npm-check-updates](https://www.npmjs.com/package/npm-check-updates)を使うのがよさそうです。

```shell
npx npm-check-updates
npx npm-check-updates -u
npm install
```

## よくあるトラブル

### prettierがエラーになる

```shell
npm run format
```

これでPrettierを`--format`オプション付きで走らせることができます。

VSCodeの設定でFormat On Saveを有効にしておくのもアツいと思います。

### コメント

できるだけ丁寧に、ていねいすぎるぐらいに書いていきたい。

あまり厳密なものではないですが、次のようなルールを目安としています。

- [What is TSDoc? | TSDoc](https://tsdoc.org/)
- [Document Svelte Projects with HTML and JSDoc Comments](https://blog.robino.dev/posts/doc-comments-svelte)

#### 各変数や関数にコメントにドキュメントコメント風のコメントをつける

```TypeScript
/** 特に意味のない文字列 */
const hoge: string = 'fuga'

/**
 * 文字列の初めにhogeをつける
 *
 * @param fuga - hogeをつけたい文字列
 * @returns hogeをつけた文字列
 */
cosnt doHoge = (fuga: string) => `hoge ${fuga}`
```

#### 隙があれば(インライン)コメントを辞さない

```TypeScript
type hoge = {
  name: string // フルネーム
}
```

#### コンポーネントやそのプロパティに対しコメントをつける

`@component`タグが用いられます。

```Svelte:CoolString
<script type="ts">
  /** 描画する文字列 */
  let content: string
</script>

<!--
@component
文字列をかっこよく描画するコンポーネント
- 文字数は○文字程度までしか検証していない
-->

<span class="very-very-cool">{content}</span>
```

### 関数、コンポーネントは、汎用的なものであれば用例をつけるとなお良い

`@example`タグが用いられます。

````TypeScript
/**
 * 文字列の初めにhogeをつける
 *
 * @param fuga - hogeをつけたい文字列
 * @returns hogeをつけた文字列
 *
 * @example
 * ```TypeScript
 * const happyString = doHoge(lonelyString);
 * ```
 */
cosnt doHoge = (fuga: string) => `hoge ${fuga}`
````
