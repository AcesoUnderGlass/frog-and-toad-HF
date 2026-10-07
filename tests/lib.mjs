// Shared by the reader's tests: the browser, opening the book, waiting for it
// to come to rest, and tallying results. See README.md.
const pw = await import(process.env.PLAYWRIGHT_CORE || 'playwright-core');

// The site served from the repository's root, e.g. python3 -m http.server 8765.
export const BASE = process.env.BASE || 'http://localhost:8765/';
export const browserName = process.env.BROWSER === 'webkit' ? 'webkit' : 'chrome';

export function launch() {
  return browserName === 'webkit' ? pw.webkit.launch() : pw.chromium.launch({ channel: 'chrome' });
}

// A browser context in which Vercel Web Analytics' script (served only on
// Vercel) is an empty script rather than a 404 and a console error.
export async function newContext(browser, options) {
  const ctx = await browser.newContext(options);
  await ctx.route('**/_vercel/insights/**', r => r.fulfill({ body: '', contentType: 'text/javascript' }));
  return ctx;
}

// Collect a page's console errors and uncaught exceptions in p.errors.
export function watchErrors(p) {
  p.errors = [];
  p.on('console', m => { if (m.type() === 'error') p.errors.push(m.text()); });
  p.on('pageerror', e => p.errors.push(e.message));
  return p;
}

// A new page showing #p<page> of the book at url (default BASE), fonts and
// pictures loaded. With clock: true
// time stands still until the test runs it on (page.clock.runFor).
export async function openBook(browser, { page = 0, url = BASE, width = 1440, height = 820, scale = 1, clock = false, ...context } = {}) {
  const ctx = await newContext(browser, { viewport: { width, height }, deviceScaleFactor: scale, ...context });
  const p = watchErrors(await ctx.newPage());
  if (clock) await p.clock.install();
  await p.goto(`${url}#p${page}`, { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForFunction(() => [...document.images].every(i => i.complete), null, { timeout: 8000 }).catch(() => {});
  if (clock) await p.clock.runFor(600);
  await p.waitForTimeout(300);
  if (clock) await p.clock.pauseAt(await p.evaluate(() => Date.now()) + 50);
  return p;
}

// Run the (paused) clock one frame at a time until a new leaf has its
// pictures and shows, so a test can then step through the turn itself.
export async function untilLeafShows(p) {
  for (let i = 0; i < 20; i++) {
    await p.clock.runFor(16);
    await p.waitForTimeout(25);
    if (await p.evaluate(() => !document.querySelector('.pt-leaf[style*="hidden"]'))) return;
  }
}

// Wait for any turn to finish, then describe the book and whether it agrees
// with itself: no leaf or shadow left, the page numbers showing match the
// status line, and the book is open or shut to match.
export async function settled(p) {
  await p.waitForFunction(() => !document.querySelector('.pt-leaf'), null, { timeout: 8000 }).catch(() => {});
  await p.waitForTimeout(100);
  return p.evaluate(() => {
    const book = document.getElementById('book');
    const where = document.querySelector('.status .where')?.textContent || '';
    const nums = (where.match(/\d+/g) || []).map(Number).slice(0, -1);
    const folios = [...book.querySelectorAll(':scope > .page > .folio')].map(f => +f.textContent);
    const leaves = book.querySelectorAll('.pt-leaf').length;
    const shadow = [...book.querySelectorAll('.pt-cast')].some(c => c.style.background);
    const open = +getComputedStyle(document.querySelector('.desk')).getPropertyValue('--open');
    const shut = where.startsWith('Cover');
    const ok = !leaves && !shadow && folios.every(f => nums.includes(f)) &&
      open === (shut ? 0 : 1) && book.classList.contains('closed') === shut;
    return { where: where.replace(/ of \d+$/, ''), folios, open, ok };
  });
}

// Results, printed as they come; done() exits non-zero if anything failed.
export function tally(title) {
  let failed = 0;
  console.log(`${title} (${browserName})`);
  return {
    check(name, ok, detail = '') {
      if (!ok) failed++;
      console.log(`  ${ok ? 'PASS' : 'FAIL'} ${name}${detail ? '  ' + detail : ''}`);
    },
    // A settled state, optionally at an expected place ("Pages 3–4", "Cover").
    state(name, s, want) {
      this.check(name, s.ok && (!want || s.where === want), JSON.stringify(s) + (want ? ` want ${want}` : ''));
    },
    done(...pages) {
      const errors = pages.flatMap(p => p.errors || []);
      this.check('no console errors', !errors.length, errors.join(' | '));
      console.log(failed ? `${failed} failed` : 'all passed');
      process.exitCode = failed ? 1 : 0;
    },
  };
}
