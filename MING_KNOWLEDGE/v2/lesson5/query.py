"""Bounded offline reader for the L5 extension. Source and editorial fields remain distinct."""
import argparse,json,subprocess,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[3]
def main():
 ap=argparse.ArgumentParser(description=__doc__)
 ap.add_argument('--lesson',type=int,choices=[5],default=5);ap.add_argument('--word');ap.add_argument('--examples',action='store_true');ap.add_argument('--hanzi');ap.add_argument('--phrase');ap.add_argument('--table',default='vocabulary',choices=['vocabulary','dialogues','grammar','characters','readings','documentaryExercises','sentences','sources','corrections']);ap.add_argument('--limit',type=int,default=12);ap.add_argument('--offset',type=int,default=0);ap.add_argument('--summary',action='store_true');ap.add_argument('--validate',action='store_true');ap.add_argument('--full',action='store_true')
 args=ap.parse_args()
 if not 1<=args.limit<=100 or args.offset<0:ap.error('limit 1..100; offset >= 0')
 source=json.loads((ROOT/'MING_KNOWLEDGE/v2/lesson5/content.json').read_text());public=json.loads((ROOT/'data/lesson5-public.json').read_text())
 if args.validate:
  subprocess.run([sys.executable,str(ROOT/'scripts/export-lesson5-web.py'),'--check'],check=True,stdout=sys.stderr)
  assert len(source['sources'])==4
  for row in source['vocabulary']:
   assert row['pinyin_source'] and (row.get('spanish_source') or row.get('spanish_ming'))
   assert 1<=row['source']['pdfPage']<=source['sources']['book']['pages']
   assert row['example']['origin']=='editorial_study_example'
  print(json.dumps({'valid':True,'version':source['version'],'vocabulary':len(public['vocabulary']),'phrases':len(public['phrases']),'writing_targets':len(public['characters'])}));return
 if args.summary:result={k:len(v) for k,v in source.items() if isinstance(v,(list,dict))}
 elif args.word:
  key=args.word if args.word.startswith('v-') else 'v-'+args.word
  row=next((r for r in source['vocabulary'] if r['id']==key),None);result={'found':row is not None,'source_record':row}
  if args.examples:
   word=next((r for r in public['vocabulary'] if r['id']==key),None);ids=word['examplePhraseIds'] if word else []
   result['related_phrases']=[p for p in public['phrases'] if p['id'] in ids][args.offset:args.offset+args.limit]
 elif args.hanzi:result=[r for r in source['characters'] if r['hanzi']==args.hanzi.removeprefix('c-')]
 elif args.phrase:result=[r for r in public['phrases'] if args.phrase in [r['id'],r['hanzi']]]
 else:
  rows=source.get(args.table,[]);result={'table':args.table,'total':len(rows),'rows':rows[args.offset:args.offset+args.limit] if isinstance(rows,list) else rows}
 print(json.dumps(result,ensure_ascii=False,indent=2))
if __name__=='__main__':main()
