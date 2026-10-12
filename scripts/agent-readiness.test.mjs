import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createServer } from 'vite';

let server;
let origin;
before(async () => {
  server = await createServer({ server: { host: '127.0.0.1', port: 0 } });
  await server.listen();
  origin = `http://127.0.0.1:${server.httpServer.address().port}`;
});
after(async () => server?.close());

test('robots is plain text with explicit search/training policies and canonical sitemap', async () => {
  const response = await fetch(`${origin}/robots.txt`);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /^text\/plain/);
  const text = await response.text();
  assert.match(text, /User-agent: \*/);
  for (const agent of ['OAI-SearchBot', 'Claude-SearchBot', 'PerplexityBot']) {
    assert.ok(
      text.includes(
        `User-agent: ${agent}\nContent-Signal: search=yes, ai-input=yes, ai-train=no\nAllow: /`
      )
    );
  }
  for (const agent of ['GPTBot', 'ClaudeBot', 'Google-Extended']) {
    assert.ok(text.includes(`User-agent: ${agent}\nDisallow: /`));
  }
  assert.match(text, /Sitemap: https:\/\/blog\.orch-canvas\.tokyo\/sitemap.xml/);
});

test('sitemap contains exactly public canonical pages and used tags', async () => {
  const { getPublishedPostMetadata, getUrl } =
    await server.ssrLoadModule('/src/lib/posts/index.ts');
  const posts = getPublishedPostMetadata();
  const response = await fetch(`${origin}/sitemap.xml`);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /^application\/xml/);
  const text = await response.text();
  assert.match(text, /xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9"/);
  const urls = [...text.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
  const tags = new Set(posts.flatMap((post) => post.metadata.tags));
  assert.equal(urls.length, 1 + posts.length + tags.size);
  assert.equal(new Set(urls).size, urls.length);
  for (const post of posts) {
    assert.ok(urls.includes(`https://blog.orch-canvas.tokyo${getUrl(post.slug)}`));
  }
  assert.ok(urls.every((url) => url.startsWith('https://blog.orch-canvas.tokyo/')));
  assert.ok(urls.every((url) => !url.includes('?') && !url.endsWith('.md')));
});

test('Accept negotiation preserves default HTML and respects quality values', async () => {
  for (const accept of [
    '*/*',
    'text/html',
    'text/markdown;q=0',
    'text/markdown;q=0.5, text/html;q=1'
  ]) {
    const response = await fetch(origin, { headers: { Accept: accept } });
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type'), /^text\/html/);
    assert.match(response.headers.get('vary'), /Accept/i);
  }
  for (const accept of [
    'text/markdown',
    'text/markdown;q=1, text/html;q=0.2',
    'text/markdown, */*;q=0.1'
  ]) {
    const response = await fetch(origin, { headers: { Accept: accept } });
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type'), /^text\/markdown/);
    assert.match(response.headers.get('vary'), /Accept/i);
    assert.match(await response.text(), /^# Orchestra Canvas Tokyo Blog/);
  }
});

test('article .md matches negotiation, retains rendered body and resolves asset URLs', async () => {
  const { getPublishedPostMetadata } = await server.ssrLoadModule('/src/lib/posts/index.ts');
  const slug = getPublishedPostMetadata().find((post) =>
    post.slug.includes('alpine-symphony')
  ).slug;
  const direct = await fetch(`${origin}/post/${slug}.md`);
  assert.equal(direct.status, 200);
  assert.match(direct.headers.get('content-type'), /^text\/markdown/);
  const text = await direct.text();
  const negotiated = await fetch(`${origin}/post/${slug}`, {
    headers: { Accept: 'text/markdown' }
  });
  assert.equal(await negotiated.text(), text);
  assert.match(text, /アルプス/);
  assert.ok(text.length > 3000);
  assert.match(text, /!\[.*?\]\(<https:\/\/blog\.orch-canvas\.tokyo\//);
  assert.ok(!text.includes('<script') && !text.includes('export const metadata'));
  const head = await fetch(`${origin}/post/${slug}`, {
    method: 'HEAD',
    headers: { Accept: 'text/markdown' }
  });
  assert.equal(head.status, 200);
  assert.match(head.headers.get('content-type'), /^text\/markdown/);
  assert.equal(await head.text(), '');
});

test('Markdown conversion retains headings, links, lists and tables', async () => {
  const { htmlToMarkdown, wantsMarkdown } = await server.ssrLoadModule(
    '/src/lib/server/markdown.ts'
  );
  const text = htmlToMarkdown(
    '<h2>Title</h2><p><a href="/post/test">link</a></p><ul><li>item</li></ul><table><thead><tr><th>A</th><th>B</th></tr></thead><tbody><tr><td>1</td><td>2</td></tr></tbody></table>',
    'https://blog.orch-canvas.tokyo/'
  );
  assert.match(text, /## Title/);
  assert.match(text, /https:\/\/blog\.orch-canvas\.tokyo\/post\/test/);
  assert.match(text, /\*\s+item/);
  assert.match(text, /\| A \| B \|/);
  assert.equal(wantsMarkdown('text/markdown;q=invalid'), false);
});

test('404s and pagination retain existing semantics for markdown requests', async () => {
  for (const path of [
    '/post/does-not-exist',
    '/post/does-not-exist.md',
    '/?p=99999',
    '/tag/does-not-exist'
  ]) {
    const response = await fetch(`${origin}${path}`, { headers: { Accept: 'text/markdown' } });
    assert.equal(response.status, 404, path);
  }
  const { getPublishedPostMetadata } = await server.ssrLoadModule('/src/lib/posts/index.ts');
  const tag = getPublishedPostMetadata()[0].metadata.tags[0];
  const response = await fetch(`${origin}/tag/${encodeURIComponent(tag)}`, {
    headers: { Accept: 'text/markdown' }
  });
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /^text\/markdown/);
});
