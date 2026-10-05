/* Storybook reader. The story comes from story.js (window.STORY, and for a
   translation window.STORY_UI), the pictures' sizes from
   illustrations/web/sizes.js, the editions for the language menu from
   languages.js. Pages turn with pageturn.js (createPageTurner). */
(function () {
  'use strict';

  const IMAGE_SIZES = window.IMAGE_SIZES || {};
  const LANG = document.documentElement.lang || 'en';

  /* ---------------- Interface words ---------------- */

  // The reader's own words (not the story's). A translation overrides any of
  // these by setting window.STORY_UI in its story file; see story-de.js.
  const UI = Object.assign({
    chapter: 'Chapter {n}',
    contents: 'Contents',
    cover: 'Cover',
    page: 'Page {n}',
    pages: 'Pages {from}–{to}',
    whereOfTotal: '{where} of {total}',
    jumpBefore: 'Page ',
    jumpAfter: ' of {total}',
    jumpHint: 'Jump to a page (G)',
    jumpLabel: 'Page number, 0 to {total}',
    previous: 'Previous page',
    next: 'Next page',
    fullscreen: 'Full screen',
    exitFullscreen: 'Exit full screen',
    illustration: 'Illustration',
    missing: 'Missing illustration: {src}',
    language: 'Language',
    about: 'About',
    contact: 'Contact',
  }, window.STORY_UI);

  function t(key, vars) {
    return UI[key].replace(/\{(\w+)\}/g, (m, name) => (vars && name in vars ? vars[name] : m));
  }

  // The book is set in one family, Fraunces (loaded in index.html), scaled so
  // its lowercase is as tall as the original site's Libre Baskerville's
  // (x-heights 0.530 and 0.468 of the size): --x-scale in reader.css.

  // Each illustration's drawn frame sits inside a transparent margin. This is
  // that margin's left width, as a percent of the image width (measured from
  // the alpha channel), so a picture can be shifted to line its frame up with
  // the text beside it.
  const ART_INSET_LEFT = {
    'illustrations/web/1-FAT-title-final.webp': 2.82,
    'illustrations/web/2-FAT-Meet-HF-final.webp': 2.68,
    'illustrations/web/3-FAT-Machines-Sandboxes-final.webp': 2.00,
    'illustrations/web/4-FAT-shed-note-final.webp': 2.86,
    'illustrations/web/5-FAT-shed-hole-final.webp': 2.14,
    'illustrations/web/6-FAT-shed-return-final.webp': 2.14,
    'illustrations/web/7-FAT-keys-fina.webp': 2.43,
    'illustrations/web/8-FAT-break-in-final.webp': 2.86,
    'illustrations/web/9-FAT-HF-yelling-final.webp': 2.71,
    'illustrations/web/10-FAT-find-notes-final.webp': 3.08,
    'illustrations/web/11-FAT-cookies-flashback-final.webp': 1.71,
    'illustrations/web/12-FAT-cake-final copy.webp': 2.86,
  };

  /* ---------------- Parsing ---------------- */

  const KEY_RE = /^(image|alt|caption|chapter)\s*:\s*(.*)$/i;
  const FLAG_RE = /^(contents|blank|center)\s*$/i;

  // Straight quotes become curly ones in the edition's own style: “…” and
  // ‘…’ in English, „…“ in German (where a straight ' is taken for an
  // apostrophe; type ‚…‘ as they are). Curly quotes in the story are left
  // as they are.
  const QUOTES = { de: ['„', '“', '‚', '’'] }[LANG.slice(0, 2)] || ['“', '”', '‘', '’'];

  function smartQuotes(s) {
    return s
      .replace(/(^|[\s(\[{—-])"/g, '$1' + QUOTES[0]).replace(/"/g, QUOTES[1])
      .replace(/(^|[\s(\[{—-])'/g, '$1' + QUOTES[2]).replace(/'/g, QUOTES[3])
      // A real ellipsis character; a fourth dot is the sentence's full stop.
      .replace(/\.\.\./g, '…')
      // Keep a title with the name that follows it.
      .replace(/\b(Mr|Mrs|Ms|Dr)\. /g, '$1.\u00a0');
  }

  function parseStory(src) {
    const story = { title: 'Untitled', author: '', artist: '', translator: '', pages: [] };
    const sections = String(src).replace(/\r\n?/g, '\n').split(/^[ \t]*-{3,}[ \t]*$/m);

    // Front matter: "key: value" lines before the first ---
    for (const line of sections.shift().split('\n')) {
      const m = line.match(/^\s*([\w-]+)\s*:\s*(.*)$/);
      if (m) story[m[1].toLowerCase().replace('-', '')] = m[2].trim();
    }
    story.pages.push({ kind: 'cover', image: story.coverimage || story.cover || '' });

    for (const sec of sections) {
      const page = { kind: 'page', blocks: [], center: false };
      let para = [];
      let lastImage = null;
      const flush = () => {
        if (para.length) page.blocks.push({ type: 'text', text: smartQuotes(para.join(' ')) });
        para = [];
      };
      for (const raw of sec.split('\n')) {
        const line = raw.trim();
        let m;
        if (!line) { flush(); continue; }
        if ((m = line.match(FLAG_RE))) {
          const f = m[1].toLowerCase();
          if (f === 'center') page.center = true;
          else page.kind = f;                       // contents | blank
          continue;
        }
        if ((m = line.match(KEY_RE))) {
          const key = m[1].toLowerCase(), val = m[2].trim();
          if (key === 'image') {
            flush();
            lastImage = { type: 'image', src: val, alt: '', caption: '' };
            page.blocks.push(lastImage);
          } else if (key === 'alt' && lastImage) lastImage.alt = val;
          else if (key === 'caption' && lastImage) lastImage.caption = smartQuotes(val);
          else if (key === 'chapter') { flush(); page.kind = 'chapter'; page.chapter = val; }
          continue;
        }
        para.push(line.replace(/^\\/, ''));       // "\image: ..." escapes a keyword
      }
      flush();
      if (!(page.kind === 'page' && !page.blocks.length)) story.pages.push(page);
    }

    return story;
  }

  /* ---------------- Links ---------------- */

  // Where this reader came from: a utm_source if the link carried one, else the
  // referring site, else "direct". Remembered for the tab, so switching
  // language (which makes this site its own referrer) doesn't lose it.
  const SOURCE = (function () {
    const clean = (s) => (s || '').toLowerCase().replace(/^www\./, '').replace(/[^a-z0-9.-]/g, '').slice(0, 60);
    let source = clean(new URLSearchParams(location.search).get('utm_source'));
    if (!source) {
      try {
        const host = new URL(document.referrer).hostname;
        if (host !== location.hostname) source = clean(host);
      } catch (e) { /* no referrer */ }
    }
    try {
      if (source) sessionStorage.setItem('source', source);
      else source = sessionStorage.getItem('source');
    } catch (e) { /* storage unavailable */ }
    return source || 'direct';
  })();

  // The "learn more" link carries the source in its path, e.g.
  // /learn-more/news.ycombinator.com, so Vercel Web Analytics shows which
  // referrers led to clicks. vercel.json serves learn-more.html for all of
  // them; a plain local server can't, so there the link is left alone.
  const LOCAL = location.protocol === 'file:' || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);

  function linkHref(href) {
    return href === 'learn-more.html' && !LOCAL ? '/learn-more/' + SOURCE : href;
  }

  /* ---------------- Rendering ---------------- */

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  // "[text](url)" becomes a link. Only http(s), mailto and the site's own
  // .html pages are allowed, so odd story text can't smuggle in javascript:
  // etc. Link text may contain one level of brackets, e.g. "PHASEONE[big]".
  const LINK_RE = /\[((?:[^\[\]]|\[[^\[\]]*\])+)\]\((https?:\/\/[^\s()]+|mailto:[^\s()]+|[^\s()]+\.html)\)/g;

  function appendText(parent, text) {
    LINK_RE.lastIndex = 0;
    let last = 0, m;
    while ((m = LINK_RE.exec(text))) {
      if (m.index > last) parent.append(text.slice(last, m.index));
      const a = el('a', null, m[1]);
      a.href = linkHref(m[2]);
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      parent.append(a);
      last = LINK_RE.lastIndex;
    }
    if (last < text.length) parent.append(text.slice(last));
    return parent;
  }

  function renderParagraph(block) {
    return appendText(el('p'), block.text);
  }

  function renderImage(block, measuring) {
    const fig = el('figure');
    const dims = IMAGE_SIZES[block.src];
    if (measuring && dims) {
      // The measuring pass only needs the picture's footprint, so stand in a
      // box of the right proportions instead of fetching every illustration
      // in the book up front.
      const box = el('div', 'img-placeholder');
      box.style.aspectRatio = dims[0] + ' / ' + dims[1];
      fig.append(box);
    } else {
      const img = el('img');
      if (dims) { img.width = dims[0]; img.height = dims[1]; }
      // A picture not listed in sizes.js takes room only once it arrives.
      else if (!measuring) img.addEventListener('load', () => setTimeout(refit), { once: true });
      img.src = block.src;
      img.alt = block.alt || block.caption || t('illustration');
      img.draggable = false;
      img.decoding = 'async';
      if (ART_INSET_LEFT[block.src]) img.style.setProperty('--inset-l', ART_INSET_LEFT[block.src] + '%');
      img.addEventListener('error', () => img.replaceWith(el('div', 'missing', t('missing', { src: block.src }))));
      fig.append(img);
    }
    if (block.caption) fig.append(appendText(el('figcaption'), block.caption));
    return fig;
  }

  function ornament() {
    const o = el('div', 'ornament');
    o.setAttribute('aria-hidden', 'true');
    o.append(el('span'));
    return o;
  }

  // The title sets as a main title with a smaller second line, which starts
  // where the title's second word comes round again: "Frog and Toad | and
  // the Increasingly Capable Machines", "Frosch und Kröte | und die immer
  // fähigeren Maschinen". A title with no such repeat is set whole.
  function renderTitle(story) {
    const h1 = el('h1', 'title');
    const words = story.title.split(/\s+/);
    const join = (words[1] || '').toLowerCase();
    const at = words.findIndex((w, i) => i > 2 && w.toLowerCase() === join);
    if (at > 0) h1.append(el('span', 'main', words.slice(0, at).join(' ')), el('span', 'sub', words.slice(at).join(' ')));
    else h1.textContent = story.title;
    return h1;
  }

  function renderByline(story) {
    const byline = el('div', 'byline');
    for (const credit of [story.author, story.artist, story.translator]) {
      if (credit) byline.append(appendText(el('p'), credit));
    }
    return byline;
  }

  // The cover art as preloaded by index.html (AVIF, a tenth the weight of the
  // original, which is the fallback), and a tiny copy of it, shown blurred
  // until the art arrives. Both are made from one picture (data-cover on the
  // preload); if the story's cover-image is another, it is shown as it is.
  const coverArt = document.getElementById('coverArt');
  const COVER_PLACEHOLDER = 'data:image/webp;base64,UklGRvwAAABXRUJQVlA4IPAAAAAwBgCdASoYAB0APtFYpU0oJSOiMBgIAQAaCUAAomfd5/NBfIbRO/ZyuosF6gw/uPb3NxuJL+PMT3YAAP7HJkPVWggLdsEujblfXAS7EArmZ0Qr3akN9VdT10sNRJq/SG9ZdrYigeQEvm4RfvWi8EvwPbRGQaKd5vYYuTtD6MUXZZgnAz1vKWFOtOAu1hwaZ7FBSVW5QHxS76FH8HNL3KdY+JlbQV+IdRHFZfHznZ1paPwUxJgUHqUd7nXeHWXvMHG1udfBP/Cu5Bmkffo0HcLubhfMnGqOFH6GxQENKpae2/qkKmhjfvVckNA1QSyAAAA=';

  // Page 0 is the closed book: its front board, a printed case, the cover art
  // bleeding off every edge with the title set in the open, light gable above
  // Frog and Toad's heads. It is drawn in the right-hand page's place but
  // board-sized, reaching out over the boards' overhang (see .cover-front).
  let coverArtIn = false;

  function renderCover(story) {
    const front = el('div', 'cover-front');
    const image = story.pages[0].image;
    const made = coverArt && coverArt.dataset.cover === image;
    const picture = el('picture');
    if (made) {
      const avif = el('source');
      Object.assign(avif, { type: 'image/avif', srcset: coverArt.imageSrcset, sizes: coverArt.imageSizes });
      picture.append(avif);
    }
    const img = el('img', 'art');
    img.alt = '';
    img.draggable = false;
    img.fetchPriority = 'high';
    img.src = image;
    picture.append(img);
    // The placeholder sits under the art and goes once the art is in. Once it
    // has arrived anywhere, every later copy (the leaf lifting the cover
    // clones one, and clones never hear the image's load event) starts
    // without the placeholder.
    const ready = () => { coverArtIn = true; front.classList.add('art-ready'); };
    if (coverArtIn || (img.complete && img.naturalWidth)) ready(); else img.addEventListener('load', ready, { once: true });
    if (made) {
      const placeholder = el('img', 'art placeholder');
      placeholder.src = COVER_PLACEHOLDER;
      placeholder.alt = '';
      front.append(placeholder);
    }
    front.append(picture, renderTitle(story), renderByline(story));
    return front;
  }

  // The inside of the front board: turned-in cloth, with page i (if any) as
  // the first left-hand page and the edges of the pages beneath it, laid out
  // like the left half of the open book so it lands exactly where those are
  // drawn (and nothing appears when the closed book gives way to the open one).
  function renderInside(i) {
    const inside = el('div', 'cover-inside');
    const page = el('div', 'page left');
    fill(page, i);
    if (i != null) inside.append(el('div', 'page-block'));
    inside.append(page);
    return inside;
  }

  function renderPage(story, index, { measuring = false } = {}) {
    const page = story.pages[index];
    if (page?.kind === 'cover') return renderCover(story);
    const root = el('div', 'page-content');

    if (!page || page.kind === 'blank') { root.classList.add('blank'); return root; }

    if (page.kind === 'chapter') {
      root.classList.add('chapter');
      const chapters = story.pages.filter(p => p.kind === 'chapter');
      if (chapters.length > 1) root.append(el('div', 'kicker', t('chapter', { n: chapters.indexOf(page) + 1 })));
      root.append(el('h2', null, page.chapter), ornament());
      for (const b of page.blocks) root.append(b.type === 'image' ? renderImage(b, measuring) : renderParagraph(b));
      return root;
    }

    if (page.kind === 'contents') {
      root.classList.add('contents');
      root.append(el('h2', null, t('contents')));
      const ol = el('ol');
      story.pages.forEach((p, i) => {
        if (p.kind !== 'chapter') return;
        const li = el('li');
        li.append(el('span', 'name', p.chapter), el('span', 'dots'), el('span', 'num', String(i)));
        li.dataset.goto = i;
        ol.append(li);
      });
      root.append(ol);
      return root;
    }

    const hasText = page.blocks.some(b => b.type === 'text');
    const hasImg = page.blocks.some(b => b.type === 'image');
    if (hasText) root.classList.add('has-text');
    if (hasImg && !hasText) root.classList.add('image-only');
    if (hasImg && hasText) root.classList.add('mixed');
    if (page.center) root.classList.add('center');
    for (const b of page.blocks) root.append(b.type === 'image' ? renderImage(b, measuring) : renderParagraph(b));
    return root;
  }

  /* ---------------- Uniform type size ---------------- */

  // A real book uses one type size throughout, so find the largest scale (<= 1)
  // at which every text page fits and apply it to the whole book.
  let measureEl = null;

  function computeScale() {
    if (!measureEl) {
      measureEl = el('div', 'page right measure');
      measureEl.setAttribute('aria-hidden', 'true');
      book.append(measureEl);
    }
    let scale = 1;
    const tooLong = [];
    for (let i = 0; i < story.pages.length; i++) {
      const pg = story.pages[i];
      if (pg.kind !== 'page' || !pg.blocks.some(b => b.type === 'text')) continue;
      measureEl.replaceChildren(renderPage(story, i, { measuring: true }));
      const c = measureEl.firstChild;
      const overflows = () => c.scrollHeight > c.clientHeight + 1;
      c.style.setProperty('--fs-scale', scale);
      while (overflows() && scale > 0.6) {
        scale = Math.round((scale - 0.02) * 100) / 100;
        c.style.setProperty('--fs-scale', scale);
      }
      if (overflows()) tooLong.push(i);
    }
    measureEl.replaceChildren();
    if (tooLong.length) console.warn('Storybook: too much text to fit on page(s) ' + tooLong.join(', ') + '. Consider splitting them.');
    return scale;
  }

  let fsScale = 0;
  function refit() {
    const scale = computeScale();
    if (scale !== fsScale) {
      fsScale = scale;
      book.style.setProperty('--fs-scale', scale);
      render();
    }
  }

  /* ---------------- Reader state ---------------- */

  const story = parseStory(window.STORY || '');
  const N = story.pages.length;
  const book = document.getElementById('book');
  const pageL = document.getElementById('pageL');
  const pageR = document.getElementById('pageR');
  const status = document.getElementById('status');
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  const desk = book.parentElement;

  document.title = story.title;
  btnPrev.setAttribute('aria-label', t('previous'));
  btnPrev.title = t('previous') + ' (←)';
  btnNext.setAttribute('aria-label', t('next'));
  btnNext.title = t('next') + ' (→)';

  let mode = 'spread';    // 'single' | 'spread'
  let cur = 0;            // single: the page shown. spread: the right-hand page (always even).
                          // 0 is the closed book, showing its front cover.

  // The front cover opens straight onto the story's first page: the contents
  // and chapter title before it are left out of the reading order. Pages keep
  // their numbers, so #pN links still mean the same page.
  const FIRST = Math.max(1, story.pages.findIndex((p, i) => i > 0 && p.kind === 'page'));
  const skipped = i => i > 0 && i < FIRST;

  const clamp = i => Math.max(0, Math.min(N - 1, i));
  const spreadRight = i => 2 * Math.ceil(i / 2);
  // The first page showing (the left-hand one of a spread); 0 for the cover.
  const shownPage = () => (mode === 'spread' ? Math.max(0, cur - 1) : cur);
  const isShowing = i => i === cur || (mode === 'spread' && i === cur - 1);

  // A page already showing is left alone, so the page turner can redraw the
  // book as often as it likes without remaking pictures that are on screen.
  // (index null: an empty page.)
  function fill(container, index) {
    const key = `${index} ${mode} ${fsScale}`;
    if (container.dataset.shows === key) return;
    container.dataset.shows = key;
    if (index == null) return container.replaceChildren();
    const page = story.pages[index];
    container.replaceChildren(renderPage(story, index));
    const numbered = page && index > 0 && !['blank', 'chapter', 'contents'].includes(page.kind);
    if (numbered) container.append(el('div', 'folio', String(index)));
  }

  // The book as it lies under a turning leaf between openings lo and hi: the
  // left page of lo and the right page of hi (on one page, hi). draw(o, o) is
  // opening o at rest. Opening 0 is the closed book: its cover is its
  // right-hand page, and it has no left-hand one (that half of the boards and
  // pages is hidden, see .book.closed). How open the book is, --open, is 0 or 1
  // at rest and follows the cover as it turns (see onProgress below); the
  // book's slide, the status line and the arrows follow it.
  function draw(lo, hi) {
    book.classList.toggle('closed', lo === 0);
    if (lo === hi) desk.style.setProperty('--open', lo === 0 ? 0 : 1);
    if (mode === 'spread') fill(pageL, lo ? lo - 1 : null);
    fill(pageR, hi);
  }

  // Redraw the book where it is, finishing any turn.
  function render() {
    turner.show(cur);
    updateChrome();
    prefetchNeighbours();
  }

  // languages.js lists every edition; a menu in the status line switches
  // between them, staying on the page being read.
  const editions = window.EDITIONS || [];
  let langMenu = null;
  if (editions.length > 1) {
    langMenu = el('select', 'lang');
    langMenu.setAttribute('aria-label', t('language'));
    langMenu.title = t('language');
    for (const e of editions) {
      const o = el('option', null, e.name);
      o.value = e.href;
      o.lang = e.lang;
      o.selected = e.lang === LANG;
      langMenu.append(o);
    }
    langMenu.addEventListener('change', () => {
      const page = shownPage();
      location.href = langMenu.value + (page ? '#p' + page : '');
    });
    // Coming Back to this page: show its own language again.
    window.addEventListener('pageshow', () => { for (const o of langMenu.options) o.selected = o.lang === LANG; });
  }

  // Three parts across the width of the book: About, Contact and the language
  // menu at its left edge, the title centred, the page counter at its right
  // edge.
  function updateChrome() {
    btnPrev.disabled = neighbour(cur, -1) == null;
    btnNext.disabled = neighbour(cur, 1) == null;
    let where;
    if (mode === 'spread') {
      const l = cur - 1, r = cur;
      const lOk = l >= 1, rOk = r >= 1 && r < N;
      where = lOk && rOk ? t('pages', { from: l, to: r }) : lOk ? t('page', { n: l }) : rOk ? t('page', { n: r }) : t('cover');
    } else {
      where = cur === 0 ? t('cover') : t('page', { n: cur });
    }
    // The address bar isn't rewritten as the reader turns pages, so copying
    // the URL shares the book from the cover, not wherever they stopped. A
    // "#p7" link stays in the URL only while page 7 is showing.
    const linked = location.hash.match(/^#p(\d+)$/);
    if (linked && !isShowing(+linked[1])) history.replaceState(null, '', location.pathname + location.search);
    if (status.querySelector('.jump')) return;    // don't clobber a page number being typed
    const whereBtn = el('button', 'where', t('whereOfTotal', { where, total: N - 1 }));
    whereBtn.type = 'button';
    whereBtn.title = t('jumpHint');
    whereBtn.addEventListener('click', openJump);
    const links = el('span', 'links');
    const about = el('a', null, t('about'));
    about.href = 'about.html';
    const contact = el('a', null, t('contact'));
    contact.href = 'contact.html';
    links.append(about, el('span', 'sep', '·'), contact);
    if (langMenu) links.append(el('span', 'sep', '·'), langMenu);
    status.replaceChildren(links, el('span', 'title', story.title), whereBtn);
    fitStatus();
  }

  // On a narrow spread the title would run into the parts beside it, so it
  // goes (as it does on one page); on a narrow phone, the page counter goes
  // under the links.
  function fitStatus() {
    const title = status.querySelector('.title');
    if (!title) return;
    const sides = [...status.children].filter(c => c !== title).map(c => c.getBoundingClientRect().width);
    const gap = parseFloat(getComputedStyle(status).columnGap) || 0;
    if (mode === 'spread') {
      // Measured shown: hidden, it has no width, and would seem to fit.
      status.classList.remove('no-title');
      const text = document.createRange();
      text.selectNodeContents(title);
      // (Measured against the open book: shut, the title isn't shown.)
      status.classList.toggle('no-title', text.getBoundingClientRect().width + 2 * (Math.max(...sides) + gap) > book.offsetWidth);
      status.classList.remove('stacked');
    } else {
      status.classList.toggle('stacked', sides[0] + sides[1] + 2 * gap > book.offsetWidth);
    }
  }

  function openJump() {
    const whereBtn = status.querySelector('.where');
    if (!whereBtn) return;
    const form = el('form', 'jump');
    const input = el('input');
    Object.assign(input, { type: 'number', inputMode: 'numeric', min: 0, max: N - 1 });
    input.value = mode === 'spread' ? Math.max(0, cur - 1) : cur;
    input.setAttribute('aria-label', t('jumpLabel', { total: N - 1 }));
    form.append(t('jumpBefore'), input, t('jumpAfter', { total: N - 1 }));
    let closed = false;
    const close = (target) => {
      if (closed) return;
      closed = true;
      form.remove();
      if (Number.isFinite(target)) goTo(target); else updateChrome();
    };
    form.addEventListener('submit', (e) => { e.preventDefault(); close(parseInt(input.value, 10)); });
    input.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.preventDefault(); close(); } });
    input.addEventListener('blur', () => close());
    whereBtn.replaceWith(form);
    input.focus();
    input.select();
  }

  // Fetch the pictures on the openings either side in the background so
  // they are already cached when the page turns.
  const prefetched = new Set();
  function prefetchNeighbours() {
    const next = cur === 0 ? FIRST : cur + 1;
    const around = mode === 'spread' ? [next, next + 1, cur - 3, cur - 2] : [next, cur - 1];
    for (const i of around) {
      for (const b of story.pages[i]?.blocks || []) {
        if (b.type !== 'image' || prefetched.has(b.src)) continue;
        prefetched.add(b.src);
        new Image().src = b.src;
      }
    }
  }

  // Tell Vercel Web Analytics how far readers get: one "Reached page" event
  // for every fifth page and for the last page, each sent once per visit.
  // A jump or deep link past several milestones counts all of them, so each
  // number reads as "got at least this far".
  let furthest = 0;
  function trackProgress() {
    const now = Math.min(cur, N - 1);
    for (let i = furthest + 1; i <= now; i++) {
      if (i % 5 && i !== N - 1) continue;
      window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
      window.va('event', { name: 'Reached page', data: { page: i, source: SOURCE } });
    }
    furthest = Math.max(furthest, now);
  }

  // The opening after (dir 1) or before (-1) opening o, or null at the ends.
  // Paging back from the first page of the story shuts the book.
  function neighbour(o, dir) {
    const step = mode === 'spread' ? 2 : 1;
    if (dir > 0) {
      if (o === 0) return mode === 'spread' ? spreadRight(FIRST) : FIRST;
      return o + 1 < N ? o + step : null;
    }
    if (o === 0) return null;
    return skipped(o - step) || o - step <= 0 ? 0 : o - step;
  }

  // A link or jump to a page left out of the reading order lands on the first
  // page of the story.
  function goTo(i) {
    i = clamp(i);
    if (skipped(i)) i = FIRST;
    turner.go(mode === 'spread' ? spreadRight(i) : i);
  }

  const turn = (dir, opts) => turner.turn(dir, opts);

  // How far the boards reach beyond the pages (custom properties in
  // reader.css): the front board turns as one stiff, board-sized leaf.
  function boardOverhang() {
    const cs = getComputedStyle(book);
    const px = name => parseFloat(cs.getPropertyValue(name)) || 0;
    return { top: px('--board-top'), right: px('--board-side'), bottom: px('--board-bottom'), left: mode === 'spread' ? 0 : px('--board-spine') };
  }

  const turner = createPageTurner(book, {
    // No gloss: a page lifting toward the light would brighten, which reads
    // as a flash when the pointer merely lifts a page's edge.
    gloss: 0,
    mode: () => mode,
    neighbour,
    render: draw,
    faces(lo, hi) {
      // Opening and shutting the book turns its front board.
      if (lo === 0) {
        // The leaf is the boards' full size, so it lands exactly on the open
        // book's left board; its front, the cover, is set in from the edges
        // as it is shut (see .cover-lift).
        const front = el('div', 'cover-lift');
        front.append(renderPage(story, 0));
        return { hard: true, outset: boardOverhang(), front, back: renderInside(mode === 'spread' ? hi - 1 : null) };
      }
      const front = el('div', 'page right'), back = el('div', 'page left');
      fill(front, lo);
      if (mode === 'spread') fill(back, hi - 1);
      // On one page the back of the sheet is blank, the print showing through.
      return { front, back, through: mode === 'spread' ? 0 : 0.07 };
    },
    // The book only starts sliding once the cover is properly turning: lifting
    // a corner (a hover peek at either end) leaves it where it is.
    onProgress(p, { lo }) {
      if (lo !== 0) return;
      const k = Math.min(1, Math.max(0, (p - 0.1) / 0.8));
      desk.style.setProperty('--open', (k * k * (3 - 2 * k)).toFixed(4));
    },
    onChange(o) {
      cur = o;
      updateChrome();
      prefetchNeighbours();
      trackProgress();
    },
    onLand(o, { instant }) {
      // Without motion, the new page's ink comes up quickly instead.
      if (!instant) return;
      for (const c of book.querySelectorAll(':scope > .page > .page-content')) {
        c.animate?.([{ opacity: 0.2 }, { opacity: 1 }], { duration: 180, easing: 'ease-out' });
      }
    },
  });

  /* ---------------- Layout ---------------- */

  function layout(again = false) {
    const vw = window.innerWidth, vh = window.innerHeight;
    const statusH = status.offsetHeight;
    // The page as large as the window allows, on one page and on two; two
    // only if their pages are at least as large, so the page never shrinks as
    // the window widens.
    let w, newMode;
    if (vw <= 560) {
      // Phone: the page is as wide as the screen allows, less thin boards and a
      // little breathing room (these match the max-width: 560px rules in
      // reader.css), so the type can be as large as possible; and no taller
      // than the room the desk actually has, measured, less its padding (which
      // includes the iPhone's safe area at the bottom), the boards and the
      // status line, so nothing ever has to scroll.
      newMode = 'single';
      const px = (cs, name) => parseFloat(cs.getPropertyValue(name)) || 0;
      const d = getComputedStyle(desk), root = getComputedStyle(document.documentElement);
      const room = Math.min(vh, desk.clientHeight) - px(d, 'padding-top') - px(d, 'padding-bottom')
        - px(root, '--board-top') - px(root, '--board-bottom')
        - statusH - px(getComputedStyle(status), 'margin-top') - 2;
      w = Math.min(vw - 16, room * 0.75);
    } else {
      // Room for both arrows: on one page they're narrow pills close in (26px
      // wide, 10px from the window's edge, 8px clear of the boards' 15px
      // overhang; see .desk:has(.book.single) .nav in reader.css); beside a
      // spread, 46px rounds 34px out from the pages and at least 16px from
      // the window's edge.
      const availH = vh - 100;          // boards, status line and breathing room
      const one = Math.min(vw - 2 * (26 + 10 + 8 + 15), availH * 0.75);
      const two = Math.min((vw - 2 * (46 + 34 + 16)) / 2, availH * 0.75);
      newMode = two >= one ? 'spread' : 'single';
      w = newMode === 'spread' ? two : one;
    }
    // A leaf is sized for the old layout; if that changes, finish the turn.
    if (turner.busy && (newMode !== mode || Math.floor(w) !== pageR.offsetWidth)) turner.finish();
    document.documentElement.style.setProperty('--page-w', Math.floor(w) + 'px');
    document.documentElement.style.setProperty('--page-h', Math.floor(w * 4 / 3) + 'px');

    if (newMode !== mode) {
      const shown = shownPage();
      mode = newMode;
      book.classList.toggle('spread', mode === 'spread');
      book.classList.toggle('single', mode === 'single');
      cur = mode === 'spread' ? spreadRight(shown) : shown;
    }
    fsScale = 0;
    refit();
    fitStatus();
    // The page's height on a phone allowed for the status line as it was; if
    // fitting it has since changed its height (one line or two), size again.
    if (vw <= 560 && !again && status.offsetHeight !== statusH) layout(true);
  }

  /* ---------------- Input ---------------- */

  // Readers can select and copy the text, so a click that starts, extends,
  // or clears a selection must not turn the page.
  const hasSelection = () => {
    const sel = window.getSelection();
    return !!sel && !sel.isCollapsed && sel.toString().length > 0;
  };
  let hadSelection = false;

  book.addEventListener('click', (e) => {
    const li = e.target.closest('[data-goto]');
    if (li) { goTo(+li.dataset.goto); return; }
    if (e.target.closest('a[href]')) return;
    if (hasSelection() || hadSelection) { hadSelection = false; return; }
    const r = book.getBoundingClientRect();
    turn(e.clientX - r.left < r.width / 2 ? -1 : 1);
  });
  btnPrev.addEventListener('click', () => turn(-1));
  btnNext.addEventListener('click', () => turn(1));

  // Full screen, where the browser allows it (not on iPhone Safari).
  const btnFull = document.getElementById('btnFull');
  const labelFull = (on) => {
    btnFull.setAttribute('aria-label', t(on ? 'exitFullscreen' : 'fullscreen'));
    btnFull.title = t(on ? 'exitFullscreen' : 'fullscreen') + ' (F)';
  };
  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen?.().catch(() => {});
  };
  labelFull(false);
  if (document.fullscreenEnabled) {
    btnFull.hidden = false;
    btnFull.addEventListener('click', toggleFullscreen);
    document.addEventListener('fullscreenchange', () => {
      const on = !!document.fullscreenElement;
      btnFull.classList.toggle('on', on);
      labelFull(on);
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.target.closest && e.target.closest('input, select, textarea')) return;   // typing a page number, choosing a language
    const onControl = e.target.closest && e.target.closest('button, a[href]');
    switch (e.key) {
      case 'g': case 'G': e.preventDefault(); openJump(); break;
      case 'f': case 'F': if (document.fullscreenEnabled) { e.preventDefault(); toggleFullscreen(); } break;
      case 'Enter': if (onControl) break;   // else, as →
      // falls through
      case 'ArrowRight': case 'ArrowDown': case 'PageDown': case ' ': e.preventDefault(); turn(1, { repeat: e.repeat }); break;
      case 'Backspace':
      case 'ArrowLeft': case 'ArrowUp': case 'PageUp': e.preventDefault(); turn(-1, { repeat: e.repeat }); break;
      case 'Home': goTo(0); break;
      case 'End': goTo(N - 1); break;
    }
  });

  // Swipes and drags are the page turner's.
  book.addEventListener('pointerdown', () => { hadSelection = hasSelection(); });

  window.addEventListener('resize', () => layout());
  window.visualViewport?.addEventListener('resize', () => layout());
  window.addEventListener('hashchange', () => {
    const m = location.hash.match(/^#p(\d+)$/);
    if (m) goTo(+m[1]);
  });

  // The web font is wider than the fallback, so re-measure once it arrives.
  document.fonts?.ready.then(refit);
  document.fonts?.addEventListener('loadingdone', () => layout());

  /* ---------------- Start ---------------- */

  // A bare URL always opens on the cover; "#p7" opens page 7 (or, for a page
  // left out of the reading order, the first page of the story).
  const hash = location.hash.match(/^#p(\d+)$/);
  cur = clamp(hash ? +hash[1] : 0);
  if (skipped(cur)) cur = FIRST;
  mode = '';
  // Under the closed cover: the edges of the pages and the book's shadow on the
  // desk. It fades as the cover lifts (see .cover-edge).
  const coverEdge = el('div', 'cover-edge');
  coverEdge.setAttribute('aria-hidden', 'true');
  book.append(coverEdge);
  layout();
  trackProgress();
  // Show the book once its font has arrived, so it never appears set in the
  // fallback and then reflows; if the font is slow, show it anyway.
  Promise.race([
    Promise.all(['1em', 'italic 1em', '600 1em'].map(f => document.fonts?.load(`${f} 'Fraunces'`))),
    new Promise(r => setTimeout(r, 2000)),
  ]).catch(() => {}).then(() => {
    layout();
    desk.classList.add('drawn');
  });
})();
