import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const root=new URL('../',import.meta.url);
const read=p=>fs.readFileSync(new URL(p,root),'utf8');
const season=JSON.parse(read('public/data/temporada-actual-2026.json'));
const official=JSON.parse(read('data/official-live.json'));
const normalize=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const keys={'3':'Primera Fuerza','5':'Intermedia','4':'Segunda Fuerza','2':'Veteranos 35+','1':'Veteranos 50+'};
const count=Object.values(season.categories).reduce((sum,c)=>sum+c.teams.length,0);

test('las 5 categorias registran 53 participaciones y 51 clubes, sin inventar dos faltantes',()=>{
 assert.equal(count,53);
 assert.equal(new Set(Object.values(season.categories).flatMap(c=>c.teams).map(normalize)).size,51);
 for(const [key,category] of Object.entries(keys))assert.ok(season.categories[category].teams.length>0,key);
 assert.ok(season.categories['Veteranos 35+'].teams.some(t=>normalize(t)==='pozos fc'));
});
test('Tienda conserva las 53 participaciones y permite los clubes repetidos en diferentes categorias',()=>{
 const src=read('src/v66-official-directory.js');
 const entries=src.match(/const V812_ACTIVE_STORE_BY_CAT=(\{[\s\S]*?\n\});/);
 assert.ok(entries);
 const categories=vm.runInNewContext('('+entries[1]+')');
 const expected=Object.fromEntries(Object.entries(keys).map(([id,name])=>[id,season.categories[name].teams.map(normalize).sort()]));
 for(const id of Object.keys(keys))assert.deepEqual(Array.from(categories[id],normalize).sort(),expected[id],id);
 const fragment=src.match(/function v812ActiveStoreList\(\)\{[\s\S]*?\n\}\nconst CAT_LOGOS_V630=/);
 assert.ok(fragment);
 const body=fragment[0].slice(0,-'\nconst CAT_LOGOS_V630='.length);
 const context={V812_ACTIVE_STORE_BY_CAT:categories,CAT_ORDER:Object.keys(keys),CAT_LABEL:keys,norm:normalize};
 const fn=vm.runInNewContext('('+body+')',context),cards=fn();
 assert.equal(cards.length,53);
 assert.equal(cards.filter(x=>normalize(x.name)==='juventus').length,2);
 assert.equal(cards.filter(x=>normalize(x.name)==='boavista').length,2);
 assert.equal(cards.filter(x=>normalize(x.name)==='pozos fc'&&x.cat==='2').length,1);
});
test('Equipos incluye las 53 fichas asociadas a categoria sin colapsar los duplicados',()=>{
 const src=read('src/v41-teams-master.js'),m=src.match(/function currentTeams\(\)\{[\s\S]*?\n  \}\n\n  function route/);
 assert.ok(m,'parser de directorio de equipos');
 const fnSource=m[0].slice(0,-'\n\n  function route'.length);
 const context={window:{LJR_OFFICIAL_API:{getData:()=>official,getLogo:()=>''},LJR_TEAM_LOGOS:{get:()=>''}},FALLBACK_TEAMS:[],norm:normalize,abbr:x=>x.slice(0,3)};
 const clubs=vm.runInNewContext('('+fnSource+')',context)();
 assert.equal(clubs.length,53);
 assert.equal(new Set(clubs.map(x=>x.cat+':'+normalize(x.name))).size,53);
 assert.ok(clubs.some(x=>normalize(x.name)==='pozos fc'&&x.cat==='2'));
});
test('escudos de perfiles, tablas e Historia resuelven el archivo local de Pozos FC',()=>{
 for(const key of ['POZOS FC','BOCA JRS','GALACTICOS','CELTICOS FC']){
  assert.match(official.team_logos[key]?.app||'',/\.webp$/);
  assert.ok(fs.existsSync(new URL('public/'+official.team_logos[key].app.replace(/^\.\//,''),root)),key);
 }
 const shirt=read('src/v777-profile.js');
 const m=shirt.match(/const TEAM_51=(\[[\s\S]*?\n\]);/);
 assert.ok(m);
 assert.equal(JSON.parse(m[1]).length,51);
 assert.match(shirt,/Equipo · '\+teams\.length\+' clubes \(53 participaciones\)/);
 for(const path of ['src/v67-team-logo-registry.js','src/v672-history-old-team-logos.js','src/v704-history-global-team-logos.js'])assert.ok(read(path).includes('season-2026/pozos.webp'));
});


test('la pantalla visible de Equipos muestra los 53 registros con escudos y categoría correcta',()=>{
 const src=read('src/v27-teams-drive-reference.js');
 const m=src.match(/const V27_TEAMS=(\[[\s\S]*?\n\]);/);assert.ok(m);
 const entries=JSON.parse(m[1]);
 assert.equal(entries.length,53);
 assert.equal(new Set(entries.map(x=>x.catId+':'+normalize(x.name))).size,53);
 assert.equal(entries.filter(x=>normalize(x.name)==='pozos fc'&&x.catId==='2').length,1);
 assert.equal(entries.filter(x=>normalize(x.name)==='boavista').length,2);
 assert.equal(entries.filter(x=>normalize(x.name)==='juventus').length,2);
 assert.ok(entries.every(x=>x.logo&&fs.existsSync(new URL('public/'+x.logo.replace(/^\.\//,''),root))), 'escudos locales');
 assert.match(src,/FIRST_GRID=V27_TEAMS\.slice\(0,17\)/);
 assert.match(src,/localStorage\.setItem\('v62-category',String\(t\.catId\)\)/);
});

test('las fichas conservan categoria para Juventus y Boavista y resuelven los 53 participantes',()=>{
 const src=read('src/v42-team-detail-master.js');
 const fn=src.slice(src.indexOf('function allTeams(){'),src.indexOf('function selectedName(){'));
 const clubs=vm.runInNewContext(fn+';allTeams();',{db:official,norm:normalize});
 assert.equal(clubs.length,53);
 assert.deepEqual(Array.from(clubs.filter(x=>normalize(x.name)==='juventus'),x=>x.catId).sort(),['2','3']);
 assert.deepEqual(Array.from(clubs.filter(x=>normalize(x.name)==='boavista'),x=>x.catId).sort(),['1','2']);
});

test('el refresco oficial deja intactos los grupos y las 53 fichas que pertenecen a Equipos',()=>{
 const src=read('src/v62-official-league-data.js');
 const fn=src.slice(src.indexOf('function patchTeams(){'),src.indexOf('function intercept(){'));
 const page={dataset:{teamDirectoryOwner:'v27-categories'}};
 const document={querySelector:()=>page};
 // No directory rebuilding dependencies are provided: refresh must leave its owner alone.
 assert.doesNotThrow(()=>vm.runInNewContext(fn+';patchTeams();',{db:official,document,route:()=> 'teams'}));
 assert.equal(page.dataset.v62TeamsSig,undefined);
});
