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
  {label:'2021/22',crest:ASSETS.league,alt:'Liga Municipal de Fútbol Juventino Rosas'}
];

/* V75 — fuentes históricas entregadas por el usuario.
   IMPORTANTE: estos videos pertenecen SOLO a Historia.
   Nunca se importan equipos de estas fuentes a la lista de equipos de la temporada actual. */
const historicalSources=[
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
  }
];


// V96 — Archivo histórico real: contenido verificado en capturas, álbumes y videos entregados por el usuario.
// Los videos se usan únicamente como fuente de consulta; NO se incrustan dentro de Historia.
const HIST_ROOT='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const historyMoments=[
  {kind:'CAMPEÓN',title:'Tavera FC',subtitle:'Campeón de Copa · Categoría Segunda',detail:'Registro histórico del álbum de la Liga.',image:HIST_ROOT+'assets/official-logos/tavera-fc.png'},
  {kind:'FINAL',title:'Universidad vs Dinamo',subtitle:'Final de Veteranos',detail:'Final documentada en el archivo fotográfico histórico.',image:HIST_ROOT+'assets/official-logos/dynamo.png'},
  {kind:'FINAL',title:'Chelsea vs La Esperanza',subtitle:'Veteranos · Final de Copa 2019 · 17:30 · Campo 1',detail:'El rol histórico confirma la final y su programación; no se asigna ganador sin resultado publicado.'},
  {kind:'ANIVERSARIO',title:'Boavista',subtitle:'XXV aniversario',detail:'Álbum conmemorativo del equipo Boavista.',image:HIST_ROOT+'assets/official-logos/boavista.png'},
  {kind:'PENALES',title:'Hermanos vs Juventus',subtitle:'Torneo de Copa',detail:'Serie de penales registrada en el archivo histórico.',imageA:HIST_ROOT+'assets/official-logos/hermanos.png',imageB:HIST_ROOT+'assets/official-logos/juventus.png'},
  {kind:'ENCUENTRO',title:'Valencia vs Halcones',subtitle:'Partido histórico',detail:'Encuentro conservado dentro del archivo fotográfico.'},
  {kind:'PENALES',title:'Hermanos vs Chelse',subtitle:'Archivo histórico',detail:'Serie de penales conservada en los álbumes de la Liga.',image:HIST_ROOT+'assets/official-logos/hermanos.png'},
  {kind:'CLÁSICO',title:'Olímpicos de Pozos vs Abejas FC',subtitle:'Campo de Pozos · domingo 21 de junio · 10:00',detail:'Rivalidad histórica: unidos por la comunidad y separados por el fútbol.',image:HIST_ROOT+'assets/official-logos/abejas.png'}
];

const historyYouth=[];

const retroClubs=[
  {name:'Tavera FC',logo:'assets/official-logos/tavera-fc.png',note:'Campeón de Copa · Segunda'},
  {name:'Boavista',logo:'assets/official-logos/boavista.png',note:'XXV aniversario · archivo histórico'},
  {name:'Dynamo',logo:'assets/official-logos/dynamo.png',note:'Final de Veteranos vs Universidad'},
  {name:'Juventus',logo:'assets/official-logos/juventus.png',note:'Torneo de Copa · archivo histórico'},
  {name:'Hermanos',logo:'assets/official-logos/hermanos.png',note:'Series de penales y torneos de Copa'},
  {name:'Abejas FC',logo:'assets/official-logos/abejas.png',note:'Clásico vs Olímpicos de Pozos'}
];

const retroNames=['Universidad','Valencia','Halcones','Chelse','Olímpicos de Pozos'];

const verifiedChampions=[
  {season:'2018–2019',competition:'Torneo de Liga',champion:'Juventus',runner:'Boavista',source:'Publicaciones históricas de Golazo Liga del 3 nov 2019.',championLogo:HIST_ROOT+'assets/official-logos/juventus.png',runnerLogo:HIST_ROOT+'assets/official-logos/boavista.png'},
  {season:'Archivo fotográfico',competition:'Campeonato · categoría adulta por identificar',champion:'Tecos',runner:'—',source:'Fotografía del archivo: el plantel aparece con camisetas “CAMPEON TECOS” y trofeo.'},
  {season:'Archivo histórico',competition:'Copa · Categoría Segunda',champion:'Tavera FC',runner:'—',source:'Álbum histórico entregado por el usuario.',championLogo:HIST_ROOT+'assets/official-logos/tavera-fc.png'}
];

