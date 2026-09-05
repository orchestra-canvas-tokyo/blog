# Blog design and UX review

Reviewed 2026-09-04. Reference: https://www.orch-canvas.tokyo/ and its local homepage checkout. Scope: shared layouts, archive/tag browsing, article presentation, search, consent controls, metadata, error states, content-loading architecture, and build configuration. Article source files and factual metadata were not edited.

## Design direction

Keep the blog as the white-paper counterpart to the homepage's black canvas. Retain the original geometric logo and wordmark; use monochrome rules and typography to create hierarchy. Colorful artwork remains part of the articles and concert flyers, rather than becoming interface decoration.

The archive supports discovery; the article page supports sustained reading. Sans-serif navigation and metadata distinguish controls from the Japanese serif article text. The archive remains a single column so long work titles can be scanned without competing cards.

## Findings addressed

| No. | Finding                                                                          | Change                                                                                                                                                                                    |
| --- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Readers had to discover composer/concert tags inside individual previews.        | Added expandable indexes containing only tags with published articles, counts, and the current selection.                                                                                 |
| 2   | Search was an isolated icon with no visible explanation.                         | Added a text label, initial guidance, a load-failure message and reload recovery, and more usable mobile input spacing.                                                                   |
| 3   | Layout depended on a JavaScript viewport adjustment below 375px.                 | Removed the viewport override and resize listener; used fluid gutters and layouts checked at 320px.                                                                                       |
| 4   | The shared logo was the H1 on every page; article titles were H2s.               | Made the logo a home link and gave archive, article, policy, and error pages their own H1. Added one shared main landmark, a Japanese document language, doctype, and keyboard skip link. |
| 5   | Article text ran across nearly the full site width.                              | Constrained reading to 760px, retained Japanese serif text, and increased paragraph line height to 1.95.                                                                                  |
| 6   | Preview spacing, dividers, dates, and pagination lacked a consistent hierarchy.  | Standardized rows, semantic dates, restrained dividers, reading links, and numbered pagination with current-page labels.                                                                  |
| 7   | Paginated archives declared the first page canonical.                            | Added distinct canonical URLs for later archive and tag pages; added descriptions and Open Graph metadata.                                                                                |
| 8   | Fixed-size videos and stretched flyer sizing were fragile.                       | Added responsive 16:9 video presentation and intrinsic flyer sizing. Shared figures, flyers, and videos now load lazily.                                                                  |
| 9   | Error pages offered no recovery action.                                          | Added Japanese explanations, a return-to-archive link, and noindex metadata.                                                                                                              |
| 10  | Keyboard focus, motion preferences, and consent-banner sizing were inconsistent. | Added shared focus and reduced-motion rules, mobile-safe banner bounds, and larger consent controls.                                                                                      |

## Validation

- Production build passed using the existing Cloudflare adapter.
- ESLint and Prettier for changed files passed.
- Svelte check: zero errors; environment warning about missing Node type definitions remains.
- Chromium checks passed for a single main/H1, concert browsing, search results, Escape focus restoration, page-two canonical URLs, and mobile empty results.
- No horizontal overflow at 320, 375, 768, or 1440px on the archive, an article, cookie policy, and 404 page.
- Additional browser checks passed for keyboard skip navigation, failed-search reload recovery, Back-button closure after recovery, and three image-heavy articles at 320px.
- Desktop archive/article and mobile archive/search screenshots inspected. Browser checks ran against the local development server, not a deployed preview.
- `git diff -- src/lib/posts` is empty: article content, article metadata, and article assets are unchanged.

## Remaining technical findings

These are distinct from the visual refinement and should receive focused follow-up:

1. **Content loading:** `src/lib/posts/index.ts` eagerly imports every article component. Route-level lazy imports and a separate metadata index would keep archive JavaScript from growing with the complete article corpus. Search already defers its raw-text index; preserve that behavior. No measured production performance score is claimed here.
2. **Consent lifecycle:** removing injected script elements does not undo JavaScript that has already executed. Review vendor-specific consent withdrawal behavior separately. Storage access also currently assumes localStorage is available. This review adjusts presentation, not tracking semantics or policy wording.
3. **Concert promotion maintenance:** the article template hard-codes the next concert. Move promotion content into a shared, date-aware source to avoid stale advertising after the event. Concert facts were not changed in this pass.
4. **Article accessibility:** shared Figure images use empty alt text, and authored sections generally begin at H3. Correct descriptions and section hierarchy require an editorial pass across articles, outside the requested content-preservation boundary.
5. **Repository guidance:** README/CLAUDE references to older post files, conductor metadata, and template commands differ from the current implementation. CI currently checks formatting/types/lint but does not run the production build.

## Maintenance

See [design-system.md](design-system.md) for the shared tokens and interface conventions. No dependencies, deployment settings, or production resources were changed.
