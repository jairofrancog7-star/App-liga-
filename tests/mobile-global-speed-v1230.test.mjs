import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext,Script} from 'node:vm';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const index=read('index.html');
const media=read('src/v1230-global-mobile-perf.js');
const sw=read('public/sw.js');

test('optimizador global está cargado para todas las rutas sin modificar el enrutador',()=>{
 assert.match(index,/src\/v1230-global-mobile-perf\.js/);
 assert.match(index,/<script defer src="\.\/src\/v1230-global-mobile-perf\.js/);
 assert.match(media,/new MutationObserver/);
 assert.match(media,/requestAnimationFrame\(drain\)/);
 assert.match(media,/image\.loading='lazy'/);
 assert.match(media,/image\.decoding='async'/);
 assert.match(media,/\.modal/);
 assert.match(media,/role="dialog"/);
 assert.doesNotMatch(media,/\.src\s*=|\.srcset\s*=|replaceChildren|innerHTML\s*=/);
 new Script(media);
});
test('trabajador PWA conserva push y prioriza datos frescos',()=>{
 assert.match(sw,/addEventListener\('push'/);
 assert.match(sw,/addEventListener\('notificationclick'/);
 assert.match(sw,/request\.mode==='navigate'/);
 assert.match(sw,/cache:'no-cache'/);
 assert.match(sw,/cache:'default'/);
 assert.doesNotMatch(sw,/fetch\(event\.request,\{cache:'no-store'\}/);
 assert.match(sw,/cache\.keys\(\)/);
 assert.match(sw,/keys\.length-LIMIT/);
 new Script(sw);
});
function mockWorker(){
 const handlers={}, calls=[];
 const cached={ok:true,fromCache:true};
 const caches={
  match:async()=>cached,
  open:async()=>({
   put:async()=>{},keys:async()=>[],delete:async()=>true,addAll:async()=>{}
  }),
  keys:async()=>[],
  delete:async()=>true
 };
 const self={location:{origin:'https://liga.example'},addEventListener:(t,cb)=>{handlers[t]=cb},skipWaiting:()=>{},clients:{claim:()=>{}}};
 const fetch=async(req,opts)=>{calls.push({req,opts});return {ok:true,headers:{get:()=> '5000'},clone(){return this}}};
 runInNewContext(sw,{self,caches,fetch,URL,Response:{error:()=>({error:true})},Promise});
 return {handlers,calls,cached};
}
test('archivos versionados provienen de caché y no descargan una segunda vez',async()=>{
 const w=mockWorker();
 let response;
 w.handlers.fetch({
  request:{method:'GET',url:'https://liga.example/src/module.js?v=20261010',mode:'cors',headers:{has:()=>false}},
  respondWith:p=>{response=p;},
  waitUntil:()=>{}
 });
 assert.equal(await response,w.cached);
 assert.equal(w.calls.length,0);
});
test('página principal y JSON de partidos no usan caché antigua',async()=>{
 const w=mockWorker();
 let response;
 w.handlers.fetch({
  request:{method:'GET',url:'https://liga.example/',mode:'navigate',headers:{has:()=>false}},
  respondWith:p=>{response=p;},waitUntil:()=>{}
 });
 await response;
 assert.equal(w.calls[0].opts.cache,'no-cache');
 w.handlers.fetch({
  request:{method:'GET',url:'https://liga.example/data/official-live.json',mode:'cors',headers:{has:()=>false}},
  respondWith:p=>{response=p;},waitUntil:()=>{}
 });
 await response;
 assert.equal(w.calls[1].opts.cache,'default');
});
