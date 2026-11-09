"""Reviewed L1–L3 corrections and examples; documentary witnesses stay immutable."""
from __future__ import annotations
import copy
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
REVIEW = ROOT / 'lessons123'


def dependency_paths():
    return [Path(__file__), REVIEW / 'lesson12-review.json', REVIEW / 'lesson3-review.json']


def ref_string(ref):
    return ref if isinstance(ref, str) else f"{ref['source_id']}:p{ref['page']:03d}"


def apply(tables, configs=None):
    vocabulary = {r['id']: r for r in tables['vocabulary']}
    phrases = {r['id']: r for r in tables['phrases']}
    sources = {r['id']: r for r in tables['sources']}
    witnesses = {r['id']: r for r in tables['phrase_evidence']}
    lexical_links = {(r['vocab_id'], r['phrase_id']): r for r in tables['word_phrase_links']}
    records, links, additions = [], [], []
    lexical_words = set()
    new_lexical_links = 0
    reviewed_words = set()
    for word in vocabulary.values():
        if not set(word.get('lessons', [])) & {1, 2, 3}:
            continue
        reviewed_words.add(word['id'])
        # Exact vocabulary witnesses in the original lessons; never isolated
        # worksheet readings or a different contextual sense introduced in L4.
        selected = {}
        for field, variants in [('pinyin', 'pinyin_variants'), ('spanish', 'spanish_variants')]:
            candidates = [v for v in word.get(variants, []) if v.get('value')
                and sources.get(v.get('source_id'), {}).get('kind') in ('textbook', 'workbook')
                and v.get('source_id') not in ('SRC-BOOK-04', 'SRC-WB-04')]
            if candidates:
                winner = candidates[0]
                selected[field + '_source'] = winner['value']
                selected[field + '_source_ref'] = ref_string(winner)
                word[field + '_display'] = winner['value']
        word['lessons123_selection'] = selected
    # Phrase display similarly favors an exact primary-source witness.
    for phrase in phrases.values():
        if not set(phrase.get('lessons', [])) & {1, 2, 3}:
            continue
        primary = [witnesses[i] for i in phrase.get('evidence_ids', []) if i in witnesses
            and witnesses[i].get('lesson') in (1, 2, 3)
            and sources[witnesses[i]['source_id']]['kind'] in ('textbook', 'workbook')]
        for field in ('pinyin', 'spanish'):
            winner = next((w for w in primary if w.get(field + '_source')), None)
            if winner:
                phrase[field + '_display'] = winner[field + '_source']
    if configs is None:
        configs = [json.loads(path.read_text(encoding='utf-8')) for path in dependency_paths()[1:]]
    for config in configs:
        for key in ('vocabulary_updates', 'phrase_updates', 'new_phrases', 'example_links'):
            for entry in config.get(key, []):
                for ref in entry.get('source_refs', []) + entry.get('basis_refs', []):
                    location = ref_string(ref)
                    sid, page = location.split(':p')
                    if sid not in sources or not 1 <= int(page) <= sources[sid]['pages']:
                        raise ValueError(f'Invalid L1–L3 source reference: {location}')
        for group, targets in [('vocabulary_updates', vocabulary), ('phrase_updates', phrases)]:
            for entry in config.get(group, []):
                row = targets.get(entry['id'])
                if not row or row['hanzi'] != entry['hanzi']:
                    raise ValueError(f"Stale L1–L3 correction: {entry['id']}")
                if not entry.get('reason'):
                    raise ValueError('Every display correction needs a rationale')
                support = copy.deepcopy(entry)
                support['batch_id'] = config['batch_id']
                for field, editorial in [('pinyin', 'pinyin_ming'), ('spanish', 'traduccion_ming')]:
                    value = entry.get(field + '_source') or entry.get(editorial)
                    if value:
                        row[field + '_display'] = value
                row.setdefault('lessons123_support', []).append(support)
                records.append(dict(support, target_table='vocabulary' if group == 'vocabulary_updates' else 'phrases'))
        if config.get('missing_vocabulary'):
            raise ValueError('New vocabulary requires explicit curriculum and visual classification before publication')
        for entry in config.get('new_phrases', []):
            existing = phrases.get(entry['id'])
            if existing and existing['hanzi'] != entry['hanzi']:
                raise ValueError(f"Conflicting new L1–L3 phrase: {entry['id']}")
            if any(mark in entry['hanzi'] for mark in ('…', '_', '□')) or 'counterexample' in entry['kinds']:
                raise ValueError('Cannot publish an incomplete or negative example')
            editorial = entry.get('origin') == 'ming_editorial_example' or entry.get('editorial') is True
            refs = [ref_string(r) for r in entry.get('source_refs', [])]
            if editorial and refs:
                raise ValueError('An editorial example must not claim documentary occurrences')
            if not editorial and (entry.get('origin') != 'source_transcription' or not refs):
                raise ValueError('A recovered source phrase needs an explicit origin and source reference')
            vocab_ids = entry.get('vocab_ids')
            if (not isinstance(vocab_ids, list) or not vocab_ids
                    or any(not isinstance(vid, str) or vid not in vocabulary for vid in vocab_ids)
                    or len(set(vocab_ids)) != len(vocab_ids)):
                raise ValueError(f"Invalid explicit vocabulary IDs for L1–L3 phrase: {entry['id']}")
            pinyin = entry.get('pinyin_source') or entry.get('pinyin_ming')
            spanish = entry.get('spanish_source') or entry.get('traduccion_ming')
            if not pinyin or not spanish:
                raise ValueError(f"Incomplete new example: {entry['id']}")
            row = dict(id=entry['id'], hanzi=entry['hanzi'], lessons=entry['lessons'], kinds=entry['kinds'],
                pinyin=entry.get('pinyin_source'), spanish=entry.get('spanish_source'),
                pinyin_ming=entry.get('pinyin_ming'), traduccion_ming=entry.get('traduccion_ming'),
                pinyin_display=pinyin, spanish_display=spanish,
                vocab_ids=list(vocab_ids), example_vocab_ids=[], source_refs=refs,
                evidence_ids=[], dialogue_ids=[], grammar_ids=[], exercise_ids=[],
                curriculum_links=[dict(lesson=l, kind='example') for l in entry['lessons']],
                lessons123_support=[dict(entry, batch_id=config['batch_id'])],
                editorial_support_scope='vocabulary_example')
            if refs:
                for index, ref in enumerate(entry['source_refs']):
                    if isinstance(ref, str):
                        sid, page = ref.split(':p'); page = int(page)
                    else:
                        sid, page = ref['source_id'], ref['page']
                    evidence_id = 'PE-L123-' + hashlib.sha256(f"{entry['id']}|{sid}|{page}".encode()).hexdigest()[:16]
                    witness = dict(id=evidence_id, phrase_id=entry['id'], source_id=sid, page=page,
                        lesson=entry['lessons'][0], kind=entry['kinds'][0], hanzi=entry['hanzi'],
                        pinyin_source=entry.get('pinyin_source'), spanish_source=entry.get('spanish_source'),
                        dialogue_id=None, turn=None, review_status='model_checked_from_pdf')
                    if evidence_id in witnesses:
                        if witnesses[evidence_id] != witness:
                            raise ValueError(f'Conflicting recovered source witness: {evidence_id}')
                    else:
                        tables['phrase_evidence'].append(witness)
                        witnesses[evidence_id] = witness
                    row['evidence_ids'].append(evidence_id)
            if existing:
                for field in ('lessons', 'kinds', 'source_refs', 'evidence_ids'):
                    existing[field] = list(dict.fromkeys(existing.get(field, []) + row[field]))
                existing.setdefault('lessons123_support', []).extend(row['lessons123_support'])
                for field in ('pinyin_display', 'spanish_display'):
                    if not existing.get(field):
                        existing[field] = row[field]
            else:
                phrases[row['id']] = row
            if not editorial:
                # These tokens were explicitly reviewed against the recovered
                # source phrase. Do not infer other words from substrings or
                # rewrite an existing phrase's historical tokenization.
                for vid in vocab_ids:
                    word = vocabulary[vid]
                    if entry['id'] not in word['phrase_ids']:
                        word['phrase_ids'].append(entry['id'])
                    word['phrase_count'] = len(word['phrase_ids'])
                    lexical_words.add(vid)
                    pair = (vid, entry['id'])
                    if pair in lexical_links:
                        link = lexical_links[pair]
                        link['evidence_ids'] = list(dict.fromkeys(link.get('evidence_ids', []) + row['evidence_ids']))
                    else:
                        link = dict(vocab_id=vid, phrase_id=entry['id'], relation='lexical_token',
                            method='explicit_reviewed_source_lexicon', evidence_ids=list(row['evidence_ids']))
                        tables['word_phrase_links'].append(link)
                        lexical_links[pair] = link
                        new_lexical_links += 1
            additions.append(dict(entry, batch_id=config['batch_id']))
        for entry in config.get('example_links', []):
            word, phrase = vocabulary.get(entry['vocab_id']), phrases.get(entry['phrase_id'])
            if not word or not phrase:
                raise ValueError(f"Dangling L1–L3 example link: {entry}")
            if not phrase.get('pinyin_display') or not phrase.get('spanish_display'):
                raise ValueError(f"Incomplete linked example: {entry['phrase_id']}")
            if 'counterexample' in phrase['kinds'] or any(x in phrase['hanzi'] for x in ('…', '_', '□')):
                raise ValueError('Invalid pedagogical example')
            if phrase['id'] not in word['example_phrase_ids']:
                word['example_phrase_ids'].append(phrase['id'])
            if word['id'] not in phrase['example_vocab_ids']:
                phrase['example_vocab_ids'].append(word['id'])
            link = dict(entry, id=f"EX-L123-{entry['vocab_id']}-{entry['phrase_id']}",
                batch_id=config['batch_id'], via_vocab_id=entry.get('via_vocab_id'), composition_id=None,
                evidence_ids=list(phrase.get('evidence_ids', [])))
            links.append(link)
            if not any(x['vocab_id'] == entry['vocab_id'] and x['phrase_id'] == entry['phrase_id'] for x in tables['pedagogical_example_links']):
                tables['pedagogical_example_links'].append(link)
    def priority(pid):
        refs = phrases[pid].get('source_refs', [])
        if any(sources.get(r.split(':p')[0], {}).get('kind') in ('textbook', 'workbook') for r in refs):
            return 0
        return 1 if refs else 2
    for vid in reviewed_words:
        word = vocabulary[vid]
        word['example_phrase_ids'] = sorted(word['example_phrase_ids'], key=priority)
    tables['phrases'] = list(phrases.values())
    tables['lessons123_language_support'] = records
    tables['lessons123_example_links'] = links
    tables['lessons123_new_phrases'] = additions
    tables['lessons123_review_summary'] = dict(
        batch='ming-lessons123-20261104', vocabulary_reviewed=len(reviewed_words),
        corrections=len(records), added_phrases=len(additions), added_example_links=len(links),
        added_source_lexical_links=new_lexical_links,
        books_before_presentations=True, documentary_fields_preserved=True,
        independent_human_review=False)
    for row in tables['matrix']:
        if row['id'] in lexical_words:
            word = vocabulary[row['id']]
            row['phrase_ids'] = list(word['phrase_ids'])
            row['phrase_count'] = word['phrase_count']
        if row['id'] in reviewed_words:
            word = vocabulary[row['id']]
            for field in ('pinyin_display', 'spanish_display', 'example_phrase_ids', 'lessons123_selection', 'lessons123_support'):
                if field in word:
                    row[field] = copy.deepcopy(word[field])
    tables['validation']['lessons123_review'] = tables['lessons123_review_summary']

    for name, value in tables.items():
        if isinstance(value, list):
            tables['validation']['counts'][name] = len(value)
            tables['index']['counts_v22'][name] = len(value)
    tables['index']['stats']['phrases_unique'] = len(tables['phrases'])
    tables['index']['stats']['phrase_source_occurrences'] = len(tables['phrase_evidence'])
    tables['index']['stats']['word_phrase_links'] = len(tables['word_phrase_links'])
    tables['index']['lessons123_review'] = tables['lessons123_review_summary']
