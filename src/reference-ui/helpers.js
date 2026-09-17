import {LEAGUE_LOGO,TEAM} from './data.js';
import {icon} from './icons.js';
export const crest=(id,cl='')=>`<img class="v11-crest ${cl}" src="${TEAM(id).logo}" alt="${TEAM(id).name}">`;
export const leagueLogo=(cl='')=>`<img class="v11-league-logo ${cl}" src="${LEAGUE_LOGO}" alt="Liga Municipal de Fútbol Juventino Rosas">`;
export const profileButton=()=>`<button class="v11-profile" data-route="profile" aria-label="Perfil">${icon('user')}</button>`;
export const innerHeader=(title,share=false)=>`<header class="v11-inner-head"><button data-action="back" aria-label="Volver">${icon('back')}</button><h1>${title}</h1>${share?`<button data-action="share" aria-label="Compartir">${icon('share')}</button>`:'<span></span>'}</header>`;
export const formDots=form=>`<span class="v11-form">${form.map(x=>`<i class="${x}">${x==='w'?'V':''}</i>`).join('')}</span>`;
