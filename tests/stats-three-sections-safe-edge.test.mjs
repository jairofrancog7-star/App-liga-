import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');

test('Estadisticas conserva el diseno original de tablas en las tres pestanas',()=>{
  const html=read('index.html');
  const styles=read('src/v605-stats-unified-horizontal.css');
  const base=read('src/v33-data-statistics-reference.css');
  const renderer=read('src/v33-data-statistics-reference.js');
  assert.doesNotMatch(html,/rel="stylesheet"[^>]*v1218-stats-sections-safe-edge\.css/);
  assert.match(html,/v605-stats-unified-horizontal\.css/);
  assert.match(styles,/flex:0 0 82%!important/);
  assert.match(styles,/86%!important/);
  assert.match(base,/\.v33-stat-row/);
  for(const mode of ['general','team','player']){
    assert.match(renderer,new RegExp("activeTab==='"+mode+"'"));
  }
});

test('Conservar la linea blanca, espacio superior compacto y deslizamiento horizontal',()=>{
  const html=read('index.html');
  const tabs=read('src/v1187-stats-compact-tabs-no-gap.css');
  const styles=read('src/v605-stats-unified-horizontal.css');
  assert.match(html,/v1187-stats-compact-tabs-no-gap\.css/);
  assert.match(tabs,/--v33-actual-head-h/);
  assert.match(tabs,/v33-visible-gap-fix/);
  assert.match(styles,/overflow-x:auto!important/);
  assert.match(styles,/scroll-snap-type:x mandatory!important/);
});
