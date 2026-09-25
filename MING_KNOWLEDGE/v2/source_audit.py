"""Source-attested v2.1 enrichment. No network, PDFs, paid API or invented fields.

The immutable legacy pack is retained. source-tables.json is an independent
visual inventory; this module checks witnesses BEFORE decorating their records.
"""
from __future__ import annotations
import collections
import csv
import hashlib
import json
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent
INVENTORY = ROOT / 'source-tables.json'
BOOK_ROLES = {'core_textbook', 'supplementary_textbook', 'proper_name'}


def read_json(path: Path):
    return json.loads(path.read_text(encoding='utf-8'))


def write_table(cache: Path, name: str, rows) -> None:
    (cache / f'{name}.json').write_text(json.dumps(rows, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    tsv = cache / f'{name}.tsv'
    if isinstance(rows, list) and rows and all(isinstance(r, dict) for r in rows):
        fields = list(dict.fromkeys(k for row in rows for k in row))
        with tsv.open('w', encoding='utf-8', newline='') as stream:
            writer = csv.writer(stream, delimiter='\t')
            writer.writerow(fields)
            for row in rows:
                writer.writerow([json.dumps(row[k], ensure_ascii=False, separators=(',', ':')) if isinstance(row.get(k), (list, dict)) else row.get(k) for k in fields])
    elif tsv.exists():
        tsv.unlink()


def normalize_pinyin(value: str | None) -> str:
    # Compare typography only. Never strip tone marks or collapse u / ü.
    return ''.join(unicodedata.normalize('NFC', value or '').casefold().replace('’', "'").replace('ʼ', "'").split())


def normalize_text(value: str) -> str:
    # Retain Latin glosses: text with (John) is not silently merged with text without it.
    return ''.join(c for c in unicodedata.normalize('NFC', value) if not c.isspace() and not unicodedata.category(c).startswith(('P', 'Z')))


def require(condition: bool, message: str) -> None:
    if not condition:
        raise ValueError('Source audit: ' + message)


def textbook_rows(inventory: dict) -> list[dict]:
    rows, seen, table_ids = [], set(), set()
    for table in inventory['tables']:
        require(table['id'] not in table_ids, f"duplicate table {table['id']}")
        table_ids.add(table['id'])
        require(table['list_type'] in {'new_vocabulary', 'supplementary_vocabulary'}, 'unknown list type')
        numbered = []
        for page in table['pages']:
            for number, subentry, hanzi, pinyin in page['rows']:
                key = (table['id'], number, subentry)
                require(key not in seen, f'duplicate row {key}')
                seen.add(key)
                if subentry == 0:
                    numbered.append(number)
                rows.append({'id': f"{table['id']}-{number:02d}-{subentry}", 'table_id': table['id'],
                             'source_id': table['source_id'], 'page': page['pdf_page'], 'printed_page': page['printed_page'],
                             'lesson': table['lesson'], 'text': table['text'], 'list_type': table['list_type'],
                             'heading_zh': table['heading_zh'], 'heading_es': table['heading_es'],
                             'printed_number': number, 'subentry_index': subentry,
                             'entry_kind': 'headword' if subentry == 0 else 'subentry',
                             'hanzi': hanzi, 'vocab_id': 'v-' + hanzi, 'pinyin_source': pinyin})
        require(numbered == list(range(1, len(numbered) + 1)), f"non-contiguous numbered rows {table['id']}")
        for row in [r for r in rows if r['table_id'] == table['id'] and r['subentry_index']]:
            require((table['id'], row['printed_number'], 0) in seen, f"orphan subentry {row['id']}")
    return rows


def check_book_witnesses(expected: list[dict], evidence: list[dict]) -> dict[str, dict]:
    expected_keys = {(r['source_id'], r['page'], r['hanzi']) for r in expected}
    require(len(expected_keys) == len(expected), 'duplicate source/page/headword in inventory')
    actual = [r for r in evidence if r.get('source_id', '').startswith('SRC-BOOK') and r.get('role') in BOOK_ROLES]
    actual_keys = {(r['source_id'], r['page'], r['hanzi']) for r in actual}
    require(actual_keys == expected_keys, f'book membership differs: missing={sorted(expected_keys-actual_keys)}, extra={sorted(actual_keys-expected_keys)}')
    grouped = collections.defaultdict(list)
    for witness in actual:
        grouped[(witness['source_id'], witness['page'], witness['hanzi'])].append(witness)
    matches = {}
    for row in expected:
        candidates = grouped[(row['source_id'], row['page'], row['hanzi'])]
        require(len(candidates) == 1, f"ambiguous witness {row['id']}")
        witness = candidates[0]
        allowed_roles = {'core_textbook', 'proper_name'} if row['list_type'] == 'new_vocabulary' else {'supplementary_textbook'}
        require(witness['role'] in allowed_roles, f"incorrect role {row['id']}: {witness['role']}")
        require(witness['lesson'] == row['lesson'], f"incorrect lesson {row['id']}")
        require(normalize_pinyin(witness.get('pinyin_source')) == normalize_pinyin(row['pinyin_source']), f"pinyin differs {row['id']}: {witness.get('pinyin_source')!r} / {row['pinyin_source']!r}")
        require(bool(witness.get('spanish_source')), f"missing existing Spanish gloss {row['id']}")
        matches[row['id']] = witness
    return matches


def check_worksheets(inventory: dict, evidence: list[dict], sources: list[dict]) -> list[dict]:
    source_map = {s['id']: s for s in sources}
    known = {s['id'] for s in sources if s.get('kind') == 'worksheet'}
    wanted = {s['source_id'] for s in inventory['worksheets']}
    require(known == wanted, f'worksheet catalog differs: {sorted(known ^ wanted)}')
    results = []
    for sheet in inventory['worksheets']:
        sid = sheet['source_id']
        require(source_map[sid]['pages'] == len(sheet['pages']), f'worksheet page count {sid}')
        expected_pages = {p['pdf_page'] for p in sheet['pages']}
        require(expected_pages == set(range(1, source_map[sid]['pages'] + 1)), f'worksheet page gap {sid}')
        for page in sheet['pages']:
            rows = [r for r in evidence if r['source_id'] == sid and r['page'] == page['pdf_page']]
            require(collections.Counter(r['hanzi'] for r in rows) == collections.Counter(page['glyphs']), f"worksheet glyph inventory differs {sid} p{page['pdf_page']}")
            require(all(r['lesson'] == sheet['lesson'] for r in rows), f'worksheet lesson differs {sid}')
            results.append({'id': f"{sid}:p{page['pdf_page']:03d}", 'source_id': sid, 'page': page['pdf_page'],
                            'lesson': sheet['lesson'], 'glyph_occurrences': len(rows),
                            'expected_glyphs': page['glyphs'], 'evidence_ids': [r['id'] for r in rows]})
    return results


def recover_phrase_pinyin(inventory: dict, evidence: list[dict]) -> list[dict]:
    results = []
    for index, correction in enumerate(inventory['phrase_pinyin_recoveries'], 1):
        candidates = [r for r in evidence if r['source_id'] == correction['source_id'] and r['page'] == correction['page'] and normalize_text(r['hanzi']) == normalize_text(correction['hanzi'])]
        require(len(candidates) == 1, f"expected one phrase witness {correction['source_id']} p{correction['page']} {correction['hanzi']}")
        row = candidates[0]
        previous = row.get('pinyin_source')
        require(not previous or normalize_pinyin(previous) == normalize_pinyin(correction['pinyin_source']), f"conflicting recovery {row['id']}; requires source-specific reconciliation")
        row['pinyin_source'] = correction['pinyin_source']
        row['pinyin_transcription_method'] = correction['method']
        row['pinyin_transcription_note'] = correction['normalization']
        results.append({'id': f'PINYIN-RECOVERY-{index:03d}', 'phrase_id': row['phrase_id'], 'evidence_id': row['id'],
                        'source_id': row['source_id'], 'page': row['page'], 'hanzi': row['hanzi'],
                        'legacy_value': None, 'pinyin_source': row['pinyin_source'], 'method': correction['method']})
    return results


def enrich_cache(cache: Path) -> None:
    inventory = read_json(INVENTORY)
    names = ['vocabulary', 'vocabulary_evidence', 'phrases', 'phrase_evidence', 'hanzi', 'hanzi_evidence', 'sources', 'matrix', 'page_inventory', 'index', 'validation']
    data = {name: read_json(cache / f'{name}.json') for name in names}
    expected = textbook_rows(inventory)
    matches = check_book_witnesses(expected, data['vocabulary_evidence'])
    sheets = check_worksheets(inventory, data['hanzi_evidence'], data['sources'])
    recoveries = recover_phrase_pinyin(inventory, data['phrase_evidence'])
    source_map = {r['id']: r for r in data['sources']}
    for row in expected:
        source = source_map[row['source_id']]
        require(1 <= row['page'] <= source['pages'], f"out of range {row['id']}")
        require(row['printed_page'] == row['page'] + source['printed_page_offset'], f"printed/PDF page mismatch {row['id']}")
        witness = matches[row['id']]
        witness.update({k: row[k] for k in ['table_id', 'text', 'list_type', 'printed_number', 'subentry_index', 'entry_kind', 'printed_page']})
        row['evidence_id'] = witness['id']
        row['role'] = witness['role']
        row['spanish_source'] = witness['spanish_source']
    for annotation in inventory.get('specific_source_annotations', []):
        rows = [r for r in expected if r['table_id'] == annotation['table_id'] and r['hanzi'] == annotation['hanzi']]
        require(len(rows) == 1, 'source annotation target ambiguous')
        rows[0]['grammatical_type_source'] = annotation['grammatical_type_source']
        matches[rows[0]['id']]['grammatical_type_source'] = annotation['grammatical_type_source']

    by_vocab = collections.defaultdict(list)
    for witness in data['vocabulary_evidence']:
        by_vocab[witness['vocab_id']].append(witness)
    fields = ['lesson', 'role', 'source_id', 'page', 'table_id', 'text', 'list_type', 'printed_number', 'subentry_index', 'entry_kind']
    for word in data['vocabulary']:
        seen, links = set(), []
        for witness in by_vocab[word['id']]:
            link = {k: witness.get(k) for k in fields}
            key = json.dumps(link, ensure_ascii=False, sort_keys=True)
            if key not in seen:
                seen.add(key)
                link['evidence_id'] = witness['id']
                links.append(link)
        word['curriculum_links'] = links
        word['textbook_table_rows'] = [r['id'] for r in expected if r['vocab_id'] == word['id']]
    by_phrase = collections.defaultdict(list)
    for row in data['phrase_evidence']:
        by_phrase[row['phrase_id']].append(row)
    for phrase in data['phrases']:
        # Regenerate from exact witnesses; never assign a book transcription to a PPT page.
        variants = [{'value': r['pinyin_source'], 'evidence_id': r['id']} for r in by_phrase[phrase['id']] if r.get('pinyin_source')]
        phrase['pinyin_variants'] = variants
        phrase['pinyin'] = variants[0]['value'] if variants else None
        phrase['pinyin_status'] = 'source_based_selection_see_variants' if variants else 'not_supplied_in_extracted_evidence'
        phrase['curriculum_links'] = [{k: r.get(k) for k in ['lesson', 'kind', 'source_id', 'page', 'id']} for r in by_phrase[phrase['id']]]
    by_hanzi = collections.defaultdict(list)
    sheet_ids = {s['source_id'] for s in inventory['worksheets']}
    for row in data['hanzi_evidence']:
        if row['source_id'] in sheet_ids:
            by_hanzi[row['hanzi_id']].append(row)
    for character in data['hanzi']:
        character['worksheet_occurrences'] = [{k: r.get(k) for k in ['id', 'source_id', 'page', 'row', 'lesson', 'hanzi', 'pinyin_source', 'stroke_count_source']} for r in by_hanzi[character['id']]]
    by_word = {w['id']: w for w in data['vocabulary']}
    for row in data['matrix']:
        if row['id'] in by_word:
            row['curriculum_links'] = by_word[row['id']]['curriculum_links']
            row['textbook_table_rows'] = by_word[row['id']]['textbook_table_rows']
    for page in data['page_inventory']:
        page['textbook_table_row_ids'] = [r['id'] for r in expected if r['source_id'] == page['source_id'] and r['page'] == page['pdf_page']]
    summary = {
        'audit_version': inventory['schema_version'], 'audit_date': inventory['audit_date'],
        'inventory_sha256': hashlib.sha256(INVENTORY.read_bytes()).hexdigest(),
        'tables_checked': len(inventory['tables']), 'table_page_occurrences': sum(len(t['pages']) for t in inventory['tables']),
        'numbered_headwords': sum(r['subentry_index'] == 0 for r in expected),
        'explicit_subentries': sum(r['subentry_index'] > 0 for r in expected),
        'table_entries_checked': len(expected), 'worksheet_files_checked': len(inventory['worksheets']),
        'worksheet_glyph_occurrences_checked': sum(s['glyph_occurrences'] for s in sheets),
        'phrase_witness_pinyin_recoveries': len(recoveries), 'passed': True,
        'source_table_membership_errors': [], 'worksheet_inventory_errors': [],
        'coverage': {
            'vocabulary_total': len(data['vocabulary']),
            'vocabulary_with_pinyin': sum(bool(r.get('pinyin')) for r in data['vocabulary']),
            'phrases_total': len(data['phrases']),
            'phrases_with_source_pinyin': sum(bool(r.get('pinyin_variants')) for r in data['phrases']),
            'phrases_with_source_spanish': sum(bool(r.get('spanish_variants')) for r in data['phrases']),
        }, 'limits': inventory['limits']}
    data['index']['source_audit'] = summary
    data['index']['schema_notes']['curriculum_links'] = 'Evidence-bound lesson/role/list_type; aggregated lessons and roles do not encode introduction.'
    data['validation']['checks'] = list(dict.fromkeys(data['validation']['checks'] + ['independent textbook table inventory, headings, numbered rows and subentries', 'all supplied worksheet glyph inventories and exact source links', 'source-specific recovery of nine printed phrase pinyins']))
    data['validation']['source_audit'] = summary
    for name in ['vocabulary', 'vocabulary_evidence', 'phrases', 'phrase_evidence', 'hanzi', 'matrix', 'page_inventory', 'index', 'validation']:
        write_table(cache, name, data[name])
    for name, value in [('textbook_tables', inventory['tables']), ('textbook_table_rows', expected), ('worksheet_inventory', sheets), ('source_pinyin_recoveries', recoveries), ('source_audit', summary)]:
        write_table(cache, name, value)


def augment_public(payload: dict, cache: Path) -> dict:
    words = {r['id']: r for r in read_json(cache / 'vocabulary.json')}
    phrases = {r['id']: r for r in read_json(cache / 'phrases.json')}
    for row in payload['vocabulary']:
        public = []
        for link in words[row['id']]['curriculum_links']:
            item = {k: link.get(k) for k in ['lesson', 'role', 'text', 'list_type', 'entry_kind']}
            if item not in public:
                public.append(item)
        row['curriculumLinks'] = public
    for row in payload['phrases']:
        row['curriculumLinks'] = list({(r['lesson'], r['kind']): {'lesson': r['lesson'], 'kind': r['kind']} for r in phrases[row['id']]['curriculum_links']}.values())
    payload['hanzi'] = [{'id': r['id'], 'hanzi': r['hanzi'],
                        'readings': list(dict.fromkeys(x['value'] for x in r.get('readings', []) if x.get('value'))),
                        'lessons': r.get('lessons', []),
                        'writingSourceEvidence': r.get('source_writing_target', False),
                        'worksheetEvidence': bool(r['worksheet_occurrences'])}
                       for r in read_json(cache / 'hanzi.json')]
    payload['sourceAuditVersion'] = read_json(cache / 'source_audit.json')['audit_version']
    # No names of files, pages, source IDs, notes, evidence IDs or audit statuses.
    forbidden = {'source_id', 'sourceId', 'source_refs', 'page', 'pdfPage', 'printedPage', 'file', 'evidence_id', 'note', 'worksheet_occurrences'}
    def check(value):
        if isinstance(value, dict):
            require(not forbidden.intersection(value), f'private projection fields: {forbidden.intersection(value)}')
            for child in value.values():
                check(child)
        elif isinstance(value, list):
            for child in value:
                check(child)
    check(payload)
    return payload
