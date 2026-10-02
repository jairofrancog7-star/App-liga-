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


 await page.goto('http://app.test/?mode=apk#/teams',{waitUntil:'domcontentloaded'});await page.waitForTimeout(1200);
 const gap=await page.evaluate(()=>document.querySelector('.v105-bottom').getBoundingClientRect().top-document.querySelector('.v73-below-native').getBoundingClientRect().bottom);
 assert.ok(gap<=50,'gap after team card: '+gap);
 await page.evaluate(()=>location.hash='#/credentialBuilder');await page.waitForTimeout(800);
 await page.locator('[data-v64-cred-team]').evaluate(e=>{e.value=[...e.options].find(o=>o.textContent.includes('NOPALERO')).value;e.dispatchEvent(new Event('change',{bubbles:true}))});
 assert.equal(await page.locator('[data-v560-final-preview]').count(),1);
 await page.locator('[data-v560-enlarge]').click();assert.equal(await page.locator('.v560-credential-dialog').isVisible(),true);await page.locator('.v560-credential-dialog button').click();
 const crest=await page.evaluate(async()=>{const cv=await window.LJR_V480.makeCanvas(1),q=cv.getContext('2d'),d=q.getImageData(850,160,100,100).data;let pixels=0;for(let i=0;i<d.length;i+=4)if(d[i]!==216||d[i+1]!==63||d[i+2]!==96)pixels++;return pixels});assert.ok(crest>1000,'team crest drawn');
 await page.evaluate(()=>location.hash='#/matchCenter');await page.waitForTimeout(1000);
 await page.route('https://www.facebook.com/**',r=>r.fulfill({body:'<html>Facebook player</html>'}));
 await page.route('https://www.youtube.com/iframe_api',r=>r.fulfill({contentType:'application/javascript',body:'window.YT={Player:class{constructor(e,c){setTimeout(()=>c.events.onReady(),0)}playVideo(){window.__ytPlayed=true}pauseVideo(){}getCurrentTime(){return 20}seekTo(t){window.__ytSeek=t}}};window.onYouTubeIframeAPIReady()'}));
 await page.route('https://www.youtube-nocookie.com/**',r=>r.fulfill({body:'<html>YouTube player</html>'}));
 assert.equal(await page.evaluate(()=>window.LJR_STREAM_CENTER.addSource('https://www.facebook.com/share/r/14vRP232NA5/','Prueba Facebook')),true);await page.waitForTimeout(500);
 const fb=page.locator('[data-v196-stream-hub] iframe');assert.ok((await fb.getAttribute('src')).startsWith('https://www.facebook.com/plugins/video.php?href='));
 assert.equal(await page.locator('[data-v196-stream-hub] .v196-player-empty.facebook').count(),0);
await page.waitForTimeout(1000);assert.equal(await fb.count(),1);
 assert.equal(await page.evaluate(()=>window.LJR_STREAM_CENTER.addSource('https://youtube.com/shorts/M7lc1UVf-VE','Prueba YouTube')),true);await page.waitForFunction(()=>document.querySelector('[data-v196-stream-hub] iframe')?.src.includes('/embed/M7lc1UVf-VE'));
 assert.ok((await page.locator('[data-v196-stream-hub] iframe').getAttribute('src')).includes('/embed/M7lc1UVf-VE'));
 await page.locator('[data-v196-stream-hub] [data-action="play"]').click();assert.equal(await page.evaluate(()=>window.__ytPlayed),true);await page.locator('[data-v196-stream-hub] [data-action="next"]').click();assert.equal(await page.evaluate(()=>window.__ytSeek),30);
 await page.evaluate(()=>window.LJR_STREAM_CENTER.addSource('https://app.test/test.mp4','Video directo'));await page.waitForTimeout(500);
 await page.evaluate(()=>{Object.defineProperty(document,'pictureInPictureEnabled',{value:true,configurable:true});const v=document.querySelector('[data-v196-stream-hub] video');Object.defineProperty(v,'readyState',{value:2});v.play=()=>Promise.resolve();v.requestPictureInPicture=()=>{window.__pipCalled=true;return Promise.resolve({})}});
 await page.locator('[data-v196-floating]').click();await page.waitForTimeout(100);assert.equal(await page.evaluate(()=>window.__pipCalled),true);
 await page.evaluate(()=>window.LJR_STREAM_CENTER.disableFloating());await page.waitForTimeout(100);
 await page.route('https://www.tiktok.com/**',r=>r.fulfill({body:'<html>TikTok player</html>'}));
 await page.evaluate(()=>window.LJR_STREAM_CENTER.addSource('https://www.tiktok.com/@scout2015/video/6718335390845095173','TikTok prueba'));await page.waitForTimeout(400);
 assert.ok((await page.locator('[data-v196-stream-hub] iframe').getAttribute('src')).includes('/player/v1/6718335390845095173'));
 await page.locator('[data-v196-stream-hub] [data-action="zoom"]').click();assert.equal(await page.locator('[data-v196-stream-hub] iframe').evaluate(e=>e.style.transform),'scale(1.25)');
 await page.locator('[data-v196-stream-hub] [data-action="settings"]').click();assert.equal(await page.locator('.v196-modal').isVisible(),true);await page.locator('.v196-modal [data-v196-close]').last().click();
 await page.locator('[data-v196-stream-hub] [data-action="fullscreen"]').click();await page.waitForFunction(()=>!!document.fullscreenElement||!!document.querySelector('.v560-expanded'));await page.evaluate(()=>document.fullscreenElement&&document.exitFullscreen());
 console.log('Final credential preview, enlargement, TikTok embed, zoom, settings and fullscreen passed');
 console.log('Facebook/YouTube embeds and native video PiP invocation passed (provider playback needs network/device verification).');
 console.log('Team card gap',gap,'credential crest pixels',crest,'JS errors',errors);assert.equal(errors.length,0);
}finally{await b.close()}
