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
 assert.equal(categories.find(c=>c.id==='3').scorers.length,0);
 for(const c of categories){assert.equal(c.stages.length,0);for(const t of c.standings)if(!c.matches.length)assert.deepEqual(t.form,[])}
});
test('multiple fixture blocks deduplicate official match IDs without crossing category',()=>{
 const row=['1','1','A','0','vs','0','B','','01/01/2026 12:00'];
 const c=normalizeCompetition({categories:{x:{fixtures:[{rows:[row]},{rows:[row]}]},y:{fixtures:[{rows:[row]}]}}});
 assert.equal(c[0].matches.length,1);assert.equal(c[1].matches.length,1);assert.notEqual(c[0].matches[0].id,c[1].matches[0].id);assert.equal(c[0].matches[0].status,'FINAL');
});
