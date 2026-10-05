// Page turns under rough handling, in real time: rapid clicks, a held key,
// changing direction, jumps, resizing mid-turn, dragging and the hover lift,
// touch, and reduced motion. Every case must end at rest and consistent.
import { BASE, launch, openBook, settled, tally } from './lib.mjs';

const t = tally('Page turns');
const browser = await launch();
let p = await openBook(browser, { page: 6 });
const pages = [p];
// Back to #p<n> from scratch (going to the same document only changes the
// hash, which would turn the page).
const reset = async (n = 6) => {
  await p.goto('about:blank');
  await p.goto(`${BASE}#p${n}`);
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(400);
};

// Five quick clicks, all during the first turn: it, plus three queued.
for (let i = 0; i < 5; i++) await p.click('#btnNext', { delay: 0 });
t.state('rapid clicks queue three', await settled(p), 'Pages 13–14');

// A held arrow key keeps turning, and stops soon after it's let go.
await reset();
await p.keyboard.down('ArrowRight');
for (let i = 0; i < 45; i++) { await p.waitForTimeout(33); await p.keyboard.down('ArrowRight'); }
await p.keyboard.up('ArrowRight');
const released = Date.now();
const held = await settled(p);
t.state('held key', held);
t.check('held key stops soon after release', Date.now() - released < 1200, `${Date.now() - released} ms`);

// Forward, then back mid-turn: the leaf goes back where it came from.
await reset();
await p.keyboard.press('ArrowRight'); await p.waitForTimeout(90);
await p.keyboard.press('ArrowLeft');
t.state('change of mind', await settled(p), 'Pages 5–6');

for (let i = 0; i < 30; i++) { await p.keyboard.press(Math.random() < 0.6 ? 'ArrowRight' : 'ArrowLeft'); await p.waitForTimeout(15); }
t.state('thirty random presses', await settled(p));

await p.keyboard.press('g'); await p.keyboard.type('20'); await p.keyboard.press('Enter');
t.state('jump with G', await settled(p), 'Pages 19–20');
// G then Enter on the number it starts with (the page showing): no turn,
// and the page counter comes back.
await p.keyboard.press('g'); await p.keyboard.press('Enter');
t.state('G, then Enter on the page showing', await settled(p), 'Pages 19–20');
await p.keyboard.press('ArrowLeft'); await p.waitForTimeout(60);
await p.keyboard.press('Home');
t.state('Home mid-turn', await settled(p), 'Cover');
await p.evaluate(() => { location.hash = '#p11'; });
t.state('#p link', await settled(p), 'Pages 11–12');
await p.keyboard.press('ArrowRight'); await p.waitForTimeout(80);
await p.setViewportSize({ width: 390, height: 844 });
t.state('resized to a phone mid-turn', await settled(p), 'Page 13');
await p.setViewportSize({ width: 1440, height: 820 });
await settled(p);

// The mouse: the outer edge of a page lifts it, and it can be dragged.
await reset();
const box = await p.locator('#book').boundingBox();
const W = box.width / 2, y = box.y + box.height * 0.6, right = box.x + box.width;
const grabbing = () => p.evaluate(() => [document.getElementById('book').classList.contains('pt-grab'), !!document.querySelector('.pt-leaf')]);
// (Coming from inside the page: passing through the edge on the way in
// would lift it, and then it stays lifted a little further in.)
await p.mouse.move(right - 0.5 * W, y); await p.waitForTimeout(100);
await p.mouse.move(right - 0.1 * W, y, { steps: 3 }); await p.waitForTimeout(300);
t.check('no hand 10% in from the edge', (await grabbing()).every(v => !v));
await p.mouse.move(right - 0.05 * W, y, { steps: 3 }); await p.waitForTimeout(300);
t.check('hand and lifted page 5% in', (await grabbing()).every(v => v));
await p.mouse.move(right - 0.09 * W, y, { steps: 3 }); await p.waitForTimeout(200);
t.check('still held 9% in once lifted', (await grabbing()).every(v => v));
await p.mouse.move(right - 0.15 * W, y, { steps: 3 }); await p.waitForTimeout(400);
t.check('let go 15% in', (await grabbing()).every(v => !v));

await p.mouse.move(right - 15, y, { steps: 3 }); await p.waitForTimeout(300);
await p.mouse.down();
for (let i = 1; i <= 10; i++) { await p.mouse.move(right - 15 - i * 70, y - i * 3); await p.waitForTimeout(20); }
await p.mouse.move(box.x + 0.3 * W, y); await p.waitForTimeout(16);
await p.mouse.up();
t.state('mouse drag turns the page', await settled(p), 'Pages 7–8');
await p.mouse.move(right - 15, y, { steps: 3 }); await p.waitForTimeout(300);
await p.mouse.down();
await p.mouse.move(right - 160, y, { steps: 8 });
await p.waitForTimeout(250);
await p.mouse.up();
await p.mouse.move(box.x + box.width / 2, box.y - 60);
t.state('a drag held still falls back', await settled(p), 'Pages 7–8');
await p.mouse.click(right - 15, y);
t.state('a click after a drag still turns', await settled(p), 'Pages 9–10');
await p.context().close();

// Touch: the whole page can be taken (synthetic pointer events).
p = await openBook(browser, { page: 6, width: 390, height: 844, hasTouch: true, isMobile: true });
pages.push(p);
const touchDrag = (x0, x1, ms) => p.evaluate(async ([x0, x1, ms]) => {
  const book = document.getElementById('book'), y = 400;
  const ev = (type, x) => book.dispatchEvent(new PointerEvent(type, { pointerId: 7, pointerType: 'touch', isPrimary: true, clientX: x, clientY: y, bubbles: true, button: type === 'pointermove' ? -1 : 0, buttons: type === 'pointerup' ? 0 : 1 }));
  ev('pointerdown', x0);
  for (let i = 1; i <= 12; i++) { await new Promise(r => setTimeout(r, ms / 12)); ev('pointermove', x0 + (x1 - x0) * i / 12); }
  ev('pointerup', x1);
}, [x0, x1, ms]);
await touchDrag(330, 120, 220);
t.state('touch flick forward', await settled(p), 'Page 7');
await touchDrag(60, 300, 220);
t.state('touch flick back', await settled(p), 'Page 6');
await touchDrag(330, 300, 400);
t.state('a small touch nudge falls back', await settled(p), 'Page 6');

// Reduced motion: no leaf at all, just the new page.
p = await openBook(browser, { page: 6, reducedMotion: 'reduce' });
pages.push(p);
await p.evaluate(() => {
  window.sawLeaf = false;
  new MutationObserver(() => { if (document.querySelector('.pt-leaf')) window.sawLeaf = true; })
    .observe(document.getElementById('book'), { childList: true });
});
await p.click('#btnNext');
t.state('reduced motion turns', await settled(p), 'Pages 7–8');
t.check('reduced motion shows no leaf', !(await p.evaluate(() => window.sawLeaf)));

t.done(...pages);
await browser.close();
