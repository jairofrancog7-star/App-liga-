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
test('all fifty 3/4 sources are distinct local RGBA PNGs with recorded hashes',()=>{
 assert.equal(manifest.sources.length,50);
 assert.equal(new Set(manifest.sources.map(x=>x.sha256)).size,50);
 for(const item of manifest.sources){
  const bytes=fs.readFileSync(new URL('public/'+item.url.replace(/^\.\//,''),root));
  assert.equal(bytes.subarray(1,4).toString(),'PNG');
  assert.equal(bytes.readUInt32BE(16),512);
  assert.equal(bytes.readUInt32BE(20),512);
  assert.equal(bytes[25],6,'RGBA including transparency');
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),item.sha256);
 }
});
test('fifty active clubs have fifty unique shirts and available local crests',()=>{
 const api=registry();
 const canonical=new Set(Object.values(season.categories).flatMap(c=>c.teams).map(api.norm));
 assert.equal(canonical.size,50);
 assert.equal(api.teams.length,50);
 assert.equal(new Set(api.teams.map(x=>x.kitId)).size,50);
 for(const name of canonical)assert.ok(api.itemFor(name),name);
 for(const club of api.teams){
  assert.ok(canonical.has(api.norm(club.name)),club.name);
  assert.ok(fs.existsSync(new URL('public/'+club.logo.replace(/^\.\//,''),root)),club.name);
 }
 assert.equal(api.itemFor('Equipo inexistente'),null);
});
test('player aliases and category duplicates keep the same club shirt',()=>{
 const api=registry();
 for(const [a,b] of [['BOAVISTA','Boavista'],['JUVENTUS','Juventus'],['Atl. Galeana','Galeana'],['San José','SAN JOSE FC'],['Célticos','Célticos FC']]){
  assert.equal(api.itemFor(a)?.id,api.itemFor(b)?.id);
  assert.ok(api.itemFor(a),a);
 }
});
