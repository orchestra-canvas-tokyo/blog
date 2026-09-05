# OGP style proposals

Five visual directions for review in PR #63. All use the same Mozart/Haffner sample,
the blog masthead, regular-weight type, tight kerning, and equal spacing above,
between, and below the text/logo blocks (within one pixel of rounding).
There are no horizontal text dividers or footer words.

These numbers identify **OGP styles**, separately from the numbered findings in
[the design review](../design-review.md). Style 3 is selected and now uses the active renderer with the homepage OCT symbol
and no bottom-right triangle. Styles 1, 2, 4, and 5 remain alternatives; article
content is unchanged.

| Style                 | Direction                                                                      | Preview                                   |
| --------------------- | ------------------------------------------------------------------------------ | ----------------------------------------- |
| 1 — Gallery           | White, centered composition with small corner ornaments.                       | [Full-size PNG](01-gallery.png)           |
| 2 — Concert programme | Warm paper, brown ink, and a delicate perimeter frame.                         | [Full-size PNG](02-concert-programme.png) |
| 3 — Editorial         | Left alignment, blue ink, and the faint homepage OCT symbol.                   | [Full-size PNG](03-editorial.png)         |
| 4 — Night recital     | Charcoal background, ivory type, and muted gold corners.                       | [Full-size PNG](04-night-recital.png)     |
| 5 — Canvas signature  | Right alignment, warm white, curved corner decoration, and a vermilion accent. | [Full-size PNG](05-canvas-signature.png)  |

Refresh the 1200 × 630 previews (style 1 remains its archived PNG) from the repository root:

```sh
node scripts/ogp/style-options.mjs
```

The previews use the bundled regular Noto Serif JP font and the existing SVG
masthead. These documentation PNGs are separate from generated article cards.
