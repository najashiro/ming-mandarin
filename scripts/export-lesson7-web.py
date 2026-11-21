"""Deterministic additive L7 projection; preserves historical exports and IDs."""
import hashlib,json,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
source=ROOT/'MING_KNOWLEDGE/v2/lesson7/content.json'
d=json.loads(source.read_text()); fingerprint=hashlib.sha256(source.read_bytes()).hexdigest()
phrases={}; vocabulary=[]; vocab_sources={}
def phrase(row,kind,links=None):
 h=row['hanzi']; p=row.get('pinyin_ming') or row.get('pinyin_source',''); s=row.get('spanish_source') or row.get('spanish_ming','')
 ident='PH-L7-'+hashlib.sha256(h.encode()).hexdigest()[:16];ids=links if links is not None else row.get('vocabIds',[])
 if ident not in phrases:phrases[ident]=dict(id=ident,hanzi=h,pinyin=p,spanish=s,lessons=[7],kinds=[kind],vocabIds=list(ids),dialogueIds=[],curriculumLinks=[dict(lesson=7,kind=kind)],exampleVocabIds=list(ids))
 else:
  entry=phrases[ident]
  for key,values in [('vocabIds',ids),('exampleVocabIds',ids),('kinds',[kind])]:entry[key]=list(dict.fromkeys(entry[key]+values))
 return ident
for w in d['vocabulary']:
 mode=w['visual_mode'];role=w['role'];phrase(w['example'],'editorial_study_example')
 vocabulary.append(dict(id=w['id'],hanzi=w['hanzi'],pinyin=w.get('pinyin_ming') or w['pinyin_source'],spanish=w.get('spanish_source') or w.get('spanish_ming',''),lessons=[7],roles=[role],curriculumLinks=[dict(lesson=7,role=role,text=w['text'],list_type='new_vocabulary' if role=='core_textbook' else 'supplementary_vocabulary' if role=='supplementary_textbook' else None,entry_kind=w['entry_kind'])],examplePhraseIds=[],visual_ming=dict(visual_mode={'text':'text_only','scene':'concept_scene','object':'concrete_object'}[mode],image_support=mode!='text',image_quiz_eligible=mode=='object',ambiguity_risk='low' if mode=='object' else 'high' if mode=='text' else 'medium')))
 vocabulary[-1]['imageReuseBlocked']=w['imageReuseBlocked']
 vocab_sources[w['id']]=w['source']
speaker_pinyin={'老板':'Lǎobǎn','马大为':'Mǎ Dàwéi','丁力波':'Dīng Lìbō','售货员':'Shòuhuòyuán'}
dialogues=[]
for dialogue in d['dialogues']:
 turns=[]
 for row in dialogue['turns']:
  pid=phrase(row,'dialogue_turn');phrases[pid]['dialogueIds'].append(dialogue['id'])
  turns.append(dict(turn=row['turn'],speaker=row['speaker'],speakerPinyin=speaker_pinyin[row['speaker']],hanzi=row['hanzi'],pinyin=row.get('pinyin_ming') or row['pinyin_source'],spanish=row['spanish_ming'],phraseId=pid))
 dialogues.append(dict(id=dialogue['id'],lesson=7,text=dialogue['text'],turns=turns))
sentences=[]
for row in d['sentences']:
 phrase(row,'key_phrase')
 assert re.sub(r'[^\u3400-\u9fff〇0-9]','',row['hanzi'])==re.sub(r'[^\u3400-\u9fff〇0-9]','',''.join(row['tokens'])),row
 sentences.append(dict(id=row['id'],hanzi=row['hanzi'],pinyin=row['pinyin_ming'],translation=row['spanish_ming'],tokens=row['tokens'],grammarTags=['L7'],difficulty=2,source=row['source']))
for w in vocabulary:
 w['examplePhraseIds']=[p['id'] for p in phrases.values() if w['id'] in p['exampleVocabIds']]
 assert w['examplePhraseIds'] and all(w[x] for x in ['hanzi','pinyin','spanish'])
