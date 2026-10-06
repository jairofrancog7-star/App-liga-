export const CALENDAR_ZONE = 'America/Mexico_City';
export function googleCalendarDestination(event, android = false) {
  if (!android) return event.googleURL;
  const encode = value => encodeURIComponent(String(value));
  return 'intent://com.android.calendar/events#Intent;scheme=content;action=android.intent.action.INSERT;type=vnd.android.cursor.item/event;'
    + 'S.title=' + encode(event.title) + ';S.description=' + encode(event.description) + ';S.eventLocation=' + encode(event.location)
    + ';S.eventTimezone=' + encode(event.timeZone) + ';l.beginTime=' + event.startMs + ';l.endTime=' + event.endMs
    + ';B.allDay=' + event.allDay + ';S.browser_fallback_url=' + encode(event.googleURL) + ';end';
}
const stamp = value => new Date(value).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
const escapeICS = value => String(value || '').replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');

function zonedTimestamp(year, month, day, hour = 0, minute = 0) {
  const wall = Date.UTC(year, month - 1, day, hour, minute);
  const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: CALENDAR_ZONE, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' });
  let value = wall;
  for (let i = 0; i < 3; i++) {
    const p = Object.fromEntries(formatter.formatToParts(value).map(part => [part.type, part.value]));
    const represented = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
    value += wall - represented;
  }
  return value;
}

export function calendarEvent(game, now = Date.now()) {
  const date = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(game?.iso || ''));
  if (!date) throw new Error('El partido no tiene fecha publicada.');
  const [, y, m, d] = date.map(Number);
  const check = new Date(Date.UTC(y, m - 1, d));
  if (check.getUTCFullYear() !== y || check.getUTCMonth() !== m - 1 || check.getUTCDate() !== d) throw new Error('La fecha del partido no es válida.');
  const time = /^(\d{2}):(\d{2})$/.exec(String(game.time || ''));
  const hasTime = !!time && +time[1] < 24 && +time[2] < 60;
  const timed = hasTime && game.allDay !== true;
  const startMs = timed ? zonedTimestamp(y, m, d, +time[1], +time[2]) : Date.UTC(y, m - 1, d);
  const endMs = timed ? startMs + 7200000 : Date.UTC(y, m - 1, d + 1);
  const title = `${game.home} - ${game.away}`;
  const description = [game.category, game.round ? `Jornada ${game.round}` : '', hasTime ? `Hora del partido: ${game.time} (hora de México).` : 'Horario por confirmar.', timed ? 'Duración prevista: 2 horas.' : 'Partido guardado como evento de todo el día.'].filter(Boolean).join(' · ');
  const event = { title, description, location: game.venue || '', startMs, endMs, allDay: !timed, timeZone: CALENDAR_ZONE };
  const start = timed ? stamp(startMs) : game.iso.replace(/-/g, '');
  const end = timed ? stamp(endMs) : new Date(Date.UTC(y, m - 1, d + 1)).toISOString().slice(0, 10).replace(/-/g, '');
  const google = new URL('https://calendar.google.com/calendar/r/eventedit');
  google.search = new URLSearchParams({ action: 'TEMPLATE', text: title, dates: `${start}/${end}`, stz: CALENDAR_ZONE, etz: CALENDAR_ZONE, details: description, location: event.location }).toString();
  const outlook = new URL('https://outlook.live.com/calendar/0/deeplink/compose');
  outlook.search = new URLSearchParams({ path: '/calendar/action/compose', rru: 'addevent', subject: title, body: description, location: event.location, startdt: timed ? new Date(startMs).toISOString() : game.iso, enddt: timed ? new Date(endMs).toISOString() : new Date(Date.UTC(y, m - 1, d + 1)).toISOString().slice(0, 10), allday: String(!timed) }).toString();
  const body = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Liga Juventino Rosas//Calendario//ES', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT', `UID:${escapeICS(game.id)}@juventinorosasliga.com`, `DTSTAMP:${stamp(now)}`, `${timed ? 'DTSTART:' : 'DTSTART;VALUE=DATE:'}${start}`, `${timed ? 'DTEND:' : 'DTEND;VALUE=DATE:'}${end}`, `SUMMARY:${escapeICS(title)}`, `LOCATION:${escapeICS(event.location)}`, `DESCRIPTION:${escapeICS(description)}`, 'END:VEVENT', 'END:VCALENDAR', ''].join('\r\n');
  return { ...event, googleURL: google.href, outlookURL: outlook.href, ics: body };
}
