import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source=fs.readFileSync(new URL('../src/v562-adminfut-access.js',import.meta.url),'utf8');
function runtime() {
 const handlers={}, opened=[], calls=[];
 const location={hash:'#/ligaControl',origin:'https://example.org',pathname:'/App-liga-/'};
 const window={
  LJR_MEDIA:{admin:{owner:true}},
  LJR_V105_OPEN_TOOL(name){opened.push(name);return true},
  LJR_EDITOR_CENTER:{openNotice(){calls.push('compose')},openReview(){calls.push('review')},openPages(){calls.push('pages')},exportBackup(){calls.push('backup')}},
  addEventListener(name,fn){handlers[name]=fn},
  open(){calls.push('external')}
 };
 const document={
  querySelector(){return null},
  body:{appendChild(){}},
  createElement(){return {className:'',textContent:'',remove(){}}}
 };
 const context=vm.createContext({window,document,location,console,
  navigator:{}, setTimeout(){},clearTimeout(){},AbortController});
 vm.runInContext(source,context);
 function click(dataset,{inside=true,disabled=false,hidden=false}={}){
  let prevent=0,stop=0;
  const button={dataset,disabled,hidden,
   closest(selector){return inside&&selector.includes('[data-v563-control]')?{}:null}};
  const target={closest(selector){return selector.startsWith('button[')?button:null}};
  handlers.click({target,preventDefault(){prevent++},stopImmediatePropagation(){stop++}});
  return {prevent,stop};
 }
 return {click,window,opened,calls,location};
}
test('every normal navigation card opens its route even when clicking a nested icon',()=>{
 const r=runtime();
 assert.deepEqual(r.click({v563Route:'players'}),{prevent:1,stop:1});
 assert.equal(r.location.hash,'#/players');
 r.click({v563Route:'scorers'});
 assert.equal(r.location.hash,'#/scorers');
 r.click({v563Action:'positions'});
 assert.equal(r.location.hash,'#/competition');
});
test('legacy V105 tools open from cards and sensitive ones require login',()=>{
 const r=runtime();
 r.click({v563Tool:'calendar-generator'});
 r.click({v563Tool:'sponsors'});
 assert.deepEqual(r.opened,['calendar-generator','sponsors']);
 r.window.LJR_MEDIA.admin=null;
 let logins=0;
 r.window.LJR_MEDIA.login=callback=>{logins++;r.window.LJR_MEDIA.admin={};callback()};
 r.click({v563Tool:'officials'});
 assert.equal(logins,1);
 assert.deepEqual(r.opened,['calendar-generator','sponsors','officials']);
});
test('admin CMS buttons execute existing handlers but never grant public access',()=>{
 const r=runtime();
 r.click({v563Cms:'compose'});
 assert.deepEqual(r.calls,['compose']);
 r.window.LJR_MEDIA.admin=null;
 let logins=0;
 r.window.LJR_MEDIA.login=()=>{logins++};
 r.click({v563Cms:'review'});
 assert.equal(logins,1);
 assert.deepEqual(r.calls,['compose']);
});
test('buttons not in JR Control and disabled cards are not intercepted',()=>{
 const r=runtime();
 assert.deepEqual(r.click({v563Route:'teams'},{inside:false}),{prevent:0,stop:0});
 assert.deepEqual(r.click({v563Route:'teams'},{disabled:true}),{prevent:0,stop:0});
 assert.equal(r.location.hash,'#/ligaControl');
});
