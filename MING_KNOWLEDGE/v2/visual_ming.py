"""Versioned visual classification only: no images, prompts, layout or API calls."""
from __future__ import annotations
import argparse
import copy
import csv
import hashlib
import json
from collections import Counter
from pathlib import Path
from source_audit import read_json, write_table
from pinyin_ming import internal_only, pinyin_for_display
from translations_ming import spanish_for_display

ROOT = Path(__file__).resolve().parent
MODES = ('literal_photo', 'action_scene', 'concept_scene', 'visual_grammar', 'phrase_context', 'none')
RISKS = ('low', 'medium', 'high')
PUBLIC_FIELDS = ('visual_mode', 'image_support', 'image_quiz_eligible', 'ambiguity_risk')
COLUMNS = ('vocab_id', 'hanzi', *PUBLIC_FIELDS, 'notes')
REPORT_STEM = 'visual-ming-20260925'


def require(condition: bool, message: str) -> None:
    if not condition:
        raise ValueError('Visual Ming: ' + message)


def dependency_paths(root: Path = ROOT) -> list[Path]:
    path = root / 'visual-ming.json'
    config = read_json(path)
    require(config.get('schema_version') == '1.0.0', 'unsupported schema')
    require(config.get('scope') == 'published_vocabulary_only', 'unsupported scope')
    require(config.get('method') == 'model_editorial_semantic_classification', 'unexpected method')
    require(config.get('review_status') == 'model_classified_not_image_validated', 'image approval is not part of this layer')
    require(config.get('files') and isinstance(config['files'], list), 'missing input files')
    files = [root / 'visual_ming.py', path]
    for name in config['files']:
        source = (root / name).resolve()
        require(source.is_relative_to((root / 'visual').resolve()) and source.suffix == '.tsv', 'invalid classification path')
        require(source.is_file(), f'missing classification file {name}')
        files.append(source)
    require(len(files) == len(set(files)), 'duplicate dependency path')
    return files


def validate_visual(value: dict, public: bool = False) -> None:
    keys = set(PUBLIC_FIELDS) if public else set(PUBLIC_FIELDS) | {'notes'}
    require(set(value) == keys, 'unexpected or missing visual fields')
    mode, risk = value['visual_mode'], value['ambiguity_risk']
    require(mode in MODES, 'unknown visual mode')
    require(risk in RISKS, 'unknown ambiguity risk')
    require(type(value['image_support']) is bool and type(value['image_quiz_eligible']) is bool, 'flags must be booleans')
    support, quiz = value['image_support'], value['image_quiz_eligible']
    if mode == 'none':
        require(not support and not quiz and risk == 'high', 'none cannot claim image support or image quiz')
    else:
        require(support, 'a visual mode must declare visual support')
    if mode in {'visual_grammar', 'phrase_context'}:
        require(not quiz, 'structured/contextual support is not an image-only quiz')
    if quiz:
        require(support and mode in {'literal_photo', 'action_scene', 'concept_scene'} and risk != 'high', 'ambiguous image-only quiz')
    if not public:
        note = value['notes']
        require(isinstance(note, str) and bool(note.strip()) and note == note.strip(), 'missing editorial rationale')
        require('\n' not in note and '\r' not in note, 'multiline rationale')


def read_classifications(path: Path) -> dict[str, dict]:
    rows = {}
    with path.open(encoding='utf-8', newline='') as stream:
        reader = csv.reader(stream, delimiter='\t')
        require(next(reader, None) == list(COLUMNS), 'incorrect TSV header')
        for number, cells in enumerate(reader, 2):
            require(len(cells) == len(COLUMNS), f'column count at line {number}')
            row = dict(zip(COLUMNS, cells))
            vid, hanzi = row.pop('vocab_id'), row.pop('hanzi')
            require(hanzi and hanzi == hanzi.strip() and vid == 'v-' + hanzi, f'ID/text mismatch at line {number}')
            require(vid not in rows, f'duplicate classification {vid}')
            for name in ('image_support', 'image_quiz_eligible'):
                require(row[name] in {'true', 'false'}, f'invalid boolean {vid} {name}')
                row[name] = row[name] == 'true'
            validate_visual(row)
            rows[vid] = {'vocab_id': vid, 'hanzi': hanzi, **row}
    return rows


