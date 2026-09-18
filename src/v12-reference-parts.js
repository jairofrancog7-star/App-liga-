const V12_LOGO='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/liga-logo.webp';
const V12_TEAM_ASSET_BASE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const V12_TEAMS=[
  {name:'Club América Veteranos JR',logo:'assets/branding/america-veteranos-35-user.png',p:1,gd:8,pts:3,form:['w','w','w'],last:'V'},
  {name:'Lobos CDG',logo:'assets/teams/lobos-cdg.webp',p:1,gd:5,pts:3,form:['w','w','n'],last:'V'},
  {name:'La Huerta de Cuenda',logo:'assets/teams/la-huerta-cuenda.webp',p:1,gd:4,pts:3,form:['w','w','n'],last:'V'},
  {name:'Atlético Galeana',logo:'assets/teams/atletico-galeana.webp',p:1,gd:2,pts:3,form:['w','n','w'],last:'V'},
  {name:'Promesas FC Pozos',logo:'assets/teams/promesas-fc-pozos.webp',p:1,gd:0,pts:1,form:['n','w','n'],last:'E'},
  {name:'San Antonio J.R.',logo:'assets/teams/san-antonio-jr.webp',p:1,gd:-2,pts:0,form:['l','l','n'],last:'D'},
  {name:'Franco FC',logo:'assets/teams/franco-fc.webp',p:1,gd:-4,pts:0,form:['l','n','l'],last:'D'},
  {name:'Juventino Rosas',logo:null,p:1,gd:-8,pts:0,form:['l','l','l'],last:'D'}
];

function v12Route(){return location.hash.replace('#/','')||'home'}
function v12Logo(src,alt,cls=''){return '<img class="'+cls+'" src="'+src+'" alt="'+alt+'" loading="eager" decoding="async">'}
function v12TeamLogo(t){return v12Logo(t.logo?V12_TEAM_ASSET_BASE+t.logo:V12_LOGO,t.name,'v12-team-logo')}
function v12Form(t){return '<div class="v12-form">'+t.form.map(s=>'<i class="'+s+'"></i>').join('')+'<b class="'+t.last.toLowerCase()+'">'+t.last+'</b></div>'}
function v12Rows(mode='compact'){
  if(mode==='criteria') return '<div class="v12-criteria"><h3>Criterios de desempate</h3><ol><li>Puntos obtenidos</li><li>Diferencia de goles</li><li>Goles a favor</li><li>Resultado entre los equipos empatados</li><li>Disciplina</li></ol></div>';
  return '<div class="v12-stand-head"><span>LIGA MUNICIPAL JUVENTINO ROSAS</span><b>P</b><b>+/-</b><b>PTOS</b><b>FORMA</b></div>'+
    '<div class="v12-stand-list">'+V12_TEAMS.map((t,i)=>'<div class="v12-stand-row"><span class="v12-rank">'+(i+1)+'</span><span class="v12-team-cell">'+v12TeamLogo(t)+'<strong>'+t.name+'</strong></span><span>'+t.p+'</span><span>'+t.gd+'</span><span>'+t.pts+'</span>'+v12Form(t)+'</div>').join('')+'</div>';
}
function v12StandingsBody(){
  return '<section class="v12-standings-reference" data-v12-standings>'+
    '<div class="v12-segmented">'+
      '<button class="active" data-v12-mode="compact">Compacta</button>'+
      '<button data-v12-mode="complete">Completa</button>'+
      '<button data-v12-mode="criteria">Criterios de<br>desempate</button>'+
    '</div>'+
    '<div class="v12-stand-content" data-v12-stand-content>'+v12Rows('compact')+'</div>'+
  '</section>';
}
function patchStandings(){
  if(v12Route()!=='competition') return;
  const screen=document.querySelector('#screen');
  const tabs=screen?.querySelector('.tabs');
  if(!screen||!tabs) return;
  const active=tabs.querySelector('.tab.active');
  if(!active||!/Clasificaci/i.test(active.textContent||'')) return;
  if(screen.querySelector('[data-v12-standings]')) return;
  let node=tabs.nextSibling;
  while(node){const next=node.nextSibling;node.remove();node=next}
  tabs.insertAdjacentHTML('afterend',v12StandingsBody());
}

