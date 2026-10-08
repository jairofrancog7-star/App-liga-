import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const css=readFileSync(new URL('../src/v933-home-light-fullbleed.css', import.meta.url),'utf8');
const index=readFileSync(new URL('../index.html', import.meta.url),'utf8');

test('el brillo de historias cubre exactamente el viewport, sin margen lateral',()=>{
  assert.match(css,/width:100vw!important/);
  assert.match(css,/margin-left:calc\(50% - 50vw\)!important/);
  assert.match(css,/margin-right:calc\(50% - 50vw\)!important/);
  assert.match(css,/#screen > \.stories::before/);
  assert.match(css,/pointer-events:none!important/);
  assert.match(index,/v933-home-light-fullbleed\.css\?v=20261007-v934-viewport-fullbleed/);
});
test('la modificación solo afecta a la ruta Inicio, conserva el scroll y botones',()=>{
  assert.ok(!css.includes('overflow:hidden!important'));
  assert.ok(!css.includes('.story-ring{'));
  assert.ok(!css.includes('bottom-nav'));
  assert.ok(!css.includes('z-index:214748'));
});
