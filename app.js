/* Storybook reader.  Story text comes from story.js (window.STORY). */
(function () {
  'use strict';

  /* ---------------- Parsing ---------------- */

  const KEY_RE = /^(image|alt|caption|chapter)\s*:\s*(.*)$/i;
  const FLAG_RE = /^(contents|blank|center)\s*$/i;

  function smartQuotes(s) {
    return s
      .replace(/(^|[\s(\[{—-])"/g, '$1“').replace(/"/g, '”')
      .replace(/(^|[\s(\[{—-])'/g, '$1‘').replace(/'/g, '’');
  }

  function parseStory(src) {
    const story = { title: 'Untitled', author: '', cover: '', pages: [] };
    const sections = String(src).replace(/\r\n?/g, '\n').split(/^[ \t]*-{3,}[ \t]*$/m);

    // Front matter: "key: value" lines before the first ---
    for (const line of sections.shift().split('\n')) {
      const m = line.match(/^\s*([\w-]+)\s*:\s*(.*)$/);
      if (m) story[m[1].toLowerCase().replace('-', '')] = m[2].trim();
    }
    story.pages.push({ kind: 'cover', title: story.title, author: story.author, image: story.coverimage || story.cover || '' });

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
      const empty = page.kind === 'page' && !page.blocks.length;
      if (!empty) story.pages.push(page);
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

  function renderImage(block) {
    const fig = el('figure');
    const img = el('img');
    img.src = block.src;
    img.alt = block.alt || block.caption || 'Illustration';
    img.draggable = false;
    img.addEventListener('error', () => {
      fig.replaceChild(el('div', 'missing', 'Missing illustration: ' + block.src), img);
    });
    fig.appendChild(img);
    if (block.caption) fig.appendChild(el('figcaption', null, block.caption));
    return fig;
  }

  function renderPage(story, index) {
    const page = story.pages[index];
    const root = el('div', 'page-content');
    if (!page || page.kind === 'blank') { root.classList.add('blank'); return root; }

    if (page.kind === 'cover') {
      root.classList.add('cover');
      if (page.image) root.appendChild(renderImage({ src: page.image, alt: page.title }));
      root.appendChild(el('h1', 'title', page.title));
      root.appendChild(el('hr', 'rule'));
      if (page.author) root.appendChild(el('p', 'author', page.author));
      return root;
    }

    if (page.kind === 'chapter') {
      root.classList.add('chapter');
      const chapters = story.pages.filter(p => p.kind === 'chapter');
      const n = chapters.indexOf(page) + 1;
      if (chapters.length > 1) root.appendChild(el('div', 'kicker', 'Chapter ' + n));
      root.appendChild(el('h2', null, page.chapter));
      root.appendChild(el('hr', 'rule'));
      for (const b of page.blocks) root.appendChild(b.type === 'image' ? renderImage(b) : el('p', null, b.text));
      return root;
    }

    if (page.kind === 'contents') {
      root.classList.add('contents');
      root.appendChild(el('h2', null, 'Contents'));
      const ol = el('ol');
      story.pages.forEach((p, i) => {
        if (p.kind !== 'chapter') return;
        const li = el('li');
        li.appendChild(el('span', 'name', p.chapter));
        li.appendChild(el('span', 'dots'));
        li.appendChild(el('span', 'num', String(i)));
        li.dataset.goto = i;
        ol.appendChild(li);
      });
      root.appendChild(ol);
      return root;
    }

    // ordinary page
    const hasText = page.blocks.some(b => b.type === 'text');
    const hasImg = page.blocks.some(b => b.type === 'image');
    if (hasText) root.classList.add('has-text');
    if (hasImg && !hasText) root.classList.add('image-only');
    if (page.center) root.classList.add('center');
    for (const b of page.blocks) root.appendChild(b.type === 'image' ? renderImage(b) : el('p', null, b.text));
    return root;
  }

  // Shrink the font a little if the page overflows, so text never gets cut off.
  function fitText(content) {
    if (!content || !content.classList.contains('has-text')) return;
    let size = 1;
    content.style.fontSize = '';
    while (content.scrollHeight > content.clientHeight + 1 && size > 0.55) {
      size -= 0.04;
      content.style.fontSize = size.toFixed(2) + 'em';
    }
  }

  function fill(container, story, index) {
    container.replaceChildren();
    const content = renderPage(story, index);
    container.appendChild(content);
    const page = story.pages[index];
    if (page && index > 0 && page.kind !== 'blank' && page.kind !== 'chapter' && page.kind !== 'contents') {
      container.appendChild(el('div', 'page-number', String(index)));
    }
    fitText(content);
    return content;
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
  const storageKey = 'storybook:' + story.title;

  document.title = story.title;

  let mode = 'single';    // 'single' | 'spread'
  let cur = 0;            // single: the page shown.  spread: the RIGHT page (always even; left is cur-1)
  let turning = false;

  function clamp(i) { return Math.max(0, Math.min(N - 1, i)); }
  function spreadRight(i) { return 2 * Math.ceil(i / 2); }

  function canNext() { return mode === 'spread' ? cur + 1 < N : cur + 1 < N; }
  function canPrev() { return mode === 'spread' ? cur >= 2 : cur >= 1; }

  function updateChrome() {
    btnPrev.disabled = !canPrev();
    btnNext.disabled = !canNext();
    let where;
    if (mode === 'spread') {
      const l = cur - 1, r = cur;
      const lOk = l >= 1, rOk = r >= 1 && r < N;
      where = lOk && rOk ? `Pages ${l}–${r}` : lOk ? `Page ${l}` : rOk ? `Page ${r}` : 'Cover';
    } else {
      where = cur === 0 ? 'Cover' : `Page ${cur}`;
    }
    status.replaceChildren(el('span', 'title', story.title), el('span', 'sep', '·'), el('span', null, `${where} of ${N - 1}`));
    try { localStorage.setItem(storageKey, String(mode === 'spread' ? Math.max(0, cur - 1) : cur)); } catch (e) {}
    history.replaceState(null, '', '#p' + (mode === 'spread' ? Math.max(0, cur - 1) : cur));
  }

  function render() {
    if (mode === 'spread') {
      fill(pageL, story, cur - 1);
      fill(pageR, story, cur);
    } else {
      fill(pageR, story, cur);
    }
    updateChrome();
  }

  function goTo(i) {
    i = clamp(i);
    cur = mode === 'spread' ? spreadRight(i) : i;
    render();
  }

  /* ---------------- Page turning ---------------- */

  function makeLeaf(dir, frontIdx, backIdx) {
    const leaf = el('div', 'leaf ' + dir);
    const front = el('div', 'face front');
    const back = el('div', 'face back');
    front.appendChild(renderPage(story, frontIdx));
    back.appendChild(renderPage(story, backIdx));
    front.appendChild(el('div', 'shade'));
    back.appendChild(el('div', 'shade'));
    leaf.append(front, back);
    return leaf;
  }

  function turn(dir) {
    if (turning) return;
    if (dir > 0 && !canNext()) return;
    if (dir < 0 && !canPrev()) return;
    turning = true;

    let leaf, after;
    if (mode === 'spread') {
      if (dir > 0) {
        leaf = makeLeaf('fwd', cur, cur + 1);
        fill(pageR, story, cur + 2);            // what is revealed underneath
        after = () => { cur += 2; };
      } else {
        leaf = makeLeaf('back', cur - 1, cur - 2);
        fill(pageL, story, cur - 3);
        after = () => { cur -= 2; };
      }
    } else {
      if (dir > 0) {
        leaf = makeLeaf('fwd', cur, cur + 1);
        fill(pageR, story, cur + 1);
        after = () => { cur += 1; };
      } else {
        leaf = makeLeaf('back', cur - 1, cur - 1);
        after = () => { cur -= 1; };
      }
    }
    book.appendChild(leaf);
    leaf.querySelectorAll('.page-content').forEach(fitText);

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      after();
      leaf.remove();
      turning = false;
      render();
    };
    leaf.addEventListener('transitionend', (e) => { if (e.target === leaf) finish(); });
    setTimeout(finish, 1400);                     // safety net if transitionend never fires
    // force layout so the transition runs from the starting transform
    void leaf.offsetWidth;
    requestAnimationFrame(() => leaf.classList.add('go'));
  }

  /* ---------------- Layout / sizing ---------------- */

  function layout() {
    const vw = window.innerWidth, vh = window.innerHeight;
    const narrow = vw < 700 || vw < vh * 1.05;
    const newMode = narrow ? 'single' : 'spread';
    const navW = vw <= 520 ? 0 : 108;
    const availW = vw - navW - 24;
    const availH = vh - 70;
    let w;
    if (newMode === 'spread') w = Math.min(availW / 2, availH * 0.75);
    else w = Math.min(availW, availH * 0.75);
    w = Math.floor(w);
    document.documentElement.style.setProperty('--page-w', w + 'px');
    document.documentElement.style.setProperty('--page-h', Math.floor(w * 4 / 3) + 'px');

    if (newMode !== mode) {
      const shown = mode === 'spread' ? Math.max(0, cur - 1) : cur;   // keep the reader on the same page
      mode = newMode;
      book.classList.toggle('spread', mode === 'spread');
      book.classList.toggle('single', mode === 'single');
      cur = mode === 'spread' ? spreadRight(shown) : shown;
    }
    render();
  }

  /* ---------------- Input ---------------- */

  book.addEventListener('click', (e) => {
    const li = e.target.closest('[data-goto]');
    if (li) { goTo(+li.dataset.goto); return; }
    const r = book.getBoundingClientRect();
    turn(e.clientX - r.left < r.width / 2 ? -1 : 1);
  });
  btnPrev.addEventListener('click', () => turn(-1));
  btnNext.addEventListener('click', () => turn(1));

  window.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    switch (e.key) {
      case 'ArrowRight': case 'ArrowDown': case 'PageDown': case ' ': case 'Enter': e.preventDefault(); turn(1); break;
      case 'ArrowLeft': case 'ArrowUp': case 'PageUp': case 'Backspace': e.preventDefault(); turn(-1); break;
      case 'Home': goTo(0); break;
      case 'End': goTo(N - 1); break;
    }
  });

  // swipe
  let sx = null, sy = null;
  book.addEventListener('pointerdown', (e) => { sx = e.clientX; sy = e.clientY; });
  book.addEventListener('pointerup', (e) => {
    if (sx == null) return;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    sx = sy = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      turn(dx < 0 ? 1 : -1);
      e.stopImmediatePropagation();
      suppressClick = true;
    }
  });
  let suppressClick = false;
  book.addEventListener('click', (e) => { if (suppressClick) { suppressClick = false; e.stopImmediatePropagation(); } }, true);

  window.addEventListener('resize', layout);
  window.addEventListener('hashchange', () => {
    const m = location.hash.match(/^#p(\d+)$/);
    if (m && !turning) goTo(+m[1]);
  });

  /* ---------------- Start ---------------- */

  let start = 0;
  const hash = location.hash.match(/^#p(\d+)$/);
  if (hash) start = +hash[1];
  else { try { start = +(localStorage.getItem(storageKey) || 0); } catch (e) {} }
  cur = clamp(start || 0);
  layout();
})();
