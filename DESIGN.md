# Design of the HoulgateFest site

The site follows [Material Design 3](https://m3.material.io) without a UI kit: the M3 tokens are
CSS custom properties and the components are small React components in `src/ui`. This file says
what the site should look like and the rules that keep it that way.

## Direction

- **Ours, not a template.** Our own photos carry the site (the beach, the house, the costumes, the
  games), the texts are the organisers' and are reread by one of them.
- **The phone first.** Most visits are on a phone, often at night or outside, and the shotgun is a
  race: the shotgun is in the bottom navigation bar, under the thumb.
- **One signature.** The M3 "cookie" shape (`src/ui/EditionBadge.jsx`) holds the year of an
  edition and the H of the logo. It is the only decorative shape.

## Tokens

| What                                         | Where                                             | Notes                                                                         |
| -------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------- |
| Colour                                       | `src/styles/scheme.css`, generated                | `npm run theme` (run by `dev` and `build`) from `src/content/themeSeeds.json` |
| Type, shape, elevation, motion, state layers | `src/styles/tokens.css`                           | M3 names: `--md-sys-typescale-*`, `--md-sys-shape-corner-*`…                  |
| Defaults and type scale classes              | `src/styles/base.css`                             | `.headline-large`, `.body-medium`…                                            |
| Components                                   | `src/styles/components.css`                       | One block per component of `src/ui`                                           |
| Pages                                        | next to each page (`shotgun.css`, `history.css`…) |                                                                               |

- **Seed**: `#85b3dc`, the sea and the sky of the beach photo of 2020, picked with the quantizer and
  score of `@material/material-color-utilities`. The tertiary palette is the sand of the same photo
  (`#d99332`). Scheme variant: Vibrant.
- **Editions**: each one has a seed from its old poster; `.edition-<year>` redefines the primary and
  surface roles, so a card in the history takes its edition's colours.
- **Dark mode** follows the system unless the user chose with the toggle (`data-theme` on `<html>`).
- **Contrast** comes from the role pairs only: text in `on-X` on an `X` background. Never pick a
  hex value in a component.
- **Font**: Roboto Flex, latin subset, weight axis, self-hosted in `web/static/fonts` (34 KB).
- **Icons**: Material Symbols Rounded paths in `src/ui/icons.js` (add one by copying its path from
  `@material-symbols/svg-400/rounded`). Filled for the selected navigation destination only.

## Components

`src/ui` has Button (filled, tonal, outlined, elevated, text), IconButton, TextField and Select
(outlined), Checkbox, Switch, Card, List, chips (assist, filter, input), Notice, Dialog and
ConfirmDialog (a bottom sheet on phones with `sheet`), Snackbar, Tabs, progress indicators,
navigation (bar, rail, drawer), Photo, PhotoViewer and EditionBadge.

Each one has the M3 state layers (hover 8 %, focus and pressed 10 %), a 48 × 48 px target, a
visible `:focus-visible` ring, works in light and dark and honours `prefers-reduced-motion`.
Dialogs are native modal `<dialog>`s: the page behind is inert, Esc closes, the focus comes back.

Errors and confirmations are snackbars (`showError`, `showSnackbar`), never `window.alert()`.

## Layout

- Compact (< 600 px): top app bar, navigation bar at the bottom (Accueil, Shotgun, Trajets,
  Scores, Plus), the rest in the drawer.
- Medium and expanded (≥ 600 px): navigation rail with a menu button for the drawer, content up to
  1040 px (1280 px for the shotgun and the admin).
- Layout is CSS only: no JavaScript measuring the window.

## Content

- The homepage is `src/content/currentEdition.js`, the history `src/content/editions.js`, the
  photos `src/content/photos.js`. Next year's update is a change of these files.
- Photos are in `web/static/photos` as AVIF and WebP, 640 px wide and at their largest size (up to
  1280 px), with their size and a French alt text in `photos.js`. They were made with `sharp`
  (AVIF quality 42, WebP quality 60).
- The share image (`share.jpg`, 1200 × 630) is the beach photo of 2020.

## Alcohol

The site is about the theme, the costumes, the games, the house, the beach and the trips. France's
Loi Évin restricts how alcohol is shown online, which backs this up.

- No drink icon, emoji, section or wording ("apéro", "open bar", "soirée arrosée"…), in the copy,
  the checklist or the theme keywords.
- No photo where a drink is the subject or in the foreground. The hero, the share image and the
  first photo of each edition show no drink at all.
- The 2022 edition keeps its real name in the history list only, in sentence case, never in a page
  title, a meta tag or a share image.

## Never use

Gradients behind text, glassmorphism, floating blobs, 3D emoji, stock illustrations, AI-generated
images, rows of three "feature" cards with an icon each, fake stats or testimonials, emoji
in headings, copy full of em dashes or lists of three adjectives, `!important`, inline styles,
IDs for styling.

## Quality bar

- WCAG 2.2 AA: landmarks, skip link, labels on every field, errors under their field, focus moved
  to the page on navigation, live regions for the countdown (once a minute) and the snackbars.
- Lighthouse CI on `/`, `/history` and `/shotgun` as a phone: at least 95 in every category
  (`lighthouserc.json`).
- Budgets (`npm run budgets`, gzipped): JS ≤ 300 KiB, CSS ≤ 50 KiB, font ≤ 60 KiB.
