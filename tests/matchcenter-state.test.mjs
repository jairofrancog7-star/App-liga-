import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const script=fs.readFileSync(new URL('../src/v92-match-center-official.js',import.meta.url),'utf8');
const start=script.indexOf('function officialDecision(m){');
const stop=script.indexOf('function standings(m){',start);
assert.ok(start>=0&&stop>start,'Match Center state functions must be present');
const logic=script.slice(start,stop);
const official=JSON.parse(fs.readFileSync(new URL('../public/data/official-live.json',import.meta.url),'utf8'));
const normalized=v=>String(v??'').trim().toUpperCase();
const timestamp=v=>{const m=String(v||'').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})/);return m?Date.UTC(+m[3],+m[2]-1,+m[1],+m[4],+m[5]):NaN};
const publishedScore=r=>{const h=String(r?.[3]??''),a=String(r?.[5]??'');return /^\d+$/.test(h)&&/^\d+$/.test(a)?{home:h,away:a,text:h+'–'+a}:null};
let live=null;
let time=Date.UTC(2026,9,9,15,0,0);
const context={
  window:{LJR_MATCH_LIVE:{getState:()=>live}},
  Date,Number,String,Object,Set,
  categories:()=>official.categories,
  norm:normalized,fixtureStamp:timestamp,publishedScore,
  mexicoStamp:()=>time,
  clock:v=>String(v).match(/\s(\d{1,2}:\d{2})/)?.[1]||'Por confirmar',
  dateOnly:v=>String(v).split(' ')[0]
};
const api=vm.runInNewContext(logic+'; ({officialDecision,confirmedLivePhase,allMatches,stateFor,selectedFixture});',context);
const at=(cat,home,away)=>api.allMatches().find(m=>m.catId===cat&&m.r[2]===home&&m.r[6]===away);

test('Boavista vs Boca JRS uses official DEFAULT resolution instead of kickoff clock',()=>{
  const m=at('1','BOAVISTA','BOCA JRS');
  assert.ok(m,'official Boavista fixture exists');
  assert.equal(m.r[8],'10/10/2026 15:30');
  const s=api.stateFor(m);
  assert.equal(s.kind,'awarded');
  assert.equal(s.primary,'DEFAULT');
  assert.match(s.secondary,/BOCA JRS.*−3 pts/);
  assert.equal(publishedScore(m.r),null,'No unverified 3–0 result is added');
});

test('a fixture without published score or verified whistle never autostarts at kickoff',()=>{
  const m=at('1','LA ESPERANZA','MANCHESTER');
  assert.ok(m);
  live=null;
  time=Date.UTC(2026,9,10,15,29);
  assert.equal(api.stateFor(m).kind,'scheduled');
  time=Date.UTC(2026,9,10,16,30);
  assert.equal(api.stateFor(m).kind,'pending');
  assert.match(api.stateFor(m).secondary,/confirmación/i);
});

test('confirmed operator start shows LIVE, unconfirmed stored phase does not',()=>{
  const m=at('1','LA ESPERANZA','MANCHESTER');
  time=Date.UTC(2026,9,10,16,30);
  live={key:m.key,phase:'first',events:[],source:{connected:false,lastSync:0}};
  assert.equal(api.stateFor(m).kind,'pending');
  live.events=[{type:'phase-first',confirmed:true}];
  assert.equal(api.stateFor(m).kind,'window');
  live=null;
});

test('the next fixture selector skips administrative DEFAULT fixtures',()=>{
  live=null; time=Date.UTC(2026,9,9,15,0);
  const m=api.selectedFixture();
  assert.ok(m);
  assert.notEqual(api.stateFor(m).kind,'awarded');
});

test('recorded full scores stay official and do not get mistaken for live',()=>{
  const m=at('1','DYNAMO','LA ESPERANZA');
  assert.ok(m);
  assert.equal(api.stateFor(m).kind,'final');
  assert.equal(api.stateFor(m).primary,'1–2');
});
