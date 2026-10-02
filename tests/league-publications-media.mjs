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



 await page.goto('http://app.test/?mode=apk#/publicationCenter',{waitUntil:'domcontentloaded'});await page.waitForSelector('[data-pub-generate]');
 const reports=await page.evaluate(async()=>{const all=[];for(const id of ['3','5','4','2','1'])for(const kind of ['standings','scorers','calendar','results','sanctions']){try{const cv=await window.LJR_PUBLICATIONS.reportCanvas(id,kind);const png=cv.toDataURL('image/png');all.push({id,kind,w:cv.width,h:cv.height,png:png.length});if(id==='1'&&kind==='calendar'){document.querySelector('[data-pub-preview]').replaceChildren(cv)}}catch(e){all.push({id,kind,error:e.message})}}return all});
 console.log(reports);assert.ok(reports.every(r=>r.error==='No hay datos publicados para esta selección'||r.w===1200&&r.png>10000));
 await page.screenshot({path:path.join(root,'../v561-publications.png'),fullPage:true});
 await page.locator('[data-pub-cat]').selectOption('1');await page.waitForTimeout(160);await page.locator('[data-pub-type]').selectOption('notice');await page.locator('[data-pub-note]').fill('Cambio de cancha por lluvia. Nueva sede: Campo 2.');await page.locator('[data-pub-generate]').click();await page.waitForFunction(()=>!document.querySelector('[data-pub-download]').disabled);
 assert.equal(await page.locator('[data-pub-preview] canvas').count(),1);fs.writeFileSync(path.join(root,'../v561-aviso.png'),Buffer.from((await page.locator('[data-pub-preview] canvas').evaluate(e=>e.toDataURL())).split(',')[1],'base64'));assert.match(await page.locator('[data-pub-whatsapp]').getAttribute('href'),/524121715599/);
 const download=page.waitForEvent('download');await page.locator('[data-pub-download]').click();assert.match((await download).suggestedFilename(),/Veteranos_50/);
 await page.evaluate(()=>location.hash='#/suspensionTool');await page.waitForSelector('[data-v561-susp-png]');await page.locator('[data-v64-susp-message]').fill('Suspensión por condiciones del campo');await page.locator('[data-v561-susp-png]').click();await page.waitForFunction(()=>!document.querySelector('[data-v561-susp-download]').disabled);assert.equal(await page.locator('[data-v561-susp-preview] canvas').count(),1);
 await page.evaluate(()=>location.hash='#/quiniela');await page.waitForSelector('[data-q-save]');let editable=page.locator('[data-q-home]:not(:disabled)');if(!await editable.count()){const rounds=await page.locator('[data-q-round] option').allTextContents();for(const round of rounds){await page.locator('[data-q-round]').selectOption(round);await page.waitForTimeout(100);if(await editable.count())break}}assert.ok(await editable.count());await editable.first().fill('2');await page.locator('[data-q-away]:not(:disabled)').first().fill('1');await page.locator('[data-q-save]').click();assert.ok(await page.evaluate(()=>Object.values(JSON.parse(localStorage.getItem('v561-quiniela'))).some(p=>p.home===2&&p.away===1)));
 const qdownload=page.waitForEvent('download');await page.locator('[data-q-export]').click();assert.match((await qdownload).suggestedFilename(),/quiniela/i);
 await page.evaluate(()=>location.hash='#/moments');await page.waitForTimeout(300);assert.equal(await page.locator('.v26-moments-sticky__image').count(),0);assert.equal(await page.locator('.v561-moments-title').innerText(),'Momentos');
 await page.route('https://www.youtube.com/iframe_api',r=>r.fulfill({contentType:'application/javascript',body:'window.YT={Player:class{constructor(e,c){setTimeout(()=>c.events.onReady(),0)}playVideo(){}pauseVideo(){}}};window.onYouTubeIframeAPIReady()'}));await page.route('https://www.youtube-nocookie.com/**',r=>r.fulfill({body:'<html>Player test</html>'}));
 await page.evaluate(()=>location.hash='#/matchCenter');await page.waitForSelector('[data-v561-camera-open]');await page.evaluate(()=>window.LJR_STREAM_CENTER.addSource('https://youtu.be/M7lc1UVf-VE','YouTube'));await page.waitForSelector('[data-v196-stream-hub] iframe');await page.evaluate(()=>window.__originalFrames=[...document.querySelectorAll('iframe')]);
 await page.locator('[data-v144-operator-toggle]').click();await page.locator('[data-v144-phase="phase-first"]').click();await page.waitForTimeout(600);assert.equal(await page.evaluate(()=>window.__originalFrames.every(f=>f.isConnected)),true,'starting match must preserve media');
 await page.evaluate(()=>{const cv=document.createElement('canvas');cv.width=320;cv.height=180;cv.getContext('2d').fillRect(0,0,320,180);window.__cameraPaint=setInterval(()=>cv.getContext('2d').fillRect(0,0,320,180),100);Object.defineProperty(navigator,'mediaDevices',{value:{getUserMedia:async()=>cv.captureStream(20)},configurable:true})});await page.locator('[data-v561-camera-open]').click();await page.waitForFunction(()=>document.querySelector('[data-camera-status]').textContent.includes('Cámara activa'));assert.ok(await page.locator('[data-v561-camera] video').evaluate(e=>!!e.srcObject));await page.locator('[data-v561-camera] [data-action="settings"]').click();await page.locator('.v561-dialog [data-tab="audio"]').click();await page.locator('.v561-dialog input[value="muted"]').check();await page.locator('.v561-dialog [data-apply]').click();assert.equal(await page.locator('[data-v561-camera] video').evaluate(e=>e.muted),true);await page.locator('[data-camera-close]').click();assert.equal(await page.locator('[data-v561-camera]').count(),0);await page.evaluate(()=>clearInterval(window.__cameraPaint));
 assert.equal(errors.length,0,errors.join('\n'));console.log('V561 routes, 25 category reports, PNG downloads, suspension form, predictions, persistent iframe, camera lifecycle and settings passed');
}finally{await b.close()}
