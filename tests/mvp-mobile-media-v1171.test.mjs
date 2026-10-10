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
 assert.match(js,/c\.fillText\('JUGADOR DEL',540,403,940\)/);
 assert.match(js,/c\.fillText\('PARTIDO',540,480,940\)/);
 assert.match(js,/photoCircle\(c,playerImg,540,701,148\)/);
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

test('MVP: estructura vertical del PNG sin titulos, foto o pie encimados',()=>{
 // Línea superior + título: la altura máxima de los escudos es y=210.
 const y=(pattern)=>{const m=js.match(pattern);assert.ok(m,'Falta una coordenada del PNG');return Number(m[1])};
 const league=y(/fillText\('LIGA JUVENTINO ROSAS',540,(\d+),910\)/);
 const subtitle=y(/fillText\('RECONOCIMIENTO DESTACADO',540,(\d+),920\)/);
 const title1=y(/fillText\('JUGADOR DEL',540,(\d+),940\)/);
 const title2=y(/fillText\('PARTIDO',540,(\d+),940\)/);
 const divider=y(/moveTo\(185,(\d+)\);c\.lineTo\(895,/);
 const photoCenter=y(/photoCircle\(c,playerImg,540,(\d+),148\)/);
 const team=y(/fillText\(teamName,540,(\d+),930\)/);
 const category=y(/fillText\(\(r\.category[^\n]+\),540,(\d+),940\)/);
 const fixture=y(/fillText\(matchup,540,(\d+),940\)/);
 const reason=y(/fillText\(r\.reason\|\|'Rendimiento destacado',540,(\d+),940\)/);
 assert.ok(league>=245,'Nombre de la Liga debajo de los escudos');
 assert.ok(subtitle-league>=35,'Separar los dos textos institucionales');
 assert.ok(title1-subtitle>=95,'Separar subtitulo del titulo grande');
 assert.ok(title2-title1>=70,'Separar las dos líneas grandes');
 assert.ok(divider-title2>=30,'Dejar espacio hasta la línea turquesa');
 assert.ok(photoCenter-148>divider+30,'La foto debe empezar debajo de la línea');
 assert.ok(photoCenter+148<900,'Dejar espacio bajo la foto');
 assert.match(js,/const nameY=nameLines\.length===1\?\[954\]:\[929,990\];/);
 assert.match(js,/while\(nameSize>32/);
 assert.ok(team>=1060,'Dejar espacio al nombre del jugador');
 assert.ok(category-team>=55,'La categoria va debajo del equipo');
 assert.ok(fixture-category>=55,'El partido va debajo de la categoria');
 assert.ok(reason-fixture>=55,'El motivo va debajo del partido');
 assert.ok(reason<=1280,'El motivo debe quedar dentro del borde inferior');
 assert.match(css,/V1172: vista previa MVP/);
});
