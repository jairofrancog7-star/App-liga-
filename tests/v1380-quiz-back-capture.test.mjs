import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const source=readFileSync(new URL('../src/v531-quiz-moreless-drive-reference.js',import.meta.url),'utf8');
const styles=readFileSync(new URL('../src/v1360-mobile-visual-fixes.css',import.meta.url),'utf8');

test('Flecha Volver del hub es capturada antes del router global',()=>{
 const marker=source.indexOf('/* V1380: La flecha visible del hub');
 const main=source.indexOf("document.addEventListener('click',function(e){",marker);
 assert.ok(marker>0&&main>marker,'Debe interceptar antes de la navegación global');
 const handler=source.slice(marker,main);
 assert.match(handler,/window\.addEventListener\('click',function\(e\)\{/);
 assert.match(handler,/route\(\)!=='quizArena'/);
 assert.match(handler,/#v612-quiz-portal \[data-v531-view="hub"\] \[data-v531-quiz-back\]/);
 assert.match(handler,/e\.preventDefault\(\);e\.stopPropagation\(\);e\.stopImmediatePropagation\(\)/);
 assert.match(handler,/quiz\.mode='splash';quiz\.exit=false;render\(false\)/);
 assert.doesNotThrow(()=>new Function(source));
});

test('No restaurar la X redundante de Quiz Arena',()=>{
 assert.match(styles,/\.v1057-quiz-head>\.v1070-hub-close\s*\{\s*display:none!important;/);
 assert.match(source,/data-v531-quiz-back aria-label="Volver"/);
});
