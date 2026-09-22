/* V66 — barra superior compacta común para páginas nuevas.
   Reemplaza encabezados grandes por una barra tipo app: volver + perfil. */
(function(){
'use strict';
const ROUTES=new Set([
  'leagueTools','rulebook','matchday','weatherFields','venues','cedulas','cedulaDetail','credential',
  'cedulaBuilder','publications','tactics','simulator','jrControl','v38Stats','v38Weekly','v38Weather','v38Alerts',
  'bracketBuilder','agendaBuilder','motionHub','suspensionTool','ligaQR','club-store','scorers','players'
]);
function route(){return location.hash.replace(/^#\/?/,'')||'home'}
function backSvg(){return '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M20.5 7.5 12 16l8.5 8.5M12.5 16H27"/></svg>'}
function profileSvg(){return '<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="10.5" r="5.2"/><path d="M7.5 27c.9-6.1 4.4-9.3 8.5-9.3s7.6 3.2 8.5 9.3"/></svg>'}
function markup(){
  return '<div class="v66-compact-top" data-v66-compact-top>'+
    '<button type="button" class="v66-compact-back" aria-label="Volver">'+backSvg()+'</button>'+
    '<button type="button" class="v66-compact-profile" aria-label="Mi cuenta">'+profileSvg()+'</button>'+
  '</div>';
}
function apply(){
  const r=route(),on=ROUTES.has(r);
  document.body.classList.toggle('v66-compact-route',on);
  document.body.dataset.v66CompactRoute=on?r:'';
  if(!on){
    document.querySelectorAll('[data-v66-compact-top]').forEach(el=>el.remove());
    return;
  }
  const screen=document.querySelector('#screen');if(!screen)return;
  if(!screen.querySelector('[data-v66-compact-top]'))screen.insertAdjacentHTML('afterbegin',markup());
  screen.querySelector('.v66-compact-back')?.addEventListener('click',()=>{
    if(history.length>1)history.back();else location.hash='#/more';
  },{once:true});
  screen.querySelector('.v66-compact-profile')?.addEventListener('click',()=>{location.hash='#/profile'},{once:true});
}
function schedule(){requestAnimationFrame(()=>requestAnimationFrame(apply))}
window.addEventListener('hashchange',schedule);
const s=document.querySelector('#screen');
if(s)new MutationObserver(()=>{if(ROUTES.has(route())&&!s.querySelector('[data-v66-compact-top]'))schedule()}).observe(s,{childList:true,subtree:false});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
})();