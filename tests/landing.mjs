// Landing: as a leaf comes down, its print must arrive exactly where the page
// it becomes is drawn, so swapping the leaf for that page shows no jump.
// Every frame of a turn (fake clock, 16 ms frames), the left edges of the
// first line of text and of the picture, as projected on screen from the leaf
// (getBoundingClientRect includes the 3D transforms), are compared with the
// same on the page drawn after landing. Spreads and a phone, both ways, onto
// pages with pictures; plus the cover shutting (its print must land too).
import { launch, openBook, untilLeafShows, tally } from './lib.mjs';

const t = tally('Landing');
const browser = await launch();
const pages = [];

// In the page: left edges of the first line of text (or the cover's title)
// and of the first picture (or the cover art) inside el, if any.
const defineMarks = () => {
  window.marks = el => {
    const p = el.querySelector('.page-content p, .cover-front .title'), img = el.querySelector('.page-content img, .cover-front .art');
    const r = new Range();
    if (p) r.selectNodeContents(p);
    return { text: p ? r.getClientRects()[0]?.left : null, picture: img ? img.getBoundingClientRect().left : null };
  };
};

async function landing(name, { start, key, width = 1440, height = 820 }) {
  const p = await openBook(browser, { page: start, width, height, clock: true });
  pages.push(p);
  await p.evaluate(defineMarks);
  await p.keyboard.press(key);
  await untilLeafShows(p);
  // Each frame: where the landing page's marks are on the leaf. The page it
  // becomes is the one the leaf's side facing up shows once flat; measure the
  // copy in the segment holding the mark, median over segments.
  const frames = [];
  for (let i = 0; i < 40; i++) {
    const f = await p.evaluate(({ fwd }) => {
      const leaf = document.querySelector('.pt-leaf');
      if (!leaf) return null;
      const side = fwd ? '.pt-back' : '.pt-front';
      const copies = [...leaf.querySelectorAll(`${side} > :first-child`)];
      const median = a => { const v = a.filter(x => x != null).sort((x, y) => x - y); return v.length ? v[v.length >> 1] : null; };
      const m = copies.map(window.marks);
      return { text: median(m.map(x => x.text)), picture: median(m.map(x => x.picture)) };
    }, { fwd: key === 'ArrowRight' });
    if (!f) break;
    frames.push(f);
    await p.clock.runFor(16);
    await p.waitForTimeout(10);
  }
  await p.clock.runFor(200); await p.waitForTimeout(150);
  // The page it landed as: on a spread, the left page going forward, the
  // right going back; on a phone, the page shown.
  const settledMarks = await p.evaluate(({ fwd }) => {
    const spread = document.getElementById('book').classList.contains('spread');
    return window.marks(document.getElementById(spread && fwd ? 'pageL' : 'pageR'));
  }, { fwd: key === 'ArrowRight' });
  if (settledMarks.text == null && settledMarks.picture == null) return t.check(name, false, 'nothing to measure on the page');
  const off = (f, k) => (f[k] == null || settledMarks[k] == null ? 0 : Math.abs(f[k] - settledMarks[k]));
  const last = frames.slice(-3).map(f => Math.max(off(f, 'text'), off(f, 'picture')));
  const fmt = v => v.toFixed(2);
  t.check(name, frames.length > 5 && last[last.length - 1] < 0.75 && last.every(v => v < 3),
    `${frames.length} frames; last three off by ${last.map(fmt).join(', ')} px (text at ${settledMarks.text?.toFixed(1)}, picture at ${settledMarks.picture?.toFixed(1)})`);
}

// Pages 5–6 and 7–8 have pictures on both sides of the turn.
await landing('spread, forward onto 5–6', { start: 4, key: 'ArrowRight' });
await landing('spread, back onto 7–8', { start: 10, key: 'ArrowLeft' });
await landing('phone, forward onto 5', { start: 4, key: 'ArrowRight', width: 390, height: 844 });
await landing('phone, back onto 7', { start: 8, key: 'ArrowLeft', width: 390, height: 844 });
await landing('spread, the cover shutting back onto it', { start: 4, key: 'ArrowLeft' });

t.done(...pages);
await browser.close();
