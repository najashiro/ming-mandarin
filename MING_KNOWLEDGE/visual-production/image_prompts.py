#!/usr/bin/env python3
"""Compile an offline, editorial prompt catalog. Never generates images or edits corpus."""
from __future__ import annotations
import argparse
import collections
import copy
import csv
import hashlib
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
PUBLIC = ROOT / 'data/corpus-v21-public.json'
CLASSIFICATION = ROOT / 'MING_KNOWLEDGE/v2/visual/vocabulary.tsv'
RECIPE_FILES = ('recipes-scenes.tsv', 'recipes-context.tsv', 'recipes-structured.tsv')
POLICY = HERE / 'prompt-policy.json'
OUTPUT_JSON = HERE / 'IMAGE_PROMPTS.json'
OUTPUT_MD = HERE / 'IMAGE_PROMPTS.md'
SUMMARY = HERE / 'summary.json'
MODES = ('literal_photo', 'action_scene', 'concept_scene', 'visual_grammar', 'phrase_context', 'none')
NO_RENDER_QA = (
    'El recurso tiene canal alfa y píxeles exteriores realmente transparentes; no es un JPG con fondo blanco.',
    'No hay cuadrícula pintada, gradiente, tarjeta, iconos o rótulos dentro del recurso.',
    'El primer plano es visible; no se acepta un archivo completamente transparente.',
    'Pelo, dedos, orejas, patas, contorno y posibles transparencias se revisan sobre fondos claro y oscuro.',
    'El referente coincide con el sentido documentado, no solo con caracteres compartidos.',
    'Ningún candidato se habilita en el juego sin revisar el recurso real y sus respuestas equivalentes.',
)


def require(condition: bool, message: str) -> None:
    if not condition:
        raise ValueError('Image prompts: ' + message)


def read_json(path: Path):
    return json.loads(path.read_text(encoding='utf-8'))


def digest(value) -> str:
    return hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode('utf-8')).hexdigest()


def read_recipes(directory: Path = HERE) -> dict[str, dict]:
    result = {}
    expected = {'hanzi', 'profile', 'scene', 'avoid', 'shared_key'}
    for name in RECIPE_FILES:
        with (directory / name).open(encoding='utf-8', newline='') as stream:
            reader = csv.DictReader(stream, delimiter='\t')
            require(set(reader.fieldnames or []) in (expected, expected | {'assembly'}), f'incorrect header: {name}')
            for number, row in enumerate(reader, 2):
                require(None not in row, f'excess columns: {name}:{number}')
                for field in expected:
                    require(isinstance(row.get(field), str) and bool(row[field].strip()), f'empty {field}: {name}:{number}')
                    require(row[field] == row[field].strip(), f'untrimmed {field}: {name}:{number}')
                key = 'v-' + row['hanzi']
                require(key not in result, f'duplicate recipe: {key}')
                result[key] = dict(row, assembly=row.get('assembly', ''), vocab_id=key)
    return result


def load_inputs():
    public = read_json(PUBLIC)
    require(POLICY.is_file(), 'missing prompt policy')
    with CLASSIFICATION.open(encoding='utf-8', newline='') as stream:
        rows = list(csv.DictReader(stream, delimiter='\t'))
    internal = {row['vocab_id']: row for row in rows}
    require(len(internal) == len(rows), 'duplicate classification IDs')
    return public, read_recipes(), read_json(POLICY), internal


