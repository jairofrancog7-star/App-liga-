import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {webcrypto} from 'node:crypto';
import {File,Blob} from 'node:buffer';

const source=fs.readFileSync(new URL('../src/v1213-indexeddb-backup.js',import.meta.url),'utf8');
function harness(){
 const window={indexedDB:{},LJR_MEDIA:{admin:{owner:true}}};
 const sandbox={window,crypto:webcrypto,TextEncoder,TextDecoder,Blob,File,btoa,atob,Date,console};
 const marked=source.replace('window.LJR_INDEXED_BACKUP={mount,version:VERSION};','window.__idbTests={wire,unwire,seal,unseal,build,SPECS,FORMAT};\nwindow.LJR_INDEXED_BACKUP={mount,version:VERSION};');
 assert.notEqual(marked,source);
 vm.runInNewContext(marked,sandbox,{filename:'v1213-indexeddb-backup.js'});
 return {api:window.__idbTests,window};
}
test('catálogo limitado: sólo cuatro bases con fotos y documentos',()=>{
 const {api}=harness();
 assert.deepEqual(Array.from(api.SPECS,s=>s.db),['ljr-player-photos-v1','ljr-incidents-media-v1','ljr-registration-media','LJR-Juntas-Archivos']);
 assert.equal(api.SPECS[2].default,false);
 assert.equal(api.SPECS[3].default,false);
});
test('fotografías y documentos File/Blob recuperan bytes y metadatos',async()=>{
 const {api}=harness();
 const original={id:'jug-19',photo:new File([Uint8Array.from([0,1,2,255])],'foto.jpg',{type:'image/jpeg'}),note:new Blob(['hola'],{type:'text/plain'}),date:new Date('2026-10-10T00:00:00Z')};
 const normalized=await api.wire(original);
 const decoded=api.unwire(normalized);
 assert.equal(decoded.id,original.id);
 assert.equal(decoded.photo.name,'foto.jpg');
 assert.equal(decoded.photo.type,'image/jpeg');
 assert.deepEqual(Array.from(new Uint8Array(await decoded.photo.arrayBuffer())),[0,1,2,255]);
 assert.equal(decoded.note.type,'text/plain');
 assert.equal(await decoded.note.text(),'hola');
 assert.equal(decoded.date.toISOString(),'2026-10-10T00:00:00.000Z');
});
test('AES-256-GCM sólo permite abrir copia con contraseña correcta y manifiesto válido',async()=>{
 const {api}=harness();
 const snapshot={payload:JSON.stringify({groups:[{id:'player',records:[{key:'j1',value:await api.wire({id:'j1',blob:new Blob(['foto'])})}]}]}),count:1,groups:[{id:'player',count:1}]};
 const archive=await api.seal(snapshot,'contraseña-larga-abc');
 assert.equal(archive.encrypted,true);
 assert.equal(archive.cipher,'AES-256-GCM');
 assert.equal(archive.version,1);
 assert.equal(archive.records,1);
 const read=await api.unseal(archive,'contraseña-larga-abc');
 assert.equal(read.total,1);
 assert.equal(read.groups[0].records[0].key,'j1');
 await assert.rejects(api.unseal(archive,'contraseña-incorrecta'),/Contraseña incorrecta/);
 await assert.rejects(api.unseal({...archive,payload:archive.payload.slice(0,-4)+'AAAA'},'contraseña-larga-abc'),/Contraseña incorrecta|dañado|invalid/i);
});
test('se rechazan grupos ajenos y discrepancias de identificadores',async()=>{
 const {api}=harness();
 const bad=[{id:'otra-base',records:[]}];
 const sealGroups=groups=>api.seal({payload:JSON.stringify({groups}),groups:groups.map(g=>({id:g.id,count:g.records.length})),count:groups.reduce((s,g)=>s+g.records.length,0)},'clave-segura-larga');
 const wrongGroup=await sealGroups(bad);
 await assert.rejects(api.unseal(wrongGroup,'clave-segura-larga'),/Grupo del respaldo desconocido/);
 const mismatch=await sealGroups([{id:'player',records:[{key:'j1',value:await api.wire({id:'j2'})}]}]);
 await assert.rejects(api.unseal(mismatch,'clave-segura-larga'),/identificador/);
});
test('la funcionalidad sólo admite creación de copias con consentimiento',()=>{
 const {api}=harness();
 assert.ok(typeof api.build==='function');
 assert.match(source,/showDirectoryPicker\(\{mode:'readwrite'\}\)/);
 assert.match(source,/store\.get\(item\.key\)/);
 assert.match(source,/store\.add\(value/);
 assert.doesNotMatch(source,/store\.put\(/);
});
