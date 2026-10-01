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
 await page.goto('http://app.test/?mode=apk#/scorers?cat=4',{waitUntil:'domcontentloaded'});
 await page.waitForSelector('[data-v194-cat="4"]');
 await page.waitForTimeout(1200);
 const checks=[];
 for(const id of ['3','5','4','2','1']){
  await page.locator('[data-v194-cat="'+id+'"]').click();
  await page.waitForTimeout(120);
  assert.equal(await page.locator('[data-v391-category]').getAttribute('data-v391-category'),id);
  assert.equal(await page.locator('[data-v194-cat="'+id+'"]').getAttribute('aria-pressed'),'true');
  checks.push('scorers category '+id);
 }
 for(const stat of ['shots','passes','goals']){
  await page.locator('[data-v462-stat="'+stat+'"]').click();
  assert.match(await page.locator('[data-v462-stat="'+stat+'"]').getAttribute('class'),/active/);
  checks.push('ranking '+stat);
 }
 const row=page.locator('[data-v194-player]').first();const player=await row.getAttribute('data-v194-player');
 await row.click();await page.waitForSelector('[data-v379-profile]',{timeout:10000});
 assert.match(await page.locator('[data-v379-profile]').innerText(),new RegExp(player,'i'));
 checks.push('scorer opens correct player');
 await page.evaluate(()=>location.hash='#/history');await page.waitForSelector('[data-v35-tab]');
 for(const tab of ['Temporadas','Campeones','Finales','Récords','Videos','Resumen']){
  const start=Date.now();await page.locator('[data-v35-tab="'+tab+'"]').click();
  assert.equal(await page.locator('.v351-history-panel.is-active').getAttribute('data-v351-panel'),tab);
  checks.push('history '+tab+' '+(Date.now()-start)+'ms');
 }
 await page.locator('[data-v35-tab="Campeones"]').click();
 const cats=await page.locator('[data-v340-champion-cat]').evaluateAll(a=>a.map(e=>e.getAttribute('data-v340-champion-cat')));
 for(const cat of cats){await page.locator('[data-v340-champion-cat="'+cat+'"]').click();checks.push('champions '+cat)}
 await page.evaluate(()=>location.hash='#/competition');await page.waitForSelector('[data-comp-tab]');
 for(const tab of ['standings','bracket','fixtures']){const el=page.locator('[data-comp-tab="'+tab+'"]');if(await el.count()){await el.click();checks.push('competition '+tab)}}
 await page.evaluate(()=>location.hash='#/whereToWatch');await page.waitForSelector('[data-v412-watch-day]');
 await page.locator('[data-v412-watch-day="all"]').click();assert.match(await page.locator('[data-v412-watch-day="all"]').getAttribute('class'),/is-active/);checks.push('TV dates');
 await page.evaluate(()=>location.hash='#/rankings');await page.waitForSelector('#v449-reference-lower');
 await page.waitForTimeout(1500);
 await page.evaluate(()=>{window.__lowerMutations=0;new MutationObserver(m=>window.__lowerMutations+=m.length).observe(document.querySelector('#v449-reference-lower'),{childList:true,subtree:true})});
 await page.waitForTimeout(800);assert.equal(await page.evaluate(()=>window.__lowerMutations),0);checks.push('lower panels settle without redraw loop');
 for(const name of ['shots','passes','goals']){await page.locator('[data-v449-ranking-mode="'+name+'"]').click();assert.match(await page.locator('[data-v449-ranking-mode="'+name+'"]').getAttribute('class'),/active/);checks.push('lower ranking '+name)}
 await page.evaluate(()=>location.hash='#/credentialBuilder');await page.waitForTimeout(700);
 if(await page.locator('[data-v132-open]').count()){await page.locator('[data-v132-open]').click();await page.waitForSelector('[data-v132-team]');await page.locator('[data-v132-team]').first().click();checks.push('registration team picker');}
 console.log('CHECKS',checks);console.log('ERRORS',errors);console.log('FAILED',failed.filter(x=>x[1].startsWith('http://app.test')));

 assert.equal(errors.length,0);
 assert.deepEqual(failed.filter(x=>x[1].startsWith('http://app.test')),[]);
} finally {await b.close()}
