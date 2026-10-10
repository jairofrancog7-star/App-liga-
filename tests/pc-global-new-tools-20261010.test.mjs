import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const runtime=read('src/desktop-parity-runtime-20261008.js');
const parity=read('src/desktop-parity-20261008.js');
const main=read('src/main.js');
function loadModel(){
 const start=runtime.indexOf('const toolGroups=');
 const end=runtime.indexOf('\nfunction renderTools(){',start);
 assert.ok(start>0&&end>start);
 const ctx={window:{},location:{hash:'#/pc-tools'},console};
 vm.runInNewContext(runtime.slice(start,end)+'\nwindow.__test={toolGroups,openPCAdminTool};',ctx,{timeout:1200});
 return ctx;
}
test('55 accesos reales de PC, incluidos servicios y administración recientes',()=>{
 assert.doesNotThrow(()=>new vm.Script(runtime));
 assert.doesNotThrow(()=>new vm.Script(parity));
 const tools=loadModel().window.__test.toolGroups.flatMap(([,cards])=>cards);
 assert.equal(tools.length,55);
 assert.equal(new Set(tools.map(x=>x[2])).size,55);
 for(const r of ['pc-fixtures','pc-standings','pc-scorers','pc-calendar','v38Weekly','matchday','venues','cedulas','refereeOffline','appInstall','weatherFields','recruitment','scheduleChanges','accountLogin','publicationCenter','compareTeams','tool:meeting','tool:sponsors','tool:incidents','tool:officials','tool:new-sanction','tool:motm','tool:delegates','tool:backup-export','tool:audit']){
  assert.ok(tools.some(x=>x[2]===r),'missing PC tool '+r);
 }
 assert.match(runtime,/data-ljpc-tools-find/);
 assert.match(runtime,/ljpc-hub-copy/);
 assert.match(runtime,/data-ljpc-tools-counter/);
});
test('las acciones privadas no se ejecutan sin sesión válida',()=>{
 const ctx=loadModel();
 let opens=0,logins=0;
 ctx.window.LJR_V105_OPEN_TOOL=()=>{opens++;return true};
 ctx.window.LJR_MEDIA={admin:null,login(fn){logins++;this.onReady=fn}};
 ctx.window.__test.openPCAdminTool('sponsors');
 assert.equal(logins,1);
 assert.equal(opens,0);
 ctx.window.LJR_MEDIA.onReady();
 assert.equal(opens,0);
 ctx.window.LJR_MEDIA.admin={role:'admin'};
 ctx.window.LJR_MEDIA.onReady();
 assert.equal(opens,1);
 ctx.window.__test.openPCAdminTool('not-allowed');
 assert.equal(opens,1);
});
test('ruta de cuenta usa login real; nueva comparación entra en el registro PC',()=>{
 assert.match(parity,/current\(\)==='profile'/);
 assert.match(parity,/go\('accountLogin'\)/);
 assert.match(parity,/'compareTeams','teamCompare'/);
 assert.match(main,/accountLogin:\(\)=>'<div data-v569-auth-mount>/);
 assert.match(main,/appInstall:\(\)=>'<div data-v563-app-install-mount>/);
});
