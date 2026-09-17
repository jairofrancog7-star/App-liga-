export const LEAGUE_LOGO='./assets/league/liga-logo.webp';
export const LEAGUE_LOGO_WHITE='./assets/reference/league-logo-white.webp';
export const TEAMS=[
{id:'america',code:'AME',name:'Club América Vet.',short:'América',logo:'https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/branding/america-veteranos-35-user.png',p:1,gd:5,pts:3,form:['n','n','w']},
{id:'huerta',code:'HUE',name:'La Huerta',short:'La Huerta',logo:'./assets/teams/la-huerta.webp',p:1,gd:5,pts:3,form:['n','n','w']},
{id:'promesas',code:'PRO',name:'Promesas FC',short:'Promesas',logo:'./assets/teams/promesas.webp',p:1,gd:4,pts:3,form:['n','n','w']},
{id:'franco',code:'FCO',name:'Franco FC',short:'Franco FC',logo:'./assets/teams/franco.webp',p:1,gd:4,pts:3,form:['n','n','w']},
{id:'galeana',code:'ATG',name:'Atlético Galeana',short:'Atl. Galeana',logo:'./assets/teams/atletico-galeana.webp',p:1,gd:3,pts:3,form:['n','n','w']},
{id:'lobos',code:'LOB',name:'Lobos CDG',short:'Lobos',logo:'./assets/teams/lobos-cdg.webp',p:1,gd:2,pts:3,form:['n','n','w']},
{id:'juventino',code:'JUV',name:'Juventino',short:'Juventino',logo:LEAGUE_LOGO,p:1,gd:2,pts:3,form:['n','n','w']},
{id:'pozos',code:'POZ',name:'Pozos FC',short:'Pozos',logo:'./assets/teams/pozos.webp',p:1,gd:1,pts:3,form:['n','d','w']},
{id:'cuenda',code:'CUE',name:'Cuenda',short:'Cuenda',logo:'./assets/teams/tc-cuenda.webp',p:1,gd:1,pts:1,form:['n','d','d']},
{id:'esperanza',code:'ESP',name:'La Esperanza',short:'Esperanza',logo:'./assets/teams/la-esperanza.webp',p:1,gd:0,pts:1,form:['n','d','d']}
];
export const TEAM=id=>TEAMS.find(t=>t.id===id)||TEAMS[0];
export const FIXTURES={
'10 sept':[['america','huerta','10:45'],['promesas','franco','10:45'],['galeana','lobos','13:00'],['juventino','pozos','13:00']],
'13 oct':[['america','huerta','10:45'],['promesas','franco','10:45'],['galeana','lobos','13:00'],['juventino','pozos','13:00'],['huerta','franco','13:00'],['promesas','america','13:00'],['lobos','cuenda','13:00']],
'14 oct':[['pozos','galeana','10:45'],['franco','america','13:00'],['huerta','lobos','13:00'],['cuenda','promesas','13:00']]
};
