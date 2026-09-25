# Storybook

A small web app that reads like a picture book. Pages turn with a 3D flip.
On a wide screen you see a two-page spread; on a phone, one page at a time.

## Run it

Just open `index.html` in a browser (double-click it). No build step, no server needed.

If you prefer a local server:

```bash
python3 -m http.server 8000
```

then visit http://localhost:8000.

## Turning pages

- Click the right half of the book, press `→`, `Space`, or `Enter` to go forward.
- Click the left half or press `←` / `Backspace` to go back.
- Swipe left/right on touch screens.
- `Home` / `End` jump to the cover / last page.
- Click the "Page X of N" line under the book (or press `G`), type a page number, and press `Enter` to jump there.
- The book always opens on the cover. Add `#p7` to the URL to link straight to page 7.

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
| `title:`, `author:`, `artist:`, `cover-image:` | Go at the very top, before the first `---`. They make the cover page. `artist` and `cover-image` are optional; the artist line appears under the author. |
| `---` on its own line | Starts a new page. |
| Plain lines | Story text. Consecutive lines join into one paragraph; a **blank line** starts a new paragraph. Straight quotes become curly quotes automatically. |
| `[link text](https://example.com)` | Makes a clickable link. Also works in `caption:`, `author:`, and `artist:` text. Only `https://`, `http://`, and `mailto:` links are allowed; the link opens in a new tab. |
| `image: path` | Puts an illustration on the page. The path is relative to `index.html` (put files in `illustrations/`), or a full `https://` URL. Put it **before** the text to have the picture above the words, or **after** to have it below. A page can have several images, or an image and no text. |
| `alt: description` | Optional. Line right after an `image:`. Screen-reader text. |
| `caption: text` | Optional. Line right after an `image:`. Printed in italics under the picture. |
| `chapter: Name` | Makes this page a chapter title page. Chapters are numbered automatically. |
| `contents` | Makes this page a table of contents, listing every chapter with its page number. Entries are clickable. |
| `center` | Centers the text on this page. Good for "The End" or a dedication. |
| `blank` | An empty page. Handy for pushing a chapter title onto a right-hand page in the two-page view. |

Page numbers count from 1 on the first page after the cover. Chapter and contents pages are not numbered.

### Notes

- Text that overflows a page is shrunk slightly to fit. If it is still too long, split it across two pages. Lobel's pages run about 40 to 80 words, and short lines look best.
- Images can be `.png`, `.jpg`, `.svg`, `.webp`, or `.gif`. A missing image shows a dashed placeholder with the file name, so you can see what to fix.
- Avoid backticks (`` ` ``) and `${` inside the story, because the story sits inside a JavaScript template string. If a line has to begin with a word like `image:`, put a backslash in front: `\image:`.
- Fonts: the page loads Libre Baskerville from Google Fonts when online, and falls back to Palatino / Georgia offline.

### Illustrations for the web

The story points at `illustrations/web/`, which holds small WebP copies of the
master art in `illustrations/`. The copies are downscaled and have their white
turned into transparency, so the paper colour and texture show through the
margins. Alongside them, `sizes.js` records each picture's pixel size so pages
can be laid out (and text pages measured) before the pictures download.

After changing a master, rebuild the copies with:

```bash
python3 tools/make-web-images.py
```

It needs Pillow, NumPy, and WebP support in Pillow.