function profileMenuRow(icon,label,route,action){
  const attr=route?'data-v12-route="'+route+'"':'data-v12-action="'+action+'"';
  return '<button class="v12-profile-row" '+attr+'><span class="v12-profile-row-icon">'+icon+'</span><span>'+label+'</span><b>›</b></button>';
}
function patchProfile(){
  if(v12Route()!=='profile') return;
  const screen=document.querySelector('#screen');
  if(!screen||screen.querySelector('[data-v12-profile]')) return;
  screen.innerHTML='<section class="v12-profile-page" data-v12-profile>'+
    '<div class="v12-profile-card">'+
      '<div class="v12-profile-copy"><h1>Liga Municipal<br>de Futbol</h1><h2>Juventino Rosas, Gto.</h2><p>Crea tu cuenta y disfruta de un acceso inigualable a resultados, estadísticas, calendarios, equipos de la liga y mucho más.</p></div>'+
      v12Logo(V12_LOGO,'Liga Municipal de Fútbol Juventino Rosas','v12-profile-logo')+
      '<div class="v12-profile-actions"><button class="outline" data-v12-action="login">Iniciar sesión</button><button class="solid" data-v12-action="create">Crear una cuenta</button></div>'+
    '</div>'+
    '<div class="v12-profile-menu">'+
      profileMenuRow('☆','Siguiendo','following')+
      profileMenuRow('♧','Notificaciones','notifications')+
      profileMenuRow('◎','Tu idioma preferido',null,'language')+
      profileMenuRow('▤','Ayúdanos a mejorar',null,'feedback')+
      profileMenuRow('','Ajustes de privacidad','privacy')+
    '</div>'+
  '</section>';
}
function avatarSvg(color){
  return '<div class="v12-avatar" style="--av:'+color+'"><svg viewBox="0 0 96 96" aria-hidden="true"><path d="M30 35c0-14 8-22 18-22s18 8 18 22c0 11-4 19-9 24v8H39v-8c-5-5-9-13-9-24Z" fill="#d7d7d7"/><path d="M25 30c4-16 12-25 23-25 10 0 20 8 24 24l-7 2c-2-8-8-12-17-12-8 0-14 4-17 13Z" fill="#a9a9a9"/><path d="M38 57h20l14 9c6 4 10 10 11 18H13c1-8 5-14 11-18Z" fill="var(--av)"/></svg></div>'
}
function curveArrow(color,flip=false){
  return '<svg class="v12-curve-arrow '+(flip?'flip':'')+'" viewBox="0 0 100 150" aria-hidden="true"><path d="M25 130C55 90 60 55 45 20" fill="none" stroke="'+color+'" stroke-width="8" stroke-linecap="round"/><path d="M36 27 46 12l14 14" fill="none" stroke="'+color+'" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
}
function patchMoreLess(){
  if(v12Route()!=='moreLess') return;
  const screen=document.querySelector('#screen');
  if(!screen||screen.querySelector('[data-v12-moreless]')) return;
  screen.innerHTML='<section class="v12-moreless" data-v12-moreless>'+
    '<div class="v12-ml-title"><span>MÁS</span><small>O</small><span>MENOS</span></div>'+
    '<div class="v12-ml-curves"><div class="down">'+curveArrow('#ff0048',true)+'</div><div class="up">'+curveArrow('#21f06b',false)+'</div></div>'+
    v12Logo(V12_LOGO,'Liga Municipal de Fútbol Juventino Rosas','v12-ml-logo')+
    '<div class="v12-ml-choice">'+
      '<button data-v12-choice="more" aria-label="Elegir más">'+avatarSvg('#c776e8')+'</button>'+
      '<div class="v12-ml-mid"><button data-v12-choice="more" class="up-arrow">▲</button><button data-v12-choice="less" class="down-arrow">▼</button></div>'+
      '<button data-v12-choice="less" aria-label="Elegir menos">'+avatarSvg('#77f1ea')+'</button>'+
    '</div>'+
    '<div class="v12-stadium" aria-hidden="true"><i></i><b></b></div>'+
  '</section>';
}
function v12Toast(text){
  let t=document.querySelector('.v12-toast');
  if(!t){t=document.createElement('div');t.className='v12-toast';document.body.appendChild(t)}
  t.textContent=text;t.classList.add('show');clearTimeout(v12Toast.t);v12Toast.t=setTimeout(()=>t.classList.remove('show'),1700)
}

