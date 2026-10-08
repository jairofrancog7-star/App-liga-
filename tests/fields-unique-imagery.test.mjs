import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source=fs.readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
const fieldsSource=source.match(/const V60_FIELDS=(\[[\s\S]*?\]);\s*function v60Field\(/)?.[1];
assert.ok(fieldsSource,'Field registry must exist');
const fields=vm.runInNewContext(fieldsSource);
const beginning=source.indexOf('function v60AerialPreviewUrl(f){');
const ending=source.indexOf('function v60FieldPreview(',beginning);
assert.ok(beginning>=0 && ending>beginning,'Aerial image URL generator must exist');
const factory=vm.runInNewContext(source.slice(beginning,ending)+'\nv60AerialPreviewUrl');
const preview=source.slice(ending,source.indexOf('function v60Icon(',ending));

test('each venue uses its own location-based aerial image, never a shared screenshot',()=>{
  assert.equal(fields.length,14);
  const urls=fields.map(f=>factory(f));
  assert.ok(urls.every(Boolean),'Each field must have location or community coordinates');
  assert.equal(new Set(urls).size,fields.length,'Aerial images must have distinct URLs');
  for(const url of urls){
    const decoded=decodeURIComponent(url);
    assert.ok(decoded.includes('World_Imagery/MapServer/export'));
    assert.ok(decoded.includes('bbox='));
  }
  assert.ok(!preview.includes('google-streetview-referencia-2014.svg'),
    'The same reference screenshot must not be reused across fields');
  assert.ok(preview.includes('v60MapUrl(f)'), 'Google Maps button must stay functional');
});
