# Storybook

A small web app that reads like a picture book. It opens as a closed
hardcover on a desk; the cover swings open and pages turn with a 3D page
turn. On a wide screen you see a two-page spread; on a phone, one page at a
time.

## Run it

Just open `index.html` in a browser (double-click it). No build step, no server needed.

If you prefer a local server:

```bash
python3 -m http.server 8000
```

then visit http://localhost:8000 (and http://localhost:8000/de.html for the
German edition).

### The files

| File | What it is |
|---|---|
| `index.html`, `de.html`, `sk.html`, `eo.html`, `bn.html`, `ru.html`, `cs.html`, `ja.html`, `hi.html`, `zh.html` | The book in English, German, Slovak, Esperanto, Bengali, Russian, Czech, Japanese and Simplified Chinese (and a Hindi stub, see Translations): the page's title, description and link previews, and which story file it reads. |
| `story.js`, `story-de.js`, `story-sk.js`, `story-eo.js`, `story-bn.js`, `story-ru.js`, `story-cs.js`, `story-ja.js`, `story-hi.js`, `story-zh.js` | The story (see below). |
| `languages.js` | The editions, for the language menu and the plain edition. |
| `reader.js`, `reader.css` | The reader: the desk, the book and its cover, laying out the pages, the status line under the book. |
| `pageturn.js`, `pageturn.css` | The page turns (the leaf, its shading and shadows, dragging). Knows nothing of the story. |
| `simple.html`, `simple.js` | The plain edition (`/simple` on the site, `/simple?lang=de` for the German): the whole story down one sheet, with no book, cover or page turns, in any language in `languages.js`. Reads the same story files. |
| `about.html`, `contact.html`, `learn-more.html`, `sheet.css` | The other pages, each a sheet of the book's paper on the same desk. |
| `illustrations/` | The pictures (see "Illustrations for the web"). |
| `tests/` | Browser tests for the reader (see `tests/README.md`). |

## Turning pages

- Click the right half of the book, press `→`, `Space`, or `Enter` to go forward.
- Click the left half or press `←` / `Backspace` to go back.
- Pick up a page by its outer edge and drag it over (with the mouse, the page
  lifts when the pointer is near its edge); on touch screens, swipe or drag.
- `Home` / `End` shut the book / jump to the last page.
- Click the "Page X of N" line under the book (or press `G`), type a page number, and press `Enter` to jump there.
- `F` (or the button in the top right corner) toggles full screen, where the browser allows it.
- The book always opens shut, on its cover. Opening it goes straight to the
  first page of the story: the contents and chapter title pages before it are
  left out when paging through. Add `#p7` to the URL to link straight to
  page 7 (a link to a left-out page opens the first page of the story).

## Writing the story

Everything lives in **`story.js`**, inside the backtick string. Edit that file and reload.

```
title: Frog and Toad and the Puddle
author: Your name
artist: Illustrator's name
cover-image: illustrations/puddle.svg

---
contents

---
chapter: The Puddle

---
image: illustrations/puddle.svg
alt: A small house with a large puddle in front of the door

It rained all night.
In the morning Toad looked out of his window.

"There is a puddle in front of my house," said Toad.
```

### The rules

| Write this | What it does |
|---|---|
| `title:`, `author:`, `artist:`, `translator:`, `cover-image:` | Go at the very top, before the first `---`. They make the front cover: the cover image fills it, with the title near the top and the credits at the foot. `artist`, `translator`, and `cover-image` are optional; the artist line appears under the author, and the translator (for a translated edition) under that. Each credit line is shown with a capital first letter. On the cover the title is set in two sizes, the second part starting where the title's second word comes round again ("Frog and Toad / and the Increasingly Capable Machines", "Frosch und Kröte / und die immer fähigeren Maschinen"); a title without such a repeat is set whole. |
| `---` on its own line | Starts a new page. |
| Plain lines | Story text. Consecutive lines join into one paragraph; a **blank line** starts a new paragraph. Straight quotes become curly quotes automatically („…“ in the German, Slovak and Czech editions, «…» in the Russian), and `...` becomes an ellipsis. |
| `[link text](https://example.com)` | Makes a clickable link. Also works in `caption:`, `author:`, `artist:`, and `translator:` text. Only `https://`, `http://`, and `mailto:` links, and the site's own `.html` pages, are allowed; the link opens in a new tab. |
| `image: path` | Puts an illustration on the page. The path is relative to `index.html` (put files in `illustrations/`), or a full `https://` URL. Put it **before** the text to have the picture above the words, or **after** to have it below. A page can have several images, or an image and no text. |
| `alt: description` | Optional. Line right after an `image:`. Screen-reader text. |
| `caption: text` | Optional. Line right after an `image:`. Printed in italics under the picture. |
| `chapter: Name` | Makes this page a chapter title page. Chapters are numbered automatically. |
| `contents` | Makes this page a table of contents, listing every chapter with its page number. Entries are clickable. |
| `center` | Centers the text on this page. Good for "The End" or a dedication. |
| `blank` | An empty page. Handy for pushing a chapter title onto a right-hand page in the two-page view. |

