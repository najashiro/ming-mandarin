"""Bounded, offline corpus queries. Run --help. No PDFs, network or paid APIs."""
from __future__ import annotations
import argparse, contextlib, hashlib, io, json, os, runpy, shutil, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parent
CACHE = ROOT / '.cache'
DEFAULT_FIELDS = {
    'matrix': ['id','hanzi','pinyin','pinyin_ming','pinyin_display','spanish','traduccion_ming','spanish_display','lessons','roles','phrase_count','primary_phrase','ming_vocabulary','ming_hanzi','ming_game_bank','textbook_table_rows'],
    'vocabulary': ['id','hanzi','pinyin','pinyin_ming','pinyin_display','spanish','traduccion_ming','spanish_display','lessons','roles','phrase_count','primary_phrase_id','radical_ids','textbook_table_rows','curriculum_links','example_phrase_ids'],
    'phrases': ['id','hanzi','pinyin','pinyin_status','pinyin_ming','pinyin_display','traduccion_ming','spanish_display','lessons','kinds','vocab_ids','example_vocab_ids','grammar_ids','dialogue_ids'],
    'hanzi': ['id','hanzi','source_writing_target','worksheet_refs','worksheet_occurrences','readings','runtime_units','documented_radical_ids','proposed_radical_ids'],
    'radical_matrix': ['id','radical','name','meaning','metadata_status','lessons','theory','practice','worksheet','exam','exam_characters','vocab_count','phrase_count'],
    'radical_catalog': ['id','radical','name_source','meaning_source','metadata_status','lessons','roles','exam_characters'],
    'radical_assessment_items': ['id','hanzi','source_id','page','radical_candidate','candidate_status','radical_meaning_source','source_answer_key_supplied','automatic_grading_approved'],
    'exercises': ['id','source_id','page','lesson','section','label_source','answer_status'],
    'page_inventory': ['id','source_id','pdf_page','printed_page','status','textbook_table_row_ids'],
    'textbook_table_rows': ['id','table_id','lesson','text','list_type','printed_number','subentry_index','hanzi','pinyin_source','source_id','page','printed_page'],
    'translations_ming': ['id','target_table','target_id','hanzi','traduccion_ming','internal_only','usage','review_status'],
    'pinyin_ming': ['id','target_table','target_id','hanzi','pinyin_ming','review_status'],
    'pedagogical_example_links': ['id','vocab_id','phrase_id','relation','via_vocab_id','composition_id'],
}


def ensure_cache(force: bool = False) -> None:
    from translations_ming import dependency_paths
    from pinyin_ming import dependency_paths as pinyin_dependencies
    manifest = ROOT / 'source/manifest.json'
    metadata = json.loads(manifest.read_text(encoding='utf-8'))
    dependencies = [manifest, ROOT/'compile.py', ROOT/'pack.py', ROOT/'radicals.py', ROOT/'radicals-source.json',
                    ROOT/'query.py', ROOT/'source_audit.py', ROOT/'source-tables.json',
                    ROOT/'lexical_examples.py', ROOT/'lexical-compositions.json'] + dependency_paths() + pinyin_dependencies()
    for part in metadata['parts']:
        path = (ROOT / part['path']).resolve()
        if not path.is_relative_to(ROOT / 'source'):
            raise ValueError('Source pack path escapes source directory')
        dependencies.append(path)
    digest = hashlib.sha256()
    for path in dependencies:
        digest.update(str(path.relative_to(ROOT)).encode('utf-8') + b'\0' + path.read_bytes() + b'\0')
    fingerprint = digest.hexdigest()
    marker = CACHE / 'fingerprint.txt'
    if not force and marker.exists() and marker.read_text() == fingerprint:
        return
    CACHE.mkdir(exist_ok=True)
    marker.unlink(missing_ok=True)
    previous = os.environ.get('MING_CORPUS_OUT')
    os.environ['MING_CORPUS_OUT'] = str(CACHE)
    try:
        with contextlib.redirect_stdout(io.StringIO()):
            runpy.run_path(str(ROOT / 'compile.py'), run_name='__corpus_build__')
    finally:
        if previous is None:
            os.environ.pop('MING_CORPUS_OUT', None)
        else:
            os.environ['MING_CORPUS_OUT'] = previous
    from radicals import enrich_cache
    enrich_cache(CACHE)
    from source_audit import enrich_cache as enrich_source_audit
    enrich_source_audit(CACHE)
    from translations_ming import enrich_cache as enrich_translations
    enrich_translations(CACHE)
    from pinyin_ming import enrich_cache as enrich_pinyin
    enrich_pinyin(CACHE)
    from lexical_examples import enrich_cache as enrich_examples
    enrich_examples(CACHE)
    validation = read_table('validation')
    if not validation.get('passed'):
        raise ValueError('Corpus validation failed; see generated validation.json')
    marker.write_text(fingerprint)