const historicTables=[
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
  {season:'2018',category:'Intermedia · Jornada 23',player:'Alejandro Juárez Merino',team:'Populares',value:'31 goles'},
  {season:'2018',category:'Intermedia · Jornada 23',player:'Juan Carlos Hernández',team:'Barza',value:'18 goles'},
  {season:'2018',category:'Intermedia · Jornada 23',player:'Alejandro Ramírez Medina',team:'Real DHP',value:'16 goles'},
  {season:'2018',category:'Intermedia · Jornada 23',player:'César Agustín Pérez Campos',team:'Oklahoma',value:'16 goles'},
  {season:'2018',category:'Intermedia · Jornada 23',player:'Miguel Presa García',team:'Populares',value:'16 goles'}
];

const recordMemories=[
  {tag:'GOLEO',title:'Alejandro Juárez Merino',value:'31 goles',detail:'Populares · líder de goleo en el corte de Intermedia J23 de 2018.'},
  {tag:'TABLA',title:'A. Centeno',value:'64 puntos',detail:'Líder del corte de Primera Fuerza J26 de 2018.'},
  {tag:'TABLA',title:'Lobos CDG',value:'52 puntos',detail:'Líder del corte de Intermedia J23 de 2018.',image:HIST_ROOT+'assets/official-logos/lobos-cdg.png'},
  {tag:'TABLA FINAL',title:'Juventus',value:'53 puntos',detail:'Primer lugar de la tabla final de Veteranos 2022.',image:HIST_ROOT+'assets/official-logos/juventus.png'},
  {tag:'CAMPEÓN',title:'Juventus',value:'Liga 2018–2019',detail:'Campeón confirmado en publicación histórica del 3 de noviembre de 2019.',image:HIST_ROOT+'assets/official-logos/juventus.png'},
  {tag:'RECUERDO',title:'Boavista',value:'XXV aniversario',detail:'Álbum conmemorativo conservado en el archivo histórico.',image:HIST_ROOT+'assets/official-logos/boavista.png'}
];

const historicResults=[
  {date:'2022',category:'Primera Fuerza · J19',winner:'Juventus',against:'Lobos CDG'},
  {date:'2022',category:'Intermedia · J19',winner:'La Huerta',against:'Galaxy'},
  {date:'2022',category:'Intermedia · J19',winner:'Sección 14',against:'A. Pozos'},
  {date:'2022',category:'Segunda Fuerza · J18',winner:'Galácticos FC',against:'San Juan FC'}
];

const historicFinalists=[
  {year:'08 dic 2013',category:'Categoría libre · Primera · Gran Final',a:'Juventus',b:'Olímpicos',note:'10:00 · Campo 1. Archivo adulto de Golazo Liga; Chelsea vs PSV aparece por el tercer lugar.',logoA:HIST_ROOT+'assets/official-logos/juventus.png'},
  {year:'01 mar 2014',category:'Veteranos · Gran Final',a:'UNAM',b:'La Esperanza',note:'16:00 · Campo 1. Archivo histórico adulto.'},
  {year:'2019',category:'Veteranos · Final de Copa',a:'Chelsea',b:'La Esperanza',note:'Programada a las 17:30 en Campo 1. El material revisado confirma la final y su programación.'},
  {year:'2021',category:'Veteranos · Gran Final de Liga',a:'La Esperanza',b:'Real Cuenda',note:'17:00 · Campo 1. Rol histórico del 25–26 sep 2021.'},
  {year:'2022',category:'Veteranos · Final de Copa',a:'Juventus',b:'PSV',note:'16:00 · Campo 1.',logoA:HIST_ROOT+'assets/official-logos/juventus.png'},
  {year:'2022–2023',category:'Veteranos · Final de Copa',a:'Juventus',b:'Cuenda',note:'16:30 · Campo 1.',logoA:HIST_ROOT+'assets/official-logos/juventus.png'},
  {year:'2023',category:'Veteranos · Gran Final de Liga',a:'Juventus',b:'América',note:'16:30 · Campo 1.',logoA:HIST_ROOT+'assets/official-logos/juventus.png'},
  {year:'2023',category:'Categoría libre · Segunda Fuerza · Gran Final de Liga',a:'Titanes FC',b:'Terrícolas SEDER',note:'Final programada en el rol histórico revisado.',logoB:HIST_ROOT+'assets/official-logos/terricolas.png'}
];

