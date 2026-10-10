import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('El diagnóstico Android compila y no activa ni envía avisos',()=>{
 const src=read('src/v1230-notice-device-check.js');
 const file=new URL('../src/v1230-notice-device-check.js',import.meta.url).pathname;
 assert.doesNotThrow(()=>execFileSync(process.execPath,['--check',file],{stdio:'pipe'}));
 assert.match(src,/navigator\.serviceWorker\.getRegistration/);
 assert.match(src,/navigator\.serviceWorker/);
 assert.match(src,/getSubscription\(\)/);
 assert.match(src,/LanguageModel/);
 assert.match(src,/\/health\/ready/);
 assert.doesNotMatch(src,/requestPermission\(/);
 assert.doesNotMatch(src,/\.subscribe\(/);
 assert.doesNotMatch(src,/method:\s*['"]POST/);
 assert.doesNotMatch(src,/method:\s*['"]PUT/);

 assert.match(src,/showNotification\('Prueba local/);
 assert.match(src,/Notification\.permission!=='granted'/);
 assert.match(src,/navigator\.serviceWorker\.getRegistration\('\.\/'\)/);
 assert.match(src,/solo se generó en tu teléfono/);

});
test('El formulario nuevo conserva seguridad y el azul de la Liga',()=>{
 const index=read('index.html'),css=read('src/v1230-notice-device-check.css');
 assert.match(index,/src\/v1230-notice-device-check\.js/);
 assert.match(index,/src\/v1230-notice-device-check\.css/);
 assert.match(css,/ljr-editor-compose/);
 const theme=read('src/v1212-notice-compose-enhance.css');
 for(const color of ['#0055A5','#0D47A1','#0A235C'])assert.ok(theme.includes(color));
});
