/* V33 — exact functional article-style replacement for #/safe-about. */
(function(){
'use strict';

// Logo oficial compartido con camisetas 3D y minutas; cache independiente.
const LEAGUE_LOGO='./assets/branding/escudo-liga-camisetas-unificado-v1122.png?v=v1122-mismo-escudo-camisetas';
const STADIUM='./deportiva-sur-partido.jpg';

function route(){return location.hash.replace('#/','')||'home'}
function backIcon(){
  return '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M20.5 7.5 12 16l8.5 8.5M12.5 16H27"/></svg>';
}
function shareIcon(){
  return '<svg viewBox="0 0 28 28" aria-hidden="true"><circle cx="21.5" cy="5.5" r="2.4"/><circle cx="6.5" cy="14" r="2.4"/><circle cx="21.5" cy="22.5" r="2.4"/><path d="m8.8 12.8 10.3-5.9M8.8 15.2l10.3 5.9"/></svg>';
}
function markup(){
  return '<article class="v33-about" data-v33-about>'+
    '<div class="v33-about-tools">'+
      '<button type="button" class="v33-about-icon" data-v33-about-back aria-label="Volver">'+backIcon()+'</button>'+
      '<button type="button" class="v33-about-icon v33-about-share" data-v33-about-share aria-label="Compartir">'+shareIcon()+'</button>'+
    '</div>'+
    '<section class="v33-about-copy">'+
      '<img class="v33-about-logo" src="'+LEAGUE_LOGO+'" alt="Liga Municipal de Fútbol Juventino Rosas A.C." loading="eager" decoding="async">'+
      '<h1>Liga Municipal de Fútbol Juventino Rosas 2026/27: equipos, fechas, sorteos, formato, final</h1>'+
      '<p class="v33-about-date">Actualizado · 20 sept 2026</p>'+
      '<p class="v33-about-lead">Qué es la Liga, cómo se gobierna, cómo se juegan Copa y Liga, qué categorías participan y qué puede afirmarse hoy sobre su origen, su etapa Golazo Liga y su continuidad histórica.</p>'+
    '</section>'+
    '<figure class="v33-about-figure">'+
      '<img class="v33-about-stadium" src="'+STADIUM+'" alt="Estadio Municipal de Juventino Rosas durante un partido de fútbol" loading="eager" decoding="async">'+
      '<figcaption class="v33-about-caption"><p>Estadio Municipal de Juventino Rosas durante un partido de fútbol.</p><small>Fotografía de archivo · <a href="https://terceramx.wordpress.com/2016/11/12/cdu-uruapan-retoma-el-camino/" target="_blank" rel="noopener">Tercera MX · noviembre de 2016</a></small>'+
        '<p>La Liga organiza fútbol amateur de Juventino Rosas de manera independiente; sus partidos se reparten entre la Deportiva Sur y otros campos de la cabecera y comunidades.</p>'+
        '<small>Liga Municipal de Fútbol Juventino Rosas A.C.</small>'+
      '</figcaption>'+
    '</figure>'+
    '<section class="v33-about-now">'+
      '<div class="v33-about-history-head"><span>QUÉ ES LA LIGA</span><h2>Organización adulta con gobierno interno propio</h2><p>La denominación institucional mejor documentada es Liga Municipal de Futbol Juventino Rosas A.C. Aparece en el logotipo histórico y vuelve a utilizarse en el reglamento 2026–2027.</p></div>'+
      '<div class="v33-about-board">'+
        '<article><small>PRESIDENTE DE LA LIGA</small><b>Florencio Franco Lerma</b></article>'+
        '<article><small>VICEPRESIDENTE</small><b>Martín Jaramillo Celedón</b></article>'+
        '<article><small>SECRETARIO</small><b>Javier Gonzalez Lopez</b></article>'+
        '<article><small>TESORERO</small><b>Octavio Alberto García</b></article>'+
      '</div>'+
      '<p class="v33-about-note">El reglamento describe una Asamblea integrada por representantes de los equipos y una Mesa Directiva elegida dentro de la propia organización. Eso respalda una autonomía deportiva y administrativa frente a Presidencia Municipal y COMUDE. Para establecer jurídicamente la fecha de constitución de la A.C., sus fundadores o su primera Mesa Directiva todavía hace falta localizar el acta constitutiva o registro correspondiente.</p>'+
    '</section>'+
    '<section class="v33-about-format">'+
      '<div class="v33-about-history-head"><span>CÓMO FUNCIONA</span><h2>Categoría libre y Veteranos</h2><p>La investigación delimita esta Liga a fútbol adulto/libre y Veteranos. No se mezclan ligas Mini Pony, infantiles o juveniles con nombres parecidos.</p></div>'+
      '<div class="v33-about-format-grid">'+
        '<article><small>DOMINGO · CATEGORÍA LIBRE</small><h3>Primera · Intermedia · Segunda</h3><p>La categoría libre se organiza por fuerzas. En Liga se juega a dos vueltas y los ocho primeros clasifican a liguilla: 1–8, 2–7, 3–6 y 4–5.</p></article>'+
        '<article><small>SÁBADO · VETERANOS</small><h3>35+ y 50+</h3><p>Veteranos se programa los sábados, normalmente por la tarde. En 35+ hay un grupo a dos vueltas y ocho clasificados; en 50+ la asamblea acuerda los enfrentamientos y los dos mejores pasan a la final.</p></article>'+
        '<article><small>COPA</small><h3>Una vuelta · Top 4</h3><p>En categoría libre se juega una vuelta y un grupo por fuerza. Clasifican cuatro a semifinales: 1–4 y 2–3; semifinal y final son a un partido.</p></article>'+
        '<article><small>DESEMPATE</small><h3>Tabla y finales</h3><p>Se consideran diferencia de goles, goles anotados, menos goles recibidos, enfrentamiento directo y disciplina. Una final empatada pasa a tiempos extra y después a penales.</p></article>'+
        '<article><small>CAMPEÓN DE CAMPEONES</small><h3>Copa vs Liga</h3><p>Se disputa a un partido entre el campeón de Copa y el campeón de Liga. Si el mismo equipo ganó ambos torneos, el nombramiento es automático.</p></article>'+
        '<article><small>GOBIERNO INTERNO</small><h3>Asamblea y Mesa Directiva</h3><p>Los equipos participan mediante delegados o suplentes; el presidente representa oficialmente a la Liga y preside sus asambleas. Las autoridades municipales pueden ser interlocutores externos para gestiones.</p></article>'+
        '<article><small>VIÁTICOS ARBITRALES · $90</small><h3>Comunidades de mayor viático</h3><p>Rincón de Centeno, Pozos, Morales, San José de la Montaña, Cerrito de Gasca, San Julián y Naranjillo: $90.00.</p></article>'+
        '<article><small>VIÁTICOS ARBITRALES · $70</small><h3>Comunidades de menor viático</h3><p>San Antonio de Romerillo, Santiago de Cuenda, Tavera y Emiliano Zapata: $70.00.</p></article>'+
        '<article><small>REPARTO DEL COSTO</small><h3>Local o gasto compartido</h3><p>Si el mismo árbitro dirige dos partidos en la misma comunidad, el viático se divide entre los cuatro equipos. El local cubre el costo completo; si ninguno es local en esa cancha foránea, los equipos que juegan ahí pagan en partes iguales.</p></article>'+
      '</div>'+
      '<p class="v33-about-note">Importante: este listado de viáticos documenta comunidades y sedes de juego. Un nombre de localidad no se agrega automáticamente como equipo histórico. En Historia ya están documentados como equipos, por otras tablas o publicaciones, Pozos, Morales, San José de la Montaña, Real Cerrito de Gasca/Cerrito de Gasca, San Julián, Tavera y equipos de Cuenda; Rincón de Centeno, Naranjillo, San Antonio de Romerillo, Santiago de Cuenda y Emiliano Zapata se conservan aquí como sedes hasta localizar una fuente que confirme un equipo homónimo.</p>'+
    '</section>'+
    '<section class="v33-about-history">'+
      '<div class="v33-about-history-head"><span>ORIGEN E IDENTIDAD</span><h2>Lo que sí está documentado</h2><p>La evidencia permite reconstruir una continuidad de nombre e identidad, pero no fijar todavía una fecha exacta de fundación. Golazo Liga está muy bien documentado como presencia digital histórica; no está probado como razón social de la asociación.</p></div>'+
      '<div class="v33-about-timeline">'+
        '<article><time>1950</time><div><h3>Primer equipo recordado por la propia Liga</h3><p>En un reconocimiento publicado el 8 de junio de 2025, la Liga identifica al Prof. José Carmen Guerrero Velásquez como el único sobreviviente del primer equipo de fútbol formado en Juventino Rosas, GTO., en 1950. Es antecedente del fútbol local, no fecha probada de fundación de la A.C.</p></div></article>'+
        '<article><time>15 sep 1953</time><div><h3>Primer partido localizado en una fuente secundaria</h3><p>Una fuente secundaria sitúa un partido en Juventino Rosas entre Deportivo Santa Cruz y Deportivo Villagrán. Este dato puede convivir con la memoria del equipo formado en 1950 y tampoco prueba que la Liga actual naciera en 1953.</p></div></article>'+
        '<article><time>05 oct 2012</time><div><h3>Golazo Liga · fecha digital mínima</h3><p>La captura aportada muestra una publicación que Facebook presenta como Golazo Liga y el escudo histórico de la Liga. Esta fecha prueba actividad digital al menos desde entonces, no la fundación de la organización.</p></div></article>'+
        '<article><time>feb 2014</time><div><h3>Administrador de Golazo Liga · fuente histórica</h3><p>Se añadió otro perfil aportado por el usuario como administrador de Golazo Liga en febrero de 2014. Se conserva como fuente para rastrear roles, jornadas, equipos y resultados de esa etapa. La búsqueda web pública no devolvió contenido indexado verificable del enlace compartido.</p></div></article>'+
        '<article><time>may 2014</time><div><h3>Administrador de Golazo Liga · publicación de roles</h3><p>Se añadió el perfil aportado por el usuario como administrador de Golazo Liga en mayo de 2014. Según el material conservado, publicaba roles de juego; se usa como pista histórica para reconstruir jornadas, equipos y temporadas. El enlace compartido no pudo verificarse de forma independiente fuera de Facebook.</p></div></article>'+
        '<article><time>c. 2015</time><div><h3>Administrador de Golazo Liga</h3><p>El perfil aportado sirve como pista para reconstruir esa etapa. Administrar la página no demuestra por sí solo que esa persona haya sido presidente de la Liga.</p></div></article>'+
        '<article><time>24 may 2016</time><div><h3>Acuerdo interno</h3><p>El reglamento vigente conserva un antecedente de asamblea relacionado con el proyecto de nuevas oficinas de la Liga.</p></div></article>'+
        '<article><time>2018</time><div><h3>Tablas y goleadores</h3><p>El archivo conserva cortes históricos de Primera e Intermedia con equipos, puntos y goleadores de la categoría libre.</p></div></article>'+
        '<article><time>03 nov 2019</time><div><h3>Juventus campeón</h3><p>El archivo histórico de Golazo Liga identifica a Juventus como campeón de Liga 2018–2019 y a Boavista como subcampeón.</p></div></article>'+
        '<article><time>dic 2019</time><div><h3>Documento público externo</h3><p>El Congreso del Estado de Guanajuato registra “LIGA MUNICIPAL JUVENTINO ROSAS” por $11,600 dentro de apoyos para construcción y reparación, reforzando la continuidad de la denominación institucional.</p></div></article>'+
        '<article><time>2022</time><div><h3>Veteranos</h3><p>Se conserva una tabla final de Veteranos con Juventus en primer lugar con 53 puntos.</p></div></article>'+
        '<article><time>2026</time><div><h3>Continuidad pública</h3><p>Medios regionales y nacionales siguieron utilizando el nombre Liga Municipal de Juventino Rosas al referirse a la competencia.</p></div></article>'+
        '<article><time>2026–27</time><div><h3>Reglamento vigente</h3><p>El documento actual vuelve a usar la forma Liga Municipal de Fútbol “Juventino Rosas A.C.” y define Mesa Directiva, Asamblea, Copa, Liga, Campeón de Campeones y Veteranos.</p></div></article>'+
      '</div>'+
      '<div class="v33-about-history-grid">'+
        '<article><span class="v33-about-history-badge">2012</span><small>PRIMER REGISTRO DIGITAL</small><h3>Golazo Liga</h3><b>5 de octubre de 2012</b><p>Fecha mínima comprobada dentro del material conservado. No es una fecha de fundación.</p></article>'+
        '<article><span class="v33-about-history-badge">A.C.</span><small>NOMBRE INSTITUCIONAL</small><h3>Liga Municipal</h3><b>Juventino Rosas A.C.</b><p>Coincide entre el logotipo histórico y el reglamento 2026–2027.</p></article>'+
        '<article><span class="v33-about-history-badge">2019</span><small>EVIDENCIA EXTERNA</small><h3>Congreso de Guanajuato</h3><b>LIGA MUNICIPAL JUVENTINO ROSAS</b><p>Registro público por $11,600 para construcción y reparación.</p></article>'+
        '<article><span class="v33-about-history-badge">?</span><small>FUNDACIÓN</small><h3>Fecha pendiente</h3><b>No demostrada</b><p>Falta el acta constitutiva o documentación primaria que identifique fecha, fundadores y primera Mesa Directiva.</p></article>'+
      '</div>'+
      '<div class="v33-about-history-facts">'+
        '<div><b>Golazo Liga</b><span>Está documentado con mucha fuerza como nombre de página o identidad digital histórica. La evidencia disponible no demuestra que haya sido la razón social de la Liga.</span></div>'+
        '<div><b>Autonomía de la Liga</b><span>La Asamblea y Mesa Directiva propias respaldan autonomía deportiva frente a Presidencia Municipal y COMUDE. Jugar en instalaciones municipales no demuestra dependencia administrativa.</span></div>'+
        '<div><b>Categorías correctas</b><span>Fútbol adulto/libre —Primera, Intermedia y Segunda— y Veteranos 35+ / 50+. Se excluyen Mini Pony, Infantil y Juvenil salvo que aparezca una conexión documental directa.</span></div>'+
        '<div><b>Qué no está demostrado todavía</b><span>Fundador, primer presidente, fecha exacta de constitución de la A.C., una página anterior a 2012 o una denominación legal previa.</span></div>'+
        '<div><b>Qué documentos resolverían el origen</b><span>Acta constitutiva, reformas de estatutos, libros de Asamblea y Mesa Directiva, reglamentos o roles anteriores a 2012, papelería, credenciales, sellos y premiaciones antiguas.</span></div>'+        '<div><b>Fuentes de febrero y mayo de 2014</b><span>Los perfiles aportados como administradores de Golazo Liga pueden ayudar a identificar roles, equipos, jornadas, resultados y organización de esa etapa. Cada dato concreto se cruza con tablas, capturas o publicaciones antes de incorporarlo como hecho histórico.</span></div>'+

        '<div><b>Cómo se confirma un campeón</b><span>Una publicación, texto, tabla, álbum o imagen de la Liga o de sus administradores puede confirmar el campeonato; no hace falta una fotografía levantando el trofeo.</span></div>'+
      '</div>'+
      '<div class="v33-about-history-head" style="margin-top:18px"><span>ARCHIVO RECUPERADO · VIDEOS Y ZIP</span><h2>Campeones, goleadores, tablas y finales</h2><p>Se revisaron los nuevos segmentos de Google Drive y el archivo de imágenes. Los datos siguientes se agregan como historia de su temporada; no vuelven a meter equipos antiguos a la temporada actual.</p></div>'+
      '<div class="v33-about-history-grid">'+
        '<article><img src="https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/boavista.png" alt="Boavista" loading="lazy"><small>ORIGEN DE CLUB DOCUMENTADO</small><h3>Boavista</h3><b>Octubre de 1987</b><p>Una publicación del XXV aniversario relata que estudiantes de la Preparatoria “Juventino Rosas” organizaron el equipo para registrarlo en Primera Fuerza de la Liga Municipal. Es historia de Boavista, no fecha de fundación de la Liga.</p></article>'+
        '<article><span class="v33-about-history-badge">2014</span><small>CAMPEÓN DE COPA</small><h3>Puros Cuates</h3><b>22 feb 2014 · Fuerza Intermedia</b><p>Golazo Liga identifica al equipo como campeón del Torneo de Copa 2014.</p></article>'+
        '<article><img src="https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/boavista.png" alt="Boavista" loading="lazy"><small>CAMPEÓN DE CAMPEONES</small><h3>Boavista</h3><b>18 ene 2015 · Primera</b><p>El capitán aparece recibiendo el trofeo de Campeón de Campeones.</p></article>'+
        '<article><span class="v33-about-history-badge">2016</span><small>CAMPEÓN DE COPA</small><h3>Magisterio</h3><b>9 jul 2016</b><p>La publicación histórica felicita expresamente a Magisterio como campeón de Copa.</p></article>'+
        '<article><img src="https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/la-esperanza.png" alt="La Esperanza" loading="lazy"><small>VETERANOS J13</small><h3>La Esperanza</h3><b>25 nov 2015 · 35 pts</b><p>Corte histórico: 11 ganados, 2 empates, 0 derrotas, 38 GF y 13 GC.</p></article>'+
        '<article><img src="https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/boavista.png" alt="Boavista FC" loading="lazy"><small>CAMPEÓN DE LIGA · VETERANOS 50+</small><h3>Boavista FC</h3><b>12 abr 2025 · Boca Jrs. vs Boavista</b><p>Final a las 16:00 en Campo 1. Una publicación del mismo día presenta a Boavista como CAMPEÓN 2025.</p></article>'+
        '<article><img src="https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/teams/galacticos-pozos.webp" alt="Galácticos Pozos" loading="lazy"><small>CAMPEÓN DE COPA · PRIMERA FUERZA</small><h3>Galácticos (Pozos)</h3><b>8 jun 2025 · vs Herreras FC</b><p>Final a las 10:00 en Campo 1 de la Unidad Deportiva Sur. La Liga publicó al equipo como Campeón de Copa 2025.</p></article>'+
        '<article><img src="https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/lobos-cdg.png" alt="Lobos CDG" loading="lazy"><small>CAMPEÓN DE COPA · INTERMEDIA</small><h3>Lobos CDG</h3><b>15 jun 2025 · vs Franco FC</b><p>La publicación de la Liga felicita a Lobos CDG, de Cerrito de Gasca, por el título tras vencer a Franco F.C., de San José de Manantiales.</p></article>'+
      '</div>'+
      '<div class="v33-about-history-facts">'+
        '<div><b>Goleadores recuperados</b><span>José Guadalupe Moreno — campeón goleador de Primera Fuerza, 11 ene 2015. Daniel Gómez Delgado — A. Centeno, 34 goles y campeón de goleo de Intermedia, 21 feb 2017. Eusebio Rangel — Hermanos, campeón goleador de Veteranos, publicación del 15 abr 2017.</span></div>'+
        '<div><b>Tablas recuperadas</b><span>Segunda Fuerza del 5 nov 2013; Veteranos del 28 ago 2014; Intermedia del 3 sep 2014; Veteranos J13 del 25 nov 2015; Intermedia J20 del 3 dic 2015; Primera J30 del 6 may 2017; corte de Primera de 16 partidos alrededor del 12 ene 2018; tablas de Primera e Intermedia 2018 y tabla final de Veteranos 2022. Cuando el material es un corte y no una tabla final, se etiqueta así.</span></div>'+
        '<div><b>Finales 2025–2026 recuperadas</b><span>12 abr 2025: Boca Jrs. vs Boavista, Final de Liga de Veteranos 50+, 16:00, Campo 1; Boavista quedó publicado como campeón. 26 abr 2025: Manchester United vs B.F.C., Campeón de Campeones de Veteranos 50+, 17:00, Campo 1. 8 jun 2025: Galácticos (Pozos) vs Herreras FC (Cuenda), Final de Copa de Primera Fuerza, 10:00, Campo 1; Galácticos campeón. 15 jun 2025: Lobos CDG campeón de Copa ante Franco FC. 20 dic 2025: Salvajes vs Juventus, Final de Copa de Veteranos 35+, 15:30, Campo 1. Publicación del 20 may 2026: La Esperanza vs Boavista, Gran Final de Liga de Veteranos 50+. 7 jun 2026: La Canchita Deportes vs Aldama FC, Gran Final de Segunda Fuerza, 10:00, Campo 1 Deportiva Sur.</span></div>'+
        '<div><b>Figuras y trayectorias históricas</b><span>8 jun 2025: la Liga reconoció al Prof. José Carmen Guerrero Velásquez y lo presentó como único sobreviviente del primer equipo de fútbol formado en Juventino Rosas en 1950. 15 jun 2025: reconocimiento al árbitro Gabriel Roque Hortelano por más de 25 años de servicio; la publicación señala certificación federada en 2002 y más de 100 finales pitadas. Ese mismo día se reconoció a Juan Morales Vásquez “Chacharín” por más de 50 años en activo y más de 35 años como encargado de pintar los campos.</span></div>'+
        '<div><b>Equipos que aparecen en el archivo</b><span>El inventario por épocas incluye Boavista, Cuenda, Aguilares, San Julián, Merino, Santa María de Guadalupe, Pozos, San José de la Montaña, Real Cerrito de Gasca, DHP, San Juan FC, Tavera, Morales, La Río Grande, Oklahoma, Salvajes, San José de Allende, Novatos, Deportivo Aldama, Unión Allende, Osasuna, Continental, La Pandilla de Rancho V., La Cuadrilla, Puros Cuates, Populares, Dulces Nombres, Halcones de Cuenda, Terrícolas, Malvinas, San Antonio Jr., Barza, Atlas, Dynamo, Hermanos, Magisterio, La Esperanza, UNAM, Picosos, Sección XIV, Valedores, Chelsea, Guadalajara, Centeno, Xolos Jaralillo, Toros, Galeana, Birds Eye Jr., Portugal, Dortmund, A. Centeno, Olímpicos, Juventus, Linces, PSV, Napoli, Abejas, Lobos CDG, Vatos Locos, Tecos, Mineros, Titanes Tavera, La Huerta, Franco FC, Mazacotes, Deportivo Rafa, Arsenal, Barrio Seco, Átomos, Herreras FC, Atlético Galeana, Promesas FC, La Canchita Deportes, Aldama FC, Boca Jrs., B.F.C., Manchester United, Galácticos (Pozos), Salvajes y Real de Roque. Son apariciones históricas y no modifican los inscritos actuales.</span></div>'+
        '<div><b>Escudos e imágenes</b><span>En Historia se muestran los escudos ya existentes en el proyecto para cada equipo cuando hay una correspondencia segura. Los clubes antiguos sin un escudo confirmado se mantienen con identificador neutro en vez de asignarles un logo inventado.</span></div>'+
        '<div><b>Criterio de precisión</b><span>Si el video solo muestra una premiación pero no permite leer el nombre del equipo, se deja como “equipo no identificado” y no se inventa. Los puntos y goles se copian tal como aparecen en cada publicación histórica.</span></div>'+
      '</div>'+
      '<button type="button" class="v33-about-history-button" data-v33-history>Ver Historia, campeones, finales y récords</button>'+
    '</section>'+
  '</article>';
}
function setBottomNav(){
  const nav=document.querySelector('.bottom-nav');
  if(!nav)return;
  const labels={home:'Inicio',competition:'Competición',video:'Vídeo',fantasy:'Fantasy',more:'Más'};
  nav.querySelectorAll('.nav-item').forEach(function(item){
    item.classList.toggle('active',item.dataset.route==='more');
    const small=item.querySelector('small');
    if(small&&labels[item.dataset.route])small.textContent=labels[item.dataset.route];
  });
  const more=nav.querySelector('[data-route="more"] .nav-icon');
  if(more){
    more.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="2.15" fill="currentColor"/><circle cx="12" cy="12" r="2.15" fill="currentColor"/><circle cx="19" cy="12" r="2.15" fill="currentColor"/></svg>';
    more.dataset.v16IconState='more:on';
  }
}
function share(){
  const data={
    title:'Liga Municipal de Fútbol Juventino Rosas 2026/27',
    text:'Equipos, fechas, sorteos, formato y final de la Liga Municipal de Fútbol Juventino Rosas.',
    url:location.href
  };
  if(navigator.share){
    navigator.share(data).catch(function(){});
  }else if(navigator.clipboard){
    navigator.clipboard.writeText(location.href).catch(function(){});
  }
}
function bind(){
  const back=document.querySelector('[data-v33-about-back]');
  if(back)back.onclick=function(){location.hash='#/more'};
  const shareButton=document.querySelector('[data-v33-about-share]');
  if(shareButton)shareButton.onclick=share;
  const historyButton=document.querySelector('[data-v33-history]');
  if(historyButton)historyButton.onclick=function(){location.hash='#/history'};
}
function render(){
  const active=route()==='safe-about';
  document.body.classList.toggle('v33-about-active',active);
  if(!active)return;
  const screen=document.querySelector('#screen');
  if(!screen)return;
  if(!screen.querySelector('[data-v33-about]'))screen.innerHTML=markup();
  setBottomNav();
  bind();
}
function schedule(){requestAnimationFrame(function(){requestAnimationFrame(render)})}
window.addEventListener('hashchange',schedule);
const screen=document.querySelector('#screen');
if(screen){
  new MutationObserver(function(){
    if(route()==='safe-about'&&!screen.querySelector('[data-v33-about]'))schedule();
  }).observe(screen,{childList:true,subtree:false});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});
else schedule();
})();