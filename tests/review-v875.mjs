// Production mobile smoke tests. Run after npm run build.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||undefined,args:JSON.parse(process.env.BROWSER_ARGS||'["--no-sandbox"]')});
const checks=[],errors=[];let feedback=null;
checks.push=(...items)=>{for(const item of items)process.stderr.write(item+"\n");return Array.prototype.push.apply(checks,items)};
try{
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 page.on('pageerror',e=>errors.push(e.message));
 // Hold model loading to exercise cancellation without downloading weights in CI.
 await page.context().route('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1',route=>route.fulfill({contentType:'application/javascript',body:'export const env={backends:{onnx:{wasm:{}}}}; export const pipeline=()=>new Promise(()=>{});'}));
 await page.route('https://liga-juventino-media.ruchiz27mb0698.chatgpt.site/api/**',async route=>{
  const request=route.request(),url=new URL(request.url());
  if(url.pathname.endsWith('/me'))return route.fulfill({json:{admin:{id:'test-admin',name:'Test administrator',owner:true}}});
  if(url.pathname.endsWith('/feedback')&&request.method()==='POST'){feedback=request.postDataJSON();return route.fulfill({json:{ok:true,id:'test-feedback'}})}
  return route.fulfill({json:{items:[],ok:true}});
 });
 await page.context().route('http://app.test/**',async route=>{
  const name=new URL(route.request().url()).pathname.replace(/^\/App-liga-\//,'/');
  const file=path.join(process.cwd(),'dist',name==='/'?'index.html':name);
  try{const ext=path.extname(file).slice(1);await route.fulfill({body:fs.readFileSync(file),contentType:({html:'text/html',js:'application/javascript',mjs:'application/javascript',css:'text/css',json:'application/json',png:'image/png',webp:'image/webp',jpg:'image/jpeg',svg:'image/svg+xml'})[ext]||'application/octet-stream'})}
  catch{await route.fulfill({status:404,body:'Not found'})}
 });
 await page.addInitScript(()=>{try{localStorage.setItem('liga-media-session','test-only-token')}catch{}});
 await page.goto('http://app.test/App-liga-/?mode=apk#/home',{waitUntil:'domcontentloaded'});
 await page.waitForTimeout(1500);
 const go=async route=>{await page.evaluate(route=>window.LJR_MAIN_ROUTE.go(route),route);await page.waitForTimeout(700)};
 await go('leagueTools');
 assert.equal(await page.locator('[data-v875-studio]').count(),1);
 const destinations=await page.locator('.v734-tool-open[data-route]').evaluateAll(es=>[...new Set(es.map(el=>el.dataset.route))]);
 for(const destination of destinations){
  await go('leagueTools');const button=page.locator('.v734-tool-open[data-route="'+destination+'"]').first();
  assert.equal(await button.isEnabled(),true,destination+' disabled');
  await button.click();await page.waitForTimeout(500);
  assert.equal(await page.evaluate(()=>location.hash.split('?')[0]),'#/'+destination,destination+' does not open');
  assert.ok((await page.locator('#screen').innerText()).trim().length>5,destination+' blank');
 }
 checks.push(destinations.length+' tool routes open');
 await go('leagueTools');await page.evaluate(()=>document.querySelector('#screen').scrollTop=620);await page.waitForTimeout(150);
 const previous=await page.locator('#screen').evaluate(el=>el.scrollTop);
 await page.evaluate(()=>window.LJR_NAVIGATION.rendered());assert.equal(await page.locator('#screen').evaluate(el=>el.scrollTop),previous);
 await go('agendaBuilder');await page.evaluate(()=>window.LJR_NAVIGATION.back());await page.waitForTimeout(1800);
 assert.equal(await page.evaluate(()=>location.hash),'#/leagueTools');
 assert.ok(Math.abs(await page.locator('#screen').evaluate(el=>el.scrollTop)-previous)<3,'Back loses scroll');
 checks.push('Back restores scroll; repeated render preserves it');
 await go('history');
 const tabs=await page.locator('[data-v35-tab]').evaluateAll(es=>es.map(el=>el.dataset.v35Tab));
 let count=0;
 for(const tab of tabs){
  await page.locator('[data-v35-tab="'+tab+'"]').first().click();await page.waitForTimeout(300);
  assert.doesNotMatch(await page.locator('#screen').innerText(),/AdminFut|TABLAS DE GOLEO DEL ZIP|Cortes recuperados|Se muestran los 10|fuente\s*:/i);
  const details=page.locator('.v875-table-details:visible');count+=await details.count();
  if(await details.count()){await details.first().locator('summary').click();assert.equal(await details.first().evaluate(el=>el.open),true);await details.first().locator('summary').click()}
  const legacy=page.locator('.v370-legacy-team [data-v731-history-details]:visible');
  if(await legacy.count()){await legacy.first().click();assert.equal(await legacy.first().getAttribute('aria-expanded'),'true');assert.equal(await legacy.first().evaluate(el=>getComputedStyle(el.closest('.v370-legacy-team').querySelector('.v731-history-detail-copy')).display),'block')}
 }
 assert.ok(count>0,'No compact historical tables');checks.push(count+' historical tables use working details');
 await go('playerCompare');await page.waitForTimeout(200);
 assert.equal(await page.locator('.v123-back').isVisible(),false);
 const compare=await page.locator('.v123-player-compare').evaluate(el=>({h:el.getBoundingClientRect().height,available:el.parentElement.clientHeight}));
 assert.ok(compare.h<=compare.available+1,'Comparator does not fit');
 checks.push('Static comparator fits with one back arrow');
 await go('playerDetail');
 assert.equal(await page.locator('.v379-hero [data-v379-back]').isVisible(),false,'Player photo has a duplicate back arrow');
 await go('predictorSix');
 for(let i=0;i<4;i++){
  await page.locator('[data-v589-intro-dot="'+i+'"]').click();
  const rects=await page.locator('.v589-intro-icons,.v589-intro-copy,.v589-dots').evaluateAll(es=>es.map(el=>{const r=el.getBoundingClientRect();return {y:r.y,bottom:r.bottom}}));
  assert.ok(rects[1].y>=rects[0].bottom,'Intro art overlaps text');
  assert.ok(rects[2].y>=rects[1].y,'Intro dots overlap art');
 }
 assert.equal(await page.locator('.v589-more').isVisible(),true);
 checks.push('All four predictor slides fit; white top controls visible');
 await go('leagueTools');await page.locator('[data-v875-results]').click();await page.waitForTimeout(900);
 assert.equal(await page.locator('[data-pub-type]').inputValue(),'results');await page.locator('[data-pub-generate]').click();await page.locator('[data-pub-preview] canvas').waitFor({timeout:20000});
 assert.equal(await page.locator('[data-pub-preview] canvas').count(),1);
 checks.push('Results PNG produces a canvas');
 await go('leagueTools');await page.locator('[data-v875-studio]').click();await page.waitForTimeout(700);
 const studio=page.locator('.cms-design-form');
 assert.equal(await studio.count(),1);
 assert.equal(await page.locator('.cms-reference-gallery').count(),0,'Old published posters must remain references, not new designs');
 await page.locator('[data-design-preset="Cuartos de final"]').click();
 assert.equal(await studio.locator('[name="type"]').inputValue(),'Cuartos de final');
 assert.equal(await studio.locator('[name="style"]').inputValue(),'yellow');
 await studio.locator('[name="style"]').selectOption('red');
 await studio.locator('[name="type"]').selectOption('Logo del equipo');
 await studio.locator('[name="home"]').fill('Nuevo Club');
 await studio.locator('[name="type"]').dispatchEvent('change');
 await studio.locator('[type="submit"]').click();
 await page.waitForTimeout(500);
 const transparent=await page.locator('.liga-media-modal canvas').first().evaluate(el=>({w:el.width,h:el.height,alpha:el.getContext('2d').getImageData(0,0,1,1).data[3]}));
 assert.deepEqual(transparent,{w:1080,h:1080,alpha:0});
 assert.equal(await page.locator('[data-local-ai]').count(),1);
 await studio.locator('[name="body"]').fill('Preparar un comunicado para la próxima junta.');
 await page.locator('[data-local-ai]').click();
 assert.equal(await page.locator('[data-cancel-ai]').isVisible(),true);
 await page.locator('[data-cancel-ai]').click();
 assert.equal(await studio.locator('[name="body"]').inputValue(),'Preparar un comunicado para la próxima junta.');
 assert.equal(await page.locator('[data-local-ai]').isEnabled(),true);
 await studio.locator('.cms-extra-design summary').click();
 await studio.locator('[name="participants"]').fill('Barza\nOsasuna');
 await studio.locator('[name="type"]').selectOption('Bracket completo');
 await studio.locator('[name="format"]').selectOption('landscape');
 await page.locator('[data-canva]').click();
 const canvaBrief=await page.locator('.liga-media-modal [data-status]').textContent();
 assert.match(canvaBrief,/1200 × 630/);
 assert.match(canvaBrief,/Barza\nOsasuna/);
 await studio.locator('[name="format"]').selectOption('portrait');

 const options=await studio.locator('[name="type"] option').allTextContents();
 for(const type of ['Campeón','Jugador destacado','Felicitaciones · cumpleaños','Registro de nuevos equipos'])assert.ok(options.includes(type));
 await studio.locator('[name="type"]').selectOption('Feliz Navidad');await page.waitForTimeout(250);
 assert.equal(await page.locator('.liga-media-modal canvas').first().evaluate(el=>el.width),1080);
 await page.locator('.liga-media-modal [data-close]').last().click();checks.push('New design presets, transparent crest, cancelable local writing and HD preview');
 await page.evaluate(()=>localStorage.setItem('ljr-auth-v569',JSON.stringify({version:1,currentId:'test-member',accounts:[{id:'test-member',name:'Prueba de usuario',email:'member@example.test'}]})));
 await go('notifications');await page.locator('[data-v105-action="poll"]').first().click();await page.waitForTimeout(300);
 const mailbox=page.locator('[data-v875-mailbox]'),box=mailbox.locator('textarea');
 assert.equal(await mailbox.count(),1);assert.equal(await box.getAttribute('maxlength'),'10000');
 const proposal='Una propuesta para mejorar la programación y los campos. '.repeat(100);
 await box.fill(proposal);await mailbox.locator('button[type="submit"]').click();await page.waitForTimeout(300);
 assert.equal(feedback.accountId,'test-member');assert.equal(feedback.name,'Prueba de usuario');assert.equal(feedback.message,proposal.trim());
 assert.match(await mailbox.locator('[data-status]').innerText(),/buzón privado/);
 await page.locator('.v105-poll-modal .v105-close').click();
 await go('v38Weekly');await page.locator('[data-v105-action="meeting"]').first().click();await page.waitForTimeout(300);
 await page.locator('[data-meeting-field="place"]').fill('Sede de la liga');
 await page.locator('[data-add-topic="Propuestas del buzón"]').click();
 assert.match(await page.locator('[data-x="agenda"]').inputValue(),/Propuestas del buzón/);
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('ljr-meeting-options-v875')).place),'Sede de la liga');
 checks.push('Private mailbox submits long registered proposals; weekly meeting saves options');
 const imgs=await page.evaluate(async()=>{const result=[];for(const team of window.LJR_JERSEY_ASSETS.teams){const kit=await window.LJR_JERSEY_ART.kitFor(team.name);result.push(!!kit?.src?.startsWith('data:image/png'))}return result});
 assert.equal(imgs.length,50);assert.ok(imgs.every(Boolean));checks.push('All 50 complete jersey rasters load');
 console.log(JSON.stringify({checks,errors},null,2));
 if(errors.length)throw Error('Browser runtime errors: '+errors.join('; '));
}finally{await browser.close()}
