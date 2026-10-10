import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Script, runInNewContext } from 'node:vm';

const assistant = readFileSync('src/v1222-notifications-local-assistant.js','utf8');
const theme = readFileSync('src/v1202-notifications-feed.css','utf8');
const entry = readFileSync('index.html','utf8');

function loadSummary(){
  const globals={};
  const box=new Map();
  const script=assistant.replace(/\}\)\(\);\s*$/, 'window.__summaryTest__={report,facts};})();');
  const env={
    window:globals,
    document:{readyState:'loading',addEventListener(){}},
    localStorage:{getItem:k=>box.get(k)||null,setItem:(k,v)=>box.set(k,v)},
    addEventListener(){},
    navigator:{},
    setTimeout(){},
    clearTimeout(){},
    URL, console
  };
  runInNewContext(script,env);
  return globals.__summaryTest__;
}

test('Asistente local: información vacía no inventa resultados',()=>{
 const api=loadSummary();
 assert.match(api.report([]),/no hay avisos guardados/i);
 assert.match(api.report([]),/no inventa partidos/i);
});

test('Asistente local: resume goles y marcadores reales',()=>{
 const api=loadSummary();
 const records=[
  {id:'1',type:'final',home:'Manchester',away:'Juventus',hs:2,as:1,category:'Veteranos 50+',status:'Finalizado'},
  {id:'2',type:'goal',home:'Linces',away:'Franco',hs:1,as:0,category:'Primera',status:'Gol'}
 ];
 const summary=api.report(records);
 assert.match(summary,/2 avisos registrados/);
 assert.match(summary,/1 resultados, 1 alertas de gol/);
 assert.match(summary,/Manchester 2–1 Juventus/);
 assert.match(summary,/Linces 1–0 Franco/);
 assert.doesNotMatch(summary,/3–3/);
});

test('Asistente: modelo pesado solo se inicia por gesto y confirma descarga',()=>{
 new Script(assistant,{filename:'v1222-notifications-local-assistant.js'});
 assert.match(assistant,/new Worker\(/);
 assert.match(assistant,/confirm\('La IA local generativa/);
 assert.match(assistant,/button\.hasAttribute\('data-v1222-model'\)\)startModel\(\)/);
 assert.match(assistant,/window\.__LJR_V1222_NOTIFICATION_ASSISTANT__/);
});

test('Paleta unificada y archivo integrado con carga de Scripts clásicos',()=>{
 assert.match(theme,/--ljr-notif-page:#05045f/);
 assert.match(theme,/--ljr-notif-card:#0d1d57/);
 assert.match(theme,/v1222-assistant/);
 assert.match(entry,/src\/v1222-notifications-local-assistant\.js/);
 assert.match(entry,/src\/v1202-notifications-feed\.css\?v=20261010-v1222-blue-ai/);
});
