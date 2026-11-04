"""Deterministic L5 learner projection. Never copies source PDFs or source metadata into cards."""
import hashlib,json,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
source=ROOT/'MING_KNOWLEDGE/v2/lesson5/content.json'
d=json.loads(source.read_text());fingerprint=hashlib.sha256(source.read_bytes()).hexdigest()
phrases={};vocabulary=[];vocab_sources={}
def phrase(row,kind,links=None):
 h=row['hanzi'];p=row.get('pinyin_ming',row.get('pinyin_source',''));s=row.get('spanish_ming',row.get('spanish_source',''))
 ident='PH-L5-'+hashlib.sha256(h.encode()).hexdigest()[:16]
 ids=links if links is not None else row.get('vocabIds',[])
 if ident not in phrases:phrases[ident]=dict(id=ident,hanzi=h,pinyin=p,spanish=s,lessons=[5],kinds=[kind],vocabIds=list(ids),dialogueIds=[],curriculumLinks=[dict(lesson=5,kind=kind)],exampleVocabIds=list(ids))
 else:
  entry=phrases[ident]
  for key,values in [('vocabIds',ids),('exampleVocabIds',ids),('kinds',[kind])]:entry[key]=list(dict.fromkeys(entry[key]+values))
 return ident
for word in d['vocabulary']:
 role=word['role'];mode=word['visual_mode'];phrase(word['example'],'editorial_study_example')
 vocabulary.append(dict(id=word['id'],hanzi=word['hanzi'],pinyin=word['pinyin_source'],spanish=word['spanish_source'],lessons=[5],roles=[role],curriculumLinks=[dict(lesson=5,role=role,text=word['text'],list_type='new_vocabulary' if role=='core_textbook' else 'supplementary_vocabulary' if role=='supplementary_textbook' else None,entry_kind='word')],examplePhraseIds=[],visual_ming=dict(visual_mode={'text':'text_only','scene':'concept_scene','object':'concrete_object'}[mode],image_support=mode!='text',image_quiz_eligible=mode=='object',ambiguity_risk='low' if mode=='object' else 'high' if mode=='text' else 'medium')))
 vocab_sources[word['id']]=word['source']
speaker_pinyin={'王小云':'Wáng Xiǎoyún','林娜':'Lín Nà','林强':'Lín Qiáng','宋华':'Sòng Huá','大家':'Dàjiā'}
dialogues=[]
for dialogue in d['dialogues']:
 turns=[]
 for row in dialogue['turns']:
  pid=phrase(row,'dialogue_turn');phrases[pid]['dialogueIds'].append(dialogue['id'])
  turns.append(dict(turn=row['turn'],speaker=row['speaker'],speakerPinyin=speaker_pinyin[row['speaker']],hanzi=row['hanzi'],pinyin=row['pinyin_ming'],spanish=row['spanish_ming'],phraseId=pid))
 dialogues.append(dict(id=dialogue['id'],lesson=5,text=dialogue['text'],turns=turns))
sentences=[]
for row in d['sentences']:
 phrase(row,'key_phrase')
 assert re.sub(r'[^\u3400-\u9fff〇0-9]','',row['hanzi'])==re.sub(r'[^\u3400-\u9fff〇0-9]','',''.join(row['tokens'])),row
 sentences.append(dict(id=row['id'],hanzi=row['hanzi'],pinyin=row['pinyin_ming'],translation=row['spanish_ming'],tokens=row['tokens'],grammarTags=['L5'],difficulty=2,source=row['source']))
# Explicit pedagogical inheritance only for the listed pairs.
for parent,child in [('老鼠','鼠'),('老虎','虎'),('星期','星期日'),('常','常常'),('跳','跳舞')]:
 for p in phrases.values():
  if 'v-'+child in p['exampleVocabIds'] and 'v-'+parent not in p['exampleVocabIds']:p['exampleVocabIds'].append('v-'+parent)
for p in phrases.values():
 if re.search(r'[…_□]',p['hanzi']):p['exampleVocabIds']=[]
for word in vocabulary:
 word['examplePhraseIds']=[p['id'] for p in phrases.values() if word['id'] in p['exampleVocabIds'] and not re.search(r'[…_□]',p['hanzi'])]
 assert word['examplePhraseIds'],word['hanzi']
 assert all(word[x] for x in ['hanzi','pinyin','spanish'])
characters=[]
for i,row in enumerate(d['characters']):
 h=row['hanzi'];asset=ROOT/'node_modules/hanzi-writer-data'/f'{h}.json'
 strokes=json.loads(asset.read_text());assert len(strokes['strokes'])==len(strokes['medians'])>0
 characters.append(dict(id='c-'+h,lessonId='lesson-5',hanzi=h,pinyin=row['pinyin_ming'],meaning=row['spanish_ming'],strokeCount=len(strokes['strokes']),radical=row['radical'],components=row['components'],recognitionRequired=True,writingRequired=row['writingRequired'],source=row['source'],sources=[row['source']],sourceGroups=[row['unit']],primaryStage=row['unit'],introducedIn=row['unit'],appearsIn=[row['unit']],sourceRole='core',curricularOrder=i,curricular=True,radicalAudited=bool(row['radical']),componentsAudited=bool(row['components']),words=[]))
units=[dict(id=f'5.{i}',lesson=5,text=i,title=f'Lección 5 · Texto {i}',shortTitle=f'5.{i}',chinese='生日聚会' if i==1 else '祝你生日快乐',description='Caracteres del libro y la hoja Hanzi.',characters=[c['hanzi'] for c in characters if c['introducedIn']==f'5.{i}']) for i in [1,2]]
readings=[dict(id=r['id'],title=r['title'],hanzi=r['hanzi'],pinyin=r['pinyin_ming'],spanish=r['spanish_ming']) for r in d['readings']]
result=dict(version=d['version'],fingerprint=fingerprint,corpusFingerprint=fingerprint,vocabulary=vocabulary,phrases=list(phrases.values()),dialogues=dialogues,characters=characters,units=units,grammar=[{k:v for k,v in r.items() if k!='origin'} for r in d['grammar']],readings=readings,documentaryExercises=[{k:v for k,v in r.items() if k not in ['source','origin']} for r in d['documentaryExercises']],sentences=sentences,vocabularySources=vocab_sources,pending=[])
assert len({v['id'] for v in vocabulary})==len(vocabulary)
assert len({c['id'] for c in characters})==len(characters)
encoded=json.dumps(result,ensure_ascii=False,indent=2)+'\n';destination=ROOT/'data/lesson5-public.json'
if '--check' in sys.argv:
 assert destination.read_text()==encoded,'L5 projection is stale'
else:destination.write_text(encoded)
print(f'L5 verified: {len(vocabulary)} words, {len(phrases)} linked phrases, {len(characters)} writing targets')
