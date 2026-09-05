import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { escapeMarkup } from './content.mjs';

export const WIDTH = 1200;
export const HEIGHT = 630;
const fontfile = fileURLToPath(new URL('./fonts/NotoSerifJP-Regular.otf', import.meta.url));
const logoFile = fileURLToPath(new URL('../../src/routes/header-large.svg', import.meta.url));
const SAFE_WIDTH = 970;
const logoSource = await readFile(logoFile, 'utf8');
const symbolFile = fileURLToPath(new URL('./oct-symbol.svg', import.meta.url));

/** Use regular-weight outlines, proportional Japanese spacing, and restrained negative tracking. */
async function textLayer(text, size) {
  const tracking = Math.round(-0.018 * size * 1024);
  return sharp({
    text: {
      text: `<span foreground="#20384a" font_features="kern=1,palt=1" letter_spacing="${tracking}">${escapeMarkup(text)}</span>`,
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

/** Fit to the actual glyph bounds in both dimensions, without distorting the lettering. */
async function fittedText(text, initialSize, maxHeight) {
  let lower = 18;
  let upper = Math.floor(initialSize / 2);
  let best;
  // Search even font sizes rather than rasterizing every intermediate size.
  while (lower <= upper) {
    const midpoint = Math.floor((lower + upper) / 2);
    const layer = await textLayer(text, midpoint * 2);
    if (layer.info.width <= SAFE_WIDTH && layer.info.height <= maxHeight) {
      best = layer;
      lower = midpoint + 1;
    } else {
      upper = midpoint - 1;
    }
  }
  if (best) return best;
  throw new Error(`OGP title needs an explicit line break: ${text}`);
}

export async function renderCard({ composer, lines }) {
  if (lines.length < 1 || lines.length > 2) {
    throw new Error('OGP titles must use one or two lines');
  }
  const logo = await sharp(Buffer.from(logoSource.replaceAll('#231815', '#20384a')))
    .resize({ width: 480 })
    .trim()
    .png()
    .toBuffer({ resolveWithObject: true });
  const composerLayer = await fittedText(composer || '音楽コラム', 100, 104);
  const layers = [logo, composerLayer];
  for (const line of lines) {
    layers.push(
      await fittedText(line, lines.length === 1 ? 220 : 180, lines.length === 1 ? 220 : 130)
    );
  }

  // Space actual visible glyph bounds evenly, including the top and bottom margins.
  const inkHeight = layers.reduce((height, layer) => height + layer.info.height, 0);
  const gap = (HEIGHT - inkHeight) / (layers.length + 1);
  if (gap < 24) throw new Error('OGP text leaves insufficient vertical breathing room');
  let top = gap;
  const overlays = layers.map((layer) => {
    const overlay = {
      input: layer.data,
      left: 86,
      top: Math.round(top)
    };
    top += layer.info.height + gap;
    return overlay;
  });

  // Exact OCT symbol outlines from the homepage logo, used as a faint watermark.
  const symbol = await sharp(symbolFile)
    .resize({ width: 392 })
    .png()
    .toBuffer({ resolveWithObject: true });
  const decoration = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}"><path d="M34 38V592" stroke="#456982" stroke-width="3"/></svg>`
  );
  return sharp({ create: { width: WIDTH, height: HEIGHT, channels: 3, background: '#f8fafc' } })
    .composite([
      { input: decoration, left: 0, top: 0 },
      {
        input: symbol.data,
        left: WIDTH - symbol.info.width - 14,
        top: HEIGHT - symbol.info.height - 18
      },
      ...overlays
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();
}
