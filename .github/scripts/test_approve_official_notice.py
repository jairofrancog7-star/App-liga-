"""Pruebas del botón manual: nunca necesitan la clave real ni publican avisos."""
import importlib.util
import json
import sys
import unittest
from datetime import datetime, timezone
from pathlib import Path

HERE=Path(__file__).resolve().parent
sys.path.insert(0,str(HERE))
SCRIPT=HERE/'approve_official_notice.py'
spec=importlib.util.spec_from_file_location('approve_notices_test',SCRIPT)
module=importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
from process_scheduled_notices import approved

SECRET='private-test-key-for-notices-never-used-in-production'
NOW=datetime(2026,10,10,20,0,tzinfo=timezone.utc)

def draft():
    return {'id':'jornada-12','title':'Cambio de cancha confirmado',
            'body':'Partido del domingo cambia de campo, confirmado por la Liga.',
            'category':'Intermedia','publishAt':'2026-11-01T20:00:00Z',
            'channels':{'app':True,'png':True}}

def sign(rows,**overrides):
    kwargs={'notice_id':'jornada-12','expected_title':'Cambio de cancha confirmado',
            'actor':'jairofrancog7-star','secret':SECRET,
            'confirmation':'AUTORIZAR AVISO OFICIAL','now':NOW}
    kwargs.update(overrides)
    return module.authorize(rows,**kwargs)

class OfficialNoticeApprovalTests(unittest.TestCase):
    def test_repository_scheduled_notices_is_valid_json_array(self):
        path=HERE.parents[1]/'public/data/scheduled-notices.json'
        rows=json.loads(path.read_text(encoding='utf8'))
        self.assertIsInstance(rows,list)

    def test_valid_review_produces_signature_without_publishing(self):
        item=sign([draft()])[0]
        self.assertTrue(item['approval']['signature'])
        self.assertEqual(item['approval']['by'],'jairofrancog7-star')
        self.assertNotIn('published_at',item)
        self.assertNotIn('app_published',item)
        import os
        previous=os.environ.get('LJR_OFFICIAL_NOTICE_APPROVAL_SECRET')
        try:
            os.environ['LJR_OFFICIAL_NOTICE_APPROVAL_SECRET']=SECRET
            self.assertTrue(approved(item))
            for path,value in [('title','Texto cambiado'),('body','Otro cuerpo'),('category','Primera'),('publishAt','2026-12-01T00:00:00Z')]:
                changed={**item,path:value}
                self.assertFalse(approved(changed),path)
            changed={**item,'approval':{**item['approval'],'by':'falso-presidente'}}
            self.assertFalse(approved(changed))
            changed={**item,'approval':{**item['approval'],'at':'2026-10-11T20:00:00+00:00'}}
            self.assertFalse(approved(changed))
        finally:
            if previous is None:os.environ.pop('LJR_OFFICIAL_NOTICE_APPROVAL_SECRET',None)
            else:os.environ['LJR_OFFICIAL_NOTICE_APPROVAL_SECRET']=previous

    def test_rejects_editor_or_fake_confirmation(self):
        for overrides in [
            {'actor':'otro-editor'},
            {'confirmation':'APROBAR'},
            {'expected_title':'Título inventado'},
            {'secret':''},
            {'notice_id':'../jornada-12'}
        ]:
            with self.subTest(overrides=overrides):
                with self.assertRaises(ValueError):sign([draft()],**overrides)

    def test_rejects_expired_and_duplicate(self):
        bad=draft();bad['publishAt']='2000-01-01T00:00:00Z'
        with self.assertRaises(ValueError):sign([bad])
        with self.assertRaises(ValueError):sign([draft(),draft()])
        published=draft();published['app_published']=True
        with self.assertRaises(ValueError):sign([published])

    def test_rejects_unsupported_channels_and_no_body(self):
        for channels in [{'app':True,'whatsapp':True},{'png':True},{'app':'true'}]:
            row=draft();row['channels']=channels
            with self.subTest(channels=channels):
                with self.assertRaises(ValueError):sign([row])
        row=draft();row['body']=''
        with self.assertRaises(ValueError):sign([row])

if __name__=='__main__':unittest.main()