def validate_inputs(public: dict, recipes: dict, policy: dict, internal: dict) -> None:
    require(policy.get('schema_version') == '1.0.0', 'unsupported policy schema')
    require(policy['rules']['generate_images_now'] is False, 'image generation is not authorized')
    require(policy['rules']['paid_api_calls_authorized'] is False, 'paid API calls are not authorized')
    words = public['vocabulary']
    by_id = {row['id']: row for row in words}
    require(len(by_id) == len(words), 'duplicate public IDs')
    required = {row['id'] for row in words if row.get('visual_ming', {}).get('visual_mode') != 'none'}
    missing, extra = sorted(required - set(recipes)), sorted(set(recipes) - required)
    require(not missing and not extra, f'coverage mismatch; missing={missing}; extra={extra}')
    for word in words:
        vid = word['id']
        visual = word.get('visual_ming')
        require(isinstance(visual, dict) and visual.get('visual_mode') in MODES, f'missing/invalid classification: {vid}')
        require(vid in internal and word['hanzi'] == internal[vid]['hanzi'], f'classification identity mismatch: {vid}')
        for key in ('image_support', 'image_quiz_eligible'):
            require(type(visual.get(key)) is bool, f'non-boolean classification: {vid}:{key}')
            require(visual[key] == (internal[vid][key] == 'true'), f'classification mismatch: {vid}:{key}')
        for key in ('visual_mode', 'ambiguity_risk'):
            require(visual[key] == internal[vid][key], f'classification mismatch: {vid}:{key}')
        if visual['visual_mode'] == 'none':
            require(not visual['image_support'] and not visual['image_quiz_eligible'], f'inconsistent none: {vid}')
            continue
        recipe = recipes[vid]
        require(word['hanzi'] == recipe['hanzi'], f'changed target text: {vid}')
        require(recipe['profile'] in policy['profiles'], f'unknown profile: {vid}')
        require(bool(recipe['assembly']) == (visual['visual_mode'] == 'visual_grammar'), f'assembly required only for visual grammar: {vid}')
        require((recipe['profile'] == 'structured') == (visual['visual_mode'] == 'visual_grammar'), f'structured profile mismatch: {vid}')
        require((recipe['profile'] == 'context') == (visual['visual_mode'] == 'phrase_context'), f'context profile mismatch: {vid}')
        require(len(recipe['scene']) > 40 and len(recipe['avoid']) > 20, f'insufficient specific brief: {vid}')


