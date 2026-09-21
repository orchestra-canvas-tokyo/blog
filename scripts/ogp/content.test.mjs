import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { readMetadata, simplifyTitle, getTitleLines, escapeMarkup } from './content.mjs';
import {
  renderCard,
  createCardLayers,
  createArticleHeader,
  MAX_FONT_SIZE,
  WIDTH,
  HEIGHT
} from './render.mjs';

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

test('post metadata supplies exact line breaks with a simplified fallback', () => {
  const metadata = readMetadata(`<script module>export const metadata = {
    title: '元の記事タイトル', published: true,
    ogpTitleLines: ['バレエ音楽『火の鳥』組曲', '（1945年版）'], ogpMainTitleLine: 0
  };</script>`);
  assert.deepEqual(getTitleLines(metadata), ['バレエ音楽『火の鳥』組曲', '（1945年版）']);
  assert.equal(metadata.title, '元の記事タイトル');
  assert.deepEqual(getTitleLines({ title: '交響曲第35番 ニ長調 K. 385' }), ['交響曲第35番']);
});

test('invalid or executable OGP metadata is rejected', () => {
  const parse = (fields) =>
    readMetadata(`<script module>export const metadata = {
    title: '曲名', published: true, ${fields}
  };</script>`);
  for (const fields of [
    'ogpTitleLines: []',
    "ogpTitleLines: [' ']",
    "ogpTitleLines: ['a', 'b', 'c']",
    "ogpTitleLines: ['a\\nb']",
    'ogpTitleLines: [42]',
    'ogpTitleLines: makeLines()',
    "ogpTitleLines: ['a', ...extra]",
    'ogpMainTitleLine: 1',
    "ogpTitleLines: ['a', 'b'], ogpMainTitleLine: 2",
    "ogpTitleLines: ['a', 'b'], ogpMainTitleLine: 0.5"
  ])
    assert.throws(() => parse(fields), /ogpTitleLines|ogpMainTitleLine/);
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

test('supporting text never exceeds the fitted main title size', async () => {
  const layers = await createCardLayers({
    composer: 'リスト',
    lines: ['メフィスト・ワルツ第1番「村の居酒屋での踊り」', '短い副題']
  });
  const [, composer, title, subtitle] = layers;
  assert.ok(title.fontSize < 100, 'Exercise a title that shrinks below the composer cap');
  assert.ok(title.fontSize <= MAX_FONT_SIZE);
  assert.ok(composer.fontSize <= title.fontSize);
  assert.ok(subtitle.fontSize <= title.fontSize);
});

test('default card contains only the masthead', async () => {
  const layers = await createCardLayers({ kind: 'default' });
  assert.equal(layers.length, 1);
  assert.equal(layers[0].text, undefined);
});

test('second-row main title controls hierarchy without changing display order', async () => {
  const lines = ['「ウェストサイドストーリー」より', 'シンフォニックダンス'];
  const [, composer, intro, main] = await createCardLayers({
    composer: 'バーンスタイン',
    lines,
    mainTitleLine: 1
  });
  assert.equal(intro.text, lines[0]);
  assert.equal(main.text, lines[1]);
  assert.ok(intro.fontSize <= main.fontSize);
  assert.ok(composer.fontSize <= main.fontSize);
});

test('article heading uses exactly the fitted composer font size', async () => {
  for (const composer of ['リスト', 'ヨハン・シュトラウス2世']) {
    const [heading, name, title] = await createCardLayers({ composer, lines: ['交響曲第1番'] });
    assert.equal(heading.text, '曲目解説');
    assert.equal(heading.fontSize, name.fontSize);
    assert.ok(heading.fontSize <= title.fontSize);
  }
});

test('mixed-script header shares a roman baseline with Japanese near Latin cap height', async () => {
  for (const composer of ['モーツァルト', 'ヨハン・シュトラウス2世']) {
    const [heading] = await createCardLayers({ composer, lines: ['交響曲第1番'] });
    const header = await createArticleHeader(heading);
    assert.ok(header.info.width <= WIDTH - 172);
    const logoWidth = header.info.width - 96 - heading.info.width;
    const { data, info } = await sharp(header.data)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const bounds = (left, right) => {
      let top = info.height,
        bottom = -1;
      for (let y = 0; y < info.height; y++) {
        for (let x = left; x < right; x++) {
          if (data[(y * info.width + x) * 4 + 3] > 128) {
            top = Math.min(top, y);
            bottom = Math.max(bottom, y);
          }
        }
      }
      return { top, bottom, height: bottom - top + 1 };
    };
    const label = bounds(logoWidth + 96, info.width);
    const romanBaseline = (logoWidth * 236.67) / 2438.71;
    assert.ok(Math.abs(label.top + heading.baseline - romanBaseline) <= 1.5);
    const capHeight = (logoWidth * 134.15) / 2438.71;
    assert.ok(
      Math.abs(label.height / capHeight - 1.08) < 0.05,
      'Japanese ink is approximately 8% taller than capitals'
    );
    assert.ok(
      heading.baseline < heading.info.height,
      'Japanese ink extends below the roman baseline'
    );
    for (let y = 0; y < info.height; y++)
      for (let x = logoWidth + 96; x < info.width; x++) {
        const offset = (y * info.width + x) * 4;
        assert.ok(
          !(data[offset + 3] > 0 && data[offset] > 200 && data[offset + 1] < 40),
          'Baseline probe must not appear in output'
        );
      }
  }
});
