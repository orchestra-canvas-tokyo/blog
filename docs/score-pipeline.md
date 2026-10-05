# 譜例画像 → OMR → MusicXML → SVG

原稿の譜例は引き続き画像で受け取り、Audiveris で認識した後に校正します。
記事と同じディレクトリに置く **校正済み MusicXML/MXL が source of truth** です。
SVG は Verovio から生成し、直接編集しません。ブラウザには Verovio/WASM を配信しません。

## 準備

```sh
npm ci
```

OMR を行う端末には [Audiveris の公式リリース](https://github.com/Audiveris/audiveris/releases/tag/5.11.0)
から 5.11.0 をインストールします。通常のビルド・SVG 再生成に Audiveris/Java は不要です。
コマンドが PATH にない場合は実行ファイルを指定してください（引数付きのコマンド文字列ではなくパス）。

```sh
export AUDIVERIS_BIN=/path/to/Audiveris
```

Audiveris の言語設定画面で英語・ドイツ語の OCR データを用意します。
手動で配置する場合は [tesseract-ocr/tessdata](https://github.com/tesseract-ocr/tessdata) の
`eng.traineddata` と `deu.traineddata` を使用します。
5.11.0 の legacy OCR エンジンには `tessdata_fast` / `tessdata_best` が対応していません。
Linux の配置先は `$XDG_CONFIG_HOME/AudiverisLtd/audiveris/tessdata`
（未設定時は `~/.config/AudiverisLtd/audiveris/tessdata`）です。
`Could not initialize TessBaseAPI` が出る場合は、楽譜が出力されてもテキスト認識は成功していません。

## 1. 画像を認識する

PNG/JPEG/WebP 等、sharp が読める画像を渡します。
白背景で PNG 化し、切り抜き譜例の周囲に 80px の余白を追加してから、
[Audiveris CLI](https://audiveris.github.io/audiveris/_pages/guides/advanced/cli/) の
`-batch -transcribe -export -save` を実行します。画像の拡大や音楽的内容の変更は行いません。

```sh
article=src/lib/posts/regular-17/20260724-r-strauss-alpine-symphony
npm run scores:omr -- "$article"/score-example-{1,2,3,4}.webp
```

各実行に固有の `.score-work/run-*/` 内に、入力 PNG・Audiveris プロジェクト `.omr`・
ログ・未校正 `.mxl` が出力されます。終了コードだけではなく、MusicXML の出力も確認します。
同名入力を渡しても別ディレクトリで処理し、校正済みファイルは上書きしません。
`.score-work/` は Git 管理対象外です。

## 2. 原画像と照合・校正する

MXL を MuseScore 等で開き、音高、音価、付点、臨時記号、休符、調号、拍子、
タイ、スラー、アーティキュレーション、強弱、テキストを照合します。
抜粋の冒頭・末尾は不完全小節の場合があります。表示されていない拍子・休符・音符を補わないでください。

校正済みデータを記事と同じディレクトリへ `score-example-N.musicxml`（推奨、差分をレビュー可能）
または `score-example-N.mxl` として保存します。元画像を残し、必要なら未校正 MXL を `omr/` に保存します。
同じ basename の `.musicxml` と `.mxl` を同時に掲載用として置かないでください。

```text
post.svelte
score-example-1.webp       # 原画像
score-example-1.musicxml   # 校正済みの正本
score-example-1.svg        # デスクトップ用生成物
score-example-1.mobile.svg # モバイル用生成物
score-example-1.layout.json # 五線全高に対する譜面幅の比率（生成物）
omr/score-example-1.mxl    # 未校正の認識結果（trial の証跡）
```

## 3. SVG を生成・掲載する

```sh
npm run scores:render                    # 全記事の校正済みデータから再生成
npm run scores:render -- "$article/score-example-1.musicxml"
npm run scores:check                     # 保存済み SVG と再生成結果の一致
npm run test:scores
```

引数なしの探索は `src/lib/posts/` 内が対象で、`omr/` は除外します。
引数付きでは MusicXML と ZIP 圧縮 MXL の両方を読めます。
レンダラーは Verovio 6.2.0 を固定し、XML ID の乱数 seed も固定します。
デスクトップ用は一段、モバイル用は小節単位で改行した複数段の SVG を生成します。
どちらも複数ページになった場合は黙って先頭だけを掲載せず失敗します。

MusicXML の末尾で終点のないタイ／スラーは、Verovio の取り込み警告が出ます。
レンダラーは中間 MEI 上で最後の小節の右端に `tstamp2` を補い、切り抜きによる継続曲線を描きます。
SVG の後加工や架空の終点音符の追加はしません。途中の小節に未完の曲線がある場合は校正エラーとします。
この補助は単純拍子の短い抜粋を対象とし、複雑な拍子・多声部の譜例は別途検証してください。
元の MusicXML は変更しません。

楽想記号の書体は原画像に合わせ、MusicXML の `<words>` に `font-style` / `font-weight` を指定します。
今回の速度標語と `marcato` は非斜体・太字、`dim.` / `espr.` は元の斜体を維持します。

```svelte
<script lang="ts">
  import Score from '$lib/component/post/Score.svelte';
  import score from './score-example-1.svg';
  import mobileScore from './score-example-1.mobile.svg';
  import layout from './score-example-1.layout.json';
</script>

<Score src={score} mobileSrc={mobileScore} {layout} caption="譜例1. 山の動機" />
```

譜面は本文の文字サイズ（`em`）を基準に表示します。五線全体の高さを
デスクトップで `1.5em`、600px 以下では `1.125em` とし、記事の幅を超える場合は縮小します。
通常の本文サイズはデスクトップ18px、モバイル16pxなので、五線はそれぞれ約27px / 18pxです。
SVG の五線と譜面幅から生成した `.layout.json` を参照するため、短い譜例でも文字や五線が過大に拡大されません。
600px 以下では `<picture>` がモバイル用 SVG を選び、横スクロールなしで表示します。

改行は `pageWidth: 1000` / `breaks: 'auto'` を基準に Verovio が小節境界で決めます。
音符・臨時記号・文字等に必要な幅によって、1段の小節数は変わります。
`unit: 9`（五線の線間隔の半分）と `scale: 40` を固定しています。
改行位置の決定と、本文に合わせた表示サイズの調整は別に行います。
端末幅ごとのブラウザ上の再組版は行っていません。
譜面のリンクは一段の SVG を別タブで開きます。
キャプションを画像の代替テキストとしても使用します。

## ビルド・CI・Git 管理

- OMR は手元で実行し、校正後の MusicXML/MXL と SVG をコミットします。
- 通常の `npm run build` は `scores:check` を先に実行し、古い SVG の掲載を防ぎます。
- GitHub Actions は譜例テストと SVG 一致検証を実行します。Java・OCR データは CI に持ち込みません。
- 原画像と正本は保持します。今回の4点は PoC のため未校正 MXL も保持します。
  `.omr`、前処理 PNG、ログ、言語データ、Audiveris 本体はコミットしません。
- レンダラー更新時は `npm run scores:render` 後に譜面を目視で再確認します。

初回の認識精度と校正内容は [アルプス交響曲 trial](score-trial-alpine.md) を参照してください。
