# Shared Design Tokens

Centralized design tokens, global styles, and theme support (light/dark) for the portfolio workspace.

## What’s Inside

- **SCSS tokens** (partials under `src/lib`):
	- `_variables.scss`: colors, spacing, typography, radii, shadows, breakpoints, z-index
	- `_mixins.scss`: layout, responsive, typography and utility mixins
	- `_theme.scss`: CSS custom properties with light and dark schemes
	- `_globals.scss`: resets + base styles that consume the theme variables (includes global icon style)
	- `_grid.scss`: grid utilities for column/row flows
- **TypeScript tokens** (`design-tokens.ts`): JS-accessible constants
	- `colors`, `palette`, `semantic`
	- `typography`, `spacing` + `space` (numeric scale), `sizing`
	- `borderRadius`, `border`, `shadows`, `elevation`
	- `transitions`, `motion`
	- `zIndex`, `layers`, `breakpoints`, `opacity`
	- `components` (optional helpers)

## Usage

### 1) Global styles (recommended)

Import globals once in your app stylesheet so base styles and theme variables are available everywhere:

```scss
/* apps/portfolio/src/styles.scss */
@use '../../../libs/shared/design-tokens/src/lib/variables' as tokens;
@use '../../../libs/shared/design-tokens/src/lib/mixins' as *;
@use '../../../libs/shared/design-tokens/src/lib/globals';
```

Notes:
- Sass cannot use TypeScript path aliases; prefer relative paths as shown above.
- SCSS partials are named with leading underscores but are imported without the underscore or extension.

### 2) Component styles (optional)

If you need tokens inside a component’s inline styles, import using a relative path from that file:

```scss
@use '../../../../../libs/shared/design-tokens/src/lib/variables' as tokens;
@use '../../../../../libs/shared/design-tokens/src/lib/mixins' as *;

// Examples
.card {
	padding: tokens.space(16); // numeric spacing scale
	box-shadow: elevation-value(md); // function
	@include elevation(md); // mixin
}

.label-muted {
	color: tokens.semantic('text-muted'); // semantic alias (quoted map key)
}

### 3) TypeScript tokens

Import JS tokens for runtime logic (e.g., theming in charts):

```ts
import {
	colors,
	palette,
	semantic,
	spacing,
	space,
	typography,
	sizing,
	borderRadius,
	elevation,
	motion,
	layers,
} from '@portfolio/shared/design-tokens';

// Example usage
const primary = semantic.primary;
const gutter = spacing.md; // named scale
const gutterNumeric = space[16]; // numeric scale
const iconMd = sizing.icon.md;
const easing = motion.easing.standard;
```

### 4) Responsive Grid

The grid utilities support filling by columns (left→right) or by rows (top→bottom):

```scss
// Fill left→right, wrap after N columns
.cards {
	@include grid-by-columns(1); // mobile
	@include media-md { @include grid-by-columns(2); }
	@include media-lg { @include grid-by-columns(3); }
}

// Fill top→bottom, wrap after N rows
.timeline {
	@include grid-by-rows(2); // 2 rows; items flow down, then create new column
	@include media-lg { @include grid-by-rows(3); }
}

// Utility classes (available globally)
// .grid, .grid-cols-1..4, .grid-rows-1..3
```

Notes:
- `grid-by-columns(n)` uses `grid-auto-flow: row` + `grid-template-columns: repeat(n, 1fr)`.
- `grid-by-rows(n)` uses `grid-auto-flow: column` + `grid-template-rows: repeat(n, auto)`.
- Combine with `media-*` mixins to adapt layout per breakpoint.
```

Tip: Paths will vary based on where the component lives. Using global styles reduces the need for these imports.

### 5) Icons (Material Symbols)

Material Symbols are loaded globally (see `apps/portfolio/src/index.html`). A base style is provided in `_globals.scss`:

```html
<!-- index.html -->
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
/>
```

```scss
// _globals.scss
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  font-size: icon-size(md);
  line-height: 1;
  display: inline-block;
}
```

Usage in components:

```html
<span class="material-symbols-outlined" aria-hidden="true">menu</span>
<span class="material-symbols-outlined" aria-hidden="true">close</span>
```

### 6) SCSS Helpers

Common helper functions and mixins available in `_variables.scss` and `_mixins.scss`:

```scss
// Spacing (numeric scale)
.card { padding: tokens.space(16); } // 1rem

// Semantic colors (map keys with hyphens should be quoted)
.text-muted { color: tokens.semantic('text-muted'); }

// Elevation (shadow)
.panel { box-shadow: elevation-value(md); }
.panel-raised { @include elevation(md); }

// Transitions
.link { transition: color transition-value(base); }
.button { @include transition(background-color, base); }

// Container width helper
.container { max-width: container-width(lg); }

// Icon sizing
.icon { font-size: icon-size(md); }

// Media mixins
.grid {
	@include media-sm { /* styles for ≥640px */ }
	@include media-md { /* styles for ≥768px */ }
	@include media-lg { /* styles for ≥1024px */ }
	@include media-xl { /* styles for ≥1280px */ }
	@include media-2xl { /* styles for ≥1536px */ }
}
```

## Dark Mode

Dark mode is implemented via CSS custom properties:

- `:root` defines the **light** theme by default
- `html.dark` applies the **dark** theme
- `html.light` explicitly re-applies **light** theme
- `html[data-theme='dark']` is supported as an alternative
- `@media (prefers-color-scheme: dark)` adjusts defaults to match system preference

Example toggle component (added in the portfolio header) switches between classes:

```ts
const html = document.documentElement;
html.classList.add('dark');   // enable dark
html.classList.remove('light');

// or
html.classList.add('light');  // enable light
html.classList.remove('dark');
```

Because base styles in `_globals.scss` consume `var(--color-...)`, the entire app updates instantly.

## Best Practices

- Prefer importing `_globals.scss` once in the app stylesheet.
- Use tokens for spacing, typography, and colors instead of hard-coded values.
- Rely on mixins like `button-base`, `focus-ring`, and `elevation-*` for consistency.
- Favor semantic tokens (`semantic.primary`, `semantic.text`) over raw palette values in app code.
- Keep component-level SCSS imports minimal; reach for global styles first.

## Build & Test

- Build: `nx build design-tokens`
- Test: `nx test design-tokens`

This library is unbundled SCSS + TS constants; building primarily validates TypeScript exports.

## Troubleshooting

- "Can't find stylesheet to import": Ensure you’re using **relative paths** in SCSS (Sass does not honor TS path aliases).
- Theme not changing: Verify `html` has either `dark` or `light` class and that `_globals.scss` is loaded.