const expandedRetroNames=[
  'Real DHP','Vatos Locos','Tecos','Oklahoma','Mineros','Barza','San Antonio','Osasuna',
  'Mazacotes','Titanes Tavera','Morales','Populares','A. Centeno','Chelsea','La Cuadrilla',
  'PSV','Sección 14','Dep. Maravillas','La Esperanza FC','A. Pozos','Galaxy','San Juan FC',
  'Tapatío','Guadalupanos','Barrio Seco','UNAM','Átomos','Deportivo Rafa','Arsenal',
  'Olímpicos','Linces','Birds Eye','Puros Cuates','Dulces Nombres','Malvinas',
  'Halcones de Cuenda','Deportivo Pozos','Real Cerrito de Gasca','San José de la Montaña',
  'Río Grande','Unión Allende','Novatos','Salvajes','Continental','Toros','Aldama'
];

const historicalTimeline=[
  {date:'15 sep 1953',title:'Antecedente del fútbol local',detail:'Una fuente histórica secundaria sitúa un primer partido de fútbol en Juventino Rosas entre Deportivo Santa Cruz y Deportivo Villagrán. Sirve como contexto del fútbol local, pero no demuestra la fundación ni continuidad jurídica de la Liga actual.'},
  {date:'05 oct 2012',title:'Golazo Liga · primer registro digital localizado',detail:'La captura aportada muestra una publicación que Facebook presenta bajo el nombre Golazo Liga con fecha 5 de octubre de 2012 y con el escudo histórico de la Liga Municipal. Es la fecha digital mínima comprobable dentro del material conservado, no la fecha de fundación.'},
  {date:'c. 2015',title:'Administrador conocido de Golazo Liga',detail:'El usuario identifica un perfil como administrador de Golazo Liga hacia 2015. Es una pista útil para reconstruir publicaciones y dirigentes, pero el cargo de presidente de la Liga no queda probado solo por administrar la página.'},
  {date:'24 may 2016',title:'Acuerdo interno de la Liga',detail:'El reglamento vigente conserva el antecedente de un acuerdo de asamblea del 24 de mayo de 2016 relacionado con el proyecto de construcción de nuevas oficinas.'},
  {date:'2018',title:'Tablas y goleadores históricos',detail:'El archivo conserva cortes de Primera e Intermedia con equipos, puntos y goleadores de la categoría libre.'},
  {date:'03 nov 2019',title:'Juventus campeón de Liga',detail:'Publicaciones históricas de Golazo Liga identifican a Juventus como campeón y a Boavista como subcampeón de la Liga 2018–2019.'},
  {date:'dic 2019',title:'Nombre reconocido en un documento público',detail:'Un reporte del Congreso del Estado de Guanajuato registra “LIGA MUNICIPAL JUVENTINO ROSAS” por $11,600 dentro de apoyos para construcción y reparación. Es una evidencia externa importante de continuidad del nombre institucional.'},
  {date:'2022',title:'Veteranos · tabla final',detail:'El archivo conserva una tabla final de Veteranos con Juventus en primer lugar con 53 puntos.'},
  {date:'2026',title:'Continuidad pública de la denominación',detail:'Medios regionales y nacionales siguieron refiriéndose a la competencia como Liga Municipal de Juventino Rosas, reforzando la continuidad pública del nombre.'},
  {date:'2026–2027',title:'Reglamento vigente',detail:'El reglamento usa la forma Liga Municipal de Fútbol “Juventino Rosas A.C.” y describe una Asamblea y Mesa Directiva propias, además de Copa, Liga, Campeón de Campeones, categoría libre y Veteranos 35+ / 50+.'}
];

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
  'Los equipos antiguos se conservan en Historia y no se mezclan con los equipos activos de la temporada actual.'
];

