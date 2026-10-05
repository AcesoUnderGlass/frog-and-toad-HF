// The editions: the German book's cover (title split, translator credit),
// its hanging „ quotes and interface words; the language menu, which keeps
// the page being read; the About and Contact links and their way back; and
// the book opened straight from a file.
import { BASE, launch, newContext, openBook, watchErrors, tally } from './lib.mjs';

const t = tally('Editions');
const browser = await launch();
const pages = [];
const DE = new URL('de.html', BASE).href;

const openGerman = async (opts) => { const p = await openBook(browser, { ...opts, url: DE }); pages.push(p); return p; };

// The cover's title and byline, and whether the main title is on one line
// and inside the board.
const coverText = p => p.evaluate(() => {
  const front = document.querySelector('#book > .page > .cover-front');
  const main = front.querySelector('.title .main'), sub = front.querySelector('.title .sub');
  const line = parseFloat(getComputedStyle(main).lineHeight) || parseFloat(getComputedStyle(main).fontSize) * 1.2;
  const m = main.getBoundingClientRect(), f = front.getBoundingClientRect();
  const r = new Range();
  r.selectNodeContents(main);
  const text = r.getBoundingClientRect();
  return {
    main: main.textContent, sub: sub.textContent,
    oneLine: m.height < line * 1.5, inside: text.left >= f.left && text.right <= f.right,
    byline: [...front.querySelectorAll('.byline p')].map(p => p.textContent),
    capitalised: [...front.querySelectorAll('.byline p')].every(p => getComputedStyle(p, '::first-letter').textTransform === 'uppercase'),
  };
});

// English: unchanged.
let p = await openBook(browser, { page: 0 });
pages.push(p);
let c = await coverText(p);
t.check('English cover title', c.main === 'Frog and Toad' && c.sub === 'and the Increasingly Capable Machines' && c.oneLine, JSON.stringify(c));
t.check('English byline: two lines', c.byline.length === 2, JSON.stringify(c.byline));

// German cover, on a spread and on a phone.
for (const [width, height] of [[1440, 820], [390, 844]]) {
  p = await openGerman({ page: 0, width, height });
  c = await coverText(p);
  t.check(`German cover title (${width}px)`, c.main === 'Frosch und Kröte' && c.sub === 'und die immer fähigeren Maschinen' && c.oneLine && c.inside, JSON.stringify(c));
  t.check(`German byline: translator third, capitalised (${width}px)`, c.byline.length === 3 && /^übersetzt von Robert Herr$/.test(c.byline[2]) && c.capitalised, JSON.stringify(c.byline));
}

// German interface words.
p = await openGerman({ page: 0 });
const words = await p.evaluate(() => ({
  title: document.title,
  where: document.querySelector('.status .where').textContent,
  jumpHint: document.querySelector('.status .where').title,
  prev: document.getElementById('btnPrev').getAttribute('aria-label'),
  next: document.getElementById('btnNext').title,
  full: document.getElementById('btnFull').getAttribute('aria-label'),
  links: [...document.querySelectorAll('.status .links a')].map(a => a.textContent),
  language: document.querySelector('.status .lang')?.getAttribute('aria-label'),
}));
t.check('German interface words', words.title === 'Frosch und Kröte und die immer fähigeren Maschinen' &&
  words.where === 'Titelseite von 24' && words.jumpHint === 'Zu einer Seite springen (G)' &&
  words.prev === 'Vorherige Seite' && words.next === 'Nächste Seite (→)' && words.full === 'Vollbild' &&
  words.links.join('|') === 'Über das Buch|Kontakt' && words.language === 'Sprache', JSON.stringify(words));
await p.keyboard.press('ArrowRight');
await p.waitForTimeout(700);
await p.keyboard.press('g');
const jump = await p.evaluate(() => document.querySelector('.status .jump')?.textContent);
await p.keyboard.press('Escape');
const opened = await p.evaluate(() => document.querySelector('.status .where').textContent);
t.check('German page counter and jump box', opened === 'Seiten 3–4 von 24' && jump === 'Seite  von 24', JSON.stringify({ opened, jump }));

// Hanging „: on page 4 the quote sits in the margin, so the letters after it
// line up with those of a paragraph without one.
const hang = await p.evaluate(() => {
  const ps = [...document.querySelectorAll('#pageR .page-content p')];
  const start = el => { const r = new Range(); r.setStart(el, 0); r.setEnd(el, 1); return r.getBoundingClientRect().left; };
  const plain = ps.find(x => !x.querySelector('.hang'));
  const hung = ps.find(x => x.querySelector('.hang'));
  const firstText = n => { const w = document.createTreeWalker(n, NodeFilter.SHOW_TEXT); let x; while ((x = w.nextNode())) if (!x.parentElement.closest('.hang') && x.data.trim()) return x; };
  return {
    quote: hung?.querySelector('.hang').textContent,
    plain: start(firstText(plain)), letter: start(firstText(hung)),
    quoteLeft: start(hung.querySelector('.hang').firstChild),
  };
});
t.check('German „ hangs in the margin', hang.quote === '„' && Math.abs(hang.letter - hang.plain) < 0.5 && hang.quoteLeft < hang.plain - 2, JSON.stringify(hang));

