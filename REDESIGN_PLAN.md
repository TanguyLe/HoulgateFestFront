# Redesign plan: HoulgateFest on a keynote stage

## Direction change (2026-10-31): a Google I/O keynote stage

The first version of this plan (below) was implemented on Material 3 app UI. The owner found it
ugly: by "Google style" they meant the look of a Google keynote, not Material 3 apps. The
direction is now the **Google I/O stage**:

- A near-black stage (`#0e0f12`, not pure black), lots of empty space, one idea per section like
  keynote slides. Dark is the identity: the light theme goes.
- Huge headlines in **Google Sans Flex** (Google Fonts, SIL Open Font License, self-hosted latin
  subset, weight axis), sentence case, tight tracking, a big contrast of sizes with the body.
- The four colours (blue `#4285f4`, red `#ea4335`, yellow `#fbbc04`, green `#34a853`) as bold flat
  shapes (circles, half discs, triangles, squares, pills, bars, arcs) placed with intent around
  the headlines, not confetti. No Google logo, wordmark or anything that could pass for Google.
- Big photos the whole content width, with large rounded corners. Restrained keynote motion:
  sections and shapes fade and slide in once; nothing moves under `prefers-reduced-motion`.
- The app pages (shotgun, trips, scores, account, admin) keep the stage but stay dense and
  usable; room states still use a colour and a label.

What changes from the plan below: the colour (hand-made stage tokens with the M3 role names
instead of a generated M3 scheme from a seed photo, no per-edition schemes: the editions take the
four colours in turn), the font (Google Sans Flex instead of Roboto Flex), no light theme, the
signature (the shapes instead of the M3 "cookie" shape), and the layouts of the homepage and the
history (slides). What stays: the components and their behaviour, the accessibility work, the
navigation, the content data files, the photo selection, the alcohol rules, the budgets and
Lighthouse CI. `DESIGN.md` describes the result.

---

## First version: Material 3 (implemented, then restyled)

Branch `feat/material-redesign`, from `main` (2026-10-31). Independent from any other redesign
work.

## Where we start

- UI built on Semantic UI 2.4 (CSS from a CDN, `semantic-ui-react` in 24 files) and
  `react-responsive-carousel`. Both are unmaintained.
- One global stylesheet (`src/houlgatefest.css`, 147 lines) and ~55 inline `style={{…}}`.
- The homepage is long JSX prose with floated images. Three of its pictures are AI-generated and
  captioned "Image générée par IA n°1/2/3".
- The history page is hard-coded JSX, one block per year, with a carousel.
- The shotgun page draws floors at real proportions, with height computed in JS on `resize`.
- `window.alert()` for some errors, Semantic `Modal`s for login and the shotgun steps.
- Alcohol: the 2018 and 2019 history texts (hops, spirits, "la passion de l'alcool", the
  "Délivrez-nous du Malt" beer), and the 2022 edition name "Les Visit'heures 2 : l'APÉRO !".

## Target

1. **Google's Material Design 3** (m3.material.io) for colour, type, shape, elevation, motion,
   layout and components.
2. **Current best practices**: WCAG 2.2 AA, Core Web Vitals in the green on mobile, semantic
   HTML, sensible SEO, no unmaintained dependencies.
3. **Not made by an AI**: real photos, real text from the organisers, no template look.
4. **Alcohol nearly invisible**: never in the copy, pictures, icons or previews.

## Technical choices

| Choice                                                                                                                             | Why                                                                                                  |
| ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Remove Semantic UI, the CDN stylesheet and the carousel                                                                            | Unmaintained, heavy, and they impose their own look                                                  |
| No UI kit: M3 implemented as CSS custom properties + ~12 small React components in `src/ui/`                                       | `@material/web` is in maintenance mode, MUI adds CSS-in-JS and weight. The site needs few components |
| CSS: plain files (`tokens.css`, `components.css`, one file per page), loaded by webpack (`css-loader` + `mini-css-extract-plugin`) | No new language, and the CSS gets cached apart from the JS                                           |
| M3 token names (`--md-sys-color-primary`, `--md-sys-typescale-body-large-size`…)                                                   | Read the spec, write the CSS, no translation layer                                                   |
| Colour scheme generated at build time with `@material/material-color-utilities`                                                    | Exact M3 roles, light and dark, accessible pairs by construction                                     |
| Font: Roboto Flex (variable, Google Fonts, self-hosted subset)                                                                     | Google's own M3 typeface family, one file for all weights                                            |
| Icons: Material Symbols Rounded, copied as inline SVG                                                                              | No icon font request, no flash of icon names                                                         |
| Dark mode: `prefers-color-scheme` + manual toggle (`data-theme` on `<html>`)                                                       | Most use is at night or outdoors on a phone                                                          |
| Content in data files: `src/content/currentEdition.js`, `src/content/editions.js`                                                  | Next year's update is a data change, not a JSX change                                                |

