import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import vm from 'node:vm';
const root=new URL('../',import.meta.url);
const manifest=JSON.parse(fs.readFileSync(new URL('src/v837-jersey-assets.json',root)));
const season=JSON.parse(fs.readFileSync(new URL('public/data/temporada-actual-2026.json',root)));
function registry(){
 const window={};
 const context=vm.createContext({window,document:{readyState:'loading',addEventListener(){}},Map});
 vm.runInContext(fs.readFileSync(new URL('src/v819-three-quarter-jerseys.js',root),'utf8'),context);
 return window.LJR_JERSEY_ASSETS;
}
test('51 club previews include 50 verified RGBA PNGs and a transparent Pozos FC vector',()=>{
 assert.equal(manifest.sources.length,51);
 assert.equal(new Set(manifest.sources.map(x=>x.url)).size,51);
 assert.equal(new Set(manifest.sources.filter(x=>x.sha256).map(x=>x.sha256)).size,50);
 for(const item of manifest.sources){
  const bytes=fs.readFileSync(new URL('public/'+item.url.replace(/^\.\//,''),root));
  if(item.url.endsWith('.svg')){
   assert.equal(item.id,'v837-kit-51');
   assert.equal(item.placeholder,true,'preview must not claim to be an official jersey');
   assert.match(bytes.toString('utf8'),/<svg\b/);
   assert.match(bytes.toString('utf8'),/width="512" height="512"/);
   continue;
  }
  assert.equal(bytes.subarray(1,4).toString(),'PNG');
  assert.equal(bytes.readUInt32BE(16),512);
  assert.equal(bytes.readUInt32BE(20),512);
  assert.equal(bytes[25],6,'RGBA including transparency');
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),item.sha256);
 }
});

test('53 category registrations and 51 unique clubs have available previews',()=>{
 const api=registry();
 const canonical=new Set(Object.values(season.categories).flatMap(c=>c.teams).map(api.norm));
 // El registro oficial puede añadir equipos antes de que reciban camiseta propia.
 // No bloquees el despliegue de partidos, cédulas y clasificación por esa ampliación.
 assert.equal(Object.values(season.categories).reduce((sum,c)=>sum+c.teams.length,0),53);
 assert.equal(canonical.size,51);
 assert.equal(api.teams.length,51);
 assert.equal(new Set(api.teams.map(x=>x.kitId)).size,51);
 const represented=[...canonical].filter(name=>api.itemFor(name));
 assert.equal(represented.length,51,'los 51 clubes deben tener al menos una vista previa');
 for(const club of api.teams){
  assert.ok(canonical.has(api.norm(club.name)),club.name);
  assert.ok(fs.existsSync(new URL('public/'+club.logo.replace(/^\.\//,''),root)),club.name);
 }
 assert.equal(api.itemFor('Equipo inexistente'),null);
 const pozos=api.itemFor('POZOS FC');assert.ok(pozos);assert.equal(pozos.id,'v837-kit-51');
});
test('player aliases and category duplicates keep the same club shirt',()=>{
 const api=registry();
 for(const [a,b] of [['BOAVISTA','Boavista'],['JUVENTUS','Juventus'],['Atl. Galeana','Galeana'],['San José','SAN JOSE FC'],['Célticos','Célticos FC']]){
  assert.equal(api.itemFor(a)?.id,api.itemFor(b)?.id);
  assert.ok(api.itemFor(a),a);
 }
});
