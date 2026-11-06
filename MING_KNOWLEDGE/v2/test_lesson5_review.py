"""Regressions for the second L5 presentation, its witnesses, and open activities."""
import copy
import json
import unittest
from pathlib import Path

from lesson5.query import validate_sources


ROOT = Path(__file__).resolve().parents[2]
PRESENTATION = '第5课 - 2 祝你生日快乐.pdf'


def walk(value):
    """Visit nested metadata as well as top-level activity and grammar records."""
    if isinstance(value, dict):
        yield value
        for child in value.values():
            yield from walk(child)
    elif isinstance(value, list):
        for child in value:
            yield from walk(child)


class Lesson5ReviewTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.source = json.loads((ROOT / 'MING_KNOWLEDGE/v2/lesson5/content.json').read_text())
        cls.public = json.loads((ROOT / 'data/lesson5-public.json').read_text())
        cls.corrections = {row['field']: row for row in cls.source['corrections']}
        cls.activities = {row['id']: row for row in cls.source['documentaryExercises']}
        cls.grammar = {row['id']: row for row in cls.source['grammar']}

    def test_exact_document_identity_and_all_five_reviewed_pages(self):
        document = self.source['sources']['presentation2']
        self.assertEqual(document['file'], PRESENTATION)
        self.assertEqual(document['pages'], 54)
        self.assertEqual(document['sha256'],
                         'd2190ba5d900ad38902bb1f29d5cbdfdb683f16bcddc466736f2e47f412c2e24')
        self.assertEqual(document['authority'], 'supplementary')
        expected = {
            'presentation2.double_object.pronoun': (38, 'book', 13),
            'dialogue2.final_speaker': (41, 'book', 7),
            'presentation2.dialogue2.pinyin': (41, 'book', 7),
            'presentation2.age_practice.zodiac': (43, 'book', 18),
            'presentation2.workbook.question_focus': (50, 'workbook', 5),
            'presentation2.reading.teacher_birth_year': (54, 'book', 19),
            'presentation2.reading.daughter_zodiac': (54, 'book', 19),
        }
        for field, (slide, book, page) in expected.items():
            with self.subTest(field=field):
                correction = self.corrections[field]
                self.assertEqual(correction['secondary'], {
                    'type': 'class_presentation', 'file': PRESENTATION, 'pdfPage': slide,
                })
                self.assertEqual(correction['primary'], {
                    'type': self.source['sources'][book]['type'],
                    'file': self.source['sources'][book]['file'], 'pdfPage': page,
                })

    def test_confirmed_book_witnesses_keep_priority(self):
        self.assertEqual(self.corrections['presentation2.double_object.pronoun']['preferred'],
                         '马大为送她什么礼物？')
        self.assertEqual(self.corrections['presentation2.age_practice.zodiac']['preferred'],
                         '属马／我也属马')
        self.assertEqual(self.corrections['presentation2.dialogue2.pinyin']['preferred'],
                         {'教': 'jiāo', '的': 'de', '还': 'hái'})
        dialogues = {row['id']: row for row in self.public['dialogues']}
        self.assertEqual(set(dialogues), {'DLG-L5-BOOK-T1', 'DLG-L5-BOOK-T2'})
        self.assertEqual([len(dialogues[key]['turns']) for key in sorted(dialogues)], [14, 13])
        turns = dialogues['DLG-L5-BOOK-T1']['turns']
        self.assertIn('十月二十五号。', [turn['hanzi'] for turn in turns])
        self.assertIn('他一九八八年出生，今年三十二岁。', [turn['hanzi'] for turn in turns])
        second = dialogues['DLG-L5-BOOK-T2']['turns']
        self.assertEqual(second[-1]['speaker'], '大家')
        teaching = next(turn for turn in second if '她常常教我们英语' in turn['hanzi'])
        self.assertIn('jiāo', teaching['pinyin'])
        self.assertNotIn('jiào', teaching['pinyin'])
        self.assertIn(' de ', teaching['pinyin'])
        noodles = next(turn for turn in second if '小云昨天还教我做寿面' in turn['hanzi'])
        self.assertIn('hái jiāo', noodles['pinyin'])

    def test_uncertain_annotations_remain_null_and_ungraded(self):
        expected = {
            'presentation2.workbook.question_focus': 'withhold_as_answer_key',
            'presentation2.reading.teacher_birth_year': 'underdetermined',
            'presentation2.reading.daughter_zodiac': 'underdetermined',
        }
        for field, status in expected.items():
            with self.subTest(field=field):
                self.assertIsNone(self.corrections[field]['preferred'])
                self.assertEqual(self.corrections[field]['status'], status)
        forbidden = {'answer', 'answerKey', 'correctAnswer', 'correctOption'}
        for record in walk(self.source['documentaryExercises']):
            self.assertFalse(forbidden.intersection(record))
        accepted_text = json.dumps({key: value for key, value in self.public.items()
                                   if key in ['phrases', 'dialogues', 'readings',
                                              'grammar', 'documentaryExercises']}, ensure_ascii=False)
        for phrase in ['马大为送他什么礼物', '你是马大为吗', '她1991年出生', '她的女儿属龙']:
            self.assertNotIn(phrase, accepted_text)

    def test_edited_and_new_activities_preserve_their_context(self):
        for number in range(1, 30):
            self.assertIn(f'L5-task-{number:02d}', self.activities)
        for number in range(30, 38):
            activity = self.activities[f'L5-task-{number}']
            self.assertEqual(activity['origin'], 'editorial_adaptation')
            self.assertEqual(activity['assessment'], 'open_practice_no_official_key')
        age = self.activities['L5-task-36']
        self.assertEqual(age['source']['type'], 'textbook')
        self.assertEqual(age['source']['pdfPage'], 18)
        self.assertIn('属马', '\n'.join(age['texts']))
        self.assertNotIn('属龙', '\n'.join(age['texts']))
        self.assertIn('我今年___。', '\n'.join(age['texts']))
        self.assertIn('año de referencia', '\n'.join(self.activities['L5-task-08']['texts']))
        self.assertIn('por la persona indicada por 我',
                      '\n'.join(self.activities['L5-task-22']['texts']))
        # Reading practice does not supply the missing original recording.
        self.assertFalse(self.source['policy']['originalListeningAudioSupplied'])
        for number in [7, 12, 13, 14]:
            self.assertTrue(self.activities[f'L5-task-{number:02d}']['requiresOriginalAudio'])

    def test_new_grammar_examples_keep_individual_source_witnesses(self):
        for identifier in ['g-l5-yixia', 'g-l5-frequency', 'g-l5-lai-action']:
            with self.subTest(grammar=identifier):
                point = self.grammar[identifier]
                self.assertEqual(point['origin'], 'editorial_explanation_of_source')
                self.assertEqual(set(point['examples']),
                                 {witness['hanzi'] for witness in point['evidence']})
        for point in ['g-l5-yixia', 'g-l5-lai-action']:
            self.assertEqual(self.grammar[point]['source']['type'], 'textbook')
        self.assertEqual(self.grammar['g-l5-frequency']['source']['type'], 'class_presentation')
        self.assertIn('我不常喝咖啡，我常常喝茶。', self.grammar['g-l5-frequency']['examples'])

    def test_learner_export_does_not_leak_review_metadata(self):
        forbidden = {'evidence', 'supportingSources', 'origin', 'assessment', 'note_ming',
                     'preferred', 'rejected', 'secondary', 'primary'}
        for record in walk(self.public):
            self.assertFalse(forbidden.intersection(record), forbidden.intersection(record))
        self.assertNotIn('corrections', self.public)
        # Existing grammar SourceRef remains part of the runtime contract;
        # documentary witnesses and assessment decisions do not.
        for activity in self.public['documentaryExercises']:
            self.assertEqual(set(activity), {'id', 'title', 'texts', 'requiresOriginalAudio'})
        for point in self.public['grammar']:
            self.assertEqual(set(point),
                             {'id', 'slug', 'title', 'pattern', 'explanation', 'examples', 'source'})

    def test_validator_accepts_complete_review_with_supplementary_source(self):
        validate_sources(copy.deepcopy(self.source))

    def test_validator_rejects_out_of_range_unknown_and_mistyped_nested_references(self):
        mutations = [
            ('source', 'pdfPage', 0),
            ('source', 'pdfPage', 55),
            ('source', 'pdfPage', '31'),
            ('source', 'file', 'unregistered.pdf'),
            ('source', 'type', 'textbook'),
            ('supportingSources', 'pdfPage', 55),
        ]
        for location, key, value in mutations:
            with self.subTest(location=location, key=key, value=value):
                source = copy.deepcopy(self.source)
                if location == 'source':
                    reference = next(row for row in source['documentaryExercises']
                                     if row['id'] == 'L5-task-30')['source']
                else:
                    reference = next(row for row in source['documentaryExercises']
                                     if row['id'] == 'L5-task-31')['supportingSources'][0]
                reference[key] = value
                with self.assertRaises((AssertionError, KeyError)):
                    validate_sources(source)
        source = copy.deepcopy(self.source)
        next(row for row in source['grammar'] if row['id'] == 'g-l5-frequency')[
            'evidence'][0]['source']['pdfPage'] = 25
        with self.assertRaises(AssertionError):
            validate_sources(source)

    def test_validator_rejects_manufactured_keys_and_duplicate_ids(self):
        for field in ['presentation2.workbook.question_focus',
                      'presentation2.reading.teacher_birth_year',
                      'presentation2.reading.daughter_zodiac']:
            with self.subTest(field=field):
                source = copy.deepcopy(self.source)
                correction = next(row for row in source['corrections'] if row['field'] == field)
                correction['preferred'] = correction['rejected']
                with self.assertRaises(AssertionError):
                    validate_sources(source)
        for key in ['answer', 'answerKey', 'correctAnswer', 'correctOption']:
            with self.subTest(key=key):
                source = copy.deepcopy(self.source)
                source['documentaryExercises'][-1][key] = 'unsupported key'
                with self.assertRaises(AssertionError):
                    validate_sources(source)
        for table in ['vocabulary', 'grammar', 'documentaryExercises']:
            with self.subTest(table=table):
                source = copy.deepcopy(self.source)
                source[table].append(copy.deepcopy(source[table][0]))
                with self.assertRaises(AssertionError):
                    validate_sources(source)


if __name__ == '__main__':
    unittest.main()
