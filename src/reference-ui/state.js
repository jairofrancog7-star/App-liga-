export const uiState={
  competitionTab:'fixtures',
  selectedDate:'13 oct',
  standingsMode:'compact',
  bracketPhase:'playoff',
  statsTab:'general',
  rankingsTab:'clubs',
  historyTab:'summary',
  fantasyLogin:false,
  quizSelection:null,
  followed:JSON.parse(localStorage.getItem('lj-v11-followed')||'["america"]'),
  favorite:localStorage.getItem('lj-v11-favorite')||'',
  notifications:JSON.parse(localStorage.getItem('lj-v11-notifications')||'{"goals":true,"kickoff":true,"final":true,"news":true,"video":true,"fantasy":true}'),
  language:localStorage.getItem('lj-v11-language')||'Español'
};
export const persistFollowing=()=>localStorage.setItem('lj-v11-followed',JSON.stringify(uiState.followed));
export const persistFavorite=()=>localStorage.setItem('lj-v11-favorite',uiState.favorite||'');
export const persistNotifications=()=>localStorage.setItem('lj-v11-notifications',JSON.stringify(uiState.notifications));
