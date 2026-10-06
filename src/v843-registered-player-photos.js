import { normalize } from './v839-reference-data.js';

export async function registeredTeamPhotos(registry, season, team, categoryId, players, readPhoto) {
  const names = new Set(players.map(player => normalize(player.name)));
  const rows = (registry?.seasons?.[season] || []).filter(row => row.id && normalize(row.team) === normalize(team) && (!row.catId || String(row.catId) === String(categoryId)) && names.has(normalize(row.name)));
  const entries = await Promise.all(rows.map(async row => {
    const photo = await readPhoto(row.id).catch(() => null);
    return photo?.dataUrl && normalize(photo.name) === normalize(row.name) && normalize(photo.team) === normalize(team) ? [normalize(row.name) + '|' + normalize(team), photo.dataUrl] : null;
  }));
  return Object.fromEntries(entries.filter(Boolean));
}
