/* V501 — Simulador de resultados: referencia azul con clasificación, cuadro y controles de marcador. */
(function(){
'use strict';
if(window.__LJR_V501_SIMULATOR__)return;
window.__LJR_V501_SIMULATOR__=true;
window.LJR_SIMULATOR_V502={version:'510'};

const CAT_NAMES={'3':'Primera Fuerza','5':'Intermedia','4':'Segunda Fuerza','2':'Veteranos 35+','1':'Veteranos 50+'};
const VIEW_KEY='v501-simulator-view';
let rendering=false,timer=0;

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
function bracketTeam(t){
 if(!t)return '<div class="v501-br-team empty"><span>—</span></div>';
 return '<div class="v501-br-team"><small>'+t.pos+'</small>'+crest(t.name,'bracket')+'<b>'+esc(shortName(t.name))+'</b><i>○</i></div>';
}
function bracketView(){
 const rows=simulatedStandings(),get=n=>rows[n-1]||null;
 const pairs=[[5,12],[6,11],[7,10],[8,9]];
 const direct=[1,2,3,4];
 return '<section class="v501-board v501-bracket">'+
   '<p class="v501-br-note">Cruces hipotéticos según la clasificación simulada</p>'+
   '<div class="v501-br-rule"></div>'+
   '<div class="v501-br-head"><span>PLAY-OFF</span><span>OCTAVOS DE FINAL</span></div>'+
   '<div class="v501-br-grid">'+
     '<div class="v501-br-left">'+pairs.map((p,i)=>
       '<div class="v501-br-pair">'+bracketTeam(get(p[0]))+bracketTeam(get(p[1]))+'<span class="v501-connector"></span></div>'
     ).join('')+'</div>'+
     '<div class="v501-br-right">'+direct.map((seed,i)=>
       '<div class="v501-br-octavo"><div class="v501-winner"><span>⬡</span><b>Ganador del play-off</b></div>'+bracketTeam(get(seed))+'<span class="v501-nextline"></span></div>'
     ).join('')+'</div>'+
   '</div>'+
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
 const sig=[catId(),view(),localStorage.getItem('v501-sim-journey:'+catId())||'',localStorage.getItem(simKey())||'',db()?.captured_at_utc||''].join('|');
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