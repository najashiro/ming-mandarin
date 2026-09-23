"""Offline regression tests: python3 -m unittest discover -s MING_KNOWLEDGE/v2 -p 'test_*.py'."""
from __future__ import annotations
import copy
import json
import subprocess
import sys
import unittest
from pathlib import Path
import query
import radicals

ROOT = Path(__file__).resolve().parent

class RadicalTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        query.ensure_cache(True)
        cls.tables = {n: query.read_table(n) for n in radicals.TABLE_NAMES}
        cls.base = {n: query.read_table(n) for n in ['sources','hanzi','vocabulary','phrases','word_phrase_links','exercises']}
        cls.catalog = {r['radical']: r for r in cls.tables['radical_catalog']}

    def test_clean_validation(self):
        self.assertEqual(radicals.validate(self.tables, self.base), [])
        self.assertTrue(query.read_table('validation')['passed'])

    def test_counts_and_original_corpus_preserved(self):
        stats = query.read_table('index')['stats']
        for key, expected in [('radical_forms',38),('radical_named_definitions',8),
            ('radical_worksheet_witnesses',77),('radical_assessment_items',40),
            ('radical_exam_characters',10),('vocabulary_entries',346),('phrases_unique',643),
            ('runtime_vocabulary_unique',151),('runtime_canonical_hanzi',192)]:
            self.assertEqual(stats[key], expected, key)

    def test_source_corrections_are_auditable(self):
        definitions = {r['radical']: r for r in query.read_table('radicals')}
        legacy = {r['radical']: r for r in query.read_table('radicals_legacy_v2')}
        self.assertEqual(definitions['辶']['name_source'], 'zǒuzhīdǐ')
        self.assertEqual(legacy['辶']['name_source'], 'zǒuzhīpáng')
        self.assertEqual(definitions['饣']['example_characters'], list('饭饼饿'))
        self.assertEqual(legacy['饣']['example_characters'], list('饭饺'))
        self.assertEqual(len(self.tables['radical_corrections']), 2)

    def test_worksheet_fields_preserved_verbatim(self):
        he = {r['id']: r for r in query.read_table('hanzi_evidence') if r.get('radical_source') is not None}
        rows = [r for r in self.tables['radical_evidence'] if r['kind']=='worksheet_radical']
        self.assertEqual({r['hanzi_evidence_id'] for r in rows}, set(he))
        for r in rows:
            source = he[r['hanzi_evidence_id']]
            for field in ['source_id','page','radical_source','hanzi_id']:
                self.assertEqual(r[field], source[field])

    def test_exact_forms_not_normalized(self):
        self.assertNotEqual(radicals.rid('口'), radicals.rid('囗'))
        self.assertNotEqual(radicals.rid('月'), radicals.rid('冃'))
        self.assertNotEqual(radicals.rid('⺊'), radicals.rid('卜'))
        self.assertEqual([r['radical_id'] for r in self.tables['radical_hanzi_links']
                          if r['hanzi_id']=='c-有'], [radicals.rid('冃')])

    def test_null_means_no_source_not_fill_permission(self):
        for glyph in ['女','氵','口','钅']:
            self.assertIsNone(self.catalog[glyph]['name_source'])
            self.assertIsNone(self.catalog[glyph]['meaning_source'])
        self.assertEqual(self.catalog['讠']['meaning_source'], 'discurso')

    def test_exam_is_ten_individual_prompts_not_student_answers(self):
        items = self.tables['radical_assessment_items']
        exam = [r for r in items if r['assessment_id']=='RAS-EXAM-B2-II']
        wb = [r for r in items if r['assessment_id']=='RAS-WB-L2']
        self.assertEqual([r['hanzi'] for r in exam], list('什们语识她妈饺饭汉海'))
        self.assertEqual([r['hanzi'] for r in wb], [r['hanzi'] for r in exam])
        for r in items:
            self.assertFalse(r['source_answer_key_supplied'])
            self.assertFalse(r['automatic_grading_approved'])
        task = next(r for r in self.tables['radical_assessment_sets'] if r['kind']=='exam')
        self.assertEqual(task['section_points'], 10)
        self.assertEqual(task['requests'], ['radical','radical_meaning'])

    def test_continuation_pages_and_l1_female_evidence(self):
        items = self.tables['radical_assessment_items']
        self.assertEqual([r['page'] for r in items if r['assessment_id']=='RAS-WB-L2'], [11]*6+[12]*4)
        self.assertIn(1, self.catalog['女']['lessons'])
        self.assertIn('SRC-WB-01-02:p003', self.catalog['女']['practice_refs'])

    def test_source_evidence_and_proposals_stay_distinct(self):
        links = self.tables['radical_hanzi_links']
        yu = next(r for r in links if r['hanzi_id']=='c-语')
        self.assertTrue(yu['source_evidence_ids'])
        self.assertEqual(yu['assignment_status'], 'documented_in_course_source')
        han = next(r for r in links if r['hanzi_id']=='c-汉')
        self.assertEqual(han['assignment_status'], 'editorial_exercise_proposal')

    def test_derived_phrase_relations_not_teaching_claims(self):
        for row in self.tables['radical_phrase_links']:
            self.assertFalse(row['counts_as_radical_teaching_evidence'])
        links = [r for r in self.tables['radical_word_links'] if r['vocab_id']=='v-汉语']
        self.assertIn(('c-语',radicals.rid('讠')), {(r['hanzi_id'],r['radical_id']) for r in links})
        self.assertTrue(all(not r['ppt_refs'] for r in self.catalog.values()))

    def test_dangling_reference_is_rejected(self):
        broken = copy.deepcopy(self.tables)
        broken['radical_hanzi_links'][0]['hanzi_id'] = 'c-NOT-A-CHARACTER'
        self.assertIn('radical/Hanzi FK', radicals.validate(broken, self.base))

    def test_fabricated_official_key_is_rejected(self):
        broken = copy.deepcopy(self.tables)
        broken['radical_assessment_items'][0]['source_answer_key_supplied'] = True
        self.assertIn('fabricated official key', radicals.validate(broken, self.base))

    def test_command_line_queries(self):
        def cli(*args):
            return json.loads(subprocess.check_output([sys.executable,str(ROOT/'query.py'),*args],text=True))
        self.assertTrue(cli('--radical','讠','--limit','1')['found'])
        self.assertFalse(cli('--radical','月')['found'])
        self.assertIn(radicals.rid('讠'), cli('--hanzi','语')['hanzi']['documented_radical_ids'])
        self.assertIn(radicals.rid('讠'), cli('--word','汉语','--limit','1')['word']['radical_ids'])
        self.assertEqual(cli('--table','radical_matrix','--limit','1')['total'],38)

if __name__ == '__main__':
    unittest.main()
