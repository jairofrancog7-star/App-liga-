import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const root=resolve('.');
const fixture=`<!doctype html><html><head><link rel="stylesheet" href="/src/registration-capture.css"><link rel="stylesheet" href="/src/v124-player-registration.css"><style>body{margin:0;background:#10145a;color:white;font-family:Arial}#screen{padding:12px;max-width:900px;margin:auto}input,textarea,select{max-width:100%;box-sizing:border-box}</style></head><body><main id="screen"><section class="v64-page"><div class="v64-form-grid"><input data-v64-cred-name><input data-v64-cred-curp><select data-v64-cred-team><option value="">Elige</option><option>Equipo Prueba</option></select><input data-v64-cred-cat value="Primera Fuerza"><input type="date" data-v100-dob><input data-v100-age><input data-v100-city><select data-v100-status><option>Pendiente de validación</option></select><input type="file" data-v64-doc><div data-v64-doc-preview></div><input type="file" data-v64-photo><div data-v64-player-mini-preview></div><textarea data-v64-ocr-text></textarea><button data-v64-ocr>Detectar</button><button data-v64-download-credential-png>PNG</button></div></section></main><script>window.LJR_V100={officialTeams:()=>[{name:'Equipo Prueba',category:'Primera Fuerza',cat:1}]};window.LJR_OFFICIAL_DATA={};</script><script type="module" src="/src/v124-player-registration.js"></script></body></html>`;
const server=createServer(async(req,res)=>{try{const path=new URL(req.url,'http://localhost').pathname;if(path==='/fixture.html'){res.setHeader('Content-Type','text/html');res.end(fixture);return}const file=resolve(root,'.'+path);if(!file.startsWith(root+'/')){res.writeHead(403).end();return}res.setHeader('Content-Type',path.endsWith('.js')?'text/javascript':path.endsWith('.css')?'text/css':'text/plain');res.end(await readFile(file))}catch{res.writeHead(404).end()}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']}: {})});
try{
  const page=await browser.newPage({viewport:{width:393,height:852}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/fixture.html#/credentialBuilder`);
  await page.waitForSelector('[data-capture-panel]');
  // Use synthetic test CURPs with valid checksums.
  const curp=await page.evaluate(()=>{const prefix='GAFJ900101HGTRRR0',alphabet='0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';return prefix+((10-[...prefix].reduce((s,c,i)=>s+alphabet.indexOf(c)*(18-i),0)%10)%10)});
  await page.locator('[data-v64-cred-name]').fill('Juan Franco Rosas');await page.locator('[data-v64-cred-team]').selectOption({label:'Equipo Prueba'});
  await page.locator('[data-v64-cred-curp]').fill(curp);await page.locator('[data-v100-dob]').fill('1990-01-01');
  const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a7+QAAAAASUVORK5CYII=','base64');
  await page.locator('[data-v64-photo]').setInputFiles({name:'juan.png',mimeType:'image/png',buffer:png});
  const record=await page.evaluate(()=>window.LJR_PLAYER_REGISTRY.save());assert.ok(record?.id);assert.equal(record.hasPlayerPhoto,true);
  await page.reload();await page.waitForSelector('[data-capture-panel]');
  await page.evaluate(()=>window.LJR_PLAYER_REGISTRY.load(window.LJR_PLAYER_REGISTRY.records()[0]));
  await page.waitForFunction(()=>document.querySelector('[data-v64-photo]').files.length===1);
  assert.equal(await page.locator('[data-v64-photo]').evaluate(el=>el.files[0].name),'juan.png');
  await page.locator('[data-v64-photo]').setInputFiles({name:'updated.png',mimeType:'image/png',buffer:png});
  assert.equal(await page.locator('[data-v64-player-mini-preview] img').count(),1);
  await page.locator('[data-v64-ocr-text]').fill('NOMBRES: CARLOS\nPRIMER APELLIDO: MENDOZA\nSEGUNDO APELLIDO: LOPEZ');
  await page.locator('[data-capture-apply-text]').click();
  assert.equal(await page.locator('[data-v64-cred-name]').inputValue(),'Juan Franco Rosas');
  await page.locator('[data-v124-new]').click();assert.equal(await page.locator('[data-v64-photo]').evaluate(el=>el.files.length),0);
  // Hand-entered delegate list exercises actual roster parser and comparison.
  await page.locator('[data-v126-team-open]').click();await page.locator('[data-v126-team-choice="Equipo Prueba"]').click();
  await page.getByText('Pegar o escribir la lista del delegado',{exact:true}).click();
  await page.locator('[data-capture-roster-text]').fill('Juan Franco Rosas\nJosé Luis Pérez\nCarlos Mendoza López');
  await page.locator('[data-capture-roster-analyse]').evaluate(el=>el.click());
  const detected=await page.locator('[data-v172-review-row]').count();assert.equal(detected,3);
  assert.equal(await page.locator('[data-v126-apply]').isDisabled(),true);
  // Load without media must clear the previous record's picture immediately.
  await page.evaluate(()=>window.LJR_PLAYER_REGISTRY.load({id:'no-photo',name:'Otro Jugador',team:'Equipo Prueba',category:'Primera Fuerza'}));
  assert.equal(await page.locator('[data-v64-photo]').evaluate(el=>el.files.length),0);
  assert.equal(await page.locator('[data-v126-file]').getAttribute('multiple'),'');
  assert.equal(await page.locator('[data-capture-panel]').evaluate(el=>el.getBoundingClientRect().right<=innerWidth),true);
  assert.deepEqual(errors,[]);
  console.log('PASS: photo persistence, record isolation, delegate list, pending review, mobile panel');
}finally{await browser.close();await new Promise(r=>server.close(r))}
