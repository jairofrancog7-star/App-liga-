import {homeView,competitionView,videoView,fantasyView,moreView} from './primary-views.js';
import {followingView,teamsView,statsView,momentsView,scorersView,predictorView,quizView,moreLessView,rankingsView,historyView,profileView,notificationsView,privacyView} from './secondary-views.js';
import {TEAM} from './data.js';
import {crest} from './helpers.js';
import {ICONS} from './icons.js';
import {uiState,persistFollowing,persistFavorite,persistNotifications} from './state.js';

const views={home:homeView,competition:competitionView,video:videoView,fantasy:fantasyView,more:moreView,following:followingView,teams:teamsView,stats:statsView,moments:momentsView,scorers:scorersView,predictor:predictorView,quiz:quizView,moreLess:moreLessView,rankings:rankingsView,history:historyView,profile:profileView,notifications:notificationsView,privacy:privacyView};
const moreRoutes=new Set(['following','teams','stats','moments','scorers','predictor','quiz','moreLess','rankings','history','profile','notifications','privacy','venues','store']);
const route=()=>location.hash.replace(/^#\/?/,'')||'home';
const go=r=>{location.hash='#/'+r};
let rendering=false;

const NAV_ICONS={
 home:['navHome','navHomeActive'],
 competition:['navCompetition','navCompetitionActive'],
 video:['navVideo','navVideoActive'],
 fantasy:['navFantasy','navFantasyActive'],
 more:['navMore','navMoreActive']
};
function installReferenceNavIcons(){
 document.querySelectorAll('.bottom-nav .nav-item').forEach(btn=>{
  const slot=btn.querySelector('.nav-icon');
  const pair=NAV_ICONS[btn.dataset.route];
  const key=pair?.[btn.classList.contains('active')?1:0];
  const svg=ICONS[key];
  if(slot&&svg)slot.innerHTML=svg;
 });
}
function updateNav(r){
 document.querySelectorAll('.bottom-nav .nav-item').forEach(btn=>{
  const rr=btn.dataset.route;
  btn.classList.toggle('active',rr===r||(rr==='more'&&moreRoutes.has(r)));
 });
 installReferenceNavIcons();
}
function render(){const r=route();const screen=document.querySelector('#screen');const fn=views[r];if(!screen||!fn||rendering)return;rendering=true;screen.innerHTML=fn();screen.dataset.v11Applied=r;document.body.classList.add('v11-active');updateNav(r);rendering=false;}

function ensureOverlayRoot(){let root=document.querySelector('#v11-sheet-root');if(!root){root=document.createElement('div');root.id='v11-sheet-root';document.body.append(root)}return root;}
function closeOverlay(){ensureOverlayRoot().replaceChildren();}
function openTeamSheet(teamId){const t=TEAM(teamId);ensureOverlayRoot().innerHTML=`<div class="v11-sheet-backdrop" data-action="close-sheet"></div><section class="v11-sheet">${crest(t.id)}<h2>${t.name}</h2><button data-action="favorite" data-value="${t.id}">${uiState.favorite===t.id?'★':'☆'} Equipo favorito</button><button data-action="unfollow" data-value="${t.id}">− Dejar de seguir</button></section>`;}
function openLanguage(){ensureOverlayRoot().innerHTML=`<div class="v11-sheet-backdrop" data-action="close-sheet"></div><section class="v11-sheet v11-language-sheet"><h2>Tu idioma preferido</h2><label><input type="radio" name="lj-language" value="Español" checked> Español</label><label><input type="radio" name="lj-language" value="English"> English</label><div><button data-action="close-sheet">Cancelar</button><button data-action="language-ok">OK</button></div></section>`;}
function toast(text){let t=document.querySelector('#v11-toast');if(!t){t=document.createElement('div');t.id='v11-toast';document.body.append(t)}t.textContent=text;t.className='show';clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.className='',1800);}
async function share(){if(navigator.share){try{await navigator.share({title:'Liga Juventino',text:'Liga Municipal de Fútbol Juventino Rosas',url:location.href});return}catch(e){if(e?.name==='AbortError')return}}try{await navigator.clipboard.writeText(location.href);toast('Enlace copiado')}catch{toast('No se pudo compartir')}}

