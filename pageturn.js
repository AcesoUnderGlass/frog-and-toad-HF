// Page turns drawn with CSS 3D transforms: a leaf hinged at the spine, bowing
// as it lifts, shaded as it turns from the light, casting a shadow on the
// pages beneath. No dependencies; styles in pageturn.css. A plain script (not
// a module, so the book also opens straight from a file): it defines one
// global function, createPageTurner.
//
// The book is a sequence of "openings", numbered in reading order (what a
// number means is up to the caller). A turn moves a leaf between two of
// them, lo < hi: its position p runs from 0, lying on the right as part of
// lo, to 1, lying on the left as part of hi; turning back is the same motion
// run from 1 to 0. On one page at a time ('single' mode) the leaf is hinged
// at the left edge, swings away to the left and fades.
//
//   const turner = createPageTurner(bookEl, {
//     at: 0,                      // the opening shown to begin with
//     mode: () => 'spread',       // or 'single'
//     neighbour: (o, dir) => ..., // the opening after (dir 1) or before (-1) o, or null
//     render: (lo, hi) => ...,    // draw the book as it lies under a leaf between
//                                 // lo and hi: the left page of lo, the right page
//                                 // of hi (one page: hi). render(o, o) is o at rest.
//     faces: (lo, hi) => ({
//       front, back,              // elements for the leaf's two sides: the right
//                                 // page of lo, and the left page of hi
//       hard,                     // a board: one stiff piece rather than a bowing sheet
//       outset,                   // { top, right, bottom, left } px the leaf reaches
//                                 // beyond the page (a board's overhang)
//       through,                  // opacity at which the front shows through a blank back
//     }),
//     onChange: o => ...,         // the book is now heading for (or showing) o
//     onProgress: (p, { lo, hi }) => ...,   // every frame of a turn
//     onLand: (o, { instant }) => ...,      // come to rest (instant: no animation)
//   });
//   turner.turn(1);        // to the next opening (-1: the one before)
//   turner.go(12);         // to any opening, in one turn
//   turner.show(12);       // to any opening, without a turn (also redraws)
//   turner.finish();       // end a turn under way where it was heading
//   turner.busy;  turner.at;  turner.destroy();
//
// The book element should be position: relative, a page high and one or two
// pages wide. The faces are cloned (once per segment of the leaf), so they
// should be self-contained; each copy is positioned absolutely over the leaf.
// Theme with --pt-shadow and --pt-light (rgb triples) on the book element.