def load_batch(root: Path = ROOT) -> tuple[dict, dict[str, dict]]:
    dependency_paths(root)
    config = read_json(root / 'visual-ming.json')
    rows = {}
    for name in config['files']:
        shard = read_classifications(root / name)
        require(not set(rows).intersection(shard), 'duplicate classification across files')
        rows.update(shard)
    return config, rows


def is_published_word(row: dict) -> bool:
    # Same existing eligibility as export-corpus-v21.py; classification never changes it.
    return bool(pinyin_for_display(row) and spanish_for_display(row) and not internal_only(row))


def apply_classifications(words: list[dict], entries: dict[str, dict]) -> list[dict]:
    expected = {r['id']: r for r in words if is_published_word(r)}
    require(len({r['id'] for r in words}) == len(words), 'duplicate vocabulary IDs')
    require(set(entries) == set(expected), 'coverage mismatch: missing=' + str(sorted(set(expected) - set(entries))) + '; unexpected=' + str(sorted(set(entries) - set(expected))))
    records = []
    for word in words:
        entry = entries.get(word['id'])
        if entry is None:
            continue  # Ineligible documentary fragments remain unclassified, not promoted.
        require(entry['vocab_id'] == word['id'] and entry['hanzi'] == word['hanzi'], 'classification bound to different text')
        value = {key: entry[key] for key in (*PUBLIC_FIELDS, 'notes')}
        validate_visual(value)
        word['visual_ming'] = copy.deepcopy(value)
        records.append({'id': 'VM-' + word['id'], 'vocab_id': word['id'], 'hanzi': word['hanzi'],
                        'lessons': word.get('lessons', []), **copy.deepcopy(value)})
    return records


def public_visual(value: dict) -> dict:
    validate_visual(value)
    return {key: value[key] for key in PUBLIC_FIELDS}


def enrich_cache(cache: Path) -> None:
    config, entries = load_batch()
    words = read_json(cache / 'vocabulary.json')
    records = apply_classifications(words, entries)
    word_by_id = {r['id']: r for r in words}
    matrix = read_json(cache / 'matrix.json')
    for row in matrix:
        value = word_by_id.get(row['id'], {}).get('visual_ming')
        if value is not None:
            row['visual_ming'] = copy.deepcopy(value)
    digest = hashlib.sha256()
    for path in dependency_paths():
        digest.update(str(path.relative_to(ROOT)).encode('utf-8') + b'\0' + path.read_bytes() + b'\0')
    mode_counts = Counter(r['visual_mode'] for r in records)
    summary = {'schema_version': config['schema_version'], 'batch_id': config['batch_id'],
               'prepared_date': config['prepared_date'], 'base_commit': config['base_commit'],
               'fingerprint': digest.hexdigest(), 'classified_vocabulary': len(records),
               'counts_by_mode': {mode: mode_counts[mode] for mode in MODES},
               'image_quiz_candidates': sum(r['image_quiz_eligible'] for r in records),
               'support_only': sum(r['image_support'] and not r['image_quiz_eligible'] for r in records),
               'without_own_image': sum(not r['image_support'] for r in records),
               'counts_by_ambiguity': {risk: sum(r['ambiguity_risk'] == risk for r in records) for risk in RISKS},
               'unclassified_published_ids': [],
               'excluded_documentary_ids': [r['id'] for r in words if not is_published_word(r)],
               'images_generated': 0, 'paid_api_calls': 0, 'independent_human_review': False,
               'method': config['method'], 'review_status': config['review_status'], 'limits': config['limits']}
    for name, data in [('vocabulary', words), ('matrix', matrix), ('visual_ming', records), ('visual_ming_summary', summary)]:
        write_table(cache, name, data)
    for name in ('index', 'validation'):
        data = read_json(cache / (name + '.json'))
        data['visual_ming'] = summary
        if name == 'validation':
            data['checks'] = list(dict.fromkeys(data['checks'] + [
                'complete ID-bound editorial visual classification of existing published vocabulary',
                'image-only quiz eligibility is distinct from contextual/structured support',
                'no image assets, generation prompts, layout or documentary rewrites in visual classification']))
        write_table(cache, name, data)


def augment_public(payload: dict, cache: Path) -> dict:
    words = {r['id']: r for r in read_json(cache / 'vocabulary.json')}
    for row in payload['vocabulary']:
        require(row['id'] in words and words[row['id']].get('visual_ming') is not None, 'unclassified public word')
        row['visual_ming'] = public_visual(words[row['id']]['visual_ming'])
    return payload


