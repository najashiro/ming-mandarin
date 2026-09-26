"""Authorized Spanish editorial layer. No network, model API or source rewrites.

TSV files contain prepared translations of exact registered Chinese text. The
compiler resolves stable IDs and keeps these values separate from source fields.
"""
from __future__ import annotations
import argparse
import csv
import hashlib
import json
from pathlib import Path
from source_audit import read_json, write_table

ROOT = Path(__file__).resolve().parent
CONFIG = ROOT / 'translations-ming.json'


def require(condition: bool, message: str) -> None:
    if not condition:
        raise ValueError('Ming translations: ' + message)


def dependency_paths(root: Path = ROOT) -> list[Path]:
    config_path = root / 'translations-ming.json'
    config = read_json(config_path)
    require(config.get('schema_version') == '1.0.0', 'unsupported schema')
    require(set(config['files']) == {'vocabulary', 'phrases'}, 'unexpected target table')
    paths = [root / 'translations_ming.py', config_path]
    for names in config['files'].values():
        for name in names:
            path = (root / name).resolve()
            require(path.is_relative_to((root / 'translations').resolve()) and path.suffix == '.tsv', 'invalid translation path')
            require(path.is_file(), f'missing translation file {name}')
            paths.append(path)
    require(len(paths) == len(set(paths)), 'repeated translation path')
    return paths


def read_translations(path: Path) -> dict[str, str]:
    result = {}
    with path.open(encoding='utf-8', newline='') as stream:
        reader = csv.reader(stream, delimiter='\t')
        require(next(reader, None) == ['hanzi', 'traduccion_ming'], f'incorrect TSV header {path.name}')
        for line, cells in enumerate(reader, 2):
            require(len(cells) == 2, f'expected two columns {path.name}:{line}')
            hanzi, spanish = cells
            require(hanzi and hanzi == hanzi.strip(), f'empty/changed source text {path.name}:{line}')
            require(spanish and spanish == spanish.strip(), f'empty/untrimmed translation {path.name}:{line}')
            require(hanzi not in result, f'duplicate exact text {hanzi}')
            require('\n' not in spanish and '\r' not in spanish, 'multiline translation')
            result[hanzi] = spanish
    return result


def load_batch(root: Path = ROOT) -> tuple[dict, dict[str, dict[str, str]]]:
    dependency_paths(root)
    config = read_json(root / 'translations-ming.json')
    data = {}
    for table, paths in config['files'].items():
        data[table] = {}
        for name in paths:
            shard = read_translations(root / name)
            require(not set(shard).intersection(data[table]), f'duplicate text across {table} shards')
            data[table].update(shard)
    return config, data


def source_spanish(row: dict) -> str | None:
    for variant in row.get('spanish_variants', []):
        value = variant.get('value')
        if isinstance(value, str) and value.strip():
            return value
    value = row.get('spanish')
    return value if isinstance(value, str) and value.strip() else None


def spanish_for_display(row: dict) -> str | None:
    # No provenance label is needed in the learner-facing result.
    source = source_spanish(row)
    if source:
        return source
    meta = row.get('traduccion_ming_meta') or {}
    if meta.get('internal_only'):
        return None
    return row.get('traduccion_ming') or None


