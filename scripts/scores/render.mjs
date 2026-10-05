import { readFile, writeFile } from 'node:fs/promises';
import createVerovioModule from 'verovio/wasm';
import { VerovioToolkit } from 'verovio/esm';
import { DOMParser, XMLSerializer } from '@xmldom/xmldom';

/** Verovio imports open MusicXML spans but needs an MEI timestamp to draw them. */
export function completeOpenSpans(mei) {
  const document = new DOMParser().parseFromString(mei, 'application/xml');
  const elements = [...document.getElementsByTagName('*')];
  const spans = elements.filter(
    (element) =>
      ['tie', 'slur'].includes(element.localName) &&
      element.hasAttribute('startid') &&
      !element.hasAttribute('endid') &&
      !element.hasAttribute('tstamp2')
  );
  if (!spans.length) return null;
  const measures = elements.filter((element) => element.localName === 'measure');
  for (const span of spans) {
    // Only spans cropped at the excerpt's end are supported. Interior omissions are errors.
    if (span.parentNode !== measures.at(-1)) {
      throw new Error('Unclosed tie/slur inside the excerpt; correct the MusicXML first');
    }
    const meter = elements.find((element) => element.hasAttribute('meter.count'));
    const beats = Number(meter?.getAttribute('meter.count') || 4);
    if (!Number.isFinite(beats)) throw new Error('Unsupported meter for an open span');
    span.setAttribute('tstamp2', `0m+${beats + 1}`);
    if (!span.hasAttribute('curvedir')) {
      const start = elements.find(
        (element) => `#${element.getAttribute('xml:id')}` === span.getAttribute('startid')
      );
      span.setAttribute('curvedir', start?.getAttribute('stem.dir') === 'up' ? 'below' : 'above');
    }
  }
  return new XMLSerializer().serializeToString(document);
}

/** Render one short excerpt; refuse to silently discard extra pages. */
export async function renderScore(toolkit, source) {
  toolkit.resetOptions();
  toolkit.setOptions({
    inputFrom: 'musicxml',
    breaks: 'none',
    pageWidth: 3200,
    pageHeight: 2000,
    adjustPageHeight: true,
    adjustPageWidth: true,
    header: 'none',
    footer: 'none',
    svgViewBox: true,
    xmlIdSeed: 68,
    scale: 40,
    pageMarginTop: 30,
    pageMarginBottom: 30,
    pageMarginLeft: 30,
    pageMarginRight: 30
  });
  const loaded = /\.mxl$/i.test(source)
    ? toolkit.loadZipDataBase64((await readFile(source)).toString('base64'))
    : toolkit.loadData(await readFile(source, 'utf8'));
  if (!loaded) throw new Error(`Cannot load score: ${source}`);
  const imported = toolkit.getMEI();
  if (!/<(?:note|rest|mRest|multiRest)\b/.test(imported)) {
    throw new Error(`No musical events found: ${source}`);
  }
  const mei = completeOpenSpans(imported);
  if (mei) {
    toolkit.setOptions({ inputFrom: 'mei' });
    if (!toolkit.loadData(mei)) throw new Error(`Cannot load intermediate MEI: ${source}`);
  }
  if (!loaded || toolkit.getPageCount() !== 1) {
    throw new Error(`Expected one renderable page: ${source}`);
  }
  return `${toolkit.renderToSVG(1).trim()}\n`;
}

/** Keep Verovio/WASM in this Node process, outside the browser bundle. */
export async function renderScores(sources, check = false) {
  const outputs = sources.map((source) => source.replace(/\.(musicxml|mxl)$/i, '.svg'));
  if (new Set(outputs).size !== outputs.length) {
    throw new Error('Multiple sources target the same SVG; keep one reviewed source per excerpt');
  }
  const toolkit = new VerovioToolkit(await createVerovioModule());
  try {
    for (const source of sources) {
      const svg = await renderScore(toolkit, source);
      const output = source.replace(/\.(musicxml|mxl)$/i, '.svg');
      if (check) {
        if ((await readFile(output, 'utf8')) !== svg) {
          throw new Error(`Stale SVG: ${output}; run npm run scores:render`);
        }
      } else {
        await writeFile(output, svg);
      }
      console.log(`${check ? 'Verified' : 'Rendered'} ${output}`);
    }
  } finally {
    toolkit.destroy();
  }
}