const V12_FIXTURE_LOGOS={
  'Club América Vet.':'assets/branding/america-veteranos-35-user.png',
  'La Huerta':'assets/teams/la-huerta-cuenda.webp',
  'Promesas FC':'assets/teams/promesas-fc-pozos.webp',
  'Santa Cruz':'assets/teams/atletico-santa-cruz.webp',
  'Franco FC':'assets/teams/franco-fc.webp',
  'Cuenda':'assets/official-logos/toros-de-cuenda.png',
  'Atlético Galeana':'assets/teams/atletico-galeana.webp',
  'Lobos CDG':'assets/teams/lobos-cdg.webp',
  'Juventino':null,
  'Rincón de Centeno':null,
  'Deportivo Rosas':null,
  'Pozos':'assets/teams/pozos-fc.webp'
};
function v12FixtureLogo(name){
  const p=V12_FIXTURE_LOGOS[name];
  if(p) return '<img src="'+V12_TEAM_ASSET_BASE+p+'" alt="'+name+'" class="v12-fixture-logo" loading="eager" decoding="async">';
  if(name==='Juventino') return '<img src="'+V12_LOGO+'" alt="'+name+'" class="v12-fixture-logo" loading="eager" decoding="async">';
  const ab=name.split(/\s+/).map(x=>x[0]).join('').slice(0,3).toUpperCase();
  return '<span class="v12-fixture-fallback">'+ab+'</span>';
}
const V12_DAY_13=[
  ['Club América Vet.','La Huerta','10:45','m1'],
  ['Promesas FC','Santa Cruz','10:45','m2'],
  ['Franco FC','Cuenda','13:00','m2'],
  ['Atlético Galeana','Lobos CDG','13:00','m1'],
  ['Juventino','Rincón de Centeno','13:00','m1'],
  ['Deportivo Rosas','Pozos','13:00','m2'],
  ['La Huerta','Franco FC','13:00','m2'],
  ['Promesas FC','Club América Vet.','13:00','m1'],
  ['Lobos CDG','Cuenda','13:00','m2']
];
const V12_DAY_14=[
  ['Deportivo Rosas','Pozos','10:45','m2'],
  ['Juventino','La Huerta','13:00','m1'],
  ['Franco FC','Promesas FC','13:00','m2']
];
function v12FixtureRow(m){
  return '<div class="v12-schedule-match">'+
    '<div class="v12-schedule-clubs">'+
      '<div>'+v12FixtureLogo(m[0])+'<b>'+m[0]+'</b></div>'+
      '<div>'+v12FixtureLogo(m[1])+'<b>'+m[1]+'</b></div>'+
    '</div>'+
    '<div class="v12-schedule-meta"><time>'+m[2]+'</time><button data-match="'+m[3]+'">Ver detalles</button></div>'+
  '</div>';
}
function v12ScheduleCard(list){
  return '<section class="v12-schedule-card"><h3>Liga local - Jornada 2</h3><div>'+list.map(v12FixtureRow).join('')+'</div></section>';
}
function v12FixturesMarkup(){
  return '<section class="v12-fixtures-reference" data-v12-fixtures>'+
    '<div class="v12-date-strip">'+
      '<button data-v12-date="9">mié 9 sept</button>'+
      '<button data-v12-date="10">jue 10 sept</button>'+
      '<button class="active" data-v12-date="13">mar 13 oct</button>'+
      '<button data-v12-date="14">mié 14 oct</button>'+
    '</div>'+
    '<h2 id="v12-day-13">martes, 13 octubre 2026</h2>'+
    v12ScheduleCard(V12_DAY_13)+
    '<div class="v12-league-banner"><img src="'+V12_LOGO+'" alt="Liga Juventino"><strong>LIGA MUNICIPAL DE FÚTBOL<br>JUVENTINO ROSAS, GUANAJUATO</strong><i>⚽</i></div>'+
    '<h2 id="v12-day-14">miércoles, 14 octubre 2026</h2>'+
    v12ScheduleCard(V12_DAY_14)+
  '</section>';
}
function patchFixturesReference(){
  if(v12Route()!=='competition') return;
  const screen=document.querySelector('#screen');
  const tabs=screen?.querySelector('.tabs');
  if(!screen||!tabs) return;
  const active=tabs.querySelector('.tab.active');
  if(!active||!/Partidos/i.test(active.textContent||'')) return;
  if(screen.querySelector('[data-v12-fixtures]')) return;
  let node=tabs.nextSibling;
  while(node){const next=node.nextSibling;node.remove();node=next}
  tabs.insertAdjacentHTML('afterend',v12FixturesMarkup());
}

