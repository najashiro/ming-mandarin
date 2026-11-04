"""Restore explicit printed-row relationships after rereading the original PDF."""


def apply(tables, vocabulary, phrases, config):
    phrase_evidence = {r['id']: r for r in tables['phrase_evidence']}
    vocabulary_evidence = {r['id']: r for r in tables['vocabulary_evidence']}
    selections = []
    for entry in config['display_selections']:
        phrase = phrases[entry['phrase_id']]
        witness = phrase_evidence[entry['phrase_evidence_id']]
        if (phrase['hanzi'] != entry['previous_aggregate_hanzi']
                or witness['phrase_id'] != phrase['id'] or witness['hanzi'] != entry['hanzi']
                or witness['kind'] != 'collocation' or witness['source_id'] != config['source_id']
                or any(mark in witness['hanzi'] for mark in ('_', '…', '□'))):
            raise ValueError('Invalid complete textbook display witness')
        phrase['hanzi_display'] = witness['hanzi']
        phrase['hanzi_display_source'] = dict(evidence_id=witness['id'], source_id=witness['source_id'], page=witness['page'])
        phrase['editorial_support_scope'] = 'vocabulary_example'
        for field, display in [('pinyin_ming', 'pinyin_display'), ('traduccion_ming', 'spanish_display')]:
            if not entry[field].strip():
                raise ValueError('Empty support for selected textbook witness')
            phrase[field] = entry[field]
            phrase[field + '_meta'] = dict(batch=config['batch'], method=config['review_method'])
            phrase[display] = phrase.get(display) or entry[field]
        selections.append(dict(entry, batch=config['batch']))

    seen = set()
    for entry in config['collocation_links']:
        vid, pid = entry['vocab_id'], entry['phrase_id']
        pair = (vid, pid)
        word_witness = vocabulary_evidence[entry['vocabulary_evidence_id']]
        phrase_witness = phrase_evidence[entry['phrase_evidence_id']]
        if (pair in seen or word_witness['vocab_id'] != vid
                or word_witness['source_id'] != config['source_id']
                or phrase_witness['block_id'] != word_witness['block_id']
                or phrase_witness['kind'] != 'collocation'
                or phrase_witness['phrase_id'] != pid or phrase_witness['hanzi'] != entry['text']
                or entry['text'] not in word_witness['collocations_source'].split('|')):
            raise ValueError('Collocation link must match the exact printed vocabulary row')
        seen.add(pair)
        word, phrase = vocabulary[vid], phrases[pid]
        word['example_phrase_ids'] = list(dict.fromkeys(word.get('example_phrase_ids', []) + [pid]))
        phrase['example_vocab_ids'] = list(dict.fromkeys(phrase.get('example_vocab_ids', []) + [vid]))
        key = f'EX-L4-BOOK-ROW-{vid}-{pid}'
        if not any(link['id'] == key for link in tables['pedagogical_example_links']):
            tables['pedagogical_example_links'].append(dict(id=key, vocab_id=vid, phrase_id=pid,
                relation='printed_vocabulary_collocation', via_vocab_id=None, composition_id=None,
                evidence_ids=[phrase_witness['id']], vocabulary_evidence_id=word_witness['id'], batch=config['batch']))
    tables['lesson4_book_review'] = dict(config, resolved_display_selections=selections)
