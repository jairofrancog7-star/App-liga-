import {parseDelimited,detectDelimiter} from './v1222-csv-parser-core.js';
export {parseDelimited,detectDelimiter};
import {suggestCsvMapping,guessCsvType,csvLocalInsights,readCsvLearning,keepCsvLearning,standardCategory,compareCsvTeams} from './v1222-csv-local-ai.js';
/* Importador CSV local y seguro — Liga Juventino Rosas. Sin escritura de datos oficiales. */
const SCHEMAS={
 equipos:{label:'Equipos',fields:[['nombre','Nombre del equipo',true,['equipo','club','team','nombre equipo','nombre']],['categoria','Categoría',true,['categoria','division','liga','category']],['campo','Campo',false,['sede','cancha','estadio','campo local','campo']],['ciudad','Ciudad / comunidad',false,['localidad','comunidad','municipio','ciudad']]]},
 jugadores:{label:'Jugadores',fields:[['nombre','Nombre del jugador',true,['jugador','nombre completo','player','nombre']],['equipo','Equipo',true,['club','team','equipo']],['categoria','Categoría',false,['division','categoria']],['numero','Número',false,['dorsal','numero','camiseta','num']],['fecha_nacimiento','Fecha de nacimiento',false,['nacimiento','fecha nacimiento','fecha_nacimiento','birthdate']]]},
 resultados:{label:'Partidos y resultados',fields:[['fecha','Fecha del partido',true,['dia','fecha partido','date','fecha']],['local','Equipo local',true,['equipo local','casa','home','local']],['visitante','Equipo visitante',true,['equipo visitante','fuera','away','visitante','rival']],['goles_local','Goles local',false,['marcador local','gol local','goles casa','goles_local']],['goles_visitante','Goles visitante',false,['marcador visitante','gol visitante','goles fuera','goles_visitante']],['categoria','Categoría',false,['division','categoria']],['campo','Campo / sede',false,['cancha','estadio','sede','campo']]]}
};
const normalize=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[_-]+/g,' ').replace(/[^a-z0-9 ]+/g,' ').trim().replace(/\s+/g,' ');
const html=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const CAP_BYTES=5*1024*1024;
export function guessMapping(headers,type){
 const mapped={},used=new Set();
 for(const [field,, ,aliases] of SCHEMAS[type].fields){
  let found=-1;
  for(const alias of [field,...aliases]){
   found=headers.findIndex((header,i)=>!used.has(i)&&normalize(header)===normalize(alias));
   if(found>=0)break;
  }
  if(found<0)for(const alias of [field,...aliases]){
   found=headers.findIndex((header,i)=>!used.has(i)&&normalize(header).includes(normalize(alias)));
   if(found>=0)break;
  }
  mapped[field]=found>=0?found:-1;
  if(found>=0)used.add(found);
 }
 return mapped;
}
function validDate(value){
 const v=String(value??'').trim();
 let year,month,day;
 const iso=/^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
 if(iso){year=Number(iso[1]);month=Number(iso[2]);day=Number(iso[3]);}
 else{
  const regional=/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/.exec(v);
  if(!regional)return false;
  day=Number(regional[1]);month=Number(regional[2]);year=Number(regional[3]);
 }
 if(year<100||month<1||month>12||day<1||day>31)return false;
 const check=new Date(Date.UTC(year,month-1,day));
 return check.getUTCFullYear()===year&&check.getUTCMonth()===month-1&&check.getUTCDate()===day;
}
export function analyzeCsv(parsed,type,mapping){
 const spec=SCHEMAS[type];
 if(!spec)throw Error('Tipo desconocido.');
 const required=spec.fields.filter(f=>f[2]).filter(f=>!(Number.isInteger(mapping[f[0]])&&mapping[f[0]]>=0));
 const results=[],seen=new Set();
 parsed.rows.forEach((row,i)=>{
  const obj={},errors=[];
  for(const [key,label,mandatory] of spec.fields){
   const idx=mapping[key];
   const val=idx>=0?String(row[idx]??'').trim():'';
   obj[key]=val;
   if(mandatory&&!val)errors.push(label+' obligatorio.');
  }
  if(row.length!==parsed.headers.length)errors.push('Cantidad de columnas distinta al encabezado.');
  if(type==='resultados'){
   if(obj.fecha&&!validDate(obj.fecha))errors.push('Fecha incorrecta (AAAA-MM-DD o DD/MM/AAAA).');
   if(obj.local&&obj.visitante&&normalize(obj.local)===normalize(obj.visitante))errors.push('El equipo local y visitante son iguales.');
   for(const key of ['goles_local','goles_visitante'])if(obj[key]&&!/^\d{1,3}$/.test(obj[key]))errors.push(key==='goles_local'?'Goles local inválidos.':'Goles visitante inválidos.');
  }
  if(type==='jugadores'){
   if(obj.numero&&!/^\d{1,3}$/.test(obj.numero))errors.push('Número inválido.');
   if(obj.fecha_nacimiento&&!validDate(obj.fecha_nacimiento))errors.push('Fecha de nacimiento inválida.');
  }
  const signature=(type==='equipos'?[obj.nombre,obj.categoria]:type==='jugadores'?[obj.nombre,obj.equipo]:[obj.fecha,obj.local,obj.visitante,obj.categoria]).map(normalize).join('|');
  if(signature.replace(/\|/g,'')){
   if(seen.has(signature))errors.push('Registro duplicado dentro del archivo.');
   else seen.add(signature);
  }
  results.push({line:i+2,data:obj,errors});
 });
 return {missing:required.map(f=>f[1]),results,valid:results.filter(r=>r.errors.length===0),invalid:results.filter(r=>r.errors.length>0)};
}
export function csvExport(table){
 const safe=value=>{
  let text=String(value??'');
  // Evitar que hojas de cálculo ejecuten fórmulas de celdas importadas.
  if(/^[\s]*[=+@-]/.test(text)||/^[\t\r\n]/.test(text))text="'"+text;
  return '"'+text.replace(/"/g,'""')+'"';
 };
 return '\uFEFF'+table.map(row=>row.map(safe).join(',')).join('\r\n');
}
function downloadCSV(rows,name){
 const blob=new Blob([csvExport(rows)],{type:'text/csv;charset=utf-8'});
 const url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1500);
}
async function parseCsvBackground(text,chosen){
 const direct=()=>{const delimiter=chosen==='auto'?detectDelimiter(text):chosen==='tab'?'\t':chosen;return {parsed:parseDelimited(text,delimiter),delimiter};};
 if(typeof Worker==='undefined')return direct();
 let worker;
 try{
  worker=new Worker(new URL('./v1222-csv-parser-worker.js',import.meta.url),{type:'module'});
  const result=await new Promise((resolve,reject)=>{
   const expiry=setTimeout(()=>reject(new Error('Tiempo de espera del analizador local')),8000);
   worker.onmessage=e=>{clearTimeout(expiry);if(e.data?.ok)resolve(e.data);else reject(Error(e.data?.error||'Error en el analizador'));};
   worker.onerror=()=>{clearTimeout(expiry);reject(Error('Worker CSV no disponible'));};
   worker.postMessage({text,delimiter:chosen});
  });
  return result;
 }catch(_){return direct();}
 finally{if(worker)worker.terminate();}
}
export function openCsvImporter({modal,toast,log,officialTeams}){
 const m=modal('Importar CSV','Analiza y prepara datos de la Liga. La revisión es local: no se publican cambios oficiales.',
 '<div class="csvpro">'+
 '<div class="csvpro-head"><div class="csvpro-step">1 <span>ARCHIVO Y TIPO</span></div><div class="csvpro-privacy">🔒 Sin subir datos</div></div>'+
 '<div class="csvpro-aiintro"><span class="csvpro-aiicon" aria-hidden="true">✦</span><div><b>Asistente inteligente local</b><small>Detecta datos, aprende de tus columnas y revisa errores automáticamente. Sin internet ni modelos pesados.</small></div></div>'+
 '<label class="csvpro-field"><span>¿Qué vas a revisar?</span><select data-csv-type><option value="equipos">Equipos</option><option value="jugadores">Jugadores</option><option value="resultados">Partidos y resultados</option></select></label>'+
 '<label class="csvpro-drop" data-csv-drop tabindex="0" role="button" aria-label="Seleccionar o soltar archivo CSV"><span class="csvpro-upload">⇧</span><b>Seleccionar o arrastrar CSV</b><small data-csv-name>CSV o TSV · máximo 5 MB · hasta 12 000 filas</small><input type="file" accept=".csv,.tsv,text/csv,text/tab-separated-values" data-csv-file></label>'+
 '<div class="csvpro-line"><label class="csvpro-field"><span>Separador</span><select data-csv-delimiter><option value="auto">Automático</option><option value=",">Coma (,)</option><option value=";">Punto y coma (;)</option><option value="tab">Tabulador</option><option value="|">Barra (|)</option></select></label><button class="csvpro-button csvpro-ghost" type="button" data-csv-template>↓ Plantilla CSV</button></div>'+
 '<div class="csvpro-actions"><button class="csvpro-button csvpro-primary" type="button" data-csv-parse disabled>Analizar archivo</button><button class="csvpro-button csvpro-ghost" type="button" data-csv-reset>Limpiar</button></div>'+
 '<div class="csvpro-localrow"><small>El aprendizaje guarda solo encabezados corregidos, nunca los datos del archivo.</small><button class="csvpro-forget" data-csv-forget type="button">Olvidar aprendizaje</button></div>'+
 '<p role="status" class="csvpro-status" data-csv-status>Selecciona un archivo o descarga una plantilla para comenzar.</p>'+
 '<div data-csv-result></div></div>');
 m.classList.add('v1212-csv-modal');
 const $=selector=>m.querySelector(selector);
 const els={type:$('[data-csv-type]'),file:$('[data-csv-file]'),drop:$('[data-csv-drop]'),delimiter:$('[data-csv-delimiter]'),name:$('[data-csv-name]'),status:$('[data-csv-status]'),result:$('[data-csv-result]'),parse:$('[data-csv-parse]')};
 let selected=null,parsed=null,mapping={},analysis=null,query='',filter='all',shown=25,activeFile=0;
 let smart=null,insights=null,teamCompare=null,normalizeCategories=false,typeChanged=false;
 let learning=readCsvLearning(typeof localStorage==='undefined'?null:localStorage);
 const propose=()=>{
  smart=suggestCsvMapping(parsed.headers,parsed.rows,els.type.value,SCHEMAS,learning);
  mapping={...smart.mapping};
 };
 const setStatus=(message,problem=false)=>{els.status.textContent=message;els.status.classList.toggle('csvpro-error',problem);};
 const process=()=>{
  if(!parsed)return;
  analysis=analyzeCsv(parsed,els.type.value,mapping);
  insights=csvLocalInsights(parsed,els.type.value,mapping,analysis);
  let official=[];
  try{official=typeof officialTeams==='function'?officialTeams():[];}catch(_){}
  teamCompare=compareCsvTeams(parsed,els.type.value,mapping,official);
  render();
 };
 const choose=file=>{
  if(!file)return;
  if(!/\.(csv|tsv)$/i.test(file.name)){toast('Selecciona un archivo .csv o .tsv');return;}
  if(file.size>CAP_BYTES){toast('Máximo permitido: 5 MB');return;}
  selected=file;els.name.textContent=file.name+' · '+(file.size/1024).toFixed(1)+' KB';
  els.parse.disabled=false;parsed=null;analysis=null;els.result.innerHTML='';setStatus('Archivo listo para analizar.');
  void readFile();
 };
 const readFile=async()=>{
  if(!selected)return;
  const myFile=selected,revision=++activeFile;
  els.parse.disabled=true;setStatus('Analizando columnas, filas y formatos…');
  try{
   const bytes=await myFile.arrayBuffer();
   let decoded;
   try{decoded=new TextDecoder('utf-8',{fatal:true}).decode(bytes);}
   catch(_){decoded=new TextDecoder('windows-1252').decode(bytes);}
   if(revision!==activeFile)return;
   const {parsed:nextParsed,delimiter}=await parseCsvBackground(decoded,els.delimiter.value);
   if(revision!==activeFile)return;
   parsed=nextParsed;
   if(!parsed.headers.length||!parsed.rows.length)throw Error('El CSV necesita encabezados y al menos una fila de datos.');
   const detected=guessCsvType(parsed.headers,parsed.rows,SCHEMAS);
   if(detected.type&&!typeChanged)els.type.value=detected.type;
   propose();shown=25;filter='all';query='';
   process();
   setStatus('Revisión automática lista: '+parsed.rows.length+' registros · '+(detected.type?'tipo sugerido: '+SCHEMAS[detected.type].label+' · ':'')+'separador '+(delimiter==='\t'?'tabulador':delimiter));
   if(typeof log==='function')log('CSV analizado localmente sin modificar datos oficiales');
  }catch(err){
   parsed=null;analysis=null;els.result.innerHTML='';
   setStatus(String(err?.message||'Error al leer el CSV'),true);
  }finally{if(revision===activeFile)els.parse.disabled=false;}
 };
 const render=()=>{
  if(!analysis||!parsed)return;
  const {valid,invalid,missing,results}=analysis;
  const fields=SCHEMAS[els.type.value].fields;
  const mapUI=fields.map(([key,label,mandatory])=>
   '<label class="csvpro-map-item"><span>'+html(label)+(mandatory?' *':'')+'</span><small class="csvpro-confidence">'+html(mapping[key]>=0?'IA local · '+(smart?.confidence?.[key]||'revisada'):'Sin coincidencia segura')+'</small><select data-map="'+html(key)+'"><option value="-1">Sin asignar</option>'+
    parsed.headers.map((h,i)=>'<option value="'+i+'" '+(mapping[key]===i?'selected':'')+'>'+html(h||'(sin nombre)')+' · '+(i+1)+'</option>').join('')+'</select></label>').join('');
  const warning=[...parsed.warnings,...missing.map(n=>'Falta asignar: '+n)];
  const warningUI=warning.length?'<details class="csvpro-warnings"><summary>Revisar '+warning.length+' aviso(s)</summary><ul>'+warning.slice(0,35).map(w=>'<li>'+html(w)+'</li>').join('')+'</ul></details>':'';
  const teamReport=teamCompare?.available?'<details class="csvpro-warnings csvpro-teamreview"><summary>Comparación local: '+teamCompare.exact+' coincidencia(s) exacta(s), '+teamCompare.notFound+' valor(es) por revisar</summary>'+
   '<p>Se compararon los nombres del CSV con los equipos que ya carga tu página. Una diferencia no significa necesariamente que el equipo no exista.</p>'+
   (teamCompare.suggestions.length?'<ul>'+teamCompare.suggestions.map(x=>'<li>'+html(x.name)+' → Posible: '+html(x.suggested)+' ('+x.score+'% parecido)</li>').join('')+'</ul>':'')+'</details>':'';
  const aiReport='<div class="csvpro-aireport" aria-label="Diagnóstico automático">'+
   '<div class="csvpro-aireport-head"><b>✦ Diagnóstico local</b><strong>'+insights.quality+'% filas correctas</strong></div>'+
   '<div class="csvpro-meter" role="progressbar" aria-label="Filas correctas" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+insights.quality+'"><span style="width:'+insights.quality+'%"></span></div>'+
   '<ul>'+insights.notes.map(n=>'<li>'+html(n)+'</li>').join('')+'</ul></div>';
  els.result.innerHTML=
   aiReport+teamReport+
   '<div class="csvpro-step csvpro-section">2 <span>ASIGNAR COLUMNAS</span></div>'+
   '<div class="csvpro-map">'+mapUI+'</div>'+
   '<div class="csvpro-summary"><div><b>'+results.length+'</b><small>Filas</small></div><div><b>'+valid.length+'</b><small>Correctas</small></div><div><b>'+invalid.length+'</b><small>Con errores</small></div></div>'+
   warningUI+
   '<label class="csvpro-normalize"><input type="checkbox" data-csv-normalize '+(normalizeCategories?'checked':'')+'><span><b>Normalizar nombres de categorías</b><small>Sólo modifica el archivo CSV exportado, nunca los datos oficiales.</small></span></label>'+
   '<div class="csvpro-step csvpro-section">3 <span>VISTA PREVIA Y REVISIÓN</span></div>'+
   '<div class="csvpro-filters"><input data-csv-search placeholder="Buscar equipo, jugador o fecha…" aria-label="Buscar registros" value="'+html(query)+'"><select data-csv-filter aria-label="Filtrar filas"><option value="all">Todos</option><option value="valid">Correctos</option><option value="invalid">Con errores</option></select></div>'+
   '<div data-csv-table></div>'+
   '<div class="csvpro-actions csvpro-downloads"><button type="button" class="csvpro-button csvpro-primary" data-csv-valid '+(!valid.length||missing.length?'disabled':'')+'>↓ CSV corregido ('+valid.length+')</button>'+
   '<button type="button" class="csvpro-button csvpro-ghost" data-csv-errors '+(!invalid.length?'disabled':'')+'>↓ Reporte de errores ('+invalid.length+')</button></div>'+
   '<p class="csvpro-note">Vista previa privada. Ningún botón de esta ventana modifica equipos, jugadores ni resultados oficiales.</p>';
  const f=$('[data-csv-filter]');f.value=filter;
  const normalizer=$('[data-csv-normalize]');normalizer.addEventListener('change',e=>{normalizeCategories=e.target.checked;renderTable();});
  els.result.querySelectorAll('[data-map]').forEach(select=>select.addEventListener('change',()=>{
   const field=select.dataset.map,idx=Number(select.value);
   // Evita asignar simultáneamente una columna a dos campos distintos.
   if(idx>=0)for(const key of Object.keys(mapping))if(key!==field&&mapping[key]===idx)mapping[key]=-1;
   mapping[field]=idx;
   if(idx>=0){
    keepCsvLearning(typeof localStorage==='undefined'?null:localStorage,els.type.value,parsed.headers[idx],field);
    learning=readCsvLearning(typeof localStorage==='undefined'?null:localStorage);
    smart.confidence[field]='aprendida';
   }
   shown=25;process();
  }));
  $('[data-csv-search]').addEventListener('input',e=>{query=e.target.value;shown=25;renderTable();});
  f.addEventListener('change',()=>{filter=f.value;shown=25;renderTable();});
  $('[data-csv-valid]').addEventListener('click',()=>{
   if(missing.length)return toast('Asigna primero los campos obligatorios.');
   const keys=fields.map(f=>f[0]);
   downloadCSV([fields.map(f=>f[1]),...valid.map(r=>keys.map(k=>{
    const v=r.data[k];return normalizeCategories&&k==='categoria'?(standardCategory(v)||v):v;
   }))],'Liga_'+els.type.value+'_revisados.csv');
  });
  $('[data-csv-errors]').addEventListener('click',()=>{
   downloadCSV([['Fila','Errores',...fields.map(f=>f[1])],...invalid.map(r=>[r.line,r.errors.join(' | '),...fields.map(f=>r.data[f[0]])])],'Liga_'+els.type.value+'_errores.csv');
  });
  renderTable();
 };
 const renderTable=()=>{
  const target=$('[data-csv-table]');if(!target||!analysis)return;
  const keys=SCHEMAS[els.type.value].fields.map(f=>f[0]);
  const list=analysis.results.filter(r=>(filter==='all'||(filter==='valid'?!r.errors.length:!!r.errors.length))&&
    (!query||[...Object.values(r.data),...r.errors].join(' ').toLowerCase().includes(query.toLowerCase().trim())));
  const page=list.slice(0,shown);
  target.innerHTML=list.length?
   '<div class="csvpro-tablewrap" role="region" aria-label="Datos CSV" tabindex="0"><table class="csvpro-table"><thead><tr><th>Fila</th><th>Estado</th>'+SCHEMAS[els.type.value].fields.map(f=>'<th>'+html(f[1])+'</th>').join('')+'</tr></thead><tbody>'+
   page.map(r=>'<tr><td>'+r.line+'</td><td><span class="csvpro-chip '+(r.errors.length?'bad':'ok')+'" title="'+html(r.errors.join(' · '))+'">'+(r.errors.length?'Revisar':'Correcto')+'</span>'+(r.errors.length?'<small class="csvpro-rowerrors">'+html(r.errors.join(' · '))+'</small>':'')+'</td>'+
     keys.map(k=>'<td>'+html(r.data[k]||'—')+'</td>').join('')+'</tr>').join('')+
   '</tbody></table></div>'+
   '<div class="csvpro-page"><small>Mostrando '+page.length+' de '+list.length+' registros</small>'+(shown<list.length?'<button class="csvpro-button csvpro-ghost" data-csv-more>Ver 25 más</button>':'')+'</div>'
   :'<div class="csvpro-empty">No hay filas para este filtro.</div>';
  const more=target.querySelector('[data-csv-more]');if(more)more.onclick=()=>{shown+=25;renderTable();};
 };
 els.file.addEventListener('change',()=>choose(els.file.files?.[0]));
 els.parse.onclick=()=>void readFile();
 els.type.addEventListener('change',()=>{typeChanged=true;if(parsed){propose();process();}});
 els.delimiter.addEventListener('change',()=>{if(selected)void readFile();});
 $('[data-csv-reset]').onclick=()=>{activeFile++;selected=null;parsed=null;analysis=null;smart=null;insights=null;typeChanged=false;normalizeCategories=false;els.file.value='';els.name.textContent='CSV o TSV · máximo 5 MB · hasta 12 000 filas';els.parse.disabled=true;els.result.innerHTML='';setStatus('Selecciona un archivo o descarga una plantilla para comenzar.');};
 $('[data-csv-forget]').onclick=()=>{
  try{localStorage.removeItem('ljr-csv-local-learning-v1');}catch(_){}
  learning={};if(parsed){propose();process();}
  setStatus('Aprendizaje local borrado. Los archivos y los datos oficiales no se modificaron.');
 };
 $('[data-csv-template]').onclick=()=>{
  const type=els.type.value,headers=SCHEMAS[type].fields.map(f=>f[1]);
  const samples={equipos:['Galácticos de Pozos','Primera','Campo Municipal','Pozos'],
   jugadores:['Jugador de ejemplo','Galácticos de Pozos','Primera','10','2000-01-01'],
   resultados:['2026-10-11','Equipo local','Equipo visitante','2','1','Primera','Unidad Deportiva Sur']};
  downloadCSV([headers,samples[type]],'Plantilla_Liga_'+type+'.csv');
 };
 els.drop.addEventListener('dragover',e=>{e.preventDefault();els.drop.classList.add('csvpro-drag');});
 els.drop.addEventListener('dragleave',()=>els.drop.classList.remove('csvpro-drag'));
 els.drop.addEventListener('drop',e=>{e.preventDefault();els.drop.classList.remove('csvpro-drag');choose(e.dataTransfer?.files?.[0]);});
 els.drop.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target===els.drop){e.preventDefault();els.file.click();}});
 return m;
}
