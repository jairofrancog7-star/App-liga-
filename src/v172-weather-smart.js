/* V172 — Clima inteligente por partido/campo.
   Port funcional del motor V38 FIX23 de Liga_Futbol a la app azul.
   Mantiene separados: pronóstico meteorológico, estado físico del terreno
   y decisión oficial de la Liga. */
(function(){
'use strict';
if(window.__LJR_V172_WEATHER_SMART__)return;
window.__LJR_V172_WEATHER_SMART__=true;

const BUILD='20260922-dirt-fields-v178';
const FALLBACK_FIELD_CONFIG={"build":"38-22","timezone":"America/Mexico_City","weatherProvider":"Open-Meteo","mapsProvider":"Google Maps","regionalFallback":{"latitude":20.64337,"longitude":-100.99286,"label":"Referencia regional Juventino Rosas","precision":"regional"},"playPatterns":{"Veteranos 35+":{"dayOfWeek":6,"label":"Sábado","timeRule":"afternoon"},"Veteranos 50+":{"dayOfWeek":6,"label":"Sábado","timeRule":"afternoon"},"Primera Fuerza":{"dayOfWeek":0,"label":"Domingo","timeRule":"morning"},"Intermedia":{"dayOfWeek":0,"label":"Domingo","timeRule":"morning"},"Segunda Fuerza":{"dayOfWeek":0,"label":"Domingo","timeRule":"morning"}},"fields":[{"id":"sur-1","name":"Campo 1 · Unidad Deportiva Sur","aliases":["1","Campo 1"],"community":"Juventino Rosas","latitude":20.63753,"longitude":-100.99297,"precision":"complex","weatherEligible":true,"mapsQuery":"Unidad Deportiva Sur, Juventino Rosas, Guanajuato","address":"Unidad Deportiva Sur, Juventino Rosas, Guanajuato","source":"https://mapcarta.com/es/W544245910","sourceNote":"Coordenada del complejo deportivo; no del rectángulo exacto del Campo 1."},{"id":"sur-2","name":"Campo 2 · Unidad Deportiva Sur","aliases":["2","Campo 2"],"community":"Juventino Rosas","latitude":20.63753,"longitude":-100.99297,"precision":"complex","weatherEligible":true,"mapsQuery":"Unidad Deportiva Sur, Juventino Rosas, Guanajuato","address":"Unidad Deportiva Sur, Juventino Rosas, Guanajuato","source":"https://mapcarta.com/es/W544245910","sourceNote":"Coordenada del complejo deportivo; no del rectángulo exacto del Campo 2."},{"id":"sur-3","name":"Campo 3 · Unidad Deportiva Sur","aliases":["3","Campo 3"],"community":"Juventino Rosas","latitude":20.63753,"longitude":-100.99297,"precision":"complex","weatherEligible":true,"mapsQuery":"Unidad Deportiva Sur, Juventino Rosas, Guanajuato","address":"Unidad Deportiva Sur, Juventino Rosas, Guanajuato","source":"https://mapcarta.com/es/W544245910","sourceNote":"Coordenada del complejo deportivo; no del rectángulo exacto del Campo 3."},{"id":"zapata-4","name":"Campo 4 · Emiliano Zapata","aliases":["4","Campo 4"],"community":"Juventino Rosas","latitude":null,"longitude":null,"precision":"pending","weatherEligible":true,"mapsQuery":"Campo de futbol prolongación Emiliano Zapata, Juventino Rosas, Guanajuato","address":"Prolongación Emiliano Zapata, Juventino Rosas, Guanajuato","source":"https://juventinorosas.gob.mx/documentos/primerInforme.pdf","sourceNote":"La fuente municipal confirma un campo de futbol en prolongación Emiliano Zapata, pero no aporta pin exacto.","weatherLatitude":20.64337,"weatherLongitude":-100.99286,"weatherPrecision":"regional","weatherSourceNote":"Clima disponible con referencia regional de Juventino Rosas; el pin exacto del campo sigue pendiente."},{"id":"cerrito","name":"Campo Cerrito de Gasca","aliases":["Cerrito de Gasca","C. de Gasca"],"community":"Cerrito de Gasca","latitude":20.617778,"longitude":-101.0625,"precision":"locality","weatherEligible":true,"mapsQuery":"Campo de futbol Cerrito de Gasca, Guanajuato","address":"Cerrito de Gasca, Santa Cruz de Juventino Rosas, Guanajuato","source":"https://mx.micodigopostal.info/distrito/guanajuato-santa-cruz-de-juventino-rosas","sourceNote":"Pin meteorológico de la localidad; confirmar el pin exacto del campo en JR Control."},{"id":"tavera","name":"Campo de Tavera","aliases":["Tavera","Franco Tavera"],"community":"Franco Tavera","latitude":20.60839,"longitude":-100.93238,"precision":"locality","weatherEligible":true,"mapsQuery":"Campo de futbol Franco Tavera, Santa Cruz de Juventino Rosas, Guanajuato","address":"Franco Tavera, Santa Cruz de Juventino Rosas, Guanajuato","source":"https://mapcarta.com/es/N9038832918","sourceNote":"Pin meteorológico de Franco Tavera. Parque de Tavera y campos deportivos cercanos están documentados, pero no el pin exacto del campo de liga."},{"id":"san-juan","name":"Campo San Juan de la Cruz","aliases":["San Juan","S. Juan de la Cruz","San Juan de la Cruz"],"community":"San Juan de la Cruz","latitude":null,"longitude":null,"precision":"user-map-link","weatherEligible":true,"mapsQuery":"https://maps.app.goo.gl/VJkp1fRa9t5yzfkb9","address":"San Juan de la Cruz, Santa Cruz de Juventino Rosas, Guanajuato 38250","source":"https://maps.app.goo.gl/VJkp1fRa9t5yzfkb9","sourceNote":"Ubicación del Campo San Juan de la Cruz corregida con el enlace exacto de Google Maps aportado por el usuario. Se retiró el pin anterior para evitar mostrar una ubicación incorrecta.","weatherLatitude":20.63379,"weatherLongitude":-100.911569,"weatherPrecision":"community","weatherSourceNote":"Clima disponible con referencia meteorológica de San Juan de la Cruz; el enlace de Maps sigue siendo la referencia de ubicación."},{"id":"cuenda","name":"Unidad Deportiva Santiago de Cuenda","aliases":["Cuenda","Santiago de Cuenda"],"community":"Santiago de Cuenda","latitude":20.59793,"longitude":-100.99663,"precision":"locality","weatherEligible":true,"mapsQuery":"Unidad Deportiva Santiago de Cuenda, Guanajuato","address":"38253 Santiago de Cuenda, Santa Cruz de Juventino Rosas, Guanajuato","source":"https://mapcarta.com/es/20312960","sourceNote":"La Unidad Deportiva existe; el pin meteorológico usa el centro de Santiago de Cuenda hasta confirmar coordenada exacta del campo."},{"id":"romerillo","name":"Campo San Antonio de Romerillo","aliases":["Romerillo","San Antonio de Romerillo"],"community":"San Antonio de Romerillo","latitude":20.60784,"longitude":-100.94854,"precision":"locality","weatherEligible":true,"mapsQuery":"Campo de futbol San Antonio de Romerillo, Guanajuato","address":"San Antonio de Romerillo, Santa Cruz de Juventino Rosas, Guanajuato 38255","source":"https://mapcarta.com/es/20322614","sourceNote":"Pin meteorológico de la localidad; la infraestructura deportiva en Romerillo está documentada."},{"id":"fraccionamiento","name":"Campo Fraccionamiento Comontuoso","aliases":["Fraccionamiento"],"community":"Comontuoso / Santiago de Cuenda","latitude":null,"longitude":null,"precision":"pending","weatherEligible":true,"mapsQuery":"Campo de futbol Fraccionamiento Comontuoso, Juventino Rosas, Guanajuato","address":"Fraccionamiento Comontuoso, Santa Cruz de Juventino Rosas, Guanajuato","source":"https://juventinorosas.gob.mx/documentos/primerInforme.pdf","sourceNote":"La fuente municipal confirma rehabilitación del campo de futbol del Fraccionamiento Comontuoso; falta pin exacto.","weatherLatitude":20.59793,"weatherLongitude":-100.99663,"weatherPrecision":"community","weatherSourceNote":"Clima disponible con referencia de Santiago de Cuenda/Comontuoso; el pin exacto del campo sigue pendiente."},{"id":"pozos","name":"Campo de Fútbol de Pozos","aliases":["Pozos"],"community":"Pozos","latitude":20.61767,"longitude":-100.90033,"precision":"exact","weatherEligible":true,"mapsQuery":"20.61767,-100.90033","address":"Campo de Fútbol de Pozos, Santa Cruz de Juventino Rosas, Guanajuato","source":"https://mapcarta.com/es/W269638702","sourceNote":"Pin del terreno de juego de fútbol (OpenStreetMap way 269638702)."},{"id":"rincon","name":"Campo Rincón de Centeno","aliases":["Rincón de Centeno","Rincon de Centeno","Rincón del Centeno"],"community":"Rincón de Centeno","latitude":null,"longitude":null,"precision":"user-map-link","weatherEligible":true,"mapsQuery":"https://maps.app.goo.gl/RzxJokJsPw86ZePC9","address":"Campo Rincón de Centeno · ubicación exacta en Google Maps","source":"https://maps.app.goo.gl/RzxJokJsPw86ZePC9","sourceNote":"Ubicación exacta del Campo Rincón de Centeno actualizada con el enlace de Google Maps aportado por el usuario. No se muestra 'Pin pendiente' porque ya existe enlace exacto.","weatherLatitude":20.660153,"weatherLongitude":-100.886766,"weatherPrecision":"community","weatherSourceNote":"Clima disponible con referencia meteorológica de Rincón de Centeno; el enlace exacto de Google Maps se conserva por separado."},{"id":"san-jose","name":"Campo San José de la Montaña","aliases":["San José","San Jose","San José de la Montaña"],"community":"San José de la Montaña","latitude":20.60102,"longitude":-101.07242,"precision":"locality","weatherEligible":true,"mapsQuery":"Campo de futbol San José de la Montaña, Guanajuato","address":"San José de la Montaña, Salamanca, Guanajuato 36867","source":"https://mapcarta.com/es/20394190","sourceNote":"Pin meteorológico de la localidad. El campo debe confirmarse con el pin que usa la liga."},{"id":"san-julian","name":"Campo San Julián Tierra Blanca","aliases":["San Julián","San Julian"],"community":"San Julián Tierra Blanca","latitude":20.591403,"longitude":-101.040358,"precision":"near-field","weatherEligible":true,"mapsQuery":"Cancha de futbol San Julián Tierra Blanca, Juventino Rosas, Guanajuato","address":"Los Fundadores 100, San Julián Tierra Blanca, Santa Cruz de Juventino Rosas, Guanajuato","source":"https://app.seg.guanajuato.gob.mx/ceo/IU/Busquedas/PAG_General.aspx?ClaveCCT=11ETV0722F&turno=1","sourceNote":"La fuente oficial SEG ubica la escuela en Los Fundadores 100 y dice expresamente 'frente a cancha de fut-ball de la comunidad'; el pin es referencia inmediata, no centro confirmado del césped."}]};

const TZ='America/Mexico_City';
const CACHE_TTL=20*60*1000;
const ALERT_KEY='v172-weather-alerts';
const CAT_KEY='v172-weather-category';
const MATCH_KEY='v172-weather-match';
const FIELD_KEY='v172-weather-field';
const INSPECTION_KEY='v177-field-inspection:';

const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
const num=(v,d=0)=>Number.isFinite(Number(v))?Number(v):d;
const maybe=(v,d=null)=>v===null||v===undefined||v===''?d:(Number.isFinite(Number(v))?Number(v):d);

let hub=null,cfg=null,fixtures=[],mode='match',selectedCategory='',selectedMatch='',selectedField='',lastAnalysis=null;
let refreshTimer=0,lastAlertCheck=0,loadingPromise=null;
const wxCache=new Map();

function toast(text,type='ok'){
  let t=$('#v172WeatherToast');
  if(!t){t=document.createElement('div');t.id='v172WeatherToast';document.body.appendChild(t)}
  t.textContent=text;t.className='show '+type;clearTimeout(t._timer);
  t._timer=setTimeout(()=>t.className='',2500);
}

/* ---- Motor inteligente: mismo criterio explicable de V38 FIX23 ---- */
function getInspection(field){
  if(!field?.id)return {};
  try{return JSON.parse(localStorage.getItem(INSPECTION_KEY+field.id)||'{}')||{}}catch(_){return {}}
}
function saveInspection(fieldId,key,value){
  if(!fieldId)return;
  let data={};try{data=JSON.parse(localStorage.getItem(INSPECTION_KEY+fieldId)||'{}')||{}}catch(_){}
  data[key]=value;data.updatedAt=Date.now();
  localStorage.setItem(INSPECTION_KEY+fieldId,JSON.stringify(data));
}
function surfaceType(field,inspection={}){
  return inspection.surfaceType||field?.surfaceType||'dirt_compact';
}
function surfaceLabel(type){
  return ({dirt_compact:'Tierra compactada',dirt_sandy:'Tierra / arena',grass:'Pasto natural',synthetic:'Sintético'})[type]||'Tierra compactada';
}
function inspectionStats(x={}){
  const keys=['standingWater','mud','hardness','footing','ball','evenness','debris','dust','lines','goals','drainage'];
  const answered=keys.filter(k=>x[k]&&x[k]!=='unknown').length;
  return {answered,total:keys.length,complete:answered===keys.length};
}
function terrainEstimate(p24,p48,m={},inspection={},field=null){
  const a=num(p24?.precipTotal),b=num(p48?.precipTotal),top=maybe(m?.soilTopAvg,-1),sub=maybe(m?.soilSubAvg,-1),surface=surfaceType(field,inspection),isDirt=surface.startsWith('dirt_');
  if(inspection.standingWater==='yes')return {level:'very-wet',label:'Charcos reportados',detail:'La inspección física marcó agua estancada; la superficie necesita revisión antes de jugar.'};
  if(inspection.mud==='heavy')return {level:'very-wet',label:isDirt?'Tierra lodosa':'Superficie muy mojada',detail:'Se reportó lodo o barro importante; el balón, el apoyo y la tracción pueden verse afectados.'};
  if(inspection.footing==='unsafe')return {level:'unsafe',label:'Superficie insegura reportada',detail:'La inspección física indicó apoyo inseguro o terreno inestable.'};
  if(inspection.evenness==='dangerous'||inspection.debris==='dangerous')return {level:'unsafe',label:'Riesgo físico en la superficie',detail:'Hay irregularidades u objetos que deben corregirse antes de autorizar el juego.'};
  const wetHigh=isDirt?(top>=0.39||sub>=0.41||a>=14||b>=24):(top>=0.42||sub>=0.43||a>=18||b>=30);
  const wetMed=isDirt?(top>=0.34||sub>=0.37||a>=7||b>=14):(top>=0.36||sub>=0.38||a>=10||b>=18);
  const wetLow=isDirt?(top>=0.29||a>=3||b>=6):(top>=0.30||a>=4||b>=8);
  if(wetHigh)return {level:'very-wet',label:isDirt?'Tierra muy húmeda / saturada probable':'Saturación alta probable',detail:'La lluvia previa y la humedad modelada justifican revisar lodo, huella, drenaje y rodamiento del balón.'};
  if(wetMed)return {level:'wet',label:isDirt?'Tierra húmeda / pesada probable':'Pesado/húmedo probable',detail:'El terreno puede perder firmeza; conviene revisar apoyo, tracción y zonas blandas.'};
  if(wetLow)return {level:'damp',label:'Humedad moderada probable',detail:'Hay señales de humedad suficientes para justificar una inspección de la superficie.'};
  return {level:'dry',label:isDirt?'Tierra probablemente seca':'Bajo impacto de humedad',detail:isDirt?'No se detectan acumulados fuertes; revisa dureza, polvo, piedras y uniformidad antes de jugar.':'No se detectan acumulados fuertes ni humedad de suelo elevada en el modelo.'};
}
function verdictFor(probability){
  const p=clamp(Math.round(num(probability)),0,100);
  if(p>=82)return {key:'yes',label:'ALTA PROBABILIDAD DE JUGAR',short:'SÍ · MUY PROBABLE',tone:'good'};
  if(p>=67)return {key:'likely',label:'PROBABLEMENTE SE JUEGA',short:'SÍ · PROBABLE',tone:'good'};
  if(p>=45)return {key:'review',label:'REVISAR CAMPO · POR CONFIRMAR',short:'REVISAR',tone:'watch'};
  return {key:'risk',label:'ALTO RIESGO DE NO JUGAR',short:'NO · ALTO RIESGO',tone:'high'};
}
function confidenceFor(precision,hours,inspection={},m={}){
  let x=72,p=String(precision||'regional');
  if(p==='exact'||p==='admin-pin')x=82;
  else if(p==='complex'||p==='near-field')x=76;
  else if(p==='locality')x=68;
  else if(p==='regional')x=54;
  else if(p==='pending')x=46;
  if(num(hours?.hours)<3)x-=10;
  if(Number.isFinite(Number(m?.soilTopAvg)))x+=4;
  const s=inspectionStats(inspection);
  x+=Math.min(18,Math.round(s.answered*1.65));
  if(s.complete)x+=3;
  return clamp(Math.round(x),30,97);
}
function scorePlayability(input){
  const m=input?.match||null,p24=input?.prior24||{},p48=input?.prior48||{},p72=input?.prior72||{},precision=input?.precision||'regional',inspection=input?.inspection||{},field=input?.field||null;
  const surface=surfaceType(field,inspection),isDirt=surface.startsWith('dirt_'),terrain=terrainEstimate(p24,p48,m,inspection,field);
  if(!m)return {probability:null,confidence:confidenceFor(precision,p48,inspection,m),verdict:{key:'na',label:'SIN DATOS SUFICIENTES',short:'SIN DATOS',tone:'na'},terrain,reasons:['No hay datos meteorológicos suficientes para el horario seleccionado.'],inspection:inspectionStats(inspection),surface};
  let score=96,hardCap=98;const reasons=[],positives=[];
  const code=num(m.code),gust=num(m.gustMax),rainMax=num(m.rainMax),precipMax=num(m.precipMax),prob=num(m.probMax),p24sum=num(p24.precipTotal),p48sum=num(p48.precipTotal),p72sum=num(p72.precipTotal);
  const tmin=maybe(m.tempMin,maybe(m.temp,20)),apparent=maybe(m.apparentMax,maybe(m.temp,20)),vis=maybe(m.visibilityMin,99999),humidity=maybe(m.humidityAvg,-1),dewSpread=maybe(m.dewSpreadAvg,99);
  const soilTop=maybe(m.soilTopAvg,-1),soilSub=maybe(m.soilSubAvg,-1),et24=maybe(p24.et0Total,-1),sun24=maybe(p24.sunshineHours,-1);

  if(code>=95){score-=48;hardCap=Math.min(hardCap,35);reasons.push('Tormenta eléctrica prevista cerca del horario: condición de seguridad crítica.')}
  else if(code>=80){score-=10;reasons.push('Tiempo inestable cerca del horario.')}
  if(rainMax>=8){score-=35;reasons.push('Lluvia horaria fuerte durante la ventana del partido.')}else if(rainMax>=2.5){score-=25;reasons.push('Lluvia moderada durante la ventana del partido.')}else if(rainMax>=1){score-=13;reasons.push('Lluvia ligera durante la ventana del partido.')}
  if(prob>=85){score-=16;reasons.push('Probabilidad de precipitación muy alta a la hora del partido.')}else if(prob>=65){score-=10;reasons.push('Probabilidad de precipitación elevada.')}else if(prob>=45){score-=5;reasons.push('Existe posibilidad de precipitación a la hora del partido.')}
  if(gust>=70){score-=24;reasons.push('Rachas de viento fuertes.')}else if(gust>=50){score-=10;reasons.push('Rachas de viento a vigilar.')}
  if(vis<1000){score-=20;reasons.push('Visibilidad muy reducida en el modelo.')}else if(vis<3000){score-=7;reasons.push('Visibilidad reducida; revisar condiciones reales en cancha.')}
  if(tmin<=0){score-=32;hardCap=Math.min(hardCap,40);reasons.push('Temperatura cercana o inferior a congelación: revisar dureza/hielo del terreno.')}else if(tmin<=2){score-=10;reasons.push('Temperatura muy baja: comprobar firmeza y posible escarcha.')}
  if(apparent>=40){score-=14;reasons.push('Sensación térmica muy alta: considerar medidas de seguridad por calor.')}else if(apparent>=36){score-=6;reasons.push('Sensación térmica alta durante la ventana del partido.')}

  if(p48sum>=30){score-=31;reasons.push('Acumulado muy alto en 48 h: riesgo de saturación del terreno.')}else if(p48sum>=18){score-=23;reasons.push('Acumulado alto en 48 h.')}else if(p48sum>=8){score-=13;reasons.push('Lluvia relevante en las 48 h previas.')}else if(p48sum>=3){score-=6;reasons.push('Algo de lluvia en las 48 h previas.')}
  if(p24sum>=18){score-=18;reasons.push('Mucha lluvia en las 24 h previas.')}else if(p24sum>=10){score-=12;reasons.push('Lluvia importante en las 24 h previas.')}else if(p24sum>=4){score-=6;reasons.push('Lluvia moderada en las 24 h previas.')}
  if(precipMax>=5&&rainMax<2.5){score-=6;reasons.push('Precipitación total relevante cerca del horario.')}

  if(isDirt){
    if(p72sum>=40){score-=12;reasons.push('Campo de tierra: acumulado de 72 h muy alto; puede conservar lodo o zonas blandas.')}
    else if(p72sum>=20){score-=7;reasons.push('Campo de tierra: la lluvia de 72 h puede seguir afectando firmeza y drenaje.')}
    if(soilTop>=0.39){score-=8;reasons.push('Campo de tierra: humedad superficial modelada alta.')}
    else if(soilTop>=0.34){score-=4;reasons.push('Campo de tierra: humedad superficial modelada moderada-alta.')}
    if(p72sum<1&&et24>=4&&sun24>=5){score-=2;reasons.push('Campo de tierra muy seco: comprobar polvo, dureza y material suelto.')}
  }

  if(soilTop>=0){
    if(soilTop>=0.42){score-=14;reasons.push('Humedad superficial del suelo modelada muy alta.')}
    else if(soilTop>=0.36){score-=8;reasons.push('Humedad superficial del suelo modelada alta.')}
    else if(soilTop>=0.30){score-=3;reasons.push('Humedad superficial moderada.')}
  }
  if(soilSub>=0.43){score-=9;reasons.push('Subsuelo modelado con humedad alta; el drenaje puede recuperar más lento.')}
  else if(soilSub>=0.38){score-=4;reasons.push('Subsuelo modelado húmedo.')}
  if(humidity>=92&&dewSpread<=2){score-=5;reasons.push('Humedad relativa alta y aire cerca de saturación: secado lento de la superficie.')}
  if(et24>=3){score+=4;positives.push('Evapotranspiración previa favorece el secado.')}else if(et24>=0&&et24<0.6){score-=3;reasons.push('Poco potencial de secado en las 24 h previas.')}
  if(sun24>=5){score+=2;positives.push('Varias horas de sol previas favorecen el secado.')}

  if(inspection.standingWater==='yes'){score-=45;hardCap=Math.min(hardCap,18);reasons.push('Inspección: hay agua estancada/charcos.')}else if(inspection.standingWater==='no'){score+=2;positives.push('Inspección: sin agua estancada.')}
  if(inspection.mud==='heavy'){score-=38;hardCap=Math.min(hardCap,20);reasons.push('Inspección: barro/lodo fuerte en la superficie.')}else if(inspection.mud==='light'){score-=12;reasons.push('Inspección: hay barro o lodo ligero.')}else if(inspection.mud==='none'){score+=2;positives.push('Inspección: sin lodo relevante.')}
  if(inspection.hardness==='veryhard'){score-=16;reasons.push('Inspección: superficie excesivamente dura.')}else if(inspection.hardness==='hard'){score-=7;reasons.push('Inspección: superficie dura.')}else if(inspection.hardness==='loose'){score-=12;reasons.push('Inspección: tierra/material suelto; puede afectar tracción y bote.')}else if(inspection.hardness==='normal'){score+=2;positives.push('Inspección: firmeza normal.')}
  if(inspection.footing==='unsafe'){score-=55;hardCap=Math.min(hardCap,10);reasons.push('Inspección: apoyo del calzado inseguro.')}else if(inspection.footing==='slippery'){score-=22;hardCap=Math.min(hardCap,45);reasons.push('Inspección: superficie resbalosa.')}else if(inspection.footing==='soft'){score-=18;reasons.push('Inspección: terreno blando o se hunde al pisar.')}else if(inspection.footing==='firm'){score+=2;positives.push('Inspección: apoyo firme.')}
  if(inspection.ball==='poor'){score-=25;hardCap=Math.min(hardCap,40);reasons.push('Inspección: el balón no rueda/rebota de forma utilizable.')}else if(inspection.ball==='irregular'){score-=15;reasons.push('Inspección: rodamiento o bote irregular.')}else if(inspection.ball==='slow'){score-=9;reasons.push('Inspección: el balón se frena demasiado.')}else if(inspection.ball==='normal'){score+=2;positives.push('Inspección: rodamiento/rebote normal.')}
  if(inspection.evenness==='dangerous'){score-=60;hardCap=Math.min(hardCap,8);reasons.push('Inspección: baches/surcos peligrosos.')}else if(inspection.evenness==='minor'){score-=6;reasons.push('Inspección: hay irregularidades menores.')}else if(inspection.evenness==='even'){score+=2;positives.push('Inspección: superficie uniforme.')}
  if(inspection.debris==='dangerous'){score-=65;hardCap=Math.min(hardCap,5);reasons.push('Inspección: piedras/objetos peligrosos en la cancha.')}else if(inspection.debris==='some'){score-=5;reasons.push('Inspección: hay algunas piedras/objetos que deben retirarse.')}else if(inspection.debris==='clear'){score+=2;positives.push('Inspección: superficie libre de objetos peligrosos.')}
  if(inspection.dust==='high'){score-=10;reasons.push('Inspección: polvo alto o material fino suelto.')}else if(inspection.dust==='moderate'){score-=4;reasons.push('Inspección: polvo moderado.')}else if(inspection.dust==='low'){score+=1}
  if(inspection.lines==='poor'){score-=5;reasons.push('Inspección: líneas poco visibles.')}else if(inspection.lines==='visible'){score+=1}
  if(inspection.goals==='unsafe'){score-=70;hardCap=Math.min(hardCap,5);reasons.push('Inspección: porterías/postes no seguros.')}else if(inspection.goals==='safe'){score+=1}
  if(inspection.drainage==='poor'){score-=15;reasons.push('Inspección: drenaje deficiente.')}else if(inspection.drainage==='average'){score-=5;reasons.push('Inspección: drenaje regular.')}else if(inspection.drainage==='good'){score+=3;positives.push('Inspección: drenaje funcionando bien.')}

  score=clamp(Math.round(Math.min(score,hardCap)),5,98);
  if(!reasons.length)reasons.push('No se detectan señales meteorológicas o físicas que indiquen un problema fuerte.');
  return {probability:score,confidence:confidenceFor(precision,p48,inspection,m),verdict:verdictFor(score),terrain,reasons,positives,inspection:inspectionStats(inspection),surface};
}
function signature(r){return [r?.verdict?.key||'na',r?.probability??'na',r?.terrain?.level||'na',r?.inspection?.answered||0,r?.surface||'dirt_compact'].join('|')}

/* ---- Datos / fechas ---- */
async function loadJson(url){
  const r=await fetch(url+(url.includes('?')?'&':'?')+'v='+encodeURIComponent(BUILD)+'&t='+Date.now(),{cache:'no-store',credentials:'omit'});
  if(!r.ok)throw new Error('HTTP '+r.status);
  return r.json();
}
async function loadJsonAny(urls){
  let lastError=null;
  for(const url of urls){
    try{return await loadJson(url)}catch(err){lastError=err}
  }
  throw lastError||new Error('No se pudo cargar JSON');
}
async function ensureData(){
  if(cfg&&Array.isArray(cfg.fields)&&cfg.fields.length&&fixtures.length)return;
  if(loadingPromise)return loadingPromise;
  loadingPromise=(async()=>{
    try{
      cfg=await loadJsonAny([
        './data/fields-v38-22.json',
        'https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/public/data/fields-v38-22.json'
      ]);
    }catch(_){
      cfg=FALLBACK_FIELD_CONFIG;
    }
    if(!cfg||!Array.isArray(cfg.fields)||!cfg.fields.length)cfg=FALLBACK_FIELD_CONFIG;
    let season=null;
    try{
      season=await loadJsonAny([
        './data/temporada-actual-2026.json',
        'https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/public/data/temporada-actual-2026.json'
      ]);
    }catch(_){}
    fixtures=season?buildSeasonFixtures(season):buildOfficialFixtures();
    if(!fixtures.length)fixtures=buildOfficialFixtures();
  })().finally(()=>loadingPromise=null);
  return loadingPromise;
}
function overrideField(field){
  if(!field)return null;
  try{
    const raw=JSON.parse(localStorage.getItem('jr54-field-pin:'+field.id)||'null');
    if(raw&&Number.isFinite(raw.latitude)&&Number.isFinite(raw.longitude)&&Math.abs(raw.latitude)<=90&&Math.abs(raw.longitude)<=180){
      return {...field,latitude:raw.latitude,longitude:raw.longitude,precision:'admin-pin',weatherEligible:true,sourceNote:'Pin confirmado localmente en este dispositivo.'};
    }
  }catch(_){}
  return field;
}
function mapField(value){
  const n=norm(value);
  if(!n||!cfg?.fields)return null;
  return cfg.fields.find(f=>[f.id,f.name,...(f.aliases||[])].some(a=>norm(a)===n))||
    cfg.fields.find(f=>[f.name,...(f.aliases||[])].some(a=>n.includes(norm(a))||norm(a).includes(n)))||null;
}
function precisionLabel(p){
  return ({exact:'Campo exacto',complex:'Complejo deportivo',locality:'Referencia de comunidad','near-field':'Referencia junto al campo','admin-pin':'Pin ajustado',pending:'Pin pendiente',regional:'Referencia regional'})[p]||p||'Referencia';
}
function weatherCoords(field){
  const f=overrideField(field);
  if(f&&Number.isFinite(f.latitude)&&Number.isFinite(f.longitude))return {latitude:f.latitude,longitude:f.longitude,precision:f.precision||'locality',label:f.name};
  const r=cfg?.regionalFallback||{latitude:20.64337,longitude:-100.99286,label:'Referencia regional Juventino Rosas'};
  return {latitude:r.latitude,longitude:r.longitude,precision:'regional',label:r.label};
}
function mapsTarget(field){
  const f=overrideField(field);if(!f)return '';
  const exact=(f.precision==='exact'||f.precision==='admin-pin')&&Number.isFinite(f.latitude)&&Number.isFinite(f.longitude);
  return exact?(f.latitude+','+f.longitude):(f.mapsQuery||f.address||f.name);
}
function mapsSearch(field){const t=mapsTarget(field);return t?'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(t):'#'}
function mapsDirections(field){const t=mapsTarget(field);return t?'https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(t):'#'}
function googleWeather(field){const f=overrideField(field);return 'https://www.google.com/search?q='+encodeURIComponent('clima '+(f?.community||f?.name||'Juventino Rosas')+' Guanajuato')}

function localToEpoch(local){
  if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(String(local||'')))return null;
  const [ds,ts]=local.split('T'),[y,m,d]=ds.split('-').map(Number),[hh,mm]=ts.split(':').map(Number);
  const naive=Date.UTC(y,m-1,d,hh,mm,0);let cand=naive;
  for(let i=0;i<3;i++){
    const parts=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(new Date(cand)).filter(x=>x.type!=='literal').map(x=>[x.type,x.value]));
    const represented=Date.UTC(+parts.year,+parts.month-1,+parts.day,+parts.hour,+parts.minute,+parts.second);cand+=naive-represented;
  }
  return cand;
}
function dateKey(at){
  const p=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date(at)).filter(x=>x.type!=='literal').map(x=>[x.type,x.value]));
  return p.year+'-'+p.month+'-'+p.day;
}
function weekday(at){return new Intl.DateTimeFormat('en-US',{timeZone:TZ,weekday:'short'}).format(new Date(at))}
function nextLeagueDate(dayOfWeek,kickoff){
  const names=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],target=names[dayOfWeek],now=Date.now();
  for(let d=0;d<=8;d++){
    const probe=now+d*86400000;if(weekday(probe)!==target)continue;
    const key=dateKey(probe),at=localToEpoch(key+'T'+kickoff);
    if(at&&at>now-30*60*1000)return {date:key,kind:'estimada',at};
  }
  return null;
}
function normalizedTime(category,time){
  if(!/^\d{1,2}:\d{2}$/.test(String(time||'')))return null;
  let [h,m]=String(time).split(':').map(Number);
  if(/^Veteranos/i.test(category)&&h>=1&&h<=7)h+=12;
  return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0');
}
function gamesForCategory(categoryName,cat){
  const phase=String(cat?.current_phase||''),out=[];let arr=[];
  if(cat?.knockout&&Array.isArray(cat.knockout[phase]))arr=cat.knockout[phase];
  if(!arr.length&&cat?.rounds){
    const m=phase.match(/\bJ(\d+)\b/i),key=m?'J'+m[1]:Object.keys(cat.rounds).slice(-1)[0];
    if(key&&Array.isArray(cat.rounds[key]))arr=cat.rounds[key];
  }
  for(const g of arr){
    if(!g?.home||!g?.away||!g?.time||!g?.field)continue;
    const time=normalizedTime(categoryName,g.time);if(!time)continue;
    const field=mapField(g.field),pattern=cfg?.playPatterns?.[categoryName]||{dayOfWeek:0,label:'Domingo'};
    let schedule=null;
    if(g.date&&/^\d{4}-\d{2}-\d{2}$/.test(g.date))schedule={date:g.date,kind:'confirmada',at:localToEpoch(g.date+'T'+time)};
    else schedule=nextLeagueDate(pattern.dayOfWeek,time);
    if(!schedule?.at)continue;
    out.push({id:norm([categoryName,phase,g.home,g.away,g.field,g.time].join('|')).replace(/[^a-z0-9]+/g,'-'),category:categoryName,phase,home:g.home,away:g.away,time,originalTime:g.time,fieldValue:g.field,field,pattern,schedule});
  }
  return out;
}
function buildSeasonFixtures(data){
  return Object.entries(data?.categories||{}).flatMap(([name,cat])=>gamesForCategory(name,cat)).sort((a,b)=>a.schedule.at-b.schedule.at||a.category.localeCompare(b.category));
}
function parseOfficialDate(raw){
  const m=String(raw||'').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})/);if(!m)return null;
  return localToEpoch(m[3]+'-'+String(m[2]).padStart(2,'0')+'-'+String(m[1]).padStart(2,'0')+'T'+String(m[4]).padStart(2,'0')+':'+m[5]);
}
function buildOfficialFixtures(){
  const db=window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||{},out=[];
  Object.entries(db.categories||{}).forEach(([id,cat])=>(cat.fixtures||[]).forEach(group=>(group.rows||[]).forEach(r=>{
    if(!r?.[2]||!r?.[6])return;const at=parseOfficialDate(r?.[8]);if(!at)return;
    const category=cat.name||('Categoría '+id),field=mapField(r?.[7]||'');
    out.push({id:'official-'+id+'-'+norm([r[1],r[2],r[6],r[8]].join('|')).replace(/[^a-z0-9]+/g,'-'),category,phase:'Jornada '+(r?.[1]||''),home:r[2],away:r[6],time:new Intl.DateTimeFormat('es-MX',{timeZone:TZ,hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date(at)),fieldValue:r?.[7]||'Campo por confirmar',field,schedule:{date:dateKey(at),kind:'confirmada',at}});
  })));
  return out.sort((a,b)=>a.schedule.at-b.schedule.at);
}

/* ---- Open-Meteo ---- */
function forecastUrl(coords,rich=true){
  const base='temperature_2m,precipitation_probability,precipitation,rain,weather_code,wind_gusts_10m';
  const extra=',apparent_temperature,relative_humidity_2m,dew_point_2m,visibility,et0_fao_evapotranspiration,evapotranspiration,sunshine_duration,soil_temperature_0cm,soil_moisture_0_to_1cm,soil_moisture_1_to_3cm,soil_moisture_3_to_9cm,soil_moisture_9_to_27cm';
  const p=new URLSearchParams({latitude:String(coords.latitude),longitude:String(coords.longitude),hourly:base+(rich?extra:''),past_days:'3',forecast_days:'16',timezone:TZ,temperature_unit:'celsius',wind_speed_unit:'kmh',precipitation_unit:'mm'});
  return 'https://api.open-meteo.com/v1/forecast?'+p.toString();
}
async function getForecast(field,force=false){
  const coords=weatherCoords(field),key=coords.latitude+','+coords.longitude,cacheKey='v172wx:'+BUILD+':'+key,old=wxCache.get(key);
  if(!force&&old&&Date.now()-old.at<CACHE_TTL)return {data:old.data,coords,rich:old.rich!==false};
  if(!force){
    try{
      const stored=JSON.parse(sessionStorage.getItem(cacheKey)||'null');
      if(stored&&Date.now()-stored.at<CACHE_TTL){wxCache.set(key,stored);return {data:stored.data,coords,rich:stored.rich!==false}}
    }catch(_){}
  }
  let r=await fetch(forecastUrl(coords,true),{cache:'no-store',credentials:'omit'}),rich=true;
  if(!r.ok){
    r=await fetch(forecastUrl(coords,false),{cache:'no-store',credentials:'omit'});rich=false;
  }
  if(!r.ok)throw new Error('Open-Meteo HTTP '+r.status);
  const data=await r.json(),entry={at:Date.now(),data,rich};wxCache.set(key,entry);
  try{sessionStorage.setItem(cacheKey,JSON.stringify(entry))}catch(_){}
  return {data,coords,rich};
}
function summarize(data,startAt,endAt){
  const h=data?.hourly;if(!h||!Array.isArray(h.time))return null;const indexes=[];
  for(let i=0;i<h.time.length;i++){const at=localToEpoch(String(h.time[i]).slice(0,16));if(at&&at>=startAt&&at<=endAt)indexes.push({i,at})}
  if(!indexes.length)return null;
  const vals=key=>indexes.map(x=>Number(h[key]?.[x.i])).filter(Number.isFinite);
  const sum=a=>a.length?a.reduce((s,x)=>s+x,0):0,sumMaybe=a=>a.length?a.reduce((s,x)=>s+x,0):null,max=a=>a.length?Math.max(...a):null,min=a=>a.length?Math.min(...a):null,avg=a=>a.length?a.reduce((s,x)=>s+x,0)/a.length:null,now=Date.now();
  const temp=vals('temperature_2m'),dew=vals('dew_point_2m');
  const dewSpread=temp.length&&dew.length?avg(temp.map((v,i)=>Number.isFinite(dew[i])?Math.max(0,v-dew[i]):null).filter(Number.isFinite)):null;
  const soilTop=[...vals('soil_moisture_0_to_1cm'),...vals('soil_moisture_1_to_3cm')];
  const soilSub=[...vals('soil_moisture_3_to_9cm'),...vals('soil_moisture_9_to_27cm')];
  return {
    hours:indexes.length,observedHours:indexes.filter(x=>x.at<=now).length,forecastHours:indexes.filter(x=>x.at>now).length,
    precipTotal:sum(vals('precipitation')),rainTotal:sum(vals('rain')),rainMax:max(vals('rain')),precipMax:max(vals('precipitation')),probMax:max(vals('precipitation_probability')),
    gustMax:max(vals('wind_gusts_10m')),code:max(vals('weather_code')),temp:avg(temp),tempMin:min(temp),apparentMax:max(vals('apparent_temperature')),
    humidityAvg:avg(vals('relative_humidity_2m')),dewSpreadAvg:dewSpread,visibilityMin:min(vals('visibility')),
    et0Total:sumMaybe(vals('et0_fao_evapotranspiration')),evapTotal:sumMaybe(vals('evapotranspiration')),sunshineHours:(()=>{const a=vals('sunshine_duration'),s=sumMaybe(a);return s==null?null:s/3600})(),
    soilTemp:avg(vals('soil_temperature_0cm')),soilTopAvg:avg(soilTop),soilSubAvg:avg(soilSub)
  };
}
function sourceLabel(s){if(!s)return 'sin datos';if(s.observedHours&&s.forecastHours)return 'mezcla de horas pasadas + pronóstico';if(s.observedHours)return 'horas pasadas/modeladas';return 'pronóstico previo al partido'}

/* ---- UI ---- */
function availableCategories(){return [...new Set(fixtures.map(x=>x.category))]}
function matchesForCategory(cat){return fixtures.filter(x=>x.category===cat)}
function currentMatch(){return fixtures.find(x=>x.id===selectedMatch)||null}
function validFieldId(value){
  const fields=cfg?.fields||[];
  const id=String(value||'');
  return fields.some(f=>String(f.id)===id)?id:(fields[0]?.id||'');
}
function syncFieldFromControl(){
  const sel=$('[data-v172-field-select]',hub);
  if(sel&&sel.value)selectedField=validFieldId(sel.value);
  else selectedField=validFieldId(selectedField||localStorage.getItem(FIELD_KEY));
  if(selectedField)localStorage.setItem(FIELD_KEY,selectedField);
  return selectedField;
}
function currentField(){
  if(mode!=='field')return currentMatch()?.field||null;
  selectedField=validFieldId(selectedField||localStorage.getItem(FIELD_KEY));
  if(selectedField)localStorage.setItem(FIELD_KEY,selectedField);
  return (cfg?.fields||[]).find(f=>String(f.id)===String(selectedField))||null;
}
function option(value,label,selected){return '<option value="'+esc(value)+'" '+(selected?'selected':'')+'>'+esc(label)+'</option>'}
function fmtDate(match){
  if(!match?.schedule?.at)return 'Fecha pendiente';
  return new Intl.DateTimeFormat('es-MX',{timeZone:TZ,weekday:'long',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date(match.schedule.at));
}
function fmtUpdated(){return new Intl.DateTimeFormat('es-MX',{timeZone:TZ,hour:'2-digit',minute:'2-digit',hour12:true}).format(new Date())}
function metric(label,value,sub=''){return '<div class="v172-metric"><span>'+esc(label)+'</span><strong>'+esc(value)+'</strong>'+(sub?'<small>'+esc(sub)+'</small>':'')+'</div>'}
function inspectionSelect(field,key,label,values,current){
  return '<label class="v177-check"><span>'+esc(label)+'</span><select data-v177-inspection="'+esc(key)+'" data-field="'+esc(field?.id||'')+'">'+
    values.map(v=>'<option value="'+esc(v[0])+'" '+(String(current||'unknown')===v[0]?'selected':'')+'>'+esc(v[1])+'</option>').join('')+
  '</select></label>';
}
function inspectionMarkup(field){
  const x=getInspection(field),surface=surfaceType(field,x),s=inspectionStats(x),when=x.updatedAt?new Intl.DateTimeFormat('es-MX',{timeZone:TZ,dateStyle:'short',timeStyle:'short'}).format(new Date(x.updatedAt)):'sin inspección';
  return '<details class="v177-inspection" open><summary>🧪 Revisión del campo · '+esc(surfaceLabel(surface))+' <b>'+s.answered+'/'+s.total+'</b></summary>'+
    '<p>La mayoría de las canchas de la liga pueden trabajar como <b>tierra compactada</b> por defecto. Si un campo es distinto, cambia su superficie aquí; queda guardado por campo.</p>'+
    '<div class="v178-surface-row">'+inspectionSelect(field,'surfaceType','Tipo de superficie',[['dirt_compact','Tierra compactada'],['dirt_sandy','Tierra / arena'],['grass','Pasto natural'],['synthetic','Sintético']],surface)+'</div>'+
    '<div class="v177-inspection-grid">'+
      inspectionSelect(field,'standingWater','Charcos / agua',[['unknown','Sin revisar'],['no','No'],['yes','Sí']],x.standingWater)+
      inspectionSelect(field,'mud','Barro / lodo',[['unknown','Sin revisar'],['none','Nada'],['light','Ligero'],['heavy','Fuerte']],x.mud)+
      inspectionSelect(field,'hardness','Dureza / material',[['unknown','Sin revisar'],['normal','Normal'],['hard','Duro'],['veryhard','Muy duro'],['loose','Tierra suelta']],x.hardness)+
      inspectionSelect(field,'footing','Apoyo / tracción',[['unknown','Sin revisar'],['firm','Firme'],['soft','Blando / se hunde'],['slippery','Resbaloso'],['unsafe','Inseguro']],x.footing)+
      inspectionSelect(field,'ball','Balón rueda / rebota',[['unknown','Sin revisar'],['normal','Normal'],['slow','Muy lento'],['irregular','Irregular'],['poor','No usable']],x.ball)+
      inspectionSelect(field,'evenness','Baches / surcos',[['unknown','Sin revisar'],['even','Uniforme'],['minor','Menores'],['dangerous','Peligrosos']],x.evenness)+
      inspectionSelect(field,'debris','Piedras / objetos',[['unknown','Sin revisar'],['clear','Limpio'],['some','Algunos'],['dangerous','Peligrosos']],x.debris)+
      inspectionSelect(field,'dust','Polvo / material fino',[['unknown','Sin revisar'],['low','Bajo'],['moderate','Moderado'],['high','Alto']],x.dust)+
      inspectionSelect(field,'lines','Líneas visibles',[['unknown','Sin revisar'],['visible','Sí'],['poor','No / poco']],x.lines)+
      inspectionSelect(field,'goals','Porterías seguras',[['unknown','Sin revisar'],['safe','Sí'],['unsafe','No']],x.goals)+
      inspectionSelect(field,'drainage','Drenaje',[['unknown','Sin revisar'],['good','Bueno'],['average','Regular'],['poor','Deficiente']],x.drainage)+
    '</div>'+
    '<div class="v178-surface-note"><b>Para acercarse más al estado real:</b> revisa toda la cancha con tachones, prueba el balón en varias zonas y marca charcos, lodo, dureza, baches y piedras. El clima por sí solo no ve esos defectos.</div>'+
    '<small>Última revisión: '+esc(when)+'. Se guarda en este dispositivo.</small></details>';
}
function loadingMarkup(text='Consultando clima…'){return '<div class="v172-loading"><span></span>'+esc(text)+'</div>'}
function emptyMarkup(text){return '<div class="v172-empty">'+esc(text)+'</div>'}

function controlsMarkup(){
  if(mode==='field'){
    const fields=cfg?.fields||[];
    selectedField=validFieldId(selectedField||localStorage.getItem(FIELD_KEY));
    if(selectedField)localStorage.setItem(FIELD_KEY,selectedField);
    return '<label class="v172-control grow"><span>Campo</span><select data-v172-field-select>' +
      fields.map(f=>option(f.id,f.name,String(f.id)===String(selectedField))).join('')+
      '</select></label>'+
      '<button type="button" class="primary" data-v172-action="analyze">Analizar campo</button>'+
      '<button type="button" data-v172-action="match-mode">← Volver a partido</button>';
  }
  const cats=availableCategories();
  if(!selectedCategory||!cats.includes(selectedCategory))selectedCategory=localStorage.getItem(CAT_KEY)&&cats.includes(localStorage.getItem(CAT_KEY))?localStorage.getItem(CAT_KEY):(cats.includes('Veteranos 50+')?'Veteranos 50+':cats[0]||'');
  const ms=matchesForCategory(selectedCategory);
  const saved=localStorage.getItem(MATCH_KEY)||'';
  if(!selectedMatch||!ms.some(x=>x.id===selectedMatch))selectedMatch=ms.some(x=>x.id===saved)?saved:(ms[0]?.id||'');
  return '<label class="v172-control"><span>Categoría</span><select data-v172-category>'+cats.map(c=>option(c,c,c===selectedCategory)).join('')+'</select></label>'+
    '<label class="v172-control grow"><span>Partido</span><select data-v172-match>'+ms.map(m=>option(m.id,m.home+' vs '+m.away+' · '+m.time+' · '+(m.field?.name||m.fieldValue),m.id===selectedMatch)).join('')+'</select></label>'+
    '<button type="button" class="primary" data-v172-action="analyze">Analizar</button>'+
    '<button type="button" data-v172-action="field-mode">Buscar campo</button>';
}
function renderControls(){const x=$('.v172-controls',hub);if(x)x.innerHTML=controlsMarkup()}

function resultMarkup(ctx){
  const {match,field,coords,windowWx,p24,p48,p72,result,analysisAt,rich}=ctx,p=result.probability,verdict=result.verdict,precision=coords?.precision||field?.precision||'regional';
  const title=match?(match.home+' vs '+match.away):(field?.name||'Campo');
  const kicker=match?(match.category+' · '+match.phase):'CONSULTA DIRECTA DE CAMPO';
  const when=match?(fmtDate(match)+(match.schedule?.kind==='estimada'?' · fecha estimada':'')):'Condición meteorológica alrededor de '+new Intl.DateTimeFormat('es-MX',{timeZone:TZ,hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date(analysisAt));
  const r24=p24?(p24.precipTotal.toFixed(1)+' mm'):'—',r48=p48?(p48.precipTotal.toFixed(1)+' mm'):'—',r72=p72?(p72.precipTotal.toFixed(1)+' mm'):'—',wxProb=windowWx?.probMax==null?'—':Math.round(windowWx.probMax)+'%',wxRain=windowWx?.rainMax==null?'—':windowWx.rainMax.toFixed(1)+' mm/h',temp=windowWx?.temp==null?'—':windowWx.temp.toFixed(1)+' °C',gust=windowWx?.gustMax==null?'—':Math.round(windowWx.gustMax)+' km/h';
  const soilTop=windowWx?.soilTopAvg==null?'—':Math.round(windowWx.soilTopAvg*100)+'%',soilSub=windowWx?.soilSubAvg==null?'—':Math.round(windowWx.soilSubAvg*100)+'%',rh=windowWx?.humidityAvg==null?'—':Math.round(windowWx.humidityAvg)+'%',vis=windowWx?.visibilityMin==null?'—':(windowWx.visibilityMin/1000).toFixed(1)+' km',et0=p24?.et0Total==null?'—':p24.et0Total.toFixed(1)+' mm',sun=p24?.sunshineHours==null?'—':p24.sunshineHours.toFixed(1)+' h';
  const checked=result.inspection?.answered||0,surface=surfaceLabel(result.surface||surfaceType(field,getInspection(field)));
  return '<article class="v172-result '+esc(verdict.tone)+'">'+
    '<div class="v172-result-head"><div><div class="v172-kicker">'+esc(kicker)+'</div><h3>'+esc(title)+'</h3><p>'+esc(when)+'</p><p><b>'+esc(field?.name||match?.fieldValue||'Campo pendiente')+'</b> · <span class="v172-pill">'+esc(surface)+'</span> · <span class="v172-pill">'+esc(precisionLabel(precision))+'</span></p></div>'+
      '<div class="v172-score '+esc(verdict.tone)+'"><span>Índice de jugabilidad</span><strong>'+(p==null?'—':esc(p+'%'))+'</strong><b>'+esc(verdict.short)+'</b><small>confianza de datos '+esc(result.confidence)+'%</small></div></div>'+
    '<div class="v172-verdict '+esc(verdict.tone)+'"><span>IA DE CONDICIÓN DEL CAMPO</span><strong>'+esc(verdict.label)+'</strong><p>'+esc(result.terrain.label)+'. '+esc(result.terrain.detail)+'</p><small>'+checked+'/'+esc(result.inspection?.total||11)+' controles físicos registrados · superficie: '+esc(surface)+'.</small></div>'+
    '<div class="v177-model-groups"><span>🟫 superficie</span><span>🌧️ lluvia 72 h</span><span>💧 suelo</span><span>☀️ secado</span><span>🌫️ visibilidad</span><span>🌡️ temperatura</span><span>💨 viento</span><span>⚡ tormenta</span><span>🏟️ inspección</span></div>'+(!rich?'<div class="v177-data-note">Datos avanzados de suelo/secado no disponibles en esta consulta; el porcentaje usa el conjunto meteorológico básico + inspección.</div>':'')+
    '<div class="v172-metrics">'+
      metric('Lluvia 24 h',r24,sourceLabel(p24))+metric('Lluvia 48 h',r48,sourceLabel(p48))+metric('Lluvia 72 h',r72,sourceLabel(p72))+metric('Prob. a la hora',wxProb,'ventana -1 h / +2 h')+metric('Lluvia a la hora',wxRain,'máximo horario')+
      metric('Humedad suelo 0–3 cm',soilTop,'indicador modelado')+metric('Humedad suelo 3–27 cm',soilSub,'indicador modelado')+
      metric('Secado ET₀ 24 h',et0,'evapotranspiración de referencia')+metric('Sol 24 h',sun,'horas modeladas')+
      metric('Humedad relativa',rh)+metric('Visibilidad mínima',vis)+metric('Temperatura',temp)+metric('Racha máxima',gust)+
    '</div>'+
    '<details class="v172-why"><summary>¿Por qué da este porcentaje?</summary><ul>'+result.reasons.map(r=>'<li>'+esc(r)+'</li>').join('')+'</ul>'+
      (result.positives?.length?'<p><b>Factores favorables:</b> '+esc(result.positives.join(' '))+'</p>':'')+
      '<p>El motor combina tipo de superficie, lluvia de 24/48/72 h, intensidad a la hora, humedad superficial y subsuelo modelada, capacidad de secado, humedad del aire, visibilidad, temperatura, viento, tormenta, precisión del pin e inspección física. En tierra pesa además lodo, dureza, polvo, baches, piedras, tracción y comportamiento del balón. El número es un índice calculado 0–100, no una probabilidad estadística exacta.</p></details>'+
    inspectionMarkup(field)+
    '<div class="v172-actions"><a href="'+esc(mapsSearch(field))+'" target="_blank" rel="noopener">📍 Mapa</a><a href="'+esc(mapsDirections(field))+'" target="_blank" rel="noopener">🧭 Cómo llegar</a><a href="'+esc(googleWeather(field))+'" target="_blank" rel="noopener">☁️ Google clima</a><button type="button" data-v172-action="pin" data-field="'+esc(field?.id||'')+'">Ajustar pin</button><button type="button" data-v172-action="share">Compartir aviso</button><button type="button" data-v172-action="copy">Copiar aviso</button></div>'+
    '<div class="v172-official"><b>Índice ≠ decisión oficial.</b> No existe un porcentaje exacto solo con clima. El índice 0–100 se vuelve mucho más confiable cuando se completa la revisión física del campo. La decisión final corresponde a la Liga/árbitro según sus reglas.</div>'+
  '</article>';
}
async function analyzeSelection(force=false){
  const panel=$('.v172-panel',hub);if(!panel)return null;
  if(!cfg){
    try{await ensureData();renderControls()}catch(err){panel.innerHTML=emptyMarkup('No se pudo cargar la lista de campos.');return null}
  }
  if(mode==='field')syncFieldFromControl();
  const match=mode==='match'?currentMatch():null,field=currentField();
  if(!field){panel.innerHTML=emptyMarkup(mode==='match'?'El partido seleccionado no tiene un campo reconocido. Usa “Buscar campo” para revisar una cancha.':'Selecciona un campo.');return null}
  panel.innerHTML=loadingMarkup('Consultando el campo seleccionado…');hub.setAttribute('aria-busy','true');
  try{
    const wx=await getForecast(field,force),analysisAt=match?.schedule?.at||Date.now(),windowWx=summarize(wx.data,analysisAt-60*60*1000,analysisAt+2*60*60*1000),p24=summarize(wx.data,analysisAt-24*60*60*1000,analysisAt-1),p48=summarize(wx.data,analysisAt-48*60*60*1000,analysisAt-1),p72=summarize(wx.data,analysisAt-72*60*60*1000,analysisAt-1),inspection=getInspection(field),result=scorePlayability({match:windowWx,prior24:p24,prior48:p48,prior72:p72,precision:wx.coords.precision,inspection,field});
    lastAnalysis={match,field,coords:wx.coords,windowWx,p24,p48,p72,result,inspection,analysisAt,rich:wx.rich};panel.innerHTML=resultMarkup(lastAnalysis);
    const u=$('.v172-updated',hub);if(u)u.textContent='Actualizado '+fmtUpdated();
    return lastAnalysis;
  }catch(err){
    panel.innerHTML='<div class="v172-empty error"><b>No se pudo actualizar el clima.</b><span>'+esc(err?.message||err)+'</span><button type="button" data-v172-action="analyze">Reintentar</button></div>';return null;
  }finally{hub.removeAttribute('aria-busy')}
}
function alertText(ctx){
  if(!ctx?.result)return '';const m=ctx.match,r=ctx.result,subject=m?(m.home+' vs '+m.away):(ctx.field?.name||'Campo');
  return ['Liga Juventino Rosas · '+subject,'Índice de jugabilidad: '+r.verdict.label+' ('+(r.probability??'—')+'/100).','Condición del campo por IA: '+r.terrain.label+'.',m?(fmtDate(m)+' · '+(ctx.field?.name||m.fieldValue)):(ctx.field?.name||''),'La decisión oficial corresponde a la Liga tras revisar el campo.'].filter(Boolean).join('\n');
}
async function shareCurrent(copyOnly=false){
  if(!lastAnalysis)return toast('Primero analiza un partido o campo','error');const text=alertText(lastAnalysis);
  if(!copyOnly&&navigator.share){try{await navigator.share({title:'Clima de partido · Liga Juventino Rosas',text});return}catch(_){}}
  try{await navigator.clipboard.writeText(text);toast('Aviso copiado')}catch(_){prompt('Copia el aviso:',text)}
}
async function adjustPin(fieldId){
  const field=(cfg?.fields||[]).find(f=>f.id===fieldId);if(!field)return;
  const cur=overrideField(field),lat=prompt('Latitud exacta para '+field.name+':',Number.isFinite(cur.latitude)?String(cur.latitude):'');if(lat===null)return;
  const lon=prompt('Longitud exacta para '+field.name+':',Number.isFinite(cur.longitude)?String(cur.longitude):'');if(lon===null)return;
  const a=Number(lat),b=Number(lon);if(!Number.isFinite(a)||!Number.isFinite(b)||Math.abs(a)>90||Math.abs(b)>180)return toast('Coordenadas inválidas','error');
  localStorage.setItem('jr54-field-pin:'+field.id,JSON.stringify({latitude:a,longitude:b,updatedAt:Date.now()}));wxCache.clear();toast('Pin guardado en este dispositivo');await analyzeSelection(true);
}

/* ---- Avisos automáticos ---- */
function alertsEnabled(){return localStorage.getItem(ALERT_KEY)==='1'}
function updateAlertButton(){
  const b=$('[data-v172-action="alerts"]',hub);if(!b)return;const enabled=alertsEnabled(),granted=('Notification'in window)&&Notification.permission==='granted';
  b.classList.toggle('active',enabled);b.textContent=enabled?(granted?'🔔 Avisos activos':'🔔 Avisos dentro de la página'):'🔕 Activar avisos';
}
async function toggleAlerts(){
  if(alertsEnabled()){localStorage.setItem(ALERT_KEY,'0');updateAlertButton();toast('Avisos automáticos desactivados');return}
  localStorage.setItem(ALERT_KEY,'1');if('Notification'in window&&Notification.permission==='default'){try{await Notification.requestPermission()}catch(_){}}
  updateAlertButton();toast(('Notification'in window&&Notification.permission==='granted')?'Avisos automáticos activados':'Avisos automáticos activos dentro de la página');await checkCategoryAlerts(true);
}
async function analyzeMatchQuiet(match){
  if(!match?.field||!match.schedule?.at)return null;
  try{const wx=await getForecast(match.field,false),at=match.schedule.at,windowWx=summarize(wx.data,at-60*60*1000,at+2*60*60*1000),p24=summarize(wx.data,at-24*60*60*1000,at-1),p48=summarize(wx.data,at-48*60*60*1000,at-1),p72=summarize(wx.data,at-72*60*60*1000,at-1),inspection=getInspection(match.field),result=scorePlayability({match:windowWx,prior24:p24,prior48:p48,prior72:p72,precision:wx.coords.precision,inspection,field:match.field});return {match,field:match.field,coords:wx.coords,windowWx,p24,p48,p72,result,inspection,analysisAt:at,rich:wx.rich}}catch(_){return null}
}
async function checkCategoryAlerts(force=false){
  if(!alertsEnabled()||mode!=='match'||!selectedCategory)return;if(!force&&Date.now()-lastAlertCheck<5*60*1000)return;lastAlertCheck=Date.now();
  const now=Date.now(),upcoming=matchesForCategory(selectedCategory).filter(m=>m.schedule?.at>=now-60*60*1000&&m.schedule?.at<=now+7*86400000).slice(0,4);let worst=null;
  for(const m of upcoming){
    const ctx=await analyzeMatchQuiet(m);if(!ctx)continue;if(!worst||num(ctx.result.probability)<num(worst.result.probability))worst=ctx;
    const sig=signature(ctx.result),key='v172-weather-alert-signature:'+m.id,prev=localStorage.getItem(key);if(prev===sig)continue;localStorage.setItem(key,sig);
    const title=m.category+' · '+ctx.result.verdict.short,body=m.home+' vs '+m.away+' · '+ctx.result.probability+'% · '+(ctx.field?.name||m.fieldValue);
    if('Notification'in window&&Notification.permission==='granted'){try{new Notification(title,{body,tag:'v172-'+m.id})}catch(_){}}
  }
  if(worst&&worst.result.verdict.tone==='high')toast('⚠ '+worst.match.home+' vs '+worst.match.away+': '+worst.result.verdict.short,'error');
}

/* ---- Estado / eventos ---- */
function setMode(next){
  mode=next==='field'?'field':'match';
  if(mode==='field'){
    selectedField=validFieldId(selectedField||localStorage.getItem(FIELD_KEY));
    if(selectedField)localStorage.setItem(FIELD_KEY,selectedField);
  }
  renderControls();
  analyzeSelection(false);
}
async function openFields(){
  if(!hub)return;
  try{await ensureData()}catch(err){toast('No se pudo cargar la lista de campos','error');return}
  selectedField=validFieldId(selectedField||localStorage.getItem(FIELD_KEY));
  if(selectedField)localStorage.setItem(FIELD_KEY,selectedField);
  setMode('field');
  hub.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
  setTimeout(()=>$('[data-v172-field-select]',hub)?.focus(),220);
}
async function openMatches(){
  if(!hub)return;
  try{await ensureData()}catch(_){}
  setMode('match');
  hub.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
}
function bindHub(){
  const onSelect=e=>{
    if(e.target.matches('[data-v172-category]')){selectedCategory=e.target.value;localStorage.setItem(CAT_KEY,selectedCategory);selectedMatch=matchesForCategory(selectedCategory)[0]?.id||'';if(selectedMatch)localStorage.setItem(MATCH_KEY,selectedMatch);renderControls();analyzeSelection(false);checkCategoryAlerts(true)}
    else if(e.target.matches('[data-v172-match]')){selectedMatch=e.target.value;localStorage.setItem(MATCH_KEY,selectedMatch);analyzeSelection(false)}
    else if(e.target.matches('[data-v172-field-select]')){
      selectedField=validFieldId(e.target.value);
      if(selectedField)localStorage.setItem(FIELD_KEY,selectedField);
      analyzeSelection(false);
    }else if(e.target.matches('[data-v177-inspection]')){
      saveInspection(e.target.dataset.field,e.target.dataset.v177Inspection,e.target.value);
      analyzeSelection(false);
    }
  };
  hub.addEventListener('change',onSelect);
  hub.addEventListener('input',e=>{if(e.target.matches('[data-v172-field-select]'))onSelect(e)});
  hub.addEventListener('click',async e=>{
    const b=e.target.closest('[data-v172-action]');if(!b)return;const a=b.dataset.v172Action;
    if(a==='analyze'){
      if(mode==='field')syncFieldFromControl();
      await analyzeSelection(true);
    }else if(a==='field-mode')setMode('field');else if(a==='match-mode')setMode('match');else if(a==='alerts')await toggleAlerts();else if(a==='pin')await adjustPin(b.dataset.field);else if(a==='share')await shareCurrent(false);else if(a==='copy')await shareCurrent(true);
  });
}
function bindTopWeatherButtons(){
  const screen=$('#screen');if(!screen||screen.dataset.v172WeatherBound)return;screen.dataset.v172WeatherBound='1';
  screen.addEventListener('click',e=>{
    if(route()!=='v38Weather')return;const b=e.target.closest('[data-v163-weather-inline]');if(!b)return;e.preventDefault();e.stopPropagation();
    const m=b.dataset.v163WeatherInline;if(m==='fields')openFields();else openMatches();
  },true);
}
async function initData(){
  try{
    await ensureData();const cats=availableCategories(),savedCat=localStorage.getItem(CAT_KEY);
    selectedCategory=savedCat&&cats.includes(savedCat)?savedCat:(cats.includes('Veteranos 50+')?'Veteranos 50+':cats[0]||'');
    const ms=matchesForCategory(selectedCategory),savedMatch=localStorage.getItem(MATCH_KEY);
    selectedMatch=ms.some(x=>x.id===savedMatch)?savedMatch:(ms[0]?.id||'');
    selectedField=validFieldId(localStorage.getItem(FIELD_KEY));
    if(selectedField)localStorage.setItem(FIELD_KEY,selectedField);
    renderControls();await analyzeSelection(false);await checkCategoryAlerts(false);
  }catch(err){
    const p=$('.v172-panel',hub);if(p)p.innerHTML='<div class="v172-empty error"><b>No se pudo cargar clima/jornada.</b><span>'+esc(err?.message||err)+'</span><button type="button" data-v172-action="analyze">Reintentar</button></div>';
  }
}
function markup(){
  return '<section id="v172-weather-smart" class="v172-weather-smart" aria-label="Clima inteligente del partido">'+
    '<div class="v172-head"><div><div class="v172-kicker">CENTRAL OPERATIVA V38 · MOTOR INTELIGENTE</div><h2>Clima inteligente del partido</h2><p>Elige categoría y partido. Mostramos <b>un solo análisis</b>: tipo de superficie —especialmente tierra—, lluvia de 72 h, humedad del suelo, secado, seguridad y revisión física para calcular un índice de jugabilidad.</p></div><button type="button" class="v172-alert" data-v172-action="alerts">🔕 Activar avisos</button></div>'+
    '<div class="v172-rule"><b>🔔 Avisos dentro de la página</b><span>Automático: el motor inteligente puede avisar “sí probable / revisar / alto riesgo de no jugar”. No cambia por sí solo el estado oficial a “Suspendido”.</span></div>'+
    '<div class="v172-controls"></div>'+
    '<div class="v172-status"><span class="v172-updated">Preparando análisis…</span><span>Open-Meteo · 72 h lluvia + suelo + secado + viento + visibilidad + temperatura</span></div>'+
    '<div class="v172-panel" aria-live="polite">'+loadingMarkup('Cargando jornada…')+'</div>'+
  '</section>';
}
function mount(){
  if(route()!=='v38Weather')return;
  const screen=$('#screen');if(!screen)return;
  $('#v100-weather-extra',screen)?.remove();
  if($('#v172-weather-smart',screen)){bindTopWeatherButtons();return}
  const page=$('.v163-weather-page',screen)||screen.firstElementChild;
  if(page)page.insertAdjacentHTML('afterend',markup());else screen.insertAdjacentHTML('beforeend',markup());
  hub=$('#v172-weather-smart',screen);if(!hub)return;bindHub();bindTopWeatherButtons();updateAlertButton();initData();
  clearTimeout(refreshTimer);refreshTimer=setTimeout(async function loop(){if(route()==='v38Weather'&&document.visibilityState==='visible'){await analyzeSelection(false);await checkCategoryAlerts(false)}refreshTimer=setTimeout(loop,CACHE_TTL)},CACHE_TTL);
}
let timer=0;function schedule(){clearTimeout(timer);timer=setTimeout(mount,90)}
window.addEventListener('hashchange',schedule);
window.addEventListener('ljr:official-data',()=>{if(route()==='v38Weather'&&!fixtures.length)schedule()});
document.addEventListener('visibilitychange',()=>{if(route()==='v38Weather'&&document.visibilityState==='visible'){analyzeSelection(false);checkCategoryAlerts(false)}});
window.addEventListener('focus',()=>{if(route()==='v38Weather')checkCategoryAlerts(false)});
const screen=$('#screen');if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:false});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
setTimeout(schedule,700);

window.LJR_V172_WEATHER={openFields,openMatches,refresh:()=>analyzeSelection(true),get selectedCategory(){return selectedCategory},get selectedMatch(){return selectedMatch},get selectedField(){return selectedField},get mode(){return mode}};
})();