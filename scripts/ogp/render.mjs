import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { escapeMarkup } from './content.mjs';

export const WIDTH = 1200;
export const HEIGHT = 630;
const fontfile = fileURLToPath(new URL('./fonts/NotoSerifJP-Regular.otf', import.meta.url));
const logoFile = fileURLToPath(new URL('../../src/routes/header-large.svg', import.meta.url));
const SAFE_WIDTH = WIDTH - 80;

/** Use regular-weight outlines, proportional Japanese spacing, and restrained negative tracking. */
async function textLayer(text, size) {
  const tracking = Math.round(-0.018 * size * 1024);
  return sharp({
    text: {
      text: `<span foreground="#171717" font_features="kern=1,palt=1" letter_spacing="${tracking}">${escapeMarkup(text)}</span>`,
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
  const logo = await sharp(logoFile)
    .resize({ width: 560 })
    .trim()
    .png()
    .toBuffer({ resolveWithObject: true });
  const composerLayer = await fittedText(composer || '音楽コラム', 112, 110);
  const layers = [logo, composerLayer];
  for (const line of lines) {
    layers.push(await fittedText(line, 220, lines.length === 1 ? 220 : 130));
  }

  // Space actual visible glyph bounds evenly, including the top and bottom margins.
  const inkHeight = layers.reduce((height, layer) => height + layer.info.height, 0);
  const gap = (HEIGHT - inkHeight) / (layers.length + 1);
  if (gap < 24) throw new Error('OGP text leaves insufficient vertical breathing room');
  let top = gap;
  const overlays = layers.map((layer) => {
    const overlay = {
      input: layer.data,
      left: Math.round((WIDTH - layer.info.width) / 2),
      top: Math.round(top)
    };
    top += layer.info.height + gap;
    return overlay;
  });

  // Small geometric corner ornaments echo the masthead's triangular mark.
  // Kept outside the content area; no horizontal dividers or footer copy.
  const decoration =
    Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 1200 630">
    <g fill="none" stroke="#c9c2ba" stroke-width="1.25" stroke-linejoin="round">
      <path d="M18 50V18H50 M1150 18H1182V50 M18 580V612H50 M1150 612H1182V580"/>
      <path d="M27 38L33 27L39 38Z M1161 38L1167 27L1173 38Z M27 603L33 592L39 603Z M1161 603L1167 592L1173 603Z"/>
    </g>
  </svg>`);
  return sharp({ create: { width: WIDTH, height: HEIGHT, channels: 3, background: '#fff' } })
    .composite([{ input: decoration, left: 0, top: 0 }, ...overlays])
    .png({ compressionLevel: 9 })
    .toBuffer();
}
