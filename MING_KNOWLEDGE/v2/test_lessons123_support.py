"""Source preservation, explicit links and published-card coverage for L1–L3."""
import copy
import json
import unittest
from pathlib import Path

import lessons123_support
import query


def fixture():
    words = []
    for hanzi in ('我', '有', '猫', '小猫', '狗'):
        words.append(dict(id='v-' + hanzi, hanzi=hanzi, lessons=[1],
            pinyin='historical reading', spanish='historical gloss',
            pinyin_ming='historical editorial reading', traduccion_ming='historical editorial gloss',
            pinyin_display='historical reading', spanish_display='historical gloss',
            pinyin_variants=[], spanish_variants=[], phrase_ids=[], phrase_count=0,
            example_phrase_ids=[], curriculum_links=[dict(lesson=1, role='classroom_extension')]))
    words[2]['pinyin_variants'] = [
        dict(value='slide reading', source_id='SLIDES', page=1),
        dict(value='māo', source_id='BOOK', page=2)]
    words[2]['spanish_variants'] = [dict(value='gato', source_id='BOOK', page=2)]
    phrase = dict(id='PH-existing', hanzi='我有小猫。', lessons=[1], kinds=['example'],
        pinyin='historical phrase reading', spanish=None,
        pinyin_display='historical phrase reading', spanish_display='Tengo un gatito.',
        vocab_ids=['v-我', 'v-有', 'v-小猫'], example_vocab_ids=[],
        source_refs=['BOOK:p002'], evidence_ids=['PE-existing'], dialogue_ids=[], grammar_ids=[])
    witness = dict(id='PE-existing', phrase_id='PH-existing', source_id='BOOK', page=2,
        lesson=1, kind='example', hanzi='我有小猫。',
        pinyin_source='Wǒ yǒu xiǎomāo.', spanish_source=None)
    return dict(vocabulary=words, phrases=[phrase], phrase_evidence=[witness],
        sources=[dict(id='BOOK', kind='textbook', pages=10),
                 dict(id='WORKBOOK', kind='workbook', pages=3),
                 dict(id='SLIDES', kind='class_presentation', pages=5)],
        vocabulary_evidence=[dict(id='VE-original', hanzi='猫', pinyin_source='māo')],
        hanzi_evidence=[dict(id='HE-original', hanzi='猫')],
        document_blocks=[dict(id='B-original', text_source='Source text')],
        word_phrase_links=[], pedagogical_example_links=[], matrix=copy.deepcopy(words),
        validation=dict(counts={}), index=dict(counts_v22={}, stats={}))


def config():
    return dict(batch_id='test-review', vocabulary_updates=[], phrase_updates=[],
        new_phrases=[], example_links=[], missing_vocabulary=[])


def recovered_phrase():
    return dict(id='PH-recovered', hanzi='一只小猫', lessons=[1], kinds=['collocation'],
        pinyin_ming='Yì zhī xiǎomāo', traduccion_ming='Un gatito',
        vocab_ids=['v-小猫'], source_refs=['BOOK:p003'], origin='source_transcription')


