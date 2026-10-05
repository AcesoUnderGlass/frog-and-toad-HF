// The closed book and its cover: opening and shutting, turning back mid-way,
// dragging the cover, rapid input across it, how open the book is (--open)
// and what follows it, and the reading order (the contents and title pages
// are skipped, #pN links still work), on a spread and on a phone.
import { launch, openBook, settled, tally } from './lib.mjs';

const t = tally('Cover');
const browser = await launch();
const pages = [];
const book = async (opts) => { const p = await openBook(browser, opts); pages.push(p); return p; };
const go = (p, hash) => p.evaluate(h => { location.hash = h; }, hash);

// How open the book is, and what follows it: the book's slide, and the
// status line's width.
const openness = p => p.evaluate(() => {
  const open = +getComputedStyle(document.querySelector('.desk')).getPropertyValue('--open');
  const slide = parseFloat(getComputedStyle(document.getElementById('book')).translate) || 0;
  const status = document.querySelector('.status').getBoundingClientRect().width;
  return { open, slide: Math.round(slide), status: Math.round(status) };
});

// The right-hand boards' outer edges: shut, the cover and the page edges
// beside it take up just what the open book's boards do.
const boards = p => p.evaluate(() => {
  const b = document.getElementById('book'), r = b.getBoundingClientRect(), cs = getComputedStyle(b, '::before');
  const edge = document.querySelector('.cover-edge').getBoundingClientRect();
  return { right: Math.round(r.right - parseFloat(cs.right) - r.left), top: Math.round(r.top + parseFloat(cs.top)), bottom: Math.round(r.bottom - parseFloat(cs.bottom)),
    coverRight: Math.round(edge.right - r.left), coverTop: Math.round(edge.top), coverBottom: Math.round(edge.bottom) };
});

let p = await book({ page: 0 });
const shut = await openness(p);
t.state('opens shut', await settled(p), 'Cover');
t.check('shut: slid left, status line the width of the cover', shut.open === 0 && shut.slide < -100 && shut.status < 600, JSON.stringify(shut));
const shutBoards = await boards(p);

await p.keyboard.press('ArrowRight');
const during = [];
for (let i = 0; i < 6; i++) { await p.waitForTimeout(40); during.push(await openness(p)); }
t.state('opens onto the first page of the story', await settled(p), 'Pages 3–4');
const open = await openness(p);
t.check('open: no slide, status line the width of the spread', open.open === 1 && open.slide === 0 && open.status > 1000, JSON.stringify(open));
const openBoards = await boards(p);
// The page edges and back board show 8px beyond the cover (.cover-edge's box-shadow).
t.check('shut, the book is no larger than the open boards', shutBoards.coverRight + 8 === openBoards.right &&
  shutBoards.coverTop === openBoards.top && shutBoards.coverBottom <= openBoards.bottom, JSON.stringify({ shutBoards, openBoards }));
const mid = during.filter(d => d.open > 0.05 && d.open < 0.95);
t.check('--open, the slide and the status line move with the cover', mid.length > 0 &&
  mid.every(d => d.slide < 0 && d.slide > shut.slide && d.status > shut.status && d.status < open.status),
  JSON.stringify(during.map(d => d.open.toFixed(2))));

await p.keyboard.press('ArrowLeft');
t.state('back from the first page shuts the book', await settled(p), 'Cover');
await p.keyboard.press('ArrowRight'); await p.waitForTimeout(100);
await p.keyboard.press('ArrowLeft');
t.state('opening, then back mid-way: shut again', await settled(p), 'Cover');
await p.keyboard.press('ArrowRight'); await p.waitForTimeout(30);
await p.keyboard.press('ArrowRight', { delay: 0 }); await p.keyboard.press('ArrowRight', { delay: 0 });
t.state('three quick turns from the cover', await settled(p), 'Pages 7–8');
for (let i = 0; i < 6; i++) await p.keyboard.press('ArrowLeft', { delay: 0 });
t.state('quick turns back stop at the cover', await settled(p), 'Cover');
for (let i = 0; i < 20; i++) { await p.keyboard.press(i % 3 ? 'ArrowRight' : 'ArrowLeft'); await p.waitForTimeout(12); }
t.state('rapid presses across the cover', await settled(p));

