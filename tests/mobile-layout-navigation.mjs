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

 const checks=[];
 await page.goto('http://app.test/?mode=apk#/home',{waitUntil:'domcontentloaded'});
 await page.waitForTimeout(1500);
 const go=async r=>{await page.evaluate(r=>location.hash='#/'+r,r);await page.waitForTimeout(700)};
 await go('more');
 const menu=await page.locator('.v19-more-item').evaluateAll(a=>a.map(e=>({text:e.innerText,route:e.dataset.route||e.dataset.safeRoute})).filter(e=>e.route));
 for(const item of (process.env.SKIP_MENU?[]:menu)){
   await go('more');
   const btn=page.locator('.v19-more-item').filter({hasText:item.text}).first();
   await btn.click();await page.waitForTimeout(500);
   assert.notEqual(await page.evaluate(()=>location.hash),'#/more',item.text+' navigates');
   await page.evaluate(()=>window.LJR_APP_BACK());await page.waitForTimeout(500);
   assert.equal(await page.evaluate(()=>location.hash),'#/more',item.text+' returns inside app');
   checks.push('menu '+item.text);
 }
 await go('competition');
 await page.waitForSelector('.v449-season-match');
 const font=await page.locator('.v449-season-match').first().evaluate(e=>getComputedStyle(e).fontSize);
 assert.equal(font,'12px');checks.push('fixture names compact');
 await go('leagueData');await page.waitForSelector('[data-v33-tab="team"]');
 await page.locator('[data-v33-tab="team"]').first().click();await page.waitForTimeout(500);
 const icon=await page.locator('[data-v33-share] svg').boundingBox();assert.ok(icon.width<=24&&icon.height<=24);checks.push('share icon 24px');
 const cards=await page.locator('.v33-stat-grid .v33-stat-card').evaluateAll(a=>a.map(e=>({left:e.getBoundingClientRect().left,right:e.getBoundingClientRect().right})));
 await page.screenshot({path:'/workspace/scratch/293375b42ee4/stats-after.png',fullPage:true});
 assert.ok(cards.length>1);assert.ok(cards.every(e=>e.left>=0&&e.right<=412));checks.push('statistics cards fit viewport');
 const expand=page.locator('[data-v33-expand-team]').first();
 const before=await expand.locator('..').locator('.v33-stat-row').count();
 await expand.click();assert.ok(await expand.locator('..').locator('.v33-stat-row').count()>before);checks.push('all teams expands complete table');

 await page.screenshot({path:'/workspace/scratch/293375b42ee4/stats-after.png',fullPage:true});
 await go('matchCenter');await page.waitForTimeout(1600);
 await page.evaluate(()=>{window.scrollTo(0,document.documentElement.scrollHeight);window.__matchNode=document.querySelector('[data-v92-matchcenter]');window.__ext=document.querySelector('#v413-page-design')});
 await page.waitForTimeout(200);const y=await page.evaluate(()=>window.scrollY);
 await page.evaluate(()=>window.dispatchEvent(new Event('ljr:official-data')));await page.waitForTimeout(600);
 assert.ok(Math.abs(await page.evaluate(()=>window.scrollY)-y)<5,'refresh retains scroll');
 assert.equal(await page.evaluate(()=>window.__matchNode===document.querySelector('[data-v92-matchcenter]')),true);checks.push('unchanged refresh keeps Match Center DOM and scroll');
 for(const tab of ['Cronología','Estadísticas','Previa','Alineaciones','Cuotas','Resumen']){
 await page.locator('[data-v92-tab="'+tab+'"]').first().click();await page.waitForTimeout(250);
 assert.match(await page.locator('[data-v92-tab="'+tab+'"]').first().getAttribute('class'),/active/);checks.push('match '+tab);
 }
 await go('home');await page.waitForTimeout(800);
 await page.locator('.v103-upcoming-wrap').screenshot({path:'/workspace/scratch/293375b42ee4/upcoming-after.png'});
 assert.ok(await page.locator('.v103-upcoming-match').count());checks.push('upcoming local data loads');
 await go('more');await page.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight));await page.waitForTimeout(250);
 await page.screenshot({path:'/workspace/scratch/293375b42ee4/more-bottom-after.png'});
 await go('v4-calendar');await go('leagueData');await page.waitForSelector('[data-v33-back]');await page.locator('[data-v33-back]').click();await page.waitForTimeout(500);
 assert.equal(await page.evaluate(()=>location.hash),'#/v4-calendar');checks.push('header returns one screen');
 console.log(JSON.stringify({checks,errors,failed:failed.filter(x=>x[1].startsWith('http://app.test'))},null,2));
 assert.deepEqual(errors,[]);
} finally {await b.close()}
