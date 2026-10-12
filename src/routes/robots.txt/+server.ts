import { SITE_ORIGIN } from '$lib/site';

const allowedAgents = [
  '*',
  'OAI-SearchBot',
  'Claude-SearchBot',
  'PerplexityBot',
  'ChatGPT-User',
  'Claude-User',
  'Perplexity-User'
];
const trainingAgents = [
  'GPTBot',
  'ClaudeBot',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
  'Bytespider',
  'Amazonbot'
];

export const GET = () =>
  new Response(
    [
      '# Public search and answer retrieval are welcome; model training is not.',
      ...allowedAgents.flatMap((agent) => [
        `User-agent: ${agent}`,
        'Content-Signal: search=yes, ai-input=yes, ai-train=no',
        'Allow: /',
        'Disallow: /_app/',
        'Disallow: /cdn-cgi/',
        ''
      ]),
      ...trainingAgents.flatMap((agent) => [`User-agent: ${agent}`, 'Disallow: /', '']),
      `Sitemap: ${SITE_ORIGIN}/sitemap.xml`,
      ''
    ].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
  );
