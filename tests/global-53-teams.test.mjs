import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const root=new URL('../',import.meta.url);
const read=p=>fs.readFileSync(new URL(p,root),'utf8');
const season=JSON.parse(read('public/data/temporada-actual-2026.json'));
const normalize=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9]/g,'');
const categories={'1':'Veteranos 50+','2':'Veteranos 35+','3':'Primera Fuerza','4':'Segunda Fuerza','5':'Intermedia'};
function catalogs(){
 const teamsCode=read('src/v27-teams-drive-reference.js');
 const storeCode=read('src/v66-official-directory.js');
 const directory=JSON.parse(teamsCode.match(/const V27_TEAMS=(\[[\s\S]*?\]);/)?.[1]||'[]');
 const store=JSON.parse((storeCode.match(/const V812_ACTIVE_STORE_BY_CAT=(\{[\s\S]*?\});/)?.[1]||'{}').replace(/'/g,'"'));
 return {directory,store,storeCode};
}
test('53 official category entries match Teams, Store, classification and calendars',()=>{
 const {directory,store}=catalogs();
 const all=Object.values(season.categories).flatMap(c=>c.teams);
 assert.equal(all.length,53);
 assert.equal(new Set(all.map(normalize)).size,51);
 const expected={'1':6,'2':11,'3':11,'4':12,'5':13};
 for(const [cat,count]of Object.entries(expected)){
  const byCat=directory.filter(t=>String(t.catId)===cat);
  const storeCat=store[cat]||[];
  const official=season.categories[categories[cat]].teams;
  assert.equal(byCat.length,count,'Equipos '+cat);
  assert.equal(storeCat.length,count,'Tienda '+cat);
  assert.deepEqual(new Set(byCat.map(t=>normalize(t.name))),new Set(official.map(normalize)),'Equipos '+cat);
  assert.deepEqual(new Set(storeCat.map(normalize)),new Set(official.map(normalize)),'Tienda '+cat);
  for(const t of byCat){
   assert.ok(t.logo,'Escudo de '+t.name);
   assert.ok(fs.existsSync(new URL('public/'+t.logo.replace(/^\.\/|^\//,''),root)),'Logo local '+t.name);
  }
 }
 const memberships=new Map();
 for(const [id,arr]of Object.entries(store))for(const name of arr){
  const k=normalize(name);memberships.set(k,[...(memberships.get(k)||[]),id]);
 }
 assert.deepEqual([...memberships.entries()].filter(([,cats])=>cats.length>1).map(([name])=>name).sort(),['BOAVISTA','JUVENTUS']);
 assert.equal(memberships.size,51);
});
test('profile respects category choice for clubs registered twice',()=>{
 const {store,storeCode}=catalogs();
 assert.match(storeCode,/LJR_V812_TEAM_CATEGORIES/);
 const lookup=name=>Object.entries(store).flatMap(([cat,arr])=>arr.filter(t=>normalize(t)===normalize(name)).map(()=>categories[cat]));
 const context={
  window:{addEventListener(){},LJR_V812_TEAM_CATEGORIES:lookup},
  document:{readyState:'loading',addEventListener(){},documentElement:{},querySelector(){return null}},
  location:{hash:'#/home'},requestAnimationFrame(){},setTimeout(){},
  MutationObserver:class{observe(){}},URLSearchParams,console
 };
 vm.runInNewContext(read('src/v777-profile.js'),context);
 const profiles=context.window.LJR_PROFILE;
 assert.deepEqual(Array.from(profiles.categoriesForTeam('Juventus')).sort(),['Primera Fuerza','Veteranos 35+']);
 assert.deepEqual(Array.from(profiles.categoriesForTeam('BOAVISTA')).sort(),['Veteranos 35+','Veteranos 50+']);
 assert.deepEqual(Array.from(profiles.categoriesForTeam('CUENDA')),['Veteranos 35+']);
 assert.deepEqual(Array.from(profiles.categoriesForTeam('TOROS DE CUENDA')),['Veteranos 50+']);
 assert.deepEqual(Array.from(profiles.categoriesForTeam('POZOS FC')),['Veteranos 35+']);
 assert.match(read('src/v777-profile.js'),/memberships\.some\(c=>norm\(c\)===norm\(savedCategory\)\)/);
 assert.match(read('src/v777-profile.js'),/option\.disabled=eligible\.length>0/);
});
test('Fantasy Store and History reuse one logo or jersey per distinct club',()=>{
 const jacket=JSON.parse(read('src/v837-jersey-assets.json'));
 const logos=JSON.parse(read('public/data/season-2026-logos.json'));
 assert.equal(jacket.sources.length,51);
 assert.equal(new Set(jacket.sources.map(x=>x.id)).size,51);
 assert.ok(jacket.sources.some(x=>x.id==='v837-kit-51'&&x.placeholder),'Pozos jersey stays explicitly unofficial');
 assert.ok(logos.categories&&Object.keys(logos.categories).length>=5);
 const history=read('src/v704-history-global-team-logos.js');
 assert.match(history,/LJR_SEASON_LOGOS\?\.get/);
 assert.match(history,/pozos fc/);
 const fantasy=read('src/v820-fantasy-lineup-hardlock.js');
 assert.match(fantasy,/LJR_JERSEY_ASSETS/);
 const store=read('src/v814-store-jersey-library.js');
 assert.match(store,/LJR_JERSEY_ASSETS/);
});
