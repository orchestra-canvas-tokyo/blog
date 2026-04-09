import type { Component } from 'svelte';
import { convertToDescription, convertToPlainText } from '$lib/util';
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
/** ポストオブジェクトの型 */
export type Post = {
  metadata: Metadata;
  slug: string;
  default: Component;
  description: string;
};
export type SearchablePost = {
  metadata: Metadata;
  slug: string;
  description: string;
  searchText: string;
};
type InternalPost = Post & {
  searchText: string;
};

// 動的に記事のSvelteファイルを取得する
const modules = import.meta.glob('./**/post.svelte', { eager: true }) as Record<string, Post>;
const rawModules = import.meta.glob('./**/post.svelte', {
  import: 'default',
  query: '?raw',
  eager: true
}) as Record<string, string>;
const posts: { [slug: string]: InternalPost } = {};
Object.keys(modules).forEach((path) => {
  const slug = /^.+\/(?<slug>[^/]+)\/post\.svelte$/.exec(path)?.groups?.slug;
  if (slug === undefined) return;

  const searchText = convertToPlainText(rawModules[path]);
  posts[slug] = {
    metadata: modules[path].metadata,
    slug: slug,
    default: modules[path].default,
    description: convertToDescription(rawModules[path]),
    searchText
  };
});

/**
 * ポストを取得する
 * @param filterTag あるタグに一致する記事のみ抽出する場合指定
 * @returns ポストの配列
 */
export const getPosts = (filterTag: Tag | undefined = undefined): Post[] =>
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

/**
 * 検索に利用する軽量なポスト情報を取得する
 * @param filterTag あるタグに一致する記事のみ抽出する場合指定
 * @returns 検索用ポストの配列
 */
export const getSearchablePosts = (filterTag: Tag | undefined = undefined): SearchablePost[] =>
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
    )
    .map((post) => ({
      metadata: post.metadata,
      slug: post.slug,
      description: post.description,
      searchText: post.searchText
    }));

/**
 * あるslugのポストを取得する
 * @param slug ポストのslug
 * @returns ポスト、該当がない場合は`null`
 */
export const getPostBySlug = (slug: string): Post | null => {
  if (Object.keys(posts).includes(slug)) return posts[slug];
  return null;
};

/**
 * あるslugのポストの前後のポストを取得する。
 * @param slug 基準となるポストのslug
 * @returns 前後のポスト。該当がない場合は`null`
 */
export const getAdjacentPostListItemsBySlug = (
  slug: string
): {
  prev: Post | null;
  next: Post | null;
} => {
  const post = getPostBySlug(slug);
  if (post === null)
    return {
      prev: null,
      next: null
    };

  const posts = getPosts();
  const index = posts.findIndex((post) => post.slug === slug);
  return {
    prev: index === posts.length - 1 ? null : posts[index + 1],
    next: index === 0 ? null : posts[index - 1]
  };
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
