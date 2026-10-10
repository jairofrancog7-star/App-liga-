/* Librerías reales empaquetadas por Vite: Chrono ES + RRule.
   Si el módulo falla en un navegador, v1211 dispone de un motor local sin red. */
import * as chrono from 'chrono-node';
import {RRule} from 'rrule';
const WEEK={daily:RRule.DAILY,weekdays:RRule.WEEKLY,weekly:RRule.WEEKLY,biweekly:RRule.WEEKLY,monthly:RRule.MONTHLY};
const DATE_RE=/^(\d{4})-(\d{2})-(\d{2})$/;
const pad=n=>String(n).padStart(2,'0');
function plan({date,time,repeat,count}){
  const match=DATE_RE.exec(date||'');
  if(!match||!/^([01]\d|2[0-3]):[0-5]\d$/.test(time||''))return null;
  const n=Number(count);
  if(!Number.isInteger(n)||n<1||n>20)return null;
  if(repeat==='none')return {dates:[date],rrule:'',engine:'RRule'};
  const freq=WEEK[repeat];if(freq===undefined)return null;
  const yy=+match[1],mm=+match[2]-1,dd=+match[3];
  const [h,m]=time.split(':').map(Number),first=new Date(Date.UTC(yy,mm,dd,h,m));
  if(first.getUTCFullYear()!==yy||first.getUTCMonth()!==mm||first.getUTCDate()!==dd)return null;
  const opts={freq,interval:repeat==='biweekly'?2:1,count:n,dtstart:first};
  if(repeat==='weekdays')opts.byweekday=[RRule.MO,RRule.TU,RRule.WE,RRule.TH,RRule.FR];
  if(repeat==='weekly'||repeat==='biweekly')opts.byweekday=[RRule.SU,RRule.MO,RRule.TU,RRule.WE,RRule.TH,RRule.FR,RRule.SA][first.getUTCDay()];
  const rule=new RRule(opts);
  const dates=rule.all().map(d=>d.getUTCFullYear()+'-'+pad(d.getUTCMonth()+1)+'-'+pad(d.getUTCDate()));
  return {dates,rrule:rule.toString(),engine:'RRule'};
}
function parseEs(text,now=new Date()){
  try{
    const parsed=chrono.es?.parse?.(text,{instant:now,timezone:'America/Mexico_City'})||[];
    for(const p of parsed){
      const c=p.start;
      if(!c?.isCertain('day')||!c.isCertain('month'))continue;
      const year=c.get('year'),month=c.get('month'),day=c.get('day');
      if(!year||!month||!day)continue;
      const d=new Date(Date.UTC(year,month-1,day));
      if(d.getUTCFullYear()!==year||d.getUTCMonth()+1!==month||d.getUTCDate()!==day)continue;
      const result={date:year+'-'+pad(month)+'-'+pad(day)};
      if(c.isCertain('hour')){
        const h=c.get('hour'),m=c.get('minute')||0;
        if(h>=0&&h<=23&&m>=0&&m<=59)result.time=pad(h)+':'+pad(m);
      }
      return result;
    }
  }catch(_){}
  return null;
}
window.LJR_NOTICE_DATE_LIBS={plan,parseEs};
window.dispatchEvent(new Event('ljr:notice-libs-ready'));