Page numbers count from 1 on the first page after the cover. Chapter and contents pages are not numbered.

### Notes

- The whole book uses one type size, the largest at which every page fits, so one long page makes all the type smaller. If a page is still too long (the browser's console says which), split it across two pages. Lobel's pages run about 40 to 80 words, and short lines look best.
- Images can be `.png`, `.jpg`, `.svg`, `.webp`, or `.gif`. A missing image shows a dashed placeholder with the file name, so you can see what to fix.
- Avoid backticks (`` ` ``) and `${` inside the story, because the story sits inside a JavaScript template string. If a line has to begin with a word like `image:`, put a backslash in front: `\image:`.
- Fonts: the book is set in Noto Serif, from Google Fonts; offline it falls back to Georgia. Other scripts have their own Noto Serif, see Translations below.

### Translations

Each language has its own story file and its own page. German is
`story-de.js`, shown by `de.html` (open that file, or visit `/de` on the site);
Slovak is `story-sk.js` and `sk.html` (`/sk`), Esperanto `story-eo.js` and
`eo.html` (`/eo`). Both were translated by Viliam Búr. Russian is
`story-ru.js` and `ru.html` (`/ru`), translated by Alexander Radchenko; Czech
is `story-cs.js` and `cs.html` (`/cs`), translated by HighEgg; Bengali is
`story-bn.js` and `bn.html` (`/bn`), translated by Tazik and Rumi.

Japanese is `story-ja.js` and `ja.html` (`/ja`), translated by
[Yuma Hoshino](https://www.upwork.com/freelancers/~01570efaac72098a8d).

Simplified Chinese is `story-zh.js` and `zh.html` (`/zh`), with a plain
edition at `/simple?lang=zh-Hans`. It uses `zh-Hans` in `<html lang>`,
`languages.js` and `hreflang`, so that a Traditional edition can be
`zh-Hant` beside it.

Hindi is a stub: `story-hi.js` and `hi.html` (`/hi`) still hold the English
text. The page is `noindex` and its lines in `languages.js` and the
`hreflang` lists are commented out, so it remains reachable but unlisted
until translated.

Every edition is listed in `languages.js` (the language menu) and in the
`hreflang` lines in the `<head>` of every other edition's page. A new edition
needs its line in both. Bengali and Esperanto keep English-style curly quotes,
so they need no entry in the quote styles (`QUOTES` in `reader.js` and
`simple.js`); German, Slovak, Czech and Russian have one.

Fonts: Noto Serif, which every page links in its `<head>`, covers Latin,
Cyrillic and Greek. A language in another script needs that script's font
from the table `FONTS` at the top of `languages.js`: Simplified Chinese is
Noto Serif SC, Traditional Chinese Noto Serif TC, Japanese Noto Serif JP,
Korean Noto Serif KR, and there are Noto Serif Hebrew and Noto Serif Thai
(Bengali, already there, uses Baloo Da 2; Hindi, Noto Serif Devanagari). To
add one, do as `bn.html` does:
add its family to the Google Fonts link in the page's `<head>`, set `--text`
in the `<style>` there to `'Noto Serif', '<the font>', Georgia, serif`, and
name it as `font:` on the language's line in `languages.js`, so the plain
edition loads it too.

To translate, edit `story-de.js`: the story text, and the short list of
interface words (`STORY_UI`) at the top, such as "Chapter", "Page 3 of 40",
"About" and "Full screen". Any word left out of the list is shown in
English.
The comment at the top of the file says what to translate and what to leave
alone. Then translate the title and description in the `<head>` of `de.html`,
which is what link previews show.

Readers switch language with the menu under the book, beside About and
Contact; the other edition opens on the same page. Its choices come from
`languages.js`, which lists every edition. Beside the menu, a "Simplified"
box: ticked, it opens the plain edition of the same language, the whole
story down one sheet (`simple.html?lang=de`; `simple.js` loads the story
file named in `languages.js`). The plain edition has the same menu and box,
and unticking the box opens the book again. (About and Contact are in
English only, for every edition.)

To add another language:

1. Copy `story-de.js` and `de.html` and rename them (say `story-fr.js` and
   `fr.html`).
2. In the new page, change `<html lang="de">`, point
   `<script src="story-de.js">` at the new story file, and change `/de` in the
   `canonical` and `og:url` lines.
3. Add a line for it to `languages.js`, naming the page and the story file;
   that puts it in the language menu and gives it a plain edition.
4. Add a `<link rel="alternate" hreflang="...">` line for it to the `<head>`
   of every page (`index.html`, `de.html`, `sk.html`, `eo.html`, and the new
   one), so search engines offer each reader the right language.

### Illustrations for the web

The story points at `illustrations/web/`, which holds small WebP copies of the
master art in `illustrations/`. The copies are downscaled and have their white
turned into transparency, so the paper colour and texture show through the
margins. Alongside them, `sizes.js` records each picture's pixel size so pages
can be laid out (and text pages measured) before the pictures download.

The closed book's cover shows the cover art from `cover-1200.avif` and
`cover-1600.avif` in the same folder: the art printed onto the cover's cream
stock, a tenth the weight of the WebP (which browsers without AVIF get
instead). `index.html` and `de.html` fetch them first thing (the `coverArt`
preload, whose `data-cover` names the picture they were made from; a story
whose `cover-image:` is another picture shows that one as it is). Until the
art arrives, a tiny blurred copy of it stands in (`COVER_PLACEHOLDER` in
`reader.js`).

After changing a master, rebuild the copies with:

```bash
python3 tools/make-web-images.py
```

It needs Pillow, NumPy, and WebP support in Pillow, and for the cover AVIFs
`avifenc` (`brew install libavif`; without it they're skipped). It also prints
a new `COVER_PLACEHOLDER` for `reader.js`. If the cover art changes, check the
cover too: how the art is cropped to the board, and where the title and
credits sit on it, are set for this picture in `reader.css` (`.cover-front`).

### The print edition

`tools/make-print-pdf.py` makes the PDFs for a physical copy of the English
book: the interior (one PDF page per story page, with bleed) and the front
cover, back cover and spine as separate files, named
`Frog-and-Toad-and-Mr-HuggingFace-*.pdf` in this folder, at a 5.5 x 8.5 in
trim (`--trim 8.5x11` for another). It reads `story.js`
and the master art in `illustrations/`, and ends the book with QR codes for
the site (`?source=book`, which the reader counts as its source) and the
book's accounts. Run it with the spine width the printer quotes:

```bash
python3 tools/make-print-pdf.py --spine 0.35
```

It needs reportlab, qrcode and Pillow, and the Mac's Georgia fonts. The PDFs
and its cache (`tools/.print-cache/`) are generated, so they're not tracked.

## Testing

`tests/` has browser tests for the reader (page turns, the cover, the
editions), run with Playwright against the site served from this folder. They
aren't part of the site; see `tests/README.md`.

## License

The book, text and illustrations, is &copy; 2026 Elizabeth Van Nostrand
(text) and HungerArtist (illustrations), and is released under the
[Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International
License](https://creativecommons.org/licenses/by-nc-nd/4.0/) (CC BY-NC-ND
4.0). You may copy and share it with credit, but not sell it or make changes
to it. The reader (the code in this folder) is not part of the book: do
whatever you like with it.
