/* V946 — hardfix del botón flotante de Fantasy.
   El filtro inferior NUNCA debe abrir el picker de jugadores.
   Se ejecuta antes de los módulos diferidos y captura el clic desde window. */
(function(){
'use strict';
if(window.__LJR_V946_FANTASY_DISPLAY_FILTER__)return;
window.__LJR_V946_FANTASY_DISPLAY_FILTER__=true;

const KEY='v576-display-metric';
const SQUAD_KEY='v576-fantasy-squad';
const VALID=new Set(['rival','date','price','points']);
let metric=localStorage.getItem(KEY)||'price';
if(!VALID.has(metric))metric='price';
let raf=0,observer=null;

const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const same=(a,b)=>norm(a)===norm(b);
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';
const active=()=>route()==='fantasyTeam'||document.body.classList.contains('v587-fantasy-team-open')||document.body.dataset.appRoute==='fantasyTeam';
const db=()=>{try{return window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||{}}catch(_){return window.LJR_OFFICIAL_DATA||{}}};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function squad(){
 try{
  const a=window.LJR_V576_FANTASY?.readSquad?.();
  if(Array.isArray(a))return a;
 }catch(_){}
 try{
  const a=JSON.parse(localStorage.getItem(SQUAD_KEY)||'[]');
  return Array.isArray(a)?a:[];
 }catch(_){return []}
}
function money(n){
 const v=Number(n||0).toFixed(1).replace('.0','');
 return '$'+v+' M';
}
function stamp(raw){
 const s=String(raw||''),m=s.match(/(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
 if(!m)return Number.POSITIVE_INFINITY;
 const t=new Date(+m[3],+m[2]-1,+m[1],+(m[4]||0),+(m[5]||0)).getTime();
 return Number.isFinite(t)?t:Number.POSITIVE_INFINITY;
}
function dateLabel(raw){
 const s=String(raw||'').trim(),m=s.match(/(\d{1,2})[\/-](\d{1,2})(?:[\/-]\d{2,4})?/);
 if(!m)return 'Fecha por confirmar';
 const months=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
 return Number(m[1])+' '+months[Math.max(0,Math.min(11,Number(m[2])-1))];
}
function nextMatch(p){
 const cat=db()?.categories?.[String(p?.cat||'')],out=[];
 for(const block of (cat?.fixtures||[])){
  for(const r of (block?.rows||[])){
   if(!Array.isArray(r)||!r[2]||!r[6])continue;
   if(!same(r[2],p.team)&&!same(r[6],p.team))continue;
   const hs=String(r[3]??'').trim(),as=String(r[5]??'').trim();
   if(/^\d+$/.test(hs)&&/^\d+$/.test(as))continue;
   out.push({home:String(r[2]||''),away:String(r[6]||''),date:String(r[8]||''),t:stamp(r[8])});
  }
 }
 if(!out.length)return null;
 const floor=Date.now()-6*3600000;
 out.sort((a,b)=>((Number.isFinite(a.t)&&a.t>=floor)?0:1)-((Number.isFinite(b.t)&&b.t>=floor)?0:1)||a.t-b.t);
 return out[0]||null;
}
function goals(p){
 const cat=db()?.categories?.[String(p?.cat||'')];
 for(const block of (cat?.scorers||[])){
  for(const r of (block?.rows||[])){
   if(Array.isArray(r)&&r.length>=4&&norm(r[1])===norm(p.name)&&same(r[2],p.team)&&/^\d+$/.test(String(r[3]||'')))return Number(r[3])||0;
  }
 }
 return 0;
}
function cards(p){
 const cat=db()?.categories?.[String(p?.cat||'')];let y=0,r=0;
 for(const block of (cat?.cards||[])){
  for(const row of (block?.rows||[])){
   if(!Array.isArray(row)||row.length<4||norm(row[1])!==norm(p.name)||!same(row[2],p.team))continue;
   const n=Number(row[3])||0,t=norm(row[0]);
   if(t.includes('amar'))y+=n;
   if(t.includes('roj'))r+=n;
  }
 }
 return {y,r};
}
function points(p){
 const direct=Number(p?.fantasyPoints??p?.points);
 if(Number.isFinite(direct))return Math.max(0,Math.round(direct));
 const c=cards(p);
 return Math.max(0,goals(p)*5-c.y-c.r*3);
}
function value(p){
 if(metric==='price')return money(p?.cost);
 if(metric==='points'){const n=points(p);return n+' '+(n===1?'pt':'pts')}
 const m=nextMatch(p);
 if(!m)return metric==='date'?'Fecha por confirmar':'Rival por confirmar';
 if(metric==='date')return dateLabel(m.date);
 const home=same(m.home,p.team),rival=home?m.away:m.home;
 return '- '+rival+' ('+(home?'H':'A')+')';
}
function metricIcon(id){
 if(id==='rival')return '<svg class="v948-metric-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="1.8"/><path d="M12 3.5v17M3.5 8h3.8a4.7 4.7 0 0 1 0 8H3.5M20.5 8h-3.8a4.7 4.7 0 0 0 0 8h3.8"/><circle cx="12" cy="12" r="2.2"/></svg>';
 if(id==='date')return '<svg class="v948-metric-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5.5" width="16" height="15" rx="2"/><path d="M8 3.5v4M16 3.5v4M4 9.5h16"/></svg>';
 if(id==='points')return '<span class="v948-text-icon">+1</span>';
 return '<span class="v948-text-icon v948-money-icon">$</span>';
}
function normalizePill(){
 if(!active())return;
 document.querySelectorAll('.v587-filter-pill').forEach(btn=>{
  btn.removeAttribute('data-v576-search');
  btn.setAttribute('data-v946-display-filter','');
  btn.setAttribute('aria-label','Cambiar dato mostrado: Rival, Fecha, Precio o Puntos totales');
  const b=btn.querySelector('b');if(b)b.innerHTML=metricIcon(metric);
 });
}
function imp(el,props){
 if(!el)return;
 for(const [k,v] of Object.entries(props))el.style.setProperty(k,String(v),'important');
}
function forceFantasyLayout(){
 if(!active())return;
 document.querySelectorAll('.v587-filter-pill').forEach(btn=>{
  imp(btn,{
   left:'20px',bottom:'98px',width:'96px','min-width':'96px','max-width':'96px',
   height:'48px','min-height':'48px','max-height':'48px',padding:'0 11px',
   'border-radius':'26px',display:'grid','grid-template-columns':'24px 1px 28px',
   'column-gap':'9px','align-items':'center','justify-content':'center',
   background:'#0b667a','box-shadow':'0 7px 16px rgba(0,36,70,.15)',zIndex:'25'
  });
  imp(btn.querySelector('.v590-filter-icon'),{width:'22px',height:'22px',transform:'none'});
  const div=btn.querySelector('i');imp(div,{width:'1px',height:'27px',background:'rgba(255,255,255,.34)'});
  const badge=btn.querySelector('b');imp(badge,{width:'28px','min-width':'28px',height:'28px',display:'grid','place-items':'center','font-size':'17px',margin:'0'});
 });
 const field=document.querySelector('.v576-field');
 imp(field,{'padding-bottom':'132px'});

 // Compact player cards like the supplied reference: same formation, less visual crowding.
 document.querySelectorAll('.v576-slot').forEach(slot=>{
  imp(slot,{width:'54px','min-width':'54px','max-width':'54px'});
 });
 document.querySelectorAll('.v576-field-row.del .v576-slot,.v576-field-row.por .v576-slot').forEach(slot=>{
  imp(slot,{width:'58px','min-width':'58px','max-width':'58px'});
 });
 document.querySelectorAll('.v576-slot.filled').forEach(slot=>{
  slot.style.setProperty('--shirt-width','44px','important');
  slot.style.setProperty('--shirt-height','52px','important');
  imp(slot,{'grid-template-rows':'52px 21px 18px'});
  const kit=slot.querySelector('.v590-kit-wrap');
  imp(kit,{
   width:'44px','min-width':'44px','max-width':'44px',
   height:'52px','min-height':'52px','max-height':'52px'
  });
  const name=slot.querySelector(':scope > b');
  imp(name,{
   width:'62px','min-width':'62px','max-width':'62px',
   height:'21px','min-height':'21px',padding:'3px 2px',
   'font-size':'8.4px','line-height':'15px','white-space':'nowrap',
   overflow:'hidden','text-overflow':'ellipsis'
  });
  const data=slot.querySelector(':scope > small');
  imp(data,{
   width:'62px','min-width':'62px','max-width':'62px',
   height:'18px','min-height':'18px',padding:'1px 2px',
   'font-size':'7.8px','line-height':'16px','white-space':'nowrap',
   overflow:'hidden','text-overflow':'ellipsis'
  });
  const remove=slot.querySelector('.remove');
  imp(remove,{width:'16px',height:'16px','min-width':'16px','min-height':'16px','font-size':'12px','line-height':'16px',right:'-5px',top:'0'});
 });

 // Give every card its real vertical room. The old 68px POR row was shorter
 // than shirt + name + metric and caused the goalkeeper cards to overlap.
 document.querySelectorAll('.v576-field-row.del,.v576-field-row.cen,.v576-field-row.def').forEach(row=>{
  imp(row,{height:'94px','align-items':'start',transform:'none'});
 });
 const por=document.querySelector('.v576-field-row.por');
 imp(por,{
  height:'102px','min-height':'102px','align-items':'start',
  transform:'translateY(6px)',padding:'0 24%'
 });

 // Put the floating metric control beside the goalkeeper row, like the reference.
 if(por){
  const pillTop=Math.max(0,por.offsetTop+42);
  document.querySelectorAll('.v587-filter-pill').forEach(btn=>{
   imp(btn,{top:pillTop+'px',bottom:'auto'});
  });
 }

 // Continue goes back into normal flow after the goalkeeper row.
 // This removes the large empty area and guarantees it cannot cover a keeper.
 const actions=document.querySelector('.v576-builder-actions');
 imp(actions,{
  position:'relative',left:'auto',right:'auto',top:'auto',bottom:'auto',
  width:'calc(100% - 52px)',padding:'0',margin:'18px 26px 10px',
  background:'transparent',zIndex:'18','box-sizing':'border-box'
 });
 const cta=actions?.querySelector('button');
 imp(cta,{
  width:'100%',height:'44px','min-height':'44px','max-height':'44px',
  'border-radius':'15px','font-size':'14px','box-shadow':'none'
 });

 // The field should wrap its real contents instead of reserving a large blank tail.
 imp(field,{
  height:'auto','min-height':'0','max-height':'none',
  'padding-bottom':'14px',overflow:'hidden'
 });
}
function decorate(){
 if(!active())return;
 normalizePill();
 forceFantasyLayout();
 const bySlot=new Map(squad().map(p=>[String(p?.slot??''),p]));
 document.querySelectorAll('.v576-slot.filled[data-v576-slot]').forEach(slot=>{
  const p=bySlot.get(String(slot.dataset.v576Slot||''));
  const small=slot.querySelector('small');
  if(p&&small)small.textContent=value(p);
 });
}
function schedule(){cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>requestAnimationFrame(decorate))}
function close(){
 document.querySelectorAll('.v946-display-filter-layer').forEach(n=>n.remove());
}
function row(id,label){
 return '<button type="button" class="'+(metric===id?'active':'')+'" data-v946-metric="'+id+'"><span>'+esc(label)+'</span><b>'+metricIcon(id)+'</b></button>';
}
function openMenu(){
 close();
 const layer=document.createElement('div');
 layer.className='v576-layer display-filter v946-display-filter-layer';
 layer.innerHTML='<button type="button" class="v576-backdrop" data-v946-close aria-label="Cerrar"></button>'+
  '<section class="v945-fantasy-display-sheet" role="dialog" aria-modal="true" aria-label="Dato mostrado debajo del jugador">'+
   row('rival','Rival')+
   row('date','Fecha')+
   row('price','Precio')+
   row('points','Puntos totales')+
  '</section>';
 document.body.appendChild(layer);
 imp(layer,{padding:'0 0 150px 18px','align-items':'flex-end','justify-content':'flex-start'});
 const sheet=layer.querySelector('.v945-fantasy-display-sheet');
 imp(sheet,{
  width:'258px','max-width':'calc(100vw - 36px)',margin:'0',
  'border-radius':'15px',overflow:'hidden',background:'#fff',
  'box-shadow':'0 12px 28px rgba(0,20,56,.22)'
 });
 sheet?.querySelectorAll('button').forEach((btn)=>{
  imp(btn,{
   width:'100%',height:'48px','min-height':'48px',margin:'0',
   padding:'0 14px 0 16px','border-radius':'0',background:btn.classList.contains('active')?'#f4f8fa':'#fff',
   display:'grid','grid-template-columns':'minmax(0,1fr) 32px','align-items':'center',
   gap:'10px'
  });
  imp(btn.querySelector('span'),{'font-size':'16px','line-height':'1','white-space':'nowrap'});
  imp(btn.querySelector('b'),{width:'32px',height:'32px','min-width':'32px',display:'grid','place-items':'center','font-size':'19px'});
 });
}

/* Window capture ocurre antes que los listeners antiguos registrados en document. */
window.addEventListener('click',e=>{
 if(!active())return;
 const target=e.target instanceof Element?e.target:null;if(!target)return;
 const pill=target.closest('.v587-filter-pill');
 if(pill){
  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
  normalizePill();openMenu();return;
 }
 const pick=target.closest('[data-v946-metric]');
 if(pick){
  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
  const next=pick.getAttribute('data-v946-metric')||'price';
  if(VALID.has(next)){metric=next;try{localStorage.setItem(KEY,metric)}catch(_){}}
  close();schedule();return;
 }
 if(target.closest('[data-v946-close]')){
  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();close();return;
 }
},true);

window.addEventListener('pointerdown',e=>{
 if(!active())return;
 const target=e.target instanceof Element?e.target:null;
 if(target?.closest('.v587-filter-pill')){
  /* Evita que gestos/touch antiguos abran el picker antes del click. */
  normalizePill();
 }
},true);

function observe(){
 const host=document.querySelector('#screen')||document.body;
 if(observer)observer.disconnect();
 observer=new MutationObserver(schedule);
 observer.observe(host,{childList:true,subtree:true,attributes:true,attributeFilter:['data-v576-search']});
 schedule();
}
window.addEventListener('hashchange',()=>{close();setTimeout(observe,0)});
window.addEventListener('ljr:official-data',schedule);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',observe,{once:true});else observe();
})();