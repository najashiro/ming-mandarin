"""Original PDF reread: source repairs, stable IDs and explicit printed links."""
import copy
import json
import unittest
from pathlib import Path

import compile_v22
import lesson4_source_corrections
import query


class Lesson4PdfRereadTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        query.ensure_cache()
        cls.config = query.read_table('lesson4_source_corrections')
        cls.blocks = {r['id']: r for r in query.read_table('document_blocks')}
        cls.phrases = {r['id']: r for r in query.read_table('phrases')}
        cls.witnesses = {r['id']: r for r in query.read_table('phrase_evidence')}

    def test_frozen_extraction_and_corrected_source_are_both_preserved(self):
        _, docs = compile_v22.source_documents()
        originals = {b['id']: b for d in docs for p in d['pages'] for b in p['blocks']}
        self.assertEqual(len(self.config['corrections']), 6)
        for correction in self.config['corrections']:
            old = originals[correction['block_id']]
            new = self.blocks[correction['block_id']]
            for key in correction['field_path'].split('/'):
                old = old[int(key)] if isinstance(old, list) else old[key]
                new = new[int(key)] if isinstance(new, list) else new[key]
            self.assertEqual(old, correction['before'])
            self.assertEqual(new, correction['after'])

    def test_corrected_chinese_retains_ids_and_updates_lexical_spans(self):
        for identity in self.config['phrase_identity_preservations']:
            phrase = self.phrases[identity['phrase_id']]
            witness = self.witnesses[identity['phrase_evidence_id']]
            self.assertEqual(phrase['hanzi'], identity['after'])
            self.assertEqual(witness['hanzi'], identity['after'])
            self.assertEqual(witness['source_correction_id'], identity['correction_id'])
        spans = query.read_table('word_phrase_spans')
        pairs = {(r['phrase_evidence_id'], r['vocab_id']) for r in spans}
        self.assertIn(('PE-L4-1ce9d94fae995dd1', 'v-她们'), pairs)
        self.assertNotIn(('PE-L4-1ce9d94fae995dd1', 'v-他们'), pairs)
        self.assertIn(('PE-L4-a9947e2cd7066a09', 'v-她'), pairs)
        self.assertNotIn(('PE-L4-a9947e2cd7066a09', 'v-他'), pairs)
        self.assertEqual(self.phrases['PH-d241a5d28f363977']['spanish_display'], 'Ella enseña inglés.')
        # The separate proportions panel really prints the masculine form.
        page10 = [b for b in self.blocks.values() if b['source_id'] == 'SRC-WB-04' and b['page'] == 10]
        self.assertTrue(any('他们班' in json.dumps(b, ensure_ascii=False) for b in page10 if b['id'] != 'L4-WB-04-10-01'))

    def test_printed_pinyin_and_culture_literals(self):
        self.assertEqual(self.blocks['L4-WB-04-06-02']['items'][3]['pinyin_source'], 'Tāmen bān yǒu duōshao gè xuésheng?')
        self.assertEqual(self.blocks['L4-WB-04-07-03']['items'][0]['pinyin_source'], 'Wǒmen bān yǒu sānshíbā gè xuésheng.')
        self.assertEqual(self.blocks['L4-WB-04-10-01']['items'][1]['pinyin_source'], 'Tāmen bān yígòng yǒu duōshao gè nǚshēng?')
        culture = self.blocks['L4-BOOK-04-24-02']['text_source']
        self.assertIn('otros estudiantes ingresan', culture)
        self.assertIn('continuar su estudio en un nivel educativo más alto', culture)

    def test_stale_document_or_forged_identity_fails(self):
        _, docs = compile_v22.source_documents()
        config = copy.deepcopy(self.config)
        config['corrections'][0]['before'] += 'stale'
        with self.assertRaises(ValueError):
            lesson4_source_corrections.apply(copy.deepcopy(docs), config, compile_v22.textid)
        config = copy.deepcopy(self.config)
        config['phrase_identity_preservations'][0]['phrase_id'] = 'PH-forged'
        with self.assertRaises(ValueError):
            lesson4_source_corrections.apply(copy.deepcopy(docs), config, compile_v22.textid)

    def test_complete_collocation_wins_display_without_filling_exercise_blank(self):
        phrase = self.phrases['PH-0eeef2be09fdbe25']
        self.assertEqual(phrase['hanzi'], '十点十分____')
        self.assertEqual(phrase['hanzi_display'], '十点十分')
        self.assertEqual(self.witnesses['PE-L4-1bf3635c2e04911a']['hanzi'], '十点十分____')
        self.assertEqual(self.witnesses['PE-L4-269284b1091a71c7']['hanzi'], '十点十分')
        review = query.read_table('lesson4_book_review')
        links = query.read_table('pedagogical_example_links')
        self.assertEqual(len(review['collocation_links']), 8)
        for item in review['collocation_links']:
            self.assertTrue(any(r['vocab_id'] == item['vocab_id'] and r['phrase_id'] == item['phrase_id']
                                and r['relation'] == 'printed_vocabulary_collocation' for r in links))


if __name__ == '__main__':
    unittest.main()
