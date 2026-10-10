import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {resolve} from 'node:path';
const base=resolve(import.meta.dirname,'..');
const read=path=>readFileSync(resolve(base,path),'utf8');
const original=read('src/v1212-notice-series-cancel.js');
function fixture(admin=true){
 const starting=[
  {id:'s1-1',recurrenceId:'s1',published:false},
  {id:'s1-2',recurrenceId:'s1',published:false},
  {id:'s1-3',recurrenceId:'s1',published:true},
  {id:'s2-1',recurrenceId:'s2',published:false},
  {id:'single',published:false}
 ];
 const store={'ljr-v713-auto-notices':JSON.stringify(starting)}, events={},buttons=[];
 const action={append(button){buttons.push(button)},querySelector(){return null}};
 const card={dataset:{v713Id:'s1-1'},querySelector:key=>key==='.v713-item-actions'?action:null};
 const list={querySelectorAll:key=>key==='[data-v713-id]'?[card]:[]};
 const status={textContent:''};
 const root={dataset:{},contains:()=>true,
   querySelector:key=>key==='[data-v713-list]'?list:key==='[data-v1211-status]'?status:null,
   addEventListener:(key,cb)=>events[key]=cb};
 const document={documentElement:{},addEventListener(){},
   querySelectorAll:key=>key==='.v713-auto[data-v713-auto]'?[root]:[],
   createElement:()=>({dataset:{},setAttribute(){}})};
 let confirmed=0,refreshed=0;
 const window={addEventListener(){},LJR_MEDIA:{admin:admin?{role:'admin'}:null,api:async()=>({admin})},
   confirm(){confirmed++;return true},
   LJR_V713_NOTICE_SCHEDULER_REFRESH(){refreshed++}};
 const localStorage={getItem:key=>store[key]||null,setItem:(k,v)=>{store[k]=v}};
 class MutationObserver{observe(){}}
 runInNewContext(original,{window,document,localStorage,MutationObserver,setTimeout(){},console});
 const click=()=>new Promise(resolve=>{
   const button={dataset:{v1212Cancel:'s1'}};
   const evt={target:{closest:()=>button},preventDefault(){},stopImmediatePropagation(){}};
   Promise.resolve(events.click(evt)).then(resolve);
 });
 return {store,buttons,click,status,stats:()=>({confirmed,refreshed}),rows:()=>JSON.parse(store['ljr-v713-auto-notices'])};
}
test('producción y demo tienen el mismo código, enlazado solo en avisos',()=>{
 assert.equal(original,read('demo/src/v1212-notice-series-cancel.js'));
 assert.doesNotThrow(()=>new Function(original));
 const sourceCss=read('src/v1212-notice-series-cancel.css');
 assert.match(sourceCss,/data-v1212-cancel/);
 for(const page of ['index.html','demo/index.html']){
   const html=read(page);
   assert.match(html,/v1212-notice-series-cancel\.js/);
   if(page==='index.html'){
     assert.match(html,/v1212-notice-series-cancel\.css/);
   }else{
     // Vite agrupa los estilos en assets/index-*.css para la demo publicada.
     const cssHref=html.match(/href="\.\/assets\/([^"]+\.css)"/)?.[1];
     assert.ok(cssHref,'La demo debe cargar los estilos empaquetados');
     assert.doesNotThrow(()=>read('demo/assets/'+cssHref));
   }
 }
});
test('cancelar serie exige administrador y confirmación',async()=>{
 const x=fixture(false);
 assert.equal(x.buttons.length,1);
 assert.match(x.buttons[0].textContent,/Cancelar serie \(2\)/);
 await x.click();
 assert.equal(x.rows().length,5);
 assert.equal(x.stats().confirmed,0);
 assert.match(x.status.textContent,/administración autorizada/);
});
test('solo elimina pendientes de esa serie y conserva procesados y otros avisos',async()=>{
 const x=fixture(true);
 await x.click();
 assert.deepEqual(x.rows().map(i=>i.id),['s1-3','s2-1','single']);
 assert.equal(x.stats().confirmed,1);
 assert.equal(x.stats().refreshed,1);
 assert.match(x.status.textContent,/Cancelados 2 avisos locales/);
});
test('no hay conexión remota, mutación oficial ni borrado de avisos históricos',()=>{
 assert.doesNotMatch(original,/\bfetch\s*\(/);
 assert.doesNotMatch(original,/\/admin\/notices|\/jobs\/dispatch/);
 assert.match(original,/!row\.published/);
 assert.match(original,/LJR_MEDIA\.api\('me'\)/);
 assert.match(original,/window\.confirm/);
});
