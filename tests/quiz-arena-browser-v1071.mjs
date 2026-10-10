import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {mkdirSync} from 'node:fs';

mkdirSync('quiz-debug',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
let page;
try{
 page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true});
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const notFound=[];page.on('response',r=>{if(r.status()>=400&&notFound.length<35)notFound.push(r.status()+' '+r.url())});
 page.on('console',m=>{if(m.type()==='error')console.log('console:',m.text().slice(0,200))});
 await page.goto('http://127.0.0.1:4173/App-liga-/?refresh=v1071-browser#/quizArena',{waitUntil:'domcontentloaded',timeout:45000});
 await page.waitForSelector('#v612-quiz-portal [data-v531-view="splash"]',{timeout:14000});
 await page.screenshot({path:'quiz-debug/01-splash.png'});
 const before=await page.evaluate(()=>{
   const portal=document.querySelector('#v612-quiz-portal');
   const splash=portal?.querySelector('[data-v531-view="splash"]');
   return {route:document.body.dataset.appRoute,splash:!!splash,hasBackground:splash?getComputedStyle(splash,'::before').backgroundImage.includes('quiz-arena'):false,
   beforeTop:splash?getComputedStyle(splash,'::before').top:null,version:String([...document.styleSheets].map(x=>x.href||'').find(x=>x.includes('quiz'))||'bundled')};
 });
 console.log('splash',JSON.stringify(before));
 assert.equal(before.route,'quizArena');
 assert.ok(before.splash);
 assert.ok(before.hasBackground,'Drive art must be loaded in splash pseudo element');
 assert.equal(before.beforeTop,'0px','top blue must align with lower blue');
 const answers=page.locator('#v612-quiz-portal [data-v531-view="splash"] .v1059-answer');
 assert.equal(await answers.count(),4);
 await answers.nth(0).click({timeout:10000});
 await page.waitForSelector('#v612-quiz-portal [data-v531-view="hub"]',{timeout:6000});
 await page.screenshot({path:'quiz-debug/02-hub.png'});
 const back=page.locator('#v612-quiz-portal [data-v531-view="hub"] [data-v531-quiz-back]');
 assert.ok(await back.isVisible(),'Flecha Volver visible en el Hub');
 await back.click();
 await page.waitForSelector('#v612-quiz-portal [data-v531-view="splash"]',{timeout:5000});
 await page.locator('#v612-quiz-portal [data-v531-view="splash"] .v1059-answer').nth(2).click();
 await page.waitForSelector('#v612-quiz-portal [data-v531-view="hub"]',{timeout:5000});
 await page.locator('#v612-quiz-portal [data-v531-view="hub"] [data-v531-quiz-start]').first().click();
 await page.waitForSelector('#v612-quiz-portal [data-v531-view="countdown"]',{timeout:5000});
 await page.screenshot({path:'quiz-debug/03-countdown.png'});
 assert.equal(await page.locator('[data-quiz-countdown]').innerText(),'3');
 await page.locator('[data-v614-countdown-close]').click();
 await page.waitForSelector('[data-v531-exit-confirm="quiz"]',{timeout:4500});
 await page.screenshot({path:'quiz-debug/04-exit-countdown.png'});
 assert.ok(await page.getByText('Tus cambios no se guardarán.').count()>0);
 await page.getByRole('button',{name:'No, continuar'}).click();
 await page.locator('[data-v614-countdown-skip]').click();
 await page.waitForSelector('#v612-quiz-portal [data-v531-view="game"]',{timeout:5000});
 await page.locator('[data-v531-quiz-close]').click();
 await page.waitForSelector('[data-v531-exit-confirm="quiz"]',{timeout:5000});
 await page.screenshot({path:'quiz-debug/05-exit-game.png'});
 await page.getByRole('button',{name:'Sí, salir'}).click();
 await page.waitForSelector('#v612-quiz-portal [data-v531-view="hub"]',{timeout:5000});
 assert.deepEqual(errors,[],'No JavaScript runtime errors');
 console.log('PASS: A-D -> hub -> X -> hub -> 3/2/1 -> exit sheet -> No -> question -> exit sheet -> Si.');
}catch(e){
 console.error('QUIZ BROWSER TEST FAILURE',String(e));console.log('Runtime JS errors:',JSON.stringify(errors.slice(0,18)));console.log('Failed requests:',JSON.stringify(notFound.slice(0,30)));
 
 try{if(page){console.log('page state',await page.evaluate(()=>({route:location.hash,bodyRoute:document.body?.dataset?.appRoute,portal:document.getElementById('v612-quiz-portal')?.outerHTML?.slice(0,1800),scripts:[...document.scripts].slice(-18).map(x=>x.src||'[inline]'),headText:document.head?.innerHTML?.slice(-700)})));await page.screenshot({path:'quiz-debug/failure.png'})}}catch(err){console.error('screenshot failed',String(err))}
 process.exitCode=1;
}finally{await browser.close()}
