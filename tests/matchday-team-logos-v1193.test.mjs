import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const root=new URL('../',import.meta.url);
const read=p=>fs.readFileSync(new URL(p,root),'utf8');
const normal=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const source=read('src/v1132-matchday-premium.js');
const directory=JSON.parse(read('src/v27-teams-drive-reference.js').match(/const V27_TEAMS=(\[[\s\S]*?\]);/)?.[1]||'[]');
const logoStart=source.indexOf('function logo(name,category){');
const logoEnd=source.indexOf('function prepareMatchdayCrests(root){',logoStart);

test('Jornada resolves the exact crests used in Equipos, before any legacy source',()=>{
 assert.ok(logoStart>=0&&logoEnd>logoStart);
 const calls=[];
 const teams={
  get(name,category){
   calls.push([name,category]);
   const team=directory.find(t=>normal(t.name)===normal(name)&&t.category===category);
   return team?.logo||'';
  }
 };
 const {logo}=vm.runInNewContext(source.slice(logoStart,logoEnd)+';({logo})',{
  window:{
   LJR_TEAMS_CURRENT_LOGO:teams,
   LJR_TEAM_LOGOS:{get:()=> 'assets/official-logos/old-with-background.png'},
   LJR_OFFICIAL_API:{getLogo:()=> 'assets/official-logos/old-with-background.png'}
  }
 });
 const examples=[
  ['BOAVISTA','Veteranos 50+'],
  ['BOCA JRS','Veteranos 50+'],
  ['LA ESPERANZA','Veteranos 50+'],
  ['MANCHESTER','Veteranos 50+'],
  ['TOROS DE CUENDA','Veteranos 50+'],
  ['DYNAMO','Veteranos 50+'],
  ['TERRICOLAS','Primera Fuerza'],
  ['NAPOLI','Primera Fuerza'],
  ['BOAVISTA','Veteranos 35+'],
  ['JUVENTUS','Veteranos 35+']
 ];
 for(const [name,category] of examples){
  const t=directory.find(t=>normal(t.name)===normal(name)&&t.category===category);
  assert.ok(t,'listed in Equipos: '+name+' / '+category);
  assert.equal(logo(name,category),t.logo,'same source as Equipos: '+name);
  assert.ok(fs.existsSync(new URL('public/'+t.logo.replace(/^\.?\//,''),root)),'published asset for '+name);
 }
 assert.equal(calls.length,examples.length);
 assert.deepEqual(calls[0],['BOAVISTA','Veteranos 50+']);
});

test('both fixture lists and featured match pass category to the crest renderer',()=>{
 assert.match(source,/function crest\(name,category\)/);
 assert.match(source,/const src=logo\(name,category\)/);
 for(const part of ['crest(g.home,g.category)','crest(g.away,g.category)','crest(x.home,x.category)','crest(x.away,x.category)']){
  assert.ok(source.includes(part),part);
 }
 assert.doesNotMatch(source,/crestWithoutSolidBackground|canvas\.getContext\('2d'/);
 assert.match(source,/img\.addEventListener\('error',broken/);
 assert.equal(source,read('demo/src/v1132-matchday-premium.js'));
 for(const path of ['index.html','demo/index.html']){
  assert.match(read(path),/v1132-matchday-premium\.js\?v=20261010-v1193-teams-transparent/);
 }
});
