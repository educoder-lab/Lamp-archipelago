import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { removeBackground } from '@imgly/background-removal-node';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pairs = [
  ['docs/assets/rooms/hub/path-shield.jpg', 'docs/assets/rooms/hub/path-shield.png'],
  ['docs/assets/rooms/hub/path-sword.jpg', 'docs/assets/rooms/hub/path-sword.png']
];

for (const [jpgRel, pngRel] of pairs) {
  const jpg = path.join(root, jpgRel);
  const png = path.join(root, pngRel);
  console.log('cut', jpgRel);
  const blob = await removeBackground(pathToFileURL(jpg).href, {
    model: 'small',
    output: { format: 'image/png', type: 'foreground' }
  });
  fs.writeFileSync(png, Buffer.from(await blob.arrayBuffer()));
  console.log('wrote', pngRel, fs.statSync(png).size);
}
