import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
test('Mostrar clasificación uses the actual Competición standings tab, never compare teams',()=>{
 const js=source('src/v422-results-reference.js');
 assert.match(js,/data-v422-standings>Mostrar clasificación/);
 assert.match(js,/function openStandings\(event\)/);
 assert.match(js,/router\.state\.competitionTab='standings'/);
 assert.match(js,/router\.go\('competition'\)/);
 assert.match(js,/data-comp-tab="standings"/);
 assert.match(js,/b\.onclick=openStandings/);
 assert.doesNotMatch(js,/data-v422-standings[^\n]*#\/leagueData/);
 assert.doesNotMatch(js,/function openStandings[\s\S]*?(?:compareTeams|compararEquipos)/i);
});
test('Campo de partido shows a vector soccer pitch icon (not a box glyph)',()=>{
 const js=source('src/v422-results-reference.js');
 const css=source('src/v422-results-reference.css');
 assert.match(js,/function fieldIcon\(\)/);
 assert.match(js,/v422-field-icon/);
 assert.match(js,/fieldIcon\(\)\+'<span>'/);
 assert.doesNotMatch(js,/▣/);
 assert.match(css,/\.v422-field-icon/);
 assert.match(css,/width:14px/);
});
test('GitHub Pages busts caches for both results assets',()=>{
 const html=source('index.html');
 assert.match(html,/v422-results-reference\.js\?v=20261008-v927/);
 assert.match(html,/v422-results-reference\.css\?v=20261008-v927/);
});
