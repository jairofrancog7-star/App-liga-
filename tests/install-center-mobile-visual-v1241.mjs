/* V1241 – Auditoría visual automatizada del Centro de instalación.
   Ejecutar con Playwright en GitHub Actions tras construir Vite. */
import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const base=process.env.LJR_INSTALL_TEST_URL||'http://127.0.0.1:4173/App-liga-/';
const path='artifacts/install-center-mobile';
await fs.mkdir(path,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--disable-dev-shm-usage']});
let failure=null;
try{
  for(const width of [393,360]){
    const context=await browser.newContext({
      viewport:{width,height:852},
      deviceScaleFactor:1,
      isMobile:true,
      hasTouch:true,
      userAgent:'Mozilla/5.0 (Linux; Android 15; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36',
      locale:'es-MX',
      reducedMotion:'reduce',
    });
    const page=await context.newPage();
    const issues=[];
    page.on('pageerror',err=>issues.push(String(err)));
    try{
      await page.goto(base+'?refresh=v1241-visual#/appInstall',{waitUntil:'domcontentloaded',timeout:60000});
      await page.locator('[data-ljr-install-hub]').first().waitFor({state:'visible',timeout:25000});
      await page.locator('.ljr-install-advisor').first().waitFor({state:'visible',timeout:12000});
      await page.locator('[data-ljr-diagnostic-status]').first().waitFor({state:'visible',timeout:10000});
      await page.waitForTimeout(900);

      const evidence=await page.evaluate(()=>{
        const root=document.querySelector('#screen [data-ljr-install-hub]');
        const modes=[...document.querySelectorAll('#screen [data-ljr-install-hub] [data-ljr-mode]')].map(el=>el.getAttribute('data-ljr-mode'));
        const screen=document.querySelector('#screen');
        const bounds=screen?.getBoundingClientRect();
        const buttons=[...root.querySelectorAll('button')].filter(el=>el.getBoundingClientRect().width>0).length;
        return {
          url:location.href,
          theme:getComputedStyle(screen).backgroundColor,
          viewport:innerWidth,
          scrollWidth:document.documentElement.scrollWidth,
          choices:modes,
          advisor:!!root.querySelector('.ljr-install-advisor'),
          diagnostics:root.querySelector('[data-ljr-diagnostic-status]')?.textContent,
          updateButton:!!root.querySelector('[data-ljr-action="updates"]'),
          buttonCount:buttons,
          screenBounds:bounds?{top:bounds.top,bottom:bounds.bottom,height:bounds.height}:null,
        };
      });
      if(evidence.scrollWidth>width+3)throw new Error('Desbordamiento horizontal: '+JSON.stringify(evidence));
      if(!['pwa','apk','ios','pc'].every(mode=>evidence.choices.includes(mode)))throw new Error('Opciones incompletas: '+JSON.stringify(evidence));
      if(!evidence.diagnostics||!evidence.advisor||!evidence.updateButton)throw new Error('Falta asistente: '+JSON.stringify(evidence));
      if(evidence.theme!=='rgb(6, 6, 95)')throw new Error('El azul de fondo no coincide: '+JSON.stringify(evidence));
      await page.screenshot({path:path+'/android-'+width+'.png',fullPage:true});
      await page.locator('#screen [data-ljr-mode="apk"]').first().click();
      const apk=page.locator('#screen a[data-ljr-action="apk"]').first();
      await apk.waitFor({state:'visible',timeout:7000});
      if(!(await apk.getAttribute('href')).includes('github.com/jairofrancog7-star/App-liga-/releases/download/android-latest/'))throw new Error('Enlace APK incorrecto');
      await page.locator('#screen [data-ljr-mode="pwa"]').first().click();
      await page.locator('#screen [data-ljr-action="diagnose"]').first().click();
      if(!(await page.locator('#screen [data-ljr-diagnostic-status]').first().textContent()))throw new Error('Diagnóstico vacío');
      await fs.writeFile(path+'/evidence-'+width+'.json',JSON.stringify({...evidence,issues},null,2));
      if(issues.length)throw new Error('Errores JavaScript: '+issues.slice(0,3).join(' / '));
      console.log('PASS Android viewport',width,JSON.stringify(evidence));
    }finally{
      await page.screenshot({path:path+'/last-'+width+'.png',fullPage:true}).catch(()=>{});
      await context.close();
    }
  }
}catch(e){failure=e;console.error('FAIL mobile install check:',e?.stack||String(e))}
finally{await browser.close()}
if(failure)process.exitCode=1;
