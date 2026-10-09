import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=path=>readFileSync(new URL(path,import.meta.url),'utf8');
const index=read('../index.html');
const more=read('../src/v531-quiz-moreless-drive-reference.js');
const css=read('../src/v1067-restored-simulator-clean-card-flip.css');
const simulator=read('../src/v501-simulator-reference.js');

test('V1067 está activo y V1065 no afecta al Simulador',()=>{
  assert.ok(index.includes('v1067-restored-simulator-clean-card-flip.css'));
  assert.ok(!index.includes('v1065-reference-repairs.css'));
  assert.ok(!index.includes('v1065-reference-repairs.js'));
  assert.ok(!css.includes('data-app-route="simulator"'));
  assert.doesNotThrow(()=>new Function(more));
});

test('se eliminan los cinco filtros repetidos sin tocar accesos reales',()=>{
  assert.ok(!index.includes('v1063-leaguetools-functional-filters.css'));
  assert.ok(!index.includes('v1063-leaguetools-functional-filters.js'));
  const main=read('../src/main.js');
  assert.ok(main.includes('v726-tool-section'));
  assert.ok(main.includes('v726-admin-entry'));
  assert.ok(css.includes('v726-section-head::before'));
});

test('tarjetas quietas con giro de dos caras, secuencial y sin rebote',()=>{
  assert.ok(more.includes('function v1067FlipCard('));
  const render=more.slice(more.indexOf('function moreGame(data){'),more.indexOf('function exitModal(kind){'));
  assert.ok(render.includes("v1067FlipCard(pair.a,data,true,'left',!intro,more.phase==='first')"));
  assert.ok(render.includes("v1067FlipCard(pair.b,data,more.answered,'right',both,more.phase==='both')"));
  assert.ok(more.includes("more.phase='first';v543RenderMorePortal()},1250"));
  assert.ok(more.includes("more.phase='both';v543RenderMorePortal()},3200"));
  assert.ok(more.includes("more.phase='ready';v543RenderMorePortal()},4450"));
  assert.ok(css.includes('@keyframes v1067-clean-flip'));
  const anim=css.slice(css.indexOf('@keyframes v1067-clean-flip'),css.indexOf('html body #v543-moreless-portal .v551-more-reference-game .v1067-flip-side'));
  assert.ok(anim.includes('rotateY(0deg)'));
  assert.ok(anim.includes('rotateY(180deg)'));
  assert.ok(!anim.includes('translateX('));
  assert.ok(!anim.includes('scale('));
  assert.ok(more.includes("more.phase!=='ready'"));
  assert.ok(more.includes("(ready?question:'Total de goles en la Liga Juventino Rosas')"));
});

test('se conservan la Clasificación y el Cuadro originales',()=>{
  assert.ok(simulator.includes('data-v501-view="bracket"'));
  assert.ok(simulator.includes('data-v501-view="standings"'));
  assert.ok(simulator.includes('setView(v.dataset.v501View)'));
});
