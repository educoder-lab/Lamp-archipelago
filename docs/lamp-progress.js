/* 進行ロック: 左＝盾／右＝剣／大扉の奥＝精神。道内は順次。奥は両道最深クリア後 */
(function (global) {
  function domainFullyCleared(d, cleared) {
    if (!d || !d.lessons || !d.lessons.length) return false;
    return d.lessons.every(l => cleared.has(l.no));
  }

  function domainsByRealm(domains, realm) {
    return domains
      .filter(d => d.realm === realm)
      .slice()
      .sort((a, b) => {
        const amin = Math.min(...(a.lessons || []).map(l => l.no));
        const bmin = Math.min(...(b.lessons || []).map(l => l.no));
        return amin - bmin;
      });
  }

  function deepestDomain(domains, realm) {
    const list = domainsByRealm(domains, realm);
    return list.length ? list[list.length - 1] : null;
  }

  function landUnlocked(domains, cleared) {
    const skyDeep = deepestDomain(domains, 'sky');
    const ugDeep = deepestDomain(domains, 'underground');
    return domainFullyCleared(skyDeep, cleared) && domainFullyCleared(ugDeep, cleared);
  }

  /** 盾・剣・精神の成長度（0〜1）。道内のクリア講座数／総講座数。セーブ項目は増やさない */
  function growthRanks(domains, cleared) {
    function rank(realm) {
      const list = domainsByRealm(domains, realm);
      let total = 0;
      let n = 0;
      list.forEach((d) => {
        (d.lessons || []).forEach((l) => {
          total += 1;
          if (cleared.has(l.no)) n += 1;
        });
      });
      if (!total) return { cleared: 0, total: 0, ratio: 0 };
      return { cleared: n, total: total, ratio: n / total };
    }
    return {
      shield: rank('sky'),
      sword: rank('underground'),
      spirit: rank('land')
    };
  }

  /**
   * 領域内順次開放 + 大扉ゲート。
   * @returns {{ landOpen: boolean, lockReason: string|null }}
   */
  function applyDomainStates(domains, cleared, nextLesson) {
    const landOpen = landUnlocked(domains, cleared);
    ['sky', 'underground', 'land'].forEach(realm => {
      const list = domainsByRealm(domains, realm);
      list.forEach((d, i) => {
        if (realm === 'land' && !landOpen) {
          d.state = 'fog';
          d.lockReason = 'その盾と剣ではまだ不十分だ。左で盾を、右で剣を鍛えなさい。';
          return;
        }
        if (d.total > 0 && domainFullyCleared(d, cleared)) {
          d.state = 'cleared';
          d.lockReason = null;
          return;
        }
        const prevCleared = i === 0 || domainFullyCleared(list[i - 1], cleared);
        if (!prevCleared) {
          d.state = 'fog';
          d.lockReason = '手前の分野の灯がすべて点くまで、ここへは進めません。';
          return;
        }
        if (nextLesson && d.id === nextLesson.domain) d.state = 'current';
        else d.state = 'open';
        d.lockReason = null;
      });
    });
    return {
      landOpen,
      lockReason: landOpen
        ? null
        : 'その盾と剣ではまだ不十分だ。左で盾を、右で剣を鍛えなさい。'
    };
  }

  /** 講座の挑戦可否（クリア済みは復習可、未クリアは前の灯が必要） */
  function lessonPlayable(lesson, domain, cleared, skipped) {
    if (!lesson || !domain) return { ok: false, reason: '講座が見つかりません。' };
    if (domain.state === 'fog') {
      return { ok: false, reason: domain.lockReason || 'この分野はまだ霧の中です。' };
    }
    if (cleared.has(lesson.no)) return { ok: true, reason: null };
    const ls = (domain.lessons || []).slice().sort((a, b) => a.no - b.no);
    for (const l of ls) {
      if (l.no === lesson.no) return { ok: true, reason: null };
      if (!cleared.has(l.no)) {
        return {
          ok: false,
          reason: '講座 ' + String(l.no).padStart(2, '0') + ' の灯を点けると、次へ進めます。'
        };
      }
    }
    return { ok: true, reason: null };
  }

  function realmAccessible(realm, landOpen) {
    if (realm === 'sky' || realm === 'underground') return { ok: true, reason: null };
    if (realm === 'land') {
      return landOpen
        ? { ok: true, reason: null }
        : { ok: false, reason: 'その盾と剣ではまだ不十分だ。左で盾を、右で剣を鍛えなさい。' };
    }
    return { ok: true, reason: null };
  }

  const api = {
    domainFullyCleared,
    domainsByRealm,
    deepestDomain,
    landUnlocked,
    growthRanks,
    applyDomainStates,
    lessonPlayable,
    realmAccessible
  };
  global.LampProgress = api;
  if (typeof module !== 'undefined') module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
