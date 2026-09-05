import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { escapeMarkup } from './content.mjs';

export const WIDTH = 1200;
export const HEIGHT = 630;
const fontfile = fileURLToPath(new URL('./fonts/NotoSerifJP-Bold.otf', import.meta.url));
const logoFile = fileURLToPath(new URL('../../src/routes/header-large.svg', import.meta.url));
const SAFE_WIDTH = WIDTH - 80;

/** Use actual bold outlines, proportional Japanese spacing, and restrained negative tracking. */
async function textLayer(text, size) {
  const tracking = Math.round(-0.018 * size * 1024);
  return sharp({
    text: {
      text: `<span foreground="#171717" font_features="kern=1,palt=1" letter_spacing="${tracking}">${escapeMarkup(text)}</span>`,
      font: `Noto Serif JP Bold ${size}`,
      fontfile,
      rgba: true,
      dpi: 72
    }
  })
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
  const logo = await sharp(logoFile).resize({ width: 560 }).png().toBuffer();
  const overlays = [{ input: logo, left: 320, top: 28 }];
  const composerLayer = await fittedText(composer || '音楽コラム', 112, 110);
  overlays.push({
    input: composerLayer.data,
    left: Math.round((WIDTH - composerLayer.info.width) / 2),
    top: Math.round(170 + (110 - composerLayer.info.height) / 2)
  });

  const titleTop = 310;
  const titleSpace = 280;
  const lineGap = 18;
  const lineHeight = Math.floor((titleSpace - (lines.length - 1) * lineGap) / lines.length);
  const titleLayers = [];
  for (const line of lines) titleLayers.push(await fittedText(line, 220, lineHeight));
  const titleHeight =
    titleLayers.reduce((sum, layer) => sum + layer.info.height, 0) + (lines.length - 1) * lineGap;
  let top = Math.round(titleTop + (titleSpace - titleHeight) / 2);
  for (const layer of titleLayers) {
    overlays.push({ input: layer.data, left: Math.round((WIDTH - layer.info.width) / 2), top });
    top += layer.info.height + lineGap;
  }
  return sharp({ create: { width: WIDTH, height: HEIGHT, channels: 3, background: '#fff' } })
    .composite(overlays)
    .png({ compressionLevel: 9 })
    .toBuffer();
}
