import test from 'node:test';
import assert from 'node:assert/strict';
import {parseDelimited} from '../src/v1222-csv-parser-core.js';
import {suggestCsvMapping,guessCsvType,csvLocalInsights,keepCsvLearning,readCsvLearning,standardCategory,compareCsvTeams} from '../src/v1222-csv-local-ai.js';

const schemas={
 equipos:{fields:[['nombre','Nombre del equipo',true,['equipo','club','nombre']],['categoria','Categoría',true,['categoria','division']],['campo','Campo',false,['sede','cancha']],['ciudad','Ciudad',false,['ciudad','comunidad']]]},
 jugadores:{fields:[['nombre','Nombre del jugador',true,['jugador','nombre']],['equipo','Equipo',true,['equipo','club']],['categoria','Categoría',false,['categoria']],['numero','Número',false,['dorsal','numero']],['fecha_nacimiento','Nacimiento',false,['nacimiento']]]},
 resultados:{fields:[['fecha','Fecha',true,['fecha']],['local','Local',true,['local']],['visitante','Visitante',true,['visitante']],['goles_local','Goles local',false,['goles local']],['goles_visitante','Goles visitante',false,['goles visitante']],['categoria','Categoría',false,['categoria']],['campo','Campo',false,['campo']]]}
};
const storage=()=>{const data=new Map();return {getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};};

test('IA local detecta estructura de resultados y mapea columnas con variantes',()=>{
 const p=parseDelimited('Fecha del partido;Equipo casa;Equipo fuera;Marcador local;Marcador visitante\n2026-10-11;A;B;3;0',';');
 const found=guessCsvType(p.headers,p.rows,schemas);
 assert.equal(found.type,'resultados');
 const r=suggestCsvMapping(p.headers,p.rows,'resultados',schemas);
 assert.equal(r.mapping.fecha,0);
 assert.equal(r.mapping.local,1);
 assert.equal(r.mapping.visitante,2);
 assert.equal(r.mapping.goles_local,3);
 assert.equal(r.mapping.goles_visitante,4);
});

test('IA local aprende nombres corregidos sin guardar filas del CSV',()=>{
 const store=storage();
 assert.equal(keepCsvLearning(store,'equipos','Plantel Escarlata','nombre'),true);
 const learned=readCsvLearning(store);
 assert.deepEqual(learned.equipos.nombre,['Plantel Escarlata']);
 const mapping=suggestCsvMapping(['Plantel Escarlata','Categoría'],[['Hermanos','Primera']],'equipos',schemas,learned);
 assert.equal(mapping.mapping.nombre,0);
 assert.equal(mapping.mapping.categoria,1);
 assert.equal(mapping.confidence.nombre,'alta');
 assert.ok(!JSON.stringify(learned).includes('Hermanos'));
});

test('IA local reconoce las cinco categorías oficiales y evita inventar',()=>{
 for(const [raw,expected] of [
  ['Primera fuerza','Primera'],['Intermedia','Intermedia'],['Segunda división','Segunda'],
  ['Vet 35','Veteranos 35+'],['Veteranos 50+','Veteranos 50+']
 ])assert.equal(standardCategory(raw),expected);
 assert.equal(standardCategory('Juvenil'),null);
});

test('Reporte local identifica categorías que necesitan revisión',()=>{
 const parsed=parseDelimited('nombre,categoria\nJuventus,Primera fuerza\nManchester,Juvenil');
 const a={missing:[],invalid:[],results:[{errors:[]},{errors:[]}]};
 const r=csvLocalInsights(parsed,'equipos',{nombre:0,categoria:1},a);
 assert.equal(r.quality,100);
 assert.equal(r.recognized,1);
 assert.equal(r.unknown,1);
 assert.ok(r.notes.some(s=>s.includes('categoría')));
});

test('IA local no mapea automáticamente una columna desconocida',()=>{
 const p=parseDelimited('equipo,categoria,valor_x\nA,Primera,ABC');
 const m=suggestCsvMapping(p.headers,p.rows,'equipos',schemas);
 assert.equal(m.mapping.ciudad,-1);
 assert.equal(m.mapping.nombre,0);
});

test('Compara clubes cargados sin inventar ni editar nombres',()=>{
 const parsed=parseDelimited('nombre,categoria\nManchester,Primera\nManchestar,Primera\nGalácticos de Pozos,Primera');
 const comparison=compareCsvTeams(parsed,'equipos',{nombre:0,categoria:1},[
  {name:'Manchester',category:'Primera'},{name:'Galácticos de Pozos',category:'Primera'}
 ]);
 assert.equal(comparison.available,true);
 assert.equal(comparison.exact,2);
 assert.equal(comparison.notFound,1);
 assert.equal(comparison.suggestions[0]?.suggested,'Manchester');
 assert.equal(parsed.rows[1][0],'Manchestar');
});
