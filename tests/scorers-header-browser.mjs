// After npm run build: PLAYWRIGHT_MODULE and CHROMIUM_EXECUTABLE_PATH are optional.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=path.resolve(path.dirname(new URL(import.meta.url).pathname),'..');
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||undefined,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
try {
  for(const width of (process.env.SCORERS_TEST_WIDTHS||'320,360,412,768').split(',').map(Number)){
    const page=await browser.newPage({viewport:{width,height:915},isMobile:true,hasTouch:true});
    await page.route('**/*',async route=>{
      const url=new URL(route.request().url());
      if(url.hostname!=='app.test')return route.abort();
      let relative=url.pathname.replace(/^\/App-liga-\//,'');
      if(!relative||relative==='/')relative='index.html';
      const file=path.resolve(root,'dist',relative);
      if(!file.startsWith(path.resolve(root,'dist')+path.sep))return route.abort();
      try {
        await route.fulfill({body:fs.readFileSync(file),contentType:({'.html':'text/html','.css':'text/css','.js':'application/javascript','.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png'})[path.extname(file)]||'application/octet-stream'});
      }catch{await route.fulfill({status:404,body:'missing'})}
    });
    await page.goto('http://app.test/App-liga-/?mode=apk#/scorers?cat=4',{waitUntil:'domcontentloaded'});
    await page.waitForSelector('.v959-title');
    await page.locator('#ljr-boot').waitFor({state:'hidden',timeout:12000});
    await page.waitForTimeout(300);
    const measure=()=>page.evaluate(()=>{
      const bar=document.querySelector('#app > .topbar');
      const title=bar.querySelector('.v959-title');
      const screen=document.querySelector('#screen');
      const b=bar.getBoundingClientRect(),t=title.getBoundingClientRect();
      const p=bar.querySelector('.v959-profile').getBoundingClientRect();
      const style=getComputedStyle(title),art=getComputedStyle(bar,'::before');
      return {height:b.height,bottom:b.bottom,screenTop:screen.getBoundingClientRect().top,scrollTop:screen.scrollTop,title:title.textContent,font:style.fontSize,weight:style.fontWeight,titleTop:t.top,titleBottom:t.bottom,titleRight:t.right,profileLeft:p.left,titleWidth:title.clientWidth,textWidth:title.scrollWidth,art:art.display,background:getComputedStyle(bar).backgroundImage,compact:document.body.classList.contains('v959-compact')};
    });
    await page.evaluate(()=>document.querySelector('#screen').scrollTop=0);
    await page.waitForTimeout(300);
    const expanded=await measure();
    if(process.env.SCORERS_SCREENSHOT_DIR&&width===412)await page.screenshot({path:path.join(process.env.SCORERS_SCREENSHOT_DIR,'scorers-expanded.png')});
    await page.evaluate(()=>document.querySelector('#screen').scrollTop=240);
    await page.waitForTimeout(350);
    const compact=await measure();
    if(process.env.SCORERS_SCREENSHOT_DIR&&width===412)await page.screenshot({path:path.join(process.env.SCORERS_SCREENSHOT_DIR,'scorers-compact.png')});
    console.log(JSON.stringify({width,expandedHeight:expanded.height,compactHeight:compact.height,font:compact.font,contentTop:compact.screenTop}));
    assert.ok(compact.compact,'scroll must enable compact mode');
    assert.ok(expanded.height-compact.height>=24,'header must shrink vertically');
    assert.equal(compact.font,expanded.font,'title font size must stay unchanged');
    assert.equal(compact.weight,expanded.weight,'title weight must stay unchanged');
    assert.equal(compact.background,expanded.background,'same artwork while scrolling');
    for(const state of [expanded,compact]){
      assert.equal(state.title,'Máximo goleador');
      assert.equal(state.art,'block','blue line artwork must be visible');
      assert.ok(Math.abs(state.screenTop-state.bottom)<1,'scroll surface begins below header');
      assert.ok(state.titleTop>=0&&state.titleBottom<=state.bottom,'title fits inside header');
      assert.ok(state.textWidth<=state.titleWidth,'full title fits without clipping');
      assert.ok(state.titleRight<=state.profileLeft,'title must not overlap profile');
    }
    assert.equal(await page.locator('#app > .topbar button').evaluateAll(nodes=>nodes.filter(n=>n.getClientRects().length&&getComputedStyle(n).visibility!=='hidden').length),2,'only the back and profile buttons are visible');
    const stable=await measure();
    assert.equal(stable.height,compact.height,'compact mode settles without oscillation');
    await page.evaluate(()=>document.querySelector('#screen').scrollTop=0);
    await page.waitForTimeout(350);
    assert.equal((await measure()).height,expanded.height,'returning to top expands header');
    assert.equal(await page.locator('.v959-title').count(),1,'only one title');
    assert.equal(await page.locator('[data-v194-cat]').count(),5,'all league categories remain');
    await page.locator('.v959-profile').click();
    await page.waitForTimeout(500);
    assert.ok(!await page.locator('.v959-title').count(),'header controls are removed on leaving scorers');
    await page.evaluate(()=>location.hash='#/video');
    await page.waitForTimeout(400);
    await page.evaluate(()=>location.hash='#/scorers?cat=4');
    await page.waitForSelector('.v959-profile');
    await page.waitForTimeout(400);
    assert.equal(await page.locator('#app > .topbar').isVisible(),true,'header is restored after leaving video');
    await page.close();
  }
  console.log('Scorers header: vertical collapse, fixed typography, artwork, content boundary and navigation verified.');
}finally{await browser.close()}
