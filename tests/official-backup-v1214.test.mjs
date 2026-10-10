import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {webcrypto} from 'node:crypto';

const source=fs.readFileSync(new URL('../src/v1212-official-backup-center.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../src/v1212-official-backup-center.css',import.meta.url),'utf8');

function setup({owner=true}={}){
 const state=new Map(),requests=[],alerts=[];
 const session={
  admin:owner===null?null:{owner},
  async api(path){
   requests.push(path);
   if(path==='me')return {admin:{owner}};
   if(path==='content?admin=1')return {items:[{id:1,title:'Liga de prueba'}]};
   throw Error('Unexpected CMS request '+path);
  }
 };
 const window={LJR_MEDIA:session,alert:message=>alerts.push(message)};
 const localStorage={
  getItem:key=>state.has(key)?state.get(key):null,
  setItem:(key,value)=>state.set(key,String(value)),
  removeItem:key=>state.delete(key)
 };
 const context=vm.createContext({
  window,localStorage,document:{},crypto:webcrypto,TextEncoder,TextDecoder,
  Blob,URL,Uint8Array,Date,console,atob,btoa,setTimeout,clearTimeout
 });
 const marker='window.LJR_BACKUP_CENTER={open:start};';
 assert.ok(source.includes(marker),'backup module must retain expected public API');
 vm.runInContext(source.replace(marker,'window.LJR_BACKUP_CENTER={open:start,__qa:{encrypt,decrypt,inspect,trendModel,recordHistory,shouldAutoReview,principal,records}};'),context);
 return {qa:window.LJR_BACKUP_CENTER.__qa,session,requests,alerts,state};
}

test('AES-256-GCM round trip, password mismatch and tampering are handled locally',async()=>{
 const {qa}=setup();
 const data=[{id:'1',title:'Partido oficial'},{id:'2',title:'Tabla de resultados'}];
 const password='MiClave-Liga-Juventino-2026!';
 const envelope=await qa.encrypt(data,password);
 assert.equal(envelope.format,'ljr-admin-backup-encrypted-v2');
 assert.equal(envelope.algorithm,'AES-256-GCM');
 assert.equal(envelope.kdf.iterations,310000);
 assert.ok(!JSON.stringify(envelope).includes('Partido oficial'),'encrypted file must not expose player/admin content');
 const decoded=await qa.decrypt(envelope,password);
 assert.equal(JSON.stringify(decoded.records),JSON.stringify(data));
 await assert.rejects(()=>qa.decrypt(envelope,'contraseña incorrecta'),/incorrecta|alterado/);
 const tampered={...envelope,ciphertext:(envelope.ciphertext[0]==='A'?'B':'A')+envelope.ciphertext.slice(1)};
 await assert.rejects(()=>qa.decrypt(tampered,password),/incorrecta|alterado/);
});
test('the adaptive model requires four distinct dates and flags exceptional changes',()=>{
 const {qa}=setup();
 const repeated=Array.from({length:8},(_,i)=>({at:'2026-10-01T0'+i+':00:00Z',count:100+i}));
 assert.equal(qa.trendModel(100,repeated).ready,false);
 const historical=['2026-10-01','2026-10-02','2026-10-03','2026-10-04'].map((d,i)=>({at:d+'T12:00:00Z',count:100+i}));
 assert.equal(qa.trendModel(102,historical).ready,true);
 assert.equal(qa.trendModel(102,historical).abnormal,false);
 assert.equal(qa.trendModel(170,historical).abnormal,true);
});
test('local history stores only aggregate counts and merges same-day reviews',()=>{
 const {qa,state}=setup();
 qa.recordHistory(90);
 qa.recordHistory(95);
 const rows=JSON.parse(state.get('ljr-official-backup-summaries-v1212'));
 assert.equal(rows.length,1);
 assert.equal(rows[0].count,95);
 assert.deepEqual(Object.keys(rows[0]).sort(),['at','count']);
});
test('automatic analysis respects the 24-hour cooldown',()=>{
 const {qa}=setup();
 const now=Date.parse('2026-10-10T21:00:00Z');
 assert.equal(qa.shouldAutoReview('2026-10-10T20:59:00Z',now),false);
 assert.equal(qa.shouldAutoReview('2026-10-09T21:00:00Z',now),true);
 assert.equal(qa.shouldAutoReview('',now),true);
});
test('non-owner cannot retrieve private records',async()=>{
 const denied=setup({owner:false});
 await assert.rejects(()=>denied.qa.records(),/cuenta principal/);
 assert.deepEqual(denied.requests,['me']);
 const anon=setup({owner:null});
 await assert.rejects(()=>anon.qa.records(),/iniciar sesión/);
 assert.deepEqual(anon.requests,[]);
 const allowed=setup({owner:true});
 assert.equal((await allowed.qa.records()).length,1);
 assert.deepEqual(allowed.requests,['me','content?admin=1']);
});
test('the backup styles use the official CMS palette and mobile-safe controls',()=>{
 for(const color of ['#08144f','#102b75','#2464c9'])assert.ok(css.includes(color));
 assert.match(css,/data-v563-cms=backup/);
 assert.match(css,/max-height:88dvh/i);
 assert.match(css,/input\[type=checkbox\]/);
});
