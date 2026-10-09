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
 assert.ok(splash.includes('V1062_QUIZ_SPLASH_STADIUM'));
 assert.ok(main.includes('class="v1059-splash-stadium"'));
 assert.ok(main.includes('preserveAspectRatio="none"'));
 assert.ok(!splash.includes('<img class="v1059-splash-stadium"'));
 assert.ok(!splash.includes('src="./src/quiz-arena-night-stadium.svg"'));
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
 // La portada abre primero el HUB; desde el HUB arranca la cuenta 3-2-1.
 assert.ok(main.includes("if(t.matches('[data-v531-quiz-start]')){"));
 assert.ok(main.includes("quiz.mode='hub';quiz.exit=false;render(true);return"));
 assert.ok(main.includes("v614StartQuizCountdown();return"));
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
test('activo en GitHub Pages, estadio SVG integrado sin carga externa ni archivos privados',()=>{
 assert.match(index,/v531-quiz-moreless-drive-reference\.js\?v=20261009-v\d{4}-[a-z0-9-]+/);
 assert.match(index,/v1059-quiz-splash-exact\.css\?v=20261009-v1059-android-pixel-scale/);
 assert.ok(svg.includes('viewBox="0 0 691 250"'));
 assert.ok(svg.includes('id="water"'));
 assert.ok(svg.includes('id="roof"'));
 assert.ok(!svg.includes('<script'));
 assert.ok(!css.includes('url(http'));
 assert.ok(!main.slice(main.indexOf('function quizSplash(){'),main.indexOf('function quizHub(data)')).includes('fetch('));
});

test('V1063: portada exacta de Drive sin duplicar Android ni bloquear botones',()=>{
 const fs=readFileSync(new URL('../src/v1063-quiz-drive-pixel-perfect.css',import.meta.url),'utf8');
 const raw=readFileSync(new URL('../assets/quiz-arena-drive-reference-20261009.jpg',import.meta.url));
 assert.ok(raw.length>100000);
 assert.deepEqual([...raw.subarray(0,3)],[0xff,0xd8,0xff]);
 assert.ok(fs.includes('background-image:url("../assets/quiz-arena-drive-reference-20261009.jpg")'));
 assert.ok(fs.includes('top:5.32%!important'));
 assert.ok(fs.includes('background-size:100% 114.34%!important'));
 assert.ok(fs.includes('height:22.2%!important'));
 assert.ok(fs.includes('.v1059-answer-art > .v1059-answer'));
 assert.ok(fs.includes('pointer-events:auto!important'));
 assert.ok(fs.includes('.v1059-splash-logo:focus-visible'));
 assert.ok(index.includes('v1063-quiz-drive-pixel-perfect.css'));
 // La portada abre primero el HUB; desde el HUB arranca la cuenta 3-2-1.
 assert.ok(main.includes("if(t.matches('[data-v531-quiz-start]')){"));
 assert.ok(main.includes("quiz.mode='hub';quiz.exit=false;render(true);return"));
 assert.ok(main.includes("v614StartQuizCountdown();return"));
});

test('V1064: recorte proporcional de Drive y zonas A-D coinciden con la referencia',()=>{
 const cssDrive=readFileSync(new URL('../src/v1063-quiz-drive-pixel-perfect.css',import.meta.url),'utf8');
 const view=2217,top=0.0532*view;
 const clipHeight=view-top;
 const imageHeight=clipHeight*1.1434;
 const offset=(imageHeight-clipHeight)*.392;
 assert.ok(Math.abs(top-118)<1,'no repetir la barra de estado de Android');
 assert.ok(Math.abs(offset-118)<1,'comenzar con el pixel 118 del original');
 assert.ok(Math.abs(top+clipHeight-2217)<1,'no copiar la barra de navegacion al fondo');
 const buttonTop=0.5825*view;
 const groupHeight=.222*view,rowHeight=.205*groupHeight;
 const step=(groupHeight-rowHeight*4)/3+rowHeight;
 // Rangos azules y verde, medidos en la captura original proporcionada.
 const bands=[[1303,1391],[1431,1519],[1558,1647],[1686,1775]];
 for(let i=0;i<4;i++){
   const start=buttonTop+i*step;
   assert.ok(Math.abs(start-bands[i][0])<17,'barra '+(i+1)+' alineada arriba');
   assert.ok(Math.abs(start+rowHeight-bands[i][1])<18,'barra '+(i+1)+' alineada abajo');
 }
 assert.ok(cssDrive.includes('top:58.25%!important;'));
 assert.ok(cssDrive.includes('height:22.2%!important;'));
 assert.ok(cssDrive.includes('background-position:50% 39.2%!important;'));
 assert.ok(!cssDrive.includes('overflow-y:scroll!important;'));
});
