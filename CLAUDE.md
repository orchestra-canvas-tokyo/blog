# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

Orchestra Canvas Tokyo（オーケストラ・カンヴァス・トウキョウ）の公式ブログサイト。演奏会のプログラムノートや団体情報を掲載するSvelteKitベースのWebアプリケーション。

## 開発コマンド

### 基本コマンド
```bash
npm run dev          # 開発サーバー起動 (http://localhost:5173)
npm run build        # プロダクションビルド
npm run preview      # ビルド結果のプレビュー
```

### コード品質チェック
```bash
npm run check        # TypeScript型チェック (svelte-check)
npm run lint         # Prettier + ESLint実行
npm run format       # Prettierでコード整形
npm run precommit    # コミット前チェック（check + lint並列実行）
```

### コンテンツ作成
```bash
npm run add:program-note  # 新しいプログラムノート（演奏会記事）を追加
```

## アーキテクチャ概要

### 技術スタック
- **フレームワーク**: SvelteKit v2 + Svelte 5
- **言語**: TypeScript (strict mode)
- **デプロイ**: Cloudflare Pages
- **スタイリング**: PostCSS
- **日付処理**: dayjs

### ディレクトリ構造

- `/src/lib/posts/` - 演奏会ごとのコンテンツ（regular-1〜regular-13）
  - 各演奏会ディレクトリに `index.ts` と画像ファイル（WebP/PNG）を配置
  - `index.ts` でメタデータ（タイトル、日付、タグ等）とコンテンツを定義

- `/src/lib/component/` - 再利用可能なSvelteコンポーネント
  - `CookieConsent.svelte` - Cookie同意バナー
  - `Meta.svelte` - メタタグ管理
  - `PostList.svelte` - 記事一覧表示
  - `Flyer.svelte` - 演奏会フライヤー表示

- `/src/routes/` - ページルーティング
  - `/post/[slug]/` - 個別記事ページ（動的ルート）
  - `/tag/[tag]/` - タグ別記事一覧（動的ルート）
  - `+layout.svelte` - 共通レイアウト（ヘッダー、フッター）

### 重要な実装パターン

1. **記事の追加**:
   - `npm run add:program-note` でHygenテンプレートから生成
   - `/src/lib/posts/posts.ts` に新しい記事をインポート・追加

2. **型定義**:
   - `Post` 型が `/src/lib/posts/type.ts` で定義
   - 全ての記事は `PostRequiredProperty` と `PostOptionalProperty` に準拠

3. **ルーティング**:
   - 動的ルートは `/src/params/` で検証
   - `slug.ts` と `tag.ts` でパラメータの妥当性をチェック

4. **コンポーネントプロパティ**:
   - Svelte 5の新しい構文 `$props()` を使用
   - 例: `let { post } = $props<{ post: Post }>();`

## 開発時の注意事項

1. **コミット前**:
   - Huskyによる自動チェックが実行される
   - `npm run precommit` で手動実行可能

2. **画像の取り扱い**:
   - WebP形式を推奨（PNG版も用意）
   - 記事と同じディレクトリに配置
   - importで参照し、型安全性を確保

3. **TypeScript**:
   - strict modeが有効
   - 型エラーは必ず解消してからコミット

4. **Cookie同意**:
   - Google Analytics使用のため実装
   - ローカルストレージで同意状態を管理

5. **デプロイ**:
   - Cloudflare Pages向けにビルド
   - `_headers` と `_redirects` は `/static/` に配置