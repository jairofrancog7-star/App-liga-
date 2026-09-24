/* Official Competition adapter. No seed data, standings recalculation or score coercion. */
export const norm = v => String(v ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
export const number = v => /^[+-]?\d+$/.test(String(v ?? '').trim()) ? Number(v) : null;
const blocks = v => Array.isArray(v) ? v : [];
export function normalizeCompetition(db) {
  return Object.entries(db?.categories || {}).map(([id,c]) => {
    const standings = blocks(c.standings).flatMap(b => blocks(b.rows)).filter(r => Array.isArray(r) && r.length >= 10 && r[1]).map(r => ({
      pos:number(r[0]), name:String(r[1]), pj:number(r[2]), g:number(r[3]), e:number(r[4]), p:number(r[5]), gf:number(r[6]), gc:number(r[7]), dg:number(r[8]), pts:number(r[9]), form:[], classified:false
    }));
    const seen=new Set();
    const matches=blocks(c.fixtures).flatMap(b=>blocks(b.rows).map((r,i)=>({r,i}))).filter(({r})=>Array.isArray(r)&&r[2]&&r[6]).map(({r,i})=>{
      const date=String(r[8]||''); const d=date.match(/(\d{2})\/(\d{2})\/(\d{4})/);
      const iso=d?`${d[3]}-${d[2]}-${d[1]}`:'';
      const homeScore=number(r[3]),awayScore=number(r[5]);
      const complete=homeScore!==null&&awayScore!==null;
      const publishedStatus=String(r.status||'').toUpperCase();
      const status=['LIVE','FINAL','POSTPONED','SUSPENDED','VENUE CHANGED'].includes(publishedStatus)?publishedStatus:complete?'FINAL':'UNCONFIRMED';
      return {id:`${id}:${r[0]??i}`,category:id,round:String(r[1]??''),home:String(r[2]),away:String(r[6]),homeScore,awayScore,complete,status,venue:String(r[7]||''),date,iso,time:date.match(/\s(\d{1,2}:\d{2})/)?.[1]||'',raw:r};
    }).filter(m=>{if(seen.has(m.id))return false;seen.add(m.id);return true});
    // Form is shown only when every played match needed by the standings is available.
    for(const t of standings){
      const games=matches.filter(m=>(norm(m.home)===norm(t.name)||norm(m.away)===norm(t.name))&&m.complete&&m.status==='FINAL').sort((a,b)=>a.iso.localeCompare(b.iso)||a.time.localeCompare(b.time));
      if(t.pj>0&&games.length===t.pj&&games.every(m=>m.iso))t.form=games.slice(-3).map(m=>m.homeScore===m.awayScore?'E':((norm(m.home)===norm(t.name))===(m.homeScore>m.awayScore))?'V':'D');
    }
    const rounds=[...new Set(matches.map(m=>m.round))].map(round=>({id:round,matches:matches.filter(m=>m.round===round)}));
    const scorers=blocks(c.scorers).flatMap(b=>blocks(b.rows)).filter(r=>Array.isArray(r)&&r.length>=4&&number(r[3])!==null).map(r=>({pos:number(r[0]),player:String(r[1]),team:String(r[2]),goals:number(r[3])}));
    // Stages come only from explicitly named knockout rounds in the official fixtures.
    const stages=rounds.filter(r=>/play.?off|octavos|cuartos|semifinal|^final\b/i.test(r.id));
    return {id,name:c.name||id,standings,matches,rounds,scorers,stages,source:db.source,capturedAt:db.captured_at_utc};
  });
}
export function statistics(category, teamName) {
  const matches=category.matches.filter(m=>!teamName||norm(m.home)===norm(teamName)||norm(m.away)===norm(teamName));
  const finals=matches.filter(m=>m.complete&&m.status==='FINAL');
  const goals=finals.reduce((n,m)=>n+m.homeScore+m.awayScore,0);
  const stats={'Partidos publicados':matches.length,'Resultados completos':finals.length,'Sin resultado completo':matches.length-finals.length};
  if(finals.length)Object.assign(stats,{'Goles (resultados completos)':goals,'Goles por partido completo':(goals/finals.length).toFixed(2),'Victorias locales':finals.filter(m=>m.homeScore>m.awayScore).length,'Empates':finals.filter(m=>m.homeScore===m.awayScore).length,'Victorias visitantes':finals.filter(m=>m.homeScore<m.awayScore).length});
  if(!teamName&&category.standings.length)Object.assign(stats,{'Equipos en tabla':category.standings.length,'Líder':category.standings.find(t=>t.pos===1)?.name||'—'});
  if(teamName&&finals.length){
    for(const [key,side] of [['Local','home'],['Visitante','away']]){
      const games=finals.filter(m=>norm(m[side])===norm(teamName));
      const wins=games.filter(m=>side==='home'?m.homeScore>m.awayScore:m.awayScore>m.homeScore).length;
      const draws=games.filter(m=>m.homeScore===m.awayScore).length;
      stats[key+' (resultados completos)']=`${games.length} PJ · ${wins} PG · ${draws} PE · ${games.length-wins-draws} PP`;
    }
  }
  return stats;
}
