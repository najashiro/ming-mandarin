"""Authorized editorial pinyin: exact registered text, source-first, offline.

This does not change pinyin/pinyin_variants or manufacture source witnesses.
"""
from __future__ import annotations
import argparse
import csv
import hashlib
import json
import unicodedata
from pathlib import Path
from source_audit import read_json, write_table

ROOT = Path(__file__).resolve().parent


def require(condition: bool, message: str) -> None:
    if not condition:
        raise ValueError('Ming pinyin: ' + message)


def dependency_paths(root: Path = ROOT) -> list[Path]:
    config_path = root / 'pinyin-ming.json'
    config = read_json(config_path)
    require(config.get('schema_version') == '1.0.0', 'unsupported schema')
    require(set(config['files']) == {'vocabulary', 'phrases'}, 'unexpected table')
    paths = [root / 'pinyin_ming.py', config_path]
    for names in config['files'].values():
        for name in names:
            path = (root / name).resolve()
            require(path.is_relative_to((root / 'pinyin').resolve()) and path.suffix == '.tsv', 'invalid pinyin path')
            require(path.is_file(), f'missing pinyin file {name}')
            paths.append(path)
    require(len(paths) == len(set(paths)), 'repeated pinyin path')
    return paths


def validate_reading(value: str) -> None:
    require(bool(value) and value == value.strip(), 'empty or untrimmed pinyin')
    require(value == unicodedata.normalize('NFC', value), 'pinyin must be NFC')
    require(not any('\u3400' <= c <= '\u9fff' for c in value), 'untranscribed Chinese in pinyin')
    require(not any(c.isdigit() for c in value), 'digits must be read in context')
    require(not any(c in '\n\r\t' for c in value), 'multiline pinyin')
    require(not any(unicodedata.category(c).startswith('C') for c in value), 'control character in pinyin')
    require(any(c.isalpha() for c in value), 'pinyin lacks letters')


def read_pinyin(path: Path) -> dict[str, str]:
    result = {}
    with path.open(encoding='utf-8', newline='') as stream:
        reader = csv.reader(stream, delimiter='\t')
        require(next(reader, None) == ['hanzi', 'pinyin_ming'], f'incorrect TSV header {path.name}')
        for line, cells in enumerate(reader, 2):
            require(len(cells) == 2, f'expected two columns {path.name}:{line}')
            hanzi, pinyin = cells
            require(hanzi and hanzi == hanzi.strip(), 'empty/changed source text')
            require(hanzi not in result, f'duplicate exact text {hanzi}')
            validate_reading(pinyin)
            result[hanzi] = pinyin
    return result


def load_batch(root: Path = ROOT) -> tuple[dict, dict[str, dict[str, str]]]:
    dependency_paths(root)
    config = read_json(root / 'pinyin-ming.json')
    data = {}
    for table, paths in config['files'].items():
        data[table] = {}
        for name in paths:
            shard = read_pinyin(root / name)
            require(not set(shard).intersection(data[table]), 'duplicate text across shards')
            data[table].update(shard)
        require(len(data[table]) == config['expected_batch_records'][table], f'incomplete prepared batch {table}')
    return config, data


def source_pinyin(row: dict) -> str | None:
    for variant in row.get('pinyin_variants', []):
        value = variant.get('value')
        if isinstance(value, str) and value.strip():
            return value
    value = row.get('pinyin')
    return value if isinstance(value, str) and value.strip() else None


def internal_only(row: dict) -> bool:
    return 'counterexample' in row.get('kinds', []) or bool((row.get('traduccion_ming_meta') or {}).get('internal_only'))


def pinyin_for_display(row: dict) -> str | None:
    source = source_pinyin(row)
    if source:
        return source
    if internal_only(row) or (row.get('pinyin_ming_meta') or {}).get('internal_only'):
        return None
    return row.get('pinyin_ming') or None


