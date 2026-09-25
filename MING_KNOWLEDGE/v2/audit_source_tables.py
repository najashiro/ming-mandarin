"""Audit all registered textbook lists / worksheets and the public projection."""
from __future__ import annotations
import argparse
import json
import shutil
from pathlib import Path
from query import CACHE, ROOT, ensure_cache, read_table
from source_audit import INVENTORY, check_book_witnesses, check_worksheets, read_json, require, textbook_rows


def audit(public_path: Path | None = None) -> dict:
    ensure_cache()
    inventory = read_json(INVENTORY)
    expected = textbook_rows(inventory)
    check_book_witnesses(expected, read_table('vocabulary_evidence'))
    worksheets = check_worksheets(inventory, read_table('hanzi_evidence'), read_table('sources'))
    rows = read_table('textbook_table_rows')
    require(len(rows) == len(expected), 'derived table row count differs')
    by_derived = {r['id']: r for r in rows}
    for row in expected:
        require(row['id'] in by_derived, f"missing derived row {row['id']}")
        for key, value in row.items():
            require(by_derived[row['id']].get(key) == value, f"derived row mismatch {row['id']} {key}")
    report = dict(read_table('source_audit'))
    report['table_summaries'] = []
    for table in inventory['tables']:
        selected = [r for r in rows if r['table_id'] == table['id']]
        report['table_summaries'].append({k: table[k] for k in ['id', 'lesson', 'text', 'list_type', 'source_id']} | {
            'numbered_headwords': sum(r['subentry_index'] == 0 for r in selected),
            'subentries': sum(r['subentry_index'] > 0 for r in selected),
            'records': len(selected), 'pdf_pages': [p['pdf_page'] for p in table['pages']],
            'printed_pages': [p['printed_page'] for p in table['pages']], 'passed': True})
    report['table_rows'] = rows
    report['worksheet_pages'] = worksheets
    report['pinyin_recoveries'] = read_table('source_pinyin_recoveries')
    tai = next(r for r in read_table('hanzi') if r['id'] == 'c-太')
    matched = [r for r in tai['worksheet_occurrences'] if r['source_id'] == 'SRC-HANZI-01-3' and r['page'] == 2 and r['row'] == 4]
    require(len(matched) == 1 and matched[0]['pinyin_source'] == 'tài' and matched[0]['stroke_count_source'] == 4, 'Tai worksheet regression')
    report['tai_worksheet_regression'] = matched[0]
    report['public_projection_checked'] = False
    if public_path:
        public = read_json(public_path)
        words = {r['id']: r for r in public['vocabulary']}
        for row in rows:
            require(row['vocab_id'] in words, f"table vocabulary excluded from public view {row['id']}")
            require(any(link.get('lesson') == row['lesson'] and link.get('text') == row['text'] and link.get('list_type') == row['list_type'] and link.get('entry_kind') == row['entry_kind'] for link in words[row['vocab_id']].get('curriculumLinks', [])), f"lost lesson/list relationship {row['id']}")
        public_phrases = {r['id']: r for r in public['phrases']}
        for recovery in report['pinyin_recoveries']:
            require(bool(public_phrases.get(recovery['phrase_id'], {}).get('pinyin')), f"recovered pinyin absent from public view {recovery['phrase_id']}")
        require(any(r['id'] == 'c-太' and r['worksheetEvidence'] for r in public.get('hanzi', [])), 'Tai documentary Hanzi not exported')
        # Check public schema recursively; sources remain in the repository, not in cards.
        forbidden = {'source_id', 'sourceId', 'source_refs', 'page', 'pdfPage', 'printedPage', 'file', 'evidence_id', 'note', 'worksheet_occurrences'}
        def inspect(value):
            if isinstance(value, dict):
                require(not forbidden.intersection(value), 'internal metadata leaked to public projection')
                for child in value.values(): inspect(child)
            elif isinstance(value, list):
                for child in value: inspect(child)
        inspect(public)
        report['public_projection_checked'] = True
        report['public_vocabulary_entries'] = len(public['vocabulary'])
        report['public_hanzi_entries'] = len(public.get('hanzi', []))
        report['public_fingerprint'] = public['fingerprint']
    return report


