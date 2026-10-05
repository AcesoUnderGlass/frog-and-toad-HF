# Reader tests

Browser tests for the storybook reader and its page turns, run with
[Playwright](https://playwright.dev) against the site served from the
repository's root. Playwright is not a dependency of the site; point the tests
at any installed copy of `playwright-core` (`npm install playwright-core`
anywhere outside this folder will do).

```sh
python3 -m http.server 8765         # in the repository's root: the site, on http://localhost:8765
export PLAYWRIGHT_CORE=/path/to/node_modules/playwright-core/index.mjs
node tests/turns.mjs
node tests/cover.mjs
node tests/flash.mjs
node tests/landing.mjs
node tests/editions.mjs
```

Each prints a line per check and exits non-zero if any fail. They need Google
Chrome (or set `BROWSER=webkit`, see below) and network access for the font
(Fraunces, from Google Fonts). Vercel's analytics script, which only exists on
Vercel, is stubbed out.

| Test | Checks |
| --- | --- |
| `turns.mjs` | Page turns under rough handling: rapid clicks and a held key (queued, then stopping), changing direction mid-turn, jumps (G, Home, `#pN`), resizing mid-turn, the mouse grab zone and dragging, touch, reduced motion. Each case must end at rest with the pages, status line and open/shut state in agreement. |
| `cover.mjs` | The closed book: opening and shutting, turning back mid-way, dragging the cover open and shut, rapid input across it; `--open` and what follows it (the book's slide, the status line); the reading order (contents and title pages skipped, `#pN` links); a phone. |
| `flash.mjs` | No dark flashes: a leaf's shadow is never drawn without a leaf showing over it, watched on every DOM change, frame by frame, while the mouse jiggles over the edges where pages and the cover lift, and through turns. |
| `landing.mjs` | Every frame of a turn: the print on the leaf (projected on screen) must end exactly where the page it becomes is drawn, so the swap is invisible. Spreads and a phone, both ways, and the cover. |
| `editions.mjs` | The German edition: its cover title ("Frosch und Kröte" on one line) and translator credit, its interface words, its „ quotes (not hung in the margin). The language menu keeps the page being read (both ways, and on a phone). About and Contact open from under both books and lead back. The book also works opened straight from a file. |

Options, as environment variables:

- `BASE`: the English book's URL (default `http://localhost:8765/`); the
  other pages are found next to it.
- `BROWSER=webkit`: run in Playwright's WebKit instead of Chrome. Its screenshots
  ignore CSS 3D (a two-sided card shows the wrong side, rotations are drawn flat),
  so it is only useful for checks that don't look at the 3D picture: the logic in
  `turns.mjs`, `cover.mjs` and `editions.mjs`, and `flash.mjs`. Check the look in
  Safari itself.
