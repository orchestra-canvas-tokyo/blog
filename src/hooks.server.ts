import type { Handle } from '@sveltejs/kit';
import type { Tag } from '$lib/posts/tags';
import { discoveryLinks } from '$lib/server/discovery';
import {
  getListingMarkdown,
  getPostMarkdown,
  markdownResponse,
  wantsMarkdown
} from '$lib/server/markdown';

export const handle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);
  const isPage = ['/', '/post/[slug]', '/tag/[tag=tag]'].includes(event.route.id ?? '');
  if (!isPage || event.isDataRequest || !['GET', 'HEAD'].includes(event.request.method))
    return response;
  const headers = new Headers(response.headers);
  if (response.status === 200 && event.route.id === '/') {
    const existing = headers.get('Link');
    headers.set('Link', existing ? `${existing}, ${discoveryLinks}` : discoveryLinks);
  }
  const vary = new Set(
    (headers.get('Vary') ?? '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)
  );
  if (![...vary].some((value) => value.toLowerCase() === 'accept')) vary.add('Accept');
  headers.set('Vary', [...vary].join(', '));

  if (response.status === 200 && wantsMarkdown(event.request.headers.get('Accept'))) {
    const body =
      event.route.id === '/post/[slug]'
        ? await getPostMarkdown(event.params.slug!)
        : await getListingMarkdown(event.url, event.params.tag as Tag | undefined);
    const markdown = markdownResponse(body, headers);
    return event.request.method === 'HEAD'
      ? new Response(null, { headers: markdown.headers })
      : markdown;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
};
