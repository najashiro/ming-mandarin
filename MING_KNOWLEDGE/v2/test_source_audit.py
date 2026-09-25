"""Regression tests for source-based classification, recoveries and projection."""
import copy
import json
import unittest
from query import CACHE, ensure_cache, read_table
from source_audit import (INVENTORY, augment_public, check_book_witnesses, check_worksheets,
                          normalize_pinyin, read_json, textbook_rows)

class SourceAuditTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        ensure_cache()
        cls.inventory = read_json(INVENTORY)
        cls.rows = textbook_rows(cls.inventory)
        cls.evidence = read_table('vocabulary_evidence')

    def test_all_nine_tables_and_printed_subentries(self):
        self.assertEqual(len(self.inventory['tables']), 9)
        self.assertEqual(len(self.rows), 159)
        self.assertEqual(sum(r['subentry_index'] == 0 for r in self.rows), 147)
        self.assertEqual(sum(r['subentry_index'] > 0 for r in self.rows), 12)
        self.assertEqual(len(check_book_witnesses(self.rows, self.evidence)), 159)

    def test_lesson_counts(self):
        self.assertEqual({n: sum(r['lesson']==n for r in self.rows) for n in [1,2,3]}, {1:37,2:60,3:62})

    def test_missing_word_is_not_silently_discarded(self):
        broken = [r for r in self.evidence if not (r['source_id']=='SRC-BOOK-01-02' and r['page']==54 and r['hanzi']=='马马虎虎')]
        with self.assertRaises(ValueError): check_book_witnesses(self.rows, broken)

    def test_wrong_lesson_is_rejected(self):
        broken = copy.deepcopy(self.evidence)
        next(r for r in broken if r['id']=='VE-00027')['lesson'] = 3
        with self.assertRaises(ValueError): check_book_witnesses(self.rows, broken)

    def test_wrong_list_class_is_rejected(self):
        broken = copy.deepcopy(self.evidence)
        next(r for r in broken if r['source_id']=='SRC-BOOK-01-02' and r['page']==54 and r['hanzi']=='马马虎虎')['role'] = 'core_textbook'
        with self.assertRaises(ValueError): check_book_witnesses(self.rows, broken)

    def test_missing_pinyin_is_rejected(self):
        broken = copy.deepcopy(self.evidence)
        next(r for r in broken if r['id']=='VE-00027')['pinyin_source'] = None
        with self.assertRaises(ValueError): check_book_witnesses(self.rows, broken)

    def test_duplicate_source_witness_is_rejected(self):
        broken = copy.deepcopy(self.evidence)
        broken.append(copy.deepcopy(next(r for r in broken if r['id']=='VE-00027')))
        with self.assertRaises(ValueError): check_book_witnesses(self.rows, broken)

    def test_names_remain_names_and_members_of_new_word_table(self):
        row = next(r for r in read_table('textbook_table_rows') if r['table_id']=='TB-L1-T1-NEW' and r['hanzi']=='马大为')
        self.assertEqual(row['role'], 'proper_name')
        self.assertEqual(row['list_type'], 'new_vocabulary')

    def test_china_has_different_roles_in_two_lessons(self):
        word = next(r for r in read_table('vocabulary') if r['id']=='v-中国')
        self.assertTrue(any(r['lesson']==2 and r['list_type']=='supplementary_vocabulary' for r in word['curriculum_links']))
        self.assertTrue(any(r['lesson']==3 and r['list_type']=='new_vocabulary' for r in word['curriculum_links']))

    def test_mamahuhu_preserves_printed_category(self):
        row = next(r for r in read_table('textbook_table_rows') if r['hanzi']=='马马虎虎')
        self.assertEqual((row['printed_page'],row['page'],row['printed_number']), (53,54,6))
        self.assertEqual(row['grammatical_type_source'], 'Adj.')

    def test_all_nine_worksheets_preserve_229_occurrences(self):
        rows = check_worksheets(self.inventory, read_table('hanzi_evidence'), read_table('sources'))
        self.assertEqual(sum(r['glyph_occurrences'] for r in rows), 229)

    def test_tai_exact_worksheet_link(self):
        tai = next(r for r in read_table('hanzi') if r['id']=='c-太')
        witness = next(r for r in tai['worksheet_occurrences'] if r['source_id']=='SRC-HANZI-01-3')
        self.assertEqual((witness['page'],witness['row'],witness['pinyin_source'],witness['stroke_count_source']), (2,4,'tài',4))

    def test_pinyin_recovery_stays_with_actual_source(self):
        rows = read_table('phrase_evidence')
        book = next(r for r in rows if r['id']=='PE-00770')
        ppt = next(r for r in rows if r['id']=='PE-00514')
        self.assertTrue(book['pinyin_source'])
        self.assertIsNone(ppt['pinyin_source'])
        self.assertEqual(book['phrase_id'],ppt['phrase_id'])

    def test_phrase_query_has_pinyin_without_full_flag(self):
        phrase = next(r for r in read_table('phrases') if r['id']=='PH-38f6ca8078116ec2')
        self.assertEqual(phrase['pinyin'], 'Wǒ jiā yǒu wǔ kǒu rén.')
        self.assertEqual(len(read_table('source_pinyin_recoveries')), 9)

    def test_no_translations_or_radicals_are_invented(self):
        phrase = next(r for r in read_table('phrases') if r['id']=='PH-38f6ca8078116ec2')
        self.assertFalse(phrase['spanish_variants'])
        original = next(r for r in read_table('hanzi_evidence') if r['id']=='HE-00046')
        self.assertIsNone(original['radical_source'])

    def test_tones_and_umlaut_remain_distinct(self):
        self.assertNotEqual(normalize_pinyin('lǜ'), normalize_pinyin('lù'))
        self.assertNotEqual(normalize_pinyin('tài'), normalize_pinyin('tāi'))
        self.assertEqual(normalize_pinyin('nǚ’ér'), normalize_pinyin("nǚ'ér"))

    def test_public_metadata_is_source_free(self):
        words=read_table('vocabulary')
        payload={'vocabulary':[{'id':r['id']} for r in words], 'phrases':[{'id':r['id']} for r in read_table('phrases')]}
        projection=augment_public(payload, CACHE)
        self.assertEqual(len(projection['hanzi']), len(read_table('hanzi')))
        self.assertNotIn('SRC-HANZI-', json.dumps(projection,ensure_ascii=False))
        tai=next(r for r in projection['hanzi'] if r['id']=='c-太')
        self.assertTrue(tai['worksheetEvidence'])
        self.assertNotIn('writingAvailable',tai)

if __name__=='__main__':
    unittest.main()
