import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const main=readFileSync(new URL('../src/v1160-install-center.js',import.meta.url),'utf8');
const skin=readFileSync(new URL('../src/v1240-install-unified-navy-local.css',import.meta.url),'utf8');
const index=readFileSync(new URL('../index.html',import.meta.url),'utf8');

test('instalador conserva los cuatro métodos y sus acciones originales',()=>{
  for(const option of ["id:'pwa'","id:'apk'","id:'ios'","id:'pc'"])assert.ok(main.includes(option));
  assert.match(main,/if\(action==='prompt'\)/);
  assert.match(main,/if\(action==='apk'\)return/);
  assert.match(main,/if\(action==='copy'\)/);
  assert.match(main,/if\(action==='share'\)/);
});
test('diagnóstico inteligente local funciona sin descargar IA ni enviar datos',()=>{
  assert.ok(main.includes('function assistantMarkup()'));
  assert.ok(main.includes('async function diagnose(root)'));
  assert.ok(main.includes('async function checkUpdates(root)'));
  assert.ok(main.includes("data-ljr-action=\"diagnose\""));
  assert.ok(main.includes("data-ljr-action=\"updates\""));
  assert.ok(main.includes('navigator.serviceWorker.getRegistration(location.href)'));
  assert.ok(main.includes('await reg.update()'));
  assert.ok(!main.includes('LanguageModel.create('));
  assert.ok(!main.includes('navigator.serviceWorker.register('));
});
test('diagnóstico automático respeta cambios de modo, red e instalación',()=>{
  assert.ok(main.includes("window.addEventListener('beforeinstallprompt'"));
  assert.ok(main.includes("window.addEventListener('appinstalled'"));
  assert.ok(main.includes("window.addEventListener('online'"));
  assert.ok(main.includes("window.addEventListener('offline'"));
  assert.match(main,/function draw\(root,mode\)\{[\s\S]*?diagnose\(root\);/);
});
test('tema institucional acotado a sección instalación y cargado al final',()=>{
  assert.ok(index.includes('v1240-install-unified-navy-local.css'));
  assert.ok(index.includes('v1240-local-install-advisor'));
  assert.match(skin,/\[data-app-route="appInstall"\]/);
  assert.match(skin,/#06065f/);
  assert.match(skin,/#0a235c|#0b2265/);
  assert.match(skin,/\.ljr-install-advisor/);
  assert.ok(!skin.includes('body[data-app-route="home"]'));
});
