// Review-only header variants; not imported by the live OGP generator.
import sharp from 'sharp';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createCardLayers, WIDTH, HEIGHT } from './render.mjs';

const output = new URL('../../docs/ogp-header-review/', import.meta.url);
await mkdir(output, { recursive: true });
const sample = { composer: 'モーツァルト', lines: ['交響曲第35番', '『ハフナー』'] };
const layers = await createCardLayers(sample);
const heading = layers[0];
const source = await readFile(
  new URL('../../src/routes/header-large.svg', import.meta.url),
  'utf8'
);
const logo = await sharp(Buffer.from(source.replaceAll('#231815', '#20384a')), { density: 144 })
  .trim()
  .resize({ height: heading.info.height })
  .png()
  .toBuffer({ resolveWithObject: true });
const separation = 72;
if (logo.info.width + separation + heading.info.width > WIDTH - 172) {
  throw new Error('Combined header exceeds the safe width');
}
const gap =
  (HEIGHT - layers.reduce((sum, layer) => sum + layer.info.height, 0)) / (layers.length + 1);
const logoLeft = 86;
const separatorX = logoLeft + logo.info.width + separation / 2;
const centerY = gap + heading.info.height / 2;
const symbol = await sharp(fileURLToPath(new URL('./oct-symbol.svg', import.meta.url)))
  .resize({ width: 392 })
  .png()
  .toBuffer({ resolveWithObject: true });
const variants = [
  { name: '01-space', title: '余白のみ', separator: '' },
  {
    name: '02-rule',
    title: '細い縦線',
    separator: `<path d="M${separatorX} ${centerY - heading.info.height * 0.35}v${heading.info.height * 0.7}" stroke="#82929e" stroke-width="1.5"/>`
  },
  {
    name: '03-dot',
    title: '中黒',
    separator: `<circle cx="${separatorX}" cy="${centerY}" r="4" fill="#456982"/>`
  }
];
for (const spacing of [96, 120, 144]) {
  const x = logoLeft + logo.info.width + spacing / 2;
  variants.push({
    name: `dot-spacing-${spacing}`,
    title: `中黒・要素間${spacing}px`,
    separation: spacing,
    separator: `<circle cx="${x}" cy="${centerY}" r="4" fill="#456982"/>`
  });
}
variants.push({
  name: 'rule-spacing-120',
  title: '細い縦線・要素間120px',
  separation: 120,
  separator: `<path d="M${logoLeft + logo.info.width + 60} ${centerY - heading.info.height * 0.35}v${heading.info.height * 0.7}" stroke="#82929e" stroke-width="1.5"/>`
});
for (const variant of variants) {
  const spacing = variant.separation ?? separation;
  const headingLeft = logoLeft + logo.info.width + spacing;
  if (headingLeft + heading.info.width > WIDTH - 86) {
    throw new Error(`Header exceeds safe width: ${variant.name}`);
  }
  const decoration = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}"><path d="M34 38V592" stroke="#456982" stroke-width="3"/>${variant.separator}</svg>`
  );
  let top = gap;
  const text = layers.map((layer, index) => {
    const item = { input: layer.data, left: index === 0 ? headingLeft : 86, top: Math.round(top) };
    top += layer.info.height + gap;
    return item;
  });
  await sharp({ create: { width: WIDTH, height: HEIGHT, channels: 3, background: '#f8fafc' } })
    .composite([
      { input: decoration, left: 0, top: 0 },
      { input: symbol.data, left: WIDTH - symbol.info.width, top: HEIGHT - symbol.info.height },
      { input: logo.data, left: logoLeft, top: Math.round(gap) },
      ...text
    ])
    .png({ compressionLevel: 9 })
    .toFile(fileURLToPath(new URL(`${variant.name}.png`, output)));
}
// Full-size side-by-side comparison: left = rule, right = dot.
await sharp({ create: { width: WIDTH * 2, height: HEIGHT, channels: 3, background: '#f8fafc' } })
  .composite([
    { input: fileURLToPath(new URL('rule-spacing-120.png', output)), left: 0, top: 0 },
    { input: fileURLToPath(new URL('dot-spacing-120.png', output)), left: WIDTH, top: 0 }
  ])
  .png()
  .toFile(fileURLToPath(new URL('rule-vs-dot-120.png', output)));
await writeFile(
  new URL('README.md', output),
  `# ブログロゴ＋曲目解説：区切りの比較\n\n## 120pxの余白で比較：左が細い縦線、右が中黒\n\n![細い縦線と中黒の横並び比較](rule-vs-dot-120.png)\n\n同じ曲名・文字サイズで、区切りと要素間の余白を比較する案です。現行OGPには未適用です。\n\nロゴと「曲目解説」の実際の描画高さを${heading.info.height}pxに揃え、上下中心も合わせています。文字サイズは作曲家名と同じ${heading.fontSize}px、元の3案の要素間は${separation}pxです。追加の中黒案は96・120・144pxで、ロゴと文字のサイズは変えていません。要素間の距離には直径8pxの中黒を含み、点の左右の空白はそれぞれ44・56・68pxです。\n\n${variants.map((variant, index) => `## ${index + 1}. ${variant.title}\n\n![${variant.title}](${variant.name}.png)\n`).join('\n')}\n再生成：\`node scripts/ogp/header-options.mjs\`。ブログの既存SVGロゴを使用しています。\n`
);
console.log({
  logoWidth: logo.info.width,
  headerHeight: heading.info.height,
  headingFontSize: heading.fontSize,
  separation,
  variants: variants.length
});
