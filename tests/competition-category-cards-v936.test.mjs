import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const css=readFileSync(new URL('../src/v936-competition-category-cards.css',import.meta.url),'utf8');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const fixtures=readFileSync(new URL('../src/v12-reference-parts.js',import.meta.url),'utf8');

test('los cinco botones originales de competición siguen conectados al selector',()=>{
  assert.match(fixtures,/class="v12-category-grid"/);
  assert.match(fixtures,/data-v12-cat/);
  assert.match(fixtures,/V12_FIXTURE_ORDER=\['3','4','5','2','1'\]/);
});

test('diseño moderno mantiene la tarjeta activa, el quinto cuadro y la accesibilidad',()=>{
  assert.match(css,/\.v12-category-grid > button\.active/);
  assert.match(css,/grid-column:1 \/ -1!important/);
  assert.match(css,/:focus-visible/);
  assert.match(css,/min-width:0!important/);
  assert.doesNotMatch(css,/bottom-nav|position:fixed|display:none/);
  // La versión de caché cambia cuando se actualizan los logos de categorías.
  assert.match(html,/v936-competition-category-cards\.css\?v=202610\d+-v\d+-[a-z0-9-]+/);
});
