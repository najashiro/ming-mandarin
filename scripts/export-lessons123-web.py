#!/usr/bin/env python3
"""Generate the reviewed L1–L3 learner corpus without rewriting the frozen v2.1 batch."""
import argparse
import copy
import hashlib
import json
import sys
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'MING_KNOWLEDGE/v2'))
import query


def build():
    query.ensure_cache()
    payload = copy.deepcopy(json.loads((ROOT / 'data/corpus-v21-public.json').read_text(encoding='utf-8')))
    vocabulary = {w['id']: w for w in query.read_table('vocabulary')}
    phrases = {p['id']: p for p in query.read_table('phrases')}
    public_phrases = {p['id']: p for p in payload['phrases']}
    additions = {p['id'] for p in query.read_table('lessons123_new_phrases')}
    for pid in list(public_phrases) + sorted(additions - public_phrases.keys()):
        row = phrases[pid]
        if pid not in public_phrases:
            public_phrases[pid] = dict(id=pid, hanzi=row['hanzi'], lessons=row['lessons'], kinds=row['kinds'],
                vocabIds=row['vocab_ids'], dialogueIds=row['dialogue_ids'],
                curriculumLinks=[dict(lesson=l, kind='example') for l in row['lessons'] if l in (1,2,3)])
        item = public_phrases[pid]
        item.update(pinyin=row.get('pinyin_display') or row.get('pinyin'),
                    spanish=row.get('spanish_display') or row.get('spanish'),
                    exampleVocabIds=row.get('example_vocab_ids', []))
    for word in payload['vocabulary']:
        row = vocabulary[word['id']]
        word.update(pinyin=row.get('pinyin_display') or row.get('pinyin'),
                    spanish=row.get('spanish_display') or row.get('spanish'),
                    examplePhraseIds=[pid for pid in row.get('example_phrase_ids', []) if pid in public_phrases
                        and public_phrases[pid].get('pinyin') and public_phrases[pid].get('spanish')])
        if not word['pinyin'] or not word['spanish']:
            raise ValueError(f"Incomplete vocabulary card: {word['id']}")
    payload['phrases'] = list(public_phrases.values())
    witnesses = query.read_table('phrase_evidence')
    for dialogue in payload['dialogues']:
        for turn in dialogue['turns']:
            # Exact book witness remains authoritative; display corrections are
            # resolved on the same phrase ID, with no dialogue-version mixing.
            row = phrases[turn['phraseId']]
            exact = [w for w in witnesses if w.get('dialogue_id') == dialogue['id']
                and w.get('turn') == turn['turn'] and w['hanzi'] == turn['hanzi']
                and w.get('speaker_source') == turn['speaker']]
            if len(exact) != 1:
                raise ValueError('Ambiguous textbook dialogue witness')
            witness = exact[0]
            turn['pinyin'] = witness.get('pinyin_source') or row.get('pinyin_display') or turn['pinyin']
            turn['spanish'] = witness.get('spanish_source') or row.get('spanish_display') or turn['spanish']
    payload['version'] = '2.3.1'
    payload.pop('fingerprint', None)
    payload['fingerprint'] = hashlib.sha256(json.dumps(payload, ensure_ascii=False, separators=(',', ':')).encode()).hexdigest()
    return payload


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--check', action='store_true')
    args = ap.parse_args()
    payload = build()
    output = ROOT / 'data/lessons123-public.json'
    text = json.dumps(payload, ensure_ascii=False, indent=2) + '\n'
    if args.check:
        if not output.is_file() or output.read_text(encoding='utf-8') != text:
            raise SystemExit('Stale L1–L3 public projection; run scripts/export-lessons123-web.py')
    else:
        output.write_text(text, encoding='utf-8')
    print(json.dumps(dict(words=len(payload['vocabulary']), phrases=len(payload['phrases']), fingerprint=payload['fingerprint'])))


if __name__ == '__main__':
    main()