function handleAction(el){const action=el.dataset.action;const value=el.dataset.value;
 if(action==='back'){if(ensureOverlayRoot().childElementCount){closeOverlay();return}history.back();return}
 if(action==='comp-tab'){uiState.competitionTab=value;render();return}
 if(action==='date'){uiState.selectedDate=value;render();requestAnimationFrame(()=>document.querySelector('.v11-date-strip .active')?.scrollIntoView({inline:'center',block:'nearest',behavior:'smooth'}));return}
 if(action==='standings'){uiState.standingsMode=value;render();return}
 if(action==='phase'){uiState.bracketPhase=value;render();return}
 if(action==='stats-tab'){uiState.statsTab=value;render();return}
 if(action==='rank-tab'){uiState.rankingsTab=value;render();return}
 if(action==='history-tab'){uiState.historyTab=value;render();return}
 if(action==='fantasy-login'){uiState.fantasyLogin=true;render();return}
 if(action==='fantasy-close'){uiState.fantasyLogin=false;render();return}
 if(action==='team-sheet'){openTeamSheet(value);return}
 if(action==='close-sheet'){closeOverlay();return}
 if(action==='follow'){if(uiState.followed.includes(value))openTeamSheet(value);else{uiState.followed.push(value);persistFollowing();render()}return}
 if(action==='unfollow'){uiState.followed=uiState.followed.filter(x=>x!==value);if(uiState.favorite===value)uiState.favorite='';persistFollowing();persistFavorite();closeOverlay();render();return}
 if(action==='favorite'){if(!uiState.followed.includes(value))uiState.followed.push(value);uiState.favorite=value;persistFollowing();persistFavorite();closeOverlay();render();return}
 if(action==='quiz'){uiState.quizSelection=Number(value);render();return}
 if(action==='language'){openLanguage();return}
 if(action==='language-ok'){const chosen=document.querySelector('input[name="lj-language"]:checked')?.value||'Español';uiState.language=chosen;localStorage.setItem('lj-v11-language',chosen);closeOverlay();toast('Idioma guardado');return}
 if(action==='login'){go('profile');return}
 if(action==='feedback'){toast('Gracias por tus comentarios');return}
 if(action==='privacy-all'){localStorage.setItem('lj-v11-privacy','all');toast('Preferencias guardadas');return}
 if(action==='privacy-none'){localStorage.setItem('lj-v11-privacy','none');toast('Preferencias guardadas');return}
 if(action==='share'){share();return}
}

function install(){const screen=document.querySelector('#screen');if(!screen)return;installReferenceNavIcons();const observer=new MutationObserver(()=>{if(rendering)return;const r=route();if(views[r]&&screen.dataset.v11Applied!==r)requestAnimationFrame(render)});observer.observe(screen,{childList:true});window.addEventListener('hashchange',()=>requestAnimationFrame(render));document.addEventListener('click',e=>{const routeEl=e.target.closest('[data-route]');if(routeEl&&routeEl.closest('.v11-ref-pack')){e.preventDefault();const target=routeEl.dataset.route;if(views[target])go(target);else{toast('Sección en preparación');}return}const actionEl=e.target.closest('[data-action]');if(actionEl&&actionEl.closest('.v11-ref-pack, #v11-sheet-root')){e.preventDefault();handleAction(actionEl)}});document.addEventListener('input',e=>{if(e.target.matches('[data-action="team-search"]')){const q=e.target.value.toLowerCase();document.querySelectorAll('.v11-teams-list>[data-team-name]').forEach(row=>row.hidden=!row.dataset.teamName.includes(q))}});document.addEventListener('change',e=>{if(e.target.matches('[data-action="notify"]')){uiState.notifications[e.target.dataset.value]=e.target.checked;persistNotifications()}});requestAnimationFrame(render);}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
