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
  const page=await browser.newPage({viewport:{width,height:900},isMobile:true,hasTouch:true,serviceWorkers:'block'});
  page.setDefaultTimeout(45000);
  // Geometry and interactions use the local official dataset; avoid hanging
  // on third-party media servers in an isolated CI browser.
  await page.route('**/*',async route=>{
   const url=new URL(route.request().url());
   if(url.hostname!=='app.test'){
    if(route.request().resourceType()==='image')return route.fulfill({contentType:'image/png',body:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a2ioAAAAASUVORK5CYII=','base64')});
    return route.abort();
   }
   const pathname=url.pathname.replace(/^\/App-liga-/, '')||'/';
   // Production also serves the deferred source scripts alongside Vite assets.
   let file=path.join(root,'dist',pathname==='/'?'index.html':pathname);
   if(!fs.existsSync(file)&&pathname.startsWith('/src/'))file=path.join(root,pathname);
   try{await route.fulfill({body:fs.readFileSync(file),contentType:({'html':'text/html','js':'application/javascript','css':'text/css','json':'application/json','svg':'image/svg+xml','webp':'image/webp','png':'image/png','jpg':'image/jpeg'})[path.extname(file).slice(1)]||'application/octet-stream'});}catch{await route.fulfill({status:404,body:'missing'});}
  });
  await page.goto('http://app.test/App-liga-/#/leagueData',{waitUntil:'domcontentloaded'});
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
  // Simulate the extra ancestor spacer left by an older mobile route/layout.
  await page.locator('#screen').evaluate(e=>e.style.setProperty('padding-top','128px','important'));
  await page.evaluate(()=>window.dispatchEvent(new Event('resize')));await page.waitForTimeout(300);
  const recovered=await page.locator('.v33-general-title').first().evaluate(rect);
  assert.ok(Math.abs(recovered.top-tabs.bottom-width*.05)<1,'legacy extra spacer is removed using the measured white-line position');
  await page.locator('#screen').evaluate(e=>e.style.removeProperty('padding-top'));
  await page.evaluate(()=>window.dispatchEvent(new Event('resize')));await page.waitForTimeout(300);
  const padding=await page.locator('[data-v33-data]').evaluate(e=>getComputedStyle(e).paddingTop);
  await page.evaluate(y=>window.scrollTo(0,y),width*.1);
  await page.waitForTimeout(300);
  const movingHeading=await page.locator('.v33-general-title').first().evaluate(rect);
  const movingHeader=await page.locator('[data-v33-head]').evaluate(rect);
  assert.ok(Math.abs((movingHeading.top-movingHeader.bottom)-(heading.top-tabs.bottom))<1,'white line and content keep the same small gap during collapse');
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
   const modeHeading=await page.locator('.v33-general-title').first().evaluate(rect);
   const modeTabs=await page.locator('.v33-tabs').evaluate(rect);
   assert.ok(modeHeading.top-modeTabs.bottom>=0&&modeHeading.top-modeTabs.bottom<35,'no empty band after changing '+tab);
   const geometry=await page.locator('.v33-stat-card').evaluateAll(es=>es.map(e=>({width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height,rows:[...e.querySelectorAll('.v33-stat-row')].map(r=>r.getBoundingClientRect().height)})));
   for(const card of geometry){
    assert.ok(Math.abs(card.width-width*.765)<1,'same reference card width in '+tab);
    assert.ok(Math.abs(card.height-width*1.22)<2,'same reference card height in '+tab+': '+card.height);
    for(const height of card.rows)assert.ok(Math.abs(height-width*.185)<1,'same fixed row height in '+tab);
   }
   const overflowing=await page.locator('.v33-row-copy').evaluateAll(es=>es.filter(e=>{
    const row=e.closest('.v33-stat-row').getBoundingClientRect(),copy=e.getBoundingClientRect();
    return copy.top<row.top||copy.bottom>row.bottom||[...e.children].some(c=>c.scrollWidth>c.clientWidth+1);
   }).map(e=>e.textContent));
   assert.deepEqual(overflowing,[],'full names and positions fit inside every row');
   assert.equal(await page.locator('.v33-stat-row > strong').evaluateAll(es=>es.some(e=>e.textContent.includes('✓'))),false,'no checkmarks in any tab');
   const bar=await page.locator('.v33-tabs button.active').evaluate(e=>getComputedStyle(e,'::after').backgroundColor);
   assert.equal(bar,'rgb(112, 82, 157)','purple indicator in all modes');
   const carousel=page.locator('.v33-carousel').first();
   const cards=await carousel.locator('.v33-stat-card').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.right,width:r.width}}));
   assert.ok(cards[0].left>=0&&cards[0].right<width&&cards[1].left<width,'next card peeks at right edge');
   await carousel.evaluate(e=>e.scrollTo({left:e.clientWidth,behavior:'instant'}));
   assert.ok(await carousel.evaluate(e=>e.scrollLeft)>0,'horizontal carousel scrolls');
   const expand=page.locator('[data-v33-expand-team],[data-v33-expand-player],[data-v33-expand-metric]').first();
   console.log('expand',width,tab);
   const count=await expand.locator('..').locator('.v33-stat-row').count();
   await expand.click({noWaitAfter:true});
   assert.ok(await expand.locator('..').locator('.v33-stat-row').count()>count,'see all expands real data');
   await page.waitForTimeout(300);
   await expand.click({noWaitAfter:true});
   assert.equal(await expand.locator('..').locator('.v33-stat-row').count(),count,'see less restores five rows');
   await page.evaluate(()=>window.scrollTo(0,0));await carousel.evaluate(e=>e.scrollTo({left:0,behavior:'instant'}));
   await page.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));
   const resetHeader=await page.locator('[data-v33-head]').evaluate(rect);
   const resetHeading=await page.locator('.v33-general-title').first().evaluate(rect);
   assert.ok(Math.abs(resetHeader.height-expanded.height)<1,'header and title restore together immediately');
   assert.ok(resetHeading.top-resetHeader.bottom>=0&&resetHeading.top-resetHeader.bottom<35,'no blank band while returning to the top');
   assert.match(await expand.textContent(),/Ver todos los (equipos|jugadores)/,'full footer label returns after collapse');
   await page.screenshot({path:process.env.STATS_SHOTS_DIR?path.join(process.env.STATS_SHOTS_DIR,`stats-${width}-${tab}.png`):`/tmp/stats-${width}-${tab}.png`});
   if(tab==='player'){
    const sections=await page.locator('[data-v33-player-section]').evaluateAll(es=>es.map(e=>({title:e.querySelector('h2').textContent,top:e.getBoundingClientRect().top,bottom:e.getBoundingClientRect().bottom,cards:e.querySelectorAll('.v33-stat-card').length})));
    assert.deepEqual(sections.map(s=>s.title),['Datos clave','Goles','Remates','Ataque','Distribución','Defensa','Portería','Información disciplinaria']);
    for(let i=1;i<sections.length;i++)assert.ok(Math.abs(sections[i].top-sections[i-1].bottom-width*.07)<1,'consecutive vertical sections have the reference spacing');
    assert.ok(sections.every(s=>s.cards===2),'each section owns its two horizontal cards');
    assert.equal(await page.locator('[data-v33-metric="goals"] h3').textContent(),'Goles');
    assert.ok(await page.locator('[data-v33-metric="goals"] .v33-stat-row > strong').evaluateAll(es=>es.every(e=>/^\d+$/.test(e.textContent))));
    const goals=page.locator('[data-v33-expand-metric="goals"]');
    const before=await goals.locator('..').locator('.v33-stat-row').count();
    await goals.click({noWaitAfter:true});
    assert.ok(await goals.locator('..').locator('.v33-stat-row').count()>before,'official goals expands');
    await goals.click({noWaitAfter:true});
    assert.equal(await goals.locator('..').locator('.v33-stat-row').count(),before,'official goals collapses');
   }
  }
  // Exercise the real route boundary and Android-like changes in usable height.
  await page.evaluate(()=>{location.hash='#/more'});
  await page.waitForTimeout(400);
  await page.evaluate(()=>{location.hash='#/leagueData'});
  await page.waitForSelector('[data-v33-data]');
  await page.waitForTimeout(400);
  await page.evaluate(()=>window.scrollTo(0,0));
  await page.setViewportSize({width,height:780});
  await page.waitForTimeout(400);
  const returnedHeading=await page.locator('.v33-general-title').first().evaluate(rect);
  const returnedTabs=await page.locator('.v33-tabs').evaluate(rect);
  assert.ok(returnedHeading.top-returnedTabs.bottom>=0&&returnedHeading.top-returnedTabs.bottom<35,'no second spacer after entering from More or browser bar resize');
  await page.close();
  }finally{await browser.close();}
 }
 console.log('PASS: mobile header, phase, purple tabs, carousels and see-all');
