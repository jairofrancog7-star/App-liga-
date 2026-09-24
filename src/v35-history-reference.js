/* V35 — Historia mobile reconstruction from the user's master references.
   Replaces only #/history on mobile/APK. Keeps the rest of the app logic intact. */
(function(){
'use strict';

const RAW='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const JUVENTUS_2024_PHOTO='./assets/history/archive-v225/juventus-campeon-campeones-21-sep-2024.webp?v=20260923-juventus-webp-v245';
const ASSETS={
  league:RAW+'assets/liga-logo.webp',
  america:RAW+'assets/branding/america-veteranos-35-user.png',
  huerta:RAW+'assets/official-logos/la-huerta.png',
  franco:RAW+'assets/official-logos/franco-fc.png',
  promesas:RAW+'assets/official-logos/promesas-fc.png',
  galeana:RAW+'assets/teams/atletico-galeana.webp',
  trophy:'./assets/reference/final-trophy-drive.png',
  feature:RAW+'media/gran-final-veteranos-35.png',
  videoA:'./public/video-hero-reference.webp',
  videoB:'./public/home-feature-reference.webp',
  videoC:RAW+'assets/motion/v38-fix10-field.jpg'
};

const seasons=[
  {label:'2025/26',crest:ASSETS.league,alt:'Liga Municipal de Fútbol Juventino Rosas'},
  {label:'2024/25',crest:ASSETS.league,alt:'Liga Municipal de Fútbol Juventino Rosas'},
  {label:'2023/24',crest:ASSETS.league,alt:'Liga Municipal de Fútbol Juventino Rosas'},
  {label:'2022/23',crest:ASSETS.league,alt:'Liga Municipal de Fútbol Juventino Rosas'},
  {label:'2021/22',crest:ASSETS.league,alt:'Liga Municipal de Fútbol Juventino Rosas'},
  {label:'2019/20',crest:ASSETS.league,alt:'Liga Municipal de Fútbol Juventino Rosas'}
];

/* V75 — fuentes históricas entregadas por el usuario.
   IMPORTANTE: estos videos pertenecen SOLO a Historia.
   Nunca se importan equipos de estas fuentes a la lista de equipos de la temporada actual. */
const historicalSources=[
  {
    title:'Convocatoria oficial · temporada 2019–2020',
    note:'Texto histórico aportado por el usuario. Fechado en Santa Cruz de Juventino Rosas, Gto., el 12 de noviembre de 2019. Convoca a equipos de Primera, Intermedia y Segunda; fija el inicio del campeonato para el domingo 8 de diciembre de 2019, cierre de inscripciones el martes 26 de noviembre a las 19:00 en la Unidad Deportiva Sur y junta previa el martes 3 de diciembre a las 19:00.',
    url:''
  },
  {
    title:'Golazo Liga · archivo 2012–2013 recuperado',
    note:'Texto histórico aportado por el usuario con publicaciones de 2012 y 2013: Tavera campeón de Copa de Segunda, Real Cerrito de Gasca campeón de Segunda Fuerza, final de Veteranos Universidad vs Dinamo y Magisterio vs Boavista por penales.',
    url:'https://www.facebook.com/golazo.liga'
  },
  {
    title:'Golazo Liga · fecha digital mínima comprobada',
    note:'Captura aportada: publicación visible con fecha 5 OCT 2012. Prueba actividad digital al menos desde entonces, pero no la fundación de la Liga ni la fecha de creación del perfil.',
    url:'https://www.facebook.com/golazo.liga'
  },
  {
    title:'Archivo histórico · imágenes y tablas',
    note:'ZIP entregado por el usuario: tablas, fotografías, finales, equipos y publicaciones de la Liga adulta.',
    url:'https://drive.google.com/file/d/1BAb5avW4QFWG1LVy5dWR9_meuacFli1v/view?usp=drivesdk'
  },
  {
    title:'Facebook histórico · fuente 1',
    note:'Página/perfil aportado por el usuario para rastrear publicaciones, campeones y temporadas de la Liga.',
    url:'https://www.facebook.com/share/19UuQUvSiL/'
  },
  {
    title:'Facebook histórico · fuente 2',
    note:'Página/perfil aportado por el usuario como parte del archivo de la Liga.',
    url:'https://www.facebook.com/share/1V1aAQCzBn/'
  },
  {
    title:'Administración histórica · fuente aportada',
    note:'Perfil indicado por el usuario como fuente de publicaciones de una administración anterior de la Liga.',
    url:'https://www.facebook.com/share/1dN3djL6Pr/'
  },
  {
    title:'Administración actual · fuente aportada',
    note:'Perfil indicado por el usuario como fuente de publicaciones de la administración actual de la Liga.',
    url:'https://www.facebook.com/share/1GdSsb7ocg/'
  },
  {
    title:'Ángel Arias · fuente histórica aportada',
    note:'Perfil indicado por el usuario para localizar material de una administración anterior de la Liga.',
    url:'https://www.facebook.com/share/1DeWwcJiGX/'
  },
  {
    title:'Administrador de Golazo Liga · febrero 2014',
    note:'Perfil aportado por el usuario como administrador de Golazo Liga en febrero de 2014. Se conserva como fuente histórica para rastrear roles, jornadas, equipos y publicaciones de esa etapa. La búsqueda web pública no devolvió contenido indexado verificable del enlace compartido.',
    url:'https://www.facebook.com/share/1Fn7DXnRV5/'
  },
  {
    title:'Administrador de Golazo Liga · mayo 2014',
    note:'Perfil aportado por el usuario como administrador de la página Golazo Liga en mayo de 2014 y fuente de publicación de roles. El enlace compartido de Facebook no pudo verificarse de forma independiente fuera de Facebook, por lo que se conserva como fuente aportada y pista histórica.',
    url:'https://www.facebook.com/share/1JLpQm4pxc/'
  },
  {
    title:'Administrador de Golazo Liga · hacia 2015',
    note:'Perfil aportado por el usuario como administrador conocido de la página. Ser administrador de Facebook no demuestra por sí solo haber sido presidente de la Liga.',
    url:'https://www.facebook.com/share/1TXjdtGMgk/'
  },
  {
    title:'Sitio actual de la Liga',
    note:'Referencia operativa actual de la Liga Municipal de Futbol Juventino Rosas.',
    url:'https://www.juventinorosasliga.com/'
  },
  {
    title:'Reglamento 2026–2027',
    note:'Documento interno actual que usa la denominación Liga Municipal de Fútbol “Juventino Rosas A.C.” y describe Asamblea, Mesa Directiva y formato de competencia.',
    url:'https://juventinorosasliga.com/reglamento/descargar/'
  },
  {
    title:'Programación actual',
    note:'Reporte semanal usado para delimitar las categorías vigentes: categoría libre por fuerzas y Veteranos 35+ / 50+.',
    url:'https://www.juventinorosasliga.com/reporte-semanal/'
  },
  {
    title:'Congreso de Guanajuato · diciembre 2019',
    note:'Documento público externo que registra “LIGA MUNICIPAL JUVENTINO ROSAS” por $11,600 dentro de apoyos para construcción y reparación.',
    url:'https://congreso-gto.s3.amazonaws.com/uploads/periodo_armonizacion/partidas/2019_12_4411.pdf'
  },
  {
    title:'Notus · referencia pública 2026',
    note:'Nota periodística que utiliza la denominación “Liga Municipal de Juventino Rosas”, útil para documentar continuidad pública del nombre.',
    url:'https://notus.com.mx/ligas-suspenden-jornada-futbolera-este-fin-de-semana/'
  },
  {
    title:'Uno TV · referencia pública 2026',
    note:'Cobertura de ligas amateur que menciona a la Liga Municipal de Juventino Rosas.',
    url:'https://www.unotv.com/estados/guanajuato/paran-ligas-futbol-guanajuato-despues-masacre-salamanca/'
  },
  {
    title:'Antecedente del fútbol local · 1953',
    note:'Fuente secundaria que sitúa un primer partido local el 15 sep 1953 entre Deportivo Santa Cruz y Deportivo Villagrán. Es contexto del fútbol local, no fecha de fundación de la Liga actual.',
    url:'https://es.wikipedia.org/wiki/Juventino_Rosas_%28Guanajuato%29'
  },
  {
    title:'Archivo histórico · video 1',
    note:'Material audiovisual usado como fuente de consulta; no se incrusta dentro de Historia.',
    url:'https://drive.google.com/file/d/1G5IIosS0jhyga6FdhozUn2DEPSxpkvxU/view?usp=drivesdk'
  },
  {
    title:'Archivo histórico · video 2',
    note:'Material audiovisual usado como fuente de consulta; no se incrusta dentro de Historia.',
    url:'https://drive.google.com/file/d/1GFvoNisldXaqIMwQJR9HQx2_xhgTls45/view?usp=drivesdk'
  },
  {
    title:'Archivo histórico · 19 sep 2026 · 23-29-34 · segmento 1',
    note:'Grabación de Facebook usada para recuperar publicaciones, tablas, goleadores, campeones y equipos de 2015–2017. Fuente de consulta; el video no se incrusta en Historia.',
    url:'https://drive.google.com/file/d/11z3SB6QXQrJLxBk6Hgjbh1pRkcyYl3n_/view?usp=drivesdk'
  },
  {
    title:'Archivo histórico · 19 sep 2026 · 23-29-34 · segmento 2',
    note:'Continuación de la grabación histórica de Facebook. Se usa para contrastar temporadas y publicaciones antiguas sin insertar el video en la página.',
    url:'https://drive.google.com/file/d/1LyK_VCWcsKmE22z3_7KSwiFaUoXQgbf1/view?usp=drivesdk'
  },
  {
    title:'Archivo histórico · 19 sep 2026 · 23-29-34 · segmento 3',
    note:'Continuación del archivo histórico de Facebook. Fuente de consulta para temporadas antiguas; no se muestra como video dentro de Historia.',
    url:'https://drive.google.com/file/d/1_XC74YN7LDtI2CUQfAuFdQWQq0SY4X_F/view?usp=drivesdk'
  },
  {
    title:'Archivo histórico · 20 sep 2026 · 02-18-29 · segmento 1',
    note:'Grabación de Golazo Liga usada para verificar tablas, campeones y goleadores de 2015–2017.',
    url:'https://drive.google.com/file/d/1PIwlmIx68P63eSsNHiaAOASM28D39Zd6/view?usp=drivesdk'
  },
  {
    title:'Archivo histórico · 20 sep 2026 · 02-18-29 · segmento 2',
    note:'Grabación de Golazo Liga usada para verificar publicaciones de 2014–2015, trofeos y campeones.',
    url:'https://drive.google.com/file/d/1TQSth_qmbyK9D8uzpTOHFrV6dRuvHVXO/view?usp=drivesdk'
  },
  {
    title:'Archivo histórico · 20 sep 2026 · 02-18-29 · segmento 3',
    note:'Grabación de Golazo Liga usada para verificar publicaciones de 2012–2014, finales y equipos históricos.',
    url:'https://drive.google.com/file/d/12hOjfs01zm7hWzwfxbjPMlTxmNglafPg/view?usp=drivesdk'
  },
  {
    title:'Archivo Juventino Rosas Liga · 19 sep 2026 · 22-02-26',
    note:'Grabación de la página actual usada para documentar finales y publicaciones de la temporada 2025–2026.',
    url:'https://drive.google.com/file/d/1iUrPOcAfT9KMMuHlPuhJPPmtZAiNHlYr/view?usp=drivesdk'
  },
  {
    title:'Archivo histórico · 19 sep 2026 · 22-32-59 · segmento 1',
    note:'Grabación adicional de Juventino Rosas Liga. Fuente de cuartos, semifinales y la final de Copa de Veteranos 35+ de diciembre de 2025; el video no se incrusta en Historia.',
    url:'https://drive.google.com/file/d/1wDpnO3rbSPMqlP8ZB5jFa3SqHnYvE6S0/view?usp=drivesdk'
  },
  {
    title:'Archivo histórico · 19 sep 2026 · 22-32-59 · segmento 2',
    note:'Grabación adicional usada para recuperar campeones de Copa 2025, finalistas, reconocimientos a figuras históricas y roles de junio de 2025.',
    url:'https://drive.google.com/file/d/1nl1NjoMZkFk-5WZG36x0yLf61Fq6mfPc/view?usp=drivesdk'
  },
  {
    title:'Archivo histórico · 19 sep 2026 · 22-32-59 · segmento 3',
    note:'Grabación adicional usada para documentar la final de Veteranos 50+ de abril de 2025, Boavista campeón 2025, Campeón de Campeones y equipos finalistas.',
    url:'https://drive.google.com/file/d/1nl2s5c_gYM4fSU1nvCaltLHetj1b-l8G/view?usp=drivesdk'
  }
];


// V96 — Archivo histórico real: contenido verificado en capturas, álbumes y videos entregados por el usuario.
// Los videos se usan únicamente como fuente de consulta; NO se incrustan dentro de Historia.
const HIST_ROOT='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const HIST_MEDIA='https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/assets/history/';
const ESPERANZA_2025_PHOTO='./assets/history/archive-v224/la-esperanza-campeon-copa-veteranos50-08-nov-2025.webp?v=20260923-esperanza-bg-v225';
const HIST_PHOTOS=window.LJR_HISTORY_PHOTOS||{};
const HIST_CHAMPION_REFERENCE=HIST_MEDIA+'premiacion-historica.jpg';
function championBackground(name,explicitPhoto){
  const exact=(explicitPhoto||'').trim();
  // V119: nunca reutilizar una foto genérica ni un escudo como fondo de un campeón.
  // Solo se muestra una fotografía cuando el archivo la identifica para ese campeonato.
  if(exact) return {url:exact,exact:true};
  return {url:'',exact:false};
}
function historyPhotoCrop(name,season){
  const n=String(name||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const s=String(season||'').toLowerCase();
  // V205 — estas tres fuentes eran capturas de publicaciones. Mostramos únicamente
  // la zona fotográfica del partido/equipo; nunca el encabezado, texto, reacciones
  // ni interfaz de Facebook.
  if(n.includes('el alto') && (s.includes('2020')||s.includes('2019'))) return 'object-position:center 69%;transform:scale(2.05);transform-origin:center 68%;';
  if(n.includes('la esperanza') && s.includes('2020') && s.includes('2021')) return 'object-position:72% 77%;transform:scale(2.25);transform-origin:72% 77%;';
  if(n==='psv' && s.includes('2020') && s.includes('2021')) return 'object-position:center 68%;transform:scale(2.00);transform-origin:center 67%;';
  return '';
}
function championBgImg(name,explicitPhoto,season,klass){
  const bg=championBackground(name,explicitPhoto);
  if(!bg.url) return '';
  const alt=String(name||'')+' · campeón · '+String(season||'');
  const crop=historyPhotoCrop(name,season);
  return '<img class="'+klass+' v35-bg-exact '+(crop?'v35-photo-only-crop':'')+'" src="'+bg.url+'" alt="'+esc(alt)+'" loading="lazy" decoding="async" '+(crop?'style="'+crop+'"':'')+' onerror="this.remove()">';
}
const historyMoments=[
  {kind:'CAMPEÓN',date:'14 jun 2014',season:'2014',winner:'La Esperanza',title:'La Esperanza',subtitle:'Campeón de Copa · Veteranos',detail:'La Esperanza fue campeón de Copa de Veteranos 2014. Registro histórico del 14 de junio de 2014. La fotografía aportada muestra al equipo campeón con el trofeo.',backgroundPhoto:'./assets/history/archive-v120/la-esperanza-campeon-copa-veteranos-2014.jpg?v=20260923-esperanza-copa2014-v267',image:HIST_ROOT+'assets/official-logos/la-esperanza.png'},
  {kind:'CAMPEÓN',date:'19 sep 2026',season:'2025–2026',winner:'Deportivo CG · Cerrito de Gasca',title:'Deportivo CG · Cerrito de Gasca',subtitle:'Campeón de Liga · Veteranos 35 y más + Campeón de Campeones',detail:'El archivo histórico aportado muestra al plantel con los trofeos y los textos CAMPEÓN TORNEO DE LIGA 2025-2026 · VETERANOS 35 Y MAS y CAMPEÓN DE CAMPEONES. La final frente a Pozos F.C. quedó documentada para el 19 de septiembre de 2026.',backgroundPhoto:HIST_MEDIA+'archive-v120/deportivo-cg-campeon-liga-2025-2026.jpg',image:HIST_ROOT+'assets/teams/deportivo-cg.webp'},
  // V132 — finales 2025–2026 aportadas por el usuario con fotografías exactas.
  {kind:'CAMPEÓN',date:'07 jun 2026',season:'2025–2026',winner:'La Canchita Deportes',title:'La Canchita Deportes',subtitle:'Campeón de Liga · Segunda Fuerza',detail:'Dato e imagen aportados por el usuario: La Canchita Deportes ganó la final de Segunda Fuerza del 7 de junio de 2026; Aldama FC quedó como subcampeón.',backgroundPhoto:HIST_MEDIA+'archive-v132/canchita-deportes-campeon-segunda-2026.jpg',image:HIST_ROOT+'assets/official-logos/la-canchita-deportes.png'},
  {kind:'SUBCAMPEÓN',date:'07 jun 2026',season:'2025–2026',title:'Aldama FC',subtitle:'Subcampeón · Segunda Fuerza',detail:'Aldama FC quedó en segundo lugar en la final de Segunda Fuerza frente a La Canchita Deportes.',image:HIST_ROOT+'assets/official-logos/aldama-fc.png'},
  {kind:'CAMPEÓN',date:'24 may 2026',season:'2025–2026',winner:'Franco FC',title:'Franco FC',subtitle:'Campeón de Campeones',detail:'Dato e imagen aportados por el usuario: Franco FC ganó el Campeón de Campeones frente a Lobos CDG el 24 de mayo de 2026.',backgroundPhoto:HIST_MEDIA+'archive-v132/franco-fc-campeon-de-campeones-2026.jpg',image:HIST_ROOT+'assets/official-logos/franco-fc.png'},
  {kind:'CAMPEÓN',date:'23 may 2026',season:'2025–2026',winner:'La Esperanza',title:'La Esperanza',subtitle:'Campeón · final del 23 de mayo',detail:'Dato e imagen aportados por el usuario: La Esperanza ganó la final del 23 de mayo de 2026. La categoría exacta queda por precisar para no inventarla.',backgroundPhoto:HIST_MEDIA+'archive-v132/la-esperanza-campeon-23-mayo-2026.jpg',image:HIST_ROOT+'assets/official-logos/la-esperanza.png'},
  {kind:'CAMPEÓN',date:'10 may 2026',season:'2025–2026',winner:'Franco FC',title:'Franco FC',subtitle:'Campeón de Liga · Fuerza Intermedia',detail:'El 10 de mayo de 2026, Franco FC se coronó campeón de Liga de Fuerza Intermedia tras un aguerrido encuentro frente a La Esperanza. Fotografía exacta aportada por el usuario: el plantel campeón aparece levantando el trofeo.',backgroundPhoto:HIST_MEDIA+'archive-v132/franco-fc-campeon-intermedia-2026.jpg?v=20260923-franco-blue-v211',image:HIST_ROOT+'assets/official-logos/franco-fc.png'},
  {kind:'SUBCAMPEÓN',date:'10 may 2026',season:'2025–2026',title:'La Esperanza',subtitle:'Subcampeón · Fuerza Intermedia',detail:'La Esperanza quedó como subcampeón de Fuerza Intermedia frente a Franco FC el 10 de mayo de 2026.',backgroundPhoto:HIST_MEDIA+'archive-v132/la-esperanza-subcampeon-intermedia-2026.jpg?v=20260923-esperanza-yellow-v211',image:HIST_ROOT+'assets/official-logos/la-esperanza.png'},
  {kind:'CAMPEÓN',date:'15 mar 2026',season:'2025–2026',winner:'Linces',title:'Linces',subtitle:'Campeón de Liga · Primera Fuerza',detail:'Dato e imagen aportados por el usuario: Linces ganó la final de Primera Fuerza frente a Galácticos el 15 de marzo de 2026.',backgroundPhoto:HIST_MEDIA+'archive-v132/linces-campeon-primera-2026.jpg',image:HIST_ROOT+'assets/official-logos/linces.png'},
  {kind:'SUBCAMPEÓN',date:'15 mar 2026',season:'2025–2026',title:'Galácticos',subtitle:'Subcampeón · Primera Fuerza',detail:'Galácticos quedó como subcampeón de Primera Fuerza frente a Linces el 15 de marzo de 2026.',backgroundPhoto:HIST_MEDIA+'archive-v132/galacticos-subcampeon-primera-2026.jpg',image:HIST_ROOT+'assets/teams/galacticos-pozos.webp'},
  {kind:'CAMPEÓN',date:'20 dic 2025',season:'2025–2026',winner:'Salvajes',title:'Salvajes',subtitle:'Campeón · Torneo de Copa',detail:'Dato e imagen aportados por el usuario: Salvajes ganó la final del Torneo de Copa frente a Juventus el 20 de diciembre de 2025.',backgroundPhoto:HIST_MEDIA+'archive-v132/salvajes-campeon-copa-2025.jpg'},
  {kind:'SUBCAMPEÓN',date:'20 dic 2025',season:'2025–2026',title:'Juventus',subtitle:'Subcampeón · Torneo de Copa',detail:'Juventus quedó como subcampeón de la final de Copa frente a Salvajes el 20 de diciembre de 2025.',image:HIST_ROOT+'assets/official-logos/juventus.png'},
  {kind:'CAMPEÓN',date:'08 nov 2025',season:'2025',winner:'La Esperanza',title:'La Esperanza',subtitle:'Campeón de Copa · Veteranos 50 y más',detail:'Felicitamos al equipo Dep. La Esperanza, de la fuerza de Veteranos 50 y más, por haberse coronado campeón de Copa 2025. Fotografía exacta aportada por el usuario.',backgroundPhoto:ESPERANZA_2025_PHOTO,image:HIST_ROOT+'assets/official-logos/la-esperanza.png'},
  {kind:'CAMPEÓN',date:'26 abr 2025',season:'2025',winner:'Manchester',title:'Manchester',subtitle:'Campeón de Campeones · Veteranos 50 y más',detail:'La Liga Municipal de Fútbol Juventino Rosas A. C. felicitó al equipo Manchester por obtener la presea de Campeón de Campeones tras vencer a Boavista F. C. el 26 de abril de 2025.',backgroundPhoto:'./assets/history/archive-v225/manchester-campeon-campeones-26-abr-2025.webp?v=20260923-manchester-real-v237',image:HIST_ROOT+'assets/official-logos/manchester.png'},
  {kind:'CAMPEÓN',date:'12 abr 2025',season:'2025',winner:'Boavista FC',title:'Boavista FC',subtitle:'Campeón de Liga · Veteranos 50 y más',detail:'Fotografía aportada por el usuario y registro ya documentado en el archivo: Boavista FC aparece como CAMPEÓN 2025 del Torneo de Liga de Veteranos 50 y más.',backgroundPhoto:HIST_MEDIA+'archive-v120/boavista-fc-campeon-2025.jpg',image:HIST_ROOT+'assets/official-logos/boavista.png'},
  {kind:'CAMPEÓN',date:'15 sep 2024',season:'2024',winner:'Pozos FC',title:'Pozos FC',subtitle:'Campeón de Liga · Veteranos 35 y más',detail:'Fotografía exacta aportada por el usuario: Pozos FC fue campeón del Torneo de Liga de Veteranos 35 y más el 15 de septiembre de 2024. Corrección confirmada: el campeón fue Pozos FC, no PSV.',backgroundPhoto:'./assets/history/archive-v239/pozos-fc-campeon-liga-veteranos35-15-sep-2024.webp?v=20260923-pozos-user-v239',image:HIST_ROOT+'assets/teams/pozos-fc.webp'},
  {kind:'CAMPEÓN',date:'09 nov 2024',season:'2024',winner:'Manchester',title:'Manchester',subtitle:'Campeón del Torneo de Copa · Veteranos 50 y más',detail:'Dato e imagen aportados por el usuario: Manchester fue campeón del Torneo de Copa de Veteranos 50 y más el 9 de noviembre de 2024.',backgroundPhoto:'./assets/history/archive-v240/manchester-campeon-copa-v50-09-nov-2024-user.webp?v=20260923-manchester-user-v240',image:HIST_ROOT+'assets/official-logos/manchester.png'},
  {kind:'CAMPEÓN',date:'17 feb 2024',season:'2024',winner:'Juventus',title:'Juventus',subtitle:'Campeón del Torneo de Copa · Veteranos 35 y más',detail:'Material aportado por el usuario: el cartel de la Gran Final de Veteranos fija Juventus vs PSV Eindhoven para el sábado 17 de febrero de 2024; la publicación del 18 de febrero felicita a Juventus como campeón del Torneo de Copa 2024 de Veteranos 35 y más.',backgroundPhoto:HIST_MEDIA+'archive-v202/juventus-campeon-copa-veteranos35-17-feb-2024.webp',image:HIST_ROOT+'assets/official-logos/juventus.png'},
  {kind:'CAMPEÓN',date:'18 feb 2024',season:'2024',winner:'San Julián',title:'San Julián',subtitle:'Campeón del Torneo de Copa · Segunda Fuerza',detail:'Publicación aportada por el usuario con fecha 18 de febrero de 2024: la Liga Municipal de Fútbol Juventino Rosas felicita a San Julián como digno campeón del Torneo de Copa de Segunda Fuerza. Fotografía exacta aportada por el usuario.',backgroundPhoto:HIST_MEDIA+'archive-v218/san-julian-campeon-copa-segunda-18-feb-2024.jpg',image:HIST_ROOT+'assets/official-logos/san-julian.png'},
  {kind:'CAMPEÓN',date:'25 feb 2024',season:'2024',winner:'Mineros F. C.',title:'Mineros F. C.',subtitle:'Campeón · Fuerza Intermedia',detail:'Publicación aportada por el usuario con fecha 26 de febrero de 2024: señala que el día anterior se disputó la final de Fuerza Intermedia y que Mineros F. C., representante de la comunidad del Naranjillo, quedó campeón. El partido fue dedicado a Luis Manuel García Servín. Fotografía exacta aportada por el usuario.',backgroundPhoto:HIST_MEDIA+'archive-v218/mineros-fc-campeon-intermedia-25-feb-2024.jpg',image:HIST_ROOT+'assets/teams/mineros-fc.webp'},
  {kind:'CAMPEÓN',date:'08 oct 2023',season:'2023',winner:'Hermanos',title:'Hermanos',subtitle:'Campeón del Torneo Relámpago · Categoría Libre',detail:'Felicidades al equipo “HERMANOS”, campeón del Torneo Relámpago en la categoría Libre. Dato y fotografía aportados por el usuario. Fecha: 8 de octubre de 2023.',backgroundPhoto:HIST_MEDIA+'archive-v247/hermanos-campeon-relampago-libre-08-oct-2023.jpg?v=20260923-hermanos-v247',image:HIST_ROOT+'assets/official-logos/hermanos.png'},
  {kind:'CAMPEÓN',date:'10 sep 2023',season:'2023',winner:'América',title:'América',subtitle:'Campeón de Liga · Veteranos',detail:'Golazo Liga publicó el 10 de septiembre de 2023: AMERICA, NUEVO CAMPEON DE LIGA DE LA FUERZA DE VETERANOS. Fotografía exacta aportada por el usuario.',backgroundPhoto:HIST_MEDIA+'archive-v223/america-campeon-liga-veteranos-10-sep-2023.jpg',image:HIST_ROOT+'assets/branding/america-veteranos-35-user.png'},
  {kind:'CAMPEÓN',date:'04 mar 2024',season:'2024',winner:'Linces',title:'Linces',subtitle:'Campeón de Copa · Primera Fuerza',detail:'Publicación de La Pupila del 4 de marzo de 2024: Linces venció 3–2 a Hermanos FC y se llevó la final de Copa de Juventino Rosas Liga. Una publicación de Juventino Rosas Liga del 11 de abril de 2024 vuelve a identificar a Linces como actual monarca del torneo de Copa y equipo de Primera Fuerza. Fotografía: Roberto Valenzuela.',backgroundPhoto:HIST_MEDIA+'archive-v202/linces-campeon-copa-04-mar-2024.webp',image:HIST_ROOT+'assets/official-logos/linces.png'},
  {kind:'CAMPEÓN',date:'04 may 2024',season:'2024',winner:'Boca Jrs.',title:'Boca Jrs. · Cuenda',subtitle:'Campeón de Liga · Veteranos 50 y más',detail:'Publicación de Juventino Rosas Liga del 6 de mayo de 2024: Boca Jrs., de la comunidad de Cuenda, fue campeón del Torneo de Liga 2024 de Veteranos 50 y más tras imponerse a Manchester el sábado 4 de mayo de 2024.',backgroundPhoto:HIST_MEDIA+'archive-v202/boca-jrs-campeon-liga-v50-04-may-2024.webp'},
  // V198 — Juventus · Campeón de Copa · final 1 de febrero de 2025
  {kind:'CAMPEÓN',date:'01 feb 2025',season:'2025',winner:'Juventus',title:'Juventus',subtitle:'Campeón de Copa · Veteranos 35 y más',detail:'La Liga Municipal de Fútbol “Juventino Rosas” A. C. felicita al equipo JUVENTUS por haber obtenido el campeonato de Copa del torneo de Veteranos 35 y más ante el equipo PSV EINDOVHEN el 1 de febrero de 2025. ¡Enhorabuena, campeones! Fotografía exacta aportada por el usuario.',backgroundPhoto:HIST_MEDIA+'archive-v214/juventus-campeon-copa-veteranos35-01-feb-2025.webp?v=20260923-juventus-live-v217',image:HIST_ROOT+'assets/official-logos/juventus.png'},
  {kind:'CAMPEÓN',date:'08 jun 2025',season:'2025',winner:'Galácticos (Pozos)',title:'Galácticos (Pozos)',subtitle:'Campeón de Copa · Primera Fuerza',detail:'La Liga Municipal de Fútbol “Juventino Rosas” A.C. felicitó a Galácticos de Pozos por obtener el título de Campeón de Copa 2025 en Primera Fuerza, tras un reñido encuentro frente a Herreras F.C. Fotografía aportada por el usuario: Galácticos (Pozos), Campeón de Copa 2025, 8 de junio de 2025.',backgroundPhoto:HIST_MEDIA+'archive-v205/galacticos-pozos-campeon-copa-08-jun-2025.webp?v=20260923-galacticos-fix211',image:HIST_ROOT+'assets/teams/galacticos-pozos.webp'},
  {kind:'CAMPEÓN',date:'20 sep 2025',season:'2025',winner:'Juventus',title:'Juventus',subtitle:'Campeón de Liga · Veteranos 35 y más',detail:'Dato e imagen aportados por el usuario: Juventus ganó la final de Veteranos 35 y más frente a Salvajes el 20 de septiembre de 2025.',backgroundPhoto:HIST_MEDIA+'archive-v132/juventus-campeon-liga-veteranos-35-2025.jpg',image:HIST_ROOT+'assets/official-logos/juventus.png'},
  {kind:'SUBCAMPEÓN',date:'20 sep 2025',season:'2025',title:'Salvajes',subtitle:'Subcampeón · Veteranos 35 y más',detail:'Salvajes quedó como subcampeón de Liga de Veteranos 35 y más frente a Juventus el 20 de septiembre de 2025.'},
  {kind:'CAMPEÓN',date:'29 jun 2025',season:'2025',winner:'La Huerta de Cuenda',title:'La Huerta de Cuenda',subtitle:'Campeón de Liga · Segunda Fuerza',detail:'Dato e imagen aportados por el usuario: La Huerta de Cuenda ganó la final de Segunda Fuerza frente a Tavera FC el 29 de junio de 2025. Se usa la fotografía real del equipo campeón con el trofeo.',backgroundPhoto:HIST_MEDIA+'archive-v203/la-huerta-cuenda-campeon-segunda-29-jun-2025.jpg'},
  {kind:'SUBCAMPEÓN',date:'29 jun 2025',season:'2025',title:'Tavera FC',subtitle:'Subcampeón · Segunda Fuerza',detail:'Tavera FC quedó como subcampeón de Segunda Fuerza frente a La Huerta de Cuenda el 29 de junio de 2025.',backgroundPhoto:HIST_MEDIA+'archive-v119/tavera-finalista-2025.jpg',image:HIST_ROOT+'assets/official-logos/tavera-fc.png'},
  // V197 — campeones 2025 corregidos/aportados por el usuario.
  {kind:'CAMPEÓN',date:'09 feb 2025',season:'2025',winner:'Herreras FC',title:'Herreras FC',subtitle:'Campeón · Torneo Relámpago · Fuerza Intermedia',detail:'La Liga Municipal de Fútbol “JUVENTINO ROSAS” A.C. felicitó a Herreras F.C. por lograr el campeonato del Torneo Relámpago de Fuerza Intermedia el 9 de febrero de 2025 ante Oklahoma. Dato y fotografía aportados por el usuario.',backgroundPhoto:HIST_MEDIA+'archive-v208/herreras-fc-campeon-relampago-intermedia-09-feb-2025.webp',image:HIST_ROOT+'assets/official-logos/herreras-fc.png'},
  {kind:'CAMPEÓN',date:'09 feb 2025',season:'2025',winner:'Galácticos de Pozos',title:'Galácticos de Pozos',subtitle:'Campeón de Campeones · Primera Fuerza',detail:'La Liga Municipal de Fútbol “JUVENTINO ROSAS” A.C. felicitó al equipo GALÁCTICOS de Pozos por haber obtenido el cetro de Campeón de Campeones, al imponerse al equipo LINCES el 9 de febrero de 2025.',backgroundPhoto:'./assets/history/archive-v203/galacticos-campeon-campeones-09-feb-2025.jpg?v=20260923-galacticos-real-v240',image:HIST_ROOT+'assets/teams/galacticos-pozos.webp'},
  {kind:'CAMPEÓN',date:'16 feb 2025',season:'2025',winner:'Lobos Jrs.',title:'Lobos Jrs.',subtitle:'Campeón · Torneo Relámpago · Segunda Fuerza',detail:'Dato e imagen aportados por el usuario: Lobos Jrs. ganó el Torneo Relámpago de Segunda Fuerza el 16 de febrero de 2025.',backgroundPhoto:HIST_MEDIA+'archive-v207/lobos-jrs-campeon-relampago-segunda-16-feb-2025.webp'},
  // V196 — Lobos CDG · Campeón de Copa · Fuerza Intermedia 2025
  {kind:'CAMPEÓN',date:'15 jun 2025',season:'2025',winner:'Lobos CDG',title:'Lobos CDG · Cerrito de Gasca',subtitle:'Campeón de Copa · Fuerza Intermedia',detail:'La Liga Municipal de Fútbol felicita a Lobos CDG, de la comunidad de Cerrito de Gasca, por haber obtenido el título de Campeón de Copa 2025 ante Franco FC, de la comunidad de San José de Manantiales.',backgroundPhoto:HIST_MEDIA+'archive-v207/lobos-cdg-campeon-copa-intermedia-15-jun-2025.webp?v=20260923-lobos-clean-v212',image:HIST_ROOT+'assets/official-logos/lobos-cdg.png'},
  {kind:'TERCER LUGAR',date:'23 nov 2013',title:'Romerillo',subtitle:'Tercer lugar · Fuerza Intermedia',detail:'Golazo Liga publicó que el portero de Romerillo fue clave para que su equipo obtuviera el tercer lugar, destacando una atajada de penal en la serie final. El nombre del portero no es visible en la captura aportada.'},
  {kind:'CAMPEÓN',date:'22 feb 2014',season:'2014',winner:'DHP',title:'DHP',subtitle:'Campeón del Torneo de Copa 2014 · Segunda Fuerza',detail:'Golazo Liga publicó el 22 de febrero de 2014 el trofeo para el equipo DHP, campeón del Torneo de Copa 2014 de Segunda Fuerza.',backgroundPhoto:'./assets/history/archive-v260/dhp-campeon-copa-segunda-22-feb-2014.webp?v=20260923-old-history-v260'},
  {kind:'CAMPEÓN',date:'22 feb 2014',season:'2014',winner:'Puros Cuates',title:'Puros Cuates',subtitle:'Campeón de Copa · Fuerza Intermedia',detail:'La publicación de Golazo Liga muestra el trofeo entregado al equipo campeón.',backgroundPhoto:'./assets/history/archive-v260/puros-cuates-campeon-copa-intermedia-22-feb-2014.webp?v=20260923-puros-cuates-2014-live-v280',image:''},
  {kind:'PRIMER LUGAR',date:'10 abr 2022',season:'2022',title:'Linces',subtitle:'Primer lugar de tabla general · Primera Fuerza',detail:'Linces. Primer lugar de tabla general 2022, Primera Fuerza. Fecha exacta: 10 de abril de 2022.',backgroundPhoto:'./assets/history/archive-v286/linces-primer-lugar-tabla-general-2022-primera.jpg?v=20260923-linces-fecha-10abr2022-v287',archiveOnly:true,championsOnly:true},
  {kind:'CAMPEÓN',date:'18 sep 2022',season:'2022',winner:'Terrícolas SEDER',title:'Terrícolas SEDER',subtitle:'Campeón de Copa · Segunda Fuerza',detail:'Terrícolas SEDER, campeón de Copa 2022, Segunda Fuerza. ¡¡Felicidades!!',backgroundPhoto:'./assets/history/archive-v254/terricolas-seder-campeon-copa-18-sep-2022.webp?v=20260923-terricolas-user-v254',image:HIST_ROOT+'assets/official-logos/terricolas.png'},
  {kind:'CAMPEÓN',date:'17 abr 2022',season:'2022',winner:'Juventus',title:'Juventus',subtitle:'Campeón de Liga · Primera Fuerza',detail:'Juventus, campeón de Liga 2022, Primera Fuerza. Al ser el campeón vigente de Copa 2019, también se coronó como Campeón de Campeones.',backgroundPhoto:'./assets/history/archive-v269/juventus-campeon-liga-primera-17-abr-2022.jpg?v=20260923-juventus-17abr2022-hard-v285',image:''},
  {kind:'CAMPEÓN',date:'10 abr 2022',season:'2022',winner:'Tavera FC',title:'Tavera FC',subtitle:'Campeón de Liga · Fuerza Intermedia',detail:'Tavera FC fue campeón de Liga 2022 en Fuerza Intermedia. Con este campeonato logró su ascenso a Primera Fuerza. ¡Felicidades!',backgroundPhoto:'./assets/history/archive-v253/tavera-campeon-liga-intermedia-10-abr-2022.webp?v=20260923-tavera-2022-v253',image:HIST_ROOT+'assets/official-logos/tavera-fc.png'},
  {kind:'CAMPEÓN',date:'20 mar 2022',season:'2022',winner:'Galácticos FC',title:'Galácticos FC',subtitle:'Campeón de Liga · Segunda Fuerza',detail:'Publicación aportada por el usuario desde Golazo Liga: Galácticos FC fue campeón de Liga en Segunda Fuerza y con ese título logró su ascenso a Fuerza Intermedia.',backgroundPhoto:HIST_MEDIA+'archive-v185/galacticos-campeon-segunda-2022.webp',image:HIST_ROOT+'assets/teams/galacticos-pozos.webp'},
    {kind:'CAMPEÓN',date:'02 oct 2021',season:'2020–2021',winner:'PSV',title:'PSV',subtitle:'Campeón de Campeones · Veteranos · 2020–2021',detail:'Publicación de Golazo Liga del 2 de octubre de 2021: PSV fue Campeón de Campeones de la temporada 2020–2021 en la categoría Veteranos.',backgroundPhoto:HIST_MEDIA+'archive-v134/psv-campeon-campeones-veteranos-2020-2021.jpg',image:HIST_ROOT+'assets/teams/psv.webp'},
  {kind:'CAMPEÓN',date:'25 sep 2021',season:'2020–2021',winner:'La Esperanza',title:'La Esperanza',subtitle:'Campeón de Liga · Veteranos · 2020–2021',detail:'Publicación de Golazo Liga del 25 de septiembre de 2021: La Esperanza se llevó el título de Liga 2020–2021 al derrotar a Real Cuenda en una final decidida por tiros penales.',backgroundPhoto:'./assets/history/archive-v256/la-esperanza-campeon-liga-veteranos-25-sep-2021.webp?v=20260923-esperanza-2021-user-v260',image:HIST_ROOT+'assets/official-logos/la-esperanza.png'},
      {kind:'CAMPEÓN',date:'19 ene 2020',season:'2019–2020',winner:'El Alto',title:'El Alto',subtitle:'Campeón de Copa · Fuerza Intermedia',detail:'Publicación de Golazo Liga del 19 de enero de 2020: “Felicidades!!! El Alto, campeón de copa, fuerza intermedia.”',backgroundPhoto:HIST_MEDIA+'archive-v134/el-alto-campeon-copa-intermedia-2020.jpg'},
  {kind:'CAMPEÓN',date:'17 nov 2019',season:'2019',winner:'PSV',title:'PSV',subtitle:'Campeón de Copa 2019 · Veteranos',detail:'Publicación aportada por el usuario: “Felicidades!!! PSV campeón de copa 2019, categoría veteranos”.',backgroundPhoto:'./assets/history/archive-v249/psv-campeon-copa-veteranos-17-nov-2019.webp?v=20260923-psv-copa2019-real-v249',image:HIST_ROOT+'assets/teams/psv.webp'},
  {kind:'SUBCAMPEÓN',date:'03 nov 2019',season:'2018–2019',title:'Boavista',subtitle:'Subcampeón de Liga · 2018–2019',detail:'Publicación aportada por el usuario: Boavista fue subcampeón del Torneo de Liga 2018–2019.',backgroundPhoto:'./assets/history/archive-v252/boavista-subcampeon-liga-03-nov-2019.webp?v=20260923-boavista-subcampeon-v252',image:HIST_ROOT+'assets/official-logos/boavista.png'},
  {kind:'TERCER LUGAR',date:'03 nov 2019',season:'2018–2019',title:'Abejas',subtitle:'Tercer lugar · Primera Fuerza · 2018–2019',detail:'Publicación aportada por el usuario: el equipo Abejas obtuvo el tercer lugar de la temporada 2018–2019 en Primera Fuerza.',image:HIST_ROOT+'assets/official-logos/abejas.png'},
  {kind:'CAMPEÓN',date:'16 sep 2019',season:'2018–2019',winner:'La Pandilla de Morales',title:'La Pandilla de Morales',subtitle:'Campeón de Liga · 2018–2019',detail:'Publicación aportada por el usuario: “Felicidades a los campeones de liga 2018-2019. Felicidades a La Pandilla y Linces Junior”. El 9 de julio también se documentó a La Pandilla de Morales como primer lugar de la tabla general y con ascenso a Primera Fuerza.',backgroundPhoto:'./assets/history/archive-v249/la-pandilla-morales-campeon-liga-2019.jpg?v=20260923-pandilla-linces-v249'},
  {kind:'CAMPEÓN',date:'16 sep 2019',season:'2018–2019',winner:'Linces Jr.',title:'Linces Jr.',subtitle:'Campeón de Liga · 2018–2019',detail:'Publicación aportada por el usuario: “Felicidades a los campeones de liga 2018-2019. Felicidades a La Pandilla y Linces Junior”. El 9 de julio también se documentó a Linces Jr. como líder general y con ascenso a Fuerza Intermedia.',backgroundPhoto:'./assets/history/archive-v249/linces-jr-campeon-liga-2019.jpg?v=20260923-pandilla-linces-v249',image:HIST_ROOT+'assets/official-logos/linces.png'},
  {kind:'CAMPEÓN',date:'22 jun 2019',season:'2019',winner:'La Esperanza',title:'La Esperanza',subtitle:'Campeón de Campeones · Veteranos',detail:'Publicación aportada por el usuario: “Felicidades al campeón de campeones de la categoría veteranos. Felicidades a La Esperanza”.',backgroundPhoto:'./assets/history/archive-v250/la-esperanza-campeon-campeones-veteranos-22-jun-2019.webp?v=20260923-esperanza-2019-bg-v250',image:HIST_ROOT+'assets/official-logos/la-esperanza.png'},
{kind:'CONVOCATORIA',date:'12 nov 2019',season:'2019–2020',title:'Convocatoria temporada 2019–2020',subtitle:'Inicio: domingo 8 dic 2019 · Primera, Intermedia y Segunda',detail:'La Liga Municipal de Fútbol “Juventino Rosas A.C.” convocó a delegados y nuevos equipos. Inscripciones hasta el martes 26 de noviembre de 2019 a las 19:00 en la Unidad Deportiva Sur; máximo 26 jugadores por registro; junta previa el martes 3 de diciembre a las 19:00. Uniformación, cuotas, arbitrajes, credenciales, reglamento y premiación quedarían sujetos a los acuerdos y normas de la Liga.'},
{kind:'CAMPEÓN',date:'16 feb 2020',season:'2019–2020',winner:'Juventus',title:'Juventus',subtitle:'Campeón de Copa · Primera Fuerza',detail:'Publicación de Golazo Liga del 16 de febrero de 2020: Juventus fue campeón de Copa 2019–2020 de Primera Fuerza.',backgroundPhoto:HIST_MEDIA+'archive-v134/juventus-campeon-copa-primera-2019-2020.jpg',image:HIST_ROOT+'assets/official-logos/juventus.png'},
  {kind:'CAMPEÓN',date:'16 feb 2020',season:'2019–2020',winner:'Tavera',title:'Tavera',subtitle:'Campeón de Copa · Segunda Fuerza',detail:'Publicación de Golazo Liga del 16 de febrero de 2020: Tavera fue campeón de Copa 2019–2020 de Segunda Fuerza.',backgroundPhoto:HIST_MEDIA+'archive-v134/tavera-campeon-copa-segunda-2019-2020.jpg',image:HIST_ROOT+'assets/official-logos/tavera-fc.png'},
  {kind:'CAMPEÓN',date:'21 sep 2024',season:'2024',winner:'Juventus',title:'Juventus',subtitle:'Campeón de Campeones · 2024',detail:'Dato e imagen aportados por el usuario: Juventus fue Campeón de Campeones el 21 de septiembre de 2024.',backgroundPhoto:JUVENTUS_2024_PHOTO,image:HIST_ROOT+'assets/official-logos/juventus.png'},
  {kind:'CAMPEÓN',date:'17 nov 2024',season:'2024',winner:'Promesas de Pozos',title:'Promesas de Pozos',subtitle:'Campeón de Liga · Segunda Fuerza',detail:'Dato e imágenes aportados por el usuario: Promesas de Pozos fue campeón del Torneo de Liga de Segunda Fuerza el 17 de noviembre de 2024.',backgroundPhoto:HIST_MEDIA+'archive-v117/promesas-campeon-2024.webp',image:HIST_ROOT+'assets/official-logos/promesas-fc.png'},
  {kind:'CAMPEÓN',date:'23 jul 2023',season:'2022–2023',winner:'Barza',title:'Barza',subtitle:'Campeón de Campeones · Fuerza Intermedia · 2022–2023',detail:'Publicación de Golazo Liga del 23 de julio de 2023: “Felicitamos al equipo BARZA de la categoría intermedia por la obtención del título campeón de campeones. 2022_2023”.',backgroundPhoto:HIST_MEDIA+'archive-v133/barza-campeon-campeones-intermedia-2022-2023.jpg',image:HIST_ROOT+'assets/official-logos/barza.png'},
  {kind:'CAMPEÓN',date:'02 oct 2022',season:'2022',winner:'Juventus',title:'Juventus',subtitle:'Campeón de Copa 2022 · Primera Fuerza',detail:'Publicación de Golazo Liga del 2 de octubre de 2022: “Juventus, campeón de copa 2022, primera fuerza.” El cartel de la Gran Final de Copa 2022 identifica a PSV como rival de Juventus.',backgroundPhoto:HIST_MEDIA+'archive-v133/juventus-campeon-copa-primera-2022.jpg',image:HIST_ROOT+'assets/official-logos/juventus.png'},
{kind:'CAMPEÓN',date:'25 sep 2022',season:'2022',winner:'Barza',title:'Barza',subtitle:'Campeón de Copa · Fuerza Intermedia',detail:'Publicación de Golazo Liga del 25 de septiembre de 2022: “Barza, campeón de Copa fuerza intermedia. Felicidades!!!”.',backgroundPhoto:HIST_MEDIA+'archive-v133/barza-campeon-copa-intermedia-2022.jpg',image:HIST_ROOT+'assets/official-logos/barza.png'},
  {kind:'CAMPEÓN',date:'03 nov 2019',season:'2018–2019',winner:'Juventus',title:'Juventus',subtitle:'Campeón de Liga · temporada 2018–2019',detail:'Fotografía histórica del plantel campeón; Boavista quedó registrado como subcampeón.',backgroundPhoto:HIST_MEDIA+'juventus-campeon-2019.jpg',image:HIST_ROOT+'assets/official-logos/juventus.png'},
  {kind:'CAMPEÓN',date:'15 jun 2018',season:'2018',winner:'Tecos',title:'Tecos',subtitle:'Campeón · Torneo de Liga',detail:'Dato confirmado por el usuario: Tecos fue campeón del Torneo de Liga el 15 de junio de 2018. La fotografía muestra al plantel campeón con el trofeo.',backgroundPhoto:HIST_MEDIA+'tecos-campeon-historico.jpg'},
    {kind:'CAMPEÓN',date:'09 jun 2018',season:'2018',winner:'Magisterio',title:'Magisterio',subtitle:'Campeón · torneo/categoría no especificados',detail:'Publicación aportada por el usuario: “Felicidades al campeón. ¡¡Felicidades!! Magisterio.” La publicación no especifica en el texto aportado el torneo ni la categoría.',backgroundPhoto:'./assets/history/archive-v266/magisterio-campeon-09-jun-2018.jpg?v=20260923-magisterio-hardfix-v266'},
  {kind:'CAMPEÓN',date:'31 dic 2017',season:'2017',winner:'Real DHP',title:'Real DHP',subtitle:'Campeón de Copa · Fuerza Intermedia',detail:'Publicación de Golazo Liga del 31 de diciembre de 2017: “Felicidades al campeón de copa, de la categoría Intermedia. ¡¡Felicidades Real DHP!!”. Fotografía exacta aportada por el usuario.',backgroundPhoto:'./assets/history/archive-v271/real-dhp-campeon-copa-intermedia-31-dic-2017.webp?v=20260923-real-dhp-bg-hardfix-v271',image:''},
  {kind:'CAMPEÓN',date:'11 ene 2015',season:'2015',winner:'Boavista',title:'Boavista',subtitle:'Campeón · Primera Fuerza',detail:'Dato e imagen aportados por el usuario: Boavista fue campeón de Primera Fuerza el 11 de enero de 2015. La fotografía muestra al plantel campeón con el trofeo.',backgroundPhoto:'./assets/history/archive-v286/boavista-campeon-primera-11-ene-2015.webp?v=20260924-boavista-11ene2015-final-v292',image:HIST_ROOT+'assets/official-logos/boavista.png'},
  {kind:'CAMPEÓN',date:'09 jul 2016',season:'2016',winner:'Magisterio',title:'Magisterio',subtitle:'Campeón de Copa',detail:'Publicación aportada por el usuario: “Felicidades al campeón de copa. Felicidades Magisterio”. La categoría no aparece especificada en el texto aportado.',backgroundPhoto:HIST_MEDIA+'archive-v120/magisterio-campeon-copa-2016.jpg'},
  {kind:'CAMPEÓN',date:'28 feb 2016',season:'2016',winner:'Malvinas',title:'Malvinas',subtitle:'Campeón de Campeones · Fuerza Intermedia',detail:'Publicación aportada por el usuario: “¡¡Felicidades!! al campeón de campeones de la categoría intermedia. Felicidades Malvinas”. El subcampeón no está identificado en el material aportado.',backgroundPhoto:HIST_MEDIA+'archive-v120/malvinas-campeon-campeones-intermedia-2016.jpg',image:HIST_ROOT+'assets/official-logos/malvinas.png'},
  {kind:'CAMPEÓN',date:'28 feb 2016',season:'2016',winner:'La Esperanza',title:'La Esperanza',subtitle:'Campeón · Veteranos',detail:'Publicación aportada por el usuario: entrega del premio en efectivo al campeón de la categoría Veteranos. “Felicidades a La Esperanza”.',backgroundPhoto:HIST_MEDIA+'archive-v246/la-esperanza-campeon-veteranos-28-feb-2016.jpg?v=20260923-missing-bg-v246',image:HIST_ROOT+'assets/official-logos/la-esperanza.png'},
  {kind:'CAMPEÓN',date:'27 mar 2016',season:'2016',winner:'San Julián',title:'San Julián',subtitle:'Campeón de Campeones · Segunda Fuerza',detail:'Archivo de Golazo Liga · 27 de marzo de 2016. En la publicación del partido inmediatamente anterior del mismo día aparece el marcador “4 - 1 favor San Julian”; a continuación se publicó la fotografía del plantel con el trofeo y el texto “Campeón de campeones, de la categoría de segunda fuerza.” Por esa secuencia documental se identifica a San Julián como campeón.',backgroundPhoto:HIST_MEDIA+'archive-v246/campeon-campeones-segunda-27-mar-2016.jpg?v=20260923-san-julian-cdc-2016-v266'},
{kind:'CAMPEÓN',date:'03 dic 2012',season:'2012',winner:'Valencia',title:'Valencia',subtitle:'Campeón de Copa · Categoría Intermedia',detail:'Publicación de Golazo Liga del 3 de diciembre de 2012: “Felicidades al equipo Valencia, campeón de Copa, categoría Intermedia”. Fotografía exacta aportada por el usuario.',backgroundPhoto:'./assets/history/archive-v282/valencia-campeon-copa-intermedia-03-dic-2012.webp?v=20260923-valencia-copa-2012-v282',image:''},
{kind:'CAMPEÓN',date:'26 nov 2012',season:'2012',winner:'Juventus',title:'Juventus',subtitle:'Campeón · Primera Fuerza',detail:'¡¡FELICIDADES AL CAMPEÓN!! EQUIPO JUVENTUS · PRIMERA FUERZA.',backgroundPhoto:'./assets/history/archive-v261/juventus-campeon-primera-26-nov-2012.webp?v=20260923-juventus-restore-card-v272',image:HIST_ROOT+'assets/official-logos/juventus.png'},
{kind:'CAMPEÓN',date:'11 dic 2012',season:'2012',winner:'Tavera FC',title:'Tavera FC',subtitle:'Campeón de Copa · Categoría Segunda',detail:'Golazo Liga felicitó al equipo Tavera como campeón de Copa de la Categoría Segunda el 11 de diciembre de 2012.',backgroundPhoto:'./assets/history/archive-v260/tavera-campeon-copa-segunda-11-dic-2012.webp?v=20260923-old-history-v260',image:HIST_ROOT+'assets/official-logos/tavera-fc.png'},
  {kind:'CAMPEÓN',date:'22 feb 2014',season:'2014',winner:'Abejas Pozos',title:'Abejas Pozos',subtitle:'Campeón de Copa · Primera Fuerza',detail:'Abejas Pozos ganó la Gran Final del Torneo de Copa 2014 de Primera Fuerza frente a Juventus FC Jr. el 22 de febrero de 2014.',backgroundPhoto:'./assets/history/archive-v290/abejas-pozos-campeon-copa-primera-22-feb-2014.webp?v=20260923-abejas-photo-v290'},
  {kind:'PENALES',date:'23 feb 2013',title:'Magisterio 4–2 Boavista',subtitle:'0–0 en tiempo reglamentario · tanda de penales',detail:'Golazo Liga registró empate 0–0 en tiempo reglamentario y victoria de Magisterio 4–2 en la tanda de penales.'},
  {kind:'CAMPEÓN',date:'15 dic 2013',season:'2013',winner:'Real Cerrito de Gasca',title:'Real Cerrito de Gasca',subtitle:'Campeón · Segunda Fuerza',detail:'Golazo Liga publicó al capitán “Nudo” recibiendo el trofeo de campeón de Segunda Fuerza. En una actualización de la final, Real Cerrito vencía 3–0 a DHP al minuto 35.',backgroundPhoto:HIST_MEDIA+'archive-v120/real-cerrito-campeon-2013.jpg',image:HIST_ROOT+'assets/teams/deportivo-cg.webp'},
  {kind:'CAMPEÓN',date:'09 mar 2013',season:'2013',winner:'Universidad',title:'Universidad',subtitle:'Campeón de Veteranos · Final vs Dinamo · Unidad Deportiva Sur · 16:00',detail:'Dato e imagen aportados por el usuario: Universidad ganó la final de Veteranos frente a Dinamo el sábado 9 de marzo de 2013 en la Unidad Deportiva Sur. La fotografía corresponde al equipo campeón con el trofeo.',backgroundPhoto:'./assets/history/archive-v275/universidad-2013-team-720.webp?v=20260923-universidad-first-photo-v275'},
  {kind:'ANIVERSARIO',date:'28 nov 2012 · memoria de oct 1987',title:'Boavista',subtitle:'XXV aniversario',detail:'Álbum conmemorativo del equipo Boavista.',backgroundPhoto:HIST_MEDIA+'archive-v119/boavista-xxv-2012.jpg'},
  {kind:'PENALES',date:'Archivo histórico',title:'Hermanos vs Juventus',subtitle:'Torneo de Copa',detail:'Serie de penales registrada en el archivo histórico.',imageA:HIST_ROOT+'assets/official-logos/hermanos.png',imageB:HIST_ROOT+'assets/official-logos/juventus.png'},
  {kind:'ENCUENTRO',date:'Archivo histórico',title:'Valencia vs Halcones',subtitle:'Partido histórico',detail:'Encuentro conservado dentro del archivo fotográfico.'},
  {kind:'PENALES',date:'Archivo histórico',title:'Hermanos vs Chelse',subtitle:'Archivo histórico',detail:'Serie de penales conservada en los álbumes de la Liga.',image:HIST_ROOT+'assets/official-logos/hermanos.png'},
  {kind:'CLÁSICO',date:'Domingo 21 de junio · año no visible',title:'Olímpicos de Pozos vs Abejas FC',subtitle:'Campo de Pozos · 10:00',detail:'Rivalidad histórica: unidos por la comunidad y separados por el fútbol.',image:HIST_ROOT+'assets/official-logos/abejas.png'}
];

const historyYouth=[];

const taggedFacebookPosts=[
  {date:'02 oct 2021',person:'Xavier Lara Valencia',type:'CAMPEÓN DE CAMPEONES',title:'PSV · Veteranos · 2020–2021',detail:'Golazo Liga: PSV Campeón de Campeones de la temporada 2020–2021, categoría Veteranos.'},
  {date:'25 sep 2021',person:'Xavier Lara Valencia',type:'CAMPEÓN DE LIGA',title:'La Esperanza · Veteranos · 2020–2021',detail:'Golazo Liga: La Esperanza ganó el título de Liga 2020–2021 al derrotar a Real Cuenda en una final decidida por tiros penales.'},
  {date:'16 feb 2020',person:'Xavier Lara Valencia',type:'CAMPEONES DE COPA',title:'Juventus · Primera / Tavera · Segunda',detail:'Golazo Liga felicitó a Juventus como campeón de Copa 2019–2020 de Primera Fuerza y a Tavera como campeón de Segunda Fuerza.'},
  {date:'19 ene 2020',person:'Xavier Lara Valencia',type:'CAMPEÓN DE COPA',title:'El Alto · Fuerza Intermedia',detail:'Golazo Liga publicó: “El Alto, campeón de copa, fuerza intermedia.”'},
  {date:'23 jul 2023',person:'Octavio Alberto García',type:'CAMPEÓN DE CAMPEONES',title:'Barza · Intermedia · 2022–2023',detail:'Octavio Alberto García publicó en Golazo Liga la felicitación a Barza por obtener el título de Campeón de Campeones de la categoría Intermedia 2022–2023.'},
  {date:'02 oct 2022',person:'Xavier Lara Valencia',type:'CAMPEÓN DE COPA',title:'Juventus · Primera Fuerza',detail:'Xavier Lara Valencia publicó en Golazo Liga: “Juventus, campeón de copa 2022, primera fuerza.” El cartel de la Gran Final del mismo día muestra Juventus vs PSV.'},
  {date:'20 mar 2022',person:'Xavier Lara Valencia',type:'CAMPEÓN / ASCENSOS / GOLEO',title:'Galácticos FC · campeón de Liga y ascenso',detail:'Publicación aportada por el usuario desde Golazo Liga. Galácticos FC aparece como campeón de Liga de Segunda Fuerza y ascendido a Fuerza Intermedia. En el mismo bloque histórico se reporta a La Esperanza FC como líder general de Segunda Fuerza con ascenso, a Populares como líder general de Fuerza Intermedia con ascenso a Primera Fuerza, y a Angel E. Ortega y Jesús Guadalupe Hortelano como campeones de goleo de Segunda Fuerza y Fuerza Intermedia, respectivamente.'},
  {date:'25 sep 2022',person:'Xavier Lara Valencia',type:'CAMPEÓN DE COPA',title:'Barza · campeón de Copa de Fuerza Intermedia',detail:'Xavier Lara Valencia publicó en Golazo Liga: “Barza, campeón de Copa fuerza intermedia. Felicidades!!!”.'},
  {date:'Fecha exacta pendiente',person:'Xavier Lara Valencia',type:'ROLES / PUBLICACIONES HISTÓRICAS',title:'Roles de juego publicados en Golazo Liga',detail:'Referencia histórica aportada para revisar publicaciones y roles de juego asociados a Golazo Liga. La búsqueda pública actual de Facebook/web no devolvió una publicación indexada con su nombre, por lo que las fechas, jornadas y equipos exactos quedan pendientes de extraer del material visual o del perfil original antes de atribuir resultados concretos.'},
  {date:'04 nov 2012',person:'Richard JR Centeno + 2 personas',type:'ETIQUETADOS',title:'Partidos pendientes · Copa de Primera',detail:'Golazo Liga aparece etiquetado con Richard JR Centeno y dos personas más en Santa Cruz de Juventino Rosas. La publicación corresponde a partidos pendientes del Torneo de Copa de Primera.'},
  {date:'26 nov 2012',person:'Manuel Pantoja Hernandez',type:'FOTOS / ETIQUETA',title:'Álbum de Copa · Hermanos vs Juventus',detail:'Golazo Liga agregó 12 fotos nuevas con Manuel Pantoja Hernandez. El archivo contiguo identifica una serie de penales Hermanos vs Juventus del Torneo de Copa.'},
  {date:'11 dic 2012',person:'Brayan Paz',type:'ETIQUETADO',title:'Tavera campeón de Copa · Segunda',detail:'Golazo Liga aparece con Brayan Paz en la publicación que felicita a Tavera como campeón de Copa de la Categoría Segunda.'},
  {date:'09 may 2013',person:'Javier Peña Luna + Mazacotes FC',type:'ETIQUETADOS',title:'Publicación administrativa',detail:'Golazo Liga aparece con Javier Peña Luna y Mazacotes FC. El texto visible indica que las aclaraciones debían hacerse por el conducto correspondiente y no en Facebook.'},
  {date:'19 jun 2013',person:'Octavio Alberto García',type:'PUBLICÓ EN GOLAZO LIGA',title:'Tres publicaciones visuales recuperadas',detail:'El archivo conserva tres entradas del 19 de junio de 2013 publicadas por Octavio Alberto García en Golazo Liga. El texto extraído no conserva el contenido de las imágenes, por lo que las tablas o roles exactos quedan pendientes de revisión visual.'},
  {date:'17 jul 2013',person:'German Vazquez',type:'ETIQUETADO',title:'Tablas de posiciones',detail:'Golazo Liga aparece con German Vazquez. Un comentario de Emmanuel Ibarra felicita que la Liga publique las tablas de posiciones para mantener informados a los aficionados.'},
  {date:'20 ago 2013',person:'Jorge Luiz Buenavista',type:'ETIQUETADO',title:'Publicación histórica por revisar',detail:'Golazo Liga aparece con Jorge Luiz Buenavista. El texto recuperado no conserva el contenido de la imagen o publicación, así que no se atribuyen resultados ni equipos sin revisar el material visual.'},
  {date:'21 sep 2013',person:'Mary Flores',type:'PUBLICÓ EN GOLAZO LIGA',title:'Rol de juego · 21 y 22 de septiembre',detail:'Mary Flores publicó en Golazo Liga el rol del sábado 21 y domingo 22 de septiembre de 2013. En el mismo registro se informa suspensión general porque los campos no estaban en condiciones.'},
  {date:'17 oct 2013',person:'Enrique Aboytes',type:'PUBLICÓ EN GOLAZO LIGA',title:'Tablas y aclaraciones',detail:'El archivo conserva varias publicaciones de Enrique Aboytes en Golazo Liga. Un comentario de Juventus FC Jr. señala que una tabla mostrada no incluía PJ, PG y PE; Enrique recuerda que las aclaraciones debían hacerse en la reunión del lunes.'},
  {date:'05 nov 2013',person:'Enrique Aboytes',type:'TABLAS',title:'Tabla General · Primera y Segunda Fuerza',detail:'Enrique Aboytes publicó en Golazo Liga dos tablas generales: una de Segunda Fuerza y otra de Primera Fuerza.'},
  {date:'12 nov 2013',person:'Enrique Aboytes',type:'DESCENSOS',title:'Terrícolas y La Pandilla de Rancho Viejo',detail:'Enrique Aboytes publicó que Terrícolas y La Pandilla de Rancho Viejo descendían a Fuerza Intermedia.'},
  {date:'18 nov 2013',person:'Enrique Aboytes',type:'FINALES',title:'Primera Fuerza y Segunda Fuerza',detail:'Enrique Aboytes publicó en Golazo Liga información de las finales de Primera Fuerza y Segunda Fuerza.'},
  {date:'15 dic 2013',person:'Octavio Alberto García',type:'FINAL / CAMPEÓN',title:'Real Cerrito de Gasca · campeón de Segunda',detail:'Octavio Alberto García publicó que el capitán “Nudo” recibió el trofeo de campeón de Segunda Fuerza para Real Cerrito de Gasca. Otra actualización de la final registraba a Real Cerrito 3–0 sobre DHP al minuto 35; ese marcador se conserva como parcial, no como resultado final.'}
];

const retroClubs=[
  {name:'Tavera FC',logo:'assets/official-logos/tavera-fc.png',note:'Campeón de Copa · Segunda'},
  {name:'Boavista',logo:'assets/official-logos/boavista.png',note:'XXV aniversario · archivo histórico'},
  {name:'Dynamo',logo:'assets/official-logos/dynamo.png',note:'Final de Veteranos vs Universidad'},
  {name:'Juventus',logo:'assets/official-logos/juventus.png',note:'Torneo de Copa · archivo histórico'},
  {name:'Hermanos',logo:'assets/official-logos/hermanos.png',note:'Series de penales y torneos de Copa'},
  {name:'Abejas FC',logo:'assets/official-logos/abejas.png',note:'Clásico vs Olímpicos de Pozos'},
  {name:'La Esperanza',logo:'assets/official-logos/la-esperanza.png',note:'Campeón de Liga Veteranos 2020–2021 · líder general y ascenso 2022'},
  {name:'Malvinas',logo:'assets/official-logos/malvinas.png',note:'Intermedia · archivo 2015–2016'},
  {name:'La Cuadrilla',logo:'assets/official-logos/la-cuadrilla.png',note:'Primera e Intermedia · tablas históricas'},
  {name:'Populares',logo:'assets/official-logos/populares.png',note:'Líder general · Fuerza Intermedia · ascenso a Primera · 2022'},
  {name:'Barza',logo:'assets/official-logos/barza.png',note:'Campeón de Copa · Fuerza Intermedia · 2022'},
  {name:'PSV',logo:'assets/teams/psv.webp',note:'Campeón de Campeones · Veteranos · 2020–2021'},
  {name:'Osasuna',logo:'assets/official-logos/osasuna.png',note:'Intermedia · archivo histórico'},
  {name:'San Antonio Jr.',logo:'assets/official-logos/san-antonio-jrs.png',note:'Intermedia · líder del corte J20 de 2015'},
  {name:'Napoli',logo:'assets/official-logos/napoli.png',note:'Primera Fuerza · archivo histórico'},
  {name:'Manchester',logo:'assets/official-logos/manchester.png',note:'Equipo conservado en el archivo antiguo'}
];

const retroNames=['Universidad','Valencia','Halcones','Chelse','Olímpicos de Pozos','Romerillo'];

const verifiedChampions=[
  {season:'14 jun 2014',competition:'Torneo de Copa · Veteranos',champion:'La Esperanza',runner:'—',source:'La Esperanza fue campeón de Copa de Veteranos 2014. Registro histórico del 14 de junio de 2014; fotografía del equipo campeón con el trofeo.',photo:'./assets/history/archive-v120/la-esperanza-campeon-copa-veteranos-2014.jpg?v=20260923-esperanza-copa2014-v267',championLogo:HIST_ROOT+'assets/official-logos/la-esperanza.png'},
  // V206 — Juventus campeón de Copa · final 1 de febrero de 2025.
  {season:'01 feb 2025',competition:'Torneo de Copa · categoría por confirmar',champion:'Juventus',runner:'—',source:'Dato e imagen aportados por el usuario: Juventus campeón de Copa en la final del 1 de febrero de 2025. La categoría exacta queda pendiente porque no aparece visible en la fotografía.',photo:HIST_MEDIA+'archive-v197/juventus-campeon-copa-01-feb-2025.jpg',championLogo:HIST_ROOT+'assets/official-logos/juventus.png'},
  // V132 — palmarés 2025–2026 confirmado por el usuario y sus fotografías.
  {season:'07 jun 2026',competition:'Torneo de Liga · Segunda Fuerza',champion:'La Canchita Deportes',runner:'Aldama FC',source:'Dato e imagen aportados por el usuario: La Canchita Deportes campeón y Aldama FC subcampeón.',photo:HIST_MEDIA+'archive-v132/canchita-deportes-campeon-segunda-2026.jpg'},
  {season:'24 may 2026',competition:'Campeón de Campeones · categoría por precisar',champion:'Franco FC',runner:'Lobos CDG',source:'Dato e imagen aportados por el usuario: Franco FC ganó el Campeón de Campeones ante Lobos CDG.',photo:HIST_MEDIA+'archive-v132/franco-fc-campeon-de-campeones-2026.jpg'},
  {season:'23 may 2026',competition:'Final · categoría por precisar',champion:'La Esperanza',runner:'—',source:'Dato e imagen aportados por el usuario: La Esperanza ganó la final del 23 de mayo de 2026.',photo:HIST_MEDIA+'archive-v132/la-esperanza-campeon-23-mayo-2026.jpg'},
  {season:'10 may 2026',competition:'Torneo de Liga · Fuerza Intermedia',champion:'Franco FC',runner:'La Esperanza',source:'Dato e imágenes aportados por el usuario: Franco FC campeón; La Esperanza subcampeón.',photo:HIST_MEDIA+'archive-v132/franco-fc-campeon-intermedia-2026.jpg?v=20260923-franco-blue-v211'},
  {season:'15 mar 2026',competition:'Torneo de Liga · Primera Fuerza',champion:'Linces',runner:'Galácticos',source:'Dato e imágenes aportados por el usuario: Linces campeón; Galácticos subcampeón.',photo:HIST_MEDIA+'archive-v132/linces-campeon-primera-2026.jpg'},
  {season:'20 dic 2025',competition:'Torneo de Copa · categoría por precisar',champion:'Salvajes',runner:'Juventus',source:'Dato e imagen aportados por el usuario: Salvajes ganó la final de Copa frente a Juventus.',photo:HIST_MEDIA+'archive-v132/salvajes-campeon-copa-2025.jpg'},
  {season:'08 nov 2025',competition:'Torneo de Copa · Veteranos 50 y más',champion:'La Esperanza',runner:'—',source:'Felicitamos al equipo Dep. La Esperanza, de la fuerza de Veteranos 50 y más, por haberse coronado campeón de Copa 2025. Fotografía exacta aportada por el usuario.',photo:ESPERANZA_2025_PHOTO,championLogo:HIST_ROOT+'assets/official-logos/la-esperanza.png'},
  {season:'20 sep 2025',competition:'Torneo de Liga · Veteranos 35 y más',champion:'Juventus',runner:'Salvajes',source:'Dato e imagen aportados por el usuario: Juventus campeón; Salvajes subcampeón.',photo:HIST_MEDIA+'archive-v132/juventus-campeon-liga-veteranos-35-2025.jpg'},
  {season:'29 jun 2025',competition:'Torneo de Liga · Segunda Fuerza',champion:'La Huerta de Cuenda',runner:'Tavera FC',source:'Dato aportado por el usuario: La Huerta de Cuenda campeón y Tavera FC subcampeón.',photo:HIST_MEDIA+'archive-v119/la-huerta-finalista-2025.jpg'},
  // V210 — Manchester · Campeón de Campeones · Veteranos 50+ · 26 abr 2025
  {season:'26 abr 2025',competition:'Campeón de Campeones · Veteranos 50 y más',champion:'Manchester',runner:'Boavista FC',source:'La Liga Municipal de Fútbol Juventino Rosas A. C. felicitó al equipo Manchester por obtener la presea de Campeón de Campeones tras vencer a Boavista F. C. el 26 de abril de 2025. Fotografía exacta aportada por el usuario.',photo:'./assets/history/archive-v225/manchester-campeon-campeones-26-abr-2025.webp?v=20260923-manchester-real-v237',championLogo:HIST_ROOT+'assets/official-logos/manchester.png',runnerLogo:HIST_ROOT+'assets/official-logos/boavista.png'},
  {season:'19 ene 2020',competition:'Torneo de Copa · Fuerza Intermedia',champion:'El Alto',runner:'—',source:'Golazo Liga publicó el 19 de enero de 2020: “El Alto, campeón de copa, fuerza intermedia.”',photo:HIST_MEDIA+'archive-v134/el-alto-campeon-copa-intermedia-2020.jpg'},
  {season:'17 nov 2019',competition:'Torneo de Copa 2019 · Veteranos',champion:'PSV',runner:'—',source:'Publicación histórica aportada por el usuario: PSV fue campeón de Copa 2019 en Veteranos.',championLogo:HIST_ROOT+'assets/teams/psv.webp'},
  {season:'16 sep 2019',competition:'Torneo de Liga 2018–2019',champion:'La Pandilla de Morales',runner:'—',source:'Publicación histórica aportada por el usuario que felicita a La Pandilla y Linces Junior como campeones de Liga 2018–2019. La categoría específica de esta felicitación no se fuerza aquí.'},
  {season:'16 sep 2019',competition:'Torneo de Liga 2018–2019',champion:'Linces Jr.',runner:'—',source:'Publicación histórica aportada por el usuario que felicita a La Pandilla y Linces Junior como campeones de Liga 2018–2019. La categoría específica de esta felicitación no se fuerza aquí.',championLogo:HIST_ROOT+'assets/official-logos/linces.png'},
  {season:'22 jun 2019',competition:'Campeón de Campeones · Veteranos',champion:'La Esperanza',runner:'—',source:'Publicación histórica aportada por el usuario: La Esperanza fue campeón de Campeones de Veteranos.',championLogo:HIST_ROOT+'assets/official-logos/la-esperanza.png'},
  {season:'09 jun 2018',competition:'Campeonato · categoría/torneo no especificados',champion:'Magisterio',runner:'—',source:'Publicación histórica aportada por el usuario: “Felicidades al campeón. ¡¡Felicidades!! Magisterio.”',photo:'./assets/history/archive-v266/magisterio-campeon-09-jun-2018.jpg?v=20260923-magisterio-hardfix-v266'},
  {season:'28 feb 2016',competition:'Campeón de Campeones · Fuerza Intermedia',champion:'Malvinas',runner:'—',source:'Publicación histórica aportada por el usuario. El subcampeón no está identificado.',championLogo:HIST_ROOT+'assets/official-logos/malvinas.png'},
  {season:'28 feb 2016',competition:'Categoría Veteranos',champion:'La Esperanza',runner:'—',source:'Publicación histórica aportada por el usuario: entrega del premio en efectivo al campeón de Veteranos.',championLogo:HIST_ROOT+'assets/official-logos/la-esperanza.png'},
  {season:'02 oct 2021',competition:'Campeón de Campeones · Veteranos · 2020–2021',champion:'PSV',runner:'—',source:'Golazo Liga publicó el 2 de octubre de 2021 a PSV como Campeón de Campeones de la temporada 2020–2021 en Veteranos.',photo:HIST_MEDIA+'archive-v134/psv-campeon-campeones-veteranos-2020-2021.jpg',championLogo:HIST_ROOT+'assets/teams/psv.webp'},
  {season:'25 sep 2021',competition:'Torneo de Liga · Veteranos · 2020–2021',champion:'La Esperanza',runner:'Real Cuenda',source:'Golazo Liga publicó el 25 de septiembre de 2021 que La Esperanza ganó el título de Liga 2020–2021 ante Real Cuenda en una final decidida por tiros penales.',photo:'./assets/history/archive-v256/la-esperanza-campeon-liga-veteranos-25-sep-2021.webp?v=20260923-esperanza-2021-user-v260',championLogo:HIST_ROOT+'assets/official-logos/la-esperanza.png'},
  {season:'16 feb 2020',competition:'Torneo de Copa 2019–2020 · Primera Fuerza',champion:'Juventus',runner:'—',source:'Golazo Liga publicó el 16 de febrero de 2020 a Juventus como campeón de Copa 2019–2020 de Primera Fuerza.',photo:HIST_MEDIA+'archive-v134/juventus-campeon-copa-primera-2019-2020.jpg',championLogo:HIST_ROOT+'assets/official-logos/juventus.png'},
  {season:'16 feb 2020',competition:'Torneo de Copa 2019–2020 · Segunda Fuerza',champion:'Tavera',runner:'—',source:'Golazo Liga publicó el 16 de febrero de 2020 a Tavera como campeón de Copa 2019–2020 de Segunda Fuerza.',photo:HIST_MEDIA+'archive-v134/tavera-campeon-copa-segunda-2019-2020.jpg',championLogo:HIST_ROOT+'assets/official-logos/tavera-fc.png'},
  {season:'20 mar 2022',competition:'Torneo de Liga · Segunda Fuerza',champion:'Galácticos FC',runner:'—',source:'Texto histórico aportado por el usuario desde Golazo Liga: “Galácticos FC campeón de liga, en segunda fuerza. Con esto logra su ascenso a la fuerza intermedia.”',championLogo:HIST_ROOT+'assets/teams/galacticos-pozos.webp'},
  {season:'22 feb 2014',competition:'Torneo de Copa · Segunda Fuerza',champion:'DHP',runner:'—',source:'Golazo Liga publicó el 22 de febrero de 2014 el trofeo destinado al equipo DHP, campeón del Torneo de Copa 2014 de Segunda Fuerza.',photo:'./assets/history/archive-v260/dhp-campeon-copa-segunda-22-feb-2014.webp?v=20260923-dhp-confirmed-v266'},
  {season:'08 oct 2023',competition:'Torneo Relámpago · Categoría Libre',champion:'Hermanos',runner:'—',source:'Felicidades al equipo “HERMANOS”, campeón del Torneo Relámpago en la categoría Libre. Dato y fotografía aportados por el usuario. Fecha: 8 de octubre de 2023.',photo:HIST_MEDIA+'archive-v247/hermanos-campeon-relampago-libre-08-oct-2023.jpg?v=20260923-hermanos-v247',championLogo:HIST_ROOT+'assets/official-logos/hermanos.png'},
  {season:'23 jul 2023',competition:'Campeón de Campeones · Fuerza Intermedia · 2022–2023',champion:'Barza',runner:'—',source:'Golazo Liga, publicación del 23 de julio de 2023: Barza fue felicitado por obtener el título de Campeón de Campeones de la categoría Intermedia 2022–2023.',photo:HIST_MEDIA+'archive-v133/barza-campeon-campeones-intermedia-2022-2023.jpg',championLogo:HIST_ROOT+'assets/official-logos/barza.png'},
  {season:'02 oct 2022',competition:'Torneo de Copa 2022 · Primera Fuerza',champion:'Juventus',runner:'PSV',source:'Golazo Liga publicó el 2 de octubre de 2022 a Juventus como campeón de Copa 2022 de Primera Fuerza. El cartel de la final del mismo día muestra Juventus vs PSV.',photo:HIST_MEDIA+'archive-v133/juventus-campeon-copa-primera-2022.jpg',championLogo:HIST_ROOT+'assets/official-logos/juventus.png'},
  {season:'25 sep 2022',competition:'Torneo de Copa · Fuerza Intermedia',champion:'Barza',runner:'—',source:'Golazo Liga, publicación del 25 de septiembre de 2022: “Barza, campeón de Copa fuerza intermedia. Felicidades!!!”.',photo:HIST_MEDIA+'archive-v133/barza-campeon-copa-intermedia-2022.jpg',championLogo:HIST_ROOT+'assets/official-logos/barza.png'},
  {season:'15 dic 2013',competition:'Segunda Fuerza',champion:'Real Cerrito de Gasca',runner:'DHP',source:'Golazo Liga publicó al capitán “Nudo” recibiendo el trofeo de campeón de Segunda Fuerza. Otra publicación de la misma final registró a Real Cerrito arriba 3–0 sobre DHP al minuto 35; no se usa ese marcador parcial como resultado final.',championLogo:HIST_ROOT+'assets/teams/deportivo-cg.webp'},
  {season:'22 feb 2014',competition:'Torneo de Copa · Fuerza Intermedia',champion:'Puros Cuates',runner:'—',source:'Publicación de Golazo Liga: “Trofeo para el equipo Puros Cuates Campeón del Torneo De Copa 2014 en la Categoría Fuerza Intermedia”.',photo:'./assets/history/archive-v260/puros-cuates-campeon-copa-intermedia-22-feb-2014.webp?v=20260923-puros-cuates-2014-live-v280'},
  {season:'11 ene 2015',competition:'Primera Fuerza',champion:'Boavista',runner:'—',source:'Dato e imagen aportados por el usuario: Boavista fue campeón de Primera Fuerza el 11 de enero de 2015. La fotografía muestra al plantel campeón con el trofeo.',photo:'./assets/history/archive-v251/boavista-campeon-primera-11-ene-2015.jpg?v=20260923-boavista-2015-v252',championLogo:HIST_ROOT+'assets/official-logos/boavista.png'},
  {season:'11 ene 2015',competition:'Campeonato · Intermedia',champion:'Puros Cuates',runner:'—',source:'Publicación de Golazo Liga del 11 de enero de 2015: “Puros cuates... campeón de intermedia”.',photo:'./assets/history/archive-v258/puros-cuates-campeon-intermedia-11-ene-2015.webp?v=20260923-puros-cuates-2015-bg-v258'},
  {season:'18 ene 2015',competition:'Campeón de Campeones · Primera',champion:'Boavista',runner:'—',source:'Boavista, Campeón de Campeones de Primera. Fotografía exacta aportada por el usuario del plantel con el trofeo.',photo:'./assets/history/archive-v272/boavista-campeon-campeones-18-ene-2015.jpg?v=20260923-boavista-cdc-v272',championLogo:HIST_ROOT+'assets/official-logos/boavista.png'},
  {season:'14 abr 2015',competition:'Campeón de Copa',champion:'Los campeones de copa',runner:'—',source:'Publicación de Facebook aportada por el usuario, fechada el 14 de abril de 2015, con el texto “Los campeones de copa”. La categoría y el nombre del equipo no aparecen especificados en el texto visible.',photo:'./assets/history/archive-v279/campeones-copa-14-abr-2015.jpg?v=20260923-campeones-copa-14abr2015-v279'},
  {season:'09 jul 2016',competition:'Torneo de Copa · categoría no visible en la publicación',champion:'Magisterio',runner:'—',source:'Publicación de Golazo Liga del 9 de julio de 2016: “Felicidades al campeón de copa. Felicidades Magisterio”.'},
  {season:'2018–2019',competition:'Torneo de Liga · Primera Fuerza',champion:'Juventus',runner:'Boavista',third:'Abejas',source:'Publicaciones históricas aportadas por el usuario del 3 nov 2019: Juventus campeón de Liga 2018–2019, Boavista subcampeón y Abejas tercer lugar de Primera Fuerza.',photo:HIST_MEDIA+'juventus-campeon-2019.jpg',championLogo:HIST_ROOT+'assets/official-logos/juventus.png',runnerLogo:HIST_ROOT+'assets/official-logos/boavista.png'},
    {season:'11 dic 2012',competition:'Torneo de Copa · Categoría Segunda',champion:'Tavera FC',runner:'—',source:'Golazo Liga publicó el 11 de diciembre de 2012 una felicitación explícita al equipo Tavera como campeón de Copa de la Categoría Segunda.',championLogo:HIST_ROOT+'assets/official-logos/tavera-fc.png'},
  {season:'12 abr 2025',competition:'Torneo de Liga · Veteranos 50+',champion:'Boavista FC',runner:'Boca Jrs.',source:'El rol publicado el 9 abr 2025 programa Boca Jrs. vs Boavista a las 16:00 en Campo 1; la publicación del 12 abr presenta a Boavista F C como “CAMPEÓN 2025”.',championLogo:HIST_ROOT+'assets/official-logos/boavista.png'},
  {season:'04 mar 2024',competition:'Torneo de Copa · Primera Fuerza',champion:'Linces',runner:'Hermanos FC',source:'La Pupila publicó el 4 mar 2024 que Linces venció 3–2 a Hermanos FC y se llevó la final de Copa. El 11 abr 2024, Juventino Rosas Liga volvió a identificar a Linces como actual campeón de Copa y equipo de Primera Fuerza.',photo:HIST_MEDIA+'archive-v202/linces-campeon-copa-04-mar-2024.webp',championLogo:HIST_ROOT+'assets/official-logos/linces.png',runnerLogo:HIST_ROOT+'assets/official-logos/hermanos.png'},
  {season:'04 may 2024',competition:'Torneo de Liga · Veteranos 50+',champion:'Boca Jrs.',runner:'Manchester',source:'Juventino Rosas Liga publicó el 6 may 2024 que Boca Jrs., de Cuenda, fue campeón del Torneo de Liga 2024 de Veteranos 50 y más tras imponerse a Manchester el sábado 4 may 2024.',photo:HIST_MEDIA+'archive-v202/boca-jrs-campeon-liga-v50-04-may-2024.webp',runnerLogo:HIST_ROOT+'assets/official-logos/manchester.png'},
  {season:'09 nov 2024',competition:'Torneo de Copa · Veteranos 50 y más',champion:'Manchester',runner:'—',source:'Dato e imagen aportados por el usuario: Manchester fue campeón del Torneo de Copa de Veteranos 50 y más el 9 de noviembre de 2024.',championLogo:HIST_ROOT+'assets/official-logos/manchester.png'},
  {season:'16 feb 2025',competition:'Torneo Relámpago · Segunda Fuerza',champion:'Lobos Jrs.',runner:'—',source:'Dato e imagen aportados por el usuario: Lobos Jrs. fue campeón del Torneo Relámpago de Segunda Fuerza.',photo:HIST_MEDIA+'archive-v207/lobos-jrs-campeon-relampago-segunda-16-feb-2025.webp'},
  {season:'09 feb 2025',competition:'Campeón de Campeones · Primera Fuerza',champion:'Galácticos de Pozos',runner:'Linces',source:'La Liga Municipal de Fútbol “JUVENTINO ROSAS” A.C. felicitó a Galácticos de Pozos por obtener el cetro de Campeón de Campeones al imponerse a Linces el 9 de febrero de 2025.',photo:HIST_MEDIA+'archive-v203/galacticos-campeon-campeones-09-feb-2025.jpg?v=20260923-galacticos-cdc-v213',championLogo:HIST_ROOT+'assets/teams/galacticos-pozos.webp'},
  {season:'09 feb 2025',competition:'Torneo Relámpago · Fuerza Intermedia',champion:'Herreras FC',runner:'Oklahoma',source:'La Liga Municipal de Fútbol “JUVENTINO ROSAS” A.C. felicitó a Herreras F.C. por obtener el campeonato del Torneo Relámpago de Fuerza Intermedia ante Oklahoma el 9 de febrero de 2025. Dato y fotografía aportados por el usuario.',photo:HIST_MEDIA+'archive-v208/herreras-fc-campeon-relampago-intermedia-09-feb-2025.webp',championLogo:HIST_ROOT+'assets/official-logos/herreras-fc.png',runnerLogo:HIST_ROOT+'assets/teams/oklahoma-city-fc.webp'},
  {season:'08 jun 2025',competition:'Torneo de Copa · Primera Fuerza',champion:'Galácticos (Pozos)',runner:'Herreras FC (Cuenda)',source:'La final fue Galácticos vs Herreras FC, domingo 8 de junio de 2025 a las 10:00 en Campo 1 de la Unidad Deportiva Sur. La Liga Municipal de Fútbol “Juventino Rosas” A.C. felicitó a Galácticos de Pozos por obtener el título de Campeón de Copa 2025 en Primera Fuerza tras un reñido encuentro con Herreras F.C.',photo:HIST_MEDIA+'archive-v204/galacticos-pozos-campeon-copa-2025-entrega.webp',championLogo:HIST_ROOT+'assets/teams/galacticos-pozos.webp',runnerLogo:HIST_ROOT+'assets/official-logos/herreras-fc.png'},
  {season:'15 jun 2025',competition:'Torneo de Copa · Fuerza Intermedia',champion:'Lobos CDG',runner:'Franco FC',source:'La Liga felicitó a Lobos CDG, de Cerrito de Gasca, por el título de Campeón de Copa 2025 tras vencer a Franco F.C., de San José de Manantiales. Los roles previos sitúan a ambos en las semifinales de Intermedia.',photo:HIST_MEDIA+'archive-v207/lobos-cdg-campeon-copa-intermedia-15-jun-2025.webp'}
];

const historicalPhotoArchive=[
  {date:'04 mar 2024',title:'Linces · campeón de Copa · Primera Fuerza',detail:'La Pupila documentó la victoria 3–2 sobre Hermanos FC en la final de Copa. Fotografía: Roberto Valenzuela.',image:HIST_MEDIA+'archive-v202/linces-campeon-copa-04-mar-2024.webp'},
  {date:'04 may 2024',title:'Boca Jrs. · campeón de Liga · Veteranos 50+',detail:'Juventino Rosas Liga documentó a Boca Jrs. de Cuenda como campeón tras imponerse a Manchester.',image:HIST_MEDIA+'archive-v202/boca-jrs-campeon-liga-v50-04-may-2024.webp'},
  {date:'09 feb 2025',title:'Herreras FC · campeón del Torneo Relámpago · Fuerza Intermedia',detail:'Campeón ante Oklahoma el 9 de febrero de 2025. Fotografía y texto de felicitación aportados por el usuario.',image:HIST_MEDIA+'archive-v208/herreras-fc-campeon-relampago-intermedia-09-feb-2025.webp'},
  {date:'16 feb 2025',title:'Lobos Jrs. · campeón del Torneo Relámpago · Segunda Fuerza',detail:'Fotografía exacta aportada por el usuario.',image:HIST_MEDIA+'archive-v207/lobos-jrs-campeon-relampago-segunda-16-feb-2025.webp'},
  {date:'15 jun 2025',title:'Lobos CDG · Cerrito de Gasca · campeón de Copa · Fuerza Intermedia',detail:'Fotografía exacta aportada por el usuario para documentar la final del 15 de junio de 2025.',image:HIST_MEDIA+'archive-v207/lobos-cdg-campeon-copa-intermedia-15-jun-2025.webp'},
  {date:'02 oct 2021',title:'PSV · Campeón de Campeones de Veteranos · 2020–2021',detail:'Publicación exacta de Golazo Liga aportada por el usuario.',image:HIST_MEDIA+'archive-v134/psv-campeon-campeones-veteranos-2020-2021.jpg'},
  {date:'25 sep 2021',title:'La Esperanza · campeón de Liga de Veteranos 2020–2021',detail:'Publicación exacta de Golazo Liga: La Esperanza venció a Real Cuenda por penales.',image:'./assets/history/archive-v256/la-esperanza-campeon-liga-veteranos-25-sep-2021.webp?v=20260923-esperanza-2021-user-v260'},
  {date:'16 feb 2020',title:'Juventus · campeón de Copa · Primera Fuerza 2019–2020',detail:'Fotografía exacta del plantel campeón aportada por el usuario.',image:HIST_MEDIA+'archive-v134/juventus-campeon-copa-primera-2019-2020.jpg'},
  {date:'16 feb 2020',title:'Tavera · campeón de Copa · Segunda Fuerza 2019–2020',detail:'Fotografía exacta del plantel campeón aportada por el usuario.',image:HIST_MEDIA+'archive-v134/tavera-campeon-copa-segunda-2019-2020.jpg'},
  {date:'19 ene 2020',title:'El Alto · campeón de Copa · Fuerza Intermedia',detail:'Publicación exacta de Golazo Liga aportada por el usuario.',image:HIST_MEDIA+'archive-v134/el-alto-campeon-copa-intermedia-2020.jpg'},
  {date:'23 jul 2023',title:'Barza · Campeón de Campeones 2022–2023',detail:'Fotografía exacta aportada por el usuario de la publicación de Golazo Liga que identifica a Barza como Campeón de Campeones de Fuerza Intermedia.',image:HIST_MEDIA+'archive-v133/barza-campeon-campeones-intermedia-2022-2023.jpg'},
  {date:'02 oct 2022',title:'Juventus · campeón de Copa 2022 · Primera Fuerza',detail:'Fotografía exacta del plantel de Juventus con el trofeo, asociada a la publicación de Golazo Liga del 2 de octubre de 2022.',image:HIST_MEDIA+'archive-v133/juventus-campeon-copa-primera-2022.jpg'},
  {date:'25 sep 2022',title:'Barza · campeón de Copa · Fuerza Intermedia',detail:'Fotografía exacta del plantel de Barza con el trofeo, asociada a la publicación de Golazo Liga del 25 de septiembre de 2022.',image:HIST_MEDIA+'archive-v133/barza-campeon-copa-intermedia-2022.jpg'},
  {date:'07 jun 2026',title:'La Canchita Deportes · campeón de Segunda Fuerza',detail:'Foto exacta aportada por el usuario de la premiación del campeón.',image:HIST_MEDIA+'archive-v132/canchita-deportes-campeon-segunda-2026.jpg'},
  {date:'24 may 2026',title:'Franco FC · Campeón de Campeones',detail:'Foto exacta aportada por el usuario.',image:HIST_MEDIA+'archive-v132/franco-fc-campeon-de-campeones-2026.jpg'},
  {date:'23 may 2026',title:'La Esperanza · campeón',detail:'Foto exacta aportada por el usuario de la premiación.',image:HIST_MEDIA+'archive-v132/la-esperanza-campeon-23-mayo-2026.jpg'},
  {date:'10 may 2026',title:'Franco FC · campeón de Intermedia',detail:'Foto exacta del campeón aportada por el usuario.',image:HIST_MEDIA+'archive-v132/franco-fc-campeon-intermedia-2026.jpg'},
  {date:'10 may 2026',title:'La Esperanza · subcampeón de Intermedia',detail:'Foto exacta del subcampeón aportada por el usuario.',image:HIST_MEDIA+'archive-v132/la-esperanza-subcampeon-intermedia-2026.jpg'},
  {date:'15 mar 2026',title:'Linces · campeón de Primera Fuerza',detail:'Foto exacta del campeón aportada por el usuario.',image:HIST_MEDIA+'archive-v132/linces-campeon-primera-2026.jpg'},
  {date:'15 mar 2026',title:'Galácticos · subcampeón de Primera Fuerza',detail:'Foto exacta del subcampeón aportada por el usuario.',image:HIST_MEDIA+'archive-v132/galacticos-subcampeon-primera-2026.jpg'},
  {date:'20 dic 2025',title:'Salvajes · campeón de Copa',detail:'Foto exacta del campeón aportada por el usuario.',image:HIST_MEDIA+'archive-v132/salvajes-campeon-copa-2025.jpg'},
  {date:'20 sep 2025',title:'Juventus · campeón de Liga de Veteranos 35+',detail:'Foto exacta aportada por el usuario.',image:HIST_MEDIA+'archive-v132/juventus-campeon-liga-veteranos-35-2025.jpg'},
  {date:'jun 2025',title:'La Huerta de Cuenda · Final Segunda Fuerza',detail:'Fotografía recuperada del archivo de la final de Segunda Fuerza 2025.',image:HIST_MEDIA+'archive-v119/la-huerta-finalista-2025.jpg'},
  {date:'jun 2025',title:'Tavera FC · Final Segunda Fuerza',detail:'Fotografía recuperada del archivo de la final de Segunda Fuerza 2025.',image:HIST_MEDIA+'archive-v119/tavera-finalista-2025.jpg'},
  {date:'15 jun 2025',title:'Lobos CDG · Campeón de Copa 2025',detail:'Fotografía del plantel asociada al título de Copa de Fuerza Intermedia 2025.',image:HIST_MEDIA+'archive-v119/lobos-cdg-campeon-copa-2025.jpg'},
  {date:'28 nov 2012',title:'Boavista · XXV aniversario',detail:'Fotografía del álbum histórico de Boavista recuperada del archivo de 2012.',image:HIST_MEDIA+'archive-v119/boavista-xxv-2012.jpg'},

  {date:'22 feb 2014',title:'Puros Cuates · trofeo de campeón',detail:'Fotografía recuperada de la publicación de Golazo Liga que identifica a Puros Cuates como Campeón del Torneo de Copa 2014 de Fuerza Intermedia.',image:HIST_PHOTOS.purosCuatesTrophy2014||''},
  {date:'2018–2019',title:'Juventus · campeón de Liga',detail:'Fotografía histórica conservada en el proyecto junto con el registro de Juventus campeón y Boavista subcampeón.',image:HIST_MEDIA+'juventus-campeon-2019.jpg'},
  {date:'Archivo histórico',title:'Tecos · plantel campeón',detail:'Fotografía del archivo histórico en la que el plantel aparece identificado como campeón.',image:HIST_MEDIA+'tecos-campeon-historico.jpg'},
  {date:'Archivo histórico',title:'Premiación y trofeos',detail:'Fotografía de premiación conservada en el archivo. Se muestra como memoria visual sin asignar identidades que no estén confirmadas.',image:HIST_MEDIA+'premiacion-historica.jpg'},
  {date:'17 nov 2024',title:'Promesas de Pozos · campeón de Liga · Segunda Fuerza',detail:'Dato e imágenes aportados por el usuario: Promesas de Pozos fue campeón del Torneo de Liga de Segunda Fuerza el 17 de noviembre de 2024. La fotografía histórica ya conservada en el archivo queda ahora asociada a este campeonato.',image:HIST_MEDIA+'archive-v117/promesas-campeon-2024.webp'}
];

// V106 — archivo histórico ampliado desde los videos y el ZIP entregados por el usuario.
const videoArchiveFindings=[
  {date:'23 nov 2013',title:'Romerillo · tercer lugar en Fuerza Intermedia',detail:'Publicación de Golazo Liga: el portero del equipo Romerillo de Fuerza Intermedia fue clave para que su equipo obtuviera el tercer lugar; la nota destaca una atajada de penal en la serie final. La captura no permite identificar por nombre al guardameta.'},
  {date:'nov 2012',title:'Equipos con publicación fotográfica localizada',detail:'En el archivo de Golazo Liga aparecen publicaciones o fotografías directas de PSV, Real Cerrito, Unión Allende, Chelse, Hermanos, Aldama, Osasuna, Manchester, Halcones, San Antonio Jr. y Boavista. Se registran como equipos documentados en publicaciones de 2012; no se presenta esta lista como tabla final de inscritos.'},
  {date:'28 nov 2012 · publicación sobre oct 1987',title:'Boavista · origen documentado del club',detail:'En una publicación por su XXV aniversario, Golazo Liga relata que estudiantes de la Preparatoria “Juventino Rosas” organizaron Boavista en octubre de 1987 para registrarlo en la Primera Fuerza de la Liga Municipal. El mismo texto recuerda como equipos fuertes de comunidades a Cuenda, Aguilares, San Julián, Merino, Santa María de Guadalupe y Pozos. Es historia del club, no fecha de fundación de la Liga.',image:HIST_ROOT+'assets/official-logos/boavista.png'},
  {date:'15 dic 2013',title:'Podio de Segunda Fuerza',detail:'Real Cerrito de Gasca fue campeón. DHP recibió el trofeo de segundo lugar. San José de la Montaña recibió el tercer lugar después de ganar por default a Tavera en el partido por el tercer puesto.'},
  {date:'11 dic 2012',title:'Tavera · campeón de Copa de Segunda',detail:'Golazo Liga felicitó de forma explícita al equipo Tavera como campeón de Copa de la Categoría Segunda.'},
  {date:'23 feb 2013',title:'Magisterio vs Boavista · penales',detail:'El partido terminó 0–0 en tiempo reglamentario y Magisterio ganó 4–2 la tanda de penales.'},
  {date:'09 mar 2013',title:'Final de Veteranos · Universidad vs Dinamo',detail:'Final programada en la Unidad Deportiva Sur a las 16:00. El material recuperado no muestra el resultado.'},
  {date:'15 dic 2013',title:'Real Cerrito de Gasca · campeón de Segunda Fuerza',detail:'Golazo Liga documentó la entrega del trofeo de campeón al capitán de Real Cerrito de Gasca; DHP fue el rival de la final.'},
  {date:'22 feb 2014',title:'Puros Cuates · campeón de Copa',detail:'Golazo Liga identifica a Puros Cuates como campeón del Torneo de Copa 2014 en Fuerza Intermedia.'},
  {date:'11 ene 2015',title:'Puros Cuates · campeón de Intermedia',detail:'La publicación histórica identifica a Puros Cuates como campeón de Intermedia. Ese mismo día José Guadalupe Moreno recibió el trofeo de campeón goleador de Primera Fuerza.'},
  {date:'18 ene 2015',title:'Boavista · Campeón de Campeones',detail:'Boavista fue Campeón de Campeones de Primera. Fotografía exacta aportada por el usuario del plantel con el trofeo.',image:'https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/assets/history/archive-v251/boavista-campeon-primera-11-ene-2015.jpg?v=20260923-boavista-hardfix-v257'},
  {date:'25 nov 2015',title:'Veteranos · corte de Liga J13',detail:'La Esperanza aparece primero con 35 puntos, 11 ganados, 2 empatados, 0 perdidos, 38 GF y 13 GC. Es un corte de jornada, no un título final.',image:HIST_ROOT+'assets/official-logos/la-esperanza.png'},
  {date:'03 dic 2015',title:'Intermedia · corte de Liga J20',detail:'San Antonio Jr. y Malvinas aparecen empatados en 43 puntos; Tavera suma 41 y La Cuadrilla 40. Es un corte histórico, no la tabla final.'},
  {date:'21 feb 2016',title:'Final y premiación de Intermedia',detail:'El archivo conserva la premiación del campeón y del subcampeón de Intermedia. En comentarios de la publicación se identifica al campeón como Malvinas; por eso el nombre se conserva con esa salvedad.',image:HIST_ROOT+'assets/official-logos/malvinas.png'},
  {date:'28 feb 2016',title:'Campeón de Campeones · Intermedia',detail:'Publicación de Golazo Liga con entrega del trofeo de Campeón de Campeones de Intermedia; el nombre del equipo no es legible en el texto visible.'},
  {date:'27 mar 2016',title:'Campeón de Campeones · Segunda Fuerza',detail:'Publicación de Golazo Liga de la premiación. El nombre del campeón no aparece legible en el texto visible.'},
  {date:'09 jul 2016',title:'Magisterio · campeón de Copa',detail:'La publicación felicita de manera explícita a Magisterio como campeón de Copa.'},
  {date:'06 oct 2016',title:'Veteranos · goleo J5',detail:'Francisco Hortelano Laguna y Juan Carlos Barrientos, ambos de Cuenda, encabezan el corte con 5 goles cada uno. Es un corte de jornada.'},
  {date:'21 feb 2017',title:'Daniel Gómez Delgado · campeón goleador',detail:'Golazo Liga da por campeón de goleo de Fuerza Intermedia a Daniel Gómez Delgado, de A. Centeno, con 34 goles.'},
  {date:'15 abr 2017',title:'Eusebio Rangel · campeón goleador de Veteranos',detail:'La publicación solicita a Eusebio Rangel, del equipo Hermanos, presentarse a la final para recibir el trofeo de campeón de goleo.'},
  {date:'15 abr 2017',title:'Primera Fuerza · goleo J28',detail:'Juan Manuel Gámez López (Hermanos) encabeza el corte con 34 goles; Fernando Gámez Reyes (Abejas), Jorge Alberto Sánchez Mendoza (Juventus) y Noé Alfredo Silva Martínez (La Cuadrilla) aparecen con 29.'},
  {date:'06 may 2017',title:'Primera · corte de Liga J30',detail:'Linces aparece líder con 79 puntos. Hermanos registra 111 goles a favor; Linces, 107 y diferencia de +75. Son marcas del corte publicado, no récords absolutos de toda la historia.',image:HIST_ROOT+'assets/official-logos/linces.png'},
      {date:'2020–2021',title:'PSV · Campeón de Campeones de Veteranos',detail:'El dato aportado por el usuario identifica a PSV como Campeón de Campeones de la temporada 2020–2021 en la categoría Veteranos.',image:HIST_ROOT+'assets/teams/psv.webp'},
  {date:'2020–2021',title:'La Esperanza · campeón de Liga de Veteranos',detail:'La Esperanza obtuvo el título de Liga 2020–2021 al derrotar a Real Cuenda en una final definida por tiros penales.',image:HIST_ROOT+'assets/official-logos/la-esperanza.png'},
  {date:'16 feb 2020',title:'Juventus · campeón de Copa de Primera Fuerza',detail:'Juventus fue identificado como campeón de Copa 2019–2020 de Primera Fuerza.',image:HIST_ROOT+'assets/official-logos/juventus.png'},
  {date:'16 feb 2020',title:'Tavera · campeón de Copa de Segunda Fuerza 2019–2020',detail:'Tavera fue identificado como campeón de Copa 2019–2020 de Segunda Fuerza.',image:HIST_ROOT+'assets/official-logos/tavera-fc.png'},
{date:'20 mar 2022',title:'Galácticos FC · campeón de Liga de Segunda Fuerza',detail:'El texto aportado desde Golazo Liga identifica a Galácticos FC como campeón de Liga de Segunda Fuerza y señala que con ello logró el ascenso a Fuerza Intermedia.',image:HIST_ROOT+'assets/teams/galacticos-pozos.webp'},
  {date:'2022 · fecha exacta pendiente',title:'La Esperanza FC · líder general y ascenso',detail:'El texto aportado identifica a La Esperanza FC como líder de la tabla general del Torneo de Liga de Segunda Fuerza y señala que con ello logró su ascenso a Fuerza Intermedia.',image:HIST_ROOT+'assets/official-logos/la-esperanza.png'},
  {date:'2022 · fecha exacta pendiente',title:'Populares · líder general y ascenso a Primera Fuerza',detail:'El texto aportado identifica a Populares como líder general del Torneo de Liga de Fuerza Intermedia y señala que con ello logró su ascenso a Primera Fuerza.',image:HIST_ROOT+'assets/official-logos/populares.png'},
  {date:'2022 · fecha exacta pendiente',title:'Descensos y ascensos · archivo 2022',detail:'Dato aportado por el usuario: Lobos y Malvinas descendieron. Populares fue uno de los equipos que ascendió; el otro equipo ascendido no está identificado en el texto aportado, por lo que queda pendiente.'},
  {date:'2022 · fecha exacta pendiente',title:'Angel E. Ortega · campeón de goleo de Segunda Fuerza',detail:'El texto histórico aportado identifica a Angel E. Ortega como campeón de goleo de Segunda Fuerza.'},
  {date:'2022 · fecha exacta pendiente',title:'Jesús Guadalupe Hortelano · campeón de goleo de Fuerza Intermedia',detail:'El texto histórico aportado identifica a Jesús Guadalupe Hortelano como campeón de goleo de Fuerza Intermedia.'},
  {date:'23 jul 2023',title:'Barza · Campeón de Campeones de Intermedia 2022–2023',detail:'Golazo Liga felicitó expresamente a Barza por la obtención del título de Campeón de Campeones de la categoría Intermedia 2022–2023.',image:HIST_MEDIA+'archive-v133/barza-campeon-campeones-intermedia-2022-2023.jpg'},
  {date:'02 oct 2022',title:'Juventus · campeón de Copa 2022 de Primera Fuerza',detail:'Golazo Liga publicó a Juventus como campeón de Copa 2022 de Primera Fuerza. El cartel de la final identifica a PSV como rival.',image:HIST_MEDIA+'archive-v133/juventus-campeon-copa-primera-2022.jpg'},
{date:'25 sep 2022',title:'Barza · campeón de Copa de Fuerza Intermedia',detail:'Publicación de Golazo Liga realizada por Xavier Lara Valencia: “Barza, campeón de Copa fuerza intermedia. Felicidades!!!”.',image:HIST_MEDIA+'archive-v133/barza-campeon-copa-intermedia-2022.jpg'},
  {date:'08 jun 2025 · memoria de 1950',title:'José Carmen Guerrero Velásquez · primer equipo de 1950',detail:'La Liga Municipal de Fútbol “Juventino Rosas” A.C. publicó un reconocimiento al Prof. José Carmen Guerrero Velásquez y lo describió como el único sobreviviente del primer equipo de fútbol formado en Juventino Rosas, GTO., en 1950. Esta publicación aporta un antecedente local anterior al partido de 1953 citado por una fuente secundaria.'},
  {date:'12 abr 2025',title:'Boavista FC · campeón de Veteranos 50+',detail:'El rol de la final de Liga 2025 muestra Boca Jrs. vs Boavista a las 16:00 en Campo 1. Una publicación del mismo 12 de abril presenta a Boavista F C como “CAMPEÓN 2025”.',image:HIST_ROOT+'assets/official-logos/boavista.png'},
  {date:'26 abr 2025',title:'Manchester · Campeón de Campeones · Veteranos 50+',detail:'Manchester fue Campeón de Campeones tras vencer a Boavista FC el 26 de abril de 2025. Fotografía exacta aportada por el usuario.',image:'./assets/history/archive-v225/manchester-campeon-campeones-26-abr-2025.webp?v=20260923-manchester-real-v237'},
  {date:'08 jun 2025',title:'Galácticos (Pozos) · campeón de Copa',detail:'Final de Primera Fuerza: Galácticos vs Herreras FC (Cuenda), 10:00, Campo 1, Unidad Deportiva Sur. La Liga felicitó a Galácticos de Pozos por el título de Campeón de Copa 2025 tras un reñido encuentro con Herreras F.C.',image:HIST_MEDIA+'archive-v204/galacticos-pozos-campeon-copa-2025-entrega.webp'},
  {date:'15 jun 2025',title:'Lobos CDG · campeón de Copa',detail:'La Liga felicita a Lobos CDG, de Cerrito de Gasca, por obtener el título de Campeón de Copa 2025 al vencer a Franco F.C., de San José de Manantiales.',image:HIST_ROOT+'assets/official-logos/lobos-cdg.png'},
  {date:'15 jun 2025',title:'Gabriel Roque Hortelano · trayectoria arbitral',detail:'La Liga publicó un reconocimiento por más de 25 años de servicio; el texto señala que obtuvo certificación como árbitro federado en 2002 por parte de la Federación Mexicana de Fútbol y que en su currículum llevaba más de 100 finales pitadas.'},
  {date:'15 jun 2025',title:'Juan Morales Vásquez “Chacharín” · servicio a los campos',detail:'La Liga publicó un reconocimiento por más de 50 años en activo y más de 35 años como encargado de pintar los campos de fútbol.'},
  {date:'20 dic 2025',title:'Salvajes · campeón de la Gran Final de Copa',detail:'Salvajes venció a Juventus en la final del Torneo de Copa. El usuario confirmó al campeón y aportó fotografía del plantel con el trofeo.',image:HIST_MEDIA+'archive-v132/salvajes-campeon-copa-2025.jpg'},
  {date:'08 mar 2026',title:'Cuartos de final · Primera Fuerza',detail:'Unidad Deportiva Sur: Hermanos vs Terrícolas 08:00; Galácticos vs Herreras 10:00; Linces vs Oklahoma 12:00; San José vs Juventus 14:00. Se conserva como programación de cuartos, no como resultados.'},
  {date:'12 abr 2026',title:'Cuartos de final de ida',detail:'San Antonio Jrs. vs Franco FC · 10:00 · comunidad de Romerillo. El cartel identifica el partido como Torneo de Liga, cuartos de final de ida.',image:HIST_ROOT+'assets/official-logos/franco-fc.png'},
  {date:'20 may 2026',title:'Final de Liga · Veteranos 50+',detail:'Publicación de Juventino Rosas Liga anuncia la Gran Final de Veteranos 50 y más entre La Esperanza y Boavista. La fecha exacta del partido no es visible en el cuadro recuperado.',image:HIST_ROOT+'assets/official-logos/boavista.png'},
  {date:'2024',title:'Atlético Galeana · subcampeón en el archivo reciente',detail:'El material reciente conserva una publicación de premiación que identifica a Atlético Galeana como subcampeón. La categoría no se asigna aquí porque no queda legible en el fragmento revisado.',image:HIST_ROOT+'assets/official-logos/galeana.png'},
  {date:'24 nov 2024',title:'Semifinal de vuelta · Fuerza Intermedia',detail:'A. San Julián vs Lobos CDG · 12:00 · San Julián. Herreras F.C. vs Oklahoma · 12:00 · Cuenda. El cartel fue publicado el 22 nov 2024.',image:HIST_ROOT+'assets/official-logos/lobos-cdg.png'},
  {date:'07 jun 2026',title:'La Canchita Deportes · campeón de Segunda Fuerza',detail:'La Canchita Deportes ganó la Gran Final de Segunda Fuerza ante Aldama FC; Aldama quedó subcampeón. El usuario aportó la fotografía de la premiación.',image:HIST_MEDIA+'archive-v132/canchita-deportes-campeon-segunda-2026.jpg'}
];

const historicTables=[
  {
    season:'2013',title:'Segunda Fuerza · Tabla General · publicación 5 nov 2013',note:'Corte histórico. El asterisco visible en la publicación marca equipos clasificados; quedan pendientes Aldama–Osasuna y Tavera–Osasuna.',
    rows:[
      ['1','San José de la Montaña','77'],['2','Real Cerrito de Gasca','75'],['3','DHP','68'],['4','San Juan FC','64'],
      ['5','Tavera','63'],['6','Morales','55'],['7','La Río Grande','43'],['8','Oklahoma','43'],
      ['9','Salvajes','42'],['10','San José de Allende','41'],['11','Novatos','35'],['12','Deportivo Aldama','32'],
      ['13','Unión Allende','31'],['14','Osasuna','23'],['15','Continental','22'],['16','La Pandilla de Rancho V.','16']
    ]
  },
  {
    season:'2014',title:'Intermedia · publicación 3 sep 2014',note:'Tabla histórica recuperada de Golazo Liga; se conserva como corte de la competencia.',
    rows:[
      ['1','La Pandilla','40'],['2','La Cuadrilla','37'],['3','San José de la Montaña','31'],['4','Puros Cuates','29'],
      ['5','Populares','28'],['6','Real Cerrito de Gasca','28'],['7','Dulces Nombres','27'],['8','Halcones de Cuenda','26'],
      ['9','Terrícolas','24'],['10','Malvinas','22'],['11','San Antonio Jr.','19'],['12','Barza','19'],['13','Atlas','13']
    ]
  },
  {
    season:'2014',title:'Veteranos · publicación 28 ago 2014',note:'Tabla de posición de Veteranos recuperada del archivo de Golazo Liga.',
    rows:[
      ['1','Dynamo','15'],['2','Hermanos','10'],['3','Magisterio','10'],['4','La Esperanza','9'],
      ['5','UNAM','8'],['6','Picosos','7'],['7','Aldama','6'],['8','Boavista','5'],
      ['9','Sección XIV','4'],['10','Valedores','4'],['11','Cuenda','4']
    ]
  },
  {
    season:'2015',title:'Veteranos · Torneo de Liga · Jornada 13',note:'Corte publicado el 25 nov 2015; no se presenta como tabla final.',
    rows:[
      ['1','La Esperanza','35'],['2','Cuenda','27'],['3','Magisterio','25'],['4','Chelsea','25'],
      ['5','Boavista','24'],['6','Picosos','19'],['7','Dynamo','16'],['8','UNAM','15'],
      ['9','Hermanos','13'],['10','Valedores','12'],['11','Sección XIV','5'],['12','Guadalajara','4']
    ]
  },
  {
    season:'2015',title:'Intermedia · Torneo de Liga · Jornada 20',note:'Corte publicado el 3 dic 2015. Los puntos se conservan exactamente como aparecen en la tabla histórica.',
    rows:[
      ['1','San Antonio Jr.','43'],['2','Malvinas','43'],['3','Tavera','41'],['4','La Cuadrilla','40'],
      ['5','Centeno','31'],['6','Real Cerrito','22'],['7','Halcones','21'],['8','Barza','21'],
      ['9','Populares','16'],['10','Terrícolas','11'],['11','DHP','11'],['12','Dulces Nombres','3'],['13','Xolos Jaralillo','2']
    ]
  },
  {
    season:'2017',title:'Primera · Torneo de Liga · Jornada 30',note:'Corte publicado el 6 may 2017; no se presenta como tabla final.',
    rows:[
      ['1','Linces','79'],['2','Hermanos','74'],['3','Juventus','63'],['4','La Esperanza','58'],
      ['5','Abejas','49'],['6','La Cuadrilla','48'],['7','San Antonio Jr.','42'],['8','Chelsea','39'],
      ['9','Napoli','36'],['10','La Pandilla','36'],['11','Boavista','33'],['12','Puros Cuates','30'],
      ['13','PSV','29'],['14','Olímpicos','23'],['15','Malvinas','23'],['16','Cerrito de Gasca','21'],['17','El Alto','BAJA']
    ]
  },
  {
    season:'ene 2018',title:'Primera Fuerza · corte de 16 partidos',note:'Corte visible en el archivo alrededor del 12 ene 2018. Se conserva como fotografía de la clasificación en ese momento, no como tabla final.',
    rows:[
      ['1','Olímpicos','38'],['2','A. Centeno','37'],['3','Hermanos','36'],['4','Juventus','36'],
      ['5','Linces','32'],['6','La Esperanza','29'],['7','PSV','29'],['8','Boavista','26'],
      ['9','La Cuadrilla','24'],['10','Puros Cuates','17'],['11','Napoli','14'],['12','Tavera','13'],
      ['13','Malvinas','12'],['14','Chelsea','8'],['15','Abejas','7'],['16','San Antonio Jr.','7']
    ]
  },
  {
    season:'2018',title:'Intermedia · Jornada 23',note:'Corte histórico, no se presenta como tabla final.',
    rows:[
      ['1','Lobos CDG','52'],['2','Populares','49'],['3','Real DHP','48'],['4','Vatos Locos','47'],
      ['5','Tecos','43'],['6','Oklahoma','38'],['7','Mineros','36'],['8','Barza','33'],
      ['9','San Antonio','33'],['10','Franco FC','26'],['11','Osasuna','24'],['12','La Huerta','23'],
      ['13','Mazacotes','23'],['14','Titanes Tavera','21'],['15','Terrícolas','14'],['16','Morales','Baja']
    ]
  },
  {
    season:'2018',title:'Primera Fuerza · Jornada 26',note:'Corte histórico recuperado de una tabla publicada.',
    rows:[
      ['1','A. Centeno','64'],['2','Olímpicos','63'],['3','Hermanos','59'],['4','Juventus','56'],
      ['5','Linces','56'],['6','PSV','45'],['7','La Esperanza','43'],['8','La Cuadrilla','42'],
      ['9','Boavista','35'],['10','Napoli','24'],['11','Tavera','20'],['12','Abejas','16'],['13','Chelsea','16']
    ]
  },
  {
    season:'2022',title:'Veteranos · Tabla final de Liga',note:'Tabla publicada como final tras 22 jornadas.',
    rows:[
      ['1','Juventus','53'],['2','Hermanos','45'],['3','América','41'],['4','Dynamo','39'],
      ['5','PSV','36'],['6','Deportivo Rafa','34'],['7','Boavista','31'],['8','Arsenal','29'],
      ['9','Cuenda','22'],['10','Barrio Seco','15'],['11','UNAM','15'],['12','Átomos','8']
    ]
  }
];

const historicScorers=[
  {season:'2015',category:'Primera Fuerza · premiación 11 ene 2015',player:'José Guadalupe Moreno',team:'Equipo no visible en la publicación',goals:null,value:'Campeón goleador'},
  {season:'2016',category:'Veteranos · Jornada 5 · 06 oct 2016',player:'Francisco Hortelano Laguna',team:'Cuenda',goals:5,value:'5 goles'},
  {season:'2016',category:'Veteranos · Jornada 5 · 06 oct 2016',player:'Juan Carlos Barrientos',team:'Cuenda',goals:5,value:'5 goles'},
  {season:'2017',category:'Fuerza Intermedia · tabla final de goleo J22 · 21 feb 2017',player:'Daniel Gómez Delgado',team:'A. Centeno',goals:34,value:'34 goles · campeón'},
  {season:'2017',category:'Veteranos · premiación 15 abr 2017',player:'Eusebio Rangel',team:'Hermanos',goals:null,value:'Campeón goleador'},
  {season:'2017',category:'Primera Fuerza · corte J28 · 15 abr 2017',player:'Juan Manuel Gámez López',team:'Hermanos',goals:34,value:'34 goles'},
  {season:'2017',category:'Primera Fuerza · corte J28 · 15 abr 2017',player:'Fernando Gámez Reyes',team:'Abejas',goals:29,value:'29 goles'},
  {season:'2017',category:'Primera Fuerza · corte J28 · 15 abr 2017',player:'Jorge Alberto Sánchez Mendoza',team:'Juventus',goals:29,value:'29 goles'},
  {season:'2017',category:'Primera Fuerza · corte J28 · 15 abr 2017',player:'Noé Alfredo Silva Martínez',team:'La Cuadrilla',goals:29,value:'29 goles'},
  {season:'2017',category:'Fuerza Intermedia · Jornada 10 · 11 nov 2017',player:'Antonio Calero',team:'Real DHP',goals:17,value:'17 goles · J10'},
  {season:'2017',category:'Fuerza Intermedia · Jornada 10 · 11 nov 2017',player:'Alejandro Juárez Merino',team:'Populares',goals:16,value:'16 goles · J10'},
  {season:'2017',category:'Fuerza Intermedia · Jornada 10 · 11 nov 2017',player:'Juan Carlos Acosta Zárate',team:'Real DHP',goals:11,value:'11 goles · J10'},
  {season:'2017',category:'Fuerza Intermedia · Jornada 10 · 11 nov 2017',player:'Oscar Muñoz Badillo',team:'Oklahoma',goals:10,value:'10 goles · J10'},
  {season:'2017',category:'Fuerza Intermedia · Jornada 10 · 11 nov 2017',player:'Santiago Ramírez',team:'Lobos CDG',goals:10,value:'10 goles · J10'},
  {season:'2017',category:'Fuerza Intermedia · J22 · 21 feb 2017',player:'Alejandro Juárez Merino',team:'Populares',goals:20,value:'20 goles · J22 2017'},
  {season:'2017',category:'Fuerza Intermedia · J22 · 21 feb 2017',player:'Víctor Calderón',team:'Oklahoma',goals:18,value:'18 goles'},
  {season:'2017',category:'Fuerza Intermedia · J22 · 21 feb 2017',player:'Oscar Muñoz Badillo',team:'Oklahoma',goals:17,value:'17 goles'},
  {season:'2017',category:'Fuerza Intermedia · J22 · 21 feb 2017',player:'Honorio Ochoa Aguilar',team:'Tavera',goals:16,value:'16 goles'},
  {season:'2017',category:'Fuerza Intermedia · J22 · 21 feb 2017',player:'Martín Guerrero García',team:'Mazacotes',goals:16,value:'16 goles'},
  {season:'2017',category:'Fuerza Intermedia · J22 · 21 feb 2017',player:'Ramón Calderón Gamusera',team:'Oklahoma',goals:13,value:'13 goles'},
  {season:'2017',category:'Fuerza Intermedia · J22 · 21 feb 2017',player:'Alberto Ariza Silva',team:'Terrícolas',goals:12,value:'12 goles'},
  {season:'2017',category:'Fuerza Intermedia · J22 · 21 feb 2017',player:'Erick Omar Delgado R.',team:'Real Cerrito',goals:12,value:'12 goles'},
  {season:'2017',category:'Fuerza Intermedia · J22 · 21 feb 2017',player:'Gabriel Cano',team:'Osasuna',goals:12,value:'12 goles'},
  {season:'2017',category:'Fuerza Intermedia · J22 · 21 feb 2017',player:'Juan Ernesto Ramos Herrera',team:'A. Centeno',goals:11,value:'11 goles'},
  {season:'2017',category:'Fuerza Intermedia · J22 · 21 feb 2017',player:'Miguel Presa García',team:'Populares',goals:11,value:'11 goles'},
  {season:'2017',category:'Fuerza Intermedia · J22 · 21 feb 2017',player:'Fernando Ortega Villafuerte',team:'San Julián',goals:10,value:'10 goles'},
  {season:'2017',category:'Fuerza Intermedia · J22 · 21 feb 2017',player:'Guadalupe Razo Rodríguez',team:'Real Cerrito',goals:10,value:'10 goles'},
  {season:'2017',category:'Fuerza Intermedia · J22 · 21 feb 2017',player:'Juan Guzmán López',team:'Osasuna',goals:10,value:'10 goles'},

  {season:'2016',category:'Veteranos · Jornada 5 · 06 oct 2016',player:'Eusebio Rangel Nolasco',team:'Hermanos',goals:3,value:'3 goles'},
  {season:'2016',category:'Veteranos · Jornada 5 · 06 oct 2016',player:'Francisco Cano Rodríguez',team:'Picosos',goals:3,value:'3 goles'},
  {season:'2016',category:'Veteranos · Jornada 5 · 06 oct 2016',player:'Ismael Arias Vallejo',team:'Magisterio',goals:3,value:'3 goles'},
  {season:'2016',category:'Veteranos · Jornada 5 · 06 oct 2016',player:'J. Marcos Arce',team:'La Esperanza',goals:3,value:'3 goles'},
  {season:'2016',category:'Veteranos · Jornada 5 · 06 oct 2016',player:'José Antonio Juárez Landín',team:'Magisterio',goals:3,value:'3 goles'},
  {season:'2016',category:'Veteranos · Jornada 5 · 06 oct 2016',player:'José Rodríguez Mancera',team:'Picosos',goals:3,value:'3 goles'},
  {season:'2016',category:'Veteranos · Jornada 5 · 06 oct 2016',player:'Martín Piña Sánchez',team:'Dynamo',goals:3,value:'3 goles'},
  {season:'2016',category:'Veteranos · Jornada 5 · 06 oct 2016',player:'Rodolfo Mozqueda Chacón',team:'Boavista',goals:3,value:'3 goles'},
  {season:'2016',category:'Veteranos · Jornada 5 · 06 oct 2016',player:'Daniel Delgado Lemus',team:'Valedores',goals:2,value:'2 goles'},
  {season:'2016',category:'Veteranos · Jornada 5 · 06 oct 2016',player:'José Luis Orozco Mata',team:'UNAM',goals:2,value:'2 goles'},
  {season:'2016',category:'Veteranos · Jornada 5 · 06 oct 2016',player:'Juan Cerrito Campos',team:'Cuenda Jr.',goals:2,value:'2 goles'},

  {season:'2017',category:'Primera Fuerza · corte J28 · 15 abr 2017',player:'Edgar Ramírez Sánchez',team:'Linces',goals:26,value:'26 goles'},
  {season:'2017',category:'Primera Fuerza · corte J28 · 15 abr 2017',player:'Martín López Guerrero',team:'Malvinas',goals:21,value:'21 goles'},
  {season:'2017',category:'Primera Fuerza · corte J28 · 15 abr 2017',player:'Alfredo Luna Belman',team:'Hermanos',goals:19,value:'19 goles'},
  {season:'2017',category:'Primera Fuerza · corte J28 · 15 abr 2017',player:'Luis Eduardo Ortega Flores',team:'La Esperanza',goals:19,value:'19 goles'},
  {season:'2017',category:'Primera Fuerza · corte J28 · 15 abr 2017',player:'Edwin Oswaldo Centeno G.',team:'La Esperanza',goals:17,value:'17 goles'},
  {season:'2017',category:'Primera Fuerza · corte J28 · 15 abr 2017',player:'Luis Ángel Sánchez Mendoza',team:'Napoli',goals:16,value:'16 goles'},
  {season:'2017',category:'Primera Fuerza · corte J28 · 15 abr 2017',player:'Francisco Javier Sololache',team:'PSV',goals:15,value:'15 goles'},
  {season:'2017',category:'Primera Fuerza · corte J28 · 15 abr 2017',player:'José García González',team:'Puros Cuates',goals:15,value:'15 goles'},
  {season:'2017',category:'Primera Fuerza · corte J28 · 15 abr 2017',player:'Jesús Humberto Ruiz Fojardo',team:'La Pandilla',goals:14,value:'14 goles'},
  {season:'2017',category:'Primera Fuerza · corte J28 · 15 abr 2017',player:'Mauricio Naranjo Bavarro',team:'Linces',goals:13,value:'13 goles'},
  {season:'2017',category:'Primera Fuerza · corte J28 · 15 abr 2017',player:'Daniel Robles Peña',team:'Boavista',goals:12,value:'12 goles'},
  {season:'2017',category:'Primera Fuerza · corte J28 · 15 abr 2017',player:'Cristian Villafuerte Ramírez',team:'Linces',goals:10,value:'10 goles'},
  {season:'2017',category:'Primera Fuerza · corte J28 · 15 abr 2017',player:'Gabriel Almanza Castillas',team:'San Antonio Jr.',goals:10,value:'10 goles'},
  {season:'2017',category:'Primera Fuerza · corte J28 · 15 abr 2017',player:'Gerardo Belman Navarro',team:'Linces',goals:10,value:'10 goles'},
  {season:'2017',category:'Primera Fuerza · corte J28 · 15 abr 2017',player:'Luis Gámez',team:'Olímpicos',goals:10,value:'10 goles'},
  {season:'2017',category:'Primera Fuerza · corte J28 · 15 abr 2017',player:'Marín Pizano',team:'Juventus',goals:10,value:'10 goles'},
  {season:'2017',category:'Primera Fuerza · corte J28 · 15 abr 2017',player:'Alfredo Palacios Quintanilla',team:'La Esperanza',goals:9,value:'9 goles'},
  {season:'2017',category:'Primera Fuerza · corte J28 · 15 abr 2017',player:'Antonio Lerma Pizano',team:'Chelsea',goals:9,value:'9 goles'},
  {season:'2017',category:'Primera Fuerza · corte J28 · 15 abr 2017',player:'Edgar Manuel Landín Ibarra',team:'Hermanos',goals:9,value:'9 goles'},
  {season:'2017',category:'Primera Fuerza · corte J28 · 15 abr 2017',player:'José Guadalupe Moreno Huerta',team:'Juventus',goals:9,value:'9 goles'},
  {season:'2018',category:'Intermedia · Jornada 23',player:'Alejandro Juárez Merino',team:'Populares',goals:31,value:'31 goles'},
  {season:'2018',category:'Intermedia · Jornada 23',player:'Juan Carlos Hernández',team:'Barza',goals:18,value:'18 goles'},
  {season:'2018',category:'Intermedia · Jornada 23',player:'Alejandro Ramírez Medina',team:'Real DHP',goals:16,value:'16 goles'},
  {season:'2018',category:'Intermedia · Jornada 23',player:'César Agustín Pérez Campos',team:'Oklahoma',goals:16,value:'16 goles'},
  {season:'2018',category:'Intermedia · Jornada 23',player:'Miguel Presa García',team:'Populares',goals:16,value:'16 goles'}
];

const historicTeamGoalRecords=[
  {season:'2018',category:'Intermedia · Jornada 23',team:'Populares',identifiedGoals:47,players:2,note:'47 goles identificados al sumar los dos goleadores visibles del equipo (31 + 16). No se presenta como total oficial del club porque la tabla recuperada usada aquí no conserva la columna completa de GF.'},
  {season:'2018',category:'Intermedia · Jornada 23',team:'Barza',identifiedGoals:18,players:1,note:'18 goles identificados en el registro de goleo visible. El total completo del equipo sigue pendiente de recuperar de una tabla con GF.'},
  {season:'2018',category:'Intermedia · Jornada 23',team:'Real DHP',identifiedGoals:16,players:1,note:'16 goles identificados en el registro de goleo visible. El total completo del equipo sigue pendiente de recuperar de una tabla con GF.'},
  {season:'2018',category:'Intermedia · Jornada 23',team:'Oklahoma',identifiedGoals:16,players:1,note:'16 goles identificados en el registro de goleo visible. El total completo del equipo sigue pendiente de recuperar de una tabla con GF.'}
];

const recordMemories=[
  {tag:'PODIO 2013',title:'Romerillo',value:'3.er lugar',detail:'Fuerza Intermedia · publicación de Golazo Liga del 23 nov 2013. La nota destaca al portero de Romerillo por una atajada de penal en la serie final.'},
  {tag:'CORTE J30',title:'Linces',value:'79 puntos',detail:'Líder del corte de Primera publicado el 6 may 2017; no se presenta como récord absoluto.'},
  {tag:'CORTE J30',title:'Hermanos',value:'111 GF',detail:'Goles a favor visibles en la tabla de Primera J30 del 6 may 2017.'},
  {tag:'CORTE J30',title:'Linces',value:'+75 DG',detail:'Diferencia de goles visible en la tabla de Primera J30 del 6 may 2017.'},
  {tag:'VETERANOS J13',title:'La Esperanza',value:'11 G · 2 E · 0 P',detail:'Corte del 25 nov 2015: 35 puntos, 38 GF y 13 GC; no se presenta como cierre final.'},
  {tag:'GOLEO',title:'Daniel Gómez Delgado',value:'34 goles',detail:'A. Centeno · campeón de goleo de Fuerza Intermedia, publicación del 21 feb 2017.'},
  {tag:'GOLEO',title:'José Guadalupe Moreno',value:'Campeón',detail:'Campeón goleador de Primera Fuerza; premiación publicada el 11 ene 2015.'},
  {tag:'GOLEO',title:'Alejandro Juárez Merino',value:'31 goles',detail:'Populares · líder de goleo en el corte de Intermedia J23 de 2018.'},
  {tag:'TABLA',title:'A. Centeno',value:'64 puntos',detail:'Líder del corte de Primera Fuerza J26 de 2018.'},
  {tag:'TABLA',title:'Lobos CDG',value:'52 puntos',detail:'Líder del corte de Intermedia J23 de 2018.'},
  {tag:'TABLA FINAL',title:'Juventus',value:'53 puntos',detail:'Primer lugar de la tabla final de Veteranos 2022.'},
  {tag:'CAMPEÓN',title:'Juventus',value:'Liga 2018–2019',detail:'Campeón confirmado en publicación histórica del 3 de noviembre de 2019.',image:HIST_MEDIA+'juventus-campeon-2019.jpg'},
  {tag:'RECUERDO',title:'Boavista',value:'XXV aniversario',detail:'Álbum conmemorativo conservado en el archivo histórico.',image:HIST_MEDIA+'archive-v119/boavista-xxv-2012.jpg'},
  {tag:'MEMORIA',title:'José Carmen Guerrero Velásquez',value:'Equipo de 1950',detail:'Reconocimiento publicado por la Liga el 8 jun 2025: lo describe como el único sobreviviente del primer equipo de fútbol formado en Juventino Rosas en 1950.'},
  {tag:'ARBITRAJE',title:'Gabriel Roque Hortelano',value:'100+ finales',detail:'Reconocimiento del 15 jun 2025: más de 25 años de servicio; la publicación señala certificación federada en 2002 y más de 100 finales pitadas.'},
  {tag:'TRAYECTORIA',title:'Juan Morales Vásquez “Chacharín”',value:'50+ años',detail:'Reconocimiento del 15 jun 2025: más de 50 años en activo y más de 35 años como encargado de pintar campos.'},
  {tag:'CAMPEÓN',title:'Boavista FC',value:'Liga 2025 · V50+',detail:'Campeón de la final Boca Jrs. vs Boavista del 12 abr 2025.'},
  {tag:'CAMPEÓN',title:'Linces',value:'Copa 2024 · Primera Fuerza',detail:'La Pupila reportó victoria 3–2 sobre Hermanos FC en la final de Copa el 4 mar 2024.',image:HIST_MEDIA+'archive-v202/linces-campeon-copa-04-mar-2024.webp'},
  {tag:'CAMPEÓN',title:'Boca Jrs. · Cuenda',value:'Liga 2024 · V50+',detail:'Campeón de Liga de Veteranos 50 y más tras imponerse a Manchester el 4 may 2024.',image:HIST_MEDIA+'archive-v202/boca-jrs-campeon-liga-v50-04-may-2024.webp'},
  {tag:'CAMPEÓN',title:'Galácticos (Pozos)',value:'Copa 2025',detail:'Campeón de Primera Fuerza el 8 jun 2025 ante Herreras FC (Cuenda).'},
  {tag:'CAMPEÓN',title:'Herreras FC',value:'Relámpago 2025 · Fuerza Intermedia',detail:'Campeón del Torneo Relámpago ante Oklahoma el 9 feb 2025.',image:HIST_MEDIA+'archive-v208/herreras-fc-campeon-relampago-intermedia-09-feb-2025.webp'},
  {tag:'CAMPEÓN',title:'Lobos Jrs.',value:'Relámpago 2025 · Segunda Fuerza',detail:'Campeón del Torneo Relámpago el 16 feb 2025.',image:HIST_MEDIA+'archive-v207/lobos-jrs-campeon-relampago-segunda-16-feb-2025.webp'},
  {tag:'CAMPEÓN',title:'Lobos CDG',value:'Copa 2025 · Fuerza Intermedia',detail:'Campeón de Copa tras ganar la final del 15 jun 2025.',image:HIST_MEDIA+'archive-v207/lobos-cdg-campeon-copa-intermedia-15-jun-2025.webp'}
];

const historicResults=[
  {date:'04 mar 2024',category:'Primera Fuerza',competition:'Final de Copa',home:'Linces',away:'Hermanos FC',score:'3–2',detail:'La Pupila publicó que Linces venció 3–2 a Hermanos FC y se llevó la final de Copa.'},
  {date:'04 may 2024',category:'Veteranos 50+',competition:'Final de Liga',home:'Boca Jrs.',away:'Manchester',score:'Marcador no visible',detail:'La Liga publicó que Boca Jrs. de Cuenda se impuso a Manchester y fue campeón de Liga 2024.'},
  {date:'2022',category:'Primera Fuerza · J19',winner:'Juventus',against:'Lobos CDG'},
  {date:'09 feb 2025',category:'Fuerza Intermedia · Torneo Relámpago',winner:'Herreras FC',against:'Oklahoma'},
  {date:'2022',category:'Intermedia · J19',winner:'La Huerta',against:'Galaxy'},
  {date:'2022',category:'Intermedia · J19',winner:'Sección 14',against:'A. Pozos'},
  {date:'2022',category:'Segunda Fuerza · J18',winner:'Galácticos FC',against:'San Juan FC'}
];

const historicFinalists=[
  {year:'15 dic 2013',category:'Segunda Fuerza · final y podio',a:'Campeón: Real Cerrito de Gasca',b:'Subcampeón: DHP',note:'Golazo Liga documentó al capitán de Real Cerrito recibiendo el trofeo de campeón. San José de la Montaña quedó tercero por default ante Tavera.',logoA:HIST_ROOT+'assets/teams/deportivo-cg.webp'},
  {year:'12 abr 2025',category:'Veteranos 50+ · Final de Liga 2025',a:'Boca Jrs.',b:'Boavista FC',note:'16:00 · Campo 1 · Unidad Deportiva Sur. Boavista aparece publicado como CAMPEÓN 2025 el mismo día.',logoB:HIST_ROOT+'assets/official-logos/boavista.png'},
  {year:'26 abr 2025',category:'Veteranos 50+ · Campeón de Campeones',a:'Campeón: Manchester',b:'Boavista FC',note:'Manchester obtuvo la presea de Campeón de Campeones al vencer a Boavista FC el 26 de abril de 2025.',logoA:HIST_ROOT+'assets/official-logos/manchester.png',logoB:HIST_ROOT+'assets/official-logos/boavista.png'},
  {year:'08 jun 2025',category:'Primera Fuerza · Final de Copa 2025',a:'Galácticos (Pozos)',b:'Herreras FC (Cuenda)',note:'10:00 · Campo 1 · Unidad Deportiva Sur. Galácticos fue publicado como campeón.',logoA:HIST_ROOT+'assets/teams/galacticos-pozos.webp',logoB:HIST_ROOT+'assets/official-logos/herreras-fc.png'},
  {year:'09 feb 2025',category:'Fuerza Intermedia · Torneo Relámpago',a:'Campeón: Herreras FC',b:'Oklahoma',note:'La Liga felicitó a Herreras F.C. por lograr el campeonato del Torneo Relámpago ante Oklahoma.',logoA:HIST_ROOT+'assets/official-logos/herreras-fc.png',logoB:HIST_ROOT+'assets/teams/oklahoma-city-fc.webp'},
  {year:'15 jun 2025',category:'Fuerza Intermedia · Final de Copa 2025',a:'Lobos CDG',b:'Franco FC',note:'Lobos CDG fue publicado como campeón tras vencer a Franco FC.',logoA:HIST_ROOT+'assets/official-logos/lobos-cdg.png',logoB:HIST_ROOT+'assets/official-logos/franco-fc.png'},
  {year:'20 dic 2025',category:'Veteranos 35+ · Final de Copa',a:'Salvajes',b:'Juventus',note:'15:30 · Campo 1 · Unidad Deportiva Sur. El material revisado confirma la programación, no el ganador.',logoB:HIST_ROOT+'assets/official-logos/juventus.png'},
  {year:'20 may 2026 · publicación',category:'Veteranos 50+ · Gran Final de Liga',a:'La Esperanza',b:'Boavista',note:'La publicación anuncia la final; el día exacto del partido no aparece visible en el cuadro recuperado.',logoA:HIST_ROOT+'assets/official-logos/la-esperanza.png',logoB:HIST_ROOT+'assets/official-logos/boavista.png'},
  {year:'07 jun 2026',category:'Segunda Fuerza · Gran Final de Liga 2025–2026',a:'La Canchita Deportes',b:'Aldama FC',note:'10:00 · Campo 1 · Deportiva Sur.',logoA:HIST_ROOT+'assets/official-logos/la-canchita-deportes.png',logoB:HIST_ROOT+'assets/official-logos/aldama-fc.png'},
  {year:'08 dic 2013',category:'Categoría libre · Primera · Gran Final',a:'Juventus',b:'Olímpicos',note:'10:00 · Campo 1. Archivo adulto de Golazo Liga; Chelsea vs PSV aparece por el tercer lugar.',logoA:HIST_ROOT+'assets/official-logos/juventus.png'},
  {year:'01 mar 2014',category:'Veteranos · Gran Final',a:'UNAM',b:'La Esperanza',note:'16:00 · Campo 1. Archivo histórico adulto.'},
  {year:'2019',category:'Veteranos · Final de Copa',a:'Chelsea',b:'La Esperanza',note:'Programada a las 17:30 en Campo 1. El material revisado confirma la final y su programación.'},
  {year:'2021',category:'Veteranos · Gran Final de Liga 2020–2021',a:'Campeón: La Esperanza',b:'Subcampeón: Real Cuenda',note:'17:00 · Campo 1. El rol histórico del 25–26 sep 2021 confirma la final; el usuario aporta que La Esperanza ganó el título en tiros penales.',logoA:HIST_ROOT+'assets/official-logos/la-esperanza.png'},
  {year:'2022',category:'Veteranos · Final de Copa',a:'Juventus',b:'PSV',note:'16:00 · Campo 1.',logoA:HIST_ROOT+'assets/official-logos/juventus.png'},
  {year:'2022–2023',category:'Veteranos · Final de Copa',a:'Juventus',b:'Cuenda',note:'16:30 · Campo 1.',logoA:HIST_ROOT+'assets/official-logos/juventus.png'},
  {year:'2023',category:'Veteranos · Gran Final de Liga',a:'Juventus',b:'América',note:'16:30 · Campo 1.',logoA:HIST_ROOT+'assets/official-logos/juventus.png'},
  {year:'2023',category:'Categoría libre · Segunda Fuerza · Gran Final de Liga',a:'Titanes FC',b:'Terrícolas SEDER',note:'Final programada en el rol histórico revisado.',logoB:HIST_ROOT+'assets/official-logos/terricolas.png'}
];

// V108 — inventario de equipos por época recuperado de los siete videos de Drive y el ZIP histórico.
// Son apariciones históricas: NO alteran los equipos inscritos en la temporada actual.
const historicTeamLogoMap={
  'boavista':'assets/official-logos/boavista.png',
  'cuenda':'assets/official-logos/toros-de-cuenda.png',
  'san julian':'assets/official-logos/san-julian.png',
  'san jose de la montana':'assets/teams/san-jose-montana.webp',
  'real cerrito de gasca':'assets/teams/deportivo-cg.webp',
  'real cerrito':'assets/teams/deportivo-cg.webp',
  'cerrito de gasca':'assets/teams/deportivo-cg.webp',
  'san juan fc':'assets/official-logos/san-juan-fc.png',
  'tavera':'assets/official-logos/tavera-fc.png',
  'tavera fc':'assets/official-logos/tavera-fc.png',
  'oklahoma':'assets/teams/oklahoma-city-fc.webp',
  'deportivo aldama':'assets/official-logos/aldama-fc.png',
  'aldama':'assets/official-logos/aldama-fc.png',
  'osasuna':'assets/official-logos/osasuna.png',
  'la cuadrilla':'assets/official-logos/la-cuadrilla.png',
  'populares':'assets/official-logos/populares.png',
  'terricolas':'assets/official-logos/terricolas.png',
  'terricolas seder':'assets/official-logos/terricolas.png',
  'malvinas':'assets/official-logos/malvinas.png',
  'san antonio jr':'assets/official-logos/san-antonio-jrs.png',
  'san antonio':'assets/official-logos/san-antonio-fc.png',
  'barza':'assets/official-logos/barza.png',
  'dynamo':'assets/official-logos/dynamo.png',
  'dinamo':'assets/official-logos/dynamo.png',
  'hermanos':'assets/official-logos/hermanos.png',
  'la esperanza':'assets/official-logos/la-esperanza.png',
  'juventus':'assets/official-logos/juventus.png',
  'linces':'assets/official-logos/linces.png',
  'psv':'assets/teams/psv.webp',
  'napoli':'assets/official-logos/napoli.png',
  'abejas':'assets/official-logos/abejas.png',
  'lobos cdg':'assets/official-logos/lobos-cdg.png',
  'la huerta':'assets/official-logos/la-huerta.png',
  'franco fc':'assets/official-logos/franco-fc.png',
  'mineros':'assets/teams/mineros-fc.webp',
  'mazacotes':'assets/official-logos/mazacotes-fc.png',
  'herreras fc':'assets/official-logos/herreras-fc.png',
  'galacticos pozos':'assets/teams/galacticos-pozos.webp',
  'galacticos':'assets/teams/galacticos-pozos.webp',
  'manchester united':'assets/official-logos/manchester.png',
  'manchester':'assets/official-logos/manchester.png',
  'atletico galeana':'assets/official-logos/galeana.png',
  'promesas fc':'assets/official-logos/promesas-fc.png',
  'la canchita deportes':'assets/official-logos/la-canchita-deportes.png',
  'deportivo maravillas':'assets/official-logos/dep-maravillas.png',
  'dep maravillas':'assets/official-logos/dep-maravillas.png',
  'tapatio':'assets/official-logos/tapatio.png',
  'san jose fc':'assets/official-logos/san-jose-fc.png',
  'san jose jrs':'assets/official-logos/san-jose-jrs.png',
  'celticos':'assets/official-logos/celticos.png',
  'galacticos fc':'assets/teams/galacticos-pozos.webp',
  'galacticos':'assets/teams/galacticos-pozos.webp',
  'deportivo pozos':'assets/teams/pozos-fc.webp',
  'pozos':'assets/teams/pozos-fc.webp',
  'a pozos':'assets/teams/pozos-fc.webp',
  'america':'assets/branding/america-veteranos-35-user.png',
  'america veteranos':'assets/branding/america-veteranos-35-user.png',
  'c de gasca':'assets/teams/deportivo-cg.webp',
  'pozos fc':'assets/teams/pozos-fc.webp',
  'a santiago':'assets/teams/atletico-santiago.webp',
  'atletico santiago':'assets/teams/atletico-santiago.webp',
  'f tavera':'assets/teams/franco-tavera-jr-veteranos.webp',
  'franco tavera':'assets/teams/franco-tavera-jr-veteranos.webp',
  'huracan':'assets/teams/huracan.webp',
  'toros de cuenda':'assets/official-logos/toros-de-cuenda.png',
  'capibaras':'assets/official-logos/capibaras.png',
  'pachangas fc':'assets/official-logos/pachangas-fc.png',
  'dep la luz':'assets/official-logos/dep-la-luz.png',
  'deportivo la luz':'assets/official-logos/dep-la-luz.png',
  'dep nopalero':'assets/official-logos/dep-nopalero.png',
  'deportivo nopalero':'assets/official-logos/dep-nopalero.png',
  'dep zapata':'assets/official-logos/dep-zapata.png',
  'deportivo zapata':'assets/official-logos/dep-zapata.png',
  'promesas':'assets/official-logos/promesas-fc.png',
  'galeana':'assets/official-logos/galeana.png',
  'aldama fc':'assets/official-logos/aldama-fc.png',

  // Homónimos históricos: el usuario pidió mostrar el escudo del club real como referencia visual.
  'unam':'https://www.clipartmax.com/png/middle/278-2789076_pumas-de-la-unam-mexican-football-teams-badges.png',
  'guadalajara':'https://www.clipartmax.com/png/middle/114-1145991_cd-guadalajara-imagenes-de-las-chivas-2018.png',
  'arsenal':'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg',
  'chelsea':'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg',
  'dortmund':'https://commons.wikimedia.org/wiki/Special:Redirect/file/Borussia_Dortmund_logo.svg',
  'atlas':'https://commons.wikimedia.org/wiki/Special:Redirect/file/F%C3%BAtbol_Club_Atlas.svg',
  'boca jrs':'https://commons.wikimedia.org/wiki/Special:Redirect/file/Escudo_del_Club_Atl%C3%A9tico_Boca_Juniors_2012.svg',
  'boca jrs ':'https://commons.wikimedia.org/wiki/Special:Redirect/file/Escudo_del_Club_Atl%C3%A9tico_Boca_Juniors_2012.svg'
};
function histTeamKey(v){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[().]/g,' ').replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ')}
function canonicalHistoricName(name){
  const k=histTeamKey(name);
  const aliases={
    'tavera':'Tavera FC',
    'tavera fc':'Tavera FC',
    'chelse':'Chelsea',
    'seccion 14':'Sección XIV',
    'seccion xiv':'Sección XIV',
    'psv eindhoven':'PSV',
    'deportivo aldama':'Aldama FC',
    'aldama':'Aldama FC',
    'aldama fc':'Aldama FC'
  };
  return aliases[k]||String(name||'').trim();
}
function historicLogo(name){
  const k=histTeamKey(canonicalHistoricName(name));
  const p=historicTeamLogoMap[k];
  if(p)return /^https?:\/\//i.test(p)?p:HIST_ROOT+p;
  if(k==='tecos')return HIST_MEDIA+'tecos-campeon-historico.jpg';
  if(k==='puros cuates'&&HIST_PHOTOS.purosCuatesTrophy2014)return HIST_PHOTOS.purosCuatesTrophy2014;
  return '';
}
function historicInitials(name){
  const parts=canonicalHistoricName(name).replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9 ]+/g,' ').trim().split(/\s+/).filter(Boolean);
  if(!parts.length)return '—';
  return (parts.length===1?parts[0].slice(0,2):parts.slice(0,2).map(x=>x[0]).join('')).toUpperCase();
}

const historicalTeamEras=[
  {period:'1987 · referencia retrospectiva publicada en 2012',category:'Primera Fuerza / fútbol de comunidades',teams:['Boavista','Cuenda','Aguilares','San Julián','Merino','Santa María de Guadalupe','Pozos']},
  {period:'2012 · publicaciones directas localizadas',category:'Equipos fotografiados/publicados por Golazo Liga',teams:['PSV','Real Cerrito','Unión Allende','Chelse','Hermanos','Aldama','Osasuna','Manchester','Halcones','San Antonio Jr.','Boavista']},
  {period:'2013',category:'Segunda Fuerza · tabla publicada',teams:['San José de la Montaña','Real Cerrito de Gasca','DHP','San Juan FC','Tavera','Morales','La Río Grande','Oklahoma','Salvajes','San José de Allende','Novatos','Deportivo Aldama','Unión Allende','Osasuna','Continental','La Pandilla de Rancho V.']},
  {period:'2013',category:'Primera Fuerza · final y tercer lugar documentados',teams:['Juventus','Olímpicos','Chelsea','PSV']},
  {period:'2013 · rol 30 nov–1 dic',category:'Veteranos y Primera Fuerza',teams:['UNAM','Sección XIV','Boavista','Barcelona','Cuenda','Guadalajara','Picosos','Hermanos','Magisterio','La Esperanza','Aldama','Dynamo','Juventus','PSV-Eindhoven','Olímpicos de Pozos','Chelsea','Tavera','Morales']},
  {period:'2014 · Jornada 11',category:'Primera Fuerza',teams:['Juventus','La Esperanza','Chelsea','Hermanos','Boavista','Abejas','PSV','Linces','Olímpicos','Centeno','El Alto','Jaralillo','Birds Eye','Mazacotes','Cerrito de Gasca','San Antonio']},
  {period:'2014',category:'Intermedia',teams:['La Pandilla','La Cuadrilla','San José de la Montaña','Puros Cuates','Populares','Real Cerrito de Gasca','Dulces Nombres','Halcones de Cuenda','Terrícolas','Malvinas','San Antonio Jr.','Barza','Atlas','Deportivo Pozos','Valencia']},
  {period:'2014',category:'Veteranos',teams:['Dynamo','Hermanos','Magisterio','La Esperanza','UNAM','Picosos','Aldama','Boavista','Sección XIV','Valedores','Cuenda']},
  {period:'2014 · Jornada 11',category:'Segunda Fuerza',teams:['DHP','Morales','San Juan FC','Oklahoma','Tavera','San José de Allende','Birds Eye Jr.','Toros','San Julián','Río Grande','Aldama','Herbalife','Novatos','Continental','Osasuna','Jaralillo F.C.']},
  {period:'2015–2016',category:'Liga / Intermedia / Veteranos',teams:['San Antonio Jr.','Malvinas','Tavera','La Cuadrilla','Centeno','Real Cerrito de Gasca','Halcones de Cuenda','Barza','Populares','Terrícolas','DHP','Dulces Nombres','Xolos Jaralillo','La Esperanza','Cuenda','Magisterio','Chelsea','Boavista','Picosos','Dynamo','UNAM','Hermanos','Valedores','Sección XIV','Guadalajara']},
  {period:'2015 · Jornada 13',category:'Veteranos',teams:['La Esperanza','Cuenda','Magisterio','Chelsea','Boavista','Picosos','Dynamo','UNAM','Hermanos','Valedores','Sección XIV','Guadalajara']},
  {period:'2015 · Jornada 20',category:'Intermedia',teams:['San Antonio Jr.','Malvinas','Tavera','La Cuadrilla','Centeno','Real Cerrito','Halcones','Barza','Populares','Terrícolas','DHP','Dulces Nombres','Xolos Jaralillo','Puros Cuates']},
  {period:'2016 · Jornada 5',category:'Veteranos · equipos identificados en tabla de goleo',teams:['Cuenda','Hermanos','Picosos','Magisterio','La Esperanza','Dynamo','Boavista','Valedores','UNAM','Cuenda Jr.']},
  {period:'2016–2017',category:'Fuerzas y Veteranos',teams:['Toros','Morales','Galeana','San Julián','Birds Eye Jr.','San José de Allende','Río Grande','Tecos','Portugal','San Antonio FC','Dortmund','A. Centeno','Puros Cuates','Oklahoma','Mazacotes','Real Cerrito de Gasca','Osasuna']},
  {period:'2017–2018',category:'Primera Fuerza',teams:['Olímpicos','A. Centeno','Hermanos','Juventus','Linces','La Esperanza','PSV','Boavista','La Cuadrilla','Puros Cuates','Napoli','Tavera','Malvinas','Chelsea','Abejas','San Antonio Jr.']},
  {period:'2017–2018',category:'Intermedia',teams:['Lobos CDG','Vatos Locos','Real DHP','San Antonio','Populares','Tecos','Oklahoma','Mineros','Titanes Tavera','La Huerta','Franco FC','Osasuna','Terrícolas','Barza','Mazacotes','Morales']},
  {period:'2018–2023',category:'Roles y tablas complementarias',teams:['Deportivo Maravillas','A. Pozos','Galaxy','Tapatío','Guadalupanos','Deportivo Pozos','Universidad','Valencia','Halcones','Galácticos FC','Sección 14','San Juan FC']},
  {period:'2022',category:'Veteranos · tabla final',teams:['Juventus','Hermanos','América','Dynamo','PSV','Deportivo Rafa','Boavista','Arsenal','Cuenda','Barrio Seco','UNAM','Átomos']},
  {period:'2019',category:'Veteranos · Final de Copa',teams:['Chelsea','La Esperanza']},
  {period:'2021',category:'Veteranos · Gran Final de Liga',teams:['La Esperanza','Real Cuenda']},
  {period:'2022',category:'Primera Fuerza · equipos identificados en resultado J19',teams:['Juventus','Lobos CDG']},
  {period:'2022',category:'Intermedia · resultados / ascenso / Copa documentados',teams:['La Huerta','Galaxy','Sección 14','A. Pozos','Populares','Barza']},
  {period:'2022',category:'Segunda Fuerza · resultado / campeón / ascenso documentados',teams:['Galácticos FC','San Juan FC','La Esperanza FC']},
  {period:'2022–2023',category:'Veteranos · Final de Copa',teams:['Juventus','Cuenda']},
  {period:'2023',category:'Veteranos · Gran Final de Liga',teams:['Juventus','América']},
  {period:'2023',category:'Segunda Fuerza · Gran Final de Liga',teams:['Titanes FC','Terrícolas SEDER']},
  {period:'2024',category:'Fuerza Intermedia · semifinal de vuelta documentada',teams:['A. San Julián','Lobos CDG','Herreras FC','Oklahoma']},
  {period:'2024',category:'Fuerza Intermedia / archivo reciente',teams:['A. San Julián','Lobos CDG','Herreras FC','Oklahoma','Atlético Galeana','Promesas FC','Franco FC','Mineros','Terrícolas','Juventus','Hermanos','Linces']},
  {period:'2025',category:'Veteranos 50+ · Liga / Campeón de Campeones',teams:['Boca Jrs.','Boavista','Manchester United','B.F.C.']},
  {period:'2025',category:'Primera Fuerza · Final de Copa',teams:['Galácticos (Pozos)','Herreras FC (Cuenda)']},
  {period:'2025',category:'Fuerza Intermedia · Final de Copa',teams:['Lobos CDG','Franco FC']},
  {period:'2025',category:'Veteranos 35+ · Final de Copa',teams:['Salvajes','Juventus']},
  {period:'2025–2026',category:'Finales, Copa y Veteranos conservados',teams:['Boca Jrs.','Boavista','Manchester United','B.F.C.','Galácticos (Pozos)','Herreras FC','Lobos CDG','Franco FC','Salvajes','Juventus','San Antonio Jrs.','Real de Roque','La Esperanza','La Canchita Deportes','Aldama FC']},
  {period:'2026 · temporada actual',category:'Veteranos 35+',teams:['C. de Gasca','Juventus','Cuenda','Pozos FC','Boavista','PSV','A. Santiago','F. Tavera','América','Huracán']},
  {period:'2026 · temporada actual',category:'Veteranos 50+',teams:['La Esperanza','Dynamo','Boca JRS','Toros de Cuenda','Boavista','Manchester']},
  {period:'2026 · temporada actual',category:'Primera Fuerza',teams:['Franco FC','Hermanos','Napoli','Herreras FC','Linces','Abejas','Lobos CDG','Juventus','San José FC','Terrícolas','Galácticos']},
  {period:'2026 · temporada actual',category:'Intermedia',teams:['Capibaras','Mazacotes FC','La Huerta','La Canchita Deportes','Populares','Malvinas','Promesas FC','La Cuadrilla','Dep. Maravillas','Atl. Galeana','San Antonio JRS','Osasuna','Aldama FC']},
  {period:'2026 · temporada actual',category:'Segunda Fuerza',teams:['Dep. Zapata','San Julián','Barza','San Juan FC','Tapatío','Dep. La Luz','Pachangas FC','San Antonio FC','Tavera FC','San José JRS','Célticos FC','Dep. Nopalero']}
];

/* V111 — catálogo total 2012+.
   Reúne todos los nombres encontrados en tablas, roles, publicaciones y temporada actual.
   No implica que sigan activos; sirve únicamente como archivo histórico. */
const allHistoricalTeams2012Plus=[...new Set(
  historicalTeamEras
    .filter(g=>!String(g.period).startsWith('1987'))
    .flatMap(g=>g.teams)
    .concat([
      'Real DHP','Vatos Locos','Tecos','Oklahoma','Mineros','Barza','San Antonio','Osasuna',
      'Mazacotes','Titanes Tavera','Morales','Populares','A. Centeno','Chelsea','La Cuadrilla',
      'PSV','Sección 14','Dep. Maravillas','La Esperanza FC','A. Pozos','Galaxy','San Juan FC',
      'Tapatío','Guadalupanos','Barrio Seco','UNAM','Átomos','Deportivo Rafa','Arsenal',
      'Olímpicos','Linces','Birds Eye','Puros Cuates','Dulces Nombres','Malvinas','Magisterio',
      'Picosos','Valedores','La Pandilla','El Alto','Xolos Jaralillo','Real Cerrito','DHP',
      'Halcones de Cuenda','Deportivo Pozos','Real Cerrito de Gasca','San José de la Montaña',
      'Río Grande','Unión Allende','Novatos','Salvajes','Continental','Toros','Aldama',
      'Pozos','San José de Allende','Atlas','Guadalajara','Sección XIV','La Pandilla de Rancho V.',
      'Dortmund','Portugal','Birds Eye Jr.','Centeno','Boca Jrs.','B.F.C.','Manchester United',
      'Galácticos (Pozos)','Herreras FC (Cuenda)','San Antonio Jrs.','Real de Roque',
      'PSV-Eindhoven','Barcelona','Chelse','Manchester','Halcones','Unión Allende',
      'Herbalife','Jaralillo','Jaralillo F.C.','Birds Eye','Birds Eye Jr.'
    ])
    .map(canonicalHistoricName)
)].sort((a,b)=>a.localeCompare(b,'es',{sensitivity:'base'}));

const historicalTravelNameCrosscheck={
  provenHistoricalTeams:['Pozos','Morales','San José de la Montaña','Real Cerrito de Gasca / Cerrito de Gasca','San Julián','Tavera','Cuenda / Halcones de Cuenda'],
  venueOnlyFromThisNotice:['Rincón de Centeno','Naranjillo','San Antonio de Romerillo','Santiago de Cuenda','Emiliano Zapata']
};
// Comunidades del listado de viáticos ya documentadas como equipos históricos se mantienen en el catálogo.
// Las demás se registran como sedes/comunidades hasta localizar una tabla, rol o publicación que pruebe un equipo homónimo.

const expandedRetroNames=[
  'Real DHP','Vatos Locos','Tecos','Oklahoma','Mineros','Barza','San Antonio','Osasuna',
  'Mazacotes','Titanes Tavera','Morales','Populares','A. Centeno','Chelsea','La Cuadrilla',
  'PSV','Sección 14','Dep. Maravillas','La Esperanza FC','A. Pozos','Galaxy','San Juan FC',
  'Tapatío','Guadalupanos','Barrio Seco','UNAM','Átomos','Deportivo Rafa','Arsenal',
  'Olímpicos','Linces','Birds Eye','Puros Cuates','Dulces Nombres','Malvinas','Magisterio','Picosos','Valedores','La Pandilla','El Alto','Xolos Jaralillo','Real Cerrito','DHP',
  'Halcones de Cuenda','Deportivo Pozos','Real Cerrito de Gasca','San José de la Montaña',
  'Río Grande','Unión Allende','Novatos','Salvajes','Continental','Toros','Aldama',
  'Aguilares','Merino','Santa María de Guadalupe','Pozos','San José de Allende','Atlas',
  'Guadalajara','Sección XIV','La Pandilla de Rancho V.','Dortmund','Portugal','Birds Eye Jr.','Centeno',
  'Boca Jrs.','B.F.C.','Manchester United','Galácticos (Pozos)','Herreras FC (Cuenda)','Lobos Jrs.','Lobos CDG','Franco FC','Salvajes','San Antonio Jrs.','Real de Roque'
];

const historicalTimeline=[
  {date:'1950 · memoria publicada en 2025',title:'Primer equipo de fútbol recordado por la Liga',detail:'En un reconocimiento publicado el 8 jun 2025, la Liga Municipal de Fútbol “Juventino Rosas” A.C. identifica al Prof. José Carmen Guerrero Velásquez como el único sobreviviente del primer equipo de fútbol formado en Juventino Rosas, GTO., en 1950. Es un antecedente del fútbol local, no una fecha probada de fundación de la A.C.'},
  {date:'15 sep 1953',title:'Antecedente del fútbol local',detail:'Una fuente histórica secundaria sitúa un primer partido de fútbol en Juventino Rosas entre Deportivo Santa Cruz y Deportivo Villagrán. Sirve como contexto del fútbol local, pero no demuestra la fundación ni continuidad jurídica de la Liga actual.'},
  {date:'oct 1987',title:'Boavista se organiza para entrar a Primera Fuerza',detail:'Una publicación retrospectiva de Golazo Liga del 28 nov 2012, hecha por el XXV aniversario del club, relata que estudiantes de la Preparatoria “Juventino Rosas” organizaron Boavista en octubre de 1987 para registrarlo en la Primera Fuerza de la Liga Municipal. En esa memoria se mencionan también Cuenda, Aguilares, San Julián, Merino, Santa María de Guadalupe y Pozos como equipos fuertes de comunidades. Es un dato de historia del club, no una fecha de fundación de la Liga.'},
  {date:'05 oct 2012',title:'Golazo Liga · primer registro digital localizado',detail:'La captura aportada muestra una publicación que Facebook presenta bajo el nombre Golazo Liga con fecha 5 de octubre de 2012 y con el escudo histórico de la Liga Municipal. Es la fecha digital mínima comprobable dentro del material conservado, no la fecha de fundación.'},
  {date:'05–18 nov 2013',title:'Tablas generales publicadas por Enrique Aboytes',detail:'El archivo conserva publicaciones de Enrique Aboytes en Golazo Liga con Tabla General de Segunda Fuerza, Tabla General de Primera Fuerza, descensos de Terrícolas y La Pandilla de Rancho Viejo a Fuerza Intermedia y avisos de finales de Primera y Segunda Fuerza.'},
  {date:'15 dic 2013',title:'Octavio Alberto García documenta la final de Segunda',detail:'Publicaciones de Octavio Alberto García en Golazo Liga registran a Real Cerrito de Gasca como campeón de Segunda Fuerza y muestran un marcador parcial de 3–0 sobre DHP al minuto 35.'},
  {date:'fecha por precisar',title:'Xavier Lara Valencia · roles de juego',detail:'Se incorpora como pista del archivo histórico por publicaciones de roles atribuidas a su actividad en Golazo Liga. Falta fijar las fechas, jornadas y equipos exactos con la publicación visual original; no se inventan esos datos mientras no estén visibles.'},
  {date:'feb 2014',title:'Administrador de Golazo Liga · fuente histórica',detail:'El usuario aporta otro perfil identificado como administrador de Golazo Liga en febrero de 2014. Se incorpora como pista para localizar roles, equipos, jornadas y resultados de esa etapa. La búsqueda web pública no permitió verificar directamente publicaciones indexadas del enlace compartido.'},
  {date:'may 2014',title:'Administrador de Golazo Liga · roles',detail:'El usuario aporta un perfil que identifica como administrador de Golazo Liga en mayo de 2014 y señala que publicaba roles de juego. Se registra como fuente histórica aportada y pista para reconstruir calendarios, equipos y jornadas de esa etapa; el enlace compartido no pudo verificarse de forma independiente fuera de Facebook.'},
  {date:'c. 2015',title:'Administrador conocido de Golazo Liga',detail:'El usuario identifica un perfil como administrador de Golazo Liga hacia 2015. Es una pista útil para reconstruir publicaciones y dirigentes, pero el cargo de presidente de la Liga no queda probado solo por administrar la página.'},
  {date:'24 may 2016',title:'Acuerdo interno de la Liga',detail:'El reglamento vigente conserva el antecedente de un acuerdo de asamblea del 24 de mayo de 2016 relacionado con el proyecto de construcción de nuevas oficinas.'},
    {date:'28 feb 2016',title:'La Esperanza · campeón de Veteranos 2016',detail:'El material aportado registra la entrega del premio en efectivo a La Esperanza como campeón de la categoría Veteranos.',image:HIST_ROOT+'assets/official-logos/la-esperanza.png'},
  {date:'28 feb 2016',title:'Malvinas · Campeón de Campeones de Intermedia',detail:'Publicación aportada por el usuario identifica a Malvinas como campeón de Campeones de la categoría Intermedia. El subcampeón queda pendiente.',image:HIST_ROOT+'assets/official-logos/malvinas.png'},
  {date:'27 mar 2016',title:'Campeón de Campeones · Segunda Fuerza 2016',detail:'Existe publicación de Campeón de Campeones de Segunda Fuerza, pero el texto aportado no identifica al equipo ganador.'},
  {date:'23 mar 2016',title:'Extensión del Torneo de Copa · Primera Fuerza',detail:'Se invitó a los equipos de Primera Fuerza que no calificaron a liguilla a participar en un torneo corto con trofeo, bajo reglas del Torneo de Copa. Se aclaró que un jugador participante no podría jugar con otro equipo distinto en la temporada 2016–2017.'},
  {date:'09 jul 2016',title:'Magisterio · campeón de Copa 2016',detail:'Publicación histórica aportada por el usuario felicita explícitamente a Magisterio como campeón de Copa. La categoría no aparece en el texto aportado.'},
  {date:'09 jun 2018',title:'Magisterio · campeón 2018',detail:'Publicación histórica aportada por el usuario felicita a Magisterio como campeón; el torneo y la categoría no aparecen especificados en el texto aportado.'},
{date:'2018',title:'Tablas y goleadores históricos',detail:'El archivo conserva cortes de Primera e Intermedia con equipos, puntos y goleadores de la categoría libre.'},
    {date:'09 jul–16 sep 2019',title:'La Pandilla de Morales y Linces Jr. · campeones y ascensos',detail:'La Pandilla de Morales fue publicada como primer lugar de la tabla general del Torneo de Liga 2018–2019 y con ascenso a Primera Fuerza. Linces Jr. fue líder general y logró ascenso a Fuerza Intermedia. El 16 sep 2019 una publicación felicitó a ambos como campeones de Liga 2018–2019.'},
  {date:'2019 · fecha exacta pendiente',title:'La Esperanza vs Deportivo Lagartos · partido suspendido',detail:'El usuario aporta un aviso que señala que el partido de Veteranos entre La Esperanza y Deportivo Lagartos fue suspendido por el mal estado de la cancha de Tavera. El texto aportado no fija una fecha independiente para este aviso.'},
  {date:'22 jun 2019',title:'La Esperanza · Campeón de Campeones de Veteranos 2019',detail:'Publicación histórica aportada por el usuario felicita a La Esperanza como campeón de Campeones de la categoría Veteranos.',image:HIST_ROOT+'assets/official-logos/la-esperanza.png'},
  {date:'17 nov 2019',title:'PSV · campeón de Copa de Veteranos 2019',detail:'Publicación histórica aportada por el usuario identifica a PSV como campeón de Copa 2019 de Veteranos.',image:HIST_ROOT+'assets/teams/psv.webp'},
  {date:'19 ene 2020',title:'El Alto · campeón de Copa de Fuerza Intermedia',detail:'Publicación histórica aportada por el usuario identifica a El Alto como campeón de Copa de Fuerza Intermedia.'},
{date:'03 nov 2019',title:'Juventus campeón de Liga',detail:'Publicaciones históricas de Golazo Liga identifican a Juventus como campeón y a Boavista como subcampeón de la Liga 2018–2019.'},
    {date:'12 nov 2019',title:'Convocatoria de la temporada 2019–2020',detail:'La Liga Municipal de Fútbol “Juventino Rosas A.C.” emitió convocatoria para Primera, Intermedia y Segunda. El campeonato iniciaría el domingo 8 de diciembre; las inscripciones cerrarían el martes 26 de noviembre a las 19:00 en la Unidad Deportiva Sur y la junta previa se fijó para el martes 3 de diciembre a las 19:00. El registro admitía un máximo de 26 jugadores.'},
{date:'dic 2019',title:'Nombre reconocido en un documento público',detail:'Un reporte del Congreso del Estado de Guanajuato registra “LIGA MUNICIPAL JUVENTINO ROSAS” por $11,600 dentro de apoyos para construcción y reparación. Es una evidencia externa importante de continuidad del nombre institucional.'},
  {date:'2022',title:'Veteranos · tabla final',detail:'El archivo conserva una tabla final de Veteranos con Juventus en primer lugar con 53 puntos.'},
  {date:'04–16 feb 2025',title:'Herreras FC y Lobos Jrs. · Torneos Relámpago',detail:'El 9 feb 2025 Herreras FC fue campeón del Torneo Relámpago de Fuerza Intermedia ante Oklahoma. El 16 feb 2025 Lobos Jrs. fue campeón del Torneo Relámpago de Segunda Fuerza.'},
  {date:'mar–may 2024',title:'Linces y Boca Jrs. · campeones',detail:'La Pupila documentó a Linces campeón de Copa tras vencer 3–2 a Hermanos FC; Juventino Rosas Liga confirmó después que pertenecía a Primera Fuerza. El 4 may 2024 Boca Jrs. de Cuenda se impuso a Manchester y ganó la Liga de Veteranos 50 y más.'},
  {date:'12 abr 2025',title:'Boavista campeón de Liga · Veteranos 50+',detail:'La final publicada fue Boca Jrs. vs Boavista, 16:00, Campo 1. La publicación del mismo día identifica a Boavista F C como campeón 2025.'},
  {date:'08–15 jun 2025',title:'Campeones de Copa y reconocimientos históricos',detail:'Galácticos (Pozos) fue publicado campeón de Copa de Primera Fuerza ante Herreras FC; Lobos CDG fue felicitado como campeón de Copa ante Franco FC. En esas fechas la Liga también reconoció las trayectorias de José Carmen Guerrero Velásquez, Gabriel Roque Hortelano y Juan Morales Vásquez “Chacharín”.'},
  {date:'20 dic 2025',title:'Final de Copa · Veteranos 35+',detail:'El archivo conserva Salvajes vs Juventus, 15:30, Campo 1 de la Unidad Deportiva Sur. El resultado no se atribuye sin una publicación posterior legible.'},
  {date:'2026',title:'Continuidad pública de la denominación',detail:'Medios regionales y nacionales siguieron refiriéndose a la competencia como Liga Municipal de Juventino Rosas, reforzando la continuidad pública del nombre.'},
  {date:'2026–2027',title:'Reglamento vigente',detail:'El reglamento usa la forma Liga Municipal de Fútbol “Juventino Rosas A.C.” y describe una Asamblea y Mesa Directiva propias, además de Copa, Liga, Campeón de Campeones, categoría libre y Veteranos 35+ / 50+.'}
];

const refereeTravelAllowances=[
  {place:'Rincón de Centeno',fee:90},
  {place:'Pozos',fee:90},
  {place:'Morales',fee:90},
  {place:'San José de la Montaña',fee:90},
  {place:'Cerrito de Gasca',fee:90},
  {place:'San Julián',fee:90},
  {place:'Naranjillo',fee:90},
  {place:'San Antonio de Romerillo',fee:70},
  {place:'Santiago de Cuenda',fee:70},
  {place:'Tavera',fee:70},
  {place:'Emiliano Zapata',fee:70}
];
const refereeTravelRule='Si el mismo árbitro dirige dos partidos en la misma comunidad, el viático de $90 o $70 se divide entre los cuatro equipos. Cuando un equipo juega como local en esa cancha foránea, cubre el costo completo; si ninguno es local, los equipos que juegan ahí cubren el gasto en partes iguales.';

const currentCompetitionFormat=[
  {title:'Categoría libre · domingo',detail:'La rama libre se organiza por fuerzas: Primera, Intermedia y Segunda. El torneo de Liga se juega a dos vueltas y los ocho mejores entran a liguilla.'},
  {title:'Veteranos · sábado',detail:'Veteranos 35+ y 50+ se programan los sábados, normalmente por la tarde. Es una rama distinta de la categoría libre.'},
  {title:'Copa · categoría libre',detail:'Una vuelta y un grupo por fuerza. Clasifican cuatro: 1 vs 4 y 2 vs 3; semifinal y final a un partido.'},
  {title:'Liga · categoría libre',detail:'Dos vueltas; los ocho primeros entran a liguilla. Cuartos y semifinales son a dos juegos; la final es a un partido.'},
  {title:'Veteranos 35+',detail:'Un grupo, dos vueltas y ocho clasificados: 1 vs 8, 2 vs 7, 3 vs 6 y 4 vs 5.'},
  {title:'Veteranos 50+',detail:'La cantidad de enfrentamientos se acuerda en asamblea y los dos mejores de la tabla general pasan a la final.'},
  {title:'Desempates',detail:'Diferencia de goles, goles anotados, menos goles recibidos, enfrentamiento directo y disciplina.'},
  {title:'Final y Campeón de Campeones',detail:'La final es a un partido; empate: tiempos extra y penales. Campeón de Campeones enfrenta al campeón de Copa con el de Liga; si es el mismo equipo, el nombramiento es automático.'}
];

const archiveMethod=[
  'Esta Historia corresponde únicamente a la Liga adulta: categoría libre y Veteranos.',
  'La denominación institucional mejor documentada es “Liga Municipal de Futbol Juventino Rosas A.C.”; Golazo Liga está documentado como identidad digital histórica, no como razón social probada.',
  'La Liga funciona con Asamblea y Mesa Directiva propias. La evidencia disponible respalda autonomía deportiva frente a Presidencia Municipal y COMUDE, aunque la personalidad jurídica y fecha de constitución de la A.C. requieren el acta constitutiva o registro.',
  'Se excluye material de ligas Pony, infantiles, juveniles y otras competencias municipales que no pertenecen a esta organización.',
  'Se acepta como campeón cuando una publicación, tabla, álbum, texto o imagen de la Liga o de sus administradores lo identifica como campeón.',
  'Administrar una página de Facebook no equivale automáticamente a haber sido presidente de la Liga; esos cargos se documentan por separado.',
  'Los equipos antiguos se conservan en Historia y no se mezclan con los equipos activos de la temporada actual.',
  'Un nombre incluido en el listado de viáticos identifica una comunidad o sede de juego; por sí solo no demuestra que exista o haya existido un equipo con ese mismo nombre.'
];

const institutionalHistoryFacts=[
  {tag:'NOMBRE INSTITUCIONAL',title:'Liga Municipal de Futbol Juventino Rosas A.C.',detail:'Coincide en el logotipo histórico aportado y en el reglamento 2026–2027. Es la denominación institucional mejor documentada.'},
  {tag:'IDENTIDAD DIGITAL',title:'Golazo Liga',detail:'La presencia de Facebook está documentada al menos desde el 5 de octubre de 2012. La interpretación más consistente es que fue una página, alias o proyecto de difusión de la Liga.'},
  {tag:'FUNDACIÓN',title:'Fecha todavía no demostrada',detail:'2012 no debe mostrarse como año de fundación. Tampoco están demostrados el fundador, el primer presidente ni la fecha exacta de constitución de la A.C.'},
  {tag:'AUTONOMÍA',title:'Gobierno interno propio',detail:'El reglamento actual describe Asamblea de equipos y Mesa Directiva electa dentro de la propia Liga. Las autoridades municipales aparecen como interlocutores externos para gestiones, no como dirección interna.'},
  {tag:'EVIDENCIA EXTERNA',title:'Congreso de Guanajuato · 2019',detail:'El reporte público de diciembre de 2019 registra “LIGA MUNICIPAL JUVENTINO ROSAS” y un apoyo de $11,600 para construcción y reparación.'},
  {tag:'CONTINUIDAD PÚBLICA',title:'Medios · 2026',detail:'Notas de 2026 siguen utilizando “Liga Municipal de Juventino Rosas”, en línea con el nombre institucional actual.'},
  {tag:'ANTECEDENTE LOCAL',title:'Primer equipo recordado en 1950',detail:'La propia Liga publicó en 2025 un reconocimiento que sitúa un primer equipo de fútbol de Juventino Rosas en 1950 y nombra al Prof. José Carmen Guerrero Velásquez como su único sobreviviente. No equivale a fecha de fundación de la A.C.'},
  {tag:'ANTECEDENTE LOCAL',title:'Partido documentado en 1953',detail:'Una efeméride secundaria registra un partido Deportivo Santa Cruz vs Deportivo Villagrán el 15 de septiembre de 1953. Puede convivir con la memoria del equipo de 1950 y tampoco prueba continuidad legal con la Liga actual.'}
];

const openHistoricalQuestions=[
  'Fecha exacta de fundación o constitución de la Liga Municipal de Fútbol Juventino Rosas A.C.',
  'Fundador o fundadores y primera Mesa Directiva.',
  'Primer presidente de la Liga.',
  'Si existió una página o presencia digital anterior a Golazo Liga antes de 2012.',
  'Si la A.C. tuvo una denominación legal diferente en alguna etapa.',
  'Cadena completa de presidentes y periodos anteriores.',
  'Cruzar los roles y publicaciones de febrero y mayo de 2014 con otras fuentes para identificar equipos, jornadas, dirigentes y temporadas con mayor precisión.',
  'Localizar y fechar los roles publicados por Xavier Lara Valencia en Golazo Liga para recuperar jornadas, horarios, campos y equipos sin depender de memoria o inferencia.'
];

const videos=[
  {image:ASSETS.videoA,duration:'',title:'Archivo audiovisual de la Liga'},
  {image:ASSETS.videoB,duration:'',title:'Momentos de la Liga Municipal'},
  {image:ASSETS.videoC,duration:'',title:'Fútbol de Juventino Rosas'}
];

const titleRows=[];

let activeTab='Resumen';
let v35ScrollRaf=0;

function scrollTop(){
  return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
}
function syncHistoryCollapse(){
  if(route()!=='history') return;
  const root=document.querySelector('.v35-history-page');
  const tabs=root?.querySelector('.v35-tabs');
  const compact=root?.querySelector('.v35-compact-bar');
  if(!root||!tabs||!compact) return;

  const compactHeight=compact.getBoundingClientRect().height || 78;
  const pageTop=root.getBoundingClientRect().top + scrollTop();
  const tabsNaturalTop=pageTop + tabs.offsetTop;
  const trigger=Math.max(72,tabsNaturalTop-pageTop-compactHeight);
  const y=Math.max(0,scrollTop()-pageTop);
  const p=Math.max(0,Math.min(1,y/trigger));

  root.style.setProperty('--v35-collapse',p.toFixed(4));
  root.style.setProperty('--v35-compact-h',compactHeight+'px');
  root.classList.toggle('is-compact',y>=trigger-2);
}
function scheduleHistoryCollapse(){
  if(v35ScrollRaf) return;
  v35ScrollRaf=requestAnimationFrame(()=>{
    v35ScrollRaf=0;
    syncHistoryCollapse();
    removeObsoleteManchesterDuplicate(screen);
  });
}

function route(){
  return (location.hash.replace(/^#\//,'')||'home').split('?')[0];
}
function esc(s){
  return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}
function shareSvg(){
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="2.1"/><circle cx="6" cy="12" r="2.1"/><circle cx="18" cy="19" r="2.1"/><path d="m8 11 8-5M8 13l8 5"/></svg>';
}
function playSvg(){
  return '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="20"/><path d="m20 16 13 8-13 8z"/></svg>';
}
function trophySvg(){
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4h8v4.5c0 3-1.7 5.1-4 6.2-2.3-1.1-4-3.2-4-6.2V4Z"/><path d="M8 6H4v2c0 2.3 1.3 3.9 3.5 4.4M16 6h4v2c0 2.3-1.3 3.9-3.5 4.4M12 14.7V19M8.5 21h7"/></svg>';
}
function linesSvg(){
  return '<svg class="v35-history-lines" viewBox="0 0 430 360" preserveAspectRatio="none" aria-hidden="true"><g fill="none" stroke="currentColor"><path d="M-30 60 63 19l84 47-16 84-92 20-69-50Z"/><path d="m147 66 83-44 74 47-24 85-89 10-60-14Z"/><path d="m304 69 83-30 73 58-28 82-92 8-60-33Z"/><path d="m39 170 92-20 60 14 29 75-58 66-100-9-49-70Z"/><path d="m191 164 89-10 60 33 7 78-68 49-97-9-20-70Z"/></g></svg>';
}
function seasonCards(){
  return seasons.map((s,i)=>'<button class="v35-season-card" type="button" data-v35-season="'+i+'" aria-label="Temporada '+esc(s.label)+'"><span class="v35-season-crest"><img src="'+s.crest+'" alt="'+esc(s.alt)+'" loading="lazy" decoding="async"></span><span class="v35-season-label">'+esc(s.label)+'</span></button>').join('');
}
function featureCard(){
  return '<article class="v35-feature-card"><img class="v35-feature-photo" src="'+ASSETS.feature+'" alt="" loading="eager" decoding="async"><img class="v35-feature-trophy" src="'+ASSETS.trophy+'" alt="" loading="eager" decoding="async"><span class="v35-feature-shade"></span><div class="v35-feature-copy"><h2>La historia de<br>nuestra Liga</h2><p>Liga Municipal de Fútbol<br>Juventino Rosas</p></div><button class="v35-share" type="button" data-v35-share aria-label="Compartir historia">'+shareSvg()+'</button></article>';
}
function videosRow(){
  return '<div class="v35-video-carousel" aria-label="Partidos clásicos">'+videos.map((v,i)=>'<button class="v35-video-card" type="button" data-v35-video="'+i+'"><span class="v35-video-thumb"><img src="'+v.image+'" alt="" loading="lazy" decoding="async"><span class="v35-video-duration">'+v.duration+'</span><span class="v35-video-play">'+playSvg()+'</span></span><span class="v35-video-title">'+esc(v.title)+'</span></button>').join('')+'</div>';
}
function historicalSourcesBlock(){
  return '<section class="v35-history-sources">'+
    '<div class="v35-section-row"><h2>Fuentes de temporadas anteriores</h2></div>'+
    '<p class="v35-history-scope">Los equipos que ya no participan se conservan únicamente dentro de Historia. No se agregan a Equipos, clasificación, calendarios ni estadísticas de la temporada actual.</p>'+
    '<div class="v35-history-source-list">'+historicalSources.map((s,i)=>
      '<button type="button" class="v35-history-source-card" data-v35-history-source="'+i+'">'+
        '<span class="v35-history-source-icon">▶</span>'+
        '<span><b>'+esc(s.title)+'</b><small>'+esc(s.note)+'</small></span>'+
        '<em>Abrir</em>'+
      '</button>'
    ).join('')+'</div>'+
  '</section>';
}

const HISTORY_MONTH_INDEX={ene:0,feb:1,mar:2,abr:3,may:4,jun:5,jul:6,ago:7,sep:8,sept:8,oct:9,nov:10,dic:11};
function historyDateSortValue(value){
  const raw=String(value||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,' ').replace(/\s+/g,' ').trim();
  if(!raw) return -Infinity;
  const exact=raw.match(/\b(\d{1,2})\s+(ene|feb|mar|abr|may|jun|jul|ago|sep|sept|oct|nov|dic)\s+(19\d{2}|20\d{2})\b/);
  if(exact){
    const day=Number(exact[1]),month=HISTORY_MONTH_INDEX[exact[2]],year=Number(exact[3]);
    return Date.UTC(year,month,day);
  }
  const years=[...raw.matchAll(/\b(19\d{2}|20\d{2})\b/g)].map(m=>Number(m[1]));
  if(years.length) return Date.UTC(Math.max(...years),0,1);
  return -Infinity;
}
function historyNewestFirst(list,field){
  return list.map((item,index)=>({item,index,stamp:historyDateSortValue(item?.[field])}))
    .sort((a,b)=>(b.stamp-a.stamp)||(a.index-b.index))
    .map(x=>x.item);
}

function v242JuventusChampionCard(m){
  const src=JUVENTUS_2024_PHOTO;
  return '<article class="v35-history-moment v35-history-moment-photo v242-juventus-card" data-v242-juventus>'+
    '<img class="v35-history-bg-photo v35-bg-exact" src="'+src+'" alt="Juventus · Campeón de Campeones · 21 sep 2024" loading="eager" decoding="async" style="object-fit:cover;object-position:center 44%;">'+
    '<div class="v35-history-moment-shade" aria-hidden="true"></div>'+
    '<div class="v35-history-moment-content">'+
      '<div class="v35-history-meta"><span class="v35-history-kind">'+esc(m.kind)+'</span><time class="v35-history-date">'+esc(m.date)+'</time></div>'+
      '<h3>'+esc(m.title)+'</h3>'+
      '<strong>'+esc(m.subtitle)+'</strong>'+
      '<div class="v35-history-status"><span><b>Ganador</b>'+esc(m.winner||m.title)+'</span><span><b>Temporada</b>'+esc(m.season||'2024')+'</span></div>'+
      '<p>'+esc(m.detail)+'</p>'+
    '</div>'+
  '</article>';
}
function v242IsJuventusChampion(m){
  const n=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  return n(m?.title)==='juventus' && n(m?.date).includes('21 sep 2024');
}

function v246TerricolasChampionCard(m){
  const src='/App-liga-/assets/history/archive-v254/terricolas-seder-campeon-copa-18-sep-2022.webp?v=20260923-terricolas-hardfix-v255';
  return '<article class="v35-history-moment v35-history-moment-photo v246-terricolas-card" data-v246-terricolas style="background-color:#07075d!important;background-image:linear-gradient(180deg,rgba(3,6,50,.02),rgba(3,6,50,.18) 58%,rgba(3,6,50,.64)),url(&quot;'+src+'&quot;)!important;background-size:cover!important;background-position:center 42%!important;background-repeat:no-repeat!important;">'+
    '<img class="v35-history-bg-photo v35-bg-exact" src="'+src+'" alt="Terrícolas SEDER · Campeón de Copa · Segunda Fuerza · 18 sep 2022" loading="eager" decoding="async" style="position:absolute!important;inset:0!important;width:100%!important;height:100%!important;display:block!important;visibility:visible!important;opacity:1!important;z-index:0!important;object-fit:cover!important;object-position:center 42%!important;background:transparent!important;">'+
    '<div class="v35-history-moment-shade" aria-hidden="true"></div>'+
    '<div class="v35-history-moment-content">'+
      '<div class="v35-history-meta"><span class="v35-history-kind">'+esc(m.kind)+'</span><time class="v35-history-date">'+esc(m.date)+'</time></div>'+
      '<h3>'+esc(m.title)+'</h3>'+
      '<strong>'+esc(m.subtitle)+'</strong>'+
      '<div class="v35-history-status"><span><b>Ganador</b>'+esc(m.winner||m.title)+'</span><span><b>Temporada</b>'+esc(m.season||'2022')+'</span></div>'+
      '<p>'+esc(m.detail)+'</p>'+
    '</div>'+
  '</article>';
}
function v261UniversidadChampionCard(m){
  const photo='data:image/webp;base64,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';
  return '<article class="v35-history-moment v35-history-moment-photo v264-universidad-2013 v289-universidad-fixed" data-v264-universidad-2013 data-v289-universidad-fixed="1" '+
    'style="position:relative!important;overflow:hidden!important;isolation:isolate!important;background:#07106f!important;">'+
    '<div aria-hidden="true" class="v289-universidad-bg" style="display:block!important;position:absolute!important;inset:0!important;width:100%!important;height:100%!important;z-index:0!important;opacity:1!important;visibility:visible!important;background-image:url('+photo+')!important;background-size:cover!important;background-position:center 46%!important;background-repeat:no-repeat!important;filter:none!important;transform:none!important;"></div>'+
    '<div aria-hidden="true" class="v289-universidad-overlay" style="display:block!important;position:absolute!important;inset:0!important;z-index:1!important;background:linear-gradient(180deg,rgba(2,7,55,.08) 0%,rgba(2,7,55,.16) 35%,rgba(2,7,55,.58) 72%,rgba(2,7,55,.82) 100%),linear-gradient(90deg,rgba(2,7,55,.30),rgba(2,7,55,.03))!important;pointer-events:none!important;"></div>'+
    '<div class="v35-history-moment-content" style="position:relative!important;z-index:2!important;width:100%!important;background:transparent!important;">'+
      '<div class="v35-history-meta"><span class="v35-history-kind">CAMPEÓN</span><time class="v35-history-date">09 mar 2013</time></div>'+
      '<h3>Universidad</h3>'+
      '<strong>Campeón de Veteranos · Final vs Dinamo · Unidad Deportiva Sur · 16:00</strong>'+
      '<div class="v35-history-status"><span><b>Ganador</b>Universidad</span><span><b>Temporada</b>2013</span></div>'+
      '<p>Dato e imagen aportados por el usuario: Universidad ganó la final de Veteranos frente a Dinamo el sábado 9 de marzo de 2013 en la Unidad Deportiva Sur. La fotografía corresponde al equipo campeón con el trofeo.</p>'+
    '</div>'+
  '</article>';
}
function v261IsUniversidadChampion(m){
  const n=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  return n(m?.title)==='universidad' && n(m?.date).includes('09 mar 2013');
}

function v246IsTerricolasChampion(m){
  const n=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  return n(m?.title)==='terricolas seder' && n(m?.date).includes('18 sep 2022');
}


function historyMomentCard(m){
  if(v261IsUniversidadChampion(m)) return v261UniversidadChampionCard(m);
  if(v246IsTerricolasChampion(m)) return v246TerricolasChampionCard(m);
  if(v242IsJuventusChampion(m)) return v242JuventusChampionCard(m);
  const esperanzaBgClass=(m.title==='La Esperanza'&&m.date==='08 nov 2025')?' v225-esperanza-bg':'';
  const manchester2024BgClass=(m.title==='Manchester'&&m.date==='09 nov 2024')?' v240-manchester-2024-bg':'';
  const psv2019BgClass=(m.title==='PSV'&&m.date==='17 nov 2019')?' v249-psv2019-card':'';
  const abejas2014Class=(m.winner==='Abejas Pozos'&&m.date==='22 feb 2014')?' v286-abejas-2014-final':'';
  const championBg=m.kind==='CAMPEÓN'?championBackground(m.title,m.backgroundPhoto||''):null;
  const hasBg=!!(championBg?.url||m.backgroundPhoto);
  const bgExact=!!championBg?.exact;
  return '<article class="v35-history-moment '+(hasBg?'v35-history-moment-photo ':'')+((hasBg&&!bgExact)?'v35-history-moment-reference':'')+esperanzaBgClass+manchester2024BgClass+psv2019BgClass+abejas2014Class+'">'+
    (m.kind==='CAMPEÓN'?championBgImg(m.title,m.backgroundPhoto||'',m.season||m.date,'v35-history-bg-photo'):(m.backgroundPhoto?'<img class="v35-history-bg-photo v35-bg-exact" src="'+m.backgroundPhoto+'" alt="'+esc(m.title)+' · archivo histórico" loading="lazy" decoding="async">':''))+
    '<div class="v35-history-moment-shade" aria-hidden="true"></div>'+
    '<div class="v35-history-moment-content">'+

      '<div class="v35-history-meta"><span class="v35-history-kind">'+esc(m.kind)+'</span>'+(m.date?'<time class="v35-history-date">'+esc(m.date)+'</time>':'')+'</div>'+
      '<h3>'+esc(m.title)+'</h3>'+
      '<strong>'+esc(m.subtitle)+'</strong>'+
      ((m.winner||m.season)?'<div class="v35-history-status">'+
        (m.winner?'<span class="'+(m.trophy?'v286-winner-with-trophy':'')+'">'+(m.trophy?'<img class="v286-winner-trophy" src="'+esc(m.trophy)+'" alt="" aria-hidden="true">':'')+'<b>Ganador</b>'+esc(m.winner)+'</span>':'')+
        (m.season?'<span><b>Temporada</b>'+esc(m.season)+'</span>':'')+
      '</div>':'')+
      '<p>'+esc(m.detail)+'</p>'+
    '</div>'+
  '</article>';
}
function historyMomentCards(){
  const featured=historyNewestFirst(historyMoments.filter(m=>!m.archiveOnly),'date');
  return '<div class="v35-history-moments">'+featured.map(historyMomentCard).join('')+'</div>';
}
function retroClubCards(){
  return '<div class="v35-retro-clubs">'+retroClubs.map(c=>
    '<article class="v35-retro-club">'+
      '<span class="v35-retro-logo"><img src="'+c.logo+'" alt="'+esc(c.name)+'" loading="lazy" decoding="async"></span>'+
      '<span class="v35-retro-copy"><b>'+esc(c.name)+'</b><small>'+esc(c.note)+'</small></span>'+
    '</article>'
  ).join('')+'</div>'+
  '<div class="v35-retro-names">'+retroNames.map(n=>'<span>'+esc(n)+'</span>').join('')+'</div>';
}

function historicalGoalsBlock(){
  return '<div class="v35-history-goals">'+
    '<div class="v35-history-subhead"><span>GOLES POR EQUIPO</span><h3>Goles identificados en los registros históricos</h3><p>Cuando la tabla conserva el total de goles a favor (GF), se mostrará como total del equipo. Cuando solo se recuperó una tabla de goleadores, se muestra únicamente la suma comprobable de los jugadores visibles para no inventar el total del club.</p></div>'+
    '<div class="v35-team-goals-grid">'+historicTeamGoalRecords.map(x=>'<article class="v35-team-goal-card"><div class="v35-team-goal-top"><span>'+esc(x.season)+'</span><strong>'+esc(x.identifiedGoals)+'</strong></div><h4>'+esc(x.team)+'</h4><small>'+esc(x.category)+' · '+esc(x.players)+' jugador'+(x.players===1?'':'es')+' identificado'+(x.players===1?'':'s')+'</small><p>'+esc(x.note)+'</p></article>').join('')+'</div>'+
    '<div class="v35-history-subhead"><span>GOLES POR JUGADOR</span><h3>Goleadores recuperados por temporada</h3><p>Se mantiene el año, la categoría, el equipo y el total visible de goles de cada jugador.</p></div>'+
    '<figure class="v35-scorer-reference"><img src="'+HIST_MEDIA+'premiacion-historica.jpg" alt="Premiación histórica de la Liga" loading="lazy" decoding="async"><figcaption>Foto de premiación del archivo histórico. Se usa como referencia visual; no se asigna la identidad de un goleador sin confirmación documental.</figcaption></figure>'+
    '<div class="v35-scorer-history">'+historicScorers.map((x,i)=>'<article><span>#'+(i+1)+'</span><div><b>'+esc(x.player)+'</b><small>'+esc(x.team)+' · '+esc(x.season)+' · '+esc(x.category)+'</small></div><strong>'+esc(x.value)+'</strong></article>').join('')+'</div>'+
  '</div>';
}

function historyYearKey(period){
  const m=String(period||'').match(/\b(20\d{2})\b/);
  return m?m[1]:String(period||'Sin año');
}
function teamDirectoryCard(n){
  const display=canonicalHistoricName(n),logo=historicLogo(display);
  return '<article class="v35-era-team">'+(logo?'<img src="'+logo+'" alt="'+esc(display)+'" loading="lazy" decoding="async">':'<span class="v35-era-fallback">'+esc(historicInitials(display))+'</span>')+'<b>'+esc(display)+'</b></article>';
}
function historicalTeamDirectoryHtml(){
  const groups=historicalTeamEras.filter(g=>/^20\d{2}/.test(String(g.period||'')));
  const byYear=new Map();
  groups.forEach(g=>{
    const year=historyYearKey(g.period);
    if(!byYear.has(year))byYear.set(year,[]);
    byYear.get(year).push(g);
  });
  const assigned=new Set(groups.flatMap(g=>g.teams||[]).map(n=>histTeamKey(canonicalHistoricName(n))));
  const unplaced=allHistoricalTeams2012Plus.filter(n=>!assigned.has(histTeamKey(canonicalHistoricName(n))));
  const years=[...byYear.entries()].sort((a,b)=>Number(a[0])-Number(b[0]));
  let html='<div class="v35-year-directory">';
  years.forEach(([year,parts])=>{
    const appearances=parts.reduce((sum,p)=>sum+(p.teams||[]).length,0);
    html+='<section class="v35-year-block"><header class="v35-year-head"><div><span>AÑO</span><h4>'+esc(year)+'</h4></div><b>'+appearances+' apariciones</b></header>';
    parts.forEach(p=>{
      html+='<div class="v35-category-block"><div class="v35-category-head"><span>'+esc(p.category)+'</span><small>'+esc(p.period)+'</small><b>'+(p.teams||[]).length+' equipos</b></div><div class="v35-era-team-grid">'+(p.teams||[]).map(teamDirectoryCard).join('')+'</div></div>';
    });
    html+='</section>';
  });
  if(unplaced.length){
    html+='<section class="v35-year-block v35-year-pending"><header class="v35-year-head"><div><span>ARCHIVO COMPLEMENTARIO</span><h4>Año/categoría por precisar</h4></div><b>'+unplaced.length+' nombres</b></header><div class="v35-category-block"><div class="v35-category-head"><span>Registro encontrado, ubicación exacta pendiente</span><small>No se asigna un año o categoría sin una fuente visible.</small></div><div class="v35-era-team-grid">'+unplaced.map(teamDirectoryCard).join('')+'</div></div></section>';
  }
  return html+'</div>';
}

function verifiedHistoryBlocks(){
  return '<div class="v35-verified-history">'+
    '<div class="v35-history-subhead"><span>CAMPEONES CONFIRMADOS</span><h3>Palmarés verificado en el archivo</h3></div>'+
    '<div class="v35-champion-list">'+historyNewestFirst(verifiedChampions,'season').map(x=>{
      const bg=championBackground(x.champion,x.photo||'');
      return '<article class="v35-champion-card v35-champion-card-photo '+(!bg.exact?'v35-champion-card-reference':'')+'">'+
        championBgImg(x.champion,x.photo||'',x.season,'v35-champion-bg-photo')+'<span class="v35-champion-shade" aria-hidden="true"></span>'+
        '<div class="v35-champion-content">'+

          '<span class="v35-champion-date">'+esc(x.season)+'</span><h4>'+esc(x.champion)+'</h4><b>'+esc(x.competition)+'</b><p>'+(x.runner&&x.runner!=='—'?'Subcampeón: '+esc(x.runner)+'. ':'')+esc(x.source)+'</p>'+
        '</div></article>';
    }).join('')+'</div>'+
    '<div class="v35-history-subhead"><span>FOTOS DE CAMPEONES Y TROFEOS</span><h3>Archivo visual recuperado</h3><p>Fotografías reales conservadas en el archivo de la Liga. Se muestran debajo del palmarés sin modificar la parte superior de Historia.</p></div>'+
    '<div class="v35-champion-list v35-photo-archive">'+historyNewestFirst(historicalPhotoArchive.filter(x=>x.image),'date').map(x=>'<article class="v35-champion-card"><img class="v35-champion-photo" src="'+x.image+'" alt="'+esc(x.title)+'" loading="lazy" decoding="async"><span>'+esc(x.date)+'</span><h4>'+esc(x.title)+'</h4><p>'+esc(x.detail)+'</p></article>').join('')+'</div>'+
    historicalGoalsBlock()+

    '<div class="v35-history-subhead"><span>EQUIPOS HISTÓRICOS</span><h3>Equipos encontrados en tablas, roles, publicaciones y archivo</h3><p>Se agrupan por la época en que aparecen en el archivo. Un nombre aquí no significa que el equipo siga inscrito hoy.</p></div>'+
    '<div class="v35-era-archive">'+historicalTeamEras.map(g=>'<section class="v35-era-group"><header><span>'+esc(g.period)+'</span><b>'+esc(g.category)+'</b></header><div class="v35-era-team-grid">'+g.teams.map(n=>{const display=canonicalHistoricName(n),logo=historicLogo(display);return '<article class="v35-era-team">'+(logo?'<img src="'+logo+'" alt="'+esc(display)+'" loading="lazy" decoding="async">':'<span class="v35-era-fallback">'+esc(historicInitials(display))+'</span>')+'<b>'+esc(display)+'</b></article>'}).join('')+'</div></section>').join('')+'</div>'+
    '<div class="v35-history-subhead"><span>TODOS LOS EQUIPOS · ORDENADOS POR AÑO Y CATEGORÍA</span><h3>Quién jugó, cuándo y en qué categoría</h3><p>'+allHistoricalTeams2012Plus.length+' nombres/variantes históricas recuperadas hasta ahora. Un mismo club puede aparecer en varios años; cuando la categoría no se ve en la fuente se indica expresamente en vez de inventarla.</p></div>'+
    historicalTeamDirectoryHtml()+
    '<div class="v35-history-subhead"><span>TABLAS HISTÓRICAS</span><h3>Clasificaciones recuperadas</h3><p>Se conserva el contexto exacto del material: una tabla final se marca como final; un corte de jornada se marca solo como corte.</p></div>'+
    historicTables.map(t=>'<article class="v35-old-table"><header><span>'+esc(t.season)+'</span><div><b>'+esc(t.title)+'</b><small>'+esc(t.note)+'</small></div></header><div class="v35-old-table-head"><span>POS</span><span>EQUIPO</span><span>PTS</span></div>'+t.rows.map(r=>'<div class="v35-old-table-row"><span>'+esc(r[0])+'</span><b>'+esc(r[1])+'</b><strong>'+esc(r[2])+'</strong></div>').join('')+'</article>').join('')+
    '<div class="v35-history-subhead"><span>RESULTADOS CONSERVADOS</span><h3>Ganadores publicados en roles antiguos</h3></div>'+
    '<div class="v35-result-list">'+historicResults.map(r=>'<article><span>'+esc(r.date)+'</span><small>'+esc(r.category)+'</small><b>'+esc(r.winner)+'</b><i>vs</i><strong>'+esc(r.against)+'</strong></article>').join('')+'</div>'+
    '<div class="v35-history-subhead"><span>FINALES DOCUMENTADAS</span><h3>Llaves y finalistas</h3></div>'+
    '<div class="v35-result-list">'+historicFinalists.map(r=>'<article class="v35-final-row">'+

      '<span>'+esc(r.year)+'</span><small>'+esc(r.category)+'</small><b>'+esc(r.a)+'</b><i>vs</i><strong>'+esc(r.b)+'</strong><p>'+esc(r.note)+'</p></article>').join('')+'</div>'+
    '<div class="v35-history-subhead"><span>MÁS EQUIPOS DEL RECUERDO</span><h3>Nombres encontrados en tablas y roles antiguos</h3></div>'+
    '<div class="v35-retro-names">'+expandedRetroNames.map(n=>'<span>'+esc(n)+'</span>').join('')+'</div>'+
  '</div>';
}

function historyYouthCards(){
  return '<div class="v35-youth-list">'+historyYouth.map(x=>
    '<article><span>'+esc(x.year)+'</span><div><b>'+esc(x.title)+'</b><small>'+esc(x.detail)+'</small></div></article>'
  ).join('')+'</div>';
}
function institutionalHistoryBlock(){
  return '<section class="v35-history-format v35-institutional-history">'+
    '<div class="v35-history-subhead"><span>IDENTIDAD Y ORIGEN</span><h3>Lo que está comprobado y lo que sigue pendiente</h3><p>La investigación separa identidad institucional, presencia digital y antecedentes del fútbol local para no convertir una fecha de Facebook en una fecha de fundación.</p></div>'+
    '<div class="v35-format-grid">'+institutionalHistoryFacts.map(x=>'<article><span class="v35-history-kind">'+esc(x.tag)+'</span><h4>'+esc(x.title)+'</h4><p>'+esc(x.detail)+'</p></article>').join('')+'</div>'+
    '<div class="v35-archive-method"><h4>Investigación todavía abierta</h4>'+openHistoricalQuestions.map(x=>'<p>• '+esc(x)+'</p>').join('')+'</div>'+
  '</section>';
}

function taggedFacebookBlock(){
  return '<section class="v35-history-format v35-tagged-facebook">'+
    '<div class="v35-history-subhead"><span>PUBLICACIONES EN LA BIOGRAFÍA DE GOLAZO LIGA</span><h3>Personas que publicaban, etiquetaban o compartían tablas y roles</h3><p>Facebook conserva parte del archivo como publicaciones hechas por otras personas en Golazo Liga o como publicaciones donde Golazo Liga aparece etiquetado. Por eso muchas tablas no necesariamente aparecen dentro de la galería de fotos propia del perfil.</p></div>'+
    '<div class="v35-result-list v35-video-findings">'+taggedFacebookPosts.map(x=>'<article class="v35-final-row"><span>'+esc(x.date)+'</span><small>'+esc(x.type)+'</small><b>'+esc(x.person)+'</b><strong>'+esc(x.title)+'</strong><p>'+esc(x.detail)+'</p></article>').join('')+'</div>'+
  '</section>';
}

function historicalTimelineBlock(){
  return '<section class="v35-history-timeline">'+
    '<div class="v35-history-subhead"><span>LÍNEA DEL TIEMPO</span><h3>Cómo fue cambiando la Liga</h3><p>Publicaciones de Golazo Liga, tablas, álbumes, reglamento y perfiles de administradores permiten reconstruir la historia adulta sin mezclarla con otras ligas del municipio.</p></div>'+
    '<div class="v35-timeline-list">'+historicalTimeline.map(x=>'<article><time>'+esc(x.date)+'</time><div><h4>'+esc(x.title)+'</h4><p>'+esc(x.detail)+'</p></div></article>').join('')+'</div>'+
  '</section>';
}
function competitionFormatBlock(){
  return '<section class="v35-history-format">'+
    '<div class="v35-history-subhead"><span>CÓMO FUNCIONA</span><h3>Formato actual y tradición de juego</h3></div>'+
    '<div class="v35-format-grid">'+currentCompetitionFormat.map(x=>'<article><h4>'+esc(x.title)+'</h4><p>'+esc(x.detail)+'</p></article>').join('')+'</div>'+
    '<div class="v35-archive-method"><h4>Criterio del archivo histórico</h4>'+archiveMethod.map(x=>'<p>• '+esc(x)+'</p>').join('')+'</div>'+
  '</section>';
}
function refereeTravelBlock(){
  return '<section class="v35-history-format v35-referee-travel">'+
    '<div class="v35-history-subhead"><span>OPERACIÓN ARBITRAL</span><h3>Viáticos por comunidades y canchas foráneas</h3><p>Este listado documenta sedes/comunidades donde la Liga contempla viático arbitral. No convierte automáticamente el nombre de la comunidad en nombre de equipo histórico.</p></div>'+
    '<div class="v35-result-list v35-video-findings">'+refereeTravelAllowances.map(x=>'<article class="v35-final-row"><span>VIÁTICO</span><b>'+esc(x.place)+'</b><strong>$'+esc(x.fee.toFixed(2))+'</strong></article>').join('')+'</div>'+
    '<div class="v35-archive-method"><h4>Cómo se reparte el costo</h4><p>'+esc(refereeTravelRule)+'</p></div>'+
  '</section>';
}

function historyArchiveBlock(){
  return '<section class="v35-block v35-history-archive">'+
    '<div class="v35-history-archive-head"><span>ARCHIVO HISTÓRICO</span><h2>Historias de la Liga</h2><p>Archivo histórico de la Liga adulta: categoría libre y Veteranos. Se excluyen ligas infantiles, Pony, juveniles y torneos de Presidencia Municipal/COMUDE que pertenecen a organizaciones distintas. El material aportado se usa como fuente de consulta y no se inserta en esta página.</p></div>'+
    historicalTimelineBlock()+
    taggedFacebookBlock()+
    institutionalHistoryBlock()+
    competitionFormatBlock()+
    historyMomentCards()+
    '<div class="v35-history-subhead"><span>EQUIPOS PARA EL RECUERDO</span><h3>Clubes y nombres del archivo</h3><p>Estos registros históricos no alteran la lista de equipos de la temporada actual.</p></div>'+
    retroClubCards()+
    verifiedHistoryBlocks()+
  '</section>';
}
function historyChampionKey(x){
  const n=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  return n(x.date||x.season)+'|'+n(x.title||x.champion||x.winner);
}
function verifiedChampionAsMoment(x){
  return {
    kind:'CAMPEÓN',
    date:x.season||'',
    season:x.season||'',
    winner:x.champion||'',
    title:x.champion||'',
    subtitle:x.competition||'Campeón',
    detail:((x.runner&&x.runner!=='—')?'Subcampeón: '+x.runner+'. ':'')+(x.source||''),
    backgroundPhoto:x.photo||'',
    image:x.championLogo||''
  };
}
function championsArchiveBlock(){
  /* V207 — "Campeones" nace de la misma colección que Resumen.
     Así cualquier campeón visible en Resumen aparece aquí automáticamente.
     Luego se agregan solo campeones verificados que todavía no estén presentes. */
  const summaryChampions=historyMoments.filter(m=>
    (!m.archiveOnly||m.championsOnly)&&(
      m.kind==='CAMPEÓN'||
      m.kind==='PRIMER LUGAR'||
      /campe[oó]n/i.test(String(m.subtitle||'')+' '+String(m.detail||''))
    )
  );
  const merged=[];
  const seen=new Set();
  [...summaryChampions,...verifiedChampions.map(verifiedChampionAsMoment)].forEach(m=>{
    const key=historyChampionKey(m);
    if(!key||seen.has(key))return;
    seen.add(key);
    merged.push(m);
  });
  const rows=historyNewestFirst(merged,'date');
  return '<section class="v35-block v35-history-archive v35-history-archive-compact">'+
    '<div class="v35-history-archive-head"><span>PALMARÉS HISTÓRICO</span><h2>Campeones documentados</h2><p>Los campeones que aparecen en Resumen también aparecen aquí una sola vez, con su fecha, campeonato/categoría documentados y la fotografía exacta cuando existe.</p></div>'+
    '<div class="v35-history-moments">'+rows.map(historyMomentCard).join('')+'</div>'+
  '</section>';
}
function finalsArchiveBlock(){
  const rows=historyMoments.filter(m=>['FINAL','PENALES','CLÁSICO','ENCUENTRO'].includes(m.kind));
  return '<section class="v35-block v35-history-archive v35-history-archive-compact">'+
    '<div class="v35-history-archive-head"><span>PARTIDOS PARA EL RECUERDO</span><h2>Finales, penales y clásicos</h2></div>'+
    '<div class="v35-history-moments">'+rows.map(m=>'<article class="v35-history-moment"><span class="v35-history-kind">'+esc(m.kind)+'</span><h3>'+esc(m.title)+'</h3><strong>'+esc(m.subtitle)+'</strong><p>'+esc(m.detail)+'</p></article>').join('')+'</div>'+
  '</section>';
}

function stats(){
  return '<section class="v35-block v35-stats-block"><h2 class="v35-section-title">Estadísticas históricas</h2>'+
    '<article class="v35-stat-card"><h3>Archivo oficial y administrativo</h3><div class="v35-stat-rule"></div><p>Se consideran fuentes las publicaciones de la Liga, Golazo Liga, administradores de sus páginas y dirigentes cuando su cargo está documentado, además de reglamentos, roles, tablas, fotografías, álbumes y documentos públicos externos. Si una de esas fuentes identifica a un equipo como campeón, se registra como campeón aunque no exista una foto del trofeo.</p></article></section>';
}
function summaryBody(){
  return '<section class="v35-block v35-seasons-block"><div class="v35-section-row"><h2>Buscar por temporada</h2><button type="button" data-v35-tab-jump="Temporadas">Ver todo</button></div><div class="v35-season-carousel">'+seasonCards()+'</div></section>'+
    '<section class="v35-block v35-feature-block">'+featureCard()+'</section>'+
    historyArchiveBlock()+
    stats();
}
function seasonsBody(){
  return '<section class="v35-block v35-tab-body"><div class="v35-section-row"><h2>Temporadas</h2></div>'+
    '<div class="v35-season-detail"><span>Archivo histórico</span><h3>Temporadas anteriores separadas de la actual</h3><p>Los equipos antiguos pueden aparecer aquí como parte de su temporada histórica, pero nunca se agregan otra vez a la lista de equipos actuales si ya no participan.</p></div>'+
    '<div class="v35-season-detail"><span>Convocatoria · 12 nov 2019</span><h3>Temporada 2019–2020</h3><p><b>Inicio:</b> domingo 8 de diciembre de 2019. <b>Fuerzas:</b> Primera, Intermedia y Segunda. <b>Inscripciones:</b> hasta el martes 26 de noviembre, 19:00, Unidad Deportiva Sur. <b>Registro:</b> digital o físico, máximo 26 jugadores. <b>Junta previa:</b> martes 3 de diciembre, 19:00. Uniformación, cuotas, arbitrajes, credenciales, reglamento, premiación y transitorios se resolverían conforme al reglamento y a los acuerdos de asamblea.</p></div></section>'+
    historyArchiveBlock();
}
function championsBody(){
  return '<section class="v35-block v35-tab-body"><h2 class="v35-section-title">Campeones de otros años</h2>'+
    '<article class="v35-stat-card"><h3>Archivo histórico real</h3><p>Los campeones de temporadas anteriores se registran cuando una fuente de la Liga o de sus administradores los identifica como tales. No se exige una fotografía del trofeo. Los clubes que ya no participan permanecen únicamente en Historia.</p></article></section>'+
    championsArchiveBlock();
}
function finalsBody(){
  return '<section class="v35-block v35-tab-body"><h2 class="v35-section-title">Finales</h2>'+
    '<div class="v35-season-detail"><h3>Finales históricas documentadas</h3><p>Se muestran únicamente las finales, series y clásicos que aparecen en el material histórico revisado.</p></div></section>'+
    finalsArchiveBlock();
}
function recordsBody(){
  return '<section class="v35-block v35-tab-body v35-records-body"><h2 class="v35-section-title">Récords y recuerdos</h2>'+
    '<article class="v35-stat-card"><h3>Archivo comprobado</h3><p>Esta sección reúne marcas visibles en tablas históricas y recuerdos documentados en fotografías, álbumes y videos. Un corte de jornada no se presenta como récord absoluto de toda la Liga.</p></article>'+
    '<div class="v35-record-grid">'+recordMemories.map(r=>'<article class="v35-record-card">'+
      (r.image?'<img src="'+r.image+'" alt="" loading="lazy" decoding="async">':'<span class="v35-record-mark">LM</span>')+
      '<div><small>'+esc(r.tag)+'</small><h3>'+esc(r.title)+'</h3><strong>'+esc(r.value)+'</strong><p>'+esc(r.detail)+'</p></div></article>').join('')+'</div>'+    '<div class="v35-records-goals-anchor">'+historicalGoalsBlock()+'</div>'+
    '<div class="v35-history-subhead"><span>EQUIPOS DEL ARCHIVO</span><h3>Nombres recuperados de tablas, roles y álbumes</h3></div>'+
    '<div class="v35-retro-names">'+expandedRetroNames.concat(retroNames).filter((x,i,a)=>a.indexOf(x)===i).map(n=>'<span>'+esc(n)+'</span>').join('')+'</div>'+
  '</section>';
}
function bodyForTab(){
  if(activeTab==='Temporadas') return seasonsBody();
  if(activeTab==='Campeones') return championsBody();
  if(activeTab==='Finales') return finalsBody();
  if(activeTab==='Récords') return recordsBody();
  return summaryBody();
}
function tabs(){
  return ['Resumen','Temporadas','Campeones','Finales','Récords'].map(t=>'<button type="button" class="v35-tab '+(t===activeTab?'active':'')+'" data-v35-tab="'+esc(t)+'">'+esc(t)+'</button>').join('');
}
function transparentizeTopLogo(img){
  if(!img||img.dataset.v35TransparentReady==='1') return;
  img.dataset.v35TransparentReady='1';
  const run=()=>{
    try{
      const w=img.naturalWidth||0,h=img.naturalHeight||0;
      if(!w||!h) return;
      const canvas=document.createElement('canvas');
      canvas.width=w;canvas.height=h;
      const ctx=canvas.getContext('2d',{willReadFrequently:true});
      if(!ctx) return;
      ctx.drawImage(img,0,0,w,h);
      const data=ctx.getImageData(0,0,w,h);
      const p=data.data;
      const seen=new Uint8Array(w*h);
      const queue=new Int32Array(w*h);
      let head=0,tail=0;
      const isBg=(idx)=>{
        const o=idx*4,r=p[o],g=p[o+1],b=p[o+2],a=p[o+3];
        if(a<8) return true;
        const max=Math.max(r,g,b),min=Math.min(r,g,b);
        return max<78 && (max-min)<42;
      };
      const push=(idx)=>{
        if(idx<0||idx>=w*h||seen[idx]||!isBg(idx)) return;
        seen[idx]=1;queue[tail++]=idx;
      };
      for(let x=0;x<w;x++){push(x);push((h-1)*w+x);}
      for(let y=0;y<h;y++){push(y*w);push(y*w+w-1);}
      while(head<tail){
        const idx=queue[head++],x=idx%w,y=(idx/w)|0,o=idx*4;
        p[o+3]=0;
        if(x>0)push(idx-1);if(x<w-1)push(idx+1);
        if(y>0)push(idx-w);if(y<h-1)push(idx+w);
      }
      ctx.putImageData(data,0,0);
      img.src=canvas.toDataURL('image/png');
      img.classList.add('v35-top-logo-transparent');
    }catch(e){
      img.classList.add('v35-top-logo-blend-fallback');
    }
  };
  if(img.complete) run(); else img.addEventListener('load',run,{once:true});
}
function removeObsoleteManchesterDuplicate(root=document){
  root.querySelectorAll?.('.v35-history-moment,.v35-champion-card,.v115-card,.v115-fact-card').forEach(card=>{
    const t=String(card.textContent||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    if(t.includes('manchester')&&t.includes('fecha exacta pendiente')&&t.includes('campeon de campeones')) card.remove();
  });
}
function pageHtml(){
  const back='<button class="v35-back" type="button" data-v35-back aria-label="Volver"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11H7.83L13.42 5.41 12 4l-8 8 8 8 1.41-1.41L7.83 13H20Z"/></svg></button>';
  return '<div class="v35-history-page">'+linesSvg()+
    '<div class="v35-compact-bar">'+back+'<div class="v35-compact-title">Historia</div></div>'+
    '<header class="v35-history-head">'+
      back+
      '<h1>Historia</h1>'+
    '</header>'+
    '<nav class="v35-tabs" aria-label="Secciones de Historia">'+tabs()+'</nav>'+
    '<main class="v35-history-content" data-v35-content>'+bodyForTab()+'</main>'+
  '</div>';
}
function renderHistory(){
  if(route()!=='history') return;
  const screen=document.querySelector('#screen');
  if(!screen) return;
  if(screen.querySelector('.v35-history-page')) return;
  screen.innerHTML=pageHtml();
  document.body.classList.add('v35-history-mounted');
  const topLogo=screen.querySelector('[data-v35-top-logo]'); if(topLogo) transparentizeTopLogo(topLogo);
  requestAnimationFrame(()=>{
    window.scrollTo({top:0,left:0,behavior:'auto'});
    syncHistoryCollapse();
    removeObsoleteManchesterDuplicate(screen);
  });
}
function rerenderContent(){
  const root=document.querySelector('.v35-history-page');
  const content=root?.querySelector('[data-v35-content]');
  const nav=root?.querySelector('.v35-tabs');
  if(!root||!content||!nav) return;
  nav.innerHTML=tabs();
  content.innerHTML=bodyForTab();
  root.scrollIntoView({block:'start',behavior:'auto'});
  requestAnimationFrame(()=>{syncHistoryCollapse();removeObsoleteManchesterDuplicate(root);});
}
function toast(msg){
  let el=document.querySelector('.v35-toast');
  if(!el){el=document.createElement('div');el.className='v35-toast';document.body.appendChild(el);}
  el.textContent=msg;el.classList.add('show');
  clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove('show'),1700);
}
async function share(){
  const data={title:'Historia · Liga Juventino Rosas',text:'Palmarés e historia de la Liga Municipal de Fútbol Juventino Rosas',url:location.href};
  try{
    if(navigator.share){await navigator.share(data);return;}
    await navigator.clipboard.writeText(location.href);toast('Enlace copiado');
  }catch(e){}
}
function onClick(e){
  if(route()!=='history') return;
  const back=e.target.closest('[data-v35-back]');
  if(back){e.preventDefault();e.stopPropagation();if(history.length>1)history.back();else location.hash='#/more';return;}
  const tab=e.target.closest('[data-v35-tab]');
  if(tab){e.preventDefault();e.stopPropagation();activeTab=tab.dataset.v35Tab||'Resumen';rerenderContent();return;}
  const jump=e.target.closest('[data-v35-tab-jump]');
  if(jump){e.preventDefault();e.stopPropagation();activeTab=jump.dataset.v35TabJump||'Temporadas';rerenderContent();return;}
  const season=e.target.closest('[data-v35-season]');
  if(season){e.preventDefault();e.stopPropagation();const idx=Number(season.dataset.v35Season||0);activeTab='Temporadas';rerenderContent();requestAnimationFrame(()=>{const cards=document.querySelectorAll('.v35-season-grid .v35-season-card');cards[idx]?.scrollIntoView({block:'center',behavior:'smooth'});});return;}
  const shareBtn=e.target.closest('[data-v35-share]');
  if(shareBtn){e.preventDefault();e.stopPropagation();share();return;}
  const source=e.target.closest('[data-v35-history-source]');
  if(source){
    e.preventDefault();e.stopPropagation();
    const idx=Number(source.dataset.v35HistorySource||0);
    const item=historicalSources[idx];
    if(item?.url)window.open(item.url,'_blank','noopener,noreferrer');
    return;
  }
  const video=e.target.closest('[data-v35-video]');
  if(video){e.preventDefault();e.stopPropagation();location.hash='#/video';return;}
  const team=e.target.closest('[data-v35-team]');
  if(team){e.preventDefault();e.stopPropagation();location.hash='#/teams';return;}
}
function cleanup(){
  if(route()!=='history') document.body.classList.remove('v35-history-mounted');
}
function boot(){
  renderHistory();
  window.addEventListener('hashchange',()=>requestAnimationFrame(()=>{cleanup();renderHistory();syncHistoryCollapse();}));
  window.addEventListener('scroll',scheduleHistoryCollapse,{passive:true});
  window.addEventListener('resize',scheduleHistoryCollapse,{passive:true});
  document.addEventListener('click',onClick,true);
  const screen=document.querySelector('#screen');
  if(screen){
    new MutationObserver(()=>{if(route()==='history'&&!screen.querySelector('.v35-history-page'))requestAnimationFrame(renderHistory);}).observe(screen,{childList:true});
  }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();