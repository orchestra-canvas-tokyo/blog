import type { Component } from 'svelte';
import { convertToDescription } from '$lib/util';
import { composers, type composerSlug } from './composers';
import type { concertSlug } from './concerts';
import type { Tag } from './tags';

/** 記事のメタ情報の型 */
export type Metadata = {
  published: boolean;
  publicatedAt: string;
  title: string;
  composerSlug?: composerSlug;
  arrangerSlug?: composerSlug;
  concertSlug: concertSlug;
  youTubeVideoIds?: string[];
  tags: Tag[];
};

export type PostMetadata = {
  metadata: Metadata;
  slug: string;
};

export type PostListItem = PostMetadata & {
  description: string;
};

/** ポストオブジェクトの型 */
export type Post = PostListItem & {
  default: Component;
  hasAuthorCredit: boolean;
  hasTableOfContents: boolean;
};

export type SearchablePost = PostListItem & {
  searchText: string;
};

type PostModule = {
  metadata: Metadata;
  default: Component;
};

type InternalPost = {
  metadata: Metadata;
  slug: string;
  default: Component;
  loadRawPost: () => Promise<string>;
  rawPost?: string;
  description?: string;
};

// 動的に記事のSvelteファイルを取得する
const modules = import.meta.glob('./**/post.svelte', { eager: true }) as Record<string, PostModule>;
const rawModules = import.meta.glob('./**/post.svelte', {
  import: 'default',
  query: '?raw'
}) as Record<string, () => Promise<string>>;

const posts: { [slug: string]: InternalPost } = {};
Object.keys(modules).forEach((path) => {
  const slug = /^.+\/(?<slug>[^/]+)\/post\.svelte$/.exec(path)?.groups?.slug;
  const loadRawPost = rawModules[path];
  if (slug === undefined || loadRawPost === undefined) return;

  posts[slug] = {
    metadata: modules[path].metadata,
    slug: slug,
    default: modules[path].default,
    loadRawPost
  };
});

const getSortedPublishedInternalPosts = (filterTag: Tag | undefined = undefined): InternalPost[] =>
  Object.keys(posts)
    .map((key) => posts[key])
    .filter((post) => post.metadata.published)
    .filter((post) => {
      if (filterTag === undefined) {
        return true;
      } else {
        return post.metadata.tags.includes(filterTag);
      }
    })
    .sort(
      (postA, postB) =>
        new Date(postB.metadata.publicatedAt).getTime() -
        new Date(postA.metadata.publicatedAt).getTime()
    );

const getRawPost = async (post: InternalPost): Promise<string> => {
  if (post.rawPost === undefined) {
    post.rawPost = await post.loadRawPost();
  }
  return post.rawPost;
};

const getPostDescription = async (post: InternalPost): Promise<string> => {
  if (post.description === undefined) {
    post.description = convertToDescription(await getRawPost(post));
  }
  return post.description;
};

const toPostMetadata = (post: InternalPost): PostMetadata => ({
  metadata: post.metadata,
  slug: post.slug
});

const toPostListItem = async (post: InternalPost): Promise<PostListItem> => ({
  ...toPostMetadata(post),
  description: await getPostDescription(post)
});

const toPost = async (post: InternalPost): Promise<Post> => {
  const rawPost = await getRawPost(post);

  return {
    ...(await toPostListItem(post)),
    default: post.default,
    hasAuthorCredit: /<Author(?:\s|>)/.test(rawPost),
    hasTableOfContents: /<(?:h[34]|Reference)(?:\s|>)/.test(rawPost)
  };
};

/**
 * ポストを取得する
 * @param filterTag あるタグに一致する記事のみ抽出する場合指定
 * @returns ポストの配列
 */
export const getPosts = async (filterTag: Tag | undefined = undefined): Promise<Post[]> =>
  Promise.all(getSortedPublishedInternalPosts(filterTag).map((post) => toPost(post)));

/**
 * 公開済みポスト数を取得する
 * @param filterTag あるタグに一致する記事のみ抽出する場合指定
 * @returns 公開済みポスト数
 */
export const getPostCount = (filterTag: Tag | undefined = undefined): number =>
  getSortedPublishedInternalPosts(filterTag).length;

/**
 * 公開済みポストのメタ情報を取得する
 * @param filterTag あるタグに一致する記事のみ抽出する場合指定
 * @returns 公開済みポストのメタ情報の配列
 */
