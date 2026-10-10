import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const shared=readFileSync(new URL('../src/knockout-reference.js',import.meta.url),'utf8');
const context={window:{}};vm.runInNewContext(shared,context);const api=context.window.LJR_KNOCKOUT;
const rows=Array.from({length:24},(_,i)=>({name:`Club ${i+1}`,pos:i+1}));
test('all 24 clubs have exactly one entry position; direct seeds agree with standings',()=>{
 const m=api.model({fixtures:[]},rows,true);assert.equal(m.projection,true);
 assert.equal(m.seeds.length,8);assert.equal(m.playoffs.length,8);
 const entrants=[...m.seeds,...m.playoffs.flatMap(m=>m.teams)].filter(Boolean);
 assert.equal(entrants.length,24);assert.equal(new Set(entrants.map(t=>t.name)).size,24);
 assert.deepEqual(Array.from(m.seeds,t=>t.seed),[1,2,3,4,5,6,7,8]);
});
test('short and odd categories do not invent or duplicate clubs',()=>{
 for(const n of [0,1,8,9,11,12,16,23]){
  const m=api.model({fixtures:[]},rows.slice(0,n),true);
  const entrants=[...m.seeds,...m.playoffs.flatMap(m=>m.teams)].filter(Boolean);
  assert.equal(entrants.length,n);assert.equal(new Set(entrants.map(t=>t.name)).size,n);
 }
});
test('an official fixture in any phase suppresses inferred simulated entrants',()=>{
 const fixture=['','Cuartos de final','Juventus','2','vs','1','Boavista','','11/10/2026'];
 const category={fixtures:[{rows:[fixture,fixture]}]};
 const m=api.model(category,rows,true);assert.equal(m.projection,false);assert.equal(m.games.cuartos.length,1);
 assert.equal(m.games.cuartos[0].teams[0].score,2);
 const html=api.render({category,rows,simulate:true});assert.ok(html.includes('JUV'));assert.ok(html.includes('BOA'));assert.ok(!html.includes('Club 1'));assert.ok(html.includes('11/10/2026'));
});
test('Competition never generates official matches from rankings',()=>{
 const m=api.model({fixtures:[]},rows,false);assert.equal(m.projection,false);assert.equal(m.seeds.length,0);assert.equal(m.playoffs.length,0);
 const html=api.render({category:{fixtures:[]},rows,simulate:false});assert.ok(html.includes('Cruces oficiales por definir'));assert.ok(!html.includes('Club 1'));
});
test('one shared renderer keeps all five rounds and the projection notice accessible',()=>{
 const html=api.render({category:{fixtures:[]},rows,simulate:true});
 for(const stage of ['playoff','octavos','cuartos','semifinal','final'])assert.ok(html.includes(`data-ko-column="${stage}"`));
 assert.ok(html.includes('No son cruces oficiales'));assert.ok(html.includes('aria-selected="true"'));
 assert.ok(html.includes('ljr-ko-trophy'));assert.ok(!html.includes('v12-bracket-reference'));
});
const sim=readFileSync(new URL('../src/v501-simulator-reference.js',import.meta.url),'utf8');
function extract(start,end){return sim.slice(sim.indexOf(start),sim.indexOf(end,sim.indexOf(start)));}
const category=fixtures=>({fixtures});
const fixture=(home,away,journey='4')=>['',journey,home,'-','vs','-',away,'UDS','11/10/2026'];
const fsSource=extract('function fixturesAll(){','function simFixtures(){');
function fixtures(data){return new Function('cat','catId','num','norm',fsSource+';return fixturesAll()')(()=>data,()=>3,x=>/^\d+$/.test(String(x))?Number(x):null,s=>String(s).toLowerCase());}
test('saved simulation IDs survive inserted/reordered fixture blocks and deduplicate identical games',()=>{
 const a=fixture('Abejas','Lobos'),b=fixture('Galacticos','Napoli');
 const before=fixtures(category([{rows:[a,b]}]));
 const after=fixtures(category([{rows:[b]},{rows:[a,a]}]));
 assert.equal(after.length,2);assert.equal(before[0].id,after[1].id);assert.notEqual(before[0].id,before[1].id);
});
test('invalid stored scores never become simulated draws or negative goals',()=>{
 const src=extract('function scoreOf(', 'function alterScore(');
 const score=new Function(src+';return scoreOf')();
 for(const value of [{home:null,away:null},{home:'2',away:0},{home:-1,away:0},{home:1.2,away:0},{home:100,away:0}])assert.equal(score({id:'x'},{x:value}),null);
 assert.deepEqual(score({id:'x'},{x:{home:0,away:0}}),{home:0,away:0});
});

