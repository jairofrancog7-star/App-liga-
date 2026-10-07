// Production mobile smoke tests. Run after npm run build.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||undefined,args:JSON.parse(process.env.BROWSER_ARGS||'["--no-sandbox"]')});
const checks=[],errors=[];let feedback=null,savedContent=null,contentItems=[];
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
  if(url.pathname.includes('/content/')&&request.method()==='PUT'){savedContent=request.postDataJSON();return route.fulfill({json:{ok:true,revision:1}})}
  return route.fulfill({json:{items:url.pathname.endsWith('/content')?contentItems:[],ok:true}});
 });
 await page.context().route('http://app.test/**',async route=>{
  const name=new URL(route.request().url()).pathname.replace(/^\/App-liga-\//,'/');
  const file=path.join(process.cwd(),'dist',name==='/'?'index.html':name);
  try{const ext=path.extname(file).slice(1);await route.fulfill({body:fs.readFileSync(file),contentType:({html:'text/html',js:'application/javascript',mjs:'application/javascript',css:'text/css',json:'application/json',png:'image/png',webp:'image/webp',jpg:'image/jpeg',svg:'image/svg+xml'})[ext]||'application/octet-stream'})}
  catch{await route.fulfill({status:404,body:'Not found'})}
 });
 await page.addInitScript(()=>{try{localStorage.setItem('liga-media-session','test-only-token');if(!crypto.randomUUID)crypto.randomUUID=()=> '00000000-0000-4000-a000-000000000001'}catch{}});
 await page.goto('http://app.test/App-liga-/?mode=apk#/home',{waitUntil:'domcontentloaded'});
 await page.waitForTimeout(1500);
 await page.emulateMedia({media:'print'});
 const printBrands=await page.evaluate(()=>{
  const fixture=document.createElement('div');fixture.innerHTML='<div class="v553-week-range">Semana de la Liga</div><div class="v553-print-sheet"><div class="v553-week-range">Semana de la Liga</div></div>';document.body.append(fixture);document.body.classList.add('v553-printing');
  const brands=[...fixture.querySelectorAll('.v553-week-range')].map(el=>getComputedStyle(el,'::before').content);
  fixture.remove();document.body.classList.remove('v553-printing');return brands;
 });
 for(const brand of printBrands){assert.doesNotMatch(brand,/admin\s*f[uú]t/i);assert.match(brand,/Liga Juventino Rosas/)}
 await page.emulateMedia({media:'screen'});checks.push('Weekly print and PDF fallback headers carry league branding');
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
  assert.doesNotMatch(await page.locator('#screen').innerText(),/admin\s*f[uú]t|Cortes recuperados|TABLAS DE GOLEO DEL ZIP/i,destination+' shows reference labels');
 }
 checks.push(destinations.length+' tool routes open');
 await go('leagueTools');await page.evaluate(()=>document.querySelector('#screen').scrollTop=620);await page.waitForTimeout(150);
 const previous=await page.locator('#screen').evaluate(el=>el.scrollTop);
 await page.evaluate(()=>window.LJR_NAVIGATION.rendered());assert.equal(await page.locator('#screen').evaluate(el=>el.scrollTop),previous);
 await go('agendaBuilder');await page.evaluate(()=>window.LJR_NAVIGATION.back());await page.waitForTimeout(1800);
 assert.equal(await page.evaluate(()=>location.hash),'#/leagueTools');
 assert.ok(Math.abs(await page.locator('#screen').evaluate(el=>el.scrollTop)-previous)<3,'Back loses scroll');
 checks.push('Back restores scroll; repeated render preserves it');
 await go('more');await page.locator('#screen').evaluate(el=>el.scrollTop=600);
 const restoredScroll=await page.locator('#screen').evaluate(el=>({top:el.scrollTop,overflow:getComputedStyle(el).overflowY}));
 assert.ok(restoredScroll.top>500,'Más keeps its independent mobile scroll');
 assert.match(restoredScroll.overflow,/auto|scroll/);
 await go('leagueTools');
 const restoredArrow=await page.locator('#app>.topbar .back-button').evaluate(el=>{const s=getComputedStyle(el);return {display:s.display,visibility:s.visibility,opacity:s.opacity,width:s.width,height:s.height,border:s.borderTopWidth,radius:s.borderRadius,bg:s.backgroundImage,left:s.left}});
 assert.notEqual(restoredArrow.display,'none');assert.equal(restoredArrow.visibility,'visible');assert.equal(restoredArrow.opacity,'1');
 assert.ok(parseFloat(restoredArrow.width)<=28&&parseFloat(restoredArrow.height)<=28,'Back arrow is compact');
 assert.equal(restoredArrow.border,'0px');assert.equal(restoredArrow.radius,'0px');assert.match(restoredArrow.bg,/data:image\/svg\+xml/);assert.ok(parseFloat(restoredArrow.left)<=12,'Back arrow stays at the left edge');
 checks.push('Más keeps the restored scroll chrome; tools keeps the compact white back arrow');
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
 await go('video');assert.equal(await page.locator('.v17-tv-profile svg').count(),1);assert.equal(await page.locator('.v17-tv-profile img').count(),0);checks.push('Video profile control uses the profile icon');
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
 await studio.locator('.cms-extra-design summary').first().click();
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
 const generated=await page.evaluate(async()=>{
  const types=['Campeón de campeones','Notificación con foto','Notificación de partido','Reclutamiento de jugadores','Cuartos de final','Bracket completo'];
  const output=[];for(const format of ['portrait','square','story','landscape'])for(const type of types){const c=await window.LJR_DESIGN_STUDIO.createCanvas({format,type,style:'gold',home:'Barza',away:'Osasuna',body:'Una publicación nueva de la liga.',details:'Domingo · 10:00 · Campo 1',participants:'Barza\nOsasuna\nJuventus\nLa Huerta',scoreHome:'2',scoreAway:'1',minute:'54',events:'54′ · Gol\n45′ · Segundo tiempo'});output.push({type,format,w:c.width,h:c.height,bytes:c.toDataURL('image/png').length})}
  const logos=[];for(const logoShape of ['shield','circle','hexagon'])for(const logoSymbol of ['ball','star','crown','monogram']){const c=await window.LJR_DESIGN_STUDIO.createCanvas({type:'Logo del equipo',home:'Nuevo Club',logoShape,logoSymbol});logos.push({shape:logoShape,symbol:logoSymbol,alpha:c.getContext('2d').getImageData(0,0,1,1).data[3],url:c.toDataURL('image/png')})}
  return {output,logos};
 });
 for(const row of generated.output){const [w,h]=({portrait:[1080,1350],square:[1080,1080],story:[1080,1920],landscape:[1200,630]})[row.format];assert.equal(row.w,w,row.type);assert.equal(row.h,h,row.type);assert.ok(row.bytes>10000,row.type)}
 assert.equal(new Set(generated.logos.map(x=>x.url)).size,12);assert.ok(generated.logos.every(x=>x.alpha===0));checks.push('New local poster families and 12 distinct transparent crest variants render');
 await go('leagueTools');await page.locator('[data-v880-notification]').click();await page.waitForTimeout(300);
 const notice=page.locator('[data-v852-form]');await notice.locator('[name="presentation"]').selectOption('match');await notice.locator('[name="home"]').fill('Barza');await notice.locator('[name="away"]').fill('Osasuna');await notice.locator('[name="scoreHome"]').fill('2');await notice.locator('[name="scoreAway"]').fill('1');await notice.locator('[name="minute"]').fill('54');await notice.locator('[name="events"]').fill('54′ · Gol de Juan Pérez\n45′ · Segundo tiempo');await notice.locator('[name="title"]').fill('¡Barza marcó!');await notice.locator('[name="body"]').fill('Actualización del partido.');
 assert.match(await page.locator('.v880-notice-score').innerText(),/2 – 1/);assert.equal(await page.locator('.v880-notice-events>div').count(),2);
 await notice.locator('[name="background"]').fill('#112233');await notice.locator('[name="textColor"]').fill('#ffffff');await notice.locator('[name="accent"]').fill('#f8d67b');
 assert.equal(await page.locator('[data-v852-preview-box] .v880-notice').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(17, 34, 51)');
 assert.equal(await page.locator('[data-v852-preview-box] .v880-notice-score small').evaluate(el=>getComputedStyle(el).color),'rgb(248, 214, 123)');
 const noticePixel=await page.evaluate(async()=>{const c=await window.LJR_DESIGN_STUDIO.createCanvas({type:'Notificación de partido',home:'Barza',away:'Osasuna',notificationBackground:'#112233'});return [...c.getContext('2d').getImageData(100,1250,1,1).data]});assert.deepEqual(noticePixel,[17,34,51,255]);
 await notice.locator('[data-v880-notice-ai]').click();assert.equal(await notice.locator('[data-v880-cancel-ai]').isVisible(),true);await notice.locator('[data-v880-cancel-ai]').click();assert.equal(await notice.locator('[name="body"]').inputValue(),'Actualización del partido.');assert.equal(await notice.locator('[data-v880-notice-ai]').isEnabled(),true);
 await notice.locator('[data-v853-generate-design]').click();await page.waitForFunction(()=>document.querySelector('.v880-notice-photo')?.src.startsWith('blob:'));
 await notice.locator('[name="scoreHome"]').fill('3');assert.equal(await page.locator('.v880-notice-photo').count(),0,'Edited score retains stale PNG');
 await notice.locator('[data-v880-reviewed]').click();assert.equal(await notice.locator('[data-v853-publish]').isEnabled(),true);await notice.locator('[data-v853-draft]').click();await page.waitForTimeout(300);assert.equal(savedContent.published,false);assert.equal(savedContent.payload.presentation,'match');assert.equal(savedContent.payload.home,'Barza');assert.equal(savedContent.payload.scoreHome,3);assert.match(savedContent.payload.events,/Juan Pérez/);
 await page.locator('[data-v852-close]').click();checks.push('Modern notice previews match logos, events and scores; edits invalidate old images; draft preserves fields');
 await go('notifications');contentItems=[{id:'test-rich-notice',kind:'notification',published:true,payload:{presentation:'photo',title:'Noticias de la Liga',body:'Mensaje con imagen propia.',image:'http://app.test/App-liga-/assets/reference/predictor-v36/liga-crest-white.webp'}}];await page.evaluate(async()=>{await window.LJR_CMS.refresh();window.LJR_V852_RICH_NOTIFICATIONS.render()});
 await page.locator('[data-v852-toggle="test-rich-notice"]').click();assert.equal(await page.locator('[data-v852-record="test-rich-notice"] .v880-notice-photo').count(),1);await page.locator('[data-v852-toggle="test-rich-notice"]').click();assert.equal(await page.locator('[data-v852-record="test-rich-notice"] .v880-notice-photo').count(),0);
 checks.push('Published news expand and collapse their full-width image');
 const notificationRoute=await page.evaluate(async()=>{class TestNotice{static permission='granted';constructor(){window.__testNotice=this}close(){}}window.Notification=TestNotice;await window.LJR_V840_NOTIFICATIONS.sendRich({title:'Prueba local',body:'No se envía al dispositivo.',route:'calendar'});window.__testNotice.onclick();return location.hash});assert.equal(notificationRoute,'#/calendar');checks.push('Tapping a rich web notice opens its configured destination');
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
 const cloth=await page.evaluate(async()=>{
  const c=document.createElement('canvas');c.width=512;c.height=576;const x=c.getContext('2d');const pixels=x.createImageData(512,576);for(let y=0;y<576;y++)for(let xx=0;xx<512;xx++){const i=(y*512+xx)*4;pixels.data[i]=(xx*5+y*3)%255;pixels.data[i+1]=100;pixels.data[i+2]=150;pixels.data[i+3]=255}x.putImageData(pixels,0,0);
  const before=[...x.getImageData(288,288,1,1).data],im=new Image();im.src='./assets/reference/predictor-v36/liga-crest-white.webp';await im.decode();window.LJR_JERSEY_ART.printCrest({canvas:c,ctx:x,scale:1,x:0,y:0,left:0,top:0},im,{width:512,height:576,badgeX:.5,badgeY:.5,badgeWidth:40,badgeHeight:40,badgeSize:16});return {before,after:[...x.getImageData(288,288,1,1).data],alpha:x.getImageData(256,288,1,1).data[3]};
 });assert.deepEqual(cloth.after,cloth.before,'Cloth outside measured badge area must not be repainted');assert.equal(cloth.alpha,255);checks.push('Crest replacement respects measured boundaries and keeps shirt pixels opaque');
 console.log(JSON.stringify({checks,errors},null,2));
 if(errors.length)throw Error('Browser runtime errors: '+errors.join('; '));
}finally{await browser.close()}
