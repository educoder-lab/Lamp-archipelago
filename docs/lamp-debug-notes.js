/**
 * デバッグノート（正本: docs/debug-notes.md）
 * マップ・講座の両方から同じ UI / localStorage / File System Access を使う。
 */
(function (global) {
  const NOTES_KEY = 'lamp-debug-notes';
  const NOTES_HANDLE_DB = 'lamp-debug-notes-fs';
  const NOTES_HANDLE_STORE = 'handles';
  const NOTES_HANDLE_KEY = 'debug-notes-md';

  const CSS = `
.lamp-notes-btn {
  display: inline-flex; align-items: center; gap: 6px;
  font: inherit; cursor: pointer; border-radius: 8px; padding: 6px 12px;
  border: 1px solid #343a6b; background: #1f2447; color: #ece9f5;
}
.lamp-notes-btn:hover { border-color: #7fd1ff; }
.lamp-notes-btn img { width: 18px; height: 18px; border-radius: 4px; object-fit: cover; }
.lamp-notes-overlay {
  position: fixed; inset: 0; z-index: 120; display: none;
  align-items: center; justify-content: center;
  background: rgba(6, 8, 18, 0.72);
}
.lamp-notes-overlay.show { display: flex; }
.lamp-notes-card {
  width: min(640px, calc(100% - 24px)); max-height: min(80vh, 720px);
  background: #171b36; border: 1px solid #343a6b; border-radius: 14px;
  padding: 14px 16px; box-shadow: 0 16px 40px rgba(0,0,0,.5);
  display: flex; flex-direction: column; gap: 10px; color: #ece9f5;
}
.lamp-notes-card h2 { margin: 0; font-size: 16px; color: #f5c451; }
.lamp-notes-card textarea {
  width: 100%; min-height: 280px; resize: vertical; flex: 1;
  background: #0b0e1f; color: #ece9f5; border: 1px solid #343a6b;
  border-radius: 8px; padding: 10px; font: inherit; font-size: 14px; line-height: 1.5;
}
.lamp-notes-meta { font-size: 11px; color: #9aa0c4; margin: 0; }
.lamp-notes-meta code { font-size: 11px; }
.lamp-notes-actions { display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-end; }
.lamp-notes-actions button {
  font: inherit; cursor: pointer; border-radius: 8px; padding: 8px 14px;
  border: 1px solid #343a6b; background: #1f2447; color: #ece9f5;
}
@media print {
  .lamp-notes-btn, .lamp-notes-overlay { display: none !important; }
}
`;

  function ensureStyle() {
    if (document.getElementById('lamp-debug-notes-style')) return;
    const s = document.createElement('style');
    s.id = 'lamp-debug-notes-style';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function notesMdTemplate(openBody) {
    const body = (openBody && String(openBody).trim())
      ? String(openBody).replace(/\s+$/, '') + '\n'
      : '（まだなし）\n';
    return [
      '# デバッグノート',
      '',
      'マップ／講座の修正メモ（正本）。ブラウザのノートUIと同期する。',
      'エージェントへ「デバッグノートを見て修正して」と言ったら、ここを読んで直し、**直した項目はこのファイルから削除**する。',
      '',
      '## 未処理',
      '',
      body
    ].join('\n');
  }

  function parseNotesOpenBody(md) {
    // /m の $ は「行末」にマッチするため、非貪欲キャプチャが先頭行だけで止まっていた
    const text = String(md || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const m = text.match(/(?:^|\n)##\s*未処理\s*\n([\s\S]*?)(?=\n##\s|$)/);
    if (m) return m[1].replace(/^\n+/, '').replace(/\s+$/, '');
    return text.trim();
  }

  function notesOpenBodyIsEmpty(body) {
    const t = String(body || '').trim();
    return !t || t === '（まだなし）';
  }

  function notesIdb() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(NOTES_HANDLE_DB, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(NOTES_HANDLE_STORE)) db.createObjectStore(NOTES_HANDLE_STORE);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function loadNotesFileHandle() {
    try {
      const db = await notesIdb();
      return await new Promise((resolve, reject) => {
        const tx = db.transaction(NOTES_HANDLE_STORE, 'readonly');
        const g = tx.objectStore(NOTES_HANDLE_STORE).get(NOTES_HANDLE_KEY);
        g.onsuccess = () => resolve(g.result || null);
        g.onerror = () => reject(g.error);
      });
    } catch (_) { return null; }
  }

  async function saveNotesFileHandle(handle) {
    try {
      const db = await notesIdb();
      await new Promise((resolve, reject) => {
        const tx = db.transaction(NOTES_HANDLE_STORE, 'readwrite');
        tx.objectStore(NOTES_HANDLE_STORE).put(handle, NOTES_HANDLE_KEY);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch (_) { /* ignore */ }
  }

  async function writeNotesToHandle(handle, openBody) {
    if (!handle || !handle.createWritable) return false;
    const perm = handle.queryPermission ? await handle.queryPermission({ mode: 'readwrite' }) : 'granted';
    if (perm !== 'granted') {
      const req = handle.requestPermission ? await handle.requestPermission({ mode: 'readwrite' }) : 'denied';
      if (req !== 'granted') return false;
    }
    const w = await handle.createWritable();
    await w.write(notesMdTemplate(openBody));
    await w.close();
    return true;
  }

  function downloadNotesMd(openBody) {
    const blob = new Blob([notesMdTemplate(openBody)], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'debug-notes.md';
    a.click();
    URL.revokeObjectURL(url);
  }

  let ui = null;
  let saveTimer = 0;

  async function persistNotes(openBody, opts) {
    opts = opts || {};
    const body = openBody == null ? '' : String(openBody);
    try { localStorage.setItem(NOTES_KEY, body); } catch (_) { /* ignore */ }
    let wrote = false;
    const handle = await loadNotesFileHandle();
    if (handle) wrote = await writeNotesToHandle(handle, body);
    if (!wrote && opts.forceDownload) downloadNotesMd(body);
    if (ui && ui.meta) {
      ui.meta.textContent = wrote
        ? 'docs/debug-notes.md に書き込みました（接続済み）。'
        : 'localStorage に保存。MD 正本へは「MDに接続」または「MD保存」を使ってください。';
    }
    return wrote;
  }

  async function loadNotesText() {
    try {
      const handle = await loadNotesFileHandle();
      if (handle) {
        const perm = handle.queryPermission ? await handle.queryPermission({ mode: 'readwrite' }) : 'granted';
        if (perm === 'granted' || (handle.requestPermission && (await handle.requestPermission({ mode: 'readwrite' })) === 'granted')) {
          const file = await handle.getFile();
          const body = parseNotesOpenBody(await file.text());
          localStorage.setItem(NOTES_KEY, body);
          return body;
        }
      }
    } catch (_) { /* fall through */ }

    if (typeof global.LAMP_DEBUG_NOTES_MD === 'string' && global.LAMP_DEBUG_NOTES_MD.length) {
      const body = parseNotesOpenBody(global.LAMP_DEBUG_NOTES_MD);
      if (!notesOpenBodyIsEmpty(body) || !localStorage.getItem(NOTES_KEY)) {
        localStorage.setItem(NOTES_KEY, body);
        return body;
      }
    }

    try {
      const res = await fetch('debug-notes.md', { cache: 'no-store' });
      if (res.ok) {
        const body = parseNotesOpenBody(await res.text());
        localStorage.setItem(NOTES_KEY, body);
        return body;
      }
    } catch (_) { /* fall through */ }

    return localStorage.getItem(NOTES_KEY) || '';
  }

  async function openNotes() {
    if (!ui) return;
    ui.text.value = await loadNotesText();
    if (notesOpenBodyIsEmpty(ui.text.value)) ui.text.value = '';
    ui.overlay.classList.add('show');
    ui.text.focus();
  }

  async function closeNotes() {
    if (!ui) return;
    await persistNotes(ui.text.value || '');
    ui.overlay.classList.remove('show');
  }

  function isOpen() {
    return !!(ui && ui.overlay.classList.contains('show'));
  }

  function ensureUi(opts) {
    opts = opts || {};
    ensureStyle();

    let btn = opts.button || document.getElementById(opts.buttonId || 'notes-btn');
    if (!btn) {
      btn = document.createElement('button');
      btn.type = 'button';
      btn.id = 'notes-btn';
      btn.className = 'lamp-notes-btn';
      btn.title = '修正メモ（デバッグノート）';
      btn.innerHTML = '<img src="assets/common/icon-notes.jpg" alt="">ノート';
      const parent = opts.buttonParent || document.querySelector('header') || document.body;
      parent.appendChild(btn);
    } else {
      btn.classList.add('lamp-notes-btn');
    }

    let overlay = document.getElementById('notes-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'notes-overlay';
      overlay.className = 'lamp-notes-overlay';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-labelledby', 'notes-title');
      overlay.innerHTML = [
        '<div class="lamp-notes-card notes-card">',
        '  <h2 id="notes-title">修正メモ（デバッグノート）</h2>',
        '  <p class="lamp-notes-meta notes-meta" id="notes-meta">正本は <code>docs/debug-notes.md</code>。マップでも講座でも同じメモです。</p>',
        '  <textarea id="notes-text" placeholder="気づいた修正点・TODO を書いておく（1行1項目がおすすめ）…"></textarea>',
        '  <div class="lamp-notes-actions modal-actions">',
        '    <button type="button" id="notes-link-file" title="docs/debug-notes.md を選んで直接書き込む">MDに接続</button>',
        '    <button type="button" id="notes-download">MD保存</button>',
        '    <button type="button" id="notes-clear">クリア</button>',
        '    <button type="button" id="notes-close">とじる</button>',
        '  </div>',
        '</div>'
      ].join('\n');
      document.body.appendChild(overlay);
    } else {
      overlay.classList.add('lamp-notes-overlay');
    }

    ui = {
      button: btn,
      overlay: overlay,
      text: document.getElementById('notes-text'),
      meta: document.getElementById('notes-meta')
    };
    return ui;
  }

  function bindUi() {
    if (!ui || ui._bound) return;
    ui._bound = true;

    ui.button.addEventListener('click', () => { openNotes(); });
    document.getElementById('notes-close').onclick = () => { closeNotes(); };
    document.getElementById('notes-download').onclick = () => {
      downloadNotesMd(ui.text.value || '');
      if (ui.meta) ui.meta.textContent = 'debug-notes.md をダウンロードしました。docs/ に上書き保存してください。';
    };
    document.getElementById('notes-link-file').onclick = async () => {
      try {
        if (!global.showSaveFilePicker && !global.showOpenFilePicker) {
          downloadNotesMd(ui.text.value || '');
          if (ui.meta) ui.meta.textContent = 'このブラウザは直接接続非対応のため、MDをダウンロードしました。';
          return;
        }
        let handle = null;
        if (global.showOpenFilePicker) {
          const picks = await global.showOpenFilePicker({
            multiple: false,
            types: [{ description: 'Markdown', accept: { 'text/markdown': ['.md'], 'text/plain': ['.md', '.txt'] } }]
          });
          handle = picks && picks[0];
        } else {
          handle = await global.showSaveFilePicker({
            suggestedName: 'debug-notes.md',
            types: [{ description: 'Markdown', accept: { 'text/markdown': ['.md'] } }]
          });
        }
        if (!handle) return;
        await saveNotesFileHandle(handle);
        try {
          const file = await handle.getFile();
          const existing = parseNotesOpenBody(await file.text());
          if (!notesOpenBodyIsEmpty(existing) && notesOpenBodyIsEmpty(ui.text.value)) {
            ui.text.value = existing;
          }
        } catch (_) { /* ignore */ }
        const ok = await writeNotesToHandle(handle, ui.text.value || '');
        localStorage.setItem(NOTES_KEY, ui.text.value || '');
        if (ui.meta) {
          ui.meta.textContent = ok
            ? '接続しました。以降の編集は docs/debug-notes.md に自動書き込みます。'
            : '接続に失敗しました。MD保存を使ってください。';
        }
      } catch (err) {
        if (err && err.name === 'AbortError') return;
        downloadNotesMd(ui.text.value || '');
      }
    };
    document.getElementById('notes-clear').onclick = async () => {
      if (!confirm('メモをすべて消しますか？（debug-notes.md の未処理も空にします）')) return;
      ui.text.value = '';
      await persistNotes('', { forceDownload: false });
      const handle = await loadNotesFileHandle();
      if (handle) await writeNotesToHandle(handle, '');
    };
    ui.overlay.addEventListener('click', (ev) => {
      if (ev.target === ui.overlay || ev.target.id === 'notes-overlay') closeNotes();
    });
    ui.text.addEventListener('input', () => {
      localStorage.setItem(NOTES_KEY, ui.text.value || '');
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => { persistNotes(ui.text.value || ''); }, 800);
    });
    document.addEventListener('keydown', (ev) => {
      if (!isOpen()) return;
      // ノート表示中はマップ／ダンジョンへキーを渡さない
      if (ev.key === 'Escape') {
        ev.preventDefault();
        ev.stopPropagation();
        closeNotes();
        return;
      }
      // Enter / 矢印 / [ ] / F などがゲーム進行に刺さらないよう、入力欄内はそのまま
      if (ui && ui.text && (ev.target === ui.text || ui.text.contains(ev.target))) {
        ev.stopPropagation();
      }
    }, true);
  }

  function mount(opts) {
    ensureUi(opts || {});
    bindUi();
    return {
      open: openNotes,
      close: closeNotes,
      isOpen: isOpen
    };
  }

  global.LampDebugNotes = {
    NOTES_KEY,
    mount,
    open: openNotes,
    close: closeNotes,
    isOpen: isOpen,
    parseOpenBody: parseNotesOpenBody,
    mdTemplate: notesMdTemplate
  };
})(typeof window !== 'undefined' ? window : globalThis);
