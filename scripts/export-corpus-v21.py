#!/usr/bin/env python3
"""Build the allow-listed application projection for corpus v2.1.

Documentary readings/translations have priority over authorized Ming fallbacks.
Editorial provenance stays internal; example IDs include reviewed compositions.
Visual classification exports only machine-readable decisions, not their notes.
"""
from __future__ import annotations
import argparse
import hashlib
import json
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
QUERY = ROOT / 'MING_KNOWLEDGE/v2/query.py'
OUT = ROOT / 'data/corpus-v21-public.json'
sys.path.insert(0, str(QUERY.parent))
from source_audit import augment_public
from translations_ming import spanish_for_display
from pinyin_ming import pinyin_for_display, internal_only
from lexical_examples import augment_public as augment_examples
from visual_ming import augment_public as augment_visual


def first_value(rows: list[dict], key: str = 'value') -> str | None:
    return next((row.get(key) for row in rows if row.get(key)), None)


def build() -> dict:
    with tempfile.TemporaryDirectory(prefix='ming-corpus-v21-') as tmp:
        subprocess.run([sys.executable, str(QUERY), '--validate'], cwd=ROOT, check=True, stdout=subprocess.DEVNULL)
        subprocess.run([sys.executable, str(QUERY), '--export', tmp], cwd=ROOT, check=True, stdout=subprocess.DEVNULL)
        source = Path(tmp)
        def load(name):
            return json.loads((source / f'{name}.json').read_text(encoding='utf-8'))
        vocabulary, phrases, dialogues = load('vocabulary'), load('phrases'), load('dialogues')
        phrase_evidence, hanzi = load('phrase_evidence'), load('hanzi')
        vocabulary_by_hanzi = {row['hanzi']: row for row in vocabulary}
        phrases_by_id = {row['id']: row for row in phrases}
        hanzi_by_id = {row['id']: row for row in hanzi}
        public_vocab = [{
            'id': row['id'], 'hanzi': row['hanzi'],
            'pinyin': pinyin_for_display(row), 'spanish': spanish_for_display(row),
            'lessons': row.get('lessons', []), 'roles': row.get('roles', []),
        } for row in vocabulary if pinyin_for_display(row) and spanish_for_display(row) and not internal_only(row)]
        public_phrases = [{
            'id': row['id'], 'hanzi': row['hanzi'],
            'pinyin': pinyin_for_display(row), 'spanish': spanish_for_display(row),
            'lessons': row.get('lessons', []), 'kinds': row.get('kinds', []),
            'vocabIds': row.get('vocab_ids', []), 'dialogueIds': row.get('dialogue_ids', []),
        } for row in phrases if 'counterexample' not in row.get('kinds', [])]
        public_dialogues = []
        for dialogue in dialogues:
            if '-BOOK-' not in dialogue['id']:
                continue
            text = 'Texto 2' if 'T2' in dialogue['id'] else 'Texto 1'
            turns = []
            for turn in dialogue['turns']:
                matches = [row for row in phrase_evidence if row.get('dialogue_id') == dialogue['id']
                           and row.get('turn') == turn['turn'] and row.get('hanzi') == turn['hanzi']
                           and row.get('speaker_source') == turn.get('speaker_source')]
                if len(matches) != 1:
                    raise RuntimeError(f"Expected one exact witness for {dialogue['id']} turn {turn['turn']}; got {len(matches)}")
                witness = matches[0]
                speaker_vocab = vocabulary_by_hanzi.get(turn.get('speaker_source'), {})
                phrase = phrases_by_id[witness['phrase_id']]
                if phrase['hanzi'] != turn['hanzi']:
                    raise RuntimeError('Editorial dialogue fallback requires an exact Chinese match')
                turns.append({'turn': turn['turn'], 'speaker': turn.get('speaker_source'), 'hanzi': turn['hanzi'],
                              'speakerPinyin': pinyin_for_display(speaker_vocab), 'phraseId': witness['phrase_id'],
                              'pinyin': witness.get('pinyin_source') or pinyin_for_display(phrase),
                              'spanish': witness.get('spanish_source') or spanish_for_display(phrase)})
            public_dialogues.append({'id': dialogue['id'], 'lesson': dialogue['lesson'], 'text': text, 'turns': turns})
        catalog = {row['id']: row for row in load('radical_catalog') if row.get('metadata_status') == 'explicit_textbook_definition'}
        evidence = {row['id']: row for row in load('radical_evidence')}
        links = [row for row in load('radical_hanzi_links') if row.get('assignment_status') == 'documented_in_course_source' and row['radical_id'] in catalog]
        public_radicals = []
        for rid, row in catalog.items():
            examples = []
            for link in links:
                if link['radical_id'] != rid:
                    continue
                lessons = sorted({evidence[eid]['lesson'] for eid in link.get('source_evidence_ids', []) if eid in evidence and evidence[eid].get('lesson')})
                pinyin = first_value(hanzi_by_id.get(link['hanzi_id'], {}).get('readings', []))
                if pinyin and lessons:
                    examples.append({'hanzi': link['hanzi'], 'pinyin': pinyin, 'lessons': lessons})
            public_radicals.append({'id': rid, 'radical': row['radical'], 'name': row.get('name_source'),
                                   'meaning': row.get('meaning_source'), 'explanation': row.get('explanation_source'),
                                   'strokeCount': row.get('stroke_count_source'), 'lessons': row.get('lessons', []), 'examples': examples})
        payload = {'version': '2.1.0', 'vocabulary': public_vocab, 'phrases': public_phrases,
                   'dialogues': public_dialogues, 'radicals': public_radicals}
        payload = augment_public(payload, source)
        payload = augment_examples(payload, source)
        payload = augment_visual(payload, source)
        canonical = json.dumps(payload, ensure_ascii=False, separators=(',', ':')).encode('utf-8')
        payload['fingerprint'] = hashlib.sha256(canonical).hexdigest()
        return payload


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='Fail on a stale projection without writing it')
    args = parser.parse_args()
    payload = build()
    content = json.dumps(payload, ensure_ascii=False, indent=2) + '\n'
    if args.check:
        if not OUT.is_file() or OUT.read_text(encoding='utf-8') != content:
            raise SystemExit('Stale public corpus. Run scripts/export-corpus-v21.py and commit its generated output.')
        print('Public projection is reproducible and up to date.')
    else:
        OUT.write_text(content, encoding='utf-8')
        print(f"Wrote {OUT.relative_to(ROOT)} ({payload['fingerprint']})")


if __name__ == '__main__':
    main()
