import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const src=read('src/v1131-cedulas-center.js');
const demo=read('demo/src/v1131-cedulas-center.js');
const makeHandler=()=>{
 const a=src.indexOf('function openGoogleCalendar(root){');
 const b=src.indexOf('async function share(root){',a);
 assert.ok(a>=0&&b>a,'El botón Calendario conserva su función');
 return new Function('root','apply','say','window',src.slice(a,b)+'\nreturn openGoogleCalendar(root);');
};
const fixture=(home,away,date='2026-10-10',time='1530')=>({
 home,away,cat:'Primera Fuerza',round:'9',field:'Campo 1, UDS',
 when:{hasTime:true,date,ics:date.replaceAll('-','')+'T'+time+'00'}
});

test('botón Calendario de Cédulas usa Google Calendar y conserva su diseño',()=>{
 assert.equal(src,demo,'La app y la demo deben llevar el mismo comportamiento');
 for(const page of ['index.html','demo/index.html']){
  const html=read(page);
  assert.match(html,/v1131-cedulas-center\.js/);
  assert.match(html,/v1207-google-calendar-global\.js/);
 }
 assert.match(src,/data-v1131-calendar/);
 assert.match(src,/aria-label="Preparar partido en Google Calendar"/);
 assert.match(src,/data-v1131-calendar[^\n]*Calendario<\/button>/);
 assert.doesNotMatch(src,/data-v1131-ics/);
 assert.doesNotMatch(src,/download\('liga-juventino-rol\.ics'/);
 new Function(src);
});

test('el partido filtrado abre con equipos fecha hora cancha categoría y jornada',()=>{
 const calls=[],msgs=[];
 const fn=makeHandler();
 fn({},()=>[fixture('BOAVISTA','BOCA JRS')],v=>msgs.push(v),
 {LJR_GOOGLE_CALENDAR_GLOBAL:{choose:(events,heading)=>{calls.push({events,heading});return true}}});
 assert.equal(calls.length,1);
 assert.equal(calls[0].events.length,1);
 assert.deepEqual(calls[0].events[0],{
  title:'BOAVISTA - BOCA JRS',
  iso:'2026-10-10',time:'15:30',duration:120,venue:'Campo 1, UDS',
  description:'Liga Juventino Rosas · Primera Fuerza · Jornada 9 · Consulta el rol oficial antes de asistir.'
 });
 assert.match(msgs[0],/pulsa Guardar/);
});

test('varios partidos abren selector y las fechas sin hora se excluyen',()=>{
 const calls=[];
 const unknown=fixture('Sin','Hora');unknown.when.hasTime=false;
 makeHandler()({},()=>[fixture('Boavista','Boca Jrs'),unknown,fixture('Franco','Napoli')],
 ()=>{}, {LJR_GOOGLE_CALENDAR_GLOBAL:{choose:(events)=>{calls.push(events);return true}}});
 assert.equal(calls.length,1);
 assert.deepEqual(calls[0].map(e=>e.title),['Boavista - Boca Jrs','Franco - Napoli']);
});

test('nunca inventa fechas o horas y informa si faltan datos',()=>{
 const messages=[];
 makeHandler()({},()=>[{home:'Boavista',away:'Boca',when:{hasTime:false}}],
 v=>messages.push(v),{LJR_GOOGLE_CALENDAR_GLOBAL:{choose:()=>{throw Error('No debería abrir calendario')}}});
 assert.match(messages[0],/fecha y hora confirmadas/);
});
