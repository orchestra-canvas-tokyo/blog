/**
 * 日付文字列から日付文字列に変換する。
 * @param date 日付文字列
 * @returns e.g. 2222/2/2
 */
export const formatDate2JpStyle = (date: string) =>
  `${new Date(date).getFullYear()}/${new Date(date).getMonth() + 1}/${new Date(date).getDate()}`;

/**
 * descriptionとして用いられる冒頭抽出文字列を生成する。
 * @param rawPost ポストのHTML文字列
 * @returns 冒頭を抽出した文字列
 */
export const convertToDescription = (rawPost: string) =>
  rawPost
    .replaceAll(/<script.+?<\/script>/gs, '') // スクリプトを削除
    .replaceAll(/<style.+?<\/style>/gs, '') // スタイリングを削除
    .replaceAll(/<h\d.+?<\/h\d>/gs, '') // ヘッダーを削除
    .replaceAll(/<figcaption.+?<\/figcaption>/gs, '') // キャプションを削除
    .replaceAll(/<.+?>/gs, '') // タグ文字列を削除
    .replaceAll(/\s+/gs, '') // 空白を削除
    .substring(0, 200);

/** 1ページに表示するポストの数 */
export const PostCountInOnePage = 10;
