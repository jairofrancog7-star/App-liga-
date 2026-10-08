import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const root=new URL('../',import.meta.url);
const source=readFileSync(new URL('src/v40-competition-master.js',root),'utf8');
const fixtures=readFileSync(new URL('src/v12-reference-parts.js',root),'utf8');
const lower=readFileSync(new URL('src/v571-tournament-lower-tools.js',root),'utf8');
const data=JSON.parse(readFileSync(new URL('public/data/official-live.json',root),'utf8'));
const first=source.indexOf('  const CAT_NAMES=');
const last=source.indexOf('  function header(){',first);
const begin=source.indexOf('  function form(last){',last);
const end=source.indexOf('  let activeStandingsMode=',begin);
assert.ok(first>=0&&last>first&&begin>last&&end>begin,'Dynamic table functions exist');
const src=source.slice(first,last)+'\n'+source.slice(begin,end)+
  '\nreturn {selectedCategory,officialTeams,compact,complete,criteria}';
const state={category:'3'};
const sandbox={window:{LJR_OFFICIAL_DATA:data},localStorage:{getItem:key=>key==='v12-fixture-cat'?state.category:null}};
const functions=vm.runInNewContext('(function(){function img(src,alt){return src?"<img src="+src+" alt="+alt+">":""};'+src+'})()',sandbox);

test('Quick table uses active category rather than separate agenda filter',()=>{
  assert.match(lower,/function rankingCategory\(\)\s*\{[\s\S]{0,180}return currentCompetitionCat\(\);/);
  assert.match(lower,/window\.addEventListener\('ljr:competition-category'/);
  assert.match(fixtures,/window\.dispatchEvent\(new CustomEvent\('ljr:competition-category'/);
});

for(const [id,name] of Object.entries({'1':'Veteranos 50+','2':'Veteranos 35+','3':'Primera Fuerza','4':'Segunda Fuerza','5':'Intermedia'})){
  test('Compacta, Completa y Criterios cambian a '+name,()=>{
    state.category=id;
    const rows=data.categories[id].standings.flatMap(block=>block.rows);
    const teams=functions.officialTeams();
    assert.equal(teams.id,id);
    assert.equal(teams.name,name);
    assert.equal(teams.rows.length,rows.length);
    const outputs=[functions.compact(),functions.complete(),functions.criteria()];
    if(rows.length){
      for(const html of outputs){
        assert.ok(html.includes(rows[0][1]),'First ranked team comes from selected category');
        assert.ok(!html.includes('Todavía no hay clasificación oficial'));
      }
      assert.equal(teams.rows[0].pts,Number(rows[0][9]));
    }else for(const html of outputs){
      assert.match(html,/Todavía no hay clasificación oficial publicada/);
      assert.ok(!html.includes('SAN JOSE FC'),'No fallback to Primera');
    }
  });
}
