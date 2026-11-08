/* ランプ諸島 — Supabase Auth（Google）＋進捗クラウド同期 */
(function (global) {
  'use strict';

  const cfg = global.LAMP_SUPABASE || {};
  const enabled = !!(cfg.url && cfg.anonKey && String(cfg.url).indexOf('YOUR_PROJECT') < 0 && cfg.anonKey !== 'YOUR_ANON_PUBLIC_KEY');

  let client = null;
  let session = null;
  let pushTimer = null;
  let syncing = false;
  const listeners = [];

  function emit() {
    const info = { enabled, user: session && session.user ? session.user : null };
    listeners.forEach(fn => { try { fn(info); } catch (e) { /* ignore */ } });
  }

  function onAuthChange(fn) {
    listeners.push(fn);
    fn({ enabled, user: session && session.user ? session.user : null });
  }

  function uniqNums(arr) {
    return [...new Set((arr || []).map(n => parseInt(n, 10)).filter(n => Number.isFinite(n)))].sort((a, b) => a - b);
  }
  function uniqStr(arr) {
    return [...new Set((arr || []).filter(Boolean))];
  }

  function mergeSaves(a, b) {
    const def = global.LampSave ? global.LampSave.defaultSave() : {
      displayName: '旅人', clearedIds: [], clearedNos: [], skippedNos: [], titles: [],
      lastLessonId: null, lastCourseNo: 0, updatedAt: null, repoRoot: null
    };
    const out = Object.assign({}, def);
    out.clearedNos = uniqNums([].concat(a.clearedNos || [], b.clearedNos || []));
    out.skippedNos = uniqNums([].concat(a.skippedNos || [], b.skippedNos || []))
      .filter(n => !out.clearedNos.includes(n));
    out.titles = uniqStr([].concat(a.titles || [], b.titles || []));
    out.clearedIds = uniqStr([].concat(a.clearedIds || [], b.clearedIds || []));
    const an = (a.displayName && a.displayName !== '旅人') ? a.displayName : '';
    const bn = (b.displayName && b.displayName !== '旅人') ? b.displayName : '';
    out.displayName = an || bn || a.displayName || b.displayName || '旅人';
    out.lastLessonId = a.lastLessonId || b.lastLessonId || null;
    out.lastCourseNo = Math.max(a.lastCourseNo || 0, b.lastCourseNo || 0) || 0;
    out.repoRoot = a.repoRoot || b.repoRoot || null;
    const ta = a.updatedAt ? Date.parse(a.updatedAt) : 0;
    const tb = b.updatedAt ? Date.parse(b.updatedAt) : 0;
    out.updatedAt = (ta >= tb ? a.updatedAt : b.updatedAt) || a.updatedAt || b.updatedAt || null;
    return out;
  }

  function payloadFromSave(save) {
    return {
      displayName: save.displayName,
      clearedIds: save.clearedIds || [],
      clearedNos: save.clearedNos || [],
      skippedNos: save.skippedNos || [],
      titles: save.titles || [],
      lastLessonId: save.lastLessonId || null,
      lastCourseNo: save.lastCourseNo || 0,
      updatedAt: save.updatedAt || new Date().toISOString()
    };
  }

  async function ensureClient() {
    if (!enabled) return null;
    if (client) return client;
    if (!global.supabase || !global.supabase.createClient) {
      console.warn('LampCloud: supabase-js が読み込まれていません');
      return null;
    }
    client = global.supabase.createClient(cfg.url, cfg.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      }
    });
    return client;
  }

  async function pullAndMerge() {
    const c = await ensureClient();
    if (!c || !session || !session.user || !global.LampSave) return null;
    syncing = true;
    try {
      const { data, error } = await c.from('lamp_progress').select('save, updated_at').eq('user_id', session.user.id).maybeSingle();
      if (error) throw error;
      const local = global.LampSave.loadLocal();
      const remote = (data && data.save) ? data.save : null;
      if (!remote) {
        await pushNow();
        return local;
      }
      const merged = mergeSaves(local, remote);
      global.LampSave.writeLocal(merged);
      await pushNow();
      return merged;
    } finally {
      syncing = false;
    }
  }

  async function pushNow() {
    const c = await ensureClient();
    if (!c || !session || !session.user || !global.LampSave) return;
    const save = global.LampSave.loadLocal();
    const body = payloadFromSave(save);
    const { error } = await c.from('lamp_progress').upsert({
      user_id: session.user.id,
      save: body,
      updated_at: body.updatedAt || new Date().toISOString()
    }, { onConflict: 'user_id' });
    if (error) console.warn('LampCloud push:', error.message || error);
  }

  function schedulePush() {
    if (!enabled || !session || syncing) return;
    if (pushTimer) clearTimeout(pushTimer);
    pushTimer = setTimeout(() => { pushTimer = null; pushNow(); }, 500);
  }

  async function signInWithGoogle() {
    const c = await ensureClient();
    if (!c) throw new Error('Supabase が未設定です（docs/supabase-config.js）');
    const redirectTo = global.location.origin + global.location.pathname + global.location.search;
    const { error } = await c.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo, skipBrowserRedirect: false }
    });
    if (error) throw error;
  }

  async function signOut() {
    const c = await ensureClient();
    if (!c) return;
    await c.auth.signOut();
    session = null;
    emit();
  }

  function currentUser() {
    return session && session.user ? session.user : null;
  }

  function isEnabled() { return enabled; }

  async function init() {
    if (!enabled) { emit(); return { enabled: false, user: null }; }
    const c = await ensureClient();
    if (!c) { emit(); return { enabled: false, user: null }; }
    const { data } = await c.auth.getSession();
    session = data.session || null;
    const fromOAuth = /[?&]code=/.test(global.location.search) || /access_token=/.test(global.location.hash || '');
    c.auth.onAuthStateChange(async (event, s) => {
      session = s;
      emit();
      if (s && event === 'SIGNED_IN' && fromOAuth) {
        try {
          await pullAndMerge();
          const path = global.location.pathname;
          const qs = global.location.search
            .replace(/[?&]code=[^&]*/g, '')
            .replace(/[?&]state=[^&]*/g, '')
            .replace(/^&/, '?')
            .replace(/^\?$/, '');
          global.history.replaceState({}, '', path + qs);
          global.location.reload();
        } catch (e) {
          console.warn('LampCloud sync:', e);
        }
      }
    });
    emit();
    if (session && !fromOAuth) {
      try { await pullAndMerge(); } catch (e) { console.warn('LampCloud pull:', e); }
    }
    return { enabled: true, user: currentUser() };
  }

  /** ヘッダ／パネル用の小さなログイン UI を root に描画 */
  function mountAuthControls(root, opts) {
    opts = opts || {};
    if (!root) return;
    root.innerHTML = '';
    if (!enabled) {
      if (opts.showDisabledHint) {
        const tip = document.createElement('span');
        tip.className = opts.classStat || '';
        tip.style.fontSize = '12px';
        tip.textContent = 'クラウド未設定';
        tip.title = 'docs/supabase-config.js に Project URL と anon key を入れると Google ログインが使えます';
        root.appendChild(tip);
      }
      return;
    }
    const wrap = document.createElement('span');
    wrap.style.display = 'inline-flex';
    wrap.style.alignItems = 'center';
    wrap.style.gap = '8px';
    wrap.style.flexWrap = 'wrap';

    function paint(info) {
      wrap.innerHTML = '';
      if (info.user) {
        const mail = info.user.email || info.user.id.slice(0, 8);
        const label = document.createElement('span');
        label.textContent = '☁ ' + mail;
        label.title = 'クラウド同期中';
        label.style.fontSize = '12px';
        const out = document.createElement('button');
        out.type = 'button';
        out.textContent = 'ログアウト';
        out.className = opts.btnClass || 'panel-btn';
        out.onclick = () => signOut().then(() => { if (opts.reloadOnChange !== false) location.reload(); });
        wrap.appendChild(label);
        wrap.appendChild(out);
      } else {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = 'Google でログイン';
        btn.className = opts.btnClass || 'panel-btn';
        btn.onclick = () => signInWithGoogle().catch(e => alert('ログインできません: ' + (e.message || e)));
        wrap.appendChild(btn);
      }
    }
    onAuthChange(paint);
    root.appendChild(wrap);
  }

  global.LampCloud = {
    init,
    isEnabled,
    currentUser,
    signInWithGoogle,
    signOut,
    schedulePush,
    pushNow,
    pullAndMerge,
    onAuthChange,
    mountAuthControls,
    mergeSaves
  };

  // 自動初期化（スクリプト読込後）
  if (global.document && global.document.readyState === 'loading') {
    global.document.addEventListener('DOMContentLoaded', () => { init(); });
  } else {
    init();
  }
})(typeof window !== 'undefined' ? window : globalThis);
