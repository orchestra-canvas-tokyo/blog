type Tool = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (input: Record<string, unknown>) => Promise<string>;
};
type ModelContext = {
  registerTool: (tool: Tool, options?: { signal: AbortSignal }) => Promise<void> | void;
};

/** Feature-detected public retrieval only; AbortSignal controls registration lifetime. */
export const registerBlogTools = (context?: ModelContext): (() => void) => {
  if (!context?.registerTool) return () => {};
  const controller = new AbortController();
  const readJson = async (path: string) => {
    const response = await fetch(path, {
      signal: controller.signal,
      credentials: 'omit',
      headers: { Accept: 'application/json' }
    });
    if (!response.ok) throw new Error(`OCT Blog returned HTTP ${response.status}`);
    return JSON.stringify(await response.json());
  };
  const tools: Tool[] = [
    {
      name: 'search_oct_blog',
      description:
        'Search published Orchestra Canvas Tokyo program notes. Read-only; returns titles, descriptions and canonical URLs.',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', minLength: 1, maxLength: 200 },
          limit: { type: 'integer', minimum: 1, maximum: 50 }
        },
        required: ['query'],
        additionalProperties: false
      },
      execute: async ({ query, limit = 10 }) => {
        if (
          typeof query !== 'string' ||
          !query.trim() ||
          query.length > 200 ||
          typeof limit !== 'number' ||
          !Number.isInteger(limit) ||
          limit < 1 ||
          limit > 50
        )
          throw new Error('Invalid search input');
        return readJson(`/api/posts?${new URLSearchParams({ q: query, limit: String(limit) })}`);
      }
    },
    {
      name: 'read_oct_article',
      description:
        'Read one published OCT program note by slug. Read-only; returns Markdown and canonical source URL.',
      inputSchema: {
        type: 'object',
        properties: {
          slug: { type: 'string', minLength: 1, maxLength: 200, pattern: '^[a-zA-Z0-9_-]+$' }
        },
        required: ['slug'],
        additionalProperties: false
      },
      execute: async ({ slug }) => {
        if (typeof slug !== 'string' || slug.length > 200 || !/^[a-zA-Z0-9_-]+$/.test(slug))
          throw new Error('Invalid article slug');
        return readJson(`/api/posts/${encodeURIComponent(slug)}`);
      }
    }
  ];
  // A rejected registration should not affect the ordinary browser interface.
  void (async () => {
    try {
      for (const tool of tools) {
        if (controller.signal.aborted) break;
        await context.registerTool(tool, { signal: controller.signal });
      }
    } catch {
      controller.abort();
    }
  })();
  return () => controller.abort();
};

export const registerBrowserBlogTools = () =>
  registerBlogTools(
    (document as Document & { modelContext?: ModelContext }).modelContext ??
      (navigator as Navigator & { modelContext?: ModelContext }).modelContext
  );
