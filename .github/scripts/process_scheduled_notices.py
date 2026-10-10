#!/usr/bin/env python3
import json, os, sys, re, hmac, hashlib
from datetime import datetime, timezone, timedelta
from pathlib import Path

ROOT=Path(__file__).resolve().parents[2]
SCHEDULE=ROOT/'public/data/scheduled-notices.json'
ACTIVE=ROOT/'public/data/active-notices.json'
OUT=ROOT/'public/generated/notices'

def parse_dt(v):
    if not v:return None
    try:return datetime.fromisoformat(v.replace('Z','+00:00')).astimezone(timezone.utc)
    except Exception:return None

def load(path,default):
    try:return json.loads(path.read_text(encoding='utf-8'))
    except Exception:return default

def save(path,obj):
    path.parent.mkdir(parents=True,exist_ok=True)
    path.write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

def make_png(item):
    try:
        from PIL import Image, ImageDraw, ImageFont
    except Exception:
        return None
    OUT.mkdir(parents=True,exist_ok=True)
    safe_id=str(item.get('id',''))
    if not re.fullmatch(r'[A-Za-z0-9_-]{1,90}',safe_id):return None
    path=OUT/(safe_id+'.png')
    W,H=1080,1350
    im=Image.new('RGB',(W,H),(8,8,91));d=ImageDraw.Draw(im)
    for y in range(H):
        t=y/(H-1);r=int(18*(1-t)+7*t);g=int(55*(1-t)+7*t);b=int(220*(1-t)+91*t)
        d.line((0,y,W,y),fill=(r,g,b))
    bold='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf';reg='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
    def font(path,size):
        try:return ImageFont.truetype(path,size)
        except Exception:return ImageFont.load_default()
    fb,fr=font(bold,72),font(reg,38);fk=font(bold,38);fs=font(reg,26)
    d.rounded_rectangle((70,80,1010,1270),radius=34,outline=(34,224,239),width=4)
    d.text((96,130),'LIGA JUVENTINO ROSAS',font=fk,fill=(33,224,239))
    def draw_wrap(text,xy,fnt,fill,maxw,step):
        x,y=xy;line=''
        for word in str(text).split():
            cand=(line+' '+word).strip()
            if d.textbbox((0,0),cand,font=fnt)[2]>maxw and line:
                d.text((x,y),line,font=fnt,fill=fill);y+=step;line=word
            else:line=cand
        if line:d.text((x,y),line,font=fnt,fill=fill);y+=step
        return y
    y=draw_wrap(item.get('title','Aviso importante'),(96,300),fb,'white',850,86)
    y=draw_wrap(item.get('body') or item.get('message',''),(96,y+35),fr,(205,214,239),850,54)
    d.text((96,1110),str(item.get('type','AVISO')).upper(),font=fk,fill=(33,224,239))
    d.text((96,1200),'Liga Municipal de Fútbol Juventino Rosas A.C.',font=fs,fill=(170,180,215))
    im.save(path,'PNG',optimize=True)
    return path

def post_facebook(item,png_path):
    page=os.getenv('FACEBOOK_PAGE_ID','').strip();token=os.getenv('FACEBOOK_PAGE_ACCESS_TOKEN','').strip()
    if not page or not token:return 'needs_configuration'
    try:
        import requests
        caption=(item.get('title','Aviso')+'\n\n'+(item.get('body') or item.get('message',''))).strip()
        if png_path and png_path.exists():
            with png_path.open('rb') as fh:
                r=requests.post(f'https://graph.facebook.com/v21.0/{page}/photos',data={'caption':caption,'access_token':token},files={'source':fh},timeout=45)
        else:
            r=requests.post(f'https://graph.facebook.com/v21.0/{page}/feed',data={'message':caption,'access_token':token},timeout=45)
        return 'sent' if r.ok else f'error:{r.status_code}'
    except Exception as e:return 'error:'+str(e)[:120]

def approval_signature(item, secret):
    """Firma todos los campos del aviso menos la autorización y el estado local."""
    payload={key:item.get(key) for key in
        ('id','title','body','message','category','channels','publish_at','publishAt','type')}
    msg=json.dumps(payload,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode('utf-8')
    return hmac.new(secret.encode('utf-8'),msg,hashlib.sha256).hexdigest()

def approved(item):
    """Fallar cerrado sin clave HMAC privada configurada en GitHub Secrets.
    Una etiqueta JSON 'approved' por sí sola no autoriza la publicación.
    """
    secret=os.getenv('LJR_OFFICIAL_NOTICE_APPROVAL_SECRET','')
    a=item.get('approval')
    if len(secret)<32 or not isinstance(a,dict) or a.get('status')!='approved':
        return False
    if not isinstance(a.get('by'),str) or not a['by'].strip() or not parse_dt(a.get('at')):
        return False
    signature=str(a.get('signature') or '')
    return len(signature)==64 and hmac.compare_digest(signature,approval_signature(item,secret))

def main():
    now=datetime.now(timezone.utc)
    schedule=load(SCHEDULE,[])
    active=load(ACTIVE,[])
    if isinstance(active,dict):active=active.get('items',[])
    if not isinstance(active,list):active=[]
    if not isinstance(schedule,list):schedule=[]
    active=[x for x in active if isinstance(x,dict)]
    changed=False
    existing={str(x.get('id')) for x in active if x.get('id')}
    for item in schedule:
        if not isinstance(item,dict) or not approved(item):continue
        item_id=str(item.get('id',''))
        if not re.fullmatch(r'[A-Za-z0-9_-]{1,90}',item_id):continue
        if not str(item.get('title','')).strip():continue
        pub=parse_dt(item.get('publish_at') or item.get('publishAt'))
        if not pub or now<pub:continue
        channels=item.get('channels') or {'app':True}
        if not isinstance(channels,dict):continue
        png_path=None
        if channels.get('png') and not item.get('png_generated'):
            png_path=make_png(item)
            if png_path:item['png_generated']=True;item['png_path']='/generated/notices/'+png_path.name;changed=True
        elif item.get('png_path'):png_path=ROOT/'public'/str(item['png_path']).lstrip('/')
        if channels.get('app') and item_id not in existing and not item.get('app_published'):
            active.append({'id':item_id,'type':item.get('type','Aviso'),'title':item.get('title','Aviso importante'),'body':item.get('body') or item.get('message',''),'category':item.get('category','Todas'),'published_at':now.isoformat(),'publishAt':item.get('publish_at') or item.get('publishAt'),'png':item.get('png_path','')})
            existing.add(item_id);item['app_published']=True;changed=True
        if channels.get('facebook') and item.get('facebook_status')!='sent':
            has_credentials=bool(os.getenv('FACEBOOK_PAGE_ID') and os.getenv('FACEBOOK_PAGE_ACCESS_TOKEN'))
            last_attempt=parse_dt(item.get('facebook_last_attempt'))
            if (has_credentials or item.get('facebook_status')!='needs_configuration') and (last_attempt is None or now-last_attempt>=timedelta(hours=1)):
                st=post_facebook(item,png_path)
                item['facebook_status']=st
                if st!='needs_configuration':item['facebook_last_attempt']=now.isoformat()
                changed=True
        if not item.get('published_at'):
            item['published_at']=now.isoformat();item['status']='published';changed=True
    cutoff=now-timedelta(days=30)
    trimmed=[x for x in active if (parse_dt(x.get('published_at')) or now)>=cutoff]
    if len(trimmed)!=len(active):changed=True
    active=trimmed
    if changed:
        save(SCHEDULE,schedule);save(ACTIVE,active)
    return 0

if __name__=='__main__':sys.exit(main())
