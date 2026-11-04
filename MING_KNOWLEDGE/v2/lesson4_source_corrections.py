"""Traceable corrections to PDF transcriptions, with stable published identities.

The frozen extraction pack is retained. Only exact reviewed field values can be
corrected, and every old value stays queryable in the correction audit table.
"""


def apply(documents, config, textid):
    blocks = {b['id']: b for d in documents for p in d['pages'] for b in p['blocks']}
    corrections = {}
    for entry in config['corrections']:
        block = blocks[entry['block_id']]
        if (entry['id'] in corrections or block['source_id'] != entry['source_id']
                or block['page'] != entry['pdf_page'] or block['printed_page'] != entry['printed_page']
                or not entry['reason'] or entry['before'] == entry['after']):
            raise ValueError('Invalid documentary correction identity')
        target = block
        parts = entry['field_path'].split('/')
        for key in parts[:-1]:
            target = target[int(key)] if isinstance(target, list) else target[key]
        key = int(parts[-1]) if isinstance(target, list) else parts[-1]
        if target[key] != entry['before']:
            raise ValueError('Stale documentary correction: ' + entry['id'])
        target[key] = entry['after']
        corrections[entry['id']] = entry

    identities = {}
    for entry in config['phrase_identity_preservations']:
        correction = corrections[entry['correction_id']]
        key = (entry['block_id'], entry['field_path'], entry['after'])
        if (key in identities or correction['block_id'] != entry['block_id']
                or entry['before'] not in correction['before'] or entry['after'] not in correction['after']
                or textid('PH-', entry['before']) != entry['phrase_id']
                or textid('PE-L4-', entry['block_id'] + '|' + entry['field_path'] + '|' + entry['before']) != entry['phrase_evidence_id']):
            raise ValueError('Invalid documentary phrase identity preservation')
        identities[key] = entry
    return identities