The code follows the repo's Prettier config, plus Google's HTML/CSS style guide where Prettier
says nothing: semantic elements, classes not IDs for styling, no `!important`, no inline styles.

## Identity: M3 without looking like a Google template

M3 used with its default purple seed and no photos looks like every demo app. To make it ours:

- **Colour seed from the house and the sea**: pick the seed from a real photo of Houlgate (the
  Channel, the beach huts, the Villa Les Genêts). Use `Vibrant` or `Expressive` scheme variant
  rather than the flat `TonalSpot`.
- **Each edition's badge colours its own card** in the history (a scheme generated per badge at
  build time).
- **Photos carry the site**: big, cropped with intent, our own. The three AI images on the
  homepage go away, replaced by photos of past editions (costumes, games, the beach, the house).
- **The organisers' voice**: the homepage text stays theirs, rewritten short. No marketing
  phrases.
- **Shapes by role**, from the M3 expressive scale: pill buttons, 28 px dialogs, 16 px photo
  cards, and one deliberate shape for the edition badge (e.g. the M3 "cookie" or "sunny"
  shape) as the single signature element.

Things we never use: gradients behind text, glassmorphism, floating blobs, 3D emoji, stock
illustrations, "feature" icon card triplets, fake stats or testimonials, emoji in headings,
copy with lots of em dashes and lists of three adjectives. Every visible text is reread by one
of the organisers.

## Alcohol: rules and changes

**Changes**

- 2018 history text: remove "une passion non dissimulée pour le houblon, les spiritueux et la
  boisson bien distillée en général". Talk about the first weekend, the people, the house.