characters=[]
for i,row in enumerate(d['characters']):
 h=row['hanzi']; asset=ROOT/'node_modules/hanzi-writer-data'/f'{h}.json';strokes=json.loads(asset.read_text())
 assert len(strokes['strokes'])==len(strokes['medians'])>0
 characters.append(dict(id='c-'+h,lessonId='lesson-7',hanzi=h,pinyin=row['pinyin_ming'],meaning=row['spanish_ming'],strokeCount=len(strokes['strokes']),radical=row['radical'],components=row['components'],recognitionRequired=True,writingRequired=row['writingRequired'],source=row['source'],sources=[row['source']],sourceGroups=[row['unit']],primaryStage=row['unit'],introducedIn=row['unit'],appearsIn=[row['unit']],sourceRole='core',curricularOrder=i,curricular=True,radicalAudited=bool(row['radical']),componentsAudited=bool(row['components']),words=[]))
units=[dict(id=f'7.{i}',lesson=7,text=i,title=f'Lección 7 · Texto {i}',shortTitle=f'7.{i}',chinese='苹果多少钱一斤' if i==1 else '这件衬衫多少钱',description='Objetivos explícitos de escritura del libro y del cuaderno.',characters=[c['hanzi'] for c in characters if c['introducedIn']==f'7.{i}']) for i in [1,2]]
readings=[dict(id=r['id'],title=r['title'],hanzi=r['hanzi'],pinyin=r.get('pinyin_source') or r.get('pinyin_ming',''),spanish=r.get('spanish_source') or r.get('spanish_ming','')) for r in d['readings']]
result=dict(version=d['version'],fingerprint=fingerprint,corpusFingerprint=fingerprint,vocabulary=vocabulary,phrases=list(phrases.values()),dialogues=dialogues,characters=characters,units=units,grammar=[{k:v for k,v in r.items() if k!='origin'} for r in d['grammar']],readings=readings,documentaryExercises=[{k:v for k,v in r.items() if k in ['id','title','texts','sourceTitle','requiresOriginalAudio']} for r in d['documentaryExercises']],sentences=sentences,vocabularySources=vocab_sources,pending=d['pending'],objectives=[r['text'] for r in d['objectives']],culture=[dict(title=r['title'],text=r['text']) for r in d['culture']],bookRadicals=[{k:v for k,v in r.items() if k!='source'} for r in d['bookRadicals']])
result['workbookGames']=[{k:v for k,v in row.items() if k not in ['pdfPage','sourceExerciseId','answerOrigin']} for row in d['workbookGames']]
result['workbookEvidence']={row['id']:{'pdfPage':row['pdfPage'],'sourceExerciseId':row['sourceExerciseId']} for row in d['workbookGames']}
result['conversationPractice']=d['conversationPractice']
result['conversationPairs']=d['conversationPairs']
result['resources']=d.get('resources',[])
for source_activity,activity in zip(d['documentaryExercises'],result['documentaryExercises']):
 if 'listeningPractice' in source_activity:activity['listeningPractice']=source_activity['listeningPractice']
result['grammarLanguageSupport']=d['grammarLanguageSupport']
assert len({w['id'] for w in vocabulary})==len(vocabulary)
assert len({c['id'] for c in characters})==len(characters)
encoded=json.dumps(result,ensure_ascii=False,indent=2)+'\n';destination=ROOT/'data/lesson7-public.json'
if '--check' in sys.argv:assert destination.read_text()==encoded,'L7 projection is stale'
else:destination.write_text(encoded)
print(f'L7 verified: {len(vocabulary)} words, {len(phrases)} phrases, {len(characters)} writing targets, {len(d["documentaryExercises"])} activities')

# Reference glyphs have a separate projection and never enter curricular units.
reference_output=ROOT/'data/lesson7-reference-hanzi.json'
reference_encoded=json.dumps(d['referenceCharacters'],ensure_ascii=False,indent=2)+'\n'
if '--check' in sys.argv:assert reference_output.read_text()==reference_encoded,'L7 character reference projection is stale'
else:reference_output.write_text(reference_encoded)
