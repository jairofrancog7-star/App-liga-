/* V991 — the Rankings header becomes compact on vertical scroll.
   No DOM reparenting, no interference with the existing tab/filter handlers. */
(()=>{
'use strict';
const CLASS='v991-rankings-compact';
let attached=null,compact=false,frame=0;
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0];
function sync(){
frame=0;
const screen=document.getElementById('screen');
if(route()!=='rankings'||!screen?.querySelector('.v32-rankings:not(.v32-filter-mode)>.v32-head')){
 compact=false;document.body.classList.remove(CLASS);return;
}
const y=Math.max(0,screen.scrollTop||0);
compact=compact?y>42:y>90;
document.body.classList.toggle(CLASS,compact);
}
function queue(){if(!frame)frame=requestAnimationFrame(sync)}
function connect(){
const el=document.getElementById('screen');
if(el!==attached){
 if(attached)attached.removeEventListener('scroll',queue);
 attached=el;
 if(el)el.addEventListener('scroll',queue,{passive:true});
}
queue();
}
window.addEventListener('hashchange',()=>{compact=false;document.body.classList.remove(CLASS);connect()});
window.addEventListener('pageshow',connect);
window.addEventListener('resize',queue,{passive:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',connect,{once:true});
else connect();
})();