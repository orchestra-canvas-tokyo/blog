import skill from './blog-skill.md?raw';
import { canonicalUrl } from '$lib/site';

export { skill };
export const skillPath = '/.well-known/agent-skills/read-oct-blog/SKILL.md';

export const apiCatalog = {
  linkset: [
    {
      anchor: canonicalUrl('/api/posts'),
      'service-desc': [
        { href: canonicalUrl('/openapi.json'), type: 'application/vnd.oai.openapi+json' }
      ],
      'service-doc': [{ href: canonicalUrl('/docs/api'), type: 'text/markdown' }],
      status: [{ href: canonicalUrl('/api/status'), type: 'application/json' }]
    }
  ]
};

export const agentSkills = async () => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(skill));
  const hex = [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
  return {
    $schema: 'https://schemas.agentskills.io/discovery/0.2.0/schema.json',
    skills: [
      {
        name: 'read-oct-blog',
        type: 'skill-md',
        description: 'Find and read published OCT concert program notes.',
        url: canonicalUrl(skillPath),
        digest: `sha256:${hex}`
      }
    ]
  };
};

export const aiCatalog = {
  specVersion: '1.0',
  host: {
    displayName: 'Orchestra Canvas Tokyo Blog',
    identifier: 'did:web:blog.orch-canvas.tokyo'
  },
  entries: [
    {
      identifier: 'urn:air:blog.orch-canvas.tokyo:api:program-notes',
      displayName: 'Public program notes API',
      type: 'application/vnd.oai.openapi+json',
      url: canonicalUrl('/openapi.json'),
      representativeQueries: [
        'アルプス交響曲の曲目解説を探す',
        'Find concert program notes by composer',
        'Read an OCT article with source attribution'
      ]
    },
    {
      identifier: 'urn:air:blog.orch-canvas.tokyo:skill:read-oct-blog',
      displayName: 'Read OCT Blog',
      type: 'text/markdown',
      url: canonicalUrl(skillPath),
      representativeQueries: [
        'OCTブログから演奏会の解説を読む',
        'How can I cite an OCT program note?'
      ]
    }
  ]
};

export const discoveryLinks = [
  '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"',
  '</openapi.json>; rel="service-desc"; type="application/vnd.oai.openapi+json"',
  '</docs/api>; rel="service-doc"; type="text/markdown"',
  '</.well-known/ai-catalog.json>; rel="describedby"; type="application/json"',
  '</.well-known/agent-skills/index.json>; rel="describedby"; type="application/json"'
].join(', ');
