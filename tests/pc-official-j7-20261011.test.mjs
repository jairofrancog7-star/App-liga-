import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const official=JSON.parse(readFileSync(new URL('../data/official-live.json',import.meta.url),'utf8'));
const load=p=>readFileSync(new URL('../src/'+p,import.meta.url),'utf8');
function loadPC(){
 const code=load('desktop-mobile-function-bridge.js').replace(/\}\)\(\);\s*$/, 'window.__pcTest={loadDb,fixtures,desktopFixtureRows};\n})();');
 const win={LJR_OFFICIAL_DATA:official,addEventListener(){}};
 const document={body:{classList:{contains(){return true}}},documentElement:{classList:{contains(){return false}}},querySelector(){return null},addEventListener(){},readyState:'loading'};
 const sessionStorage={getItem(){return null},setItem(){}};
 vm.runInNewContext(code,{window:win,document,sessionStorage,location:{hash:'#/pc-fixtures',search:'?mode=desktop'},innerWidth:1280,URLSearchParams,Date,setTimeout(){},clearTimeout(){}},{timeout:5000,filename:'desktop-mobile-function-bridge.js'});
 return win.__pcTest;
}
test('modo PC obtiene los seis partidos oficiales Segunda J7 del 11 de octubre',async()=>{
 const pc=loadPC();await pc.loadDb();
 const rows=pc.desktopFixtureRows('4','upcoming',new Date(2026,9,10));
 const j7=rows.filter(x=>x.round==='7'&&x.date.getMonth()===9&&x.date.getDate()===11);
 assert.equal(j7.length,6);
 assert.equal(new Set(j7.map(x=>x.home+'|'+x.away)).size,6);
 assert.deepEqual(Array.from(j7.map(x=>x.rawDate)),[
  '11/10/2026 08:00','11/10/2026 10:00','11/10/2026 10:00',
  '11/10/2026 10:00','11/10/2026 12:00','11/10/2026 12:00'
 ]);
 assert.deepEqual(Array.from(j7.map(x=>x.home+' / '+x.away)).sort(),[
  'BARZA / DEP. ZAPATA','CELTICOS / DEP. LA LUZ',
  'DEP. NOPALERO / SAN ANTONIO FC','PACHANGAS FC / TAPATIO',
  'SAN JOSE JRS / SAN JUAN FC','TAVERA FC / SAN JULIAN'
 ].sort());
 assert.ok(j7.every(x=>!x.played&&x.venue));
 assert.equal(j7.filter(x=>x.round==='8').length,0);
});
test('modo PC separa próximos y resultados, sin inventar goles',async()=>{
 const pc=loadPC();await pc.loadDb();
 const upcoming=pc.desktopFixtureRows('4','upcoming',new Date(2026,9,10));
 const results=pc.desktopFixtureRows('4','results',new Date(2026,9,10));
 assert.ok(upcoming.every(x=>!x.played&&x.date>=new Date(2026,9,10)));
 assert.ok(results.every(x=>x.played));
 assert.equal(upcoming[0].round,'7');
 assert.equal(upcoming[0].rawDate,'11/10/2026 08:00');
});
test('PC conserva modos móvil y APK y muestra horarios, categorías y calendario',()=>{
 const bridge=load('desktop-mobile-function-bridge.js');
 const shell=load('desktop-shell.js');
 assert.doesNotThrow(()=>new vm.Script(bridge));
 assert.doesNotThrow(()=>new vm.Script(shell));
 assert.match(bridge,/\['mobile','apk'\]\.includes/);
 assert.match(bridge,/data-ljpc-fixture-view/);
 assert.match(bridge,/inMonth\.find\(x=>!x\.played/);
 assert.match(bridge,/match\(\/\\s\(\\d\{2\}:\\d\{2\}\)\$\/\)/);
 assert.match(shell,/data-ljpc-week-second/);
});
