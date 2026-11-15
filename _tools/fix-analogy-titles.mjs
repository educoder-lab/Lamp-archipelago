/**
 * analogy 付きスライドの曖昧／誤抽出見出しを「用語とは」に直す。
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dirs = [
  path.join(root, '_tools', 'slides'),
  path.join(root, 'docs', 'data', 'slides')
];

const GENERIC = /^(まず[、,]?\s*)?たとえ話(から)?$|とは$/;
const SKIP = new Set(['ON', 'OFF', '0', '1', 'Yes', 'No', 'YES', 'NO']);

function termFromTech(tech) {
  const s = String(tech || '');
  const bolds = [...s.matchAll(/\*\*([^*]+)\*\*/g)].map((m) =>
    m[1].replace(/\s*=\s*.*$/, '').trim()
  );
  for (const b of bolds) {
    if (!b || SKIP.has(b)) continue;
    if (/^[A-Za-z][A-Za-z0-9/+-]{1,24}$/.test(b)) return b;
    if (/^[\u3040-\u30ff\u4e00-\u9fffA-Za-z0-9]{2,24}$/.test(b) && !/^(これ|それ|あれ|いいえ|はい)/.test(b)) {
      return b;
    }
  }
  return null;
}

function shouldFixTitle(title) {
  const t = String(title || '').trim();
  if (/^(まず[、,]?\s*)?たとえ話(から)?$/.test(t)) return true;
  // 誤抽出の残骸（短すぎ・不自然な「〜とは」）
  if (/とは$/.test(t)) {
    if (/^(これ|それ|あれ|いいえ|はい|電気の|有限桁なので)/.test(t)) return true;
    if (t.length <= 5) return true;
  }
  return false;
}

function fixSlide(s) {
  if (!s || typeof s.title !== 'string') return false;
  const analogy = (s.blocks || []).find((b) => b && b.t === 'analogy');
  if (!analogy) return false;
  if (!shouldFixTitle(s.title) && !/^(まず[、,]?\s*)?たとえ話(から)?$/.test(s.title.trim())) {
    // 既に良い見出しでも、analogy があり「たとえ話から」系だけ直す
    return false;
  }
  const term = termFromTech(analogy.tech);
  const next = term ? `${term}とは` : '用語のたとえ';
  if (s.title === next) return false;
  s.title = next;
  return true;
}

function walk(obj, acc) {
  if (!obj || typeof obj !== 'object') return;
  if (Array.isArray(obj)) {
    obj.forEach((x) => walk(x, acc));
    return;
  }
  if (Array.isArray(obj.slides)) {
    obj.slides.forEach((s) => { if (fixSlide(s)) acc.n++; });
  }
  if (obj.lessons && typeof obj.lessons === 'object') {
    Object.values(obj.lessons).forEach((L) => {
      if (L && Array.isArray(L.slides)) L.slides.forEach((s) => { if (fixSlide(s)) acc.n++; });
    });
  }
}

let total = 0;
for (const dir of dirs) {
  if (!fs.existsSync(dir)) continue;
  for (const name of fs.readdirSync(dir)) {
    if (!name.endsWith('.json')) continue;
    const fp = path.join(dir, name);
    let raw = fs.readFileSync(fp, 'utf8');
    const bom = raw.charCodeAt(0) === 0xfeff;
    if (bom) raw = raw.slice(1);
    const data = JSON.parse(raw);
    const acc = { n: 0 };
    walk(data, acc);
    if (acc.n) {
      fs.writeFileSync(fp, (bom ? '\uFEFF' : '') + JSON.stringify(data, null, 2) + '\n', 'utf8');
      total += acc.n;
      console.log(path.relative(root, fp), '+', acc.n);
    }
  }
}
console.log('fixed titles:', total);
