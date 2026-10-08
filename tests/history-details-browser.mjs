// Run after npm run build; optional PLAYWRIGHT_MODULE and CHROMIUM_EXECUTABLE_PATH.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=path.resolve(import.meta.dirname,'..','dist');
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||undefined,args:['--no-sandbox']});
try{
 for(const width of [412,1440]){
  const page=await browser.newPage({viewport:{width,height:915},isMobile:width<600});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',async route=>{
   const url=new URL(route.request().url());
   if(url.hostname!=='app.test'){await route.abort();return;}
   const name=url.pathname.replace(/^\/App-liga-\//,'/');
   const file=path.join(root,name==='/'?'index.html':name);
   try{await route.fulfill({body:fs.readFileSync(file),contentType:({html:'text/html',js:'application/javascript',css:'text/css',json:'application/json',webp:'image/webp',jpg:'image/jpeg',png:'image/png',svg:'image/svg+xml'})[path.extname(file).slice(1)]||'application/octet-stream'})}
   catch{await route.fulfill({status:404,body:'missing'})}
  });
  await page.goto('http://app.test/?mode=apk#/history',{waitUntil:'commit'});
  await page.locator('[data-v35-tab="Récords"]').click();
  await page.waitForSelector('[data-v370-details]');
  console.log(width,'records loaded');
  const total=await page.locator('.v370-legacy-team').count();assert.ok(total>100);
  assert.equal(await page.locator('.v370-legacy-team [data-v370-details]').count(),total);
  console.log(width,'checking three cards');
  for(const team of ['Olímpicos','Puros Cuates','El Alto']){
   const card=page.locator('[data-v710-name="'+team+'"]');
   const button=card.locator('[data-v370-details]');
   await button.click();assert.equal(await button.getAttribute('aria-expanded'),'true');
   assert.ok(await card.locator('.v370-archive-details').isVisible());
   assert.match(await card.locator('.v370-archive-details').innerText(),/2013/);
   assert.equal(await page.evaluate(()=>location.hash),'#/history');
   await button.click();assert.equal(await button.getAttribute('aria-expanded'),'false');
   assert.equal(await card.locator('.v370-archive-details').isVisible(),false);
  }
  console.log(width,'checking all cards');
  const failures=await page.locator('.v370-legacy-team').evaluateAll(cards=>cards.flatMap(card=>{
   const b=card.querySelector('[data-v370-details]'),p=card.querySelector('.v370-archive-details');
   b.click();const good=b.getAttribute('aria-expanded')==='true'&&!p.hidden&&p.textContent.trim();
   b.click();return good&&p.hidden?[]:[card.dataset.v710Name];
  }));assert.deepEqual(failures,[]);
  console.log(width,'checking crests');
  const olympic=page.locator('[data-v710-name="Olímpicos"] img');
  await olympic.evaluate(img=>img.decode());
  assert.match(await olympic.getAttribute('src'),/olimpicos-pozos-original/);
  assert.ok(await olympic.evaluate(img=>img.naturalWidth>=1000));
  const cuates=await page.locator('[data-v710-name="Puros Cuates"] img').evaluate(img=>{
   const a=img.getBoundingClientRect(),b=img.parentElement.getBoundingClientRect();return {scale:a.width/b.width,transform:getComputedStyle(img).transform};
  });assert.ok(cuates.scale>3&&cuates.scale<3.3,JSON.stringify(cuates));
  assert.equal(await page.locator('img[src*="legacy-2015-el-alto"]').count(),0);
  console.log(width,'checking champions');
  await page.locator('[data-v35-tab="Campeones"]').click();
  const lazy=page.locator('[data-v35-lazy-history="champions"]');
  if(await lazy.count())await lazy.scrollIntoViewIfNeeded();
  await page.waitForSelector('.v35-history-moment-photo img[src*="enhanced-v326"]');
  const huerta=page.locator('.v35-history-moment-photo').filter({has:page.locator('h3', {hasText:'La Huerta de Cuenda'})}).filter({hasText:'29 jun 2025'}).first();
  assert.match(await huerta.locator(':scope > img').getAttribute('src'),/enhanced-v326\/archive-v203/);
  await page.locator('[data-v35-tab="Récords"]').click();
  await page.locator('[data-v710-sort="newest"]').click();
  await page.locator('[data-v710-category="primera"]').click();
  const visible=page.locator('.v370-legacy-team:visible').first();
  await visible.locator('[data-v370-details]').click();assert.equal(await visible.locator('[data-v370-details]').getAttribute('aria-expanded'),'true');
  assert.deepEqual(errors,[]);
  console.log(`${width}px: ${total} club buttons open/close; three crests checked; larger champion photos, tabs and filters pass.`);
  await page.close();
 }
}finally{await browser.close()}
