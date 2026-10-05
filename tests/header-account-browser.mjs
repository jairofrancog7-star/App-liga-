// Run after npm run build. Install Playwright or set PLAYWRIGHT_MODULE.
// Optional CHROMIUM_EXECUTABLE_PATH selects a preinstalled Chromium.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const b=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||undefined,args:['--no-sandbox']});
try {
 const page=await b.newPage({viewport:{width:412,height:915},isMobile:true,hasTouch:true});
 const errors=[],failed=[];
 page.on('pageerror',e=>errors.push(e.stack));
 page.on('response',r=>{if(r.status()>=400)failed.push([r.status(),r.url()])});
 await page.route('http://app.test/**',async route=>{
   let urlPath=new URL(route.request().url()).pathname.replace(/^\/App-liga-\//,'/');
   if(urlPath==='/')urlPath='/index.html';
   const file=path.join(root,'dist',urlPath);
   try{
     const body=fs.readFileSync(file),ext=path.extname(file).slice(1);
     await route.fulfill({body,contentType:({html:'text/html',js:'application/javascript',css:'text/css',json:'application/json',svg:'image/svg+xml',webp:'image/webp',png:'image/png',jpg:'image/jpeg'})[ext]||'application/octet-stream'});
   }catch{await route.fulfill({status:404,body:'Not found'})}
 });

 const go=async r=>{console.log('Checking',r);await page.evaluate(r=>window.LJR_MAIN_ROUTE.go(r),r);await page.waitForTimeout(1000)};
 await page.goto('http://app.test/?mode=apk#/home',{waitUntil:'domcontentloaded'});await page.waitForTimeout(1600);
 for(const route of ['home','teams','safe-about','hospitality','leagueTools','scorers','v4-calendar','history','simulator','profile','stats','following','favorites','safe-data','moments','matchCenter','rulebook','players','credentialBuilder']){
  await go(route);
  const controls=await page.locator('.ljr-header-v777 .ljr-chrome-actions button').evaluateAll(nodes=>nodes.filter(n=>n.getBoundingClientRect().height).map(n=>{const r=n.getBoundingClientRect();return {name:n.getAttribute('aria-label'),x:r.x,y:r.y,w:r.width,h:r.height,color:getComputedStyle(n).color}}));
  assert.equal(controls.filter(n=>n.name==='Mi perfil').length,1,route+' has one profile');
  for(const n of controls){assert.equal(n.w,32,route+' control width');assert.equal(n.h,32,route+' control height');assert.notEqual(n.color,'rgba(0, 0, 0, 0)',route+' visible glyph');}
  const sorted=controls.sort((a,b)=>a.x-b.x);for(let i=1;i<sorted.length;i++)assert.ok(sorted[i].x>=sorted[i-1].x+32,route+' controls do not overlap');
  if(route!=='home')assert.ok(controls.some(n=>n.name==='Regresar'),route+' back present');
 }
 await go('safe-data');
 const statsLayout=await page.evaluate(()=>{const head=document.querySelector('.v33-data-head'),title=head.querySelector('h1').getBoundingClientRect(),tabs=head.querySelector('.v33-tabs').getBoundingClientRect();return {titleBottom:title.bottom,tabsTop:tabs.top,headBottom:head.getBoundingClientRect().bottom}});
 assert.ok(statsLayout.tabsTop>=statsLayout.titleBottom,'statistics tabs below title');
 assert.equal(statsLayout.headBottom,136);
 await go('moments');assert.equal(await page.locator('.v26-moments-sticky button[aria-label^="Regresar"]').count(),1);
 await go('following');assert.ok(await page.locator('.bottom-nav').isVisible());assert.equal(await page.locator('.v28-league-logo').evaluate(n=>n.complete&&n.naturalWidth>0),true,'bundled league crest loads');
 await go('favorites');assert.equal(await page.locator('#v414-favorites-reference').evaluate(n=>getComputedStyle(n).backgroundColor),'rgb(6, 7, 95)');
 await go('players');await page.waitForTimeout(500);assert.equal(await page.locator('.v66-player-row img').evaluateAll(nodes=>nodes.filter(n=>n.complete&&!n.naturalWidth).length),0,'unavailable portraits show initials');
 await go('matchCenter');assert.equal(await page.locator('.v144-platforms [data-v144-local]').count(),1,'fourth local provider in active Match Center');
 const writes=[];await page.evaluate(()=>{window.__localRequests=[];window.LJR_MEDIA.api=async(path,options)=>{window.__localRequests.push([path,options?.method||'GET']);if(path==='rooms')return {rooms:[{id:'room-test-1234',title:'Final de la Liga'}]};return {}}});
 await page.locator('[data-v144-local]').click();await page.waitForSelector('[data-local-watch]');assert.equal(await page.locator('[data-local-broadcast]').count(),0,'public cannot broadcast');await page.locator('[data-local-watch]').click();
 assert.ok((await page.locator('.liga-media-modal iframe').getAttribute('src')).endsWith('/?live=room-test-1234'));assert.deepEqual(await page.evaluate(()=>window.__localRequests),[['rooms','GET']],'watching local does not publish match changes');await page.locator('.liga-media-modal [data-close]').click();
 await page.evaluate(()=>{Object.defineProperty(window.LJR_MEDIA,'admin',{get:()=>true,configurable:true});window.LJR_MEDIA.broadcast=options=>{window.__broadcastTitle=options.title}});await page.locator('[data-v144-local]').click();await page.locator('[data-local-broadcast]').click();assert.ok(await page.evaluate(()=>window.__broadcastTitle.includes(' vs ')),'administrator broadcasts with current fixture title');await page.evaluate(()=>{Object.defineProperty(window.LJR_MEDIA,'admin',{get:()=>false,configurable:true})});
 await go('home');assert.ok(await page.locator('.topbar').isVisible(),'home header returns');
 await go('leagueTools');const detail=page.locator('[data-v734-tool-details]').first();await detail.click();
 const card=detail.locator('..');const panel=card.locator('.v734-tool-detail-panel');assert.ok(await panel.isVisible());
 assert.equal(await panel.evaluate(n=>getComputedStyle(n).position),'static');
 await detail.click();assert.equal(await panel.isVisible(),false);
 await go('scorers?cat=4');await page.waitForSelector('[data-v194-player]',{timeout:5000}).catch(async e=>{console.log(await page.evaluate(()=>({hash:location.hash,category:window.LJR_SCORERS_REFERENCE?.getCategory(),db:!!window.LJR_OFFICIAL_DATA,owned:document.querySelectorAll('[data-v194-scorers]').length,text:document.querySelector('#screen').innerText.slice(0,1500)})));throw e});const player=page.locator('[data-v194-player]').first();const name=await player.getAttribute('data-v194-player');await player.click();await page.waitForSelector('[data-v379-profile]');assert.ok((await page.locator('[data-v379-profile]').innerText()).includes(name));
 await go('hospitality');const button=await page.locator('[data-v31-continue]').boundingBox();assert.ok(button.y>750,'continue anchored below the form');assert.equal(await page.locator('[data-v774-invites]').isVisible(),false,'public invitations admin hidden');
 await page.evaluate(()=>window.LJR_TEAM_DETAIL_API.openTeam('ABEJAS','3'));await page.waitForSelector('[data-v42-compare]');await page.locator('[data-v42-compare]').first().click();await page.waitForSelector('#v369-team-compare');
 const compareControls=await page.locator('.v369-compare-topbar button').evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}}));assert.equal(compareControls.length,3);compareControls.sort((a,b)=>a.x-b.x);for(const control of compareControls){assert.equal(control.w,32);assert.equal(control.h,32)}assert.ok(compareControls[2].x>=compareControls[1].x+32,'share and profile side by side in comparison');await page.locator('[data-v369-close]').click();assert.equal(await page.locator('#v369-team-compare').count(),0,'compare closes to same team page');
 await go('fantasy');assert.equal(await page.getByText('Quiniela de la liga',{exact:true}).count(),0);
 await go('history');for(const tab of ['Resumen','Temporadas','Campeones','Finales','Récords','Videos']){await page.locator('[data-v35-tab="'+tab+'"]').click();assert.equal(await page.locator('.v351-history-panel.is-active').getAttribute('data-v351-panel'),tab);}
 assert.deepEqual(errors,[]);console.log('PASS: shared mobile headers, visible signed-out account, separated controls, home return, tools details, scorer-to-player routing, hospitality bottom action and history tabs.');
}finally{await b.close()}
