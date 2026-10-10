import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const src=readFileSync(new URL('../src/v668-field-operations.js',import.meta.url),'utf8');
const fallback=readFileSync(new URL('../src/v635-permission-builder.js',import.meta.url),'utf8');
const data=JSON.parse(readFileSync(new URL('../public/data/fields-v38-22.json',import.meta.url),'utf8'));
const ids=['uds-1','uds-2','uds-3','campo-4','fraccionamiento','romerillo',
  'san-julian','franco-tavera','cuenda','pozos','cerrito','san-jose','san-juan','rincon'];
const newVenues=new Map([
  ['pozos','Campo de Fútbol de Pozos'],
  ['cerrito','Campo Cerrito de Gasca'],
  ['san-jose','Campo San José de la Montaña'],
  ['san-juan','Campo San Juan de la Cruz'],
  ['rincon','Campo Rincón de Centeno']
]);
test('Revisión física: incluye catorce canchas y conserva los IDs existentes',()=>{
  const block=src.match(/const FIELDS=\[([\s\S]*?)\];/);
  assert.ok(block);
  const entries=[...block[1].matchAll(/\['([^']+)','([^']+)'\]/g)].map(x=>[x[1],x[2]]);
  assert.equal(entries.length,14);
  assert.deepEqual(entries.map(x=>x[0]),ids);
  assert.equal(new Set(entries.map(x=>x[0])).size,14);
  for(const [id,name] of newVenues)assert.equal(entries.find(x=>x[0]===id)?.[1],name);
});
test('Las nuevas canchas se conectan a la revisión meteorológica existente',()=>{
  const map=src.match(/const WEATHER_FIELD_MAP=\{([\s\S]*?)\};/);
  assert.ok(map);
  for(const id of newVenues.keys())assert.match(map[1],new RegExp("'"+id+"':'"+id+"'"));
  for(const id of newVenues.keys())assert.ok(data.fields.some(f=>f.id===id));
});
test('La lista alternativa de permisos también incluye las cinco sedes',()=>{
  const list=fallback.match(/const PERMISSION_FIELDS=\[([\s\S]*?)\];/);
  assert.ok(list);
  for(const name of newVenues.values())assert.ok(list[1].includes("'"+name+"'"));
});

test('El normalizador conserva los identificadores de las canchas al guardar',()=>{
  const normalizer=readFileSync(new URL('../src/v881-global-field-normalizer.js',import.meta.url),'utf8');
  assert.equal((src.match(/data-v668-stable-field/g)||[]).length,2);
  assert.match(normalizer,/preserveFieldIds=el\.hasAttribute\('data-v668-stable-field'\)/);
  assert.match(normalizer,/!preserveFieldIds &&/);
});
