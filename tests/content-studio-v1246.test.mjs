import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const window={};runInNewContext(readFileSync(new URL('../src/v1246-content-layouts.js',import.meta.url),'utf8'),{window});
const L=window.LJR_CONTENT_LAYOUTS;
test('long rankings retain every record on readable pages in all four formats',()=>{
 const rows=Array.from({length:53},(_,i)=>i);
 for(const format of Object.keys(L.sizes))for(let layout=0;layout<5;layout++){
  const p=L.paginate(rows,format,layout);assert.deepEqual(Array.from(p.pages.flat()),rows);assert.ok(p.rowHeight>=84);
  const [w,h]=L.sizes[format],H=h*1080/w;
  for(const page of p.pages)assert.ok(p.top+p.reserve+Math.ceil(page.length/p.cols)*p.rowHeight<=H-100,'rows stay above the footer');
 }
});
test('automatic result copy distinguishes unconfirmed scores and a real zero',()=>{
 const v={type:'Resultado de final',home:'Local',away:'Visitante',details:''};
 assert.match(L.autoText(v).body,/por confirmar/);
 assert.match(L.autoText({...v,scoreHome:'0',scoreAway:'2'}).body,/0 – 2/);
 assert.match(L.autoText({...v,scoreHome:'0',scoreAway:''}).body,/por confirmar/);
});
test('primary categories offer five selectable compositions, specialized diagrams retain their renderer',()=>{
 for(const type of ['Comunicado','Gran final','Cuartos de final','Tabla de goleo','Tabla de posiciones','Campeón','Notificación con foto','Resultado de final','Logo del equipo'])assert.equal(new Set(L.variants(type)).size,5);
 assert.equal(L.variants('Táctica del equipo').length,1);
});
test('supplied resource catalog preserves all category identities and image files',()=>{
 const resources=JSON.parse(readFileSync(new URL('../public/content-assets.json',import.meta.url),'utf8')).assets;
 assert.deepEqual(resources.filter(r=>r.kind==='category').map(r=>r.category).sort(),['1','2','3','4','5']);
 assert.equal(resources.filter(r=>/content-studio/.test(r.url)).length,62);
 for(const r of resources)assert.ok(existsSync(new URL('../'+r.url.replace(/^\.\//,''),import.meta.url)),r.url);
});
