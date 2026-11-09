"""Deterministic additive L6 projection; preserves historical exports and IDs."""
import hashlib,json,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
source=ROOT/'MING_KNOWLEDGE/v2/lesson6/content.json'
d=json.loads(source.read_text()); fingerprint=hashlib.sha256(source.read_bytes()).hexdigest()
phrases={}; vocabulary=[]; vocab_sources={}
def phrase(row,kind,links=None):
 h=row['hanzi']; p=row.get('pinyin_ming') or row.get('pinyin_source',''); s=row.get('spanish_source') or row.get('spanish_ming','')
 ident='PH-L6-'+hashlib.sha256(h.encode()).hexdigest()[:16];ids=links if links is not None else row.get('vocabIds',[])
 if ident not in phrases:phrases[ident]=dict(id=ident,hanzi=h,pinyin=p,spanish=s,lessons=[6],kinds=[kind],vocabIds=list(ids),dialogueIds=[],curriculumLinks=[dict(lesson=6,kind=kind)],exampleVocabIds=list(ids))
 else:
  entry=phrases[ident]
  for key,values in [('vocabIds',ids),('exampleVocabIds',ids),('kinds',[kind])]:entry[key]=list(dict.fromkeys(entry[key]+values))
 return ident
for w in d['vocabulary']:
 mode=w['visual_mode'];role=w['role'];phrase(w['example'],'editorial_study_example')
 vocabulary.append(dict(id=w['id'],hanzi=w['hanzi'],pinyin=w.get('pinyin_ming') or w['pinyin_source'],spanish=w.get('spanish_source') or w.get('spanish_ming',''),lessons=[6],roles=[role],curriculumLinks=[dict(lesson=6,role=role,text=w['text'],list_type='new_vocabulary' if role=='core_textbook' else 'supplementary_vocabulary' if role=='supplementary_textbook' else None,entry_kind=w['entry_kind'])],examplePhraseIds=[],visual_ming=dict(visual_mode={'text':'text_only','scene':'concept_scene','object':'concrete_object'}[mode],image_support=mode!='text',image_quiz_eligible=mode=='object',ambiguity_risk='low' if mode=='object' else 'high' if mode=='text' else 'medium')))
 vocab_sources[w['id']]=w['source']
speaker_pinyin={'新同学':'Xīn tóngxué','丁力波':'Dīng Lìbō','林娜':'Lín Nà','宋华':'Sòng Huá'}
dialogues=[]
for dialogue in d['dialogues']:
 turns=[]
 for row in dialogue['turns']:
  pid=phrase(row,'dialogue_turn');phrases[pid]['dialogueIds'].append(dialogue['id'])
  turns.append(dict(turn=row['turn'],speaker=row['speaker'],speakerPinyin=speaker_pinyin[row['speaker']],hanzi=row['hanzi'],pinyin=row.get('pinyin_ming') or row['pinyin_source'],spanish=row['spanish_ming'],phraseId=pid))
 dialogues.append(dict(id=dialogue['id'],lesson=6,text=dialogue['text'],turns=turns))
sentences=[]
for row in d['sentences']:
 phrase(row,'key_phrase')
 assert re.sub(r'[^\u3400-\u9fff〇0-9]','',row['hanzi'])==re.sub(r'[^\u3400-\u9fff〇0-9]','',''.join(row['tokens'])),row
 sentences.append(dict(id=row['id'],hanzi=row['hanzi'],pinyin=row['pinyin_ming'],translation=row['spanish_ming'],tokens=row['tokens'],grammarTags=['L6'],difficulty=2,source=row['source']))
for w in vocabulary:
 w['examplePhraseIds']=[p['id'] for p in phrases.values() if w['id'] in p['exampleVocabIds']]
 assert w['examplePhraseIds'] and all(w[x] for x in ['hanzi','pinyin','spanish'])
characters=[]
for i,row in enumerate(d['characters']):
 h=row['hanzi']; asset=ROOT/'node_modules/hanzi-writer-data'/f'{h}.json';strokes=json.loads(asset.read_text())
 assert len(strokes['strokes'])==len(strokes['medians'])>0
 characters.append(dict(id='c-'+h,lessonId='lesson-6',hanzi=h,pinyin=row['pinyin_ming'],meaning=row['spanish_ming'],strokeCount=len(strokes['strokes']),radical=row['radical'],components=row['components'],recognitionRequired=True,writingRequired=row['writingRequired'],source=row['source'],sources=[row['source']],sourceGroups=[row['unit']],primaryStage=row['unit'],introducedIn=row['unit'],appearsIn=[row['unit']],sourceRole='core',curricularOrder=i,curricular=True,radicalAudited=bool(row['radical']),componentsAudited=bool(row['components']),words=[]))
units=[dict(id=f'6.{i}',lesson=6,text=i,title=f'Lección 6 · Texto {i}',shortTitle=f'6.{i}',chinese='图书馆在食堂北边' if i==1 else '你家在哪儿',description='Objetivos explícitos de escritura del libro y del cuaderno.',characters=[c['hanzi'] for c in characters if c['introducedIn']==f'6.{i}']) for i in [1,2]]
readings=[dict(id=r['id'],title=r['title'],hanzi=r['hanzi'],pinyin=r.get('pinyin_source') or r.get('pinyin_ming',''),spanish=r.get('spanish_source') or r.get('spanish_ming','')) for r in d['readings']]
result=dict(version=d['version'],fingerprint=fingerprint,corpusFingerprint=fingerprint,vocabulary=vocabulary,phrases=list(phrases.values()),dialogues=dialogues,characters=characters,units=units,grammar=[{k:v for k,v in r.items() if k!='origin'} for r in d['grammar']],readings=readings,documentaryExercises=[{k:v for k,v in r.items() if k in ['id','title','texts','sourceTitle','requiresOriginalAudio']} for r in d['documentaryExercises']],sentences=sentences,vocabularySources=vocab_sources,pending=d['pending'],objectives=[r['text'] for r in d['objectives']],culture=[dict(title=r['title'],text=r['text']) for r in d['culture']],bookRadicals=[{k:v for k,v in r.items() if k!='source'} for r in d['bookRadicals']])
assert len({w['id'] for w in vocabulary})==len(vocabulary)
assert len({c['id'] for c in characters})==len(characters)
encoded=json.dumps(result,ensure_ascii=False,indent=2)+'\n';destination=ROOT/'data/lesson6-public.json'
if '--check' in sys.argv:assert destination.read_text()==encoded,'L6 projection is stale'
else:destination.write_text(encoded)
print(f'L6 verified: {len(vocabulary)} words, {len(phrases)} phrases, {len(characters)} writing targets, {len(d["documentaryExercises"])} activities')

# Reference glyphs have a separate projection and never enter curricular units.
reference_output=ROOT/'data/lesson6-reference-hanzi.json'
reference_encoded=json.dumps(d['referenceCharacters'],ensure_ascii=False,indent=2)+'\n'
if '--check' in sys.argv:assert reference_output.read_text()==reference_encoded,'L6 character reference projection is stale'
else:reference_output.write_text(reference_encoded)
