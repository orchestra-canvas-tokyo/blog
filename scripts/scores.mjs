import { spawnSync } from 'node:child_process';
import { mkdir, mkdtemp, readdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { renderScores } from './scores/render.mjs';

/** Find reviewed score sources, excluding raw OMR intermediates. */
async function findScores(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const results = await Promise.all(
    entries.map((entry) => {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) return entry.name === 'omr' ? [] : findScores(file);
      return /\.(musicxml|mxl)$/i.test(entry.name) ? [file] : [];
    })
  );
  return results.flat().sort();
}

const [command, ...files] = process.argv.slice(2);
try {
  if (command === 'omr') {
    if (!files.length) throw new Error('Usage: npm run scores:omr -- image.webp [image.webp ...]');
    const executable = process.env.AUDIVERIS_BIN || 'audiveris';
    await mkdir('.score-work', { recursive: true });
    // A fresh run cannot overwrite either a previous trial or a reviewed MusicXML file.
    const run = await mkdtemp(path.resolve('.score-work/run-'));
    for (const [index, file] of files.entries()) {
      const stem = path.basename(file, path.extname(file));
      const output = path.join(run, `${index + 1}-${stem}`);
      await mkdir(output);
      const png = path.join(output, `${stem}.png`);
      await sharp(file)
        .flatten({ background: '#fff' })
        .extend({ top: 80, bottom: 80, left: 80, right: 80, background: '#fff' })
        .png()
        .toFile(png);
      const result = spawnSync(
        executable,
        ['-batch', '-transcribe', '-export', '-save', '-output', output, '--', png],
        { stdio: 'inherit' }
      );
      if (result.error) throw new Error(`Cannot run ${executable}: ${result.error.message}`);
      if (result.status !== 0) throw new Error(`Audiveris failed for ${file}`);
      // Audiveris may report success even when recognition/export fails.
      const generated = await readdir(output);
      if (!generated.some((name) => name.endsWith('.mxl') || name.endsWith('.musicxml'))) {
        throw new Error(`Audiveris exported no MusicXML for ${file}; inspect ${output}`);
      }
      console.log(`Review OMR output in ${output} before copying it beside the article.`);
    }
  } else if (command === 'render' || command === 'check') {
    const sources = files.length ? files : await findScores('src/lib/posts');
    if (!sources.length) throw new Error('No MusicXML/MXL sources found');
    if (sources.some((file) => !/\.(musicxml|mxl)$/i.test(file))) {
      throw new Error('Render inputs must be MusicXML or MXL files');
    }
    await renderScores(sources, command === 'check');
  } else {
    throw new Error('Usage: node scripts/scores.mjs omr|render|check [files ...]');
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
