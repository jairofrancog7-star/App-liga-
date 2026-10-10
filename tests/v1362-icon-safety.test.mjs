import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read = p => readFileSync(new URL('../' + p, import.meta.url), 'utf8');
const icons = read('src/v1361-global-icon-harmony.css');
const index = read('index.html');

test('V1362: iconos multicolor, dimensiones seguras y estilos cargados al final', () => {
  for (const token of ['--ljr-glyph-gold','--ljr-glyph-mint','--ljr-glyph-coral','--ljr-glyph-violet','--ljr-glyph-sky']) {
    assert.ok(icons.includes(token), 'Falta ' + token);
  }
  assert.match(icons, /svg\[data-ljr-icon\]/);
  assert.doesNotMatch(icons, /svg\[viewBox=/, 'No reducir todas las ilustraciones de los botones');
  assert.match(icons, /:not\(\.ljr-admin-tile-danger\)/, 'No recolorear acciones destructivas');
  assert.match(icons, /\.bottom-nav \.nav-item/);
  assert.match(icons, /\.ljr-admin-tile-icon svg/);
  assert.match(index, /v1361-global-icon-harmony\.css\?v=20261010-v1362-safe-icon-sizing/);
  assert.ok(index.lastIndexOf('v1361-global-icon-harmony.css') > index.lastIndexOf('v1350-stats-video-reference.css'),
    'La capa de iconos debe cargar al final para respetar su prioridad');
});
test('V1362: Quiz Arena prueba la flecha visible; mantiene la X redundante oculta', () => {
  const css = read('src/v1360-mobile-visual-fixes.css');
  assert.match(css, /\.v1057-quiz-head>\.v1070-hub-close\{\s*display:none!important/);
  for (const file of ['tests/quiz-browser-v1071.mjs','tests/quiz-arena-browser-v1071.mjs']) {
    const source=read(file);
    assert.match(source, /data-v531-quiz-back/);
    assert.doesNotMatch(source, /locator\([^\n]*data-v1070-quiz-hub-close/);
  }
});
