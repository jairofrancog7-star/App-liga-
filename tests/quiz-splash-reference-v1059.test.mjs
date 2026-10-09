import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const main=readFileSync(new URL('../src/v531-quiz-moreless-drive-reference.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../src/v1059-quiz-splash-exact.css',import.meta.url),'utf8');
const svg=readFileSync(new URL('../src/quiz-arena-night-stadium.svg',import.meta.url),'utf8');
const index=readFileSync(new URL('../index.html',import.meta.url),'utf8');

test('portada de referencia ocupa pantalla completa, sin tarjetas ajenas',()=>{
 const splash=main.slice(main.indexOf('function quizSplash(){'),main.indexOf('function quizHub(data)'));
 assert.ok(splash.includes('data-v531-view="splash"'));
 assert.ok(splash.includes('v1059-splash-logo'));
 assert.ok(splash.includes('v1059-answer-art'));
 assert.ok(splash.includes('v1059-splash-stadium'));
 assert.ok(!splash.includes('v531-rank-card'));
 assert.ok(!splash.includes('v531-friend-card'));
 assert.ok(!splash.includes('v531-mini-head'));
 assert.ok(css.includes('top:13.35%'));
 assert.ok(css.includes('top:58.1%'));
 assert.ok(css.includes('#002ff2 0%'));
 assert.ok(css.includes('object-fit:fill'));
 assert.ok(css.includes('max-width:none'));
});
test('cuatro respuestas de referencia accionables y C verde',()=>{
 const splash=main.slice(main.indexOf('function quizSplash(){'),main.indexOf('function quizHub(data)'));
 for(const x of ['A','B','C','D'])assert.ok(splash.includes("'"+x+"'"));
 assert.ok(splash.includes('data-v531-quiz-start'));
 assert.ok(splash.includes('v1059-answer-tick'));
 assert.ok(css.includes('.v1059-answer-c .v1059-answer-track'));
 assert.ok(css.includes('#1cba3a'));
 assert.ok(main.includes("if(t.matches('[data-v531-quiz-start]')){v614StartQuizCountdown();return}"));
});
test('logo abre portada funcional antigua sin perder clasificaciones',()=>{
 assert.ok(main.includes("quiz.mode='splash'"));
 assert.ok(main.includes("quiz.mode==='splash'?quizSplash()"));
 assert.ok(main.includes("quiz.mode='hub';quiz.exit=false;render(false);return;"));
 assert.ok(main.includes('data-v1057-quiz-menu-toggle'));
 assert.ok(main.includes('data-v531-rankings'));
 assert.ok(main.includes('function quizGame(data)'));
 assert.ok(main.includes('function quizCountdown(data)'));
});
test('activo en GitHub Pages, gráfico nocturno local y sin archivos privados',()=>{
 assert.match(index,/v531-quiz-moreless-drive-reference\.js\?v=20261009-v1059-exact-splash/);
 assert.match(index,/v1059-quiz-splash-exact\.css\?v=20261009-v1059-reference-geometry/);
 assert.ok(svg.includes('viewBox="0 0 691 250"'));
 assert.ok(svg.includes('id="water"'));
 assert.ok(svg.includes('id="roof"'));
 assert.ok(!svg.includes('<script'));
 assert.ok(!css.includes('url(http'));
 assert.ok(!main.slice(main.indexOf('function quizSplash(){'),main.indexOf('function quizHub(data)')).includes('fetch('));
});
