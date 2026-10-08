import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const script=readFileSync(new URL('../src/v971-global-official-player-media.js',import.meta.url),'utf8');
function registry(){
 const data={captured_at_utc:'2026-10-08T00:00:00Z',categories:{
   '3':{name:'Primera Fuerza',player_profiles:{
     'FRANCO FC':[{name:'José García',position:'Delantero',dorsal:'9',photo:'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/jugadores/real-franco'}],
     'JUVENTUS':[{name:'José García',position:'Defensa',dorsal:'4',photo:'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/jugadores/real-juventus'}]
   }},
   '5':{name:'Intermedia',player_profiles:{
     'ATL. GALEANA':[{name:'María López',position:'Portero',dorsal:'1',photo:'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/jugadores/real-galeana'}],
     'LA CUADRILLA':[{name:'Sin Foto',position:'Medio',dorsal:'10'}]
   }}
 }};
 const w={LJR_OFFICIAL_DATA:data};
 const doc={readyState:'loading',addEventListener(){}};
 runInNewContext(script,{window:w,document:doc,location:{hash:'#/scorers?cat=3'},localStorage:{getItem:()=>''},URLSearchParams,requestAnimationFrame:()=>0,setTimeout:()=>0,MutationObserver:class{}});
 return w.LJR_V971_PLAYER_INTEGRATION;
}
test('portrait lookup uses exact player and team, not another club with the same name',()=>{
 const api=registry();
 assert.match(api.find('José García','FRANCO FC','3').photo,/real-franco$/);
 assert.match(api.find('José García','JUVENTUS','3').photo,/real-juventus$/);
 assert.equal(api.find('José García'),null,'ambiguous names cannot inherit another club photo');
 assert.equal(api.find('José García','OTHER TEAM','3'),null);
});
test('registration category, public position and dorsal are retained, without CURP',()=>{
 const api=registry();
 const p=api.find('María López','ATL GALEANA','5');
 assert.equal(p.cat,'5');
 assert.equal(p.position,'Portero');
 assert.equal(p.dorsal,'1');
 assert.match(p.photo,/real-galeana$/);
 assert.equal(api.find('Sin Foto','LA CUADRILLA','5').photo,'');
 assert.ok(api.all().every(x=>!('curp' in x)&&!('documento' in x)));
});
test('photographs from non-player folders or untrusted sources are not reused',()=>{
 const other=registry();
 assert.equal(other.find('No registrado','FRANCO FC','3'),null);
 assert.equal(other.all().filter(p=>p.photo).length,3);
});
