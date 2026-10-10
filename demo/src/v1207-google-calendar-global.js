/* V1207 — Google Calendar compartido por todos los módulos de la Liga.
 * Google Calendar TEMPLATE abre una ficha precargada; la persona elige cuenta y pulsa Guardar.
 * No se crean eventos invisibles, no se inventan horas y no se descarga .ics. */
(function () {
  'use strict';
  if (window.LJR_GOOGLE_CALENDAR_GLOBAL) return;
  const ZONE = 'America/Mexico_City';
  const pad = n => String(n).padStart(2, '0');
  const utc = ms => new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  function mexicoTime(iso, time) {
    const dm = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ''));
    const tm = /^(\d{1,2}):(\d{2})$/.exec(String(time || ''));
    if (!dm || !tm) throw Error('Confirma primero la fecha y la hora del evento.');
    const y = +dm[1], m = +dm[2], d = +dm[3], h = +tm[1], min = +tm[2];
    const check = new Date(Date.UTC(y, m - 1, d));
    if (check.getUTCFullYear() !== y || check.getUTCMonth() !== m - 1 || check.getUTCDate() !== d || h > 23 || min > 59)
      throw Error('La fecha u hora del evento no es válida.');
    const wall = Date.UTC(y, m - 1, d, h, min);
    const fmt = new Intl.DateTimeFormat('en-US', { timeZone: ZONE, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' });
    let ms = wall;
    for (let i = 0; i < 3; i++) {
      const p = Object.fromEntries(fmt.formatToParts(ms).map(x => [x.type, x.value]));
      ms += wall - Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
    }
    return ms;
  }
  function build(spec) {
    if (!spec || !String(spec.title || '').trim()) throw Error('Falta el nombre del evento.');
    const start = Number.isFinite(spec.startMs) ? spec.startMs : mexicoTime(spec.iso, spec.time);
    if (!Number.isFinite(start)) throw Error('Falta confirmar la fecha del evento.');
    const duration = Number(spec.duration);
    const minutes = Number.isFinite(duration) && duration >= 1 && duration <= 1440 ? duration : 120;
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: String(spec.title).trim(),
      dates: utc(start) + '/' + utc(start + minutes * 60000),
      ctz: ZONE, stz: ZONE, etz: ZONE,
      details: String(spec.description || 'Liga Juventino Rosas'),
      location: String(spec.venue || '')
    });
    if (spec.weekly === true) params.set('recur', 'RRULE:FREQ=WEEKLY;BYDAY=TU');
    return 'https://calendar.google.com/calendar/render?' + params.toString();
  }
  function open(spec) {
    let href;
    try { href = build(spec); }
    catch (error) { window.alert(error.message); return false; }
    const link = document.createElement('a');
    link.href = href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    link.remove();
    return true;
  }
  function choose(events, heading) {
    const available = [];
    (Array.isArray(events) ? events : []).forEach(event => {
      try { build(event); available.push(event); } catch (_) { /* Horarios sin confirmar no se ofrecen */ }
    });
    if (!available.length) { window.alert('No hay eventos con fecha y hora confirmadas para guardar.'); return false; }
    if (available.length === 1) return open(available[0]);
    document.querySelector('.ljr-gcal-chooser')?.remove();
    const overlay = document.createElement('div');
    overlay.className = 'ljr-gcal-chooser';
    overlay.setAttribute('role', 'presentation');
    // El panel y las fichas usan la misma paleta azul que Registro y administración.
    const card = document.createElement('section');
    card.setAttribute('role', 'dialog');
    card.setAttribute('aria-modal', 'true');
    card.setAttribute('aria-label', heading || 'Elegir evento de calendario');
    card.className = 'ljr-gcal-dialog';
    const top = document.createElement('div');
    top.className = 'ljr-gcal-header';
    const title = document.createElement('strong');
    title.className = 'ljr-gcal-title';
    title.textContent = heading || 'Selecciona el partido';
    const close = document.createElement('button');
    close.type = 'button'; close.textContent = 'Cerrar';
    close.className = 'ljr-gcal-close';
    close.addEventListener('click', () => overlay.remove());
    top.append(title, close);
    const note = document.createElement('p');
    note.textContent = 'Elige un partido y pulsa Guardar en Google Calendar.';
    note.className = 'ljr-gcal-note';
    const search = document.createElement('input');
    search.type = 'search'; search.placeholder = 'Buscar equipo, fecha o cancha';
    search.setAttribute('aria-label', 'Buscar evento');
    search.className = 'ljr-gcal-search';
    const list = document.createElement('div');
    list.className = 'ljr-gcal-list';
    const buttons = available.map(event => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ljr-gcal-event';
      const label = document.createElement('strong');
      label.className = 'ljr-gcal-event-title';
      label.textContent = event.title;
      const details = document.createElement('small');
      details.className = 'ljr-gcal-event-details';
      details.textContent = [event.iso, event.time, event.venue].filter(Boolean).join(' · ');
      btn.append(label, details);
      btn.addEventListener('click', () => { overlay.remove(); open(event); });
      list.appendChild(btn);
      return btn;
    });
    search.addEventListener('input', () => {
      const q = search.value.trim().toLocaleLowerCase('es-MX');
      buttons.forEach(btn => { btn.hidden = !btn.textContent.toLocaleLowerCase('es-MX').includes(q); });
    });
    card.append(top, note, search, list);
    overlay.appendChild(card);
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
    overlay.addEventListener('keydown', e => { if (e.key === 'Escape') overlay.remove(); });
    document.body.appendChild(overlay);
    // No forzar foco: en Android abría el teclado y desplazaba/cortaba la primera ficha.
    list.scrollTop = 0;
    return true;
  }
  window.LJR_GOOGLE_CALENDAR_GLOBAL = Object.freeze({ build, open, choose, zone: ZONE });
})();
