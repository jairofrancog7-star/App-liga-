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
const ESPERANZA_2025_INLINE='data:image/webp;base64,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';
const ESPERANZA_2025_PHOTO=ESPERANZA_2025_INLINE;
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
  {kind:'CAMPEÓN',date:'26 abr 2025',season:'2025',winner:'Manchester',title:'Manchester',subtitle:'Campeón de Campeones · Veteranos 50 y más',detail:'La Liga Municipal de Fútbol Juventino Rosas A. C. felicitó al equipo Manchester por obtener la presea de Campeón de Campeones tras vencer a Boavista F. C. el 26 de abril de 2025.',backgroundPhoto:MANCHESTER_2025_INLINE,image:HIST_ROOT+'assets/official-logos/manchester.png'},
  {kind:'CAMPEÓN',date:'12 abr 2025',season:'2025',winner:'Boavista FC',title:'Boavista FC',subtitle:'Campeón de Liga · Veteranos 50 y más',detail:'Fotografía aportada por el usuario y registro ya documentado en el archivo: Boavista FC aparece como CAMPEÓN 2025 del Torneo de Liga de Veteranos 50 y más.',backgroundPhoto:HIST_MEDIA+'archive-v120/boavista-fc-campeon-2025.jpg',image:HIST_ROOT+'assets/official-logos/boavista.png'},
  {kind:'CAMPEÓN',date:'15 sep 2024',season:'2024',winner:'Pozos FC',title:'Pozos FC',subtitle:'Campeón de Liga · Veteranos 35 y más',detail:'Fotografía exacta aportada por el usuario: Pozos FC fue campeón del Torneo de Liga de Veteranos 35 y más el 15 de septiembre de 2024. Corrección confirmada: el campeón fue Pozos FC, no PSV.',backgroundPhoto:HIST_MEDIA+'archive-v199/pozos-fc-campeon-liga-veteranos35-15-sep-2024.jpg',image:HIST_ROOT+'assets/teams/pozos-fc.webp'},
  {kind:'CAMPEÓN',date:'09 nov 2024',season:'2024',winner:'Manchester',title:'Manchester',subtitle:'Campeón del Torneo de Copa · Veteranos 50 y más',detail:'Dato e imagen aportados por el usuario: Manchester fue campeón del Torneo de Copa de Veteranos 50 y más el 9 de noviembre de 2024.',backgroundPhoto:'./assets/history/archive-v227/manchester-veteranos50-copa-09-nov-2024.webp?v=20260923-manchester-v227',image:HIST_ROOT+'assets/official-logos/manchester.png'},
  {kind:'CAMPEÓN',date:'17 feb 2024',season:'2024',winner:'Juventus',title:'Juventus',subtitle:'Campeón del Torneo de Copa · Veteranos 35 y más',detail:'Material aportado por el usuario: el cartel de la Gran Final de Veteranos fija Juventus vs PSV Eindhoven para el sábado 17 de febrero de 2024; la publicación del 18 de febrero felicita a Juventus como campeón del Torneo de Copa 2024 de Veteranos 35 y más.',backgroundPhoto:HIST_MEDIA+'archive-v202/juventus-campeon-copa-veteranos35-17-feb-2024.webp',image:HIST_ROOT+'assets/official-logos/juventus.png'},
  {kind:'CAMPEÓN',date:'18 feb 2024',season:'2024',winner:'San Julián',title:'San Julián',subtitle:'Campeón del Torneo de Copa · Segunda Fuerza',detail:'Publicación aportada por el usuario con fecha 18 de febrero de 2024: la Liga Municipal de Fútbol Juventino Rosas felicita a San Julián como digno campeón del Torneo de Copa de Segunda Fuerza. Fotografía exacta aportada por el usuario.',backgroundPhoto:HIST_MEDIA+'archive-v218/san-julian-campeon-copa-segunda-18-feb-2024.jpg',image:HIST_ROOT+'assets/official-logos/san-julian.png'},
  {kind:'CAMPEÓN',date:'25 feb 2024',season:'2024',winner:'Mineros F. C.',title:'Mineros F. C.',subtitle:'Campeón · Fuerza Intermedia',detail:'Publicación aportada por el usuario con fecha 26 de febrero de 2024: señala que el día anterior se disputó la final de Fuerza Intermedia y que Mineros F. C., representante de la comunidad del Naranjillo, quedó campeón. El partido fue dedicado a Luis Manuel García Servín. Fotografía exacta aportada por el usuario.',backgroundPhoto:HIST_MEDIA+'archive-v218/mineros-fc-campeon-intermedia-25-feb-2024.jpg',image:HIST_ROOT+'assets/teams/mineros-fc.webp'},
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
  {kind:'CAMPEÓN',date:'09 feb 2025',season:'2025',winner:'Galácticos de Pozos',title:'Galácticos de Pozos',subtitle:'Campeón de Campeones · Primera Fuerza',detail:'La Liga Municipal de Fútbol “JUVENTINO ROSAS” A.C. felicitó al equipo GALÁCTICOS de Pozos por haber obtenido el cetro de Campeón de Campeones, al imponerse al equipo LINCES el 9 de febrero de 2025.',backgroundPhoto:HIST_MEDIA+'archive-v203/galacticos-campeon-campeones-09-feb-2025.jpg?v=20260923-galacticos-cdc-v213',image:HIST_ROOT+'assets/teams/galacticos-pozos.webp'},
  {kind:'CAMPEÓN',date:'16 feb 2025',season:'2025',winner:'Lobos Jrs.',title:'Lobos Jrs.',subtitle:'Campeón · Torneo Relámpago · Segunda Fuerza',detail:'Dato e imagen aportados por el usuario: Lobos Jrs. ganó el Torneo Relámpago de Segunda Fuerza el 16 de febrero de 2025.',backgroundPhoto:HIST_MEDIA+'archive-v207/lobos-jrs-campeon-relampago-segunda-16-feb-2025.webp'},
  // V196 — Lobos CDG · Campeón de Copa · Fuerza Intermedia 2025
  {kind:'CAMPEÓN',date:'15 jun 2025',season:'2025',winner:'Lobos CDG',title:'Lobos CDG · Cerrito de Gasca',subtitle:'Campeón de Copa · Fuerza Intermedia',detail:'La Liga Municipal de Fútbol felicita a Lobos CDG, de la comunidad de Cerrito de Gasca, por haber obtenido el título de Campeón de Copa 2025 ante Franco FC, de la comunidad de San José de Manantiales.',backgroundPhoto:HIST_MEDIA+'archive-v207/lobos-cdg-campeon-copa-intermedia-15-jun-2025.webp?v=20260923-lobos-clean-v212',image:HIST_ROOT+'assets/official-logos/lobos-cdg.png'},
  {kind:'TERCER LUGAR',date:'23 nov 2013',title:'Romerillo',subtitle:'Tercer lugar · Fuerza Intermedia',detail:'Golazo Liga publicó que el portero de Romerillo fue clave para que su equipo obtuviera el tercer lugar, destacando una atajada de penal en la serie final. El nombre del portero no es visible en la captura aportada.'},
  {kind:'CAMPEÓN',date:'2014 · fecha exacta pendiente',season:'2014',winner:'DHP',title:'DHP',subtitle:'Campeón del Torneo de Copa 2014 · Segunda Fuerza',detail:'Dato histórico aportado directamente por el usuario: DHP fue campeón del Torneo de Copa 2014 de Segunda Fuerza. La publicación o fotografía original queda pendiente de adjuntar para documentar la fecha exacta.'},
  {kind:'CAMPEÓN',date:'22 feb 2014',season:'2014',winner:'Puros Cuates',title:'Puros Cuates',subtitle:'Campeón de Copa · Fuerza Intermedia',detail:'La publicación de Golazo Liga muestra el trofeo entregado al equipo campeón.',backgroundPhoto:HIST_PHOTOS.purosCuatesTrophy2014||'',image:''},
  {kind:'CAMPEÓN',date:'18 sep 2022',season:'2022',winner:'Terrícolas SEDER',title:'Terrícolas SEDER',subtitle:'Campeón de Copa · Segunda Fuerza',detail:'Publicación histórica de Golazo Liga: Terrícolas SEDER fue identificado como campeón de Copa 2022 de Segunda Fuerza.',image:HIST_ROOT+'assets/official-logos/terricolas.png'},
  {kind:'CAMPEÓN',date:'10 abr 2022',season:'2022',winner:'Tavera FC',title:'Tavera FC',subtitle:'Campeón de Liga · Fuerza Intermedia',detail:'Golazo Liga publicó a Tavera FC como campeón de Liga 2022 de Fuerza Intermedia; con ese campeonato logró el ascenso a Primera Fuerza.',backgroundPhoto:HIST_MEDIA+'archive-v185/tavera-campeon-intermedia-2022.webp',image:HIST_ROOT+'assets/official-logos/tavera-fc.png'},
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
  {season:'26 abr 2025',competition:'Campeón de Campeones · Veteranos 50 y más',champion:'Manchester',runner:'Boavista FC',source:'La Liga Municipal de Fútbol Juventino Rosas A. C. felicitó al equipo Manchester por obtener la presea de Campeón de Campeones tras vencer a Boavista F. C. el 26 de abril de 2025. Fotografía exacta aportada por el usuario.',photo:MANCHESTER_2025_INLINE,championLogo:HIST_ROOT+'assets/official-logos/manchester.png',runnerLogo:HIST_ROOT+'assets/official-logos/boavista.png'},
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
  {date:'26 abr 2025',title:'Manchester · Campeón de Campeones · Veteranos 50+',detail:'Manchester fue Campeón de Campeones tras vencer a Boavista FC el 26 de abril de 2025. Fotografía exacta aportada por el usuario.',image:'./assets/history/archive-v225/manchester-campeon-campeones-26-abr-2025.webp?v=20260923-manchester-clean-v225'},
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
    removeDuplicateTecosChampion(screen);
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

