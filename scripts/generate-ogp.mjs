import { readdir, readFile, mkdir, writeFile, rm } from 'node:fs/promises';
import { dirname, basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { composers } from '../src/lib/posts/composers.ts';
import { readMetadata, getTitleLines } from './ogp/content.mjs';
import { renderCard } from './ogp/render.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = join(root, 'static/ogp');
const files = await readdir(join(root, 'src/lib/posts'), { recursive: true });
const cards = [{ slug: 'default', kind: 'default', lines: ['曲目解説'] }];
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
    lines: getTitleLines(metadata),
    mainTitleLine: metadata.ogpMainTitleLine ?? 0
  });
}
await mkdir(output, { recursive: true });
for (const card of cards) await writeFile(join(output, `${card.slug}.png`), await renderCard(card));
// Remove stale generated cards only after every current card has rendered successfully.
for (const file of await readdir(output)) {
  if (file.endsWith('.png') && !slugs.has(file.slice(0, -4))) await rm(join(output, file));
}
console.log(`Generated ${cards.length} OGP images (1200 × 630) in static/ogp`);

if (process.argv.includes('--review')) {
  const review = join(root, 'docs/ogp-review');
  await mkdir(review, { recursive: true });
  const markdown = [
    '# OGP review gallery',
    '',
    `${cards.length} images: ${cards.length - 1} published articles and the default sharing card.`,
    'Each preview is the exact 1200 × 630 PNG generated for deployment.',
    '',
    'Review composer/title legibility, line breaks, equal vertical spacing, and the pale OCT logo at the bottom-right edge.',
    'Keys and catalogue numbers are omitted only from sharing cards; article content is unchanged.',
    '',
    'Regenerate with `npm run review:ogp`. Commit this index and its PNGs together.',
    ''
  ];
  for (const [index, card] of cards.entries()) {
    await writeFile(
      join(review, `${card.slug}.png`),
      await readFile(join(output, `${card.slug}.png`))
    );
    markdown.push(
      `## ${index + 1}. ${card.slug}`,
      '',
      card.kind === 'default'
        ? 'Default card: blog logo + 曲目解説 only.'
        : `Composer: ${card.composer || '音楽コラム'}`,
      '',
      `Card title: ${card.lines.join(' / ')}`,
      '',
      `Main title row: ${(card.mainTitleLine ?? 0) + 1}`,
      '',
      `![OGP preview ${index + 1}: ${card.slug}](${card.slug}.png)`,
      '',
      `[Full-size PNG](${card.slug}.png)`,
      ''
    );
  }
  for (const file of await readdir(review)) {
    if (file.endsWith('.png') && !slugs.has(file.slice(0, -4))) await rm(join(review, file));
  }
  await writeFile(join(review, 'README.md'), markdown.join('\n'));
  console.log(`Updated review gallery with ${cards.length} exact image snapshots`);
}
