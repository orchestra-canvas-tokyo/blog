import { error } from '@sveltejs/kit';
import { render } from 'svelte/server';
import TurndownService from 'turndown';
import { tables } from 'turndown-plugin-gfm';
import { getFullTitle, getPostBySlug, getPostListItems, getUrl } from '$lib/posts';
import { canonicalUrl } from '$lib/site';
import { composers } from '$lib/posts/composers';
import type { Tag } from '$lib/posts/tags';
import { PostCountInOnePage } from '$lib/util';

export const escapeMarkdown = (text: string) => text.replaceAll(/([\\`*_{}[\]<>#|])/g, '\\$1');

/** Only explicit markdown requests opt in. Specific media ranges override wildcards. */
export const wantsMarkdown = (accept: string | null): boolean => {
  const ranges = (accept ?? '')
    .toLowerCase()
    .split(',')
    .map((range) => {
      const [type, ...parameters] = range.trim().split(';');
      const qParameter = parameters
        .map((part) => part.trim())
        .find((part) => part.startsWith('q='));
      const q = qParameter === undefined ? 1 : Number(qParameter.slice(2));
      return { type, q: Number.isFinite(q) && q >= 0 && q <= 1 ? q : 0 };
    });
  const markdown = Math.max(
    0,
    ...ranges.filter((range) => range.type === 'text/markdown').map((range) => range.q)
  );
  const quality = (type: string) => {
    for (const candidate of [type, 'text/*', '*/*']) {
      const matches = ranges.filter((range) => range.type === candidate);
      if (matches.length) return Math.max(...matches.map((range) => range.q));
    }
    return 0;
  };
  return markdown > 0 && markdown >= quality('text/html');
};

export const htmlToMarkdown = (html: string, base: string): string => {
  const service = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });
  service.use(tables);
  service.remove(['script', 'style', 'button']);
  const absolute = (value: string) => {
    try {
      const url = new URL(value, base);
      return ['https:', 'http:', 'mailto:'].includes(url.protocol) ? url.href : '';
    } catch {
      return '';
    }
  };
  service.addRule('absolute-images', {
    filter: 'img',
    replacement: (_content, node) => {
      const src = absolute(node.getAttribute('src') ?? '');
      return src ? `![${escapeMarkdown(node.getAttribute('alt') ?? '')}](<${src}>)` : '';
    }
  });
  service.addRule('absolute-links', {
    filter: 'a',
    replacement: (content, node) => {
      const href = absolute(node.getAttribute('href') ?? '');
      return href ? `[${content}](<${href}>)` : content;
    }
  });
  return service.turndown(html);
};

export const getPostMarkdown = async (slug: string): Promise<string> => {
  const post = await getPostBySlug(slug);
  if (!post?.metadata.published) error(404, 'Article not found');
  const url = canonicalUrl(getUrl(slug));
  const body = render(post.default).body;
  const composer = post.metadata.composerSlug ? composers[post.metadata.composerSlug].fullName : '';
  return (
    [
      `# ${escapeMarkdown(getFullTitle(post))}`,
      `Source: ${url}`,
      `Published: ${post.metadata.publicatedAt}`,
      composer,
      htmlToMarkdown(body, url),
      ...(post.metadata.youTubeVideoIds ?? []).map(
        (id) => `Video: https://www.youtube.com/watch?v=${encodeURIComponent(id)}`
      )
    ]
      .filter(Boolean)
      .join('\n\n') + '\n'
  );
};

/** Called after SvelteKit has validated tag, pagination and page status. */
export const getListingMarkdown = async (url: URL, tag?: Tag): Promise<string> => {
  const page = Number(url.searchParams.get('p') ?? 1);
  const posts = await getPostListItems({
    filterTag: tag,
    offset: (page - 1) * PostCountInOnePage,
    limit: PostCountInOnePage
  });
  return (
    [
      `# ${tag ? escapeMarkdown(tag) + 'の記事一覧' : 'Orchestra Canvas Tokyo Blog'}`,
      `Source: ${canonicalUrl(url.pathname)}`,
      `Page: ${page}`,
      ...posts.map(
        (post) =>
          `## [${escapeMarkdown(getFullTitle(post))}](<${canonicalUrl(getUrl(post.slug))}>)\n\n${escapeMarkdown(post.description)}`
      )
    ].join('\n\n') + '\n'
  );
};

export const markdownResponse = (body: string, headers?: HeadersInit) => {
  const result = new Headers(headers);
  result.set('Content-Type', 'text/markdown; charset=utf-8');
  result.delete('Content-Length');
  result.delete('ETag');
  result.delete('Content-Encoding');
  return new Response(body, { headers: result });
};
