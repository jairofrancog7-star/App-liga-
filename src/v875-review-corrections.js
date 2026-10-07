(()=>{'use strict';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const route=()=>location.hash.replace(/^#\/?/,'').split('?')[0]||'home';
const account=()=>window.LJR_V569_AUTH?.currentAccount?.()||window.LJR_MAIN_ROUTE?.state?.user;
const logo=n=>window.LJR_TEAM_LOGOS?.get?.(n)||window.LJR_SEASON_LOGOS?.get?.(n)||window.LJR_OFFICIAL_API?.getLogo?.(n)||'';
const canva=[['Tablas, jornadas y comunicados','https://www.canva.com/d/NGBodeIyVUKsUHv'],['Tablas y jornadas premium','https://www.canva.com/d/Xa410IMlElWooRL'],['Comunicados y programación','https://www.canva.com/d/cdMdwGaea5m4b-K'],['Partido de fútbol · azul','https://www.canva.com/d/82pR3gFimAxtsXD']];
const modal=(title,body)=>window.LJR_MEDIA?.modal(title,body);
let timer=0;
function cleanText(root){
 const walk=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;
 while((n=walk.nextNode())){
  if(n.parentElement?.closest('script,style,textarea,input,[contenteditable="true"]'))continue;
  const old=n.nodeValue;let value=old.replace(/\badmin\s*f[uú]t\b/gi,'Liga Juventino Rosas').replace(/\badmin\s*food\b/gi,'Liga Juventino Rosas');
  if(n.parentElement?.closest('.v35-history-page'))value=value.replace(/\b(recuperad[oa]s?|extraíd[oa]s?)\b/gi,'').replace(/\bdel ZIP\b/gi,'').replace(/\baño por precisar\b/gi,'Histórico').replace(/\bfuente\s*:[^.]*\.?/gi,'').replace(/\b(fuente|fuentes)\b/gi,'');
  if(value!==old)n.nodeValue=value;
 }
 root.querySelectorAll('[title],[aria-label]').forEach(el=>{for(const key of ['title','aria-label']){const value=el.getAttribute(key);if(value&&/admin\s*(f[uú]t|food)/i.test(value))el.setAttribute(key,value.replace(/admin\s*(f[uú]t|food)/gi,'Liga Juventino Rosas'))}});
}
function history(root){
 root.querySelectorAll('.v35-history-sources,.v358-stats-source-note,.v358-stat-source,.v35-archive-method').forEach(el=>el.hidden=true);
 root.querySelectorAll('.v35-old-table').forEach((card,i)=>{
  if(card.querySelector('[data-v875-table]'))return;
  const details=document.createElement('details');details.className='v875-table-details';details.dataset.v875Table='';
  const summary=document.createElement('summary');summary.textContent='Ver más detalles';
  const table=document.createElement('div');table.className='v875-table-content';table.id='history-table-'+i;
  for(const node of [...card.children])if(node.tagName!=='HEADER')table.append(node);
  details.append(summary,table);card.append(details);
  details.addEventListener('toggle',()=>{summary.textContent=details.open?'Ocultar detalles':'Ver más detalles'});
 });
 root.querySelectorAll('.v370-legacy-team,.v340-champion-row').forEach(card=>{
  const name=card.querySelector('.v340-champion-name,h3,h4,b')?.textContent||card.textContent||'';
  let src='';if(/pandilla/i.test(name))src='./assets/history/team-logos/legacy-2015-la-pandilla.webp';if(/\bel alto\b/i.test(name))src='./assets/history/team-logos/legacy-2015-el-alto.webp';
  if(!src)return;const host=card.querySelector('.v370-legacy-crest,.v370-legacy-logo,.v340-champion-logo');if(!host)return;
  let img=host.querySelector('img');if(!img){img=document.createElement('img');img.alt=name;host.replaceChildren(img)}
  if(img.getAttribute('src')!==src){img.removeAttribute('onerror');img.src=src;img.style.removeProperty('display');img.hidden=false;host.classList.remove('is-fallback');host.querySelector('b')?.setAttribute('hidden','')}
 });
}
function studioEntry(root){
 if(!['more','leagueTools','publicationCenter','ligaControl','jrControl','publications'].includes(route()))return;
 if(root.querySelector('[data-v875-studio]'))return;
 const box=document.createElement('section');box.className='v875-studio-entry';
 box.innerHTML='<span>DISEÑOS NUEVOS PARA TU LIGA</span><h2>Generador de publicaciones</h2><p>Comunicados, jornadas, tablas, eliminatorias, felicitaciones, reclutamiento y escudos. Créalo aquí con el editor local: elige un estilo, completa los datos y descarga un PNG HD. También puedes crear notificaciones con fotos y marcador.</p><div><button type="button" data-v875-studio>Crear diseño nuevo</button><button type="button" data-v880-notification>Crear notificación moderna</button><button type="button" data-v875-canva>Canva IA · opción adicional</button><button type="button" data-v875-results>Resultados PNG</button><button type="button" data-v875-bulletins>Boletines y avisos</button></div>';
 const host=root.querySelector('.v726-tools-page,.v105-more-content,.v105-more-page,.v561-league')||root;host.prepend(box);
 box.querySelector('[data-v875-results]').onclick=()=>{localStorage.setItem('v561-publication-kind','results');window.LJR_MAIN_ROUTE?.go('publicationCenter')};
 box.querySelector('[data-v875-bulletins]').onclick=()=>window.LJR_MAIN_ROUTE?.go('publications');
 box.querySelector('[data-v875-studio]').onclick=()=>window.LJR_DESIGN_STUDIO?.open();
 box.querySelector('[data-v880-notification]').onclick=()=>window.LJR_V852_RICH_NOTIFICATIONS?.openAdmin();
 box.querySelector('[data-v875-canva]').onclick=()=>window.LJR_DESIGN_STUDIO?.open('Comunicado');
}
function poll(root){
 const host=root.querySelector('.v105-poll-status')?.parentElement;if(!host||host.querySelector('[data-v875-mailbox]'))return;
 const form=document.createElement('form');form.className='v875-mailbox';form.dataset.v875Mailbox='';
 form.innerHTML='<small>BUZÓN DE LA LIGA</small><h3>Tu propuesta puede mejorar la liga</h3><p>Mensaje privado para administración. Se envía con tu cuenta registrada.</p><label>¿Qué propones mejorar?<textarea name="message" minlength="10" maxlength="10000" rows="7" required placeholder="Cuéntanos el problema, tu idea y cómo podríamos mejorar…"></textarea></label><div><span data-count>0 / 10 000</span><button type="submit">Enviar propuesta</button></div><p role="status" data-status></p>';
 host.append(form);const text=form.elements.message,status=form.querySelector('[data-status]'),button=form.querySelector('button');
 text.oninput=()=>{form.querySelector('[data-count]').textContent=text.value.length+' / 10 000'};
 form.onsubmit=async e=>{
  e.preventDefault();const a=account();if(!a){status.textContent='Inicia sesión para enviar tu propuesta.';window.LJR_V569_AUTH?.openLogin?.();return}
  if(!form.reportValidity())return;button.disabled=true;status.textContent='Enviando…';
  try{await window.LJR_MEDIA.api('feedback',{method:'POST',body:{name:a.name||a.displayName||a.username||'Usuario registrado',message:text.value.trim(),accountId:String(a.id||a.email||''),subject:'Propuesta para mejorar la liga'}});status.textContent='Tu propuesta llegó al buzón privado de administración.';text.value='';text.oninput()}
  catch(error){status.textContent=error.message||'No se pudo enviar. Tu mensaje se conserva para reintentar.'}
  finally{button.disabled=false}
 };
}
function meeting(root){
 const form=root.querySelector('.v105-meeting-form');if(!form||form.querySelector('[data-v875-meeting]'))return;
 const wrap=document.createElement('div');wrap.dataset.v875Meeting='';wrap.className='v875-meeting-options';
 let old={};try{old=JSON.parse(localStorage.getItem('ljr-meeting-options-v875')||'{}')}catch{}
 wrap.innerHTML='<label>Hora<input data-meeting-field="time" type="time" value="'+esc(old.time||'19:00')+'"></label><label>Lugar<input data-meeting-field="place" value="'+esc(old.place||'')+'" placeholder="Sede de la junta"></label><label>Responsable<input data-meeting-field="owner" value="'+esc(old.owner||'')+'" placeholder="Nombre del responsable"></label><label>Fecha límite de acuerdos<input data-meeting-field="deadline" type="date" value="'+esc(old.deadline||'')+'"></label><label class="wide">Pendientes y seguimiento<textarea data-meeting-field="tasks" rows="4" placeholder="Acuerdo · responsable · fecha límite">'+esc(old.tasks||'')+'</textarea></label><div class="v875-agenda-chips wide">'+['Resultados de jornada','Programación y campos','Arbitraje y disciplina','Propuestas del buzón','Equipos y registros'].map(t=>'<button type="button" data-add-topic="'+esc(t)+'">'+esc(t)+'</button>').join('')+'</div>';
 form.append(wrap);const share=document.createElement('button');share.type='button';share.className='v105-btn alt';share.textContent='Compartir minuta';form.parentElement.querySelector('.v105-actions')?.append(share);
 share.onclick=async()=>{const lines=['JUNTA DE LA LIGA',...Array.from(form.querySelectorAll('[data-x],[data-meeting-field]')).map(el=>(el.closest('label')?.querySelector('span')?.textContent||el.dataset.meetingField||el.dataset.x)+': '+el.value)];const text=lines.join('\n\n');try{if(navigator.share)await navigator.share({title:'Junta semanal de la Liga',text});else{await navigator.clipboard.writeText(text);share.textContent='Minuta copiada'}}catch(e){if(e.name!=='AbortError')share.textContent='Vuelve a intentar compartir'}};
 wrap.querySelectorAll('[data-meeting-field]').forEach(input=>input.oninput=()=>{const data={};wrap.querySelectorAll('[data-meeting-field]').forEach(el=>data[el.dataset.meetingField]=el.value);localStorage.setItem('ljr-meeting-options-v875',JSON.stringify(data))});
 wrap.querySelectorAll('[data-add-topic]').forEach(button=>button.onclick=()=>{const agenda=form.querySelector('[data-x="agenda"]');if(agenda&&!agenda.value.includes(button.dataset.addTopic))agenda.value+='\n• '+button.dataset.addTopic});
}
function profiles(){
 const image='<img src="./assets/reference/predictor-v36/liga-crest-white.webp" alt="Liga Juventino Rosas">';
 document.querySelectorAll('.v17-tv-profile,.v408-tv-profile,.v160-tv-profile').forEach(button=>{if(button.innerHTML!==image)button.innerHTML=image});
}
function liveCard(root){
 if(route()!=='notifications')return;
 const record=window.LJR_CMS?.records?.find(r=>r.kind==='fixture'&&r.published&&(r.payload?.status==='live'||r.payload?.status==='en_vivo'));
 if(!record){root.querySelector('[data-v875-live]')?.remove();return}const p=record.payload;if(!p.home||!p.away)return;
 const signature=JSON.stringify([p.home,p.away,p.homeScore,p.awayScore,p.minute]);let card=root.querySelector('[data-v875-live]');if(card?.dataset.signature===signature)return;
 if(!card){card=document.createElement('button');card.type='button';card.className='v875-live-score';card.dataset.v875Live='';root.prepend(card)}
 card.dataset.signature=signature;card.innerHTML='<small>EN VIVO · '+esc(p.minute?p.minute+"′":'Resultado directo')+'</small><div><span><img src="'+esc(logo(p.home))+'" alt=""><b>'+esc(p.home)+'</b></span><strong>'+esc(p.homeScore??0)+' – '+esc(p.awayScore??0)+'</strong><span><img src="'+esc(logo(p.away))+'" alt=""><b>'+esc(p.away)+'</b></span></div>';card.onclick=()=>window.LJR_MAIN_ROUTE?.go('matchCenter');
}
function apply(){timer=0;const root=document.querySelector('#screen');if(!root)return;cleanText(document.body);if(route()==='history')history(root);studioEntry(root);poll(document);meeting(document);profiles();liveCard(root)}
function schedule(){if(!timer)timer=setTimeout(apply,80)}
new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});for(const event of ['hashchange','liga:admin','liga:content','ljr:profile-updated'])addEventListener(event,schedule);
document.addEventListener('click',e=>{if(e.target.closest('[data-v875-studio],[data-v875-canva]'))return;setTimeout(schedule,100)});
window.LJR_REVIEW_V875={apply};schedule();
})();
