import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const root=new URL('../',import.meta.url);
const html=readFileSync(new URL('index.html',root),'utf8');
const menu=readFileSync(new URL('src/v972-competition-standings-category.js',root),'utf8');
const css=readFileSync(new URL('src/v972-competition-standings-category.css',root),'utf8');
const fast=readFileSync(new URL('src/v571-tournament-lower-tools.js',root),'utf8');
const full=readFileSync(new URL('src/v40-competition-master.js',root),'utf8');

test('Restauración: Clasificación usa el diseño anterior y sus tres vistas originales',()=>{
  assert.doesNotMatch(html, /<script[^>]+src="[^"]*v972-competition-standings-category\\.js/);
  assert.doesNotMatch(html, /<link[^>]+href="[^"]*v972-competition-standings-category\\.css/);
  assert.doesNotMatch(html, /<link[^>]+href="[^"]*v971-competition-standings-visible\\.css/);
  assert.match(html, /src\\/v40-competition-master\\.js/);
  assert.match(full, /data-v40-mode="compact"/);
  assert.match(full, /data-v40-mode="complete"/);
  assert.match(full, /data-v40-mode="criteria"/);
  assert.match(full, /ljr:competition-category/);
});

test('Tabla rápida y clasificación consumen la misma fuente oficial; ninguna inventa puntos',()=>{
  assert.match(fast,/LJR_OFFICIAL_API\?\.getData/);
  assert.match(full,/LJR_OFFICIAL_API\?\.getData/);
  assert.match(fast,/catObj\(cid\)\?\.standings/);
  assert.match(full,/cat\?\.standings/);
  assert.match(fast,/r\[9\]/);
  assert.match(full,/pts:number\(r\[9\]\)/);
});
