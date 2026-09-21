// Comparison-only cards. The live generator does not import this module.
import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createCardLayers, WIDTH, HEIGHT } from './render.mjs';

const output = new URL('../../docs/ogp-branding-review/', import.meta.url);
const fullLogo = await readFile(new URL('oct-logo.svg', output), 'utf8');
const symbolSource = await readFile(new URL('./oct-symbol.svg', import.meta.url), 'utf8');
const fontfile = fileURLToPath(new URL('./fonts/NotoSerifJP-Regular.otf', import.meta.url));
const sample = { composer: 'モーツァルト', lines: ['交響曲第35番', '『ハフナー』'] };
const layers = await createCardLayers(sample);
const gap =
  (HEIGHT - layers.reduce((sum, layer) => sum + layer.info.height, 0)) / (layers.length + 1);
let top = gap;
const text = layers.map((layer) => {
  const item = { input: layer.data, left: 86, top: Math.round(top) };
  top += layer.info.height + gap;
  return item;
});
const symbol = await sharp(Buffer.from(symbolSource))
  .resize({ width: 392 })
  .png()
  .toBuffer({ resolveWithObject: true });
const rail = {
  input: Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><path d="M34 38V592" stroke="#456982" stroke-width="3"/></svg>`
  ),
  left: 0,
  top: 0
};
const watermark = {
  input: symbol.data,
  left: WIDTH - symbol.info.width,
  top: HEIGHT - symbol.info.height
};
async function name(size) {
  return sharp({
    text: {
      text: '<span foreground="#20384a">Orchestra Canvas Tokyo</span>',
      font: `Noto Serif JP ${size}`,
      fontfile,
      rgba: true,
      dpi: 72
    }
  })
    .trim()
    .png()
    .toBuffer({ resolveWithObject: true });
}
async function logo(width, color) {
  return sharp(Buffer.from(fullLogo.replaceAll('#fff', color)), { density: 144 })
    .resize({ width })
    .trim()
    .png()
    .toBuffer({ resolveWithObject: true });
}
const names = [
  '01-top-right-name',
  '02-heading-symbol',
  '03-bottom-right-logo',
  '04-logo-watermark',
  '05-vertical-name'
];
for (const [index, filename] of names.entries()) {
  let background = [rail, watermark];
  const foreground = text.map((item) => ({ ...item }));
  if (index === 0) {
    const brand = await name(32);
    foreground.push({
      input: brand.data,
      left: WIDTH - 54 - brand.info.width,
      top: Math.round(gap + (layers[0].info.height - brand.info.height) / 2)
    });
  } else if (index === 1) {
    const mark = await sharp(Buffer.from(symbolSource.replaceAll('#dbe4eb', '#20384a')))
      .resize({ height: 72 })
      .png()
      .toBuffer();
    foreground[0].left += 104;
    foreground.push({
      input: mark,
      left: 86,
      top: Math.round(gap + (layers[0].info.height - 72) / 2)
    });
  } else if (index === 2) {
    background = [rail];
    const brand = await logo(360, '#20384a');
    foreground.push({
      input: brand.data,
      left: WIDTH - 24 - brand.info.width,
      top: HEIGHT - 26 - brand.info.height
    });
  } else if (index === 3) {
    const brand = await logo(850, '#dbe4eb');
    background = [
      rail,
      { input: brand.data, left: WIDTH - brand.info.width, top: HEIGHT - brand.info.height }
    ];
  } else {
    background = [watermark];
    const brand = await name(30);
    const rotated = await sharp(brand.data).rotate(270).png().toBuffer({ resolveWithObject: true });
    foreground.push({
      input: rotated.data,
      left: 20,
      top: Math.round((HEIGHT - rotated.info.height) / 2)
    });
  }
  await sharp({ create: { width: WIDTH, height: HEIGHT, channels: 3, background: '#f8fafc' } })
    .composite([...background, ...foreground])
    .png({ compressionLevel: 9 })
    .toFile(fileURLToPath(new URL(`${filename}.png`, output)));
}
await writeFile(
  new URL('README.md', output),
  `# OGP branding proposals\n\nFive comparison-only proposals using the same Mozart/Haffner card. The active OGP renderer is unchanged.\n\n${names.map((name, i) => `## ${i + 1}. ${name.slice(3)}\n\n![Proposal ${i + 1}](${name}.png)\n`).join('\n')}\nRegenerate with \`node scripts/ogp/branding-options.mjs\`.\n\nThe full logo is copied from \`orchestra-canvas-tokyo/homepage/src/routes/logo.svg\`; the icon and regular font are the existing OGP assets. After selection, check the chosen layout against all article titles before applying it to the live generator.\n`
);
console.log('Rendered five branding proposals.');
