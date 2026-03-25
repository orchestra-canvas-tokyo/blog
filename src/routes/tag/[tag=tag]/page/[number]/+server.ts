import { base } from '$app/paths';
import { error, redirect } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

const parsePageNumber = (value: string) => {
  if (!/^\d+$/.test(value)) error(404);

  const pageNumber = parseInt(value, 10);
  if (pageNumber <= 0) error(404);

  return pageNumber;
};

export const GET: RequestHandler = ({ params, url }) => {
  const pageNumber = parsePageNumber(params.number);
  const target = new URL(`${base}/tag/${params.tag}`, url.origin);

  if (pageNumber !== 1) {
    target.searchParams.set('p', String(pageNumber));
  }

  redirect(301, target.href);
};
