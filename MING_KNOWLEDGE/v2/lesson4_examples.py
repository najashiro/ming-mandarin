"""Phrase-scoped L4 examples, applied after L4 witnesses and lexical links exist.

Documentary note alignment is separate from editorial language support and from
lexical tokenization. Neither this layer nor its exports invent curricular IDs.
"""


def apply(tables, vocabulary, phrases, config):
    witnesses = {row['id']: row for row in tables['phrase_evidence']}
    blocks = {row['id']: row for row in tables['document_blocks']}
    seen = set()
    support = []
    for entry in config['entries']:
        vid, pid, via = (entry[key] for key in ('vocab_id', 'phrase_id', 'via_vocab_id'))
        if (vid, pid) in seen or vid not in vocabulary or via not in vocabulary or pid not in phrases:
            raise ValueError('Unknown or duplicate L4 example association')
        seen.add((vid, pid))
        phrase = phrases[pid]
        witness = witnesses.get(entry['evidence_id'])
        if (phrase['hanzi'] != entry['hanzi'] or not witness
                or witness['phrase_id'] != pid or witness['hanzi'] != entry['hanzi']
                or witness.get('lesson') != 4
                or witness['kind'] not in {'example', 'dialogue_turn'}
                or witness.get('canonical') is False
                or 'counterexample' in phrase['kinds']
                or any(mark in phrase['hanzi'] for mark in ('…', '_', '□'))
                or via not in phrase['vocab_ids']):
            raise ValueError('Stale or ineligible L4 example witness')
        if not any(link['vocab_id'] == via and link['phrase_id'] == pid
                   and entry['evidence_id'] in link['evidence_ids']
                   for link in tables['word_phrase_links']):
            raise ValueError('L4 example requires its exact lexical witness')
        record = dict(entry, batch=config['batch'], method=config['method'])
        documentary = entry.get('documentary_spanish')
        if documentary:
            block = blocks.get(documentary['block_id'])
            if not block or block['source_id'] != 'SRC-BOOK-04' or block['kind'] != 'note':
                raise ValueError('Unknown documentary translation note')
            lines = block.get(documentary['field'], '').splitlines()
            line = documentary['line']
            if not 0 <= line < len(lines) or lines[line] != documentary['expected'] or not lines[line].strip():
                raise ValueError('Stale documentary translation alignment')
            # This note is on a different page. Do not assign its Spanish to the
            # dialogue witness, which did not print a translation.
            record['spanish_source'] = lines[line]
            record['spanish_source_location'] = dict(source_id=block['source_id'], page=block['page'],
                printed_page=block['printed_page'], block_id=block['id'], field=documentary['field'], line=line)
            phrase['spanish_source'] = lines[line]
            phrase['spanish_source_location'] = record['spanish_source_location']
            phrase['spanish_display'] = phrase.get('spanish_display') or lines[line]
        if any(key in entry for key in ('pinyin_ming', 'traduccion_ming')):
            phrase['editorial_support_scope'] = 'vocabulary_example'
        for editorial, display in [('pinyin_ming', 'pinyin_display'), ('traduccion_ming', 'spanish_display')]:
            if editorial in entry:
                if not isinstance(entry[editorial], str) or not entry[editorial].strip():
                    raise ValueError('Empty L4 editorial support')
                phrase[editorial] = entry[editorial]
                phrase[editorial + '_meta'] = dict(batch=config['batch'], method=config['method'])
                phrase[display] = phrase.get(display) or entry[editorial]
        vocabulary[vid]['example_phrase_ids'] = list(dict.fromkeys(vocabulary[vid].get('example_phrase_ids', []) + [pid]))
        phrase['example_vocab_ids'] = list(dict.fromkeys(phrase.get('example_vocab_ids', []) + [vid]))
        tables['pedagogical_example_links'].append(dict(id='EX-L4-' + vid + '-' + pid,
            vocab_id=vid, phrase_id=pid, relation='explicit_phrase_scoped', via_vocab_id=via,
            composition_id=None, evidence_ids=[entry['evidence_id']], batch=config['batch']))
        support.append(record)
    tables['lesson4_example_support'] = support
