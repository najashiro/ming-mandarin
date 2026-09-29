"""Offline, bounded queries and integrity checks for the L4 draft supplement.

This does not compile or certify the existing v2 corpus or the website.
"""
from __future__ import annotations
import argparse
import collections
import csv
import hashlib
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent

def load_json(name: str, root: Path = ROOT):
    return json.loads((root / name).read_text(encoding='utf-8'))

def load_tsv(name: str, root: Path = ROOT) -> list[dict]:
    with (root / name).open(encoding='utf-8', newline='') as handle:
        rows = list(csv.DictReader(handle, delimiter='\t'))
    if any(None in row or None in row.values() for row in rows):
        raise ValueError(f'Malformed TSV columns in {name}')
    return rows

def validate(root: Path = ROOT, pdf_dir: Path | None = None) -> dict:
    m = load_json('manifest.json', root)
    v = load_tsv('textbook-vocabulary.tsv', root)
    h = load_tsv('worksheet-rows.tsv', root)
    d = load_tsv('dialogue-turns.tsv', root)
    g = load_json('grammar-source.json', root)
    issues = load_json('discrepancies.json', root)
    sources = {s['id']: s for s in m['sources']}
    errors: list[str] = []
    def check(condition: bool, message: str):
        if not condition:
            errors.append(message)
    def location(source_id: str, page: int, context: str):
        check(source_id in sources and 1 <= page <= sources[source_id]['pages'],
              f'Invalid source/page: {context}')
    check(m['target_corpus_version'] == '2.2.0', 'Incorrect target version')
    check(m['base_corpus_version'] == '2.1.0', 'Incorrect base version')
    check(m['release_status'] in {'draft', 'documentary_complete'},
          'Unknown documentary release status')
    check(len(sources) == len(m['sources']) == 6, 'Source IDs/count mismatch')
    check(sum(s['pages'] for s in sources.values()) == m['pdf_pages'] == 121,
          'Physical page count mismatch')
    check(sources['SRC-BOOK-04']['duplicate_pdf_pages'] == {},
          'Corrected PDF must not retain an active duplicate')
    check(m['duplicated_printed_page_occurrences'] == 0, 'Stale duplicate count')
    for source in sources.values():
        if source['printed_pages'] is not None:
            check(len(source['printed_pages']) == source['pages'], 'Printed page map mismatch')
    counts = collections.Counter(r['list_id'] for r in v)
    check(counts == {'L4-T1': 24, 'L4-T2': 22, 'L4-SUP': 17}, 'Vocabulary list row counts mismatch')
    check(len({(r['list_id'], r['number'], r['subentry']) for r in v}) == len(v),
          'Duplicate vocabulary row ID')
    for list_id, maximum in [('L4-T1', 21), ('L4-T2', 18), ('L4-SUP', 17)]:
        numbered = [int(r['number']) for r in v if r['list_id'] == list_id and r['subentry'] == '0']
        check(sorted(numbered) == list(range(1, maximum + 1)), f'Headword sequence: {list_id}')
    for row in v:
        location('SRC-BOOK-04', int(row['pdf_page']), row['hanzi'])
        check(row['pinyin_source'] != '' and row['spanish_source'] != '', 'Missing documentary vocabulary field')
        check(int(row['printed_page']) == sources['SRC-BOOK-04']['printed_pages'][int(row['pdf_page'])-1],
              'Printed vocabulary page mismatch')
        if row['subentry'] != '0':
            check(any(p['list_id'] == row['list_id'] and p['number'] == row['number']
                      and p['subentry'] == '0' and p['hanzi'] == row['parent_hanzi'] for p in v),
                  f'Missing subentry parent: {row["hanzi"]}')
    check(collections.Counter(r['source_id'] for r in h) == {'SRC-HANZI-04-1': 35, 'SRC-HANZI-04-2': 31},
          'Worksheet count mismatch')
    check(len({r['hanzi'] for r in h}) == 54, 'Worksheet unique glyph count mismatch')
    check(len({(r['source_id'], r['pdf_page'], r['row']) for r in h}) == len(h), 'Duplicate worksheet row')
    for row in h:
        location(row['source_id'], int(row['pdf_page']), row['hanzi'])
        check(len(row['hanzi']) == 1 and int(row['strokes_source']) > 0, 'Invalid worksheet glyph/strokes')
    dialogue_sizes = {'DLG-L4-BOOK-T1': 10, 'DLG-L4-BOOK-T2': 17,
                      'DLG-L4-PPT1-T1': 10, 'DLG-L4-PPT2-T2': 17}
    check(collections.Counter(r['dialogue_id'] for r in d) == dialogue_sizes, 'Dialogue count mismatch')
    for key, size in dialogue_sizes.items():
        turns = [int(r['turn']) for r in d if r['dialogue_id'] == key]
        check(sorted(turns) == list(range(1, size+1)), f'Dialogue turn sequence: {key}')
    for row in d:
        location(row['source_id'], int(row['pdf_page']), row['dialogue_id'])
        check(bool(row['speaker_source'] and row['hanzi'] and row['pinyin_source']), 'Missing dialogue field')
    turn = {(r['dialogue_id'], int(r['turn'])): r for r in d}
    check(turn[('DLG-L4-BOOK-T1', 1)]['speaker_source'] == '宋华', 'Book speaker variant lost')
    check(turn[('DLG-L4-PPT1-T1', 1)]['speaker_source'] == '丁力波', 'PPT speaker variant lost')
    check('七点半我回学校' in turn[('DLG-L4-BOOK-T2', 3)]['hanzi'], 'Book singular witness lost')
    check('七点半我们回学校' in turn[('DLG-L4-PPT2-T2', 3)]['hanzi'], 'PPT plural witness lost')
    check(turn[('DLG-L4-BOOK-T2', 14)]['hanzi'] == '我学英语。', 'Book 学 variant lost')
    check(turn[('DLG-L4-PPT2-T2', 14)]['hanzi'] == '我学习英语。', 'PPT 学习 variant lost')
    for glyph, word_reading, worksheet_reading in [('差','chà','chā'), ('只','zhǐ','zhī')]:
        check(any(r['hanzi'] == glyph and r['pinyin_source'] == word_reading for r in v), 'Contextual reading lost')
        check(any(r['hanzi'] == glyph and r['pinyin_source'] == worksheet_reading for r in h), 'Worksheet reading lost')
    check(len(g['records']) == 13 and len(issues) == 20, 'Grammar/discrepancy count mismatch')
    for row in g['records'] + g['counterexamples'] + issues:
        location(row['source_id'], row['pdf_page'], row.get('id', row.get('hanzi', '')))
    for row in g['records']:
        for page in row['source_pages']:
            location(row['source_id'], page, row['id'])
    computed = dict(textbook_table_rows=len(v), textbook_numbered_headwords=sum(r['subentry']=='0' for r in v),
                    textbook_subentries=sum(r['subentry']!='0' for r in v), worksheet_rows=len(h),
                    worksheet_unique_glyphs=len({r['hanzi'] for r in h}), main_dialogue_witnesses=len(dialogue_sizes),
                    dialogue_turn_occurrences=len(d), grammar_source_summaries=len(g['records']), source_discrepancies=len(issues))
    for key, count in computed.items():
        check(m['verified_scopes'][key] == count, f'Manifest count mismatch: {key}')
    pdf_results = []
    if pdf_dir is not None:
        for source in sources.values():
            path = pdf_dir / source['filename']
            check(path.is_file(), f'Missing PDF: {source["id"]}')
            if not path.is_file():
                continue
            digest = hashlib.sha256()
            with path.open('rb') as handle:
                for block in iter(lambda: handle.read(1024*1024), b''):
                    digest.update(block)
            ok = digest.hexdigest() == source['sha256'] and path.stat().st_size == source['bytes']
            check(ok, f'PDF hash/size mismatch: {source["id"]}')
            pdf_results.append({'source_id': source['id'], 'sha256_and_bytes_match': ok})
    errors.extend(validate_source_policy(root, m, v, d))
    data_hashes = {name: hashlib.sha256((root/name).read_bytes()).hexdigest() for name in m['data_files']}
    return dict(passed=not errors, scope='L4 audited TSV witness integrity only', target_version=m['target_corpus_version'],
                ready_for_chapter4=False, global_v2_validated=False, website_validated=False,
                counts=computed, errors=errors, data_sha256=data_hashes, pdf_checks=pdf_results,
                known_documentary_discrepancies=len(issues), pending_scopes=m['pending_scopes'])