export const getPublishedPostMetadata = (filterTag: Tag | undefined = undefined): PostMetadata[] =>
  getSortedPublishedInternalPosts(filterTag).map((post) => toPostMetadata(post));

/**
 * 表示に利用する軽量なポスト情報をページ単位で取得する
 * @param filterTag あるタグに一致する記事のみ抽出する場合指定
 * @param offset 取得開始位置
 * @param limit 取得件数
 * @returns 表示用ポストの配列
 */
export const getPostListItems = async ({
  filterTag = undefined,
  offset = 0,
  limit
}: {
  filterTag?: Tag;
  offset?: number;
  limit?: number;
} = {}): Promise<PostListItem[]> => {
  const sortedPosts = getSortedPublishedInternalPosts(filterTag);
  const selectedPosts =
    limit === undefined ? sortedPosts.slice(offset) : sortedPosts.slice(offset, offset + limit);

  return Promise.all(selectedPosts.map((post) => toPostListItem(post)));
};

/**
 * あるslugのポストを取得する
 * @param slug ポストのslug
 * @returns ポスト、該当がない場合は`null`
 */
export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  if (Object.keys(posts).includes(slug)) return toPost(posts[slug]);
  return null;
};

/**
 * あるslugのポストの前後のポストを取得する。
 * @param slug 基準となるポストのslug
 * @returns 前後のポスト。該当がない場合は`null`
 */
export const getAdjacentPostListItemsBySlug = async (
  slug: string
): Promise<{
  prev: PostListItem | null;
  next: PostListItem | null;
}> => {
  if (!Object.keys(posts).includes(slug))
    return {
      prev: null,
      next: null
    };

  const sortedPosts = getSortedPublishedInternalPosts();
  const index = sortedPosts.findIndex((post) => post.slug === slug);
  if (index === -1)
    return {
      prev: null,
      next: null
    };

  return {
    prev: index === sortedPosts.length - 1 ? null : await toPostListItem(sortedPosts[index + 1]),
    next: index === 0 ? null : await toPostListItem(sortedPosts[index - 1])
  };
};

export type RelatedPostListItems = {
  sameConcert: PostListItem[];
  sameComposer: PostListItem[];
};

/**
 * 記事と同じ演奏会、または同じ作曲家の曲目解説を取得する。
 * 同じ演奏会の記事を優先し、作曲家の記事との重複は除外する。
 */
export const getRelatedPostListItemsBySlug = async (
  slug: string,
  sameComposerLimit = 3
): Promise<RelatedPostListItems> => {
  const currentPost = posts[slug];
  if (currentPost === undefined || !currentPost.metadata.published) {
    return { sameConcert: [], sameComposer: [] };
  }

  const otherPublishedPosts = getSortedPublishedInternalPosts().filter(
    (post) => post.slug !== slug
  );
  const sameConcertPosts = otherPublishedPosts.filter(
    (post) => post.metadata.concertSlug === currentPost.metadata.concertSlug
  );
  const sameComposerPosts =
    currentPost.metadata.composerSlug === undefined
      ? []
      : otherPublishedPosts
          .filter(
            (post) =>
              post.metadata.composerSlug === currentPost.metadata.composerSlug &&
              post.metadata.concertSlug !== currentPost.metadata.concertSlug
          )
          .slice(0, sameComposerLimit);

  const [sameConcert, sameComposer] = await Promise.all([
    Promise.all(sameConcertPosts.map((post) => toPostListItem(post))),
    Promise.all(sameComposerPosts.map((post) => toPostListItem(post)))
  ]);

  return { sameConcert, sameComposer };
};

/**
 * ポストのslugからURLを取得する。
 * @param slug
 * @returns `/`スタートの相対パス
 */
export const getUrl = (slug: string): string => {
  return `/post/${slug}`;
};

/**
 * ポストからタイトル文字列を取得する。
 * @param post
 * @returns タイトル文字列。e.g. `ラフマニノフ / 交響的舞曲`
 */
export const getFullTitle = (post: Pick<Post, 'metadata'>): string => {
  if (post.metadata.composerSlug)
    return `${composers[post.metadata.composerSlug].shortName} / ${post.metadata.title}`;
  return post.metadata.title;
};
