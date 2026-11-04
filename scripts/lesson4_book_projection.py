"""Project explicit L4 book and workbook teaching material without changing IDs.

Writing targets are selected from documentary blocks, never inferred from words.
Compound pinyin remains attached to the compound; it is not split into readings.
"""


def _append_unique(items, item):
    if item not in items:
        items.append(item)


def build_book_reference(tables):
    blocks = {row['id']: row for row in tables['document_blocks']}
    vocabulary = {row['id']: row for row in tables.get('vocabulary', [])}
    character_support = {row['id']: row for row in tables.get('lesson4_character_support', [])}
    catalog = {row['radical']: row for row in tables['radical_catalog']}

    def book(block_id):
        row = blocks[block_id]
        if row['source_id'] != 'SRC-BOOK-04' or row.get('lesson') != 4:
            raise ValueError(f'Expected a lesson 4 textbook block: {block_id}')
        return row

    structure = book('L4-BOOK-04-21-04')
    continuation = book('L4-BOOK-04-22-01')
    # These captions transcribe the explicit examples, checked against both
    # source paragraphs so edits to the underlying evidence cannot drift.
    diagrams = [
        dict(hanzi='男', pinyin='nán', spanish='masculino', label='Superior-inferior, iguales', top=1, bottom=1),
        dict(hanzi='点', pinyin='diǎn', spanish='punto', label='Superior grande, inferior pequeño', top=2, bottom=1),
        dict(hanzi='家', pinyin='jiā', spanish='familia; hogar', label='Superior pequeño, inferior grande', top=1, bottom=2),
    ]
    source_text = structure['text_source'] + '\n' + continuation['text_source']
    for diagram in diagrams:
        if f"{diagram['pinyin']} {diagram['hanzi']} ({diagram['spanish']})" not in source_text:
            raise ValueError(f"Stale character structure caption: {diagram['hanzi']}")
    culture = book('L4-BOOK-04-24-02')
    introduction = book('L4-BOOK-04-01-01')
    situations = []
    for number, context_id, function_ids in [
        (1, 'L4-BOOK-04-02-01', ['L4-BOOK-04-02-03', 'L4-BOOK-04-03-01']),
        (2, 'L4-BOOK-04-05-04', ['L4-BOOK-04-05-06', 'L4-BOOK-04-06-01']),
    ]:
        context = book(context_id)
        situations.append(dict(id=context['id'], title=f'Diálogo {number}',
            context=context['text_source'], functions=[book(block_id)['label'] for block_id in function_ids],
            href=f"/study/l4/dialogues#turn-{context['dialogue_id']}-1"))
    key_phrases = book('L4-BOOK-04-08-02')
    resolved = {phrase['hanzi']: phrase for phrase in tables.get('phrases', [])}
    examples = []
    for item in key_phrases['items']:
        text = item['text_source']
        phrase = resolved.get(text, {})
        if 'phrases' in tables and not (phrase.get('pinyin_display') and phrase.get('spanish_display')):
            raise ValueError(f'Missing exact reading aid for textbook key phrase: {text}')
        examples.append(dict(id=phrase.get('id') or f"{key_phrases['id']}-{item['number']}",
            hanzi=text, pinyin=phrase.get('pinyin_display') or '', spanish=phrase.get('spanish_display') or ''))
    topics = [
        dict(id=introduction['id'], title=introduction['label'], titlePinyin=introduction['pinyin_source'],
             paragraphs=[introduction['text_source']], tables=[], diagrams=[]),
        dict(id='L4-BOOK-DIALOGUE-CONTEXTS', title='Situaciones para conversar',
             paragraphs=[], tables=[], diagrams=[], situations=situations),
        dict(id=key_phrases['id'], title='Frases clave', paragraphs=[], tables=[], diagrams=[], examples=examples),
        dict(id=structure['id'], title='La estructura de los caracteres chinos',
             paragraphs=['Estructura común superior-inferior. Compara el espacio que ocupa cada parte.'],
             tables=[], diagrams=diagrams),
        dict(id=culture['id'], title='El sistema educativo de China',
             paragraphs=culture['text_source'].split('\n'), tables=[], diagrams=[],
             introduction='Lectura cultural del libro.'),
    ]

    radicals = []
    for glyph, name, strokes, examples, explanation in book('L4-BOOK-04-22-02')['rows_source']:
        entry = catalog[glyph]
        if entry.get('metadata_status') != 'explicit_textbook_definition':
            raise ValueError(f'Missing textbook radical definition: {glyph}')
        radicals.append(dict(id=entry['id'], radical=glyph, name='', nameHanzi=name,
            meaning=entry.get('meaning_source') or '', explanation=explanation,
            strokeCount=strokes, lessons=entry['lessons'], authority='textbook',
            examples=[dict(hanzi=h, pinyin=p, spanish=s, lessons=[4]) for h, p, s in examples]))

    details = {}

    def ensure(hanzi):
        if hanzi not in details:
            details[hanzi] = dict(id=f'c-{hanzi}', hanzi=hanzi, primaryReadings=[],
                secondaryReadings=[], components=[], strokeCount=None, contextWords=[])
        return details[hanzi]

    def reading_meaning(hanzi, pinyin, explicit=''):
        if explicit:
            return explicit
        selection = vocabulary.get(f'v-{hanzi}', {}).get('lesson4_selection') or {}
        if selection.get('pinyin') == pinyin:
            return selection.get('spanish_display') or selection.get('spanish') or ''
        support = character_support.get(f'c-{hanzi}') or {}
        return support.get('traduccion_ming', '') if support.get('pinyin') == pinyin else ''

    # Textbook order is retained, followed by the workbook's explicit targets.
    for source_id, authority in [('SRC-BOOK-04', 'textbook'), ('SRC-WB-04', 'workbook')]:
        for block in blocks.values():
            if block.get('lesson') != 4 or block['source_id'] != source_id or block['kind'] != 'writing_targets':
                continue
            for item in block['items']:
                row = ensure(item['hanzi'])
                pinyin = item.get('pinyin_source')
                if not pinyin and item.get('word_source') == item['hanzi']:
                    pinyin = item.get('pinyin_word_source')
                if pinyin:
                    _append_unique(row['primaryReadings'], dict(pinyin=pinyin,
                        meaning=reading_meaning(item['hanzi'], pinyin, item.get('spanish_source') or ''),
                        authority=authority))
                if item.get('components_source'):
                    _append_unique(row['components'], dict(parts=item['components_source'], authority=authority))
                if row['strokeCount'] is None:
                    row['strokeCount'] = item.get('stroke_count_source')
                if item.get('word_source') and item['word_source'] != item['hanzi']:
                    lexical = vocabulary.get(f"v-{item['word_source']}", {}).get('lesson4_selection') or {}
                    meaning = (lexical.get('spanish_display') or lexical.get('spanish') or '') if lexical.get('pinyin') == item.get('pinyin_word_source') else ''
                    _append_unique(row['contextWords'], dict(hanzi=item['word_source'],
                        pinyin=item.get('pinyin_word_source') or '', spanish=meaning, authority=authority))

    # Exact single-character vocabulary can supply a book reading for an
    # already explicit writing target. It does not create new writing targets.
    for hanzi, row in details.items():
        selection = vocabulary.get(f'v-{hanzi}', {}).get('lesson4_selection') or {}
        if selection.get('source_id') == 'SRC-BOOK-04' and selection.get('pinyin'):
            reading = dict(pinyin=selection['pinyin'], meaning=selection.get('spanish_display') or selection.get('spanish') or '', authority='textbook')
            if not any(r['pinyin'] == reading['pinyin'] and r['authority'] == 'textbook' for r in row['primaryReadings']):
                row['primaryReadings'].insert(0, reading)

    # The radical table explicitly teaches isolated readings and meanings too.
    # Keep its sense distinct from the vocabulary sense (刻: esculpir / cuarto).
    for radical in radicals:
        for example in radical['examples']:
            row = details.get(example['hanzi'])
            if row is not None:
                row['primaryReadings'].insert(0, dict(pinyin=example['pinyin'],
                    meaning=example['spanish'], authority='textbook', context='En los radicales'))

    for item in tables.get('hanzi_evidence', []):
        if item.get('lesson') != 4 or item.get('kind') != 'worksheet' or item['hanzi'] not in details:
            continue
        row = details[item['hanzi']]
        pinyin = item.get('pinyin_source')
        if pinyin and not any(r['pinyin'] == pinyin for r in row['primaryReadings']):
            _append_unique(row['secondaryReadings'], dict(pinyin=pinyin,
                meaning=reading_meaning(item['hanzi'], pinyin, item.get('spanish_source') or ''),
                authority='worksheet'))
        if row['strokeCount'] is None:
            row['strokeCount'] = item.get('strokes_source')

    return dict(topics=topics, radicals=radicals, characterDetails=list(details.values()))
