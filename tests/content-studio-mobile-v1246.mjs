import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFileSync,mkdirSync,existsSync} from 'node:fs';
import {resolve,extname,sep} from 'node:path';
import assert from 'node:assert/strict';
const root=resolve('.');
const server=createServer((req,res)=>{try{const path=decodeURIComponent(new URL(req.url,'http://local').pathname);if(path==='/'){res.setHeader('Content-Type','text/html');res.end('<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><script src="/src/v1246-content-layouts.js"></script><script src="/src/v1246-content-assets.js"></script><script src="/src/v776-design-studio.js"></script>');return}let file=resolve(root,'.'+path);if(!existsSync(file))file=resolve(root,'public','.'+path);if(!file.startsWith(root+sep))throw Error();const types={'.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.png':'image/png'};res.setHeader('Content-Type',types[extname(file)]||'application/octet-stream');res.end(readFileSync(file))}catch{res.writeHead(404);res.end()}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const db=JSON.parse(readFileSync('data/official-live.json','utf8'));
 await page.addInitScript(db=>{window.LJR_OFFICIAL_DATA=db;window.LJR_CMS={esc:s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),records:[]};window.LJR_MEDIA={admin:true,items:[],modal:(title,html)=>{const n=document.createElement('div');n.className='liga-media-modal';n.innerHTML='<section><header>'+title+'<button data-close>✕</button></header>'+html+'<p data-status role="status"></p></section>';document.body.append(n);n.querySelector('[data-close]').onclick=()=>n.remove();return n}}},db);
 await page.goto('http://127.0.0.1:'+server.address().port);await page.addStyleTag({path:'src/v1246-content-studio.css'});
 await page.evaluate(()=>window.LJR_DESIGN_STUDIO.open('Gran final'));
 await page.waitForFunction(()=>document.querySelectorAll('.ljr-layout-gallery button').length===5);
 assert.equal(await page.locator('[name=type] option').count(),30);assert.equal(await page.locator('[data-design-preset]').count(),16);
 await page.locator('[name=home]').fill('BOAVISTA');await page.locator('[name=away]').fill('SAN JOSÉ');await page.locator('[data-auto-copy]').click();
 await page.waitForFunction(()=>document.querySelector('[data-status]').textContent.includes('Vista previa lista'));
 assert.match(await page.locator('[name=body]').inputValue(),/BOAVISTA vs SAN JOSÉ/);
 await page.locator('.ljr-layout-gallery button').nth(2).click();await page.waitForFunction(()=>document.querySelector('.ljr-layout-gallery button:nth-child(3)')?.getAttribute('aria-pressed')==='true');
 assert.equal(await page.evaluate(()=>document.querySelector('.cms-poster-preview canvas').width),1080);
 const compositions=await page.evaluate(async()=>{let count=0;for(const type of ['Comunicado','Partido de jornada','Cuartos de final','Semifinal','Gran final','Tabla de goleo','Tabla de posiciones','Campeón','Jugador destacado','Reclutamiento de jugadores','Feliz Navidad','Campeón de campeones','Notificación con foto','Notificación de partido','Resultado de final'])for(const format of ['portrait','square','story','landscape'])for(let layout=0;layout<5;layout++){const c=await window.LJR_DESIGN_STUDIO.createCanvas({type,format,layout:String(layout),home:'BOAVISTA',away:'SAN JOSÉ',scoreHome:'2',scoreAway:'1',body:'Aviso oficial para equipos y delegados.',details:'Domingo · 10:00 · Campo 1'});if(!c.toDataURL('image/png').startsWith('data:image/png'))throw Error('PNG inválido');count++}return count});assert.equal(compositions,300);
 await page.evaluate(()=>window.LJR_CONTENT_ASSETS.pick(()=>{},'category'));await page.waitForFunction(()=>document.querySelectorAll('[data-asset]').length===5);assert.equal(await page.locator('[data-asset]').count(),5);
 assert.deepEqual(errors,[]);mkdirSync('artifacts/content-studio-v1246',{recursive:true});await page.screenshot({path:'artifacts/content-studio-v1246/category-picker-mobile.png'});await page.locator('.liga-media-modal').last().locator('[data-close]').click();await page.screenshot({path:'artifacts/content-studio-v1246/five-layouts-mobile.png',fullPage:true});console.log(JSON.stringify({compositions,mobileWidth:390,errors}));
}finally{await browser.close();await new Promise(r=>server.close(r))}
