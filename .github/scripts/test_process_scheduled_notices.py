#!/usr/bin/env python3
"""Pruebas sin credenciales de automatización de avisos públicos."""
import importlib.util
import json
import os
import tempfile
import unittest
from pathlib import Path

SCRIPT=Path(__file__).with_name("process_scheduled_notices.py")
spec=importlib.util.spec_from_file_location("ljr_notices", SCRIPT)
module=importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

class ScheduledNoticeTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        root=Path(self.tmp.name)
        self.old=(module.SCHEDULE,module.ACTIVE,module.OUT)
        self.prev_secret=os.environ.get("LJR_OFFICIAL_NOTICE_APPROVAL_SECRET")
        os.environ["LJR_OFFICIAL_NOTICE_APPROVAL_SECRET"]="test-secret-for-approved-notices-not-for-production"
        self.addCleanup(self.restore_secret)
        module.SCHEDULE=root/"scheduled.json"
        module.ACTIVE=root/"active.json"
        module.OUT=root/"generated"
        self.addCleanup(self.restore)
    def restore(self):
        module.SCHEDULE,module.ACTIVE,module.OUT=self.old
    def restore_secret(self):
        if self.prev_secret is None:
            os.environ.pop("LJR_OFFICIAL_NOTICE_APPROVAL_SECRET",None)
        else:
            os.environ["LJR_OFFICIAL_NOTICE_APPROVAL_SECRET"]=self.prev_secret
    def load(self,file):
        return json.loads(file.read_text(encoding="utf8"))
    def write(self,file,items):
        for item in items:
            a=item.get("approval") or {}
            if a.get("status")=="approved" and a.get("by") and "signature" not in a:
                a["signature"]=module.approval_signature(item,os.environ["LJR_OFFICIAL_NOTICE_APPROVAL_SECRET"])
        file.write_text(json.dumps(items,ensure_ascii=False),encoding="utf8")
    def test_only_due_announcements_and_idempotent_publishing(self):
        self.write(module.SCHEDULE,[
            {"id":"jornada-33","approval":{"status":"approved","by":"presidencia-revisada","at":"2026-10-10T12:00:00Z"},"title":"Aviso verificado","body":"Cancha municipal 3","category":"Veteranos 35+","publishAt":"2000-01-01T00:00:00Z","channels":{"app":True,"png":False,"facebook":False}},
            {"id":"futura-1","title":"Aviso futuro","publishAt":"2999-01-01T00:00:00Z","channels":{"app":True}},
            {"id":"../escape","title":"Entrada no válida","publishAt":"2000-01-01T00:00:00Z"}
        ])
        self.write(module.ACTIVE,[])
        self.assertEqual(module.main(),0)
        self.assertEqual(module.main(),0)
        active=self.load(module.ACTIVE)
        self.assertEqual(len(active),1)
        self.assertEqual(active[0]["id"],"jornada-33")
        self.assertEqual(active[0]["category"],"Veteranos 35+")
        self.assertTrue(self.load(module.SCHEDULE)[0]["app_published"])
    def test_due_notice_without_approval_is_never_published(self):
        self.write(module.SCHEDULE,[
            {"id":"borrador-1","title":"No autorizado","publishAt":"2000-01-01T00:00:00Z",
             "channels":{"app":True,"facebook":True,"png":True}},
            {"id":"fake-1","title":"Autoaprobación insuficiente","approval":{"status":"approved","by":"","at":"2026-10-10T12:00:00Z"},
             "publishAt":"2000-01-01T00:00:00Z","channels":{"app":True}},
        ])
        self.write(module.ACTIVE,[])
        self.assertEqual(module.main(),0)
        self.assertEqual(self.load(module.ACTIVE),[])
        self.assertFalse(module.OUT.exists())
        self.assertFalse(self.load(module.SCHEDULE)[0].get("published_at"))

    def test_modified_notice_invalidates_previous_approval_signature(self):
        item={"id":"signed-1","title":"Aviso aprobado","body":"Texto validado",
              "publishAt":"2000-01-01T00:00:00Z","channels":{"app":True},
              "approval":{"status":"approved","by":"presidencia","at":"2026-10-10T12:00:00Z"}}
        self.write(module.SCHEDULE,[item])
        stored=self.load(module.SCHEDULE)
        stored[0]["title"]="Texto manipulado"
        module.SCHEDULE.write_text(json.dumps(stored),encoding="utf8")
        self.write(module.ACTIVE,[])
        module.main()
        self.assertEqual(self.load(module.ACTIVE),[])

    def test_without_private_key_no_publication(self):
        self.write(module.SCHEDULE,[{"id":"valid-signed","title":"Aviso validado",
             "publishAt":"2000-01-01T00:00:00Z","channels":{"app":True},
             "approval":{"status":"approved","by":"presidencia","at":"2026-10-10T12:00:00Z"}}])
        self.write(module.ACTIVE,[])
        os.environ.pop("LJR_OFFICIAL_NOTICE_APPROVAL_SECRET",None)
        module.main()
        self.assertEqual(self.load(module.ACTIVE),[])

    def test_invalid_json_does_not_publish_or_silently_reset(self):
        module.SCHEDULE.write_text('[]\\n',encoding='utf8')
        self.write(module.ACTIVE,[])
        with self.assertRaises(ValueError):module.main()
        self.assertEqual(self.load(module.ACTIVE),[])
        module.SCHEDULE.write_text('{"items":[]}',encoding='utf8')
        with self.assertRaises(ValueError):module.main()

    def test_prunes_expired_even_if_there_are_no_due_announcements(self):
        self.write(module.SCHEDULE,[])
        self.write(module.ACTIVE,[{"id":"old","published_at":"2000-01-01T00:00:00+00:00"}])
        self.assertEqual(module.main(),0)
        self.assertEqual(self.load(module.ACTIVE),[])
    def test_already_published_does_not_reappear_after_expiring(self):
        self.write(module.SCHEDULE,[{"id":"retired","approval":{"status":"approved","by":"presidencia-revisada","at":"2026-10-10T12:00:00Z"},"title":"Una vez","app_published":True,"published_at":"2000-01-01T00:00:00Z","publishAt":"2000-01-01T00:00:00Z","channels":{"app":True,"png":False,"facebook":False}}])
        self.write(module.ACTIVE,[])
        module.main()
        self.assertEqual(self.load(module.ACTIVE),[])

if __name__=="__main__":
    unittest.main()