def read_table(name: str):
    if not name.replace('_', '').isalnum():
        raise ValueError('Invalid table name')
    path = CACHE / f'{name}.json'
    if not path.is_file():
        raise ValueError(f'Unknown table: {name}')
    return json.loads(path.read_text(encoding='utf-8'))


def selected(row: dict, fields: list[str] | None) -> dict:
    return {key: row.get(key) for key in fields} if fields else row


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--word', help='Exact Hanzi or vocabulary ID, e.g. 工作 or v-工作')
    ap.add_argument('--examples', action='store_true', help='With --word, query global pedagogical examples, including approved compounds')
    ap.add_argument('--phrase', help='Exact phrase ID or Chinese text')
    ap.add_argument('--radical', help='Exact radical glyph or ID, e.g. 讠 or RAD-U8BA0')
    ap.add_argument('--hanzi', help='Exact character glyph or c- ID; includes worksheet evidence')
    ap.add_argument('--source', help='Source ID; combine with --page')
    ap.add_argument('--page', type=int)
    ap.add_argument('--table', default='matrix')
    ap.add_argument('--lesson', type=int, choices=[0,1,2,3])
    ap.add_argument('--limit', type=int, default=12)
    ap.add_argument('--offset', type=int, default=0)
    ap.add_argument('--fields', help='Comma-separated projection of table fields')
    ap.add_argument('--full', action='store_true', help='Include full records; usually unnecessary for Codex')
    ap.add_argument('--validate', action='store_true')
    ap.add_argument('--summary', action='store_true')
    ap.add_argument('--rebuild', action='store_true')
    ap.add_argument('--export', type=Path, help='Export all generated JSON and TSV tables')
    args = ap.parse_args()
    if not 1 <= args.limit <= 100 or args.offset < 0:
        ap.error('--limit must be 1..100; --offset must be nonnegative')
    if args.examples and not args.word:
        ap.error('--examples requires --word')
    ensure_cache(args.rebuild or args.validate)
    if args.export:
        args.export.mkdir(parents=True, exist_ok=True)
        for path in CACHE.iterdir():
            if path.suffix in ['.json','.tsv']:
                shutil.copy2(path, args.export / path.name)
        result = {'exported_to': str(args.export), 'validation': read_table('validation')}
    elif args.validate:
        result = read_table('validation')
    elif args.summary:
        result = read_table('index')
    elif args.radical:
        from radicals import rid
        key = args.radical if args.radical.startswith('RAD-') else rid(args.radical)
        cat = next((r for r in read_table('radical_catalog') if r['id'] == key), None)
        if cat is None:
            result = {'found': False, 'radical': args.radical}
        else:
            result = {'found': True, 'radical': selected(cat, None if args.full else DEFAULT_FIELDS['radical_catalog']),
                      'policy': read_table('index')['radical_policy'], 'tables': {}}
            for name in ['radical_evidence','radical_hanzi_links','radical_word_links','radical_phrase_links','radical_assessment_items']:
                rows = [r for r in read_table(name) if r.get('radical_id', r.get('radical_candidate_id')) == key]
                result['tables'][name] = {'total': len(rows), 'rows': rows[args.offset:args.offset + args.limit],
                    'next_offset': args.offset + args.limit if args.offset + args.limit < len(rows) else None}
    elif args.hanzi:
        key = args.hanzi if args.hanzi.startswith('c-') else 'c-' + args.hanzi
        char = next((r for r in read_table('hanzi') if r['id'] == key), None)
        result = {'found': char is not None, 'hanzi': selected(char, None if args.full else DEFAULT_FIELDS['hanzi']) if char else None,
                  'radical_links': [r for r in read_table('radical_hanzi_links') if r['hanzi_id'] == key]}
    elif args.word:
        vid = args.word if args.word.startswith('v-') else 'v-' + args.word
        word = next((row for row in read_table('vocabulary') if row['id'] == vid), None)
        if word is None:
            result = {'found': False, 'word': args.word, 'note': 'No exact record; do not invent source data.'}
        else:
            ids = word.get('example_phrase_ids', []) if args.examples else word['phrase_ids']
            pp = {row['id']: row for row in read_table('phrases')}
            show = ids[args.offset:args.offset + args.limit]
            result = {'found': True, 'word': selected(word, None if args.full else DEFAULT_FIELDS['vocabulary']),
                      'runtime': word['runtime'], 'source_refs': word['source_refs'],
                      'phrase_relation': 'global_pedagogical' if args.examples else 'direct_lexical',
                      'phrases_total': len(ids), 'phrases': [selected(pp[p], None if args.full else ['id','hanzi','pinyin','pinyin_status','pinyin_ming','pinyin_display','spanish_display','kinds','source_refs']) for p in show],
                      'next_offset': args.offset + args.limit if args.offset + args.limit < len(ids) else None}
    elif args.phrase:
        pp = read_table('phrases')
        phrase = next((p for p in pp if p['id'] == args.phrase or p['hanzi'] == args.phrase), None)
        if phrase is None:
            result = {'found': False, 'phrase': args.phrase}
        else:
            evidence = [e for e in read_table('phrase_evidence') if e['phrase_id'] == phrase['id']]
            result = {'found': True, 'phrase': phrase, 'source_occurrences_total':len(evidence),
                      'source_occurrences': evidence[args.offset:args.offset + args.limit]}
    elif args.source:
        source = next((s for s in read_table('sources') if s['id'] == args.source), None)
        if source is None:
            raise ValueError('Unknown source ID')
        if args.page is not None and not 1 <= args.page <= source['pages']:
            raise ValueError('Page outside source bounds')
        result = {'source': source, 'page': args.page, 'tables': {}}
        for name in ['vocabulary_evidence','phrase_evidence','hanzi_evidence','grammar_evidence','exercises','native_transcripts','radical_evidence','radical_assessment_items','textbook_table_rows','worksheet_inventory','source_pinyin_recoveries']:
            rows = [r for r in read_table(name) if r['source_id'] == args.source and (args.page is None or r['page'] == args.page)]
            result['tables'][name] = {'total':len(rows),'rows':rows[args.offset:args.offset + args.limit],
                                     'next_offset':args.offset + args.limit if args.offset + args.limit < len(rows) else None}
    else:
        rows = read_table(args.table)
        if not isinstance(rows, list):
            result = rows
        else:
            if args.lesson is not None:
                rows = [r for r in rows if r.get('lesson') == args.lesson or args.lesson in r.get('lessons', [])]
            fields = args.fields.split(',') if args.fields else None if args.full else DEFAULT_FIELDS.get(args.table)
            result = {'table':args.table,'total':len(rows),'offset':args.offset,
                      'rows':[selected(row, fields) for row in rows[args.offset:args.offset + args.limit]],
                      'next_offset':args.offset + args.limit if args.offset + args.limit < len(rows) else None}
    print(json.dumps(result, ensure_ascii=False, indent=2))

if __name__ == '__main__':
    try:
        main()
    except (ValueError, OSError, json.JSONDecodeError) as exc:
        print(f'Corpus error: {exc}', file=sys.stderr)
        raise SystemExit(2)
