import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const registrySource=fs.readFileSync(new URL('../src/v67-team-logo-registry.js',import.meta.url),'utf8');
function registry(data={team_logos:{}}){
  let boot;
  const window={addEventListener(){}};
  const document={readyState:'loading',body:{},querySelectorAll:()=>[],addEventListener(event,fn){if(event==='DOMContentLoaded')boot=fn}};
  const context=vm.createContext({window,document,fetch:async()=>({ok:false}),MutationObserver:class{observe(){}},requestAnimationFrame:fn=>fn()});
  vm.runInContext(registrySource,context);boot();
  // The real official resolver delegates unknown names to this registry.
  window.LJR_OFFICIAL_API={getData:()=>data,getLogo:name=>window.LJR_TEAM_LOGOS.get(name)};
  return window.LJR_TEAM_LOGOS;
}
test('unknown historical team logos terminate even when official resolver delegates back',()=>{
  const logos=registry();
  for(let i=0;i<100;i++)assert.equal(logos.get('Equipo histórico sin escudo'), '');
  assert.match(logos.get('Juventus'),/juventus\.png$/);
});
test('published logos outside the alias list remain available',()=>{
  const logos=registry({team_logos:{'Club documentado':{local:'assets/teams/club.webp'}}});
  assert.equal(logos.get('Club documentado'),'https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/teams/club.webp');
});
test('single-element DOM selectors are not accidentally used as collections',()=>{
  for(const file of ['v100-additive-functions.js','v105-green-app-bottom.js','v124-player-registration.js','v132-credential-team-picker.js','v168-account-registration-blue.js']){
    const source=fs.readFileSync(new URL('../src/'+file,import.meta.url),'utf8');
    assert.doesNotMatch(source,/(?<!\$)\$\([^()\n]*\)\.(?:forEach|map|filter|find|some)\(/,file);
  }
});
