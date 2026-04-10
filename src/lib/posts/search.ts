import { getFullTitle, getSearchablePosts, type SearchablePost } from '$lib/posts';
import { composers, type composerSlug } from '$lib/posts/composers';
import { concerts, type concertSlug } from '$lib/posts/concerts';
import type { Tag } from '$lib/posts/tags';

export type ArticleSearchResult = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  tags: Tag[];
  matchedFieldLabel: 'タイトル一致' | 'タグ一致' | '関連情報一致' | '本文一致';
  score: number;
};

export type TagSearchResult = {
  tag: Tag;
  score: number;
};

export type ComposerSearchResult = {
  slug: composerSlug;
  shortName: string;
  fullName: string;
  tag: Tag;
  score: number;
};

export type ConcertSearchResult = {
  slug: concertSlug;
  title: string;
  date: string;
  tag: Tag;
  score: number;
};

export type BlogSearchResults = {
  articles: ArticleSearchResult[];
  tags: TagSearchResult[];
  composers: ComposerSearchResult[];
  concerts: ConcertSearchResult[];
};

type ArticleSearchEntry = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  tags: Tag[];
  normalizedTitle: string;
  normalizedDescription: string;
  normalizedSearchText: string;
  normalizedTags: string[];
  normalizedComposerNames: string[];
  normalizedConcertTitle: string;
  normalizedCombinedText: string;
};

type TagSearchEntry = {
  tag: Tag;
  normalizedTag: string;
};

type ComposerSearchEntry = {
  slug: composerSlug;
  shortName: string;
  fullName: string;
  tag: Tag;
  normalizedShortName: string;
  normalizedFullName: string;
};

type ConcertSearchEntry = {
  slug: concertSlug;
  title: string;
  date: string;
  tag: Tag;
  normalizedTitle: string;
};

const katakanaToHiragana = (value: string) =>
  value.replaceAll(/[\u30a1-\u30f6]/g, (character) =>
    String.fromCharCode(character.charCodeAt(0) - 0x60)
  );

const normalizeSearchText = (value: string) =>
  katakanaToHiragana(value.normalize('NFKC').toLowerCase()).replaceAll(/\s+/g, ' ').trim();

const splitQueryTokens = (value: string) => normalizeSearchText(value).split(' ').filter(Boolean);

const includesAllTokens = (value: string, tokens: string[]) =>
  tokens.length > 0 && tokens.every((token) => value.includes(token));

const publishedPosts = getSearchablePosts();

const articleSearchEntries: ArticleSearchEntry[] = publishedPosts.map((post) =>
  createArticleSearchEntry(post)
);

const usedComposerTags = new Set<string>(
  publishedPosts.flatMap((post) => {
    const slugs = [post.metadata.composerSlug, post.metadata.arrangerSlug].filter(
      (slug): slug is composerSlug => slug !== undefined
    );

    return slugs.map((slug) => composers[slug].shortName);
  })
);

const usedConcertTags = new Set<string>(
  publishedPosts.map((post) => concerts[post.metadata.concertSlug].title)
);

const tagSearchEntries: TagSearchEntry[] = [
  ...new Set(publishedPosts.flatMap((post) => post.metadata.tags))
]
  .filter((tag) => !usedComposerTags.has(tag) && !usedConcertTags.has(tag))
  .map((tag) => ({
    tag,
    normalizedTag: normalizeSearchText(tag)
  }));

const composerSearchEntries: ComposerSearchEntry[] = [
  ...new Set(
    publishedPosts.flatMap((post) =>
      [post.metadata.composerSlug, post.metadata.arrangerSlug].filter(
        (slug): slug is composerSlug => slug !== undefined
      )
    )
  )
].map((slug) => ({
  slug,
  shortName: composers[slug].shortName,
  fullName: composers[slug].fullName,
  tag: composers[slug].shortName as Tag,
  normalizedShortName: normalizeSearchText(composers[slug].shortName),
  normalizedFullName: normalizeSearchText(composers[slug].fullName)
}));

const concertSearchEntries: ConcertSearchEntry[] = [
  ...new Set(publishedPosts.map((post) => post.metadata.concertSlug))
].map((slug) => ({
  slug,
  title: concerts[slug].title,
  date: concerts[slug].date,
  tag: concerts[slug].title as Tag,
  normalizedTitle: normalizeSearchText(concerts[slug].title)
}));

function createArticleSearchEntry(post: SearchablePost): ArticleSearchEntry {
  const composerNames = [post.metadata.composerSlug, post.metadata.arrangerSlug]
    .filter((slug): slug is composerSlug => slug !== undefined)
    .flatMap((slug) => {
      const composer = composers[slug];
      return [composer.shortName, composer.fullName];
    });
  const concertTitle = concerts[post.metadata.concertSlug].title;
  const title = getFullTitle(post);

  return {
    slug: post.slug,
    title,
    description: post.description,
    publishedAt: post.metadata.publicatedAt,
    tags: post.metadata.tags,
    normalizedTitle: normalizeSearchText(title),
    normalizedDescription: normalizeSearchText(post.description),
    normalizedSearchText: normalizeSearchText(post.searchText),
    normalizedTags: post.metadata.tags.map((tag) => normalizeSearchText(tag)),
    normalizedComposerNames: composerNames.map((name) => normalizeSearchText(name)),
    normalizedConcertTitle: normalizeSearchText(concertTitle),
    normalizedCombinedText: normalizeSearchText(
      [
        title,
        post.description,
        post.searchText,
        ...post.metadata.tags,
        ...composerNames,
        concertTitle
      ].join(' ')
    )
  };
}

