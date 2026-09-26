"""Global example links from lexical witnesses plus explicit semantic compositions.

Source token links are immutable. Editorial inheritance is one hop and opt-in.
"""
from __future__ import annotations
from pathlib import Path
from source_audit import read_json, write_table
from pinyin_ming import internal_only, pinyin_for_display
from translations_ming import spanish_for_display

ROOT = Path(__file__).resolve().parent
POSITIVE_KINDS = {
    'example', 'dialogue_turn', 'dialogue_example', 'dialogue_response',
    'grammar_example', 'grammar_transformation', 'key_phrase',
    'key_phrase_pinyin_transcription', 'reading', 'reading_drill',
    'writing_model', 'question_answer_printed', 'visual_example',
    'compound_example', 'dialogue_exercise', 'translation_answer_printed',
    'reading_question', 'interview_prompt', 'writing_prompt', 'classroom_expression',
}


def require(condition: bool, message: str) -> None:
    if not condition:
        raise ValueError('Lexical examples: ' + message)


def eligible_phrase(row: dict) -> bool:
    kinds = set(row.get('kinds', []))
    return bool(kinds & POSITIVE_KINDS) and not internal_only(row) and not any(
        mark in row['hanzi'] for mark in ('…', '_', '□'))


def validate_compositions(config: dict, words: dict[str, dict], phrases: dict[str, dict]) -> list[dict]:
    require(config.get('schema_version') == '1.0.0', 'unsupported schema')
    require(config.get('scope') == 'explicit_one_hop_pedagogical_examples', 'unsupported inheritance scope')
    seen, ids, edges = set(), set(), {}
    for row in config['compositions']:
        base, compound = row['base_vocab_id'], row['compound_vocab_id']
        require(row['id'] not in ids and (base, compound) not in seen, 'duplicate composition')
        ids.add(row['id'])
        seen.add((base, compound))
        require(base in words and compound in words, 'unknown vocabulary ID')
        require(base != compound, 'self-referential composition')
        require(not internal_only(words[base]) and not internal_only(words[compound]), 'internal-only composition target')
        start, end = row['base_span']
        text = words[compound]['hanzi']
        require(0 <= start < end <= len(text) and text[start:end] == words[base]['hanzi'], 'base span mismatch')
        position, base_found = 0, False
        for component in row['components']:
            vid = component['vocab_id']
            a, b = component['start'], component['end']
            require(vid in words and a == position and a < b <= len(text), 'invalid component partition')
            require(text[a:b] == words[vid]['hanzi'], 'component span mismatch')
            base_found |= vid == base and [a, b] == [start, end]
            position = b
        require(position == len(text) and base_found, 'incomplete composition')
        require(bool(row.get('rationale')) and bool(row.get('method')), 'missing semantic review')
        require(all(pid in phrases for pid in row.get('supporting_phrase_ids', [])), 'unknown supporting phrase')
        edges.setdefault(base, []).append(compound)
    active, done = set(), set()
    def visit(node):
        require(node not in active, 'composition cycle')
        if node in done:
            return
        active.add(node)
        for target in edges.get(node, []): visit(target)
        active.remove(node)
        done.add(node)
    for node in edges: visit(node)
    return config['compositions']


