import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=(path)=>readFileSync(new URL('../'+path,import.meta.url),'utf8');

test('General, Equipo y Jugadores comienzan justo bajo la linea blanca',()=>{
  const html=read('index.html');
  const css=read('src/v1218-stats-sections-safe-edge.css');
  const render=read('src/v33-data-statistics-reference.js');
  assert.match(html,/v1218-stats-sections-safe-edge\.css\?v=20261010-v1218/);
  for(const mode of ['general','team','player']){
    assert.match(css,new RegExp('data-v33-mode="'+mode+'"'));
    assert.match(render,new RegExp("activeTab==='"+mode+"'"));
  }
  assert.match(css,/padding-top:var\(--v33-actual-head-h/);
  assert.match(css,/--v33-visible-gap-fix:0px!important/);
  assert.match(css,/padding:8px 10px 24px!important/);
});

test('Todos los carruseles permiten ver cada cuadro completo al deslizar',()=>{
  const css=read('src/v1218-stats-sections-safe-edge.css');
  assert.match(css,/overflow-x:auto!important/);
  assert.match(css,/scroll-snap-type:x mandatory!important/);
  assert.match(css,/scroll-padding-inline:12px!important/);
  assert.match(css,/padding:0 12px 12px!important/);
  assert.match(css,/flex:0 0 82%!important/);
  assert.match(css,/flex-basis:86%!important/);
  assert.doesNotMatch(css,/flex:0 0 100%!important/);
  assert.match(css,/mask-image:none!important/);
  assert.match(css,/scroll-snap-stop:always!important/);
});
