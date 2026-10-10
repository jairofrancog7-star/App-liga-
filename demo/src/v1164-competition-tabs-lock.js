/* V1164 — Competición: geometría única, persistente y sin dos subrayados.
 * Soluciona los estilos por nth-child y por v40-standings-master que reubican
 * las pestañas cuando el render principal reconstruye #screen.
 * No altera las rutas, los listeners de las pestañas ni los datos deportivos.
 */
(function(){
 'use strict';
 if(window.__LJR_V1164_COMPETITION_TABS__)return;
 window.__LJR_V1164_COMPETITION_TABS__=true;

 const TYPES=['fixtures','standings','bracket'];
 let queued=false, watchedScreen=null;
 const observer=new MutationObserver(()=>queue());

 function set(el,prop,val){
   if(el.style.getPropertyValue(prop)!==val||el.style.getPropertyPriority(prop)!=='important')
     el.style.setProperty(prop,val,'important');
 }
 function inCompetition(){
   return document.body?.dataset?.appRoute==='competition' ||
     String(location.hash||'').replace(/^#\/?/,'').split('?')[0]==='competition';
 }
 function stylesFor(tabs,buttons){
   // Preserve sticky positioning/top handled by scrolling modules.
   document.body.classList.add('v1164-tabs-ready');
   const barRules={
     'display':'grid','grid-template-columns':'minmax(0,1.42fr) minmax(0,1fr) minmax(0,.75fr)',
     'grid-auto-flow':'column','align-items':'stretch','justify-items':'stretch',
     'gap':'0px','box-sizing':'border-box',
     'width':'calc(100% + 28px)','max-width':'none','min-width':'0px',
     'height':'48px','min-height':'48px','max-height':'48px',
     'margin-left':'-14px','margin-right':'-14px',
     'padding-left':'8px','padding-right':'8px',
     'overflow':'visible','transform':'none','opacity':'1','visibility':'visible'
   };
   Object.entries(barRules).forEach(([p,v])=>set(tabs,p,v));
   const size=window.innerWidth<=355?'11.5px':window.innerWidth<=430?'13px':'14px';
   buttons.forEach((btn,i)=>{
     const rules={
       'display':'flex','position':'relative',
       'align-items':'center','justify-content':'center',
       'justify-self':'stretch','align-self':'stretch',
       'box-sizing':'border-box','width':'100%','min-width':'0px','max-width':'none',
       'height':'48px','min-height':'48px','max-height':'48px',
       'margin':'0px','padding':'0px 2px 6px',
       'top':'auto','left':'auto','right':'auto','bottom':'auto',
       'border':'0px','border-radius':'0px','background':'transparent',
       'font-size':size,'font-family':'Inter, Roboto, Arial, sans-serif',
       'font-weight':'700','line-height':'1','letter-spacing':'-0.02em',
       'white-space':'nowrap','text-align':'center',
       'transform':'none','text-transform':'none','overflow':'visible',
       'box-shadow':'none','text-shadow':'none'
     };
     Object.entries(rules).forEach(([p,v])=>set(btn,p,v));
     set(btn,'color',btn.classList.contains('active')?'#22e5ef':'#d9d9e7');
     // The same real indicator element is used for all 3 tabs.
     let line=btn.querySelector(':scope > .v1164-tab-indicator');
     if(!line){
       line=document.createElement('span');
       line.className='v1164-tab-indicator';
       line.setAttribute('aria-hidden','true');
       btn.appendChild(line);
     }
     const underline={
       'position':'absolute','display':'block','top':'auto','bottom':'1px',
       'left':'7%','right':'7%','width':'auto','height':'4px',
       'min-height':'4px','max-height':'4px','margin':'0px','padding':'0px',
       'background':btn.classList.contains('active')?'#22e5ef':'transparent',
       'border':'0px','border-radius':'10px 10px 0px 0px',
       'opacity':btn.classList.contains('active')?'1':'0',
       'visibility':btn.classList.contains('active')?'visible':'hidden',
       'pointer-events':'none','transform':'none'
     };
     Object.entries(underline).forEach(([p,v])=>set(line,p,v));
     // Suppress legacy internal lines; indicators were only in 2 of the tabs.
     btn.querySelectorAll(':scope > .v86-tab-line').forEach(el=>set(el,'display','none'));
   });
 }
 function sync(){
   queued=false;
   if(!inCompetition()||window.innerWidth>1023){
     document.body.classList.remove('v1164-tabs-ready');
     return;
   }
   const tabs=document.querySelector('#screen > .tabs');
   if(!tabs)return;
   const buttons=TYPES.map(type=>tabs.querySelector(':scope > .tab[data-comp-tab="'+type+'"]'));
   if(buttons.some(x=>!x))return;
   stylesFor(tabs,buttons);
 }
 function queue(){
   if(queued)return;
   queued=true;requestAnimationFrame(sync);
 }
 function attach(){
   const screen=document.querySelector('#screen');
   if(screen&&screen!==watchedScreen){
     if(watchedScreen)observer.disconnect();
     watchedScreen=screen;
     observer.observe(document.body,{attributes:true,attributeFilter:['data-app-route']});
     observer.observe(screen,{childList:true,subtree:false});
   }else if(!watchedScreen){
     observer.observe(document.body,{attributes:true,attributeFilter:['data-app-route']});
   }
   queue();
 }
 document.addEventListener('click',e=>{
   if(!inCompetition()||!e.target.closest?.('#screen > .tabs .tab'))return;
   queue();
   setTimeout(queue,0);
 },true);
 window.addEventListener('hashchange',()=>{attach();setTimeout(attach,60)});
 window.addEventListener('resize',queue,{passive:true});
 window.addEventListener('load',attach);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',attach,{once:true});
 else attach();
})();
