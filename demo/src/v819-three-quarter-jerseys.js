/* V819 — 50 unique three-quarter/perspective jerseys shared by Fantasy and Store.
   Includes the 3 newest user uploads first, then the downloaded diagonal set, then
   unique transparent catalog art until the pool is exactly 50. Source-club labels
   are neutralized; Liga team crests are layered over the source badge area. */
(function(){
'use strict';
if(window.__LJR_V819_THREE_QUARTER_POOL__)return;
window.__LJR_V819_THREE_QUARTER_POOL__=true;

const KEY='v813-fantasy-jersey-skin';
const pad=n=>String(n).padStart(2,'0');
const slug=v=>String(v??'kit').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,44)||'kit';
const asset=file=>(/\/demo(?:\/|$)/.test(location.pathname)?'../':'./')+'assets/jerseys/'+file;
const UPLOADED=[
  {key:'angle-white',url:()=>asset('v819-angle-white.webp'),badgeX:59,badgeY:28,badgeW:15,badgeH:14,coverColor:'rgba(232,233,236,.86)',tilt:-9},
  {key:'angle-gold', url:()=>asset('v819-angle-gold.webp'), badgeX:60,badgeY:23,badgeW:15,badgeH:14,coverColor:'rgba(241,239,230,.82)',tilt:-9},
  {key:'angle-red',  url:()=>asset('v819-angle-red.webp'),  badgeX:59,badgeY:22,badgeW:16,badgeH:15,coverColor:'rgba(177,18,33,.95)',tilt:-10}
];

function make(item,index,meta={}){
  const n=index+1;
  const original=String(item?.id||meta.key||('design-'+n));
  const raw=typeof meta.url==='function'?meta.url():String(meta.url||item?.url||'');
  return {
    ...item,
    id:'kit-'+pad(n)+'-v819-'+slug(meta.key||original),
    club:'Diseño 3/4 '+pad(n),
    season:'Liga 2026',
    type:'Perspectiva 3/4',
    label:'Diseño 3/4 '+pad(n)+' · Fantasy + Tienda',
    url:raw,
    removeBg:false,
    userDownloaded:true,
    v819:true,
    sourceOriginalId:original,
    badgeX:Number(meta.badgeX??item?.badgeX??57),
    badgeY:Number(meta.badgeY??item?.badgeY??27),
    badgeW:Number(meta.badgeW??item?.badgeW??16),
    badgeH:Number(meta.badgeH??item?.badgeH??15),
    coverColor:String(meta.coverColor??item?.coverColor??'rgba(18,30,70,.34)'),
    tilt:Number(meta.tilt??item?.tilt??((n%2)?-8:8))
  };
}
function build(api){
  const out=[],seen=new Set();
  const add=(item,meta={})=>{
    if(out.length>=50)return;
    const url=typeof meta.url==='function'?meta.url():String(meta.url||item?.url||'');
    if(!url||seen.has(url))return;
    seen.add(url);out.push(make(item,out.length,meta));
  };
  UPLOADED.forEach(x=>add({},x));
  const direct=Array.isArray(window.LJR_V816_DIAGONAL_JERSEYS)?window.LJR_V816_DIAGONAL_JERSEYS:[];
  direct.forEach((item,i)=>add(item,{
    badgeX:57,badgeY:27,badgeW:16,badgeH:15,
    coverColor:'rgba(18,30,70,.34)',tilt:i%2?-8:8
  }));
  (api.catalog||[]).forEach((item,i)=>add(item,{
    badgeX:57,badgeY:27,badgeW:16,badgeH:15,
    coverColor:'rgba(255,255,255,.10)',tilt:i%2?-7:7
  }));
  return out.slice(0,50);
}
function vars(el,item){
  if(!el||!item)return;
  el.style.setProperty('--v819-badge-x',item.badgeX+'%');
  el.style.setProperty('--v819-badge-y',item.badgeY+'%');
  el.style.setProperty('--v819-badge-w',item.badgeW+'%');
  el.style.setProperty('--v819-badge-h',item.badgeH+'%');
  el.style.setProperty('--v819-cover',item.coverColor);
  el.style.setProperty('--v819-tilt',item.tilt+'deg');
}
let apiRef=null,byId=new Map(),raf=0;
function decorate(){
  if(!apiRef)return;
  document.querySelectorAll('.v819-lineup-kit[data-v819-kit]').forEach(el=>vars(el,byId.get(el.dataset.v819Kit)));
  document.querySelectorAll('.v814-store-library-kit[data-v814-store-kit]').forEach(el=>vars(el,byId.get(el.dataset.v814StoreKit)));
}
function schedule(){cancelAnimationFrame(raf);raf=requestAnimationFrame(decorate)}
function install(){
  const api=window.LJR_FANTASY_JERSEYS;
  if(!api||!Array.isArray(api.catalog)){setTimeout(install,60);return}
  const pool=build(api);
  if(pool.length!==50){setTimeout(install,120);return}
  api.catalog.splice(0,api.catalog.length,...pool);
  window.LJR_V816_DIAGONAL_JERSEYS=pool;
  window.LJR_V819_THREE_QUARTER_JERSEYS=pool;
  apiRef=api;byId=new Map(pool.map(x=>[x.id,x]));
  const current=localStorage.getItem(KEY)||'';
  if(!pool.some(x=>x.id===current))localStorage.setItem(KEY,pool[0].id);
  try{api.apply?.()}catch(_){}
  document.body.dataset.v819JerseyPool='50';
  window.dispatchEvent(new CustomEvent('ljr:jersey-library-ready',{detail:{source:'v819-exact-50-three-quarter',count:50}}));
  new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
  window.addEventListener('hashchange',schedule);
  window.addEventListener('ljr:jersey-library-ready',schedule);
  schedule();setTimeout(schedule,100);setTimeout(schedule,450);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();