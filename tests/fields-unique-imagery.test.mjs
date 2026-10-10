import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source=fs.readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
const fieldsSource=source.match(/const V60_FIELDS=(\[[\s\S]*?\]);\s*function v60Field\(/)?.[1];
assert.ok(fieldsSource,'Field registry must exist');
const fields=vm.runInNewContext(fieldsSource);
const start=source.indexOf('function v60FieldTilePlan(f){');
const end=source.indexOf('function v60FieldPreview(',start);
assert.ok(start>=0 && end>start,'Geographic tile generator must exist');
const tilePlan=vm.runInNewContext(source.slice(start,end)+'\nv60FieldTilePlan');
const preview=source.slice(end,source.indexOf('function v60Icon(',end));

test('all 14 sites show real geographic mosaic tiles, not broken ArcGIS exports or the same screenshot',()=>{
  assert.equal(fields.length,14);
  // Algunas canchas solo tienen enlace verificado por usuario: no fingir un pin exacto.
  const located=fields.filter(f=>!f.mapLinkUser),linkOnly=fields.filter(f=>f.mapLinkUser);
  assert.ok(linkOnly.length>0);
  assert.ok(linkOnly.every(f=>tilePlan(f)===null),'Las sedes con enlace no deben inventar captura aérea');
  const plans=located.map(tilePlan);
  assert.ok(plans.every(Boolean),'Las sedes con coordenadas confiables sí muestran mosaico');
  assert.ok(plans.every(p=>p.tiles.length===12),'Each field displays a 4 by 3 mosaic');
  assert.ok(plans.every(p=>p.tiles.every(t=>/World_Imagery\/MapServer\/tile\/18\/\d+\/\d+/.test(t.url))));
  const views=plans.map(p=>JSON.stringify({urls:p.tiles.map(t=>t.url),left:p.left,top:p.top}));
  assert.equal(new Set(views).size,located.length,'Every mapped field must use a distinct geographic view');
  assert.ok(!preview.includes('google-streetview-referencia-2014.svg'),'Do not reuse the shared reference image');
  assert.ok(!preview.includes('f=image'),'Do not use failing export endpoint for previews');
  assert.ok(preview.includes('v60MapUrl(f)'),'Preserve the Google Maps action');
});
