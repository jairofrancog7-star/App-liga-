import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Regression guard: the mobile Calendar '+' button has repeatedly lost its
// prefilled match details after unrelated UI updates. Keep this test in the
// default CI suite, without modifying any visual styles or screen layouts.
const source = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');

test('Google Calendar opens a prefilled match template on mobile web', () => {
  const helper = source('src/v843-calendar-event.js');
  const screen = source('src/v415-calendar-reference.js');
  assert.match(helper, /new URL\('https:\/\/calendar\.google\.com\/calendar\/render'\)/);
  assert.match(helper, /action:\s*'TEMPLATE'/);
  assert.match(helper, /text:\s*title/);
  assert.match(helper, /details:\s*description/);
  assert.match(helper, /location:\s*event\.location/);
  assert.match(helper, /dates:\s*\`\$\{start\}\/\$\{end\}\`/);
  assert.match(helper, /return event\.googleURL;/);
  assert.match(screen, /return googleCalendarDestination\(calendarEvent\(game\)\)/);
  assert.match(screen, /data-v415-add-calendar/);
  assert.match(screen, /querySelectorAll\('\[data-v415-add-calendar\]'\)/);
});

test('native APK keeps the match calendar button wired to its plugin', () => {
  const screen = source('src/v415-calendar-reference.js');
  const native = source('native/android/LigaCalendarPlugin.java');
  const html = source('index.html');
  assert.match(screen, /Capacitor\.isNativePlatform\(\)/);
  assert.match(screen, /Capacitor\.isPluginAvailable\('LigaCalendar'\)/);
  assert.match(screen, /nativeCalendar\.openEvent\(event\)/);
  assert.match(native, /@CapacitorPlugin\(name = "LigaCalendar"\)/);
  assert.match(native, /CalendarContract\.Events\.TITLE/);
  assert.match(native, /CalendarContract\.Events\.DESCRIPTION/);
  assert.match(native, /CalendarContract\.Events\.EVENT_LOCATION/);
  assert.match(native, /CalendarContract\.EXTRA_EVENT_BEGIN_TIME/);
  assert.match(native, /CalendarContract\.EXTRA_EVENT_END_TIME/);
  assert.match(html, /src="\.\/src\/v415-calendar-reference\.js\?v=[^"]+"/);
});
