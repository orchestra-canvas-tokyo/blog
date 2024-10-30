import { tags, type Tag } from '$lib/posts/tags';

/**
 * タグにマッチするか判定する関数
 */
export function match(param: string): param is Tag {
  return tags.some((tag) => tag === param);
}
