/**
 * 既存スプライト JPG から背景を除去し、同名 .png を出力する。
 * 用法: node _tools/remove-asset-mattes.mjs [--force]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { removeBackground } from '@imgly/background-removal-node';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const assetsRoot = path.join(repoRoot, 'docs', 'assets');
const force = process.argv.includes('--force');

const KEEP_JPG_PLATES = new Set([
  'bg.jpg',
  'say-frame.jpg',
  'app-icon.jpg',
  'band-shield.jpg',
  'band-sword.jpg',
  'band-spirit.jpg'
]);

function listSpriteJpgs() {
  const out = [];
  const walk = (dir) => {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        if (ent.name === 'mood' || ent.name === 'slides') continue;
        walk(full);
        continue;
      }
      if (!/\.jpe?g$/i.test(ent.name)) continue;
      if (KEEP_JPG_PLATES.has(ent.name.toLowerCase())) continue;
      // map/bg はプレート
      const rel = path.relative(assetsRoot, full).replace(/\\/g, '/');
      if (rel === 'map/bg.jpg') continue;
      out.push(full);
    }
  };
  walk(assetsRoot);
  return out.sort();
}

async function blobToBuffer(blob) {
  const ab = await blob.arrayBuffer();
  return Buffer.from(ab);
}

async function processOne(jpgPath) {
  const pngPath = jpgPath.replace(/\.jpe?g$/i, '.png');
  if (!force && fs.existsSync(pngPath)) {
    console.log('skip', path.relative(repoRoot, pngPath));
    return 'skip';
  }
  const srcUrl = pathToFileURL(jpgPath).href;
  console.log('cut', path.relative(repoRoot, jpgPath));
  const blob = await removeBackground(srcUrl, {
    model: 'small',
    output: { format: 'image/png', type: 'foreground' }
  });
  fs.writeFileSync(pngPath, await blobToBuffer(blob));
  return 'ok';
}

async function main() {
  const files = listSpriteJpgs();
  console.log(`sprites: ${files.length}`);
  let ok = 0;
  let skip = 0;
  let fail = 0;
  for (const f of files) {
    try {
      const r = await processOne(f);
      if (r === 'skip') skip += 1;
      else ok += 1;
    } catch (e) {
      fail += 1;
      console.error('FAIL', path.relative(repoRoot, f), e && e.message ? e.message : e);
    }
  }
  console.log(`done ok=${ok} skip=${skip} fail=${fail}`);
  if (fail) process.exitCode = 1;
}

main();
