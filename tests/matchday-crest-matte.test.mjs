import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const source=readFileSync(new URL('../src/v1132-matchday-premium.js',import.meta.url),'utf8');
const start=source.indexOf('function prepareMatchdayCrests(root){');
const end=source.indexOf('function crest(name,category){',start);

function prepare(images){
 assert.ok(start>=0&&end>start,'La preparación de escudos debe existir antes del componente');
 const sandbox={};
 vm.runInNewContext(source.slice(start,end)+';globalThis.prepareMatchdayCrests=prepareMatchdayCrests;',sandbox);
 sandbox.prepareMatchdayCrests({querySelectorAll:selector=>{
  assert.equal(selector,'.md1132-crest img');
  return images;
 }});
}

test('Centro de Jornada usa los escudos de Equipos con categoría en vez de alterar imágenes',()=>{
 assert.match(source,/window\.LJR_TEAMS_CURRENT_LOGO\?\.get\?\.\(name,category\)/);
 assert.match(source,/Object\.entries\(db\.categories\|\|\{\}\)/);
 assert.match(source,/prepareMatchdayCrests\(host\)/);
 assert.doesNotMatch(source,/crestWithoutSolidBackground|crestImageCache|canvas\.getContext\('2d'/);
});

test('un escudo válido mantiene su fuente, píxeles, color, opacidad y tamaño original',()=>{
 const listeners={};
 const image={complete:true,naturalWidth:256,src:'./assets/season-2026/boavista-v774.webp',isConnected:true,
  addEventListener(type,fn){listeners[type]=fn},remove(){throw Error('No eliminar una imagen válida')}};
 prepare([image]);
 assert.equal(image.src,'./assets/season-2026/boavista-v774.webp');
 assert.equal(image.style,undefined);
 assert.equal(image.naturalWidth,256);
 assert.equal(typeof listeners.error,'function');
});

test('un escudo roto retira solamente la imagen y deja visibles las iniciales',()=>{
 let removed=0;
 const img={complete:true,naturalWidth:0,isConnected:true,addEventListener(){},remove(){removed++}};
 prepare([img]);
 assert.equal(removed,1);
 const second={complete:false,naturalWidth:0,isConnected:true,
  addEventListener(type,cb){assert.equal(type,'error');this.onerror=cb},
  remove(){removed++}};
 prepare([second]);
 second.onerror();
 assert.equal(removed,2);
});

test('todas las categorías usan la misma ruta de imagen sin filtros visuales',()=>{
 const css=readFileSync(new URL('../src/v1167-matchday-centered-official-crests.css',import.meta.url),'utf8');
 assert.match(source,/crest\(g\.home,g\.category\)/);
 assert.match(source,/crest\(x\.away,x\.category\)/);
 assert.match(css,/filter:none!important/);
 assert.match(css,/object-fit:contain!important/);
});
