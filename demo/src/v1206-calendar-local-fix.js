/* V1206 — Corrección independiente para Calendarios oficiales.
   No abre sitios externos para consultar el rol. Campos: usa el registro de Sedes. */
(function(){
'use strict';
if(window.__LJR_V1206_ROLE_LOCAL__)return;
window.__LJR_V1206_ROLE_LOCAL__=true;
const q=(s,r=document)=>r.querySelector(s);
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=x=>String(x??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const exactMaps={
 'pozos':'https://goo.gl/maps/BF9dnqf5SaBfu41PA',
 'san-julian':'https://maps.app.goo.gl/5yfZH7nGMtw2Cqqf7',
 'fraccionamiento':'https://maps.app.goo.gl/Y1ZGLTpGJ7XmGCKT7',
 'san-juan':'https://maps.app.goo.gl/mcc7DpevkPW5mW4M9',
 'tavera':'https://maps.app.goo.gl/yBhVkMrXzL3Npv3WA',
 'rincon':'https://maps.app.goo.gl/RzxJokJsPw86ZePC9'
};
let fieldsPromise=null,records=[],roleModal=null,returnFocus=null;
const fallbackFields=[
 {id:'sur-1',name:'Campo 1 · Unidad Deportiva Sur',aliases:['Campo 1','Campo 1 (Empastado)','UDS Campo 1'],mapsQuery:'Unidad Deportiva Sur, Juventino Rosas, Guanajuato'},
 {id:'sur-2',name:'Campo 2 · Unidad Deportiva Sur',aliases:['Campo 2','UDS Campo 2'],mapsQuery:'Unidad Deportiva Sur, Juventino Rosas, Guanajuato'},
 {id:'sur-3',name:'Campo 3 · Unidad Deportiva Sur',aliases:['Campo 3','UDS Campo 3'],mapsQuery:'Unidad Deportiva Sur, Juventino Rosas, Guanajuato'},
 {id:'zapata-4',name:'Campo 4 · Emiliano Zapata',aliases:['Campo 4'],mapsQuery:'Campo de futbol prolongación Emiliano Zapata, Juventino Rosas, Guanajuato'},
 {id:'cerrito',name:'Campo Cerrito de Gasca',aliases:['Cerrito de Gasca'],mapsQuery:'Campo de futbol Cerrito de Gasca, Guanajuato'},
 {id:'tavera',name:'Campo de Tavera',aliases:['Tavera','Franco Tavera'],mapsQuery:exactMaps.tavera},
 {id:'san-juan',name:'Campo San Juan de la Cruz',aliases:['San Juan de la Cruz'],mapsQuery:exactMaps['san-juan']},
 {id:'cuenda',name:'Unidad Deportiva Santiago de Cuenda',aliases:['Cuenda'],mapsQuery:'Unidad Deportiva Santiago de Cuenda, Guanajuato'},
 {id:'romerillo',name:'Campo San Antonio de Romerillo',aliases:['Romerillo'],mapsQuery:'Campo de futbol San Antonio de Romerillo, Guanajuato'},
 {id:'fraccionamiento',name:'Campo Fraccionamiento Comontuoso',aliases:['Fraccionamiento'],mapsQuery:exactMaps.fraccionamiento},
 {id:'pozos',name:'Campo de Fútbol de Pozos',aliases:['Pozos'],mapsQuery:exactMaps.pozos},
 {id:'rincon',name:'Campo Rincón de Centeno',aliases:['Rincón de Centeno'],mapsQuery:exactMaps.rincon},
 {id:'san-jose',name:'Campo San José de la Montaña',aliases:['San Jose de la Montaña','San José de la Montaña'],mapsQuery:'Campo de futbol San José de la Montaña, Guanajuato'},
 {id:'san-julian',name:'Campo San Julián Tierra Blanca',aliases:['San Julián','San Julian'],mapsQuery:exactMaps['san-julian']}
];
function fields(){
 if(!fieldsPromise)fieldsPromise=fetch('./data/fields-v38-22.json?v=20261010-v1206',{cache:'no-store'})
   .then(r=>{if(!r.ok)throw Error('Catálogo no disponible');return r.json()})
   .then(data=>Array.isArray(data.fields)&&data.fields.length?data.fields:fallbackFields)
   .catch(()=>fallbackFields);
 return fieldsPromise;
}
function fieldMatch(name,list){
 let venue=norm(name);
 if(!venue)return null;
 const searchKey=venue.replace(/^(cancha|campo de futbol|campo de futbol de|campo deportivo|campo)\s+/,'').trim();
 const aliases=f=>[f.name,...(f.aliases||[])].map(norm);
 let match=list.find(f=>aliases(f).some(s=>s===venue||s===searchKey));
 if(match)return match;
 // Campo 1 (Empastado) y Campo 1 deben apuntar al mismo complejo.
 const numbered=venue.match(/\bcampo\s*([1-4])\b/);
 if(numbered){const id={'1':'sur-1','2':'sur-2','3':'sur-3','4':'zapata-4'}[numbered[1]];return list.find(f=>f.id===id)||null;}
 match=list.find(f=>aliases(f).some(s=>s.length>=5&&(venue.includes(s)||s.includes(venue))));
 return match||null;
}
async function mapFor(name){
 const field=fieldMatch(name,await fields());
 if(!field)return '';
 const source=String(exactMaps[field.id]||field.mapsQuery||field.address||'').trim();
 if(/^https:\/\/(maps\.app\.goo\.gl\/|goo\.gl\/maps\/|www\.google\.com\/maps\/)/i.test(source))return source;
 if(!source)return '';
 return 'https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(source);
}
function navigateMap(name){
 // La pestaña se abre sin esperar al fetch: no será bloqueada en Chrome móvil.
 const tab=window.open('about:blank','_blank');
 if(tab){try{tab.opener=null;tab.document.title='Abriendo ubicación del campo…'}catch(_){}}
 mapFor(name).then(link=>{
   if(!link){
     if(tab)tab.close();
     window.alert('Este campo aún no tiene ubicación en la sección de Mapas: '+name);
     return;
   }
   if(tab){try{tab.location.replace(link)}catch(_){location.assign(link)}}
   else location.assign(link);
 }).catch(()=>{if(tab)tab.close();window.alert('No fue posible consultar la dirección de este campo.')});
}
function officialSnapshot(){
 return window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||null;
}
async function officialData(){
 const snapshot=officialSnapshot();
 if(snapshot?.categories&&Object.keys(snapshot.categories).length)return snapshot;
 const res=await fetch('./data/official-live.json?v=20261010-v1206',{cache:'no-store'});
 if(!res.ok)throw Error('No se pudieron consultar los datos publicados.');
 const data=await res.json();
 if(!data?.categories||!Object.keys(data.categories).length)throw Error('La Liga aún no tiene partidos publicados.');
 return data;
}
function closeOfficial(){
 const old=roleModal;roleModal=null;records=[];if(old)old.remove();
 document.body.classList.remove('v1206-official-open');
 if(returnFocus?.isConnected)returnFocus.focus();
}
function showOfficial(data,fromButton){
 const categories=Object.entries(data.categories||{}).filter(([id,c])=>Array.isArray(c?.fixtures));
 const first=q('[data-cat]',fromButton.closest('.v1130-calendar-pro'))?.value;
 if(!categories.length)throw Error('No hay categorías publicadas.');
 returnFocus=fromButton;
 closeOfficial();
 returnFocus=fromButton;
 const overlay=document.createElement('div');overlay.className='v1206-official-overlay';
 overlay.innerHTML='<section class="v1206-official-dialog" role="dialog" aria-modal="true" aria-label="Rol oficial de la Liga">'+
 '<header class="v1206-official-top"><div><small>LIGA JUVENTINO ROSAS</small><h2>Rol oficial de partidos</h2><p>Consulta local del calendario publicado por la Liga. No abre otra página.</p></div>'+
 '<button type="button" data-v1206-close aria-label="Regresar a Calendarios oficiales">×</button></header>'+
 '<div class="v1206-official-controls"><label>Categoría<select data-v1206-category>'+categories.map(([id,c])=>'<option value="'+esc(id)+'"'+(id===first?' selected':'')+'>'+esc(c.name||'Categoría '+id)+'</option>').join('')+'</select></label>'+
 '<label>Jornada<select data-v1206-round><option value="">Todas las jornadas</option></select></label></div>'+
 '<div class="v1206-official-summary" data-v1206-summary role="status"></div>'+
 '<div class="v1206-official-results" data-v1206-results></div>'+
 '<footer class="v1206-official-footer"><button type="button" data-v1206-close>Volver al calendario</button><span>Fuente: datos oficiales publicados por la Liga.</span></footer></section>';
 document.body.appendChild(overlay);roleModal=overlay;
 document.body.classList.add('v1206-official-open');
 const cat=q('[data-v1206-category]',overlay),round=q('[data-v1206-round]',overlay);
 function drawOptions(){
   const id=cat.value,c=data.categories[id];
   records=(c?.fixtures||[]).flatMap(x=>Array.isArray(x?.rows)?x.rows:[]);
   const rounds=[...new Set(records.map(r=>String(r?.[1]||'').trim()).filter(Boolean))]
       .sort((a,b)=>(+a||0)-(+b||0));
   round.innerHTML='<option value="">Todas las jornadas</option>'+rounds.map(v=>'<option value="'+esc(v)+'">Jornada '+esc(v)+'</option>').join('');
   draw();
 }
 function draw(){
   const selected=round.value;const list=records.filter(r=>!selected||String(r?.[1]||'').trim()===selected);
   const container=q('[data-v1206-results]',overlay);
   q('[data-v1206-summary]',overlay).textContent=list.length+' partidos publicados'+(selected?' · Jornada '+selected:'')+' · '+(data.categories[cat.value]?.name||'');
   container.innerHTML=list.length?list.map((r,i)=>{
     const home=String(r?.[2]||'Equipo por confirmar'),away=String(r?.[6]||'Equipo por confirmar');
     const venue=String(r?.[7]||'Campo por confirmar'),date=String(r?.[8]||'Fecha por confirmar');
     const score1=String(r?.[3]??'').trim(),score2=String(r?.[5]??'').trim();
     const score=/^\d+$/.test(score1)&&/^\d+$/.test(score2)?score1+' - '+score2:'VS';
     const actualId=records.indexOf(r);
     return '<article class="v1206-official-game"><div class="v1206-game-top"><b>J'+esc(r?.[1]||'—')+'</b><span>'+esc(date)+'</span></div>'+
       '<div class="v1206-game-teams"><strong>'+esc(home)+'</strong><em>'+esc(score)+'</em><strong>'+esc(away)+'</strong></div>'+
       '<div class="v1206-game-venue"><span>'+esc(venue)+'</span><span>'+esc(r?.[10]||'Programado')+'</span></div>'+
       '<div class="v1206-game-actions"><button type="button" data-v1206-map="'+actualId+'">Mapa · Cómo llegar</button>'+
       '<button type="button" data-v1206-gcal="'+actualId+'">Google Calendar</button></div>'+
       '<details><summary>Detalles del partido</summary><p>'+esc([home+' vs '+away,date,venue,r?.[9]?'Árbitro: '+r[9]:''].filter(Boolean).join(' · '))+'</p></details></article>';
   }).join(''):'<p class="v1206-empty">Todavía no hay partidos publicados para esta selección.</p>';
 }
 cat.addEventListener('change',drawOptions);
 round.addEventListener('change',draw);
 overlay.addEventListener('click',e=>{
   if(e.target===overlay||e.target.closest('[data-v1206-close]')){e.preventDefault();closeOfficial();return;}
   const mapBtn=e.target.closest('[data-v1206-map]');
   if(mapBtn){e.preventDefault();navigateMap(records[+mapBtn.dataset.v1206Map]?.[7]||'');return}
   const calBtn=e.target.closest('[data-v1206-gcal]');
   if(calBtn){e.preventDefault();openGoogleCalendar(records[+calBtn.dataset.v1206Gcal]);}
 });
 drawOptions();
 q('[data-v1206-close]',overlay)?.focus();
}
function openGoogleCalendar(row){
 if(!row)return;
 const m=String(row?.[8]||'').match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})/);
 if(!m){window.alert('El partido todavía no tiene fecha y hora confirmadas.');return;}
 const pad=n=>String(n).padStart(2,'0');
 const dt=new Date(+m[3],+m[2]-1,+m[1],+m[4],+m[5]);if(Number.isNaN(dt.getTime()))return;
 const stamp=d=>d.getFullYear()+pad(d.getMonth()+1)+pad(d.getDate())+'T'+pad(d.getHours())+pad(d.getMinutes())+'00';
 const query=new URLSearchParams({action:'TEMPLATE',text:String(row?.[2]||'')+' vs '+String(row?.[6]||'')+' · Liga Juventino Rosas',
 dates:stamp(dt)+'/'+stamp(new Date(dt.getTime()+2*3600000)),ctz:'America/Mexico_City',stz:'America/Mexico_City',etz:'America/Mexico_City',
 details:'Jornada '+String(row?.[1]||'')+' · Liga Juventino Rosas',location:String(row?.[7]||'')});
 const href='https://calendar.google.com/calendar/render?'+query.toString();
 window.open(href,'_blank','noopener,noreferrer')||location.assign(href);
}
document.addEventListener('click',function(event){
 if(!(event.target instanceof Element))return;
 const official=event.target.closest('.v105-modal.v1130-calendar-pro [data-open]');
 if(official){
   event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();
   official.disabled=true;
   officialData().then(data=>showOfficial(data,official))
     .catch(err=>window.alert('No fue posible cargar el rol local: '+err.message))
     .finally(()=>{if(official.isConnected)official.disabled=false});
   return;
 }
 const map=event.target.closest('.v105-modal.v1130-calendar-pro button[data-map]');
 if(map){
   event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();
   const venue=q('.v1107-fixture-field',map.closest('.v1130-fixture'))?.textContent?.trim()||'';
   if(venue)navigateMap(venue);else window.alert('Este partido no tiene una cancha confirmada.');
 }
},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&roleModal){e.preventDefault();closeOfficial()}});
window.addEventListener('hashchange',()=>{if(roleModal)closeOfficial()});
fields().catch(()=>{});
})();
