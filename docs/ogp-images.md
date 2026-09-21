# Article sharing images

Every published article receives a 1200 × 630 PNG at `/ogp/<article-slug>.png`. Other pages use `/ogp/default.png`. Both Open Graph and X use these images; X requests `summary_large_image`.

## Design

The selected direction is **OGP style 3 — Editorial**: a left-aligned horizontal OCT logo, middle dot, and 「曲目解説」 heading, regular-weight serif composer and title, blue ink on a cool white canvas, and a slim vertical accent. The faint symbol on the right uses the exact OCT icon outlines from the homepage repository. There is no bottom-right triangle, horizontal divider, or footer copy.

The composer uses the existing short name. Both text blocks use the real Noto Serif JP Regular face, OpenType kerning and proportional Japanese spacing (`kern`/`palt`), and -0.018em tracking. Text grows to fill its safe area: a global maximum of 220px. The main title is fitted first; the composer is capped at the smaller of 100px and the fitted main-title size, and secondary title lines cannot exceed that main-title size. All text is fitted against actual rendered width and height in a 970px-wide area starting 86px from the left. The heading (at exactly the composer’s fitted font size), composer, and each title line are trimmed to their visible bounds, then distributed with equal vertical gaps—including the top and bottom margins (within one pixel of rounding). Work titles omit keys and opus/catalogue numbers, but retain symphony numbers, nicknames, and editions. This transformation applies only to sharing-card copy. Article prose, existing metadata values, visible titles, and page titles stay unchanged; only optional OGP metadata fields are added. Articles without a composer use the label 「音楽コラム」.

Long works can have explicit line breaks in their own `post.svelte` metadata. The renderer fits text inside safe bounds and fails with an actionable error if a new title cannot fit legibly. Update card-only line breaks in that case, rather than shortening the article's title.

## Generation

```sh
npm run generate:ogp
npm run test:ogp
```

`npm run dev` and `npm run build` generate the images automatically through their npm lifecycle hooks. The production build also runs the OGP tests before compiling the site. When editing article metadata while the development server is running, rerun `npm run generate:ogp` to refresh the images. A plain `vite build` does not run npm's prebuild hook; use the documented npm command.

The generator reads module-script metadata using Svelte and TypeScript parsers; it does not evaluate article code or load article media. Only published articles are included. After successful generation, obsolete PNGs are removed. Generated PNGs are ignored by Git and served as ordinary static files by the existing deployment. Sharp is a development dependency; no image rendering runs inside the deployed Worker.

Sharing-image URLs use the current page origin, allowing draft preview images to be reviewed before deployment to the production domain. Canonical article URLs continue to point to the production domain.

## OCT symbol source

`scripts/ogp/oct-symbol.svg` preserves the icon path from
`orchestra-canvas-tokyo/homepage/src/routes/logo.svg` at commit
`8e7babd933b93dc6db7938616242e4cceb8748ba`. Only the wrapper/viewBox and fill
are adapted to display the standalone icon in pale blue, anchored flush to the
right and bottom edges. The horizontal OCT wordmark
uses `scripts/ogp/oct-wordmark.svg`, copied from the homepage’s
`src/routes/logo.svg` (also used for the comparison proposals).

## Font and reproducibility

The build bundles **Noto Serif JP Regular** (6 MB) under `scripts/ogp/fonts/`, licensed under the SIL Open Font License 1.1. The license is included as `OFL.txt`. The font is a build asset, not a browser download. Generation requires no network access, local system Japanese fonts, API keys, or browser installation.

