# Design of the HoulgateFest site

The site looks like a keynote stage, in the spirit of a Google I/O keynote: a near-black stage,
huge headlines in Google Sans, and four flat colours as geometric shapes placed with intent. It is
built without a UI kit: tokens as CSS custom properties (with the M3 role names, so the components
read them as before) and small React components in `src/ui`. This file says what the site should
look like and the rules that keep it that way.

## Direction

- **A stage, one idea per slide.** Lots of empty space; each section of the homepage and the
  history says one thing (the edition, the photo, the shotgun date, the organisers' word, the
  past editions) and slides in once as it reaches the screen.
- **Huge type.** Headlines in Google Sans Flex, sentence case, tight tracking, far bigger than the
  body: the contrast of sizes does the work, not boxes or colours behind text.
- **Four flat colours as shapes.** Blue, red, yellow and green, as circles, half discs, triangles,
  squares, pills, bars and arcs, placed next to a headline as a composition with a meaning (the
  homepage's is the sun setting on the sea at Houlgate, with a red sail), never sprinkled.
- **Ours, not a template, and not Google's.** No Google logo, wordmark or colour bar, nothing that
  could pass for Google. Our own photos carry the site, the texts are the organisers'.
- **The app pages stay tools.** Shotgun, trips, scores, account and admin keep the stage (dark,
  Google Sans, the colours as accents) but stay dense: the shotgun is a race on a phone.

## Tokens

| What                                         | Where                                              | Notes                                                             |
| -------------------------------------------- | -------------------------------------------------- | ----------------------------------------------------------------- |
| Colour                                       | `src/styles/stage.css`                             | The stage, the four colours and the M3 roles mapped on them       |
| Type, shape, elevation, motion, state layers | `src/styles/tokens.css`                            | M3 names, plus `--stage-*` for the keynote type and spacing       |
| Defaults and type classes                    | `src/styles/base.css`                              | `.stage-headline`, `.stage-title`, `.stage-lead`, `.body-medium`… |
| Components and shapes                        | `src/styles/components.css`                        | One block per component of `src/ui`                               |
| Pages                                        | next to each page (`homepage.css`, `history.css`…) | Each page's compositions of shapes                                |

- **Stage**: `#0e0f12`, near black, not pure black; raised surfaces are greys up to `#2b2e35`.
- **The four colours**: blue `#4285f4`, red `#ea4335`, yellow `#fbbc04`, green `#34a853`, flat,
  for shapes, fills and large text; their light tints (`--stage-*-text`) for small text on the
  stage. Text on a colour is the stage's ink (`#0e0f12`).
- **Roles**: blue leads (actions, links, selection), yellow is pending or needs attention, red is
  errors and what can't be undone, green is free. In the shotgun: free green, pending yellow, the
  user's room blue, taken grey, always with a label and an icon.
- **Editions** take the four colours in turn (`.accent-<colour>`, with a shape each).
- **Dark only**: the stage is the identity, there is no light theme.
- **Font**: Google Sans Flex (Google Fonts, SIL Open Font License), latin subset, weight axis,
  self-hosted in `web/static/fonts` (50 KB).
- **Icons**: Material Symbols Rounded paths in `src/ui/icons.js` (add one by copying its path from
  `@material-symbols/svg-400/rounded`). Filled for the selected navigation destination only.

## Shapes and motion

- `Shape` and `Shapes` (`src/ui/Shapes.jsx`) draw the shapes; each page's CSS places them
  (`.shape--1`, `.shape--2`…) in a composition next to a headline, never behind text.
- `Reveal` fades and slides a section in once, when it reaches the screen; shapes come in one
  after the other. Under `prefers-reduced-motion`, nothing moves: everything is simply there.

## Components

`src/ui` has Button (filled, tonal, outlined, elevated, text), IconButton, TextField and Select
(outlined), Checkbox, Switch, Card, List, chips (assist, filter, input), Notice, Dialog and
ConfirmDialog (a bottom sheet on phones with `sheet`), Snackbar, Tabs, progress indicators,
navigation (bar, rail, drawer), Photo, PhotoViewer, EditionBadge, Shape(s) and Reveal.

Each one has state layers (hover 8 %, focus and pressed 10 %), a 48 × 48 px target, a visible
`:focus-visible` ring and honours `prefers-reduced-motion`. Dialogs are native modal `<dialog>`s:
the page behind is inert, Esc closes, the focus comes back (or to a fallback when its opener is
gone).

Errors and confirmations are snackbars (`showError`, `showSnackbar`), never `window.alert()`. A new
message replaces the current one; errors stay until dismissed; inside a dialog they sit at the top
of its content.

## Layout

- Compact (< 600 px): top app bar, navigation bar at the bottom (Accueil, Shotgun, Trajets,
  Scores, Plus), the rest in the drawer.
- Medium and expanded (≥ 600 px): navigation rail with a menu button for the drawer, content up to
  1040 px (1280 px for the shotgun and the admin).
- Photos: the whole content width, large rounded corners (`--stage-radius-photo`).
- Layout is CSS only: no JavaScript measuring the window.
- The homepage is in the main bundle, the other pages are loaded when opened (`React.lazy`).

## Content

- The homepage is `src/content/currentEdition.js`, the history `src/content/editions.js`, the
  photos `src/content/photos.js`. Next year's update is a change of these files.
- Photos are in `web/static/photos` as AVIF and WebP, 640 px wide and at their largest size (up to
  1280 px), with their size and a French alt text in `photos.js`. They were made with `sharp`
  (AVIF quality 42, WebP quality 60).
- The share image (`share.jpg`, 1200 × 630) is the beach photo of 2020.
- No photo whose subject is someone who isn't one of us (staff, passers-by): crop them out or
  pick another one.

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

Gradients behind text, glows, glassmorphism, floating blobs, confetti of shapes, a generic SaaS
hero (headline, gradient, screenshot), 3D emoji, stock illustrations, AI-generated images, rows of
three "feature" cards with an icon each, fake stats or testimonials, emoji in headings, copy full
of em dashes or lists of three adjectives, the Google logo, wordmark or colour bar, `!important`,
inline styles, IDs for styling.

## Quality bar

- WCAG 2.2 AA: landmarks, skip link, labels on every field, errors under their field, focus moved
  to the page on navigation, live regions for the countdown (once a minute) and the snackbars.
- Lighthouse CI on `/`, `/history` and `/shotgun` as a phone: at least 95 in every category
  (`lighthouserc.json`). The runs are logged in (`scripts/lighthouse-login.js`, a test account of
  a back seeded in CI), so the two pages behind the login are audited for real. Keeping the
  session needs `disableStorageReset`, which also keeps the HTTP cache between runs: the
  performance scores are those of a returning visitor, the first visit is checked by hand.
- Budgets (`npm run budgets`, gzipped): JS ≤ 300 KiB, CSS ≤ 50 KiB, font ≤ 60 KiB.
