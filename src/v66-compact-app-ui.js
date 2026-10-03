/* V66 — compact content sizing for tool/directory routes.
   Header ownership was moved to v7-brand.js. This module no longer renders a
   second back/profile bar inside #screen. */
(function(){
'use strict';

const ROUTES=new Set([
  'leagueTools','rulebook','matchday','weatherFields','venues','cedulas','cedulaDetail','credential',
  'cedulaBuilder','permissionBuilder','publications','tactics','simulator','jrControl','v38Stats','v38Weekly','v38Weather','v38Alerts',
  'bracketBuilder','agendaBuilder','motionHub','suspensionTool','ligaQR','club-store','scorers','players',
  'credentialBuilder','tableExport'
]);

function route(){
  return (location.hash.replace(/^#\/?/,'')||'home').split('?')[0];
}
function apply(){
  const r=route(),on=ROUTES.has(r);
  document.body.classList.toggle('v66-compact-route',on);
  document.body.dataset.v66CompactRoute=on?r:'';

  /* Remove legacy duplicates instead of hiding them underneath the real header. */
  document.querySelectorAll('[data-v66-compact-top]').forEach(el=>el.remove());
}
function schedule(){requestAnimationFrame(()=>requestAnimationFrame(apply))}
window.addEventListener('hashchange',schedule);
window.addEventListener('popstate',schedule);
const screen=document.querySelector('#screen');
if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:false});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
})();