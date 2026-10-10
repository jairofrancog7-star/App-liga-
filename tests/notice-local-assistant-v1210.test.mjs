import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const root=resolve(import.meta.dirname,'..');
const read=p=>readFileSync(resolve(root,p),'utf8');
const source=read('src/v1210-notice-local-assistant.js');
const demo=read('demo/src/v1210-notice-local-assistant.js');

function localEngine(){
  const window={addEventListener(){}};
  const document={documentElement:{},querySelectorAll(){return []},addEventListener(){}};
  const storage={getItem(){return null}};
  const MutationObserver=class{observe(){}};
  const instrumented=source.replace('new MutationObserver(mount)','window.__testEngine={infer,detectType,analyze,calendarUrl};new MutationObserver(mount)');
  assert.notEqual(instrumented,source);
  new Function('window','document','localStorage','MutationObserver','navigator',instrumented)(
    window,document,storage,MutationObserver,{});
  return window.__testEngine;
}

test('Asistente cargado en la app principal y demo, sin dependencias remotas',()=>{
  assert.doesNotThrow(()=>new Function(source));
  assert.equal(source,demo);
  for(const page of ['index.html','demo/index.html']){
    const html=read(page);
    // La demo Vite combina las hojas CSS en assets/index-*.css.
    assert.match(html,page==='index.html' ? /v1210-notice-local-assistant\.css/ : /assets\/index-[^" ]+\.css/);
    assert.match(html,/v1210-notice-local-assistant\.js/);
  }
  assert.doesNotMatch(source,/fetch\s*\(/);
  assert.match(source,/solo en este dispositivo/i);
});

test('Detector local interpreta español sin inventar partido',()=>{
  const t=localEngine();
  const found=t.infer('Cambio de cancha mañana 5 pm Veteranos 35+',new Date(2026,9,10,12));
  assert.deepEqual(JSON.parse(JSON.stringify(found)),{type:'sede',category:'Veteranos 35+',date:'2026-10-11',time:'17:00'});
  const saturday=t.infer('Junta el próximo sábado 11:30',new Date(2026,9,10,12));
  assert.equal(saturday.date,'2026-10-17');
  assert.equal(saturday.type,'junta');
  assert.equal(saturday.time,'11:30');
  assert.deepEqual(Object.keys(t.infer('Sin fecha confirmada',new Date(2026,9,10,12))),[]);
});

test('Detecta faltantes sin publicar ni otorgar permisos',()=>{
  const t=localEngine();
  const a=t.analyze({title:'Aviso',body:'poco',date:'2020-01-01',time:'11:00',category:'Todas',type:'general',extra:'',channels:[]},null);
  assert.ok(a.warnings.length>=3);
  assert.match(a.warnings.join(' '),/fecha ya pasó/);
  assert.match(source,/LJR_MEDIA\.api\('me'\)/);
  assert.doesNotMatch(source,/\/admin\/notices|\/jobs\/dispatch/);
});

test('Crea enlace Google Calendar, sin guardar eventos sin autorización',()=>{
  const t=localEngine();
  const url=t.calendarUrl({title:'Revisar aviso',body:'Información de jornada',category:'Primera',publishAt:'2026-10-11T18:00:00.000Z'});
  assert.match(url,/^https:\/\/calendar\.google\.com\/calendar\/render\?action=TEMPLATE/);
  assert.match(url,/America%2FMexico_City/);
  assert.match(url,/20261011T180000Z%2F20261011T183000Z/);
});