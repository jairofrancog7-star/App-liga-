/* V35 — Historia mobile reconstruction from the user's master references.
   Replaces only #/history on mobile/APK. Keeps the rest of the app logic intact. */
(function(){
'use strict';

const RAW='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
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
const HIST_PHOTOS=window.LJR_HISTORY_PHOTOS||{};
const HIST_CHAMPION_REFERENCE=HIST_MEDIA+'premiacion-historica.jpg';
function championBackground(name,explicitPhoto){
  const exact=(explicitPhoto||'').trim();
  // V119: nunca reutilizar una foto genérica ni un escudo como fondo de un campeón.
  // Solo se muestra una fotografía cuando el archivo la identifica para ese campeonato.
  if(exact) return {url:exact,exact:true};
  return {url:'',exact:false};
}
function championBgImg(name,explicitPhoto,season,klass){
  const bg=championBackground(name,explicitPhoto);
  if(!bg.url) return '';
  const alt=String(name||'')+' · campeón · '+String(season||'');
  return '<img class="'+klass+' v35-bg-exact" src="'+bg.url+'" alt="'+esc(alt)+'" loading="lazy" decoding="async" onerror="this.remove()">';
}
const historyMoments=[
  // V132 — finales 2025–2026 aportadas por el usuario con fotografías exactas.
  {kind:'CAMPEÓN',date:'07 jun 2026',season:'2025–2026',winner:'La Canchita Deportes',title:'La Canchita Deportes',subtitle:'Campeón de Liga · Segunda Fuerza',detail:'Dato e imagen aportados por el usuario: La Canchita Deportes ganó la final de Segunda Fuerza del 7 de junio de 2026; Aldama FC quedó como subcampeón.',backgroundPhoto:HIST_MEDIA+'archive-v132/canchita-deportes-campeon-segunda-2026.jpg',image:HIST_ROOT+'assets/official-logos/la-canchita-deportes.png'},
  {kind:'SUBCAMPEÓN',date:'07 jun 2026',season:'2025–2026',title:'Aldama FC',subtitle:'Subcampeón · Segunda Fuerza',detail:'Aldama FC quedó en segundo lugar en la final de Segunda Fuerza frente a La Canchita Deportes.',image:HIST_ROOT+'assets/official-logos/aldama-fc.png'},
  {kind:'CAMPEÓN',date:'24 may 2026',season:'2025–2026',winner:'Franco FC',title:'Franco FC',subtitle:'Campeón de Campeones',detail:'Dato e imagen aportados por el usuario: Franco FC ganó el Campeón de Campeones frente a Lobos CDG el 24 de mayo de 2026.',backgroundPhoto:HIST_MEDIA+'archive-v132/franco-fc-campeon-de-campeones-2026.jpg',image:HIST_ROOT+'assets/official-logos/franco-fc.png'},
  {kind:'CAMPEÓN',date:'23 may 2026',season:'2025–2026',winner:'La Esperanza',title:'La Esperanza',subtitle:'Campeón · final del 23 de mayo',detail:'Dato e imagen aportados por el usuario: La Esperanza ganó la final del 23 de mayo de 2026. La categoría exacta queda por precisar para no inventarla.',backgroundPhoto:HIST_MEDIA+'archive-v132/la-esperanza-campeon-23-mayo-2026.jpg',image:HIST_ROOT+'assets/official-logos/la-esperanza.png'},
  {kind:'CAMPEÓN',date:'10 may 2026',season:'2025–2026',winner:'Franco FC',title:'Franco FC',subtitle:'Campeón de Liga · Fuerza Intermedia',detail:'Final de Fuerza Intermedia aportada por el usuario: Franco FC venció a La Esperanza; Franco fue campeón y La Esperanza subcampeón.',backgroundPhoto:HIST_MEDIA+'archive-v132/franco-fc-campeon-intermedia-2026.jpg',image:HIST_ROOT+'assets/official-logos/franco-fc.png'},
  {kind:'SUBCAMPEÓN',date:'10 may 2026',season:'2025–2026',title:'La Esperanza',subtitle:'Subcampeón · Fuerza Intermedia',detail:'La Esperanza quedó como subcampeón de Fuerza Intermedia frente a Franco FC el 10 de mayo de 2026.',backgroundPhoto:HIST_MEDIA+'archive-v132/la-esperanza-subcampeon-intermedia-2026.jpg',image:HIST_ROOT+'assets/official-logos/la-esperanza.png'},
  {kind:'CAMPEÓN',date:'15 mar 2026',season:'2025–2026',winner:'Linces',title:'Linces',subtitle:'Campeón de Liga · Primera Fuerza',detail:'Dato e imagen aportados por el usuario: Linces ganó la final de Primera Fuerza frente a Galácticos el 15 de marzo de 2026.',backgroundPhoto:HIST_MEDIA+'archive-v132/linces-campeon-primera-2026.jpg',image:HIST_ROOT+'assets/official-logos/linces.png'},
  {kind:'SUBCAMPEÓN',date:'15 mar 2026',season:'2025–2026',title:'Galácticos',subtitle:'Subcampeón · Primera Fuerza',detail:'Galácticos quedó como subcampeón de Primera Fuerza frente a Linces el 15 de marzo de 2026.',backgroundPhoto:HIST_MEDIA+'archive-v132/galacticos-subcampeon-primera-2026.jpg',image:HIST_ROOT+'assets/teams/galacticos-pozos.webp'},
  {kind:'CAMPEÓN',date:'20 dic 2025',season:'2025–2026',winner:'Salvajes',title:'Salvajes',subtitle:'Campeón · Torneo de Copa',detail:'Dato e imagen aportados por el usuario: Salvajes ganó la final del Torneo de Copa frente a Juventus el 20 de diciembre de 2025.',backgroundPhoto:HIST_MEDIA+'archive-v132/salvajes-campeon-copa-2025.jpg'},
  {kind:'SUBCAMPEÓN',date:'20 dic 2025',season:'2025–2026',title:'Juventus',subtitle:'Subcampeón · Torneo de Copa',detail:'Juventus quedó como subcampeón de la final de Copa frente a Salvajes el 20 de diciembre de 2025.',image:HIST_ROOT+'assets/official-logos/juventus.png'},
  {kind:'CAMPEÓN',date:'08 nov 2025',season:'2025–2026',winner:'La Esperanza',title:'La Esperanza',subtitle:'Campeón de Liga · Veteranos 50 y más',detail:'Felicidades al equipo La Esperanza, campeón de la fuerza de Veteranos 50 y más del Torneo de Liga 2025–2026. Fotografía exacta aportada por el usuario.',backgroundPhoto:HIST_MEDIA+'archive-v195/la-esperanza-campeon-veteranos50-2025-2026.jpg',image:HIST_ROOT+'assets/official-logos/la-esperanza.png'},
  {kind:'CAMPEÓN',date:'2025 · fecha exacta pendiente',season:'2025',winner:'Manchester',title:'Manchester',subtitle:'Campeón de Campeones · Veteranos',detail:'Fotografía aportada por el usuario: Manchester aparece identificado como CAMPEÓN DE CAMPEONES de Veteranos en 2025. Se conserva 2025 y la fecha exacta queda pendiente de documentar.',image:HIST_ROOT+'assets/official-logos/manchester.png'},
  {kind:'CAMPEÓN',date:'12 abr 2025',season:'2025',winner:'Boavista FC',title:'Boavista FC',subtitle:'Campeón de Liga · Veteranos 50 y más',detail:'Fotografía aportada por el usuario y registro ya documentado en el archivo: Boavista FC aparece como CAMPEÓN 2025 del Torneo de Liga de Veteranos 50 y más.',backgroundPhoto:HIST_MEDIA+'archive-v120/boavista-fc-campeon-2025.jpg',image:HIST_ROOT+'assets/official-logos/boavista.png'},
  {kind:'CAMPEÓN',date:'15 sep 2024',season:'2024',winner:'Pozos FC',title:'Pozos FC',subtitle:'Campeón de Liga · Veteranos 35 y más',detail:'Dato e imagen aportados por el usuario: Pozos FC fue campeón del Torneo de Liga de Veteranos 35 y más el 15 de septiembre de 2024.',backgroundPhoto:HIST_MEDIA+'archive-v199/pozos-fc-campeon-liga-veteranos35-15-sep-2024.jpg',image:HIST_ROOT+'assets/teams/pozos-fc.webp'},
  {kind:'CAMPEÓN',date:'09 nov 2024',season:'2024',winner:'Manchester',title:'Manchester',subtitle:'Campeón del Torneo de Copa · Veteranos 50 y más',detail:'Dato e imagen aportados por el usuario: Manchester fue campeón del Torneo de Copa de Veteranos 50 y más el 9 de noviembre de 2024.',image:HIST_ROOT+'assets/official-logos/manchester.png'},
  {kind:'CAMPEÓN',date:'17 feb 2024',season:'2024',winner:'Juventus',title:'Juventus',subtitle:'Campeón del Torneo de Copa · Veteranos 35 y más',detail:'Material aportado por el usuario: el cartel de la Gran Final de Veteranos fija Juventus vs PSV Eindhoven para el sábado 17 de febrero de 2024; la publicación del 18 de febrero felicita a Juventus como campeón del Torneo de Copa 2024 de Veteranos 35 y más.',backgroundPhoto:HIST_MEDIA+'archive-v202/juventus-campeon-copa-veteranos35-17-feb-2024.webp',image:HIST_ROOT+'assets/official-logos/juventus.png'},
  {kind:'CAMPEÓN',date:'18 feb 2024',season:'2024',winner:'San Julián',title:'San Julián',subtitle:'Campeón del Torneo de Copa · Segunda Fuerza',detail:'Publicación aportada por el usuario con fecha 18 de febrero de 2024: la Liga Municipal de Fútbol Juventino Rosas felicita a San Julián como digno campeón del Torneo de Copa de Segunda Fuerza.',image:HIST_ROOT+'assets/official-logos/san-julian.png'},
  {kind:'CAMPEÓN',date:'25 feb 2024',season:'2024',winner:'Mineros F. C.',title:'Mineros F. C.',subtitle:'Campeón · Fuerza Intermedia',detail:'Publicación aportada por el usuario con fecha 26 de febrero de 2024: señala que el día anterior se disputó la final de Fuerza Intermedia y que Mineros F. C., representante de la comunidad del Naranjillo, quedó campeón. El partido fue dedicado a Luis Manuel García Servín.',image:HIST_ROOT+'assets/teams/mineros-fc.webp'},
  // V198 — Juventus · Campeón de Copa · final 1 de febrero de 2025
  {kind:'CAMPEÓN',date:'01 feb 2025',season:'2025',winner:'Juventus',title:'Juventus',subtitle:'Campeón de Copa · Final',detail:'Dato e imagen aportados por el usuario: Juventus fue campeón de Copa en la final del 1 de febrero de 2025.',backgroundPhoto:HIST_MEDIA+'archive-v197/juventus-campeon-copa-01-feb-2025.jpg',image:HIST_ROOT+'assets/official-logos/juventus.png'},
  {kind:'CAMPEÓN',date:'02 feb 2025',season:'2025',winner:'Galácticos',title:'Galácticos',subtitle:'Campeón de Liga · Primera Fuerza',detail:'Dato e imagen aportados por el usuario: Galácticos fue campeón de Liga el 2 de febrero de 2025.',image:HIST_ROOT+'assets/teams/galacticos-pozos.webp'},
  {kind:'CAMPEÓN',date:'08 jun 2025',season:'2025',winner:'Galácticos (Pozos)',title:'Galácticos (Pozos)',subtitle:'Campeón de Copa · Primera Fuerza',detail:'Fotografía exacta aportada por el usuario: Galácticos (Pozos), campeón de Copa 2025 de Primera Fuerza el 8 de junio de 2025.',backgroundPhoto:HIST_MEDIA+'archive-v196/galacticos-pozos-campeon-copa-2025.jpg',image:HIST_ROOT+'assets/teams/galacticos-pozos.webp'},
  {kind:'CAMPEÓN',date:'20 sep 2025',season:'2025',winner:'Juventus',title:'Juventus',subtitle:'Campeón de Liga · Veteranos 35 y más',detail:'Dato e imagen aportados por el usuario: Juventus ganó la final de Veteranos 35 y más frente a Salvajes el 20 de septiembre de 2025.',backgroundPhoto:HIST_MEDIA+'archive-v132/juventus-campeon-liga-veteranos-35-2025.jpg',image:HIST_ROOT+'assets/official-logos/juventus.png'},
  {kind:'SUBCAMPEÓN',date:'20 sep 2025',season:'2025',title:'Salvajes',subtitle:'Subcampeón · Veteranos 35 y más',detail:'Salvajes quedó como subcampeón de Liga de Veteranos 35 y más frente a Juventus el 20 de septiembre de 2025.'},
  {kind:'CAMPEÓN',date:'29 jun 2025',season:'2025',winner:'La Huerta de Cuenda',title:'La Huerta de Cuenda',subtitle:'Campeón de Liga · Segunda Fuerza',detail:'Dato aportado por el usuario: La Huerta de Cuenda ganó la final de Segunda Fuerza frente a Tavera FC el 29 de junio de 2025.',backgroundPhoto:HIST_MEDIA+'archive-v119/la-huerta-finalista-2025.jpg'},
  {kind:'SUBCAMPEÓN',date:'29 jun 2025',season:'2025',title:'Tavera FC',subtitle:'Subcampeón · Segunda Fuerza',detail:'Tavera FC quedó como subcampeón de Segunda Fuerza frente a La Huerta de Cuenda el 29 de junio de 2025.',backgroundPhoto:HIST_MEDIA+'archive-v119/tavera-finalista-2025.jpg',image:HIST_ROOT+'assets/official-logos/tavera-fc.png'},
  // V197 — campeones 2025 corregidos/aportados por el usuario.
  {kind:'CAMPEÓN',date:'04 feb 2025',season:'2025',winner:'Herreras FC',title:'Herreras FC',subtitle:'Campeón de Liga · Primera Fuerza',detail:'Dato e imagen aportados por el usuario: Herreras FC fue campeón de Liga de Primera Fuerza el 4 de febrero de 2025.',backgroundPhoto:HIST_MEDIA+'archive-v120/herreras-fc-campeon-relampago-intermedia-2025.jpg',image:HIST_ROOT+'assets/official-logos/herreras-fc.png'},
  {kind:'CAMPEÓN',date:'16 feb 2025',season:'2025',winner:'Lobos Jrs.',title:'Lobos Jrs.',subtitle:'Campeón · Torneo Relámpago · Segunda Fuerza',detail:'Dato e imagen aportados por el usuario: Lobos Jrs. ganó el Torneo Relámpago de Segunda Fuerza el 16 de febrero de 2025.',backgroundPhoto:HIST_MEDIA+'archive-v197/lobos-jrs-campeon-relampago-segunda-2025.svg'},
  // V196 — Lobos CDG · Campeón de Copa · Fuerza Intermedia 2025
  {kind:'CAMPEÓN',date:'15 jun 2025',season:'2025',winner:'Lobos CDG',title:'Lobos CDG · Cerrito de Gasca',subtitle:'Campeón de Copa · Fuerza Intermedia',detail:'Dato e imagen aportados por el usuario: Lobos CDG, de Cerrito de Gasca, ganó la final de Fuerza Intermedia y fue campeón de Copa el 15 de junio de 2025.',backgroundPhoto:HIST_MEDIA+'archive-v196/lobos-cdg-campeon-copa-intermedia-2025.webp',image:HIST_ROOT+'assets/official-logos/lobos-cdg.png'},
  {kind:'TERCER LUGAR',date:'23 nov 2013',title:'Romerillo',subtitle:'Tercer lugar · Fuerza Intermedia',detail:'Golazo Liga publicó que el portero de Romerillo fue clave para que su equipo obtuviera el tercer lugar, destacando una atajada de penal en la serie final. El nombre del portero no es visible en la captura aportada.'},
  {kind:'CAMPEÓN',date:'2014 · fecha exacta pendiente',season:'2014',winner:'DHP',title:'DHP',subtitle:'Campeón del Torneo de Copa 2014 · Segunda Fuerza',detail:'Dato histórico aportado directamente por el usuario: DHP fue campeón del Torneo de Copa 2014 de Segunda Fuerza. La publicación o fotografía original queda pendiente de adjuntar para documentar la fecha exacta.'},
  {kind:'CAMPEÓN',date:'22 feb 2014',season:'2014',winner:'Puros Cuates',title:'Puros Cuates',subtitle:'Campeón de Copa · Fuerza Intermedia',detail:'La publicación de Golazo Liga muestra el trofeo entregado al equipo campeón.',backgroundPhoto:HIST_PHOTOS.purosCuatesTrophy2014||'',image:''},
  {kind:'CAMPEÓN',date:'20 mar 2022',season:'2022',winner:'Galácticos FC',title:'Galácticos FC',subtitle:'Campeón de Liga · Segunda Fuerza',detail:'Publicación aportada por el usuario desde Golazo Liga: Galácticos FC fue campeón de Liga en Segunda Fuerza y con ese título logró su ascenso a Fuerza Intermedia.',backgroundPhoto:HIST_MEDIA+'archive-v185/galacticos-campeon-segunda-2022.webp',image:HIST_ROOT+'assets/teams/galacticos-pozos.webp'},
    {kind:'CAMPEÓN',date:'02 oct 2021',season:'2020–2021',winner:'PSV',title:'PSV',subtitle:'Campeón de Campeones · Veteranos · 2020–2021',detail:'Publicación de Golazo Liga del 2 de octubre de 2021: PSV fue Campeón de Campeones de la temporada 2020–2021 en la categoría Veteranos.',backgroundPhoto:HIST_MEDIA+'archive-v134/psv-campeon-campeones-veteranos-2020-2021.jpg',image:HIST_ROOT+'assets/teams/psv.webp'},
  {kind:'CAMPEÓN',date:'25 sep 2021',season:'2020–2021',winner:'La Esperanza',title:'La Esperanza',subtitle:'Campeón de Liga · Veteranos · 2020–2021',detail:'Publicación de Golazo Liga del 25 de septiembre de 2021: La Esperanza se llevó el título de Liga 2020–2021 al derrotar a Real Cuenda en una final decidida por tiros penales.',backgroundPhoto:HIST_MEDIA+'archive-v134/la-esperanza-campeon-liga-veteranos-2020-2021.jpg',image:HIST_ROOT+'assets/official-logos/la-esperanza.png'},
      {kind:'CAMPEÓN',date:'19 ene 2020',season:'2019–2020',winner:'El Alto',title:'El Alto',subtitle:'Campeón de Copa · Fuerza Intermedia',detail:'Publicación de Golazo Liga del 19 de enero de 2020: “Felicidades!!! El Alto, campeón de copa, fuerza intermedia.”',backgroundPhoto:HIST_MEDIA+'archive-v134/el-alto-campeon-copa-intermedia-2020.jpg'},
  {kind:'CAMPEÓN',date:'17 nov 2019',season:'2019',winner:'PSV',title:'PSV',subtitle:'Campeón de Copa 2019 · Veteranos',detail:'Publicación aportada por el usuario: “Felicidades!!! PSV campeón de copa 2019, categoría veteranos”.',image:HIST_ROOT+'assets/teams/psv.webp'},
  {kind:'SUBCAMPEÓN',date:'03 nov 2019',season:'2018–2019',title:'Boavista',subtitle:'Subcampeón de Liga · 2018–2019',detail:'Publicación aportada por el usuario: Boavista fue subcampeón del Torneo de Liga 2018–2019.',image:HIST_ROOT+'assets/official-logos/boavista.png'},
  {kind:'TERCER LUGAR',date:'03 nov 2019',season:'2018–2019',title:'Abejas',subtitle:'Tercer lugar · Primera Fuerza · 2018–2019',detail:'Publicación aportada por el usuario: el equipo Abejas obtuvo el tercer lugar de la temporada 2018–2019 en Primera Fuerza.',image:HIST_ROOT+'assets/official-logos/abejas.png'},
  {kind:'CAMPEÓN',date:'16 sep 2019',season:'2018–2019',winner:'La Pandilla de Morales',title:'La Pandilla de Morales',subtitle:'Campeón de Liga · 2018–2019',detail:'Publicación aportada por el usuario: “Felicidades a los campeones de liga 2018-2019. Felicidades a La Pandilla y Linces Junior”. El 9 de julio también se documentó a La Pandilla de Morales como primer lugar de la tabla general y con ascenso a Primera Fuerza.'},
  {kind:'CAMPEÓN',date:'16 sep 2019',season:'2018–2019',winner:'Linces Jr.',title:'Linces Jr.',subtitle:'Campeón de Liga · 2018–2019',detail:'Publicación aportada por el usuario: “Felicidades a los campeones de liga 2018-2019. Felicidades a La Pandilla y Linces Junior”. El 9 de julio también se documentó a Linces Jr. como líder general y con ascenso a Fuerza Intermedia.',image:HIST_ROOT+'assets/official-logos/linces.png'},
  {kind:'CAMPEÓN',date:'22 jun 2019',season:'2019',winner:'La Esperanza',title:'La Esperanza',subtitle:'Campeón de Campeones · Veteranos',detail:'Publicación aportada por el usuario: “Felicidades al campeón de campeones de la categoría veteranos. Felicidades a La Esperanza”.',image:HIST_ROOT+'assets/official-logos/la-esperanza.png'},
{kind:'CONVOCATORIA',date:'12 nov 2019',season:'2019–2020',title:'Convocatoria temporada 2019–2020',subtitle:'Inicio: domingo 8 dic 2019 · Primera, Intermedia y Segunda',detail:'La Liga Municipal de Fútbol “Juventino Rosas A.C.” convocó a delegados y nuevos equipos. Inscripciones hasta el martes 26 de noviembre de 2019 a las 19:00 en la Unidad Deportiva Sur; máximo 26 jugadores por registro; junta previa el martes 3 de diciembre a las 19:00. Uniformación, cuotas, arbitrajes, credenciales, reglamento y premiación quedarían sujetos a los acuerdos y normas de la Liga.'},
{kind:'CAMPEÓN',date:'16 feb 2020',season:'2019–2020',winner:'Juventus',title:'Juventus',subtitle:'Campeón de Copa · Primera Fuerza',detail:'Publicación de Golazo Liga del 16 de febrero de 2020: Juventus fue campeón de Copa 2019–2020 de Primera Fuerza.',backgroundPhoto:HIST_MEDIA+'archive-v134/juventus-campeon-copa-primera-2019-2020.jpg',image:HIST_ROOT+'assets/official-logos/juventus.png'},
  {kind:'CAMPEÓN',date:'16 feb 2020',season:'2019–2020',winner:'Tavera',title:'Tavera',subtitle:'Campeón de Copa · Segunda Fuerza',detail:'Publicación de Golazo Liga del 16 de febrero de 2020: Tavera fue campeón de Copa 2019–2020 de Segunda Fuerza.',backgroundPhoto:HIST_MEDIA+'archive-v134/tavera-campeon-copa-segunda-2019-2020.jpg',image:HIST_ROOT+'assets/official-logos/tavera-fc.png'},
  {kind:'CAMPEÓN',date:'21 sep 2024',season:'2024',winner:'Juventus',title:'Juventus',subtitle:'Campeón de Campeones · 2024',detail:'Dato e imagen aportados por el usuario: Juventus fue Campeón de Campeones el 21 de septiembre de 2024.',backgroundPhoto:HIST_MEDIA+'archive-v201/juventus-campeon-campeones-21-sep-2024.jpg',image:HIST_ROOT+'assets/official-logos/juventus.png'},
  {kind:'CAMPEÓN',date:'17 nov 2024',season:'2024',winner:'Promesas de Pozos',title:'Promesas de Pozos',subtitle:'Campeón de Liga · Segunda Fuerza',detail:'Dato e imágenes aportados por el usuario: Promesas de Pozos fue campeón del Torneo de Liga de Segunda Fuerza el 17 de noviembre de 2024.',backgroundPhoto:HIST_MEDIA+'archive-v117/promesas-campeon-2024.webp',image:HIST_ROOT+'assets/official-logos/promesas-fc.png'},
  {kind:'CAMPEÓN',date:'23 jul 2023',season:'2022–2023',winner:'Barza',title:'Barza',subtitle:'Campeón de Campeones · Fuerza Intermedia · 2022–2023',detail:'Publicación de Golazo Liga del 23 de julio de 2023: “Felicitamos al equipo BARZA de la categoría intermedia por la obtención del título campeón de campeones. 2022_2023”.',backgroundPhoto:HIST_MEDIA+'archive-v133/barza-campeon-campeones-intermedia-2022-2023.jpg',image:HIST_ROOT+'assets/official-logos/barza.png'},
  {kind:'CAMPEÓN',date:'02 oct 2022',season:'2022',winner:'Juventus',title:'Juventus',subtitle:'Campeón de Copa 2022 · Primera Fuerza',detail:'Publicación de Golazo Liga del 2 de octubre de 2022: “Juventus, campeón de copa 2022, primera fuerza.” El cartel de la Gran Final de Copa 2022 identifica a PSV como rival de Juventus.',backgroundPhoto:HIST_MEDIA+'archive-v133/juventus-campeon-copa-primera-2022.jpg',image:HIST_ROOT+'assets/official-logos/juventus.png'},
{kind:'CAMPEÓN',date:'25 sep 2022',season:'2022',winner:'Barza',title:'Barza',subtitle:'Campeón de Copa · Fuerza Intermedia',detail:'Publicación de Golazo Liga del 25 de septiembre de 2022: “Barza, campeón de Copa fuerza intermedia. Felicidades!!!”.',backgroundPhoto:HIST_MEDIA+'archive-v133/barza-campeon-copa-intermedia-2022.jpg',image:HIST_ROOT+'assets/official-logos/barza.png'},
  {kind:'CAMPEÓN',date:'03 nov 2019',season:'2018–2019',winner:'Juventus',title:'Juventus',subtitle:'Campeón de Liga · temporada 2018–2019',detail:'Fotografía histórica del plantel campeón; Boavista quedó registrado como subcampeón.',backgroundPhoto:HIST_MEDIA+'juventus-campeon-2019.jpg',image:HIST_ROOT+'assets/official-logos/juventus.png'},
  {kind:'CAMPEÓN',date:'Fecha exacta pendiente',season:'Temporada por confirmar',winner:'Tecos',title:'Tecos',subtitle:'Plantel campeón · categoría adulta por identificar',detail:'La fotografía conservada muestra al plantel con camisetas de campeón y trofeo. La fecha exacta no es legible en el material revisado.',backgroundPhoto:HIST_MEDIA+'tecos-campeon-historico.jpg'},
    {kind:'CAMPEÓN',date:'09 jun 2018',season:'2018',winner:'Magisterio',title:'Magisterio',subtitle:'Campeón · torneo/categoría no especificados',detail:'Publicación aportada por el usuario: “Felicidades al campeón. ¡¡Felicidades!! Magisterio.” La publicación no especifica en el texto aportado el torneo ni la categoría.'},
  {kind:'CAMPEÓN',date:'09 jul 2016',season:'2016',winner:'Magisterio',title:'Magisterio',subtitle:'Campeón de Copa',detail:'Publicación aportada por el usuario: “Felicidades al campeón de copa. Felicidades Magisterio”. La categoría no aparece especificada en el texto aportado.',backgroundPhoto:HIST_MEDIA+'archive-v120/magisterio-campeon-copa-2016.jpg'},
  {kind:'CAMPEÓN',date:'28 feb 2016',season:'2016',winner:'Malvinas',title:'Malvinas',subtitle:'Campeón de Campeones · Fuerza Intermedia',detail:'Publicación aportada por el usuario: “¡¡Felicidades!! al campeón de campeones de la categoría intermedia. Felicidades Malvinas”. El subcampeón no está identificado en el material aportado.',backgroundPhoto:HIST_MEDIA+'archive-v120/malvinas-campeon-campeones-intermedia-2016.jpg',image:HIST_ROOT+'assets/official-logos/malvinas.png'},
  {kind:'CAMPEÓN',date:'28 feb 2016',season:'2016',winner:'La Esperanza',title:'La Esperanza',subtitle:'Campeón · Veteranos',detail:'Publicación aportada por el usuario: entrega del premio en efectivo al campeón de la categoría Veteranos. “Felicidades a La Esperanza”.',image:HIST_ROOT+'assets/official-logos/la-esperanza.png'},
  {kind:'CAMPEÓN',date:'27 mar 2016',season:'2016',winner:'Ganador por confirmar',title:'Campeón de Campeones · Segunda Fuerza',subtitle:'Campeón no identificado',detail:'Publicación aportada por el usuario: “Campeón de campeones, de la categoría de segunda fuerza.” El nombre del equipo campeón no fue proporcionado, por lo que no se inventa.'},
{kind:'CAMPEÓN',date:'11 dic 2012',season:'2012',winner:'Tavera FC',title:'Tavera FC',subtitle:'Campeón de Copa · Categoría Segunda',detail:'Golazo Liga felicitó al equipo Tavera como campeón de Copa de la Categoría Segunda el 11 de diciembre de 2012.',image:HIST_ROOT+'assets/official-logos/tavera-fc.png'},
  {kind:'PENALES',date:'23 feb 2013',title:'Magisterio 4–2 Boavista',subtitle:'0–0 en tiempo reglamentario · tanda de penales',detail:'Golazo Liga registró empate 0–0 en tiempo reglamentario y victoria de Magisterio 4–2 en la tanda de penales.'},
  {kind:'CAMPEÓN',date:'15 dic 2013',season:'2013',winner:'Real Cerrito de Gasca',title:'Real Cerrito de Gasca',subtitle:'Campeón · Segunda Fuerza',detail:'Golazo Liga publicó al capitán “Nudo” recibiendo el trofeo de campeón de Segunda Fuerza. En una actualización de la final, Real Cerrito vencía 3–0 a DHP al minuto 35.',backgroundPhoto:HIST_MEDIA+'archive-v120/real-cerrito-campeon-2013.jpg',image:HIST_ROOT+'assets/teams/deportivo-cg.webp'},
  {kind:'FINAL',date:'09 mar 2013',season:'2013',winner:'Ganador por confirmar',title:'Universidad vs Dinamo',subtitle:'Final de Veteranos · Unidad Deportiva Sur · 16:00',detail:'Golazo Liga anunció la final de Veteranos para el sábado 9 de marzo en la Unidad Deportiva Sur a las 16:00. El resultado y el campeón no aparecen en el texto recuperado.',image:HIST_ROOT+'assets/official-logos/dynamo.png'},
  {kind:'FINAL',date:'2019 · día exacto pendiente',season:'2019',winner:'Ganador por confirmar',title:'Chelsea vs La Esperanza',subtitle:'Veteranos · Final de Copa · 17:30 · Campo 1',detail:'El rol histórico confirma el año 2019, la final, la hora y el Campo 1. El día exacto y el resultado no son legibles en el material recuperado.'},
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
  // V132 — palmarés 2025–2026 confirmado por el usuario y sus fotografías.
  {season:'07 jun 2026',competition:'Torneo de Liga · Segunda Fuerza',champion:'La Canchita Deportes',runner:'Aldama FC',source:'Dato e imagen aportados por el usuario: La Canchita Deportes campeón y Aldama FC subcampeón.',photo:HIST_MEDIA+'archive-v132/canchita-deportes-campeon-segunda-2026.jpg'},
  {season:'24 may 2026',competition:'Campeón de Campeones · categoría por precisar',champion:'Franco FC',runner:'Lobos CDG',source:'Dato e imagen aportados por el usuario: Franco FC ganó el Campeón de Campeones ante Lobos CDG.',photo:HIST_MEDIA+'archive-v132/franco-fc-campeon-de-campeones-2026.jpg'},
  {season:'23 may 2026',competition:'Final · categoría por precisar',champion:'La Esperanza',runner:'—',source:'Dato e imagen aportados por el usuario: La Esperanza ganó la final del 23 de mayo de 2026.',photo:HIST_MEDIA+'archive-v132/la-esperanza-campeon-23-mayo-2026.jpg'},
  {season:'10 may 2026',competition:'Torneo de Liga · Fuerza Intermedia',champion:'Franco FC',runner:'La Esperanza',source:'Dato e imágenes aportados por el usuario: Franco FC campeón; La Esperanza subcampeón.',photo:HIST_MEDIA+'archive-v132/franco-fc-campeon-intermedia-2026.jpg'},
  {season:'15 mar 2026',competition:'Torneo de Liga · Primera Fuerza',champion:'Linces',runner:'Galácticos',source:'Dato e imágenes aportados por el usuario: Linces campeón; Galácticos subcampeón.',photo:HIST_MEDIA+'archive-v132/linces-campeon-primera-2026.jpg'},
  {season:'20 dic 2025',competition:'Torneo de Copa · categoría por precisar',champion:'Salvajes',runner:'Juventus',source:'Dato e imagen aportados por el usuario: Salvajes ganó la final de Copa frente a Juventus.',photo:HIST_MEDIA+'archive-v132/salvajes-campeon-copa-2025.jpg'},
  {season:'08 nov 2025',competition:'Final · Veteranos 50 y más',champion:'La Esperanza',runner:'Manchester',source:'Dato aportado por el usuario: La Esperanza campeón de Veteranos 50 y más frente a Manchester.'},
  {season:'20 sep 2025',competition:'Torneo de Liga · Veteranos 35 y más',champion:'Juventus',runner:'Salvajes',source:'Dato e imagen aportados por el usuario: Juventus campeón; Salvajes subcampeón.',photo:HIST_MEDIA+'archive-v132/juventus-campeon-liga-veteranos-35-2025.jpg'},
  {season:'29 jun 2025',competition:'Torneo de Liga · Segunda Fuerza',champion:'La Huerta de Cuenda',runner:'Tavera FC',source:'Dato aportado por el usuario: La Huerta de Cuenda campeón y Tavera FC subcampeón.',photo:HIST_MEDIA+'archive-v119/la-huerta-finalista-2025.jpg'},
  {season:'19 ene 2020',competition:'Torneo de Copa · Fuerza Intermedia',champion:'El Alto',runner:'—',source:'Golazo Liga publicó el 19 de enero de 2020: “El Alto, campeón de copa, fuerza intermedia.”',photo:HIST_MEDIA+'archive-v134/el-alto-campeon-copa-intermedia-2020.jpg'},
  {season:'17 nov 2019',competition:'Torneo de Copa 2019 · Veteranos',champion:'PSV',runner:'—',source:'Publicación histórica aportada por el usuario: PSV fue campeón de Copa 2019 en Veteranos.',championLogo:HIST_ROOT+'assets/teams/psv.webp'},
  {season:'16 sep 2019',competition:'Torneo de Liga 2018–2019',champion:'La Pandilla de Morales',runner:'—',source:'Publicación histórica aportada por el usuario que felicita a La Pandilla y Linces Junior como campeones de Liga 2018–2019. La categoría específica de esta felicitación no se fuerza aquí.'},
  {season:'16 sep 2019',competition:'Torneo de Liga 2018–2019',champion:'Linces Jr.',runner:'—',source:'Publicación histórica aportada por el usuario que felicita a La Pandilla y Linces Junior como campeones de Liga 2018–2019. La categoría específica de esta felicitación no se fuerza aquí.',championLogo:HIST_ROOT+'assets/official-logos/linces.png'},
  {season:'22 jun 2019',competition:'Campeón de Campeones · Veteranos',champion:'La Esperanza',runner:'—',source:'Publicación histórica aportada por el usuario: La Esperanza fue campeón de Campeones de Veteranos.',championLogo:HIST_ROOT+'assets/official-logos/la-esperanza.png'},
  {season:'09 jun 2018',competition:'Campeonato · categoría/torneo no especificados',champion:'Magisterio',runner:'—',source:'Publicación histórica aportada por el usuario: “Felicidades al campeón. ¡¡Felicidades!! Magisterio.”'},
  {season:'28 feb 2016',competition:'Campeón de Campeones · Fuerza Intermedia',champion:'Malvinas',runner:'—',source:'Publicación histórica aportada por el usuario. El subcampeón no está identificado.',championLogo:HIST_ROOT+'assets/official-logos/malvinas.png'},
  {season:'28 feb 2016',competition:'Categoría Veteranos',champion:'La Esperanza',runner:'—',source:'Publicación histórica aportada por el usuario: entrega del premio en efectivo al campeón de Veteranos.',championLogo:HIST_ROOT+'assets/official-logos/la-esperanza.png'},
  {season:'02 oct 2021',competition:'Campeón de Campeones · Veteranos · 2020–2021',champion:'PSV',runner:'—',source:'Golazo Liga publicó el 2 de octubre de 2021 a PSV como Campeón de Campeones de la temporada 2020–2021 en Veteranos.',photo:HIST_MEDIA+'archive-v134/psv-campeon-campeones-veteranos-2020-2021.jpg',championLogo:HIST_ROOT+'assets/teams/psv.webp'},
  {season:'25 sep 2021',competition:'Torneo de Liga · Veteranos · 2020–2021',champion:'La Esperanza',runner:'Real Cuenda',source:'Golazo Liga publicó el 25 de septiembre de 2021 que La Esperanza ganó el título de Liga 2020–2021 ante Real Cuenda en una final decidida por tiros penales.',photo:HIST_MEDIA+'archive-v134/la-esperanza-campeon-liga-veteranos-2020-2021.jpg',championLogo:HIST_ROOT+'assets/official-logos/la-esperanza.png'},
  {season:'16 feb 2020',competition:'Torneo de Copa 2019–2020 · Primera Fuerza',champion:'Juventus',runner:'—',source:'Golazo Liga publicó el 16 de febrero de 2020 a Juventus como campeón de Copa 2019–2020 de Primera Fuerza.',photo:HIST_MEDIA+'archive-v134/juventus-campeon-copa-primera-2019-2020.jpg',championLogo:HIST_ROOT+'assets/official-logos/juventus.png'},
  {season:'16 feb 2020',competition:'Torneo de Copa 2019–2020 · Segunda Fuerza',champion:'Tavera',runner:'—',source:'Golazo Liga publicó el 16 de febrero de 2020 a Tavera como campeón de Copa 2019–2020 de Segunda Fuerza.',photo:HIST_MEDIA+'archive-v134/tavera-campeon-copa-segunda-2019-2020.jpg',championLogo:HIST_ROOT+'assets/official-logos/tavera-fc.png'},
  {season:'20 mar 2022',competition:'Torneo de Liga · Segunda Fuerza',champion:'Galácticos FC',runner:'—',source:'Texto histórico aportado por el usuario desde Golazo Liga: “Galácticos FC campeón de liga, en segunda fuerza. Con esto logra su ascenso a la fuerza intermedia.”',championLogo:HIST_ROOT+'assets/teams/galacticos-pozos.webp'},
  {season:'2014 · fecha exacta pendiente',competition:'Torneo de Copa · Segunda Fuerza',champion:'DHP',runner:'—',source:'Dato histórico aportado directamente por el usuario. Falta adjuntar la publicación o fotografía original para fijar la fecha exacta del título.'},
  {season:'23 jul 2023',competition:'Campeón de Campeones · Fuerza Intermedia · 2022–2023',champion:'Barza',runner:'—',source:'Golazo Liga, publicación del 23 de julio de 2023: Barza fue felicitado por obtener el título de Campeón de Campeones de la categoría Intermedia 2022–2023.',photo:HIST_MEDIA+'archive-v133/barza-campeon-campeones-intermedia-2022-2023.jpg',championLogo:HIST_ROOT+'assets/official-logos/barza.png'},
  {season:'02 oct 2022',competition:'Torneo de Copa 2022 · Primera Fuerza',champion:'Juventus',runner:'PSV',source:'Golazo Liga publicó el 2 de octubre de 2022 a Juventus como campeón de Copa 2022 de Primera Fuerza. El cartel de la final del mismo día muestra Juventus vs PSV.',photo:HIST_MEDIA+'archive-v133/juventus-campeon-copa-primera-2022.jpg',championLogo:HIST_ROOT+'assets/official-logos/juventus.png'},
  {season:'25 sep 2022',competition:'Torneo de Copa · Fuerza Intermedia',champion:'Barza',runner:'—',source:'Golazo Liga, publicación del 25 de septiembre de 2022: “Barza, campeón de Copa fuerza intermedia. Felicidades!!!”.',photo:HIST_MEDIA+'archive-v133/barza-campeon-copa-intermedia-2022.jpg',championLogo:HIST_ROOT+'assets/official-logos/barza.png'},
  {season:'15 dic 2013',competition:'Segunda Fuerza',champion:'Real Cerrito de Gasca',runner:'DHP',source:'Golazo Liga publicó al capitán “Nudo” recibiendo el trofeo de campeón de Segunda Fuerza. Otra publicación de la misma final registró a Real Cerrito arriba 3–0 sobre DHP al minuto 35; no se usa ese marcador parcial como resultado final.',championLogo:HIST_ROOT+'assets/teams/deportivo-cg.webp'},
  {season:'22 feb 2014',competition:'Torneo de Copa · Fuerza Intermedia',champion:'Puros Cuates',runner:'—',source:'Publicación de Golazo Liga: “Trofeo para el equipo Puros Cuates Campeón del Torneo De Copa 2014 en la Categoría Fuerza Intermedia”.',photo:HIST_PHOTOS.purosCuatesTrophy2014||''},
  {season:'11 ene 2015',competition:'Campeonato · Intermedia',champion:'Puros Cuates',runner:'—',source:'Publicación de Golazo Liga del 11 de enero de 2015: “Puros cuates... campeón de intermedia”.'},
  {season:'18 ene 2015',competition:'Campeón de Campeones · Primera',champion:'Boavista',runner:'—',source:'Publicación de Golazo Liga: el capitán de Boavista recibe el trofeo de Campeón de Campeones de Primera.',championLogo:HIST_ROOT+'assets/official-logos/boavista.png'},
  {season:'09 jul 2016',competition:'Torneo de Copa · categoría no visible en la publicación',champion:'Magisterio',runner:'—',source:'Publicación de Golazo Liga del 9 de julio de 2016: “Felicidades al campeón de copa. Felicidades Magisterio”.'},
  {season:'2018–2019',competition:'Torneo de Liga · Primera Fuerza',champion:'Juventus',runner:'Boavista',third:'Abejas',source:'Publicaciones históricas aportadas por el usuario del 3 nov 2019: Juventus campeón de Liga 2018–2019, Boavista subcampeón y Abejas tercer lugar de Primera Fuerza.',photo:HIST_MEDIA+'juventus-campeon-2019.jpg',championLogo:HIST_ROOT+'assets/official-logos/juventus.png',runnerLogo:HIST_ROOT+'assets/official-logos/boavista.png'},
  {season:'Archivo fotográfico',competition:'Campeonato · categoría adulta por identificar',champion:'Tecos',runner:'—',source:'Fotografía del archivo: el plantel aparece con camisetas “CAMPEON TECOS” y trofeo.',photo:HIST_MEDIA+'tecos-campeon-historico.jpg'},
  {season:'11 dic 2012',competition:'Torneo de Copa · Categoría Segunda',champion:'Tavera FC',runner:'—',source:'Golazo Liga publicó el 11 de diciembre de 2012 una felicitación explícita al equipo Tavera como campeón de Copa de la Categoría Segunda.',championLogo:HIST_ROOT+'assets/official-logos/tavera-fc.png'},
  {season:'12 abr 2025',competition:'Torneo de Liga · Veteranos 50+',champion:'Boavista FC',runner:'Boca Jrs.',source:'El rol publicado el 9 abr 2025 programa Boca Jrs. vs Boavista a las 16:00 en Campo 1; la publicación del 12 abr presenta a Boavista F C como “CAMPEÓN 2025”.',championLogo:HIST_ROOT+'assets/official-logos/boavista.png'},
  {season:'16 feb 2025',competition:'Torneo Relámpago · Segunda Fuerza',champion:'Lobos Jrs.',runner:'—',source:'Dato e imagen aportados por el usuario: Lobos Jrs. fue campeón del Torneo Relámpago de Segunda Fuerza.',photo:HIST_MEDIA+'archive-v197/lobos-jrs-campeon-relampago-segunda-2025.svg'},
  {season:'09 feb 2025',competition:'Campeón de Campeones · Primera Fuerza',champion:'Galácticos',runner:'—',source:'Fotografía aportada por el usuario: Galácticos aparece identificado como “CAMPEÓN DE CAMPEONES” el 9 de febrero de 2025.',championLogo:HIST_ROOT+'assets/teams/galacticos-pozos.webp'},
  {season:'04 feb 2025',competition:'Torneo de Liga · Primera Fuerza',champion:'Herreras FC',runner:'—',source:'Dato e imagen aportados por el usuario: Herreras FC fue campeón de Liga de Primera Fuerza.',photo:HIST_MEDIA+'archive-v120/herreras-fc-campeon-relampago-intermedia-2025.jpg',championLogo:HIST_ROOT+'assets/official-logos/herreras-fc.png'},
  {season:'2025 · fecha exacta pendiente',competition:'Campeón de Campeones · Veteranos',champion:'Manchester',runner:'—',source:'Fotografía aportada por el usuario: Manchester aparece identificado como “CAMPEÓN DE CAMPEONES”. Se conserva el año 2025; la fecha exacta queda pendiente de documentar.',championLogo:HIST_ROOT+'assets/official-logos/manchester.png'},
  {season:'08 jun 2025',competition:'Torneo de Copa · Primera Fuerza',champion:'Galácticos (Pozos)',runner:'Herreras FC (Cuenda)',source:'La final fue Galácticos vs Herreras FC, domingo 8 de junio de 2025 a las 10:00 en Campo 1 de la Unidad Deportiva Sur. Ese mismo día la Liga publicó a Galácticos (Pozos) como “CAMPEÓN DE COPA 2025”.',championLogo:HIST_ROOT+'assets/teams/galacticos-pozos.webp',runnerLogo:HIST_ROOT+'assets/official-logos/herreras-fc.png'},
  {season:'15 jun 2025',competition:'Torneo de Copa · Fuerza Intermedia',champion:'Lobos CDG',runner:'Franco FC',source:'La Liga felicitó a Lobos CDG, de Cerrito de Gasca, por el título de Campeón de Copa 2025 tras vencer a Franco F.C., de San José de Manantiales. Los roles previos sitúan a ambos en las semifinales de Intermedia.',photo:HIST_MEDIA+'archive-v196/lobos-cdg-campeon-copa-intermedia-2025.webp'}
];

const historicalPhotoArchive=[
  {date:'04 feb 2025',title:'Herreras FC · campeón de Liga · Primera Fuerza',detail:'Fotografía aportada por el usuario para documentar el campeonato de Liga de Primera Fuerza.',image:HIST_MEDIA+'archive-v120/herreras-fc-campeon-relampago-intermedia-2025.jpg'},
  {date:'16 feb 2025',title:'Lobos Jrs. · campeón del Torneo Relámpago · Segunda Fuerza',detail:'Fotografía exacta aportada por el usuario.',image:HIST_MEDIA+'archive-v197/lobos-jrs-campeon-relampago-segunda-2025.svg'},
  {date:'02 oct 2021',title:'PSV · Campeón de Campeones de Veteranos · 2020–2021',detail:'Publicación exacta de Golazo Liga aportada por el usuario.',image:HIST_MEDIA+'archive-v134/psv-campeon-campeones-veteranos-2020-2021.jpg'},
  {date:'25 sep 2021',title:'La Esperanza · campeón de Liga de Veteranos 2020–2021',detail:'Publicación exacta de Golazo Liga: La Esperanza venció a Real Cuenda por penales.',image:HIST_MEDIA+'archive-v134/la-esperanza-campeon-liga-veteranos-2020-2021.jpg'},
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
  {date:'15 jun 2025',title:'Lobos CDG · Campeón de Copa 2025',detail:'Fotografía del plantel asociada al título de Copa de Fuerza Intermedia 2025.',image:HIST_MEDIA+'archive-v196/lobos-cdg-campeon-copa-intermedia-2025.webp'},
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
  {date:'18 ene 2015',title:'Boavista · Campeón de Campeones',detail:'El capitán de Boavista aparece recibiendo el trofeo de Campeón de Campeones de Primera.',image:HIST_ROOT+'assets/official-logos/boavista.png'},
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
  {date:'26 abr 2025',title:'Campeón de Campeones · Veteranos 50+',detail:'Cartel histórico: Manchester United vs B.F.C., 17:00, Campo 1, Unidad Deportiva Sur. El material identifica el encuentro como “CAMPEÓN DE CAMPEONES”; no se asigna ganador porque el cuadro revisado no muestra el resultado.',image:HIST_ROOT+'assets/official-logos/manchester.png'},
  {date:'08 jun 2025',title:'Galácticos (Pozos) · campeón de Copa',detail:'Final de Primera Fuerza: Galácticos vs Herreras FC (Cuenda), 10:00, Campo 1, Unidad Deportiva Sur. La publicación del mismo día identifica a Galácticos (Pozos) como Campeón de Copa 2025.',image:HIST_ROOT+'assets/teams/galacticos-pozos.webp'},
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
  {tag:'CAMPEÓN',title:'Galácticos (Pozos)',value:'Copa 2025',detail:'Campeón de Primera Fuerza el 8 jun 2025 ante Herreras FC (Cuenda).'},
  {tag:'CAMPEÓN',title:'Herreras FC',value:'Liga 2025 · Primera Fuerza',detail:'Campeón de Liga el 4 feb 2025.',image:HIST_MEDIA+'archive-v120/herreras-fc-campeon-relampago-intermedia-2025.jpg'},
  {tag:'CAMPEÓN',title:'Lobos Jrs.',value:'Relámpago 2025 · Segunda Fuerza',detail:'Campeón del Torneo Relámpago el 16 feb 2025.',image:HIST_MEDIA+'archive-v197/lobos-jrs-campeon-relampago-segunda-2025.svg'},
  {tag:'CAMPEÓN',title:'Lobos CDG',value:'Copa 2025 · Fuerza Intermedia',detail:'Campeón de Copa tras ganar la final del 15 jun 2025.',image:HIST_MEDIA+'archive-v196/lobos-cdg-campeon-copa-intermedia-2025.webp'}
];

const historicResults=[
  {date:'2022',category:'Primera Fuerza · J19',winner:'Juventus',against:'Lobos CDG'},
  {date:'2022',category:'Intermedia · J19',winner:'La Huerta',against:'Galaxy'},
  {date:'2022',category:'Intermedia · J19',winner:'Sección 14',against:'A. Pozos'},
  {date:'2022',category:'Segunda Fuerza · J18',winner:'Galácticos FC',against:'San Juan FC'}
];

const historicFinalists=[
  {year:'15 dic 2013',category:'Segunda Fuerza · final y podio',a:'Campeón: Real Cerrito de Gasca',b:'Subcampeón: DHP',note:'Golazo Liga documentó al capitán de Real Cerrito recibiendo el trofeo de campeón. San José de la Montaña quedó tercero por default ante Tavera.',logoA:HIST_ROOT+'assets/teams/deportivo-cg.webp'},
  {year:'12 abr 2025',category:'Veteranos 50+ · Final de Liga 2025',a:'Boca Jrs.',b:'Boavista FC',note:'16:00 · Campo 1 · Unidad Deportiva Sur. Boavista aparece publicado como CAMPEÓN 2025 el mismo día.',logoB:HIST_ROOT+'assets/official-logos/boavista.png'},
  {year:'26 abr 2025',category:'Veteranos 50+ · Campeón de Campeones',a:'Manchester United',b:'B.F.C.',note:'17:00 · Campo 1 · Unidad Deportiva Sur. El resultado no es visible en el fragmento revisado.',logoA:HIST_ROOT+'assets/official-logos/manchester.png'},
  {year:'08 jun 2025',category:'Primera Fuerza · Final de Copa 2025',a:'Galácticos (Pozos)',b:'Herreras FC (Cuenda)',note:'10:00 · Campo 1 · Unidad Deportiva Sur. Galácticos fue publicado como campeón.',logoA:HIST_ROOT+'assets/teams/galacticos-pozos.webp',logoB:HIST_ROOT+'assets/official-logos/herreras-fc.png'},
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
  {date:'04–16 feb 2025',title:'Herreras FC y Lobos Jrs. · campeones',detail:'Herreras FC fue campeón de Liga de Primera Fuerza el 4 de febrero de 2025; Lobos Jrs. ganó el Torneo Relámpago de Segunda Fuerza el 16 de febrero de 2025.'},
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

function historyMomentCard(m){
  const championBg=m.kind==='CAMPEÓN'?championBackground(m.title,m.backgroundPhoto||''):null;
  const hasBg=!!(championBg?.url||m.backgroundPhoto);
  const bgExact=!!championBg?.exact;
  return '<article class="v35-history-moment '+(hasBg?'v35-history-moment-photo ':'')+((hasBg&&!bgExact)?'v35-history-moment-reference':'')+'">'+
    (m.kind==='CAMPEÓN'?championBgImg(m.title,m.backgroundPhoto||'',m.season||m.date,'v35-history-bg-photo'):(m.backgroundPhoto?'<img class="v35-history-bg-photo v35-bg-exact" src="'+m.backgroundPhoto+'" alt="'+esc(m.title)+' · archivo histórico" loading="lazy" decoding="async">':''))+
    '<div class="v35-history-moment-shade" aria-hidden="true"></div>'+
    '<div class="v35-history-moment-content">'+

      '<div class="v35-history-meta"><span class="v35-history-kind">'+esc(m.kind)+'</span>'+(m.date?'<time class="v35-history-date">'+esc(m.date)+'</time>':'')+'</div>'+
      '<h3>'+esc(m.title)+'</h3>'+
      '<strong>'+esc(m.subtitle)+'</strong>'+
      ((m.winner||m.season)?'<div class="v35-history-status">'+
        (m.winner?'<span><b>Ganador</b>'+esc(m.winner)+'</span>':'')+
        (m.season?'<span><b>Temporada</b>'+esc(m.season)+'</span>':'')+
      '</div>':'')+
      '<p>'+esc(m.detail)+'</p>'+
    '</div>'+
  '</article>';
}
function historyMomentCards(){
  const featured=historyMoments.filter(m=>!m.archiveOnly);
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
    '<div class="v35-champion-list">'+verifiedChampions.map(x=>{
      const bg=championBackground(x.champion,x.photo||'');
      return '<article class="v35-champion-card v35-champion-card-photo '+(!bg.exact?'v35-champion-card-reference':'')+'">'+
        championBgImg(x.champion,x.photo||'',x.season,'v35-champion-bg-photo')+'<span class="v35-champion-shade" aria-hidden="true"></span>'+
        '<div class="v35-champion-content">'+

          '<span class="v35-champion-date">'+esc(x.season)+'</span><h4>'+esc(x.champion)+'</h4><b>'+esc(x.competition)+'</b><p>'+(x.runner&&x.runner!=='—'?'Subcampeón: '+esc(x.runner)+'. ':'')+esc(x.source)+'</p>'+
        '</div></article>';
    }).join('')+'</div>'+
    '<div class="v35-history-subhead"><span>FOTOS DE CAMPEONES Y TROFEOS</span><h3>Archivo visual recuperado</h3><p>Fotografías reales conservadas en el archivo de la Liga. Se muestran debajo del palmarés sin modificar la parte superior de Historia.</p></div>'+
    '<div class="v35-champion-list v35-photo-archive">'+historicalPhotoArchive.filter(x=>x.image).map(x=>'<article class="v35-champion-card"><img class="v35-champion-photo" src="'+x.image+'" alt="'+esc(x.title)+'" loading="lazy" decoding="async"><span>'+esc(x.date)+'</span><h4>'+esc(x.title)+'</h4><p>'+esc(x.detail)+'</p></article>').join('')+'</div>'+
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
function championsArchiveBlock(){
  const rows=historyMoments.filter(m=>(m.kind==='CAMPEÓN'||m.kind==='FINAL')&&!m.archiveOnly);
  return '<section class="v35-block v35-history-archive v35-history-archive-compact">'+
    '<div class="v35-history-archive-head"><span>PALMARÉS HISTÓRICO</span><h2>Campeones y finales documentadas</h2><p>Solo se muestran datos que aparecen en el material histórico revisado.</p></div>'+
    '<div class="v35-history-moments">'+rows.map(historyMomentCard).join('')+'</div>'+verifiedHistoryBlocks()+
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
  requestAnimationFrame(syncHistoryCollapse);
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