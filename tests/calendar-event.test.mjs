import test from 'node:test';
import assert from 'node:assert/strict';
import { calendarEvent, googleCalendarDestination } from '../src/v843-calendar-event.js';
import { registeredTeamPhotos } from '../src/v843-registered-player-photos.js';

const game = { id: 'match-1', iso: '2026-10-11', time: '08:00', home: 'Franco & FC', away: 'Napoli', category: 'Primera Fuerza', round: '8', venue: 'Campo 1, UDS' };
test('all agenda formats keep the official match at Mexico City time, regardless of device timezone', () => {
  const original = process.env.TZ;
  try {
    for (const zone of ['UTC', 'America/Los_Angeles', 'Asia/Tokyo']) {
      process.env.TZ = zone;
      const event = calendarEvent(game, Date.UTC(2026,9,6));
      assert.equal(new Date(event.startMs).toISOString(), '2026-10-11T14:00:00.000Z');
      assert.equal(event.endMs - event.startMs, 7200000);
      const google = new URL(event.googleURL), outlook = new URL(event.outlookURL);
      assert.equal(google.searchParams.get('dates'), '20261011T140000Z/20261011T160000Z');
      assert.equal(google.searchParams.get('stz'), 'America/Mexico_City');
      assert.equal(google.searchParams.get('text'), 'Franco & FC - Napoli');
      assert.equal(outlook.searchParams.get('startdt'), '2026-10-11T14:00:00.000Z');
      assert.match(event.ics, /DTSTART:20261011T140000Z\r\n/);
      assert.match(event.ics, /LOCATION:Campo 1\\, UDS/);
      assert.match(event.ics, /DTSTAMP:20261006T000000Z/);
    }
  } finally { if(original===undefined)delete process.env.TZ;else process.env.TZ=original; }
});
test('an unpublished kickoff stays all day and advances to the next date over year boundaries', () => {
  const event = calendarEvent({ ...game, iso: '2026-12-31', time: 'Por confirmar' });
  assert.equal(event.allDay, true);
  assert.match(event.ics, /DTSTART;VALUE=DATE:20261231\r\nDTEND;VALUE=DATE:20270101/);
  assert.equal(new URL(event.googleURL).searchParams.get('dates'),'20261231/20270101');
  assert.equal(new URL(event.outlookURL).searchParams.get('allday'), 'true');
  assert.throws(()=>calendarEvent({ ...game,iso:'2026-02-30' }), /válida/);
});
test('saved portraits are loaded only for the selected club, category and season', async () => {
  const registry = { seasons: { '2026–2027': [
    { id:'correct', name:'José Pérez', team:'Azul',catId:'3' },
    { id:'other-team',name:'José Pérez',team:'Verde',catId:'3' },
    { id:'other-category',name:'José Pérez',team:'Azul',catId:'2' },
    { id:'unlisted',name:'Ana',team:'Azul',catId:'3' }
  ],'2025–2026':[{id:'old',name:'José Pérez',team:'Azul',catId:'3'}] } };
  const requested=[];
  const photos=await registeredTeamPhotos(registry,'2026–2027','Azul','3',[{name:'Jose Perez'}],async id=>{requested.push(id);return { name:'José Pérez',team:'Azul',dataUrl:'saved-photo' }});
  assert.deepEqual(requested,['correct']);
  assert.deepEqual(photos,{'jose perez|azul':'saved-photo'});
});
test('a stale photo from a transferred player cannot be used for their new team', async () => {
  const registry={seasons:{'2026–2027':[{id:'one',name:'José Pérez',team:'Azul',catId:'3'}]}};
  assert.deepEqual(await registeredTeamPhotos(registry,'2026–2027','Azul','3',[{name:'Jose Perez'}],async()=>({name:'José Pérez',team:'Verde',dataUrl:'wrong'})),{});
});

test('Android calendar chooser drafts retain every match field and safely encode extras', () => {
  const event=calendarEvent({...game,home:'América; FC',away:'PSV',iso:'2026-10-31',time:'15:30',venue:'Campo 2'});
  assert.equal(googleCalendarDestination(event),event.googleURL);
  const intent=googleCalendarDestination(event,true);
  const extras=Object.fromEntries(intent.split('#Intent;')[1].split(';').filter(part=>part.includes('=')).map(part=>{const i=part.indexOf('=');return [part.slice(0,i),decodeURIComponent(part.slice(i+1))]}));
  assert.equal(extras.package,undefined);
  assert.equal(extras.action,'android.intent.action.INSERT');
  assert.equal(extras['S.title'],'América; FC - PSV');
  assert.equal(extras['S.eventLocation'],'Campo 2');
  assert.match(extras['S.description'],/Primera Fuerza/);
  assert.match(extras['S.description'],/Jornada 8/);
  assert.equal(extras['S.eventTimezone'],'America/Mexico_City');
  assert.equal(+extras['l.beginTime'],Date.UTC(2026,9,31,21,30));
  assert.equal(+extras['l.endTime']-+extras['l.beginTime'],7200000);
  assert.equal(extras['B.allDay'],'false');
  assert.equal(extras['S.browser_fallback_url'],event.googleURL);
  assert.equal(new URL(event.googleURL).searchParams.get('dates'),'20261031T213000Z/20261031T233000Z');
});

test('explicit all-day match retains kickoff details and uses exclusive UTC date boundaries', () => {
  const event=calendarEvent({...game, iso:'2026-12-31', allDay:true});
  assert.equal(event.allDay,true);
  assert.equal(event.startMs,Date.UTC(2026,11,31));
  assert.equal(event.endMs,Date.UTC(2027,0,1));
  assert.equal(new URL(event.googleURL).searchParams.get('dates'),'20261231/20270101');
  assert.match(event.description,/Hora del partido: 08:00/);
  assert.match(event.ics,/DTSTART;VALUE=DATE:20261231/);
});
