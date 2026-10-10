import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const source=readFileSync(new URL('../src/v1082-push-notifications.js',import.meta.url),'utf8');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const begin=source.indexOf('async function syncState(root){');
const end=source.indexOf('async function enable(root){',begin);
assert.ok(begin!==-1&&end>begin,'Debe existir el diagnóstico Web Push');
const extracted=source.slice(begin,end);

function setup({supported=true,sub=null,serverError=false,permission='granted'}={}){
 const label={textContent:''},toggle={disabled:false,textContent:'',dataset:{}};
 const messages=[];
 let queriedServer=0,queriedSubscription=0;
 const fn=new Function('$','supported','apiBase','server','subscription','keyMatches','status','Notification',
    extracted+'\nreturn syncState;')(
    s=>s==='[data-v1082-state]'?label:toggle,
    ()=>supported,
    async()=> 'https://push.example.test',
    async(path)=>{queriedServer++;assert.equal(path,'public-key');if(serverError)throw Error('unavailable');return {publicKey:'vapid-public-key'};},
    async()=>{queriedSubscription++;return sub;},
    ()=>true,
    (_root,message)=>messages.push(message),
    {permission}
 );
 return {check:()=>fn({}),label,toggle,messages,get requests(){return {server:queriedServer,subscription:queriedSubscription}}};
}

test('Push: comprueba el servidor incluso si no existe una suscripción previa',async()=>{
 const x=setup();
 await x.check();
 assert.equal(x.requests.server,1);
 assert.equal(x.requests.subscription,1);
 assert.match(x.label.textContent,/Servidor Push disponible/);
 assert.match(x.messages.join(' '),/falta activar este dispositivo|Activa avisos/i);
});

test('Push: no dice activo si el servidor no responde',async()=>{
 const x=setup({serverError:true,sub:{endpoint:'https://dummy.example.test'}});
 await x.check();
 assert.match(x.label.textContent,/Servidor Push no disponible/);
 assert.equal(x.toggle.disabled,true);
 assert.equal(x.requests.subscription,0);
});

test('Push: suscripción local no equivale a entrega Android confirmada',async()=>{
 const x=setup({sub:{endpoint:'https://dummy.example.test'}});
 await x.check();
 assert.match(x.label.textContent,/suscripción en este navegador/);
 assert.match(x.messages.join(' '),/prueba real/);
 assert.doesNotMatch(x.label.textContent,/entrega confirmada/i);
});

test('Push: permisos denegados muestran bloqueo y desactivan alta',async()=>{
 const x=setup({permission:'denied'});
 await x.check();
 assert.match(x.label.textContent,/bloqueadas/);
 assert.equal(x.toggle.disabled,true);
});

test('Push: mantiene compatibilidad y cache bust en HTML',()=>{
 assert.doesNotThrow(()=>new Function(source));
 assert.match(html,/v1082-push-notifications\.js\?v=20261010-v1227-self-test/);
 assert.match(extracted,/server\('public-key'\)/);
 assert.match(extracted,/Notification\.permission==='denied'/);
});
