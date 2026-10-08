/* V850 — sincronización oficial global para TODAS las categorías y páginas. */
(function(){
'use strict';
if(window.__LJR_V508_OFFICIAL_GLOBAL__)return;window.__LJR_V508_OFFICIAL_GLOBAL__=true;
const BUILD='20261007-v930-official-stats-five-cats',DATA='./data/official-live.json?v='+BUILD;let source=null,originalSource=null,loading=null;
const nativeFetch=window.fetch.bind(window),norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9]+/g,' ').trim(),clone=v=>v==null?v:JSON.parse(JSON.stringify(v));
window.fetch=function(input,init){try{const u=typeof input==='string'?input:(input?.url||'');if(/data\/official-live\.json/i.test(u))return nativeFetch(DATA,{...(init||{}),cache:'no-store'})}catch(_){}return nativeFetch(input,init)};
function cat(){return source?.categories?.['3']||null}
function logo(name){const d=source||window.LJR_OFFICIAL_DATA||{},k=Object.keys(d.team_logos||{}).find(x=>norm(x)===norm(name)),v=k?d.team_logos[k]:null;if(typeof v==='string')return v;if(v?.app)return v.app;if(v?.source)return v.source;if(v?.local)return 'https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/'+String(v.local).replace(/^\.\//,'');return''}
const patchedData=new WeakMap();
function patch(d){
 if(!d||!source?.categories)return d;
 if(patchedData.get(d)===source)return d;
 patchedData.set(d,source);
 d.categories=clone(source.categories||{});
 d.team_logos=clone(source.team_logos||{});
 if(source.captured_at_utc)d.captured_at_utc=source.captured_at_utc;
 if(source.verified_at_utc)d.verified_at_utc=source.verified_at_utc;
 if(source.source_page)d.source_page=source.source_page;
 if(source.source_page_veteranos_35)d.source_page_veteranos_35=source.source_page_veteranos_35;
 return d
}
function wrap(){const a=window.LJR_OFFICIAL_API;if(a&&!a.__v508){const gd=a.getData?.bind(a),gc=a.getCategory?.bind(a),gl=a.getLogo?.bind(a);a.getData=()=>patch(gd?gd():window.LJR_OFFICIAL_DATA||clone(source)||{});a.getCategory=id=>a.getData()?.categories?.[String(id)]||(gc?gc(id):null);a.getLogo=n=>logo(n)||(gl?gl(n):'');a.__v508=true}const r=window.LJR_TEAM_LOGOS;if(r&&!r.__v508){const g=r.get?.bind(r);r.get=n=>logo(n)||(g?g(n):'');r.__v508=true}}
function images(root=document){root.querySelectorAll?.('img[alt],img[title]').forEach(i=>{if(i.closest('[data-player-portrait],.v123-avatar,.v123-option-avatar,.v66-player-avatar,.v42-avatar,.v576-player-avatar,.v379-related-avatar,.v562-avatar,.v124-avatar')||i.matches('.v379-player-photo,.v610-generic-player,.v576-player-photo,.v576-hero-player-photo'))return;const s=logo(i.getAttribute('alt')||i.getAttribute('title')||'');if(s&&i.src!==new URL(s,document.baseURI).href){i.src=s;i.style.objectFit='contain'}})}
function quick(){const b=document.querySelector('.v400-stats-fallback'),c=cat();if(!b||!c)return;const rows=c.standings?.[0]?.rows||[];if(!rows.length)return;const top=rows.slice(0,6),l=rows[0];b.innerHTML='<div class="v400-stats-head"><div><small>PRIMERA FUERZA</small><h2>Tabla rápida</h2></div><button type="button" data-v488-table>Ver completa ›</button></div><div class="v400-leader"><img src="'+logo(l[1])+'" alt="'+l[1]+'"><span><small>LÍDER ACTUAL</small><b>'+l[1]+'</b><em>'+l[2]+' PJ · DG '+l[8]+'</em></span><strong>'+l[9]+'<small>PTS</small></strong></div><div class="v400-table"><div class="v400-row head"><span>#</span><span>Equipo</span><span>PJ</span><span>DG</span><span>PTS</span></div>'+top.map((r,i)=>'<button type="button" class="v400-row" data-v488-table><span class="v400-pos">'+(i+1)+'</span><span class="v400-team"><img src="'+logo(r[1])+'" alt=""><b>'+r[1]+'</b></span><span>'+r[2]+'</span><span>'+r[8]+'</span><strong>'+r[9]+'</strong></button>').join('')+'</div><div class="v400-chips"><span><small>EQUIPOS</small><b>'+rows.length+'</b></span><span><small>LÍDER</small><b>'+l[1]+'</b></span><span><small>PUNTOS</small><b>'+l[9]+'</b></span></div>';b.querySelectorAll('[data-v488-table]').forEach(x=>x.onclick=()=>{try{localStorage.setItem('v62-category','3');localStorage.setItem('v12-fixture-cat','3');localStorage.setItem('competitionTab','standings')}catch(_){}location.hash='#/competition'})}
function apply(d){if(d){originalSource=d;source=window.LJR_CMS?.applyOfficialData?.(d)||d;window.LJR_OFFICIAL_DATA=patch(window.LJR_OFFICIAL_DATA||clone(d))}wrap();images();quick();window.dispatchEvent(new CustomEvent('ljr:cat3-global-sync',{detail:{build:BUILD}}));window.dispatchEvent(new CustomEvent('ljr:all-categories-sync',{detail:{build:BUILD,captured_at_utc:source?.captured_at_utc||''}}));window.dispatchEvent(new CustomEvent('ljr:official-data',{detail:{build:BUILD,allCategories:true,captured_at_utc:source?.captured_at_utc||''}}))}
async function refresh(){if(loading)return loading;loading=nativeFetch(DATA,{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null).then(d=>{if(d)apply(d);return d}).finally(()=>loading=null);return loading}
let t=0;function schedule(){clearTimeout(t);t=setTimeout(()=>{wrap();images();quick()},60)}
function start(){refresh();new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});window.addEventListener('hashchange',schedule)}
window.LJR_V508_OFFICIAL={refresh,applyContent:()=>{if(originalSource)apply(originalSource)},getData:()=>source||window.LJR_OFFICIAL_DATA||null,getCategory:id=>(source||window.LJR_OFFICIAL_DATA)?.categories?.[String(id)]||null,logo,build:BUILD};window.LJR_V494_OFFICIAL=window.LJR_V508_OFFICIAL;window.LJR_V493_OFFICIAL=window.LJR_V508_OFFICIAL;window.LJR_V488_CAT3=window.LJR_V508_OFFICIAL;refresh();if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
