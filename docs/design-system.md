# Mk.01 Design System

One neutral ramp, one accent, one sans, one mono, one grid. Everything lives in
`src/lib/styles/tokens.css`; components reference tokens by name and never
hard-code a colour, duration or size.

## Principles

- **Reduce until it carries intent.** Hairlines, whitespace and type do the work;
  boxes, gradients and glows are not used.
- **The system voice is mono.** Index numbers, metadata and captions are set in
  IBM Plex Mono, uppercase, 12px. Content is set in Inter.
- **Motion explains, never decorates.** Idle surfaces are still; motion answers
  input. Every animation has a reduced-motion equivalent.
- **Performance is a design constraint.** The largest element on every page
  paints immediately and is never animated in.

## Type

| Token            | Use                       | Size (320 → 1600px)    | Tracking |
| ---------------- | ------------------------- | ---------------------- | -------- |
| `--text-display` | Page-defining statements  | 52 → 168px             | −0.052em |
| `--text-h1`      | Page titles               | 44 → 104px             | −0.045em |
| `--text-h2`      | Section titles            | 34 → 68px              | −0.036em |
| `--text-h3`      | Sub-sections              | 24 → 36px              | −0.024em |
| `--text-lead`    | Introductions             | 19 → 24px              | −0.016em |
| `--text-body`    | Copy                      | 17px / 1.55            | −0.011em |
| `--text-label`   | Mono metadata             | 12px, uppercase        | +0.04em  |

Inter is self-hosted with the optical-size axis, so display sizes get the
tighter Display cut automatically. Utilities: `.display .h1 .h2 .h3 .h4 .lead
.label .secondary .muted`.

## Colour

| Token          | Light     | Dark      | Contrast on bg |
| -------------- | --------- | --------- | -------------- |
| `--fg`         | `#0b0b0c` | `#f3f3f4` | 19.7 / 17.7    |
| `--fg-2`       | `#4b4c52` | `#a6a7ad` | 8.6 / 8.2      |
| `--fg-3`       | `#6e6f76` | `#86878e` | 5.0 / 5.5      |
| `--accent`     | `#2450e6` | `#7b96ff` | 6.2 / 7.2      |
| `--line`       | `#e4e4e7` | `#232326` | decorative     |
| `--line-control` | `#8b8c93` | `#6a6b72` | ≥ 3:1 (WCAG 1.4.11) |

Every text token passes WCAG AA on both `--bg` and `--bg-raised`. The theme
follows the OS unless the visitor picks Light/Dark (footer switch or ⌘K); the
choice is applied before first paint by an inline script in `app.html`.

## Grid & space

- 12 columns, fluid margin `clamp(20px, …, 72px)`, gutter `clamp(16px, …, 32px)`,
  max width 1600px. Use `.wrap` + `.grid`; sections label in columns 1–3 and set
  content from column 4.
- 4px base spacing (`--space-1` … `--space-10`); sections are separated by
  `--section` (96 → 192px), owned by the top edge so it never doubles.
- Press **G** anywhere to overlay the live grid with its measured values.

## Motion

- Curves: `--ease-out` (default), `--ease-in-out`; durations 120 / 220 / 420 / 800ms.
- `data-reveal` uses CSS scroll-driven animation (`animation-timeline: view()`):
  zero JavaScript, and unsupported browsers simply show the content.
- Route changes cross-fade with the View Transitions API; the header is excluded
  so it stays perfectly still.
- Canvas pieces (`SignalField`, `LabCanvas`) sleep off-screen and in hidden tabs,
  cap DPR at 2, read colours from tokens, and render on demand under reduced motion.

## Components

| Component        | Purpose                                                    |
| ---------------- | ---------------------------------------------------------- |
| `PageHeader`     | Label, title, lead and actions for every secondary page    |
| `SectionHead`    | Indexed section label + title + intro on the 12-col grid   |
| `Plate`          | Resolution-independent drawing for each case study         |
| `LabGlyph`       | Deterministic per-experiment drawing                       |
| `CommandPalette` | Native `<dialog>` combobox, fuzzy search over a static index |
| `Kbd`, `LocalTime`, `ThemeSwitch`, `CtaBand` | Small, single-purpose primitives |