def build(public=None, recipes=None, policy=None, internal=None) -> dict:
    if public is None:
        public, recipes, policy, internal = load_inputs()
    validate_inputs(public, recipes, policy, internal)
    # Reuse only literally identical, explicitly authored visual recipes. This does
    # NOT declare lexical synonymy or merge vocabulary/progress identities.
    groups = {}
    for row in recipes.values():
        key = digest([row['profile'], row['scene']])[:16]
        group = groups.setdefault(key, {'profile': row['profile'], 'scene': row['scene'], 'rows': []})
        group['rows'].append(row)
    units, unit_by_word = [], {}
    for key, group in sorted(groups.items()):
        cautions = sorted({r['avoid'] for r in group['rows']})
        prompt = '\n\n'.join([
            policy['global_prompt_es'], policy['profiles'][group['profile']],
            'ESCENA ESPECÍFICA: ' + group['scene'],
            'CONTROL SEMÁNTICO: ' + ' '.join(cautions), policy['global_negative_es'],
        ])
        country = group['profile'] == 'country'
        needs_reference = group['profile'] in {'country', 'place'}
        unit = {
            'production_unit_id': 'IMG-' + key,
            'profile': group['profile'], 'prompt_es': prompt,
            'vocab_ids': sorted(r['vocab_id'] for r in group['rows']),
            'reuse_families': sorted({r['shared_key'] for r in group['rows']}),
            'requires_authentic_landmark_reference': needs_reference,
            'requires_authentic_flag_reference': country,
            'reference_status': 'not_supplied_not_verified' if needs_reference else 'semantic_asset_review_required',
            'background': 'transparent_alpha', 'image_generated': False,
            'generation_authorized': False, 'image_validated': False,
        }
        units.append(unit)
        for row in group['rows']:
            unit_by_word[row['vocab_id']] = unit
    entries = []
    for word in public['vocabulary']:
        vid, visual = word['id'], copy.deepcopy(word['visual_ming'])
        no_image = visual['visual_mode'] == 'none'
        recipe, unit = recipes.get(vid), unit_by_word.get(vid)
        action = 'no_image' if no_image else 'generate_elements_then_compose' if visual['visual_mode'] == 'visual_grammar' else 'context_support' if not visual['image_quiz_eligible'] else 'subject_candidate'
        entries.append({
            'vocab_id': vid, 'hanzi': word['hanzi'], 'pinyin': word['pinyin'], 'spanish': word['spanish'],
            'visual_ming': visual, 'production_action': action,
            'profile': recipe['profile'] if recipe else None,
            'production_unit_id': unit['production_unit_id'] if unit else None,
            'prompt_es': unit['prompt_es'] if unit else None,
            'semantic_cautions_es': recipe['avoid'] if recipe else internal[vid]['notes'],
            'composition_instructions_es': recipe['assembly'] if recipe else '',
            'no_image_reason': internal[vid]['notes'] if no_image else None,
            'documented_example_ids': list(word.get('examplePhraseIds', [])),
            'example_selection_policy': 'Choose a compatible documented example; scene is editorial, not source attestation.',
            'image_quiz_candidate': visual['image_quiz_eligible'],
            'image_quiz_enabled': False, 'image_generated': False,
            'review_status': 'editorial_prompt_prepared_not_image_validated',
        })
    summary = {
        'vocabulary_entries': len(entries),
        'entries_with_prompt': sum(e['prompt_es'] is not None for e in entries),
        'without_own_image': sum(e['prompt_es'] is None for e in entries),
        'distinct_visual_recipes': len(units),
        'shared_recipe_savings_upper_bound': sum(e['prompt_es'] is not None for e in entries) - len(units),
        'counts_by_visual_mode': {mode: sum(e['visual_ming']['visual_mode'] == mode for e in entries) for mode in MODES},
        'counts_by_profile': dict(sorted(collections.Counter(e['profile'] for e in entries if e['profile']).items())),
        'country_landmark_and_flag_entries': sum(e['profile'] == 'country' for e in entries),
        'image_quiz_candidates_unchanged': sum(e['image_quiz_candidate'] for e in entries),
        'image_quiz_enabled': 0, 'images_generated': 0, 'paid_api_calls': 0,
        'missing_public_ids': [], 'ui_changed': False, 'corpus_changed': False,
    }
    payload = {
        'schema_version': policy['schema_version'], 'batch_id': policy['batch_id'],
        'prepared_date': policy['prepared_date'],
        'source_corpus_fingerprint': public['fingerprint'],
        'recipe_fingerprint': digest({'recipes': recipes, 'policy': policy}),
        'classification_fingerprint': digest({w['id']: w['visual_ming'] for w in public['vocabulary']}),
        'provenance': 'Ming editorial art directions; not images or descriptions supplied by textbook sources.',
        'scope': 'offline prompt catalog, not imported by learner UI',
        'generation_authorized': False,
        'alpha_and_semantic_qa': list(NO_RENDER_QA),
        'reference_warning': policy['rules']['references_policy'],
        'summary': summary, 'entries': entries, 'production_units': units,
    }
    payload['fingerprint'] = digest(payload)
    return payload


