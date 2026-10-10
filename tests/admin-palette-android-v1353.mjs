/* V1353: prueba visual aislada. Sólo Chromium móvil; sin credenciales ni APIs. */
import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {chromium} from 'playwright';
const root=resolve(import.meta.dirname,'..');
const out=resolve(root,'artifacts/admin-mobile-v1353');
mkdirSync(out,{recursive:true});
const sheets=['src/v1310-admin-paleta-unificada.css','src/v1335-admin-app-colors.css',
 'src/v1340-admin-mobile-visual-unified.css','src/v1246-content-studio.css'];
const fixture=[
 '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">',
 '<style>html,body{margin:0;width:100%;background:#071338;color:white;font:14px system-ui}',
 '*,*::before,*::after{box-sizing:border-box}main{width:100%;padding:10px;display:grid;gap:12px}',
 '.liga-media-modal{width:100%;display:block}.liga-media-modal>section{width:100%;min-width:0;border:1px solid;border-radius:16px;padding:12px;overflow:hidden}',
 'header{display:flex;justify-content:space-between;gap:8px}h2{font-size:20px;margin:0}.cms-kind-grid,.ljr-admin-action-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}',
 '.cms-kind-grid>button,.ljr-admin-tile{min-height:94px;padding:9px}.ljr-admin-tile-icon{display:grid;place-items:center;height:35px}.ljr-admin-tile-label{display:block}',
 '.ljr-review-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}.ljr-review-stats>div,.ljr-review-card{border:1px solid;padding:9px}',
 'form{display:grid;gap:12px;margin-top:12px}input,select,textarea{box-sizing:border-box;min-width:0;max-width:100%;width:100%;min-height:42px}',
 'button{font:inherit;padding:8px;border:1px solid;border-radius:10px;max-width:100%}.ljr-editor-tools{display:flex;gap:8px}',
 '.v105-dialog,.ljr-studio{padding:12px;border:1px solid;border-radius:12px}</style></head><body><main>',
 '<div class="liga-media-modal"><section id="admin" class="ljr-admin-manage"><header><h2>Administración de la Liga</h2><button data-close>×</button></header>',
 '<div class="ljr-admin-area"><p>Información oficial</p><div class="ljr-admin-action-grid">',
 '<button class="ljr-admin-tile"><span class="ljr-admin-tile-icon">✦</span><span class="ljr-admin-tile-label">Crear aviso</span></button>',
 '<button class="ljr-admin-tile"><span class="ljr-admin-tile-icon">◎</span><span class="ljr-admin-tile-label">Árbitros y oficiales</span></button></div></div></section></div>',
 '<div class="liga-media-modal"><section id="cms" class="ljr-admin-cms"><header><h2>Contenido y datos de la Liga</h2><button data-close>×</button></header>',
 '<div class="cms-kind-grid"><button class="ljr-admin-tile"><span class="ljr-admin-tile-icon">▤</span>',
 '<span class="ljr-admin-tile-label"><strong>Cédulas y documentos</strong><small>Archivos y cédulas</small></span></button>',
 '<button class="ljr-admin-tile"><span class="ljr-admin-tile-icon">◉</span><span class="ljr-admin-tile-label">Tabla de goleo</span></button></div></section></div>',
 '<div class="liga-media-modal"><section id="review" class="ljr-editor-dialog"><header><h2>Revisar avisos</h2><button data-close>×</button></header>',
 '<div class="ljr-review-stats"><div>Todos 0</div><div>Borradores 0</div><div>Publicados 0</div></div>',
 '<div class="ljr-review-card"><strong>Asistente de revisión local</strong><p>Sin enviar ni publicar</p></div>',
 '<form class="ljr-editor-form"><label>Categoría<select id="category"><option>Primera</option><option>Segunda</option></select></label>',
 '<label>Equipo afectado<input id="team" placeholder="Selecciona un equipo"></label></form>',
 '<div class="ljr-editor-tools"><button id="review-button">Revisar ahora</button><button>Redacción local</button></div></section></div>',
 '<div class="liga-media-modal"><section id="content" class="ljr-content-studio"><header><h2>Publicar en la Liga</h2><button data-close>×</button></header>',
 '<div class="cms-design-presets"><button>Historia</button><button>Jornada</button></div>',
 '<label>Foto o video<input type="file"></label><div class="ljr-layout-gallery"><button aria-pressed="true">Diseño oficial</button></div></section></div>',
 '</main><div class="v105-modal v1126-delegate-modal"><div id="delegates" class="v105-dialog"><h3>Delegados</h3><div class="v1126-editor">Representantes por equipo</div></div></div>',
 '<div class="v105-modal v1125-officials-modal"><div id="officials" class="v105-dialog"><h3>Árbitros y oficiales</h3><div class="v1125-editor">Directorio de oficiales</div></div></div>',
 '</body></html>'
].join('');
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
try{
 for(const width of [360,390,412]){
  const context=await browser.newContext({viewport:{width,height:850},isMobile:true,hasTouch:true,deviceScaleFactor:1});
  const page=await context.newPage();
  await page.setContent(fixture);
  for(const sheet of sheets)await page.addStyleTag({path:resolve(root,sheet)});
  const m=await page.evaluate(()=>{
   const read=id=>{const el=document.getElementById(id),style=getComputedStyle(el);
    return {gradient:style.backgroundImage,background:style.backgroundColor,
      overflow:el.scrollWidth-el.clientWidth};};
   return {admin:read('admin'),cms:read('cms'),review:read('review'),content:read('content'),
    delegates:read('delegates'),officials:read('officials'),
    header:getComputedStyle(document.querySelector('#admin>header')).backgroundImage,
    reviewCard:getComputedStyle(document.querySelector('#review .ljr-review-card')).backgroundImage,
    select:getComputedStyle(document.querySelector('#category')).backgroundColor,
    overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,
    outside:[...document.querySelectorAll('button,input,select')].filter(el=>{
      const b=el.getBoundingClientRect();return b.left<-2||b.right>innerWidth+2;
    }).length};
  });
  await page.screenshot({path:resolve(out,'admin-'+width+'.png'),fullPage:true,animations:'disabled'});
  for(const key of ['admin','cms','review','content']){
   assert.ok(m[key].overflow<=3,key+' overflows at '+width+'px: '+JSON.stringify(m[key]));
  }
  assert.ok(m.overflow<=3,'Page overflows at '+width+'px: '+m.overflow);
  assert.equal(m.outside,0,'Controls outside viewport at '+width+'px');
  assert.match(m.admin.gradient,/rgb\(10, 27, 72\)/,'Admin should use single navy palette');
  assert.match(m.review.gradient,/rgb\(10, 27, 72\)/,'Review should use navy palette');
  assert.match(m.header,/rgb\(16, 43, 98\)/,'Header should not use bright blue');
  const reviewColors=[...m.reviewCard.matchAll(/rgb\((\d+), (\d+), (\d+)\)/g)];
  assert.ok(reviewColors.length>=2 && reviewColors.every(x=>Math.max(+x[1],+x[2],+x[3])<=100),
   'Review card should use dark navy shades: '+m.reviewCard);
  assert.match(m.content.gradient,/rgb\(7, 19, 56\)/,'Content studio should use navy');
  assert.match(m.delegates.gradient,/rgb\(13, 37, 87\)/,'Delegates should use navy');
  assert.match(m.officials.gradient,/rgb\(13, 37, 87\)/,'Referees should use navy');
  assert.equal(m.select,'rgb(9, 26, 70)','Selector should use navy field color');
  await page.locator('#category').selectOption({label:'Segunda'});
  assert.equal(await page.locator('#category').inputValue(),'Segunda');
  await page.locator('#team').fill('Boavista FC');
  assert.equal(await page.locator('#team').inputValue(),'Boavista FC');

  console.log('Mobile Chromium '+width+'px: navy backgrounds, touch controls and bounds OK');
  await context.close();
 }
}finally{await browser.close();}
