// Review-only proposals. These are not used by the live OGP generator.
import sharp from 'sharp';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { renderCard, WIDTH, HEIGHT } from './render.mjs';
import { escapeMarkup } from './content.mjs';

const output = new URL('../../docs/ogp-style-options/', import.meta.url);
const fontfile = fileURLToPath(new URL('./fonts/NotoSerifJP-Regular.otf', import.meta.url));
const logoSource = await readFile(
  new URL('../../src/routes/header-large.svg', import.meta.url),
  'utf8'
);
const sample = { composer: 'モーツァルト', lines: ['交響曲第35番', '『ハフナー』'] };

const options = [
  { id: '01-gallery', current: true },
  {
    id: '02-concert-programme',
    paper: '#f4efe3',
    ink: '#332c25',
    align: 'center',
    width: 1000,
    logoWidth: 500,
    composerSize: 92,
    titleSize: 166,
    decoration: `<g fill="none" stroke="#a89778" stroke-width="1">
      <rect x="24" y="24" width="1152" height="582"/>
      <rect x="31" y="31" width="1138" height="568"/>
      <path d="M14 24L24 14L34 24L24 34Z M1166 24L1176 14L1186 24L1176 34Z M14 606L24 596L34 606L24 616Z M1166 606L1176 596L1186 606L1176 616Z" fill="#f4efe3"/>
    </g>`
  },
  {
    id: '03-editorial',
    paper: '#f8fafc',
    ink: '#20384a',
    align: 'left',
    width: 970,
    logoWidth: 480,
    composerSize: 100,
    titleSize: 180,
    decoration: `<path d="M34 38V592" stroke="#456982" stroke-width="3"/>
      <g fill="none" stroke="#dbe4eb" stroke-width="2">
        <path d="M994 42L1190 382H798Z M1092 212H896 M1043 127L847 467 M945 127L1141 467"/>
      </g>
      <path d="M1158 546L1182 588H1134Z" fill="#456982"/>`
  },
  {
    id: '04-night-recital',
    paper: '#181d22',
    ink: '#f5f0e6',
    align: 'center',
    width: 1060,
    logoWidth: 540,
    composerSize: 104,
    titleSize: 192,
    decoration: `<g fill="none" stroke="#a18a5f" stroke-width="1.5">
      <path d="M24 70V24H70 M1130 24H1176V70 M24 560V606H70 M1130 606H1176V560"/>
      <path d="M591 613L600 598L609 613Z"/>
    </g>`
  },
  {
    id: '05-canvas-signature',
    paper: '#fff9f4',
    ink: '#382c28',
    align: 'right',
    width: 1030,
    logoWidth: 500,
    composerSize: 100,
    titleSize: 182,
    decoration: `<g fill="none" stroke="#eeddd1" stroke-width="1.5">
      <circle cx="-10" cy="645" r="170"/><circle cx="-10" cy="645" r="205"/><circle cx="-10" cy="645" r="240"/>
    </g>
    <path d="M1170 20V76" stroke="#b84f37" stroke-width="4"/>
    <rect x="32" y="564" width="34" height="34" rx="1" fill="#b84f37"/>
    <path d="M39 589L49 572L59 589Z" stroke="#fff9f4" stroke-width="1.2" fill="none"/>`
  }
];

async function fit(text, size, height, option) {
  let low = 18;
  let high = Math.floor(size / 2);
  let best;
  while (low <= high) {
    const step = Math.floor((low + high) / 2);
    const pixels = step * 2;
    const layer = await sharp({
      text: {
        text: `<span foreground="${option.ink}" font_features="kern=1,palt=1" letter_spacing="${Math.round(-0.018 * pixels * 1024)}">${escapeMarkup(text)}</span>`,
        font: `Noto Serif JP ${pixels}`,
        fontfile,
        rgba: true,
        dpi: 72
      }
    })
      .trim()
      .png()
      .toBuffer({ resolveWithObject: true });
    if (layer.info.width <= option.width && layer.info.height <= height) {
      best = layer;
      low = step + 1;
    } else high = step - 1;
  }
  if (!best) throw new Error(`Text does not fit ${option.id}: ${text}`);
  return best;
}

async function renderOption(option) {
  if (option.current) return renderCard(sample);
  const logo = await sharp(Buffer.from(logoSource.replaceAll('#231815', option.ink)))
    .resize({ width: option.logoWidth })
    .trim()
    .png()
    .toBuffer({ resolveWithObject: true });
  const layers = [logo, await fit(sample.composer, option.composerSize, 104, option)];
  for (const line of sample.lines) layers.push(await fit(line, option.titleSize, 130, option));
  const gap =
    (HEIGHT - layers.reduce((sum, layer) => sum + layer.info.height, 0)) / (layers.length + 1);
  if (gap < 24) throw new Error(`Insufficient spacing: ${option.id}`);
  let top = gap;
  const overlays = layers.map((layer) => {
    const left =
      option.align === 'left'
        ? 86
        : option.align === 'right'
          ? WIDTH - 64 - layer.info.width
          : (WIDTH - layer.info.width) / 2;
    const overlay = { input: layer.data, left: Math.round(left), top: Math.round(top) };
    top += layer.info.height + gap;
    return overlay;
  });
  const ornament = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">${option.decoration}</svg>`
  );
  return sharp({ create: { width: WIDTH, height: HEIGHT, channels: 3, background: option.paper } })
    .composite([{ input: ornament, left: 0, top: 0 }, ...overlays])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

await mkdir(output, { recursive: true });
for (const option of options) {
  await writeFile(new URL(`${option.id}.png`, output), await renderOption(option));
}
console.log('Generated five review-only OGP styles in docs/ogp-style-options');
