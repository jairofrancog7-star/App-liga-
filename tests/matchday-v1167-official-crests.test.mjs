import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const load=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const js=load('src/v1132-matchday-premium.js');
const demoJs=load('demo/src/v1132-matchday-premium.js');
const css=load('src/v1167-matchday-centered-official-crests.css');
const build=load('vite.config.js');
const mainHtml=load('index.html');

test('matchday uses the exact same dynamic registry as Equipos and Siguiendo',()=>{
 assert.match(js,/window\.LJR_TEAM_LOGOS\?\.get\?\.\(name\)/);
 assert.doesNotMatch(js,/OFFICIAL_CREST_ROOT|OFFICIAL_CREST_SLUGS/);
 assert.doesNotMatch(js,/data-md-fallback-src/);
 assert.match(js,/const src=logo\(name,category\)/);
 assert.match(js,/data-md1132-team/);
 assert.doesNotMatch(mainHtml,/src\/v1152-matchday-clear-crests\.js/);
 const registry=load('src/v67-team-logo-registry.js');
 assert.match(registry,/if\(img\.closest\('\.md1132-crest'\)\)return;/);
});

test('centered matchday copy has its own column and never overlaps team crests',()=>{
 assert.match(js,/class="md1132-game-copy"/);
 assert.match(js,/\+crest\(x\.away,x\.category\)/);
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
 assert.match(build,/dist\/src\/v1167-matchday-centered-official-crests\.css/);
 assert.match(mainHtml,/v1167-matchday-centered-official-crests\.css/);
});
