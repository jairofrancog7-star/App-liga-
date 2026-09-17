import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { gunzipSync } from 'node:zlib';

const root = process.cwd();
const parts = ["part00.txt", "part01.txt", "part02.txt", "part03.txt", "part04.txt", "part05.txt", "part06.txt", "part07.txt", "part08.txt"];
let encoded = '';
for (const part of parts) encoded += await readFile(resolve(root, 'project-payload', part), 'utf8');
const payload = JSON.parse(gunzipSync(Buffer.from(encoded, 'base64')).toString('utf8'));
for (const [path, item] of Object.entries(payload)) {
  const target = resolve(root, path);
  await mkdir(dirname(target), { recursive: true });
  const data = item.encoding === 'base64' ? Buffer.from(item.content, 'base64') : item.content;
  await writeFile(target, data);
  console.log('materialized', path);
}
