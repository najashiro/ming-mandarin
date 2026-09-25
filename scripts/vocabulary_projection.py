"""Allow-listed curricular relationships; no source documents or student data."""
from collections import defaultdict

POSITIVE_KINDS = {'example', 'grammar_example', 'dialogue_turn', 'dialogue_example',
                  'reading', 'writing_model', 'key_phrase', 'writing_prompt',
                  'interview_prompt', 'question_answer_printed', 'translation_answer_printed'}


def enrich_vocabulary(public_vocab, load):
    sources = {r['id']: r for r in load('sources')}
    phrases = {r['id']: r for r in load('phrases')}
    witnesses = defaultdict(list)
    for row in load('phrase_evidence'):
        witnesses[row['phrase_id']].append(row)
    evidence = defaultdict(list)
    for row in load('vocabulary_evidence'):
        evidence[row['vocab_id']].append(row)
    links = defaultdict(list)
    for row in load('word_phrase_links'):
        links[row['vocab_id']].append(row)
    exercises = load('exercises')

    def provenance(row):
        source = sources[row['source_id']]
        offset = source.get('printed_page_offset')
        return {'source': row['source_id'], 'kind': source['kind'],
                'lesson': row.get('lesson'), 'page': row['page'],
                'printedPage': row['page'] + offset if offset is not None else None}

    for word in public_vocab:
        word_witnesses = [w for link in links[word['id']] for w in witnesses[link['phrase_id']] if w['id'] in link['evidence_ids']]
        occurrences = []
        for row in evidence[word['id']]:
            if not row.get('lesson') or row['source_id'].startswith('SRC-PPT-00'):
                continue
            occurrence = {**provenance(row), 'role': row['role'], 'section': None,
                          'item': None, 'evidence': row['id'],
                          'reading': row.get('pinyin_source'), 'meaning': row.get('spanish_source')}
            # An exercise locator is attached only when exact lexical witnesses
            # identify a unique item. Character-substring containment is not evidence.
            texts = {w['hanzi'] for w in word_witnesses if w['source_id'] == row['source_id'] and w['page'] == row['page']}
            locators = {(exercise.get('section'), item.get('number'))
                        for exercise in exercises
                        if exercise.get('source_id') == row['source_id'] and exercise.get('page') == row['page']
                        for item in exercise.get('items', []) if item.get('text_source') in texts}
            if len(locators) == 1:
                occurrence['section'], occurrence['item'] = next(iter(locators))
            occurrences.append(occurrence)
        word['occurrences'] = occurrences
        examples = []
        seen = set()
        for link in links[word['id']]:
            phrase = phrases[link['phrase_id']]
            for row in witnesses[phrase['id']]:
                if row['id'] not in link['evidence_ids'] or row['kind'] not in POSITIVE_KINDS:
                    continue
                if not row.get('lesson') or row['source_id'].startswith('SRC-PPT-00'):
                    continue
                key = (row['hanzi'], row['lesson'])
                if key in seen:
                    continue
                seen.add(key)
                examples.append({'id': row['id'], 'phraseId': phrase['id'],
                                 'hanzi': row['hanzi'], 'pinyin': row.get('pinyin_source'),
                                 'spanish': row.get('spanish_source'), 'status': 'documented',
                                 **provenance(row)})
        word['examples'] = examples
    return public_vocab
