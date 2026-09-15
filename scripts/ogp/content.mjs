import { parse } from 'svelte/compiler';
import ts from 'typescript';

/** Read literal metadata without evaluating article scripts or importing their images. */
export function readMetadata(source) {
  const module = parse(source, { modern: true }).module;
  if (!module) throw new Error('Article has no module script');
  const script = ts.createSourceFile(
    'post.ts',
    source.slice(module.content.start, module.content.end),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  );
  const declaration = script.statements
    .filter(ts.isVariableStatement)
    .flatMap((statement) => statement.declarationList.declarations)
    .find((entry) => ts.isIdentifier(entry.name) && entry.name.text === 'metadata');
  if (!declaration?.initializer || !ts.isObjectLiteralExpression(declaration.initializer)) {
    throw new Error('Article metadata must be an object literal');
  }
  const result = {};
  for (const key of ['published', 'title', 'composerSlug']) {
    const property = declaration.initializer.properties.find(
      (entry) => ts.isPropertyAssignment(entry) && entry.name.getText(script) === key
    );
    if (!property) continue;
    const value = property.initializer;
    if (ts.isStringLiteral(value)) result[key] = value.text;
    else if (value.kind === ts.SyntaxKind.TrueKeyword) result[key] = true;
    else if (value.kind === ts.SyntaxKind.FalseKeyword) result[key] = false;
    else throw new Error(`OGP metadata ${key} must be a literal`);
  }
  if (typeof result.published !== 'boolean' || typeof result.title !== 'string') {
    throw new Error('Article must declare a title and published flag');
  }
  return result;
}

/** Shorten only the sharing-card copy, never the source article title. */
export function simplifyTitle(title) {
  return title
    .replace(/[変嬰]?[イロハニホヘト][長短]調/g, '')
    .replace(/(?:作品|Op\.?|K\.?|WAB)\s*\d+(?:[-–]\d+)?[a-z]?/gi, '')
    .replace(/\s+/g, ' ')
    .replace(/\s+([：、。』》」])/g, '$1')
    .trim();
}

// Editorial line breaks for long names, without changing article metadata.
const titleLines = {
  '20260724-mozart-haffner-symphony': ['交響曲第35番', '『ハフナー』'],
  '20250118-wagner-tristan-and-iseult': ['楽劇『トリスタンとイゾルデ』より', '前奏曲と愛の死'],
  '20251111-tchaikovsky-waltz-from-eugene-onegin': [
    '歌劇《エフゲニー・オネーギン》より',
    '〈ワルツ〉'
  ],
  '20251111-stravinsky-the-firebird-suite': ['バレエ音楽『火の鳥』組曲', '（1945年版）'],
  '20260131-bernstein-symphonic-dance': [
    '「ウェストサイドストーリー」より',
    'シンフォニックダンス'
  ],
  '20240909-symphonic-variations-merry-go-around': [
    'シンフォニック・バリエーション',
    '『メリーゴーランド』'
  ],
  '20260131-liszt-mephisto-waltz': ['メフィスト・ワルツ第1番', '「村の居酒屋での踊り」']
};

export function getTitleLines(slug, title) {
  return titleLines[slug] ?? [simplifyTitle(title)];
}

export function escapeMarkup(text) {
  return text.replace(
    /[&<>"']/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&apos;'
      })[character]
  );
}
