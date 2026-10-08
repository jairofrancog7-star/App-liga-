/* V937 — Auditor preventivo de huecos en todas las páginas.
   Sólo recorta reservas de margen, padding y altura de los módulos
   que están ENTRE otros bloques reales. No borra contenido ni placeholders. */
(function(){
 'use strict';
 if(window.__LJR_V937_NO_GAPS__)return;
 window.__LJR_V937_NO_GAPS__=true;
 const BLOCKS='.v28-match,.v60-tool-page,.v27-teams-page,.v27-team-detail,.v28-follow-page,.v28-scorers-page,.v35-history-page,.v399-stats-page,.v104-players,.v414-favorites,.v412-shell,.v413-shell,.v569-lower,.v571-lower,.v566-comp-lower,.v100-block,.v100-subblock,.v105-bottom,#v105-bottom,.v449-reference-lower,#v449-reference-lower,#v422-results-reference,.v73-below-native';
 const EXCLUDE=new Set(['simulator','predictorSix','quizArena','moreLessGallery','bracketBuilder','fantasy','fantasyTeam','tactics']);
 const MAX_GAP=56,MAX_TAIL=85,STACK=10;
 let timeout=0,observedScreen=null,observer=null;
 function compactMode(){return window.matchMedia('(max-width:1023px)').matches}
 function route(){return (location.hash.replace(/^#\/?/,'').split('?')[0]||document.body?.dataset.appRoute||'home')}
 function px(value){const n=parseFloat(value);return Number.isFinite(n)?n:0}
 function visible(node){
  if(!(node instanceof HTMLElement)||!node.isConnected)return false;
  if(node.matches('script,style,link,template,[hidden],.topbar,.bottom-nav,[role="dialog"],[data-modal],.v105-modal'))return false;
  const st=getComputedStyle(node),r=node.getBoundingClientRect();
  return st.display!=='none'&&st.visibility!=='hidden'&&st.opacity!=='0'&&r.height>0&&r.width>0;
 }
 function flow(node){
  const position=getComputedStyle(node).position;
  return position!=='absolute'&&position!=='fixed'&&position!=='sticky';
 }
 function imp(node,property,value){
  if(node.style.getPropertyValue(property)===value&&node.style.getPropertyPriority(property)==='important')return false;
  node.style.setProperty(property,value,'important');return true;
 }
 function lastFlowBottom(node){
  let last=null;
  for(const child of node.children){
   if(visible(child)&&flow(child)){
    const r=child.getBoundingClientRect();
    if(!last||r.bottom>last)last=r.bottom;
   }
  }
  return last;
 }
 function shrinkTail(node,following,screen){
  if(!node.matches(BLOCKS)||!visible(node)||!flow(node))return;
  const style=getComputedStyle(node),rect=node.getBoundingClientRect();
  const bottom=lastFlowBottom(node);
  if(bottom===null)return;
  const tail=rect.bottom-bottom;
  if(tail<MAX_TAIL)return;
  const pad=px(style.paddingBottom),min=px(style.minHeight);
  const hasSingleClearance=px(getComputedStyle(screen).paddingBottom)>48;
  if(pad>65&&hasSingleClearance)imp(node,'padding-bottom','12px');
  if(following&&min>0&&rect.height>bottom-rect.top+60){
   imp(node,'min-height','0px');
   if(style.height!=='auto')imp(node,'height','auto');
  }
 }
 function audit(){
  if(!compactMode()||EXCLUDE.has(route()))return;
  const screen=document.getElementById('screen');
  if(!screen)return;
  const nodes=[...screen.children].filter(node=>visible(node)&&flow(node));
  for(let index=0;index<nodes.length-1;index++){
   const before=nodes[index],after=nodes[index+1];
   const gap=after.getBoundingClientRect().top-before.getBoundingClientRect().bottom;
   if(gap>MAX_GAP){
    const b=getComputedStyle(before),a=getComputedStyle(after);
    if(px(b.marginBottom)>22)imp(before,'margin-bottom',STACK+'px');
    if(px(a.marginTop)>22)imp(after,'margin-top',STACK+'px');
   }
   if(before.matches(BLOCKS))shrinkTail(before,after,screen);
  }
  const last=nodes[nodes.length-1];
  if(last?.matches(BLOCKS)){
   const style=getComputedStyle(last),pb=px(style.paddingBottom);
   if(px(getComputedStyle(screen).paddingBottom)>50&&px(style.marginBottom)>30)imp(last,'margin-bottom','0px');
   if(pb>85&&lastFlowBottom(last)!==null&&last.getBoundingClientRect().bottom-lastFlowBottom(last)>90){
    imp(last,'padding-bottom','12px');
   }
  }
 }
 function schedule(){
  clearTimeout(timeout);
  timeout=setTimeout(()=>requestAnimationFrame(()=>requestAnimationFrame(audit)),75);
 }
 function bind(){
  const screen=document.getElementById('screen');
  if(!screen)return;
  if(screen!==observedScreen){
   observer?.disconnect();observedScreen=screen;
   observer=new MutationObserver(schedule);
   observer.observe(screen,{childList:true,subtree:true});
  }
  schedule();
 }
 addEventListener('hashchange',schedule);
 addEventListener('resize',schedule);
 addEventListener('pageshow',bind);
 addEventListener('load',bind);
 document.addEventListener('DOMContentLoaded',bind);
 document.addEventListener('ljr:official-data',schedule);
 if(document.readyState!=='loading')bind();
 window.LJR_V937_SPACING={audit,schedule};
})();