const MANCHESTER_2025_INLINE='data:image/webp;base64,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';

function v229ManchesterChampionCard(m){
  /* V234 — Manchester · 26 abr 2025.
     Foto exacta embebida dentro del bundle para que siempre aparezca
     tanto en Resumen como en Historia > Campeones, sin depender de rutas
     externas, caché del navegador ni fallos 404 de GitHub Pages. */
  return '<article class="v229-manchester-card" data-v229-manchester-card data-v234-manchester-inline>'+
    '<img class="v229-manchester-photo" src="'+MANCHESTER_2025_INLINE+'" alt="Manchester · Campeón de Campeones · Veteranos 50 y más · 26 abr 2025" loading="eager" decoding="sync">'+
    '<span class="v229-manchester-shade" aria-hidden="true"></span>'+
    '<div class="v229-manchester-body">'+
      '<div class="v229-manchester-meta"><span class="v35-history-kind">'+esc(m.kind)+'</span><time class="v35-history-date">'+esc(m.date)+'</time></div>'+
      '<h3>'+esc(m.title)+'</h3>'+
      '<strong>'+esc(m.subtitle)+'</strong>'+
      '<div class="v229-manchester-status">'+
        '<span><b>Ganador</b>'+esc(m.winner||m.title)+'</span>'+
        '<span><b>Temporada</b>'+esc(m.season||'2025')+'</span>'+
      '</div>'+
      '<p>'+esc(m.detail)+'</p>'+
    '</div>'+
  '</article>';
}
function v229IsManchesterChampion(m){
  const n=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  return n(m?.title)==='manchester' && n(m?.date).includes('26 abr 2025');
}

