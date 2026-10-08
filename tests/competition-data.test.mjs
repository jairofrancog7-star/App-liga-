import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {normalizeCompetition,statistics,number,leaguePoints,DEFAULT_LOSS_PENALTY,defaultDefeatedTeam} from '../src/competition-data.js';
const db=JSON.parse(fs.readFileSync(new URL('../public/data/official-live.json',import.meta.url)));
const categories=normalizeCompetition(db);
test('all published categories and standings values survive normalization',()=>{
 assert.equal(categories.length,Object.keys(db.categories).length);
 for(const c of categories){const source=db.categories[c.id].standings.flatMap(b=>b.rows);assert.equal(c.standings.length,source.length);c.standings.forEach((r,i)=>{assert.equal(r.pts,number(source[i][9]));assert.equal(r.classified,false)})}
});
test('missing scores are never coerced to zero or a final result',()=>{
 assert.equal(number('-'),null);assert.equal(number(''),null);assert.equal(number(null),null);assert.equal(number('0'),0);
 for(const c of categories)for(const m of c.matches)if(m.raw[3]==='-'||m.raw[5]==='-'){assert.equal(m.complete,false);assert.notEqual(m.status,'FINAL')}
});
test('category statistics use only complete category results',()=>{
 for(const c of categories){const complete=c.matches.filter(m=>m.complete);assert.equal(statistics(c)['Resultados completos'],complete.length);if(complete.length)assert.equal(statistics(c)['Goles (resultados completos)'],complete.reduce((a,m)=>a+m.homeScore+m.awayScore,0))}
});
test('unpublished scorers and stages remain empty; no fabricated form',()=>{
 const empty=normalizeCompetition({categories:{'3':{scorers:[],fixtures:[],standings:[]}}})[0];
 assert.deepEqual(empty.scorers,[]);assert.deepEqual(empty.stages,[]);
 for(const c of categories){assert.equal(c.stages.length,0);for(const t of c.standings)if(!c.matches.length)assert.deepEqual(t.form,[])}
});
test('multiple fixture blocks deduplicate official match IDs without crossing category',()=>{
 const row=['1','1','A','0','vs','0','B','','01/01/2026 12:00'];
 const c=normalizeCompetition({categories:{x:{fixtures:[{rows:[row]},{rows:[row]}]},y:{fixtures:[{rows:[row]}]}}});
 assert.equal(c[0].matches.length,1);assert.equal(c[1].matches.length,1);assert.notEqual(c[0].matches[0].id,c[1].matches[0].id);assert.equal(c[0].matches[0].status,'FINAL');
});

test('J7/J8 rol: las victorias administrativas no inventan marcadores',()=>{
 const primera=categories.find(c=>c.id==='3').matches.find(m=>m.round==='7'&&m.home==='GALACTICOS'&&m.away==='LINCES');
 const veteranos=categories.find(c=>c.id==='1').matches.find(m=>m.round==='8'&&m.home==='BOAVISTA'&&m.away==='BOCA JRS');
 for(const m of [primera,veteranos]){assert.ok(m);assert.equal(m.status,'AWARDED');assert.equal(m.complete,false);assert.equal(m.homeScore,null);assert.equal(m.awayScore,null);assert.ok(m.decision?.winner)}
 const j8=categories.find(c=>c.id==='1').matches.filter(m=>m.round==='8');
 assert.equal(j8.length,3);
 assert.equal(j8.find(m=>m.home==='LA ESPERANZA'&&m.away==='MANCHESTER').time,'15:30');
 assert.equal(j8.find(m=>m.home==='TOROS DE CUENDA').time,'17:00');
 const friendly=categories.find(c=>c.id==='2').matches.find(m=>m.round==='AMISTOSO');
 assert.ok(friendly);assert.equal(friendly.complete,false);assert.equal(friendly.iso,'');
});

test('regla de toda la liga: derrota normal 0; derrota por default -3, nunca se limita a cero',()=>{
 assert.equal(DEFAULT_LOSS_PENALTY,-3);
 assert.equal(leaguePoints(),0);
 assert.equal(leaguePoints({defaultLosses:1}),-3);
 assert.equal(leaguePoints({defaultLosses:2}),-6);
 assert.equal(leaguePoints({wins:1,draws:1,defaultLosses:1}),1);
 assert.equal(leaguePoints({wins:2,draws:0,defaultLosses:2}),0);
 assert.equal(leaguePoints({defaultLosses:-1}),null);
});
test('default: identifica el equipo sancionado sin asignar goles inventados',()=>{
 const first=categories.find(c=>c.id==='3').matches.find(m=>m.home==='GALACTICOS'&&m.away==='LINCES'&&m.decision);
 const veterans=categories.find(c=>c.id==='1').matches.find(m=>m.home==='BOAVISTA'&&m.away==='BOCA JRS'&&m.decision);
 assert.ok(first);assert.ok(veterans);
 assert.equal(first.defaultLoser,'GALACTICOS');
 assert.equal(veterans.defaultLoser,'BOCA JRS');
 for(const m of [first,veterans]){
  assert.equal(m.defaultPointAdjustment,-3);
  assert.equal(m.complete,false);
  assert.equal(m.homeScore,null);
  assert.equal(m.awayScore,null);
 }
 assert.equal(defaultDefeatedTeam({type:'administrative',winner:'B'},'A','B'),null,'un fallo administrativo sin DEFAULT explícito no resta puntos');
 assert.equal(defaultDefeatedTeam({type:'administrative',winner:'Equipo ajeno'},'A','B'),null);
 assert.equal(defaultDefeatedTeam(null,'A','B'),null);
});
test('tres resultados de la captura AdminFut coinciden con los de la app, sin duplicados',()=>{
 const veteran=categories.find(c=>c.id==='1');
 const pick=(home,away)=>veteran.matches.filter(m=>m.home===home&&m.away===away&&Number(m.round)<8);
 const dynamo=pick('DYNAMO','LA ESPERANZA')[0];
 const boavista=pick('BOAVISTA','LA ESPERANZA')[0];
 const manchester=pick('MANCHESTER','LA ESPERANZA')[0];
 assert.deepEqual([dynamo.homeScore,dynamo.awayScore],[1,2]);
 assert.deepEqual([boavista.homeScore,boavista.awayScore],[2,1]);
 assert.equal(manchester.homeScore,3);
 assert.equal(manchester.awayScore,0);
 assert.equal(manchester.complete,true);
 assert.equal(new Set([dynamo.id,boavista.id,manchester.id]).size,3);
});
test('puntos oficiales: negativos conservados en todas las categorías, nunca descontados dos veces',()=>{
 for(const c of categories){
  const source=db.categories[c.id].standings.flatMap(b=>b.rows);
  c.standings.forEach((row,i)=>assert.equal(row.pts,number(source[i][9])));
 }
 const boca=categories.find(c=>c.id==='1').standings.find(r=>r.name==='BOCA JRS');
 assert.ok(boca);assert.equal(boca.pts,-21);
});
