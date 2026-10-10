import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const src=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');

test('minuta actions scroll with the modal and are not sticky',()=>{
 const css=src('src/v875-review-corrections.css');
 const actions=css.match(/\.v875-meeting-modal \.v105-actions\{([^}]+)\}/)?.[1]||'';
 assert.match(actions,/position:static!important/);
 assert.doesNotMatch(actions,/position:sticky/);
 assert.match(css,/html body > \.v105-modal\.v875-meeting-modal \.v105-dialog\{[\s\S]*?overflow-y:auto!important/);
});

test('PDF, hero and PNG minute share a real transparent crest',()=>{
 const page=src('src/v875-review-corrections.js');
 const media=src('src/v926-meeting-media.js');
 assert.match(page,/await window\\.LJR_MINUTA_MEDIA\\?\\.transparentLogo\\?\\.\\(\\)/);
 assert.match(page,/liga-logo-oficial-transparente\\.png/);
 assert.match(media,/OFFICIAL_LEAGUE_LOGO=new URL/);
 assert.match(media,/liga-logo-oficial-transparente\\.png/);
 assert.doesNotMatch(media,/ctx\\.putImageData\\(pixels,0,0\\)/);
 assert.match(page,/src="'\\+esc\\(leagueLogo\\)/);
 assert.match(media,/const area=136/);
});

test('minuta PNG export shares actual image or downloads PNG',()=>{
 const page=src('src/v875-review-corrections.js');
 const media=src('src/v926-meeting-media.js');
 const index=src('index.html');
 assert.match(page,/Descargar PNG/);
 assert.match(page,/share\.onclick=onPNG\(share,true\)/);
 assert.match(page,/png\.onclick=onPNG\(png,false\)/);
 assert.match(media,/canvas\.toBlob\(/);
 assert.match(media,/new File\(\[blob\]/);
 assert.match(media,/navigator\.share\(\{title:/);
 assert.match(media,/a\.download=file\.name/);
 assert.match(index,/src="\.\/src\/v926-meeting-media\.js/);
 assert.ok(index.indexOf('src/v926-meeting-media.js')<index.indexOf('src/v875-review-corrections.js'),'media helper must be loaded first');
});
