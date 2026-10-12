import assert from 'node:assert/strict';
import { before, after, test } from 'node:test';
import { build } from 'esbuild';
import { Miniflare } from 'miniflare';
import { resolve } from 'node:path';

let worker;
before(async () => {
  // Browser-platform bundling catches npm browser-field substitutions that a
  // Node SSR test does not. This is the Pages Worker produced by npm run build.
  const bundle = await build({
    entryPoints: ['.svelte-kit/cloudflare/_worker.js'],
    bundle: true,
    platform: 'browser',
    format: 'esm',
    external: ['cloudflare:workers'],
    write: false,
    logLevel: 'silent'
  });
  worker = new Miniflare({
    modulesRoot: process.cwd(),
    modules: [
      {
        type: 'ESModule',
        path: resolve('.svelte-kit/cloudflare-smoke.mjs'),
        contents: bundle.outputFiles[0].text
      }
    ],
    compatibilityDate: '2026-06-18',
    compatibilityFlags: ['nodejs_als'],
    // No static-asset HTTP server is needed for these dynamic endpoints.
    serviceBindings: { ASSETS: async () => new Response('Not found', { status: 404 }) }
  });
});
after(async () => worker?.dispose());

test('Pages Worker serves rendered Markdown without a browser document', async () => {
  const origin = 'https://blog.orch-canvas.tokyo';
  const path = '/post/20260724-r-strauss-alpine-symphony';
  const direct = await worker.dispatchFetch(`${origin}${path}.md`);
  assert.equal(direct.status, 200);
  assert.match(direct.headers.get('content-type'), /^text\/markdown/);
  const text = await direct.text();
  assert.match(text, /アルプス/);
  assert.match(text, /!\[.*?\]\(<https:\/\/blog\.orch-canvas\.tokyo\//);
  const negotiated = await worker.dispatchFetch(`${origin}${path}`, {
    headers: { Accept: 'text/markdown' }
  });
  assert.equal(await negotiated.text(), text);
  const html = await worker.dispatchFetch(`${origin}${path}`);
  assert.match(html.headers.get('content-type'), /^text\/html/);
});

test('Pages Worker serves crawl rules and discovery using native crypto', async () => {
  for (const [path, type] of [
    ['/robots.txt', 'text/plain'],
    ['/sitemap.xml', 'application/xml'],
    ['/.well-known/api-catalog', 'application/linkset+json'],
    ['/.well-known/agent-skills/index.json', 'application/json']
  ]) {
    const response = await worker.dispatchFetch(`https://blog.orch-canvas.tokyo${path}`);
    assert.equal(response.status, 200, path);
    assert.ok(response.headers.get('content-type').startsWith(type), path);
  }
});

test('Pages Worker public API returns full article Markdown', async () => {
  const response = await worker.dispatchFetch(
    'https://blog.orch-canvas.tokyo/api/posts/20260724-r-strauss-alpine-symphony'
  );
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('access-control-allow-origin'), '*');
  const article = await response.json();
  assert.ok(article.markdown.length > 3000);
});
