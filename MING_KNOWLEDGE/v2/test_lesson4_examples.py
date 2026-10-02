"""Regression and rejection cases for the two explicitly approved L4 examples."""
import copy
import json
import unittest
from pathlib import Path

import lesson4_examples
import query


class Lesson4ExampleTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        query.ensure_cache()
        cls.tables = {name: query.read_table(name) for name in (
            'vocabulary', 'phrases', 'phrase_evidence', 'document_blocks',
            'word_phrase_links', 'pedagogical_example_links', 'lesson4_example_support')}
        cls.config = json.loads((Path(__file__).parent / 'lesson4/example-support.json').read_text())

    def apply_config(self, config, tables=None):
        tables = copy.deepcopy(tables or self.tables)
        vocab = {r['id']: r for r in tables['vocabulary']}
        phrases = {r['id']: r for r in tables['phrases']}
        lesson4_examples.apply(tables, vocab, phrases, config)
        return tables, vocab, phrases

    def test_exact_links_do_not_change_lexical_or_curricular_assignments(self):
        tables, vocab, phrases = self.apply_config(self.config)
        for entry in self.config['entries']:
            vid, pid = entry['vocab_id'], entry['phrase_id']
            self.assertIn(pid, vocab[vid]['example_phrase_ids'])
            self.assertIn(vid, phrases[pid]['example_vocab_ids'])
            self.assertNotIn(vid, phrases[pid]['vocab_ids'])
            self.assertIn(entry['via_vocab_id'], phrases[pid]['vocab_ids'])
        for name in ('word_phrase_links', 'phrase_evidence'):
            self.assertEqual(tables[name], self.tables[name])
        before_vocab = {r['id']: r for r in self.tables['vocabulary']}
        for vid, row in vocab.items():
            for field in ('id', 'hanzi', 'phrase_ids', 'curriculum_links', 'lessons'):
                self.assertEqual(row.get(field), before_vocab[vid].get(field))

    def test_documentary_translation_keeps_the_note_location(self):
        phrase = next(r for r in self.tables['phrases'] if r['id'] == 'PH-f9131d33151602a9')
        source = self.config['entries'][0]['documentary_spanish']['expected']
        self.assertEqual(phrase['spanish_display'], source)
        self.assertEqual(phrase['spanish_source'], source)
        self.assertEqual(phrase['spanish_source_location']['page'], 7)
        self.assertEqual(phrase['spanish_source_location']['printed_page'], 119)
        self.assertIsNone(phrase['traduccion_ming'])
        witness = next(r for r in self.tables['phrase_evidence'] if r['id'] == self.config['entries'][0]['evidence_id'])
        self.assertEqual(witness['page'], 6)
        self.assertIsNone(witness['spanish_source'])

    def test_editorial_support_never_becomes_documentary(self):
        entry = self.config['entries'][1]
        phrase = next(r for r in self.tables['phrases'] if r['id'] == entry['phrase_id'])
        self.assertEqual(phrase['pinyin_display'], entry['pinyin_ming'])
        self.assertEqual(phrase['spanish_display'], entry['traduccion_ming'])
        self.assertIsNone(phrase['pinyin'])
        self.assertEqual(phrase['pinyin_variants'], [])
        self.assertEqual(phrase['spanish_variants'], [])
        witness = next(r for r in self.tables['phrase_evidence'] if r['id'] == entry['evidence_id'])
        self.assertIsNone(witness['pinyin_source'])
        self.assertIsNone(witness['spanish_source'])

    def test_documentary_display_has_precedence_over_editorial(self):
        tables = copy.deepcopy(self.tables)
        phrase = next(r for r in tables['phrases'] if r['id'] == self.config['entries'][1]['phrase_id'])
        phrase['pinyin_display'], phrase['spanish_display'] = 'documentary reading', 'documentary Spanish'
        _, _, phrases = self.apply_config(self.config, tables)
        self.assertEqual(phrases[phrase['id']]['pinyin_display'], 'documentary reading')
        self.assertEqual(phrases[phrase['id']]['spanish_display'], 'documentary Spanish')

    def test_unknown_duplicate_stale_or_wrong_lexical_witness_rejected(self):
        for field, value in [('vocab_id', 'v-不存在'), ('via_vocab_id', 'v-大学'),
                             ('phrase_id', 'PH-missing'), ('evidence_id', 'PE-missing'),
                             ('hanzi', '回学校。')]:
            with self.subTest(field=field):
                config = copy.deepcopy(self.config)
                config['entries'][0][field] = value
                with self.assertRaises(ValueError):
                    self.apply_config(config)
        config = copy.deepcopy(self.config)
        config['entries'].append(config['entries'][0])
        with self.assertRaises(ValueError):
            self.apply_config(config)

    def test_changed_note_or_blank_editorial_rejected(self):
        config = copy.deepcopy(self.config)
        config['entries'][0]['documentary_spanish']['expected'] = 'Unsupported translation'
        with self.assertRaises(ValueError):
            self.apply_config(config)
        config = copy.deepcopy(self.config)
        config['entries'][1]['pinyin_ming'] = ' '
        with self.assertRaises(ValueError):
            self.apply_config(config)

    def test_counterexample_or_secondary_dialogue_rejected(self):
        for field, value in [('kind', 'counterexample'), ('canonical', False)]:
            tables = copy.deepcopy(self.tables)
            witness = next(r for r in tables['phrase_evidence'] if r['id'] == self.config['entries'][0]['evidence_id'])
            witness[field] = value
            with self.assertRaises(ValueError):
                self.apply_config(self.config, tables)

    def test_no_transitive_or_substring_inheritance(self):
        links = [r for r in self.tables['pedagogical_example_links'] if r.get('batch') == self.config['batch']]
        self.assertEqual({(r['vocab_id'], r['phrase_id']) for r in links},
                         {(r['vocab_id'], r['phrase_id']) for r in self.config['entries']})
        self.assertFalse(any(r['vocab_id'] == 'v-下' for r in links))
        self.assertNotIn(('v-里卡多帕尔玛大学', '我在里卡多帕尔玛大学孔子学院学习汉语。'),
                         {(r['vocab_id'], next(p['hanzi'] for p in self.tables['phrases'] if p['id'] == r['phrase_id'])) for r in links})