def build_example_links(words: list[dict], phrases: list[dict], lexical_links: list[dict], config: dict) -> list[dict]:
    word_by_id = {r['id']: r for r in words}
    phrase_by_id = {r['id']: r for r in phrases}
    require(len(word_by_id) == len(words) and len(phrase_by_id) == len(phrases), 'duplicate entity IDs')
    compositions = validate_compositions(config, word_by_id, phrase_by_id)
    result, direct = {}, []
    for link in lexical_links:
        vid, pid = link['vocab_id'], link['phrase_id']
        require(vid in word_by_id and pid in phrase_by_id, 'dangling lexical link')
        if internal_only(word_by_id[vid]) or not eligible_phrase(phrase_by_id[pid]):
            continue
        require(vid in phrase_by_id[pid].get('vocab_ids', []), 'lexical membership mismatch')
        record = {'id': f'EX-{vid}-{pid}', 'vocab_id': vid, 'phrase_id': pid,
                  'relation': 'direct_lexical', 'via_vocab_id': None, 'composition_id': None,
                  'evidence_ids': sorted(set(link.get('evidence_ids', [])))}
        result[(vid, pid)] = record
        direct.append(link)
    # Only iterate original direct links: NEVER recurse through inherited links.
    for composition in compositions:
        for link in direct:
            if link['vocab_id'] != composition['compound_vocab_id']:
                continue
            vid, pid = composition['base_vocab_id'], link['phrase_id']
            if (vid, pid) not in result:
                result[(vid, pid)] = {'id': f'EX-{vid}-{pid}', 'vocab_id': vid, 'phrase_id': pid,
                    'relation': 'editorial_compositional', 'via_vocab_id': link['vocab_id'],
                    'composition_id': composition['id'], 'evidence_ids': sorted(set(link.get('evidence_ids', [])))}
    return sorted(result.values(), key=lambda r: (r['vocab_id'], r['relation'] != 'direct_lexical',
        not bool(pinyin_for_display(phrase_by_id[r['phrase_id']]) and spanish_for_display(phrase_by_id[r['phrase_id']])),
        len(phrase_by_id[r['phrase_id']]['hanzi']), r['phrase_id']))


def enrich_cache(cache: Path) -> None:
    config = read_json(ROOT / 'lexical-compositions.json')
    words, phrases = read_json(cache / 'vocabulary.json'), read_json(cache / 'phrases.json')
    links = build_example_links(words, phrases, read_json(cache / 'word_phrase_links.json'), config)
    by_word, by_phrase = {}, {}
    for row in links:
        by_word.setdefault(row['vocab_id'], []).append(row['phrase_id'])
        by_phrase.setdefault(row['phrase_id'], []).append(row['vocab_id'])
    for word in words:
        word['example_phrase_ids'] = by_word.get(word['id'], [])
    for phrase in phrases:
        phrase['example_vocab_ids'] = by_phrase.get(phrase['id'], [])
    cat = [r for r in links if r['vocab_id'] == 'v-猫']
    pmap = {r['id']: r for r in phrases}
    summary = {'schema_version': config['schema_version'], 'approved_compositions': len(config['compositions']),
               'direct_links': sum(r['relation'] == 'direct_lexical' for r in links),
               'inherited_links': sum(r['relation'] == 'editorial_compositional' for r in links),
               'source_lexical_links_changed': 0, 'transitive_inheritance': False,
               'cat_examples': [{'phrase_id': r['phrase_id'], 'hanzi': pmap[r['phrase_id']]['hanzi'],
                    'pinyin': pinyin_for_display(pmap[r['phrase_id']]), 'spanish': spanish_for_display(pmap[r['phrase_id']]),
                    'relation': r['relation'], 'via_vocab_id': r['via_vocab_id']} for r in cat]}
    for name, value in [('vocabulary', words), ('phrases', phrases), ('pedagogical_example_links', links),
                        ('lexical_compositions', config['compositions']), ('lexical_examples_summary', summary)]:
        write_table(cache, name, value)
    for name in ['index', 'validation']:
        value = read_json(cache / (name + '.json'))
        value['lexical_examples'] = summary
        if name == 'validation':
            value['checks'] = list(dict.fromkeys(value['checks'] + [
                'explicit one-hop semantic composition links; no substring-based discovery',
                'global example IDs preserve original lexical and curriculum relationships']))
        write_table(cache, name, value)


def augment_public(payload: dict, cache: Path) -> dict:
    words = {r['id']: r for r in read_json(cache / 'vocabulary.json')}
    phrases = {r['id']: r for r in read_json(cache / 'phrases.json')}
    published_words = {r['id'] for r in payload['vocabulary']}
    published_phrases = {r['id'] for r in payload['phrases']}
    for row in payload['vocabulary']:
        row['examplePhraseIds'] = [pid for pid in words[row['id']]['example_phrase_ids'] if pid in published_phrases]
    for row in payload['phrases']:
        row['exampleVocabIds'] = [vid for vid in phrases[row['id']]['example_vocab_ids'] if vid in published_words]
    return payload
