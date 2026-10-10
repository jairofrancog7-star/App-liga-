import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const season=JSON.parse(read('public/data/temporada-actual-2026.json'));
const official=JSON.parse(read('public/data/official-live.json'));
const working=JSON.parse(read('data/official-live.json'));
const main=read('src/main.js');
const pc=read('src/desktop-mobile-function-bridge.js');
const v62=read('src/v62-official-league-data.js');

test('cinco categorías usan los mismos registros oficiales publicables, sin perder el rol 05–11 octubre',()=>{
 assert.deepEqual(official,working);
 assert.deepEqual(Object.keys(official.categories).sort(),['1','2','3','4','5']);
 const expected={'3':[5,'7','11/10/2026'],'5':[6,'7','11/10/2026'],'4':[6,'7','11/10/2026'],'1':[3,'8','10/10/2026']};
 for(const [id,[count,jornada,date]] of Object.entries(expected)){
   const list=official.categories[id].fixtures.flatMap(g=>g.rows||[]).filter(r=>r[1]===jornada&&String(r[8]).startsWith(date));
   assert.equal(list.length,count,official.categories[id].name);
   assert.ok(list.every(r=>r[3]==='-'&&r[5]==='-'));
 }
 assert.equal(season.categories['Segunda Fuerza'].rounds.J7.length,6);
 assert.ok(season.categories['Segunda Fuerza'].rounds.J7.every(m=>m.date==='2026-10-11'));
 assert.equal(official.categories['3'].dashboard.counts.Jugadores,292);
});

test('una resolución por default conserva ganador sin crear marcador en PC y móvil',()=>{
 assert.match(main,/"id":"m5"[^}\n]*"status":"AWARDED"/);
 assert.match(main,/m\.status==='AWARDED'\?'GANA '/);
 assert.match(pc,/fixture_decisions\?\.\[String\(r\[0\]\)\]/);
 assert.match(pc,/x\.awarded\?'GANA '/);
 assert.match(pc,/!x\.played&&!x\.awarded/);
});

test('espejo verde renumerado conserva decisión del azul por partido y resultados expresamente verificados',()=>{
 const start=v62.indexOf('function preserveBlueRegistrations(base){');
 const end=v62.indexOf('\nasync function fetchJson(',start);
 assert.ok(start>=0&&end>start);
 const source=v62.slice(start,end);
 const local={
   categories:{
     '3':{fixtures:[{rows:[['32','7','GALACTICOS','-','vs','-','LINCES','Pozos','11/10/2026 09:00']]}],fixture_decisions:{'32':{winner:'LINCES',type:'administrative',default:true,score:null}}},
     '4':{fixtures:[{rows:[['31','6','SAN JULIAN','1','vs','1','SAN JUAN FC','San Julian','27/09/2026 08:00']]}]}
   },
   latest_user_verified_results:{category_id:'4',fixtures:[{round:'6',home:'SAN JULIAN',away:'SAN JUAN FC',date:'27/09/2026',home_goals:1,away_goals:1}]}
 };
 const remote={categories:{
   '3':{fixtures:[{rows:[['900','7','GALACTICOS','-','vs','-','LINCES','Pozos','11/10/2026 09:00']]}],fixture_decisions:{}},
   '4':{fixtures:[{rows:[['999','6','SAN JULIAN','-','vs','-','SAN JUAN FC','San Julian','27/09/2026 08:00']]}]}
 }};
 const scope={
   localRegistrationSnapshot:local,
   CAT_ORDER:['3','4'],
   norm:v=>String(v??'').trim().toLowerCase(),
   same:(a,b)=>String(a??'').trim().toLowerCase()===String(b??'').trim().toLowerCase()
 };
 const fn=vm.runInNewContext(source+';preserveBlueRegistrations',scope);
 const merged=fn(remote);
 assert.equal(merged.categories['3'].fixture_decisions['900'].winner,'LINCES');
 assert.equal(merged.categories['3'].fixture_decisions['32'],undefined);
 assert.equal(merged.categories['4'].fixtures[0].rows[0][3],'1');
 assert.equal(merged.categories['4'].fixtures[0].rows[0][5],'1');
 assert.equal(remote.categories['4'].fixtures[0].rows[0][3],'-','original mirror must remain immutable');
});
