import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const questsPath = path.join(repoRoot, 'docs', 'data', 'quests.json');
const templatePath = path.join(__dirname, 'map-template.html');
const outPath = path.join(repoRoot, 'docs', 'map.html');
const storiesPath = path.join(__dirname, 'Story-Entries.ps1');

function parseDomainStories(ps1) {
  const stories = {};
  const re = /'([^']+)'\s*=\s*@\{\s*Npc\s*=\s*'([^']*)'\s*;\s*Synopsis\s*=\s*'([^']*)'\s*;\s*EnterLine\s*=\s*'([^']*)'\s*\}/g;
  let m;
  while ((m = re.exec(ps1))) {
    stories[m[1]] = { npc: m[2], synopsis: m[3], enter: m[4] };
  }
  return stories;
}

function parseDomainAwards(ps1) {
  const awards = {};
  // Get-LampDomainClearTitles block — optional
  const block = ps1.match(/function Get-LampDomainClearTitles[\s\S]*?return @\{([\s\S]*?)\n\s*\}/);
  if (!block) return awards;
  const re = /'([^']+)'\s*=\s*'([^']*)'/g;
  let m;
  while ((m = re.exec(block[1]))) awards[m[1]] = m[2];
  return awards;
}

const quests = JSON.parse(fs.readFileSync(questsPath, 'utf8'));
const lessons = quests.lessons || [];
if (!lessons.length) throw new Error('quests.json has no lessons');

const storiesPs1 = fs.readFileSync(storiesPath, 'utf8');
const stories = parseDomainStories(storiesPs1);
const awards = parseDomainAwards(storiesPs1);

const advisories = {
  underground: '地下は領域内の順に進みます。手前の砦の灯がすべて点くまで、先の砦へは入れません。',
  land: '陸地は空の関門と地下の最深部がすべて灯るまで開通しません。'
};

const byDomain = new Map();
for (const L of lessons) {
  if (!byDomain.has(L.domain)) byDomain.set(L.domain, []);
  byDomain.get(L.domain).push(L);
}

const domainOrder = [...byDomain.entries()].sort((a, b) => {
  const amin = Math.min(...a[1].map(x => x.courseNo));
  const bmin = Math.min(...b[1].map(x => x.courseNo));
  return amin - bmin;
});

const domains = domainOrder.map(([id, ls]) => {
  ls.sort((a, b) => a.courseNo - b.courseNo);
  const first = ls[0];
  const s = stories[id] || {};
  return {
    id,
    title: first.domainTitle,
    realm: first.realm,
    exam: first.examField || '',
    npc: s.npc || '案内人',
    synopsis: s.synopsis || '',
    enter: s.enter || '',
    award: awards[id] || undefined,
    advisory: advisories[first.realm]
  };
});

const lessonData = lessons
  .slice()
  .sort((a, b) => a.courseNo - b.courseNo)
  .map(L => ({
    no: L.courseNo,
    title: L.blurb || L.title,
    domain: L.domain,
    path: L.path
  }));

const data = {
  prologue: '雲と海の上に浮かぶランプ諸島。港から空か地下へ出発し、各土地では灯を点けると次へ進めます。陸地は、空の関門と地下の最深部がすべて灯ってから開きます。',
  githubRepo: 'educoder-lab/Lamp-archipelago',
  pagesUrl: 'https://educoder-lab.github.io/Lamp-archipelago/map.html',
  domains,
  lessons: lessonData
};

const json = JSON.stringify(data);
const template = fs.readFileSync(templatePath, 'utf8');
if (!template.includes('/*__LAMP_DATA__*/null')) {
  throw new Error('map-template.html missing DATA placeholder');
}
const html = template.replace('/*__LAMP_DATA__*/null', json);
fs.writeFileSync(outPath, html, 'utf8');

const check = fs.readFileSync(outPath, 'utf8');
if (check.includes('"domains":[]')) throw new Error('still empty domains');
console.log(`OK: wrote map.html with ${domains.length} domains, ${lessonData.length} lessons`);
const realms = {};
for (const d of domains) realms[d.realm] = (realms[d.realm] || 0) + 1;
console.log(realms);
