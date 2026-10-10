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
  await page.locator('.v501-tabs [data-v501-view="bracket"]').waitFor();
  await page.locator('.v501-tabs [data-v501-view="standings"]').click();
  await page.locator('.v501-table-group').first().waitFor();
  const surfaces=await page.locator('.v501-standings,.v501-table-head,.v501-table-row,.v501-table-label,.v501-table-group').evaluateAll(es=>es.map(e=>getComputedStyle(e).backgroundColor));
  assert.ok(surfaces.every(c=>c==='rgb(0, 0, 64)'),`${name}: one navy table background`);
  if(width>=1024)await page.evaluate(()=>window.scrollTo(0,220));
  else await page.locator('#screen').evaluate(el=>{el.scrollTop=220});
  await page.waitForTimeout(150);
  const sticky=await page.locator('.v501-standings').evaluate(el=>({header:el.querySelector('.v501-table-head').getBoundingClientRect().y,label:el.querySelector('.v501-table-label').getBoundingClientRect().y,top:document.querySelector('.v501-top').getBoundingClientRect().bottom}));
  assert.ok(Math.abs(sticky.header-sticky.top)<2,`${name}: table columns remain below header`);
  assert.ok(Math.abs(sticky.label-sticky.header-26)<2,`${name}: group label follows below columns`);
  await page.screenshot({path:`${folder}/${name}-standings-scroll.png`});
  if(width>=1024)await page.evaluate(()=>window.scrollTo(0,0));
  else await page.locator('#screen').evaluate(el=>{el.scrollTop=0});
  await page.locator('.v501-tabs [data-v501-view="bracket"]').click();
  await page.locator('.ljr-knockout').waitFor();
  const root=page.locator('.ljr-knockout');
  const headerRow=await page.locator('.v501-top').evaluate(el=>({tabs:el.querySelector('.v501-tabs').getBoundingClientRect().toJSON(),back:el.querySelector('[data-v501-back]').getBoundingClientRect().toJSON(),share:el.querySelector('[data-v501-share]').getBoundingClientRect().toJSON(),color:getComputedStyle(el.querySelector('.v501-tabs')).backgroundColor}));
  assert.ok(headerRow.back.x+headerRow.back.width<=headerRow.tabs.x);
  assert.ok(headerRow.share.x>=headerRow.tabs.x+headerRow.tabs.width);
  assert.equal(headerRow.color,'rgb(0, 0, 64)');
  for(const stage of ['playoff','octavos','cuartos','semifinal','final']){
   await page.locator(`.ljr-ko-tabs [data-ko-stage="${stage}"]`).click();
   await page.waitForTimeout(750);
   writeFileSync(`${folder}/${name}-${stage}-layout.json`,JSON.stringify(await page.evaluate(()=>{const root=document.querySelector('.ljr-knockout'),sc=root?.querySelector('.ljr-ko-scroll');return {stage:root?.dataset.koStage,scroll:{left:sc?.scrollLeft,width:sc?.clientWidth,total:sc?.scrollWidth},columns:[...root.querySelectorAll('[data-ko-column]')].map(c=>({stage:c.dataset.koColumn,left:c.offsetLeft,width:c.clientWidth})),header:[...document.querySelectorAll('#screen,.v501-top,.v501-tabs')].map(c=>({cls:c.className,rect:c.getBoundingClientRect().toJSON(),position:getComputedStyle(c).position,margin:getComputedStyle(c).margin,padding:getComputedStyle(c).padding}))}}),null,2));
   await page.waitForFunction(s=>{
    const root=document.querySelector('.ljr-knockout'),sc=root?.querySelector('.ljr-ko-scroll'),col=root?.querySelector(`[data-ko-column="${s}"]`);
    return root?.dataset.koStage===s&&sc&&col&&Math.abs(sc.scrollLeft-col.offsetLeft)<2;
   },stage);
   if(width<1024){
    const header=await page.locator('.v501-top').boundingBox();
    assert.ok(header&&Math.abs(header.y)<2,`${name}: simulator header remains visible (${header?.y})`);
   }
   await page.screenshot({path:`${folder}/${name}-${stage}.png`});
  }
  await page.locator('.ljr-ko-tabs [data-ko-stage="playoff"]').click();
  await page.waitForTimeout(500);
  const swipeOffset=await root.evaluate(el=>{const sc=el.querySelector('.ljr-ko-scroll'),col=el.querySelector('[data-ko-column="octavos"]');sc.dispatchEvent(new Event('touchstart'));const offset=col.offsetLeft+35;sc.scrollLeft=offset;return offset});
  await page.waitForTimeout(200);
  assert.equal(await root.getAttribute('data-ko-stage'),'octavos');
  assert.ok(await root.evaluate((el,x)=>Math.abs(el.querySelector('.ljr-ko-scroll').scrollLeft-x)<2,swipeOffset),'Stage label updates without repositioning the swipe');
  await page.locator('.ljr-ko-tabs [data-ko-stage="final"]').click();
  await page.waitForTimeout(500);
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
  const grip=await page.locator('[data-v501-sheet-toggle]').boundingBox();
  await page.mouse.move(grip.x+grip.width/2,grip.y+grip.height/2);await page.mouse.down();
  await page.mouse.move(grip.x+grip.width/2,height-50,{steps:12});await page.mouse.up();
  await page.locator('[data-v501-sheet-toggle][aria-expanded="false"]').waitFor();
  await page.waitForTimeout(450);
  await page.locator('[data-v501-sheet-toggle]').click();
  await page.locator('[data-v501-sheet-toggle][aria-expanded="true"]').waitFor();
  await page.goto('http://127.0.0.1:4173/#/competition',{waitUntil:'domcontentloaded'});
  if(width>=1024)await page.locator('[data-ljpc-bracket]').click();
  else await page.locator('#screen > .tabs .tab').filter({hasText:/^Cuadro$/}).click();
  await page.locator('.ljr-knockout[data-ko-mode="competition"]').waitFor();
  assert.equal(await page.locator('.ljr-knockout[data-ko-mode="competition"]').count(),1);
  if(width<1024){
   const tabs=await page.locator('#screen > .tabs').evaluate(el=>({radius:getComputedStyle(el).borderRadius,background:getComputedStyle(el.querySelector('.tab.active')).backgroundColor,color:getComputedStyle(el.querySelector('.tab.active')).color}));
   assert.equal(tabs.radius,'0px');assert.equal(tabs.background,'rgba(0, 0, 0, 0)');assert.equal(tabs.color,'rgb(34, 229, 239)');
  }
  assert.match(await page.locator('.ljr-ko-note').textContent(),/Cruces oficiales por definir/);
  assert.ok(await page.locator('.ljr-ko-club img').count()>0,'Competition starts with real league entrants');
  for(const stage of ['playoff','octavos','cuartos','semifinal','final']){
   await page.locator(`.ljr-ko-tabs [data-ko-stage="${stage}"]`).click();
   await page.waitForFunction(s=>{const root=document.querySelector('.ljr-knockout'),sc=root?.querySelector('.ljr-ko-scroll'),col=root?.querySelector(`[data-ko-column="${s}"]`);return root?.dataset.koStage===s&&sc&&col&&Math.abs(sc.scrollLeft-col.offsetLeft)<2;},stage);
   await page.screenshot({path:`${folder}/${name}-competition-${stage}.png`});
  }
  report.push({name,layout,simulationControls:'passed',competition:'passed'});
  await page.close();
 }
 writeFileSync(`${folder}/report.json`,JSON.stringify(report,null,2));
 console.log('Verified both brackets and score controls at 320, 390 and 1280 pixels.');
}catch(error){
 for(const [index,page] of (browser?.contexts().flatMap(c=>c.pages())||[]).entries()){
  await page.screenshot({path:`${folder}/failure-${index}.png`}).catch(()=>{});
  writeFileSync(`${folder}/failure-${index}.html`,await page.content());
 }
 throw error;
}finally{await browser?.close();server.kill();}
