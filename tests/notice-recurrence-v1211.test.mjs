import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const read=path=>readFileSync(resolve(root,path),'utf8');
const source=read('src/v1211-notice-recurrence.js');

function harness(){
 const window={addEventListener(){}},document={documentElement:{},addEventListener(){},querySelectorAll(){return []}};
 const MutationObserver=class{observe(){}},localStorage={getItem(){return null}};
 const injected=source.replace('new MutationObserver(mount).observe','window.__test={spanish,planned,localPlan,wallMillis,ruleString};new MutationObserver(mount).observe');
 assert.notEqual(injected,source);
 new Function('window','document','MutationObserver','localStorage','navigator',injected)(
   window,document,MutationObserver,localStorage,{});
 return window.__test;
}
test('Módulo de avisos recurrentes cargado sin romper el anterior',()=>{
 assert.doesNotThrow(()=>new Function(source));
 assert.equal(source,read('demo/src/v1211-notice-recurrence.js'));
 const html=read('index.html'),demoHtml=read('demo/index.html');
 assert.match(html,/v1211-notice-recurrence\.js/);
 assert.match(html,/v1211-notice-recurrence\.css/);
 assert.match(demoHtml,/v1211-notice-recurrence\.js/);
 // Vite empaqueta las hojas CSS en demo/assets/index-*.css en lugar de
 // conservar la ruta original. Validar la referencia compilada, no el nombre antiguo.
 assert.match(demoHtml,/href="\.\/assets\/index-[A-Za-z0-9_-]+\.css"/);
 assert.match(read('src/v1211-notice-recurrence.css'),/\.v1211-recurrence/);
 assert.match(html,/v1211-notice-libs\.mjs/);
 const module=read('src/v1211-notice-libs.mjs');
 assert.match(module,/from 'rrule'/);
 assert.match(module,/from 'chrono-node'/);
 assert.match(module,/chrono\.es/);
});
test('Detecta fechas y horas en español, sin inventar una fecha',()=>{
 const x=harness(),now=Date.parse('2026-10-10T18:00:00Z');
 assert.deepEqual(x.spanish('mañana a las 5:30 pm',now),{date:'2026-10-11',time:'17:30'});
 assert.deepEqual(x.spanish('junta el 15 de octubre de 2026 a las 9 de la mañana',now),
   {date:'2026-10-15',time:'09:00'});
 assert.deepEqual(x.spanish('todos los sábados a las 11:30',now),{date:'2026-10-17',time:'11:30',repeat:'weekly'});
 assert.deepEqual(x.spanish('sin fecha confirmada',now),{});
 assert.deepEqual(x.spanish('31 de febrero de 2027',now),{});
});
test('RRule local prepara series sin fechas repetidas y respeta febrero',()=>{
 const x=harness();
 assert.deepEqual(x.planned({date:'2026-10-11',time:'11:00',repeat:'weekly',count:4}).dates,
   ['2026-10-11','2026-10-18','2026-10-25','2026-11-01']);
 assert.deepEqual(x.planned({date:'2026-10-11',time:'11:00',repeat:'biweekly',count:3}).dates,
   ['2026-10-11','2026-10-25','2026-11-08']);
 assert.deepEqual(x.planned({date:'2027-01-31',time:'11:00',repeat:'monthly',count:4}).dates,
   ['2027-01-31','2027-03-31','2027-05-31','2027-07-31']);
 assert.deepEqual(x.planned({date:'2026-10-10',time:'11:00',repeat:'weekdays',count:3}).dates,
   ['2026-10-12','2026-10-13','2026-10-14']);
 assert.equal(x.planned({date:'2026-02-30',time:'11:00',repeat:'weekly',count:3}).dates.length,0);
 assert.equal(new Date(x.wallMillis('2026-10-11','11:00')).toISOString(),'2026-10-11T17:00:00.000Z');
});
test('Serie limitada a 20 avisos, autenticación de admin y bloqueo de Facebook',()=>{
 assert.match(source,/Math\.min\(20/);
 assert.match(source,/await authorized\(\)/);
 assert.match(source,/window\.confirm\(msg\)/);
 assert.match(source,/if\(channels\.facebook\)/);
 assert.match(source,/!old\.published/);
 assert.doesNotMatch(source,/\bfetch\s*\(/);
 assert.match(source,/LJR_V713_NOTICE_SCHEDULER_REFRESH/);
});