def apply_pinyin(rows: list[dict], prepared: dict[str, str], table: str, config: dict) -> list[dict]:
    require(table in {'vocabulary', 'phrases'}, 'invalid target table')
    by_text = {row['hanzi']: row for row in rows}
    require(len(by_text) == len(rows), 'non-unique exact source text; use an ID-level reconciliation')
    require(not set(prepared).difference(by_text), f'unregistered {table} text: {sorted(set(prepared).difference(by_text))}')
    records = []
    for row in rows:
        value = prepared.get(row['hanzi'])
        row['pinyin_ming'] = value
        row['pinyin_ming_meta'] = None
        if value:
            require(not internal_only(row), f'ineligible fragment/counterexample {row["id"]}')
            validate_reading(value)
            template = '…' in row['hanzi'] or '_' in row['hanzi']
            if template:
                require('…' in value or '_' in value, 'template hole was filled')
            meta = {'id': 'PM-' + row['id'], 'batch_id': config['batch_id'],
                    'method': config['method'], 'review_status': config['review_status'],
                    'internal_only': False, 'template': template,
                    'note': config.get('notes', {}).get(row['hanzi']),
                    'source_text_sha256': hashlib.sha256(row['hanzi'].encode('utf-8')).hexdigest()}
            row['pinyin_ming_meta'] = meta
            records.append({'id': meta['id'], 'target_table': table, 'target_id': row['id'],
                            'hanzi': row['hanzi'], 'pinyin_ming': value,
                            **{k: v for k, v in meta.items() if k != 'id'}})
        row['pinyin_display'] = pinyin_for_display(row)
    return records


def enrich_cache(cache: Path) -> None:
    config, prepared = load_batch()
    names = ['vocabulary', 'phrases', 'matrix', 'index', 'validation']
    data = {name: read_json(cache / (name + '.json')) for name in names}
    records, counts = [], {}
    for table in ['vocabulary', 'phrases']:
        rows = data[table]
        added = apply_pinyin(rows, prepared[table], table, config)
        records.extend(added)
        counts[table] = {
            'total_records': len(rows),
            'source_pinyin_preserved': sum(bool(source_pinyin(r)) for r in rows),
            'generated_ming_records': len(added),
            'with_source_or_ming_pinyin': sum(bool(source_pinyin(r) or r.get('pinyin_ming')) for r in rows),
            'eligible_records': sum(not internal_only(r) for r in rows),
            'eligible_missing_pinyin_ids': [r['id'] for r in rows if not internal_only(r) and not pinyin_for_display(r)],
            'excluded_missing_pinyin_ids': [r['id'] for r in rows if internal_only(r) and not source_pinyin(r)],
            'templates_transcribed_without_completion': sum(r['template'] for r in added),
        }
    words = {r['id']: r for r in data['vocabulary']}
    for row in data['matrix']:
        if row['id'] in words:
            row.update({key: words[row['id']][key] for key in ['pinyin_ming', 'pinyin_ming_meta', 'pinyin_display']})
    digest = hashlib.sha256()
    for path in dependency_paths():
        digest.update(str(path.relative_to(ROOT)).encode() + b'\0' + path.read_bytes() + b'\0')
    summary = {'schema_version': config['schema_version'], 'batch_id': config['batch_id'],
               'prepared_date': config['prepared_date'], 'base_commit': config['base_commit'],
               'fingerprint': digest.hexdigest(), 'counts': counts,
               'source_fields_overwritten': 0, 'paid_api_calls': 0,
               'independent_human_review': False, 'limits': config['limits']}
    data['index']['ming_pinyin'] = summary
    data['validation']['ming_pinyin'] = summary
    data['validation']['checks'] = list(dict.fromkeys(data['validation']['checks'] + [
        'editorial pinyin binds to exact registered Chinese and preserves source fields',
        'source pinyin takes precedence over pinyin_ming; templates remain templates',
        'malformed vocabulary fragments and counterexamples are not promoted by pinyin']))
    for name, value in data.items():
        write_table(cache, name, value)
    write_table(cache, 'pinyin_ming', records)
    write_table(cache, 'pinyin_ming_summary', summary)


