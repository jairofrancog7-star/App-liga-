/* V501 — Simulador de resultados: referencia azul con clasificación, cuadro y controles de marcador. */
(function(){
'use strict';
if(window.__LJR_V501_SIMULATOR__)return;
window.__LJR_V501_SIMULATOR__=true;
window.LJR_SIMULATOR_V502={version:'513'};

const CAT_NAMES={'3':'Primera Fuerza','5':'Intermedia','4':'Segunda Fuerza','2':'Veteranos 35+','1':'Veteranos 50+'};
const VIEW_KEY='v501-simulator-view';
let rendering=false,timer=0;

function v513EnsureBracketCss(){
 if(document.getElementById('v513-simulator-bracket-critical'))return;
 const s=document.createElement('style');
 s.id='v513-simulator-bracket-critical';
 s.textContent=`
[data-v512-bracket].v12-bracket-reference{
 --br-cyan:#17e4ef;--br-card:#0b227f;--br-line:#aeb7d8;
 width:100%!important;max-width:100%!important;box-sizing:border-box!important;
 margin:0!important;padding:12px 8px 96px!important;overflow:hidden!important;color:#fff!important;
 background:radial-gradient(300px 220px at 75% 8%,rgba(76,132,255,.32),transparent 72%),linear-gradient(180deg,#174eff 0%,#1239d7 100%)!important;
}
[data-v512-bracket] .v12-bracket-stage-tabs{
 display:flex!important;gap:8px!important;width:100%!important;margin:0 0 12px!important;padding:0 4px 8px!important;
 overflow-x:auto!important;overflow-y:hidden!important;scrollbar-width:none!important;box-sizing:border-box!important;
}
[data-v512-bracket] .v12-bracket-stage-tabs::-webkit-scrollbar{display:none!important}
[data-v512-bracket] .v12-bracket-stage-tabs>button{
 appearance:none!important;-webkit-appearance:none!important;flex:0 0 112px!important;width:112px!important;min-width:112px!important;max-width:112px!important;
 height:42px!important;min-height:42px!important;max-height:42px!important;margin:0!important;padding:0 9px!important;
 border:0!important;border-radius:12px!important;background:#111c72!important;color:#f6f7ff!important;
 font:800 12px/1 Inter,Roboto,Arial,sans-serif!important;white-space:nowrap!important;box-shadow:none!important;
}
[data-v512-bracket] .v12-bracket-stage-tabs>button:first-child,
[data-v512-bracket] .v12-bracket-stage-tabs>button:last-child{flex-basis:92px!important;width:92px!important;min-width:92px!important;max-width:92px!important}
[data-v512-bracket] .v12-bracket-stage-tabs>button.active{background:#17e4ef!important;color:#05115d!important}
[data-v512-bracket] .v12-bracket-dates{
 display:grid!important;grid-template-columns:1fr 1fr!important;gap:18px!important;margin:0 6px 10px!important;color:#d7daec!important;
}
[data-v512-bracket] .v12-bracket-dates span{
 position:relative!important;padding-top:9px!important;font:600 9px/1.15 Inter,Roboto,Arial,sans-serif!important;white-space:nowrap!important;
}
[data-v512-bracket] .v12-bracket-dates span:before{
 content:""!important;position:absolute!important;left:0!important;right:6px!important;top:0!important;height:1px!important;background:#5373ea!important;
}
[data-v512-bracket] .v12-bracket-board{display:grid!important;gap:14px!important;padding:0!important}
[data-v512-bracket] .v12-bracket-route{
 position:relative!important;display:grid!important;grid-template-columns:10px minmax(0,1.08fr) 14px minmax(0,.92fr)!important;
 gap:4px!important;min-height:220px!important;
}
[data-v512-bracket] .v12-bracket-side-label{position:relative!important;min-height:100%!important;border-left:2px solid var(--br-line)!important}
[data-v512-bracket] .v12-bracket-route:nth-child(2) .v12-bracket-side-label{border-left-color:var(--br-cyan)!important}
[data-v512-bracket] .v12-bracket-side-label span{display:none!important}
[data-v512-bracket] .v12-bracket-pairs{display:grid!important;grid-template-rows:repeat(2,1fr)!important;gap:8px!important;min-width:0!important}
[data-v512-bracket] .v12-bracket-pair{min-width:0!important;display:grid!important;grid-template-columns:minmax(0,1fr) 7px minmax(0,1fr)!important;gap:2px!important;align-items:center!important}
[data-v512-bracket] .v12-bracket-team{
 position:relative!important;min-width:0!important;width:100%!important;min-height:48px!important;height:48px!important;max-height:48px!important;
 padding:4px 3px 4px 13px!important;display:grid!important;grid-template-columns:22px minmax(0,1fr)!important;align-items:center!important;gap:3px!important;
 border-radius:9px!important;background:linear-gradient(180deg,#0c2587 0%,#091e74 100%)!important;box-sizing:border-box!important;overflow:hidden!important;
}
[data-v512-bracket] .v12-bracket-team img,
[data-v512-bracket] .v12-bracket-fallback{
 display:block!important;width:22px!important;height:22px!important;min-width:22px!important;max-width:22px!important;min-height:22px!important;max-height:22px!important;
 object-fit:contain!important;object-position:center!important;margin:0!important;padding:0!important;border:0!important;
}
[data-v512-bracket] .v12-bracket-fallback{display:grid!important;place-items:center!important;border-radius:50%!important;background:#142f92!important;color:#fff!important;font:900 6px/1 Inter,Arial,sans-serif!important}
[data-v512-bracket] .v12-bracket-team strong{
 min-width:0!important;max-width:100%!important;margin:0!important;color:#fff!important;font:800 7.4px/1.03 Inter,Roboto,Arial,sans-serif!important;
 overflow:hidden!important;text-overflow:ellipsis!important;white-space:normal!important;display:-webkit-box!important;-webkit-line-clamp:2!important;-webkit-box-orient:vertical!important;
}
[data-v512-bracket] .v12-bracket-seed{
 position:absolute!important;left:3px!important;top:50%!important;transform:translateY(-50%)!important;color:#d7dcf6!important;font:700 6px/1 Inter,Arial,sans-serif!important;
}
[data-v512-bracket] .v12-bracket-vs{display:block!important;color:var(--br-cyan)!important;font:900 6px/1 Inter,Arial,sans-serif!important;text-align:center!important;font-style:normal!important}
[data-v512-bracket] .v12-bracket-connectors{position:relative!important;min-height:100%!important}
[data-v512-bracket] .v12-bracket-connectors .c{
 position:absolute!important;right:0!important;width:11px!important;border-top:2px solid var(--br-line)!important;border-bottom:2px solid var(--br-line)!important;border-right:2px solid var(--br-line)!important;border-radius:0 6px 6px 0!important;
}
[data-v512-bracket] .v12-bracket-route:nth-child(2) .v12-bracket-connectors .c{border-color:var(--br-cyan)!important}
[data-v512-bracket] .v12-bracket-connectors .c1{top:30px!important;height:58px!important}
[data-v512-bracket] .v12-bracket-connectors .c2{top:128px!important;height:58px!important}
[data-v512-bracket] .v12-bracket-connectors .c3,[data-v512-bracket] .v12-bracket-connectors .c4{display:none!important}
[data-v512-bracket] .v12-bracket-winners{display:grid!important;grid-template-rows:1fr 1fr!important;gap:10px!important;min-width:0!important;align-items:stretch!important}
[data-v512-bracket] .v12-bracket-winner-block{position:relative!important;display:grid!important;align-content:center!important;gap:5px!important}
[data-v512-bracket] .v12-bracket-winner{
 min-height:48px!important;height:48px!important;padding:0 7px!important;display:flex!important;align-items:center!important;gap:5px!important;
 border-radius:9px!important;background:linear-gradient(180deg,#122a91 0%,#0c227e 100%)!important;box-sizing:border-box!important;
}
[data-v512-bracket] .v12-bracket-winner .shield{width:18px!important;height:18px!important;display:grid!important;place-items:center!important;color:#aeb8de!important;flex:0 0 auto!important}
[data-v512-bracket] .v12-bracket-winner .shield svg{width:18px!important;height:18px!important}
[data-v512-bracket] .v12-bracket-winner strong{color:#eef0ff!important;font:700 7.4px/1.08 Inter,Roboto,Arial,sans-serif!important}
[data-v512-bracket] .v12-bracket-seeded{display:grid!important;grid-template-columns:minmax(0,1fr) 7px minmax(0,1fr)!important;gap:2px!important;align-items:center!important}
[data-v512-bracket] .v12-bracket-team.mini{height:43px!important;min-height:43px!important;max-height:43px!important;padding-left:4px!important;grid-template-columns:19px minmax(0,1fr)!important}
[data-v512-bracket] .v12-bracket-team.mini img,[data-v512-bracket] .v12-bracket-team.mini .v12-bracket-fallback{width:19px!important;height:19px!important;min-width:19px!important;max-width:19px!important;min-height:19px!important;max-height:19px!important}
[data-v512-bracket] .v12-bracket-team.mini .v12-bracket-seed{display:none!important}
[data-v512-bracket] .v12-bracket-team.mini strong{font-size:6.7px!important}
[data-v512-bracket] .v12-bracket-winner-block:after{
 content:""!important;position:absolute!important;right:-7px!important;top:38px!important;width:7px!important;height:43px!important;
 border-top:2px solid var(--br-line)!important;border-bottom:2px solid var(--br-line)!important;border-right:2px solid var(--br-line)!important;border-radius:0 5px 5px 0!important;
}
[data-v512-bracket] .v12-bracket-route:nth-child(2) .v12-bracket-winner-block:after{border-color:var(--br-cyan)!important}

/* etapa final/trofeo */
[data-v512-bracket] .v12-final-reference{display:none!important}
[data-v512-bracket].stage-final .v12-bracket-dates,[data-v512-bracket].stage-final .v12-bracket-board,[data-v512-bracket].stage-final .v12-stage-panels{display:none!important}
[data-v512-bracket].stage-final .v12-final-reference{
 display:block!important;position:relative!important;min-height:590px!important;margin:0 -8px!important;overflow:hidden!important;
 background:radial-gradient(280px 250px at 76% 72%,rgba(25,220,235,.18),transparent 74%),linear-gradient(180deg,#174eff 0%,#1239d7 100%)!important;
}
[data-v512-bracket] .v12-final-top-date{position:absolute!important;top:24px!important;left:18px!important;width:48%!important;color:#b8bfdc!important}
[data-v512-bracket] .v12-final-top-date span{display:block!important;width:100%!important;height:2px!important;background:#5373ea!important;margin-bottom:14px!important}
[data-v512-bracket] .v12-final-top-date b{font:500 15px/1 Inter,Roboto,Arial,sans-serif!important;color:#d3dcff!important}
[data-v512-bracket] .v12-final-match-card{
 position:absolute!important;left:18px!important;bottom:68px!important;width:45%!important;height:130px!important;padding:14px!important;border-radius:14px!important;
 background:linear-gradient(145deg,#0b1675,#080f58)!important;box-sizing:border-box!important;
}
[data-v512-bracket] .v12-final-match-card time{display:block!important;margin-bottom:13px!important;color:#aeb5d5!important;font:500 14px/1 Inter,Arial,sans-serif!important}
[data-v512-bracket] .v12-final-opponent{display:flex!important;align-items:center!important;gap:8px!important;min-height:31px!important}
[data-v512-bracket] .v12-final-shield{width:24px!important;height:24px!important;display:grid!important;place-items:center!important;color:#747da5!important}
[data-v512-bracket] .v12-final-shield svg{width:24px!important;height:24px!important}
[data-v512-bracket] .v12-final-opponent b{color:#fff!important;font:800 13px/1 Inter,Arial,sans-serif!important}
[data-v512-bracket] .v12-final-trophy-wrap{position:absolute!important;right:2%!important;bottom:30px!important;width:48%!important;height:325px!important;display:grid!important;place-items:end center!important;pointer-events:none!important}
[data-v512-bracket] .v12-final-trophy-new,[data-v512-bracket] .v12-final-trophy-new img{width:100%!important;height:100%!important;max-width:220px!important;object-fit:contain!important;object-position:center bottom!important}
[data-v512-bracket].is-stage-ready .v12-final-trophy-wrap{animation:v513TrophyIn .3s ease-out both!important}
@keyframes v513TrophyIn{from{opacity:.35;transform:translateX(12px)}to{opacity:1;transform:translateX(0)}}

/* etapas intermedias: oculta el playoff al cambiar y evita contenido superpuesto */
[data-v512-bracket].stage-octavos>.v12-bracket-board,[data-v512-bracket].stage-cuartos>.v12-bracket-board,[data-v512-bracket].stage-semifinal>.v12-bracket-board{display:none!important}
[data-v512-bracket] .v12-stage-panel{display:none!important}
[data-v512-bracket].stage-octavos .v12-stage-panel-octavos{display:block!important}
[data-v512-bracket].stage-cuartos .v12-stage-panel-cuartos{display:block!important}
[data-v512-bracket].stage-semifinal .v12-stage-panel-semifinal{display:block!important}

/* seguridad contra el bug del logo gigante, aun si la hoja externa llega tarde */
[data-v512-bracket] img{max-width:100%!important}
body:has([data-v501-simulator]) .bottom-nav{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}
`;
 document.head.appendChild(s);
}
function route(){return String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home'}
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function norm(v){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function num(v){const s=String(v??'').trim();return /^-?\d+(?:\.\d+)?$/.test(s)?Number(s):null}
function db(){try{return window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||{}}catch(_){return window.LJR_OFFICIAL_DATA||{}}}
function catId(){
 const d=db(),saved=String(localStorage.getItem('v62-category')||'3');
 if(d?.categories?.[saved])return saved;
 return Object.keys(d?.categories||{}).find(id=>((d.categories[id]?.standings||[])[0]?.rows||[]).length||(d.categories[id]?.fixtures||[]).length)||'3';
}
function cat(){return db()?.categories?.[catId()]||{}}
function catName(){return cat()?.name||CAT_NAMES[catId()]||'Liga Municipal'}
function logoValue(v){
 if(typeof v==='string')return v;
 if(v?.source)return v.source;
 if(v?.local)return 'https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/'+String(v.local).replace(/^\.?\//,'');
 return '';
}
function logoFor(name){
 try{const x=window.LJR_OFFICIAL_API?.getLogo?.(name)||window.LJR_TEAM_LOGOS?.get?.(name)||window.V66_OFFICIAL_DIRECTORY?.logoFor?.(name)||'';if(x)return x}catch(_){}
 const hit=Object.entries(db()?.team_logos||{}).find(([k])=>norm(k)===norm(name));
 return hit?logoValue(hit[1]):'';
}
function initials(name){return String(name||'JR').split(/\s+/).filter(Boolean).slice(0,3).map(x=>x[0]||'').join('').toUpperCase()||'JR'}
function crest(name,cls=''){
 const src=logoFor(name);
 return src?'<span class="v501-crest '+cls+'"><img src="'+esc(src)+'" alt="'+esc(name)+'" loading="lazy" decoding="async"></span>':
 '<span class="v501-crest '+cls+' fallback">'+esc(initials(name))+'</span>';
}
function shortName(name){
 const s=String(name||'').trim();
 return s.length>16?s.split(/\s+/).map((x,i)=>i<2?x:'').filter(Boolean).join(' ').slice(0,16):s;
}
function standings(){
 const rows=(cat()?.standings||[]).flatMap(b=>Array.isArray(b?.rows)?b.rows:[]);
 const seen=new Set(),out=[];
 for(const r of rows){
   if(!Array.isArray(r)||!r[1])continue;
   const key=norm(r[1]);if(!key||seen.has(key))continue;seen.add(key);
   out.push({
     pos:Number(r[0])||out.length+1,name:String(r[1]).trim(),pj:Number(r[2])||0,
     pg:Number(r[3])||0,pe:Number(r[4])||0,pp:Number(r[5])||0,
     gf:Number(r[6])||0,gc:Number(r[7])||0,dg:Number(r[8])||0,pts:Number(r[9])||0
   });
 }
 if(out.length)return out;
 const names=new Set();fixturesAll().forEach(f=>{names.add(f.home);names.add(f.away)});
 return [...names].filter(Boolean).map((name,i)=>({pos:i+1,name,pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,dg:0,pts:0}));
}
function fixturesAll(){
 const out=[];
 (cat()?.fixtures||[]).forEach((block,gi)=>{
   (block?.rows||[]).forEach((r,ri)=>{
     if(!Array.isArray(r)||!r[2]||!r[6])return;
     const h=num(r[3]),a=num(r[5]),j=String(r[1]??block?.title??block?.name??(gi+1)).trim()||String(gi+1);
     out.push({
       id:catId()+':'+gi+':'+ri,
       journey:j,
       home:String(r[2]).trim(),away:String(r[6]).trim(),
       hs:h,as:a,field:String(r[7]||''),date:String(r[8]||''),played:h!==null&&a!==null,
       sort:gi*1000+ri
     });
   });
 });
 return out;
}
function simFixtures(){
 const all=fixturesAll(),future=all.filter(f=>!f.played);
 return future.length?future:all;
}
function journeyList(){
 const fs=simFixtures(),map=new Map();
 fs.forEach(f=>{if(!map.has(f.journey))map.set(f.journey,[]);map.get(f.journey).push(f)});
 return [...map.entries()].sort((a,b)=>{
   const na=Number((a[0].match(/\d+/)||[])[0]),nb=Number((b[0].match(/\d+/)||[])[0]);
   if(Number.isFinite(na)&&Number.isFinite(nb))return na-nb;
   return String(a[0]).localeCompare(String(b[0]),'es');
 }).map(([label,rows])=>({label,rows}));
}
function journeyIndex(){
 const list=journeyList();if(!list.length)return 0;
 const key='v501-sim-journey:'+catId(),saved=localStorage.getItem(key);
 const i=list.findIndex(x=>x.label===saved);return i>=0?i:0;
}
function setJourney(i){
 const list=journeyList();if(!list.length)return;
 const n=(i+list.length)%list.length;
 localStorage.setItem('v501-sim-journey:'+catId(),list[n].label);
 render();
}
function simKey(){return 'v501-sim-results:'+catId()}
function simState(){try{return JSON.parse(localStorage.getItem(simKey())||'{}')||{}}catch(_){return {}}}
function saveSim(s){localStorage.setItem(simKey(),JSON.stringify(s))}
function scoreOf(f,s){
 const x=s[f.id];
 if(!x||!Number.isFinite(Number(x.home))||!Number.isFinite(Number(x.away)))return null;
 return {home:Number(x.home),away:Number(x.away)};
}
function alterScore(id,side,delta){
 const s=simState(),existing=s[id];
 if(!existing&&delta<0)return;
 const x=existing||{home:0,away:0};
 x.home=Math.max(0,Number(x.home)||0);x.away=Math.max(0,Number(x.away)||0);
 x[side]=Math.max(0,x[side]+delta);
 s[id]=x;saveSim(s);render(true);
}
function resetMatch(id){
 const s=simState();delete s[id];saveSim(s);render(true);
}
function clearSimulation(){
 localStorage.removeItem(simKey());render(true);
}
function simulatedStandings(){
 const official=standings();
 const base=official.map(x=>({...x,officialPos:Number(x.pos)||0})),by=new Map(base.map(x=>[norm(x.name),x]));
 const s=simState();
 for(const f of simFixtures()){
   const sc=scoreOf(f,s);if(!sc)continue;
   for(const n of [f.home,f.away])if(!by.has(norm(n))){const x={pos:base.length+1,officialPos:base.length+1,name:n,pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,dg:0,pts:0};base.push(x);by.set(norm(n),x)}
   const h=by.get(norm(f.home)),a=by.get(norm(f.away));
   h.pj++;a.pj++;h.gf+=sc.home;h.gc+=sc.away;a.gf+=sc.away;a.gc+=sc.home;
   if(sc.home>sc.away){h.pg++;a.pp++;h.pts+=3}
   else if(sc.home<sc.away){a.pg++;h.pp++;a.pts+=3}
   else{h.pe++;a.pe++;h.pts++;a.pts++}
 }
 base.forEach(x=>x.dg=x.gf-x.gc);
 base.sort((a,b)=>b.pts-a.pts||b.dg-a.dg||b.gf-a.gf||a.name.localeCompare(b.name,'es'));
 base.forEach((x,i)=>x.pos=i+1);
 return base;
}
function view(){const v=localStorage.getItem(VIEW_KEY)||'standings';return v==='bracket'?'bracket':'standings'}
function setView(v){localStorage.setItem(VIEW_KEY,v==='bracket'?'bracket':'standings');render()}
const STAGE_KEY='v511-simulator-stage';
function bracketStage(){
 const s=localStorage.getItem(STAGE_KEY)||'playoff';
 return ['playoff','octavos','cuartos','semifinal','final'].includes(s)?s:'playoff';
}
function setBracketStage(s){
 const stage=['playoff','octavos','cuartos','semifinal','final'].includes(s)?s:'playoff';
 localStorage.setItem(STAGE_KEY,stage);
 const box=document.querySelector('[data-v512-bracket]');
 if(!box){render();return}
 box.querySelectorAll('[data-v512-stage]').forEach(b=>b.classList.toggle('active',b.dataset.v512Stage===stage));
 box.classList.remove('stage-playoff','stage-octavos','stage-cuartos','stage-semifinal','stage-final','is-stage-changing','is-stage-ready');
 box.classList.add('stage-'+stage,'is-stage-changing');
 requestAnimationFrame(()=>{
   box.classList.remove('is-stage-changing');
   box.classList.add('is-stage-ready');
   const active=box.querySelector('[data-v512-stage].active');
   const strip=active?.parentElement;
   if(active&&strip){
     const target=Math.max(0,active.offsetLeft-(strip.clientWidth-active.offsetWidth)/2);
     strip.scrollTo({left:target,behavior:'smooth'});
   }
 });
 setTimeout(()=>box.classList.remove('is-stage-ready'),430);
}
function simulatedCount(){const s=simState();return simFixtures().filter(f=>scoreOf(f,s)).length}

function svgBack(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5 8 12l7 7M8 12h12"/></svg>'}
function svgShare(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="2.3"/><circle cx="6" cy="12" r="2.3"/><circle cx="18" cy="19" r="2.3"/><path d="m8 11 8-5M8 13l8 5"/></svg>'}
function top(){
 const v=view();
 return '<header class="v501-top">'+
   '<button type="button" class="v501-icon" data-v501-back aria-label="Volver">'+svgBack()+'</button>'+
   '<div class="v501-tabs" role="tablist">'+
     '<button type="button" class="'+(v==='standings'?'active':'')+'" data-v501-view="standings">Clasificación</button>'+
     '<button type="button" class="'+(v==='bracket'?'active':'')+'" data-v501-view="bracket">Cuadro</button>'+
   '</div>'+
   '<button type="button" class="v501-icon" data-v501-share aria-label="Compartir">'+svgShare()+'</button>'+
 '</header>';
}
function trendFor(row){
 const before=Number(row.officialPos)||Number(row.pos)||0,now=Number(row.pos)||0;
 if(now<before)return '<i class="v501-trend up">▲</i>';
 if(now>before)return '<i class="v501-trend down">▼</i>';
 return '<i class="v501-trend same">—</i>';
}
function tableRow(r){
 return '<div class="v501-table-row">'+
   '<span class="v501-pos">'+r.pos+trendFor(r)+'</span>'+
   '<span class="v501-table-team">'+crest(r.name,'stand')+'<b>'+esc(r.name)+'</b></span>'+
   '<strong>'+r.pts+'</strong><span>'+r.dg+'</span><span class="pill">'+r.gf+'</span><span>'+r.gc+'</span><span>'+r.pg+'</span><span>'+r.pj+'</span>'+
 '</div>';
}
function tableView(){
 const rows=simulatedStandings(),n=rows.length;
 const groups=[];
 if(n<=8){
   groups.push({from:1,to:n,label:'DIRECTOS A OCTAVOS'});
 }else{
   groups.push({from:1,to:Math.min(8,n),label:'DIRECTOS A OCTAVOS'});
   if(n>8)groups.push({from:9,to:Math.min(24,n),label:'PLAY-OFFS ELIMINATORIOS (NO CABEZA DE SERIE)'});
   if(n>24)groups.push({from:25,to:n,label:'PLAZAS DE ELIMINACIÓN'});
 }
 return '<section class="v501-board v501-standings">'+
   '<div class="v501-table-head"><span></span><span></span><b>PTOS</b><b>+/-</b><b>GF</b><b>GC</b><b>V</b><b>PJ</b></div>'+
   '<div class="v501-table-body">'+groups.map(g=>
     '<div class="v501-table-group">'+
       '<div class="v501-table-label">'+esc(g.label)+'</div>'+
       rows.filter(r=>r.pos>=g.from&&r.pos<=g.to).map(tableRow).join('')+
     '</div>'
   ).join('')+'</div>'+
 '</section>';
}
function v512Logo(name){
 const src=logoFor(name);
 return src
   ?'<img src="'+esc(src)+'" alt="'+esc(name)+'" loading="eager" decoding="async">'
   :'<span class="v12-bracket-fallback">'+esc(initials(name))+'</span>';
}
function bracketTeam(t,mini=false){
 if(!t){
   return '<div class="v12-bracket-team '+(mini?'mini ':'')+'empty">'+
     '<small class="v12-bracket-seed"></small><span class="v12-bracket-fallback">—</span><strong>—</strong>'+
   '</div>';
 }
 return '<div class="v12-bracket-team '+(mini?'mini':'')+'">'+
   '<small class="v12-bracket-seed">'+esc(t.pos)+'</small>'+
   v512Logo(t.name)+
   '<strong>'+esc(t.name)+'</strong>'+
 '</div>';
}
function v512Pair(a,b){
 return '<div class="v12-bracket-pair">'+
   bracketTeam(a)+
   '<i class="v12-bracket-vs">o</i>'+
   bracketTeam(b)+
 '</div>';
}
function v512SeedPair(a,b){
 return '<div class="v12-bracket-seeded">'+
   bracketTeam(a,true)+
   '<i class="v12-bracket-vs">o</i>'+
   bracketTeam(b,true)+
 '</div>';
}
function v512WinnerBlock(a,b){
 return '<div class="v12-bracket-winner-block">'+
   '<div class="v12-bracket-winner"><span class="shield"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.7 20 5.6v5.7c0 5.1-3.3 8.6-8 10-4.7-1.4-8-4.9-8-10V5.6L12 2.7Z" fill="currentColor"/></svg></span><strong>Ganador del play-off</strong></div>'+
   v512SeedPair(a,b)+
 '</div>';
}
function v512BuildRoutes(rows){
 const get=n=>rows[n-1]||null,n=rows.length;
 const pairSeeds=[];
 if(n>=12) pairSeeds.push([5,12],[6,11],[7,10],[8,9]);
 else{
   let a=5,b=n;
   while(a<b){pairSeeds.push([a,b]);a++;b--}
   if(!pairSeeds.length&&n>=6)pairSeeds.push([5,6]);
 }
 const pairs=pairSeeds.map(p=>[get(p[0]),get(p[1])]).filter(p=>p[0]&&p[1]);
 const leftPairs=[],rightPairs=[];
 pairs.forEach((p,i)=>(i%2?rightPairs:leftPairs).push(p));
 while(leftPairs.length<2&&pairs.length){leftPairs.push(null)}
 while(rightPairs.length<2&&pairs.length>1){rightPairs.push(null)}
 return {
   left:{label:'RUTA PLATEADA',pairs:leftPairs,winners:[[get(1),get(2)],[get(3),get(4)]].filter(p=>p[0]||p[1])},
   right:{label:'RUTA AZUL',pairs:rightPairs,winners:[[get(3),get(4)],[get(1),get(2)]].filter(p=>p[0]||p[1])}
 };
}
function v512BracketRoute(route){
 const safePairs=(route.pairs||[]).length?route.pairs:[null,null];
 const winners=(route.winners||[]).length?route.winners:[[null,null],[null,null]];
 return '<section class="v12-bracket-route">'+
   '<div class="v12-bracket-side-label"><span>'+route.label+'</span></div>'+
   '<div class="v12-bracket-pairs">'+
     safePairs.map(p=>p?v512Pair(p[0],p[1]):v512Pair(null,null)).join('')+
   '</div>'+
   '<div class="v12-bracket-connectors" aria-hidden="true">'+
     '<span class="c c1"></span><span class="c c2"></span><span class="c c3"></span><span class="c c4"></span>'+
   '</div>'+
   '<div class="v12-bracket-winners">'+
     winners.slice(0,2).map(w=>v512WinnerBlock(w[0]||null,w[1]||null)).join('')+
   '</div>'+
 '</section>';
}
function v512UnknownMatch(dateText,legText='Ida'){
 return '<div class="v12-progress-match">'+
   '<time>'+dateText+'</time>'+
   '<small>'+legText+'</small>'+
   '<div class="v12-progress-opponent"><span class="shield"><svg viewBox="0 0 24 24"><path d="M12 2.7 20 5.6v5.7c0 5.1-3.3 8.6-8 10-4.7-1.4-8-4.9-8-10V5.6L12 2.7Z" fill="currentColor"/></svg></span><b>¿?</b></div>'+
   '<div class="v12-progress-opponent"><span class="shield"><svg viewBox="0 0 24 24"><path d="M12 2.7 20 5.6v5.7c0 5.1-3.3 8.6-8 10-4.7-1.4-8-4.9-8-10V5.6L12 2.7Z" fill="currentColor"/></svg></span><b>¿?</b></div>'+
 '</div>';
}
function v512ProgressWinner(pair){
 return '<div class="v12-progress-winner-block">'+
   '<div class="v12-progress-winner"><span class="shield"><svg viewBox="0 0 24 24"><path d="M12 2.7 20 5.6v5.7c0 5.1-3.3 8.6-8 10-4.7-1.4-8-4.9-8-10V5.6L12 2.7Z" fill="currentColor"/></svg></span><strong>Ganador del play-off</strong></div>'+
   '<div class="v12-progress-seeded">'+
     bracketTeam(pair?.[0]||null,true)+
     '<i class="v12-progress-vs">o</i>'+
     bracketTeam(pair?.[1]||null,true)+
   '</div>'+
 '</div>';
}
function v512StagePanels(rows){
 const get=n=>rows[n-1]||null;
 const silver=[[get(1),get(2)],[get(3),get(4)]];
 const blue=[[get(3),get(4)],[get(1),get(2)]];
 return '<div class="v12-stage-panels">'+
   '<section class="v12-stage-panel v12-stage-panel-octavos">'+
     '<div class="v12-progress-dates"><span>9-12 &amp; 17-18 mar</span><span>6-7 &amp; 14-15 abr</span></div>'+
     '<div class="v12-progress-board">'+
       '<section class="v12-progress-route route-silver"><div class="v12-progress-rail"><span>RUTA PLATEADA</span></div><div class="v12-progress-left">'+silver.map(v512ProgressWinner).join('')+'</div><div class="v12-progress-connector" aria-hidden="true"><i></i></div><div class="v12-progress-right">'+v512UnknownMatch('6 - 7 abr')+'</div></section>'+
       '<section class="v12-progress-route route-blue"><div class="v12-progress-rail"><span>RUTA AZUL</span></div><div class="v12-progress-left">'+blue.map(v512ProgressWinner).join('')+'</div><div class="v12-progress-connector" aria-hidden="true"><i></i></div><div class="v12-progress-right">'+v512UnknownMatch('6 - 7 abr')+'</div></section>'+
     '</div>'+
   '</section>'+
   '<section class="v12-stage-panel v12-stage-panel-cuartos">'+
     '<div class="v12-progress-dates"><span>6-7 &amp; 14-15 abr</span><span>27-28 abr &amp; 5-6 may</span></div>'+
     '<div class="v12-progress-board">'+
       '<section class="v12-progress-route route-silver"><div class="v12-progress-rail"><span>RUTA PLATEADA</span></div><div class="v12-progress-left v12-progress-left-matches">'+v512UnknownMatch('6 - 7 abr')+v512UnknownMatch('6 - 7 abr')+'</div><div class="v12-progress-connector" aria-hidden="true"><i></i></div><div class="v12-progress-right">'+v512UnknownMatch('27 - 28 abr')+'</div></section>'+
       '<section class="v12-progress-route route-blue"><div class="v12-progress-rail"><span>RUTA AZUL</span></div><div class="v12-progress-left v12-progress-left-matches">'+v512UnknownMatch('6 - 7 abr')+v512UnknownMatch('6 - 7 abr')+'</div><div class="v12-progress-connector" aria-hidden="true"><i></i></div><div class="v12-progress-right">'+v512UnknownMatch('27 - 28 abr')+'</div></section>'+
     '</div>'+
   '</section>'+
   '<section class="v12-stage-panel v12-stage-panel-semifinal">'+
     '<div class="v12-progress-dates"><span>27-28 abr &amp; 5-6 may</span><span>5 jun</span></div>'+
     '<div class="v12-semifinal-flow">'+
       '<div class="v12-semifinal-source silver"><div class="v12-progress-rail"><span>RUTA PLATEADA</span></div>'+v512UnknownMatch('27 - 28 abr')+'</div>'+
       '<div class="v12-semifinal-source blue"><div class="v12-progress-rail"><span>RUTA AZUL</span></div>'+v512UnknownMatch('27 - 28 abr')+'</div>'+
       '<div class="v12-semifinal-join" aria-hidden="true"></div>'+
       '<div class="v12-semifinal-target">'+v512UnknownMatch('5 jun','')+'</div>'+
     '</div>'+
   '</section>'+
 '</div>';
}
function v512FinalCard(rows){
 const leader=rows[0]||null;
 return '<section class="v12-final-reference" data-v512-final>'+
   '<div class="v12-final-top-date"><span></span><b>5 jun</b></div>'+
   '<div class="v12-final-side-mark" aria-hidden="true"></div>'+
   '<div class="v12-final-match-card">'+
     '<time>5 jun</time>'+
     '<div class="v12-final-opponent"><span class="v12-final-shield"><svg viewBox="0 0 24 24"><path d="M12 2.7 20 5.6v5.7c0 5.1-3.3 8.6-8 10-4.7-1.4-8-4.9-8-10V5.6L12 2.7Z" fill="currentColor"/></svg></span><b>'+esc(leader?shortName(leader.name):'¿?')+'</b></div>'+
     '<div class="v12-final-opponent"><span class="v12-final-shield"><svg viewBox="0 0 24 24"><path d="M12 2.7 20 5.6v5.7c0 5.1-3.3 8.6-8 10-4.7-1.4-8-4.9-8-10V5.6L12 2.7Z" fill="currentColor"/></svg></span><b>¿?</b></div>'+
   '</div>'+
   '<div class="v12-final-trophy-wrap"><div class="v12-final-trophy-new" aria-label="Trofeo de la final"><img src="./final-trophy-drive.png?v=v512" alt="" aria-hidden="true"></div></div>'+
 '</section>';
}
function bracketView(){
 const rows=simulatedStandings(),stage=bracketStage(),routes=v512BuildRoutes(rows);
 v513EnsureBracketCss();
 return '<section class="v501-board v501-bracket v12-bracket-reference stage-'+stage+'" data-v12-bracket data-v512-bracket>'+
   '<div class="v12-bracket-stage-tabs" role="tablist" aria-label="Etapas del cuadro">'+
     [['playoff','Play-off'],['octavos','Octavos de final'],['cuartos','Cuartos de final'],['semifinal','Semifinales'],['final','Final']].map(x=>
       '<button type="button" class="'+(stage===x[0]?'active':'')+'" data-v12-bracket-stage="'+x[0]+'" data-v512-stage="'+x[0]+'">'+x[1]+'</button>'
     ).join('')+
   '</div>'+
   '<div class="v12-bracket-dates"><span>16-19 &amp; 24-25 feb</span><span>9-12 &amp; 17-18 mar</span></div>'+
   '<div class="v12-bracket-board">'+
     v512BracketRoute(routes.left)+
     v512BracketRoute(routes.right)+
   '</div>'+
   v512StagePanels(rows)+
   v512FinalCard(rows)+
 '</section>';
}
function scoreControl(f,side){
 return '<div class="v501-score-control">'+
   '<button type="button" data-v501-score="'+esc(f.id)+'" data-side="'+side+'" data-delta="1" aria-label="Sumar gol">+</button>'+
   '<button type="button" data-v501-score="'+esc(f.id)+'" data-side="'+side+'" data-delta="-1" aria-label="Restar gol">−</button>'+
 '</div>';
}
function scoreCenter(f,score){
 return '<div class="v501-score-center">'+
   '<strong>'+(score?esc(score.home)+' - '+esc(score.away):'−')+'</strong>'+
   (score?'<button type="button" data-v501-reset="'+esc(f.id)+'" aria-label="Borrar resultado de este partido">↻</button>':'')+
 '</div>';
}
function seedTrend(current,official){
 const c=Number(current)||0,o=Number(official)||0;
 if(c<o)return '<i class="up">▲</i>';
 if(c>o)return '<i class="down">▼</i>';
 return '<i>=</i>';
}
function simulatorSheet(){
 const list=journeyList(),idx=journeyIndex(),group=list[idx]||{label:'—',rows:[]},s=simState(),total=simFixtures().length,count=simulatedCount();
 const rank=simulatedStandings(),official=standings();
 const posNow=name=>rank.find(x=>norm(x.name)===norm(name))?.pos||'–';
 const posBefore=name=>official.find(x=>norm(x.name)===norm(name))?.pos||posNow(name);
 return '<section class="v501-sheet">'+
   '<div class="v501-grabber"></div>'+
   '<div class="v501-sheet-head"><div><h2>Simulador de resultados</h2><p>'+count+'/'+total+' partidos simulados</p></div>'+
     (count?'<button type="button" data-v501-clear>Borrar todo</button>':'')+
   '</div>'+
   '<div class="v501-match-list">'+group.rows.map(f=>{
     const sc=scoreOf(f,s),hp=posNow(f.home),ap=posNow(f.away),hb=posBefore(f.home),ab=posBefore(f.away);
     return '<div class="v501-sim-match">'+
       '<span class="v501-seed">#<b>'+hp+'</b>'+seedTrend(hp,hb)+'</span>'+
       '<div class="v501-sim-team home">'+crest(f.home,'sim')+'<b>'+esc(shortName(f.home))+'</b></div>'+
       scoreControl(f,'home')+
       scoreCenter(f,sc)+
       scoreControl(f,'away')+
       '<div class="v501-sim-team away">'+crest(f.away,'sim')+'<b>'+esc(shortName(f.away))+'</b></div>'+
       '<span class="v501-seed right">#<b>'+ap+'</b>'+seedTrend(ap,ab)+'</span>'+
     '</div>';
   }).join('')+'</div>'+
   (list.length?'<div class="v501-journey"><button type="button" data-v501-journey="-1" aria-label="Jornada anterior">‹</button><b>Jornada '+esc(group.label.replace(/^jornada\s*/i,''))+'</b><button type="button" data-v501-journey="1" aria-label="Jornada siguiente">›</button></div>':'')+
 '</section>';
}
function page(){
 return '<section class="v501-simulator" data-v501-simulator>'+
   top()+
   '<div class="v501-category"><small>'+esc(catName())+'</small></div>'+
   (view()==='bracket'?bracketView():tableView())+
   simulatorSheet()+
 '</section>';
}
function mount(){
 if(rendering||route()!=='simulator')return;
 const screen=document.getElementById('screen');if(!screen)return;
 const sig=[catId(),view(),bracketStage(),localStorage.getItem('v501-sim-journey:'+catId())||'',localStorage.getItem(simKey())||'',db()?.captured_at_utc||''].join('|');
 const current=screen.querySelector('[data-v501-simulator]');
 if(current&&current.dataset.sig===sig)return;
 rendering=true;
 try{
   document.body.dataset.appRoute='simulator';
   screen.innerHTML=page();
   const root=screen.querySelector('[data-v501-simulator]');if(root)root.dataset.sig=sig;
 }finally{rendering=false}
}
function render(preserve=false){
 const y=preserve?window.scrollY:null;
 mount();
 if(y!==null)requestAnimationFrame(()=>window.scrollTo({top:y,left:0,behavior:'auto'}));
}
function schedule(ms=20){clearTimeout(timer);timer=setTimeout(mount,ms)}
async function share(){
 const rows=simulatedStandings().slice(0,5);
 const txt='Simulador Liga Juventino Rosas · '+catName()+'\n'+rows.map(r=>r.pos+'. '+r.name+' · '+r.pts+' pts').join('\n');
 try{
   if(navigator.share)await navigator.share({title:'Simulador de resultados',text:txt});
   else if(navigator.clipboard){await navigator.clipboard.writeText(txt)}
 }catch(_){}
}
function click(e){
 if(route()!=='simulator'||!(e.target instanceof Element))return;
 const v=e.target.closest('[data-v501-view]');if(v){e.preventDefault();setView(v.dataset.v501View);return}
 const st=e.target.closest('[data-v512-stage]');if(st){e.preventDefault();e.stopPropagation();setBracketStage(st.dataset.v512Stage);return}
 const score=e.target.closest('[data-v501-score]');if(score){e.preventDefault();e.stopPropagation();alterScore(score.dataset.v501Score,score.dataset.side,Number(score.dataset.delta||0));return}
 const reset=e.target.closest('[data-v501-reset]');if(reset){e.preventDefault();e.stopPropagation();resetMatch(reset.dataset.v501Reset);return}
 if(e.target.closest('[data-v501-clear]')){e.preventDefault();e.stopPropagation();clearSimulation();return}
 const j=e.target.closest('[data-v501-journey]');if(j){e.preventDefault();setJourney(journeyIndex()+Number(j.dataset.v501Journey||0));return}
 if(e.target.closest('[data-v501-back]')){e.preventDefault();location.hash='#/more';return}
 if(e.target.closest('[data-v501-share]')){e.preventDefault();share();return}
}
document.addEventListener('click',click,true);
window.addEventListener('hashchange',()=>schedule(0));
window.addEventListener('ljr:official-data',()=>schedule(20));
document.addEventListener('DOMContentLoaded',()=>schedule(20),{once:true});
const screen=document.getElementById('screen');
if(screen)new MutationObserver(()=>{if(!rendering&&route()==='simulator'&&!screen.querySelector('[data-v501-simulator]'))schedule(25)}).observe(screen,{childList:true,subtree:false});
schedule(20);setTimeout(mount,300);setTimeout(mount,900);
})();