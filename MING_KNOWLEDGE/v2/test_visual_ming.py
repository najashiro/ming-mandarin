"""Visual editorial decisions must not rewrite source content or imply ready assets."""
from __future__ import annotations
import copy
import csv
import json
import tempfile
import unittest
from pathlib import Path
from query import CACHE, ensure_cache, read_table
from visual_ming import (COLUMNS, MODES, PUBLIC_FIELDS, ROOT, apply_classifications,
                         augment_public, check_public, dependency_paths, is_published_word,
                         load_batch, public_visual, read_classifications, report_documents, validate_visual)


def cat_word():
    return {'id': 'v-猫', 'hanzi': '猫', 'pinyin': 'māo', 'spanish': 'gato',
            'pinyin_variants': [{'value': 'māo'}], 'spanish_variants': [{'value': 'gato'}],
            'lessons': [3], 'curriculum_links': [{'lesson': 3, 'role': 'classroom_extension'}],
            'example_phrase_ids': ['PH-cat'], 'phrase_ids': ['PH-cat']}


def cat_entry():
    return {'vocab_id': 'v-猫', 'hanzi': '猫', 'visual_mode': 'literal_photo',
            'image_support': True, 'image_quiz_eligible': True, 'ambiguity_risk': 'low',
            'notes': 'Animal gato; no nombre propio.'}


