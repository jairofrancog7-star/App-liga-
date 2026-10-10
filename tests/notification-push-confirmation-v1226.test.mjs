import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const file=readFileSync(new URL('../src/v1082-push-notifications.js',import.meta.url),'utf8');
const demo=readFileSync(new URL('../demo/src/v1082-push-notifications.js',import.meta.url),'utf8');
const start=file.indexOf('async function saveFilters(root){');
const end=file.indexOf('\n/* Reutilizar el panel Push existente',start);
assert.ok(start>=0&&end>start);
const fragment=file.slice(start,end);
function setup({subscription=null,ack={active:true},failKey=false,failSubscribe=false}={}){
  const stored=[],statuses=[],requests=[];
  const fn=new Function('getValues','subscription','server','keyMatches','save','status',
    fragment+'\nreturn saveFilters;')(
    ()=>({category:'1',team:'Boavista',field:'',types:['suspension','jornada']}),
    async()=>subscription,
    async(name,options)=>{
      requests.push(name);
      if(name==='public-key')return {publicKey:'key'};
      if(failSubscribe)throw Error('API sin conexión');
      return ack;
    },
    ()=>!failKey,
    value=>stored.push(value),
    (_root,message)=>statuses.push(message)
  );
  return {run:()=>fn({}),stored,statuses,requests};
}
test('Push: local preferences are saved only after server confirms remote update',async()=>{
 const device={endpoint:'https://push.example/device',toJSON(){return {endpoint:this.endpoint}}};
 const s=setup({subscription:device});
 await s.run();
 assert.equal(s.stored.length,1);
 assert.deepEqual(s.requests,['public-key','subscribe']);
 assert.match(s.statuses.at(-1),/confirmados por el servidor/);
});
test('Push: server failure never marks changed remote filters as locally saved',async()=>{
 const device={endpoint:'https://push.example/device',toJSON(){return {endpoint:this.endpoint}}};
 const s=setup({subscription:device,failSubscribe:true});
 await assert.rejects(s.run(),/API sin conexión/);
 assert.equal(s.stored.length,0);
});
test('Push: a missing acknowledgement cannot be confused with confirmed filters',async()=>{
 const device={endpoint:'https://push.example/device',toJSON(){return {endpoint:this.endpoint}}};
 const s=setup({subscription:device,ack:{ok:true,active:false}});
 await assert.rejects(s.run(),/no confirmó/i);
 assert.equal(s.stored.length,0);
});
test('Push: another VAPID key cannot overwrite a subscription',async()=>{
 const device={endpoint:'https://push.example/device'};
 const s=setup({subscription:device,failKey:true});
 await assert.rejects(s.run(),/otra clave Push/i);
 assert.equal(s.stored.length,0);
 assert.deepEqual(s.requests,['public-key']);
});
test('Push: without browser subscription only local filters are stored',async()=>{
 const s=setup();
 await s.run();
 assert.equal(s.stored.length,1);
 assert.deepEqual(s.requests,[]);
 assert.match(s.statuses.at(-1),/solo en este dispositivo/);
});
test('Push: action errors survive a subsequent visual status refresh',async()=>{
 let listener;
 const message={textContent:'',dataset:{}},toggle={disabled:false,dataset:{}};
 const controls=[{disabled:false},{disabled:false}];
 const panel={
  querySelectorAll(){return controls;},
  querySelector(q){return q==='[data-v1082-status]'?message:toggle;}
 };
 const button={hasAttribute(q){return q==='data-v1082-save'},closest(){return panel}};
 const event={target:{closest(){return button}},preventDefault(){}};
 const begin=file.indexOf("document.addEventListener('click',async event=>{");
 const finish=file.indexOf('\nfunction mount(){',begin);
 assert.ok(begin>=0&&finish>begin);
 const handler=file.slice(begin,finish);
 new Function('document','$','status','saveFilters','subscription','disable','enable','syncState',
   'let working=false;\n'+handler)(
   {addEventListener(_event,cb){listener=cb;}},
   (query)=>panel.querySelector(query),
   (_root,value)=>{message.textContent=value;},
   async()=>{throw Error('Conexión del servidor rechazada');},
   async()=>null,async()=>{},async()=>{},
   async()=>{message.textContent='Servidor Push disponible';}
 );
 await listener(event);
 assert.match(message.textContent,/Conexión del servidor rechazada/);
 assert.ok(controls.every(x=>x.disabled===false));
});
test('Push: demo and principal script match and JavaScript parses',()=>{
 assert.equal(file,demo);
 assert.doesNotThrow(()=>new Function(file));
});