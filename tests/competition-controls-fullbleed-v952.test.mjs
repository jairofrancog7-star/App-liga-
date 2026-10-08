import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const file=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const css=file('src/v952-competition-controls-fullbleed.css');
const html=file('index.html');
const matches=file('src/v449-reference-lower-panels.js');
const results=file('src/v422-results-reference.js');

test('competition week and season selectors stay visible and interactive',()=>{
 assert.match(matches,/data-v449-category/);
 assert.match(matches,/data-v449-round-select/);
 assert.match(matches,/data-v449-team-filter/);
 assert.match(matches,/data-v449-round-dir="-1"/);
 assert.match(matches,/data-v449-round-dir="1"/);
 assert.match(css,/\.v449-season-controls>label\{[\s\S]*?display:block!important/);
 assert.match(css,/\.v449-season-controls select\{[\s\S]*?appearance:auto!important/);
 assert.match(css,/\.v449-season-date>button\{[\s\S]*?display:grid!important/);
 assert.match(css,/\.v449-season-date>button:disabled\{[\s\S]*?opacity:\.48!important/);
 assert.match(css,/\.v12-date-strip>button\[data-v12-date\]\{[\s\S]*?pointer-events:auto!important/);
});

test('results cards span the full mobile viewport with safe inner padding',()=>{
 assert.match(results,/class="v422-card"/);
 assert.match(css,/#v422-results-reference\{[\s\S]*?width:100vw!important/);
 assert.match(css,/margin-left:calc\(50% - 50vw\)!important/);
 assert.match(css,/#v422-results-reference \.v422-card\{[\s\S]*?width:100%!important/);
 assert.match(css,/#v422-results-reference \.v422-sports>button\{[\s\S]*?display:grid!important/);
 assert.match(css,/#v422-results-reference \.v422-standings\{[\s\S]*?display:block!important/);
});

test('late scoped stylesheet does not touch global navigation or unrelated routes',()=>{
 assert.match(html,/src\/v952-competition-controls-fullbleed\.css\?v=20261008-v952-controls-results-edge/);
 assert.ok(html.indexOf('src/v952-competition-controls-fullbleed.css')>html.indexOf('src/v951-fantasy-tiny-header-icons.css'));
 assert.doesNotMatch(css,/\.bottom-nav|\.topbar|display:none!important|position:fixed!important/);
 assert.match(css,/body\[data-app-route="competition"\]/);
});
