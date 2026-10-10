#!/usr/bin/env python3
"""Firmar exclusivamente un aviso existente, por ejecución manual del propietario GitHub.

No publica, no envía notificaciones ni genera secretos.
La clave de firma solo debe estar en GitHub Actions Secrets.
"""
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path
from process_scheduled_notices import approval_signature, parse_dt

ROOT=Path(__file__).resolve().parents[2]
SCHEDULE=ROOT/'public/data/scheduled-notices.json'
OWNER='jairofrancog7-star'
CONFIRMATION='AUTORIZAR AVISO OFICIAL'

def authorize(rows, notice_id, expected_title, actor, secret, confirmation, now=None):
    """Devuelve nueva lista de avisos con exactamente una autorización verificada."""
    if actor!=OWNER:
        raise ValueError('Solo la cuenta principal autorizada de GitHub puede firmar avisos oficiales.')
    if confirmation!=CONFIRMATION:
        raise ValueError('Falta confirmación explícita de Presidencia.')
    if not isinstance(secret,str) or len(secret)<32:
        raise ValueError('Falta LJR_OFFICIAL_NOTICE_APPROVAL_SECRET en GitHub Actions Secrets.')
    if not isinstance(rows,list):
        raise ValueError('scheduled-notices.json debe contener una lista.')
    if not isinstance(notice_id,str) or len(notice_id)>90 or not notice_id.replace('-','').replace('_','').isalnum():
        raise ValueError('Identificador de aviso inválido.')
    matches=[(i,v) for i,v in enumerate(rows) if isinstance(v,dict) and v.get('id')==notice_id]
    if len(matches)!=1:
        raise ValueError('Debe existir exactamente un borrador con ese identificador.')
    index,original=matches[0]
    if original.get('title')!=expected_title or not str(expected_title).strip():
        raise ValueError('El título indicado no coincide con el borrador que vas a aprobar.')
    if len(str(original.get('body') or original.get('message') or '').strip())<15:
        raise ValueError('El aviso debe contener un mensaje oficial completo.')
    date=parse_dt(original.get('publish_at') or original.get('publishAt'))
    now=now or datetime.now(timezone.utc)
    if not date or date<=now:
        raise ValueError('Solo se puede aprobar un aviso con fecha futura.')
    if original.get('published_at') or original.get('app_published'):
        raise ValueError('Este aviso ya fue publicado.')
    channels=original.get('channels')
    if (not isinstance(channels,dict) or
        not set(channels).issubset({'app','png','facebook'}) or
        any(type(value) is not bool for value in channels.values()) or
        not any(channels.get(c) for c in ('app','facebook'))):
        raise ValueError('Los canales deben estar autorizados y contener App o Facebook.')
    result=[dict(item) if isinstance(item,dict) else item for item in rows]
    item=result[index]
    approval={'status':'approved','by':actor,'at':now.isoformat()}
    item['approval']=approval
    approval['signature']=approval_signature(item,secret)
    return result

def main():
    raw=SCHEDULE.read_text(encoding='utf8')
    try:
        items=json.loads(raw)
    except ValueError as exc:
        raise ValueError('scheduled-notices.json contiene JSON inválido.') from exc
    updated=authorize(
        items,
        os.environ.get('NOTICE_ID',''),
        os.environ.get('EXPECTED_TITLE',''),
        os.environ.get('GITHUB_ACTOR',''),
        os.environ.get('LJR_OFFICIAL_NOTICE_APPROVAL_SECRET',''),
        os.environ.get('APPROVAL_CONFIRMATION','')
    )
    # Crear temporal y reemplazar solo después de todas las validaciones.
    temporary=SCHEDULE.with_suffix('.json.tmp')
    temporary.write_text(json.dumps(updated,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
    temporary.replace(SCHEDULE)
    print('Borrador firmado para publicación futura, sin envío inmediato.')

if __name__=='__main__':
    try:main()
    except (ValueError,OSError) as e:
        print('Autorización rechazada: '+str(e),file=sys.stderr)
        sys.exit(1)
