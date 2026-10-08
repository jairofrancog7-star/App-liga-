import test from 'node:test';
import assert from 'node:assert/strict';
import {teamOptions,parsePlayers,mergeTeam,parseCedulaScore} from '../scripts/sync-adminfut-public-players.mjs';
const html='<select name="equipo"><option value="">Todos</option><option value="25">FRANCO FC</option><option value="21">JUVENTUS</option></select>'+
'<table class="table"><thead><tr><th>Jugador</th><th>Documento (CURP)</th></tr></thead><tbody>'+
'<tr><td><img src="https://res.cloudinary.com/rdk7ndhb/image/upload/v1/jugadores/foto-01" alt="Jugador"></td><td><strong>José García</strong></td><td><code>SENSITIVE_DOCUMENT_SHOULD_NOT_BE_STORED</code></td><td>9</td><td>Delantero</td><td>34 años</td></tr>'+
'<tr><td></td><td><strong>Juan López</strong></td><td><code>PRIVATE_CREDENTIAL_NOT_TO_STORE</code></td><td>—</td><td>Defensa</td><td>22 años</td></tr>'+
'</tbody></table>';
test('public registration parser only retains sports fields and public portraits',()=>{
 const players=parsePlayers(html);
 assert.equal(players.length,2);
 assert.equal(players[0].name,'José García');
 assert.equal(players[0].position,'Delantero');
 assert.equal(players[0].dorsal,'9');
 assert.match(players[0].photo,/res.cloudinary.com/);
 assert.equal(players[1].photo,undefined);
 assert.doesNotMatch(JSON.stringify(players),/SENSITIVE_DOCUMENT|PRIVATE_CREDENTIAL|CURP|34 años/);
 assert.deepEqual(teamOptions(html).map(x=>x.id),['25','21']);
});
test('player merge keeps existing portraits, safely adds confirmed registrations and updates public photos',()=>{
 const c={rosters:{'FRANCO FC':['José García','Archivo Histórico']},player_profiles:{'FRANCO FC':[{name:'José García',position:'Defensa',dorsal:'—',photo:'https://res.cloudinary.com/old.jpg'}]}};
 const counter={added:0,profiles:0,photo:0,position:0,dorsal:0};
 mergeTeam(c,'FRANCO FC',parsePlayers(html),counter);
 assert.equal(counter.added,1);
 assert.equal(counter.profiles,1);
 assert.equal(counter.photo,1);
 assert.ok(c.rosters['FRANCO FC'].includes('Archivo Histórico'),'do not delete historical rosters');
 assert.equal(c.player_profiles['FRANCO FC'][0].position,'Delantero');
 assert.doesNotMatch(JSON.stringify(c),/SENSITIVE_DOCUMENT|PRIVATE_CREDENTIAL/);
});
test('audits official referee reports without CURP or player documents',()=>{
 const sample='<div>Vista de solo lectura: cédula del partido finalizado.</div><a>Volver</a><strong>HERMANOS</strong> 1 - 0 <strong>GALACTICOS</strong>';
 assert.deepEqual(parseCedulaScore(sample,'HERMANOS','GALACTICOS'),['1','0']);
 assert.equal(parseCedulaScore(sample,'Franco FC','Juventus'),null);
});