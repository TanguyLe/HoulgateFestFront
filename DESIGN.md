# Design system

The site was redesigned in one go to replace Semantic UI 2.2 (2017, loaded from a CDN) with a
small in-house design system. This file records the decisions so the next edition can follow them.

## Direction

**"Programme imprimé"**: the weekend's printed programme, two inks on cream paper, like a
French poster: brown-black ink and one accent, the Channel teal. Sun yellow only marks a
pending shotgun or a warning. Headlines are Archivo black, barely widened, in sentence case.
Two ornaments and no more: the bunting from the badges on top of the homepage, and the static
band of theme keywords. No shadows, gradients, blur, grain, tilted photos, icon cards or small
caps labels above titles: they read as a generated template. The homepage is the orgas' own
letter (in _vous_), the interface talks in _tu_. The site is mostly used once a year, on a
phone, in a rush (the shotgun), so the shotgun page stays dead simple.

## Decisions

| Decision                                                             | Why                                                                                                                                                                                                              |
| -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Drop Semantic UI and `react-responsive-carousel`                     | Unmaintained, incompatible with modern React, ~600 KB of CSS from a CDN. JS bundle goes from 730 KiB to ~410 KiB.                                                                                                |
| Plain CSS with custom properties, no Tailwind or CSS-in-JS           | No build changes, nothing to learn, five small files in `src/styles/`.                                                                                                                                           |
| Semantic tokens + `light-dark()`                                     | Dark mode for free: components only use `--bg`, `--text`, `--accent`… The visitor can force a theme (toggle in the top bar, stored in `localStorage`).                                                           |
| Archivo only, black and barely widened (`--display-stretch`)         | A grotesque drawn for posters, without the extra-wide US gig-poster cut. One variable family (`wdth` + `wght`), one request. The wordmark is plain text.                                                         |
| One persistent app shell                                             | The top bar, drawer, footer and toasts are mounted once around the router, so the session is restored once and the menu state survives navigation.                                                               |
| Toasts instead of `window.alert()`                                   | Non-blocking, styled, and they don't freeze the shotgun page during the rush.                                                                                                                                    |
| Real modal dialogs (bottom sheets on mobile)                         | Login and the shotgun steps used fixed-position `Segment`s. `Dialog` handles focus, Escape, backdrop and scroll lock.                                                                                            |
| Content as data                                                      | `src/content/edition.js` (current edition) and `src/history/editions.js` (past editions). Next year's homepage is a data change, not a JSX change.                                                               |
| Shotgun: a small schematic plan per floor plus a list of its rooms   | The real-proportion plan made bedrooms tiny next to corridors and bathrooms. The plan now only locates the rooms (numbered, decorative), the list carries names, beds, occupants, countdowns and actions.        |
| The whole room row is the button, the next step sits in a sticky bar | Big tap targets during the rush. Free beds, the user's room and its countdown stay in sight while scrolling, and the bar reopens the user's room.                                                                |
| Native `<select>` for bed attribution                                | Native mobile pickers, accessible, no dropdown lib.                                                                                                                                                              |
| French typography, checked in CI (`npm run typography-check`)        | Curly apostrophes, narrow no-break spaces before `? ! : ;` and inside `« »`, superscript ordinals (`withOrdinals`), en dashes in dates, `20 h`. `npm run typography-fix` fixes the visible text, never the code. |

## Map

```
src/styles/tokens.css   palette, type scale, spacing, semantic colour tokens
src/styles/base.css     reset, typography, paper grain
src/styles/ui.css       buttons, fields, alerts, cards, chips, dialog, toasts, gallery
src/styles/layout.css   app shell (top bar, drawer, footer) and page widths
src/styles/pages.css    home, history, embeds, shotgun (countdown, floors, rooms, beds)
src/ui/                 Icon, Alert, Field, Dialog, Gallery, PageHeader, Toaster, notify()
scripts/frenchTypography.js  French typography check and fix (CI)
```

Room states (`data-state` on plan rooms, room rows and legend, computed by `src/shotgun/roomState.js`): `available`, `locked`, `pending`, `pending-mine`,
`taken`, `mine`, `loading`. Their colours live in one block in `pages.css`.

## Updating for a new edition

1. Add the finished edition at the top of `src/history/editions.js` (banner + 3 photos in `web/static`).
2. Rewrite `src/content/edition.js`: name, dates, shotgun date, the theme keywords, texts, images. Then run `npm run typography-fix`.
