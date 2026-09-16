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
  for (const key of ['published', 'title', 'composerSlug', 'ogpTitleLines', 'ogpMainTitleLine']) {
    const property = declaration.initializer.properties.find(
      (entry) => ts.isPropertyAssignment(entry) && entry.name.getText(script) === key
    );
    if (!property) continue;
    const value = property.initializer;
    if (key === 'ogpTitleLines') {
      if (!ts.isArrayLiteralExpression(value) || !value.elements.every(ts.isStringLiteral))
        throw new Error('ogpTitleLines must be an array of string literals');
      result[key] = value.elements.map((element) => element.text);
    } else if (key === 'ogpMainTitleLine') {
      if (!ts.isNumericLiteral(value))
        throw new Error('ogpMainTitleLine must be a numeric literal');
      result[key] = Number(value.text);
    } else if (ts.isStringLiteral(value)) result[key] = value.text;
    else if (value.kind === ts.SyntaxKind.TrueKeyword) result[key] = true;
    else if (value.kind === ts.SyntaxKind.FalseKeyword) result[key] = false;
    else throw new Error(`OGP metadata ${key} must be a literal`);
  }
  if (typeof result.published !== 'boolean' || typeof result.title !== 'string') {
    throw new Error('Article must declare a title and published flag');
  }
  getTitleLines(result);
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

/** Explicit card-only copy belongs to each post; otherwise retain one simplified line. */
export function getTitleLines(metadata) {
  const lines = metadata.ogpTitleLines ?? [simplifyTitle(metadata.title)];
  if (
    !Array.isArray(lines) ||
    lines.length < 1 ||
    lines.length > 2 ||
    lines.some((line) => typeof line !== 'string' || !line.trim() || /[\r\n]/.test(line))
  ) {
    throw new Error('ogpTitleLines must contain one or two nonempty single-line strings');
  }
  const main = metadata.ogpMainTitleLine ?? 0;
  if (!Number.isInteger(main) || main < 0 || main >= lines.length) {
    throw new Error('ogpMainTitleLine must be a valid zero-based title-line index');
  }
  return lines;
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
