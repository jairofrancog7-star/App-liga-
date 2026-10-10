// Prueba de interfaz móvil sin credenciales ni publicaciones reales.
// Ejecutar tras npm run build, con Playwright instalado exclusivamente para CI.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const output=path.join(process.cwd(),'artifacts','notices-android');
fs.mkdirSync(output,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||undefined,args:['--no-sandbox']});
const sizes=[{width:360,height:740},{width:390,height:844},{width:412,height:915}];
try{
 for(const viewport of sizes){
  const context=await browser.newContext({
   viewport,isMobile:true,hasTouch:true,deviceScaleFactor:2,
   userAgent:'Mozilla/5.0 (Linux; Android 15; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36'
  });
  const page=await context.newPage();
  const caught=[];
  page.on('pageerror',e=>caught.push(e.message));
  let writes=0;
  await context.route('https://liga-avisos-api-production.up.railway.app/**',route=>{
   if(route.request().method()!=='GET'){writes++;return route.fulfill({status:403,json:{error:'Test: sin escrituras'}})}
   if(route.request().url().endsWith('/health/ready'))return route.fulfill({
    status:200,headers:{'Access-Control-Allow-Origin':'*'},
    json:{ready:true,database:'connected',schedulerEnabled:true,pushEnabled:true,smsEnabled:false,whatsappEnabled:false}});
   return route.fulfill({status:200,headers:{'Access-Control-Allow-Origin':'*'},json:{pushEnabled:true}});
  });
  await context.route('http://app.test/**',async route=>{
   const requestPath=new URL(route.request().url()).pathname;
   let file=path.join(process.cwd(),'dist',requestPath.replace(/^\/App-liga-\//,'/').replace(/^\//,''));
   if(requestPath==='/App-liga-/'||requestPath==='/App-liga-')file=path.join(process.cwd(),'dist','index.html');
   try{
    const ext=path.extname(file).slice(1).toLowerCase();
    const mime={html:'text/html',js:'application/javascript',css:'text/css',json:'application/json',svg:'image/svg+xml',
     png:'image/png',webp:'image/webp',jpg:'image/jpeg',woff2:'font/woff2'}[ext]||'application/octet-stream';
    await route.fulfill({body:fs.readFileSync(file),contentType:mime});
   }catch{await route.fulfill({status:404,body:'Archivo no encontrado'})}
  });
  await page.goto('http://app.test/App-liga-/?mobileNoticeCheck=1#/home',{waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForFunction(()=>Boolean(window.LJR_EDITOR_CENTER?.openNotice),{timeout:20000});
  // Emula autenticación SOLO EN ESTE NAVEGADOR DE PRUEBA.
  await page.evaluate(()=>{
   const base=window.LJR_MEDIA||{};
   window.LJR_MEDIA={
    ...base,
    admin:{id:'test-android',owner:true},
    api:async()=>({admin:{id:'test-android',owner:true}}),
    modal:(title,html)=>{
     const wrapper=document.createElement('div');
     wrapper.className='liga-media-modal';
     const section=document.createElement('section');
     section.className='ljr-admin-manage';
     const header=document.createElement('header');
     const h=document.createElement('h2');h.textContent=title;
     const close=document.createElement('button');close.type='button';close.dataset.close='1';close.textContent='×';
     close.onclick=()=>wrapper.remove();
     header.append(h,close);section.append(header);
     const container=document.createElement('div');container.innerHTML=html;
     while(container.firstChild)section.append(container.firstChild);
     wrapper.append(section);document.body.append(wrapper);
     return wrapper;
    }
   };
   window.LJR_EDITOR_CENTER.openNotice();
  });
  const root=page.locator('.liga-media-modal > section.ljr-editor-compose');
  await root.waitFor({state:'visible',timeout:12000});
  await page.locator('[data-v1230-check]').waitFor({state:'visible',timeout:8000});
  await page.locator('.ljr-notice-fixture-label select').waitFor({state:'visible',timeout:8000});
  const report=await root.evaluate(el=>{
   const r=el.getBoundingClientRect();
   const all=[...el.querySelectorAll('label,input,select,textarea,button')].filter(x=>{
    const s=getComputedStyle(x);return s.display!=='none'&&s.visibility==='visible';
   });
   return {
    width:r.width,overflow:el.scrollWidth-el.clientWidth,viewport:window.innerWidth,
    crossing:all.filter(x=>{
     const b=x.getBoundingClientRect();return b.left<r.left-3||b.right>r.right+3;
    }).slice(0,5).map(x=>x.tagName+' '+(x.getAttribute('aria-label')||x.name||''))
   };
  });
  assert.ok(report.overflow<=5,'Contenido cortado horizontalmente: '+JSON.stringify(report));
  assert.ok(!report.crossing.length,'Elementos fuera del cuadro: '+JSON.stringify(report));
  const btn=page.locator('[data-v1230-check]');
  await btn.click();
  await page.locator('[data-v1230-results]').getByText('Servidor y PostgreSQL').waitFor({state:'visible',timeout:12000});
  const checkText=await page.locator('[data-v1230-results]').innerText();
  assert.match(checkText,/IA local/);
  assert.match(checkText,/Avisos programados/);
  assert.match(checkText,/Conexión|Servidor y PostgreSQL/);
  await root.screenshot({path:path.join(output,'aviso-'+viewport.width+'-arriba.png')});
  await root.evaluate(el=>{el.scrollTop=el.scrollHeight});
  await page.waitForTimeout(150);
  await page.locator('[data-editor-publish]').waitFor({state:'visible'});
  await page.screenshot({path:path.join(output,'aviso-'+viewport.width+'-abajo.png')});
  assert.equal(writes,0,'La prueba móvil no debe publicar ni enviar mensajes');
  process.stdout.write('Android '+viewport.width+'x'+viewport.height+': formulario y diagnóstico correctos; cero escrituras.\n');
  await context.close();
 }
}finally{await browser.close()}
