import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const src=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
test('se cargan las herramientas de edición sin código',()=>{
 const html=src('index.html');
 for(const filename of ['src/v1075-admin-editor-center.js','src/v1075-admin-editor-center.css'])
   assert.ok(html.includes(filename),filename);
});
test('las tres interfaces no contienen errores de sintaxis',()=>{
 for(const filename of ['src/v1075-admin-editor-center.js','src/v713-auto-notice-scheduler.js','src/v1073-news-notice-center.js'])
   assert.doesNotThrow(()=>new Function(src(filename)),filename);
});
test('el editor exige sesión y verificación real en el servicio externo',()=>{
 const code=src('src/v1075-admin-editor-center.js');
 assert.match(code,/await media\(\)\.api\('me'\)/);
 assert.match(code,/if\(!admin\(\)\)throw Error/);
 assert.match(code,/if\(who\.owner!==true\)throw Error/);
 assert.match(code,/if\(saving\|\|!form\.reportValidity\(\)\)return/);
 assert.match(code,/await verified\(\)/);
});
test('programación local no habilitada para usuarios públicos',()=>{
 const schedule=src('src/v713-auto-notice-scheduler.js');
 assert.match(schedule,/if\(!isAdmin\(\)\)return/);
 assert.match(schedule,/if\(!await authorized\(\)\)/);
 assert.match(schedule,/window\.addEventListener\('liga:admin',burst\)/);
 assert.match(schedule,/LOCALES/);
 const feed=src('src/v1073-news-notice-center.js');
 assert.match(feed,/if\(!window\.LJR_MEDIA\?\.admin\)return \[\]/);
});


test('el selector de páginas recuerda la última sección y permite buscar sin salir del sitio',()=>{
 const code=src('src/v1075-admin-editor-center.js');
 assert.match(code,/data-page-search/);
 assert.match(code,/data-page-preview/);
 assert.match(code,/data-page-analyze/);
 assert.match(code,/data-page-copy/);
 assert.match(code,/ljr-editor-last-section-v1/);
 assert.match(code,/select\.options\.length\?SECTIONS/);
});
test('el diagnóstico es de solo lectura y admite IA integrada opcional',()=>{
 const code=src('src/v1075-admin-editor-center.js');
 assert.match(code,/function inspectEditorScreen\(item\)/);
 assert.match(code,/imagenesSinCargar:broken/);
 assert.match(code,/controlesPequenos:small/);
 assert.match(code,/desbordeHorizontal:overflowing/);
 assert.match(code,/API\.availability\(options\)/);
 assert.match(code,/availability!=='available'/);
 assert.match(code,/aiOutput\.textContent=/);
 assert.match(code,/await verified\(\);remember\(\)/);
});
test('la vista renovada mantiene controles accesibles en móvil',()=>{
 const css=src('src/v1075-admin-editor-center.css');
 assert.match(css,/ljr-editor-page-panel/);
 assert.match(css,/ljr-editor-audit-summary/);
 assert.match(css,/@media\(max-width:380px\)/);
});
