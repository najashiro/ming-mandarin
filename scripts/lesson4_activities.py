"""Learner-ready L4 activities with explicitly linked, audited book premises.

No source mutation, generated answers, handwritten keys or page scans. Links
were checked against the original textbook/workbook PDFs on 2026-11-04.
"""

TEXT_KEYS = {'text_source', 'hanzi', 'pinyin_source', 'spanish_source',
             'instruction_source', 'prompt_source', 'label_source',
             'underlined_source', 'dialogue', 'gloss_source',
             'printed_model_response', 'model_source', 'hands_description'}
PRINTED_LISTS = {'right_choices_source', 'choices_source', 'glyphs',
                 'word_bank_source', 'printed_insertions_source',
                 'substitutions_source', 'substitution_rows_source',
                 'offered_source', 'visual_objects'}

# Relationships are explicit; neither adjacent pages nor substring matches are
# evidence that a table/reading belongs to an exercise.
PREMISES = {
    'L4-BOOK-04-17-03': ['L4-BOOK-04-17-02'],
    'L4-BOOK-04-19-03': ['L4-BOOK-04-19-02'],
    'L4-BOOK-04-20-02': ['L4-BOOK-04-20-01'],
    'L4-BOOK-04-20-04': ['L4-BOOK-04-20-05', 'L4-BOOK-04-21-01'],
    'L4-BOOK-04-21-02': ['L4-BOOK-04-21-03'],
    'L4-WB-04-02-03': ['L4-WB-04-02-04'],
    'L4-WB-04-06-03': ['L4-WB-04-07-01'],
    'L4-WB-04-09-02': ['L4-WB-04-09-01'],
    'L4-WB-04-10-01': ['L4-WB-04-09-03'],
    'L4-WB-04-10-02': ['L4-WB-04-10-03', 'L4-WB-04-10-04'],
    'L4-WB-04-11-01': ['L4-WB-04-11-02'],
    'L4-WB-04-11-03': ['L4-WB-04-11-04'],
    'L4-PPT-04-1-03-01': ['L4-PPT-04-1-03-02'],
    'L4-PPT-04-1-12-01': ['L4-PPT-04-1-12-02'],
}

# Accessible descriptions visually rechecked against textbook PDF18. These are
# editorial aids, not replacement source captions or solutions to the blanks.
SCENES = {
    'L4-BOOK-04-18-01': [
        'Dos estudiantes conversan; se ilustra una invitación al cine y una respuesta afirmativa: «Vale».',
        'Dos estudiantes conversan; un bocadillo ilustra una propuesta de correr y la otra persona rechaza la invitación.',
    ],
}
UNDERLINES = {
    # Visually verified in textbook PDF20: useful substitution prompts.
    'L4-BOOK-04-20-03': ['明天', '今天下午', '看电影', '马大为家', '', '明天下午'],
}
FILLABLE_TABLES = {'L4-WB-04-02-04', 'L4-BOOK-04-20-05', 'L4-BOOK-04-21-01'}


def _strings(value):
    if isinstance(value, str):
        return [value]
    if isinstance(value, list):
        return [s for v in value for s in _strings(v)]
    if isinstance(value, dict):
        return [s for v in value.values() for s in _strings(v)]
    return []


def legacy_texts(value):
    """Retain the previous flat contract for consumers outside this renderer."""
    if isinstance(value, list):
        return [s for v in value for s in legacy_texts(v)]
    if isinstance(value, dict):
        return [s for k, v in value.items() for s in (
            [v] if k in TEXT_KEYS and isinstance(v, str) and v.strip()
            else [' · '.join(_strings(v))] if k in PRINTED_LISTS
            else legacy_texts(v) if isinstance(v, (dict, list)) else [])]
    return []


def _choices(value):
    if isinstance(value, dict):
        return [dict(label=str(label), text=text) for label, text in value.items()]
    result = []
    for index, item in enumerate(value or []):
        if isinstance(item, str):
            result.append(dict(label=str(index + 1), text=item))
        else:
            result.append(dict(label=item.get('label', str(index + 1)),
                               text=item.get('hanzi', item.get('text_source', '')),
                               pinyin=item.get('pinyin_source', '')))
    return result


def _item(row):
    result = dict(label=str(row.get('original_number', row['number'])),
                  text=row['text_source'], pinyin=row.get('pinyin_source', ''),
                  underlined=row.get('underlined_source', ''),
                  choices=_choices(row.get('choices_source')),
                  substitutions=row.get('substitution_rows_source',
                                        [[v] for v in row.get('substitutions_source', [])]),
                  offered=row.get('offered_source', []),
                  role=row.get('role', ''), part=row.get('part', ''),
                  dialogue=row.get('dialogue', ''), scene=row.get('scene_ming', ''),
                  gloss=row.get('gloss_source', ''),
                  modelResponse=row.get('printed_model_response', ''),
                  language=row.get('language', ''))
    # A model occupies an internal item index, but is not question 1 in print.
    if result['role'] == 'printed_model':
        result['label'] = 'Ejemplo'
    return result


