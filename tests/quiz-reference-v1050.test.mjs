import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const js=readFileSync(new URL('../src/v531-quiz-moreless-drive-reference.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../src/v1050-quiz-modal-reference.css',import.meta.url),'utf8');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');

test('Quiz Aleatorio mantiene control de salida y la partida intacta al continuar',()=>{
 assert.match(js,/data-v531-quiz-close/);
 assert.match(js,/¿Salir del quiz\?/);
 assert.match(js,/Sí, salir/);
 assert.match(js,/No, continuar/);
 assert.match(js,/quiz\.exit=true;v1050NotifyOpen=false;render\(false\)/);
 assert.match(js,/quiz\.exit=false;render\(false\)/);
 assert.match(js,/quiz\.mode!=='game'\|\|quiz\.exit\|\|v1050NotifyOpen\|\|quiz\.answered/);
});
test('notificaciones con permiso expreso y sin servicios externos',()=>{
 assert.match(js,/Notification\.requestPermission\(\)/);
 assert.match(js,/v1050NotifyModal\(\)/);
 assert.match(js,/data-v1050-notify-close/);
 assert.match(js,/data-v1050-notify-allow/);
 assert.match(js,/data-v1050-notice-dismiss/);
 assert.match(js,/Notification\.permission!=='granted'/);
 assert.doesNotMatch(js,/firebase\.messaging|onesignal\.init/i);
});
test('las preguntas y turbos conservan las acciones originales',()=>{
 for(const x of ['data-v531-q-answer','data-quiz-half','data-quiz-retry','data-v531-quiz-next','quiz.points+=10'])assert.ok(js.includes(x),x);
 assert.match(js,/quiz\.missed=quiz\.missed\|\|\[\]/);
 assert.match(js,/quiz\.missed=\[\];quiz\.mode='game'/);
});
test('estilo aislado a Quiz Arena y cache de assets actualizado',()=>{
 assert.match(css,/body\[data-app-route="quizArena"\] #v612-quiz-portal/);
 assert.match(css,/\.v531-exit-modal/);
 assert.match(css,/\.v1050-notify-sheet/);
 assert.match(css,/\.v614-question-media/);
 assert.match(css,/grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
 assert.match(html,/v1050-quiz-modal-reference\.css\?v=/);
 assert.match(html,/v531-quiz-moreless-drive-reference\.js\?v=20261009-v\d+-[a-z0-9-]+/);
});

test('recordatorio en pantalla principal, sin ocupar la pregunta',()=>{
 const hub=js.slice(js.indexOf('function quizHub(data)'),js.indexOf('function quizGame(data)'));
 const game=js.slice(js.indexOf('function quizGame(data)'),js.indexOf('function quizResult(data)'));
 assert.ok(hub.includes('v1050NotifyCard()'));
 assert.ok(hub.includes('v1050NotifyModal()'));
 assert.ok(!game.includes('v1050NotifyCard()'));
 assert.ok(game.includes('v1050NotifyModal()'));
});
test('trabajador de avisos locales requiere permiso y no usa servidores',()=>{
 const sw=readFileSync(new URL('../src/quiz-local-worker.js',import.meta.url),'utf8');
 assert.ok(js.includes("navigator.serviceWorker.register('./src/quiz-local-worker.js'"));
 assert.ok(js.includes('v1055RegisterQuizNotices()'));
 assert.ok(js.includes('reg.showNotification('));
 assert.match(sw,/notificationclick/);
 assert.doesNotMatch(sw,/fetch\(|pushManager|sendBeacon|\/api\//);
 assert.ok(css.includes('[data-v531-view="hub"] .v1050-notice-card'));
});
