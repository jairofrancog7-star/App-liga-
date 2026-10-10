import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const live=read('index.html');
const demo=read('demo/index.html');
const css=read('src/v1153-matchday-fullwidth-safe-crests.css');
const demoCss=read('demo/src/v1153-matchday-fullwidth-safe-crests.css');
const renderer=read('src/v1132-matchday-premium.js');

test('Barra de jornada disables the old destructive canvas background filter',()=>{
 for(const html of [live,demo]){
  assert.match(html,/src\/v1153-matchday-fullwidth-safe-crests\.css/);
  assert.doesNotMatch(html,/src\/v1152-matchday-clear-crests\.js/);
 }
 assert.match(css,/filter:none!important/);
 assert.match(css,/object-fit:contain!important/);
 assert.equal(css,demoCss);
});

test('All matchday category chips reuse the same safe grid',()=>{
 assert.match(renderer,/category==='all'\|\|x\.catId===category/);
 assert.match(renderer,/class="md1132-game/);
 assert.match(css,/grid-template-columns:44px minmax\(0,1fr\) 44px!important/);
 assert.match(css,/white-space:normal!important/);
 assert.match(css,/overflow-wrap:anywhere!important/);
 assert.match(css,/width:calc\(100dvw - 12px\)!important/);
});

test('The jornada layout never changes team photos, source data, or score logic',()=>{
 assert.doesNotMatch(css,/mix-blend-mode:(?:multiply|screen|darken)/);
 assert.match(renderer,/const src=original\|\|legacyLogo\(name\)/);
 assert.match(renderer,/function logo\(name\)\{return officialCrest\(name\)\|\|legacyLogo\(name\);\}/);
 assert.match(renderer,/function status\(g\)/);
 assert.doesNotMatch(css,/clip-path:/);
});