- 2019: remove "La passion de l'alcool est toujours présente…" and the beer tasting.
- 2022: the edition keeps its name in the history list (it's history), shown in sentence case,
  never in a page title, meta tag or share image.
- Every photo in `web/static` gets looked at: no photo where a drink is the subject or in the
  foreground. Hero, share image and the first picture of each edition: zero drinks.

**Rules** (written into `DESIGN.md` so they last)

- No drink icon, emoji, section or wording ("apéro", "open bar", "soirée arrosée"…).
- No drink in the checklist or the theme keywords.
- The site talks about the theme, the costumes, the games, the house, the beach, the trips.
- France's Loi Évin restricts how alcohol is shown online, which backs this up.

## Information architecture

| Destination          | Route                    | Notes                                                          |
| -------------------- | ------------------------ | -------------------------------------------------------------- |
| Accueil              | `/`                      | Current edition: name, theme, dates, shotgun date, next action |
| Shotgun              | `/shotgun`               | Main action of the year                                        |
| Trajets              | `/trips`                 |                                                                |
| Scores               | `/scores`                |                                                                |
| Historique           | `/history`               |                                                                |
| Checklist, Contact   | `/checklist`, `/contact` | Secondary, in the drawer and footer                            |
| Account pages, admin | unchanged routes         | `noindex`                                                      |

**Navigation (M3 adaptive)**

- Compact (< 600 px): top app bar (logo, account) + navigation bar at the bottom with the 4
  main destinations (Accueil, Shotgun, Trajets, Scores); Historique, Checklist, Contact in a
  "Plus" item opening a modal drawer.
- Medium (600–839): navigation rail.
- Expanded (≥ 840): navigation rail with labels, content up to 1040 px.

The bottom bar puts the shotgun under the thumb, which is the one thing that matters in the rush.

## Pages

**Accueil**

- Top: edition badge (signature shape), name, theme in one line, dates, shotgun date with a
  live countdown in the last 7 days.
- One filled button: "Créer un compte" before sign-up, "Aller au shotgun" after, "Voir mon lit"
  after the shotgun.
- The organisers' text, short, then photos in a grid (no carousel), then the WhatsApp group and
  the guide link as cards.

**Shotgun** (most work and testing)

- Each floor as a card: a schematic plan (rooms numbered, not to scale) and the list of its
  rooms as M3 list items: number, name, beds free/total, occupants, one trailing action.
- Room states use colour roles **and** a label or icon: free, locked, pending, mine, taken.
- Sticky bottom bar: free beds left, the user's room, the time left to confirm.
- Steps (pick room → add roommates → confirm) in a bottom sheet on compact, a dialog above.
- Errors in snackbars, never `window.alert()`.
- Layout in CSS only, no JS height computing on resize.

**Historique**

- One card per edition, newest first: badge, year, name, dates, the text, three photos in a
  row that open a fullscreen viewer. Content from `editions.js`.

**Trajets, Scores, Checklist, Contact**: lists, cards and forms with the shared components.
Checklist ticks saved in `localStorage`.

**Account pages**: one centred card per page, outlined text fields, the Turnstile captcha under
the last field, clear error messages under each field.

**Admin**: primary tabs, plain HTML tables with M3 styling, dialogs for edits.

## Components (`src/ui/`)

Button (filled, tonal, outlined, text, icon), TextField (outlined), Select (native, styled),
Checkbox, Card (filled, outlined), ListItem, Chip (assist, filter), Dialog + BottomSheet,
Snackbar, Tabs, TopAppBar, NavigationBar, NavigationRail, Drawer, ProgressIndicator, Icon.

Each one: every state (hover, focus, pressed, disabled, error), M3 state layers (8 / 10 / 10 %),
`:focus-visible` ring, 48 × 48 px minimum target, light and dark, `prefers-reduced-motion`.

## Quality bar

- **Accessibility**: WCAG 2.2 AA; contrast from M3 role pairs only (`X` on `on-X`); keyboard
  navigation everywhere; focus trapped in dialogs and returned on close; skip link; landmarks;
  `aria-live` for the countdown and snackbars; checked with axe and VoiceOver/TalkBack.
- **Performance (mobile)**: LCP < 2.5 s, INP < 200 ms, CLS < 0.1. Images in AVIF + WebP with
  `srcset`, `width`/`height` set, lazy below the fold, hero preloaded. Budgets: JS ≤ 300 KiB,
  CSS ≤ 50 KiB, font ≤ 60 KiB.
- **SEO and sharing**: title and description per route, Open Graph image per edition (no
  drinks), canonical URL, `robots.txt`, admin and account pages `noindex`. Clean up the
  `index.html` head (drop the `no-cache` and `X-UA-Compatible` metas, add `theme-color`).
- **CI**: keep `prettier-check` and `build`, add Lighthouse CI on `/`, `/history`, `/shotgun`
  (≥ 95 in each category) and the bundle budgets.

## Steps

| #   | Step                                                                        | Days |
| --- | --------------------------------------------------------------------------- | ---- |
| 1   | Content & alcohol audit, photo selection, seed colour                       | 1    |
| 2   | Tokens (colour script, type, shape, elevation, motion), fonts, CSS pipeline | 1.5  |
| 3   | Components in `src/ui/`                                                     | 3    |
| 4   | Shell and adaptive navigation                                               | 1    |
| 5   | Shotgun page                                                                | 3    |
| 6   | Accueil, Historique (content to data files)                                 | 2    |
| 7   | Trajets, Scores, Checklist, Contact, account pages                          | 1.5  |
| 8   | Admin                                                                       | 1    |
| 9   | Remove Semantic UI and the carousel, clean `index.html`                     | 0.5  |
| 10  | Accessibility, performance, Lighthouse CI, test on phones                   | 1.5  |
| 11  | `DESIGN.md` (direction, tokens, alcohol rules, "never use" list)            | 0.5  |

About 16 days. Semantic UI and our components live side by side until step 9, so each step can
be reviewed and deployed alone.

**Rollout**: Vercel preview link → a fake shotgun with 3–4 friends on their phones → merge at
least a month before the 2027 shotgun, never in the weeks before.

## Decisions for you

1. Seed photo: which picture of Houlgate sets the colours?
2. Bottom navigation bar on phones (shotgun under the thumb), or top bar + drawer only?
3. 2022 edition: keep "Les Visit'heures 2 : l'APÉRO !" as its name, or show "Les Visit'heures 2"?
4. Who rereads the rewritten texts?