function v12NavBrand(){
  const labels={home:'Inicio',competition:'Competición',video:'Video',fantasy:'Fantasy',more:'Más'};
  document.querySelectorAll('.bottom-nav .nav-item').forEach(item=>{
    const small=item.querySelector('small');
    if(small&&labels[item.dataset.route]) small.textContent=labels[item.dataset.route];
  });
  const comp=document.querySelector('.bottom-nav .nav-item[data-route="competition"] .nav-icon');
  if(comp) comp.innerHTML='<svg class="v12-competition-field-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="M5.25 3.5h13.5A1.75 1.75 0 0 1 20.5 5.25v13.5a1.75 1.75 0 0 1-1.75 1.75H5.25a1.75 1.75 0 0 1-1.75-1.75V5.25A1.75 1.75 0 0 1 5.25 3.5Zm0 1.5a.25.25 0 0 0-.25.25v6h4.56a2.75 2.75 0 0 1 4.88 0H19v-6a.25.25 0 0 0-.25-.25H15v2.25A.75.75 0 0 1 14.25 8h-4.5A.75.75 0 0 1 9 7.25V5H5.25ZM10.5 5v1.5h3V5h-3ZM5 12.75v6c0 .138.112.25.25.25H9v-2.25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75V19h3.75a.25.25 0 0 0 .25-.25v-6h-4.56a2.75 2.75 0 0 1-4.88 0H5Zm5.5 6.25h3v-1.5h-3V19ZM12 10.75a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Z"/></svg>';
  const profile=document.querySelector('.topbar .profile-button');
  if(profile) profile.innerHTML='<svg class="v12-profile-master-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12,13C13.933,13 15.5,11.433 15.5,9.5C15.5,7.567 13.933,6 12,6C10.067,6 8.5,7.567 8.5,9.5C8.5,11.433 10.067,13 12,13ZM23,12C23,18.0751 18.0751,23 12,23C5.9249,23 1,18.0751 1,12C1,5.9249 5.9249,1 12,1C18.0751,1 23,5.9249 23,12ZM18.9089,17.7681C17.7577,15.8144 15.0622,14.5 12,14.5C8.9417,14.5 6.2438,15.8117 5.0911,17.7682C3.7857,16.2062 3,14.1949 3,12C3,7.0294 7.0294,3 12,3C16.9706,3 21,7.0294 21,12C21,14.1948 20.2144,16.2061 18.9089,17.7681Z" fill="currentColor"/></svg>';
}
function patch(){
  v12NavBrand();
  patchStandings();
  patchFixturesReference();
  patchProfile();
  patchMoreLess();
}
document.addEventListener('click',e=>{
  const dateBtn=e.target.closest('[data-v12-date]');
  if(dateBtn){
    document.querySelectorAll('[data-v12-date]').forEach(b=>b.classList.toggle('active',b===dateBtn));
    const id=dateBtn.dataset.v12Date==='14'?'v12-day-14':'v12-day-13';
    document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'});
    return;
  }
  const route=e.target.closest('[data-v12-route]');
  if(route){e.preventDefault();location.hash='#/'+route.dataset.v12Route;return}
  const mode=e.target.closest('[data-v12-mode]');
  if(mode){
    const box=mode.closest('.v12-standings-reference');
    box.querySelectorAll('[data-v12-mode]').forEach(b=>b.classList.toggle('active',b===mode));
    box.querySelector('[data-v12-stand-content]').innerHTML=v12Rows(mode.dataset.v12Mode);
    return;
  }
  const action=e.target.closest('[data-v12-action]');
  if(action){
    const a=action.dataset.v12Action;
    if(a==='login') v12Toast('Inicio de sesión listo para conectar');
    if(a==='create') v12Toast('Registro de cuenta listo para conectar');
    if(a==='language') v12Toast('Idioma: Español (México)');
    if(a==='feedback') v12Toast('Gracias. Aquí se conectará el formulario de comentarios.');
    return;
  }
  const choice=e.target.closest('[data-v12-choice]');
  if(choice){
    document.querySelectorAll('[data-v12-choice]').forEach(x=>x.classList.remove('selected'));
    choice.classList.add('selected');
    v12Toast(choice.dataset.v12Choice==='more'?'Elegiste MÁS':'Elegiste MENOS');
  }
},true);
window.addEventListener('hashchange',()=>requestAnimationFrame(patch));
const obs=new MutationObserver(()=>requestAnimationFrame(patch));
const target=document.querySelector('#screen');
if(target) obs.observe(target,{childList:true,subtree:false});
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(patch),{once:true}); else requestAnimationFrame(patch);
