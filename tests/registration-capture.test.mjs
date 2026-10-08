import test from 'node:test';
import assert from 'node:assert/strict';
import { validateCurp, extractCurp, parseIdentity, completion, matchAttachment, rosterNames } from '../src/registration-core.js';
const valid='GAFJ900101HGT RRR00'.replace(/ /g,'');
test('CURP checks checksum, state and calendar without manufacturing characters',()=>{
  // Calculate a synthetic check digit for test-only data.
  const alphabet='0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
  const prefix=valid.slice(0,17);
  const curp=prefix+((10-[...prefix].reduce((s,c,i)=>s+alphabet.indexOf(c)*(18-i),0)%10)%10);
  assert.equal(validateCurp(curp).ok,true);
  assert.equal(validateCurp(curp).dob,'1990-01-01');
  assert.equal(extractCurp('CURP: '+curp),curp);
  assert.equal(extractCurp(curp.slice(0,17)+((Number(curp[17])+1)%10)), '');
  assert.equal(validateCurp(curp.replace('900101','900231')).ok,false);
  assert.equal(validateCurp(curp.replace('GT','ZZ')).ok,false);
});
test('INE surname lines are reordered and document headings excluded',()=>{
  const p=parseIdentity('INSTITUTO NACIONAL ELECTORAL\nNOMBRE\nFRANCO\nGARDUÑO\nJAIRO\nDOMICILIO\nCALLE 1');
  assert.equal(p.name,'JAIRO FRANCO GARDUÑO');
  assert.equal(parseIdentity('NOMBRES: JOSE LUIS\nPRIMER APELLIDO: DE LA CRUZ\nSEGUNDO APELLIDO: ROSAS').name,'JOSE LUIS DE LA CRUZ ROSAS');
});
test('photo alone is insufficient for credential readiness',()=>{
  assert.deepEqual(completion({name:'Juan Pérez',team:'Equipo'},true).missing,['CURP válida','Fecha de nacimiento']);
});
test('attachment matching never chooses between homonyms or partial names',()=>{
  const records=[{id:'a',name:'José Luis Pérez'},{id:'b',name:'Juan Pérez'}];
  assert.equal(matchAttachment('Jose_Luis_Perez.jpg',records)?.id,'a');
  assert.equal(matchAttachment('Juan.jpg',records),null);
  assert.equal(matchAttachment('Juan_Perez.png',[...records,{id:'c',name:'Juan Pérez'}]),null);
});
test('one row yields one player and Rosas is a surname, not page noise',()=>{
  assert.deepEqual(rosterNames('LISTA DE JUGADORES\n1. Juan Franco Rosas\n2. José Luis Pérez\n3. Carlos Mendoza López'),['Juan Franco Rosas','José Luis Pérez','Carlos Mendoza López']);
});
