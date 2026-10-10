import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {spawnSync} from 'node:child_process';

const source=readFileSync(new URL('../src/v1140-meeting-suite.js',import.meta.url),'utf8');
const oldHub=readFileSync(new URL('../src/v1130-meeting-hub.js',import.meta.url),'utf8');
const meeting=readFileSync(new URL('../src/v105-green-app-bottom.js',import.meta.url),'utf8');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');

function fixture(){
 const opened=[];
 const window={LJR_GOOGLE_CALENDAR_GLOBAL:{open:event=>{opened.push(event);return true}},LJR_MEDIA:{admin:{role:'presidente'},notifyAPI:async()=>({actor:{permissions:[]}})},confirm:()=>true};
 const document={querySelector:()=>null};
 runInNewContext(source,{window,document,navigator:{},localStorage:{}});
 const api=window.LJR_MEETING_ADVANCED_V1140;
 const record={attendance:[{team:'Boavista',delegate:'Ana',status:'Presente'}],
 tasks:[{name:'Confirmar árbitros',owner:'Secretaría',due:'2099-01-20',status:'Pendiente'}],
 votes:[{title:'Propuesta de campo',ballots:{boavista:{team:'Boavista',vote:'Sí'}}}],sign:{images:{}}};
 const files=[];let status='';
 const ctx={
 date:()=> '2099-01-13',
 item:()=>record,
 snapshot:()=>({date:'2099-01-13',time:'19:00',place:'Campo Municipal',owner:'Presidencia',agenda:'Programación y arbitraje',agreements:'Revisar las canchas'}),
 host:{querySelector:q=>{
   if(q==='[data-mh-advanced="hours"]')return {value:'24'};
   if(q==='[data-mh-advanced="weekly"]')return {checked:true};
   if(q==='[data-mh-advanced="summary"]')return {value:'Borrador revisado'};
   return null;
 }},
 download:(name,content,type)=>files.push({name,content,type}),
 msg:s=>{status=s},persist:()=>{},preserve:()=>{},render:()=>{},
 };
 return {window,api,record,ctx,files,opened,get status(){return status}};
}
test('scripts linked and administrative gate protects the meeting modal',()=>{
 new Function(source);
 new Function(oldHub);
 const checked=spawnSync(process.execPath,['--check','--input-type=module'],{input:meeting,encoding:'utf8'});
 assert.equal(checked.status,0,checked.stderr);
 assert.match(html,/v1140-meeting-suite\.js/);
 assert.match(html,/v1140-meeting-suite\.css/);
 assert.ok(html.indexOf('v1140-meeting-suite.js')<html.indexOf('v1130-meeting-hub.js'));
 assert.match(meeting,/if\(!window\.LJR_MEDIA\?\.admin\)/);
 assert.match(oldHub,/if\(!window\.LJR_MEDIA\?\.admin\)return/);
});
test('summary only uses attendance, agenda, agreements and recorded votes',()=>{
 const x=fixture();const t=x.api.summaryText(x.ctx);
 assert.match(t,/Boavista|1 equipos registrados/);
 assert.match(t,/Secretaría/);
 assert.match(t,/Propuesta de campo/);
 assert.match(t,/Programación y arbitraje/);
 assert.match(t,/verificar antes de firmar/i);
 assert.doesNotMatch(t,/Inteligencia artificial generativa/i);
 assert.match(x.api.view('summary',x.ctx,''),/Resumen inteligente/);
});
test('minutes offer handwritten signatures but never claim certified signatures',()=>{
 const x=fixture();const page=x.api.view('minutes',x.ctx,'Acta inicial');
 assert.match(page,/Acta inicial/);
 assert.match(page,/data-mh-canvas="president"/);
 assert.match(page,/data-mh-canvas="secretary"/);
 assert.match(page,/no son una firma electrónica certificada/);
 assert.match(oldHub,/signature\(r\.sign\?\.images\?\.president\)/);
});
test('meeting calendar opens prefilled Google event with optional Tuesday recurrence',()=>{
 const x=fixture();
 const handled=x.api.handle('adv-ics-reminders',{},x.ctx);
 assert.equal(handled,true);
 assert.equal(x.files.length,0);
 assert.equal(x.opened.length,1);
 assert.equal(x.opened[0].title,'Junta de la Liga Juventino Rosas');
 assert.equal(x.opened[0].iso,'2099-01-13');
 assert.equal(x.opened[0].time,'19:00');
 assert.equal(x.opened[0].weekly,true);
 assert.equal(x.opened[0].venue,'Campo Municipal');
 assert.match(x.status,/Pulsa Guardar/);
 assert.match(x.api.view('calendar',x.ctx,''),/Guardar junta en Google Calendar/);
});
test('automatic app reminder calls a role-checked server endpoint only',async()=>{
 const x=fixture(),calls=[];
 x.window.LJR_MEDIA.notifyAPI=async(path,options)=>{
  calls.push({path,options});
  if(path==='/admin/me')return {actor:{permissions:['notices:read']}};
  return {ok:true};
 };
 x.api.handle('adv-server-reminder',{},x.ctx);
 await new Promise(resolve=>setImmediate(resolve));
 assert.deepEqual(calls.map(x=>x.path),['/admin/me']);
 assert.match(x.status,/rol no permite/);
});
test('attachments use IndexedDB, not public uploads; backup import preserves dates',()=>{
 assert.match(source,/indexedDB/);
 assert.match(source,/file\.size>12\*1024\*1024/);
 assert.match(source,/!Object\.hasOwn\(ctx\.state,d\)/);
 assert.match(source,/no incluye los archivos/);
 assert.match(source,/if\(!window\.LJR_MEDIA\?\.admin\)/);
});