class VisualUnitTests(unittest.TestCase):
    def setUp(self):
        self.visual = {k: v for k, v in cat_entry().items() if k not in {'vocab_id', 'hanzi'}}

    def test_valid_classification(self):
        validate_visual(self.visual)

    def test_invalid_mode_and_risk(self):
        for field, value in [('visual_mode', 'random'), ('ambiguity_risk', 'medium-high')]:
            with self.subTest(field=field), self.assertRaises(ValueError):
                validate_visual(dict(self.visual, **{field: value}))

    def test_flags_must_be_boolean_not_truthy(self):
        for value in ('false', 'true', 0, 1, None):
            with self.subTest(value=value), self.assertRaisesRegex(ValueError, 'booleans'):
                validate_visual(dict(self.visual, image_support=value))

    def test_context_is_not_image_quiz(self):
        for mode in ('visual_grammar', 'phrase_context', 'none'):
            with self.subTest(mode=mode), self.assertRaises(ValueError):
                validate_visual(dict(self.visual, visual_mode=mode))

    def test_high_risk_is_not_image_quiz(self):
        with self.assertRaisesRegex(ValueError, 'ambiguous'):
            validate_visual(dict(self.visual, ambiguity_risk='high'))

    def test_none_has_no_own_image(self):
        value = dict(self.visual, visual_mode='none', image_support=False, image_quiz_eligible=False, ambiguity_risk='high')
        validate_visual(value)
        with self.assertRaises(ValueError):
            validate_visual(dict(value, image_support=True))

    def test_no_design_generation_or_asset_fields(self):
        for key in ('width', 'height', 'aspect_ratio', 'layout', 'prompt', 'asset', 'approved', 'color'):
            with self.subTest(key=key), self.assertRaisesRegex(ValueError, 'fields'):
                validate_visual(dict(self.visual, **{key: 'not allowed'}))

    def test_rationale_is_required(self):
        for text in ('', '   ', 'two\nlines'):
            with self.subTest(text=text), self.assertRaises(ValueError):
                validate_visual(dict(self.visual, notes=text))

    def test_projection_omits_notes(self):
        value = public_visual(self.visual)
        self.assertEqual(set(value), set(PUBLIC_FIELDS))
        self.assertNotIn('notes', value)
        validate_visual(value, public=True)

    def test_public_notes_rejected(self):
        with self.assertRaisesRegex(ValueError, 'fields'):
            validate_visual(self.visual, public=True)

    def test_apply_preserves_every_existing_field(self):
        words = [cat_word()]
        before = copy.deepcopy(words)
        apply_classifications(words, {'v-猫': cat_entry()})
        self.assertEqual({k: v for k, v in words[0].items() if k != 'visual_ming'}, before[0])
        self.assertEqual(words[0]['visual_ming'], self.visual)

    def test_apply_is_idempotent(self):
        words = [cat_word()]
        first = apply_classifications(words, {'v-猫': cat_entry()})
        before = copy.deepcopy(words)
        second = apply_classifications(words, {'v-猫': cat_entry()})
        self.assertEqual(first, second)
        self.assertEqual(words, before)

    def test_missing_word_is_error_not_automatic_none(self):
        with self.assertRaisesRegex(ValueError, 'coverage mismatch'):
            apply_classifications([cat_word()], {})

    def test_unknown_word_is_error(self):
        with self.assertRaisesRegex(ValueError, 'coverage mismatch'):
            apply_classifications([cat_word()], {'v-猫': cat_entry(), 'v-unknown': cat_entry()})

    def test_wrong_text_is_error(self):
        with self.assertRaisesRegex(ValueError, 'different text'):
            apply_classifications([cat_word()], {'v-猫': dict(cat_entry(), hanzi='狗')})

    def test_duplicate_words_are_error(self):
        with self.assertRaisesRegex(ValueError, 'duplicate'):
            apply_classifications([cat_word(), cat_word()], {'v-猫': cat_entry()})

    def test_internal_fragment_is_not_promoted(self):
        fragment = dict(cat_word(), id='v-哥哥，还', hanzi='哥哥，还', traduccion_ming_meta={'internal_only': True})
        words = [cat_word(), fragment]
        apply_classifications(words, {'v-猫': cat_entry()})
        self.assertNotIn('visual_ming', fragment)
        self.assertFalse(is_published_word(fragment))

    def test_no_image_does_not_hide_eligible_word(self):
        entry = dict(cat_entry(), visual_mode='none', image_support=False, image_quiz_eligible=False, ambiguity_risk='high')
        words = [cat_word()]
        apply_classifications(words, {'v-猫': entry})
        self.assertTrue(is_published_word(words[0]))

    def test_tsv_validation(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / 'vocabulary.tsv'
            with path.open('w', encoding='utf-8', newline='') as stream:
                writer = csv.writer(stream, delimiter='\t', lineterminator='\n')
                writer.writerow(COLUMNS)
                writer.writerow(['v-猫', '猫', 'literal_photo', 'true', 'true', 'low', 'Animal.'])
            self.assertTrue(read_classifications(path)['v-猫']['image_support'])
            original = path.read_text(encoding='utf-8')
            for invalid in (original + original.splitlines()[-1] + '\n', original.replace('v-猫', 'v-狗'), original.replace('\ttrue\t', '\tyes\t', 1)):
                path.write_text(invalid, encoding='utf-8')
                with self.assertRaises(ValueError): read_classifications(path)

    def test_path_escape_is_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            config = {'schema_version': '1.0.0', 'scope': 'published_vocabulary_only',
                      'method': 'model_editorial_semantic_classification', 'review_status': 'model_classified_not_image_validated',
                      'files': ['../outside.tsv']}
            (root / 'visual-ming.json').write_text(json.dumps(config), encoding='utf-8')
            with self.assertRaisesRegex(ValueError, 'invalid classification path'): dependency_paths(root)


class VisualCorpusTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        ensure_cache()
        cls.words = read_table('vocabulary')
        cls.by_id = {r['id']: r for r in cls.words}
        cls.summary = read_table('visual_ming_summary')
        cls.public = json.loads((ROOT.parents[1] / 'data/corpus-v21-public.json').read_text(encoding='utf-8'))

    def test_complete_coverage_and_counts(self):
        _, entries = load_batch()
        public_ids = {r['id'] for r in self.public['vocabulary']}
        self.assertEqual(set(entries), public_ids)
        self.assertEqual(self.summary['classified_vocabulary'], len(public_ids))
        self.assertEqual(sum(self.summary['counts_by_mode'].values()), len(public_ids))
        self.assertEqual(self.summary['image_quiz_candidates'] + self.summary['support_only'] + self.summary['without_own_image'], len(public_ids))
        self.assertEqual(self.summary['unclassified_published_ids'], [])

    def test_reference_cases(self):
        cases = {'猫': ('literal_photo', True), '狗': ('literal_photo', True), '米饭': ('literal_photo', True),
                 '咖啡': ('literal_photo', True), '吃': ('action_scene', True), '喝': ('action_scene', True),
                 '我': ('concept_scene', True), '你': ('concept_scene', True), '他': ('concept_scene', False),
                 '她': ('concept_scene', False), '和': ('visual_grammar', False), '只': ('visual_grammar', False),
                 '口': ('visual_grammar', False), '张': ('visual_grammar', False), '个': ('visual_grammar', False),
                 '真': ('phrase_context', False), '很': ('phrase_context', False), '太': ('phrase_context', False),
                 '都': ('phrase_context', False), '也': ('phrase_context', False), '吗': ('none', False),
                 '的': ('none', False), '呢': ('none', False), '了': ('none', False), '不': ('none', False)}
        for hanzi, (mode, quiz) in cases.items():
            with self.subTest(hanzi=hanzi):
                value = self.by_id['v-' + hanzi]['visual_ming']
                self.assertEqual((value['visual_mode'], value['image_quiz_eligible']), (mode, quiz))

    def test_names_languages_and_idioms_are_not_literal(self):
        for hanzi in ('马大为', '王', '陈', '梅西', '成龙'):
            with self.subTest(hanzi=hanzi): self.assertEqual(self.by_id['v-' + hanzi]['visual_ming']['visual_mode'], 'none')
        for hanzi in ('汉语', '英语', '马马虎虎', '死', '上'):
            with self.subTest(hanzi=hanzi): self.assertEqual(self.by_id['v-' + hanzi]['visual_ming']['visual_mode'], 'phrase_context')
        self.assertIn('perro', self.by_id['v-约翰']['visual_ming']['notes'])

    def test_all_rationales_are_internal(self):
        for word in self.words:
            if is_published_word(word): validate_visual(word['visual_ming'])
        for row in self.public['vocabulary']:
            validate_visual(row['visual_ming'], public=True)
            self.assertNotIn('notes', row['visual_ming'])

    def test_no_source_evidence_is_classified(self):
        for table in ('vocabulary_evidence', 'phrase_evidence', 'hanzi_evidence'):
            for row in read_table(table): self.assertNotIn('visual_ming', row)
        for row in read_table('phrases'): self.assertNotIn('visual_ming', row)

    def test_public_checks(self):
        result = check_public(CACHE, self.public)
        self.assertEqual(result['classified_vocabulary'], len(self.public['vocabulary']))
        self.assertTrue(result['notes_not_exposed'])

    def test_public_changed_classification_rejected(self):
        public = copy.deepcopy(self.public)
        row = next(r for r in public['vocabulary'] if r['id'] == 'v-猫')
        row['visual_ming']['image_quiz_eligible'] = False
        with self.assertRaisesRegex(ValueError, 'incorrect public'): check_public(CACHE, public)

    def test_public_added_note_rejected(self):
        public = copy.deepcopy(self.public)
        public['vocabulary'][0]['visual_ming']['notes'] = 'Editorial only.'
        with self.assertRaises(ValueError): check_public(CACHE, public)

    def test_augmentation_changes_only_visual_field(self):
        before = copy.deepcopy(self.public)
        for row in before['vocabulary']: row.pop('visual_ming')
        after = augment_public(copy.deepcopy(before), CACHE)
        for row in after['vocabulary']: row.pop('visual_ming')
        self.assertEqual(before, after)

    def test_global_cat_examples_preserved(self):
        self.assertEqual(len(self.by_id['v-猫']['example_phrase_ids']), 3)
        self.assertEqual(self.by_id['v-猫']['pinyin'], 'māo')
        self.assertEqual(self.by_id['v-猫']['spanish'], 'gato')

    def test_notes_and_data_are_cache_dependencies(self):
        names = {p.name for p in dependency_paths()}
        self.assertTrue({'visual_ming.py', 'visual-ming.json', 'vocabulary.tsv'} <= names)

    def test_report_is_deterministic_and_complete(self):
        one = report_documents(CACHE, self.public)
        two = report_documents(CACHE, self.public)
        self.assertEqual(one, two)
        report = json.loads(one[0])
        self.assertEqual(len(report['entries']), len(self.public['vocabulary']))
        self.assertEqual(set(report['counts_by_mode']), set(MODES))

    def test_no_image_approval_or_external_review_claimed(self):
        self.assertEqual(self.summary['images_generated'], 0)
        self.assertEqual(self.summary['paid_api_calls'], 0)
        self.assertFalse(self.summary['independent_human_review'])
        self.assertEqual(self.summary['review_status'], 'model_classified_not_image_validated')


if __name__ == '__main__':
    unittest.main()