def _passage(row, public):
    resolved = public.get(row['id'], {})
    return dict(id=row['id'], title=resolved.get('title', row.get('label', '')),
                text=resolved.get('hanzi', row.get('text_source', '')),
                pinyin=resolved.get('pinyin', row.get('pinyin_source', '')),
                spanish=resolved.get('spanish', ''),
                kind=row['kind'])


def build_activities(exercises, document_blocks, readings=()):
    """Return existing activities plus structured learner fields.

    Inputs are the typed `exercises` and `document_blocks` tables (L4 filtering
    is applied here), with optional resolved public readings for language aids.
    Existing id/title/texts/requiresOriginalAudio fields remain compatible.
    """
    blocks = {b['id']: b for b in document_blocks}
    public = {r['id']: r for r in readings}
    result = []
    for exercise in exercises:
        if exercise.get('lesson') != 4:
            continue
        # Prefer document blocks: source correction overlays are applied there.
        row = blocks.get(exercise['id'], exercise)
        items = [_item(i) for i in row.get('items', [])]
        if row['id'] in SCENES:
            for item, scene in zip(items, SCENES[row['id']]):
                item['scene'] = scene
        if row['id'] in UNDERLINES:
            for item, underlined in zip(items, UNDERLINES[row['id']]):
                item['underlined'] = underlined
        if items and items[0]['role'] == 'printed_model':
            for number, item in enumerate(items[1:], 1):
                item['label'] = str(number)
        structured = dict(instruction=row.get('text_source', ''), items=items,
                          choices=_choices(row.get('right_choices_source', row.get('choices_source'))),
                          wordBank=row.get('word_bank_source', row.get('printed_insertions_source', [])),
                          tables=[], passages=[], visuals=[], models=[], clocks=[],
                          providedInsertions=row.get('printed_insertions_source', []),
                          relatedActivityIds=[])
        if row.get('model_source'):
            structured['models'].append(dict(id=row['id']+'-model', title='Ejemplo',
                                             text=row['model_source'], pinyin='', spanish='', kind='writing_model'))
        for block_id in PREMISES.get(row['id'], []):
            if block_id not in blocks:
                raise ValueError(f'Missing activity premise {row["id"]}: {block_id}')
            premise = blocks[block_id]
            if premise['kind'] == 'table':
                structured['tables'].append(dict(id=block_id, title=premise.get('label', ''),
                    columns=premise['columns_source'], rows=premise['rows_source'],
                    dateFields=premise.get('date_fields_source', []),
                    fillable=block_id in FILLABLE_TABLES,
                    kind='character-grid' if block_id == 'L4-WB-04-07-01' else 'table'))
            elif premise['kind'] in ('reading', 'writing_model'):
                key = 'models' if premise['kind'] == 'writing_model' else 'passages'
                structured[key].append(_passage(premise, public))
            elif premise['kind'] == 'visual':
                structured['visuals'].append(dict(id=block_id, title=premise.get('title_ming', ''),
                    description=premise.get('description_ming', ''),
                    texts=premise.get('visible_text_source', []),
                    panels=[dict(label=p['label'], rows=p['symbol_grid']) for p in premise.get('panels', []) if 'symbol_grid' in p],
                    descriptions=[dict(label=p.get('label', p.get('position', '')),
                        text=' · '.join(p[k] for k in ('digital_label', 'digital_source', 'hands_ming', 'other_display_source') if p.get(k)))
                        for p in premise.get('clock_panels', premise.get('panels', [])) if 'symbol_grid' not in p]))
        if row['id'] == 'L4-BOOK-04-01-03':
            # Visually verified textbook PDF1, printed113; these are the figures,
            # never a mapping from questions to correct options.
            structured['clocks'] = [dict(label=label, hour=hour, minute=minute)
                for label, hour, minute in [('a', 2, 0), ('b', 8, 0), ('c', 3, 30), ('d', 10, 10)]]
        if row['id'] == 'L4-WB-04-11-03':
            structured['relatedActivityIds'] = ['L4-WB-04-02-03']
        context = blocks.get(row.get('grammar_source_block_id'), {}).get('label', '')
        source_title = {'SRC-BOOK-04': 'Libro de texto', 'SRC-WB-04': 'Libro de ejercicios'}.get(row['source_id'], 'Presentación de clase')
        result.append(dict(id=row['id'], title=row.get('label', exercise['label']), sourceTitle=source_title,
                           texts=legacy_texts(row),
                           requiresOriginalAudio=row.get('answer_status') == 'requires_original_audio',
                           context=context, structured=structured))
    source_order = {'Libro de texto': 0, 'Libro de ejercicios': 1, 'Presentación de clase': 2}
    return sorted(result, key=lambda activity: source_order[activity['sourceTitle']])
