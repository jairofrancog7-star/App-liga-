import test from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {BACKUP_FORMAT,clean,makeLocalIndex,mergeRegistry,parseRegistry,encryptRegistry,decryptRegistry} from '../src/local-registration-core.js';

const input={
 seasons:{
  '2025–2026':[
   {id:'reg-1',name:'José Luis Pérez',team:'Galácticos de Pozos',category:'Primera',curp:'DATOPRIVADONOPUBLICAR',status:'Pendiente',updatedAt:'2026-01-01'},
   {id:'reg-2',name:'María Flores',team:'La Esperanza',category:'Intermedia',curp:'CURPSECRETA',status:'Registrada',updatedAt:'2026-01-02'}
  ],
  '2026–2027':[{id:'reg-3',name:'José Luis Pérez',team:'Galácticos de Pozos',status:'Renovación',curp:'SECRETO'}]
 },
 customMetadata:{nonDestructive:true}
};
test('indice local por temporada y apellido sin CURP',()=>{
 const rows=makeLocalIndex(JSON.stringify(input));
 assert.equal(rows.length,3);
 assert.ok(rows[0].tokens.includes('perez'));
 assert.equal(clean(' LÓBOS JrS '),'lobos jrs');
 assert.equal(rows[0].key,'2025–2026|reg-1');
 assert.equal(rows[2].key,'2026–2027|reg-3');
 assert.ok(!JSON.stringify(rows).includes('CURPSECRETA'));
 assert.ok(!JSON.stringify(rows).includes('DATOPRIVADONOPUBLICAR'));
});
test('restaurar conserva registros actuales y omite duplicados',()=>{
 const incoming={seasons:{'2025–2026':[
  {id:'reg-1',name:'Nombre antiguo',team:'No debe reemplazar'},
  {id:'reg-4',name:'Nuevo jugador',team:'Galácticos'}
 ]}};
 const result=mergeRegistry(JSON.stringify(input),JSON.stringify(incoming));
 assert.equal(result.added,1);assert.equal(result.existing,1);
 assert.equal(result.registry.customMetadata.nonDestructive,true);
 assert.equal(result.registry.seasons['2025–2026'][0].name,'José Luis Pérez');
 assert.equal(result.registry.seasons['2025–2026'].length,3);
});
test('AES-GCM cifra sin datos visibles y restaura solamente con la clave',async()=>{
 const data=await encryptRegistry(JSON.stringify(input),'clave-super-segura-123',webcrypto);
 assert.equal(data.format,BACKUP_FORMAT);assert.equal(data.cipher,'AES-256-GCM');
 assert.doesNotMatch(JSON.stringify(data),/CURPSECRETA|DATOPRIVADONOPUBLICAR/);
 const restored=await decryptRegistry(data,'clave-super-segura-123',webcrypto);
 assert.deepEqual(restored.seasons['2025–2026'],input.seasons['2025–2026']);
 assert.equal(restored.customMetadata.nonDestructive,true);
 await assert.rejects(decryptRegistry(data,'clave-incorrecta',webcrypto),/No se pudo abrir/);
});
test('rechaza archivo no compatible y contraseña debil',async()=>{
 await assert.rejects(encryptRegistry(JSON.stringify(input),'corta',webcrypto),/al menos 10/);
 await assert.rejects(decryptRegistry({format:'otro',version:1},'clave-fuerte-123',webcrypto),/no compatible/);
 assert.throws(()=>parseRegistry({seasons:{'2026–2027':'incorrecto'}}),/Temporada no valida/);
});
test('Dexie se aloja localmente y el envio a OCR remoto se bloquea',()=>{
 const view=readFileSync(new URL('../src/v1011-local-registry.js',import.meta.url),'utf8');
 const vendor=readFileSync(new URL('../src/vendor/dexie-4.0.11.min.js',import.meta.url),'utf8');
 const capture=readFileSync(new URL('../src/registration-capture.js',import.meta.url),'utf8');
 assert.match(view,/\.\/vendor\/dexie-4\.0\.11\.min\.js/);
 assert.ok(vendor.length>90000);
 assert.doesNotMatch(capture,/requestService\(/);
 assert.doesNotMatch(capture,/data-capture-connect/);
});
