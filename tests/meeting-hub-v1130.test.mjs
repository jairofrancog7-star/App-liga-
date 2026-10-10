import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const src=readFileSync(new URL('../src/v1130-meeting-hub.js',import.meta.url),'utf8');
const root=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const demo=readFileSync(new URL('../demo/index.html',import.meta.url),'utf8');
const style=readFileSync(new URL('../src/v1130-meeting-hub.css',import.meta.url),'utf8');

function fixture(){
 const data={};let panel=null;
 const date={value:'2026-10-13',addEventListener(){}};
 const oldInputs={
  'input[data-x="date"]':date,'[data-x="date"]':date,
  '[data-x="agenda"]':{value:'Revisión de jornada'},
  '[data-x="agreements"]':{value:'Acuerdos de prueba'},
  '[data-x="attendance"]':{value:''},
  '[data-meeting-field="time"]':{value:'19:00'},
  '[data-meeting-field="place"]':{value:'Juventino Rosas'},
  '[data-meeting-field="owner"]':{value:'Secretario'},
  '[data-meeting-field="deadline"]':{value:''},
  '[data-meeting-field="tasks"]':{value:''}
 };
 const fields={
  '[data-mh-input="team"]':'Boavista FC',
  '[data-mh-input="delegate"]':'Ana',
  '[data-mh-input="status"]':'Presente',
  '[data-mh-input="task"]':'Revisar rol',
  '[data-mh-input="owner"]':'Delegado',
  '[data-mh-input="due"]':'2026-10-20',
  '[data-mh-input="proposal"]':'Cambio de cancha',
  '[data-mh-vote="team"]':'Boavista FC',
  '[data-mh-vote="vote"]':'Sí'
 };
 const voteContainer={querySelector:k=>k in fields?{value:fields[k]}:null};
 const form={dataset:{},querySelector:k=>k==='[data-v875-meeting]'?{
  insertAdjacentElement(_where,newPanel){panel=newPanel}
 }:oldInputs[k]||null,closest(){return {querySelector:()=>({addEventListener(){}})}}};
 const document={
  body:{},addEventListener(){},
  querySelector:k=>k==='.v105-meeting-form'?form:null,
  createElement:()=>({
   dataset:{},isConnected:true,innerHTML:'',events:{},
   setAttribute(){},addEventListener(k,f){this.events[k]=f},
   querySelector:k=>k==='[data-mh-status]'?{textContent:''}:k in fields?{value:fields[k]}:null
  })
 };
 const window={LJR_MEDIA:{admin:{role:'secretario'}}};
 const localStorage={getItem:k=>data[k]||null,setItem:(k,v)=>{data[k]=v}};
 class MutationObserver{observe(){}}
 runInNewContext(src,{window,document,localStorage,navigator:{},MutationObserver,setTimeout:()=>0});
 window.LJR_MEETING_HUB_V1130.mount();
 function click(action,extra={}){
  const button={dataset:{mhAction:action,...extra},closest:sel=>sel==='[data-mh-action]'?button:voteContainer};
  panel.events.click({target:button,preventDefault(){}});
 }
 return {window,form,click,get panel(){return panel},saved:()=>JSON.parse(data['ljr-meeting-hub-v1130']||'{}')};
}

test('production and demo load the same scoped meeting hub',()=>{
 // El origen carga CSS por archivo; Vite empaqueta el de demo en assets/index-*.css.
 assert.match(root,/src\/v1130-meeting-hub\.js/);
 assert.match(root,/src\/v1130-meeting-hub\.css/);
 assert.match(demo,/src\/v1130-meeting-hub\.js/);
 assert.match(demo,/assets\/index-[A-Za-z0-9_-]+\.css|src\/v1130-meeting-hub\.css/);
 assert.match(style,/grid-column:1\/-1/);
 assert.match(style,/v875-meeting-modal/);
});

test('QR encodes a Tuesday and rejects incorrect dates',()=>{
 const x=fixture();
 assert.deepEqual(JSON.parse(JSON.stringify(x.window.LJR_MEETING_HUB_V1130.parseCode('LJR-JUNTA|2026-10-13|Boavista%20FC|Ana'))),{date:'2026-10-13',team:'Boavista FC',delegate:'Ana'});
 assert.equal(x.window.LJR_MEETING_HUB_V1130.parseCode('LJR-JUNTA|2026-10-14|Boavista|Ana'),null);
 assert.equal(x.window.LJR_MEETING_HUB_V1130.parseCode('other'),null);
});

test('first attendance, task and team ballot persist by meeting date',()=>{
 const x=fixture();
 assert.match(x.panel.innerHTML,/Control de delegados/);
 x.click('add-attendee');
 x.click('add-task');
 x.click('add-proposal');
 let record=x.saved()['2026-10-13'];
 assert.equal(record.attendance.length,1);
 assert.equal(record.tasks.length,1);
 assert.equal(record.votes.length,1);
 x.click('cast-vote',{id:record.votes[0].id});
 record=x.saved()['2026-10-13'];
 assert.equal(record.attendance[0].team,'Boavista FC');
 assert.equal(record.tasks[0].status,'Pendiente');
 assert.equal(record.votes[0].ballots['boavista fc'].vote,'Sí');
 x.window.LJR_MEETING_HUB_V1130.mount();
 assert.match(x.panel.innerHTML,/Control de delegados/);
});
