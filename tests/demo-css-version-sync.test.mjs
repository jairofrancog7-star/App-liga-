import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

test('La demo usa las mismas versiones y archivos CSS que producción',()=>{
 const prod=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 const demo=readFileSync(new URL('../demo/index.html',import.meta.url),'utf8');
 const names=['v1211-notice-recurrence.css','v1212-notice-series-cancel.css','v1310-admin-paleta-unificada.css'];
 for(const name of names){
  const source='src/'+name;
  const link=prod.split(/\r?\n/).find(line=>line.includes('href="./'+source+'?v='));
  assert.ok(link,'Falta versión oficial de '+name);
  const href=link.match(/href="([^"]+)"/)?.[1];
  assert.ok(demo.includes('href="'+href+'"'),'La demo usa otra versión de '+name);
  assert.equal(readFileSync(new URL('../'+source,import.meta.url),'utf8'),
    readFileSync(new URL('../demo/'+source,import.meta.url),'utf8'),
    'La demo tiene un CSS diferente de '+name);
 }
});
