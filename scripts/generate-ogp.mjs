import { readdir, readFile, mkdir, writeFile, rm } from 'node:fs/promises';
import { dirname, basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { composers } from '../src/lib/posts/composers.ts';
import { readMetadata, getTitleLines } from './ogp/content.mjs';
import { renderCard } from './ogp/render.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = join(root, 'static/ogp');
const files = await readdir(join(root, 'src/lib/posts'), { recursive: true });
const cards = [
  { slug: 'default', composer: 'PROGRAM NOTES', lines: ['音楽を、もっと深く。'], isDefault: true }
];
const slugs = new Set(['default']);
for (const file of files.filter((file) => file.endsWith('/post.svelte')).sort()) {
  const metadata = readMetadata(await readFile(join(root, 'src/lib/posts', file), 'utf8'));
  if (!metadata.published) continue;
  const slug = basename(dirname(file));
  if (slugs.has(slug)) throw new Error(`Duplicate OGP slug: ${slug}`);
  slugs.add(slug);
  if (metadata.composerSlug && !composers[metadata.composerSlug])
    throw new Error(`Unknown composer: ${metadata.composerSlug}`);
  cards.push({
    slug,
    composer: composers[metadata.composerSlug]?.shortName,
    lines: getTitleLines(slug, metadata.title)
  });
}
await mkdir(output, { recursive: true });
for (const card of cards) await writeFile(join(output, `${card.slug}.png`), await renderCard(card));
// Remove stale generated cards only after every current card has rendered successfully.
for (const file of await readdir(output)) {
  if (file.endsWith('.png') && !slugs.has(file.slice(0, -4))) await rm(join(output, file));
}
console.log(`Generated ${cards.length} OGP images (1200 × 630) in static/ogp`);
