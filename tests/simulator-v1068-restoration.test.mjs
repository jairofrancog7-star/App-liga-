import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(new URL(path,import.meta.url),'utf8');
const js=read('../src/v501-simulator-reference.js');
const css=read('../src/v1068-simulator-logos-compact-restoration.css');
const fallback=read('../src/v1068-simulator-crest-fallback.js');
const index=read('../index.html');

test('simulator restores true club emblems and compact classic selector only in simulator',()=>{
 assert.ok(index.includes('v1068-simulator-logos-compact-restoration.css'));
 assert.ok(index.includes('v1068-simulator-crest-fallback.js'));
 assert.ok(css.includes('data-app-route="simulator"'));
 assert.ok(!css.includes('data-app-route="competition"'));
 assert.ok(css.includes('.v501-top .v501-tabs button.active'));
 assert.ok(css.includes('.v501-standings .v501-crest.stand img'));
 assert.ok(css.includes('.v12-bracket-team:not(.v1051-pending-team) img'));
 assert.ok(js.includes("crest(r.name,'stand')"));
 assert.ok(js.includes('v512Logo(t.name)'));
 assert.ok(js.includes('function v1068Opponent(team)'));
 assert.ok(js.includes('v1068-final-crest'));
 assert.doesNotThrow(()=>new Function(js));
 assert.doesNotThrow(()=>new Function(fallback));
});
test('simulator preview uses only real rows, no invented clubs, and labels projections',()=>{
 const src=js.slice(js.indexOf('function v512BuildRoutes('),js.indexOf('function v512BracketRoute('));
 const build=new Function('v512OfficialKnockout','simulatedStandings',src+';return v512BuildRoutes')(
  ()=>({playoff:[],octavos:[],cuartos:[],semifinal:[],final:[]}),
  ()=>[]);
 const names=['Juventus','Boavista','Linces','Hermanos','Tavera FC','Franco FC',
   'Manchester','La Esperanza','San Julián','Galácticos de Pozos','Aldama','Lobos Jrs'];
 const rows=names.map((name,i)=>({name,pos:i+1}));
 const actual=build(rows);
 assert.equal(actual.projection,true);
 const all=[...actual.left.pairs,...actual.right.pairs].filter(Boolean).flat()
  .concat(...actual.left.winners,...actual.right.winners).filter(Boolean);
 assert.ok(all.every(c=>names.includes(c.name)));
 const seen=all.map(c=>c.name);assert.equal(seen.length,new Set(seen).size);
 assert.ok(read('../src/knockout-reference.js').includes('Proyección del simulador'));
 assert.ok(read('../src/knockout-reference.js').includes('No son cruces oficiales'));
});
test('official playoff results take precedence over a possible simulator projection',()=>{
 const src=js.slice(js.indexOf('function v512BuildRoutes('),js.indexOf('function v512BracketRoute('));
 const played={playoff:[[{name:'Juventus'},{name:'Boavista'}]],octavos:[],cuartos:[],semifinal:[],final:[]};
 const build=new Function('v512OfficialKnockout','simulatedStandings',src+';return v512BuildRoutes')(
  ()=>played,()=>[]);
 const result=build([{name:'Lobos Jrs'}]);
 assert.equal(result.projection,false);
 assert.equal(result.left.pairs[0][0].name,'Juventus');
 assert.equal(result.left.pairs[0][1].name,'Boavista');
});
