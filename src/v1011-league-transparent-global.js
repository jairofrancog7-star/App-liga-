/* V1011 — Usar el escudo institucional PNG transparente, sin filtros.
 * Solo sustituye las rutas ANTIGUAS conocidas de Liga (no escudos de equipos).
 * Mantiene intactos los píxeles del nuevo PNG y los colores de cada pantalla. */
(()=>{
 'use strict';
 if(window.__LJR_V1011_TRANSPARENT_LIGA__)return;
 window.__LJR_V1011_TRANSPARENT_LIGA__=true;
 const PNG=new URL('./assets/branding/escudo-liga-azul-sin-fondo-v1007.png?v=v1011-global-transparent',document.baseURI).href;
 const LEGACY=/(?:^|\/)assets\/liga-logo(?:-original)?\.webp(?:[?#]|$)/i;
 const LEGACY_URL=/(?:https?:\/\/[^)'"\s]+\/)?(?:\.\/)?assets\/liga-logo(?:-original)?\.webp(?:\?[^)'"\s]*)?/gi;
 function fixImg(img){
   if(!(img instanceof HTMLImageElement))return;
   const raw=img.getAttribute('src')||'';
   if(!LEGACY.test(raw)&&!LEGACY.test(img.currentSrc||''))return;
   if(img.dataset.v1011TransparentLiga==='1'&&img.src===PNG)return;
   img.dataset.v1011TransparentLiga='1';
   if(img.hasAttribute('srcset'))img.removeAttribute('srcset');
   img.src=PNG;
 }
 function fixBackground(el){
   if(!(el instanceof HTMLElement||el instanceof SVGElement))return;
   const image=el.style?.backgroundImage||'';
   if(!image||!LEGACY.test(image))return;
   const updated=image.replace(LEGACY_URL,'"'+PNG+'"');
   // Use the normal CSS url syntax; never add effects or pixel processing.
   el.style.backgroundImage=updated.replace(/url\(\s*['"]?"(https?:[^"']+)"['"]?\s*\)/g,'url("$1")');
 }
 function fixNode(node){
   if(node?.nodeType!==1)return;
   if(node.matches?.('img'))fixImg(node);
   if(node.hasAttribute?.('style'))fixBackground(node);
   node.querySelectorAll?.('img').forEach(fixImg);
   node.querySelectorAll?.('[style]').forEach(fixBackground);
 }
 let initialized=false;
 function initialize(){
   if(initialized)return;
   initialized=true;
   fixNode(document.documentElement);
   const observer=new MutationObserver(entries=>{
     for(const entry of entries){
       if(entry.type==='attributes'){fixImg(entry.target);continue}
       for(const node of entry.addedNodes)fixNode(node);
     }
   });
   observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['src','srcset']});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initialize,{once:true});
 else initialize();
 window.LJR_TRANSPARENT_LEAGUE_LOGO=PNG;
})();
