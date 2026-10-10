import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const js=readFileSync(new URL('../src/v1126-motm-studio.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../src/v1126-motm-studio.css',import.meta.url),'utf8');

test('MVP: JavaScript valido y escudos obtenidos de la fuente real de categorías',()=>{
 assert.doesNotThrow(()=>new Function(js));
 assert.match(js,/CATEGORY_BASE='https:\/\/raw\.githubusercontent\.com\/jairofrancog7-star\/Liga_Futbol\/main\//);
 for(const asset of ['primera-fuerza-hd.png','intermedia.webp','segunda-fuerza.webp','veteranos-35-user.png','veteranos-50.webp'])
  assert.ok(js.includes(asset),'Falta escudo '+asset);
 assert.match(js,/window\.LJR_TEAM_LOGOS\?\.get\?\.\(team\)/);
 assert.match(js,/escudo-liga-camisetas-unificado-v1122\.png/);
 assert.equal((js.match(/contain\(c,teamImg,/g)||[]).length,1,'El PNG no debe duplicar el logo del equipo');
 assert.match(js,/contain\(c,leagueImg,/);
 assert.match(js,/contain\(c,catImg,/);
 assert.match(js,/photoCircle\(c,playerImg,/);
});

test('MVP: vista previa móvil de tres insignias sin cajas o fondos',()=>{
 for(const name of ['v1126-preview-league','v1126-preview-category','v1126-preview-team','v1126-preview-photo'])
  assert.ok(js.includes(name),'Falta '+name);
 assert.match(css,/\.v1126-preview-league,\.v1126-preview-category,\.v1126-preview-team/);
 assert.match(css,/background:none!important/);
 assert.match(css,/@media\(max-width:365px\)/);
 assert.match(js,/c\.fillText\('JUGADOR DEL',540,354\)/);
 assert.match(js,/c\.fillText\('PARTIDO',540,432\)/);
 assert.match(js,/photoCircle\(c,playerImg,540,666,167\)/);
 assert.match(js,/inspectMedia\(d\)/);
});

test('MVP: diagnóstico comprueba 4 fotos/escudos antes del PNG sin guardar datos',async()=>{
 const calls=[];
 class FakeImage{
  naturalWidth=140;naturalHeight=180;
  set src(value){
   this.value=value;
   calls.push(value);
   queueMicrotask(()=>{if(value)this.onload?.();else this.onerror?.()});
  }
  get src(){return this.value}
 }
 const root={
  window:{
   LJR_TEAM_LOGOS:{get:team=>team==='Boavista'?'https://example.test/boavista-transparent.png':''},
   LJR_PLAYER_MEDIA:{photo:()=> 'https://example.test/player.png'},
   LJR_OFFICIAL_DATA:{categories:{}}
  },
  document:{baseURI:'https://jairofrancog7-star.github.io/App-liga-/'},
  Image:FakeImage,setTimeout,clearTimeout,URL,queueMicrotask
 };
 runInNewContext(js,root);
 const result=await root.window.LJR_MOTM_STUDIO.inspectMedia({catId:'3',team:'Boavista',player:'Jugador de prueba'});
 const converted=Array.from(result,x=>({name:x.name,ok:x.ok}));
 assert.deepEqual(converted,[
  {name:'liga',ok:true},{name:'categoria',ok:true},{name:'equipo',ok:true},{name:'jugador',ok:true}
 ]);
 assert.equal(calls.filter(s=>s.includes('boavista-transparent.png')).length,1);
 assert.ok(calls.some(s=>s.includes('primera-fuerza-hd.png')));
 assert.equal(result[3].width,140);
});
