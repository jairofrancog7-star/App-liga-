import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');

test('el estudio visual se carga solo desde la app principal sin bibliotecas externas',()=>{
 const html=read('index.html');
 assert.match(html,/src\/v1225-editor-visual-studio\.js/);
 assert.match(html,/src\/v1225-editor-visual-studio\.css/);
 const code=read('src/v1225-editor-visual-studio.js');
 assert.doesNotThrow(()=>new Function(code));
 assert.doesNotMatch(code,/unpkg|cdn\.jsdelivr|<iframe|import\(/);
});
test('no convierte cambios de vista previa en publicaciones oficiales ni evita verificar permisos',()=>{
 const code=read('src/v1225-editor-visual-studio.js');
 assert.match(code,/window\.LJR_MEDIA\.api\('me'\)/);
 assert.match(code,/!result\?\.admin/);
 assert.match(code,/window\.LJR_MEDIA\?\.admin/);
 assert.doesNotMatch(code,/method:\s*['"](?:PUT|POST|DELETE)['"]/);
 assert.match(code,/sessionStorage\.setItem\(KEY/);
 assert.match(code,/sessionStorage\.getItem\(KEY/);
 assert.match(code,/function cleanup\(\)/);
 assert.match(code,/revert\(\);selected/);
});
test('las herramientas de edición incluyen historial, selección y recomendaciones locales',()=>{
 const code=read('src/v1225-editor-visual-studio.js');
 for(const marker of ['data-studio-undo','data-studio-redo','data-studio-reset','data-studio-restore','data-studio-auto','data-studio-img'])
  assert.ok(code.includes(marker),marker);
 assert.match(code,/scope\.addEventListener\('click',pick,true\)/);
 assert.match(code,/event\.preventDefault\(\);event\.stopPropagation\(\)/);
 assert.match(code,/history=history\.slice\(0,position\)/);
 assert.match(code,/history\.length>=40/);
 assert.match(code,/row\.path\.length>500/);
 assert.match(code,/allowed\.has\(row\.prop\)/);
 const controller=read('src/v1075-admin-editor-center.js');
 assert.match(controller,/LJR_EDITOR_STUDIO\.open\(item\)/);
});
test('es móvil y respeta la reducción de movimiento',()=>{
 const css=read('src/v1225-editor-visual-studio.css');
 assert.match(css,/max-height:min\(65dvh,520px\)/);
 assert.match(css,/@media\(max-width:360px\)/);
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
});