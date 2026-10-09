import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {credentialPlacement,MM_CARD_H,MM_CARD_W,mmToPt} from '../src/credential-pdf-layout.js';
function pdfLib(){
 const source=readFileSync(new URL('../src/vendor/pdf-lib-1.17.1.min.js',import.meta.url),'utf8');
 const exports={};
 const sandbox={exports,Uint8Array,ArrayBuffer,DataView,TextEncoder,TextDecoder,Promise,console,setTimeout,clearTimeout,Date,Math,parseInt,parseFloat,Number,String,Boolean,Object,RegExp};
 vm.runInNewContext(source,sandbox,{timeout:15000});
 return exports;
}
test('biblioteca UMD pdf-lib esta alojada en GitHub y permite crear PDF real',async()=>{
 const lib=pdfLib();
 assert.equal(typeof lib.PDFDocument?.create,'function');
 const pdf=await lib.PDFDocument.create();
 const page=pdf.addPage([mmToPt(MM_CARD_W),mmToPt(MM_CARD_H)]);
 page.drawRectangle({x:0,y:0,width:page.getWidth(),height:page.getHeight(),borderWidth:0.5});
 const bytes=await pdf.save({useObjectStreams:true});
 assert.equal(new TextDecoder().decode(bytes.subarray(0,5)),'%PDF-');
 assert.ok(bytes.length>300);
});
test('A4 tiene ocho posiciones diferentes y abre nueva pagina en la novena',()=>{
 const points=Array.from({length:9},(_,i)=>credentialPlacement('a4',i));
 assert.deepEqual(points.slice(0,8).map(x=>x.slot),[0,1,2,3,4,5,6,7]);
 assert.equal(points[8].pageIndex,1);
 assert.equal(points[8].slot,0);
 for(let i=0;i<8;i++){
  const p=points[i];
  assert.equal(p.pageIndex,0);
  assert.ok(p.x>=0&&p.y>=0&&p.x+p.width<=p.pageWidth&&p.y+p.height<=p.pageHeight);
  assert.ok(Math.abs(p.width/mmToPt(MM_CARD_W)-1)<1e-8);
  assert.ok(Math.abs(p.height/mmToPt(MM_CARD_H)-1)<1e-8);
 }
 for(let i=0;i<8;i++)for(let j=i+1;j<8;j++){
  const a=points[i],b=points[j];
  const overlapX=Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x);
  const overlapY=Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y);
  assert.ok(overlapX<=0||overlapY<=0,'dos credenciales se sobreponen');
 }
});
test('formato individual usa una pagina fisica de 85.60 x 53.98 mm',()=>{
 const a=credentialPlacement('individual',3);
 assert.equal(a.pageIndex,3);
 assert.ok(Math.abs(a.pageWidth/mmToPt(85.60)-1)<1e-10);
 assert.ok(Math.abs(a.pageHeight/mmToPt(53.98)-1)<1e-10);
 assert.equal(a.x,0);assert.equal(a.y,0);
});
test('no hay jsPDF de CDN en la exportacion individual y lote es local',()=>{
 const renderer=readFileSync(new URL('../src/v480-credential-red-exact.js',import.meta.url),'utf8');
 const batch=readFileSync(new URL('../src/v1013-local-credential-pdf.js',import.meta.url),'utf8');
 assert.ok(renderer.includes('window.LJR_LOCAL_PDF'));
 assert.ok(batch.includes('./vendor/pdf-lib-1.17.1.min.js'));
 assert.ok(!renderer.includes('cdn.jsdelivr.net/npm/jspdf'));
 assert.ok(!/fetch\(['"]https?:\/\//.test(batch));
 assert.ok(batch.includes('MAX_BATCH=32'));
});
