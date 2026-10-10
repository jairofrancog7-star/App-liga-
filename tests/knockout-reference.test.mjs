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
