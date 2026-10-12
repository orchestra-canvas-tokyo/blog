import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createServer } from 'vite';
import { createHash } from 'node:crypto';
import { mkdir, writeFile, rm } from 'node:fs/promises';

let server;
let origin;
const draftDirectory = new URL(
  '../src/lib/posts/agent-readiness-unpublished-test/',
  import.meta.url
);
before(async () => {
  await mkdir(draftDirectory, { recursive: true });
  await writeFile(
    new URL('post.svelte', draftDirectory),
    '<script module lang="ts">export const metadata = { published: false, publicatedAt: "2026-01-01", title: "UNPUBLISHED_TEST_MARKER", concertSlug: "regular-17", tags: [] };</script><p>UNPUBLISHED_TEST_MARKER</p>'
  );
  server = await createServer({ server: { host: '127.0.0.1', port: 0 } });
  await server.listen();
  origin = `http://127.0.0.1:${server.httpServer.address().port}`;
});
after(async () => {
  await server?.close();
  await rm(draftDirectory, { recursive: true, force: true });
});

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
  assert.ok(!text.includes('agent-readiness-unpublished-test'));
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

test('public API search, paging and article retrieval exclude drafts and validate inputs', async () => {
  const listing = await fetch(`${origin}/api/posts?limit=1&offset=0`);
  assert.equal(listing.status, 200);
  assert.equal(listing.headers.get('access-control-allow-origin'), '*');
  const data = await listing.json();
  assert.equal(data.posts.length, 1);
  assert.ok(data.total > 1);
  const page2 = await (await fetch(`${origin}/api/posts?limit=1&offset=1`)).json();
  assert.notEqual(page2.posts[0].slug, data.posts[0].slug);
  const search = await (
    await fetch(`${origin}/api/posts?q=${encodeURIComponent('アルプス')}`)
  ).json();
  assert.ok(search.total > 0);
  const article = await fetch(`${origin}/api/posts/${search.posts[0].slug}`);
  const content = await article.json();
  assert.equal(article.status, 200);
  assert.ok(content.markdown.length > 3000);
  assert.equal(content.url, search.posts[0].url);
  for (const query of [
    'limit=0',
    'limit=51',
    'limit=1.5',
    'offset=-1',
    'offset=10001',
    `q=${'x'.repeat(201)}`
  ]) {
    assert.equal((await fetch(`${origin}/api/posts?${query}`)).status, 400);
  }
  assert.equal((await fetch(`${origin}/api/posts/missing`)).status, 404);
  assert.equal((await fetch(`${origin}/api/posts`, { method: 'POST' })).status, 405);
  const draftSearch = await (await fetch(`${origin}/api/posts?q=UNPUBLISHED_TEST_MARKER`)).json();
  assert.equal(draftSearch.total, 0);
  for (const path of [
    '/post/agent-readiness-unpublished-test',
    '/post/agent-readiness-unpublished-test.md',
    '/api/posts/agent-readiness-unpublished-test'
  ]) {
    assert.equal(
      (await fetch(`${origin}${path}`, { headers: { Accept: 'text/markdown' } })).status,
      404
    );
  }
});

test('Link headers and catalogs advertise working resources with matching media types', async () => {
  const home = await fetch(origin);
  assert.match(home.headers.get('link'), /rel="api-catalog"/);
  assert.match(home.headers.get('link'), /rel="service-doc"/);
  const catalogResponse = await fetch(`${origin}/.well-known/api-catalog`);
  assert.match(catalogResponse.headers.get('content-type'), /^application\/linkset\+json/);
  const catalog = await catalogResponse.json();
  for (const relation of ['service-desc', 'service-doc', 'status']) {
    for (const link of catalog.linkset[0][relation]) {
      const response = await fetch(`${origin}${new URL(link.href).pathname}`);
      assert.equal(response.status, 200);
      assert.ok(response.headers.get('content-type').startsWith(link.type));
    }
  }
  const spec = await (await fetch(`${origin}/openapi.json`)).json();
  assert.equal(spec.openapi, '3.1.0');
  assert.deepEqual(spec.security, []);
  const ardResponse = await fetch(`${origin}/.well-known/ai-catalog.json`);
  assert.equal(ardResponse.headers.get('access-control-allow-origin'), '*');
  const ard = await ardResponse.json();
  assert.ok(ard.entries.length > 0);
  for (const entry of ard.entries) {
    assert.match(entry.identifier, /^urn:air:blog\.orch-canvas\.tokyo:/);
    assert.notEqual('url' in entry, 'data' in entry);
    assert.ok(entry.representativeQueries.length >= 2);
    assert.equal((await fetch(`${origin}${new URL(entry.url).pathname}`)).status, 200);
  }
});

test('skill digest matches exact bytes served and unavailable auth/MCP are not advertised', async () => {
  const index = await (await fetch(`${origin}/.well-known/agent-skills/index.json`)).json();
  assert.equal(index.$schema, 'https://schemas.agentskills.io/discovery/0.2.0/schema.json');
  const skill = index.skills[0];
  const bytes = Buffer.from(
    await (await fetch(`${origin}${new URL(skill.url).pathname}`)).arrayBuffer()
  );
  assert.equal(skill.digest, `sha256:${createHash('sha256').update(bytes).digest('hex')}`);
  assert.match(bytes.toString(), /name: read-oct-blog/);
  for (const path of [
    '/.well-known/oauth-authorization-server',
    '/.well-known/openid-configuration',
    '/.well-known/oauth-protected-resource',
    '/auth.md',
    '/.well-known/mcp/server-card.json'
  ]) {
    assert.equal((await fetch(`${origin}${path}`)).status, 404);
  }
});

test('WebMCP registers read-only tools, validates arguments and aborts on cleanup', async (t) => {
  const { registerBlogTools } = await server.ssrLoadModule('/src/lib/webmcp.ts');
  const registered = [];
  const cleanup = registerBlogTools({
    registerTool: async (tool, options) => {
      registered.push({ tool, options });
    }
  });
  await new Promise((resolve) => setImmediate(resolve));
  assert.deepEqual(
    registered.map(({ tool }) => tool.name),
    ['search_oct_blog', 'read_oct_article']
  );
  let requested;
  t.mock.method(globalThis, 'fetch', async (path) => {
    requested = path;
    return new Response('{"posts":[]}');
  });
  assert.equal(await registered[0].tool.execute({ query: 'シベリウス', limit: 3 }), '{"posts":[]}');
  assert.equal(new URL(requested, origin).searchParams.get('q'), 'シベリウス');
  await assert.rejects(registered[0].tool.execute({ query: 'x', limit: 0 }));
  await assert.rejects(registered[1].tool.execute({ slug: '../private' }));
  cleanup();
  assert.ok(registered.every(({ options }) => options.signal.aborted));
  assert.doesNotThrow(() => registerBlogTools()());
});
