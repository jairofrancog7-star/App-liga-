import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const source=readFileSync(new URL('../src/v51-bottom-nav-icon-lock.js',import.meta.url),'utf8');
const canonical=s=>s.replace(/<([a-z]+)([^>]*?)\s*\/>/gi,'<$1$2></$1>');
test('navigation does not repeatedly replace unchanged SVGs after browser serialization',()=>{
 const frames=[];let changes=0,observer;
 const icon={dataset:{},get innerHTML(){return this.markup||''},set innerHTML(s){this.markup=canonical(s);changes++;}};
 const nav={querySelectorAll:()=>[{dataset:{route:'home'},querySelector:()=>icon}]};
 const doc={querySelector:()=>nav,addEventListener(){},createElement:()=>({get innerHTML(){return this.markup||''},set innerHTML(s){this.markup=canonical(s)}})};
 vm.runInNewContext(source,{document:doc,window:{addEventListener(){}},requestAnimationFrame:f=>frames.push(f),setTimeout(){},MutationObserver:class{constructor(f){observer=f;}observe(){}}});
 const flush=()=>{while(frames.length)frames.shift()();};flush();assert.equal(changes,1);
 observer();flush();observer();flush();assert.equal(changes,1);
});
test('unsupported icon names preserve their existing accessible markup',()=>{
 const context={window:{}};vm.runInNewContext(readFileSync(new URL('../src/reference-icons.js',import.meta.url),'utf8'),context);
 assert.equal(context.window.LJR_ICONS.svg('constructor'),'');
 const original='<span class="control"><svg viewBox="0 0 24 24"><path d="M0 0"/></svg><b>Equipo</b></span>';
 assert.equal(context.window.LJR_ICONS.decorate(original,'missing-icon'),original);
 const replaced=context.window.LJR_ICONS.decorate(original,'team');
 assert.ok(replaced.startsWith('<span class="control">'));assert.ok(replaced.endsWith('<b>Equipo</b></span>'));assert.ok(replaced.includes('data-ljr-icon="team"'));
});
