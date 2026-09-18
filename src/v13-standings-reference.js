const V13_ASSET_BASE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const V13_LEAGUE_LOGO=V13_ASSET_BASE+'assets/liga-logo.webp';

const V13_COMPLETE=[
  {name:'Herrera FC',logo:'assets/teams/herrera-fc.webp',p:1,v:1,e:0,d:0,gf:5,ga:6,pts:3},
  {name:'Terrícolas',logo:'assets/teams/terricolas-fc.webp',p:1,v:1,e:0,d:0,gf:5,ga:5,pts:3},
  {name:'La Huerta',logo:'assets/teams/la-huerta-cuenda.webp',p:1,v:1,e:0,d:0,gf:4,ga:5,pts:3},
  {name:'Atlético Galeana',logo:'assets/teams/atletico-galeana.webp',p:1,v:1,e:0,d:0,gf:4,ga:4,pts:3},
  {name:'Promesas FC',logo:'assets/teams/promesas-fc-pozos.webp',p:1,v:1,e:0,d:0,gf:3,ga:4,pts:3},
  {name:'BFC',logo:'assets/teams/boavista-fc.webp',p:1,v:1,e:0,d:0,gf:2,ga:3,pts:3},
  {name:'Tavera FC',logo:'assets/teams/tavera-fc.webp',p:1,v:1,e:0,d:0,gf:2,ga:3,pts:3},
  {name:'Veteranos Pozos',logo:'assets/teams/veteranos-pozos-fc.webp',p:1,v:1,e:0,d:0,gf:2,ga:2,pts:3}
];

const V13_CRITERIA=[
  {name:'La Huerta',logo:'assets/teams/la-huerta-cuenda.webp',pts:3,gd:5,gf:6,ga:0,v:1,va:0,p:0,mark:'gf'},
  {name:'Promesas FC',logo:'assets/teams/promesas-fc-pozos.webp',pts:3,gd:5,gf:5,ga:0,v:1,va:0,p:0,mark:'gf'},
  {name:'Franco FC',logo:'assets/teams/franco-fc.webp',pts:3,gd:4,gf:5,ga:0,v:1,va:0,p:0,mark:'gf'},
  {name:'Atlético Galeana',logo:'assets/teams/atletico-galeana.webp',pts:3,gd:4,gf:4,ga:0,v:1,va:0,p:0,mark:'gf'},
  {name:'Lobos CDG',logo:'assets/teams/lobos-cdg.webp',pts:3,gd:3,gf:4,ga:0,v:1,va:0,p:0,mark:'gd'},
  {name:'Juventino',logo:null,pts:3,gd:2,gf:3,ga:0,v:1,va:0,p:0},
  {name:'Cuenda',logo:'assets/teams/tc-cuenda.webp',pts:3,gd:2,gf:3,ga:0,v:1,va:0,p:0},
  {name:'Pozos',logo:'assets/teams/pozos-fc.webp',pts:3,gd:2,gf:2,ga:2,v:1,va:1,p:0,mark:'gf'}
];

let v13Mode='complete';

