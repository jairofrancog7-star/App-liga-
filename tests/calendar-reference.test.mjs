import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { rosterGroups, monthIndicator } from '../src/v839-reference-data.js';

test('roster cards preserve every official player and their published position', async () => {
  const db = JSON.parse(await readFile(new URL('../public/data/official-live.json', import.meta.url)));
  for (const category of Object.values(db.categories)) {
    for (const [team, names] of Object.entries(category.rosters)) {
      const players = rosterGroups(category, team).flatMap(group => group.players);
      assert.equal(players.length, new Set(names.map(name => name.toLowerCase().trim())).size, team);
      assert.deepEqual(new Set(players.map(player => player.name)), new Set(names), team);
      for (const player of players) assert.ok(!player.number || /^\d{1,3}$/.test(player.number));
    }
  }
});

test('a shared player name uses the selected club profile, not another club photo or position', () => {
  const category = { rosters: { Azul: ['José Pérez'] }, player_profiles: {
    Verde: [{ name: 'José Pérez', position: 'Portero', dorsal: '1', photo: 'wrong.png' }],
    Azul: [{ name: 'Jose Perez', position: 'Mediocampista', dorsal: '8', photo: 'correct.png' }]
  }};
  assert.deepEqual(rosterGroups(category, 'Azul'), [{ position: 'Centrocampista', players: [{ name: 'José Pérez', position: 'Centrocampista', number: '8', photo: 'correct.png' }] }]);
});

test('unpublished positions and numbers do not become guessed defenders or sequential dorsals', () => {
  const groups = rosterGroups({ rosters: { Azul: ['Ana', 'Luis', 'Luis'] }, player_profiles: { Azul: [{ name: 'Ana', dorsal: '—' }] } }, 'Azul');
  assert.equal(groups.length, 1);
  assert.equal(groups[0].position, 'Jugadores');
  assert.deepEqual(groups[0].players.map(player => player.number), ['', '']);
});

test('month underline follows the visible active month after horizontal scrolling', () => {
  assert.deepEqual(monthIndicator({ left: 100 }, { left: 210, width: 80 }), { center: 150, width: 46 });
  assert.deepEqual(monthIndicator({ left: 100 }, { left: 160, width: 80 }), { center: 100, width: 46 });
});
