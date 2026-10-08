/* V970 · Laboratorio de Quiniela local.
   Funciones incrementales: barra de progreso, filtros, historial de forma,
   sugerencia NO guardada y rendimiento por jornada. No modifica fixtures.
*/
import {normalizeCompetition,norm} from './competition-data.js';
const V970_CACHE='ljr-blue:quiniela:fixture-snapshot:v1';
const V970_FILTER='v970-quiniela-filter:';
const V970_PREDICTIONS='v561-quiniela';
let v970SnapshotPromise;
const v970Esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const v970Icon='<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 19v-6h4v6M10 19V5h4v14M15 19v-9h4v9"/></svg>';
async function v970Snapshot(){
 if(!v970SnapshotPromise){
   v970SnapshotPromise=fetch('./data/official-live.json?feature=v970-lab',{cache:'no-store'}).then(async r=>{
     if(!r.ok)throw Error('Archivo de partidos no disponible');
     const data=await r.json();
     if(!data?.categories?.['2'])throw Error('Archivo de categorías inválido');
     return data;
   }).catch(()=>{
     try{const snapshot=JSON.parse(localStorage.getItem(V970_CACHE)||'null');
       return snapshot?.categories?snapshot:null}catch(_){return null}
   });
 }
 return v970SnapshotPromise;
}
function v970Date(m){
 if(m.complete)return true;
 if(!m.iso||!m.time)return false;
 const time=Date.parse(m.iso+'T'+m.time+':00-06:00');
 return Number.isFinite(time)&&Date.now()>=time;
}
function v970Guesses(){
 try{return JSON.parse(localStorage.getItem(V970_PREDICTIONS)||'{}')||{}}catch(_){return {}}
}
function v970Saved(m,db,guesses){
 const key=[m.category,db.categories?.[String(m.category)]?.season_id||'',m.round,norm(m.home),norm(m.away)].join('|');
 const guess=guesses[key]||guesses[m.id];
 return guess?.fixtureKey===key&&Number.isInteger(guess.home)&&Number.isInteger(guess.away)?guess:null;
}
function v970Points(p,m){
 if(!p||!m.complete)return null;
 if(p.home===m.homeScore&&p.away===m.awayScore)return 2;
 return Math.sign(p.home-p.away)===Math.sign(m.homeScore-m.awayScore)?1:0;
}
function v970Form(c,team,target){
 const recent=c.matches.filter(m=>m.complete&&m.status==='FINAL'&&m.iso&&
   (!target.iso||m.iso<target.iso)&&
   (norm(m.home)===norm(team)||norm(m.away)===norm(team)))
   .sort((a,b)=>b.iso.localeCompare(a.iso)||String(b.time).localeCompare(String(a.time))).slice(0,5);
 let w=0,d=0,l=0,gf=0,ga=0;
 for(const m of recent){
   const home=norm(m.home)===norm(team);
   const scored=home?m.homeScore:m.awayScore,allowed=home?m.awayScore:m.homeScore;
   gf+=scored;ga+=allowed;if(scored>allowed)w++;else if(scored===allowed)d++;else l++;
 }
 return {n:recent.length,w,d,l,gf:recent.length?gf/recent.length:0,ga:recent.length?ga/recent.length:0};
}
function v970Forecast(home,away){
 if(home.n<2||away.n<2)return null;
 const capped=n=>Math.max(0,Math.min(6,Math.round(n)));
 return {home:capped((home.gf+away.ga)/2),away:capped((away.gf+home.ga)/2)};
}
function v970Performance(section,c,db,guesses){
 if(section.querySelector('.v970-round-performance'))return;
 const rounds=new Map();
 for(const m of c.matches){
   const p=v970Saved(m,db,guesses);
   if(!p||!m.complete)continue;
   const key=String(m.round||'—');
   const stat=rounds.get(key)||{points:0,n:0};
   stat.points+=v970Points(p,m);stat.n++;rounds.set(key,stat);
 }
 const panel=document.createElement('section');
 panel.className='v970-round-performance';
 panel.innerHTML='<h3>'+v970Icon+' Rendimiento por jornada</h3>'+
   '<p>Tu puntuación comparada con el máximo posible en tus partidos evaluados.</p>'+
   (rounds.size?[...rounds.entries()].sort((a,b)=>Number(b[0])-Number(a[0])).slice(0,12).map(([round,s])=>
    '<div class="v970-round-score"><span>Jornada '+v970Esc(round)+'</span>'+
    '<div aria-hidden="true"><i style="width:'+Math.round(100*s.points/(s.n*2))+'%"></i></div>'+
    '<strong>'+s.points+'/'+(s.n*2)+' pts</strong></div>').join(''):
    '<p>Cuando haya resultados publicados de tus pronósticos aparecerá tu desempeño aquí.</p>');
 const backup=section.querySelector('.v969-q-backup');
 if(backup)backup.before(panel);else section.append(panel);
}
function v970Play(section,c,db,guesses,catId){
 const select=section.querySelector('[data-q-round]');
 const cards=[...section.querySelectorAll('.v618-q-card[data-q-match]')];
 if(!select)return;
 const round=String(select.value);
 const matches=c.matches.filter(m=>String(m.round)===round);
 const saved=matches.filter(m=>v970Saved(m,db,guesses)).length;
 const open=matches.filter(m=>!v970Date(m)).length;
 const pending=matches.filter(m=>!v970Date(m)&&!v970Saved(m,db,guesses)).length;
 const percent=matches.length?Math.round(100*saved/matches.length):0;
 const filterKey=V970_FILTER+catId;
 const value=localStorage.getItem(filterKey)||'all';
 const filter=['all','pending','saved'].includes(value)?value:'all';
 const sectionTools=document.createElement('section');
 sectionTools.className='v970-game-tools';
 sectionTools.innerHTML=
   '<div class="v970-progress-head"><span>'+v970Icon+' Progreso de jornada '+v970Esc(round)+'</span><strong>'+saved+'/'+matches.length+'</strong></div>'+
   '<div class="v970-progress-track" role="progressbar" aria-label="Pronósticos guardados" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+percent+'"><span style="width:'+percent+'%"></span></div>'+
   '<div class="v970-progress-caption"><span>'+pending+' sin pronosticar</span><span>'+open+' partidos abiertos</span></div>'+
   '<div class="v970-filter-row" role="group" aria-label="Ver partidos">'+
   [['all','Todos'],['pending','Pendientes'],['saved','Guardados']].map(([key,label])=>
     '<button type="button" data-v970-filter="'+key+'" aria-pressed="'+String(key===filter)+'" class="'+(key===filter?'active':'')+'">'+label+'</button>').join('')+
   '</div>';
 const heading=section.querySelector('.v618-q-section-title');
 if(heading)heading.before(sectionTools);else select.closest('.v618-q-round')?.after(sectionTools);
 const gameMap=new Map(c.matches.map(m=>[m.id,m]));
 const applyFilter=key=>{
   let visible=0;
   for(const card of cards){
     const m=gameMap.get(card.dataset.qMatch);if(!m)continue;
     const guessed=!!v970Saved(m,db,guesses);
     const show=key==='all'||(key==='saved'?guessed:!v970Date(m)&&!guessed);
     card.hidden=!show;if(show)visible++;
   }
   sectionTools.querySelectorAll('[data-v970-filter]').forEach(btn=>{
     const active=btn.dataset.v970Filter===key;
     btn.classList.toggle('active',active);btn.setAttribute('aria-pressed',String(active));
   });
   let empty=section.querySelector('.v970-no-matches');
   if(!visible&&cards.length){
     if(!empty){
       empty=document.createElement('div');empty.className='v970-no-matches';
       section.querySelector('.v618-q-matches')?.append(empty);
     }
     empty.innerHTML='<span>'+(key==='pending'?'No quedan partidos abiertos sin pronosticar.':
       key==='saved'?'Aún no hay pronósticos guardados en esta jornada.':'Sin partidos para mostrar.')+'</span>'+
       '<button type="button" data-v970-all>Ver todos</button>';
     empty.querySelector('[data-v970-all]').onclick=()=>{
       localStorage.setItem(filterKey,'all');applyFilter('all');
     };
   }else if(empty)empty.remove();
 };
 sectionTools.querySelectorAll('[data-v970-filter]').forEach(btn=>btn.onclick=()=>{
   const key=btn.dataset.v970Filter;
   localStorage.setItem(filterKey,key);applyFilter(key);
 });
 for(const card of cards){
   const match=gameMap.get(card.dataset.qMatch);
   if(!match)continue;
   const formHome=v970Form(c,match.home,match),formAway=v970Form(c,match.away,match);
   const predicted=v970Forecast(formHome,formAway);
   const row=document.createElement('div');
   row.className='v970-match-insight';
   row.innerHTML='<button type="button" class="v970-insight-toggle" aria-expanded="false">'+v970Icon+' Análisis local del partido</button>'+
     '<section class="v970-insight-panel" hidden><strong>'+v970Icon+' Últimos 5 partidos publicados</strong>'+
     '<div class="v970-form-grid">'+
     [ [match.home,formHome],[match.away,formAway] ].map(([name,f])=>
       '<div><b>'+v970Esc(name)+'</b><span>'+f.w+' G · '+f.d+' E · '+f.l+' P</span>'+
       '<small>'+f.n+' partidos · GF '+f.gf.toFixed(1)+' / GC '+f.ga.toFixed(1)+'</small></div>').join('')+
     '</div><div class="v970-insight-footer"><p>'+
      (predicted?'Sugerencia orientativa a partir de goles registrados. No representa probabilidades y no se guarda sola.':
      'Sin suficientes resultados: se requieren 2 partidos previos de cada equipo.')+
      '</p>'+(!v970Date(match)?
        '<button type="button" data-v970-suggest '+(predicted?'':'disabled')+'>'+v970Icon+' Sugerir marcador</button>':'')+
     '</div></section>';
   card.append(row);
   const toggle=row.querySelector('.v970-insight-toggle'),detail=row.querySelector('.v970-insight-panel');
   toggle.onclick=()=>{detail.hidden=!detail.hidden;toggle.setAttribute('aria-expanded',String(!detail.hidden))};
   const suggest=row.querySelector('[data-v970-suggest]');
   if(suggest)suggest.onclick=()=>{
     if(!predicted||v970Date(match))return;
     const home=card.querySelector('[data-q-home]'),away=card.querySelector('[data-q-away]');
     if(!home||!away||home.disabled||away.disabled)return;
     if(home.value!==''||away.value!==''){
       window.alert('Ya escribiste un marcador. Para usar la sugerencia, primero borra ambos valores.');
       return;
     }
     home.value=String(predicted.home);away.value=String(predicted.away);
     home.dispatchEvent(new Event('input',{bubbles:true}));
     away.dispatchEvent(new Event('input',{bubbles:true}));
     suggest.textContent='Marcador sugerido · pendiente de guardar';
   };
 }
 applyFilter(filter);
}
async function v970Enhance(){
 const mount=document.querySelector('[data-v561-quiniela-mount]');
 const page=mount?.querySelector('.v618-quiniela');
 if(!page||page.dataset.v970Enhanced)return;
 page.dataset.v970Enhanced='loading';
 const snap=await v970Snapshot();
 if(!page.isConnected)return;
 if(!snap){page.dataset.v970Enhanced='no-data';return}
 const catId=localStorage.getItem('v561-category')||'3';
 const c=normalizeCompetition(snap).find(x=>x.id===catId);
 if(!c){page.dataset.v970Enhanced='missing-cat';return}
 const guesses=v970Guesses();
 if(page.querySelector('[data-q-round]'))v970Play(page,c,snap,guesses,catId);
 if(page.querySelector('.v618-q-ranking'))v970Performance(page.querySelector('.v618-q-ranking'),c,snap,guesses);
 page.dataset.v970Enhanced='yes';
}
(function start(){
 let scheduled=false;
 function queue(){
   if(scheduled)return;
   scheduled=true;requestAnimationFrame(()=>{scheduled=false;v970Enhance().catch(()=>{})});
 }
 function boot(){
   const target=document.querySelector('#screen')||document.body;
   new MutationObserver(queue).observe(target,{subtree:true,childList:true});
   window.addEventListener('hashchange',queue);
   window.addEventListener('pageshow',queue);
   queue();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
 else boot();
})();
