import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const load=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const js=load('src/v1132-matchday-premium.js');
const demoJs=load('demo/src/v1132-matchday-premium.js');
const css=load('src/v1167-matchday-centered-official-crests.css');
const demoCss=load('demo/src/v1167-matchday-centered-official-crests.css');
const mainHtml=load('index.html');

test('official 2026 team PNGs take priority over flattened WebP images',()=>{
 assert.match(js,/Liga_Futbol\/main\/assets\/official-logos\//);
 for(const slug of ['la-cuadrilla','mazacotes-fc','pachangas-fc','promesas-fc','populares','san-antonio-jrs','hermanos','tavera-fc','malvinas','la-huerta']){
  assert.ok(js.includes(slug),slug+' should use an existing official PNG');
 }
 assert.match(js,/return officialCrest\(name\)\|\|legacyLogo\(name\)/);
 assert.match(js,/data-md-fallback-src/);
 assert.doesNotMatch(mainHtml,/src\/v1152-matchday-clear-crests\.js/);
});

test('centered matchday copy has its own column and never overlaps team crests',()=>{
 assert.match(js,/class="md1132-game-copy"/);
 assert.match(js,/\+crest\(x\.away\)/);
 assert.match(css,/grid-template-columns:56px minmax\(0,1fr\) 56px!important/);
 assert.match(css,/text-align:center!important/);
 assert.match(css,/height:auto!important/);
 assert.match(css,/filter:none!important/);
 assert.match(css,/object-fit:contain!important/);
});

test('all fixture category chips share safe layout in prod and demo',()=>{
 assert.match(js,/category==='all'\|\|x\.catId===category/);
 assert.match(js,/ensureMatchdayStyles/);
 assert.equal(js,demoJs);
 assert.equal(css,demoCss);
 assert.match(mainHtml,/v1167-matchday-centered-official-crests\.css/);
});
