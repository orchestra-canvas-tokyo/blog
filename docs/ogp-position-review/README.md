# 初案のサイズを維持した上下位置の比較

[指定された初案](https://github.com/orchestra-canvas-tokyo/blog/pull/65#issuecomment-5753877104)（`cda5d385253f0b58bd6da1b0f52cda9a7474a26f`）を正確に再現しています。

**左：初案 ／ 右：「曲目解説」の上下位置だけを欧文ベースラインに合わせた案**

![比較](comparison.png)

[初案の原寸](before.png) ／ [位置だけ調整した原寸](after.png)

ロゴ・文字のサイズ、横位置、96pxの間隔、中黒、作曲家・曲名は初案と同じです。見出しの文字サイズは58px。変更ピクセルは見出しラベル内（x=864–1084, y=62–124）に限定されます。比較用であり、全曲には未適用です。

再生成：`node scripts/ogp/position-only-preview.mjs`。元のGitコミットが必要です。
