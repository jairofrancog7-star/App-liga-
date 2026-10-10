import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {spawn} from 'node:child_process';
import {chromium} from 'playwright';

const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4173'],{stdio:'inherit'});
const folder='tmp/knockout-review';mkdirSync(folder,{recursive:true});
let browser;
try{
 for(let attempt=0;attempt<80;attempt++){
  try{if((await fetch('http://127.0.0.1:4173/')).ok)break;}catch{}
  await new Promise(resolve=>setTimeout(resolve,250));
 }
 browser=await chromium.launch({headless:true});
 const report=[];
 for(const [name,width,height] of [['mobile',390,844],['small-mobile',320,740],['desktop',1280,900]]){
  const page=await browser.newPage({viewport:{width,height}});
  await page.goto('http://127.0.0.1:4173/#/simulator',{waitUntil:'domcontentloaded'});
  await page.locator('[data-v501-view="bracket"]').waitFor();
  await page.locator('[data-v501-view="bracket"]').click();
  await page.locator('.ljr-knockout').waitFor();
  const root=page.locator('.ljr-knockout');
  for(const stage of ['playoff','octavos','cuartos','semifinal','final']){
   await page.locator(`.ljr-ko-tabs [data-ko-stage="${stage}"]`).click();
   await page.waitForFunction(s=>{
    const root=document.querySelector('.ljr-knockout'),sc=root?.querySelector('.ljr-ko-scroll'),col=root?.querySelector(`[data-ko-column="${s}"]`);
    return root?.dataset.koStage===s&&sc&&col&&Math.abs(sc.scrollLeft-col.offsetLeft)<2;
   },stage);
   await page.screenshot({path:`${folder}/${name}-${stage}.png`});
  }
  const layout=await root.evaluate(el=>({width:el.clientWidth,color:getComputedStyle(el).backgroundColor,clubs:[...el.querySelectorAll('.ljr-ko-club')].map(n=>({width:n.clientWidth,height:n.clientHeight,overflow:n.scrollWidth>n.clientWidth}))}));
  assert.equal(layout.color,'rgb(0, 0, 64)');assert.ok(layout.clubs.every(c=>c.height===54));
  assert.equal(await page.locator('#v514-simulator-competition-mirror').count(),0);
  await page.locator('[data-v501-sheet-toggle]').click();
  await page.locator('[data-v501-sheet-toggle][aria-expanded="true"]').waitFor();
  const progress=page.locator('.v501-sheet-head p');
  const before=await progress.textContent();
  const first=page.locator('.v501-sim-match').first(),score=first.locator('[data-v501-score][data-side="home"][data-delta="1"]');
  if(await score.count()){
   await score.click();await assert.doesNotReject(async()=>page.locator('.v501-sheet-head [data-v501-clear]').waitFor());
   assert.notEqual(await progress.textContent(),before);
   await page.locator('[data-v501-clear]').click();assert.equal(await progress.textContent(),before);
  }
  await page.screenshot({path:`${folder}/${name}-controls.png`});
  await page.goto('http://127.0.0.1:4173/#/competition',{waitUntil:'domcontentloaded'});
  await page.locator('#screen > .tabs .tab').filter({hasText:/^Cuadro$/}).click();
  await page.locator('.ljr-knockout[data-ko-mode="competition"]').waitFor();
  assert.equal(await page.locator('.ljr-knockout[data-ko-mode="competition"]').count(),1);
  assert.equal(await page.locator('.ljr-ko-note').textContent(),'Cruces oficiales por definir');
  await page.screenshot({path:`${folder}/${name}-competition.png`});
  report.push({name,layout,simulationControls:'passed',competition:'passed'});
  await page.close();
 }
 writeFileSync(`${folder}/report.json`,JSON.stringify(report,null,2));
 console.log('Verified both brackets and score controls at 320, 390 and 1280 pixels.');
}finally{await browser?.close();server.kill();}
