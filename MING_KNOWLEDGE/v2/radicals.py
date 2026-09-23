"""Build the source-bounded radical dimension after the immutable v2 base compiler.

No PDF, network, dictionary lookup or inferred universal radical normalization.
Call enrich_cache only after rebuilding the base tables (query.py does this).
"""
from __future__ import annotations
import csv
import hashlib
import json
from collections import defaultdict
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / 'radicals-source.json'
TABLE_NAMES = [
    'radical_catalog', 'radical_evidence', 'radical_hanzi_links',
    'radical_word_links', 'radical_phrase_links', 'radical_assessment_sets',
    'radical_assessment_items', 'radical_matrix', 'radical_corrections', 'radical_notes',
]

def rid(glyph: str) -> str:
    return 'RAD-' + '-'.join(f'U{ord(ch):04X}' for ch in glyph)

def uid(prefix: str, *parts: Any) -> str:
    raw = json.dumps(parts, ensure_ascii=False, separators=(',', ':')).encode()
    return prefix + hashlib.sha256(raw).hexdigest()[:16]

def ref(source: str, page: int) -> str:
    return f'{source}:p{page:03d}'

def dump(cache: Path, name: str, rows: Any) -> None:
    (cache / f'{name}.json').write_text(
        json.dumps(rows, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    if isinstance(rows, list) and rows:
        columns = list(dict.fromkeys(key for row in rows for key in row))
        with (cache / f'{name}.tsv').open('w', encoding='utf-8', newline='') as stream:
            writer = csv.DictWriter(stream, columns, delimiter='\t')
            writer.writeheader()
            for row in rows:
                writer.writerow({key: json.dumps(val, ensure_ascii=False)
                                 if isinstance(val, (list, dict)) else val
                                 for key, val in row.items()})

def enrich_cache(cache: Path) -> dict:
    def read(name: str):
        return json.loads((cache / f'{name}.json').read_text(encoding='utf-8'))
    src = json.loads(SOURCE.read_text(encoding='utf-8'))
    names = ['sources', 'radicals', 'hanzi', 'hanzi_evidence', 'vocabulary',
             'word_hanzi_links', 'phrases', 'word_phrase_links', 'exercises',
             'matrix', 'index', 'validation']
    base = {name: read(name) for name in names}
    sources = {row['id']: row for row in base['sources']}
    hanzi = {row['id']: row for row in base['hanzi']}
    words = {row['id']: row for row in base['vocabulary']}
    phrases = {row['id']: row for row in base['phrases']}
    exercises = {row['id']: row for row in base['exercises']}
    catalog: dict[str, dict] = {}
    evidence: list[dict] = []
    links: dict[tuple[str, str], dict] = {}
    assessments: list[dict] = []
    items: list[dict] = []

    def register(glyph: str) -> dict:
        key = rid(glyph)
        if key not in catalog:
            catalog[key] = dict(id=key, radical=glyph, name_source=None,
                meaning_source=None, explanation_source=None, stroke_count_source=None,
                metadata_status='not_supplied_in_explicit_radical_definition',
                lessons=[], roles=[], definition_refs=[], worksheet_refs=[],
                practice_refs=[], exam_refs=[], ppt_refs=[], evidence_ids=[])
        return catalog[key]

    def add_evidence(glyph: str, kind: str, source_id: str, page: int,
                     lesson: int, **extra: Any) -> dict:
        cat = register(glyph)
        row = dict(id=uid('RE-', glyph, kind, source_id, page, extra),
                   radical_id=cat['id'], kind=kind, source_id=source_id,
                   page=page, lesson=lesson, **extra)
        evidence.append(row)
        cat['lessons'] = sorted(set(cat['lessons'] + [lesson]))
        cat['roles'] = sorted(set(cat['roles'] + [kind]))
        cat['evidence_ids'].append(row['id'])
        field = {'named_radical_in_textbook': 'definition_refs',
                 'worksheet_radical': 'worksheet_refs',
                 'workbook_radical_prompt': 'practice_refs',
                 'exam_radical_prompt': 'exam_refs'}[kind]
        cat[field] = sorted(set(cat[field] + [ref(source_id, page)]))
        return row

    def attach(glyph: str, character: str, ev: dict, documented: bool,
               assessment_id: str | None = None) -> dict:
        key = (rid(glyph), 'c-' + character)
        if key not in links:
            links[key] = dict(id=uid('RH-', *key), radical_id=key[0],
                hanzi_id=key[1], hanzi=character, source_evidence_ids=[],
                proposal_evidence_ids=[], assessment_item_ids=[])
        row = links[key]
        field = 'source_evidence_ids' if documented else 'proposal_evidence_ids'
        row[field].append(ev['id'])
        if assessment_id:
            row['assessment_item_ids'].append(assessment_id)
        row['assignment_status'] = ('documented_in_course_source'
            if row['source_evidence_ids'] else 'editorial_exercise_proposal')
        return row

    for definition in src['definitions']:
        cat = register(definition['radical'])
        cat.update(name_source=definition['name_source'],
            meaning_source=definition['meaning_excerpt'],
            explanation_source=definition['explanation_source'],
            stroke_count_source=definition['stroke_count_source'],
            metadata_status='explicit_textbook_definition')
        ev = add_evidence(definition['radical'], definition['kind'],
            definition['source_id'], definition['page'], definition['lesson'],
            claim_status='source_transcribed', definition=definition)
        for character in definition['example_characters']:
            attach(definition['radical'], character, ev, True)
    for row in base['hanzi_evidence']:
        if row.get('radical_source') is None:
            continue
        if sources[row['source_id']]['kind'] != 'worksheet':
            raise ValueError('New non-worksheet radical evidence needs explicit handling')
        ev = add_evidence(row['radical_source'], 'worksheet_radical', row['source_id'],
            row['page'], row['lesson'], claim_status='source_field_preserved',
            hanzi_id=row['hanzi_id'], hanzi_evidence_id=row['id'],
            row=row.get('row'), radical_source=row['radical_source'])
        attach(row['radical_source'], row['hanzi'], ev, True)

    for task in src['assessment_sets']:
        assessment = {key: val for key, val in task.items() if key != 'groups'}
        assessment['item_ids'] = []
        for group in task['groups']:
            for position, character in enumerate(group['characters'], 1):
                item_id = f"{task['id']}-{group['number']:02d}-{position}"
                glyph = group['radical_candidate']
                ev = add_evidence(glyph, 'exam_radical_prompt' if task['kind'] == 'exam'
                    else 'workbook_radical_prompt', task['source_id'], group['page'],
                    task['lesson'], claim_status='editorial_candidate_not_printed_answer',
                    hanzi_id='c-' + character, assessment_item_id=item_id,
                    exercise_id=task['exercise_id'])
                link = attach(glyph, character, ev, False, item_id)
                item = dict(id=item_id, assessment_id=task['id'],
                    exercise_id=task['exercise_id'], source_id=task['source_id'],
                    page=group['page'], lesson=task['lesson'],
                    group_number=group['number'], position_in_group=position,
                    hanzi_id='c-' + character, hanzi=character,
                    radical_candidate_id=rid(glyph), radical_candidate=glyph,
                    radical_evidence_id=ev['id'],
                    candidate_status=link['assignment_status'],
                    source_answer_key_supplied=False, automatic_grading_approved=False,
                    radical_meaning_source=catalog[rid(glyph)]['meaning_source'],
                    meaning_status=catalog[rid(glyph)]['metadata_status'])
                items.append(item)
                assessment['item_ids'].append(item_id)
        assessment['item_count'] = len(assessment['item_ids'])
        assessments.append(assessment)

    rh = sorted(links.values(), key=lambda row: row['id'])
    by_char: dict[str, list] = defaultdict(list)
    for row in rh:
        by_char[row['hanzi_id']].append(row)
    rw = []
    for row in base['word_hanzi_links']:
        for link in by_char[row['hanzi_id']]:
            rw.append(dict(id=uid('RW-', link['id'], row['vocab_id']),
                radical_id=link['radical_id'], hanzi_id=row['hanzi_id'],
                vocab_id=row['vocab_id'], radical_hanzi_link_id=link['id'],
                assignment_status=link['assignment_status'],
                relation='word_contains_character_with_radical_assignment'))
    by_word: dict[str, list] = defaultdict(list)
    for row in rw:
        by_word[row['vocab_id']].append(row)
    rp_map: dict[tuple[str, str], dict] = {}
    for word_phrase in base['word_phrase_links']:
        for word_link in by_word[word_phrase['vocab_id']]:
            key = (word_link['radical_id'], word_phrase['phrase_id'])
            if key not in rp_map:
                rp_map[key] = dict(id=uid('RP-', *key), radical_id=key[0],
                    phrase_id=key[1], via_word_link_ids=[], via_vocab_ids=[],
                    via_hanzi_ids=[], assignment_statuses=[],
                    relation='derived_via_existing_lexical_word_phrase_link',
                    counts_as_radical_teaching_evidence=False)
            target = rp_map[key]
            for field, value in [('via_word_link_ids', word_link['id']),
                    ('via_vocab_ids', word_link['vocab_id']),
                    ('via_hanzi_ids', word_link['hanzi_id']),
                    ('assignment_statuses', word_link['assignment_status'])]:
                target[field] = sorted(set(target[field] + [value]))
    rp = sorted(rp_map.values(), key=lambda row: row['id'])
    for cat in catalog.values():
        key = cat['id']
        cat['hanzi_ids'] = sorted({x['hanzi_id'] for x in rh if x['radical_id'] == key})
        cat['vocab_ids'] = sorted({x['vocab_id'] for x in rw if x['radical_id'] == key})
        cat['phrase_ids'] = sorted({x['phrase_id'] for x in rp if x['radical_id'] == key})
        cat['assessment_item_ids'] = [x['id'] for x in items if x['radical_candidate_id'] == key]
        cat['exam_characters'] = [x['hanzi'] for x in items if x['radical_candidate_id'] == key
                                   and x['assessment_id'] == 'RAS-EXAM-B2-II']
        cat['named_in_textbook'] = bool(cat['definition_refs'])
        cat['evaluated_in_supplied_exam'] = bool(cat['exam_refs'])
        cat['radical_ui_or_deployment_verified'] = False
    cats = sorted(catalog.values(), key=lambda row: row['id'])
    matrix = [dict(id=x['id'], radical=x['radical'], name=x['name_source'],
        meaning=x['meaning_source'], metadata_status=x['metadata_status'],
        lessons=x['lessons'], roles=x['roles'], theory=x['definition_refs'],
        practice=x['practice_refs'], worksheet=x['worksheet_refs'], ppt=x['ppt_refs'],
        exam=x['exam_refs'], exam_characters=x['exam_characters'],
        hanzi_ids=x['hanzi_ids'], vocab_count=len(x['vocab_ids']),
        phrase_count=len(x['phrase_ids']), phrase_ids=x['phrase_ids'],
        runtime_hanzi_ids=[c for c in x['hanzi_ids'] if hanzi.get(c, {}).get('runtime_units')],
        radical_ui_verified=False) for x in cats]
    for row in base['hanzi']:
        row['documented_radical_ids'] = sorted({x['radical_id'] for x in by_char[row['id']]
                                               if x['source_evidence_ids']})
        row['proposed_radical_ids'] = sorted({x['radical_id'] for x in by_char[row['id']]
                                             if not x['source_evidence_ids']})
        row['radical_link_ids'] = [x['id'] for x in by_char[row['id']]]
    for row in base['vocabulary'] + base['matrix']:
        row['radical_ids'] = sorted({x['radical_id'] for x in by_word[row['id']]})
        row['radical_word_link_ids'] = [x['id'] for x in by_word[row['id']]]
        row['radical_scope_note'] = 'Assignments belong to individual Hanzi; inspect link status.'
    outputs = dict(radical_catalog=cats, radical_evidence=evidence,
        radical_hanzi_links=rh, radical_word_links=rw, radical_phrase_links=rp,
        radical_assessment_sets=assessments, radical_assessment_items=items,
        radical_matrix=matrix, radical_corrections=src['corrections'], radical_notes=src['notes'])
    errors = validate(outputs, base)
    validation = base['validation']
    validation['errors'].extend(errors)
    validation['passed'] = not validation['errors']
    validation['checks'].extend(['radical source/page bounds and foreign keys',
        '8 explicit definitions; 77 worksheet field witnesses preserved',
        '40 assessment character prompts; no invented official answer keys',
        '10 exam characters match workbook L2 order',
        'exact radical forms stay distinct', 'phrase links reuse lexical relations'])
    stats = dict(radical_forms=len(cats), radical_named_definitions=len(src['definitions']),
        radical_worksheet_witnesses=sum(x['kind']=='worksheet_radical' for x in evidence),
        radical_hanzi_links=len(rh), radical_word_links=len(rw), radical_phrase_links=len(rp),
        radical_assessment_sets=len(assessments), radical_assessment_items=len(items),
        radical_exam_characters=sum(x['assessment_id']=='RAS-EXAM-B2-II' for x in items),
        radical_source_corrections=len(src['corrections']))
    index = base['index']
    index.update(version=src['version'], radical_policy=src['policy'],
                 radical_tables=TABLE_NAMES,
                 radical_source_sha256=hashlib.sha256(SOURCE.read_bytes()).hexdigest())
    index['stats'].update(stats)
    # Preserve the original transcription alongside the explicitly audited replacement.
    dump(cache, 'radicals_legacy_v2', base['radicals'])
    dump(cache, 'radicals', src['definitions'])
    for name, rows in outputs.items():
        dump(cache, name, rows)
    for name in ['hanzi', 'vocabulary', 'matrix']:
        dump(cache, name, base[name])
    dump(cache, 'index', index)
    dump(cache, 'validation', validation)
    if errors:
        raise ValueError('Radical validation failed: ' + '; '.join(errors))
    return stats

def validate(tables: dict, base: dict) -> list[str]:
    errors: list[str] = []
    def check(ok: bool, message: str):
        if not ok:
            errors.append(message)
    sources = {r['id']: r for r in base['sources']}
    ids = {name: {r['id'] for r in rows} for name, rows in tables.items()}
    hids = {r['id'] for r in base['hanzi']}
    vids = {r['id'] for r in base['vocabulary']}
    pids = {r['id'] for r in base['phrases']}
    eids = {r['id'] for r in base['exercises']}
    for name, rows in tables.items():
        check(len(ids[name]) == len(rows), 'duplicate IDs: ' + name)
    for row in tables['radical_evidence']:
        check(row['source_id'] in sources and 1 <= row['page'] <= sources[row['source_id']]['pages'], 'radical source page')
        check(row['radical_id'] in ids['radical_catalog'], 'radical evidence FK')
    for row in tables['radical_hanzi_links']:
        check(row['radical_id'] in ids['radical_catalog'] and row['hanzi_id'] in hids, 'radical/Hanzi FK')
        check(set(row['source_evidence_ids'] + row['proposal_evidence_ids']) <= ids['radical_evidence'], 'radical evidence link FK')
    for row in tables['radical_word_links']:
        check(row['vocab_id'] in vids and row['hanzi_id'] in hids and row['radical_hanzi_link_id'] in ids['radical_hanzi_links'], 'radical/word FK')
    lexical = {(x['vocab_id'], x['phrase_id']) for x in base['word_phrase_links']}
    for row in tables['radical_phrase_links']:
        check(row['phrase_id'] in pids and row['radical_id'] in ids['radical_catalog'], 'radical/phrase FK')
        check(all((v, row['phrase_id']) in lexical for v in row['via_vocab_ids']), 'false lexical radical phrase link')
    for row in tables['radical_assessment_items']:
        check(row['assessment_id'] in ids['radical_assessment_sets'] and row['exercise_id'] in eids and row['hanzi_id'] in hids, 'assessment FK')
        check(not row['source_answer_key_supplied'] and not row['automatic_grading_approved'], 'fabricated official key')
    cat = {r['radical']: r for r in tables['radical_catalog']}
    check(len(cat) == 38, '38 documentary radical forms expected')
    check(sum(r['named_in_textbook'] for r in cat.values()) == 8, '8 named radicals expected')
    check(sum(r['kind']=='worksheet_radical' for r in tables['radical_evidence']) == 77, '77 worksheet radical witnesses expected')
    check(len(tables['radical_assessment_items']) == 40, '40 assessment prompts expected')
    exam = [x['hanzi'] for x in tables['radical_assessment_items'] if x['assessment_id']=='RAS-EXAM-B2-II']
    workbook = [x['hanzi'] for x in tables['radical_assessment_items'] if x['assessment_id']=='RAS-WB-L2']
    check(exam == workbook == list('什们语识她妈饺饭汉海'), 'exam/workbook ordering mismatch')
    check(cat['口']['id'] != cat['囗']['id'], '口/囗 conflated')
    check(cat['辶']['name_source'] == 'zǒuzhīdǐ', 'book radical name mistranscribed')
    check(cat['女']['name_source'] is None and cat['氵']['meaning_source'] is None, 'unsourced glossary enrichment')
    check(1 in cat['女']['lessons'], 'L1 女 workbook evidence missing')
    return errors
