import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { readMetadata, simplifyTitle, getTitleLines, escapeMarkup } from './content.mjs';
import { renderCard, WIDTH, HEIGHT } from './render.mjs';

test('card copy removes keys and catalogues while retaining work numbers and nicknames', () => {
  assert.equal(
    simplifyTitle('交響曲第35番 ニ長調 K. 385 『ハフナー』'),
    '交響曲第35番 『ハフナー』'
  );
  assert.equal(simplifyTitle('交響曲第1番 変イ長調 作品 55'), '交響曲第1番');
  assert.equal(simplifyTitle('交響曲第8番 ハ短調 WAB108'), '交響曲第8番');
  assert.equal(simplifyTitle('ピアノ協奏曲第3番 Op.30'), 'ピアノ協奏曲第3番');
  assert.equal(
    simplifyTitle('バレエ音楽 『火の鳥』組曲（1945年版）'),
    'バレエ音楽 『火の鳥』組曲（1945年版）'
  );
});

test('long-title line breaks preserve identifying subtitles', () => {
  assert.deepEqual(getTitleLines('20260724-mozart-haffner-symphony', ''), [
    '交響曲第35番',
    '『ハフナー』'
  ]);
  assert.match(getTitleLines('20251111-stravinsky-the-firebird-suite', '').join(''), /1945年版/);
});

test('metadata reader uses the module script, ignores comments, and never executes imports', () => {
  const metadata = readMetadata(`<script lang="ts" module>
    import Image from './does-not-exist.png';
    // title: 'Wrong', published: true
    export const metadata: Metadata = { title: '正しい曲名', published: false };
  </script><p>title: 'Article text'</p>`);
  assert.deepEqual(metadata, { title: '正しい曲名', published: false });
  assert.throws(
    () => readMetadata('<script module>export const metadata = load();</script>'),
    /object literal/
  );
});

test('Pango markup is escaped and Japanese text renders to an OGP-size PNG', async () => {
  assert.equal(escapeMarkup('<&>'), '&lt;&amp;&gt;');
  const buffer = await renderCard({
    composer: 'モーツァルト',
    lines: ['交響曲第35番', '『ハフナー』']
  });
  const metadata = await sharp(buffer).metadata();
  assert.equal(metadata.format, 'png');
  assert.equal(metadata.width, WIDTH);
  assert.equal(metadata.height, HEIGHT);
  const stats = await sharp(buffer).stats();
  assert.ok(stats.entropy > 0, 'Card must not be a blank image');
});

test('every published article has a generated card; no unpublished article has one', async () => {
  const root = fileURLToPath(new URL('../../', import.meta.url));
  const files = await readdir(join(root, 'src/lib/posts'), { recursive: true });
  const expected = ['default.png'];
  for (const file of files.filter((file) => file.endsWith('/post.svelte'))) {
    const metadata = readMetadata(await readFile(join(root, 'src/lib/posts', file), 'utf8'));
    if (metadata.published) expected.push(`${file.split('/').at(-2)}.png`);
  }
  assert.deepEqual((await readdir(join(root, 'static/ogp'))).sort(), expected.sort());
  for (const file of expected) {
    const metadata = await sharp(join(root, 'static/ogp', file)).metadata();
    assert.equal(metadata.width, WIDTH, file);
    assert.equal(metadata.height, HEIGHT, file);
  }
});
