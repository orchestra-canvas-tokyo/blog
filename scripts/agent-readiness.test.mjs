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
