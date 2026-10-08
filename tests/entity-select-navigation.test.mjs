import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const favorites = read('src/v414-favorites-reference.js');
const globalEntity = read('src/v123-global-entity-compare.js');
const teamDetail = read('src/v42-team-detail-master.js');
const playerProfile = read('src/v379-player-profile-reference.js');

test('choosing a player in Favorites opens the player profile, not a comparator', () => {
  const open = favorites.split('function openPlayer(p){')[1]?.split('\nfunction openCompetition(')[0];
  assert.ok(open, 'Favorites openPlayer should exist');
  assert.match(open, /LJR_PLAYER_PROFILE_API\?\.open/);
  assert.match(open, /#\/playerDetail/);
  assert.doesNotMatch(open, /LJR_PLAYER_COMPARE_API|#\/playerCompare/);
});
test('choosing a team in Favorites opens its summary, not the team comparison', () => {
  const open = favorites.split('function openTeam(name,cat){')[1]?.split('\nfunction openPlayer(')[0];
  assert.ok(open);
  assert.match(open, /LJR_TEAM_DETAIL_API\?\.openTeam/);
  assert.match(open, /removeItem\('v42-open-compare'\)/);
  assert.match(open, /#\/teamDetail\?tab=summary/);
});
test('global listeners respect favorite selection and comparison picker controls', () => {
  for (const js of [globalEntity, teamDetail]) {
    assert.match(js, /data-v414-player/);
    assert.match(js, /data-v414-team/);
    assert.match(js, /v123-picker-overlay/);
    assert.match(js, /v369-team-compare/);
  }
  assert.match(teamDetail, /route\(\)!==initialRoute/);
});
test('comparison still opens via its explicit dedicated buttons', () => {
  assert.match(teamDetail, /data-v42-compare>Comparar/);
  assert.match(playerProfile, /data-v379-compare>Comparar/);
});
