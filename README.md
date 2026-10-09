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
| `index.html`, `de.html`, `bn.html`, `ru.html` | The book in English, German, Bengali (being checked) and (a stub so far) Russian: the page's title, description and link previews, and which story file it reads. |
| `story.js`, `story-de.js`, `story-bn.js`, `story-ru.js` | The story (see below). |
| `languages.js` | The editions, for the language menu. |
| `reader.js`, `reader.css` | The reader: the desk, the book and its cover, laying out the pages, the status line under the book. |
| `pageturn.js`, `pageturn.css` | The page turns (the leaf, its shading and shadows, dragging). Knows nothing of the story. |
| `simple.html`, `simple.js` | The plain edition (`/simple` on the site): the whole English story down one sheet, with no book, cover or page turns. Reads the same `story.js`. |
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
| Plain lines | Story text. Consecutive lines join into one paragraph; a **blank line** starts a new paragraph. Straight quotes become curly quotes automatically („…“ in the German edition, «…» in the Russian), and `...` becomes an ellipsis. |
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
- Fonts: the book is set in Fraunces, from Google Fonts; offline it falls back to Georgia.

### Translations

Each language has its own story file and its own page. German is
`story-de.js`, shown by `de.html` (open that file, or visit `/de` on the site).

Russian is a stub, waiting for its translator: `story-ru.js` and `ru.html` are
in place but still hold the English text, and the edition is not yet in the
language menu or the `hreflang` lines. To finish it, translate the two files
as described below, then uncomment its line in `languages.js` and the
`hreflang="ru"` line in the `<head>` of `index.html`, `de.html` and `bn.html`.

Bengali (`story-bn.js`, `bn.html`) has its story text translated and is in
the language menu, but is still being checked: its title, credits, picture
descriptions, interface words and the `<head>` of `bn.html` are still
English, and `bn.html` is marked `noindex`. To take it live, translate
those, remove the `noindex` line, and uncomment the `hreflang="bn"` line in
the `<head>` of `index.html`, `de.html` and `ru.html`. Bengali keeps
English-style curly quotes, so it needs no entry in the quote styles.

To translate, edit `story-de.js`: the story text, and the short list of
interface words (`STORY_UI`) at the top, such as "Chapter", "Page 3 of 40",
"About" and "Full screen". Any word left out of the list is shown in
English.
The comment at the top of the file says what to translate and what to leave
alone. Then translate the title and description in the `<head>` of `de.html`,
which is what link previews show.

Readers switch language with the menu under the book, beside About and
Contact; the other edition opens on the same page. Its choices come from
`languages.js`, which lists every edition. (About and Contact are in English
only, for every edition.)

To add another language:

1. Copy `story-de.js` and `de.html` and rename them (say `story-fr.js` and
   `fr.html`).
2. In the new page, change `<html lang="de">`, point
   `<script src="story-de.js">` at the new story file, and change `/de` in the
   `canonical` and `og:url` lines.
3. Add a line for it to `languages.js`.
4. Add a `<link rel="alternate" hreflang="...">` line for it to the `<head>`
   of every page (`index.html`, `de.html`, and the new one), so search engines
   offer each reader the right language.

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

## Testing

`tests/` has browser tests for the reader (page turns, the cover, the
editions), run with Playwright against the site served from this folder. They
aren't part of the site; see `tests/README.md`.
