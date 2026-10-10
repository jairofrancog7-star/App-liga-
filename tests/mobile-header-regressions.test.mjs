import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source=fs.readFileSync(new URL('../src/v768-scroll-chrome.js',import.meta.url),'utf8');
function classes(){const values=new Set();return {add:x=>values.add(x),remove:x=>values.delete(x),contains:x=>values.has(x),toggle(x,on){on?values.add(x):values.delete(x)}}}
function style(){const values=new Map();return {getPropertyValue:x=>values.get(x)||'',setProperty:(k,v)=>values.set(k,v),removeProperty:k=>{const prev=values.get(k)||'';values.delete(k);return prev}}}
function node(height=0,selector=''){return {matches:selectors=>selectors.split(',').includes(selector),height,hidden:false,display:'block',visibility:'visible',classList:classes(),style:style(),getBoundingClientRect(){return {height:this.height}}}}
function fixture(){
 const body=node(),global=node(88),nav=node(69),headers=new Map(),events=new Map(),frames=[];
 body.dataset={appRoute:'home'};let mobile=true;let resize;
 const scrollEvents=new Map();
 const screen={scrollTop:0,addEventListener:(type,fn)=>scrollEvents.set(type,fn),querySelector:selector=>headers.get(selector)||null};
 const document={readyState:'complete',body,getElementById:id=>id==='screen'?screen:null,querySelector(selector){return selector==='#screen'?screen:selector==='.bottom-nav'?nav:selector==='#app>.topbar'?global:null},querySelectorAll(){return [...headers.values()].filter(h=>h.classList.contains('ljr-scroll-header'))}};
 vm.runInNewContext(source,{document,window:{addEventListener:(type,fn)=>events.set(type,fn)},matchMedia:()=>({matches:mobile}),getComputedStyle:n=>n,requestAnimationFrame:fn=>{frames.push(fn);return frames.length},MutationObserver:class{observe(){}},ResizeObserver:class{constructor(fn){resize=fn}observe(){}disconnect(){}}});
 const flush=()=>{while(frames.length)frames.shift()()};flush();
 return {body,global,nav,headers,flush,scroll(top){screen.scrollTop=top;scrollEvents.get('scroll')();flush()},resize:()=>{resize();flush()},go(route,selector,height=92){body.dataset.appRoute=route;headers.clear();if(selector)headers.set(selector,node(height,selector));events.get('hashchange')();flush()},desktop(){mobile=false;events.get('resize')();flush()}};
}
test('every page bar sets the scroll boundary and disappears cleanly on another route',()=>{
 const f=fixture();assert.equal(f.body.style.getPropertyValue('--v768-head-h'),'88px');
 for(const [route,selector,height] of [['favorites','.v414-ref-head',92],['v4-calendar','.v415-reference-topbar',90],['teams','.v41-head',126],['following','.v28-head',82],['club-store','.v510-store-head',90]]){
   f.go(route,selector,height);assert.equal(f.body.dataset.mobileHeader,'custom',route);assert.equal(f.body.style.getPropertyValue('--v768-head-h'),height+'px',route);assert.ok(f.headers.get(selector).classList.contains('ljr-scroll-header'));
 }
 for(const route of ['stats','safe-data','leagueData']){f.go(route,'.v33-data-head',184);assert.equal(f.body.dataset.mobileHeader,undefined,route+' keeps the restored V33 header system');assert.equal(f.body.style.getPropertyValue('--v768-head-h'),'',route+' must not reserve a second V768 header spacer');}
 f.go('scorers');assert.equal(f.body.dataset.mobileHeader,'global','Scorers now uses the single global topbar');assert.equal(f.body.style.getPropertyValue('--v768-head-h'),'88px','Scorers must not reserve the removed V775 header');
 f.go('home');
 f.go('video','.v408-tv-topbar',80);assert.equal(f.body.dataset.mobileHeader,'global','A dialog bar must not replace the page bar');assert.equal(f.body.style.getPropertyValue('--v768-head-h'),'88px');
 f.global.visibility='hidden';f.resize();assert.equal(f.body.style.getPropertyValue('--v768-head-h'),'0px','Hidden global bars reserve no space');
});
test('Fantasy and About keep controls over artwork without a second header spacer',()=>{
 const f=fixture();
 for(const [route,selector] of [['fantasy','.v22-fantasy-master'],['safe-about','.v33-about-tools']]){
  f.go(route,selector,700);assert.equal(f.body.dataset.mobileHeader,'overlay');assert.equal(f.body.style.getPropertyValue('--v768-head-h'),'0px');assert.equal(f.headers.get(selector).classList.contains('ljr-scroll-header'),false);
 }
 f.go('home');assert.equal(f.body.dataset.mobileHeader,'global');assert.equal(f.body.style.getPropertyValue('--v768-head-h'),'88px');
});
test('bottom navigation visibility and desktop resize update the usable area',()=>{
 const f=fixture();assert.equal(f.body.style.getPropertyValue('--v774-nav-h'),'69px');
 f.nav.display='none';f.resize();assert.equal(f.body.style.getPropertyValue('--v774-nav-h'),'0px');
 f.nav.display='grid';f.nav.height=80;f.resize();assert.equal(f.body.style.getPropertyValue('--v774-nav-h'),'80px');
 f.go('favorites','.v414-ref-head');f.desktop();assert.equal(f.body.dataset.mobileLayout,undefined);assert.equal(f.body.dataset.mobileHeader,undefined);assert.equal(f.body.classList.contains('v768-scroll-root'),false);assert.equal(f.headers.get('.v414-ref-head').classList.contains('ljr-scroll-header'),false);
});
test('statistics collapse follows the page scroll and adds no second header spacer',()=>{
 const text=fs.readFileSync(new URL('../src/v33-data-statistics-reference.js',import.meta.url),'utf8');
 const fn=text.slice(text.indexOf('function applyHeaderScroll(){'),text.indexOf('let tick=0;'));
 const body=node();body.classList.add('v768-scroll-root');const head=node(112),page=node(),title={style:{},querySelector:()=>({style:{}})},screen={scrollTop:165};head.querySelector=()=>title;
 const document={body,documentElement:{scrollTop:0},querySelector:selector=>({'[data-v33-head]':head,'[data-v33-data]':page,'#screen':screen}[selector])};
 vm.runInNewContext(fn+';applyHeaderScroll();',{document,window:{innerWidth:412,scrollY:0},isDataRoute:()=>true});
 assert.equal(head.style.getPropertyValue('--v33-collapse'),'1.0000');assert.equal(head.classList.contains('is-collapsed'),true);assert.equal(page.style.getPropertyValue('padding-top'),'','V33 no debe agregar un segundo espaciador superior');
});


