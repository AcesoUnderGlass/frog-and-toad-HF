/* The plain edition (simple.html): the whole story down one sheet, with no
   book, cover or page turns, in any language in languages.js (window.EDITIONS):
   ?lang=de shows the German, none the English. The edition's story file is
   loaded here, and read in the same format as the reader (see "Writing the
   story" in README.md), but pages run on into each other, and contents and
   blank pages are left out. Under the title, the language menu and the
   "Simplified" box as under the book; unticking the box opens the book. */
(function () {
  'use strict';

  const IMAGE_SIZES = window.IMAGE_SIZES || {};
  const EDITIONS = window.EDITIONS || [];
  const ENGLISH = EDITIONS.find(e => e.lang === 'en') || { lang: 'en', name: 'English', href: 'index.html', story: 'story.js' };
  const wanted = new URLSearchParams(location.search).get('lang');
  const edition = EDITIONS.find(e => e.lang === wanted) || ENGLISH;

  // Load an edition's story file (window.STORY and STORY_UI), then show it.
  // An edition that fails to load falls back to the English.
  function load(e, onFail) {
    const script = document.createElement('script');
    script.src = e.story;
    script.onload = () => show(e);
    script.onerror = onFail;
    document.head.append(script);
  }
  load(edition, () => (edition === ENGLISH ? show(ENGLISH) : load(ENGLISH, () => show(ENGLISH))));

  function show(e) {
    document.documentElement.lang = e.lang;
    const UI = Object.assign({
      chapter: 'Chapter {n}',
      illustration: 'Illustration',
      missing: 'Missing illustration: {src}',
      language: 'Language',
      simplified: 'Simplified',
      book: 'Read it as a book',
    }, window.STORY_UI);

    function t(key, vars) {
      return UI[key].replace(/\{(\w+)\}/g, (m, name) => (vars && name in vars ? vars[name] : m));
    }

    /* ---------------- Parsing (as in reader.js) ---------------- */

    const KEY_RE = /^(image|alt|caption|chapter)\s*:\s*(.*)$/i;
    const FLAG_RE = /^(contents|blank|center)\s*$/i;
    const LANG = e.lang;
    const QUOTES = { de: ['„', '“', '‚', '’'], sk: ['„', '“', '‚', '’'], cs: ['„', '“', '‚', '‘'], ru: ['«', '»', '„', '“'] }[LANG.slice(0, 2)] || ['“', '”', '‘', '’'];

    function smartQuotes(s) {
      return s
        .replace(/(^|[\s(\[{—-])"/g, '$1' + QUOTES[0]).replace(/"/g, QUOTES[1])
        .replace(/(^|[\s(\[{—-])'/g, '$1' + QUOTES[2]).replace(/'/g, QUOTES[3])
        .replace(/\.\.\./g, '…')
        .replace(/\b(Mr|Mrs|Ms|Dr)\. /g, '$1. ');
    }

    function parseStory(src) {
      const story = { title: 'Untitled', author: '', artist: '', translator: '', pages: [] };
      const sections = String(src).replace(/\r\n?/g, '\n').split(/^[ \t]*-{3,}[ \t]*$/m);

      for (const line of sections.shift().split('\n')) {
        const m = line.match(/^\s*([\w-]+)\s*:\s*(.*)$/);
        if (m) story[m[1].toLowerCase().replace('-', '')] = m[2].trim();
      }

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
        story.pages.push(page);
      }

      return story;
    }

    /* ---------------- Rendering ---------------- */

    function el(tag, cls, text) {
      const e = document.createElement(tag);
      if (cls) e.className = cls;
      if (text != null) e.textContent = text;
      return e;
    }

    // "[text](url)" becomes a link: http(s), mailto and the site's own .html
    // pages only, as in the reader.
    const LINK_RE = /\[((?:[^\[\]]|\[[^\[\]]*\])+)\]\((https?:\/\/[^\s()]+|mailto:[^\s()]+|[^\s()]+\.html)\)/g;

    function appendText(parent, text) {
      LINK_RE.lastIndex = 0;
      let last = 0, m;
      while ((m = LINK_RE.exec(text))) {
        if (m.index > last) parent.append(text.slice(last, m.index));
        const a = el('a', null, m[1]);
        a.href = m[2];
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        parent.append(a);
        last = LINK_RE.lastIndex;
      }
      if (last < text.length) parent.append(text.slice(last));
      return parent;
    }

    function renderImage(block, eager) {
      const fig = el('figure');
      const img = el('img');
      const dims = IMAGE_SIZES[block.src];
      if (dims) { img.width = dims[0]; img.height = dims[1]; }
      if (!eager) img.loading = 'lazy';
      img.decoding = 'async';
      img.alt = block.alt || block.caption || t('illustration');
      img.addEventListener('error', () => img.replaceWith(el('div', 'missing', t('missing', { src: block.src }))));
      img.src = block.src;
      fig.append(img);
      if (block.caption) fig.append(appendText(el('figcaption'), block.caption));
      return fig;
    }

    const story = parseStory(window.STORY || '');
    const root = document.getElementById('story');
    root.textContent = '';
    if (story.title !== 'Untitled') document.title = story.title;

    // The language menu and the "Simplified" box (ticked: this is the plain
    // edition; unticked, the book of the same language opens).
    const controls = el('div', 'controls');
    if (EDITIONS.length > 1) {
      const langMenu = el('select', 'lang');
      langMenu.setAttribute('aria-label', t('language'));
      langMenu.title = t('language');
      for (const ed of EDITIONS) {
        const o = el('option', null, ed.name);
        o.value = ed.lang;
        o.lang = ed.lang;
        o.selected = ed.lang === e.lang;
        langMenu.append(o);
      }
      langMenu.addEventListener('change', () => { location.href = 'simple.html?lang=' + encodeURIComponent(langMenu.value); });
      window.addEventListener('pageshow', () => { for (const o of langMenu.options) o.selected = o.lang === e.lang; });
      controls.append(langMenu, el('span', 'sep', '·'));
    }
    const simpleBox = el('label', 'simple');
    const box = el('input');
    box.type = 'checkbox';
    box.checked = true;
    simpleBox.append(box, ' ' + t('simplified'));
    box.addEventListener('change', () => { if (!box.checked) location.href = e.href; });
    window.addEventListener('pageshow', () => { box.checked = true; });
    controls.append(simpleBox);
    root.append(controls);

    const byline = el('div', 'byline');
    for (const credit of [story.author, story.artist, story.translator]) {
      if (credit) byline.append(appendText(el('p'), credit));
    }
    root.append(el('h1', null, story.title), byline);
    const cover = story.coverimage || story.cover;
    if (cover) root.append(renderImage({ src: cover, alt: '' }, true));

    const chapters = story.pages.filter(p => p.kind === 'chapter');
    for (const page of story.pages) {
      if (page.kind === 'contents' || page.kind === 'blank') continue;
      let into = root;
      if (page.kind === 'chapter') {
        const head = el('header', 'chapter');
        if (chapters.length > 1) head.append(el('div', 'kicker', t('chapter', { n: chapters.indexOf(page) + 1 })));
        head.append(el('h2', null, page.chapter));
        root.append(head);
      } else if (page.center) {
        into = el('div', 'center');
        root.append(into);
      }
      for (const b of page.blocks) into.append(b.type === 'image' ? renderImage(b) : appendText(el('p'), b.text));
    }

    const back = el('p', 'back');
    const a = el('a', null, '\u2039 ' + t('book'));
    a.href = e.href;
    back.append(a);
    root.append(back);

    const copyright = el('p', 'copyright', '\u00a9 2026 Elizabeth Van Nostrand \u00b7 ');
    const lic = el('a', null, 'CC BY-NC-ND 4.0');
    lic.href = 'https://creativecommons.org/licenses/by-nc-nd/4.0/';
    lic.rel = 'license';
    copyright.append(lic);
    root.append(copyright);
  }
})();
