export const ICONS={
back:'<svg viewBox="0 0 24 24"><path d="M20 12H5M11 18l-6-6 6-6"/></svg>',
user:'<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4.5 21c1.6-4 4.1-6 7.5-6s5.9 2 7.5 6"/></svg>',
bell:'<svg viewBox="0 0 24 24"><path d="M6 17h12l-1.5-2.4V10a4.5 4.5 0 0 0-9 0v4.6z"/><path d="M10 19.5h4"/></svg>',
play:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4z"/></svg>',
share:'<svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="19" r="2"/><path d="m8 11 8-5M8 13l8 5"/></svg>',
search:'<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>',
star:'<svg viewBox="0 0 24 24"><path d="m12 3 2.8 5.6 6.2.9-4.5 4.4 1.1 6.1-5.6-2.9L6.4 20l1.1-6.1L3 9.5l6.2-.9z"/></svg>',
shield:'<svg viewBox="0 0 24 24"><path d="M12 3 4.5 6v5.5c0 4.6 3 7.6 7.5 9.5 4.5-1.9 7.5-4.9 7.5-9.5V6z"/><path d="m9 12 2 2 4-4"/></svg>',
chart:'<svg viewBox="0 0 24 24"><path d="M5 19V9M12 19V5M19 19v-7"/></svg>',
cup:'<svg viewBox="0 0 24 24"><path d="M8 4h8v4c0 3-1.5 5-4 6-2.5-1-4-3-4-6zM8 6H4v2c0 2 1.2 3.7 3.4 4.4M16 6h4v2c0 2-1.2 3.7-3.4 4.4M12 14v4M8 21h8M9 18h6"/></svg>',
history:'<svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 2.3-5.7L4 8.5"/><path d="M4 4v4.5h4.5M12 8v5l3 2"/></svg>',
bag:'<svg viewBox="0 0 24 24"><path d="M5 8h14l1 13H4zM9 8V6a3 3 0 0 1 6 0v2"/></svg>',
info:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 10v7M12 7h.01"/></svg>',
game:'<svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="1.5"/><path d="M7 10h4M9 8v4M15 10h.01M18 13h.01"/></svg>',
moreless:'<svg viewBox="0 0 24 24"><path d="M7 20V5M4 8l3-3 3 3M17 4v15M14 16l3 3 3-3"/></svg>',
moments:'<svg viewBox="0 0 24 24"><rect x="4" y="6" width="16" height="13" rx="1.5"/><path d="m10 10 5 3-5 3zM7 3v3M17 3v3"/></svg>',
perf:'<svg viewBox="0 0 24 24"><path d="M4 17c3-6 5-9 8-9s4 6 8 3M4 7h3v3H4zM17 16h3v3h-3z"/></svg>'};
export const icon=(name,cl='')=>`<span class="v11-ico ${cl}">${ICONS[name]||''}</span>`;
