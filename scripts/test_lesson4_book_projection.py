"""Regression checks for authority and reading boundaries in the study supplement."""
import copy
import unittest

from lesson4_book_projection import build_book_reference


def block(block_id, kind, **fields):
    return dict(id=block_id, kind=kind, lesson=4, source_id='SRC-BOOK-04', **fields)


def fixture():
    return dict(document_blocks=[
        block('L4-BOOK-04-01-01', 'introduction', label='你明天几点有课 / A qué hora tienes clase mañana',
              text_source='Preguntas sobre el tiempo y los números.', pinyin_source='Nǐ míngtiān jǐ diǎn yǒu kè'),
        block('L4-BOOK-04-02-01', 'dialogue_context', text_source='Invitación al cine.', dialogue_id='DLG-L4-BOOK-T1'),
        block('L4-BOOK-04-05-04', 'dialogue_context', text_source='Charla en una cafetería.', dialogue_id='DLG-L4-BOOK-T2'),
        block('L4-BOOK-04-02-03', 'function', label='Hablar sobre los estudios'),
        block('L4-BOOK-04-03-01', 'function', label='Proponer una cita'),
        block('L4-BOOK-04-05-06', 'function', label='Preguntar la hora'),
        block('L4-BOOK-04-06-01', 'function', label='Preguntar la especialidad'),
        block('L4-BOOK-04-08-02', 'examples', items=[dict(number=1, text_source='现在几点？')]),
        block('L4-BOOK-04-21-04', 'hanzi_structure', text_source='nán 男 (masculino)'),
        block('L4-BOOK-04-22-01', 'hanzi_structure', text_source='diǎn 点 (punto)\njiā 家 (familia; hogar)'),
        block('L4-BOOK-04-24-02', 'culture', text_source='Primer párrafo.\nSegundo párrafo.'),
        block('L4-BOOK-04-22-02', 'table', rows_source=[
            ['刂', '立刀旁', 2, [['刻', 'kè', 'esculpir'], ['别', 'bié', 'separar']], 'Relacionado con “cuchillo”'],
            ['日', '日字旁', 4, [['明', 'míng', 'brillante'], ['时', 'shí', 'tiempo'], ['晚', 'wǎn', 'tarde']], 'Relacionado con “sol”'],
        ]),
        block('writing', 'writing_targets', items=[
            dict(hanzi='明', word_source='明天', pinyin_word_source='míngtiān', components_source=['日', '月'], stroke_count_source=8),
            dict(hanzi='别', word_source='特别', pinyin_word_source='tèbié', components_source=['口', '力', '刂']),
            dict(hanzi='刻', word_source='刻', pinyin_word_source='kè', components_source=['亥', '刂']),
            dict(hanzi='特', word_source='特别', pinyin_word_source='tèbié'),
        ]),
        dict(id='workbook', source_id='SRC-WB-04', kind='writing_targets', lesson=4, items=[
            dict(hanzi='只', pinyin_source='zhǐ'),
            dict(hanzi='别', pinyin_source='bié', components_source=['另', '刂']),
        ]),
    ], radical_catalog=[
        dict(id='RAD-U5202', radical='刂', metadata_status='explicit_textbook_definition', meaning_source='cuchillo', lessons=[4]),
        dict(id='RAD-U65E5', radical='日', metadata_status='explicit_textbook_definition', meaning_source='sol', lessons=[3, 4]),
    ], vocabulary=[
        dict(id='v-只', lesson4_selection=dict(source_id='SRC-BOOK-04', pinyin='zhǐ', spanish='solo')),
        dict(id='v-刻', lesson4_selection=dict(source_id='SRC-BOOK-04', pinyin='kè', spanish='cuarto (de una hora)')),
        dict(id='v-明天', lesson4_selection=dict(source_id='SRC-BOOK-04', pinyin='míngtiān', spanish='mañana')),
    ], hanzi_evidence=[
        dict(hanzi='只', kind='worksheet', lesson=4, pinyin_source='zhī', strokes_source=5),
        dict(hanzi='特', kind='worksheet', lesson=4, pinyin_source='tè', strokes_source=10),
    ], lesson4_character_support=[dict(id='c-只', pinyin='zhī', traduccion_ming='clasificador')],
        phrases=[dict(id='phrase-now', hanzi='现在几点？', pinyin_display='Xiànzài jǐ diǎn?', spanish_display='¿Qué hora es ahora?')])


class BookProjectionTest(unittest.TestCase):
    def setUp(self):
        self.tables = fixture()
        self.result = build_book_reference(self.tables)
        self.characters = {row['hanzi']: row for row in self.result['characterDetails']}

    def test_book_reading_precedes_workbook_and_preserves_alternative(self):
        row = self.characters['只']
        self.assertEqual(row['primaryReadings'][0], dict(pinyin='zhǐ', meaning='solo', authority='textbook'))
        self.assertEqual(row['secondaryReadings'], [dict(pinyin='zhī', meaning='clasificador', authority='worksheet')])

    def test_compound_reading_never_becomes_isolated_reading(self):
        self.assertEqual(self.characters['特']['primaryReadings'], [])
        self.assertEqual(self.characters['特']['secondaryReadings'][0]['pinyin'], 'tè')
        self.assertEqual(self.characters['明']['contextWords'][0]['pinyin'], 'míngtiān')
        self.assertEqual(self.characters['明']['contextWords'][0]['spanish'], 'mañana')
        self.assertNotIn('míngtiān', [r['pinyin'] for r in self.characters['明']['primaryReadings']])

    def test_radical_example_does_not_create_writing_target(self):
        self.assertNotIn('晚', self.characters)
        radical = self.result['radicals'][0]
        self.assertEqual((radical['id'], radical['name'], radical['nameHanzi']), ('RAD-U5202', '', '立刀旁'))

    def test_distinct_book_and_workbook_components_and_senses_survive(self):
        self.assertEqual(self.characters['别']['components'], [
            dict(parts=['口', '力', '刂'], authority='textbook'), dict(parts=['另', '刂'], authority='workbook')])
        self.assertEqual({r['meaning'] for r in self.characters['刻']['primaryReadings']}, {'esculpir', 'cuarto (de una hora)'})

    def test_projection_does_not_modify_evidence(self):
        before = copy.deepcopy(self.tables)
        build_book_reference(self.tables)
        self.assertEqual(before, self.tables)

    def test_changed_source_caption_is_rejected(self):
        next(row for row in self.tables['document_blocks'] if row['id'] == 'L4-BOOK-04-21-04')['text_source'] = 'otro ejemplo'
        with self.assertRaisesRegex(ValueError, 'Stale character structure caption'):
            build_book_reference(self.tables)

    def test_key_phrase_support_requires_an_exact_match(self):
        self.tables['phrases'][0]['hanzi'] = '现在几点了？'
        with self.assertRaisesRegex(ValueError, 'Missing exact reading aid'):
            build_book_reference(self.tables)


if __name__ == '__main__':
    unittest.main()
