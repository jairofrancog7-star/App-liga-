/* Public roster fields only; missing positions and shirt numbers stay missing. */
export const normalize = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
export const POSITION_ORDER = ['Portero', 'Defensa', 'Centrocampista', 'Delantero', 'Jugadores'];

export function positionLabel(value) {
  const text = normalize(value);
  if (/porter|arquero|guardameta/.test(text)) return 'Portero';
  if (/defens|lateral|central/.test(text)) return 'Defensa';
  if (/medio|centrocamp|volante/.test(text)) return 'Centrocampista';
  if (/delanter|atacante|extremo/.test(text)) return 'Delantero';
  return 'Jugadores';
}

export function rosterGroups(category, team) {
  const rosterKey = Object.keys(category?.rosters || {}).find(key => normalize(key) === normalize(team));
  const profileKey = Object.keys(category?.player_profiles || {}).find(key => normalize(key) === normalize(team));
  const profiles = category?.player_profiles?.[profileKey] || [];
  const seen = new Set();
  const players = (category?.rosters?.[rosterKey] || []).filter(Boolean).flatMap(name => {
    const key = normalize(name);
    if (seen.has(key)) return [];
    seen.add(key);
    const profile = profiles.find(player => normalize(player.name) === key);
    const dorsal = String(profile?.dorsal || '').trim();
    return [{ name: String(name), position: positionLabel(profile?.position), number: /^\d{1,3}$/.test(dorsal) ? dorsal : '', photo: String(profile?.photo || '') }];
  });
  return POSITION_ORDER.map(position => ({ position, players: players.filter(player => player.position === position) })).filter(group => group.players.length);
}

export function monthIndicator(stripRect, activeRect) {
  return { center: activeRect.left - stripRect.left + activeRect.width / 2, width: Math.min(46, activeRect.width) };
}
