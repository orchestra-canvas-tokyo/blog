# Article sharing images

Every published article receives a 1200 × 630 PNG at `/ogp/<article-slug>.png`. Other pages use `/ogp/default.png`. Both Open Graph and X use these images; X requests `summary_large_image`.

## Design

The reference is Orchestra Canvas Tokyo's YouTube thumbnail hierarchy: the existing logo above centered serif composer and work-title text. The blog version uses black ink on white, matching its inverted relationship to the main website. No video stills, composer portraits, or generated artwork are required.

The composer uses the existing short name. Work titles omit keys and opus/catalogue numbers, but retain symphony numbers, nicknames, and editions. This transformation applies only to sharing-card copy. Article content, metadata, visible titles, and page titles stay unchanged. Articles without a composer use the label 「音楽コラム」.

Long works can have explicit line breaks in `scripts/ogp/content.mjs`. The renderer fits text inside safe bounds and fails with an actionable error if a new title cannot fit legibly. Update card-only line breaks in that case, rather than shortening the article's title.

## Generation

```sh
npm run generate:ogp
npm run test:ogp
```

`npm run dev` and `npm run build` generate the images automatically through their npm lifecycle hooks. The production build also runs the OGP tests before compiling the site. When editing article metadata while the development server is running, rerun `npm run generate:ogp` to refresh the images. A plain `vite build` does not run npm's prebuild hook; use the documented npm command.

The generator reads module-script metadata using Svelte and TypeScript parsers; it does not evaluate article code or load article media. Only published articles are included. After successful generation, obsolete PNGs are removed. Generated PNGs are ignored by Git and served as ordinary static files by the existing deployment. Sharp is a development dependency; no image rendering runs inside the deployed Worker.

Sharing-image URLs use the current page origin, allowing draft preview images to be reviewed before deployment to the production domain. Canonical article URLs continue to point to the production domain.

## Font and reproducibility

The build bundles **Noto Serif JP Regular** (6 MB) under `scripts/ogp/fonts/`, licensed under the SIL Open Font License 1.1. The license is included as `OFL.txt`. The font is a build asset, not a browser download. Generation requires no network access, local system Japanese fonts, API keys, or browser installation.

Source: [Noto CJK — Japanese subset OTF](https://github.com/notofonts/noto-cjk/tree/main/Serif/SubsetOTF/JP), file `NotoSerifJP-Regular.otf`, downloaded 2026-09-05. [Upstream license](https://github.com/notofonts/noto-cjk/blob/main/Serif/LICENSE).

## Verification

Tests cover title simplification, preserved nicknames and editions, literal metadata extraction, PNG rendering, and an exact match between the published article set and generated files. Verify `og:image`, its width/height/type/alt, and the matching `twitter:image` in server-rendered HTML when changing metadata integration. Sharing services may retain cached images until they recrawl a URL.
