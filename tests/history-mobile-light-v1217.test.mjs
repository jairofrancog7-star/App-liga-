import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Script} from 'node:vm';

const read=file=>readFileSync(new URL('../'+file,import.meta.url),'utf8');
const index=read('index.html');
const loader=read('src/v1217-history-lazy.js');
const history=read('src/v164-history-log.js');
const ai=read('src/v1215-history-local-ai.js');
const css=read('src/v1213-history-log-pro.css');

test('Historial se carga sólo al navegar, no aumenta el arranque global',()=>{
  assert.match(index,/src\/v1217-history-lazy\.js/);
  assert.doesNotMatch(index,/<script[^>]+src=["'][^"']*src\/v1215-history-local-ai\.js/);
  assert.doesNotMatch(index,/<script[^>]+src=["'][^"']*src\/v164-history-log\.js/);
  assert.match(loader,/import\('\.\/v164-history-log\.js'\)/);
  assert.match(loader,/import\('\.\/v1215-history-local-ai\.js'\)/);
  assert.match(loader,/historyLog/);
  new Script(loader);
});
test('IA local ligera no descarga modelos gigantes y funciona sin proveedor externo',()=>{
  assert.match(ai,/function quickIntent\(/);
  assert.match(ai,/const TRAINING=/);
  assert.doesNotMatch(ai,/transformers|jsdelivr|Xenova|huggingface|120 MB/i);
  assert.doesNotMatch(ai,/eval\(|new Function\(/);
  new Script(ai);
});
test('Automatización respeta datos móviles, caché y visibilidad',()=>{
  assert.match(ai,/CHECK_INTERVAL=30\*60\*1000/);
  assert.match(ai,/navigator\.connection\?\.saveData/);
  assert.match(ai,/document\.hidden/);
  assert.match(ai,/cache:'no-cache'/);
  assert.doesNotMatch(ai,/cache:'no-store'/);
  assert.doesNotMatch(ai,/setInterval\([^)]*60000/);
  assert.match(ai,/clearInterval\(refreshTimer\)/);
  assert.match(ai,/requestController\?\.abort\(\)/);
});
test('Resultados se paginan, no crecen ilimitadamente en la memoria del móvil',()=>{
  assert.match(history,/pageSize:10/);
  assert.match(history,/data-v164-next/);
  assert.match(history,/data-v164-prev/);
  assert.match(history,/searchTimer=setTimeout/);
  assert.match(history,/if\(db&&db===cachedOfficial&&cachedOfficialRows\)/);
  assert.match(css,/v164-history-pagination/);
  new Script(history);
});
