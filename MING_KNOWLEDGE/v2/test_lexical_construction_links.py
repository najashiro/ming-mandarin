"""Existing separable-construction suggestions are not direct lexical tokens."""
import copy
import unittest
from lexical_examples import build_example_links, deferred_construction
from query import ensure_cache, read_table


class ConstructionBoundaryTests(unittest.TestCase):
    def setUp(self):
        self.words = [{'id':'v-上课', 'hanzi':'上课'}, {'id':'v-上', 'hanzi':'上'}, {'id':'v-课', 'hanzi':'课'}]
        self.phrases = [{'id':'P', 'hanzi':'上汉语课', 'kinds':['example'], 'vocab_ids':['v-上','v-课']}]
        self.config = {'schema_version':'1.0.0', 'scope':'explicit_one_hop_pedagogical_examples', 'compositions':[]}
        self.link = {'vocab_id':'v-上课','phrase_id':'P','relation':'discontinuous_construction','method':'editorial_rule_assisted_needs_review'}

    def test_pending_construction_is_preserved_but_not_promoted(self):
        before = copy.deepcopy(self.link)
        self.assertTrue(deferred_construction(self.link))
        self.assertEqual(build_example_links(self.words,self.phrases,[self.link],self.config),[])
        self.assertEqual(self.link,before)

    def test_actual_mismatched_lexical_token_still_fails(self):
        link = dict(self.link, relation='lexical_token')
        with self.assertRaisesRegex(ValueError,'lexical membership mismatch'):
            build_example_links(self.words,self.phrases,[link],self.config)

    def test_dangling_construction_still_fails(self):
        link = dict(self.link, vocab_id='v-不存在')
        with self.assertRaisesRegex(ValueError,'dangling'):
            build_example_links(self.words,self.phrases,[link],self.config)

    def test_corpus_reports_pending_constructions(self):
        ensure_cache()
        original = [r for r in read_table('word_phrase_links') if deferred_construction(r)]
        reported = read_table('lexical_examples_summary')['deferred_construction_links']
        self.assertEqual({(r['vocab_id'],r['phrase_id']) for r in original}, {(r['vocab_id'],r['phrase_id']) for r in reported})
        direct_pairs = {(r['vocab_id'],r['phrase_id']) for r in read_table('word_phrase_links') if not deferred_construction(r)}
        derived_pairs = {(r['vocab_id'],r['phrase_id']) for r in read_table('pedagogical_example_links')}
        for r in original:
            pair=(r['vocab_id'],r['phrase_id'])
            if pair not in direct_pairs:
                self.assertNotIn(pair,derived_pairs)


if __name__ == '__main__':
    unittest.main()
