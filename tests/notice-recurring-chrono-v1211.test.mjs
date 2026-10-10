import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import rruleModule from 'rrule';
const {RRule}=rruleModule;
import chrono from 'chrono-node';

const root=resolve(import.meta.dirname,'..');
const load=p=>readFileSync(resolve(root,p),'utf8');
const js=load('src/v1211-notice-rrule-chrono.js');
function engine(){
  const window={addEventListener(){}};
  const document={documentElement:{},querySelectorAll(){return []},addEventListener(){}};
  const MutationObserver=class{observe(){}};
  const instrumented=js.replace('new MutationObserver(mount)','window.__test={spanishToEnglish,hasDateWords,explicitDateEs,timeEs,interpretSpanish,recurringType,occurrenceTimes,mexicoMillis,makeLocalRows,seriesMeta};new MutationObserver(mount)');
  assert.notEqual(instrumented,js);
  new Function('window','document','localStorage','MutationObserver',instrumented)(
    window,document,{getItem:()=>null,setItem(){}},MutationObserver);
  return window.__test;
}
test('Asistente integrado en web sin descargar modelos o FullCalendar innecesarios',()=>{
  assert.doesNotThrow(()=>new Function(js));
  const html=load('index.html');
  assert.match(html,/type="module" src="\.\/src\/v1211-notice-rrule-chrono\.js/);
  assert.match(html,/v1211-notice-rrule-chrono\.css/);
  assert.match(js,/import\('rrule'\)/);
  assert.match(js,/import\('chrono-node'\)/);
  assert.doesNotMatch(js,/\/admin\/notices|\/jobs\/dispatch|fetch\(/);
});
test('Números día/mes y expresiones españolas son interpretados correctamente',async()=>{
  const a=engine(),ref=new Date(2026,9,10,13,10);
  assert.equal(a.explicitDateEs('Junta 21/10/2026',ref),'2026-10-21');
  assert.equal(a.explicitDateEs('Junta 31/02/2026',ref),'');
  assert.equal(a.timeEs('a las 5 de la tarde'),'17:00');
  assert.equal(a.recurringType('cada sábado a las 10:00'),'weekly');
  assert.equal(a.recurringType('cada mes'),'monthly');
  assert.equal(a.recurringType('todos los días'),'daily');
  const saturday=await a.interpretSpanish('cada sábado a las 10:00',ref,()=>[]);
  assert.deepEqual(JSON.parse(JSON.stringify(saturday)),{date:'2026-10-17',time:'10:00'});
  const actual=await a.interpretSpanish('21 de octubre de 2026 a las 17:30',ref,
    (text,date)=>chrono.en.parse(text,date,{forwardDate:true}));
  assert.equal(actual.date,'2026-10-21');
  assert.equal(actual.time,'17:30');
});
test('RRule crea exactamente N fechas, conserva hora de la Liga y no duplica IDs',async()=>{
  const a=engine();
  const dates=await a.occurrenceTimes('2026-10-17','10:00','weekly',4,{RRule});
  assert.equal(dates.length,4);
  assert.equal(dates[0],'2026-10-17T16:00:00.000Z');
  assert.equal(dates[1],'2026-10-24T16:00:00.000Z');
  assert.equal(dates[3],'2026-11-07T16:00:00.000Z');
  const rows=a.makeLocalRows({date:'2026-10-17',time:'10:00',type:'junta',title:'Junta de delegados',body:'Reunión programada de responsables de la liga.',category:'Veteranos 35+',remind:60,channels:{app:true}},dates,'weekly',4,1792243200000);
  assert.equal(new Set(rows.map(x=>x.id)).size,4);
  assert.equal(new Set(rows.map(x=>x.seriesId)).size,1);
  assert.equal(rows[0].rrule.tzid,'America/Mexico_City');
  assert.equal(rows[0].remindAt,'2026-10-17T15:00:00.000Z');
  assert.ok(rows.every(x=>x.published===false&&x.status==='scheduled'));
  await assert.rejects(a.occurrenceTimes('2026-02-31','10:00','weekly',4,{RRule}));
  const monthly=await a.occurrenceTimes('2027-01-31','11:00','monthly',4,{RRule});
  assert.equal(monthly.length,4);
  assert.equal(new Date(monthly[1]).toISOString().slice(0,10),'2027-03-31');
});
test('La recurrencia termina y está limitada para evitar avisos infinitos',async()=>{
  const a=engine();
  const dates=await a.occurrenceTimes('2026-10-18','11:00','daily',100,{RRule});
  assert.equal(dates.length,12);
  const once=await a.occurrenceTimes('2026-10-18','11:00','once',1,{RRule});
  assert.equal(once.length,1);
  assert.deepEqual(a.seriesMeta('2026-10-18','11:00','once',1),null);
  assert.equal(a.seriesMeta('2026-10-18','11:00','weekly',4).freq,'weekly');
});