// Dragging the cover open and shut with the mouse.
await p.keyboard.press('Home');
t.state('Home shuts the book', await settled(p), 'Cover');
// The cover as laid out (before any lift's transform): its size, and where
// its title, byline and art sit in it.
const coverLayout = (p, sel) => p.evaluate(s => {
  const c = document.querySelector(s);
  return c && [c.offsetWidth, c.offsetHeight, ...[...c.querySelectorAll('.title, .byline, .art:not(.placeholder)')]
    .map(e => [e.offsetLeft, e.offsetTop, e.offsetWidth, e.offsetHeight].join(','))].join(' ');
}, sel);
const atRest = await coverLayout(p, '#book > .page.right .cover-front');
let box = await p.locator('#book').boundingBox();
const y = box.y + box.height * 0.6;
await p.mouse.move(box.x + box.width - 150, y); await p.waitForTimeout(100);
await p.mouse.move(box.x + box.width - 12, y, { steps: 3 }); await p.waitForTimeout(300);
t.check('the cover lifts under the pointer at its edge', await p.evaluate(() => !!document.querySelector('.pt-leaf')));
const lifted = await coverLayout(p, '.pt-leaf .pt-front .cover-front');
t.check('the lifted cover is laid out exactly as it is at rest', lifted === atRest, `rest ${atRest} / lifted ${lifted}`);
await p.mouse.down();
for (let i = 1; i <= 12; i++) { await p.mouse.move(box.x + box.width - 12 - i * 70, y); await p.waitForTimeout(20); }
await p.mouse.up();
t.state('dragged open', await settled(p), 'Pages 3–4');
box = await p.locator('#book').boundingBox();
await p.mouse.move(box.x + 150, y); await p.waitForTimeout(100);
await p.mouse.move(box.x + 12, y, { steps: 3 }); await p.waitForTimeout(300);
await p.mouse.down();
for (let i = 1; i <= 12; i++) { await p.mouse.move(box.x + 12 + i * 80, y); await p.waitForTimeout(20); }
await p.mouse.up();
await p.mouse.move(box.x + box.width / 2, box.y - 60);
t.state('dragged shut', await settled(p), 'Cover');

// Reading order and links.
for (const [hash, want] of [['#p1', 'Pages 3–4'], ['#p2', 'Pages 3–4'], ['#p0', 'Cover'], ['#p9', 'Pages 9–10'], ['#p24', 'Pages 23–24']]) {
  await go(p, hash);
  t.state(`${hash} link`, await settled(p), want);
}
await p.keyboard.press('Home');
t.state('Home', await settled(p), 'Cover');
await p.keyboard.press('End');
t.state('End', await settled(p), 'Pages 23–24');

// A phone: one page at a time; the cover lifts off to the left like a page.
p = await book({ page: 0, width: 390, height: 844, isMobile: true, hasTouch: true });
t.state('phone: shut', await settled(p), 'Cover');
// Anything wider than the phone makes the browser lay the page out wider and
// zoom it out (the book is then sized for the wider page).
const phoneWidth = await p.evaluate(() => [innerWidth, document.documentElement.scrollWidth]);
t.check('phone: laid out at the phone\'s width, not zoomed out', phoneWidth.every(v => v === 390), JSON.stringify(phoneWidth));
await p.keyboard.press('ArrowRight');
t.state('phone: opens onto the first page', await settled(p), 'Page 3');
await p.keyboard.press('ArrowLeft');
t.state('phone: back shuts it', await settled(p), 'Cover');
await go(p, '#p2');
t.state('phone: #p2 is the first page', await settled(p), 'Page 3');
await p.keyboard.press('ArrowLeft'); await p.waitForTimeout(80);
await p.keyboard.press('ArrowRight');
t.state('phone: shutting, then back mid-way', await settled(p), 'Page 3');

t.done(...pages);
await browser.close();