test('simulated knockout scores appear in the bracket without changing published results',()=>{
 const fixture=['','Octavos de final','Abejas','-','vs','-','Lobos','','11/10/2026'];
 const official=category([{rows:[fixture]}]);
 const f=fixtures(official)[0];
 const source=extract('function simulationCategory(){','function bracketView(){');
 const scoring=extract('function scoreOf(', 'function alterScore(');
 const result=new Function('cat','simState','num','norm','catId',scoring+source+';return simulationCategory()')(()=>official,()=>({[f.id]:{home:2,away:1}}),x=>/^\d+$/.test(String(x))?Number(x):null,s=>String(s).toLowerCase(),()=>3);
 assert.equal(result.fixtures[0].rows[0][3],2);assert.equal(result.fixtures[0].rows[0][5],1);
 assert.equal(fixture[3],'-');assert.equal(fixture[5],'-');
 const html=api.render({category:result,simulate:true});
 assert.match(html,/ljr-ko-score">2/);assert.match(html,/ljr-ko-score">1/);
});

test('Competition can show real ranked entrants while clearly marking unpublished pairings',()=>{
 const category={standings:[{rows:[[1,'SAN JOSE FC'],[2,'JUVENTUS'],[3,'LINCES'],[4,'NAPOLI'],[5,'HERMANOS'],[6,'FRANCO FC'],[7,'TERRICOLAS'],[8,'ABEJAS'],[9,'HERRERAS FC'],[10,'LOBOS CDG'],[11,'GALACTICOS']]}],fixtures:[]};
 const html=api.render({category,showEntrants:true});
 assert.ok(html.includes('data-ko-mode="competition"'));assert.ok(html.includes('Equipos según clasificación · Cruces oficiales por definir'));
 for(const row of category.standings[0].rows)assert.equal(html.split('aria-label="'+row[1]+'"').length-1,1);
 assert.ok(html.includes('data-ko-stage="playoff"'));
 const official={...category,fixtures:[{rows:[['','Cuartos de final','Juventus',2,'vs',1,'Boavista','','11/10/2026']]}]};
 const published=api.render({category:official,showEntrants:true});assert.ok(!published.includes('Equipos según clasificación'));assert.ok(!published.includes('HERRERAS FC'));
});

test('standings separates seeded and unseeded play-offs and elimination without repeating teams',()=>{
 const start=sim.indexOf('function tableView(){'),end=sim.indexOf('/* Explains the simulator',start);
 const renderTable=new Function('simulatedStandings','tableRow','classificationGuide','esc',sim.slice(start,end)+';return tableView()');
 const teams=Array.from({length:36},(_,i)=>({name:'Club '+(i+1),pos:i+1}));
 const html=renderTable(()=>teams,r=>'<p>'+r.name+'</p>',()=>'',s=>s);
 assert.ok(html.includes('PLAY-OFFS ELIMINATORIOS (CABEZA DE SERIE)'));
 assert.ok(html.includes('PLAY-OFFS ELIMINATORIOS (NO CABEZA DE SERIE)'));
 assert.ok(html.includes('PLAZAS DE ELIMINACIÓN'));
 for(const team of teams)assert.equal(html.split('<p>'+team.name+'</p>').length-1,1);
 const groups=html.split('class="v501-table-group"').slice(1);
 assert.equal(groups.length,4);
 assert.ok(groups[1].includes('<p>Club 9</p>'));assert.ok(groups[1].includes('<p>Club 16</p>'));assert.ok(!groups[1].includes('<p>Club 17</p>'));
 assert.ok(groups[2].includes('<p>Club 17</p>'));assert.ok(groups[2].includes('<p>Club 24</p>'));assert.ok(!groups[2].includes('<p>Club 25</p>'));
});
