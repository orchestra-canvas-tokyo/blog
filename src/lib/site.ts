/** Production canonical origin. Preview deployments must not enter discovery documents. */
export const SITE_ORIGIN = 'https://blog.orch-canvas.tokyo';

export const canonicalUrl = (path: string): string => new URL(path, SITE_ORIGIN).href;