def page_ledger(root: Path = ROOT) -> list[dict]:
    m = load_json('manifest.json', root)
    v = load_tsv('textbook-vocabulary.tsv', root)
    h = load_tsv('worksheet-rows.tsv', root)
    d = load_tsv('dialogue-turns.tsv', root)
    counts = collections.Counter([('SRC-BOOK-04', int(r['pdf_page'])) for r in v]
                                 + [(r['source_id'], int(r['pdf_page'])) for r in h+d])
    return [{'source_id': s['id'], 'pdf_page': page,
             'printed_page': s['printed_pages'][page-1] if s['printed_pages'] else None,
             'duplicate_of_pdf_page': s.get('duplicate_pdf_pages', {}).get(str(page)),
             'structured_tsv_rows': counts[(s['id'], page)],
             'full_page_literal_transcription_certified': False}
            for s in m['sources'] for page in range(1, s['pages']+1)]


def selected_dialogue_rows(root: Path = ROOT, canonical_only: bool = False) -> list[dict]:
    """Selection layer; never rewrites or deletes the documentary witnesses."""
    chosen = set(load_json('selection-policy.json', root)['canonical_dialogue_ids'])
    return [dict(row, selected_for_chapter4=row['dialogue_id'] in chosen)
            for row in load_tsv('dialogue-turns.tsv', root)
            if not canonical_only or row['dialogue_id'] in chosen]

