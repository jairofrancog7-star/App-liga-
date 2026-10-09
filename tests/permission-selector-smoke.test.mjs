import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const source=readFileSync(new URL('../src/v635-permission-builder.js',import.meta.url),'utf8');
const end=source.lastIndexOf('})();');
assert.ok(end>0,'permission builder should have an IIFE entry point');
const script=source.slice(0,end)+
  'window.__LJR_PERMISSION_TEST__={route,loadDb,view,renderTeamPicker,renderPlayerPicker,openTeamPicker,closeTeamPicker,openPlayerPicker,closePlayerPicker,teamCrest};\n'+
  source.slice(end);

function scenario({offline=false}={}){
  const data={categories:{'3':{
    name:'Primera Fuerza',
    rosters:{'ABEJAS':['Carlos Antonio Cruz Cañada','Christopher Peña Jaralillo']},
    player_profiles:{'ABEJAS':[{name:'Carlos Antonio Cruz Cañada',photo:'https://res.cloudinary.com/demo/image/upload/v1/jugadores/test'}]}
  }},team_logos:{'ABEJAS':{local:'./assets/abejas.webp'}}};
  const el={
    '[data-v635-team-options]':{innerHTML:'',querySelectorAll:()=>[]},
    '[data-v635-player-options]':{innerHTML:'',querySelectorAll:()=>[]},
    '[data-v635-cat]':{value:'Primera Fuerza'},
    '[data-v635-team-cat]':{value:'Primera Fuerza'},
    '[data-v635-team]':{value:'ABEJAS'},
    '[data-v635-team-search]':{value:'',focus(){}},
    '[data-v635-player-search]':{value:'',focus(){}},
    '[data-v635-player-cat-label]':{textContent:''},
    '[data-v635-player-team-label]':{textContent:''},
    '[data-v635-player-context-crest]':{innerHTML:'',querySelectorAll:()=>[]},
    '[data-v635-team-sheet]':{hidden:true},
    '[data-v635-player-sheet]':{hidden:true}
  };
  const w={addEventListener(){}};
  if(!offline)w.LJR_OFFICIAL_DATA=data;
  let calls=0;
  const doc={
    readyState:'loading',addEventListener(){},querySelector:s=>el[s]||null,
    querySelectorAll:()=>[],
    body:{dataset:{appRoute:'more'},classList:{add(){},remove(){}}}
  };
  const ctx={
    window:w,document:doc,location:{hash:'#/permissionBuilder'},
    localStorage:{getItem:()=>null},
    fetch:async()=>{calls++;throw Error('Sin conexión')},
    requestAnimationFrame:()=>0,
    MutationObserver:class{},
    setTimeout:()=>0,clearTimeout(){},AbortController,
    console:{warn(){}}
  };
  runInNewContext(script,ctx);
  return {api:w.__LJR_PERMISSION_TEST__,el,data,getFetchCount:()=>calls};
}

test('direct permissionBuilder hash overrides a stale body route',()=>{
  const {api}=scenario();
  assert.equal(api.route(),'permissionBuilder');
  assert.match(api.view(),/data-v635-team-sheet/);
  assert.match(api.view(),/data-v635-player-sheet/);
});

test('cached official data loads without blocking or contacting the network',async()=>{
  const s=scenario();
  assert.equal(await s.api.loadDb(),s.data);
  assert.equal(s.getFetchCount(),0);
});

test('offline permission builder can render instead of remaining blank',async()=>{
  const s=scenario({offline:true});
  await s.api.loadDb();
  assert.match(s.api.view(),/Permisos y autorizaciones/);
  assert.equal(s.getFetchCount(),1);
});

test('team selector and player selector show real crests, keep selection data, and open and close',async()=>{
  const s=scenario();
  await s.api.loadDb();
  s.api.renderTeamPicker();
  s.api.renderPlayerPicker();
  assert.match(s.el['[data-v635-team-options]'].innerHTML,/data-v635-team-choice="ABEJAS"/);
  assert.match(s.el['[data-v635-team-options]'].innerHTML,/assets\/abejas\.webp/);
  assert.match(s.el['[data-v635-player-options]'].innerHTML,/data-v635-player-choice="Carlos Antonio Cruz Cañada"/);
  assert.match(s.el['[data-v635-player-options]'].innerHTML,/v635-player-avatar/);
  assert.match(s.el['[data-v635-player-options]'].innerHTML,/v635-player-team-crest/);
  s.api.openTeamPicker();
  s.api.openPlayerPicker();
  assert.equal(s.el['[data-v635-team-sheet]'].hidden,false);
  assert.equal(s.el['[data-v635-player-sheet]'].hidden,false);
  s.api.closePlayerPicker();
  s.api.closeTeamPicker();
  assert.equal(s.el['[data-v635-team-sheet]'].hidden,true);
  assert.equal(s.el['[data-v635-player-sheet]'].hidden,true);
});
