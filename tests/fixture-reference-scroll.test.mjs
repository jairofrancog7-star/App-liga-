import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../src/v12-reference-parts.js',import.meta.url),'utf8');
const functions=source.slice(source.indexOf('function v12FixtureModel('),source.indexOf('function v12RefreshFixtures('));
const row=(id,home,hg,ag,away)=>[id,'4',home,hg,'vs',ag,away,'Campo','11/10/2026'];
const groups=[{key:'a',label:'Jornada 4',shortLabel:'11 oct',longLabel:'Domingo 11',rows:[row('a','Abejas','2','1','Lobos')]},{key:'b',label:'Jornada 5',shortLabel:'18 oct',longLabel:'Domingo 18',rows:[row('b','Napoli','-','-','Linces')]}];
function api(){return new Function('v12ParseFixtureDate','v12DateLong','v12DateShort','v12Esc','v12FixtureLogo','v12FixtureDb','v12FixtureCategories','v12StoredCat','v12FixtureGroups','v12PickGroup','v12FixtureCategoryLogo','v12CategoryRule','V12_FIXTURE_BUILD',functions+';return {v12FixtureModel,v12UpcomingRow,v12FixturesMarkup}')(()=>({time:'10:00'}),()=>'',()=>'',String,n=>`<img alt="${n}">`,()=>({}),()=>[{id:'3',name:'Primera'},{id:'5',name:'Segunda'}],()=> '3',()=>groups,()=>groups[0],()=>'',()=>'', 'test');}
test('every date in the selected category remains mounted for vertical scrolling',()=>{
 const html=api().v12FixturesMarkup();
 assert.match(html,/data-v12-group="a"/);assert.match(html,/data-v12-group="b"/);
 for(const name of ['Abejas','Lobos','Napoli','Linces'])assert.ok(html.includes(name));
 assert.equal((html.match(/data-v12-cat-id="3"/g)||[]).length,2);
 assert.equal((html.match(/data-v12-cat-id="5"/g)||[]).length,0);
});
test('completed matches show a score per club; pending games keep their hour',()=>{
 const a=api(),played=a.v12FixtureModel(groups[0].rows[0],'3','Primera');
 const html=a.v12UpcomingRow(played);
 assert.match(html,/v12-team-score">2</);assert.match(html,/v12-team-score">1</);assert.match(html,/>Final</);
 const pending=a.v12UpcomingRow(a.v12FixtureModel(groups[1].rows[0],'3','Primera'));
 assert.ok(pending.includes('10:00'));assert.ok(!pending.includes('v12-team-score'));assert.ok(!pending.includes('>Final<'));
});
