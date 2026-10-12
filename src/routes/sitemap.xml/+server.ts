import { getPublishedPostMetadata, getUrl } from '$lib/posts';
import { canonicalUrl } from '$lib/site';

const escapeXml = (value: string) =>
  value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

export const GET = () => {
  const posts = getPublishedPostMetadata();
  const paths = [
    '/',
    ...posts.map((post) => getUrl(post.slug)),
    ...new Set(
      posts.flatMap((post) => post.metadata.tags.map((tag) => `/tag/${encodeURIComponent(tag)}`))
    )
  ];
  return new Response(
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
      paths.map((path) => `  <url><loc>${escapeXml(canonicalUrl(path))}</loc></url>`).join('\n') +
      '\n</urlset>\n',
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } }
  );
};
