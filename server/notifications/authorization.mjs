// Solo permisos del servicio de avisos; otras API requieren controles independientes.
export const ROLE_PERMS=Object.freeze({
 presidente:Object.freeze(['notices:read','notices:write','meetings:read','meetings:write','roles:write','audit:read','recipients:write','cedulas:read','cedulas:write','cedulas:review','cedulas:publish']),
 secretario:Object.freeze(['notices:read','notices:write','meetings:read','meetings:write','cedulas:read','cedulas:write','cedulas:review']),
 editor:Object.freeze(['notices:read','notices:write','cedulas:read','cedulas:write']),
 disciplina:Object.freeze(['notices:read','cedulas:read','cedulas:review']),
 arbitro:Object.freeze(['cedulas:read','cedulas:write','cedulas:sign']),
 lector:Object.freeze([])
});
export const safeSubject=value=>/^[A-Za-z0-9:_-]{1,128}$/.test(String(value||''));
export function roleFor(identity,assigned){
 if(identity?.owner===true)return 'presidente';
 return assigned&&assigned!=='presidente'&&Object.hasOwn(ROLE_PERMS,assigned)?assigned:'lector';
}
export const can=(role,permission)=>Object.hasOwn(ROLE_PERMS,role)&&ROLE_PERMS[role].includes(permission);
