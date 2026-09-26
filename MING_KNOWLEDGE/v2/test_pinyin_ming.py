"""Regressions for authorized pinyin and explicitly composed global examples."""
from __future__ import annotations
import copy
import json
import tempfile
import unittest
from pathlib import Path
from query import CACHE, ROOT, ensure_cache, read_table
from pinyin_ming import (apply_pinyin, check_public, dependency_paths, internal_only,
                         load_batch, pinyin_for_display, read_pinyin, source_pinyin, validate_reading)
from lexical_examples import build_example_links, eligible_phrase, validate_compositions


class PinyinUnitTests(unittest.TestCase):
    def setUp(self):
        self.row = {'id':'PH-cat', 'hanzi':'一只猫', 'pinyin':None, 'pinyin_variants':[],
                    'spanish_display':'Un gato.', 'kinds':['example'], 'lessons':[3], 'vocab_ids':['v-猫']}
        self.config = {'batch_id':'test', 'method':'model_prepared_reading_of_exact_registered_chinese',
                       'review_status':'model_checked_not_independently_human_reviewed', 'notes':{}}

    def test_source_has_priority(self):
        row = dict(self.row, pinyin_variants=[{'value':'yī zhī māo', 'evidence_id':'E'}], pinyin_ming='Yì zhī māo')
        self.assertEqual(pinyin_for_display(row), 'yī zhī māo')

    def test_whitespace_source_does_not_mask_fallback(self):
        row = dict(self.row, pinyin=' ', pinyin_variants=[{'value':' '}], pinyin_ming='Yì zhī māo')
        self.assertEqual(pinyin_for_display(row), 'Yì zhī māo')

    def test_missing_both_is_none(self):
        self.assertIsNone(pinyin_for_display(self.row))

    def test_original_fields_are_untouched(self):
        row, before = copy.deepcopy(self.row), copy.deepcopy(self.row)
        apply_pinyin([row], {'一只猫':'Yì zhī māo'}, 'phrases', self.config)
        for key, value in before.items(): self.assertEqual(row[key], value, key)
        self.assertIsNone(row['pinyin'])
        self.assertEqual(row['pinyin_variants'], [])
        self.assertEqual(row['pinyin_display'], 'Yì zhī māo')

    def test_idempotent(self):
        rows = [copy.deepcopy(self.row)]
        first = apply_pinyin(rows, {'一只猫':'Yì zhī māo'}, 'phrases', self.config)
        snapshot = copy.deepcopy(rows)
        self.assertEqual(first, apply_pinyin(rows, {'一只猫':'Yì zhī māo'}, 'phrases', self.config))
        self.assertEqual(rows, snapshot)

    def test_unknown_text_rejected(self):
        with self.assertRaisesRegex(ValueError, 'unregistered'):
            apply_pinyin([self.row], {'新句子':'Xīn jùzi'}, 'phrases', self.config)

    def test_duplicate_source_rejected(self):
        with self.assertRaisesRegex(ValueError, 'non-unique'):
            apply_pinyin([self.row, dict(self.row, id='PH-other')], {}, 'phrases', self.config)

    def test_counterexample_not_promoted(self):
        with self.assertRaisesRegex(ValueError, 'ineligible'):
            apply_pinyin([dict(self.row, kinds=['counterexample'])], {'一只猫':'Yì zhī māo'}, 'phrases', self.config)

    def test_internal_fragment_not_promoted(self):
        row = dict(self.row, traduccion_ming_meta={'internal_only':True})
        with self.assertRaisesRegex(ValueError, 'ineligible'):
            apply_pinyin([row], {'一只猫':'Yì zhī māo'}, 'vocabulary', self.config)

    def test_template_not_completed(self):
        row = dict(self.row, hanzi='我喜欢……')
        apply_pinyin([row], {'我喜欢……':'Wǒ xǐhuan…'}, 'phrases', self.config)
        self.assertEqual(row['hanzi'], '我喜欢……')
        self.assertTrue(row['pinyin_ming_meta']['template'])
        with self.assertRaisesRegex(ValueError, 'hole'):
            apply_pinyin([row], {'我喜欢……':'Wǒ xǐhuan māo'}, 'phrases', self.config)

    def test_reject_unread_chinese_or_empty_or_digits(self):
        for text in ['', ' ', 'Yì 只 māo', 'Wǒ 18 suì', 'Yì\nmāo']:
            with self.subTest(text=text), self.assertRaises(ValueError): validate_reading(text)

    def test_tsv_reject_duplicate(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / 'test.tsv'
            path.write_text('hanzi\tpinyin_ming\n猫\tmāo\n猫\tmāo\n', encoding='utf-8')
            with self.assertRaisesRegex(ValueError, 'duplicate'): read_pinyin(path)

    def test_dependency_path_escape(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / 'pinyin-ming.json').write_text(json.dumps({'schema_version':'1.0.0', 'files':{'vocabulary':['../escape.tsv'], 'phrases':[]}}), encoding='utf-8')
            with self.assertRaisesRegex(ValueError, 'invalid pinyin path'): dependency_paths(root)


class CompositionUnitTests(unittest.TestCase):
    def setUp(self):
        self.words = [{'id':'v-'+text, 'hanzi':text} for text in ['小','猫','小猫','熊猫','小小猫']]
        self.phrases = [dict(id=pid, hanzi=text, kinds=['example'], vocab_ids=[vid]) for pid,text,vid in [
            ('P1','一只猫','v-猫'), ('P2','你有小猫吗？','v-小猫'), ('P3','一只熊猫','v-熊猫'), ('P4','小小猫','v-小小猫')]]
        self.links = [{'vocab_id':p['vocab_ids'][0], 'phrase_id':p['id'], 'evidence_ids':['E-'+p['id']]} for p in self.phrases]
        self.edge = {'id':'C1', 'base_vocab_id':'v-猫','compound_vocab_id':'v-小猫', 'base_span':[1,2],
                     'components':[{'vocab_id':'v-小','start':0,'end':1},{'vocab_id':'v-猫','start':1,'end':2}],
                     'method':'explicit_review', 'rationale':'Retains cat meaning', 'supporting_phrase_ids':['P1','P2']}
        self.config = {'schema_version':'1.0.0','scope':'explicit_one_hop_pedagogical_examples','compositions':[self.edge]}

    def build(self):
        return build_example_links(self.words, self.phrases, self.links, self.config)

    def test_cat_inherits_kitten_not_panda(self):
        actual = [r['phrase_id'] for r in self.build() if r['vocab_id']=='v-猫']
        self.assertEqual(actual, ['P1','P2'])
        self.assertNotIn('P3', actual)

    def test_no_composition_means_no_automatic_inheritance(self):
        self.config['compositions'] = []
        self.assertEqual([r['phrase_id'] for r in self.build() if r['vocab_id']=='v-猫'], ['P1'])

    def test_source_links_unchanged(self):
        before = copy.deepcopy([self.words, self.phrases, self.links])
        self.build()
        self.assertEqual(before, [self.words, self.phrases, self.links])

    def test_no_transitive_inheritance(self):
        self.config['compositions'].append({'id':'C2','base_vocab_id':'v-小猫','compound_vocab_id':'v-小小猫','base_span':[1,3],
            'components':[{'vocab_id':'v-小','start':0,'end':1},{'vocab_id':'v-小猫','start':1,'end':3}],
            'method':'explicit_review','rationale':'Test nested diminutive'})
        result = self.build()
        self.assertTrue(any(r['vocab_id']=='v-小猫' and r['phrase_id']=='P4' for r in result))
        self.assertFalse(any(r['vocab_id']=='v-猫' and r['phrase_id']=='P4' for r in result))

    def test_bad_span_rejected(self):
        self.edge['base_span'] = [0,1]
        with self.assertRaisesRegex(ValueError, 'span'): self.build()

    def test_unknown_target_rejected(self):
        self.edge['compound_vocab_id'] = 'v-不存在'
        with self.assertRaisesRegex(ValueError, 'unknown'): self.build()

    def test_duplicate_composition_rejected(self):
        self.config['compositions'].append(copy.deepcopy(self.edge))
        with self.assertRaisesRegex(ValueError, 'duplicate'): self.build()

    def test_counterexample_and_template_excluded(self):
        for change in [{'kinds':['counterexample']},{'hanzi':'我有……小猫'},{'kinds':['true_false_premise']}]:
            with self.subTest(change=change):
                self.assertFalse(eligible_phrase(dict(self.phrases[1], **change)))

    def test_repeated_witness_does_not_duplicate_card(self):
        self.links.append(copy.deepcopy(self.links[1]))
        result = self.build()
        pairs = [(r['vocab_id'],r['phrase_id']) for r in result]
        self.assertEqual(len(pairs), len(set(pairs)))


class PinyinCorpusTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        ensure_cache()
        cls.words = read_table('vocabulary')
        cls.phrases = read_table('phrases')
        cls.public = json.loads((ROOT.parents[1] / 'data/corpus-v21-public.json').read_text(encoding='utf-8'))

    def test_exact_batch_and_coverage(self):
        _, batch = load_batch()
        self.assertEqual(len(batch['vocabulary']), 70)
        self.assertEqual(len(batch['phrases']), 434)
        self.assertEqual(len(read_table('pinyin_ming')), 504)
        for c in read_table('pinyin_ming_summary')['counts'].values():
            self.assertEqual(c['eligible_missing_pinyin_ids'], [])
        self.assertEqual(sum(bool(source_pinyin(r)) for r in self.words),267)
        self.assertEqual(sum(bool(source_pinyin(r)) for r in self.phrases),202)

    def test_source_witnesses_not_filled_with_editorial_data(self):
        for table in ['vocabulary_evidence','phrase_evidence','hanzi_evidence']:
            for row in read_table(table):
                self.assertNotIn('pinyin_ming', row)
                self.assertNotIn('pinyin_display', row)
        cat = next(r for r in self.phrases if r['hanzi']=='一只猫')
        self.assertIsNone(cat['pinyin'])
        self.assertEqual(cat['pinyin_variants'], [])
        self.assertEqual(cat['pinyin_ming'], 'Yì zhī māo')

    def test_all_original_source_selections_win(self):
        for row in self.words + self.phrases:
            if source_pinyin(row): self.assertEqual(pinyin_for_display(row), source_pinyin(row))

    def test_complete_public_pinyin_and_spanish(self):
        report = check_public(CACHE, self.public)
        self.assertEqual(report['vocabulary_records'],337)
        self.assertEqual(report['phrases'],635)
        self.assertEqual(report['words_with_pinyin_and_spanish'],337)
        self.assertEqual(report['phrases_with_pinyin_and_spanish'],635)

    def test_provenance_leak_rejected(self):
        public = copy.deepcopy(self.public)
        public['phrases'][0]['pinyin_ming']='Not for learners'
        with self.assertRaisesRegex(ValueError, 'provenance leaked'): check_public(CACHE, public)

    def test_cat_has_three_complete_examples_without_changing_tokens(self):
        words = {r['id']:r for r in self.public['vocabulary']}
        phrases = {r['id']:r for r in self.public['phrases']}
        cat = words['v-猫']
        self.assertEqual([phrases[i]['hanzi'] for i in cat['examplePhraseIds']], ['一只猫','你有小猫吗？','我有两只小猫，他们很可爱。'])
        self.assertEqual(words['v-小猫']['pinyin'], 'xiǎomāo')
        kitten = phrases['PH-0723abbd5ad5de02']
        self.assertIn('v-小猫', kitten['vocabIds'])
        self.assertNotIn('v-猫', kitten['vocabIds'])
        self.assertIn('v-猫', kitten['exampleVocabIds'])
        self.assertEqual(kitten['pinyin'], 'Nǐ yǒu xiǎomāo ma?')
        self.assertEqual(phrases['PH-4ede4839fc13f6d9']['pinyin'], "Wǒ yǒu liǎng zhī xiǎomāo, tāmen hěn kě'ài.")
        original = next(r for r in self.words if r['id']=='v-猫')
        self.assertEqual(original['phrase_ids'], ['PH-104242c1007e283c'])

    def test_global_zhen_examples(self):
        word = next(r for r in self.public['vocabulary'] if r['id']=='v-真')
        examples = [r for r in self.public['phrases'] if r['id'] in word['examplePhraseIds']]
        self.assertTrue(any(r['hanzi']=='真厉害！' and 2 in r['lessons'] for r in examples))
        self.assertTrue(any(r['hanzi']=='这张照片真漂亮！' and 3 in r['lessons'] for r in examples))

    def test_example_relationships_are_reciprocal_and_resolvable(self):
        words = {r['id']:r for r in self.public['vocabulary']}
        phrases = {r['id']:r for r in self.public['phrases']}
        for vid, word in words.items():
            self.assertEqual(len(word['examplePhraseIds']),len(set(word['examplePhraseIds'])))
            for pid in word['examplePhraseIds']:
                self.assertIn(pid,phrases)
                self.assertIn(vid,phrases[pid]['exampleVocabIds'])
        for pid, phrase in phrases.items():
            for vid in phrase['exampleVocabIds']:
                self.assertIn(vid,words)
                self.assertIn(pid,words[vid]['examplePhraseIds'])

    def test_existing_exclusions_stay_out(self):
        self.assertFalse(any(r['hanzi']=='哥哥，还' for r in self.public['vocabulary']))
        self.assertFalse(any('counterexample' in r['kinds'] for r in self.public['phrases']))
        by_id = {r['id']:r for r in self.phrases}
        for link in read_table('pedagogical_example_links'):
            self.assertTrue(eligible_phrase(by_id[link['phrase_id']]))

    def test_no_human_review_or_paid_generation_claim(self):
        report = read_table('pinyin_ming_summary')
        self.assertFalse(report['independent_human_review'])
        self.assertEqual(report['paid_api_calls'],0)
        self.assertEqual(report['source_fields_overwritten'],0)


if __name__ == '__main__':
    unittest.main()
