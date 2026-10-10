import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source=readFileSync(new URL('../src/v1132-matchday-premium.js',import.meta.url),'utf8');
const start=source.indexOf('const crestImageCache=new Map();');
const end=source.indexOf('function crest(name){',start);

function runOnPixels(pixels,width,height,src='https://liga.test/escudos/prueba.webp'){
 assert.ok(start>=0&&end>start,'Debe existir un saneador de fondos antes del componente de escudos');
 let output=null;
 const ctx={
  drawImage(){},
  getImageData(){return {data:pixels}},
  putImageData(result){output=result.data},
 };
 const canvas={width,height,getContext(){return ctx},toDataURL(){return 'data:image/png;base64,transparente'}};
 const sandbox={
  URL,
  location:{origin:'https://liga.test'},
  document:{baseURI:'https://liga.test/',createElement(tag){assert.equal(tag,'canvas');return canvas}},
 };
 vm.runInNewContext(source.slice(start,end)+'\nglobalThis.run=crestWithoutSolidBackground;',sandbox);
 const img={naturalWidth:width,naturalHeight:height,currentSrc:src,src};
 return {result:sandbox.run(img),pixels:output||pixels};
}
function rgba(width,height,color=[255,255,255,255]){
 const data=new Uint8ClampedArray(width*height*4);
 for(let i=0;i<width*height;i++)data.set(color,i*4);
 return data;
}
function pixelAlpha(data,w,x,y){return data[(y*w+x)*4+3]}

test('Centro de Jornada usa el registro de Equipos en todas las categorias',()=>{
 assert.match(source,/window\.LJR_TEAM_LOGOS\?\.get\?\.\(name\)/);
 assert.match(source,/Object\.entries\(db\.categories\|\|\{\}\)/);
 assert.match(source,/prepareMatchdayCrests\(host\)/);
});
test('quita fondo blanco exterior sin borrar detalles blancos encerrados',()=>{
 const w=20,h=20,data=rgba(w,h);
 for(let y=5;y<15;y++)for(let x=5;x<15;x++)data.set([10,38,110,255],(y*w+x)*4);
 // Detalle blanco encerrado dentro del escudo azul.
 data.set([255,255,255,255],(10*w+10)*4);
 const {result,pixels}=runOnPixels(data,w,h);
 assert.match(result,/^data:image\/png/);
 assert.equal(pixelAlpha(pixels,w,0,0),0,'esquina blanca exterior transparente');
 assert.equal(pixelAlpha(pixels,w,6,6),255,'contorno azul intacto');
 assert.equal(pixelAlpha(pixels,w,10,10),255,'detalle blanco interior intacto');
});
test('quita el negro exterior y conserva el escudo',()=>{
 const w=20,h=20,data=rgba(w,h,[10,10,10,255]);
 for(let y=5;y<15;y++)for(let x=5;x<15;x++)data.set([10,164,62,255],(y*w+x)*4);
 const {result,pixels}=runOnPixels(data,w,h,'https://liga.test/escudos/linces.webp');
 assert.match(result,/^data:image\/png/);
 assert.equal(pixelAlpha(pixels,w,0,0),0);
 assert.equal(pixelAlpha(pixels,w,6,6),255);
});
test('no cambia imagenes ya transparentes o fondos de color propios del escudo',()=>{
 const w=20,h=20,alpha=rgba(w,h,[255,255,255,0]);
 const a=runOnPixels(alpha,w,h);
 assert.equal(a.result,'https://liga.test/escudos/prueba.webp');
 const red=rgba(w,h,[160,10,10,255]);
 const b=runOnPixels(red,w,h);
 assert.equal(b.result,'https://liga.test/escudos/prueba.webp');
});
