import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const main=read('src/v1207-google-calendar-global.js');
const demo=read('demo/src/v1207-google-calendar-global.js');
const css=read('src/v1214-google-calendar-chooser.css');
const html=read('index.html');
const demoHtml=read('demo/index.html');

test('Google Calendar selector uses the unified compact blue design in app and demo',()=>{
 for(const js of [main,demo]){
  assert.match(js,/className = 'ljr-gcal-dialog'/);
  assert.match(js,/className = 'ljr-gcal-list'/);
  assert.match(js,/className = 'ljr-gcal-event'/);
  assert.match(js,/className = 'ljr-gcal-search'/);
  assert.match(js,/btn\.hidden = !/);
  assert.doesNotMatch(js,/search\.focus\(\)/,'Android keyboard must not hide first card');
 }
 assert.match(css,/flex-direction:column/);
 assert.match(css,/max-height:min\(72dvh,530px\)/);
 assert.match(css,/max-width:420px/);
 assert.match(css,/overflow-y:auto/);
 assert.match(css,/button\.ljr-gcal-event\[hidden\]/);
 assert.match(css,/overflow-wrap:anywhere/);
 // La demo se regenera con Vite: sus CSS quedan dentro de assets, no como src/*.css.
 assert.match(html,/v1214-google-calendar-chooser\.css/);
 assert.ok(html.indexOf('v1214-google-calendar-chooser.css')<html.indexOf('v1207-google-calendar-global.js'));
 assert.match(demoHtml,/assets\/index-[^" ]+\.css/);
 assert.match(demoHtml,/v1207-google-calendar-global\.js/);
});

function fixture(){
 let opened=[],alerts=[],overlay;
 function node(tag){
  const listeners={};
  return {
   tag,children:[],listeners,hidden:false,scrollTop:-1,
   text:'',get textContent(){return this.text+this.children.map(x=>x.textContent).join('')},
   set textContent(v){this.text=String(v)},
   setAttribute(){},
   addEventListener(type,fn){listeners[type]=fn},
   append(...items){this.children.push(...items)},
   appendChild(item){this.children.push(item)},
   click(){opened.push(this)},
   remove(){this.removed=true}
  };
 }
 const body=node('body');
 body.appendChild=(x)=>{body.children.push(x);if(x.className==='ljr-gcal-chooser')overlay=x;};
 const document={body,createElement:node,querySelector:()=>null};
 const window={alert:m=>alerts.push(m)};
 runInNewContext(main,{window,document,URLSearchParams,Date,Intl});
 return {window,body,opened,alerts,get overlay(){return overlay}};
}
test('search filters complete cards and selecting one opens Google without .ics',()=>{
 const x=fixture();
 const events=[
  {title:'GALACTICOS - SAN JOSE FC',iso:'2026-10-11',time:'08:00',venue:'Campo 1'},
  {title:'NAPOLI - HERRERAS FC',iso:'2026-10-11',time:'10:00',venue:'Campo 2'}
 ];
 assert.equal(x.window.LJR_GOOGLE_CALENDAR_GLOBAL.choose(events,'Selecciona el partido'),true);
 const [panel]=x.overlay.children;
 assert.equal(panel.className,'ljr-gcal-dialog');
 const [header,note,search,list]=panel.children;
 assert.equal(search.className,'ljr-gcal-search');
 assert.equal(list.children.length,2);
 assert.equal(list.scrollTop,0);
 assert.equal(list.children[0].className,'ljr-gcal-event');
 assert.equal(list.children[0].children[0].textContent,'GALACTICOS - SAN JOSE FC');
 assert.match(list.children[0].children[1].textContent,/Campo 1/);
 search.value='NAPOLI';
 search.listeners.input();
 assert.equal(list.children[0].hidden,true);
 assert.equal(list.children[1].hidden,false);
 list.children[1].listeners.click();
 assert.equal(x.overlay.removed,true);
 assert.equal(x.opened.length,1);
 assert.match(x.opened[0].href,/^https:\/\/calendar\.google\.com\/calendar\/render\?/);
 assert.equal(new URL(x.opened[0].href).searchParams.get('text'),'NAPOLI - HERRERAS FC');
 assert.equal(x.opened[0].download,undefined,'must not download an ICS');
});
