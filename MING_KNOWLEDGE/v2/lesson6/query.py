"""Bounded offline queries for L6, with separate documentary and editorial fields."""
import argparse
import json
import subprocess
import sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[3]
HERE=Path(__file__).resolve().parent

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--lesson',type=int,choices=[6],default=6)
    for name in ['word','hanzi','phrase','source']:
        parser.add_argument('--'+name)
    parser.add_argument('--page',type=int)
    parser.add_argument('--table',default='vocabulary')
    parser.add_argument('--limit',type=int,default=12)
    parser.add_argument('--offset',type=int,default=0)
    for name in ['examples','summary','validate','full']:
        parser.add_argument('--'+name,action='store_true')
    args=parser.parse_args()
    if not 1<=args.limit<=100 or args.offset<0:parser.error('limit 1..100; offset >= 0')
    source=json.loads((HERE/'content.json').read_text())
    public=json.loads((ROOT/'data/lesson6-public.json').read_text())
    coverage=json.loads((HERE/'page-coverage.json').read_text())
    if args.validate:
        subprocess.run([sys.executable,str(ROOT/'scripts/export-lesson6-web.py'),'--check'],check=True,stdout=sys.stderr)
        assert len(coverage)==sum(s['pages'] for s in source['sources'].values())==93
        assert all(r['officialAnswerKey'] is None and not r['automaticGrading'] for r in source['documentaryExercises'])
        def validate_refs(value):
            if isinstance(value,dict):
                if 'pdfPage' in value and 'file' in value:
                    document=next(s for s in source['sources'].values() if s['file']==value['file'])
                    assert 1<=value['pdfPage']<=document['pages'],value
                for child in value.values():validate_refs(child)
            elif isinstance(value,list):
                for child in value:validate_refs(child)
        validate_refs(source)
        assert len({v['id'] for v in source['vocabulary']})==len(source['vocabulary'])
        assert all(v['example']['origin']=='editorial_study_example' for v in source['vocabulary'])
        result={'valid':True,'version':source['version'],'pages':len(coverage),'vocabulary':len(public['vocabulary']),'dialogue_turns':sum(len(d['turns']) for d in public['dialogues']),'writing_targets':len(public['characters']),'official_answer_key':False,'original_audio':False}
    elif args.summary:
        result={k:len(v) for k,v in source.items() if isinstance(v,(list,dict))}
    elif args.source:
        if args.source not in source['sources']:parser.error('--source: book, workbook or slides')
        if args.page is not None and not 1<=args.page<=source['sources'][args.source]['pages']:parser.error('page outside source')
        result={'source':source['sources'][args.source],'pages':[r for r in coverage if r['source']==args.source and (args.page is None or r['pdfPage']==args.page)][args.offset:args.offset+args.limit]}
    elif args.word:
        key=args.word if args.word.startswith('v-') else 'v-'+args.word
        row=next((r for r in source['vocabulary'] if r['id']==key),None)
        result={'found':row is not None,'source_record':row}
        if args.examples:
            word=next((r for r in public['vocabulary'] if r['id']==key),None)
            ids=word['examplePhraseIds'] if word else []
            result['related_phrases']=[r for r in public['phrases'] if r['id'] in ids][args.offset:args.offset+args.limit]
    elif args.hanzi:
        result=[r for r in source['characters'] if r['hanzi']==args.hanzi.removeprefix('c-')]
    elif args.phrase:
        result=[r for r in public['phrases'] if args.phrase in [r['id'],r['hanzi']]]
    else:
        if args.table not in source:parser.error('Unknown source table')
        rows=source[args.table]
        result={'table':args.table,'total':len(rows),'rows':rows[args.offset:args.offset+args.limit] if isinstance(rows,list) else rows}
    print(json.dumps(result,ensure_ascii=False,indent=2))

if __name__=='__main__':main()
