/* ランプ諸島 — ブラウザ進捗（localStorage + save-data.js 併用） */
(function (global) {
  const SAVE_KEY = 'lamp_adventure_v1';

  function defaultSave() {
    return {
      displayName: '旅人',
      clearedIds: [],
      clearedNos: [],
      skippedNos: [],
      missedNos: [],
      titles: [],
      lastLessonId: null,
      lastCourseNo: 0,
      xp: 0,
      level: 1,
      avatarStyle: 'lampbearer',
      updatedAt: null,
      repoRoot: null
    };
  }

  function levelFromXp(xp) {
    return 1 + Math.floor((Math.max(0, xp) || 0) / 5);
  }

  function syncLevel(save) {
    save.xp = Math.max(0, parseInt(save.xp, 10) || 0);
    save.level = levelFromXp(save.xp);
    if (!save.avatarStyle) save.avatarStyle = 'lampbearer';
    return save;
  }

  /** XP into next level (0..1) */
  function xpProgress(save) {
    const xp = Math.max(0, parseInt(save.xp, 10) || 0);
    return (xp % 5) / 5;
  }

  function uniqNums(arr) {
    return [...new Set(arr.map(n => parseInt(n, 10)).filter(n => Number.isFinite(n)))].sort((a, b) => a - b);
  }

  function uniqStr(arr) {
    return [...new Set(arr.filter(Boolean))];
  }

  function loadLocal() {
    try {
      const raw = global.localStorage && global.localStorage.getItem(SAVE_KEY);
      if (!raw) return defaultSave();
      return syncLevel(Object.assign(defaultSave(), JSON.parse(raw)));
    } catch {
      return defaultSave();
    }
  }

  function writeLocal(save) {
    if (!global.localStorage) return;
    save.updatedAt = new Date().toISOString();
    global.localStorage.setItem(SAVE_KEY, JSON.stringify(save));
    if (global.LampCloud && typeof global.LampCloud.schedulePush === 'function') {
      global.LampCloud.schedulePush();
    }
  }

  function loadMerged() {
    const loc = loadLocal();
    const file = global.LAMP_SAVE;
    if (!file || typeof file !== 'object') return loc;
    const merged = defaultSave();
    merged.clearedNos = uniqNums([].concat(file.clearedNos || [], loc.clearedNos || []));
    merged.skippedNos = uniqNums([].concat(file.skippedNos || [], loc.skippedNos || []))
      .filter(n => !merged.clearedNos.includes(n));
    merged.missedNos = uniqNums([].concat(file.missedNos || [], loc.missedNos || []));
    merged.titles = uniqStr([].concat(file.titles || [], loc.titles || []));
    merged.clearedIds = uniqStr([].concat(file.clearedIds || [], loc.clearedIds || []));
    merged.displayName = (loc.displayName && loc.displayName !== '旅人') ? loc.displayName
      : (file.displayName || loc.displayName || '旅人');
    merged.lastLessonId = loc.lastLessonId || file.lastLessonId || null;
    merged.lastCourseNo = Math.max(loc.lastCourseNo || 0, file.lastCourseNo || 0) || loc.lastCourseNo || file.lastCourseNo || 0;
    merged.repoRoot = file.repoRoot || loc.repoRoot || null;
    merged.xp = Math.max(loc.xp || 0, file.xp || 0);
    merged.avatarStyle = loc.avatarStyle || file.avatarStyle || 'lampbearer';
    const tu = loc.updatedAt ? Date.parse(loc.updatedAt) : 0;
    const fu = file.updatedAt ? Date.parse(file.updatedAt) : 0;
    merged.updatedAt = (tu >= fu ? loc.updatedAt : file.updatedAt) || loc.updatedAt || file.updatedAt || null;
    merged._sources = { local: tu > 0, file: !!file };
    return syncLevel(merged);
  }

  function registerClear(save, lesson) {
    const result = { save, newClear: false, newTitles: [], leveledUp: false, prevLevel: save.level || 1 };
    if (!save.clearedIds.includes(lesson.lessonId)) {
      result.newClear = true;
      save.clearedIds.push(lesson.lessonId);
      save.clearedNos = uniqNums(save.clearedNos.concat([lesson.courseNo]));
      save.xp = (save.xp || 0) + 1;
      for (const t of (lesson.titleAwards || [])) {
        if (!save.titles.includes(t)) {
          save.titles.push(t);
          result.newTitles.push(t);
          save.xp = (save.xp || 0) + 2;
        }
      }
    }
    save.skippedNos = save.skippedNos.filter(n => n !== lesson.courseNo);
    save.lastLessonId = lesson.lessonId;
    save.lastCourseNo = lesson.courseNo;
    const prev = result.prevLevel;
    syncLevel(save);
    result.leveledUp = save.level > prev;
    result.save = save;
    writeLocal(save);
    return result;
  }

  function registerSkip(save, courseNo) {
    if (save.clearedNos.includes(courseNo)) return false;
    if (!save.skippedNos.includes(courseNo)) {
      save.skippedNos = uniqNums(save.skippedNos.concat([courseNo]));
      writeLocal(save);
    }
    return true;
  }

  /** 未合格を記録（復習リスト用。クリア後も残す） */
  function registerMiss(save, courseNo) {
    const n = parseInt(courseNo, 10);
    if (!Number.isFinite(n) || n <= 0) return save;
    if (!save.missedNos) save.missedNos = [];
    if (!save.missedNos.includes(n)) {
      save.missedNos = uniqNums(save.missedNos.concat([n]));
      writeLocal(save);
    }
    return save;
  }

  function unregisterSkip(save, courseNo) {
    save.skippedNos = save.skippedNos.filter(n => n !== courseNo);
    writeLocal(save);
    return true;
  }

  function setDisplayName(save, name) {
    save.displayName = (String(name || '').trim()) || '旅人';
    writeLocal(save);
    return save;
  }

  function sanitizeImported(obj) {
    if (!obj || typeof obj !== 'object') throw new Error('JSON オブジェクトではありません');
    const save = defaultSave();
    save.displayName = (obj.displayName && String(obj.displayName).trim()) || '旅人';
    save.clearedIds = uniqStr([].concat(obj.clearedIds || []));
    save.clearedNos = uniqNums([].concat(obj.clearedNos || []));
    save.skippedNos = uniqNums([].concat(obj.skippedNos || []))
      .filter(n => !save.clearedNos.includes(n));
    save.missedNos = uniqNums([].concat(obj.missedNos || []));
    save.titles = uniqStr([].concat(obj.titles || []));
    save.lastLessonId = obj.lastLessonId || null;
    save.lastCourseNo = parseInt(obj.lastCourseNo, 10) || 0;
    save.repoRoot = obj.repoRoot || null;
    save.xp = Math.max(0, parseInt(obj.xp, 10) || 0);
    save.avatarStyle = obj.avatarStyle || 'lampbearer';
    return syncLevel(save);
  }

  function exportLocalJson(pretty) {
    return JSON.stringify(loadLocal(), null, pretty ? 2 : 0);
  }

  function importFromJson(text) {
    const obj = JSON.parse(text);
    const save = sanitizeImported(obj);
    writeLocal(save);
    return save;
  }

  function resetLocal() {
    if (global.localStorage) global.localStorage.removeItem(SAVE_KEY);
    return defaultSave();
  }

  function downloadExport(filename) {
    const fn = filename || 'lamp-adventure-save.json';
    const blob = new Blob([exportLocalJson(true)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = global.document.createElement('a');
    a.href = url;
    a.download = fn;
    a.click();
    URL.revokeObjectURL(url);
  }

  function saveSourceLabel(save) {
    if (save._sources && save._sources.local && save._sources.file) return 'ブラウザ＋ローカル同期';
    if (save._sources && save._sources.local) return 'ブラウザ記録';
    if (save._sources && save._sources.file) return 'save-data.js（Show-Map）';
    return '記録なし';
  }

  global.LampSave = {
    SAVE_KEY,
    defaultSave,
    loadLocal,
    loadMerged,
    writeLocal,
    registerClear,
    registerSkip,
    registerMiss,
    unregisterSkip,
    setDisplayName,
    exportLocalJson,
    importFromJson,
    resetLocal,
    downloadExport,
    saveSourceLabel,
    levelFromXp,
    syncLevel,
    xpProgress
  };
})(typeof window !== 'undefined' ? window : globalThis);