function createPageTurner(root, options) {
  'use strict';
  const o = {
    duration: 300,       // ms for a turn
    hurry: 170,          // ms for a turn when more are queued
    lift: 1.25,          // starting speed of a turn, relative to an even pace
    curl: 56,            // degrees the fore-edge leads the spine (then trails it)
    segments: 6,         // hinged strips the leaf is made of, so it can bow
    perspective: 9,      // viewing distance, in page widths
    peek: 0.06,          // how far a page lifts when the pointer rests on its edge
    edge: 0.075,         // the outer part of a page a mouse can pick up, as a fraction of its width
    dark: 0.5,           // shade on a face turned edge-on
    gloss: 0.9,
    glossTilt: 0.35,     // how much the light, from the left, favours the front
    singleReach: 0.62,   // how far round a leaf swings on one page (it fades as it goes)
    ...options,
  };
  const calm = matchMedia('(prefers-reduced-motion: reduce)');
  const OVERLAP = 2;     // px each face reaches over its neighbour, as in pageturn.css

  let at = o.at ?? 0;    // the opening shown, or being turned to
  let anim = null;       // the turn under way: { lo, hi, leaf, p, v, to, ... }
  let queued = 0;        // further turns asked for meanwhile, signed
  let drag = null;       // a page held by the pointer: { id, x0, d, cos0, hist }
  let press = null;      // a press that may become a drag: { id, x, y, zone }
  let swipe = null;      // where a touch went down, for a swipe that can't drag
  let eatClick = false;  // the click that ends a drag isn't a click

  const div = cls => { const e = document.createElement('div'); e.className = cls; return e; };
  const smooth = (e0, e1, x) => { const k = Math.min(1, Math.max(0, (x - e0) / (e1 - e0))); return k * k * (3 - 2 * k); };
  const spread = () => o.mode() === 'spread';
  const pageW = () => (spread() ? root.clientWidth / 2 : root.clientWidth);

  root.classList.add('pt-book');
  const castL = div('pt-cast'), castR = div('pt-cast');
  castL.setAttribute('aria-hidden', 'true');
  castR.setAttribute('aria-hidden', 'true');
  root.append(castL, castR);
  const clearCasts = () => { castL.style.background = castR.style.background = castR.style.opacity = ''; };

  /* ---------- Moving between openings ---------- */

  // Any move, however far, is shown as one turn of the leaf. A turn already in
  // flight is finished first (it jumps to where it was going).
  function go(to, { hurried = false } = {}) {
    if (anim) finish();
    if (to === at) return;
    if (calm.matches) {
      at = to;
      o.onChange?.(at);
      o.render(at, at);
      o.onLand?.(at, { instant: true });
      return;
    }
    const fwd = to > at, lo = Math.min(at, to), hi = Math.max(at, to);
    at = to;
    o.onChange?.(at);
    startTurn(lo, hi, fwd ? 0 : 1);
    glide(fwd ? 1 : 0, hurried ? o.hurry : o.duration, o.lift);
  }

  // A turn asked for while another is under way: more of the same is queued
  // (a few deep for clicks, one for a held key) and hurries the leaf along;
  // the opposite way first cancels what's queued, then sends the leaf back.
  function turn(dir, { repeat = false, hurried = false } = {}) {
    if (anim?.peek) {
      if (dir === anim.peek) return commitPeek();
      finish();
    }
    if (anim) {
      if (anim.drag) return;
      const heading = anim.to === 1 ? 1 : -1;
      if (dir === heading) {
        if (o.neighbour(at, dir) == null) return;
        const n = dir * queued;
        queued = dir * Math.max(n, Math.min(repeat ? 1 : 3, n + 1));
        hurry();
      } else if (queued) {
        queued += dir;
      } else {
        reverse();
      }
      return;
    }
    const next = o.neighbour(at, dir);
    if (next != null) go(next, { hurried });
  }

  /* ---------- The leaf ---------- */

  // Segment edges fall on whole pixels, so every slice of print sits exactly
  // where it does on the page beneath and nothing shifts when the leaf lands.
  function buildLeaf(f, segs, LW) {
    const edge = i => Math.round(i * LW / segs);
    const leaf = div('pt-leaf pt-seg');
    leaf.setAttribute('aria-hidden', 'true');
    const shades = [], copies = [];
    const face = (side, content, left, width = LW) => {
      const fc = div('pt-face pt-' + side);
      const c = content.cloneNode(true);
      Object.assign(c.style, { position: 'absolute', top: '0', bottom: 'auto', right: 'auto', left: left + 'px', width: width + 'px', height: '100%', margin: '0' });
      fc.append(c);
      return [fc, c];
    };
    let seg = leaf;
    for (let i = 0; i < segs; i++) {
      if (i) { const s = div('pt-seg'); seg.append(s); seg = s; }
      seg.style.width = edge(i + 1) - edge(i) + 'px';
      const [front, fc] = face('front', f.front, -edge(i));
      const [back, bc] = face('back', f.back, edge(i + 1) - LW);
      if (f.through) {
        const through = div('pt-through');
        through.style.opacity = f.through;
        through.append(face('ghost', f.front, OVERLAP - edge(i))[1]);
        back.append(through);
      }
      const fs = div('pt-shade'), bs = div('pt-shade');
      front.append(fs);
      back.append(bs);
      seg.prepend(front, back);
      shades.push([fs, bs]);
      copies.push([front, fc, back, bc]);
    }
    return { leaf, shades, copies };
  }

  // A slice of a face is rounded only where its content's corners are: the
  // first slice on the spine side, the last at the fore-edge (the back is
  // mirrored, so the other way round).
  function roundCorners(copies) {
    const last = copies.length - 1;
    copies.forEach(([front, fc, back, bc], i) => {
      const r = (c, left, right) => {
        const s = getComputedStyle(c);
        return [left && s.borderTopLeftRadius, right && s.borderTopRightRadius, right && s.borderBottomRightRadius, left && s.borderBottomLeftRadius].map(v => v || '0').join(' ');
      };
      front.style.borderRadius = r(fc, i === 0, i === last);
      back.style.borderRadius = r(bc, i === last, i === 0);
    });
  }

  // Run fn once the images inside el can be drawn (or soon, regardless), so
  // that swapping a page never flashes it without its picture.
  function whenPainted(el, fn) {
    const imgs = [...el.querySelectorAll('img')];
    if (!imgs.length) return fn();
    const ready = Promise.all(imgs.map(i => i.decode().catch(() => {})));
    Promise.race([ready, new Promise(r => setTimeout(r, 150))]).then(() => requestAnimationFrame(fn));
  }

  function startTurn(lo, hi, p) {
    const f = o.faces(lo, hi);
    const W = pageW(), H = root.clientHeight, sp = spread();
    const out = { top: 0, right: 0, bottom: 0, left: 0, ...f.outset };
    const segs = f.hard ? 1 : o.segments;
    const LW = W + out.left + out.right;
    const { leaf, shades, copies } = buildLeaf(f, segs, LW);
    Object.assign(leaf.style, {
      visibility: 'hidden',
      left: (sp ? W : 0) - out.left + 'px',
      top: -out.top + 'px',
      height: H + out.top + out.bottom + 'px',
    });
    root.style.setProperty('--pt-perspective', W * o.perspective + 'px');
    for (const c of [castL, castR]) c.style.width = W + 'px';
    castR.style.left = sp ? W + 'px' : '0';
    castL.style.display = sp ? '' : 'none';
    root.append(leaf);
    roundCorners(copies);
    anim = {
      lo, hi, leaf, shades, p, v: 0, to: p, ready: false,
      W, LW, out, spread: sp, segs, curl: f.hard ? 0 : o.curl, reach: sp ? 1 : o.singleReach,
    };
    pose(anim);
    whenPainted(leaf, () => {
      if (anim?.leaf !== leaf) return;
      // The leaf now hides the side it lies on, so the page it uncovers can
      // go there.
      o.render(lo, hi);
      leaf.style.visibility = '';
      anim.ready = true;
      pose(anim);
    });
  }

  // Move the leaf to p = to over ms, along 1 - (1-t)^3 (1 + k t): it leaves
  // at the leaf's current speed (or at lift times an even pace), so speed
  // carries through a reversal or a release, and it arrives with neither speed
  // nor acceleration. That last part matters: the final frames a browser
  // actually shows (Safari often only 60 a second, dropping some) are then
  // all but flat, so swapping in the real page is invisible.
  function glide(to, ms, lift) {
    const a = anim, d = to - a.p;
    let m0 = lift ?? (Math.abs(d) > 1e-4 ? a.v * ms / d : 0);
    if (m0 > 2.5) { ms *= 2.5 / m0; m0 = 2.5; }   // arriving fast: get there sooner
    m0 = Math.max(m0, -1.2);                       // reversing: drift on only a little first
    Object.assign(a, { from: a.p, to, d, m0, ms: Math.max(ms, 1), t0: null, t: 0 });
    if (!a.raf) a.raf = requestAnimationFrame(step);
  }

  function step(now) {
    const a = anim;
    if (!a) return;
    a.raf = 0;
    if (a.drag) return;
    if (!a.ready) { a.raf = requestAnimationFrame(step); return; }
    if (a.t0 == null) a.t0 = now;
    const t = a.t = Math.min(1, (now - a.t0) / a.ms);
    const k = 3 - a.m0, u = 1 - t;
    const h = 1 - u ** 3 * (1 + k * t);
    const dh = u * u * (3 - k + 4 * k * t);
    a.p = Math.max(0, Math.min(1, a.from + a.d * h));
    a.v = a.d * dh / a.ms;
    pose(a);
    if (t < 1) a.raf = requestAnimationFrame(step);
    else if (a.to === 0 || a.to === 1) land();
  }

  function hurry() {
    const a = anim;
    glide(a.to, Math.min(a.ms * (1 - a.t), o.hurry * Math.abs(a.to - a.p) + 60));
  }

  function reverse() {
    const a = anim, to = 1 - a.to;
    at = to ? a.hi : a.lo;
    o.onChange?.(at);
    glide(to, o.duration * (0.3 + 0.7 * Math.abs(to - a.p)));
  }

  // The leaf has come to rest on one side. Draw the book as it now lies, then
  // take the leaf away once that can be drawn.
  function land() {
    const a = anim;
    anim = null;
    at = a.to === 1 ? a.hi : a.lo;
    o.render(at, at);
    clearCasts();
    whenPainted(root, () => a.leaf.remove());
    o.onLand?.(at, { instant: false });
    if (queued) {
      const dir = Math.sign(queued);
      queued -= dir;
      if (o.neighbour(at, dir) != null) turn(dir, { hurried: true });
      else queued = 0;
    }
  }

  // Stop any turn where it is and show where it was heading.
  function finish() {
    const a = anim;
    anim = null;
    queued = 0;
    if (a) cancelAnimationFrame(a.raf);
    if (drag) { drag = null; root.classList.remove('pt-dragging'); }
    for (const l of root.querySelectorAll(':scope > .pt-leaf')) l.remove();
    clearCasts();
    o.render(at, at);
    if (a) o.onLand?.(at, { instant: true });
  }

  /* ---------- Posing and shading ---------- */

  // Brightness of a face at the given lift, relative to lying flat. It goes by
  // how squarely the face looks out of the book, so front and back both fade
  // to the same dark as the leaf stands edge-on (no step as it passes upright)
  // and both are exactly as bright as a flat page when lying down. Tipped a
  // little toward the light on the left, the front catches a faint gloss.
  function lit(deg, back) {
    const r = deg * Math.PI / 180;
    const facing = back ? -Math.cos(r) : Math.cos(r);
    if (facing <= 0) return 0;
    return facing * (1 + (back ? 0 : o.glossTilt) * Math.sin(r));
  }
  function tone(b) {
    // Squared, so a page only darkens noticeably as it nears edge-on and has
    // all but reached flat brightness well before it lands.
    return b < 1
      ? `rgba(var(--pt-shadow), ${(o.dark * (1 - b) ** 2).toFixed(3)})`
      : `rgba(var(--pt-light), ${(o.gloss * (b - 1)).toFixed(3)})`;
  }

  // The shadow cast past the leaf's edge on one side (px from the spine): it
  // rises under the leaf, just inside the edge the eye sees, so it seems to
  // fall from that edge with no gap; it keeps its depth out to `to` (thrown a
  // little beyond the edge, away from the light), then softens to nothing over
  // `blur` px. Nothing is drawn further under the leaf, so a leaf lying flat
  // casts nothing.
  function shadowBand(deg, alpha, edge, to, blur) {
    const c = k => `rgba(var(--pt-shadow), ${(alpha * k).toFixed(3)})`;
    return `linear-gradient(${deg}deg, ${c(0)} ${Math.max(0, edge - 10).toFixed(1)}px, ${c(1)} ${Math.max(0, edge - 2).toFixed(1)}px, ` +
      `${c(1)} ${to.toFixed(1)}px, ${c(0.55)} ${(to + blur * 0.25).toFixed(1)}px, ${c(0.2)} ${(to + blur * 0.55).toFixed(1)}px, ` +
      `${c(0.05)} ${(to + blur * 0.8).toFixed(1)}px, ${c(0)} ${(to + blur).toFixed(1)}px)`;
  }

  function pose(a) {
    const { W, LW, segs } = a;
    const p = a.p * a.reach;
    // Each segment's lift in degrees. Lifting, the fore-edge leads and the sheet
    // bows; falling, the spine lands first and the edge drifts down after it.
    // The bow dies away quadratically at both ends, so the sheet lies flat
    // (and lands flat) rather than with its edge still trailing in the air.
    const base = 180 * p, curl = a.curl * Math.sin(2 * Math.PI * p) * 4 * p * (1 - p);
    const ang = [];
    for (let i = 0; i < segs; i++) ang.push(base + (segs > 1 ? curl * i * (i + 1) / (segs * (segs - 1)) : 0));

    // Pose the chain, and trace its hinges across and above the book (px from
    // the spine, which a board's overhang sets the hinge a little outside).
    let seg = a.leaf, x = -a.out.left, z = 0;
    const xs = [x], zs = [0], s = LW / segs;
    for (let i = 0; i < segs; i++) {
      seg.style.transform = `rotateY(${(-(ang[i] - (i ? ang[i - 1] : 0))).toFixed(3)}deg)`;
      seg = seg.lastElementChild;
      const r = ang[i] * Math.PI / 180;
      xs.push(x += s * Math.cos(r));
      zs.push(z += s * Math.sin(r));
    }

    // Shade each segment smoothly from hinge to hinge, as one curved sheet.
    for (let i = 0; i < segs; i++) {
      const l = (ang[i - 1] ?? ang[i]) / 2 + ang[i] / 2, r = (ang[i + 1] ?? ang[i]) / 2 + ang[i] / 2;
      const [fs, bs] = a.shades[i];
      fs.style.background = `linear-gradient(90deg, ${tone(lit(l))}, ${tone(lit(r))})`;
      bs.style.background = `linear-gradient(90deg, ${tone(lit(r, true))}, ${tone(lit(l, true))})`;
    }
    // How flat the leaf lies at the spine (1 flat, 0 upright): a page's fold
    // shading there belongs to a page lying in the gutter, and squeezed by the
    // angle it would turn into a hard dark line, so it can fade with this.
    const stand = Math.sin(ang[0] * Math.PI / 180);
    a.leaf.style.setProperty('--pt-flat', Math.abs(Math.cos(ang[0] * Math.PI / 180)).toFixed(3));

    // Shadows on the pages beneath. Everything here varies smoothly with the
    // pose and is the same on both sides when the leaf stands upright, so
    // nothing jumps as it passes over the spine.
    // A soft darkening either side of the spine while the leaf stands up.
    const spine = (deg) => `linear-gradient(${deg}deg, rgba(var(--pt-shadow), ${(0.13 * stand).toFixed(3)}), ` +
      `rgba(var(--pt-shadow), ${(0.05 * stand).toFixed(3)}) ${(W * (0.04 + 0.1 * stand)).toFixed(1)}px, ` +
      `rgba(var(--pt-shadow), 0) ${(W * (0.1 + 0.3 * stand)).toFixed(1)}px)`;
    // Where each hinge appears across the book: the perspective (from the
    // middle of the book) swells raised parts outward from that point.
    const P = o.perspective * W, ox = a.spread ? 0 : W / 2;
    const seen = xs.map((x, j) => ox + (x - ox) * P / (P - zs[j]));
    // A band beyond the part of the leaf that reaches out over a side: softer
    // and fainter the higher that part is, and fading out entirely as the
    // reach shrinks to nothing.
    const side = (deg, dir) => {
      const edge = Math.max(0, ...seen.map(v => v * dir));
      // The height of the leaf there, weighted smoothly toward the outermost
      // hinges so it can't jump when another hinge becomes the outermost.
      let wz = 0, w = 0;
      for (let j = 0; j <= segs; j++) { const k = Math.exp((seen[j] * dir - edge) / (0.04 * W)); wz += k * zs[j]; w += k; }
      const height = wz / w;
      const strength = smooth(0, 0.25 * W, Math.max(0, ...xs.map(v => v * dir)));
      const layers = [spine(deg)];
      if (strength > 0) {
        const alpha = 0.42 * (1 - 0.5 * Math.min(1, height / W)) * strength;
        layers.unshift(shadowBand(deg, alpha, edge, edge + 0.08 * height, 8 + 0.6 * height));
      }
      return layers.join(', ');
    };
    // On one page there is nowhere for the leaf to land, so it fades as it
    // swings away, and its shadow with it.
    let fade = 1;
    if (!a.spread) {
      fade = 1 - smooth(0.62, 0.98, a.p);
      a.leaf.style.setProperty('--pt-fade', fade.toFixed(3));
    }
    // The shadows go only with a leaf that can be seen. While a new leaf waits,
    // hidden, for its pictures, shadows drawn without it would darken the page
    // for a frame or two (startTurn poses it again as it appears).
    castR.style.background = a.ready ? side(90, 1) : '';
    castR.style.opacity = a.ready ? fade.toFixed(3) : '';
    castL.style.background = a.ready && a.spread ? side(270, -1) : '';
    o.onProgress?.(a.p, { lo: a.lo, hi: a.hi });
  }

  /* ---------- Taking hold of a page ---------- */

  // The outer edges of the pages (the whole page, by touch) can be taken hold
  // of and turned by hand. The leaf follows so that the point held stays under
  // the pointer; let go and it carries on the way it was moving, or, if it was
  // held still, falls to whichever side it is nearer.

  // Which way the page under a mouse pointer would turn if dragged: 1 from the
  // outer edge of the right-hand page, -1 from that of the left-hand page (or,
  // on one page, from the spine), otherwise 0. While a page is already lifted
  // (held = its direction) the zone reaches a third further in, so a pointer
  // resting on the boundary doesn't flick the page up and down. The grab
  // cursor shows exactly where this says a page can be taken.
  function grabZone(e, held = anim?.peek || 0) {
    const r = root.getBoundingClientRect(), W = pageW();
    const x = e.clientX - r.left;
    const reach = dir => W * (spread() || dir > 0 ? o.edge : o.edge * 2 / 3) * (held === dir ? 22 / 15 : 1);
    let dir = 0;
    if (x > r.width - reach(1)) dir = 1;
    else if (x < reach(-1)) dir = -1;
    return dir && o.neighbour(at, dir) != null ? dir : 0;
  }

  // The openings either side of the leaf turned in direction dir from here.
  const between = dir => (dir > 0 ? [at, o.neighbour(at, 1)] : [o.neighbour(at, -1), at]);

  // The pointer resting on a page's outer edge lifts it slightly.
  function peek(dir) {
    if (calm.matches || (anim && !anim.peek)) return;
    if (anim?.peek === dir) return;
    if (anim) finish();
    // On one page a leaf turned back starts out of sight, so there's nothing to lift.
    if (!dir || (!spread() && dir < 0)) return;
    startTurn(...between(dir), dir > 0 ? 0 : 1);
    anim.peek = dir;
    glide(dir > 0 ? o.peek : 1 - o.peek, 240, 0);
  }

  function unpeek() {
    if (!anim?.peek || anim.drag) return;
    anim.peek = 0;
    glide(anim.from <= 0.5 ? 0 : 1, 200, 0);
  }

  function commitPeek() {
    const a = anim, to = a.peek > 0 ? 1 : 0;
    a.peek = 0;
    at = to ? a.hi : a.lo;
    o.onChange?.(at);
    glide(to, o.duration * Math.abs(to - a.p), o.lift);
  }

  function beginDrag(dir, e) {
    if (anim && !anim.peek) return false;
    if (o.neighbour(at, dir) == null) return false;
    if (anim && anim.peek !== dir) finish();
    if (!anim) startTurn(...between(dir), dir > 0 ? 0 : 1);
    const a = anim;
    a.peek = 0;
    a.drag = true;
    a.start = dir > 0 ? 0 : 1;
    cancelAnimationFrame(a.raf);
    a.raf = 0;
    const r = root.getBoundingClientRect();
    const spine = a.spread ? r.left + r.width / 2 : r.left;
    drag = {
      id: e.pointerId,
      x0: e.clientX,
      // How far the pointer must travel to stand the page upright.
      d: a.spread ? Math.max(Math.abs(press.x - spine), a.W * 0.45) : a.W * 0.6,
      cos0: Math.cos(Math.PI * a.p * a.reach),
      hist: [],
    };
    root.classList.add('pt-dragging');
    root.classList.remove('pt-grab');
    try { root.setPointerCapture(e.pointerId); } catch {}
    return true;
  }

  function moveDrag(e) {
    const c = Math.max(-1, Math.min(1, drag.cos0 + (e.clientX - drag.x0) / drag.d));
    anim.p = Math.min(1, Math.acos(c) / Math.PI / anim.reach);
    drag.hist.push([e.timeStamp, anim.p]);
    while (drag.hist.length > 2 && e.timeStamp - drag.hist[0][0] > 90) drag.hist.shift();
    pose(anim);
  }

  function endDrag(cancelled) {
    const a = anim, h = drag.hist;
    drag = null;
    root.classList.remove('pt-dragging');
    a.drag = false;
    let v = 0;
    if (h.length > 1) {
      const [t0, p0] = h[0], [t1, p1] = h[h.length - 1];
      if (t1 - t0 > 8 && performance.now() - t1 < 80) v = (p1 - p0) / (t1 - t0);
    }
    let to = Math.abs(v) > 0.0008 ? (v > 0 ? 1 : 0) : (a.p > 0.5 ? 1 : 0);
    if (cancelled) to = a.start;
    a.v = Math.max(-0.008, Math.min(0.008, v));
    at = to ? a.hi : a.lo;
    o.onChange?.(at);
    glide(to, 160 + 420 * Math.abs(to - a.p));
  }

  const hasSelection = () => {
    const sel = window.getSelection();
    return !!sel && !sel.isCollapsed && sel.toString().length > 0;
  };

  const listeners = [
    [root, 'pointerdown', (e) => {
      eatClick = false;
      press = null;
      swipe = e.pointerType === 'mouse' ? null : { x: e.clientX, y: e.clientY };
      if (e.button !== 0 || calm.matches) return;
      const zone = e.pointerType === 'mouse' ? grabZone(e) : 0;
      if (e.pointerType === 'mouse') {
        if (!zone) return;
        e.preventDefault();   // a drag from the edge, not a text selection
      }
      press = { id: e.pointerId, x: e.clientX, y: e.clientY, zone };
    }],
    [window, 'pointermove', (e) => {
      if (drag && e.pointerId === drag.id) return moveDrag(e);
      if (press && e.pointerId === press.id) {
        const dx = e.clientX - press.x, dy = e.clientY - press.y;
        if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(dy) * 1.3 || hasSelection()) return;
        const dir = dx < 0 ? 1 : -1;
        if (press.zone && dir !== press.zone) { press = null; return; }
        if (beginDrag(dir, e)) { press = null; swipe = null; moveDrag(e); }
        return;
      }
      if (e.pointerType === 'mouse' && !e.buttons && !drag && root.contains(e.target)) {
        const zone = grabZone(e);
        root.classList.toggle('pt-grab', !!zone && !(anim && !anim.peek));
        if (zone) peek(zone); else unpeek();
      }
    }],
    [root, 'pointerleave', (e) => {
      if (e.pointerType !== 'mouse' || drag) return;
      root.classList.remove('pt-grab');
      unpeek();
    }],
    [window, 'pointerup', (e) => {
      press = null;
      if (drag && e.pointerId === drag.id) {
        endDrag(false);
        eatClick = true;
        swipe = null;
        return;
      }
      if (!swipe) return;
      const dx = e.clientX - swipe.x, dy = e.clientY - swipe.y;
      swipe = null;
      if (hasSelection()) return;
      // A swipe that couldn't take hold of the page (one was already turning).
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        turn(dx < 0 ? 1 : -1);
        eatClick = true;
      }
    }],
    [window, 'pointercancel', (e) => {
      press = null;
      swipe = null;
      if (drag && e.pointerId === drag.id) endDrag(true);
    }],
    // Caught before the book's own click handlers see it.
    [root, 'click', (e) => {
      if (!eatClick && !drag) return;
      eatClick = false;
      e.stopImmediatePropagation();
    }, true],
  ];
  for (const [target, type, fn, capture] of listeners) target.addEventListener(type, fn, capture);

  // Go straight to an opening (or redraw this one), finishing any turn.
  function show(to) {
    if (anim) finish();
    at = to;
    o.render(at, at);
  }

  return {
    go,
    turn,
    show,
    finish,
    get busy() { return !!anim; },
    get at() { return at; },
    destroy() {
      if (anim) finish();
      for (const [target, type, fn, capture] of listeners) target.removeEventListener(type, fn, capture);
      castL.remove();
      castR.remove();
      root.classList.remove('pt-book', 'pt-grab', 'pt-dragging');
    },
  };
}