const institutionalHistoryFacts=[
  {tag:'NOMBRE INSTITUCIONAL',title:'Liga Municipal de Futbol Juventino Rosas A.C.',detail:'Coincide en el logotipo histórico aportado y en el reglamento 2026–2027. Es la denominación institucional mejor documentada.'},
  {tag:'IDENTIDAD DIGITAL',title:'Golazo Liga',detail:'La presencia de Facebook está documentada al menos desde el 5 de octubre de 2012. La interpretación más consistente es que fue una página, alias o proyecto de difusión de la Liga.'},
  {tag:'FUNDACIÓN',title:'Fecha todavía no demostrada',detail:'2012 no debe mostrarse como año de fundación. Tampoco están demostrados el fundador, el primer presidente ni la fecha exacta de constitución de la A.C.'},
  {tag:'AUTONOMÍA',title:'Gobierno interno propio',detail:'El reglamento actual describe Asamblea de equipos y Mesa Directiva electa dentro de la propia Liga. Las autoridades municipales aparecen como interlocutores externos para gestiones, no como dirección interna.'},
  {tag:'EVIDENCIA EXTERNA',title:'Congreso de Guanajuato · 2019',detail:'El reporte público de diciembre de 2019 registra “LIGA MUNICIPAL JUVENTINO ROSAS” y un apoyo de $11,600 para construcción y reparación.'},
  {tag:'CONTINUIDAD PÚBLICA',title:'Medios · 2026',detail:'Notas de 2026 siguen utilizando “Liga Municipal de Juventino Rosas”, en línea con el nombre institucional actual.'},
  {tag:'ANTECEDENTE LOCAL',title:'Fútbol en Juventino Rosas desde 1953',detail:'Una efeméride secundaria registra un partido Deportivo Santa Cruz vs Deportivo Villagrán el 15 de septiembre de 1953. No prueba continuidad legal con la Liga actual.'}
];

