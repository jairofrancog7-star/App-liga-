/* V501 — Simulador de resultados: referencia azul con clasificación, cuadro y controles de marcador. */
(function(){
'use strict';
if(window.__LJR_V501_SIMULATOR__)return;
window.__LJR_V501_SIMULATOR__=true;
window.LJR_SIMULATOR_V502={version:'1083'};

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
 if(v?.app)return v.app;
 if(v?.source)return v.source;
 if(v?.local)return 'https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/'+String(v.local).replace(/^\.?\//,'');
 return '';
}
function logoFor(name){
 const supplied=window.LJR_SEASON_LOGOS?.get(name);if(supplied)return supplied;
 const cached=Object.entries(window.LJR_OFFICIAL_DATA?.team_logos||{}).find(([k])=>norm(k)===norm(name))?.[1]?.app;
 if(cached)return cached;
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
/* Sheet labels use complete words, never truncating in the middle.
   Official team data and logos remain untouched. */
function shortName(name){
 const full=String(name||'').trim();
 if(full.length<=18)return full;
 let label=full;
 for(const [pattern,abbrev] of [
    [/\bDEPORTIVO\b/gi,'Dep.'],[/\bDEPORTIVA\b/gi,'Dep.'],
    [/\bSAN ANTONIO\b/gi,'S. Antonio'],
    [/\bFRACCIONAMIENTO\b/gi,'Fracc.'],[/\bUNIVERSIDAD\b/gi,'Univ.']
 ])label=label.replace(pattern,abbrev);
 return label;
}
/* Three character code only in compact brackets. Title and aria-label keep
   the full club name, preserving usability for long press/accessibility. */
function bracketCode(name){
 const original=String(name||'').trim(), n=norm(original);
 const known=[
   ['san jose','SJO'],['san julian','SJU'],['san juan','SJN'],
   ['san antonio','SAT'],['herreras','HFC'],['hermanos','HNO'],
   ['galacticos','GAL'],['terricolas','TER'],['juventus','JUV'],
   ['linces','LIN'],['napoli','NAP'],['franco','FRA'],
   ['lobos','LOB'],['tavera','TAV'],['esperanza','ESP'],
   ['boavista','BOA'],['manchester','MAN'],['promesas','PRO'],
   ['mazacotes','MAZ'],['abejas','ABE'],['zapata','ZAP'],['barza','BAR']
 ];
 for(const [part,code] of known)if(n.includes(part))return code;
 const words=original.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().match(/[A-Z0-9]+/g)||[];
 if(!words.length)return '---';
 if(words.length===1)return words[0].slice(0,3).padEnd(3,'-');
 if(words.length>=3)return (words[0][0]+words[1][0]+words[2][0]).slice(0,3);
 return (words[0].slice(0,2)+words[1][0]).slice(0,3);
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
       id:catId()+':fixture:'+JSON.stringify([j,norm(r[2]),norm(r[6]),String(r[8]||'')]),
       journey:j,
       home:String(r[2]).trim(),away:String(r[6]).trim(),
       hs:h,as:a,field:String(r[7]||''),date:String(r[8]||''),played:h!==null&&a!==null,
       sort:gi*1000+ri
     });
   });
 });
 const seen=new Set();return out.filter(f=>{if(seen.has(f.id))return false;seen.add(f.id);return true});
}
function simFixtures(){
 const all=fixturesAll(),future=all.filter(f=>!f.played);
 return future;
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
function simState(){try{const value=JSON.parse(localStorage.getItem(simKey())||'{}');return value&&typeof value==='object'&&!Array.isArray(value)?value:{}}catch(_){return {}}}
function saveSim(s){localStorage.setItem(simKey(),JSON.stringify(s))}
function scoreOf(f,s){
 const x=s[f.id];
 if(!x||!Number.isInteger(x.home)||!Number.isInteger(x.away)||x.home<0||x.away<0||x.home>99||x.away>99)return null;
 return {home:Number(x.home),away:Number(x.away)};
}
function alterScore(id,side,delta){
 if(!['home','away'].includes(side)||![-1,1].includes(delta)||!simFixtures().some(f=>f.id===id))return;
 const s=simState(),existing=s[id];
 if(!existing&&delta<0)return;
 const x=existing||{home:0,away:0};
 x.home=Math.max(0,Number(x.home)||0);x.away=Math.max(0,Number(x.away)||0);
 x[side]=Math.min(99,Math.max(0,x[side]+delta));
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
     const target=Math.max(0,active.offsetLeft-strip.offsetLeft-(strip.clientWidth-active.offsetWidth)/2);
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
   '<div class="v774-sim-icons"><button type="button" class="v501-icon" data-v501-share aria-label="Compartir">'+svgShare()+'</button><button type="button" class="v501-icon" data-v501-account aria-label="Mi cuenta"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="8" r="3"/><path d="M5 20c0-8 14-8 14 0"/></svg></button></div>'+
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
   classificationGuide(rows)+
 '</section>';
}
/* Explains the simulator's implemented math, without inventing official
   tie-break rules or copying the UEFA competition format. */
function classificationGuide(rows){
 const games=simulatedCount(),total=simFixtures().length;
 return '<section class="v1051-guide" aria-label="Información sobre la clasificación">'+
   '<div class="v1051-guide-eyebrow">GUÍA DEL SIMULADOR</div>'+
   '<h2>¿Cómo funciona esta clasificación?</h2>'+
   '<p>La tabla parte de los datos disponibles de la categoría seleccionada. Al probar marcadores se actualizan provisionalmente los puntos y las posiciones, sin modificar los resultados oficiales.</p>'+
   '<div class="v1051-stats-grid">'+
     '<div class="v1051-stat"><strong>'+rows.length+'</strong><span>Equipos en la tabla</span></div>'+
     '<div class="v1051-stat"><strong>'+games+' / '+total+'</strong><span>Partidos simulados</span></div>'+
   '</div>'+
   '<h3>¿Qué significan las columnas?</h3>'+
   '<div class="v1051-key-list">'+
     '<span><b>PTOS</b> Puntos</span><span><b>+/-</b> Diferencia de goles</span>'+
     '<span><b>GF</b> Goles a favor</span><span><b>GC</b> Goles en contra</span>'+
     '<span><b>V</b> Victorias</span><span><b>PJ</b> Partidos jugados</span>'+
   '</div>'+
   '<h3>¿Qué ocurre si dos equipos empatan a puntos?</h3>'+
   '<p>Para ordenar <strong>esta simulación</strong> se utiliza primero la diferencia de goles y después los goles a favor. Si persiste el empate se ordenan los nombres. Los criterios oficiales del reglamento pueden ser diferentes.</p>'+
   '<h3>¿Cómo se construye el Cuadro?</h3>'+
   '<p>El cuadro muestra una proyección según la clasificación. Los cuadritos con un guion (—) corresponden a plazas todavía por definir; no representan resultados confirmados.</p>'+
   '<button type="button" class="v1051-show-bracket" data-v501-view="bracket">Ver cuadro de eliminatorias <span aria-hidden="true">→</span></button>'+
   '<p class="v1051-guide-note">Información orientativa. Consulta el reglamento y los comunicados de la Liga para conocer los criterios y fases oficiales.</p>'+
 '</section>';
}
function v512Logo(name){
 const src=logoFor(name);
 return src
   ?'<img src="'+esc(src)+'" alt="'+esc(name)+'" loading="eager" decoding="async">'
   :'<span class="v12-bracket-fallback v1063-placeholder" aria-hidden="true"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 2.6 20 5.4v6.1c0 4.8-3.1 8.2-8 10-4.9-1.8-8-5.2-8-10V5.4L12 2.6Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="m8 12 2.6 2.6 5.4-5.4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';
}
function bracketTeam(t,mini=false){
 if(!t){
   return '<div class="v12-bracket-team '+(mini?'mini ':'')+'empty v1051-pending-team" title="Cruce por definir" aria-label="Plaza pendiente de definir">'+
     '<small class="v12-bracket-seed"></small>'+v512Logo('')+'<strong aria-hidden="true">¿?</strong>'+
   '</div>';
 }
 return '<div class="v12-bracket-team '+(mini?'mini':'')+'" title="'+esc(t.name)+'" aria-label="'+esc(t.name)+'">'+
   '<small class="v12-bracket-seed">'+esc(t.pos)+'</small>'+
   v512Logo(t.name)+
   '<strong class="v1050-team-code">'+esc(bracketCode(t.name))+'</strong>'+
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

/* V1064: no se generan cruces ni clasificados mediante posiciones simuladas.
   Únicamente se muestran los partidos eliminatorios que publicó la liga. */
function v512OfficialKnockout(){
 const games={playoff:[],octavos:[],cuartos:[],semifinal:[],final:[]};
 for(const block of cat()?.fixtures||[]){
  for(const r of Array.isArray(block?.rows)?block.rows:[]){
   if(!Array.isArray(r)||!String(r[2]||'').trim()||!String(r[6]||'').trim())continue;
   const label=norm([r[1],block.title,block.name].filter(Boolean).join(' '));
   const stage=/play.?off|repechaje/.test(label)?'playoff':/octavos/.test(label)?'octavos':
     /cuartos/.test(label)?'cuartos':/semifinal/.test(label)?'semifinal':
     /(?:^| )final(?: |$)/.test(label)?'final':null;
   if(!stage)continue;
   const home=String(r[2]).trim(),away=String(r[6]).trim();
   if(/^(?:por definir|pendiente|local|visitante|descansa|bye|\?)$/i.test(home)||
      /^(?:por definir|pendiente|local|visitante|descansa|bye|\?)$/i.test(away))continue;
   games[stage].push([{name:home,pos:''},{name:away,pos:''}]);
  }
 }
 return games;
}
/* V1068: the Simulator may preview REAL clubs based on their current standings.
   These are explicitly projections, NEVER official fixtures or completed results.
   A published knockout fixture always takes precedence. */
function v512BuildRoutes(rows=simulatedStandings()){
 const matches=v512OfficialKnockout();
 const projection=matches.playoff.length===0 && rows.length>0;
 const get=n=>rows[n-1]||null;
 if(!projection){
   const route=(label,n)=>({
     label,pairs:Array.from({length:4},(_,i)=>matches.playoff[n+i]||null),
     winners:Array.from({length:2},(_,i)=>matches.octavos[n/2+i]||[null,null])
   });
   return {left:route('RUTA PLATEADA',0),right:route('RUTA AZUL',4),matches,projection:false};
 }
 // Keep the historical 5-12 / 6-11 / 7-10 / 8-9 seed layout,
 // without inserting imaginary clubs or repeating top seeds across routes.
 const n=rows.length;
 const pairSeeds=n>=12?[[5,12],[6,11],[7,10],[8,9]]:
    Array.from({length:Math.floor(Math.max(0,n-4)/2)},(_,i)=>[5+i,n-i]);
 const actualPairs=pairSeeds.map(([a,b])=>[get(a),get(b)]).filter(p=>p[0]&&p[1]);
 const route=(label,index)=>({
   label,pairs:Array.from({length:4},(_,i)=>actualPairs[index+i*2]||null),
   winners:index===0?[[get(1),null],[get(3),null]]:[[get(2),null],[get(4),null]]
 });
 return {left:route('RUTA PLATEADA',0),right:route('RUTA AZUL',1),matches,projection:true};
}

function v512BracketRoute(route){
 // Render all four bracket rows even where the club is not determined yet.
 // Empty cards never stand for real, qualified teams.
 const safePairs=(route.pairs||[]).slice(0,4);
 while(safePairs.length<4)safePairs.push(null);
 const winners=(route.winners||[]).slice(0,2);
 while(winners.length<2)winners.push([null,null]);
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
function v512UnknownMatch(dateText,legText=''){dateText='Por confirmar';
 return '<div class="v12-progress-match">'+
   '<time>'+dateText+'</time>'+
   '<small>'+legText+'</small>'+
   '<div class="v12-progress-opponent"><span class="shield"><svg viewBox="0 0 24 24"><path d="M12 2.7 20 5.6v5.7c0 5.1-3.3 8.6-8 10-4.7-1.4-8-4.9-8-10V5.6L12 2.7Z" fill="currentColor"/></svg></span><b>Por definir</b></div>'+
   '<div class="v12-progress-opponent"><span class="shield"><svg viewBox="0 0 24 24"><path d="M12 2.7 20 5.6v5.7c0 5.1-3.3 8.6-8 10-4.7-1.4-8-4.9-8-10V5.6L12 2.7Z" fill="currentColor"/></svg></span><b>Por definir</b></div>'+
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
function v1068Opponent(team){
 if(!team?.name)return '<div class="v12-progress-opponent v1068-pending"><span class="shield" aria-hidden="true">◈</span><b aria-label="Por definir">¿?</b></div>';
 return '<div class="v12-progress-opponent v1068-club" title="'+esc(team.name)+'" aria-label="'+esc(team.name)+'">'+
   '<span class="v1068-stage-crest">'+v512Logo(team.name)+'</span>'+
   '<b>'+esc(bracketCode(team.name))+'</b></div>';
}
function v519UnknownMatch(dateText,legText='',pair=null){
 return '<div class="v12-progress-match'+(pair?.some(t=>t?.name)?' v1068-has-clubs':'')+'">'+
   '<time>'+esc(dateText||'Por confirmar')+'</time>'+
   (legText?'<small>'+esc(legText)+'</small>':'')+
   v1068Opponent(pair?.[0]||null)+
   v1068Opponent(pair?.[1]||null)+
 '</div>';
}
function v519OctavosRoute(label,tone,pairs=[]){
 return '<section class="v519-octavos-route '+tone+'">'+
   '<div class="v12-progress-rail"><span>'+label+'</span></div>'+
   '<div class="v519-octavos-left">'+Array.from({length:4},(_,i)=>v519UnknownMatch('Por confirmar','',pairs[i]||null)).join('')+'</div>'+
   '<div class="v519-octavos-connectors" aria-hidden="true"><i class="a"></i><i class="b"></i></div>'+
   '<div class="v519-octavos-right">'+v519UnknownMatch('Por confirmar')+v519UnknownMatch('Por confirmar')+'</div>'+
 '</section>';
}
function v512StagePanels(rows){
 const played=v512OfficialKnockout();
 const rowAsSeed=(index)=>rows[index]?[rows[index],null]:null;
 // Real official fixture -> crest and short code; otherwise seeded club alone.
 const octavos=played.octavos.length?played.octavos:Array.from({length:8},(_,i)=>rowAsSeed(i));
 const quarter=played.cuartos,semi=played.semifinal;
 return '<div class="v12-stage-panels v519-stage-panels">'+
   '<section class="v12-stage-panel v12-stage-panel-octavos v519-stage-panel-octavos">'+
     '<div class="v12-progress-dates"><span>Por confirmar</span><span>Por confirmar</span></div>'+
     '<div class="v519-octavos-board">'+v519OctavosRoute('RUTA PLATEADA','route-silver',octavos.slice(0,4))+v519OctavosRoute('RUTA AZUL','route-blue',octavos.slice(4,8))+'</div>'+
   '</section>'+
   '<section class="v12-stage-panel v12-stage-panel-cuartos v519-stage-panel-cuartos">'+
     '<div class="v12-progress-dates"><span>Por confirmar</span><span>Por confirmar</span></div>'+
     '<div class="v12-progress-board">'+
       '<section class="v12-progress-route route-silver"><div class="v12-progress-rail"><span>RUTA PLATEADA</span></div><div class="v12-progress-left v12-progress-left-matches">'+v519UnknownMatch('Por confirmar','',quarter[0])+v519UnknownMatch('Por confirmar','',quarter[1])+'</div><div class="v12-progress-connector" aria-hidden="true"><i></i></div><div class="v12-progress-right">'+v519UnknownMatch('Por confirmar')+'</div></section>'+
       '<section class="v12-progress-route route-blue"><div class="v12-progress-rail"><span>RUTA AZUL</span></div><div class="v12-progress-left v12-progress-left-matches">'+v519UnknownMatch('Por confirmar','',quarter[2])+v519UnknownMatch('Por confirmar','',quarter[3])+'</div><div class="v12-progress-connector" aria-hidden="true"><i></i></div><div class="v12-progress-right">'+v519UnknownMatch('Por confirmar')+'</div></section>'+
     '</div>'+
   '</section>'+
   '<section class="v12-stage-panel v12-stage-panel-semifinal v519-stage-panel-semifinal">'+
     '<div class="v12-progress-dates"><span>Por confirmar</span><span>Por confirmar</span></div>'+
     '<div class="v12-semifinal-flow">'+
       '<div class="v12-semifinal-source silver"><div class="v12-progress-rail"><span>RUTA PLATEADA</span></div>'+v519UnknownMatch('Por confirmar','',semi[0])+'</div>'+
       '<div class="v12-semifinal-source blue"><div class="v12-progress-rail"><span>RUTA AZUL</span></div>'+v519UnknownMatch('Por confirmar','',semi[1])+'</div>'+
       '<div class="v12-semifinal-join" aria-hidden="true"></div>'+
       '<div class="v12-semifinal-target">'+v519UnknownMatch('Por confirmar','')+'</div>'+
     '</div>'+
   '</section>'+
 '</div>';
}

function v512FinalCard(){
 const match=v512OfficialKnockout().final[0]||null;
 const a=match?.[0]?.name||'¿?',b=match?.[1]?.name||'¿?';
 return '<section class="v12-final-reference" data-v512-final>'+
   '<div class="v12-final-top-date"><span></span><b>Por confirmar</b></div>'+
   '<div class="v12-final-side-mark" aria-hidden="true"></div>'+
   '<div class="v12-final-match-card">'+
     '<time>Por confirmar</time>'+
     '<div class="v12-final-opponent"><span class="v1068-final-crest">'+(match?v512Logo(a):'<span class="v12-final-shield">◈</span>')+'</span><b>'+esc(a)+'</b></div>'+
     '<div class="v12-final-opponent"><span class="v1068-final-crest">'+(match?v512Logo(b):'<span class="v12-final-shield">◈</span>')+'</span><b>'+esc(b)+'</b></div>'+
   '</div>'+
   '<div class="v12-final-trophy-wrap"><div class="v12-final-trophy-new" aria-label="Trofeo de la final"><img src="./final-trophy-drive.png?v=v512" alt="" aria-hidden="true"></div></div>'+
 '</section>';
}

function simulationCategory(){
 const source=cat(),state=simState();
 return {...source,fixtures:(source.fixtures||[]).map((block,gi)=>({...block,rows:(block.rows||[]).map(r=>{
  if(!Array.isArray(r)||num(r[3])!==null&&num(r[5])!==null)return r;
  const journey=String(r[1]??block.title??block.name??(gi+1)).trim()||String(gi+1);
  const id=catId()+':fixture:'+JSON.stringify([journey,norm(r[2]),norm(r[6]),String(r[8]||'')]);
  const score=scoreOf({id},state);if(!score)return r;
  const copy=r.slice();copy[3]=score.home;copy[5]=score.away;return copy;
 })}))};
}
function bracketView(){
 return window.LJR_KNOCKOUT.render({category:simulationCategory(),rows:simulatedStandings(),simulate:true,
   categoryId:catId(),logoFor,stage:bracketStage()});
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
   '<button type="button" class="v501-grabber" data-v501-sheet-toggle aria-label="Abrir o cerrar simulador de resultados" aria-expanded="false"></button>'+
   '<div class="v501-sheet-head"><div><h2>Simulador de resultados</h2><p>'+count+'/'+total+' partidos simulados</p></div>'+
     (count?'<button type="button" data-v501-clear>Borrar todo</button>':'')+
   '</div>'+
   '<div class="v501-match-list">'+group.rows.map(f=>{
     const sc=scoreOf(f,s),hp=posNow(f.home),ap=posNow(f.away),hb=posBefore(f.home),ab=posBefore(f.away);
     return '<div class="v501-sim-match">'+
       '<span class="v501-seed">#<b>'+hp+'</b>'+seedTrend(hp,hb)+'</span>'+
       '<div class="v501-sim-team home" title="'+esc(f.home)+'" aria-label="'+esc(f.home)+'">'+crest(f.home,'sim')+'<b>'+esc(shortName(f.home))+'</b></div>'+
       scoreControl(f,'home')+
       scoreCenter(f,sc)+
       scoreControl(f,'away')+
       '<div class="v501-sim-team away" title="'+esc(f.away)+'" aria-label="'+esc(f.away)+'">'+crest(f.away,'sim')+'<b>'+esc(shortName(f.away))+'</b></div>'+
       '<span class="v501-seed right">#<b>'+ap+'</b>'+seedTrend(ap,ab)+'</span>'+
     '</div>';
   }).join('')+'</div>'+
   (list.length?'<div class="v501-journey"><button type="button" data-v501-journey="-1" aria-label="Jornada anterior">‹</button><b>Jornada '+esc(group.label.replace(/^jornada\s*/i,''))+'</b><button type="button" data-v501-journey="1" aria-label="Jornada siguiente">›</button></div>':'<p role="status">No hay partidos publicados para simular en esta categoría.</p>')+
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

const V515_SHEET_KEY='v515-simulator-sheet-snap';
let V515_SHEET_DRAG=null;

function v515SheetSnaps(){
 const vh=Math.max(480,window.innerHeight||document.documentElement.clientHeight||800);
 return {
   expanded:Math.max(96,(document.querySelector('.ljr-scroll-header')?.getBoundingClientRect().height||88)+8),
   mid:Math.max(190,Math.round(vh*.455)),
   // A slimmer collapsed sheet matches the handle/title/progress reference.
   collapsed:Math.max(300,vh-110)
 };
}
function v515SheetTop(sheet){
 const raw=parseFloat(sheet?.style.getPropertyValue('--v515-sheet-y')||'');
 if(Number.isFinite(raw))return raw;
 return sheet?.getBoundingClientRect?.().top||v515SheetSnaps().collapsed;
}
function v515SetSheet(top,animate=true){
 const sheet=document.querySelector('[data-v501-simulator] .v501-sheet');
 if(!sheet)return;
 const snaps=v515SheetSnaps();
 const min=snaps.expanded,max=snaps.collapsed;
 const y=Math.min(max,Math.max(min,Number(top)||max));
 sheet.classList.toggle('v515-dragging',!animate);
 sheet.style.setProperty('--v515-sheet-y',y+'px');
}
function v515ApplySheetSnap(name){
 const sheet=document.querySelector('[data-v501-simulator] .v501-sheet');
 if(!sheet)return;
 const snaps=v515SheetSnaps();
 const snap=(name||localStorage.getItem(V515_SHEET_KEY)||'collapsed');
 const key=Object.prototype.hasOwnProperty.call(snaps,snap)?snap:'collapsed';
 sheet.dataset.v515Snap=key;
 sheet.querySelector('[data-v501-sheet-toggle]')?.setAttribute('aria-expanded',String(key!=='collapsed'));
 localStorage.setItem(V515_SHEET_KEY,key);
 v515SetSheet(snaps[key],true);
}
function v515NearestSnap(y,velocity=0){
 const s=v515SheetSnaps();
 if(velocity<-0.55){
   if(y>s.mid+30)return 'mid';
   return 'expanded';
 }
 if(velocity>0.55){
   if(y<s.mid-30)return 'mid';
   return 'collapsed';
 }
 return Object.keys(s).sort((a,b)=>Math.abs(s[a]-y)-Math.abs(s[b]-y))[0];
}
function v515InitSheet(){
 if(route()!=='simulator')return;
 requestAnimationFrame(()=>v515ApplySheetSnap());
}
function v515SheetPointerDown(e){
 if(route()!=='simulator'||!(e.target instanceof Element))return;
 if(e.target.closest('button,a,input,select,textarea')&&!e.target.closest('[data-v501-sheet-toggle]'))return;
 const handle=e.target.closest('.v501-grabber,.v501-sheet-head');
 if(!handle)return;
 const sheet=handle.closest('.v501-sheet');
 if(!sheet)return;
 e.preventDefault();
 const startTop=v515SheetTop(sheet);
 V515_SHEET_DRAG={
   sheet,pointerId:e.pointerId,startY:e.clientY,startTop,lastY:e.clientY,lastT:performance.now(),velocity:0,moved:false
 };
 sheet.classList.add('v515-dragging');
 document.body.classList.add('v515-sheet-dragging');
 try{handle.setPointerCapture?.(e.pointerId)}catch(_){}
}
function v515SheetPointerMove(e){
 const d=V515_SHEET_DRAG;
 if(!d||e.pointerId!==d.pointerId)return;
 e.preventDefault();
 const now=performance.now();
 const dy=e.clientY-d.startY;
 const dt=Math.max(8,now-d.lastT);
 d.velocity=(e.clientY-d.lastY)/dt;
 d.lastY=e.clientY;d.lastT=now;
 if(Math.abs(dy)>4)d.moved=true;
 v515SetSheet(d.startTop+dy,false);
}
function v515SheetPointerUp(e){
 const d=V515_SHEET_DRAG;
 if(!d||e.pointerId!==d.pointerId)return;
 const y=v515SheetTop(d.sheet);
 d.sheet.classList.remove('v515-dragging');
 document.body.classList.remove('v515-sheet-dragging');
 if(!d.moved&&e.target instanceof Element&&e.target.closest('[data-v501-sheet-toggle]')){V515_SHEET_DRAG=null;return;}
 if(d.moved)d.sheet.dataset.v515IgnoreClickUntil=String(Date.now()+400);
 let snap;
 if(!d.moved&&e.target instanceof Element&&e.target.closest('.v501-grabber')){
   const current=d.sheet.dataset.v515Snap||localStorage.getItem(V515_SHEET_KEY)||'collapsed';
   snap=current==='collapsed'?'mid':current==='mid'?'expanded':'mid';
 }else snap=v515NearestSnap(y,d.velocity);
 V515_SHEET_DRAG=null;
 v515ApplySheetSnap(snap);
}
document.addEventListener('pointerdown',v515SheetPointerDown,true);
document.addEventListener('pointermove',v515SheetPointerMove,{capture:true,passive:false});
document.addEventListener('pointerup',v515SheetPointerUp,true);
document.addEventListener('pointercancel',v515SheetPointerUp,true);
window.addEventListener('resize',()=>{if(route()==='simulator')v515ApplySheetSnap()}, {passive:true});

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
   v515InitSheet();
   window.LJR_KNOCKOUT.init(root?.querySelector('.ljr-knockout'));
   /* Tras un remonte, la fase guardada permanece visible sin desplazar toda la página. */
   const stages=root?.querySelector('[data-v512-bracket] .v12-bracket-stage-tabs');
   if(stages)requestAnimationFrame(()=>{
     const active=stages.querySelector('[data-v512-stage].active');
     if(!active||!stages.isConnected)return;
     stages.scrollLeft=Math.max(0,active.offsetLeft-stages.offsetLeft-(stages.clientWidth-active.offsetWidth)/2);
   });
 }finally{rendering=false}
}
function render(preserve=false){
 const y=preserve?document.querySelector('#screen')?.scrollTop:null;
 const listY=preserve?document.querySelector('.v501-match-list')?.scrollTop:null;
 mount();
 if(y!=null)requestAnimationFrame(()=>{const screen=document.querySelector('#screen');if(screen)screen.scrollTop=y;const list=document.querySelector('.v501-match-list');if(list&&listY!=null)list.scrollTop=listY;});
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
 const toggle=e.target.closest('[data-v501-sheet-toggle]');if(toggle){e.preventDefault();e.stopPropagation();const sheet=toggle.closest('.v501-sheet');if(Number(sheet?.dataset.v515IgnoreClickUntil||0)>Date.now())return;v515ApplySheetSnap(sheet?.dataset.v515Snap==='collapsed'?'mid':'collapsed');return}
 const v=e.target.closest('[data-v501-view]');if(v){e.preventDefault();setView(v.dataset.v501View);return}
 const st=e.target.closest('[data-v512-stage]');if(st){e.preventDefault();e.stopPropagation();setBracketStage(st.dataset.v512Stage);return}
 const score=e.target.closest('[data-v501-score]');if(score){e.preventDefault();e.stopPropagation();alterScore(score.dataset.v501Score,score.dataset.side,Number(score.dataset.delta||0));return}
 const reset=e.target.closest('[data-v501-reset]');if(reset){e.preventDefault();e.stopPropagation();resetMatch(reset.dataset.v501Reset);return}
 if(e.target.closest('[data-v501-clear]')){e.preventDefault();e.stopPropagation();clearSimulation();return}
 const j=e.target.closest('[data-v501-journey]');if(j){e.preventDefault();setJourney(journeyIndex()+Number(j.dataset.v501Journey||0));return}
 if(e.target.closest('[data-v501-back]')){e.preventDefault();location.hash='#/more';return}
 if(e.target.closest('[data-v501-account]')){e.preventDefault();location.hash='#/account';return}
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