// The language menu keeps the page being read, both ways, and on a phone.
async function switchTo(p, lang) {
  await Promise.all([p.waitForNavigation(), p.selectOption('.status .lang', { label: lang })]);
  await p.evaluate(() => document.fonts.ready);
  await p.waitForFunction(() => document.querySelector('.desk.drawn'), null, { timeout: 8000 }).catch(() => {});
  await p.waitForTimeout(400);
  return p.evaluate(() => ({ url: location.pathname + location.hash, lang: document.documentElement.lang, where: document.querySelector('.status .where').textContent }));
}
p = await openBook(browser, { page: 9 });
pages.push(p);
await p.keyboard.press('ArrowRight');
await p.waitForTimeout(700);
let to = await switchTo(p, 'Deutsch');
t.check('English 11–12 to German', to.lang === 'de' && to.where === 'Seiten 11–12 von 24', JSON.stringify(to));
to = await switchTo(p, 'English');
t.check('and back to English', to.lang === 'en' && to.where === 'Pages 11–12 of 24', JSON.stringify(to));
p = await openBook(browser, { page: 7, width: 390, height: 844 });
pages.push(p);
to = await switchTo(p, 'Deutsch');
t.check('phone: page 7 to German', to.where === 'Seite 7 von 24', JSON.stringify(to));
p = await openBook(browser, { page: 0 });
pages.push(p);
to = await switchTo(p, 'Deutsch');
t.check('the cover to German', to.where === 'Titelseite von 24' && !to.url.includes('#'), JSON.stringify(to));

// About and Contact: the links under the book lead to them, and they lead
// back to the book.
for (const book of [BASE, DE]) {
  const ctx = await newContext(browser, { viewport: { width: 1440, height: 820 } });
  p = watchErrors(await ctx.newPage());
  pages.push(p);
  await p.goto(book);
  await p.waitForFunction(() => document.querySelector('.desk.drawn'));
  const hrefs = await p.evaluate(() => [...document.querySelectorAll('.status .links a')].map(a => a.href));
  for (const href of hrefs) {
    const res = await p.goto(href);
    const sheet = await p.evaluate(() => ({ h1: document.querySelector('.sheet h1')?.textContent, back: [...document.querySelectorAll('.back a')].map(a => a.href) }));
    const backs = await Promise.all(sheet.back.map(h => p.request.get(h).then(r => r.status())));
    t.check(`${new URL(book).pathname} → ${new URL(href).pathname}`, res.status() === 200 && sheet.h1 && backs.length === 2 && backs.every(s => s === 200), JSON.stringify({ status: res.status(), ...sheet, backs }));
  }
  await p.goto(new URL('about.html', BASE).href);
  await Promise.all([p.waitForNavigation(), p.click('.back a[href="index.html"]')]);
  await p.waitForFunction(() => document.querySelector('.desk.drawn'), null, { timeout: 8000 }).catch(() => {});
  t.check('About: back to the book', await p.evaluate(() => !!document.querySelector('#book .cover-front')));
}

// Opened straight from a file (no server), the book still works.
if (process.env.SKIP_FILE !== '1') {
  const ctx = await newContext(browser, { viewport: { width: 1440, height: 820 } });
  p = watchErrors(await ctx.newPage());
  await p.goto(new URL('../de.html#p5', import.meta.url).href);
  await p.waitForFunction(() => document.querySelector('.desk.drawn'), null, { timeout: 8000 }).catch(() => {});
  const where = await p.evaluate(() => document.querySelector('.status .where')?.textContent);
  // (Vercel's analytics script can't load from a file; nothing else should fail.)
  const errors = p.errors.filter(e => !/_vercel\/insights|ERR_FILE_NOT_FOUND|Failed to load resource/.test(e));
  t.check('opens from a file', where === 'Seiten 5–6 von 24' && !errors.length, JSON.stringify({ where, errors }));
}

// Everything in the status line can be clicked: nothing (such as the title,
// laid over the whole line) sits on top of the links, the language menu or
// the page counter. Shut and open, a spread and a phone, both editions.
for (const [url, page, width, height] of [[BASE, 0, 1440, 820], [BASE, 6, 1440, 820], [DE, 6, 1440, 820], [BASE, 6, 390, 844]]) {
  p = await openBook(browser, { url, page, width, height });
  pages.push(p);
  const blocked = await p.evaluate(() => [...document.querySelectorAll('#status a, #status button, #status select')].filter(el => {
    const r = el.getBoundingClientRect();
    const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
    return !(hit && (hit === el || el.contains(hit)));
  }).map(el => (el.textContent || el.value).trim()));
  t.check(`status line clickable (${new URL(url).pathname} p${page}, ${width}px)`, !blocked.length, JSON.stringify(blocked));
}

t.done(...pages);
await browser.close();
