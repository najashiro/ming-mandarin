"""Regression tests for the separate, explicitly authorized Spanish layer."""
from __future__ import annotations
import copy
import json
import tempfile
import unittest
from pathlib import Path
from query import CACHE, ensure_cache, read_table
from translations_ming import (
    ROOT, apply_translations, check_public, dependency_paths,
    load_batch, read_translations, source_spanish, spanish_for_display,
)


class TranslationUnitTests(unittest.TestCase):
    def setUp(self):
        self.config = {'batch_id':'test', 'method':'model_generated_translation_of_registered_chinese',
                       'review_status':'model_checked_not_independently_human_reviewed',
                       'internal_only_vocabulary':[], 'notes':{}}
        self.row = {'id':'PH-test', 'hanzi':'真厉害！', 'pinyin':'zhēn lì hài!',
                    'spanish_variants':[], 'kinds':['dialogue_example'], 'lessons':[2]}

    def test_source_spanish_has_priority(self):
        row = dict(self.row, spanish_variants=[{'value':'Texto del material.', 'evidence_id':'E-1'}],
                   traduccion_ming='Texto editorial.')
        self.assertEqual(spanish_for_display(row), 'Texto del material.')

    def test_empty_variants_do_not_mask_fallback(self):
        row = dict(self.row, spanish_variants=[{'value':' '}, {'value':None}], traduccion_ming='¡Qué impresionante!')
        self.assertEqual(spanish_for_display(row), '¡Qué impresionante!')

    def test_missing_both_returns_none(self):
        self.assertIsNone(spanish_for_display(self.row))

    def test_translation_does_not_change_source_fields(self):
        rows = [copy.deepcopy(self.row)]
        before = copy.deepcopy(rows[0])
        apply_translations(rows, {'真厉害！':'¡Qué impresionante!'}, 'phrases', self.config)
        for key, value in before.items():
            self.assertEqual(rows[0][key], value, key)
        self.assertEqual(rows[0]['traduccion_ming'], '¡Qué impresionante!')
        self.assertEqual(rows[0]['spanish_display'], '¡Qué impresionante!')
        self.assertEqual(rows[0]['spanish_variants'], [])

    def test_unknown_chinese_is_rejected(self):
        with self.assertRaisesRegex(ValueError, 'unregistered'):
            apply_translations([self.row], {'另一句话':'Otra frase.'}, 'phrases', self.config)

    def test_ambiguous_duplicate_source_text_is_rejected(self):
        with self.assertRaisesRegex(ValueError, 'non-unique'):
            apply_translations([self.row, dict(self.row, id='PH-other')], {}, 'phrases', self.config)

    def test_counterexample_is_not_promoted(self):
        row = dict(self.row, kinds=['counterexample'])
        apply_translations([row], {'真厉害！':'Glosa de control.'}, 'phrases', self.config)
        self.assertTrue(row['traduccion_ming_meta']['internal_only'])
        self.assertEqual(row['kinds'], ['counterexample'])
        self.assertIsNone(spanish_for_display(row))

    def test_malformed_vocabulary_fragment_is_internal(self):
        row = {'id':'v-哥哥，还', 'hanzi':'哥哥，还', 'spanish_variants':[]}
        config = dict(self.config, internal_only_vocabulary=['哥哥，还'])
        apply_translations([row], {'哥哥，还':'hermano mayor, además…'}, 'vocabulary', config)
        self.assertEqual(row['traduccion_ming_meta']['usage'], 'segmentation_fragment')
        self.assertIsNone(spanish_for_display(row))

    def test_templates_retain_their_hole(self):
        row = dict(self.row, hanzi='我喜欢……')
        apply_translations([row], {'我喜欢……':'Me gusta…'}, 'phrases', self.config)
        self.assertEqual(row['hanzi'], '我喜欢……')
        self.assertEqual(row['traduccion_ming_meta']['usage'], 'template')
        self.assertEqual(row['spanish_display'], 'Me gusta…')

    def test_apply_is_idempotent(self):
        rows = [copy.deepcopy(self.row)]
        first = apply_translations(rows, {'真厉害！':'¡Qué impresionante!'}, 'phrases', self.config)
        snapshot = copy.deepcopy(rows)
        second = apply_translations(rows, {'真厉害！':'¡Qué impresionante!'}, 'phrases', self.config)
        self.assertEqual(rows, snapshot)
        self.assertEqual(first, second)

    def test_tsv_rejects_empty_translation(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / 't.tsv'
            path.write_text('hanzi\ttraduccion_ming\n真\t\n', encoding='utf-8')
            with self.assertRaisesRegex(ValueError, 'empty'):
                read_translations(path)

    def test_tsv_rejects_duplicate(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / 't.tsv'
            path.write_text('hanzi\ttraduccion_ming\n真\treal\n真\tverdadero\n', encoding='utf-8')
            with self.assertRaisesRegex(ValueError, 'duplicate'):
                read_translations(path)

    def test_path_escape_is_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            config = {'schema_version':'1.0.0', 'files':{'vocabulary':['../escape.tsv'], 'phrases':[]}}
            (root / 'translations-ming.json').write_text(json.dumps(config), encoding='utf-8')
            with self.assertRaisesRegex(ValueError, 'invalid translation path'):
                dependency_paths(root)

    def test_all_translation_bytes_are_cache_dependencies(self):
        files = dependency_paths()
        self.assertEqual(len([p for p in files if p.suffix == '.tsv']), 4)
        self.assertIn(ROOT / 'translations-ming.json', files)
        self.assertIn(ROOT / 'translations_ming.py', files)


class TranslationCorpusTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        ensure_cache()
        cls.words = read_table('vocabulary')
        cls.phrases = read_table('phrases')
        cls.summary = read_table('translations_ming_summary')

    def test_authorized_batch_counts_and_exact_targets(self):
        _, batch = load_batch()
        self.assertEqual(len(batch['vocabulary']), 117)
        self.assertEqual(len(batch['phrases']), 590)
        self.assertEqual(len(read_table('translations_ming')), 707)
        for table, rows in [('vocabulary', self.words), ('phrases', self.phrases)]:
            by_text = {r['hanzi']:r for r in rows}
            for hanzi, value in batch[table].items():
                self.assertEqual(by_text[hanzi]['traduccion_ming'], value)
                # This first batch targets records missing documentary Spanish.
                self.assertIsNone(source_spanish(by_text[hanzi]))

    def test_documentary_counts_and_evidence_remain_separate(self):
        self.assertEqual(sum(bool(source_spanish(r)) for r in self.words), 229)
        self.assertEqual(sum(bool(source_spanish(r)) for r in self.phrases), 53)
        for table in ['vocabulary_evidence', 'phrase_evidence']:
            for row in read_table(table):
                self.assertNotIn('traduccion_ming', row)
                self.assertNotIn('spanish_display', row)

    def test_missing_translations_are_accounted_for(self):
        for counts in self.summary['counts'].values():
            self.assertEqual(counts['missing_any_translation_ids'], [])
        self.assertEqual(self.summary['counts']['vocabulary']['internal_only_records'], 9)
        self.assertEqual(self.summary['counts']['phrases']['internal_only_records'], 8)
        self.assertEqual(self.summary['counts']['phrases']['templates_with_ellipsis_preserved'], 3)

    def test_zhen_regression(self):
        by_text = {r['hanzi']:r for r in self.phrases}
        self.assertEqual(spanish_for_display(by_text['真厉害！']), '¡Qué impresionante!')
        self.assertEqual(spanish_for_display(by_text['这张照片真漂亮！']), '¡Esta foto es realmente bonita!')
        self.assertEqual(by_text['真厉害！']['spanish_variants'], [])
        self.assertEqual(by_text['真厉害！']['pinyin'], 'zhēn lì hài!')
        self.assertEqual(by_text['真厉害！']['id'], 'PH-bc51241bebeba332')

    def test_existing_documentary_vocabulary_wins(self):
        word = next(r for r in self.words if r['id'] == 'v-马马虎虎')
        self.assertIsNone(word['traduccion_ming'])
        self.assertEqual(spanish_for_display(word), source_spanish(word))
        self.assertTrue(any(r.get('lesson') == 1 and r.get('list_type') == 'supplementary_vocabulary' for r in word['curriculum_links']))

    def test_pinyin_is_not_generated_or_overwritten(self):
        self.assertEqual(sum(bool(r.get('pinyin')) for r in self.words), 267)
        self.assertEqual(sum(bool(r.get('pinyin_variants')) for r in self.phrases), 202)
        self.assertIsNone(next(r for r in self.words if r['id'] == 'v-可以')['pinyin'])

    def test_review_not_misrepresented(self):
        self.assertFalse(self.summary['independent_human_review'])
        self.assertEqual(self.summary['paid_api_calls'], 0)
        for row in read_table('translations_ming'):
            self.assertEqual(row['review_status'], 'model_checked_not_independently_human_reviewed')

    def test_public_export_has_only_resolved_spanish(self):
        public_path = ROOT.parents[1] / 'data/corpus-v21-public.json'
        public = json.loads(public_path.read_text(encoding='utf-8'))
        summary = check_public(CACHE, public)
        self.assertEqual(summary['phrases_with_spanish'], summary['phrases'])
        self.assertEqual(summary['dialogue_turns_with_spanish'], summary['dialogue_turns'])

    def test_public_provenance_leak_is_rejected(self):
        public = json.loads((ROOT.parents[1] / 'data/corpus-v21-public.json').read_text(encoding='utf-8'))
        public['phrases'][0]['traduccion_ming'] = 'No debe salir.'
        with self.assertRaisesRegex(ValueError, 'provenance leaked'):
            check_public(CACHE, public)


if __name__ == '__main__':
    unittest.main()