const openHistoricalQuestions=[
  'Fecha exacta de fundación o constitución de la Liga Municipal de Fútbol Juventino Rosas A.C.',
  'Fundador o fundadores y primera Mesa Directiva.',
  'Primer presidente de la Liga.',
  'Si existió una página o presencia digital anterior a Golazo Liga antes de 2012.',
  'Si la A.C. tuvo una denominación legal diferente en alguna etapa.',
  'Cadena completa de presidentes y periodos anteriores.'
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

function historyMomentCards(){
  return '<div class="v35-history-moments">'+historyMoments.map((m,i)=>
    '<article class="v35-history-moment">'+
      ((m.image||m.imageA||m.imageB)?'<div class="v35-history-visual">'+
        (m.image?'<img src="'+m.image+'" alt="" loading="lazy" decoding="async">':'')+
        (m.imageA?'<img src="'+m.imageA+'" alt="" loading="lazy" decoding="async">':'')+
        (m.imageB?'<img src="'+m.imageB+'" alt="" loading="lazy" decoding="async">':'')+
      '</div>':'')+
      '<span class="v35-history-kind">'+esc(m.kind)+'</span>'+
      '<h3>'+esc(m.title)+'</h3>'+
      '<strong>'+esc(m.subtitle)+'</strong>'+
      '<p>'+esc(m.detail)+'</p>'+
    '</article>'
  ).join('')+'</div>';
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

function verifiedHistoryBlocks(){
  return '<div class="v35-verified-history">'+
    '<div class="v35-history-subhead"><span>CAMPEONES CONFIRMADOS</span><h3>Palmarés verificado en el archivo</h3></div>'+
    '<div class="v35-champion-list">'+verifiedChampions.map(x=>
      '<article class="v35-champion-card">'+
        ((x.championLogo||x.runnerLogo)?'<div class="v35-champion-logos">'+(x.championLogo?'<img src="'+x.championLogo+'" alt="" loading="lazy">':'')+(x.runnerLogo?'<img src="'+x.runnerLogo+'" alt="" loading="lazy">':'')+'</div>':'')+
        '<span>'+esc(x.season)+'</span><h4>'+esc(x.champion)+'</h4><b>'+esc(x.competition)+'</b><p>'+(x.runner&&x.runner!=='—'?'Subcampeón: '+esc(x.runner)+'. ':'')+esc(x.source)+'</p></article>'
    ).join('')+'</div>'+
    '<div class="v35-history-subhead"><span>GOLEO HISTÓRICO</span><h3>Registros recuperados de tablas</h3></div>'+
    '<div class="v35-scorer-history">'+historicScorers.map(x=>'<article><span>'+esc(x.season)+'</span><div><b>'+esc(x.player)+'</b><small>'+esc(x.team)+' · '+esc(x.category)+'</small></div><strong>'+esc(x.value)+'</strong></article>').join('')+'</div>'+
    '<div class="v35-history-subhead"><span>TABLAS HISTÓRICAS</span><h3>Clasificaciones recuperadas</h3><p>Se conserva el contexto exacto del material: una tabla final se marca como final; un corte de jornada se marca solo como corte.</p></div>'+
    historicTables.map(t=>'<article class="v35-old-table"><header><span>'+esc(t.season)+'</span><div><b>'+esc(t.title)+'</b><small>'+esc(t.note)+'</small></div></header><div class="v35-old-table-head"><span>POS</span><span>EQUIPO</span><span>PTS</span></div>'+t.rows.map(r=>'<div class="v35-old-table-row"><span>'+esc(r[0])+'</span><b>'+esc(r[1])+'</b><strong>'+esc(r[2])+'</strong></div>').join('')+'</article>').join('')+
    '<div class="v35-history-subhead"><span>RESULTADOS CONSERVADOS</span><h3>Ganadores publicados en roles antiguos</h3></div>'+
    '<div class="v35-result-list">'+historicResults.map(r=>'<article><span>'+esc(r.date)+'</span><small>'+esc(r.category)+'</small><b>'+esc(r.winner)+'</b><i>vs</i><strong>'+esc(r.against)+'</strong></article>').join('')+'</div>'+
    '<div class="v35-history-subhead"><span>FINALES DOCUMENTADAS</span><h3>Llaves y finalistas</h3></div>'+
    '<div class="v35-result-list">'+historicFinalists.map(r=>'<article class="v35-final-row">'+
      ((r.logoA||r.logoB)?'<div class="v35-final-logos">'+(r.logoA?'<img src="'+r.logoA+'" alt="">':'')+(r.logoB?'<img src="'+r.logoB+'" alt="">':'')+'</div>':'')+
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
function historyArchiveBlock(){
  return '<section class="v35-block v35-history-archive">'+
    '<div class="v35-history-archive-head"><span>ARCHIVO HISTÓRICO</span><h2>Historias de la Liga</h2><p>Archivo histórico de la Liga adulta: categoría libre y Veteranos. Se excluyen ligas infantiles, Pony, juveniles y torneos de Presidencia Municipal/COMUDE que pertenecen a organizaciones distintas. Los videos se revisan como fuente y no se insertan en esta página.</p></div>'+
    historicalTimelineBlock()+
    institutionalHistoryBlock()+
    competitionFormatBlock()+
    historyMomentCards()+
    '<div class="v35-history-subhead"><span>EQUIPOS PARA EL RECUERDO</span><h3>Clubes y nombres del archivo</h3><p>Estos registros históricos no alteran la lista de equipos de la temporada actual.</p></div>'+
    retroClubCards()+
    verifiedHistoryBlocks()+
  '</section>';
}
function championsArchiveBlock(){
  const rows=historyMoments.filter(m=>m.kind==='CAMPEÓN'||m.kind==='FINAL');
  return '<section class="v35-block v35-history-archive v35-history-archive-compact">'+
    '<div class="v35-history-archive-head"><span>PALMARÉS HISTÓRICO</span><h2>Campeones y finales documentadas</h2><p>Solo se muestran datos que aparecen en el material histórico revisado.</p></div>'+
    '<div class="v35-history-moments">'+rows.map(m=>'<article class="v35-history-moment"><span class="v35-history-kind">'+esc(m.kind)+'</span><h3>'+esc(m.title)+'</h3><strong>'+esc(m.subtitle)+'</strong><p>'+esc(m.detail)+'</p></article>').join('')+'</div>'+verifiedHistoryBlocks()+
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
    '<div class="v35-season-detail"><span>Archivo histórico</span><h3>Temporadas anteriores separadas de la actual</h3><p>Los equipos antiguos pueden aparecer aquí como parte de su temporada histórica, pero nunca se agregan otra vez a la lista de equipos actuales si ya no participan.</p></div></section>'+
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
      '<div><small>'+esc(r.tag)+'</small><h3>'+esc(r.title)+'</h3><strong>'+esc(r.value)+'</strong><p>'+esc(r.detail)+'</p></div></article>').join('')+'</div>'+
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