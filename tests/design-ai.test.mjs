import test from 'node:test';
import assert from 'node:assert/strict';
import {designMessages, readDraft} from '../public/design-ai-core.mjs';

test('local writing keeps league fields as quoted data and never requests invented results', () => {
 const messages=designMessages({type:'Comunicado',title:'Junta semanal',home:'Barza',away:'Osasuna',details:'Domingo 10:00',body:'Mejorar la cancha',category:'Intermedia'});
 assert.equal(messages.length,2);
 assert.match(messages[0].content,/No inventes/);
 const brief=JSON.parse(messages[1].content);
 assert.equal(brief.home,'Barza');
 assert.equal(brief.body,'Mejorar la cancha');
});

test('reads a model chat response as editable text, including fenced JSON', () => {
 const response=[{generated_text:[{role:'user',content:'Brief'},{role:'assistant',content:'```json\n{"title":"JUNTA DE LA LIGA","body":"Nos reunimos el domingo."}\n```'}]}];
 assert.deepEqual(readDraft(response),{title:'JUNTA DE LA LIGA',body:'Nos reunimos el domingo.'});
});

test('invalid model output does not overwrite the administrator draft', () => {
 assert.throws(()=>readDraft([{generated_text:'No puedo responder'}]),/propuesta válida/);
 assert.throws(()=>readDraft([{generated_text:'{"title":"Algo"}'}]),/propuesta válida/);
});

test('local AI can propose an allowed visual style without changing match data', () => {
 const draft=readDraft([{generated_text:JSON.stringify({title:'GRAN FINAL',body:'Domingo en el campo.',style:'gold',accent:'#F2C45A',logoShape:'circle',logoSymbol:'star',home:'Inventado',scoreHome:9})}]);
 assert.deepEqual(draft,{title:'GRAN FINAL',body:'Domingo en el campo.',style:'gold',accent:'#F2C45A',logoShape:'circle',logoSymbol:'star'});
 const unsafe=readDraft([{generated_text:JSON.stringify({title:'AVISO',body:'Información.',style:'unknown',accent:'url(x)',logoShape:'triangle',logoSymbol:'script'})}]);
 assert.deepEqual(unsafe,{title:'AVISO',body:'Información.'});
 const brief=JSON.parse(designMessages({participants:'Barza\nOsasuna',style:'neon',logoSymbol:'star'})[1].content);
 assert.equal(brief.participants,'Barza\nOsasuna');
 assert.equal(brief.style,'neon');
});
