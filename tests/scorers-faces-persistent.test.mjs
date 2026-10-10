import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');

test('Maximo goleador mantiene retratos completos y centrados',()=>{
  const html=read('index.html');
  const css=read('src/v1102-scorers-face-framing.css');
  const js=read('src/v1102-scorers-face-framing.js');
  const crop=read('src/v599-player-face-center-global.js');

  assert.match(html,/v1102-scorers-face-framing\.css\?v=/);
  assert.match(html,/v1102-scorers-face-framing\.js\?v=/);
  assert.match(css,/\.v391-feature-photo/);
  assert.match(css,/\.v390-scorer-photo/);
  assert.match(css,/object-fit:contain!important/);
  assert.match(css,/object-position:center center!important/);
  assert.match(js,/MutationObserver\(schedule\)/);
  assert.match(js,/--v1102-scorer-image/);
  assert.match(crop,/if\(img\.closest\('\.v391-feature-photo,\.v390-scorer-photo'\)\)/);
});

test('El encuadre de goleadores resiste cambios de categoria y recortes anteriores',()=>{
  const html=read('index.html');
  const css=read('src/v1102-scorers-face-framing.css');
  const js=read('src/v1102-scorers-face-framing.js');
  const renderer=read('src/v194-scorers-filters.js');
  assert.match(html,/v1211-scorer-faces-all-categories/);
  assert.match(css,/ljr-v1211-face-present/);
  assert.match(css,/background-image:none!important/);
  assert.match(css,/object-fit:contain!important/);
  assert.doesNotMatch(css,/object-fit:cover!important/);
  assert.match(renderer,/function heroScorerCard\(r,slot\)/);
  assert.match(renderer,/heroPlayerPhoto\(r\.player,r\.team,catId\(\)\)/);
  assert.match(js,/data-v194-cat/);
  assert.match(js,/MutationObserver\(schedule\)/);
  assert.match(js,/attributeFilter:\['style','src','class'/);
  assert.match(js,/normalizedStyles\[prop\]/);
});
