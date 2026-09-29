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
        self.root = Path(self.tmp.name)/'MING_KNOWLEDGE/v2/lesson4'
        self.root.mkdir(parents=True)
        shutil.copy2(ROOT.parents[1]/'SOURCE_AUTHORITY.json', self.root.parents[1]/'SOURCE_AUTHORITY.json')
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
    def test_current_pages_exclude_duplicate_and_history_preserves_it(self):
        pages = audit.page_ledger(self.root)
        self.assertEqual(len(pages), 121)
        self.assertFalse(any(p['duplicate_of_pdf_page'] is not None for p in pages))
        book = [p for p in pages if p['source_id'] == 'SRC-BOOK-04']
        self.assertEqual([p['printed_page'] for p in book], list(range(113,138)))
        history = audit.load_json('source-revisions.json', self.root)
        copies = [p for p in history['textbook_page_map'] if p['status'] == 'duplicate_removed_alias']
        self.assertEqual([(p['old_pdf_page'], p['current_pdf_page']) for p in copies], [(9,8)])
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
    def test_release_gate_requires_and_passes_integrated_closure(self):
        p = subprocess.run([sys.executable, str(ROOT/'audit.py'), '--release-check'], capture_output=True, text=True)
        self.assertEqual(p.returncode, 0, p.stderr)
        self.assertTrue(json.loads(p.stdout)['ready_for_chapter4'])
        self.assertTrue(json.loads(p.stdout)['global_validation']['passed'])
    def test_exact_word_query_does_not_match_other_words(self):
        p = subprocess.run([sys.executable, str(ROOT/'audit.py'), '--word', '时间'], capture_output=True, text=True, check=True)
        result = json.loads(p.stdout)
        self.assertEqual(result['total'], 1)
        self.assertEqual(result['rows'][0]['source_id'], 'SRC-BOOK-04')


    def test_corrected_filenames(self):
        m = audit.load_json('manifest.json', self.root)
        self.assertEqual(m['sources'][0]['filename'], 'Libro Basico 1 - Lección 4.pdf')
        self.assertEqual(m['sources'][1]['filename'], 'Libro de Ejercicios Basico 1 - Lección 4.pdf')
    def test_wrong_swapped_filename_rejected(self):
        m = audit.load_json('manifest.json', self.root)
        m['sources'][0]['filename'] = m['sources'][1]['filename']
        (self.root/'manifest.json').write_text(json.dumps(m))
        self.assertFalse(audit.validate(self.root)['passed'])
    def test_stale_hash_rejected(self):
        m = audit.load_json('manifest.json', self.root)
        m['sources'][0]['sha256'] = 'eb59814237cf5197919a787ef19e716554c894410ba9a3af57682a66d2234fbb'
        (self.root/'manifest.json').write_text(json.dumps(m))
        self.assertFalse(audit.validate(self.root)['passed'])
    def test_supplementary_vocabulary_relocated_without_text_changes(self):
        rows = audit.load_tsv('textbook-vocabulary.tsv', self.root)
        sup = [r for r in rows if r['list_id'] == 'L4-SUP']
        self.assertEqual(len(sup),17)
        self.assertEqual({(r['pdf_page'], r['printed_page']) for r in sup}, {('16','128')})
    def test_canonical_dialogues_are_book_only(self):
        rows = audit.selected_dialogue_rows(self.root, canonical_only=True)
        self.assertEqual(len(rows),27)
        self.assertTrue(all(r['source_id']=='SRC-BOOK-04' for r in rows))
        self.assertEqual(rows[0]['speaker_source'],'宋华')
    def test_secondary_dialogues_remain_auditable(self):
        rows = audit.selected_dialogue_rows(self.root)
        self.assertEqual(len(rows),54)
        secondary = [r for r in rows if not r['selected_for_chapter4']]
        self.assertEqual(len(secondary),27)
        self.assertEqual(secondary[0]['speaker_source'],'丁力波')
    def test_secondary_dialogue_cannot_be_selected_as_canonical(self):
        selection = audit.load_json('selection-policy.json',self.root)
        selection['canonical_dialogue_ids'][0]='DLG-L4-PPT1-T1'
        (self.root/'selection-policy.json').write_text(json.dumps(selection))
        self.assertFalse(audit.validate(self.root)['passed'])
    def test_contextual_readings_come_from_book(self):
        rows = audit.load_json('selection-policy.json',self.root)['contextual_reading_examples']
        self.assertEqual({r['hanzi']:r['pinyin_source'] for r in rows}, {'差':'chà','只':'zhǐ','时间':'shíjiān','意思':'yìsi'})
    def test_worksheet_reading_cannot_replace_selected_word(self):
        s=audit.load_json('selection-policy.json',self.root)
        s['contextual_reading_examples'][0]['pinyin_source']='chā'
        (self.root/'selection-policy.json').write_text(json.dumps(s))
        self.assertFalse(audit.validate(self.root)['passed'])
    def test_unsafe_pronunciation_fallback_rejected(self):
        path=self.root.parents[1]/'SOURCE_AUTHORITY.json'
        p=json.loads(path.read_text());p['worksheet_reading_to_contextual_pronunciation']=True
        path.write_text(json.dumps(p))
        self.assertFalse(audit.validate(self.root)['passed'])
    def test_canonical_cli(self):
        p=subprocess.run([sys.executable,str(ROOT/'audit.py'),'--canonical-dialogues','--limit','100'],capture_output=True,text=True,check=True)
        r=json.loads(p.stdout)
        self.assertEqual(r['total'],27)
        self.assertTrue(all(x['selected_for_chapter4'] for x in r['rows']))
    def test_grammar_locators_migrated(self):
        g=audit.load_json('grammar-source.json',self.root)
        clock=next(r for r in g['records'] if r['id']=='GS-L4-BOOK-02')
        self.assertEqual((clock['pdf_page'],clock['source_pages']),(9,[9]))
        temporal=next(r for r in g['records'] if r['id']=='GS-L4-BOOK-03')
        self.assertEqual(temporal['source_pages'],[10,11])

if __name__ == '__main__':
    unittest.main()
