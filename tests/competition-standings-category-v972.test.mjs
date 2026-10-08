import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const root=new URL('../',import.meta.url);
const html=readFileSync(new URL('index.html',root),'utf8');
const menu=readFileSync(new URL('src/v972-competition-standings-category.js',root),'utf8');
const css=readFileSync(new URL('src/v972-competition-standings-category.css',root),'utf8');
const fast=readFileSync(new URL('src/v571-tournament-lower-tools.js',root),'utf8');
const full=readFileSync(new URL('src/v40-competition-master.js',root),'utf8');

test('Los cinco botones de Clasificación comparten el mismo filtro oficial que Partidos',()=>{
  assert.match(menu,/ids=\['3','4','5','2','1'\]/);
  assert.match(menu,/data-v972-category/);
  assert.match(menu,/v12-fixture-cat/);
  assert.match(menu,/v62-category/);
  assert.match(menu,/ljr:competition-category/);
  assert.match(menu,/aria-pressed/);
  assert.match(css,/grid-column:1\/-1!important/);
  assert.match(html,/v972-competition-standings-category\.js/);
  assert.match(html,/v972-competition-standings-category\.css/);
});

test('Tabla rápida y clasificación consumen la misma fuente oficial; ninguna inventa puntos',()=>{
  assert.match(fast,/LJR_OFFICIAL_API\?\.getData/);
  assert.match(full,/LJR_OFFICIAL_API\?\.getData/);
  assert.match(fast,/catObj\(cid\)\?\.standings/);
  assert.match(full,/cat\?\.standings/);
  assert.match(fast,/r\[9\]/);
  assert.match(full,/pts:number\(r\[9\]\)/);
});