def check_public(cache: Path, public: dict) -> dict:
    words = [r for r in read_json(cache / 'vocabulary.json') if is_published_word(r)]
    expected = {r['id']: r for r in words}
    actual = {r['id']: r for r in public['vocabulary']}
    require(len(actual) == len(public['vocabulary']) and set(actual) == set(expected), 'public vocabulary membership changed')
    for vid, word in expected.items():
        value = actual[vid].get('visual_ming')
        require(isinstance(value, dict), 'missing public visual classification')
        validate_visual(value, public=True)
        require(value == public_visual(word['visual_ming']), f'incorrect public classification {vid}')
        require(actual[vid]['hanzi'] == word['hanzi'], 'public Chinese changed')
        require(actual[vid]['pinyin'] == pinyin_for_display(word), 'public pinyin changed')
        require(actual[vid]['spanish'] == spanish_for_display(word), 'public Spanish changed')
    return {'classified_vocabulary': len(actual), 'notes_not_exposed': True,
            'public_fields': list(PUBLIC_FIELDS), 'fingerprint': public['fingerprint']}


def report_documents(cache: Path, public: dict) -> tuple[str, str]:
    summary = read_json(cache / 'visual_ming_summary.json')
    summary['public'] = check_public(cache, public)
    summary['entries'] = read_json(cache / 'visual_ming.json')
    text = ['# Míng — clasificación visual editorial', '',
            'Clasificación semántica del vocabulario publicado; no es una aprobación de imágenes ni un cambio de interfaz.', '',
            f"Lote: `{summary['batch_id']}`. Base: `{summary['base_commit']}`.", '',
            f"**{summary['classified_vocabulary']} entradas clasificadas**, sin entradas públicas pendientes.", '',
            '| Categoría | Entradas |', '|---|---:|']
    text += [f'| {mode} | {count} |' for mode, count in summary['counts_by_mode'].items()]
    text += ['', f"Candidatas a recuerdo por imagen: **{summary['image_quiz_candidates']}**; solo apoyo: **{summary['support_only']}**; sin imagen propia: **{summary['without_own_image']}**.", '',
             '`image_quiz_eligible` es una candidatura editorial: una futura imagen necesita validación semántica y control de respuestas equivalentes. No existe un lote de imágenes aprobado.', '',
             'Las notas quedan en el corpus editorial. La proyección pública contiene solo cuatro campos de clasificación; no se cambia su uso en las tarjetas.', '',
             '## Decisiones por entrada', '',
             '| ID | Hanzi | Categoría | Apoyo | Quiz candidato | Ambigüedad | Criterio editorial |',
             '|---|---|---|---|---|---|---|']
    for row in summary['entries']:
        note = row['notes'].replace('|', '\\|')
        text.append(f"| {row['vocab_id']} | {row['hanzi']} | {row['visual_mode']} | {'sí' if row['image_support'] else 'no'} | {'sí' if row['image_quiz_eligible'] else 'no'} | {row['ambiguity_risk']} | {note} |")
    text += ['', '## Límites', ''] + ['- ' + item for item in summary['limits']]
    return json.dumps(summary, ensure_ascii=False, indent=2) + '\n', '\n'.join(text) + '\n'


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true')
    parser.add_argument('--write-reports', action='store_true')
    parser.add_argument('--check-reports', action='store_true')
    args = parser.parse_args()
    from query import CACHE, ensure_cache, read_table
    ensure_cache()
    result = read_table('visual_ming_summary')
    if args.check or args.write_reports or args.check_reports:
        public = read_json(ROOT.parents[1] / 'data/corpus-v21-public.json')
        result['public'] = check_public(CACHE, public)
    if args.write_reports or args.check_reports:
        content_json, content_md = report_documents(CACHE, public)
        directory = ROOT / 'audits'
        directory.mkdir(exist_ok=True)
        for suffix, content in (('.json', content_json), ('.md', content_md)):
            path = directory / (REPORT_STEM + suffix)
            if args.check_reports:
                require(path.is_file() and path.read_text(encoding='utf-8') == content, 'stale visual report ' + path.name)
            else:
                path.write_text(content, encoding='utf-8')
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
