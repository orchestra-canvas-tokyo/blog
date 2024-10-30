import { composers } from './composers';
import { concerts } from './concerts';

/**
 * タグとなる文字列の配列
 * 直接指定しているもののほか、作曲者のshortName、演奏会のtitle
 */
export const tags = [
  '曲目解説',
  ...Object.values(composers).map((value) => value.shortName),
  ...Object.values(concerts).map((value) => value.title)
] as const;

/** タグとなる文字列のユニオン型 */
export type Tag = (typeof tags)[number];
