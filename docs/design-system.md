# Blog design system

Tokens live in `src/lib/styles/design-system.css`, imported once by the root layout.

| Role                          | Value / convention                                        |
| ----------------------------- | --------------------------------------------------------- |
| Paper                         | `--color-background`: white                               |
| Outer canvas / quiet surfaces | `--color-background-secondary`: #f3f3f1                   |
| Primary ink                   | `--color-text-primary`: #171717                           |
| Supporting text               | `--color-text-secondary`: #595959                         |
| Quiet / strong rules          | `--color-border` / `--color-border-strong`                |
| Base spacing                  | `--spacing-unit`: 4px                                     |
| Section spacing               | `--space-section`: 32–64px, fluid                         |
| Page gutters                  | `--page-gutter`: 20–48px, fluid                           |
| Reading column                | `--reading-width`: 760px maximum                          |
| Interface type                | `--sans-serif`: system Japanese sans-serif stack          |
| Editorial type                | `--serif`: YakuHanMPs + Noto Serif JP and local fallbacks |

- Keep the existing SVG identity. White space and rules carry the visual hierarchy.
- Use serif type for work titles and article prose; sans serif for navigation, dates, tags, and status text.
- Give each route one H1. The root layout owns the main landmark; nested content uses article, section, or div.
- Use native links for navigation and buttons for actions. Keep visible keyboard focus and readable action labels.
- Aim for 44px primary control targets. Smaller inline tag links wrap with explicit gaps.
- Archive previews use a three-line visual clamp; preserve the source text. Do not manually rewrite article excerpts to fit.
- Composer and concert indexes derive from published metadata. Do not create links to empty categories.
- Respect reduced motion and native viewport sizing. Check narrow screens without hiding horizontal overflow globally.
- Constrain prose, allow titles to wrap, and preserve score-image proportions. Article media may use the full reading-column width.
- Validate archive, tag, article, search, policy, and error states when changing global styles. Check both first-visit consent and returning visitors.
