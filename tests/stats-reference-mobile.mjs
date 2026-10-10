// npm install --no-save playwright; npx playwright install --with-deps chromium
// npm run build; node tests/stats-reference-mobile.mjs
// Behavioral geometry checks against the user's October 10 recording.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=path.resolve(import.meta.dirname,'..');
const launch=()=>chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||undefined,args:['--no-sandbox',...(process.env.CHROMIUM_SINGLE_PROCESS?['--single-process','--no-zygote','--in-process-gpu','--use-gl=angle','--use-angle=swiftshader']:[])],headless:true});
const rect=e=>{const r=e.getBoundingClientRect();return {top:r.top,bottom:r.bottom,left:r.left,right:r.right,width:r.width,height:r.height}};
 for(const width of (process.env.STATS_WIDTHS||'360,393,412').split(',').map(Number)){
  const browser=await launch();
  try{
  const page=await browser.newPage({viewport:{width,height:900},isMobile:true,hasTouch:true});
  page.setDefaultTimeout(45000);
  // Geometry and interactions use the local official dataset; avoid hanging
  // on third-party media servers in an isolated CI browser.
  await page.route('https://**',route=>route.abort());
  await page.route('http://app.test/**',async route=>{
   const pathname=new URL(route.request().url()).pathname;
   const file=path.join(root,'dist',pathname==='/'?'index.html':pathname);
   try{await route.fulfill({body:fs.readFileSync(file),contentType:({'html':'text/html','js':'application/javascript','css':'text/css','json':'application/json','svg':'image/svg+xml','webp':'image/webp','png':'image/png','jpg':'image/jpeg'})[path.extname(file).slice(1)]||'application/octet-stream'});}catch{await route.fulfill({status:404,body:'missing'});}
  });
  await page.goto('http://app.test/#/leagueData',{waitUntil:'domcontentloaded'});
  await page.waitForSelector('[data-v33-head]');
  await page.waitForTimeout(1200);
  const expanded=await page.locator('[data-v33-head]').evaluate(rect);
  const phase=await page.locator('.v33-morph-title p').evaluate(rect);
  const tabs=await page.locator('.v33-tabs').evaluate(rect);
  console.log({width,expanded,phase,tabs});
  await page.screenshot({path:process.env.STATS_SHOTS_DIR?path.join(process.env.STATS_SHOTS_DIR,`stats-${width}-expanded.png`):`/tmp/stats-${width}-expanded.png`});
  assert.ok(phase.bottom+8<=tabs.top,'Fase final must fit above the tabs');
  const heading=await page.locator('.v33-general-title').first().evaluate(rect);
  assert.ok(heading.top>=tabs.bottom&&heading.top-tabs.bottom<35,'first heading sits just below white line');
  const padding=await page.locator('[data-v33-data]').evaluate(e=>getComputedStyle(e).paddingTop);
  console.log('scroll down',width);
  await page.evaluate(()=>window.scrollTo(0,220));await page.waitForTimeout(300);
  const collapsed=await page.locator('[data-v33-head]').evaluate(rect);
  assert.ok(collapsed.height<expanded.height-40,'header collapses');
  assert.equal(await page.locator('[data-v33-data]').evaluate(e=>getComputedStyle(e).paddingTop),padding,'scroll never changes content origin');
  assert.equal(await page.locator('.v33-morph-title p').evaluate(e=>Number(getComputedStyle(e).opacity)),0,'phase fades');
  await page.evaluate(()=>window.scrollTo(0,0));await page.waitForTimeout(300);
  assert.ok(Math.abs((await page.locator('[data-v33-head]').evaluate(rect)).height-expanded.height)<1,'header expands again');
  for(const tab of ['team','player','general']){
   console.log('tab',width,tab);
   await page.locator(`[data-v33-tab="${tab}"]`).first().click({noWaitAfter:true});await page.waitForTimeout(300);
   const bar=await page.locator('.v33-tabs button.active').evaluate(e=>getComputedStyle(e,'::after').backgroundColor);
   assert.equal(bar,'rgb(112, 82, 157)','purple indicator in all modes');
   const carousel=page.locator('.v33-carousel').first();
   const cards=await carousel.locator('.v33-stat-card').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.right,width:r.width}}));
   assert.ok(cards[0].left>=0&&cards[0].right<width&&cards[1].left<width,'next card peeks at right edge');
   await carousel.evaluate(e=>e.scrollTo({left:e.clientWidth,behavior:'instant'}));
   assert.ok(await carousel.evaluate(e=>e.scrollLeft)>0,'horizontal carousel scrolls');
   const expand=page.locator('[data-v33-expand-team],[data-v33-expand-player]').first();
   console.log('expand',width,tab);
   const count=await expand.locator('..').locator('.v33-stat-row').count();
   await expand.click({noWaitAfter:true});
   assert.ok(await expand.locator('..').locator('.v33-stat-row').count()>count,'see all expands real data');
   await expand.click({noWaitAfter:true});
   assert.equal(await expand.locator('..').locator('.v33-stat-row').count(),count,'see less restores five rows');
   await page.evaluate(()=>window.scrollTo(0,0));await carousel.evaluate(e=>e.scrollTo({left:0,behavior:'instant'}));
   await page.screenshot({path:process.env.STATS_SHOTS_DIR?path.join(process.env.STATS_SHOTS_DIR,`stats-${width}-${tab}.png`):`/tmp/stats-${width}-${tab}.png`});
   if(tab==='player'){
    const goals=page.locator('[data-v33-expand-goals]');
    const before=await goals.locator('..').locator('.v33-stat-row').count();
    await goals.click({noWaitAfter:true});
    assert.ok(await goals.locator('..').locator('.v33-stat-row').count()>before,'official goals expands');
    await goals.click({noWaitAfter:true});
    assert.equal(await goals.locator('..').locator('.v33-stat-row').count(),before,'official goals collapses');
   }
  }
  await page.close();
  }finally{await browser.close();}
 }
 console.log('PASS: mobile header, phase, purple tabs, carousels and see-all');
