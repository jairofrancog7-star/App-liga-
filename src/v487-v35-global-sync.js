/* V494 — sincronización oficial global de TODAS las categorías. */
(function(){
'use strict';
if(window.__LJR_V494_OFFICIAL_ALL__)return;
window.__LJR_V494_OFFICIAL_ALL__=true;
const BUILD='20261001-v494-official-site-all-pages';
const DATA='./data/official-live.json?v='+BUILD;
let latest=null,loading=null;
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9]+/g,' ').trim();
function logoValue(v){
 if(typeof v==='string')return v;
 if(v?.source)return v.source;
 if(v?.app)return v.app;
    if(v?.local)return 'https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/'+String(v.local).replace(/^\.\//,'');
 return '';
}
function logoFor(data,name){
 const hit=Object.entries(data?.team_logos||{}).find(([k])=>norm(k)===norm(name));
 return hit?logoValue(hit[1]):'';
}
function newer(a,b){
 if(!a)return b||null;if(!b)return a;
 const ta=Date.parse(a.captured_at_utc||'')||0,tb=Date.parse(b.captured_at_utc||'')||0;
 return tb>=ta?b:a;
}
function patchApi(){
 const api=window.LJR_OFFICIAL_API;
 if(api&&!api.__v494_all){
  const oldLogo=api.getLogo?.bind(api);
  api.getData=()=>latest||window.LJR_OFFICIAL_DATA||{};
  api.getCategory=id=>api.getData()?.categories?.[String(id)]||null;
  api.getLogo=name=>logoFor(api.getData(),name)||(oldLogo?oldLogo(name):'');
  api.__v494_all=true;
 }
 const reg=window.LJR_TEAM_LOGOS;
 if(reg&&!reg.__v494_all){
  const old=reg.get?.bind(reg);
  reg.get=name=>logoFor(latest||window.LJR_OFFICIAL_DATA,name)||(old?old(name):'');
  reg.__v494_all=true;
 }
}
function apply(data){
 if(data?.categories)latest=newer(latest||window.LJR_OFFICIAL_DATA,data);
 if(latest?.categories)window.LJR_OFFICIAL_DATA=latest;
 patchApi();
 const detail={build:BUILD,captured_at_utc:latest?.captured_at_utc||''};
 window.dispatchEvent(new CustomEvent('ljr:official-data',{detail}));
 window.dispatchEvent(new CustomEvent('ljr:all-categories-sync',{detail}));
}
async function refresh(){
 if(loading)return loading;
 loading=(async()=>{
  try{
   const r=await fetch(DATA+'&ts='+Date.now(),{cache:'no-store'});
   if(r.ok){const d=await r.json();apply(d);return d}
  }catch(_){}
  apply(window.LJR_OFFICIAL_DATA||window.LJR_OFFICIAL_API?.getData?.());
  return latest;
 })().finally(()=>{loading=null});
 return loading;
}
function start(){
 apply(window.LJR_OFFICIAL_DATA||window.LJR_OFFICIAL_API?.getData?.());
 refresh();
 [450,1300,3200].forEach(ms=>setTimeout(()=>{patchApi();refresh()},ms));
 window.addEventListener('hashchange',()=>setTimeout(()=>apply(latest||window.LJR_OFFICIAL_DATA),50));
}
window.LJR_V494_OFFICIAL={refresh,getData:()=>latest||window.LJR_OFFICIAL_DATA||null,build:BUILD};
window.LJR_V493_OFFICIAL=window.LJR_V494_OFFICIAL;
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();