function v13Route(){return location.hash.replace('#/','')||'home'}
function v13Logo(team){
  const src=team.logo?V13_ASSET_BASE+team.logo:V13_LEAGUE_LOGO;
  return '<img class="v13-team-logo" src="'+src+'" alt="'+team.name+'" loading="eager" decoding="async">';
}
function v13Team(team){
  return '<span class="v13-team-cell">'+v13Logo(team)+'<strong>'+team.name+'</strong></span>';
}
function v13ModeButtons(mode){
  return '<div class="v13-segmented" role="tablist" aria-label="Vista de clasificación">'+
    '<button class="'+(mode==='compact'?'active':'')+'" data-v13-mode="compact" role="tab" aria-selected="'+(mode==='compact')+'">Compacta</button>'+
    '<button class="'+(mode==='complete'?'active':'')+'" data-v13-mode="complete" role="tab" aria-selected="'+(mode==='complete')+'">Completa</button>'+
    '<button class="'+(mode==='criteria'?'active':'')+'" data-v13-mode="criteria" role="tab" aria-selected="'+(mode==='criteria')+'">Criterios de<br>desempate</button>'+
  '</div>';
}
function v13SectionTitle(){
  return '<div class="v13-direct-label">DIRECTOS A OCTAVOS</div><div class="v13-direct-line"></div>';
}
function v13Complete(){
  const head=['P','V','E','D','','','+PTOS'];
  return '<div class="v13-complete-table">'+
    '<div class="v13-complete-head"><span></span><span></span>'+head.map(x=>'<b>'+x+'</b>').join('')+'</div>'+
    v13SectionTitle()+
    '<div class="v13-complete-list">'+V13_COMPLETE.map((t,i)=>
      '<div class="v13-complete-row">'+
        '<span class="v13-rank">'+(i+1)+'</span>'+v13Team(t)+
        '<span>'+t.p+'</span><span>'+t.v+'</span><span>'+t.e+'</span><span>'+t.d+'</span><span>'+t.gf+'</span><span class="v13-muted-number">'+t.ga+'</span><b>'+t.pts+'</b>'+
      '</div>'
    ).join('')+'</div>'+
  '</div>';
}
function v13Compact(){
  return '<div class="v13-compact-table">'+
    '<div class="v13-compact-head"><span></span><span>Equipo</span><b>P</b><b>+/-</b><b>PTOS</b></div>'+
    v13SectionTitle()+
    '<div class="v13-compact-list">'+V13_COMPLETE.map((t,i)=>{
      const gd=t.gf-t.ga;
      return '<div class="v13-compact-row"><span class="v13-rank">'+(i+1)+'</span>'+v13Team(t)+'<span>'+t.p+'</span><span>'+(gd>0?'+':'')+gd+'</span><b>'+t.pts+'</b></div>';
    }).join('')+'</div>'+
  '</div>';
}
function v13Criteria(){
  const cols=['PTOS','+/-','GF','GA','V','VA','P'];
  return '<div class="v13-criteria-wrap">'+
    '<div class="v13-criteria-scroll">'+
      '<div class="v13-criteria-table">'+
        '<div class="v13-criteria-head"><span></span><span></span>'+cols.map(x=>'<b>'+x+'</b>').join('')+'</div>'+
        v13SectionTitle()+
        '<div class="v13-criteria-list">'+V13_CRITERIA.map((t,i)=>{
          const keys=['pts','gd','gf','ga','v','va','p'];
          return '<div class="v13-criteria-row"><span class="v13-rank">'+(i+1)+'</span>'+v13Team(t)+
            keys.map(k=>'<span class="'+(t.mark===k?'v13-mark':'')+'">'+t[k]+'</span>').join('')+
          '</div>';
        }).join('')+'</div>'+
      '</div>'+
    '</div>'+
  '</div>';
}
function v13Body(mode){
  const table=mode==='criteria'?v13Criteria():(mode==='compact'?v13Compact():v13Complete());
  return v13ModeButtons(mode)+'<div class="v13-stand-content">'+table+'</div>';
}
function patchV13Standings(){
  if(v13Route()!=='competition') return;
  const screen=document.querySelector('#screen');
  const active=screen?.querySelector('.tabs .tab.active');
  if(!screen||!active||!/Clasificaci/i.test(active.textContent||'')) return;
  const box=screen.querySelector('[data-v12-standings]');
  if(!box) return;
  if(box.dataset.v13Ready==='1') return;
  box.dataset.v13Ready='1';
  box.dataset.v13Standings='true';
  box.classList.add('v13-standings-reference');
  box.innerHTML=v13Body(v13Mode);
}
function scheduleV13(){
  requestAnimationFrame(()=>{
    patchV13Standings();
    requestAnimationFrame(patchV13Standings);
  });
}
document.addEventListener('click',e=>{
  const mode=e.target.closest('[data-v13-mode]');
  if(!mode) return;
  e.preventDefault();
  v13Mode=mode.dataset.v13Mode;
  const box=mode.closest('[data-v13-standings]');
  if(!box) return;
  box.innerHTML=v13Body(v13Mode);
},false);
window.addEventListener('hashchange',scheduleV13);
const v13Observer=new MutationObserver(scheduleV13);
const v13Target=document.querySelector('#screen');
if(v13Target) v13Observer.observe(v13Target,{childList:true,subtree:true});
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',scheduleV13,{once:true}); else scheduleV13();
