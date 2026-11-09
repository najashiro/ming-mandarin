"""Language support must never rewrite source evidence or polyphonic contexts."""
import copy
import json
import unittest
from pathlib import Path

import lesson4_support
import query


class Lesson4SupportTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        query.ensure_cache()
        cls.tables = {name: query.read_table(name) for name in (
            'vocabulary', 'phrases', 'phrase_evidence', 'vocabulary_evidence',
            'hanzi_evidence', 'document_blocks')}
        root = Path(__file__).parent / 'lesson4'
        cls.config = json.loads((root / 'language-support.json').read_text())
        cls.dialogues = json.loads((root / 'dialogue-translations-ming.json').read_text())

    def apply_config(self, config):
        tables = copy.deepcopy(self.tables)
        vocab = {r['id']: r for r in tables['vocabulary']}
        phrases = {r['id']: r for r in tables['phrases']}
        lesson4_support.apply(tables, vocab, phrases, config, self.dialogues)
        return tables, vocab, phrases

    def test_source_witnesses_and_legacy_word_fields_are_preserved(self):
        tables, vocab, _ = self.apply_config(self.config)
        for name in ('phrase_evidence', 'vocabulary_evidence', 'hanzi_evidence', 'document_blocks'):
            self.assertEqual(tables[name], self.tables[name])
        for original in self.tables['vocabulary']:
            for field in ('pinyin', 'spanish', 'pinyin_variants', 'spanish_variants', 'pinyin_ming', 'traduccion_ming'):
                self.assertEqual(vocab[original['id']].get(field), original.get(field))

    def test_missing_book_context_gets_editorial_support_without_fabricated_source(self):
        _, vocab, _ = self.apply_config(self.config)
        context = vocab['v-每天']['lesson4_selection']
        self.assertEqual(context['source_id'], 'SRC-WB-04')
        self.assertIsNone(context['pinyin'])
        self.assertIsNone(context['spanish'])
        self.assertEqual(context['pinyin_display'], 'měi tiān')
        self.assertEqual(context['spanish_display'], 'todos los días')

    def test_source_typo_and_clean_display_keep_original_text(self):
        _, _, phrases = self.apply_config(self.config)
        phrase = phrases['PH-3939469dbfc57aed']
        self.assertEqual(phrase['pinyin'], 'Hàizì hěn yǒu yìsi.')
        self.assertEqual(phrase['pinyin_display'], 'Hànzì hěn yǒu yìsi.')
        self.assertIn('omits n', phrase['pinyin_display_correction'])
        phrase = phrases['PH-0c241a4ebfd8c3ed']
        self.assertEqual(phrase['hanzi'], 'B：我怕蛇she2。')
        self.assertEqual(phrase['hanzi_display'], 'B：我怕蛇。')

    def test_documentary_translation_beats_editorial(self):
        _, _, phrases = self.apply_config(self.config)
        phrase = phrases['PH-e386048062b793db']
        self.assertEqual(phrase['traduccion_ming'], 'Mañana tengo muchas clases.')
        self.assertEqual(phrase['spanish_display'], 'Mañana tendré muchas clases.')
        self.assertEqual(phrase['spanish_source_location']['block_id'], 'L4-BOOK-04-04-01')

    def test_polyphonic_characters_have_their_own_glosses(self):
        tables, vocab, _ = self.apply_config(self.config)
        characters = {r['hanzi']: r for r in tables['lesson4_character_support']}
        self.assertEqual(characters['只']['pinyin'], 'zhī')
        self.assertIn('clasificador', characters['只']['traduccion_ming'])
        self.assertEqual(vocab['v-只']['lesson4_selection']['pinyin'], 'zhǐ')
        self.assertEqual(characters['差']['pinyin'], 'chā')
        self.assertEqual(vocab['v-差']['lesson4_selection']['pinyin'], 'chà')

    def test_bad_targets_and_reading_mismatch_are_rejected(self):
        for field, value in [('target_id', 'v-no-existe'), ('hanzi', '内容不同'), ('pinyin_ming', '')]:
            config = copy.deepcopy(self.config)
            config['entries'][0][field] = value
            with self.subTest(field=field), self.assertRaises(ValueError):
                self.apply_config(config)
        config = copy.deepcopy(self.config)
        config['entries'].append(config['entries'][0])
        with self.assertRaises(ValueError):
            self.apply_config(config)
        config = copy.deepcopy(self.config)
        config['characters'][0]['pinyin'] = 'wrong-reading'
        with self.assertRaises(ValueError):
            self.apply_config(config)

    def test_career_language_sequence_is_not_promoted_to_an_independent_word(self):
        _, vocab, phrases = self.apply_config(self.config)
        self.assertTrue(vocab['v-汉西英']['lesson4_selection']['publication_excluded'])
        self.assertIn('汉西英', phrases['PH-b973c61b2d2e0547']['hanzi'])

    def test_preceding_and_attending_class_are_separate_contexts(self):
        _, vocab, _ = self.apply_config(self.config)
        word = vocab['v-上']
        excluded = word['lesson4_selection']['example_phrase_exclusions']['phrase_ids']
        self.assertEqual(len(excluded), 3)
        self.assertTrue(set(excluded) <= set(word['example_phrase_ids']))
        self.assertIn('precedente', word['lesson4_selection']['spanish'])


if __name__ == '__main__':
    unittest.main()
