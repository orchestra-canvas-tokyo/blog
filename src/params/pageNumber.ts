/**
 * ページネーションに用いられる、自然数にマッチするか判定する関数
 */
export function match(param: string): param is string {
  const rawIntParam = parseInt(param);
  return !isNaN(rawIntParam) && parseFloat(param) === rawIntParam && 0 < rawIntParam;
}