function v228EsperanzaChampionCard(m){
  /* V233 — tarjeta reconstruida otra vez desde cero.
     La fotografía va EMBEBIDA en el bundle como data:image/webp;base64;
     no usa rutas, raw.githubusercontent, scripts auxiliares ni archivos que puedan dar 404. */
  return '<article class="v228-esperanza-card" data-v228-esperanza-card data-v233-esperanza-inline>'+
    '<img class="v228-esperanza-photo" src="'+ESPERANZA_2025_INLINE+'" alt="La Esperanza · Campeón de Copa · Veteranos 50 y más · 08 nov 2025" loading="eager" decoding="sync">'+
    '<span class="v228-esperanza-shade" aria-hidden="true"></span>'+
    '<div class="v228-esperanza-body">'+
      '<div class="v228-esperanza-meta"><span class="v35-history-kind">'+esc(m.kind)+'</span><time class="v35-history-date">'+esc(m.date)+'</time></div>'+
      '<h3>'+esc(m.title)+'</h3>'+
      '<strong>'+esc(m.subtitle)+'</strong>'+
      '<div class="v228-esperanza-status">'+
        '<span><b>Ganador</b>'+esc(m.winner||m.title)+'</span>'+
        '<span><b>Temporada</b>'+esc(m.season||'2025')+'</span>'+
      '</div>'+
      '<p>'+esc(m.detail)+'</p>'+
    '</div>'+
  '</article>';
}
function v228IsEsperanzaChampion(m){
  const n=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  return n(m?.title)==='la esperanza' && n(m?.date).includes('08 nov 2025');
}