def apply_translations(rows: list[dict], translations: dict[str, str], table: str, config: dict) -> list[dict]:
    require(table in {'vocabulary', 'phrases'}, 'invalid target table')
    by_text = {row['hanzi']: row for row in rows}
    require(len(by_text) == len(rows), f'non-unique exact text in {table}; requires ID-level reconciliation')
    require(not set(translations).difference(by_text), f'unregistered {table} text: {sorted(set(translations).difference(by_text))}')
    internal_words = set(config.get('internal_only_vocabulary', []))
    if table == 'vocabulary':
        require(internal_words.issubset(by_text), 'unknown internal-only fragment')
    records = []
    for row in rows:
        value = translations.get(row['hanzi'])
        row['traduccion_ming'] = value
        row['traduccion_ming_meta'] = None
        if value:
            counterexample = table == 'phrases' and 'counterexample' in row.get('kinds', [])
            fragment = table == 'vocabulary' and row['hanzi'] in internal_words
            template = table == 'phrases' and ('…' in row['hanzi'] or '_' in row['hanzi'])
            usage = 'segmentation_fragment' if fragment else 'counterexample' if counterexample else 'template' if template else 'translation'
            note = config.get('notes', {}).get(row['hanzi'])
            if fragment:
                note = 'Fragmento de segmentación ya presente en el corpus; glosa solo para control, no entrada léxica autónoma.'
            elif counterexample:
                note = 'Glosa de un contraejemplo conservado. No corrige ni valida la construcción china, ni la convierte en ejemplo positivo.'
            elif template:
                note = 'Se conserva la elipsis/hueco de la plantilla; no se completa el ejercicio.'
            meta = {'id': 'TM-' + row['id'], 'batch_id': config['batch_id'],
                    'method': config['method'], 'review_status': config['review_status'],
                    'internal_only': fragment or counterexample, 'usage': usage, 'note': note,
                    'source_text_sha256': hashlib.sha256(row['hanzi'].encode('utf-8')).hexdigest()}
            row['traduccion_ming_meta'] = meta
            records.append({'id': meta['id'], 'target_table': table, 'target_id': row['id'],
                            'hanzi': row['hanzi'], 'traduccion_ming': value, **{k:v for k,v in meta.items() if k != 'id'}})
        row['spanish_display'] = spanish_for_display(row)
    return records


def enrich_cache(cache: Path) -> None:
    config, translations = load_batch()
    data = {name: read_json(cache / (name + '.json')) for name in ['vocabulary', 'phrases', 'matrix', 'index', 'validation']}
    records, counts = [], {}
    for table in ['vocabulary', 'phrases']:
        rows = data[table]
        added = apply_translations(rows, translations[table], table, config)
        records.extend(added)
        counts[table] = {
            'total_records': len(rows),
            'documentary_spanish_preserved': sum(bool(source_spanish(row)) for row in rows),
            'generated_ming_records': len(added),
            'internal_only_records': sum(row['internal_only'] for row in added),
            'templates_with_ellipsis_preserved': sum(row['usage'] == 'template' for row in added),
            'with_source_or_ming_translation': sum(bool(source_spanish(row) or row.get('traduccion_ming')) for row in rows),
            'missing_any_translation_ids': [row['id'] for row in rows if not (source_spanish(row) or row.get('traduccion_ming'))],
        }
    words = {row['id']: row for row in data['vocabulary']}
    for row in data['matrix']:
        if row['id'] in words:
            row.update({key: words[row['id']][key] for key in ['traduccion_ming', 'traduccion_ming_meta', 'spanish_display']})
    digest = hashlib.sha256()
    for path in dependency_paths():
        digest.update(str(path.relative_to(ROOT)).encode() + b'\0' + path.read_bytes() + b'\0')
    summary = {'schema_version': config['schema_version'], 'batch_id': config['batch_id'],
               'prepared_date': config['prepared_date'], 'base_commit': config['base_commit'],
               'fingerprint': digest.hexdigest(), 'counts': counts, 'limits': config['limits'],
               'source_spanish_fields_overwritten': 0, 'paid_api_calls': 0,
               'independent_human_review': False}
    data['index']['ming_translations'] = summary
    data['validation']['ming_translations'] = summary
    data['validation']['checks'] = list(dict.fromkeys(data['validation']['checks'] + [
        'editorial translations bind to exact registered Chinese without changing source variants',
        'source Spanish takes precedence over separate traduccion_ming',
        'counterexamples and malformed vocabulary fragments remain internal-only']))
    for name, value in data.items():
        write_table(cache, name, value)
    write_table(cache, 'translations_ming', records)
    write_table(cache, 'translations_ming_summary', summary)