def validate_source_policy(root: Path, manifest: dict, vocabulary: list[dict], dialogues: list[dict]) -> list[str]:
    errors = []
    def check(condition, message):
        if not condition:
            errors.append(message)
    policy = load_json('../../SOURCE_AUTHORITY.json', root)
    selection = load_json('selection-policy.json', root)
    history = load_json('source-revisions.json', root)
    sources = {s['id']: s for s in manifest['sources']}
    book, workbook = sources['SRC-BOOK-04'], sources['SRC-WB-04']
    check(book['filename'] == 'Libro Basico 1 - Lección 4.pdf' and book['kind'] == 'textbook', 'Book filename/kind mismatch')
    check(workbook['filename'] == 'Libro de Ejercicios Basico 1 - Lección 4.pdf' and workbook['kind'] == 'workbook', 'Workbook filename/kind mismatch')
    check(book['pages'] == 25 and book['printed_pages'] == list(range(113, 138)), 'Corrected book page map mismatch')
    check(workbook['pages'] == 11 and workbook['printed_pages'] == list(range(29, 40)), 'Workbook page map mismatch')
    check(book['sha256'] == '9ecfa83f1ecd628360b62fcce1183500aaa33fb4c39141fb4618fbfb47850c33' and book['bytes'] == 168951854, 'Wrong corrected textbook revision')
    previous = {s['id']: s for s in history['previous_sources']}
    check(workbook['sha256'] == previous['SRC-WB-04']['sha256'] and workbook['bytes'] == previous['SRC-WB-04']['bytes'], 'Workbook rename changed binary identity')
    expected_map = [{'old_pdf_page': i, 'current_pdf_page': i if i <= 8 else 8 if i == 9 else i-1,
                     'printed_page': previous['SRC-BOOK-04']['printed_pages'][i-1],
                     'status': 'duplicate_removed_alias' if i == 9 else 'retained_page'} for i in range(1, 27)]
    check(history['textbook_page_map'] == expected_map, 'Historical page migration mismatch')
    check(history['current_total_pdf_pages'] == 121 and history['source_ids_preserved'], 'Source history mismatch')
    check(selection['policy_id'] == policy['policy_id'] == 'ming-books-first-20260929', 'Authority policy ID mismatch')
    check(policy['primary_source_kinds'] == ['textbook', 'workbook'], 'Primary books lost')
    check(policy['main_dialogue_authority'] == 'textbook' and policy['exercise_authority'] == 'originating_book', 'Wrong dialogue/exercise authority')
    check(policy['preserve_secondary_witnesses'] and not policy['mix_dialogue_versions'], 'Secondary witness protection lost')
    check(not policy['worksheet_reading_to_contextual_pronunciation'] and not policy['concatenate_isolated_readings_for_words'], 'Unsafe worksheet pronunciation fallback')
    check(selection['canonical_dialogue_ids'] == ['DLG-L4-BOOK-T1', 'DLG-L4-BOOK-T2'], 'Non-book canonical dialogue')
    check(selection['secondary_dialogue_ids'] == ['DLG-L4-PPT1-T1', 'DLG-L4-PPT2-T2'], 'Secondary dialogue inventory lost')
    canonical = [r for r in dialogues if r['dialogue_id'] in selection['canonical_dialogue_ids']]
    check(len(canonical) == selection['canonical_dialogue_turns'] == 27 and all(r['source_id'] == 'SRC-BOOK-04' for r in canonical), 'Canonical dialogue source/count mismatch')
    check(len(dialogues)-len(canonical) == selection['secondary_dialogue_turns'] == 27, 'Secondary turn count mismatch')
    for row in selection['contextual_reading_examples']:
        check(row['source_id'] == 'SRC-BOOK-04' and any(v['hanzi'] == row['hanzi'] and v['pinyin_source'] == row['pinyin_source'] and int(v['pdf_page']) == row['pdf_page'] and int(v['printed_page']) == row['printed_page'] for v in vocabulary), 'Unattested contextual reading selection')
    check(selection['time_rule_source'] == {'source_id': 'SRC-BOOK-04', 'pdf_page': 9, 'printed_page': 121}, 'Time rule locator not migrated')
    check(selection['global_export_integrated'] == manifest.get('global_query_integrated', False) and selection['ready_for_chapter4'] == manifest['ready_for_chapter4'], 'Inconsistent release labels; CLI separately validates the integrated corpus')
    return errors

