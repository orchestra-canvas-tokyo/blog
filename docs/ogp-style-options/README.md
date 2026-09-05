# OGP style proposals

Five visual directions for review in PR #63. All use the same Mozart/Haffner sample,
the blog masthead, regular-weight type, tight kerning, and equal spacing above,
between, and below the text/logo blocks (within one pixel of rounding).
There are no horizontal text dividers or footer words.

These numbers identify **OGP styles**, separately from the numbered findings in
[the design review](../design-review.md). Style 1 is the current template; styles
2–5 are proposals and do not change the active generator or article content.

| Style                 | Direction                                                                      | Preview                                   |
| --------------------- | ------------------------------------------------------------------------------ | ----------------------------------------- |
| 1 — Gallery           | White, centered composition with small corner ornaments.                       | [Full-size PNG](01-gallery.png)           |
| 2 — Concert programme | Warm paper, brown ink, and a delicate perimeter frame.                         | [Full-size PNG](02-concert-programme.png) |
| 3 — Editorial         | Left alignment, blue ink, and a pale geometric motif.                          | [Full-size PNG](03-editorial.png)         |
| 4 — Night recital     | Charcoal background, ivory type, and muted gold corners.                       | [Full-size PNG](04-night-recital.png)     |
| 5 — Canvas signature  | Right alignment, warm white, curved corner decoration, and a vermilion accent. | [Full-size PNG](05-canvas-signature.png)  |

Regenerate the 1200 × 630 PNGs from the repository root:

```sh
node scripts/ogp/style-options.mjs
```

The proposals use the bundled regular Noto Serif JP font and the existing SVG
masthead. They are stored in documentation only and are not shipped as blog cards.
