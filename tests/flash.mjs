// No dark flashes: a leaf's cast shadow must never be drawn without a leaf
// showing over it (that state, held for even a frame, darkens a whole page).
// Watches every DOM change, one frame at a time under a fake clock, while
// the mouse jiggles across the edges where a page or the cover lifts, and
// through turns of pages and of the cover.
import { launch, openBook, untilLeafShows, tally } from './lib.mjs';

const t = tally('Flashes');
const browser = await launch();
const pages = [];

async function hunt(name, start, script) {
  const p = await openBook(browser, { page: start, clock: true });
  pages.push(p);
  await p.evaluate(() => {
    window.bad = 0;
    const book = document.getElementById('book');
    new MutationObserver(() => {
      const shadow = [...book.querySelectorAll('.pt-cast')].some(c => c.style.background && getComputedStyle(c).display !== 'none' && +(c.style.opacity || 1) > 0);
      const leaf = [...book.querySelectorAll('.pt-leaf')].some(l => l.style.visibility !== 'hidden');
      if (shadow && !leaf) window.bad++;
    }).observe(book, { subtree: true, childList: true, attributes: true, attributeFilter: ['style', 'class'] });
  });
  const box = await p.locator('#book').boundingBox();
  const frame = async () => { await p.clock.runFor(16); await p.waitForTimeout(8); };
  // Back and forth across x0..x1 in small steps, a frame a step.
  const jiggle = async (x0, x1, passes = 3) => {
    const y = box.y + box.height * 0.55;
    for (let k = 0; k < passes; k++) {
      const [a, b] = k % 2 ? [x1, x0] : [x0, x1];
      const n = Math.ceil(Math.abs(b - a) / 4);
      for (let i = 0; i <= n; i++) { await p.mouse.move(a + (b - a) * i / n, y + (i % 3) - 1); await frame(); }
    }
  };
  const turnAndWatch = async (key) => {
    await p.keyboard.press(key);
    await untilLeafShows(p);
    for (let i = 0; i < 24; i++) await frame();
  };
  await script({ p, box, jiggle, turnAndWatch, frame });
  const bad = await p.evaluate(() => window.bad);
  t.check(name, bad === 0, `${bad} states with a shadow and no leaf`);
}

await hunt('page edges, spine and turns', 6, async ({ box, jiggle, turnAndWatch, p, frame }) => {
  const W = box.width / 2, right = box.x + box.width, left = box.x, spine = box.x + W;
  await jiggle(right - 0.075 * W - 18, right - 0.075 * W + 18);
  await jiggle(right - 25, right + 25);
  await jiggle(left + 0.075 * W - 18, left + 0.075 * W + 18);
  await jiggle(left - 25, left + 25);
  await jiggle(spine - 30, spine + 30, 2);
  await p.mouse.move(spine, box.y - 40);
  for (const key of ['ArrowRight', 'ArrowRight', 'ArrowLeft']) await turnAndWatch(key);
  await p.mouse.move(right - 12, box.y + box.height / 2);
  for (let i = 0; i < 8; i++) await frame();
  await p.mouse.down(); await p.mouse.up();      // a click while the page is lifted
  for (let i = 0; i < 24; i++) await frame();
});

await hunt('the cover’s edge and turns across it', 0, async ({ box, jiggle, turnAndWatch, p }) => {
  const right = box.x + box.width, W = box.width / 2;
  await jiggle(right - 0.075 * W - 18, right - 0.075 * W + 18);
  await jiggle(right - 25, right + 25);
  await p.mouse.move(box.x - 60, box.y - 40);
  for (const key of ['ArrowRight', 'ArrowLeft', 'ArrowRight', 'ArrowRight', 'Home']) await turnAndWatch(key);
});

t.done(...pages);
await browser.close();
