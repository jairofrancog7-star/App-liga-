import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const js=readFileSync(new URL('../src/v531-quiz-moreless-drive-reference.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../src/v1070-quiz-flow-blue-exit.css',import.meta.url),'utf8');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');

function between(from,to){const start=js.indexOf(from);const end=js.indexOf(to,start+from.length);assert.ok(start>=0&&end>start);return js.slice(start,end);}

test('ABCD no salta a las preguntas: abre la portada que ya existe',()=>{
 const splash=between('function quizSplash(){','function quizHub(data){');
 const clickHandler=js.slice(js.indexOf("document.addEventListener('click',function(e){"));
 assert.ok(splash.includes("data-v531-quiz-start"));
 assert.ok(clickHandler.includes("t.closest('[data-v531-view=\"splash\"]')"));
 assert.ok(clickHandler.includes("quiz.mode='hub';quiz.exit=false;render(true);return"));
 assert.ok(js.includes("quiz.mode='hub';\n      quiz.exit=false;\n      render(true);"));
});
test('solo el boton de la portada inicia la cuenta 3,2,1 y despues el juego',()=>{
 const hub=between('function quizHub(data){','function quizGame(data){');
 const countdown=between('function quizCountdown(data){','function v614StartQuizCountdown(){');
 const start=between('function v614StartQuizCountdown(){','function v614OpenQuizGame(){');
 assert.ok(hub.includes('data-v531-quiz-start'));
 assert.ok(start.includes("quiz.mode='countdown'"));
 assert.ok(start.includes('quiz.countdown=3'));
 assert.ok(start.includes("quiz.countdown--"));
 assert.ok(start.includes("quiz.mode='game'"));
 assert.ok(countdown.includes('data-quiz-countdown'));
});
test('X de portada cancela; X del juego muestra la hoja, y cancelacion pausa',()=>{
 const hub=between('function quizHub(data){','function quizGame(data){');
 const game=between('function quizGame(data){','function quizResult(data){');
 const countdown=between('function quizCountdown(data){','function v614StartQuizCountdown(){');
 assert.ok(hub.includes('data-v1070-quiz-hub-close'));
 assert.ok(js.includes("if(t.matches('[data-v531-quiz-back],[data-v1070-quiz-hub-close]'))"));
 assert.ok(js.includes("quiz.mode='splash';quiz.exit=false;render(false);return"));
 assert.ok(game.includes('data-v531-quiz-close'));
 assert.ok(game.includes("quiz.exit?exitModal('quiz')"));
 assert.ok(countdown.includes("quiz.exit?exitModal('quiz')"));
 assert.ok(js.includes("if(quiz.exit)return; // Pausar 3-2-1"));
 assert.ok(js.includes("if(t.matches('[data-v614-countdown-close]')){quiz.exit=true;render(false);return}"));
});
test('modal de salida tiene los textos y acciones exactos',()=>{
 const dialog=between('function exitModal(kind){','function setGamesNav(){');
 for(const text of ['¿Salir del quiz?','Tus cambios no se guardarán.','Sí, salir','No, continuar']){
   assert.ok(dialog.includes(text));
 }
 assert.ok(js.includes("if(t.matches('[data-v531-exit-confirm]'))"));
 assert.ok(js.includes("if(t.matches('[data-v531-exit-cancel]'))"));
});
test('azul sin franja y modal encima de navegacion, sin cambiar otras rutas',()=>{
 assert.ok(css.includes('[data-v531-view="splash"]::before'));
 assert.ok(css.includes('top:0!important'));
 assert.ok(css.includes('background-size:100% 114.34%'));
 assert.ok(css.includes('background-position:50% 39.2%'));
 assert.ok(css.includes('.v531-exit-backdrop'));
 assert.ok(css.includes('.v531-exit-modal>.yes'));
 assert.ok(css.includes('.v531-exit-modal>.no'));
 assert.ok(!css.includes('[data-app-route="moreLess"]'));
 assert.ok(html.includes('v1070-quiz-flow-blue-exit.css'));
 assert.ok(html.includes('v1070-flow-cancel'));
});
