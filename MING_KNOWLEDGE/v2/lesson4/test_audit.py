"""Regression checks for this supplement, not for the global v2 compiler."""
import csv
import importlib.util
import json
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('l4_audit_under_test', ROOT/'audit.py')
audit = importlib.util.module_from_spec(spec)
spec.loader.exec_module(audit)

class Lesson4AuditTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        for path in ROOT.iterdir():
            if path.suffix in ('.tsv', '.json'):
                shutil.copy2(path, self.root/path.name)
    def tearDown(self):
        self.tmp.cleanup()
    def write_rows(self, name, rows):
        with (self.root/name).open('w', encoding='utf-8', newline='') as handle:
            writer = csv.DictWriter(handle, fieldnames=list(rows[0]), delimiter='\t', lineterminator='\n')
            writer.writeheader()
            writer.writerows(rows)
    def test_valid_supplement_is_not_full_release(self):
        result = audit.validate(self.root)
        self.assertTrue(result['passed'], result['errors'])
        self.assertFalse(result['ready_for_chapter4'])
        self.assertFalse(result['global_v2_validated'])
    def test_63_rows_are_not_63_numbered_headwords(self):
        counts = audit.validate(self.root)['counts']
        self.assertEqual((counts['textbook_table_rows'], counts['textbook_numbered_headwords'], counts['textbook_subentries']), (63,56,7))
    def test_duplicate_vocabulary_row_rejected(self):
        rows = audit.load_tsv('textbook-vocabulary.tsv', self.root)
        rows.append(dict(rows[0]))
        self.write_rows('textbook-vocabulary.tsv', rows)
        self.assertFalse(audit.validate(self.root)['passed'])
    def test_broken_subentry_parent_rejected(self):
        rows = audit.load_tsv('textbook-vocabulary.tsv', self.root)
        next(r for r in rows if r['subentry'] != '0')['parent_hanzi'] = '不存在'
        self.write_rows('textbook-vocabulary.tsv', rows)
        self.assertFalse(audit.validate(self.root)['passed'])
    def test_worksheet_reading_must_not_be_silently_normalized(self):
        rows = audit.load_tsv('worksheet-rows.tsv', self.root)
        for row in rows:
            if row['hanzi'] == '差':
                row['pinyin_source'] = 'chà'
        self.write_rows('worksheet-rows.tsv', rows)
        self.assertFalse(audit.validate(self.root)['passed'])
    def test_source_specific_speakers_preserved(self):
        rows = audit.load_tsv('dialogue-turns.tsv', self.root)
        rows[0]['speaker_source'] = '丁力波'
        self.write_rows('dialogue-turns.tsv', rows)
        self.assertFalse(audit.validate(self.root)['passed'])
    def test_source_page_bounds_rejected(self):
        rows = audit.load_tsv('dialogue-turns.tsv', self.root)
        rows[0]['pdf_page'] = '999'
        self.write_rows('dialogue-turns.tsv', rows)
        self.assertFalse(audit.validate(self.root)['passed'])
    def test_manifest_counts_are_recomputed(self):
        manifest = audit.load_json('manifest.json', self.root)
        manifest['verified_scopes']['worksheet_rows'] = 999
        (self.root/'manifest.json').write_text(json.dumps(manifest), encoding='utf-8')
        self.assertFalse(audit.validate(self.root)['passed'])
    def test_physical_pages_include_duplicate_witness(self):
        pages = audit.page_ledger(self.root)
        self.assertEqual(len(pages), 122)
        copies = [p for p in pages if p['duplicate_of_pdf_page'] is not None]
        self.assertEqual(len(copies), 1)
        self.assertEqual((copies[0]['pdf_page'], copies[0]['duplicate_of_pdf_page']), (9,8))
        self.assertTrue(all(not p['full_page_literal_transcription_certified'] for p in pages))
    def test_clock_table_not_silently_reconciled_with_ppt(self):
        g = audit.load_json('grammar-source.json', self.root)
        row = next(r for r in g['records'] if r['id'] == 'GS-L4-BOOK-02')
        self.assertIn('两点零五分', row['examples_source'])
        self.assertNotIn('两点零五', row['examples_source'])
        self.assertNotIn('两点三刻', row['examples_source'])
    def test_documentary_pinyin_omission_remains_flagged(self):
        rows = audit.load_tsv('dialogue-turns.tsv', self.root)
        row = next(r for r in rows if r['dialogue_id'] == 'DLG-L4-PPT1-T1' and r['turn'] == '10')
        self.assertIn('练习', row['hanzi'])
        self.assertIn('liàn kǒuyǔ', row['pinyin_source'])
        self.assertTrue(any(i['id'] == 'L4-AUD-011' for i in audit.load_json('discrepancies.json', self.root)))
    def test_release_gate_fails_closed(self):
        p = subprocess.run([sys.executable, str(ROOT/'audit.py'), '--release-check'], capture_output=True, text=True)
        self.assertEqual(p.returncode, 3, p.stderr)
        self.assertFalse(json.loads(p.stdout)['ready_for_chapter4'])
    def test_exact_word_query_does_not_match_other_words(self):
        p = subprocess.run([sys.executable, str(ROOT/'audit.py'), '--word', '时间'], capture_output=True, text=True, check=True)
        result = json.loads(p.stdout)
        self.assertEqual(result['total'], 1)
        self.assertEqual(result['rows'][0]['source_id'], 'SRC-BOOK-04')

if __name__ == '__main__':
    unittest.main()
