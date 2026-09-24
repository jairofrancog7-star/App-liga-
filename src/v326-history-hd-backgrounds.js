/* V326 — Historia > Campeones: usa copias HD mejoradas sin borrar fondos originales.
   Los archivos originales permanecen intactos en assets/history/.
   Solo cambia a enhanced-v326 cuando la copia mejorada existe y cargó correctamente. */
(function(){
'use strict';
if(window.__LJR_V326_HISTORY_HD__) return;
window.__LJR_V326_HISTORY_HD__=true;

const VERSION='20260924-history-hd-v326';
const cache=new Map();

function isHistory(){
  return /history|safe-about/i.test(location.hash||'');
}

function enhancedUrl(url){
  try{
    const abs=new URL(url,document.baseURI);
    const marker='/assets/history/';
    const i=abs.pathname.indexOf(marker);
    if(i<0) return '';
    const rel=abs.pathname.slice(i+marker.length);
    if(!rel || rel.startsWith('enhanced-v326/')) return '';
    return new URL('./assets/history/enhanced-v326/'+rel,document.baseURI).href+'?v='+VERSION;
  }catch(_){
    return '';
  }
}

function preload(url){
  if(!url) return Promise.resolve(false);
  if(cache.has(url)) return cache.get(url);
  const p=new Promise(resolve=>{
    const probe=new Image();
    probe.onload=()=>resolve(true);
    probe.onerror=()=>resolve(false);
    probe.src=url;
  });
  cache.set(url,p);
  return p;
}

function extractUrls(bg){
  const out=[];
  String(bg||'').replace(/url\((['"]?)(.*?)\1\)/g,(_,q,u)=>{out.push(u);return _;});
  return out;
}

function replaceLastUrl(bg,newUrl){
  const s=String(bg||'');
  const re=/url\((['"]?)(.*?)\1\)/g;
  const matches=[...s.matchAll(re)];
  if(!matches.length) return s;
  const m=matches[matches.length-1];
  const start=m.index;
  const end=start+m[0].length;
  return s.slice(0,start)+'url("'+newUrl+'")'+s.slice(end);
}

async function upgradeImg(img){
  if(!img?.isConnected) return;
  const original=img.getAttribute('src')||img.currentSrc||'';
  if(!original || img.dataset.v326Hd==='1') return;
  const hd=enhancedUrl(original);
  if(!hd) return;
  if(await preload(hd)){
    // NO se elimina el nodo ni el fondo original; solo se cambia a la copia HD.
    img.src=hd;
    img.dataset.v326Hd='1';
    img.style.setProperty('image-rendering','auto','important');
  }
}

async function upgradeBackground(el){
  if(!el?.isConnected || el.dataset.v326Bg==='1') return;
  const computed=getComputedStyle(el).backgroundImage;
  const urls=extractUrls(computed);
  if(!urls.length) return;
  const original=urls[urls.length-1];
  const hd=enhancedUrl(original);
  if(!hd) return;
  if(await preload(hd)){
    el.style.setProperty('background-image',replaceLastUrl(computed,hd),'important');
    el.dataset.v326Bg='1';
  }
}

function cardNodes(card){
  const nodes=[card];
  card.querySelectorAll(
    ':scope > img,'+
    ':scope > .v35-history-bg-photo,'+
    ':scope > .v35-champion-bg-photo,'+
    ':scope > .v120-exact-event-bg,'+
    ':scope > [class*="-bg"],'+
    ':scope > [class*="photo"]'
  ).forEach(n=>nodes.push(n));
  return [...new Set(nodes)];
}

function upgradeCard(card){
  if(!card?.isConnected) return;
  // Solo fondos/direct children; no toca logos ni imágenes dentro del contenido.
  card.querySelectorAll(':scope > img').forEach(upgradeImg);
  cardNodes(card).forEach(upgradeBackground);
}

function patch(){
  if(!isHistory()) return;
  document.querySelectorAll('.v35-history-moment,.v35-champion-card,.v115-card').forEach(upgradeCard);
}

let timer=0;
function schedule(ms=0){
  clearTimeout(timer);
  timer=setTimeout(patch,ms);
}

window.addEventListener('hashchange',()=>schedule(30));
document.addEventListener('click',e=>{
  if(e.target.closest('[data-v35-tab],[data-history-tab],button,[data-route]')) schedule(70);
},true);
new MutationObserver(()=>schedule(45))
  .observe(document.querySelector('#screen')||document.body,{childList:true,subtree:true});

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',()=>schedule(80),{once:true});
}else{
  schedule(30);
}
setTimeout(patch,350);
setTimeout(patch,1000);
setTimeout(patch,2200);
})();