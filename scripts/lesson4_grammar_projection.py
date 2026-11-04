"""Restore the textbook's explicitly linked grammar tables and worked examples."""
import json
from pathlib import Path

SUPPORT = Path(__file__).resolve().parents[1] / 'MING_KNOWLEDGE/v2/lesson4/grammar-table-support.json'


def enrich_grammar(grammar, blocks, phrases):
    by_id = {block['id']: block for block in blocks}
    by_text = {phrase['hanzi']: phrase for phrase in phrases.values()}
    support = json.loads(SUPPORT.read_text(encoding='utf-8'))
    # The corpus links the whole A-not-A section to its main grammar point.
    # In the UI, keep each printed response beside its immediately preceding
    # explanation on page 124; the documentary relationships remain unchanged.
    display_parent = {
        'L4-BOOK-04-12-03': 'L4-BOOK-04-12-02',
        'L4-BOOK-04-12-05': 'L4-BOOK-04-12-04',
    }
    aids = {}
    for entry in support['tables']:
        block = by_id[entry['block_id']]
        if block['source_id'] != 'SRC-BOOK-04' or block['rows_source'] != entry['expected_rows']:
            raise ValueError(f"Stale textbook grammar table: {entry['block_id']}")
        if len(entry['rows']) != len(block['rows_source']):
            raise ValueError('Missing grammar-table reading aid')
        aids[entry['block_id']] = entry['rows']
    for point in grammar:
        block_id = point['id'].removeprefix('GR-')
        point['studyBlocks'] = []
        if block_id in support['patterns']:
            point['pattern'] = support['patterns'][block_id]
        if block_id in support.get('clarifications', {}):
            point['clarification'] = support['clarifications'][block_id]
        # Page 122 ends mid-sentence; present the continuation as one note.
        if block_id == 'L4-BOOK-04-10-06':
            point['explanation'] += ' ' + by_id['L4-BOOK-04-11-01']['text_source']
        if block_id == 'L4-BOOK-04-11-01':
            point['continuationOf'] = 'GR-L4-BOOK-04-10-06'
        for block in blocks:
            parent = display_parent.get(block['id'], block.get('grammar_source_block_id'))
            if block.get('source_id') != 'SRC-BOOK-04' or parent != block_id:
                continue
            if block['kind'] == 'table':
                rows = [[str(cell) for cell in row] for row in block['rows_source']]
                point['studyBlocks'].append(dict(id=block['id'], title=block['label'], kind='table',
                    columns=block['columns_source'], rows=rows, rowAids=aids[block['id']]))
            elif block['kind'] == 'examples':
                examples = []
                for index, item in enumerate(block['items']):
                    text = item.get('text_source') or item.get('hanzi')
                    if not text:
                        continue
                    phrase = by_text.get(text, {})
                    examples.append(dict(id=f"{block['id']}-{index + 1}", hanzi=phrase.get('hanzi_display') or text,
                        pinyin=item.get('pinyin_source') or phrase.get('pinyin_display') or '',
                        spanish=item.get('spanish_source') or phrase.get('spanish_display') or ''))
                point['studyBlocks'].append(dict(id=block['id'], title=block['label'], kind='examples', examples=examples))
    return grammar