def markdown(report: dict) -> str:
    text = ['# Auditoría del corpus: tablas y hojas Hanzi', '', f"Fecha del cotejo visual: {report['audit_date']}", '',
            'Alcance: las seis tablas de **生词 / Palabras nuevas** y las tres de **补充词语 / Palabras suplementarias** de L1–L3. Se excluye la numeración independiente de la introducción fonética.', '',
            f"Resultado: **{report['tables_checked']} tablas, {report['numbered_headwords']} entradas numeradas y {report['explicit_subentries']} subentradas explícitas: {report['table_entries_checked']} registros verificados.**", '',
            '| Tabla | Lección | Numeradas | Subentradas | Total | Páginas PDF | Páginas impresas |', '|---|---:|---:|---:|---:|---|---|']
    for t in report['table_summaries']:
        text.append(f"| {t['id']} | {t['lesson']} | {t['numbered_headwords']} | {t['subentries']} | {t['records']} | {', '.join(map(str,t['pdf_pages']))} | {', '.join(map(str,t['printed_pages']))} |")
    text += ['', '## Hojas Hanzi', '', f"**{report['worksheet_files_checked']} archivos y {report['worksheet_glyph_occurrences_checked']} apariciones de caracteres**, conservando repeticiones y página. No son 229 caracteres únicos.", '',
             '太: SRC-HANZI-01-3, página PDF 2, fila 4, tài, 4 trazos. El identificador de esta hoja no sustituye la unidad curricular 1.2 del motor.', '',
             '## Pinyin recuperado de las fuentes', '', 'Se completaron los siguientes testigos con pinyin visible en la página original. Las variantes y las transcripciones de otras fuentes no se sobrescriben.', '']
    for r in report['pinyin_recoveries']:
        text.append(f"- {r['hanzi']} — {r['pinyin_source']} — {r['source_id']}, PDF {r['page']}.")
    coverage = report['coverage']
    text += ['', '## Límites que siguen abiertos', '',
             f"El corpus tiene {coverage['vocabulary_total']} entradas de vocabulario, de las cuales {coverage['vocabulary_with_pinyin']} tienen pinyin seleccionado; y {coverage['phrases_total']} enunciados, de los cuales {coverage['phrases_with_source_pinyin']} tienen alguna transcripción de pinyin registrada y {coverage['phrases_with_source_spanish']} alguna traducción española de fuente registrada.", '',
             '**Esto no certifica que todos los enunciados tengan pinyin/traducción ni que funcionen sus audios, imágenes o fichas en producción.** No se generan ni inventan campos para ocultar estos límites.', '',
             'La clasificación de una lista es independiente de la naturaleza léxica: un nombre propio puede pertenecer a Palabras nuevas. Una aparición posterior no equivale a introducción curricular.', '',
             'La tabla impresa de 马马虎虎 dice **Adj.**, no Adv.; se registra ese dato sin reinterpretar el original.', '',
             'La proyección pública conserva relaciones lección–rol–tipo de lista y evidencia documental Hanzi, pero excluye páginas, nombres de PDF, notas y referencias internas.', '',
             '## Reproducir', '', '```bash', 'python MING_KNOWLEDGE/v2/query.py --validate', 'python scripts/export-corpus-v21.py --check', 'python MING_KNOWLEDGE/v2/audit_source_tables.py --check', "python -m unittest discover -s MING_KNOWLEDGE/v2 -p 'test_*.py'", '```', '']
    return '\n'.join(text)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='Check the committed learner projection too')
    parser.add_argument('--write-reports', action='store_true')
    args = parser.parse_args()
    report = audit(ROOT.parents[1] / 'data/corpus-v21-public.json' if args.check else None)
    if args.write_reports:
        directory = ROOT / 'audits'
        directory.mkdir(exist_ok=True)
        (directory / 'source-tables-20260925.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        (directory / 'source-tables-20260925.md').write_text(markdown(report), encoding='utf-8')
        shutil.copyfile(CACHE / 'index.json', ROOT / 'index.json')
    print(json.dumps({k:v for k,v in report.items() if k not in ['table_rows','worksheet_pages','pinyin_recoveries','limits']}, ensure_ascii=False, indent=2))

if __name__ == '__main__':
    main()
