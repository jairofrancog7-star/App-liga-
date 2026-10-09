import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');
const index=read('../index.html');
const more=read('../src/v531-quiz-moreless-drive-reference.js');
const tools=read('../src/v1065-reference-repairs.js');
const css=read('../src/v1065-reference-repairs.css');
const simulator=read('../src/v501-simulator-reference.js');

test('V1065 está cargado después de los módulos de referencia',()=>{
  for(const file of ['v1065-reference-repairs.css','v1065-reference-repairs.js']){
    assert.ok(index.includes(file), 'No se carga '+file);
  }
  assert.ok(index.indexOf('v1064-bracket-real-cards.css')<index.indexOf('v1065-reference-repairs.css'));
  assert.doesNotThrow(()=>new Function(more));
  assert.doesNotThrow(()=>new Function(tools));
});

test('las dos cartas empiezan volteadas, luego se revelan una a una',()=>{
  const render=more.slice(more.indexOf('function moreGame(data){'),more.indexOf('function exitModal(kind){'));
  assert.ok(render.includes("intro?v1065CardBack('left')"));
  assert.ok(render.includes("v1065CardBack('right')"));
  assert.ok(more.includes('function v1065CardBack(side)'));
  assert.ok(more.includes("more.phase='first';v543RenderMorePortal()},1250"));
  assert.ok(more.includes("more.phase='both';v543RenderMorePortal()},3200"));
  assert.ok(more.includes("more.phase='ready';v543RenderMorePortal()},4450"));
  assert.ok(css.includes('@keyframes v1065-card-uncover'));
  assert.ok(more.includes("more.phase!=='ready'"),'No se debe iniciar reloj mientras giran');
});

test('las pestañas Clasificación/Cuadro conservan eventos y fondo opaco',()=>{
  assert.ok(simulator.includes('data-v501-view="bracket"'));
  assert.ok(simulator.includes('data-v501-view="standings"'));
  assert.ok(simulator.includes('setView(v.dataset.v501View)'));
  assert.match(css,/\.v501-tabs\s*\{/);
  assert.ok(css.includes('background:#0b38e2!important'));
  assert.ok(css.includes('.v12-bracket-pair'));
});

test('Más herramientas mantiene sólo un filtro superior funcional',()=>{
  assert.ok(tools.includes("hero.appendChild(primary)"));
  assert.ok(tools.includes("navs.slice(1).forEach(nav=>nav.remove())"));
  assert.ok(tools.includes("ids.has(button.dataset.v1063Filter)"));
  assert.ok(css.includes('.v726-tools-hero .v1063-tools-filters'));
  assert.ok(css.includes('.v1063-filter.is-active'));
});