def markdown(payload: dict) -> str:
    s = payload['summary']
    lines = ['# Míng · Prompts de imágenes con fondo transparente', '',
        '> Catálogo editorial preparado. No se han generado imágenes ni se ha cambiado la web.', '',
        f"**{s['vocabulary_entries']} tarjetas cubiertas:** {s['entries_with_prompt']} con prompt y {s['without_own_image']} sin imagen propia.",
        f"**{s['distinct_visual_recipes']} recetas visuales distintas.** Las repetidas pueden compartir recurso tras revisión; no son sinónimos ni cambios curriculares.",
        f"**{s['country_landmark_and_flag_entries']} países** tienen lugar representativo y bandera. Se deben aportar y validar referencias auténticas antes de generar.", '',
        '## Cómo utilizar este archivo', '',
        'Buscar el Hanzi o su ID. El bloque de cada entrada es el prompt completo. La clasificación y el sentido proceden del corpus; la escena es una propuesta editorial de Míng. No incluir este catálogo en el paquete del alumno.', '',
        'El archivo solo contiene el sujeto o la escena recortada. Fondo y controles pertenecen a la tarjeta. No debe renderizarse un fondo blanco ni una cuadrícula para simular alfa. La herramienta futura debe soportar transparencia y se debe verificar el archivo resultante.', '',
        'Para `visual_grammar`, generar elementos, no un diagrama final de conteo. Las instrucciones de composición son separadas y necesitan comprobaciones deterministas. Para `phrase_context`, la ilustración acompaña un ejemplo compatible: no representa la palabra por sí sola.', '',
        'La candidatura de quiz se conserva de la clasificación; ningún recurso está habilitado ni validado todavía. Generar requiere otra orden y presupuesto. No se asignan tamaños ni se modifica el diseño existente.', '',
        '## Conteos', '', '| Clasificación | Entradas |', '| --- | ---: |']
    lines += [f'| `{mode}` | {count} |' for mode, count in s['counts_by_visual_mode'].items()]
    lines += ['', '## Revisión de cada recurso futuro', ''] + ['- ' + rule for rule in NO_RENDER_QA] + ['']
    for mode in MODES:
        lines += [f'## {mode}', '']
        for e in payload['entries']:
            if e['visual_ming']['visual_mode'] != mode:
                continue
            lines += [f"### {e['hanzi']} · {e['pinyin']} — {e['spanish']}", '',
                f"ID: `{e['vocab_id']}` · Riesgo: `{e['visual_ming']['ambiguity_risk']}` · Candidata a quiz: {'sí, condicionada a revisión' if e['image_quiz_candidate'] else 'no; apoyo contextual o estructurado'}.", '']
            if e['prompt_es'] is None:
                lines += ['**Sin imagen propia.** ' + e['no_image_reason'], '']
                continue
            lines += [f"Receta: `{e['production_unit_id']}` · Perfil: `{e['profile']}`.", '',
                '<details>', '<summary>Mostrar prompt completo</summary>', '', '```text', e['prompt_es'], '```', '', '</details>', '',
                '**Control de significado:** ' + e['semantic_cautions_es'], '']
            if e['composition_instructions_es']:
                lines += ['**Composición posterior controlada:** ' + e['composition_instructions_es'], '']
    return '\n'.join(lines).rstrip() + '\n'


def serialized_outputs(payload: dict) -> dict[Path, str]:
    return {
        OUTPUT_JSON: json.dumps(payload, ensure_ascii=False, indent=2) + '\n',
        OUTPUT_MD: markdown(payload),
        SUMMARY: json.dumps(dict(payload['summary'], fingerprint=payload['fingerprint'], source_corpus_fingerprint=payload['source_corpus_fingerprint']), ensure_ascii=False, indent=2) + '\n',
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--write', action='store_true', help='Write only the three derived text files; never images or corpus.')
    parser.add_argument('--check', action='store_true', help='Check committed outputs without writing.')
    parser.add_argument('--word', help='Show prompt record for an exact Hanzi or v- ID.')
    args = parser.parse_args()
    require(not (args.write and args.check), 'choose write or check')
    payload = build()
    if args.word:
        vid = args.word if args.word.startswith('v-') else 'v-' + args.word
        row = next((row for row in payload['entries'] if row['vocab_id'] == vid), None)
        require(row is not None, f'unknown word: {vid}')
        print(json.dumps(row, ensure_ascii=False, indent=2))
        return
    for path, content in serialized_outputs(payload).items():
        if args.write:
            path.write_text(content, encoding='utf-8')
        if args.check:
            require(path.is_file() and path.read_text(encoding='utf-8') == content, f'stale output: {path.relative_to(ROOT)}; run --write')
    print(json.dumps(payload['summary'], ensure_ascii=False, indent=2))


if __name__ == '__main__':
    try:
        main()
    except (ValueError, OSError, KeyError, json.JSONDecodeError) as exc:
        raise SystemExit(str(exc)) from exc
