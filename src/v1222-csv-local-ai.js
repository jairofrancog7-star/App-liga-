/* CSV IA LOCAL LIGERA — clasificación y aprendizaje privado en el dispositivo.
   Sin red, sin librerías pesadas, sin subir CSV, sin modificar datos oficiales.
   El aprendizaje conserva únicamente los nombres de encabezados corregidos. */
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[_./-]+/g,' ').replace(/[^a-z0-9+ ]+/g,' ').trim().replace(/\s+/g,' ');
const countWords=t=>new Set(norm(t).split(' ').filter(x=>x.length>1));
const dice=(a,b)=>{
 a=norm(a).replace(/\s+/g,'');b=norm(b).replace(/\s+/g,'');
 if(!a||!b)return 0;
 if(a===b)return 1;
 if(a.length<2||b.length<2)return 0;
 const bags=new Map();
 for(let i=0;i<a.length-1;i++){const k=a.slice(i,i+2);bags.set(k,(bags.get(k)||0)+1);}
 let overlap=0;
 for(let i=0;i<b.length-1;i++){const k=b.slice(i,i+2),n=bags.get(k)||0;if(n>0){bags.set(k,n-1);overlap++;}}
 return 2*overlap/(a.length+b.length-2);
};
const canonical=[
 ['Primera',['primera','primera fuerza','primera division','1a','1ra','1era','1']],
 ['Intermedia',['intermedia','intermedio','intermedia libre']],
 ['Segunda',['segunda','segunda fuerza','segunda division','2a','2da','2']],
 ['Veteranos 35+',['veteranos 35+','veteranos 35','veteranos +35','veteranos mayores de 35','35+','35 y mas','veteranos 35 anos','vet 35']],
 ['Veteranos 50+',['veteranos 50+','veteranos 50','veteranos +50','veteranos mayores de 50','50+','50 y mas','veteranos 50 anos','vet 50']]
];
export function standardCategory(value){
 const n=norm(value);if(!n)return null;
 for(const [name,aliases] of canonical)if(aliases.some(x=>norm(x)===n))return name;
 return null;
}
const profileHints={
 nombre:{examples:['nombre equipo','nombre jugador','nombre completo','razon social','nombre de club','nombre','nom jugador','equipo nombre'],kind:'name'},
 equipo:{examples:['nombre equipo','club','equipo','team','escuadra','equipo de origen'],kind:'team'},
 categoria:{examples:['categoria','categoría','cat','division','división','rama','clase','competicion'],kind:'category'},
 campo:{examples:['sede','cancha','campo','estadio','terreno','campo de juego'],kind:'team'},
 ciudad:{examples:['comunidad','ciudad','localidad','municipio','poblacion','origen'],kind:'name'},
 numero:{examples:['numero de jersey','numero','num','dorsal','camiseta','jersey'],kind:'number'},
 fecha_nacimiento:{examples:['nacimiento','fecha de nacimiento','fecha nacimiento','fec nac','fecha nac','f nacimiento'],kind:'date'},
 fecha:{examples:['fecha de partido','fecha juego','dia partido','fecha','jornada fecha','fecha encuentro'],kind:'date'},
 local:{examples:['equipo local','local','equipo casa','home','anfitrion','club local'],kind:'team'},
 visitante:{examples:['equipo visitante','visitante','equipo fuera','away','rival','club visitante'],kind:'team'},
 goles_local:{examples:['goles local','goles del local','marcador local','goles casa','gl','gol local'],kind:'goals'},
 goles_visitante:{examples:['goles visitante','goles del visitante','marcador visitante','goles fuera','gv','gol visitante'],kind:'goals'}
};
const classifySample=(values,kind)=>{
 const sample=values.map(v=>String(v??'').trim()).filter(Boolean).slice(0,28);
 if(sample.length<2)return 0;
 let valid=0;
 for(const v of sample){
  if(kind==='category'&&standardCategory(v))valid++;
  else if(kind==='date'&&(/^\d{4}-\d{1,2}-\d{1,2}$/.test(v)||/^\d{1,2}[-/]\d{1,2}[-/]\d{4}$/.test(v)))valid++;
  else if(kind==='number'&&/^\d{1,3}$/.test(v))valid++;
  else if(kind==='goals'&&/^\d{1,2}$/.test(v))valid++;
  else if((kind==='name'||kind==='team')&&/[a-záéíóúñ]/i.test(v)&&!/^\d+$/.test(v))valid++;
 }
 return valid/sample.length;
};
const singleScore=(header,field,aliases,values,learning={})=>{
 const name=norm(header);if(!name)return {score:0,origin:'',sample:0};
 const hints=profileHints[field]||{examples:[],kind:'name'};
 const matches=[field,...aliases,hints.examples??[]].flat().filter(Boolean);
 let best=0,origin='';
 for(const alias of matches){
  const n=norm(alias);if(!n)continue;
  let score=name===n?100:(name.length>=4&&n.length>=4&&(name.includes(n)||n.includes(name))?83:0);
  if(!score&&name.length>=4&&n.length>=4){
   const ratio=dice(name,n),a=countWords(name),b=countWords(n);
   let common=0;for(const word of a)if(b.has(word))common++;
   const token=common/Math.max(1,Math.max(a.size,b.size));
   score=Math.round(Math.max(ratio*69,token*74));
  }
  if(score>best){best=score;origin=name===n?'encabezado exacto':'similitud de encabezado';}
 }
 const memoryFor=learning[field]||[];
 if(memoryFor.some(x=>norm(x)===name)){best=120;origin='aprendizaje local';}
 const sample=classifySample(values,hints.kind);
 // Los valores solos no pueden asignar nombres de personas o equipos.
 if(best>=49&&sample>=.7)best+=Math.round(5*sample);
 else if(best>=35&&sample>=.7&&['category','date','goals','number'].includes(hints.kind))best+=12;
 return {score:best,origin,sample};
};
export function suggestCsvMapping(headers,rows,type,schemas,learning={}){
 const spec=schemas[type];if(!spec)return {mapping:{},confidence:{},reasons:{}};
 const used=new Set(),mapping={},confidence={},reasons={};
 const candidates=[];
 spec.fields.forEach(([field,, ,aliases])=>{
  headers.forEach((header,i)=>{
   const examples=rows.slice(0,30).map(r=>r[i]);
   const found=singleScore(header,field,aliases,examples,learning[type]||{});
   candidates.push({field,index:i,...found});
  });
 });
 candidates.sort((a,b)=>b.score-a.score);
 for(const c of candidates){
  if(c.score<65||used.has(c.index)||mapping[c.field]!==undefined)continue;
  mapping[c.field]=c.index;used.add(c.index);
  confidence[c.field]=c.score>=95?'alta':c.score>=78?'media':'revisar';
  reasons[c.field]=c.origin;
 }
 spec.fields.forEach(([field])=>{if(mapping[field]===undefined){mapping[field]=-1;confidence[field]='sin coincidencia';reasons[field]='Asigna la columna manualmente';}});
 return {mapping,confidence,reasons};
}
export function guessCsvType(headers,rows,schemas){
 const scores=[];
 for(const type of Object.keys(schemas)){
  const hints=suggestCsvMapping(headers,rows,type,schemas);
  let score=0;
  for(const [key,,required] of schemas[type].fields){
   if(hints.mapping[key]>=0)score+=required?3:1.2;
  }
  scores.push({type,score,mapped:Object.values(hints.mapping).filter(i=>i>=0).length});
 }
 scores.sort((a,b)=>b.score-a.score);
 return {type:scores[0]?.score>=5&&scores[0].score>scores[1]?.score*1.2?scores[0].type:null,scores};
}
export function csvLocalInsights(parsed,type,mapping,analysis){
 const notes=[],data=analysis.results;
 const complete=Math.round(100*data.filter(row=>!row.errors.length).length/Math.max(1,data.length));
 const idx=mapping.categoria;
 let recognized=0,unknown=0,normalizable=0,distinct=new Set();
 if(idx>=0){
  for(const row of parsed.rows){
   const value=String(row[idx]??'').trim();if(!value)continue;
   const standard=standardCategory(value);
   if(standard){recognized++;distinct.add(standard);if(norm(value)!==norm(standard))normalizable++;}
   else {unknown++;if(distinct.size<10)distinct.add(value);}
  }
  if(unknown)notes.push(unknown+' categoría(s) no coinciden con las cinco categorías oficiales; revísalas antes de publicar.');
  if(normalizable)notes.push(normalizable+' categoría(s) pueden estandarizarse únicamente en el CSV descargado.');
 }
 if(analysis.missing.length)notes.push('Asigna campos obligatorios: '+analysis.missing.join(', ')+'.');
 if(analysis.invalid.length)notes.push('Hay '+analysis.invalid.length+' fila(s) para revisar. Filtra por "Con errores" y descarga el reporte.');
 if(!data.length)notes.push('El archivo no contiene registros.');
 if(!notes.length)notes.push('Estructura consistente. Revisa el contenido antes de utilizarlo fuera de esta pantalla.');
 return {quality:complete,recognized,unknown,normalizable,categories:[...distinct].slice(0,10),notes:notes.slice(0,5)};
}
export function keepCsvLearning(storage,type,header,field){
 if(!storage||!type||!field||!header||String(header).length>80)return false;
 try{
  const current=JSON.parse(storage.getItem('ljr-csv-local-learning-v1')||'{}');
  const safe=Object.fromEntries(Object.entries(current||{}).filter(([k])=>['equipos','jugadores','resultados'].includes(k)));
  if(!safe[type])safe[type]={};
  // Una columna corregida solo debe asignarse a un campo de cada tipo.
  for(const key of Object.keys(safe[type]))safe[type][key]=(safe[type][key]||[]).filter(s=>norm(s)!==norm(header));
  if(!Array.isArray(safe[type][field]))safe[type][field]=[];
  safe[type][field].unshift(String(header));
  safe[type][field]=[...new Set(safe[type][field])].slice(0,15);
  storage.setItem('ljr-csv-local-learning-v1',JSON.stringify(safe));
  return true;
 }catch(_){return false;}
}
export function readCsvLearning(storage){
 try{
  const value=JSON.parse(storage?.getItem('ljr-csv-local-learning-v1')||'{}');
  return value&&typeof value==='object'&&!Array.isArray(value)?value:{};
 }catch(_){return {};}
}
