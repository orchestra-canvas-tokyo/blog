import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { escapeMarkup } from './content.mjs';

export const WIDTH = 1200;
export const HEIGHT = 630;
const fontfile = fileURLToPath(new URL('./fonts/NotoSerifJP-Regular.otf', import.meta.url));
const logoFile = fileURLToPath(
  new URL('../../src/routes/orchestra-canvas-tokyo.svg', import.meta.url)
);

/** Render with a bundled Japanese font, independent of fonts installed on the build host. */
async function textLayer(text, size, color = '#171717') {
  return sharp({
    text: {
      text: `<span foreground="${color}">${escapeMarkup(text)}</span>`,
      font: `Noto Serif JP ${size}`,
      fontfile,
      rgba: true,
      dpi: 72
    }
  })
    .png()
    .toBuffer({ resolveWithObject: true });
}

async function fittedText(text, initialSize, maxWidth) {
  for (let size = initialSize; size >= 36; size -= 2) {
    const layer = await textLayer(text, size);
    if (layer.info.width <= maxWidth) return layer;
  }
  throw new Error(`OGP title needs an explicit line break: ${text}`);
}

export async function renderCard({ composer, lines, isDefault = false }) {
  const logo = await sharp(logoFile).resize({ width: 440 }).png().toBuffer();
  const background =
    Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
    <rect width="1200" height="630" fill="#fff"/>
    <path d="M60 136H1140M60 554H1140" stroke="#d9d9d6"/>
    <path d="M60 554H132" stroke="#171717" stroke-width="3"/>
  </svg>`);
  const overlays = [{ input: logo, left: 380, top: 44 }];
  const composerLayer = await fittedText(composer || '音楽コラム', 44, 1020);
  overlays.push({
    input: composerLayer.data,
    left: Math.round((WIDTH - composerLayer.info.width) / 2),
    top: 188
  });
  const titleLayers = [];
  for (const line of lines)
    titleLayers.push(await fittedText(line, lines.length > 1 ? 76 : 92, 1060));
  const titleHeight =
    titleLayers.reduce((sum, layer) => sum + layer.info.height, 0) + (lines.length - 1) * 26;
  if (titleHeight > 238) throw new Error(`OGP title exceeds safe height: ${lines.join(' / ')}`);
  let top = Math.round(272 + (230 - titleHeight) / 2);
  for (const layer of titleLayers) {
    overlays.push({ input: layer.data, left: Math.round((WIDTH - layer.info.width) / 2), top });
    top += layer.info.height + 26;
  }
  const label = await textLayer(
    isDefault ? '公式ブログ' : '曲目解説・プログラムノート',
    20,
    '#595959'
  );
  const blog = await textLayer('BLOG', 22);
  overlays.push(
    { input: label.data, left: 60, top: 580 },
    { input: blog.data, left: WIDTH - 60 - blog.info.width, top: 579 }
  );
  return sharp(background).composite(overlays).png({ compressionLevel: 9 }).toBuffer();
}
