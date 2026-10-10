import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {webcrypto} from 'node:crypto';

const source=fs.readFileSync(new URL('../src/v1212-local-backup-center.js',import.meta.url),'utf8');
function setup(entries={}){
 const values=new Map(Object.entries(entries));
 const localStorage={
  get length(){return values.size},
  key(i){return [...values.keys()][i]??null},
  getItem(k){return values.has(k)?values.get(k):null},
  setItem(k,v){values.set(k,String(v))},
  removeItem(k){values.delete(k)}
 };
 const window={
  LJR_MEDIA:{admin:{owner:true}},
  LJR_V105_OPEN_TOOL(name){return 'original:'+name},
  addEventListener(){}
 };
 const sandbox={window,localStorage,crypto:webcrypto,TextEncoder,TextDecoder,Blob,btoa,atob,setTimeout(){},alert(){},confirm(){return true},document:{}};
 const instrumented=source.replace('takeover();\n})();','window.__backupTest={groupOf,collect,encodeBackup,decodeBackup};\ntakeover();\n})();');
 assert.notEqual(instrumented,source);
 vm.runInNewContext(instrumented,sandbox,{filename:'v1212-local-backup-center.js'});
 return {window,localStorage,api:window.__backupTest,values};
}

test('se incluyen herramientas locales y se excluyen tokens y datos ajenos',()=>{
 const {api}=setup({'v105-sponsors-v2':'[1]','v100-theme':'blue','ljr-local-options':'{}','v105-authToken':'secreto','v105-activity':'actividad','official-data':'no'});
 const items=api.collect(['tools','settings','legacy']);
 assert.deepEqual(Object.keys(items),['ljr-local-options','v100-theme','v105-sponsors-v2']);
 assert.equal(api.groupOf('v105-token'),null);
});
test('exportación JSON abierta y verificación SHA-256',async()=>{
 const {api}=setup();
 const data=await api.encodeBackup({'v105-sponsors-v2':'[1]'},'');
 assert.equal(data.version,2);assert.equal(data.encrypted,false);
 const decoded=await api.decodeBackup(data,'');
 assert.equal(decoded.items['v105-sponsors-v2'],'[1]');
 await assert.rejects(api.decodeBackup({...data,sha256:'dañado'},''),/SHA-256/);
});
test('cifrado AES-GCM y recuperación con contraseña',async()=>{
 const {api}=setup();
 const input={'v105-sponsors-v2':'[{"nombre":"Liga"}]','v100-theme':'azul'};
 const encrypted=await api.encodeBackup(input,'frase-segura-123');
 assert.equal(encrypted.encrypted,true);
 assert.equal(encrypted.cipher,'AES-256-GCM');
 assert.equal(encrypted.items,undefined);
 const decoded=await api.decodeBackup(encrypted,'frase-segura-123');
 assert.equal(decoded.items['v100-theme'],'azul');
 await assert.rejects(api.decodeBackup(encrypted,'contraseña-equivocada'),/incorrecta|dañado/);
});
test('un archivo legacy puede importarse sin añadir valores prohibidos',async()=>{
 const {api}=setup();
 const old={generatedAt:'2026-01-01',items:{'v105-sponsors-v2':'[1]','v105-session':'token'}};
 const res=await api.decodeBackup(old,'');
 assert.equal(res.legacy,true);assert.equal(res.excluded,1);
 assert.equal(res.items['v105-sponsors-v2'],'[1]');
});
test('el reemplazo del botón conserva los demás accesos',()=>{
 const {window}=setup();
 assert.equal(window.LJR_V105_OPEN_TOOL('sponsors'),'original:sponsors');
 assert.equal(window.LJR_V105_OPEN_TOOL('meeting'),'original:meeting');
});
