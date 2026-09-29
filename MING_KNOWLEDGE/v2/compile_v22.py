"""Additive documentary corpus v2.2 compiler. Standard library; offline, no paid services.

Preserve the v2.1 documentary/editorial batches byte-for-byte as a separately
queryable baseline. Add L4 source witnesses and typed content, never synthetic
answer keys. Source text and model visual descriptions remain separate.
"""
from __future__ import annotations
import base64, collections, copy, csv, hashlib, json, lzma, re, shutil, unicodedata
from pathlib import Path
import query_v21 as baseline
ROOT = Path(__file__).resolve().parent
CACHE = ROOT / '.cache-v22'
L4 = ROOT / 'lesson4'


def load(path):
    return json.loads(Path(path).read_text(encoding='utf-8'))


def write(path, obj):
    Path(path).write_text(json.dumps(obj, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


def unique(seq):
    return list(dict.fromkeys(seq))


def clean(text):
    return ''.join(c for c in unicodedata.normalize('NFC', text)
                   if not c.isspace() and not unicodedata.category(c).startswith(('P','Z')))


def textid(prefix, text):
    return prefix + hashlib.sha256(clean(text).encode('utf-8')).hexdigest()[:16]


def rid(glyph):
    return 'RAD-' + '-'.join(f'U{ord(c):04X}' for c in glyph)


def cjk(text):
    return bool(re.search(r'[\u3400-\u9fff]', text))


def loc(source, page):
    return f'{source}:p{page:03d}'


def source_documents():
    manifest = load(L4 / 'documents/manifest.json')
    encoded = []
    for item in manifest['parts']:
        path = (L4 / item['path']).resolve()
        if not path.is_relative_to((L4 / 'documents').resolve()):
            raise ValueError('Document path escapes source directory')
        raw = path.read_bytes()
        if hashlib.sha256(raw).hexdigest() != item['sha256']:
            raise ValueError(f'Document hash mismatch: {item["path"]}')
        encoded.append(raw.strip())
    raw = lzma.decompress(base64.b64decode(b''.join(encoded), validate=True))
    if len(raw) != manifest['decoded_bytes'] or hashlib.sha256(raw).hexdigest() != manifest['decoded_sha256']:
        raise ValueError('Decoded source pack hash/size mismatch')
    return manifest, json.loads(raw)


def lexical_annotations(vocabulary, witnesses, config):
    lex = {r['hanzi']: r['id'] for r in vocabulary.values()
           if re.fullmatch(r'[\u3400-\u9fff]+', r['hanzi'])}
    lex.update(config['approved_surface_aliases'])
    prefixes = collections.defaultdict(list)
    for term in lex: prefixes[term[0]].append(term)
    for terms in prefixes.values(): terms.sort(key=lambda t: (-len(t), t))
    links, gaps = [], []
    allowed = {(r['source_id'],r['page'],r['kind'],r['surface']) for r in config['explicit_nonlexical_exclusions']}
    for w in witnesses:
        if w.get('lesson') != 4: continue
        text = w['hanzi']; i = 0
        while i < len(text):
            if not cjk(text[i]): i += 1; continue
            term = next((x for x in prefixes[text[i]] if text.startswith(x, i)), None)
            if term:
                links.append(dict(vocab_id=lex[term],phrase_evidence_id=w['id'],start=i,end=i+len(term),surface=term,
                    relation='lexical_token',method='explicit_lexicon_forward_segmentation_model_checked'))
                i += len(term)
            else:
                start=i; i+=1
                while i<len(text) and cjk(text[i]) and not any(text.startswith(x,i) for x in prefixes[text[i]]): i+=1
                surface=text[start:i]
                if (w['source_id'],w['page'],w['kind'],surface) not in allowed:
                    raise ValueError(f'Unreviewed lexical gap in {w["id"]}: {surface}')
                gaps.append(dict(phrase_evidence_id=w['id'],start=start,end=i,surface=surface))
    if len(links)!=config['expected_annotated_occurrences'] or len(gaps)!=config['expected_unlinked_runs']:
        raise ValueError('Reviewed lexical occurrence coverage changed')
    return dict(links=links,coverage=dict(witnesses=sum(w.get('lesson')==4 for w in witnesses),
        annotated_occurrences=len(links),unlinked_source_runs=len(gaps),unlinked_runs=gaps,
        unlinked_source_runs_are_preserved_not_discarded=True))


def field_strings(value, path=''):
    """Lossless field index, NOT an automatic lexicon or generated answer key."""
    if isinstance(value, str):
        if value: yield path, value
    elif isinstance(value, list):
        for i, item in enumerate(value): yield from field_strings(item, f'{path}/{i}')
    elif isinstance(value, dict):
        for key, item in value.items():
            if key in {'id','source_id','kind','label_status','authority_tier','documentary_role'}:
                continue
            yield from field_strings(item, f'{path}/{key}')


def build(force=False):
    baseline.ensure_cache(force)
    spec, docs = source_documents()
    dependencies = [Path(__file__), ROOT/'query.py', L4/'documents/manifest.json',
                    L4/'manifest.json', L4/'selection-policy.json',
                    ROOT.parent/'SOURCE_AUTHORITY.json', L4/'documentary-audit.json',
                    L4/'visual-classification.json', L4/'lexical-links.json',
                    L4/'textbook-vocabulary.tsv', L4/'worksheet-rows.tsv', L4/'dialogue-turns.tsv']
    fingerprint = hashlib.sha256()
    fingerprint.update((baseline.CACHE/'fingerprint.txt').read_bytes())
    for p in dependencies:
        fingerprint.update(p.name.encode()+b'\0'+p.read_bytes())
    signature = fingerprint.hexdigest()
    marker = CACHE/'fingerprint.txt'
    if not force and marker.exists() and marker.read_text() == signature:
        return
    CACHE.mkdir(exist_ok=True)
    marker.unlink(missing_ok=True)
    tables = {p.stem:load(p) for p in baseline.CACHE.glob('*.json')}
    original = copy.deepcopy(tables)
    manifest = load(L4/'manifest.json')
    policy = load(L4/'selection-policy.json')
    sources = {s['id']:s for s in manifest['sources']}
    pages = [p for d in docs for p in d['pages']]
    blocks = [b for p in pages for b in p['blocks']]
    byblock = {b['id']:b for b in blocks}
    tables['document_pages'] = pages
    tables['document_blocks'] = blocks
    tables['document_items'] = []
    for b in blocks:
        for path, text in field_strings(b):
            tables['document_items'].append({'id':textid('DI-',b['id']+'|'+path),
                'source_id':b['source_id'],'page':b['page'],'lesson':4,
                'block_id':b['id'],'field_path':path,'text_source':text,
                'field_role':'editorial' if ('_ming' in path or 'description' in path or 'status' in path or path=='/label') else 'documentary',
                'kind':b['kind']})
    tables['source_authority'] = load(ROOT.parent/'SOURCE_AUTHORITY.json')
    tables['lesson4_selection_policy'] = policy
    tables['source_revisions'] = load(L4/'source-revisions.json')
    tables['lesson4_discrepancies'] = load(L4/'discrepancies.json')
    tables['sources'] += [dict(s,lessons=[4],source_file_included=False) for s in sources.values()]
    tables['page_inventory'] += [dict(id=p['id'],source_id=p['source_id'],pdf_page=p['page'],
        page=p['page'],printed_page=p['printed_page'],lesson=4,
        status=p['transcription_status'],block_ids=[b['id'] for b in p['blocks']],
        full_page_facsimile_included=False) for p in pages]
    tables['native_transcripts'] += [dict(id='NT-'+p['id'],source_id=p['source_id'],page=p['page'],
        lesson=4,text=p['native_text_source'],status='unvalidated_native_cache_including_covered_text')
        for p in pages if p.get('native_text_source')]

    vocab = {r['id']:r for r in tables['vocabulary']}
    phrases = {r['id']:r for r in tables['phrases']}
    chars = {r['id']:r for r in tables['hanzi']}
    phrase_evidence = tables['phrase_evidence']
    vocab_evidence = tables['vocabulary_evidence']
    new_phrases = []; new_vocab = []
    l4_phrase_ids = set(); l4_vocab_ids = set()
    l4_ev_by_word = collections.defaultdict(list)
    def touch_char(ch, b, target=False):
        cid = 'c-'+ch
        if cid not in chars:
            chars[cid] = dict(id=cid,hanzi=ch,lessons=[],source_refs=[],worksheet_refs=[],
                encounter_source_refs=[],evidence_ids=[],readings=[],radicals=[],stroke_counts=[],
                structures=[],source_writing_target=False,vocab_ids=[],phrase_ids=[],
                worksheet_occurrences=[],runtime_units=[],documented_radical_ids=[],proposed_radical_ids=[])
        q=chars[cid];q['lessons']=sorted(set(q.get('lessons',[])+[4]))
        q['encounter_source_refs']=unique(q.get('encounter_source_refs',[])+[loc(b['source_id'],b['page'])])
        if target:q['source_writing_target']=True
        return q
    def word(row,b,n):
        zh=row['hanzi'];vid='v-'+zh;eid=f'VE-{b["id"]}-{n:03d}'
        role=b.get('role',row.get('role','classroom_extension'))
        ev=dict(row,id=eid,vocab_id=vid,source_id=b['source_id'],page=b['page'],lesson=4,
                block_id=b['id'],role=role,authority_tier=b['authority_tier'])
        vocab_evidence.append(ev);l4_ev_by_word[vid].append(ev);l4_vocab_ids.add(vid)
        if vid not in vocab:
            vocab[vid]=dict(id=vid,hanzi=zh,kind='lexeme',lessons=[],roles=[],source_refs=[],
                pinyin_variants=[],spanish_variants=[],evidence_ids=[],phrase_ids=[],phrase_count=0,
                primary_phrase_id=None,primary_phrase=None,hanzi_ids=[],runtime={},curriculum_links=[],
                textbook_table_rows=[],example_phrase_ids=[],radical_ids=[],pinyin=None,spanish=None,
                pinyin_ming=None,traduccion_ming=None,pinyin_display=None,spanish_display=None)
            new_vocab.append(vid)
        q=vocab[vid];q['lessons']=sorted(set(q['lessons']+[4]));q['roles']=unique(q['roles']+[role])
        q['source_refs']=unique(q['source_refs']+[loc(b['source_id'],b['page'])]);q['evidence_ids'].append(eid)
        q['listed_as_vocabulary']=q.get('listed_as_vocabulary',False) or role in {'core_textbook','supplementary_textbook','classroom_extension'}
        for field in ('pinyin','spanish'):
            if row.get(field+'_source'):
                q[field+'_variants'].append(dict(value=row[field+'_source'],source_id=b['source_id'],page=b['page'],role=role,evidence_id=eid))
        link=dict(id=eid,lesson=4,source_id=b['source_id'],page=b['page'],role=role)
        if b.get('list_id'):
            t_id={'L4-T1':'TB-L4-T1-NEW','L4-T2':'TB-L4-T2-NEW','L4-SUP':'TB-L4-SUP'}[b['list_id']]
            tr=dict(id=f'{t_id}-{row["number"]:02d}-{row["subentry"]}',table_id=t_id,
                source_id=b['source_id'],page=b['page'],printed_page=b['printed_page'],lesson=4,
                text=1 if b['list_id']=='L4-T1' else 2 if b['list_id']=='L4-T2' else None,
                list_type='supplementary_vocabulary' if b['list_id']=='L4-SUP' else 'new_vocabulary',
                printed_number=row['number'],subentry_index=row['subentry'],
                entry_kind='headword' if row['subentry']==0 else 'subentry',
                hanzi=zh,vocab_id=vid,pinyin_source=row['pinyin_source'],spanish_source=row['spanish_source'],
                pos_source=row['pos_source'],collocations_source=row['collocations_source'],
                parent_hanzi=row['parent_hanzi'] or None,evidence_id=eid,role=role)
            tables['textbook_table_rows'].append(tr);q['textbook_table_rows'].append(tr)
            link.update(list_type=tr['list_type'],table_id=t_id,table_row_id=tr['id'])
        q['curriculum_links'].append(link)
        q['hanzi_ids']=unique(q['hanzi_ids']+['c-'+c for c in zh if cjk(c)])
        for ch in zh:
            if cjk(ch):touch_char(ch,b)['vocab_ids']=unique(touch_char(ch,b)['vocab_ids']+[vid])
    def phrase(text,b,field,kind,py=None,es=None,**extra):
        if not text or not cjk(text):return None
        pid=textid('PH-',text);eid=textid('PE-L4-',b['id']+'|'+field+'|'+text)
        if any(x['id']==eid for x in phrase_evidence):return pid
        if pid not in phrases:
            phrases[pid]=dict(id=pid,hanzi=text,normalized_text=clean(text),lessons=[],kinds=[],source_refs=[],
                evidence_ids=[],pinyin_variants=[],spanish_variants=[],vocab_ids=[],hanzi_ids=[],
                dialogue_ids=[],exercise_ids=[],grammar_ids=[],curriculum_links=[],
                pinyin=None,pinyin_status='not_supplied_in_extracted_evidence',
                pinyin_ming=None,traduccion_ming=None,pinyin_display=None,spanish_display=None,
                example_vocab_ids=[],runtime_sentence_lessons=[])
            new_phrases.append(pid)
        l4_phrase_ids.add(pid);q=phrases[pid]
        ev=dict(id=eid,phrase_id=pid,hanzi=text,source_id=b['source_id'],page=b['page'],lesson=4,
            kind=kind,block_id=b['id'],field_path=field,pinyin_source=py,spanish_source=es,
            authority_tier=b['authority_tier'],review_status='source_transcribed_model_checked',**extra)
        phrase_evidence.append(ev)
        q['lessons']=sorted(set(q['lessons']+[4]));q['kinds']=unique(q['kinds']+[kind])
        q['source_refs']=unique(q['source_refs']+[loc(b['source_id'],b['page'])]);q['evidence_ids'].append(eid)
        q['curriculum_links'].append(dict(id=eid,lesson=4,kind=kind,source_id=b['source_id'],page=b['page']))
        for a,f in ((py,'pinyin'),(es,'spanish')):
            if a:q[f+'_variants'].append(dict(value=a,evidence_id=eid))
        if extra.get('dialogue_id'):q['dialogue_ids']=unique(q['dialogue_ids']+[extra['dialogue_id']])
        if b['kind']=='exercise':q['exercise_ids']=unique(q['exercise_ids']+[b['id']])
        for ch in unique(c for c in text if cjk(c)):
            cq=touch_char(ch,b);cq['phrase_ids']=unique(cq['phrase_ids']+[pid])
            q['hanzi_ids']=unique(q['hanzi_ids']+['c-'+ch])
        return pid

    # Vocabulary is explicit list evidence; worksheet glyphs are not lexemes.
    for b in blocks:
        if b['kind']=='vocabulary_list':
            for n,row in enumerate(b['items'],1):word(row,b,n)
        for n,row in enumerate(b.get('lexical_annotations',[]),501):word(row,b,n)
    grouped_tables=collections.defaultdict(list)
    for row in tables['textbook_table_rows']:
        if row.get('lesson')==4:grouped_tables[row['table_id']].append(row)
    for key,rows in grouped_tables.items():
        tables['textbook_tables'].append(dict(id=key,lesson=4,source_id='SRC-BOOK-04',
            pages=sorted({r['page'] for r in rows}),list_type=rows[0]['list_type'],
            row_ids=[r['id'] for r in rows],headwords=sum(r['subentry_index']==0 for r in rows)))
    for vid in l4_vocab_ids:
        q=vocab[vid]
        evs=sorted(l4_ev_by_word[vid],key=lambda e:(e['authority_tier']!='primary',e['role']!='core_textbook',e['page'],e['id']))
        chosen=evs[0]
        q['lesson4_selection']=dict(evidence_id=chosen['id'],source_id=chosen['source_id'],
            page=chosen['page'],pinyin=chosen.get('pinyin_source'),spanish=chosen.get('spanish_source'),
            contextual_not_worksheet=True,role=chosen['role'])
        # Reused polyphonic IDs retain their older context. New contextual value is explicit,
        # not a global overwrite (e.g. 只 zhī classifier vs 只 zhǐ adverb).
        if vid in new_vocab:
            q['pinyin']=chosen.get('pinyin_source');q['spanish']=chosen.get('spanish_source')
            q['pinyin_display']=q['pinyin'];q['spanish_display']=q['spanish']
            q['pinyin_status']='source_based_selection_see_variants' if q['pinyin'] else 'not_supplied'
            q['spanish_status']='source_based_selection_see_variants' if q['spanish'] else 'not_supplied'

    dialogs={}
    tables['exercise_items']=[];tables['readings']=[];tables['writing_models']=[]
    tables['source_tables']=[];tables['visual_evidence']=[];tables['hanzi_structures']=[]
    tables['cultural_records']=[];tables['writing_target_occurrences']=[]
    for b in blocks:
        kind=b['kind']
        if kind=='dialogue':
            did=b['dialogue_id'];entry=dialogs.setdefault(did,dict(id=did,source_id=b['source_id'],lesson=4,
                title=b['label'],canonical=bool(b['canonical']),turns=[],phrase_ids=[],audio_file_supplied=False))
            for i,row in enumerate(b['items']):
                pid=phrase(row['hanzi'],b,f'items/{i}','dialogue_turn' if b['canonical'] else 'secondary_dialogue_turn',
                    row['pinyin_source'],dialogue_id=did,speaker_source=row['speaker_source'],turn=row['turn'],canonical=b['canonical'])
                entry['turns'].append(dict(turn=row['turn'],speaker_source=row['speaker_source'],page=b['page'],
                    hanzi=row['hanzi'],pinyin_source=row['pinyin_source'],phrase_id=pid,block_id=b['id']))
                entry['phrase_ids']=unique(entry['phrase_ids']+[pid])
        elif kind=='examples':
            for i,row in enumerate(b.get('items',[])):
                phrase(row['text_source'],b,f'items/{i}','example',row.get('pinyin_source'),row.get('spanish_source'))
        elif kind in {'reading','writing_model'}:
            name='readings' if kind=='reading' else 'writing_models'
            pid=phrase(b['text_source'],b,'text_source',kind,b.get('pinyin_source'),b.get('spanish_source'))
            tables[name].append(dict(b,phrase_id=pid))
            # Sentences are separately indexed without fabricating alignment of the paragraph's pinyin.
            for i,part in enumerate(re.findall(r'[^。！？\n]+[。！？]?',b['text_source'])):
                if cjk(part):phrase(part,b,f'sentence/{i}',kind+'_sentence',parent_phrase_id=pid)
        elif kind=='exercise':
            ex=dict(b,section=b['label'],label_source=b.get('label_source'))
            tables['exercises'].append(ex)
            for i,row in enumerate(b.get('items',[])):
                record=dict(row,id=f'{b["id"]}:item{i+1:03d}',exercise_id=b['id'],source_id=b['source_id'],page=b['page'],lesson=4,
                    answer_status=b['answer_status'],source_answer_key_supplied=b['source_answer_key_supplied'],automatic_grading_approved=False)
                tables['exercise_items'].append(record)
                phrase(row.get('text_source',''),b,f'items/{i}','exercise_premise',row.get('pinyin_source'))
        elif kind=='table':
            tables['source_tables'].append(b)
            # Table cells stay cells: never concatenate them into an invented sentence.
            for i,row in enumerate(b.get('rows_source',[])):
                for j,cell in enumerate(row):
                    if isinstance(cell,str) and re.fullmatch(r'[\u3400-\u9fff0-9，。！？（）／ /、…〇]+',cell) and cjk(cell):
                        phrase(cell,b,f'rows/{i}/{j}','table_cell')

        elif kind=='visual':tables['visual_evidence'].append(b)
        elif kind=='hanzi_structure':tables['hanzi_structures'].append(b)
        elif kind=='culture':tables['cultural_records'].append(b)
        if kind=='note':tables['notes'].append(dict(b,id='NOTE-'+b['id']))

        if kind in {'grammar','note','radical_note','hanzi_structure','function'}:
            gid='GR-'+b['id']
            tables['grammar'].append(dict(id=gid,label=b['label'],lessons=[4],evidence_ids=['GE-'+b['id']],
                source_refs=[loc(b['source_id'],b['page'])],phrase_ids=[],record_kind='source_block_not_deduplicated_concept'))
            tables['grammar_evidence'].append(dict(b,id='GE-'+b['id'],grammar_id=gid))
        for i,text in enumerate(b.get('counterexamples_source',[])):
            phrase(text,b,f'counterexamples/{i}','counterexample',positive_example=False)
        if kind=='vocabulary_list':
            for i,row in enumerate(b['items']):
                for n,text in enumerate(row.get('collocations_source','').split('|')):
                    if text:phrase(text,b,f'items/{i}/collocations/{n}','collocation')
        if kind in {'worksheet','writing_targets'}:
            for i,row in enumerate(b['items']):
                cid='c-'+row['hanzi'];q=touch_char(row['hanzi'],b,True)
                eid=f'HE-{b["id"]}-{i+1:03d}'
                rec=dict(row,id=eid,hanzi_id=cid,source_id=b['source_id'],page=b['page'],lesson=4,
                    block_id=b['id'],source_writing_target=True,kind=kind,contextual_pronunciation=False)
                tables['hanzi_evidence'].append(rec);tables['writing_target_occurrences'].append(rec)
                q['evidence_ids'].append(eid);q['source_refs']=unique(q['source_refs']+[loc(b['source_id'],b['page'])])
                for src,dst in [('pinyin_source','readings'),('radical_source','radicals'),('strokes_source','stroke_counts'),('stroke_count_source','stroke_counts'),('structure_source','structures')]:
                    if row.get(src):q[dst].append(dict(value=row[src],evidence_id=eid))
                if kind=='worksheet':
                    q['worksheet_refs']=unique(q.get('worksheet_refs',[])+[loc(b['source_id'],b['page'])])
                    q.setdefault('worksheet_occurrences',[]).append(rec)
            if kind=='worksheet':
                tables['worksheet_inventory'].append(dict(id=loc(b['source_id'],b['page']),source_id=b['source_id'],page=b['page'],lesson=4,
                    glyph_occurrences=len(b['items']),expected_glyphs=''.join(r['hanzi'] for r in b['items']),
                    evidence_ids=[f'HE-{b["id"]}-{i+1:03d}' for i in range(len(b['items']))]))
    for d in dialogs.values():d['turns'].sort(key=lambda r:r['turn'])
    tables['dialogues']+=list(dialogs.values())
    tables['grammar_block_links']=[dict(grammar_id='GR-'+b['grammar_source_block_id'],block_id=b['id'],
        source_id=b['source_id'],page=b['page'],lesson=4,relation='explicit_source_section_membership')
        for b in blocks if b.get('grammar_source_block_id')]
    grammar_by={g['id']:g for g in tables['grammar']}
    for witness in phrase_evidence:
        b=byblock.get(witness.get('block_id'))
        if not b or not b.get('grammar_source_block_id'):continue
        gid='GR-'+b['grammar_source_block_id'];pid=witness['phrase_id']
        if gid not in grammar_by:raise ValueError('Unknown source grammar group')
        phrases[pid]['grammar_ids']=unique(phrases[pid]['grammar_ids']+[gid])
        grammar_by[gid]['phrase_ids']=unique(grammar_by[gid]['phrase_ids']+[pid])
        tables['grammar_phrase_links'].append(dict(grammar_id=gid,phrase_id=pid,phrase_evidence_id=witness['id'],
            relation='explicit_source_section_membership',source_id=b['source_id'],page=b['page'],lesson=4))


    # Explicit reviewed lexical occurrence spans. No substring discovery or glyph-as-word inference.
    annotations=lexical_annotations(vocab,phrase_evidence,load(L4/'lexical-links.json'))
    witness_by={p['id']:p for p in phrase_evidence}
    links_by_pair=collections.defaultdict(list)
    for link in annotations['links']:
        witness=witness_by.get(link['phrase_evidence_id'])
        if witness is None or witness['hanzi'][link['start']:link['end']] != link['surface']:
            raise ValueError('Lexical annotation no longer matches source witness')
        if link['vocab_id'] not in vocab:raise ValueError('Lexical annotation targets an unknown lexeme')
        pid=witness['phrase_id'];vid=link['vocab_id']
        rec=dict(link,phrase_id=pid,source_id=witness['source_id'],page=witness['page'],lesson=4)
        tables['word_phrase_spans'].append(rec)
        links_by_pair[vid,pid].append(witness['id'])
        phrases[pid]['vocab_ids']=unique(phrases[pid]['vocab_ids']+[vid])
        vocab[vid]['phrase_ids']=unique(vocab[vid]['phrase_ids']+[pid])
        vocab[vid]['lessons']=sorted(set(vocab[vid]['lessons']+[4]))
    existing_links={(l['vocab_id'],l['phrase_id']):l for l in tables['word_phrase_links']}
    for (vid,pid),eids in links_by_pair.items():
        if (vid,pid) in existing_links:
            link=existing_links[vid,pid];link['evidence_ids']=unique(link.get('evidence_ids',[])+eids)
        else:
            tables['word_phrase_links'].append(dict(vocab_id=vid,phrase_id=pid,relation='lexical_token',evidence_ids=unique(eids)))
        eligible=[witness_by[e] for e in eids if witness_by[e]['kind'] in {'example','reading','writing_model','dialogue_turn','collocation'}]
        if eligible:
            vocab[vid]['example_phrase_ids']=unique(vocab[vid].get('example_phrase_ids',[])+[pid])
            phrases[pid]['example_vocab_ids']=unique(phrases[pid].get('example_vocab_ids',[])+[vid])
            key='EX-'+vid+'-'+pid
            if not any(l['id']==key for l in tables['pedagogical_example_links']):
                tables['pedagogical_example_links'].append(dict(id=key,vocab_id=vid,phrase_id=pid,relation='direct_lexical',via_vocab_id=None,composition_id=None,evidence_ids=unique(eids)))
    for q in vocab.values():q['phrase_count']=len(q.get('phrase_ids',[]))
    for pid in new_phrases:
        q=phrases[pid];evs=[witness_by[e] for e in q['evidence_ids']]
        evs.sort(key=lambda e:(e.get('authority_tier')!='primary',e.get('canonical') is False,e['id']))
        for field in ('pinyin','spanish'):
            value=next((e.get(field+'_source') for e in evs if e.get(field+'_source')),None)
            if field=='pinyin':q[field]=value
            q[field+'_display']=value
        q['pinyin_status']='source_based_selection_see_variants' if q['pinyin'] else 'not_supplied_in_extracted_evidence'
    tables['lexical_annotation_coverage']=dict(annotations.get('coverage',{}),algorithm='reviewed_literal_spans_not_substring_search',unmatched_runs_do_not_create_vocabulary=True)

    # Radical documentary definitions and character assignments are different claims.
    radicals={r['id']:r for r in tables['radical_catalog']}
    rh={(r['radical_id'],r['hanzi_id']):r for r in tables['radical_hanzi_links']}
    def radical(glyph,b,definition=None,glyph_example=None):
        key=rid(glyph);eid=textid('RE-L4-',b['id']+'|'+glyph+'|'+str(glyph_example))
        if key not in radicals:
            radicals[key]=dict(id=key,radical=glyph,name_source=None,meaning_source=None,explanation_source=None,
                stroke_count_source=None,metadata_status='not_supplied_in_explicit_radical_definition',lessons=[],roles=[],
                definition_refs=[],worksheet_refs=[],practice_refs=[],exam_refs=[],ppt_refs=[],evidence_ids=[],hanzi_ids=[],
                vocab_ids=[],phrase_ids=[],assessment_item_ids=[],exam_characters=[],named_in_textbook=False,
                evaluated_in_supplied_exam=False,radical_ui_or_deployment_verified=False)
        q=radicals[key];q['lessons']=sorted(set(q['lessons']+[4]));q['evidence_ids']=unique(q['evidence_ids']+[eid])
        evidence=dict(id=eid,radical_id=key,source_id=b['source_id'],page=b['page'],lesson=4,
            block_id=b['id'],kind='named_radical_in_textbook' if definition else 'named_radical_example' if b['source_id']=='SRC-BOOK-04' else 'worksheet_radical',claim_status='source_transcribed')
        q['roles']=unique(q['roles']+[evidence['kind']])
        if definition:
            evidence['definition']=definition;q['metadata_status']='explicit_textbook_definition';q['named_in_textbook']=True
            q.update(name_source=definition['name_source'],meaning_source=definition['meaning_source'],
                     explanation_source=definition['explanation_source'],stroke_count_source=definition['stroke_count_source'])
            q['definition_refs']=unique(q['definition_refs']+[loc(b['source_id'],b['page'])])
        elif b['source_id']=='SRC-BOOK-04':q['practice_refs']=unique(q['practice_refs']+[loc(b['source_id'],b['page'])])
        else:q['worksheet_refs']=unique(q['worksheet_refs']+[loc(b['source_id'],b['page'])])
        if not any(r['id']==eid for r in tables['radical_evidence']):tables['radical_evidence'].append(evidence)
        if glyph_example:
            cq=touch_char(glyph_example,b);cid=cq['id'];q['hanzi_ids']=unique(q['hanzi_ids']+[cid])
            cq['documented_radical_ids']=unique(cq.get('documented_radical_ids',[])+[key])
            pair=(key,cid)
            if pair not in rh:
                r=dict(id=textid('RH-',key+'|'+cid),radical_id=key,hanzi_id=cid,hanzi=glyph_example,
                    source_evidence_ids=[],proposal_evidence_ids=[],assessment_item_ids=[],assignment_status='documented_in_course_source')
                rh[pair]=r;tables['radical_hanzi_links'].append(r)
            rh[pair]['source_evidence_ids']=unique(rh[pair]['source_evidence_ids']+[eid])
    for b in blocks:
        if b['kind']=='worksheet':
            for row in b['items']:radical(row['radical_source'],b,glyph_example=row['hanzi'])
        if b['source_id']=='SRC-BOOK-04' and b['page']==22 and b['kind']=='table':
            for glyph,name,count,examples,meaning in b['rows_source']:
                definition=dict(name_source=name,meaning_source='cuchillo' if glyph=='刂' else 'sol',
                    explanation_source=meaning,stroke_count_source=count,example_characters=[e[0] for e in examples])
                radical(glyph,b,definition)
                for ch,_,_ in examples:radical(glyph,b,glyph_example=ch)
    for b in blocks:
        if b['kind']=='radical_note':
            key=rid(b['hanzi']);radical(b['hanzi'],b)
            cat=radicals[key];cat['roles']=unique(cat['roles']+['classroom_radical_note'])
            cat['secondary_explanation_source']=b['text_source'];cat['pinyin_source']=b.get('pinyin_source')
            cat['ppt_refs']=unique(cat['ppt_refs']+[loc(b['source_id'],b['page'])])
        if b['source_id']=='SRC-WB-04' and b['page']==4 and any(r.get('glyphs') for r in b.get('items',[])):
            tables['radical_assessment_sets'].append(dict(id=b['id'],source_id=b['source_id'],page=4,lesson=4,
                source_answer_key_supplied=False,automatic_grading_approved=False,items=b['items']))
            for n,item in enumerate(b['items'],1):
                for ch in item['glyphs']:
                    touch_char(ch,b)
                    tables['radical_assessment_items'].append(dict(id=b['id']+f':{n}:'+ch,hanzi=ch,source_id=b['source_id'],
                        page=4,lesson=4,source_answer_key_supplied=False,automatic_grading_approved=False,
                        radical_candidate=None,candidate_status='not_supplied_or_inferred',radical_meaning_source=None))
    tables['radical_catalog']=list(radicals.values())

    # Add only links supported by glyph assignment and actual lexical occurrence spans.
    rpairs={(x['radical_id'],x['vocab_id']) for x in tables['radical_word_links']}
    ppairs={(x['radical_id'],x['phrase_id']) for x in tables['radical_phrase_links']}
    for key,rad in radicals.items():
        for q in vocab.values():
            hits=[c for c in q.get('hanzi_ids',[]) if (key,c) in rh]
            if not hits:continue
            rad['vocab_ids']=unique(rad['vocab_ids']+[q['id']]);q['radical_ids']=unique(q.get('radical_ids',[])+[key])
            if (key,q['id']) not in rpairs:
                tables['radical_word_links'].append(dict(id=textid('RW-',key+'|'+q['id']),radical_id=key,vocab_id=q['id'],hanzi_ids=hits,relation='assigned_radical_of_constituent_character_not_whole_word'))
                rpairs.add((key,q['id']))
            for pid in q.get('phrase_ids',[]):
                rad['phrase_ids']=unique(rad['phrase_ids']+[pid])
                if (key,pid) not in ppairs:
                    tables['radical_phrase_links'].append(dict(id=textid('RP-',key+'|'+pid),radical_id=key,phrase_id=pid,via_vocab_ids=[q['id']],relation='derived_from_lexical_occurrence_not_formal_teaching'))
                    ppairs.add((key,pid))
    rm={r['id']:r for r in tables['radical_matrix']}
    for key,rad in radicals.items():
        if key not in rm:rm[key]=dict(id=key,radical=rad['radical'])
        rm[key].update(name=rad['name_source'],meaning=rad['meaning_source'],metadata_status=rad['metadata_status'],
            lessons=rad['lessons'],vocab_count=len(rad['vocab_ids']),phrase_count=len(rad['phrase_ids']),
            theory=bool(rad['definition_refs']),worksheet=bool(rad['worksheet_refs']),practice=bool(rad['practice_refs']),
            exam=bool(rad['exam_refs']),exam_characters=rad['exam_characters'])
    tables['radical_matrix']=list(rm.values())
    wh={(x['vocab_id'],x['hanzi_id']) for x in tables['word_hanzi_links']}
    for q in vocab.values():
        for cid in q['hanzi_ids']:
            if (q['id'],cid) not in wh:
                tables['word_hanzi_links'].append(dict(vocab_id=q['id'],hanzi_id=cid,relation='glyph_constituent_not_lexical_token'))
                wh.add((q['id'],cid))
    tables['vocabulary']=list(vocab.values());tables['phrases']=list(phrases.values());tables['hanzi']=list(chars.values())

    classifications=load(L4/'visual-classification.json')
    for entry in classifications['records']:
        vocab[entry['vocab_id']]['visual_ming']={k:entry[k] for k in ('visual_mode','image_support','image_quiz_eligible','ambiguity_risk')}
        tables['visual_ming'].append(entry)
    # A versioned full matrix replaces no baseline identifier.
    matrix={r['id']:r for r in tables['matrix']}
    for vid,q in vocab.items():
        if vid not in matrix:matrix[vid]=dict(q)
        else:
            for k in ('lessons','source_refs','phrase_count','textbook_table_rows','curriculum_links','example_phrase_ids','radical_ids'):
                matrix[vid][k]=q.get(k)
        if q.get('lesson4_selection'):matrix[vid]['lesson4_selection']=q['lesson4_selection']
    tables['matrix']=list(matrix.values())
    counts={name:len(value) for name,value in tables.items() if isinstance(value,list)}
    counts.update(pdf_pages=sum(s['pages'] for s in tables['sources']),lesson4_pages=len(pages),lesson4_blocks=len(blocks),
        lesson4_vocabulary_ids=len(l4_vocab_ids),new_vocabulary_ids=len(new_vocab),lesson4_phrase_ids=len(l4_phrase_ids),
        new_phrase_ids=len(new_phrases),lesson4_exercise_sets=sum(b['kind']=='exercise' for b in blocks),
        canonical_l4_dialogue_turns=sum(len(d['turns']) for d in dialogs.values() if d['canonical']))
    tables['index']['baseline_v21_stats']=original['index']['stats']
    tables['index']['baseline_v21_closure']=original['index'].get('closure', {})
    tables['index'].pop('closure', None)
    tables['index']['version']='2.2.0';tables['index']['scope']='Curricular L1–L4; foundations separate; documentary source closure, not web deployment'
    stats=dict(original['index']['stats'])
    for field,table_name in [('source_count','sources'),('vocabulary_entries','vocabulary'),('phrases_unique','phrases'),
        ('vocabulary_evidence','vocabulary_evidence'),('phrase_source_occurrences','phrase_evidence'),
        ('hanzi_entities_total','hanzi'),('hanzi_evidence_rows','hanzi_evidence'),('word_phrase_links','word_phrase_links'),
        ('word_phrase_occurrence_spans','word_phrase_spans'),('dialogue_source_witnesses','dialogues'),
        ('exercise_sets','exercises'),('radical_forms','radical_catalog'),('radical_hanzi_links','radical_hanzi_links'),
        ('radical_word_links','radical_word_links'),('radical_phrase_links','radical_phrase_links')]:stats[field]=counts[table_name]
    stats['pdf_pages']=counts['pdf_pages'];stats['document_blocks_l4']=len(blocks)
    stats.update(listed_vocabulary_entries=sum(bool(q.get('listed_as_vocabulary')) for q in vocab.values()),
        context_only_entries=sum(not q.get('listed_as_vocabulary') for q in vocab.values()),
        hanzi_with_writing_source_evidence=sum(bool(q.get('source_writing_target')) for q in chars.values()),
        worksheet_rows_or_glyph_occurrences=sum(x['glyph_occurrences'] for x in tables['worksheet_inventory']),
        grammar_records=len(tables['grammar']),grammar_source_records=len(tables['grammar_evidence']),
        grammar_phrase_links=len(tables['grammar_phrase_links']),source_notes=len(tables['notes']),
        workbook_exercise_sets=sum('WB' in x['source_id'] for x in tables['exercises']),
        radical_named_definitions=sum(q['metadata_status']=='explicit_textbook_definition' for q in radicals.values()),
        radical_worksheet_witnesses=sum(x.get('kind')=='worksheet_radical' for x in tables['radical_evidence']),
        radical_assessment_sets=len(tables['radical_assessment_sets']),radical_assessment_items=len(tables['radical_assessment_items']),
        lesson4_worksheet_rows=66,lesson4_writing_target_occurrences=len(tables['writing_target_occurrences']))
    for key in ('grammar_concepts','new_worksheet_rows','new_worksheet_unique_glyphs'):
        stats.pop(key,None)
    tables['index']['stats']=stats;tables['index']['counts_v22']=counts
    tables['index']['documentary_closure']=dict(lesson=4,pages=121,sources=6,source_content_complete=True,
        independent_human_review=False,original_listening_audio_supplied=False,web_integration_complete=False)
    tables['index']['baseline_batches_note']='Historical v2.1 editorial/source audits remain scoped to L1–L3; v2.2 closure audited separately.'
    tables['index']['source_authority']='../SOURCE_AUTHORITY.json'
    tables['index']['snapshot_date']='2026-09-29'
    tables['index']['source_manifest']='source-v22.json'
    tables['index']['linguistic_coverage_l4']=dict(
        vocabulary_with_source_pinyin=sum(bool(vocab[v]['lesson4_selection'].get('pinyin')) for v in l4_vocab_ids),
        vocabulary_with_source_spanish=sum(bool(vocab[v]['lesson4_selection'].get('spanish')) for v in l4_vocab_ids),
        phrases_with_source_pinyin=sum(any(witness_by[e].get('lesson')==4 and witness_by[e].get('pinyin_source') for e in phrases[p]['evidence_ids']) for p in l4_phrase_ids),
        missing_documentary_fields_are_not_fabricated=True)
    tables['validation_v21']=original['validation']
    # Structural and source regression gates are independent from release labels.
    errors=[]
    def check(ok,msg):
        if not ok:errors.append(msg)
    check(original['validation'].get('passed'),'Baseline validation failed')
    check(len(pages)==121 and len(sources)==6,'L4 page/source count')
    check(all(p['blocks'] for p in pages),'Empty page')
    check(len({(p['source_id'],p['page']) for p in pages})==121,'Duplicate/missing physical page')
    for sid,source in sources.items():
        check(sorted(p['page'] for p in pages if p['source_id']==sid)==list(range(1,source['pages']+1)), 'Incomplete source page sequence')
    check({d['source_id']:d['source_sha256'] for d in docs}=={s['id']:s['sha256'] for s in sources.values()}, 'Source identity differs from current manifest')
    check(len(byblock)==len(blocks),'Duplicate block IDs')
    for p in pages:
        s=sources[p['source_id']];check(1<=p['page']<=s['pages'],'Page outside source')
        if s['printed_pages']:check(p['printed_page']==s['printed_pages'][p['page']-1],'Printed page map')
    for name in ('vocabulary','phrases','hanzi','dialogues','exercises','grammar'):
        old={r['id']:r for r in original[name]};new={r['id']:r for r in tables[name]}
        check(set(old)<=set(new),f'Lost {name} IDs')
        for key,row in old.items():
            for field in ('hanzi','pinyin','spanish','traduccion_ming','pinyin_ming','turns','items'):
                if field in row:check(row[field]==new[key].get(field),f'Baseline changed {name}/{key}/{field}')
    check(sum(r['lesson']==4 for r in tables['textbook_table_rows'])==63,'Textbook table coverage')
    check(sum(r.get('lesson')==4 and r.get('kind')=='worksheet' for r in tables['hanzi_evidence'])==66,'Worksheet rows')
    def tsv(name):
        with (L4/name).open(encoding='utf-8', newline='') as f:
            return list(csv.DictReader(f, delimiter='\t'))
    oldv=tsv('textbook-vocabulary.tsv')
    newv={(r['list_id'],str(r['number']),str(r['subentry'])):r for r in vocab_evidence
          if r.get('lesson')==4 and r.get('list_id')}
    for row in oldv:
        new=newv.get((row['list_id'],row['number'],row['subentry']),{})
        check(all(row[k]==str(new.get(k,'')) for k in
                  ('hanzi','pinyin_source','spanish_source','pos_source','collocations_source','parent_hanzi')),
              'Audited vocabulary witness changed')
    newh={(r['source_id'],str(r['page']),str(r['row'])):r for r in tables['writing_target_occurrences']
          if r['kind']=='worksheet'}
    for row in tsv('worksheet-rows.tsv'):
        new=newh.get((row['source_id'],row['pdf_page'],row['row']),{})
        check(all(row[k]==str(new.get(k,'')) for k in
                  ('hanzi','pinyin_source','radical_source','strokes_source','structure_source')),
              'Audited worksheet witness changed')
    newd={(d['id'],str(t['turn'])):t for d in dialogs.values() for t in d['turns']}
    for row in tsv('dialogue-turns.tsv'):
        new=newd.get((row['dialogue_id'],row['turn']),{})
        check(all(row[k]==str(new.get(k,'')) for k in ('hanzi','pinyin_source','speaker_source')),
              'Audited dialogue witness changed')
    check(counts['canonical_l4_dialogue_turns']==27,'Canonical dialogue count')
    check(set(d['id'] for d in dialogs.values() if d['canonical'])==set(policy['canonical_dialogue_ids']),'Dialogue selection')
    for d in dialogs.values():check([r['turn'] for r in d['turns']]==list(range(1,len(d['turns'])+1)),'Dialogue turn sequence')
    for b in blocks:
        if b['kind']=='exercise' and 'audio' in b.get('answer_status',''):
            check(not b['source_answer_key_supplied'] and not b.get('answers'),'Invented listening key')
    check(all(e['id'] in witness_by for e in phrase_evidence),'Evidence indexing')
    check(all(l['vocab_id'] in vocab and l['phrase_id'] in phrases for l in tables['word_phrase_links']),'Dangling lexical link')
    published_new={v for v in new_vocab if vocab[v].get('pinyin_display') and vocab[v].get('spanish_display')}
    classified={r['vocab_id'] for r in classifications['records']}
    check(published_new<=classified,'New publishable vocabulary requires explicit visual classification')
    check(not any(v.startswith('v-') and not re.fullmatch('[\u3400-\u9fff（）]+',v[2:]) for v in new_vocab),'Malformed new lexeme')
    tables['validation']=dict(version='2.2.0',passed=not errors,errors=errors,counts=counts,
        baseline_v21_passed=original['validation'].get('passed'),baseline_identifiers_preserved=True,
        ready_for_chapter4=not errors,global_query_integrated=True,
        documentary_limits=load(L4/'documentary-audit.json')['exclusions'],
        website_validated=False,paid_api_calls=0,independent_human_review=False)
    for name,value in tables.items():write(CACHE/f'{name}.json',value)
    if errors:raise ValueError('v2.2 validation failed: '+'; '.join(errors[:10]))
    marker.write_text(signature,encoding='utf-8')
    return tables

if __name__=='__main__':
    build(True)
    print(json.dumps(load(CACHE/'validation.json'),ensure_ascii=False,indent=2))
