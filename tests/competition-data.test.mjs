import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {normalizeCompetition,statistics,number} from '../src/competition-data.js';
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
 const primera=categories.find(c=>c.id==='3').matches.find(m=>m.round==='7'&&m.home==='LINCES'&&m.away==='GALACTICOS');
 const veteranos=categories.find(c=>c.id==='1').matches.find(m=>m.round==='8'&&m.home==='BOAVISTA'&&m.away==='BOCA JRS');
 for(const m of [primera,veteranos]){assert.ok(m);assert.equal(m.status,'AWARDED');assert.equal(m.complete,false);assert.equal(m.homeScore,null);assert.equal(m.awayScore,null);assert.ok(m.decision?.winner)}
 const j8=categories.find(c=>c.id==='1').matches.filter(m=>m.round==='8');
 assert.equal(j8.length,3);
 assert.equal(j8.find(m=>m.home==='MANCHESTER').time,'15:00');
 assert.equal(j8.find(m=>m.home==='TOROS DE CUENDA').time,'16:30');
 const friendly=categories.find(c=>c.id==='2').matches.find(m=>m.round==='AMISTOSO');
 assert.ok(friendly);assert.equal(friendly.complete,false);assert.equal(friendly.iso,'');
});