function v227GalacticosChampionCard(m){
  /* V229 — fondo directo con doble URL.
     1) GitHub Pages (misma app)
     2) raw.githubusercontent como respaldo
     Ya no depende de un <img> ni de que cargue una clase CSS para mostrar la foto. */
  const local='https://jairofrancog7-star.github.io/App-liga-/assets/history/archive-v203/galacticos-campeon-campeones-09-feb-2025.jpg?v=20260923-galacticos-final-v229';
  const raw='https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/assets/history/archive-v203/galacticos-campeon-campeones-09-feb-2025.jpg?v=20260923-galacticos-final-v229';
  const bg='background-color:#060653;background-image:linear-gradient(180deg,rgba(3,6,50,.03) 0%,rgba(3,6,50,.10) 30%,rgba(3,6,50,.38) 66%,rgba(3,6,50,.84) 100%),url(&quot;'+local+'&quot;),url(&quot;'+raw+'&quot;);background-size:cover,cover,cover;background-position:center,center 48%,center 48%;background-repeat:no-repeat,no-repeat,no-repeat;';
  return '<article class="v227-galacticos-card v229-galacticos-final" data-v227-galacticos-card style="'+bg+'">'+
    '<span class="v227-galacticos-shade" aria-hidden="true"></span>'+
    '<div class="v227-galacticos-body">'+
      '<div class="v227-galacticos-meta"><span class="v35-history-kind">'+esc(m.kind)+'</span><time class="v35-history-date">'+esc(m.date)+'</time></div>'+
      '<h3>'+esc(m.title)+'</h3>'+
      '<strong>'+esc(m.subtitle)+'</strong>'+
      '<div class="v227-galacticos-status">'+
        '<span><b>Ganador</b>'+esc(m.winner||m.title)+'</span>'+
        '<span><b>Temporada</b>'+esc(m.season||'2025')+'</span>'+
      '</div>'+
      '<p>'+esc(m.detail)+'</p>'+
    '</div>'+
  '</article>';
}

function v227IsGalacticosChampion(m){
  const n=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  return n(m?.title).includes('galacticos de pozos') && n(m?.date).includes('09 feb 2025');
}

function historyMomentCard(m){
  if(v229IsManchesterChampion(m)) return v229ManchesterChampionCard(m);
  if(v228IsEsperanzaChampion(m)) return v228EsperanzaChampionCard(m);
  if(v227IsGalacticosChampion(m)) return v227GalacticosChampionCard(m);
  const esperanzaBgClass=(m.title==='La Esperanza'&&m.date==='08 nov 2025')?' v225-esperanza-bg':'';
  const championBg=m.kind==='CAMPEÓN'?championBackground(m.title,m.backgroundPhoto||''):null;
  const hasBg=!!(championBg?.url||m.backgroundPhoto);
  const bgExact=!!championBg?.exact;
  return '<article class="v35-history-moment '+(hasBg?'v35-history-moment-photo ':'')+((hasBg&&!bgExact)?'v35-history-moment-reference':'')+esperanzaBgClass+'">'+
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
  const when=n(x.date||x.season);
  const team=n(x.title||x.champion||x.winner);
  /* V231 — evita duplicar un mismo campeón cuando dos fuentes describen
     la misma foto con marcadores equivalentes de fecha todavía desconocida.
     Ejemplo: Tecos aparecía como "Fecha exacta pendiente" y también como
     "Archivo fotográfico"; en Campeones debe mostrarse una sola tarjeta. */
  const unknownDate=['fecha exacta pendiente','archivo fotografico','temporada por confirmar','archivo historico'].includes(when);
  return (unknownDate?'sin fecha confirmada':when)+'|'+team;
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
    !m.archiveOnly&&(
      m.kind==='CAMPEÓN'||
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
/* V232 — Tecos aparecía dos veces por la convivencia del registro histórico
   y el palmarés verificado. Conservamos la primera tarjeta (la más completa)
   y eliminamos cualquier repetición posterior del mismo campeón. */
function removeDuplicateTecosChampion(root=document){
  const cards=[...(root.querySelectorAll?.('.v35-history-moment,.v35-champion-card,.v115-card,.v115-fact-card')||[])];
  let kept=false;
  cards.forEach(card=>{
    const title=String(card.querySelector('h3,h4')?.textContent||'').trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    const text=String(card.textContent||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    if(title!=='tecos'||!text.includes('campe')) return;
    if(!kept){kept=true;return;}
    card.remove();
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
  requestAnimationFrame(()=>{syncHistoryCollapse();removeObsoleteManchesterDuplicate(root);removeDuplicateTecosChampion(root);});
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