class Lessons123SupportTests(unittest.TestCase):
    def test_primary_display_does_not_rewrite_documentary_or_old_editorial_fields(self):
        tables = fixture()
        before = copy.deepcopy(tables)
        lessons123_support.apply(tables, [config()])
        cat = next(w for w in tables['vocabulary'] if w['id'] == 'v-猫')
        self.assertEqual(cat['pinyin_display'], 'māo')
        self.assertEqual(cat['spanish_display'], 'gato')
        self.assertEqual(tables['phrases'][0]['pinyin_display'], 'Wǒ yǒu xiǎomāo.')
        for original, current in zip(before['vocabulary'], tables['vocabulary']):
            for field in ('pinyin', 'spanish', 'pinyin_ming', 'traduccion_ming',
                          'pinyin_variants', 'spanish_variants', 'curriculum_links', 'lessons'):
                self.assertEqual(current[field], original[field])
        for name in ('phrase_evidence', 'vocabulary_evidence', 'hanzi_evidence', 'document_blocks'):
            self.assertEqual(tables[name], before[name])

    def test_recovered_tokens_update_queries_and_matrix_without_substring_discovery(self):
        tables, review = fixture(), config()
        review['new_phrases'] = [recovered_phrase()]
        lessons123_support.apply(tables, [review])
        words = {w['id']: w for w in tables['vocabulary']}
        matrix = {w['id']: w for w in tables['matrix']}
        self.assertEqual(words['v-小猫']['phrase_ids'], ['PH-recovered'])
        self.assertEqual(words['v-小猫']['phrase_count'], 1)
        self.assertEqual(matrix['v-小猫']['phrase_ids'], ['PH-recovered'])
        self.assertEqual(matrix['v-小猫']['phrase_count'], 1)
        self.assertEqual(words['v-猫']['phrase_ids'], [])
        self.assertEqual({(x['vocab_id'], x['phrase_id']) for x in tables['word_phrase_links']},
                         {('v-小猫', 'PH-recovered')})
        eids = tables['word_phrase_links'][0]['evidence_ids']
        self.assertTrue(eids)
        self.assertTrue(set(eids) <= {e['id'] for e in tables['phrase_evidence']})
        self.assertEqual(tables['index']['stats']['word_phrase_links'], 1)

    def test_recovered_existing_phrase_keeps_historical_tokens_and_source_witness(self):
        tables, review = fixture(), config()
        original = copy.deepcopy(tables['phrases'][0])
        witness = copy.deepcopy(tables['phrase_evidence'][0])
        phrase = recovered_phrase()
        phrase.update(id=original['id'], hanzi=original['hanzi'], source_refs=['WORKBOOK:p001'])
        review['new_phrases'] = [phrase]
        lessons123_support.apply(tables, [review])
        self.assertEqual(len(tables['phrases']), 1)
        self.assertEqual(tables['phrases'][0]['vocab_ids'], original['vocab_ids'])
        self.assertEqual(tables['phrases'][0]['pinyin'], original['pinyin'])
        self.assertEqual(tables['phrase_evidence'][0], witness)
        self.assertEqual(tables['word_phrase_links'][0]['vocab_id'], 'v-小猫')

    def test_editorial_example_has_only_explicit_pedagogical_links(self):
        tables, review = fixture(), config()
        phrase = recovered_phrase()
        phrase.update(origin='ming_editorial_example', source_refs=[], basis_refs=['BOOK:p003'])
        review['new_phrases'] = [phrase]
        review['example_links'] = [dict(vocab_id='v-小猫', phrase_id=phrase['id'],
            relation='ming_editorial_example', source_refs=[])]
        before = copy.deepcopy(tables)
        lessons123_support.apply(tables, [review])
        word = next(w for w in tables['vocabulary'] if w['id'] == 'v-小猫')
        self.assertEqual(word['example_phrase_ids'], [phrase['id']])
        self.assertEqual(word['phrase_ids'], [])
        self.assertEqual(tables['word_phrase_links'], [])
        self.assertEqual(tables['phrase_evidence'], before['phrase_evidence'])
        added = tables['phrases'][-1]
        self.assertEqual(added['source_refs'], [])
        self.assertIsNone(added['pinyin'])
        self.assertIsNone(added['spanish'])
        self.assertEqual(added['pinyin_ming'], phrase['pinyin_ming'])

    def test_invalid_documentary_and_basis_references_are_rejected(self):
        for field in ('source_refs', 'basis_refs'):
            for ref in ('UNKNOWN:p001', 'BOOK:p000', 'BOOK:p011', 'BOOK:invalid'):
                with self.subTest(field=field, ref=ref):
                    review = config()
                    phrase = recovered_phrase()
                    phrase[field] = [ref]
                    review['new_phrases'] = [phrase]
                    with self.assertRaises(ValueError):
                        lessons123_support.apply(fixture(), [review])

    def test_unknown_empty_or_duplicate_explicit_tokens_are_rejected(self):
        for ids in (['v-unknown'], [], ['v-小猫', 'v-小猫'], ['v-小猫', None], 'v-小猫'):
            with self.subTest(ids=ids):
                review = config()
                phrase = recovered_phrase()
                phrase['vocab_ids'] = ids
                review['new_phrases'] = [phrase]
                with self.assertRaises(ValueError):
                    lessons123_support.apply(fixture(), [review])

    def test_editorial_source_claims_and_unreferenced_transcriptions_are_rejected(self):
        for overrides in (dict(origin='ming_editorial_example'), dict(source_refs=[])):
            review = config()
            phrase = recovered_phrase()
            phrase.update(overrides)
            review['new_phrases'] = [phrase]
            with self.assertRaises(ValueError):
                lessons123_support.apply(fixture(), [review])

    def test_dangling_and_incomplete_examples_are_rejected(self):
        review = config()
        review['example_links'] = [dict(vocab_id='v-狗', phrase_id='PH-missing')]
        with self.assertRaises(ValueError):
            lessons123_support.apply(fixture(), [review])
        for overrides in (dict(pinyin_ming=''), dict(traduccion_ming=''),
                          dict(hanzi='我有___。'), dict(kinds=['counterexample'])):
            review = config()
            phrase = recovered_phrase()
            phrase.update(overrides)
            review['new_phrases'] = [phrase]
            with self.assertRaises(ValueError):
                lessons123_support.apply(fixture(), [review])

    def test_reapplying_recovery_does_not_duplicate_witnesses_or_lexical_links(self):
        tables, review = fixture(), config()
        review['new_phrases'] = [recovered_phrase()]
        lessons123_support.apply(tables, [review])
        witnesses = copy.deepcopy(tables['phrase_evidence'])
        links = copy.deepcopy(tables['word_phrase_links'])
        lessons123_support.apply(tables, [review])
        self.assertEqual(tables['phrase_evidence'], witnesses)
        self.assertEqual(tables['word_phrase_links'], links)
        word = next(w for w in tables['vocabulary'] if w['id'] == 'v-小猫')
        self.assertEqual(word['phrase_count'], 1)


