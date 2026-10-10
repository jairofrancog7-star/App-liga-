import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const base = process.env.QUIZ_TEST_URL || 'http://127.0.0.1:4173/App-liga-/?_e2e=v1071#/quizArena';
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
const errors = [];
page.on('pageerror', e=>errors.push(String(e).slice(0,200)));
page.on('console', m=>{if(m.type()==='error')errors.push('console: '+m.text().slice(0,200))});
let step = 'navegar';
try{
  await page.goto(base, {waitUntil:'domcontentloaded',timeout:60000});
  step = 'portada A-D';
  await page.locator('#v612-quiz-portal [data-v531-view="splash"] .v1059-answer').first().waitFor({state:'visible',timeout:30000});
  let display=await page.locator('#v612-quiz-portal [data-v531-view="splash"]').evaluate(node=>({
    bg:getComputedStyle(node,'::before').backgroundImage,
    sizes:node.getBoundingClientRect().toJSON()
  }));
  if(!display.bg.includes('quiz-arena-drive-reference'))throw new Error('No se aplicó la portada original: '+display.bg);
  step = 'A abre segunda pantalla';
  await page.locator('#v612-quiz-portal .v1059-answer').first().click();
  await page.locator('#v612-quiz-portal [data-v531-view="hub"] .v1057-quiz-head').waitFor({state:'visible',timeout:15000});
  step = 'X vuelve a inicio';
  await page.locator('#v612-quiz-portal [data-v1070-quiz-hub-close]').click();
  await page.locator('#v612-quiz-portal [data-v531-view="splash"]').waitFor({state:'visible',timeout:15000});
  step = 'B vuelve a abrir portada';
  await page.locator('#v612-quiz-portal .v1059-answer').nth(1).click();
  await page.locator('#v612-quiz-portal [data-v531-view="hub"]').waitFor({state:'visible',timeout:15000});
  step = 'Generar quiz inicia 3-2-1';
  await page.locator('#v612-quiz-portal [data-v531-view="hub"] [data-v531-quiz-start]').first().click();
  await page.locator('#v612-quiz-portal [data-v531-view="countdown"]').waitFor({state:'visible',timeout:15000});
  step = 'X abre confirmar salida';
  await page.locator('#v612-quiz-portal [data-v614-countdown-close]').click();
  await page.locator('#v612-quiz-portal [data-v531-exit-confirm="quiz"]').waitFor({state:'visible',timeout:10000});
  if(!await page.getByText('Tus cambios no se guardarán.').count())throw new Error('Falta texto de salida');
  step = 'No continuar regresa a quiz';
  await page.locator('#v612-quiz-portal [data-v531-exit-cancel="quiz"]').last().click();
  await page.locator('#v612-quiz-portal [data-v531-view="countdown"], #v612-quiz-portal [data-v531-view="game"]').first().waitFor({state:'visible',timeout:15000});
  step = 'la partida abre preguntas';
  const skip=page.locator('#v612-quiz-portal [data-v614-countdown-skip]');
  if(await skip.count())await skip.click();
  await page.locator('#v612-quiz-portal [data-v531-view="game"]').waitFor({state:'visible',timeout:15000});
  step = 'X en juego permite salir';
  await page.locator('#v612-quiz-portal [data-v531-quiz-close]').click();
  const afterGameX=await page.evaluate(()=>{
    const root=document.querySelector('#v612-quiz-portal');
    const modal=root?.querySelector('[data-v531-exit-confirm="quiz"]');
    return {modalCount:root?.querySelectorAll('[data-v531-exit-confirm="quiz"]').length,
      modalHTML:modal?.outerHTML.slice(0,250),modalStyle:modal?getComputedStyle(modal).display:null,
      closeCount:root?.querySelectorAll('[data-v531-quiz-close]').length,
      gameCount:root?.querySelectorAll('[data-v531-view="game"]').length,
      windowCloseCapture:document.body.dataset.quizGameCloseCaptured||'no',
      bodyClass:document.body.className.slice(0,250)};
  });
  console.log('GAME X DIAGNOSTICS',JSON.stringify(afterGameX));
  await page.locator('#v1074-quiz-exit-sheet [data-v531-exit-confirm="quiz"]').click({timeout:10000});
  await page.locator('#v612-quiz-portal [data-v531-view="hub"]').waitFor({state:'visible',timeout:15000});
  console.log('PASS: splash -> hub -> close -> splash -> hub -> countdown -> cancel dialog -> game -> exit');
  console.log('splash computed backdrop', display.bg.slice(0,160));
  console.log('nonfatal browser messages:', errors.slice(0,8));
} catch(e) {
  mkdirSync('quiz-test-artifacts',{recursive:true});
  await page.screenshot({path:'quiz-test-artifacts/quiz-error.png',fullPage:true}).catch(()=>{});
  console.error('FAIL on step:',step);
  console.error('URL:',page.url());
  console.error('Browser errors:', errors.slice(0,25));
  console.error('Visible portal snippet:', (await page.locator('#v612-quiz-portal').innerText().catch(()=>'' )).slice(0,1200));
  console.error('Quiz runtime diagnostics:',await page.evaluate(()=>({
    build:window.__LJR_V531_GAMES__,route:location.hash,bodyRoute:document.body.dataset.appRoute,
    screen:!!document.querySelector('#screen'),screenChildren:document.querySelector('#screen')?.children.length,
    portal:!!document.querySelector('#v612-quiz-portal'),mainReady:!!window.LJR_APP_ROUTER,
    ready:document.readyState,
    standalone:[...performance.getEntriesByType('resource')].filter(x=>x.name.includes('quiz-arena-independent')).map(x=>({name:x.name,status:x.responseStatus,duration:x.duration})),
    standaloneTag:[...document.scripts].filter(x=>x.src.includes('quiz-arena-independent')).map(x=>x.src)
  })));
  throw e;
} finally {
  await browser.close();
}
