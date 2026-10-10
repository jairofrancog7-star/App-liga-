/* V1221 · Clasificador local y automatización prudente para registro de avisos.
   IA clásica (Naive Bayes), no modelo generativo ni servicio externo de IA.
   Solo consulta el archivo público de avisos oficiales ya utilizado por la Liga. */
(function(){
'use strict';
if(window.__LJR_V1221_LOCAL_ALERT_AI__)return;
window.__LJR_V1221_LOCAL_ALERT_AI__=true;
const SETTINGS='ljr-notification-ai-v1221', FEED='./data/active-notices.json';
const PROFILE='v160-alert-profile',STORE='lj-store-v3';
const DEFAULT={enabled:false,auto:false,notify:false,interval:5,known:[],baselined:false,feedback:[]};
const CATEGORIES={'3':'Primera','5':'Intermedia','4':'Segunda','2':'Veteranos 35+','1':'Veteranos 50+'};
const TRAINING=[
 ['important','Partido suspendido por lluvia y cancha en mal estado'],
 ['important','Se suspende la jornada del domingo por causas oficiales'],
 ['important','Cambio urgente de cancha y sede para el partido'],
 ['important','Partido reprogramado cambia la fecha y la hora'],
 ['important','Aviso importante sobre modificación del horario de juego'],
 ['important','Resultado final del partido y marcador oficial'],
 ['important','Gol anotado en el encuentro de la liga'],
 ['important','Inicia el partido de nuestro equipo favorito'],
 ['important','Tarjetas rojas y sanción disciplinaria confirmada'],
 ['important','Se aplaza el encuentro y cambia el campo'],
 ['important','Se modifica la jornada por suspensión oficial'],
 ['important','Último momento cambio de sede'],
 ['general','Galería de fotografías de la temporada pasada'],
 ['general','Publicado un nuevo video de los momentos históricos'],
 ['general','Entrevista con jugadores y recuerdos de la liga'],
 ['general','Conoce la historia de los campeones de otros años'],
 ['general','Nueva encuesta de opinión entre la afición'],
 ['general','Resumen semanal de noticias generales'],
 ['general','Concurso de pronósticos para los aficionados'],
 ['general','Se comparte un recuerdo del torneo anterior'],
 ['general','Se publicó un póster de la liga'],
 ['general','Recomendaciones para los visitantes'],
 ['general','Fotografía histórica de la premiación'],
 ['general','Información general del archivo deportivo']
];
const STOP=new Set('de la el y a en del los las por un una para con al se lo que su sus este esta esta fue ha es hoy nueva nuevo tu nuestro sobre como esta'.split(' '));
const $=(s,r=document)=>r.querySelector(s);
function read(key,fallback){try{const x=JSON.parse(localStorage.getItem(key)||'null');return x??fallback}catch(_){return fallback}}
function store(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true}catch(_){return false}}
function clean(value){return String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()}
function terms(value){
 return clean(value).match(/[a-z0-9ñ]{3,}/g)?.filter(w=>!STOP.has(w)).slice(0,200)||[];
}
function makeModel(feedback=[]){
 const vocabulary=new Set(),docs={important:0,general:0};
 const counts={important:Object.create(null),general:Object.create(null)};
 const sums={important:0,general:0};
 for(const [label,sentence] of TRAINING.concat(feedback.slice(-60).map(x=>[x.label,String(x.text||'').slice(0,240)]))){
  if(!counts[label])continue;
  docs[label]++;
  for(const token of terms(sentence)){
   vocabulary.add(token);counts[label][token]=(counts[label][token]||0)+1;sums[label]++;
  }
 }
 return {vocabulary,docs,counts,sums};
}
function classify(text,feedback=[]){
 const model=makeModel(feedback),keys=['important','general'],v=Math.max(1,model.vocabulary.size);
 const words=terms(text),sumDocs=model.docs.important+model.docs.general;
 const scores=keys.map(k=>{
  let s=Math.log((model.docs[k]+1)/(sumDocs+2));
  for(const t of words)if(model.vocabulary.has(t)){
   s+=Math.log(((model.counts[k][t]||0)+1)/(model.sums[k]+v));
  }
  return s;
 });
 const max=Math.max(...scores),weights=scores.map(n=>Math.exp(n-max)),p=weights[0]/(weights[0]+weights[1]);
 return {important:p>=.5,confidence:Math.round(p*100),method:'Naive Bayes en este dispositivo'};
}
function categoryMatches(item,profile){
 const category=CATEGORIES[String(profile?.cat||'')]||'';
 const itemCat=clean(item.category||'Todas');
 return !category||!itemCat||['todas','todos','general','liga'].includes(itemCat)||
   itemCat===clean(category)||
   (category==='Primera'&&itemCat==='primera fuerza')||
   (category==='Segunda'&&itemCat==='segunda fuerza');
}
function normalizeRecord(row,index){
 if(!row||typeof row!=='object'||typeof row.title!=='string'||!row.title.trim())return null;
 return {id:String(row.id||index).slice(0,120),
  title:row.title.trim().slice(0,140),
  body:String(row.body||row.message||'').slice(0,1200),
  category:String(row.category||'Todas').slice(0,80),
  type:String(row.type||'general').slice(0,60),
  date:String(row.published_at||row.publishedAt||row.publishAt||'')};
}
function priority(item,profile,feedback=[]){
 const text=item.title+' '+item.body;
 const ai=classify(text,feedback);
 const norm=clean(text),team=clean(profile?.team||'');
 let value=ai.confidence;
 if(team&&norm.includes(team))value+=25;
 if(team&&!norm.includes(team))value-=10;
 if(/suspend|cancel|aplaz|reprogram|cambio de (cancha|sede|horario)|modificac/.test(norm))value+=22;
 if(/final|gol |resultado|marcador/.test(norm))value+=8;
 return {...item,importance:Math.min(100,Math.max(0,Math.round(value))),
  reason:(team&&norm.includes(team)?'Menciona tu equipo · ':'')+
   (ai.important?'Clasificación local: importante':'Clasificación local: general')};
}
function rank(rows,profile,feedback=[]){
 if(!Array.isArray(rows))return [];
 const unique=new Set();
 return rows.slice(0,500).map(normalizeRecord).filter(Boolean)
  .filter(x=>{if(unique.has(x.id))return false;unique.add(x.id);return categoryMatches(x,profile)})
  .map(x=>priority(x,profile,feedback))
  .sort((a,b)=>b.importance-a.importance||(Date.parse(b.date)||0)-(Date.parse(a.date)||0))
  .slice(0,60);
}
function recommended(profile){
 return {cat:CATEGORIES[String(profile?.cat||'')]||'Todas',
  team:String(profile?.team||'').trim(),
  prefs:{goal:true,kickoff:true,final:true,scheduleChanges:true,venueChanges:true,news:true},
  reason:'Priorizar goles, resultados, cambios de horario, sedes y comunicados para '+(profile?.team||'tu equipo')+'.'};
}
function applyRecommendation(profile){
 const current=read(STORE,{});
 if(!current||typeof current!=='object'||Array.isArray(current))return false;
 const recommendation=recommended(profile);
 current.notifications={...(current.notifications||{}),...recommendation.prefs};
 return store(STORE,current);
}
function button(text,cls){const b=document.createElement('button');b.type='button';b.className=cls;b.textContent=text;return b;}
function element(tag,cls,text){
 const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;
}
function context(modal){return {cat:$('[data-r-cat]',modal)?.value||'',team:$('[data-r-team]',modal)?.value||''};}
let currentModal=null,entries=[],lastRead=0,pending=false,lastSuccessful=false;
let timer=null,handled=false;
function settings(){
 return {...DEFAULT,...read(SETTINGS,{})};
}
function saveOptions(partial){
 const next={...settings(),...partial};
 next.known=Array.isArray(next.known)?next.known.slice(-160):[];
 next.feedback=Array.isArray(next.feedback)?next.feedback.slice(-60):[];
 next.interval=[5,15,30].includes(Number(next.interval))?Number(next.interval):5;
 store(SETTINGS,next);return next;
}
function status(message){
 const node=currentModal&&$('[data-ai-status]',currentModal);
 if(node)node.textContent=message;
}
function recommendUI(){
 const target=currentModal&&$('[data-ai-recommendation]',currentModal);
 if(!target)return;
 target.textContent=recommended(context(currentModal)).reason;
}
function render(){
 const modal=currentModal;
 if(!modal||!modal.isConnected)return;
 const box=$('[data-ai-results]',modal);
 if(!box)return;
 box.replaceChildren();
 if(!lastRead){box.append(element('p','v1221-ai-empty','Analiza el archivo oficial para conocer tus avisos prioritarios.'));return;}
 if(!entries.length){box.append(element('p','v1221-ai-empty',lastSuccessful?'No hay avisos oficiales publicados para esta categoría. La IA no inventa resultados.':'No se pudo consultar el archivo oficial. Intenta de nuevo cuando tengas conexión.'));return;}
 const title=element('strong','v1221-ai-results-title','Avisos ordenados por relevancia local');
 box.append(title);
 for(const item of entries.slice(0,5)){
  const card=element('article','v1221-ai-result');
  const top=element('div','v1221-ai-result-top');
  top.append(element('span','v1221-ai-priority','Prioridad sugerida: '+item.importance+'/100'));
  top.append(element('small','v1221-ai-category',item.category));
  card.append(top,element('strong','v1221-ai-result-title',item.title));
  if(item.body)card.append(element('p','v1221-ai-result-body',item.body.slice(0,180)));
  card.append(element('small','v1221-ai-reason',item.reason));
  const actions=element('div','v1221-ai-feedback');
  const yes=button('Me interesa',''),no=button('No me interesa','');
  yes.setAttribute('aria-label','Enseñar que este aviso me interesa');
  no.setAttribute('aria-label','Enseñar que este aviso no me interesa');
  function teach(label){
   const s=settings();
   const next=s.feedback.filter(v=>v.id!==item.id);
   next.push({id:item.id,label,text:(item.title+' '+item.body).slice(0,240)});
   saveOptions({feedback:next});
   entries=rank(rawItems,context(modal),settings().feedback);
   status('✓ La IA local aprendió de tu elección. Solo se guardó en este dispositivo.');
   render();
  }
  yes.addEventListener('click',()=>teach('important'));
  no.addEventListener('click',()=>teach('general'));
  actions.append(yes,no);card.append(actions);box.append(card);
 }
}
let rawItems=[];
async function refresh(force=false){
 if(pending)return;
 const opts=settings();
 if(!force&&lastRead&&Date.now()-lastRead<opts.interval*60000)return;
 const modal=currentModal?.isConnected?currentModal:null;
 const profile=modal?context(modal):read(PROFILE,{});
 pending=true;
 status('Consultando únicamente el archivo oficial de la Liga…');
 try{
  const response=await fetch(FEED+'?v='+Date.now(),{cache:'no-store'});
  if(!response.ok)throw Error('Feed oficial no disponible');
  const data=await response.json();
  const rows=Array.isArray(data)?data:Array.isArray(data?.items)?data.items:null;
  if(!rows)throw Error('Formato oficial no reconocido');
  rawItems=rows.slice(0,500);
  const next=rank(rawItems,profile,opts.feedback);
  const ids=rawItems.map((x,i)=>String(x?.id||i)).slice(0,160);
  const hasBaseline=!!opts.baselined;
  const unseen=next.filter(x=>!opts.known.includes(x.id)&&x.importance>=72);
  entries=next;
  lastSuccessful=true;
  if(opts.auto)saveOptions({known:ids,baselined:true});
  if(opts.auto&&opts.notify&&hasBaseline&&unseen.length&&'Notification'in window&&Notification.permission==='granted'){
   const selected=unseen[0];
   try{
    const reg=await navigator.serviceWorker?.getRegistration();
    if(reg?.showNotification)await reg.showNotification('Liga Juventino Rosas · aviso prioritario',{
      body:selected.title.slice(0,120),tag:'ljr-ai-'+selected.id,
      data:{url:location.origin+location.pathname+'#/news'}
    });
   }catch(_){}
  }
  status(rawItems.length?'✓ '+rawItems.length+' avisos oficiales revisados en el dispositivo.':'Archivo oficial consultado: no hay avisos publicados.');
 }catch(_){
  lastSuccessful=false;entries=[];
  status('No hay conexión con el archivo oficial. No se generaron avisos de ejemplo.');
 }finally{pending=false;lastRead=Date.now();render();}
}
function mount(modal){
 if(!modal||modal.querySelector('[data-v1221-local-ai]'))return;
 currentModal=modal;
 const root=element('section','v1221-local-ai');
 root.dataset.v1221LocalAi='';
 const heading=element('div','v1221-ai-heading');
 const headingText=element('div');
 headingText.append(element('small','v1221-ai-eyebrow','AUTOMATIZACIÓN INTELIGENTE'));
 headingText.append(element('h4','','IA local para tus avisos'));
 headingText.append(element('p','','Clasifica comunicados en tu celular y aprende cuáles te interesan. Sin enviar tus preferencias a una IA externa.'));
 heading.append(headingText,element('span','v1221-ai-icon','✦'));
 root.append(heading);
 const recommendation=element('div','v1221-ai-recommendation');
 recommendation.append(element('b','','Prioridad recomendada'));
 recommendation.append(element('p','',''));
 recommendation.lastChild.dataset.aiRecommendation='';
 const apply=button('Aplicar avisos recomendados','v1221-ai-primary');
 apply.addEventListener('click',()=>{
  if(applyRecommendation(context(modal))){
   status('✓ Preferencias de avisos guardadas. Para aplicar filtros al envío Push, abre Notificaciones Push y guarda sus filtros.');
   const prefs=$('[data-r-inline-notif]',modal);
   if(prefs&&!prefs.hidden){
    // Actualizar la lista visible utilizando el botón ya existente.
    const toggle=$('[data-r-notif]',modal);
    if(toggle){toggle.click();toggle.click();}
   }
  }else status('No se pudieron guardar preferencias en este dispositivo.');
 });
 recommendation.append(apply);root.append(recommendation);
 const tools=element('div','v1221-ai-tools');
 const scan=button('Analizar avisos oficiales','v1221-ai-secondary');
 scan.addEventListener('click',()=>refresh(true));
 tools.append(scan);
 const options=element('div','v1221-ai-options');
 const s=settings();
 const auto=element('label','v1221-ai-check');
 const autoInput=document.createElement('input');autoInput.type='checkbox';autoInput.checked=!!s.auto;
 auto.append(autoInput,element('span','','Consultar automáticamente mientras esta página esté abierta'));
 const notify=element('label','v1221-ai-check');
 const notifyInput=document.createElement('input');notifyInput.type='checkbox';notifyInput.checked=!!s.notify;
 notify.append(notifyInput,element('span','','Avisar si aparece un comunicado importante (solo con permiso ya concedido)'));
 const frequency=element('label','v1221-ai-frequency');
 frequency.append(element('span','','Revisar cada'));
 const select=document.createElement('select');
 for(const n of [5,15,30]){const op=document.createElement('option');op.value=String(n);op.textContent=n+' min';select.append(op)}
 select.value=String(s.interval);frequency.append(select);
 autoInput.addEventListener('change',()=>{
  const next=saveOptions({auto:autoInput.checked,baselined:autoInput.checked?false:settings().baselined,known:autoInput.checked?[]:settings().known});
  status(next.auto?'Automatización activa solo mientras la sección esté abierta.':'Consulta automática desactivada.');
  if(next.auto)refresh(true);
 });
 notifyInput.addEventListener('change',()=>{
  saveOptions({notify:notifyInput.checked});
  status(notifyInput.checked?'Las notificaciones se mostrarán solo si ya concediste permiso en el navegador.':'Avisos automáticos de esta función desactivados.');
 });
 select.addEventListener('change',()=>{saveOptions({interval:Number(select.value)});status('Frecuencia actualizada. La automatización no continúa con la página cerrada.');});
 options.append(auto,notify,frequency);
 root.append(tools,options);
 const currentStatus=element('p','v1221-ai-status','Clasificación local lista. Puedes analizar los comunicados publicados.');
 currentStatus.dataset.aiStatus='';
 currentStatus.setAttribute('aria-live','polite');root.append(currentStatus);
 const resultBox=element('div','v1221-ai-results');resultBox.dataset.aiResults='';root.append(resultBox);
 root.append(element('p','v1221-ai-footnote','La IA sugiere prioridades; no crea noticias ni decisiones oficiales. Con la automatización activada revisa avisos mientras la app esté abierta; para recibirlos cerrada se necesita Push.'));
 const anchor=$('[data-r-inline-notif]',modal)||$('[data-r-push-slot]',modal);
 if(anchor)anchor.after(root);else modal.querySelector('.v105-dialog')?.append(root);
 modal.addEventListener('change',e=>{
  if(e.target?.matches?.('[data-r-cat],[data-r-team]')){
   setTimeout(()=>{recommendUI();entries=rank(rawItems,context(modal),settings().feedback);render();},0);
  }
 });
 recommendUI();render();
 if(s.auto)refresh(true);
}
function discover(){
 const modal=document.querySelector('body > .v105-modal.v168-account-modal.v920-registration-modal');
 if(!modal){currentModal=null;return;}
 if(currentModal!==modal)lastRead=0;
 mount(modal);
}
function init(){
 if(handled)return;handled=true;
 if(!document.body)return;
 new MutationObserver(discover).observe(document.body,{childList:true});
 discover();
 timer=setInterval(()=>{if(!document.hidden&&settings().auto)refresh(false);},60000);
 if(settings().auto&&!document.hidden)refresh(true);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden&&settings().auto)refresh(false);});
}
window.LJR_V1221_LOCAL_AI={terms,classify,rank,recommended,applyRecommendation,settings};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
else init();
})();
