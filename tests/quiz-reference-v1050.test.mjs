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
