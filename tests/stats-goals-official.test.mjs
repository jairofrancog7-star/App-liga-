import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
test('player statistics shows the official goal ranking below registered players',async()=>{
 const data=JSON.parse(fs.readFileSync(new URL('../data/official-live.json',import.meta.url)));
 const screen={innerHTML:'',querySelector:()=>null,addEventListener(){}};
 const window={LJR_OFFICIAL_DATA:data,addEventListener(){},scrollTo(){}};
 const document={readyState:'loading',body:{classList:{toggle(){},contains(){return false}}},querySelector:s=>s==='#screen'?screen:null,querySelectorAll:()=>[],addEventListener(){}};
 const context={window,document,location:{hash:'#/leagueData'},localStorage:{getItem:()=>null,setItem(){}},requestAnimationFrame:()=>1,MutationObserver:class{observe(){}},setTimeout};
 vm.runInNewContext(fs.readFileSync(new URL('../src/v33-data-statistics-reference.js',import.meta.url),'utf8'),context);
 await window.LJR_V33_STATS.setTab('player');
 assert.match(screen.innerHTML,/<h2>Goles<\/h2>/);
 const [first]=data.categories['3'].scorers[0].rows;
 const row=screen.innerHTML.match(new RegExp('data-v33-player="'+first[1]+'"[^]*?<strong>([^<]+)</strong>'));
 assert.equal(row?.[1],first[3],'goals are official numeric values, not registration check marks');
});