const scoreArticle = (
  entry: ArticleSearchEntry,
  normalizedQuery: string,
  queryTokens: string[]
): ArticleSearchResult | null => {
  if (!includesAllTokens(entry.normalizedCombinedText, queryTokens)) return null;

  const titlePrefixMatch = entry.normalizedTitle.startsWith(normalizedQuery);
  const titleMatch = includesAllTokens(entry.normalizedTitle, queryTokens);
  const tagMatch = entry.normalizedTags.some((tag) => includesAllTokens(tag, queryTokens));
  const composerMatch = entry.normalizedComposerNames.some((name) =>
    includesAllTokens(name, queryTokens)
  );
  const concertMatch = includesAllTokens(entry.normalizedConcertTitle, queryTokens);
  const bodyMatch =
    includesAllTokens(entry.normalizedSearchText, queryTokens) ||
    includesAllTokens(entry.normalizedDescription, queryTokens);

  let score = 0;
  let matchedFieldLabel: ArticleSearchResult['matchedFieldLabel'] = '本文一致';

  if (titlePrefixMatch) {
    score += 420;
    matchedFieldLabel = 'タイトル一致';
  } else if (titleMatch) {
    score += 300;
    matchedFieldLabel = 'タイトル一致';
  }

  if (tagMatch) {
    score += 160;
    if (matchedFieldLabel === '本文一致') matchedFieldLabel = 'タグ一致';
  }

  if (composerMatch || concertMatch) {
    score += 140;
    if (matchedFieldLabel === '本文一致') matchedFieldLabel = '関連情報一致';
  }

  if (bodyMatch) {
    score += 90;
  }

  if (score === 0) {
    score = 60;
  }

  return {
    slug: entry.slug,
    title: entry.title,
    description: entry.description,
    publishedAt: entry.publishedAt,
    tags: entry.tags,
    matchedFieldLabel,
    score
  };
};

const scoreTag = (
  entry: TagSearchEntry,
  normalizedQuery: string,
  queryTokens: string[]
): TagSearchResult | null => {
  if (!includesAllTokens(entry.normalizedTag, queryTokens)) return null;

  let score = 120;
  if (entry.normalizedTag.startsWith(normalizedQuery)) score += 80;

  return {
    tag: entry.tag,
    score
  };
};

const scoreComposer = (
  entry: ComposerSearchEntry,
  normalizedQuery: string,
  queryTokens: string[]
): ComposerSearchResult | null => {
  const shortNameMatch = includesAllTokens(entry.normalizedShortName, queryTokens);
  const fullNameMatch = includesAllTokens(entry.normalizedFullName, queryTokens);

  if (!shortNameMatch && !fullNameMatch) return null;

  let score = 140;
  if (entry.normalizedShortName.startsWith(normalizedQuery)) score += 100;
  if (entry.normalizedFullName.startsWith(normalizedQuery)) score += 40;

  return {
    slug: entry.slug,
    shortName: entry.shortName,
    fullName: entry.fullName,
    tag: entry.tag,
    score
  };
};

const scoreConcert = (
  entry: ConcertSearchEntry,
  normalizedQuery: string,
  queryTokens: string[]
): ConcertSearchResult | null => {
  if (!includesAllTokens(entry.normalizedTitle, queryTokens)) return null;

  let score = 140;
  if (entry.normalizedTitle.startsWith(normalizedQuery)) score += 90;

  return {
    slug: entry.slug,
    title: entry.title,
    date: entry.date,
    tag: entry.tag,
    score
  };
};

export const searchBlog = (query: string, limitPerSection = 5): BlogSearchResults => {
  const normalizedQuery = normalizeSearchText(query);
  const queryTokens = splitQueryTokens(query);

  if (normalizedQuery.length === 0 || queryTokens.length === 0) {
    return {
      articles: [],
      tags: [],
      composers: [],
      concerts: []
    };
  }

  return {
    articles: articleSearchEntries
      .map((entry) => scoreArticle(entry, normalizedQuery, queryTokens))
      .filter((entry): entry is ArticleSearchResult => entry !== null)
      .sort(
        (entryA, entryB) =>
          entryB.score - entryA.score ||
          new Date(entryB.publishedAt).getTime() - new Date(entryA.publishedAt).getTime()
      )
      .slice(0, limitPerSection),
    tags: tagSearchEntries
      .map((entry) => scoreTag(entry, normalizedQuery, queryTokens))
      .filter((entry): entry is TagSearchResult => entry !== null)
      .sort((entryA, entryB) => entryB.score - entryA.score || entryA.tag.localeCompare(entryB.tag))
      .slice(0, limitPerSection),
    composers: composerSearchEntries
      .map((entry) => scoreComposer(entry, normalizedQuery, queryTokens))
      .filter((entry): entry is ComposerSearchResult => entry !== null)
      .sort(
        (entryA, entryB) =>
          entryB.score - entryA.score || entryA.shortName.localeCompare(entryB.shortName)
      )
      .slice(0, limitPerSection),
    concerts: concertSearchEntries
      .map((entry) => scoreConcert(entry, normalizedQuery, queryTokens))
      .filter((entry): entry is ConcertSearchResult => entry !== null)
      .sort(
        (entryA, entryB) =>
          entryB.score - entryA.score ||
          new Date(entryB.date).getTime() - new Date(entryA.date).getTime()
      )
      .slice(0, limitPerSection)
  };
};
