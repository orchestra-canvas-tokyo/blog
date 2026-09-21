// Review-only comparison against the exact revision linked by the user.
import { execFileSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import sharp from 'sharp';

const revision = 'cda5d385253f0b58bd6da1b0f52cda9a7474a26f';
const root = fileURLToPath(new URL('../../', import.meta.url));
const output = new URL('../../docs/ogp-position-review/', import.meta.url);
const originalSource = execFileSync('git', ['show', `${revision}:scripts/ogp/render.mjs`], {
  cwd: root,
  encoding: 'utf8'
});
const importRenderer = async (source) => {
  const resolved = source
    .replace(
      "from 'sharp'",
      `from '${new URL('../../node_modules/sharp/lib/index.js', import.meta.url).href}'`
    )
    .replace("from './content.mjs'", `from '${new URL('./content.mjs', import.meta.url).href}'`)
    .replaceAll('import.meta.url', JSON.stringify(new URL('./render.mjs', import.meta.url).href));
  return import(`data:text/javascript;base64,${Buffer.from(resolved).toString('base64')}`);
};
const originalRenderer = await importRenderer(originalSource);
const sample = { composer: 'モーツァルト', lines: ['交響曲第35番', '『ハフナー』'] };
const [heading] = await originalRenderer.createCardLayers(sample);
const fontfile = fileURLToPath(new URL('./fonts/NotoSerifJP-Regular.otf', import.meta.url));
const probe = await sharp({
  text: {
    text: `<span foreground="#20384a" font_features="kern=1,palt=1" letter_spacing="${Math.round(-0.018 * heading.fontSize * 1024)}">曲目解説</span><span foreground="#ff0000">H</span>`,
    font: `Noto Serif JP ${heading.fontSize}`,
    fontfile,
    rgba: true,
    dpi: 72
  }
})
  .raw()
  .toBuffer({ resolveWithObject: true });
let labelTop = probe.info.height,
  baseline = -1;
for (let y = 0; y < probe.info.height; y++)
  for (let x = 0; x < probe.info.width; x++) {
    const p = (y * probe.info.width + x) * 4;
    if (!probe.data[p + 3]) continue;
    if (probe.data[p] > 200 && probe.data[p + 1] < 40) {
      if (probe.data[p + 3] > 128) baseline = Math.max(baseline, y + 1);
    } else labelTop = Math.min(labelTop, y);
  }
const labelBaseline = baseline - labelTop;
const changedSource = originalSource
  .replace(
    '  const width = logo.info.width + HEADER_SEPARATION + heading.info.width;',
    `  const adjustedHeadingTop = Math.round(logo.info.width * 236.67 / 2438.71 - ${labelBaseline});\n  const width = logo.info.width + HEADER_SEPARATION + heading.info.width;`
  )
  .replace(
    'left: logo.info.width + HEADER_SEPARATION, top: headingTop',
    'left: logo.info.width + HEADER_SEPARATION, top: adjustedHeadingTop'
  );
assert.notEqual(changedSource, originalSource);
const adjustedRenderer = await importRenderer(changedSource);
const before = await originalRenderer.renderCard(sample);
const committed = execFileSync(
  'git',
  ['show', `${revision}:docs/ogp-review/20260724-mozart-haffner-symphony.png`],
  { cwd: root }
);
assert.deepEqual(before, committed, 'The reference must reproduce the exact linked image');
const after = await adjustedRenderer.renderCard(sample);
const beforeRaw = await sharp(before).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const afterRaw = await sharp(after).ensureAlpha().raw().toBuffer();
let changed = 0,
  minX = 1200,
  maxX = 0,
  minY = 630,
  maxY = 0;
for (let y = 0; y < 630; y++)
  for (let x = 0; x < 1200; x++) {
    const p = (y * 1200 + x) * 4;
    if (!beforeRaw.data.subarray(p, p + 4).equals(afterRaw.subarray(p, p + 4))) {
      changed++;
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
  }
assert.ok(changed > 0);
assert.ok(minX > 800 && maxY < 160, 'Only the header label region may change');
await mkdir(output, { recursive: true });
await writeFile(new URL('before.png', output), before);
await writeFile(new URL('after.png', output), after);
await sharp({ create: { width: 2400, height: 630, channels: 3, background: '#f8fafc' } })
  .composite([
    { input: before, left: 0, top: 0 },
    { input: after, left: 1200, top: 0 }
  ])
  .png()
  .toFile(fileURLToPath(new URL('comparison.png', output)));
await writeFile(
  new URL('README.md', output),
  `# 初案のサイズを維持した上下位置の比較\n\n[指定された初案](https://github.com/orchestra-canvas-tokyo/blog/pull/65#issuecomment-5753877104)（\`${revision}\`）を正確に再現しています。\n\n**左：初案 ／ 右：「曲目解説」の上下位置だけを欧文ベースラインに合わせた案**\n\n![比較](comparison.png)\n\n[初案の原寸](before.png) ／ [位置だけ調整した原寸](after.png)\n\nロゴ・文字のサイズ、横位置、96pxの間隔、中黒、作曲家・曲名は初案と同じです。見出しの文字サイズは${heading.fontSize}px。変更ピクセルは見出しラベル内（x=${minX}–${maxX}, y=${minY}–${maxY}）に限定されます。比較用であり、全曲には未適用です。\n\n再生成：\`node scripts/ogp/position-only-preview.mjs\`。元のGitコミットが必要です。\n`
);
console.log({
  fontSize: heading.fontSize,
  labelBaseline,
  changedRegion: { minX, maxX, minY, maxY }
});