test('scorers no longer renders the removed V775 header',()=>{
 const text=fs.readFileSync(new URL('../src/v28-scorers-drive-reference.js',import.meta.url),'utf8');
 assert.equal(text.includes('<header class="v775-scorers-head">'),false);
 assert.match(text,/const shell='<section class="v28-scorers-page"/);
});


test('Teams hides its controls on the real scroll surface and restores them at the top',()=>{
 const f=fixture();f.go('teams','.v27-teams-head',128);
 f.scroll(90);assert.equal(f.body.classList.contains('v974-teams-compact'),true);
 f.scroll(40);assert.equal(f.body.classList.contains('v974-teams-compact'),true);
 f.scroll(20);assert.equal(f.body.classList.contains('v974-teams-compact'),false);
 f.scroll(90);f.go('following','.v28-head',82);
 assert.equal(f.body.classList.contains('v974-teams-compact'),false,'other routes restore their own header');
});


test('statistics header shrinks by the actual scroll distance until its compact height',()=>{
 const text=fs.readFileSync(new URL('../src/v33-data-statistics-reference.js',import.meta.url),'utf8');
 const fn=text.slice(text.indexOf('function applyHeaderScroll(){'),text.indexOf('let tick=0;'));
 const head=node(),page=node(),title={style:{},querySelector:()=>({style:{}})},screen={scrollTop:41.2};head.querySelector=()=>title;
 const document={body:{scrollTop:0},documentElement:{scrollTop:0},querySelector:s=>({'[data-v33-head]':head,'[data-v33-data]':page,'#screen':screen}[s])};
 vm.runInNewContext(fn+';applyHeaderScroll();',{document,window:{innerWidth:412,scrollY:0},isDataRoute:()=>true});
 assert.ok(Math.abs(parseFloat(head.style.getPropertyValue('--v33-head-h'))-(412*.564-41.2))<.11,'header and content move together, keeping the reference gap below the white line');
});