def check_public(cache: Path, public: dict) -> dict:
    from pinyin_ming import pinyin_for_display
    words = read_json(cache / 'vocabulary.json')
    phrases = read_json(cache / 'phrases.json')
    expected_words = {r['id']: r for r in words if pinyin_for_display(r) and spanish_for_display(r) and not (r.get('traduccion_ming_meta') or {}).get('internal_only')}
    expected_phrases = {r['id']: r for r in phrases if 'counterexample' not in r.get('kinds', [])}
    for name, expected in [('vocabulary', expected_words), ('phrases', expected_phrases)]:
        actual = {r['id']: r for r in public[name]}
        require(len(actual) == len(public[name]), f'duplicate public {name} IDs')
        require(set(actual) == set(expected), f'public {name} eligibility unexpectedly changed')
        for key, row in expected.items():
            require(actual[key]['spanish'] == spanish_for_display(row), f'incorrect Spanish fallback {key}')
            require(actual[key]['hanzi'] == row['hanzi'], f'Chinese changed {key}')
    forbidden = {'traduccion_ming', 'traduccion_ming_meta', 'spanish_display', 'spanish_origin', 'review_status', 'source_id', 'source_refs', 'evidence_ids', 'pdfPage', 'printedPage'}
    def inspect(value):
        if isinstance(value, dict):
            require(not forbidden.intersection(value), 'translation/source provenance leaked to learner projection')
            for child in value.values(): inspect(child)
        elif isinstance(value, list):
            for child in value: inspect(child)
    inspect(public)
    witnesses = read_json(cache / 'phrase_evidence.json')
    by_phrase = {r['id']: r for r in phrases}
    for dialogue in public['dialogues']:
        for turn in dialogue['turns']:
            matches = [r for r in witnesses if r.get('dialogue_id') == dialogue['id'] and r.get('turn') == turn['turn'] and r['hanzi'] == turn['hanzi'] and r.get('speaker_source') == turn['speaker']]
            require(len(matches) == 1, 'ambiguous dialogue translation witness')
            expected = matches[0].get('spanish_source') or spanish_for_display(by_phrase[turn['phraseId']])
            require(turn['spanish'] == expected, 'dialogue translation assigned to wrong turn')
    return {'vocabulary_records': len(public['vocabulary']), 'phrases': len(public['phrases']),
            'vocabulary_with_spanish': sum(bool(r['spanish']) for r in public['vocabulary']),
            'phrases_with_spanish': sum(bool(r['spanish']) for r in public['phrases']),
            'dialogue_turns': sum(len(d['turns']) for d in public['dialogues']),
            'dialogue_turns_with_spanish': sum(bool(t['spanish']) for d in public['dialogues'] for t in d['turns']),
            'provenance_not_exposed': True, 'public_fingerprint': public['fingerprint']}


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true')
    parser.add_argument('--write-reports', action='store_true')
    args = parser.parse_args()
    from query import CACHE, ensure_cache, read_table
    ensure_cache()
    report = read_table('translations_ming_summary')
    if args.check or args.write_reports:
        report['public'] = check_public(CACHE, read_json(ROOT.parents[1] / 'data/corpus-v21-public.json'))
    if args.write_reports:
        directory = ROOT / 'audits'
        directory.mkdir(exist_ok=True)
        stem = 'translations-ming-20260925'
        (directory / (stem + '.json')).write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        text = ['# Traducciones Míng — lote editorial autorizado', '',
                'Fecha del lote: ' + report['prepared_date'], '',
                'Las traducciones son elaboraciones del modelo, no texto atribuido a los documentos ni revisión humana independiente.', '',
                '| Colección | Registros | Español documental conservado | Traducciones Míng | Solo control interno | Sin ninguna traducción |',
                '|---|---:|---:|---:|---:|---:|']
        for table, counts in report['counts'].items():
            text.append(f"| {table} | {counts['total_records']} | {counts['documentary_spanish_preserved']} | {counts['generated_ming_records']} | {counts['internal_only_records']} | {len(counts['missing_any_translation_ids'])} |")
        text += ['', '## Salida para la web', '', json.dumps(report['public'], ensure_ascii=False, indent=2), '',
                 'La web recibe únicamente `spanish`, resuelto como español documental o traducción Míng de respaldo. No recibe el autor ni el método de traducción.', '',
                 '## Límites', ''] + ['- ' + item for item in report['limits']]
        text += ['', 'Los nueve fragmentos de vocabulario siguen en control interno; los ocho contraejemplos conservan su clasificación. Las plantillas no se completan con respuestas inventadas.', '',
                 'El pinyin, los audios, las imágenes, las fichas Hanzi y las clasificaciones curriculares no se modifican.', '']
        (directory / (stem + '.md')).write_text('\n'.join(text), encoding='utf-8')
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
