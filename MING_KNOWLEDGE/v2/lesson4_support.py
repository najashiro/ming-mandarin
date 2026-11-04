"""Reviewed L4 language aids, separate from every documentary witness.

Only exact IDs/texts may receive support. Source language wins unless an explicit
display correction identifies a source typo. Contextual vocabulary support never
overwrites an older lesson's reading or source fields.
"""


def apply(tables, vocabulary, phrases, config, dialogue_config):
    seen = set()
    records = []
    for entry in config['entries']:
        name, key = entry['target_table'], entry['target_id']
        if name not in {'vocabulary', 'phrases'} or (name, key) in seen:
            raise ValueError('Unknown or duplicate L4 language-support target')
        seen.add((name, key))
        target = (vocabulary if name == 'vocabulary' else phrases).get(key)
        if not target or target['hanzi'] != entry['hanzi'] or 4 not in target['lessons']:
            raise ValueError('Stale L4 language-support Chinese or lesson')
        if name == 'phrases' and ('counterexample' in target['kinds'] or any(mark in target['hanzi'] for mark in ('…', '_', '□'))):
            raise ValueError('Language support cannot promote incomplete or negative examples')
        resolved = target['lesson4_selection'] if name == 'vocabulary' else target
        incomplete = not resolved.get('pinyin_display') or not resolved.get('spanish_display')
        record = dict(entry, batch=config['batch'], method=config['method'])
        for field, display, source in [('pinyin_ming', 'pinyin_display', 'pinyin'),
                                       ('traduccion_ming', 'spanish_display', 'spanish')]:
            value = entry.get(field)
            if not isinstance(value, str) or not value.strip():
                raise ValueError('Empty L4 language support')
            # Context fields are an independent editorial layer for reused IDs.
            resolved[field] = value
            resolved[field + '_meta'] = dict(batch=config['batch'], method=config['method'])
            previous = resolved.get(display) or resolved.get(source)
            resolved[display] = previous or value
            if field == 'pinyin_ming' and entry.get('pinyin_display_correction'):
                resolved['pinyin_display'] = value
                resolved['pinyin_display_correction'] = entry['pinyin_display_correction']
        if name == 'phrases':
            # Adding reading aids does not authorize newly generated exercises.
            if incomplete:
                target['editorial_support_scope'] = 'vocabulary_example'
            if entry.get('hanzi_display'):
                if not entry.get('hanzi_display_note') or not entry['hanzi_display'].strip():
                    raise ValueError('Display cleanup requires a rationale and nonempty Chinese')
                target['hanzi_display'] = entry['hanzi_display']
                target['hanzi_display_note'] = entry['hanzi_display_note']
        records.append(record)

    for entry in config.get('excluded_vocabulary', []):
        target = vocabulary.get(entry['id'])
        if not target or target['hanzi'] != entry['hanzi']:
            raise ValueError('Stale contextual vocabulary exclusion')
        target['lesson4_selection']['publication_excluded'] = entry['reason']

    for entry in config.get('example_exclusions', []):
        target = vocabulary.get(entry['vocab_id'])
        if (not target or not entry.get('reason')
                or not set(entry['phrase_ids']) <= set(target.get('example_phrase_ids', []))):
            raise ValueError('Unknown contextual example exclusion')
        target['lesson4_selection']['example_phrase_exclusions'] = dict(
            phrase_ids=entry['phrase_ids'], reason=entry['reason'])

    blocks = {b['id']: b for b in tables['document_blocks']}
    for entry in config.get('documentary_spanish_alignments', []):
        phrase = phrases.get(entry['phrase_id'])
        block = blocks.get(entry['block_id'])
        if (not phrase or phrase['hanzi'] != entry['hanzi'] or not block
                or block['source_id'] != 'SRC-BOOK-04' or block['kind'] != 'note'
                or block['text_source'].splitlines()[entry['line']] != entry['expected']):
            raise ValueError('Stale book translation alignment')
        phrase['spanish_source'] = entry['expected']
        phrase['spanish_source_location'] = dict(source_id=block['source_id'], page=block['page'],
            block_id=block['id'], field='text_source', line=entry['line'])
        phrase['spanish_display'] = entry['expected']

    character_records = []
    for entry in config.get('characters', []):
        if not any(w['hanzi'] == entry['hanzi'] and w.get('pinyin_source') == entry['pinyin']
                   and w.get('lesson') == 4 and w.get('kind') == 'worksheet' for w in tables['hanzi_evidence']):
            raise ValueError('Character gloss must match its exact worksheet reading')
        character_records.append(dict(entry, batch=config['batch'], method=config['method']))
    tables['lesson4_character_support'] = character_records

    # The translations already checked against the canonical book dialogue also
    # belong to the same phrase when it is displayed on a vocabulary card.
    witnesses = {(w.get('dialogue_id'), w.get('turn')): w
                 for w in tables['phrase_evidence'] if w.get('canonical') is True}
    for entry in dialogue_config['entries']:
        witness = witnesses.get((entry['dialogue_id'], entry['turn']))
        if not witness or witness['hanzi'] != entry['hanzi'] or witness['source_id'] != 'SRC-BOOK-04':
            raise ValueError('Stale canonical dialogue translation')
        phrase = phrases[witness['phrase_id']]
        # A documentary note (e.g. 回学校) continues to beat editorial support.
        if not phrase.get('spanish_display'):
            phrase['traduccion_ming'] = entry['traduccion_ming']
            phrase['traduccion_ming_meta'] = dict(batch=dialogue_config['batch'], method=dialogue_config['method'])
            phrase['spanish_display'] = entry['traduccion_ming']
            phrase['editorial_support_scope'] = 'vocabulary_example'
    tables['lesson4_language_support'] = records
    tables['lesson4_language_support_summary'] = dict(batch=config['batch'],
        vocabulary=sum(r['target_table'] == 'vocabulary' for r in records),
        phrases=sum(r['target_table'] == 'phrases' for r in records),
        dialogue_translations=len(dialogue_config['entries']),
        documentary_fields_preserved=True, independent_human_review=False)
