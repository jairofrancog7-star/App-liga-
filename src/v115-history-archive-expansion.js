/* V115 — expansión aditiva del archivo histórico 2012–2026.
   Se monta al final de Historia / Sobre la Liga sin reemplazar contenido previo. */
(function(){
'use strict';

const RAW='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const HIST='https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/assets/history/';

const ARCH119=HIST+'archive-v119/';
const IMG={
  archive:'',
  juventus2019:HIST+'juventus-campeon-2019.jpg',
  tecos:HIST+'tecos-campeon-historico.jpg',
  huerta2025:ARCH119+'la-huerta-finalista-2025.jpg',
  tavera2025:'',
  lobos2025:ARCH119+'lobos-cdg-campeon-copa-2025.jpg',
  boavista2012:ARCH119+'boavista-xxv-2012.jpg',
  promesas2024:HIST+'archive-v117/promesas-campeon-2024.webp',
  mineros2024:HIST+'archive-v117/mineros-finalista-2024.webp',
  maravillas2024:HIST+'archive-v117/dep-maravillas-semifinal-2024.webp'
};

const champions=[
  {date:'01 feb 2025',team:'Juventus',title:'Campeón de Copa · Veteranos 35 y más',detail:'Juventus obtuvo el Campeonato de Copa del torneo de Veteranos 35 y más ante PSV Eindhoven el 1 de febrero de 2025.',source:'Dato e imagen exacta aportados por el usuario · 01 feb 2025',image:HIST+'archive-v214/juventus-campeon-copa-veteranos35-01-feb-2025.webp?v=20260923-juventus-v214'},
  {date:'07 jun 2026',team:'La Canchita Deportes',title:'Campeón de Liga · Segunda Fuerza',detail:'La Canchita Deportes ganó la final frente a Aldama FC; Aldama quedó subcampeón.',source:'Dato e imagen aportados por el usuario',image:HIST+'archive-v132/canchita-deportes-campeon-segunda-2026.jpg'},
  {date:'24 may 2026',team:'Franco FC',title:'Campeón de Campeones',detail:'Franco FC ganó frente a Lobos CDG.',source:'Dato e imagen aportados por el usuario',image:HIST+'archive-v132/franco-fc-campeon-de-campeones-2026.jpg'},
  {date:'23 may 2026',team:'La Esperanza',title:'Campeón · final del 23 de mayo',detail:'La Esperanza ganó la final; categoría exacta por precisar.',source:'Dato e imagen aportados por el usuario',image:HIST+'archive-v132/la-esperanza-campeon-23-mayo-2026.jpg'},
  {date:'10 may 2026',team:'Franco FC',title:'Campeón de Liga · Fuerza Intermedia',detail:'Franco FC se coronó campeón de Liga de Fuerza Intermedia tras un aguerrido encuentro frente a La Esperanza.',source:'Dato e imagen exacta aportados por el usuario · 10 may 2026',image:HIST+'archive-v132/franco-fc-campeon-intermedia-2026.jpg?v=20260923-franco-blue-v211'},
  {date:'15 mar 2026',team:'Linces',title:'Campeón de Liga · Primera Fuerza',detail:'Linces campeón frente a Galácticos; Galácticos subcampeón.',source:'Dato e imágenes aportados por el usuario',image:HIST+'archive-v132/linces-campeon-primera-2026.jpg'},
  {date:'20 dic 2025',team:'Salvajes',title:'Campeón · Torneo de Copa',detail:'Salvajes ganó la final frente a Juventus.',source:'Dato e imagen aportados por el usuario',image:HIST+'archive-v132/salvajes-campeon-copa-2025.jpg'},
  {date:'08 nov 2025',team:'La Esperanza',title:'Campeón · Veteranos 50 y más',detail:'La Esperanza ganó la final frente a Manchester.',source:'Dato e imagen aportados por el usuario',image:HIST+'archive-v195/la-esperanza-campeon-veteranos50-2025-2026.jpg'},
  {date:'16 feb 2025',team:'Lobos Jrs.',title:'Campeón · Torneo Relámpago · Segunda Fuerza',detail:'Lobos Jrs. ganó el Torneo Relámpago de Segunda Fuerza el 16 de febrero de 2025.',source:'Dato e imagen aportados por el usuario · 16 feb 2025',image:HIST+'archive-v207/lobos-jrs-campeon-relampago-segunda-16-feb-2025.webp'},
  {date:'15 jun 2025',team:'Lobos CDG · Cerrito de Gasca',title:'Campeón de Copa · Fuerza Intermedia',detail:'La Liga Municipal de Fútbol felicita a Lobos CDG, de la comunidad de Cerrito de Gasca, por haber obtenido el título de Campeón de Copa 2025 ante Franco FC, de la comunidad de San José de Manantiales.',source:'Dato e imagen aportados por el usuario · 15 jun 2025',image:HIST+'archive-v207/lobos-cdg-campeon-copa-intermedia-15-jun-2025.webp?v=20260923-lobos-clean-v212'},
{date:'09 feb 2025',team:'Herreras FC',title:'Campeón · Torneo Relámpago · Fuerza Intermedia',detail:'El archivo de la Liga identifica a Herreras FC como campeón del Torneo Relámpago de Fuerza Intermedia ante Oklahoma. No se exige marcador para reconocer el título cuando la publicación identifica expresamente al campeón.',source:'Archivo histórico aportado · 09 feb 2025',image:HIST+'archive-v120/herreras-fc-campeon-relampago-intermedia-2025.jpg'},
  {date:'12 abr 2025',team:'Boavista FC',title:'Campeón de Liga 2025 · Veteranos 50+',detail:'La publicación del 12 de abril de 2025 presenta expresamente a Boavista FC como CAMPEÓN 2025 después de la final ante Boca Jrs.',source:'Juventino Rosas Liga · 12 abr 2025',image:HIST+'archive-v120/boavista-fc-campeon-2025.jpg'},
  {date:'09 feb 2025',team:'Galácticos de Pozos',title:'Campeón de Campeones · Primera Fuerza',detail:'La Liga Municipal de Fútbol “JUVENTINO ROSAS” A.C. felicitó al equipo GALÁCTICOS de Pozos por haber obtenido el cetro de Campeón de Campeones, al imponerse al equipo LINCES.',source:'Fotografía y texto aportados por el usuario · 09 feb 2025',image:HIST+'archive-v203/galacticos-campeon-campeones-09-feb-2025.jpg'},
  {date:'2025 · fecha exacta pendiente',team:'Manchester',title:'Campeón de Campeones · Veteranos · 2025',detail:'Fotografía aportada por el usuario: Manchester aparece identificado como CAMPEÓN DE CAMPEONES. Se conserva el año 2025; la fecha exacta queda pendiente de documentar.',source:'Fotografía aportada por el usuario · 2025',image:RAW+'assets/official-logos/manchester.png'},
  {date:'08 jun 2025',team:'Galácticos (Pozos)',title:'Campeón de Copa 2025 · Primera Fuerza',detail:'La publicación de la Liga identifica a Galácticos de Pozos como Campeón de Copa 2025; Herreras FC fue finalista.',source:'Juventino Rosas Liga · 08 jun 2025',image:HIST+'archive-v205/galacticos-pozos-campeon-copa-08-jun-2025.webp?v=20260923-galacticos-fix211'},
  {date:'20 sep 2025',team:'Juventus',title:'Campeón de Liga · Veteranos 35 y más · 2025',detail:'El archivo audiovisual identifica expresamente a Juventus como campeón de Liga de Veteranos 35 y más. Salvajes aparece como subcampeón.',source:'Archivo histórico aportado · sep 2025',image:HIST+'archive-v132/juventus-campeon-liga-veteranos-35-2025.jpg'},

  {date:'29 jun 2025',team:'La Huerta de Cuenda',title:'Campeón de Liga · Segunda Fuerza 2025',detail:'La Huerta de Cuenda ganó la final de Segunda Fuerza frente a Tavera FC el 29 de junio de 2025.',source:'Dato e imagen aportados por el usuario · 29 jun 2025',image:HIST+'archive-v203/la-huerta-cuenda-campeon-segunda-29-jun-2025.jpg'},
  {date:'19 sep 2026',team:'Deportivo CG · Cerrito de Gasca',title:'Campeón de Liga 2025–2026 · Veteranos 35 y más + Campeón de Campeones',detail:'El archivo aportado muestra al plantel con trofeos y el texto “CAMPEÓN TORNEO DE LIGA 2025-2026 · VETERANOS 35 Y MAS” y “CAMPEÓN DE CAMPEONES”. Otra referencia del mismo archivo anuncia la Gran Final Pozos F.C. vs Cerrito de Gasca para el 19 de septiembre de 2026.',source:'Archivo histórico aportado · premiación / final 19 sep 2026',image:HIST+'archive-v120/deportivo-cg-campeon-liga-2025-2026.jpg'},
  {date:'año exacto pendiente',team:'Oklahoma City',title:'Campeón · Intermedia · archivo audiovisual',detail:'El archivo contiene una referencia de Oklahoma City levantando el trofeo con la palabra “CAMPEÓN”. Otra referencia del mismo conjunto anuncia la final de Intermedia Oklahoma City vs San Julián, domingo 1 de diciembre. Se conserva la categoría y el rival documentados, pero no se fija el año hasta cruzarlo con una publicación fechada.',source:'Archivo histórico aportado · campeón + cartel de final Intermedia',image:HIST+'archive-v120/oklahoma-city-campeon.jpg'},
  {date:'21 sep 2024',team:'Juventus',title:'Campeón de Campeones · 2024',detail:'Juventus fue Campeón de Campeones el 21 de septiembre de 2024.',source:'Dato e imagen aportados por el usuario · 21 sep 2024',image:HIST+'archive-v201/juventus-campeon-campeones-21-sep-2024.jpg'},
  {date:'17 nov 2024',team:'Promesas de Pozos',title:'Campeón de Liga · Segunda Fuerza · 2024',detail:'Promesas de Pozos fue campeón del Torneo de Liga de Segunda Fuerza el 17 de noviembre de 2024.',source:'Dato e imágenes aportados por el usuario · 17 nov 2024',image:IMG.promesas2024},
  {date:'10 sep 2023',team:'América',title:'Campeón de Liga · Veteranos',detail:'Golazo Liga publicó “AMERICA, NUEVO CAMPEON DE LIGA DE LA FUERZA DE VETERANOS”.',source:'Golazo Liga · 10 sep 2023',image:IMG.archive},
  {date:'23 jul 2023',team:'Barza',title:'Campeón de Campeones · Intermedia · 2022–2023',detail:'Publicación de Golazo Liga felicitó a Barza por la obtención del título de Campeón de Campeones de la categoría Intermedia.',source:'Golazo Liga · 23 jul 2023',image:HIST+'archive-v133/barza-campeon-campeones-intermedia-2022-2023.jpg'},
  {date:'02 oct 2022',team:'Juventus',title:'Campeón de Copa 2022 · Primera Fuerza',detail:'Publicación de Golazo Liga: Juventus, campeón de Copa 2022 de Primera Fuerza. El cartel de la final muestra Juventus vs PSV.',source:'Golazo Liga · 02 oct 2022',image:HIST+'archive-v133/juventus-campeon-copa-primera-2022.jpg'},
  {date:'25 sep 2022',team:'Barza',title:'Campeón de Copa 2022 · Intermedia',detail:'Publicación de Golazo Liga: Barza, campeón de Copa de Fuerza Intermedia.',source:'Golazo Liga · 25 sep 2022',image:HIST+'archive-v133/barza-campeon-copa-intermedia-2022.jpg'},
  {date:'18 sep 2022',team:'Terrícolas SEDER',title:'Campeón de Copa 2022 · Segunda Fuerza',detail:'La publicación identifica a Terrícolas SEDER como campeón de Copa 2022 de Segunda Fuerza.',source:'Golazo Liga · 18 sep 2022',image:IMG.archive},
  {date:'17 abr 2022',team:'Juventus',title:'Campeón de Liga 2022 · Primera + Campeón de Campeones',detail:'Juventus fue publicado como campeón de Liga 2022 de Primera Fuerza. La misma publicación indica que, por ser campeón vigente de Copa 2019, también se coronó Campeón de Campeones.',source:'Golazo Liga · 17 abr 2022',image:IMG.juventus2019},
  {date:'10 abr 2022',team:'Tavera FC',title:'Campeón de Liga 2022 · Intermedia',detail:'Tavera FC fue publicado como campeón de Liga 2022 de Intermedia y con ese título logró el ascenso a Primera Fuerza.',source:'Golazo Liga · 10 abr 2022',image:IMG.tavera2025},
  {date:'2022',team:'Galácticos FC',title:'Campeón de Liga · Segunda Fuerza',detail:'El archivo recuperado identifica a Galácticos FC como campeón de Liga de Segunda Fuerza y señala el ascenso a Fuerza Intermedia.',source:'Golazo Liga · archivo recuperado',image:IMG.archive},
  {date:'21 ene 2024',team:'Boavista',title:'Subcampeón · Veteranos 50 y más',detail:'Juventino Rosas Liga felicitó a Boavista como subcampeón de Veteranos 50 y más y publicó parte de su plantel.',source:'Juventino Rosas Liga · 21 ene 2024',image:IMG.boavista2012},
  {date:'11 abr 2024',team:'Linces',title:'Monarca vigente del Torneo de Copa · Primera',detail:'La publicación del 11 de abril de 2024 presenta a Linces como actual monarca del Torneo de Copa de Primera y cuarto lugar de la tabla general del Torneo de Liga en ese corte.',source:'Juventino Rosas Liga · 11 abr 2024',image:IMG.archive}
];

const podiums=[
  {date:'15 dic 2013',title:'Segunda Fuerza · podio documentado',detail:'Campeón: Real Cerrito de Gasca. Subcampeón: DHP. Tercer lugar: San José de la Montaña, que ganó por default a Tavera.',source:'Golazo Liga · archivo 2013',image:IMG.archive},
  {date:'11 ene 2015',title:'Primera Fuerza · podio recuperado',detail:'Boavista aparece como campeón de Primera Fuerza; Juventus como subcampeón; Hermanos como tercer lugar. El 18 de enero Boavista también aparece como Campeón de Campeones y Abejas como líder general.',source:'Golazo Liga · ene 2015',image:IMG.boavista2012},
  {date:'03 nov 2019',title:'Temporada 2018–2019 · Primera Fuerza',detail:'Juventus fue publicado campeón de Liga, Boavista subcampeón y Abejas tercer lugar.',source:'Golazo Liga · 03 nov 2019',image:IMG.juventus2019}
];

const finals=[
  {date:'jun 2025',title:'La Huerta de Cuenda vs Tavera FC · Gran Final Segunda Fuerza',detail:'El archivo aportado muestra la final de Segunda Fuerza 2025 entre La Huerta y Tavera FC. Una versión anuncia 22 de junio y otra 29 de junio, señal de reprogramación o versiones distintas del cartel. La Huerta de Cuenda queda registrada como campeón; no se inventa marcador porque no aparece legible en los clips revisados.',source:'Archivo histórico aportado · final Segunda Fuerza 2025',image:IMG.huerta2025},
  {date:'19 sep 2026',title:'Pozos F.C. vs Deportivo CG · Gran Final Veteranos 35+',detail:'El ZIP anuncia la Gran Final del Torneo de Liga 2025–2026, Veteranos 35 y más, para el 19 de septiembre de 2026 a las 16:00 en Campo 1. El clip de premiación del mismo ZIP identifica posteriormente a Deportivo CG de Cerrito de Gasca como campeón de Liga y Campeón de Campeones. No se muestra un marcador final legible.',source:'Archivo histórico aportado · cartel de final + premiación',image:IMG.archive},
  {date:'01 dic · año pendiente',title:'Oklahoma City vs San Julián · Final Intermedia',detail:'El archivo aportado anuncia la final de Intermedia entre Oklahoma City y San Julián, Campo 1, 10:00. Otra referencia muestra a Oklahoma City levantando el trofeo como campeón. El año exacto queda pendiente de confirmar.',source:'Archivo histórico aportado · final Intermedia / campeón',image:IMG.archive},
  {date:'26 nov 2012',title:'Hermanos vs Juventus · Torneo de Copa',detail:'El archivo conserva la referencia a una trepidante serie de penales entre Hermanos y Juventus. Juventus aparece publicado como campeón de Primera Fuerza ese mismo 26 de noviembre.',source:'Golazo Liga · 26 nov 2012',image:IMG.juventus2019},
  {date:'17 nov 2013',title:'Barza vs Deportivo El Alto · Final Intermedia',detail:'La Liga invitó a la Gran Final de Intermedia a las 12:00 en Campo 1 de la Deportiva Sur. En el material recuperado no se identifica aquí al ganador, por lo que no se inventa.',source:'Liga Municipal / Golazo Liga · nov 2013',image:IMG.archive},
  {date:'15 dic 2013',title:'Real Cerrito de Gasca vs DHP · Final Segunda',detail:'Real Cerrito de Gasca aparece como campeón y DHP como subcampeón. Otra publicación del partido indica que al minuto 35 Real Cerrito ganaba 3–0; ese dato se conserva como marcador parcial, no como marcador final.',source:'Golazo Liga · 15 dic 2013',image:HIST+'archive-v120/real-cerrito-campeon-2013.jpg'},
  {date:'14 jun 2014',title:'La Esperanza 3–2 Universidad · Copa Veteranos',detail:'La publicación registra marcador final 3–2 a favor de La Esperanza y lo identifica como campeón de Copa de Veteranos 2014.',source:'Golazo Liga · 14 jun 2014',image:HIST+'archive-v120/la-esperanza-campeon-copa-veteranos-2014.jpg'},
  {date:'11 ene 2015',title:'Puros Cuates vs La Cuadrilla · Final Intermedia',detail:'La publicación anuncia la final de Intermedia. En publicaciones del mismo día Puros Cuates aparece campeón; Venados de la Cuadrilla aparece como subcampeón.',source:'Golazo Liga · 11 ene 2015',image:IMG.archive},
  {date:'2013 · fecha del archivo',title:'Magisterio vs Boavista · definición por penales',detail:'Tiempo reglamentario 0–0; la publicación registra tanda de penales Magisterio 4–2 Boavista.',source:'Golazo Liga · archivo histórico',image:IMG.boavista2012}
];

const scorers=[
  {season:'2014–2015',name:'José Guadalupe Moreno',category:'Primera Fuerza',value:'Campeón goleador',detail:'Recibió el trofeo de campeón goleador de Primera Fuerza el 11 de enero de 2015.'},
  {season:'2014–2015',name:'José Noé Martínez',category:'Intermedia',value:'Campeón goleador',detail:'Publicado como campeón de goleo de Intermedia el 11 de enero de 2015.'},
  {season:'2016–2017',name:'Daniel Gómez Delgado',category:'Intermedia · A. Centeno',value:'34 goles',detail:'Registro histórico recuperado en el archivo de la Liga: campeón de goleo de Intermedia.'},
  {season:'2016–2017',name:'Eusebio Rangel',category:'Veteranos · Hermanos',value:'Campeón goleador',detail:'Publicación histórica recuperada del 15 de abril de 2017.'}
];

const leaders=[
  {season:'2014–2015',team:'Abejas',detail:'Líder general de Primera, publicación del 18 ene 2015.'},
  {season:'2018–2019',team:'La Pandilla de Morales',detail:'Primer lugar de la tabla general y ascenso a Primera Fuerza, publicación del 9 jul 2019.'},
  {season:'2018–2019',team:'Linces Jr.',detail:'Líder general y ascenso a Fuerza Intermedia, publicación del 9 jul 2019.'},
  {season:'2023–2024',team:'Unión',detail:'La publicación del 14 ene 2024 lo describe entre los primeros lugares del Torneo de Copa de Segunda Fuerza. No se convierte esa frase en posición exacta.'}
];

const oldTeams=[
  {date:'29 nov 2023',team:'Deportivo Morales',meta:'Segunda Fuerza · Torneo de Copa',detail:'Equipo participante del Torneo de Copa de Segunda Fuerza.',image:IMG.archive},
  {date:'29 nov 2023',team:'San José de Allende',meta:'Segunda Fuerza · San Miguel de Allende, Gto.',detail:'La publicación señala que viene del municipio de San Miguel de Allende a participar en el Torneo de Copa de Segunda.',image:IMG.archive},
  {date:'29 nov 2023',team:'América',meta:'Veteranos 35 y más',detail:'Participante del Torneo de Copa de Veteranos 35 y más.',image:IMG.archive},
  {date:'30 nov 2023',team:'Atlético Santa Cruz',meta:'Segunda Fuerza',detail:'En competencia dentro del Torneo de Copa de Segunda.',image:IMG.archive},
  {date:'30 nov 2023',team:'San José Jrs.',meta:'Segunda Fuerza · San José de la Montaña, Salamanca',detail:'Equipo de la comunidad de San José de la Montaña, Salamanca, participante del Torneo de Copa.',image:IMG.archive},
  {date:'30 nov 2023',team:'Tavera',meta:'Segunda Fuerza · Copa 2023–2024',detail:'Equipo documentado en competencia durante el Torneo de Copa 2023–2024.',image:IMG.tavera2025},
  {date:'30 nov 2023',team:'Mineros FC',meta:'Intermedia · El Naranjillo',detail:'Originarios de El Naranjillo, comunidad donde la publicación menciona la reserva del Cerro de los Monos.',image:IMG.mineros2024},
  {date:'30 nov 2023',team:'Promesas de Pozos',meta:'Segunda Fuerza · Pozos',detail:'La publicación hace una distinción especial al Prof. Patricio Rico Rivera por su labor en la formación de nuevos semilleros.',image:IMG.promesas2024},
  {date:'30 nov 2023',team:'San Julián',meta:'Segunda Fuerza',detail:'Equipo de la comunidad de San Julián, comandado por Don Raúl “Teniente”, participante del Torneo de Copa.',image:IMG.archive},
  {date:'30 nov 2023',team:'Galácticos de Pozos',meta:'Primera Fuerza',detail:'La publicación lo presenta como “actual monarca” y nuevamente participante del Torneo de Copa de Primera.',image:IMG.archive},
  {date:'03 dic 2023',team:'La Esperanza',meta:'Multicampeón',detail:'La publicación atribuye décadas de trabajo y formación a Don Antonio López Zarazúa “Toto”, ya fallecido.',image:IMG.archive},
  {date:'04 dic 2023',team:'Huracán',meta:'Veteranos',detail:'La publicación recuerda que durante mucho tiempo fue dirigido por el exjugador Juan Morales “Chacharín”.',image:IMG.archive},
  {date:'05 dic 2023',team:'UNAM',meta:'Veteranos',detail:'La publicación señala casi 15 años de participación constante en la Liga y presencia en el Torneo de Copa de Veteranos.',image:IMG.archive},
  {date:'06 dic 2023',team:'Boavista',meta:'Veteranos · fundado en octubre de 1987',detail:'Formado por jóvenes estudiantes de la Prepa Juventino Rosas; se mencionan Antonio “Mijis” Herrera, Germán Guzmán, Luis Mancera, Jorge Durán, René Durán, Juan Carlos Durán, Manuel Díaz y Víctor Xoconoxtle, entre otros.',image:IMG.boavista2012},
  {date:'10 dic 2023',team:'Osasuna',meta:'23 años de fundación en esa publicación',detail:'Se destaca a José Aguilar “El Botas”, de 62 años, con 44 años jugando fútbol. El dato se conserva como referencia fechada de 2023.',image:IMG.archive},
  {date:'10 dic 2023',team:'Terrícolas',meta:'Segunda Fuerza · fundado en 1987',detail:'La publicación lo presenta como actual monarca de Segunda, bajo Antonio López Moreno “Tonas”, y como equipo varias veces campeón en Intermedia, Segunda y Veteranos.',image:IMG.archive},
  {date:'10 dic 2023',team:'San Antonio Jrs.',meta:'Intermedia · San Antonio de Romerillo',detail:'Bajo el mando de Leandro González; participante del Torneo de Copa de Fuerza Intermedia.',image:IMG.archive},
  {date:'24 dic 2023',team:'Club Linces',meta:'Primera Fuerza · origen en 1990',detail:'La publicación lo describe como multicampeón, bajo Rodrigo Pizano “Pilo”. Señala inicio en fuerzas infantiles en 1990 por Abel Jiménez y Abel Jiménez Jr., y menciona a Javi González, David Romero y Jacob Sixtos “Negro” entre sus pilares.',image:IMG.archive},
  {date:'24 dic 2023',team:'Hermanos',meta:'Fundado en 1982 · multicampeón',detail:'El nombre fue propuesto por Alfredo Aboytes “Mono” por la presencia de hermanos de las familias Aboytes y Rodríguez. La publicación recuerda, entre otros, al Dr. Cabrera, Martín Jaramillo Celedón “Quina”, Antonio Ibarra “Moye” y Florentino Granjeno.',image:IMG.archive},
  {date:'24 dic 2023',team:'Lobos Jrs.',meta:'Segunda Fuerza · Cerrito de Gasca',detail:'Equipo de nueva creación en esa etapa, bajo la batuta de “Carlin”.',image:IMG.lobos2025},
  {date:'01 ene 2024',team:'Dep. Maravillas',meta:'Primera Fuerza · San Antonio de las Maravillas',detail:'La publicación lo presenta como equipo benjamín de Primera y campeón de Liga de Intermedia, dirigido por Humberto Prieto Cacho.',image:IMG.maravillas2024},
  {date:'01 ene 2024',team:'Herreras FC',meta:'Segunda Fuerza · Santiago de Cuenda',detail:'Representante de la comunidad de Santiago de Cuenda.',image:IMG.archive},
  {date:'14 ene 2024',team:'Unión',meta:'Segunda Fuerza · Jaralillo · fundado en 2008',detail:'Dirigido entonces por Óscar Franco; la publicación lo describía en los primeros lugares del Torneo de Copa.',image:IMG.archive},
  {date:'29 ene 2024',team:'Barza',meta:'Fundado en 2007 · antes Deportivo Geonany',detail:'La publicación destaca a Juan Morales “Chacharín” con 47 años en activo y señala que el equipo competía por primera vez en el máximo circuito de la Liga.',image:IMG.archive}
];

const records=[
  {tag:'1982',title:'Hermanos',value:'Fundación documentada',detail:'Publicación del 24 dic 2023: club de gran tradición y multicampeón, fundado en 1982.',image:IMG.archive},
  {tag:'1987',title:'Boavista',value:'Octubre de 1987',detail:'La historia publicada por el club/Liga recuerda su origen entre estudiantes de la Preparatoria Juventino Rosas.',image:IMG.boavista2012},
  {tag:'1995–1997',title:'Boavista',value:'Tricampeonato de Liga',detail:'La publicación conmemorativa de 2012 relata títulos de Liga en 1995, 1996 y 1997. En ese texto se le describía como el primer y hasta entonces único tricampeón de Primera Fuerza; se conserva esa afirmación como histórica, no como récord actual comprobado.',image:IMG.boavista2012},
  {tag:'2008',title:'Boavista Veteranos',value:'Todos los trofeos en disputa',detail:'La reseña de 2012 recuerda que en 2008 obtuvo Liga, Copa, Campeón de Campeones, primer lugar general y campeón goleador individual.',image:IMG.boavista2012},
  {tag:'1987',title:'Terrícolas',value:'36 años en 2023',detail:'Publicación del 10 dic 2023: fundado en 1987 y varias veces campeón en Intermedia, Segunda y Veteranos.',image:IMG.archive},
  {tag:'1990',title:'Linces',value:'Trayectoria desde fuerzas infantiles',detail:'La publicación del 24 dic 2023 ubica su inicio en 1990 y lo describe como multicampeón.',image:IMG.archive},
  {tag:'2007',title:'Barza',value:'Antes Deportivo Geonany',detail:'Publicación del 29 ene 2024: fundado en 2007 y en esa etapa debutaba en el máximo circuito.',image:IMG.archive},
  {tag:'2008',title:'Unión',value:'Fundación',detail:'Publicación del 14 ene 2024: representante del Jaralillo, fundado en 2008.',image:IMG.archive},
  {tag:'TRAYECTORIA',title:'José Aguilar “El Botas”',value:'62 años · 44 jugando',detail:'Dato publicado el 10 dic 2023 dentro de la reseña de Osasuna. Se presenta como registro fechado, no como récord absoluto vigente.',image:IMG.archive},
  {tag:'TRAYECTORIA',title:'Juan Morales “Chacharín”',value:'47 años en activo · ene 2024',detail:'La reseña de Barza del 29 ene 2024 lo presenta como uno de los jugadores históricamente más longevos. El archivo de 2025 también conserva un reconocimiento por más de 50 años en activo.',image:IMG.archive}
];

function esc(v){return String(v??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
function route(){return (location.hash||'#/home').replace(/^#\/?/,'').split('?')[0]||'home';}
function visual(src,alt,kind){
  if(!src)return '<div class="v115-visual v115-visual-fallback"><span>ARCHIVO</span></div>';
  return '<div class="v115-visual '+(kind||'')+'"><img src="'+esc(src)+'" alt="'+esc(alt||'Archivo histórico')+'" loading="lazy" decoding="async" onerror="this.closest(\'.v115-visual\').classList.add(\'v115-visual-fallback\');this.remove()"><span class="v115-media-label">'+(kind==='exact'?'FOTO HISTÓRICA':'REFERENCIA DE ARCHIVO')+'</span></div>';
}
function factCard(x,kind){
  return '<article class="v115-card">'+visual(x.image,x.team||x.title,kind)+'<div class="v115-card-body"><span class="v115-date">'+esc(x.date||x.tag||'ARCHIVO')+'</span><h3>'+esc(x.team||x.title)+'</h3>'+(x.title&&x.team?'<strong>'+esc(x.title)+'</strong>':'')+(x.value?'<strong>'+esc(x.value)+'</strong>':'')+'<p>'+esc(x.detail)+'</p>'+(x.source?'<small>'+esc(x.source)+'</small>':'')+'</div></article>';
}
function simpleRow(x){return '<article class="v115-row"><span>'+esc(x.season||x.date||'')+'</span><div><b>'+esc(x.name||x.team||x.title)+'</b><small>'+esc(x.category||x.detail||'')+'</small></div>'+(x.value?'<strong>'+esc(x.value)+'</strong>':'')+'</article>';}
function teamCard(x){return '<article class="v115-team-card">'+visual(x.image,x.team,'photo')+'<div><span>'+esc(x.date)+'</span><h3>'+esc(x.team)+'</h3><strong>'+esc(x.meta)+'</strong><p>'+esc(x.detail)+'</p></div></article>';}
function head(kicker,title,desc){return '<header class="v115-head"><span>'+esc(kicker)+'</span><h2>'+esc(title)+'</h2><p>'+esc(desc)+'</p></header>';}

function summaryHtml(){
  return head('AMPLIACIÓN 2012–2026','Más historia recuperada','Nueva información añadida al final sin reemplazar el archivo que ya existía. Los clubes antiguos se conservan solo como historia y no se vuelven a registrar como equipos de la temporada actual.')+
    '<div class="v115-kpis"><article><b>1982</b><span>Hermanos · fundación publicada</span></article><article><b>1987</b><span>Boavista y Terrícolas</span></article><article><b>1990</b><span>Inicio documentado de Linces</span></article><article><b>2007/08</b><span>Barza / Unión</span></article></div>'+
    '<div class="v115-subhead"><span>CAMPEONES RECUPERADOS DEL ZIP</span><h3>Finales y premiaciones 2025–2026</h3><p>Se revisó el archivo histórico aportado para identificar finales, campeones y premiaciones. Aquí se agregan solo ganadores que el material permite identificar, sin inventar marcadores ni fechas cuando los carteles difieren.</p></div><div class="v115-grid">'+champions.slice(0,3).map(x=>factCard(x)).join('')+'</div>'+
    '<div class="v115-subhead"><span>CAMPEONES AÑADIDOS</span><h3>2022–2024</h3></div><div class="v115-grid">'+champions.slice(3,7).map(x=>factCard(x)).join('')+'</div>'+
    '<div class="v115-subhead"><span>EQUIPOS PARA EL RECUERDO</span><h3>Copa 2023–2024 y trayectorias</h3></div><div class="v115-team-grid">'+oldTeams.slice(0,10).map(teamCard).join('')+'</div>';
}
function seasonsHtml(){
  const season2022=champions.filter(x=>/2022/.test(x.date)||/2022/.test(x.title));
  return head('TEMPORADAS RECUPERADAS','Resumen por temporada y categoría','Se agregan campeones, líderes, ascensos y clubes localizados en las fuentes. Cuando no hay una tabla final completa, el dato se etiqueta como publicación o corte y no se completa por inferencia.')+
    '<div class="v115-subhead"><span>2025–2026 · ARCHIVO RECUPERADO</span><h3>Campeones y finales recuperados</h3><p>Incluye La Huerta de Cuenda en Segunda Fuerza 2025, Deportivo CG de Cerrito de Gasca en Veteranos 35+ 2025–2026 y el registro del archivo de Oklahoma City campeón de Intermedia con año exacto pendiente.</p></div><div class="v115-grid">'+champions.slice(0,3).map(x=>factCard(x)).join('')+'</div>'+
    '<div class="v115-subhead"><span>2022</span><h3>Liga, Copa y ascensos documentados</h3></div><div class="v115-grid">'+season2022.map(x=>factCard(x)).join('')+'</div>'+
    '<div class="v115-subhead"><span>2022–2023 / 2023</span><h3>Campeón de Campeones y Veteranos</h3></div><div class="v115-grid">'+champions.filter(x=>/2023/.test(x.date)||/2022–2023/.test(x.title)).map(x=>factCard(x)).join('')+'</div>'+
    '<div class="v115-subhead"><span>CLASIFICADOS, LÍDERES Y ASCENSOS</span><h3>Solo lo que la publicación identifica</h3></div><div class="v115-list">'+leaders.map(simpleRow).join('')+'</div>'+
    '<div class="v115-subhead"><span>COPA 2023–2024</span><h3>Equipos documentados por la Liga</h3><p>Este directorio histórico no modifica los equipos actualmente inscritos.</p></div><div class="v115-team-grid">'+oldTeams.map(teamCard).join('')+'</div>';
}
function championsHtml(){
  return head('PALMARÉS · AMPLIACIÓN','Campeones, subcampeones y terceros lugares','Bloque nuevo al final de Campeones. Se mantienen las fechas y categorías tal como aparecen en publicaciones y material de archivo; una mención sin marcador no se rellena.')+
    '<div class="v115-grid">'+champions.map(x=>factCard(x)).join('')+'</div>'+
    '<div class="v115-subhead"><span>PODIOS</span><h3>Campeón · subcampeón · tercer lugar</h3></div><div class="v115-grid">'+podiums.map(x=>factCard(x,x.date==='03 nov 2019'?'exact':'')).join('')+'</div>';
}
function finalsHtml(){
  return head('FINALES · ARCHIVO RECUPERADO','Partidos, penales y finales antiguas','Los marcadores solo se muestran cuando la fuente los dice. El 3–0 de Real Cerrito vs DHP está expresamente etiquetado como marcador al minuto 35 y no como resultado final.')+
    '<div class="v115-grid">'+finals.map(x=>factCard(x)).join('')+'</div>';
}
function recordsHtml(){
  return head('RÉCORDS Y RECUERDOS · AMPLIACIÓN','Trayectorias y marcas fechadas','Se agregan récords o recuerdos solo como afirmaciones históricas fechadas. No se convierten automáticamente en récord vigente de toda la Liga.')+
    '<div class="v115-grid">'+records.map(x=>factCard(x)).join('')+'</div>'+
    '<div class="v115-subhead"><span>CAMPEONES DE GOLEO</span><h3>Goleadores históricos confirmados</h3></div><div class="v115-list">'+scorers.map(simpleRow).join('')+'</div>';
}
function htmlForTab(tab){
  if(tab==='Temporadas')return seasonsHtml();
  if(tab==='Campeones')return championsHtml();
  if(tab==='Finales')return finalsHtml();
  if(tab==='Récords')return recordsHtml();
  return summaryHtml();
}
function activeTab(page){return page.querySelector('.v35-tab.active')?.textContent?.trim()||'Resumen';}
function injectHistory(){
  if(route()!=='history')return;
  const page=document.querySelector('.v35-history-page');
  const content=page?.querySelector('[data-v35-content]');
  if(!page||!content||content.querySelector('[data-v115-history-expansion]'))return;
  /* V207: Campeones ya se arma completo y deduplicado desde v35-history-reference.
     No anexar otra segunda lista del archivo aquí porque repetía los mismos títulos. */
  if(activeTab(page)==='Campeones')return;
  const box=document.createElement('section');
  box.className='v115-history-expansion';
  box.dataset.v115HistoryExpansion='1';
  box.innerHTML=htmlForTab(activeTab(page));
  content.appendChild(box);
}
function aboutHtml(){
  return head('ARCHIVO HISTÓRICO · 2012–2026','Clubes, campeones y memoria de la Liga','Nueva ampliación añadida en la parte inferior de Sobre la Liga. Son perfiles históricos fechados: no alteran la plantilla ni el directorio de equipos actuales.')+
    '<div class="v115-team-grid">'+oldTeams.map(teamCard).join('')+'</div>'+
    '<div class="v115-subhead"><span>PALMARÉS NUEVO</span><h3>Hechos incorporados del archivo recuperado</h3></div><div class="v115-grid">'+champions.slice(0,10).map(x=>factCard(x)).join('')+'</div>'+
    '<div class="v115-subhead"><span>GOLEO Y LIDERAZGO</span><h3>Registros históricos confirmados</h3></div><div class="v115-list">'+scorers.map(simpleRow).join('')+leaders.map(simpleRow).join('')+'</div>';
}
function injectAbout(){
  if(route()!=='safe-about')return;
  const article=document.querySelector('[data-v33-about]');
  if(!article||article.querySelector('[data-v115-about-expansion]'))return;
  const box=document.createElement('section');
  box.className='v115-about-expansion';
  box.dataset.v115AboutExpansion='1';
  box.innerHTML=aboutHtml();
  article.appendChild(box);
}
let raf=0;
function schedule(){cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{injectHistory();injectAbout();});}
window.addEventListener('hashchange',schedule);
document.addEventListener('click',e=>{if(e.target.closest('[data-v35-tab]'))setTimeout(schedule,0);},true);
const screen=document.querySelector('#screen');
if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true}); else schedule();
})();