def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    group = ap.add_mutually_exclusive_group()
    group.add_argument('--validate', action='store_true')
    group.add_argument('--word', help='Exact table headword; no substring discovery')
    group.add_argument('--hanzi', help='One exact worksheet glyph')
    group.add_argument('--dialogue', help='Exact documentary dialogue ID')
    group.add_argument('--canonical-dialogues', action='store_true', help='Only the two book dialogues selected by the user')
    group.add_argument('--authority', action='store_true', help='Book-first source selection policy')
    group.add_argument('--pages', action='store_true', help='Physical-page ledger, not a completeness certificate')
    group.add_argument('--issues', action='store_true')
    ap.add_argument('--source', help='Exact source ID filter for page ledger or issues')
    ap.add_argument('--limit', type=int, default=20)
    ap.add_argument('--offset', type=int, default=0)
    ap.add_argument('--pdf-dir', type=Path, help='Optional private local PDF directory for hash/byte checks')
    ap.add_argument('--release-check', action='store_true', help='Exit 3 while chapter-4 release gates remain open')
    args = ap.parse_args()
    if not 1 <= args.limit <= 100 or args.offset < 0:
        ap.error('--limit must be 1..100; --offset must be nonnegative')
    if args.release_check or args.validate:
        result = validate(pdf_dir=args.pdf_dir)
        # The legacy row audit is not a release certificate. Only the global
        # compiler verifies the new source shards, their graphs and regressions.
        sys.path.insert(0, str(ROOT.parent))
        import query
        query.ensure_cache(True)
        global_result = query.read_table('validation')
        result['global_validation'] = global_result
        result['global_v2_validated'] = global_result['passed']
        result['ready_for_chapter4'] = result['passed'] and global_result['ready_for_chapter4']
        result['scope'] = 'L4 documentary rows plus integrated v2.2 source corpus'
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return 2 if not result['passed'] or not global_result['passed'] else 3 if args.release_check and not result['ready_for_chapter4'] else 0
    if args.word:
        rows = [dict(r, source_id='SRC-BOOK-04') for r in load_tsv('textbook-vocabulary.tsv') if r['hanzi'] == args.word]
    elif args.hanzi:
        rows = [r for r in load_tsv('worksheet-rows.tsv') if r['hanzi'] == args.hanzi]
    elif args.dialogue:
        rows = [r for r in selected_dialogue_rows() if r['dialogue_id'] == args.dialogue]
    elif args.canonical_dialogues:
        rows = selected_dialogue_rows(canonical_only=True)
    elif args.authority:
        print(json.dumps(load_json('../../SOURCE_AUTHORITY.json'), ensure_ascii=False, indent=2))
        return 0
    elif args.issues:
        rows = load_json('discrepancies.json')
    elif args.pages:
        rows = page_ledger()
    else:
        print(json.dumps(load_json('manifest.json'), ensure_ascii=False, indent=2))
        return 0
    if args.source:
        rows = [r for r in rows if r.get('source_id') == args.source]
    print(json.dumps({'scope':'L4 source witness query; use ../query.py for the integrated corpus', 'total':len(rows),
                      'rows':rows[args.offset:args.offset+args.limit],
                      'next_offset':args.offset+args.limit if args.offset+args.limit < len(rows) else None},
                     ensure_ascii=False, indent=2))
    return 0

if __name__ == '__main__':
    try:
        raise SystemExit(main())
    except (OSError, ValueError, KeyError, TypeError) as exc:
        print(f'L4 audit error: {exc}', file=sys.stderr)
        raise SystemExit(2)
