import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

const workflow=readFileSync(new URL('../src/v1062-permission-workflow.js',import.meta.url),'utf8');
const base=readFileSync(new URL('../src/v635-permission-builder.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../src/v1062-permission-workflow.css',import.meta.url),'utf8');
const index=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const qrLibrary=readFileSync(new URL('../src/vendor/qrcode-generator-mit.js',import.meta.url),'utf8');
function between(source,start,end){
 const a=source.indexOf(start),b=source.indexOf(end,a+start.length);
 assert.ok(a>=0&&b>a,'Required source segments exist: '+start);
 return source.slice(a,b);
}
function qrFixture(){
 const qrcode=vm.runInNewContext(qrLibrary+'; qrcode;');
 const funcs=between(workflow,'function codeUrl(folio){','function hint(message){');
 const context={window:{qrcode},location:{href:'https://example.org/App-liga-/?refresh=v1062#/permissionBuilder'},URL,encodeURIComponent};
 return vm.runInNewContext(funcs+';({codeUrl,matrixSvg,qrHtml,qrSvg})',context);
}

test('QR lleva sólo folio y ruta local, no jugador ni firma',()=>{
 const api=qrFixture();
 const result=api.codeUrl('LJR-P-20261009-120000');
 assert.equal(result,'https://example.org/App-liga-/#/permissionBuilder?verify=LJR-P-20261009-120000');
 const markup=api.matrixSvg('LJR-P-20261009-120000');
 assert.ok(markup.includes('<svg'));
 assert.ok(markup.includes('<path'));
 assert.ok(markup.length>1000);
 assert.ok(!markup.includes('jugador privado'));
 const html=api.qrHtml({folio:'LJR-P-20261009-120000'});
 assert.ok(html.includes('Consulta local'));
 assert.ok(html.includes('data:image/svg+xml'));
 assert.ok(api.qrSvg({folio:'LJR-P-20261009-120000'}).includes('translate(660 842)'));
});
test('registro conserva únicamente campos permitidos; no guarda fotos ni firmas',()=>{
 const code=between(workflow,'const SAFE_FIELDS=','function codeUrl(folio){');
 assert.ok(code.includes('sourceRows()'));
 assert.ok(code.includes('status:'));
 assert.ok(code.includes('MAX=60')===false,'limit is independently declared');
 assert.ok(!between(workflow,'const SAFE_FIELDS=','let initialized=').includes("'signature'"));
 assert.ok(!between(workflow,'const SAFE_FIELDS=','let initialized=').includes("'photo'"));
 assert.ok(workflow.includes("const STORE='ljr-permissions-local-v1062',MAX=60"));
});
test('relleno de jornada utiliza rol publicado y no inventa sede',()=>{
 const input=between(workflow,'function fixtures(){','function recordMarkup(r){');
 assert.ok(input.includes('item.fixtures'));
 assert.ok(input.includes('row?.[2]'));
 assert.ok(input.includes('row?.[6]'));
 assert.ok(input.includes("String(row[7]||'')"));
 assert.ok(input.includes('fixtureDay(row[8])'));
 assert.ok(input.includes('No hay partido próximo publicado'));
 assert.ok(input.includes('upcoming.filter'));
});
test('estado aprobado es anotación local, no aprobación de la liga',()=>{
 assert.ok(workflow.includes('Aprobado · anotación local'));
 assert.ok(workflow.includes('no valida firma ni aprobación oficial'));
 assert.ok(workflow.includes("status==='approved'&&!confirm("));
 assert.ok(workflow.includes("query local")===false);
 assert.ok(workflow.includes('próximos a vencer (3 días)'));
});
test('sin huecos y con firma dibujada; los exportadores conservan QR',()=>{
 assert.match(css,/V1065 — Sin huecos/);
 assert.match(css,/\.v635-preview-empty:not\(\[hidden\]\)/);
 assert.match(css,/min-height:0!important/);
 assert.match(css,/grid-template-columns:32px minmax\(0,1fr\)/);
 assert.match(css,/v1062-tools/);
 assert.match(css,/v1062-sign-panel/);
 assert.ok(base.includes('LJR_PERMISSION_WORKFLOW?.qrHtml?.(p)'));
 assert.ok(base.includes('LJR_PERMISSION_WORKFLOW?.qrSvg?.(p)'));
 assert.ok(base.includes('LJR_PERMISSION_WORKFLOW?.onGenerated?.(p)'));
 assert.ok(base.includes('showStored(saved)'));
 assert.ok(base.includes('setSignature(data)'));
 assert.ok(index.includes('src/vendor/qrcode-generator-mit.js'));
 assert.ok(index.includes('src/v1062-permission-workflow.js'));
 assert.ok(index.includes('src/v1062-permission-workflow.css'));
});
