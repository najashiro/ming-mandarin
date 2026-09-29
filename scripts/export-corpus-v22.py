#!/usr/bin/env python3
"""Reproducible v2.2 learner projection. Does not switch the application's v2.1 import.

Default output is an ignored build artifact. --out can supply a destination for
chapter implementation. Documentary content remains queryable even when the
source did not print its Spanish or pinyin: never manufacture either field.
"""
from __future__ import annotations
import argparse, hashlib, json, sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'MING_KNOWLEDGE/v2'))
import query
from pinyin_ming import internal_only


def build():
    query.ensure_cache()
    vocab=query.read_table('vocabulary');phrases=query.read_table('phrases')
    witnesses={r['id']:r for r in query.read_table('phrase_evidence')}
    public_vocab=[]
    for row in vocab:
        if internal_only(row):continue
        # Existing display fields are retained for L1–L3; context is explicit for L4.
        pinyin=row.get('pinyin_display') or row.get('pinyin')
        spanish=row.get('spanish_display') or row.get('spanish')
        context=row.get('lesson4_selection')
        if not (pinyin and spanish) and not (context and context.get('pinyin') and context.get('spanish')):
            continue
        item={k:row.get(k) for k in ('id','hanzi','lessons','roles','visual_ming')}
        item.update(pinyin=pinyin,spanish=spanish)
        if context:
            item['lessonContexts']=[dict(lesson=4,pinyin=context.get('pinyin'),spanish=context.get('spanish'),
                role=context['role'])]
        item['examplePhraseIds']=row.get('example_phrase_ids',[])
        public_vocab.append(item)
    public_phrases=[]
    allowed={'example','dialogue_turn','collocation','reading','writing_model','reading_sentence','writing_model_sentence'}
    for row in phrases:
        if 'counterexample' in row['kinds']:continue
        ev=[witnesses[e] for e in row['evidence_ids']]
        # Secondary dialogue variants remain in the corpus but not the main learner bank.
        if not any(e.get('lesson')!=4 or e.get('kind') in allowed for e in ev):continue
        public_phrases.append(dict(id=row['id'],hanzi=row['hanzi'],pinyin=row.get('pinyin_display') or row.get('pinyin'),
            spanish=row.get('spanish_display'),lessons=row['lessons'],kinds=row['kinds'],
            vocabIds=row['vocab_ids'],dialogueIds=[x for x in row['dialogue_ids'] if '-BOOK-' in x]))
    all_phrases={p['id']:p for p in phrases}
    dialogues=[]
    for d in query.read_table('dialogues'):
        if '-BOOK-' not in d['id']:continue
        turns=[]
        for t in d['turns']:
            es=[w for w in witnesses.values() if w.get('dialogue_id')==d['id'] and w.get('turn')==t['turn']]
            if len(es)!=1:raise ValueError('Dialogue witness selection must be exact')
            w=es[0];ph=all_phrases[w['phrase_id']]
            turns.append(dict(turn=t['turn'],speaker=t['speaker_source'],hanzi=t['hanzi'],phraseId=w['phrase_id'],
                pinyin=w.get('pinyin_source') or ph.get('pinyin_display'),spanish=w.get('spanish_source') or ph.get('spanish_display')))
        dialogues.append(dict(id=d['id'],lesson=d['lesson'],turns=turns))
    payload=dict(version='2.2.0',vocabulary=public_vocab,phrases=public_phrases,dialogues=dialogues,
        availability=dict(source_corpus_complete=True,source_pinyin_and_spanish_may_be_null=True,
            generated_audio=False,generated_images=False,app_runtime_switched=False))
    raw=json.dumps(payload,ensure_ascii=False,separators=(',',':')).encode()
    payload['fingerprint']=hashlib.sha256(raw).hexdigest()
    return payload


def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--check',action='store_true')
    ap.add_argument('--out',type=Path,default=query.CACHE/'public.json')
    args=ap.parse_args();payload=build()
    marker=ROOT/'MING_KNOWLEDGE/v2/public-v22.sha256'
    if args.check:
        if not marker.is_file() or marker.read_text().strip()!=payload['fingerprint']:
            raise SystemExit('Stale v2.2 public projection fingerprint')
        print('v2.2 public projection: reproducible and matches committed fingerprint')
    else:
        args.out.parent.mkdir(parents=True,exist_ok=True)
        args.out.write_text(json.dumps(payload,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
        marker.write_text(payload['fingerprint']+'\n',encoding='utf-8')
        print(f'Wrote {args.out}; fingerprint {payload["fingerprint"]}')

if __name__=='__main__':main()
