# Design system

The site was redesigned in one go to replace Semantic UI 2.2 (2017, loaded from a CDN) with a
small in-house design system. This file records the decisions so the next edition can follow them.

## Direction

**"Affiche de fête normande"**: a printed festival poster on cream paper. The palette is taken
straight from the edition badges (cream, brown ink, beer amber, bunting coral, Channel teal),
with oversized soft-serif headlines, a bunting garland and slightly tilted "sticker" photos.
The site is mostly used once a year, on a phone, in a rush (the shotgun). So it should be
loud and fun on the homepage, and dead simple on the shotgun.

## Decisions

| Decision                                                   | Why                                                                                                                                                    |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Drop Semantic UI and `react-responsive-carousel`           | Unmaintained, incompatible with modern React, ~600 KB of CSS from a CDN. JS bundle goes from 730 KiB to ~410 KiB.                                      |
| Plain CSS with custom properties, no Tailwind or CSS-in-JS | No build changes, nothing to learn, five small files in `src/styles/`.                                                                                 |
| Semantic tokens + `light-dark()`                           | Dark mode for free: components only use `--bg`, `--text`, `--accent`… The visitor can force a theme (toggle in the top bar, stored in `localStorage`). |
| Fraunces (display) + Inter (text)                          | Fraunces echoes the old serif logo but is warm and modern; Inter for legibility. The PNG logo is replaced by a text wordmark.                          |
| One persistent app shell                                   | The top bar, drawer, footer and toasts are mounted once around the router, so the session is restored once and the menu state survives navigation.     |
| Toasts instead of `window.alert()`                         | Non-blocking, styled, and they don't freeze the shotgun page during the rush.                                                                          |
| Real modal dialogs (bottom sheets on mobile)               | Login and the shotgun steps used fixed-position `Segment`s. `Dialog` handles focus, Escape, backdrop and scroll lock.                                  |
| Content as data                                            | `src/content/edition.js` (current edition) and `src/history/editions.js` (past editions). Next year's homepage is a data change, not a JSX change.     |
| Floor plan keeps real proportions via CSS `aspect-ratio`   | Replaces the JS resize listeners. Each room is a size container, so tiles drop details as they shrink.                                                 |
| The whole room tile is the button                          | Bigger tap targets during the shotgun, and no more clipped buttons in small rooms.                                                                     |
| Native `<select>` for bed attribution                      | Native mobile pickers, accessible, no dropdown lib.                                                                                                    |

## Map

```
src/styles/tokens.css   palette, type scale, spacing, semantic colour tokens
src/styles/base.css     reset, typography, paper grain
src/styles/ui.css       buttons, fields, alerts, cards, chips, dialog, toasts, gallery
src/styles/layout.css   app shell (top bar, drawer, footer) and page widths
src/styles/pages.css    home, history, embeds, shotgun (countdown, floors, rooms, beds)
src/ui/                 Icon, Alert, Field, Dialog, Gallery, PageHeader, Toaster, notify()
```

Room states (`data-state` on tiles and legend): `available`, `locked`, `pending`, `pending-mine`,
`taken`, `mine`, `loading`. Their colours live in one block in `pages.css`.

## Updating for a new edition

1. Add the finished edition at the top of `src/history/editions.js` (banner + 3 photos in `web/static`).
2. Rewrite `src/content/edition.js`: name, dates, shotgun date, keywords for the marquee, texts, images.
