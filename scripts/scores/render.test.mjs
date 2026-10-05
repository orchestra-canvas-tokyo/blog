import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { DOMParser } from '@xmldom/xmldom';
import createVerovioModule from 'verovio/wasm';
import { VerovioToolkit } from 'verovio/esm';
import { completeOpenSpans, renderScore } from './render.mjs';

const directory = 'src/lib/posts/regular-17/20260724-r-strauss-alpine-symphony';
const parse = (xml) => new DOMParser().parseFromString(xml, 'application/xml');
const text = (element, tag) => element.getElementsByTagName(tag)[0]?.textContent || '';

// Transcribed from the original images, including chord and grace-note boundaries.
const expected = [
  [
    'Db3/whole',
    'Bb2/half Bb2/quarter.. F3/16th',
    'Gb3/whole Bb3/whole+',
    'Gb3/whole Bb3/whole+',
    'A3/whole D4/whole+',
    'G2/half Bb2/half+ A2/half C3/half+',
    'Bb2/whole Db3/whole+'
  ],
  [
    'G2/quarter',
    'Eb3/quarter G3/quarter Bb2/quarter Ab3/eighth. F3/16th',
    'Bb3/half. C4/eighth. D4/16th',
    'Eb4/quarter C4/eighth. D4/16th Bb3/quarter Eb4/eighth. F4/16th',
    'G4/half.'
  ],
  [
    'C6/half B5/quarter. A5/eighth',
    'A5/half G5/half',
    'A5/half G5/quarter. F5/eighth',
    'F5/half E5/half',
    'F5/half E5/quarter. D5/eighth',
    'C5/half B4/half',
    'C5/quarter B4/eighth A4/eighth G4/quarter. F4/eighth',
    'E4/quarter.'
  ],
  [
    'C#6/half C#6/eighth. B#5/16th B#5/eighth. C#6/16th',
    'C#6/eighth. D6/16th D6/eighth. C#6/16th C#6/eighth. G#5/16th G#5/eighth. A5/16th',
    'F5/half F5/eighth F#5/eighth A5/eighth G5/eighth',
    'F5/eighth F#5/eighth A5/eighth G5/eighth B#4/eighth C#5/eighth E5/eighthg D5/eighth B4/eighth',
    'A4/half'
  ]
];

test('reviewed MusicXML preserves the image pitches, rhythms, key and clef', async () => {
  for (let index = 0; index < 4; index++) {
    const document = parse(
      await readFile(`${directory}/score-example-${index + 1}.musicxml`, 'utf8')
    );
    const measures = [...document.getElementsByTagName('measure')];
    const actual = measures.map((measure) =>
      [...measure.getElementsByTagName('note')]
        .map((note) => {
          const alter = { '-1': 'b', 1: '#' }[text(note, 'alter')] || '';
          const dots = '.'.repeat(note.getElementsByTagName('dot').length);
          const chord = note.getElementsByTagName('chord').length ? '+' : '';
          const grace = note.getElementsByTagName('grace').length ? 'g' : '';
          return `${text(note, 'step')}${alter}${text(note, 'octave')}/${text(note, 'type')}${dots}${chord}${grace}`;
        })
        .join(' ')
    );
    assert.deepEqual(actual, expected[index]);
    assert.equal(text(document, 'fifths'), ['-5', '-3', '', '3'][index]);
    assert.equal(text(document, 'sign'), ['F', 'F', 'G', 'G'][index]);
    assert.equal(text(document, 'beats'), index === 1 ? '' : '4');
    assert.equal(document.getElementsByTagName('rest').length, 0);
    const divisions = Number(text(document, 'divisions'));
    for (const measure of measures.slice(1, -1)) {
      const duration = [...measure.getElementsByTagName('note')]
        .filter((note) => !note.getElementsByTagName('chord').length)
        .reduce((sum, note) => sum + Number(text(note, 'duration')), 0);
      assert.equal(
        duration / divisions,
        4,
        `Excerpt ${index + 1}, measure ${measure.getAttribute('number')}`
      );
    }
    assert.equal(document.getElementsByTagName('accent').length, index === 1 ? 3 : 0);
    assert.equal(document.getElementsByTagName('staccato').length, 0);
  }
});

test('rendering keeps cropped ties/slurs, produces vector glyphs, and is deterministic', async () => {
  const toolkit = new VerovioToolkit(await createVerovioModule());
  try {
    for (let index = 1; index <= 4; index++) {
      const source = `${directory}/score-example-${index}.musicxml`;
      const svg = await renderScore(toolkit, source);
      assert.equal(svg, await renderScore(toolkit, source));
      assert.match(svg, /viewBox=/);
      assert.match(svg, /<path/);
      assert.doesNotMatch(svg, /<image/);
      const document = parse(svg);
      const count = (name) =>
        [...document.getElementsByTagName('g')].filter((g) => g.getAttribute('class') === name)
          .length;
      assert.equal(count('tie'), [0, 5, 0, 0, 2][index]);
      assert.equal(count('slur'), [0, 0, 2, 7, 11][index]);
      const mobile = await renderScore(toolkit, source, 'mobile');
      assert.equal(mobile, await renderScore(toolkit, source, 'mobile'));
      const mobileDocument = parse(mobile);
      const groups = [...mobileDocument.getElementsByTagName('g')];
      assert.ok(groups.filter((g) => g.getAttribute('class') === 'system').length > 1);
      assert.equal(
        groups.filter((g) => g.getAttribute('class') === 'note').length,
        [0, 16, 16, 21, 28][index]
      );
      assert.doesNotMatch(mobile, /Voice/);
      // Spans crossing system boundaries are drawn in multiple segments.
      for (const name of ['tie', 'slur']) {
        assert.ok(groups.filter((g) => g.getAttribute('class') === name).length >= count(name));
      }
    }
    // Audiveris exports ZIP-compressed MXL; do not pass a Node Buffer as an ArrayBuffer.
    const raw = await renderScore(toolkit, `${directory}/omr/score-example-2.mxl`);
    assert.match(raw, /class="note"/);
  } finally {
    toolkit.destroy();
  }
});

test('an unclosed span inside an excerpt requires correction', () => {
  assert.throws(
    () => completeOpenSpans('<mei><measure><tie startid="#n1" /></measure><measure /></mei>'),
    /correct the MusicXML/
  );
});