class Lessons123CorpusCoverageTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        query.ensure_cache()
        cls.words = {w['id']: w for w in query.read_table('vocabulary')}
        cls.phrases = {p['id']: p for p in query.read_table('phrases')}

    def test_every_visible_lesson123_card_has_a_complete_explicit_example(self):
        baseline = json.loads((Path(__file__).resolve().parents[2] / 'data/corpus-v21-public.json').read_text())
        roles = {'core_review', 'workbook_context', 'phrase_context', 'worksheet_sequence',
                 'numeral_in_context', 'classroom_extension', 'classroom_expression',
                 'colloquial_classroom', 'proper_name', 'visual_label', 'supplementary_review'}
        for card in baseline['vocabulary']:
            visible = any(link['lesson'] in (1, 2, 3) and
                (link['role'] in roles or link['list_type'] in ('new_vocabulary', 'supplementary_vocabulary'))
                for link in card['curriculumLinks'])
            if not visible:
                continue
            with self.subTest(word=card['id']):
                word = self.words[card['id']]
                self.assertTrue(word['pinyin_display'])
                self.assertTrue(word['spanish_display'])
                complete = [self.phrases[pid] for pid in word['example_phrase_ids']
                    if self.phrases[pid].get('pinyin_display') and self.phrases[pid].get('spanish_display')
                    and card['id'] in self.phrases[pid]['example_vocab_ids']]
                self.assertTrue(complete)

    def test_recovered_source_tokens_are_queryable_without_promoting_editorial_examples(self):
        links = {(r['vocab_id'], r['phrase_id']) for r in query.read_table('word_phrase_links')}
        for entry in query.read_table('lessons123_new_phrases'):
            if entry['origin'] != 'source_transcription':
                continue
            for vid in entry['vocab_ids']:
                with self.subTest(phrase=entry['id'], word=vid):
                    self.assertIn(entry['id'], self.words[vid]['phrase_ids'])
                    self.assertEqual(self.words[vid]['phrase_count'], len(self.words[vid]['phrase_ids']))
                    self.assertIn((vid, entry['id']), links)


if __name__ == '__main__':
    unittest.main()