Source: [Noto CJK — Japanese subset OTF](https://github.com/notofonts/noto-cjk/tree/main/Serif/SubsetOTF/JP), file `NotoSerifJP-Regular.otf`, downloaded 2026-09-05. [Upstream license](https://github.com/notofonts/noto-cjk/blob/main/Serif/LICENSE).

## Verification

Tests cover title simplification, preserved nicknames and editions, literal metadata extraction, PNG rendering, and an exact match between the published article set and generated files. Verify `og:image`, its width/height/type/alt, and the matching `twitter:image` in server-rendered HTML when changing metadata integration. Sharing services may retain cached images until they recrawl a URL.

## Human review gallery

[Preview every generated OGP image](ogp-review/README.md), including the default card.
The gallery contains committed PNG snapshots, so GitHub can show every image before
preview deployment completes.

Run `npm run review:ogp` after changing the renderer, card copy, or published article
set, and commit the updated gallery alongside the change. This renders the cards
once, copies the exact generated bytes into `docs/ogp-review/`, and rebuilds the
numbered Markdown index. Ordinary dev/build generation does not modify the review
snapshots. Review snapshots are documentation only; deployed images come from
`static/ogp/`.

The default card contains only the original blog masthead, scaled to 1058px wide on the
1200px canvas, centered horizontally and vertically. Its 71px side margins are
approximately 20% larger than the previous 59px gutters, which were based on the
internal gap between the orchestra name and BLOG. Original logo proportions and
internal spacing are preserved; top and bottom margins follow its aspect ratio. It has no 「曲目解説」 title, composer row, or tagline.

## Per-post OGP metadata

Keep OGP-only line breaks next to the article title in `metadata`:

```ts
ogpTitleLines: ['「ウェストサイドストーリー」より', 'シンフォニックダンス'],
ogpMainTitleLine: 1,
```

`ogpTitleLines` is optional and contains one or two nonempty literal strings,
used exactly as written. Without it, the generator simplifies `title` into one line.
Do not put newline characters inside an entry. `ogpMainTitleLine` is a zero-based
index: 0 (default) selects the first row, 1 selects the second. Display order stays
unchanged; the selected row sets the font-size ceiling for the composer and other
rows. Invalid arrays or indexes fail generation. Metadata is parsed without
executing post code. These fields do not alter the visible article title or prose.

After editing these fields, run `npm run review:ogp` and commit the refreshed
all-in-one gallery. Its numbered entries also identify each card's main title row.

## Adopted article header

The first row combines the horizontal OCT logo, a middle dot, and 「曲目解説」.
The logo-to-label separation is 96px. The default retains the original blog logo,
centered at 1058px wide with 71px side margins.

## Mixed Japanese/Latin typography

The header aligns **roman baselines**, rather than matching ink bounding-box centers.
Japanese ideographic and Latin roman baselines are distinct; this does not mean
forcing the visible bottoms of the characters to coincide.

Sources consulted:

- [Adobe: composite-font size and baseline adjustment](https://www.adobe.com/jp/creativecloud/roc/blog/design/quiz-challenge/composite-font.html): adjust size and baseline for the particular font pairing; inspect the result visually.
- [OpenType BASE specification](https://learn.microsoft.com/en-us/typography/opentype/spec/base): different scripts have distinct baseline coordinates and alignment depends on the selected baseline system.

Implementation for this specific logo/font pairing:

- The outlined logo has no font metrics. Its flat T provides the roman baseline
  at SVG y=236.67 and cap height 134.15 (cap top y=102.52).
- Japanese visible ink is sized to **108% of the wordmark's Latin cap height**.
  This replaces the earlier em-based 120% setting: the target is now near-equal
  visible size with a small optical allowance for Japanese stroke density.
  The 8% allowance is a design choice for this pairing, not a universal rule.
- A temporary Latin H is rendered on the same Pango line as 「曲目解説」 to recover
  the roman baseline after trimming. The probe is excluded from the output.
  Japanese extends naturally below that shared baseline.
- Heading and composer remain the same font size and never exceed the main title.
  Fitting accounts for the complete header and the fixed 96px gap.
- Pixel tests check baseline alignment within 1.5px, Japanese ink approximately 8% taller than Latin capitals, absence of the probe, and safe-width bounds. The default image is unchanged.
