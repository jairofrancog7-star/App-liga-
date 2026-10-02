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


 await page.goto('http://app.test/?mode=apk#/competition',{waitUntil:'domcontentloaded'});await page.waitForTimeout(1300);
 await page.evaluate(()=>scrollTo(0,650));await page.waitForTimeout(150);const oldY=await page.evaluate(()=>scrollY);
 await page.evaluate(()=>{window.__entryFrames=[];const screen=document.querySelector('#screen'),animate=screen.animate.bind(screen);screen.animate=(frames,options)=>{window.__entryFrames.push(frames);return animate(frames,options)};location.hash='#/leagueData'});await page.waitForTimeout(400);
 assert.ok(await page.evaluate(()=>window.__entryFrames.some(f=>f[0].transform==='translateX(100%)')),'page slides in');
 await page.waitForTimeout(350);await page.locator('[data-v33-back]').click();await page.waitForTimeout(850);
 assert.equal(await page.evaluate(()=>location.hash),'#/competition');assert.ok(Math.abs(await page.evaluate(()=>scrollY)-oldY)<5,'previous scroll restored');
 await page.evaluate(()=>location.hash='#/history');await page.waitForTimeout(450);await page.evaluate(()=>location.hash='#/more');await page.waitForTimeout(750);
 assert.equal(await page.evaluate(()=>location.hash),'#/more');assert.deepEqual(errors,[]);
 assert.equal(await page.evaluate(()=>{const api=window.LJR_OFFICIAL_API;return api.getData().categories===api.getData().categories}),true,'official reads reuse unchanged data');
 console.log('PASS: right-to-left entry, one-step internal back and previous scroll; rapid navigation stable');
}finally{await b.close()}
