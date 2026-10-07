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
