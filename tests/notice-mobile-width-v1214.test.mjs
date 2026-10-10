import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const base=resolve(import.meta.dirname,'..');
const read=path=>readFileSync(resolve(base,path),'utf8');

test('Ajuste de ancho móvil solo se aplica a Centro de avisos',()=>{
  const css=read('src/v1214-notice-mobile-width.css');
  assert.equal(css,read('demo/src/v1214-notice-mobile-width.css'));
  assert.match(css,/@media\s*\(max-width:\s*539px\)/);
  assert.match(css,/\.v60-tool-page\.v63-alerts-page/);
  assert.match(css,/\.v63-alerts-page \.v713-auto\[data-v713-auto\]/);
  assert.match(css,/padding-left:\s*9px\s*!important/);
  assert.match(css,/padding-right:\s*9px\s*!important/);
  assert.match(css,/\.v1210-review/);
  assert.match(css,/\.v1210-preview/);
  assert.doesNotMatch(css,/#[0-9a-f]{3,8}\b/i,'el parche conserva los colores existentes');
});

test('Las dos páginas cargan el CSS sin modificar los scripts ni el contenido',()=>{
  for(const path of ['index.html','demo/index.html']){
    const html=read(path);
    assert.match(html,/src\/v1214-notice-mobile-width\.css\?v=20261010-v1214/);
    assert.ok(html.indexOf('v1214-notice-mobile-width.css')<html.indexOf('</head>'));
    assert.match(html,/src\/v1211-notice-recurrence\.js/);
  }
});
