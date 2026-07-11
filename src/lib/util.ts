/**
 * 日付文字列から日付文字列に変換する。
 * @param date 日付文字列
 * @returns e.g. 2222/2/2
 */
export const formatDate2JpStyle = (date: string) => {
  const calendarDate = /^(\d{4})-(\d{2})-(\d{2})(?:T|$)/.exec(date);
  if (calendarDate) {
    return `${Number(calendarDate[1])}/${Number(calendarDate[2])}/${Number(calendarDate[3])}`;
  }

  const parsedDate = new Date(date);
  return `${parsedDate.getFullYear()}/${parsedDate.getMonth() + 1}/${parsedDate.getDate()}`;
};

/**
 * ポストの生テキストから検索用のプレーンテキストを生成する。
 * @param rawPost ポストのHTML文字列
 * @returns タグ類を除去したプレーンテキスト
 */
export const convertToPlainText = (rawPost: string) =>
  rawPost
    .replaceAll(/<script.+?<\/script>/gs, '') // スクリプトを削除
    .replaceAll(/<style.+?<\/style>/gs, '') // スタイリングを削除
    .replaceAll(/<h\d.+?<\/h\d>/gs, '') // ヘッダーを削除
    .replaceAll(/<figcaption.+?<\/figcaption>/gs, '') // キャプションを削除
    .replaceAll(/<.+?>/gs, '') // タグ文字列を削除
    .replaceAll(/\s+/gs, ' ') // 空白を圧縮
    .trim();

/**
 * descriptionとして用いられる冒頭抽出文字列を生成する。
 * @param rawPost ポストのHTML文字列
 * @returns 冒頭を抽出した文字列
 */
export const convertToDescription = (rawPost: string) =>
  convertToPlainText(rawPost)
    .replaceAll(/\s+/gs, '') // 空白を削除
    .substring(0, 200);

/** 1ページに表示するポストの数 */
export const PostCountInOnePage = 10;