def check_public(cache: Path, public: dict) -> dict:
    from translations_ming import spanish_for_display
    words = read_json(cache / 'vocabulary.json')
    phrases = read_json(cache / 'phrases.json')
    expected_words = {r['id']: r for r in words if not internal_only(r) and pinyin_for_display(r) and spanish_for_display(r)}
    expected_phrases = {r['id']: r for r in phrases if 'counterexample' not in r.get('kinds', [])}
    for table, expected in [('vocabulary', expected_words), ('phrases', expected_phrases)]:
        actual = {r['id']: r for r in public[table]}
        require(len(actual) == len(public[table]) and set(actual) == set(expected), f'public eligibility mismatch {table}')
        for key, row in expected.items():
            require(actual[key]['hanzi'] == row['hanzi'], f'Chinese changed {key}')
            require(actual[key]['pinyin'] == pinyin_for_display(row), f'wrong pinyin fallback {key}')
            require(actual[key]['spanish'] == spanish_for_display(row), f'translation changed {key}')
    forbidden = {'pinyin_ming', 'pinyin_ming_meta', 'pinyin_display', 'pinyin_origin', 'traduccion_ming', 'review_status', 'source_id', 'source_refs', 'evidence_ids', 'pdfPage', 'printedPage'}
    def inspect(value):
        if isinstance(value, dict):
            require(not forbidden.intersection(value), 'editorial provenance leaked')
            for child in value.values(): inspect(child)
        elif isinstance(value, list):
            for child in value: inspect(child)
    inspect(public)
    return {'vocabulary_records': len(public['vocabulary']), 'phrases': len(public['phrases']),
            'words_with_pinyin_and_spanish': sum(bool(r['pinyin'] and r['spanish']) for r in public['vocabulary']),
            'phrases_with_pinyin_and_spanish': sum(bool(r['pinyin'] and r['spanish']) for r in public['phrases']),
            'provenance_not_exposed': True, 'fingerprint': public['fingerprint']}


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true')
    parser.add_argument('--write-reports', action='store_true')
    args = parser.parse_args()
    from query import CACHE, ensure_cache, read_table
    ensure_cache()
    report = read_table('pinyin_ming_summary')
    if args.check or args.write_reports:
        report['public'] = check_public(CACHE, read_json(ROOT.parents[1] / 'data/corpus-v21-public.json'))
    report['lexical_examples'] = read_table('lexical_examples_summary')
    if args.write_reports:
        directory = ROOT / 'audits'
        directory.mkdir(exist_ok=True)
        stem = 'pinyin-ming-20260925'
        (directory / (stem + '.json')).write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        lines = ['# Pinyin Míng y ejemplos léxicos', '', 'Lote editorial autorizado; no es una transcripción atribuida al material ni revisión humana independiente.', '',
                 '| Colección | Registros | Pinyin de fuente conservado | Pinyin Míng | Elegibles sin pinyin | Exclusiones sin pinyin |',
                 '|---|---:|---:|---:|---:|---:|']
        for table, c in report['counts'].items():
            lines.append(f"| {table} | {c['total_records']} | {c['source_pinyin_preserved']} | {c['generated_ming_records']} | {len(c['eligible_missing_pinyin_ids'])} | {len(c['excluded_missing_pinyin_ids'])} |")
        lines += ['', '## Proyección comprobada', '', '```json', json.dumps(report['public'], ensure_ascii=False, indent=2), '```', '',
                  '## Caso 猫', '', '```json', json.dumps(report['lexical_examples']['cat_examples'], ensure_ascii=False, indent=2), '```', '',
                  '## Límites', ''] + ['- ' + item for item in report['limits']]
        lines += ['', 'Los datos documentales y las traducciones no se sobrescriben. Los nueve fragmentos y los ocho contraejemplos siguen fuera del catálogo público. Siete de esos contraejemplos carecen de pinyin y no se rellenan.', '',
                  'No se genera audio ni imágenes. Las tarjetas locales deben consumir pinyin/spanish y examplePhraseIds, o publicExamplesForVocabulary, tras integrar este cambio.', '']
        (directory / (stem + '.md')).write_text('\n'.join(lines), encoding='utf-8')
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
