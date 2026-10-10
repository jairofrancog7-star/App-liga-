import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const index=read('index.html');
const css=read('src/v1175-sponsors-blue-unified.css');
const js=read('src/v1132-sponsors-pro.js');

test('Patrocinadores carga una paleta azul global despues de los estilos previos',()=>{
  const old=index.indexOf('src/v1132-sponsors-pro.css');
  const final=index.indexOf('src/v1175-sponsors-blue-unified.css');
  assert.ok(old>=0&&final>old,'El azul unificado debe tener prioridad');
  assert.equal((index.match(/src\/v1175-sponsors-blue-unified\.css/g)||[]).length,1);
  assert.match(css,/html body \.v105-modal\.v105-sponsors-modal/);
  assert.match(css,/@media screen/);
  assert.match(css,/#0d47a1|#1752b4|#1a438f/i);
});

test('Patrocinadores utiliza azules en tabs, iconos, cifras, botones y formularios',()=>{
  for(const selector of ['.sp-tabs button[aria-selected="true"]','.sp-intro-icon',
    '.sp-metric b','.sp-btn.sp-primary','.sp-graph i','.sp-search svg',
    '.sp-alerts svg','.sp-item-actions button','.sp-art','.sp-qr-inner']){
    assert.ok(css.includes(selector),'Falta estilo azul para '+selector);
  }
  assert.doesNotMatch(css,/#(?:61f2f4|76f5f3|75f4f0|31bde9|27b9e2|65e8f8|55ddf3)/i);
  assert.match(js,/data-sp-action="csv"/);
  assert.match(js,/data-sp-action="backup"/);
  assert.match(js,/data-sp-action="new"/);
});

test('Ajustes visuales no alteran impresiones ni otras pantallas',()=>{
  assert.match(css,/\.v105-modal\.v105-sponsors-modal/);
  assert.doesNotMatch(css,/display:none\s*!important/);
  assert.doesNotMatch(css,/pointer-events:none\s*!important/);
});
