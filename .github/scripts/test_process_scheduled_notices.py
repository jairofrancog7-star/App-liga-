#!/usr/bin/env python3
"""Pruebas sin credenciales de automatización de avisos públicos."""
import importlib.util
import json
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
        module.SCHEDULE=root/"scheduled.json"
        module.ACTIVE=root/"active.json"
        module.OUT=root/"generated"
        self.addCleanup(self.restore)
    def restore(self):
        module.SCHEDULE,module.ACTIVE,module.OUT=self.old
    def load(self,file):
        return json.loads(file.read_text(encoding="utf8"))
    def write(self,file,items):
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
