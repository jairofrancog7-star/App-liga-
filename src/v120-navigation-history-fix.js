/* V924 compatibility: route every real page-back control to the same history stack.
   The single scroll/tab restorer lives in v776-navigation.js. */
(function(){
 'use strict';
 if(window.__LJR_V924_BACK_BRIDGE__)return;
 window.__LJR_V924_BACK_BRIDGE__=true;

 function back(){
  if(window.LJR_NAVIGATION?.back){window.LJR_NAVIGATION.back();return}
  // Safe fallback when the navigation module has not initialized.
  const r=String(location.hash||'').replace(/^#\/?/,'').split('?')[0];
  if(r!=='home')location.hash='#/home';
 }
 window.LJR_APP_BACK=back;

 const selector=[
  '#backButton',
  'button[aria-label="Volver"],a[aria-label="Volver"]',
  'button[aria-label="Regresar"],a[aria-label="Regresar"]',
  'button[aria-label="Atrás"],a[aria-label="Atrás"]',
  '[data-v41-close],[data-v501-back],[data-v440-back]',
  '.v66-compact-back',
  '[data-v20-back],[data-v46-back],[data-v52-back],[data-v62-back]',
  '[data-v27-back],[data-v28-back],[data-v31-back],[data-v32-back]',
  '[data-v33-back],[data-v33-about-back],[data-v35-back]',
  '[data-v40-back],[data-v42-back],[data-v123-back],[data-v129-back]',
  '[data-v372-back],[data-v379-back],[data-v412-back],[data-v429-back]',
  '.v26-back,.v26-moments-sticky-back,.v27-back,.v53-p6-back,.v440-tv-backmark'
 ].join(',');

 window.addEventListener('click',e=>{
  if(!(e.target instanceof Element))return;
  const target=e.target.closest(selector);if(!target)return;
  // Inside modals and games, back closes the overlay rather than leaving the page.
  if(target.closest('[role="dialog"],.modal,.v105-modal,.v16-player-modal,.v28-sheet-layer,.liga-media-modal,.v431-drawer'))return;
  if(target.matches('[data-v437-detail-back],[data-v369-picker-back],[data-v439-sub-back],[data-v48-game-back],[data-v28-close-sheet],[data-v28-close-picker],[data-v16-close],[data-v589-back]'))return;
  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
  back();
 },true);
})();