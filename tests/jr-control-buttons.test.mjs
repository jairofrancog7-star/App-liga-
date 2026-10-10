import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source=fs.readFileSync(new URL('../src/v562-adminfut-access.js',import.meta.url),'utf8');
const cardRe=/card\('[^']+','([^']+)','[^']+','data-v563-(route|tool|cms|action)="([^"]+)"'\)/g;
const cards=[...source.matchAll(cardRe)].map(([,label,type,value])=>({label,type,value}));
const privateTools=new Set(['sponsors','meeting','delegates','officials','incidents','csv-import','backup-export','audit','schedule-match','new-sanction','motm']);
const adminRoutes=new Set(['credentialBuilder','permissionBuilder','recruitment','refereeOffline','scheduleChanges','suspensionTool','agendaBuilder','publicationCenter','bracketBuilder']);

function createHarness(admin={owner:true}){
 const events={},calls=[],location={hash:'#/ligaControl',origin:'https://example.test',pathname:'/App-liga-/'};
 const cms={openNotice:()=>calls.push(['cms','compose']),openReview:()=>calls.push(['cms','review']),openPages:()=>calls.push(['cms','pages']),exportBackup:()=>calls.push(['cms','backup'])};
 let onLogin;
 const media={admin,login(fn){onLogin=fn;calls.push(['login'])},manage(){calls.push(['cms','manage'])}};
 const window={
  addEventListener(type,fn,capture){(events[type]??=[]).push({fn,capture})},
  LJR_MEDIA:media,LJR_EDITOR_CENTER:cms,
  LJR_ADMIN_ROUTE:{routes:adminRoutes,open(route){calls.push(['route',route])}},
  LJR_V105_OPEN_TOOL(tool){calls.push(['tool',tool]);return true}
 };
 const document={querySelector(){return null},createElement(){return {textContent:'',remove(){}}},body:{appendChild(){}}};
 const ctx={window,document,location,navigator:{},localStorage:{setItem(){}},
   console,setTimeout(){return 0},clearTimeout(){},alert(){}};
 vm.runInNewContext(source,ctx,{filename:'v562-adminfut-access.js'});
 function click(data,{hidden=false,hiddenParent=false}={}){
  let prevented=0,stopped=0;
  const button={dataset:data,disabled:false,hidden,closest(sel){return sel==='[hidden]'?(hiddenParent?{}:null):sel.includes('data-v563-control')?{}:null}};
  const event={target:{closest(){return button}},preventDefault(){prevented++},stopImmediatePropagation(){stopped++}};
  const prior=calls.length;
  for(const h of events.click||[])h.fn(event);
  return {made:calls.slice(prior),prevented,stopped,hash:location.hash};
 }
 return {click,events,calls,media,location,authenticate(){media.admin={owner:true};onLogin?.()}};
}

test('JR Control has one delegated click controller for repainted buttons',()=>{
 assert.equal((source.match(/window\.addEventListener\('click'/g)||[]).length,1);
 assert.doesNotMatch(source,/root\.addEventListener\('click'/);
 const h=createHarness();
 assert.equal(h.events.click?.length,1);
 assert.equal(h.events.click?.[0].capture,true);
});

test('all management and competition tiles respond once to clicks on their icons',()=>{
 assert.ok(cards.length>=49,'expected all management buttons to remain present');
 const h=createHarness();
 const actions={positions:'competition',fixtures:'competition',cards:'discipline',suspensions:'discipline'};
 for(const {label,type,value} of cards){
  const data={['v563'+type[0].toUpperCase()+type.slice(1)]:value};
  const result=h.click(data);
  assert.equal(result.prevented,1,label+' should prevent default navigation');
  assert.equal(result.stopped,1,label+' should stop duplicate navigation');
  if(type==='route'){
   if(adminRoutes.has(value))assert.deepEqual(result.made,[['route',value]],label);
   else assert.equal(result.hash,'#/'+value,label);
  }else if(type==='tool')assert.deepEqual(result.made,[['tool',value]],label);
  else if(type==='cms')assert.deepEqual(result.made,[['cms',value]],label);
  else if(type==='action')assert.equal(result.hash,'#/'+actions[value],label);
 }
});

test('private tools require login and cannot be activated by unauthenticated clicks',()=>{
 const h=createHarness(null);
 for(const name of privateTools){
  const before=h.click({v563Tool:name});
  assert.equal(before.made.some(([type])=>type==='tool'),false,'private tool '+name+' opened without authentication');
 }
 h.click({v563Tool:'sponsors'});
 const before=h.calls.filter(([kind,name])=>kind==='tool'&&name==='sponsors').length;
 h.authenticate();
 assert.equal(h.calls.filter(([kind,name])=>kind==='tool'&&name==='sponsors').length,before+1);
 const guestCms=createHarness(null);
 const attempt=guestCms.click({v563Cms:'manage'});
 assert.equal(attempt.made.some(([type])=>type==='cms'),false);
});

test('hidden cards and controls in hidden admin panels do not receive clicks',()=>{
 const h=createHarness();
 assert.deepEqual(h.click({v563Tool:'audit'},{hidden:true}).made,[]);
 assert.deepEqual(h.click({v563Cms:'backup'},{hiddenParent:true}).made,[]);
});
