import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { escapeMarkup } from './content.mjs';

export const WIDTH = 1200;
export const HEIGHT = 630;
export const MAX_FONT_SIZE = 220;
export const HEADING_FONT_SIZE = 58;
// Increase the previous 59px outer gutters by 20%, rounded to whole pixels.
const DEFAULT_LOGO_MARGIN = Math.round(59 * 1.2);
const DEFAULT_LOGO_WIDTH = WIDTH - DEFAULT_LOGO_MARGIN * 2;
const fontfile = fileURLToPath(new URL('./fonts/NotoSerifJP-Regular.otf', import.meta.url));
const logoFile = fileURLToPath(new URL('./oct-wordmark.svg', import.meta.url));
const SAFE_WIDTH = 970;
const HEADER_WIDTH = WIDTH - 172;
const HEADER_SEPARATION = 96;
// Flat T in the outlined wordmark: cap top 102.52, roman baseline 236.67.
const WORDMARK_BASELINE = 236.67;
// Preserve the original header scale; only its label's vertical position is adjusted.
const wordmarkWidth = (heading) => Math.round((heading.info.height * 2438.71) / 193);
const logoSource = await readFile(logoFile, 'utf8');
const defaultLogoSource = await readFile(
  new URL('../../src/routes/header-large.svg', import.meta.url),
  'utf8'
);
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
      best = { ...layer, fontSize: midpoint * 2, text };
      lower = midpoint + 1;
    } else {
      upper = midpoint - 1;
    }
  }
  if (best) return best;
  throw new Error(`OGP title needs an explicit line break: ${text}`);
}

/** Fit the main title first so supporting text can never exceed its font size. */
export async function createCardLayers({ composer, lines, kind = 'article', mainTitleLine = 0 }) {
  if (kind !== 'default' && (lines.length < 1 || lines.length > 2)) {
    throw new Error('OGP titles must use one or two lines');
  }
  if (kind === 'default') {
    const logo = await sharp(Buffer.from(defaultLogoSource.replaceAll('#231815', '#20384a')), {
      density: 144
    })
      .resize({ width: DEFAULT_LOGO_WIDTH })
      .trim()
      .png()
      .toBuffer({ resolveWithObject: true });
    return [logo];
  }
  if (!Number.isInteger(mainTitleLine) || mainTitleLine < 0 || mainTitleLine >= lines.length) {
    throw new Error('Invalid main title line index');
  }
  const title = await fittedText(
    lines[mainTitleLine],
    MAX_FONT_SIZE,
    lines.length === 1 ? 220 : 130
  );
  const composerLayer = await fittedText(
    composer || '音楽コラム',
    Math.min(100, title.fontSize),
    104
  );
  // Branding size is independent of composer/title fitting, including long titles.
  const measuredHeading = await baselineHeading(HEADING_FONT_SIZE);
  const layers = [measuredHeading, composerLayer];
  for (const [index, line] of lines.entries()) {
    layers.push(index === mainTitleLine ? title : await fittedText(line, title.fontSize, 130));
  }
  return layers;
}

// Render a temporary Latin H on the same Pango line to recover its roman baseline
// after trimming. The red probe is excluded from the returned image.
async function baselineHeading(size) {
  const { data, info } = await sharp({
    text: {
      text: `<span foreground="#20384a" font_features="kern=1,palt=1" letter_spacing="${Math.round(-0.018 * size * 1024)}">曲目解説</span><span foreground="#ff0000">H</span>`,
      font: `Noto Serif JP ${size}`,
      fontfile,
      rgba: true,
      dpi: 72
    }
  })
    .raw()
    .toBuffer({ resolveWithObject: true });
  let left = info.width,
    right = -1,
    top = info.height,
    baseline = -1;
  for (let y = 0; y < info.height; y++)
    for (let x = 0; x < info.width; x++) {
      const offset = (y * info.width + x) * 4;
      if (data[offset + 3] === 0) continue;
      if (data[offset] > 200 && data[offset + 1] < 40) {
        if (data[offset + 3] > 128) baseline = Math.max(baseline, y + 1);
      } else {
        left = Math.min(left, x);
        right = Math.max(right, x);
        top = Math.min(top, y);
      }
    }
  if (baseline < 0 || right < left) throw new Error('Cannot measure header baseline');
  const layer = await textLayer('曲目解説', size);
  return { ...layer, text: '曲目解説', fontSize: size, baseline: baseline - top };
}

export async function createArticleHeader(heading) {
  const logo = await sharp(Buffer.from(logoSource.replaceAll('#fff', '#20384a')), {
    density: 144
  })
    .resize({ width: wordmarkWidth(heading) })
    .png()
    .toBuffer({ resolveWithObject: true });
  const romanBaseline = (logo.info.width * WORDMARK_BASELINE) / 2438.71;
  const headingTop = Math.round(romanBaseline - heading.baseline);
  if (headingTop < 0 || headingTop + heading.info.height > logo.info.height)
    throw new Error('Header label exceeds logo row');
  const width = logo.info.width + HEADER_SEPARATION + heading.info.width;
  if (width > HEADER_WIDTH) throw new Error('Article header exceeds safe width');
  const separator = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${logo.info.height}"><circle cx="${logo.info.width + HEADER_SEPARATION / 2}" cy="${Math.round((logo.info.height * 186.5) / 325.29 - heading.info.height / 2) + heading.info.height / 2}" r="4" fill="#456982"/></svg>`
  );
  return sharp({
    create: { width, height: logo.info.height, channels: 4, background: '#00000000' }
  })
    .composite([
      { input: logo.data, left: 0, top: 0 },
      { input: separator, left: 0, top: 0 },
      { input: heading.data, left: logo.info.width + HEADER_SEPARATION, top: headingTop }
    ])
    .png()
    .toBuffer({ resolveWithObject: true });
}

export async function renderCard(card) {
  const layers = await createCardLayers(card);
  if (card.kind !== 'default') layers[0] = await createArticleHeader(layers[0]);

  // Space actual visible glyph bounds evenly, including the top and bottom margins.
  const inkHeight = layers.reduce((height, layer) => height + layer.info.height, 0);
  const gap = (HEIGHT - inkHeight) / (layers.length + 1);
  if (gap < 24) throw new Error('OGP text leaves insufficient vertical breathing room');
  let top = gap;
  const overlays = layers.map((layer) => {
    const overlay = {
      input: layer.data,
      left: card.kind === 'default' ? Math.round((WIDTH - layer.info.width) / 2) : 86,
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
        left: WIDTH - symbol.info.width,
        top: HEIGHT - symbol.info.height
      },
      ...overlays
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();
}
