#!/usr/bin/env python3
"""Adapt the frozen v2.2 projection and typed tables to existing web contracts.

No source writes or workbook answer keys. Approved editorial dialogue translations
remain separate from documentary fields and are resolved only for the web.
Run with --check in CI to verify the committed projection.
"""
import argparse
import hashlib
import importlib.util
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'MING_KNOWLEDGE/v2'))
import query


def build():
    spec = importlib.util.spec_from_file_location('export_v22', ROOT / 'scripts/export-corpus-v22.py')
    exporter = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(exporter)
    projection = exporter.build()
    vocab = {r['id']: r for r in query.read_table('vocabulary')}
    phrases = {r['id']: r for r in query.read_table('phrases')}
    old = json.loads((ROOT / 'data/corpus-v21-public.json').read_text(encoding='utf-8'))
    source_records = {r['id']: r for r in query.read_table('sources')}
    def source(row):
        record = source_records[row['source_id']]
        kind = 'hanzi_worksheet' if 'HANZI' in row['source_id'] else 'class_presentation' if 'PPT' in row['source_id'] else 'workbook' if 'WB' in row['source_id'] else 'textbook'
        return dict(type=kind, file=record['filename'], pdfPage=row['page'])
    speakers = {t['speaker']: t['speakerPinyin'] for d in old['dialogues'] for t in d['turns']}
    words, pending = [], []
    for row in vocab.values():
        context = row.get('lesson4_selection')
        if not context:
            continue
        # Select the contextual witness, never the isolated worksheet reading.
        if not context.get('pinyin') or not context.get('spanish'):
            pending.append(dict(id=row['id'], reason='missing_contextual_pinyin_or_spanish'))
            continue
        links = [{k: link.get(k) for k in ('lesson', 'role', 'text', 'list_type', 'entry_kind')}
                 for link in row['curriculum_links'] if link['lesson'] == 4]
        visual = row.get('visual_ming')
        if not visual:
            pending.append(dict(id=row['id'], reason='missing_visual_classification'))
            continue
        words.append(dict(id=row['id'], hanzi=row['hanzi'], pinyin=context['pinyin'], spanish=context['spanish'],
                          lessons=[4], roles=[context['role']], curriculumLinks=links,
                          examplePhraseIds=row.get('example_phrase_ids', []),
                          visual_ming={k: visual[k] for k in ('visual_mode','image_support','image_quiz_eligible','ambiguity_risk')}))
    public_phrases = []
    for row in projection['phrases']:
        if 4 not in row['lessons']:
            continue
        public_phrases.append(dict(row, pinyin=row['pinyin'] or '', spanish=row['spanish'] or '',
                                   curriculumLinks=[dict(lesson=4, kind=k) for k in row['kinds']],
                                   exampleVocabIds=phrases[row['id']].get('example_vocab_ids', [])))
    # Global approved links are not limited to phrases introduced in L4.
    # Preserve missing language support instead of silently removing the Chinese.
    available_examples = {
        r['id'] for r in [*old['phrases'], *public_phrases]
        if r['hanzi'] and 'counterexample' not in r['kinds']
        and not any(mark in r['hanzi'] for mark in ('…', '_', '□'))
    }
    for word in words:
        ids = [i for i in word['examplePhraseIds'] if i in available_examples]
        # L4 selects zhǐ (only) and chà (time remaining), not the historical
        # classifier zhī or adjective chā. Keep their L4 witnesses only.
        if word['hanzi'] in ('只', '差'):
            ids = [i for i in ids if 4 in phrases[i]['lessons']]
        word['examplePhraseIds'] = ids

    editorial = json.loads((ROOT / 'MING_KNOWLEDGE/v2/lesson4/dialogue-translations-ming.json').read_text(encoding='utf-8'))
    canonical_turns = {(d['id'], t['turn']): t for d in projection['dialogues'] if d['lesson'] == 4 for t in d['turns']}
    translations = {}
    for entry in editorial['entries']:
        key = (entry['dialogue_id'], entry['turn'])
        assert key in canonical_turns and key not in translations, f'Unknown or duplicate dialogue translation: {key}'
        assert entry['hanzi'] == canonical_turns[key]['hanzi'], f'Stale dialogue translation: {key}'
        assert entry['traduccion_ming'].strip(), f'Empty dialogue translation: {key}'
        translations[key] = entry['traduccion_ming']
    assert translations.keys() == canonical_turns.keys(), 'Incomplete L4 dialogue translations'
    dialogues = []
    for row in projection['dialogues']:
        if row['lesson'] != 4:
            continue
        text = '4.1 你几点有课？' if row['id'].endswith('T1') else '4.2 你们班有多少人？'
        dialogues.append(dict(row, text=text, turns=[dict(t, pinyin=t['pinyin'] or '', spanish=t['spanish'] or translations[(row['id'], t['turn'])],
                             speakerPinyin=speakers.get(t['speaker'], '')) for t in row['turns']]))
    # Exercise blocks reuse explicit lexical spans, never guessed segmentation.
    spans = query.read_table('word_phrase_spans')
    witnesses = {r['id']: r for r in query.read_table('phrase_evidence')}
    sentences = []
    clean = lambda text: re.sub(r'[^\u3400-\u9fff]', '', text)
    for phrase in public_phrases:
        # Language support approved for a card does not approve new practice items.
        if phrases[phrase['id']].get('editorial_support_scope') == 'vocabulary_example':
            continue
        if not phrase['pinyin'] or not phrase['spanish'] or phrase['lessons'] != [4] or re.search(r'[^\u3400-\u9fff。？！]', phrase['hanzi']):
            continue
        for evidence_id in phrases[phrase['id']]['evidence_ids']:
            witness = witnesses[evidence_id]
            if witness.get('kind') not in ('example', 'collocation', 'reading_sentence'):
                continue
            parts = sorted([r for r in spans if r['phrase_evidence_id'] == evidence_id], key=lambda r:r['start'])
            tokens = [r['surface'] for r in parts]
            if len(tokens) < 2 or clean(''.join(tokens)) != clean(phrase['hanzi']):
                continue
            sentences.append(dict(id=phrase['id'], hanzi=phrase['hanzi'], pinyin=phrase['pinyin'], translation=phrase['spanish'],
                                  tokens=tokens, grammarTags=[], difficulty=2, source=source(witness)))
            break
    grammar = []
    for row in query.read_table('grammar_evidence'):
        if row.get('lesson') != 4 or row['source_id'] != 'SRC-BOOK-04' or not row.get('text_source'):
            continue
        grammar.append(dict(id=row['grammar_id'], slug=row['grammar_id'].lower(), title=row['label'],
                            pattern='', explanation=row['text_source'], examples=[], source=source(row)))
    readings = []
    for row in query.read_table('readings'):
        ph = phrases.get(row.get('phrase_id'), {})
        readings.append(dict(id=row['id'], title=row['label'], hanzi=row['text_source'],
                             pinyin=ph.get('pinyin_display') or '', spanish=ph.get('spanish_display') or ''))
    # Explicit allowlist: documentary audit fields never reach the learner.
    text_keys = {'text_source','hanzi','pinyin_source','spanish_source','instruction_source','prompt_source','label_source',
                 'underlined_source','dialogue','gloss_source','printed_model_response','model_source','hands_description'}
    printed_lists = {'right_choices_source','choices_source','glyphs','word_bank_source','printed_insertions_source',
                     'substitutions_source','substitution_rows_source','offered_source','visual_objects'}
    def printed_values(value):
        if isinstance(value, str):
            return [value]
        if isinstance(value, list):
            return [s for v in value for s in printed_values(v)]
        if isinstance(value, dict):
            return [s for v in value.values() for s in printed_values(v)]
        return []
    def texts(value):
        if isinstance(value, list):
            return [s for v in value for s in texts(v)]
        if isinstance(value, dict):
            return [s for k,v in value.items() for s in ([v] if k in text_keys and isinstance(v,str) and v.strip()
                    else [' · '.join(printed_values(v))] if k in printed_lists else texts(v) if isinstance(v,(dict,list)) else [])]
        return []
    exercises = [dict(id=r['id'], title=r['label'], texts=texts(r),
                      requiresOriginalAudio=r.get('answer_status') == 'requires_original_audio')
                 for r in query.read_table('exercises') if r.get('lesson') == 4]
    evidence = [r for r in query.read_table('hanzi_evidence') if r.get('lesson') == 4 and r['kind'] == 'worksheet']
    units = [dict(id=f'4.{n}',lesson=4,text=n,title=f'Lección 4 · Texto {n}',shortTitle=f'4.{n}',
                  chinese=['你几点有课？','你们班有多少人？'][n-1],description='Lectura y escritura de las hojas Hanzi.',
                  characters=list(dict.fromkeys(r['hanzi'] for r in evidence if r['source_id']==f'SRC-HANZI-04-{n}')))
             for n in (1,2)]
    characters = []
    for hanzi in dict.fromkeys(r['hanzi'] for r in evidence):
        witnesses = [r for r in evidence if r['hanzi']==hanzi]
        row = witnesses[0]
        stages = [u['id'] for u in units if hanzi in u['characters']]
        # Reuse only an exact single-character lexical witness with the same
        # reading. A compound's Spanish or another reading is not a glyph gloss.
        lexical = vocab.get(f'v-{hanzi}', {}).get('lesson4_selection') or {}
        meaning = row.get('spanish_source') or ''
        if not meaning and lexical.get('pinyin') == row.get('pinyin_source'):
            meaning = lexical.get('spanish') or ''
        characters.append(dict(id=f'c-{hanzi}',lessonId='lesson-4',hanzi=hanzi,pinyin=row.get('pinyin_source') or '',
            meaning=meaning,strokeCount=row['strokes_source'],radical=row.get('radical_source') or '',
            components=[],structure=row.get('structure_source') or '',recognitionRequired=True,writingRequired=True,
            source=source(row),sources=[source(w) for w in witnesses],sourceGroups=stages,primaryStage=stages[0],
            introducedIn=stages[0],appearsIn=stages,sourceRole='core',curricularOrder=len(characters),curricular=True,
            radicalAudited=bool(row.get('radical_source')),componentsAudited=False,words=[]))
    payload=dict(version='2.2.0',corpusFingerprint=projection['fingerprint'],vocabulary=words,phrases=public_phrases,
                 dialogues=dialogues,grammar=grammar,readings=readings,documentaryExercises=exercises,
                 characters=characters,units=units,pending=pending,sentences=sentences,
                 vocabularySources={w['id']: source(vocab[w['id']]['lesson4_selection']) for w in words})
    payload['fingerprint']=hashlib.sha256(json.dumps(payload,ensure_ascii=False,sort_keys=True).encode()).hexdigest()
    return payload


if __name__ == '__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check',action='store_true')
    args=parser.parse_args()
    output=ROOT/'data/lesson4-public.json'
    payload=build()
    if args.check:
        assert json.loads(output.read_text(encoding='utf-8'))==payload, 'Regenerate lesson4-public.json'
    else:
        output.write_text(json.dumps(payload,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print({k:len(v) for k,v in payload.items() if isinstance(v,list)})
