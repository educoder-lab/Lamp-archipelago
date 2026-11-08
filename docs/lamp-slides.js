/* ランプ諸島 — 解説スライドプレイヤー（スキーマ: _tools/Slides-Schema.md） */
(function (global) {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function fmt(s) {
    let t = esc(s);
    t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    t = t.replace(/==([^=]+)==/g, '<mark>$1</mark>');
    t = t.replace(/`([^`]+)`/g, '<code>$1</code>');
    t = t.replace(/\n/g, '<br>');
    return t;
  }
  function h(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function cap(text) { return text ? h('div', 'b-cap', fmt(text)) : null; }

  const R = {};

  R.p = b => h('p', 'b b-p', fmt(b.text));

  R.bullets = b => {
    const ul = h('ul', 'b b-bullets');
    (b.items || []).forEach(it => ul.appendChild(h('li', null, fmt(it))));
    return ul;
  };

  R.big = b => h('div', 'b b-big', fmt(b.text) + (b.sub ? '<span class="sub">' + fmt(b.sub) + '</span>' : ''));

  R.analogy = b => {
    const wrap = h('div', 'b');
    const row = h('div', 'b-analogy');
    row.appendChild(h('div', 'side real', '<span class="ico">' + esc(b.icon || '🏠') + '</span><span class="tag">身近なたとえ</span>' + fmt(b.real)));
    row.appendChild(h('div', 'arrow', '⇨'));
    row.appendChild(h('div', 'side tech', '<span class="tag">IT の言葉では</span>' + fmt(b.tech)));
    wrap.appendChild(row);
    if (b.note) wrap.appendChild(h('div', 'b-analogy-note', fmt(b.note)));
    return wrap;
  };

  R.flow = b => {
    const wrap = h('div', 'b');
    const f = h('div', 'b-flow' + (b.direction === 'v' ? ' v' : ''));
    let i = 0;
    (b.steps || []).forEach((st, idx) => {
      if (idx > 0 && b.arrows !== false) {
        const a = h('div', 'arr', '➜');
        a.style.setProperty('--i', i++);
        f.appendChild(a);
      }
      const s = typeof st === 'string' ? { label: st } : st;
      const d = h('div', 'step', (s.icon ? '<span class="ico">' + esc(s.icon) + '</span>' : '') + '<b>' + fmt(s.label) + '</b>' + (s.sub ? '<span class="s">' + fmt(s.sub) + '</span>' : ''));
      d.style.setProperty('--i', i++);
      f.appendChild(d);
    });
    wrap.appendChild(f);
    const c = cap(b.caption); if (c) wrap.appendChild(c);
    return wrap;
  };

  R.compare = b => {
    const row = h('div', 'b b-compare');
    function col(c, cls) {
      const d = h('div', 'col ' + cls);
      d.appendChild(h('h4', null, (c.icon ? esc(c.icon) + ' ' : '') + fmt(c.title)));
      const ul = h('ul');
      (c.items || []).forEach(it => ul.appendChild(h('li', null, fmt(it))));
      d.appendChild(ul);
      return d;
    }
    row.appendChild(col(b.left || {}, 'l'));
    row.appendChild(h('div', 'vs', b.vs || 'VS'));
    row.appendChild(col(b.right || {}, 'r'));
    return row;
  };

  R.table = b => {
    const wrap = h('div', 'b');
    const sc = h('div', 'b-table-wrap');
    const t = h('table', 'b-table');
    if (b.head && b.head.length) {
      const tr = h('tr');
      b.head.forEach(c => tr.appendChild(h('th', null, fmt(c))));
      const th = h('thead'); th.appendChild(tr); t.appendChild(th);
    }
    const tb = h('tbody');
    const hl = new Set(b.highlight || []);
    (b.rows || []).forEach((r, i) => {
      const tr = h('tr', hl.has(i) ? 'hl' : '');
      r.forEach(c => tr.appendChild(h('td', null, fmt(c))));
      tb.appendChild(tr);
    });
    t.appendChild(tb); sc.appendChild(t); wrap.appendChild(sc);
    const c = cap(b.caption); if (c) wrap.appendChild(c);
    return wrap;
  };

  R.cards = b => {
    const g = h('div', 'b b-cards');
    (b.items || []).forEach((it, i) => {
      const c = h('div', 'card', (it.icon ? '<span class="ico">' + esc(it.icon) + '</span>' : '') + '<b>' + fmt(it.title) + '</b>' + (it.text ? '<p>' + fmt(it.text) + '</p>' : ''));
      c.style.setProperty('--i', i);
      g.appendChild(c);
    });
    return g;
  };

  R.callout = b => {
    const kind = b.kind || 'tip';
    const labels = { tip: '💡 ポイント', warn: '⚠️ まちがえやすい', exam: '📝 試験ではここ', memo: '🗒️ おぼえよう' };
    return h('div', 'b b-callout ' + kind, '<span class="lab">' + (b.label || labels[kind] || '') + '</span>' + fmt(b.text));
  };

  R.code = b => {
    const wrap = h('div', 'b');
    const pre = h('pre', 'b-code'); pre.textContent = b.text || '';
    wrap.appendChild(pre);
    const c = cap(b.caption); if (c) wrap.appendChild(c);
    return wrap;
  };

  R.bits = b => {
    const str = String(b.bits || '0');
    const n = str.length;
    const inter = b.interactive !== false;
    const state = str.split('').map(c => (c === '1' ? 1 : 0));
    const wrap = h('div', 'b b-bits' + (inter ? ' inter' : ''));
    const row = h('div', 'bits-row');
    const out = h('div', 'out');
    const btns = [];
    state.forEach((v, i) => {
      const cell = h('div', 'bitcell');
      const btn = h('button', 'bit', String(v));
      btn.type = 'button';
      btn.setAttribute('aria-label', (n - i) + '桁目');
      btns.push(btn);
      cell.appendChild(btn);
      if (b.weights !== false) cell.appendChild(h('span', 'wt', String(Math.pow(2, n - 1 - i))));
      row.appendChild(cell);
      if (inter) btn.onclick = () => { state[i] = state[i] ? 0 : 1; update(); };
    });
    function update() {
      let sum = 0; const parts = [];
      state.forEach((v, i) => {
        btns[i].textContent = String(v);
        btns[i].classList.toggle('on', !!v);
        if (v) { const w = Math.pow(2, n - 1 - i); sum += w; parts.push(w); }
      });
      const hex = n <= 8 ? ' ／ 16進で <strong>' + sum.toString(16).toUpperCase() + '</strong>' : '';
      out.innerHTML = '10進数では <strong>' + sum + '</strong>' + (parts.length > 1 ? '（' + parts.join(' + ') + '）' : '') + (b.showHex ? hex : '');
    }
    update();
    wrap.appendChild(row);
    if (b.weights !== false) wrap.appendChild(h('div', 'b-cap', '※ 各マスの下の数字は「その桁の重み」です'));
    wrap.appendChild(out);
    const c = cap(b.caption || (inter ? '👆 マスをクリックして 0 / 1 を切り替えてみよう' : '')); if (c) wrap.appendChild(c);
    return wrap;
  };

  R.trace = b => {
    const vars = b.vars || [];
    const rows = b.rows || [];
    const code = b.code || [];
    const lines = b.lines || [];
    const notes = b.notes || [];
    const wrap = h('div', 'b b-trace');
    let codeEls = [];
    if (code.length) {
      const box = h('div', 'trace-code');
      code.forEach((ln, i) => {
        const d = h('div', 'ln');
        d.appendChild(h('i', null, String(i + 1)));
        const s = h('span'); s.textContent = ln; d.appendChild(s);
        box.appendChild(d); codeEls.push(d);
      });
      wrap.appendChild(box);
    }
    const t = h('table');
    const thr = h('tr');
    thr.appendChild(h('th', null, b.stepLabel || '手順'));
    vars.forEach(v => thr.appendChild(h('th', null, fmt(v))));
    const thead = h('thead'); thead.appendChild(thr); t.appendChild(thead);
    const tb = h('tbody');
    const trs = rows.map((r, i) => {
      const tr = h('tr');
      tr.appendChild(h('td', null, String(i + 1)));
      r.forEach(c => tr.appendChild(h('td', null, fmt(c))));
      tb.appendChild(tr);
      return tr;
    });
    t.appendChild(tb); wrap.appendChild(t);
    const note = h('div', 'tnote');
    const ctl = h('div', 'ctl');
    const nextB = h('button', null, '▶ 次の一歩'); nextB.type = 'button';
    const allB = h('button', null, '全部見る'); allB.type = 'button';
    const resetB = h('button', null, '↺ 最初から'); resetB.type = 'button';
    const cnt = h('span', 'b-cap', '');
    ctl.append(nextB, allB, resetB, cnt);
    let k = 1;
    function render() {
      trs.forEach((tr, i) => {
        tr.classList.toggle('hidden', i >= k);
        tr.classList.toggle('cur', i === k - 1);
      });
      codeEls.forEach((d, i) => d.classList.toggle('hot', lines[k - 1] === i));
      note.innerHTML = notes[k - 1] ? fmt(notes[k - 1]) : '';
      nextB.disabled = k >= rows.length;
      cnt.textContent = k + ' / ' + rows.length;
    }
    nextB.onclick = () => { if (k < rows.length) { k++; render(); } };
    allB.onclick = () => { k = rows.length; render(); };
    resetB.onclick = () => { k = 1; render(); };
    render();
    wrap.appendChild(ctl); wrap.appendChild(note);
    const c = cap(b.caption); if (c) wrap.appendChild(c);
    return wrap;
  };

  R.check = b => {
    const wrap = h('div', 'b b-check');
    wrap.appendChild(h('div', 'qh', '✅ ミニ確認（採点には関係しません）'));
    wrap.appendChild(h('div', 'q', fmt(b.q)));
    const opts = h('div', 'opts');
    const fb = h('div', 'fb');
    const btns = [];
    (b.choices || []).forEach((c, i) => {
      const btn = h('button', 'opt', '<strong>' + String.fromCharCode(65 + i) + '.</strong> ' + fmt(c));
      btn.type = 'button';
      btn.onclick = () => {
        if (i === b.answer) {
          btn.classList.add('ok');
          fb.innerHTML = '⭕ せいかい！ ' + fmt(b.explain || '');
          btns.forEach(x => { x.disabled = true; });
        } else {
          btn.classList.add('ng'); btn.disabled = true;
          fb.innerHTML = '❌ おしい。もう一度考えてみよう。' + (b.hint ? '<br>ヒント: ' + fmt(b.hint) : '');
        }
      };
      btns.push(btn); opts.appendChild(btn);
    });
    wrap.appendChild(opts); wrap.appendChild(fb);
    return wrap;
  };

  R.layers = b => {
    const wrap = h('div', 'b b-layers');
    if (b.top) wrap.appendChild(h('div', 'cap', fmt(b.top)));
    (b.items || []).forEach((it, i) => {
      const s = typeof it === 'string' ? { label: it } : it;
      const d = h('div', 'layer', '<b>' + (s.icon ? esc(s.icon) + ' ' : '') + fmt(s.label) + '</b>' + (s.sub ? '<span class="s">' + fmt(s.sub) + '</span>' : ''));
      d.style.setProperty('--i', i);
      wrap.appendChild(d);
    });
    if (b.bottom) wrap.appendChild(h('div', 'cap', fmt(b.bottom)));
    return wrap;
  };

  R.steps = b => {
    const ol = h('ol', 'b b-steps');
    (b.items || []).forEach(it => {
      const s = typeof it === 'string' ? { title: it } : it;
      ol.appendChild(h('li', null, '<b>' + fmt(s.title) + '</b>' + (s.text ? '<span>' + fmt(s.text) + '</span>' : '')));
    });
    return ol;
  };

  R.array = b => {
    const wrap = h('div', 'b b-array');
    const cells = h('div', 'cells');
    const hl = new Set(b.highlight || []);
    const start = b.start == null ? 0 : b.start;
    (b.cells || []).forEach((v, i) => {
      const c = h('div', 'cell' + (hl.has(i) ? ' hl' : ''));
      c.appendChild(h('div', 'v', fmt(v)));
      if (b.index !== false) c.appendChild(h('div', 'i', String(i + start)));
      const p = b.pointers && b.pointers[i] != null ? b.pointers[i] : '';
      if (b.pointers) c.appendChild(h('div', 'ptr', p ? '▲ ' + fmt(p) : ''));
      cells.appendChild(c);
    });
    wrap.appendChild(cells);
    const c = cap(b.caption); if (c) wrap.appendChild(c);
    return wrap;
  };

  R.tree = b => {
    function node(n) {
      const li = h('li');
      li.appendChild(h('span', 'tn', fmt(typeof n === 'string' ? n : n.label)));
      if (n.children && n.children.length) {
        const ul = h('ul');
        n.children.forEach(c => ul.appendChild(node(c)));
        li.appendChild(ul);
      }
      return li;
    }
    const wrap = h('div', 'b b-tree');
    const ul = h('ul');
    ul.appendChild(node(b.root || { label: '?' }));
    wrap.appendChild(ul);
    const c = cap(b.caption); if (c) wrap.appendChild(c);
    return wrap;
  };

  function renderBlock(b) {
    const fn = R[b.t];
    if (!fn) return h('p', 'b b-p', '（未対応ブロック: ' + esc(b.t) + '）');
    return fn(b);
  }

  function renderSlide(s) {
    const isTitle = s.layout === 'title';
    const el = h('section', 'slide' + (isTitle ? ' slide-title' : ''));
    if (isTitle) {
      if (s.emoji) el.appendChild(h('div', 'big-emoji', esc(s.emoji)));
      el.appendChild(h('h2', null, fmt(s.title)));
      if (s.subtitle) el.appendChild(h('div', 'sub', fmt(s.subtitle)));
    } else {
      el.appendChild(h('h3', null, (s.emoji ? '<span class="ico">' + esc(s.emoji) + '</span>' : '') + '<span>' + fmt(s.title) + '</span>'));
    }
    (s.blocks || []).forEach(b => el.appendChild(renderBlock(b)));
    if (s.note) el.appendChild(h('div', 'slide-note', '💬 ' + fmt(s.note)));
    return el;
  }

  function mount(root, deck, opts) {
    opts = opts || {};
    const slides = (deck && deck.slides) || [];
    root.innerHTML = '';
    root.classList.add('deck');
    root.tabIndex = 0;
    if (!slides.length) { root.textContent = '（スライドがありません）'; return null; }

    const top = h('div', 'deck-top');
    const count = h('span', null, '');
    top.appendChild(count);
    top.appendChild(h('span', 'deck-badge' + (deck.authored === false ? ' lite' : ''), deck.authored === false ? 'かんたん版' : '図解スライド'));
    top.appendChild(h('span', 'spacer'));
    const listB = h('button', null, '📄 一覧で読む'); listB.type = 'button';
    const fsB = h('button', null, '⛶ 全画面'); fsB.type = 'button';
    top.append(listB, fsB);

    const stage = h('div', 'deck-stage');
    const els = slides.map(s => renderSlide(s));
    els.forEach(e => stage.appendChild(e));

    const bar = h('div', 'deck-bar'); const barI = h('i'); bar.appendChild(barI);
    const nav = h('div', 'deck-nav');
    const prevB = h('button', 'nb', '◀ 前へ'); prevB.type = 'button';
    const dots = h('div', 'dots');
    const nextB = h('button', 'nb primary', '次へ ▶'); nextB.type = 'button';
    const dotEls = slides.map((_, i) => {
      const d = h('button'); d.type = 'button'; d.title = (i + 1) + ' 枚目';
      d.onclick = () => go(i);
      dots.appendChild(d); return d;
    });
    nav.append(prevB, dots, nextB);
    const hint = h('div', 'deck-hint', '← → キーでも移動できます');

    root.append(top, stage, bar, nav, hint);

    let i = 0;
    const seen = new Set();
    function go(n) {
      i = Math.max(0, Math.min(slides.length - 1, n));
      seen.add(i);
      els.forEach((e, k) => e.classList.toggle('active', k === i));
      dotEls.forEach((d, k) => { d.classList.toggle('on', k === i); d.classList.toggle('seen', seen.has(k) && k !== i); });
      count.textContent = (i + 1) + ' / ' + slides.length;
      barI.style.width = ((i + 1) / slides.length * 100) + '%';
      prevB.disabled = i === 0;
      const last = i === slides.length - 1;
      nextB.textContent = last ? (opts.finishLabel || '封印の問いへ ▼') : '次へ ▶';
    }
    prevB.onclick = () => go(i - 1);
    nextB.onclick = () => {
      if (i === slides.length - 1) { if (opts.onFinish) opts.onFinish(); } else go(i + 1);
    };
    listB.onclick = () => {
      const on = root.classList.toggle('list');
      listB.textContent = on ? '🎞 スライドで見る' : '📄 一覧で読む';
      if (!on) go(i);
    };
    fsB.onclick = () => {
      const on = root.classList.toggle('full');
      if (on && root.requestFullscreen) root.requestFullscreen().catch(() => {});
      else if (!on && document.fullscreenElement && document.exitFullscreen) document.exitFullscreen();
      fsB.textContent = on ? '✕ 閉じる' : '⛶ 全画面';
    };
    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement && root.classList.contains('full')) {
        root.classList.remove('full'); fsB.textContent = '⛶ 全画面';
      }
    });
    root.addEventListener('keydown', ev => {
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(ev.target.tagName)) return;
      if (ev.key === 'ArrowRight') { ev.preventDefault(); nextB.click(); }
      else if (ev.key === 'ArrowLeft') { ev.preventDefault(); go(i - 1); }
    });
    let x0 = null;
    stage.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', e => {
      if (x0 == null) return;
      const dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 60) { if (dx < 0) nextB.click(); else go(i - 1); }
    }, { passive: true });

    go(0);
    return { go, root };
  }

  global.LampSlides = { mount, renderSlide, fmt, blockTypes: Object.keys(R) };
})(typeof window !== 'undefined' ? window : globalThis);
