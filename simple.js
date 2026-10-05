/* The plain edition (simple.html): the whole story from story.js
   (window.STORY) down one sheet, with no book, cover or page turns. It reads
   the same format as the reader (see "Writing the story" in README.md), but
   pages run on into each other, and contents and blank pages are left out. */
(function () {
  'use strict';

  const IMAGE_SIZES = window.IMAGE_SIZES || {};
  const UI = Object.assign({
    chapter: 'Chapter {n}',
    illustration: 'Illustration',
    missing: 'Missing illustration: {src}',
  }, window.STORY_UI);

  function t(key, vars) {
    return UI[key].replace(/\{(\w+)\}/g, (m, name) => (vars && name in vars ? vars[name] : m));
  }

  /* ---------------- Parsing (as in reader.js) ---------------- */

  const KEY_RE = /^(image|alt|caption|chapter)\s*:\s*(.*)$/i;
  const FLAG_RE = /^(contents|blank|center)\s*$/i;
  const LANG = document.documentElement.lang || 'en';
  const QUOTES = { de: ['„', '“', '‚', '’'] }[LANG.slice(0, 2)] || ['“', '”', '‘', '’'];

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
  const a = el('a', null, '\u2039 Read it as a book');
  a.href = 'index.html';
  back.append(a);
  root.append(back);
})();
