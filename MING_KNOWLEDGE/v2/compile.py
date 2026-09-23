"""Compile source-derived Míng tables. No PDF, network, or third-party library is needed."""
from __future__ import annotations
from pathlib import Path
import json, re, unicodedata, hashlib, csv, collections, os
from pack import load_pack
R=Path(__file__).resolve().parent
O=Path(os.environ.get('MING_CORPUS_OUT',str(R/'.cache'))); O.mkdir(parents=True,exist_ok=True)
PACK=load_pack()
def load(n):return PACK[n]
S=load('sources');V=load('vocabulary_evidence');P=load('phrase_evidence');H=load('hanzi_evidence');WS=load('worksheet_sequences');G=load('grammar_evidence');E=load('exercises');D=load('dialogues');N=load('notes');RAD=load('radicals');F=load('foundations')
SHA='b952c16360cd85c25205b49db5c23c543f553dcd'
BASE='https://github.com/najashiro/ming-mandarin/blob/'+SHA+'/'
source_by={s['id']:s for s in S}
def clean(t):return ''.join(c for c in unicodedata.normalize('NFC',t) if not c.isspace() and not unicodedata.category(c).startswith(('P','Z')))
def textid(prefix,text):return prefix+hashlib.sha256(clean(text).encode()).hexdigest()[:16]
def cjk(t):return bool(re.search(r'[\u3400-\u9fff]',t))
def striptoken(t):return t.strip().strip('。，、！？；：,.!?;:（）()「」“”"… ')
def stable_unique(seq):return list(dict.fromkeys(seq))
def ref(s,p):return f'{s}:p{p:03d}'
def save(n,x):
 (O/f'{n}.json').write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
def tsv(n,cols,rows):
 with (O/f'{n}.tsv').open('w',newline='',encoding='utf-8') as f:
  w=csv.writer(f,delimiter='\t');w.writerow(cols)
  for row in rows:w.writerow([json.dumps(row.get(c),ensure_ascii=False,separators=(',',':')) if isinstance(row.get(c),(list,dict)) else (row.get(c) if row.get(c) is not None else '') for c in cols])

# Source identities are independent from the incidental numbers in PDF filenames.
for s in S:
 s['lessons']=[1,2] if s['id'] in ['SRC-BOOK-01-02','SRC-WB-01-02'] else [0] if '-00-' in s['id'] else [1] if '-01-' in s['id'] else [2] if '-02-' in s['id'] else [3] if '-03' in s['id'] else [2]
 s['printed_page_offset']=87 if s['id']=='SRC-BOOK-03' else 18 if s['id']=='SRC-WB-03' else -1 if s['id']=='SRC-BOOK-01-02' else 0 if s['id']=='SRC-WB-01-02' else None
 s['source_file_included']=False

# A curated list entry is a lexeme. A token used in a source phrase is contextual evidence, not automatically core.
voc={}; ve=[]
def addword(zh, ev=None, kind='lexeme'):
 if not zh or not cjk(zh):return None
 key='v-'+zh
 if key not in voc:voc[key]={'id':key,'hanzi':zh,'kind':kind,'lessons':[],'roles':[],'source_refs':[],'pinyin_variants':[],'spanish_variants':[],'evidence_ids':[]}
 q=voc[key]
 if ev:
  q['lessons']=sorted(set(q['lessons']+[ev['lesson']]))
  if ev['role'] not in q['roles']:q['roles'].append(ev['role'])
  rr=ref(ev['source_id'],ev['page'])
  if rr not in q['source_refs']:q['source_refs'].append(rr)
  eid=f'VE-{len(ve)+1:05d}'
  rec=dict(ev,id=eid,vocab_id=key)
  ve.append(rec);q['evidence_ids'].append(eid)
  for a,b in [('pinyin_source','pinyin_variants'),('spanish_source','spanish_variants')]:
   if ev.get(a):
    variant={'value':ev[a],'source_id':ev['source_id'],'page':ev['page'],'role':ev['role']}
    if variant not in q[b]:q[b].append(variant)
 return key
for ev in V:addword(ev['hanzi'],ev,'lexeme')
# Worksheet word sequences remain separate from isolated glyph practice.
for ev in WS:
 zh=ev.get('text') or ev.get('hanzi') or ev.get('word')
 if zh:
  addword(zh,{'source_id':ev['source_id'],'page':ev['page'],'lesson':ev['lesson'],'role':'worksheet_sequence','hanzi':zh,'pinyin_source':ev.get('pinyin_source'),'spanish_source':None,'note':'Secuencia explícita de la hoja; puede ser una expresión y no un sustantivo léxico.'},'expression' if len(zh)>4 else 'lexeme')

phrases={};pe=[];wordlinks=[];occ_links=[];glyphlinks=[]
valid_examples={'dialogue_turn','example','dialogue_example','grammar_example','reading','writing_model','question_answer_printed','translation_answer_printed'}
for i,x in enumerate(P,1):
 pid=textid('PH-',x['hanzi']);oid=f'PE-{i:05d}'
 if pid not in phrases:phrases[pid]={'id':pid,'hanzi':x['hanzi'],'normalized_text':clean(x['hanzi']),'lessons':[],'kinds':[],'source_refs':[],'evidence_ids':[],'pinyin_variants':[],'spanish_variants':[],'vocab_ids':[],'hanzi_ids':[],'dialogue_ids':[],'exercise_ids':[],'grammar_ids':[]}
 q=phrases[pid];q['lessons']=sorted(set(q['lessons']+[x['lesson']]));q['kinds']=stable_unique(q['kinds']+[x['kind']]);q['source_refs']=stable_unique(q['source_refs']+[ref(x['source_id'],x['page'])]);q['evidence_ids'].append(oid)
 review=x.get('review_status','source_transcribed')
 if x['kind']=='counterexample':review='not_a_positive_example'
 rec=dict(x,id=oid,phrase_id=pid,review_status=review)
 # The previous page-level helper is explicitly not an item-level attestation.
 rec.pop('related_exercise_ids',None)
 pe.append(rec)
 for a,b in [('pinyin_source','pinyin_variants'),('spanish_source','spanish_variants')]:
  if x.get(a):q[b].append({'value':x[a],'evidence_id':oid})
 if x.get('dialogue_id'):q['dialogue_ids']=stable_unique(q['dialogue_ids']+[x['dialogue_id']])
 cursor=0
 for tok in x['tokens_annotated']:
  token=striptoken(tok)
  # Parenthetical English glosses are not Chinese lexemes and are not linked as curriculum.
  if cjk(token):
   token=re.sub(r'[（(][^）)]*[）)]','',token)
   token=striptoken(token)
   role='numeral_in_context' if re.fullmatch('[一二三四五六七八九十百千万两零]+',token) else 'phrase_context'
   vid=addword(token,{'source_id':x['source_id'],'page':x['page'],'lesson':x['lesson'],'role':role,'hanzi':token,'pinyin_source':None,'spanish_source':None,'note':f'Token anotado de {pid}; no es prueba de entrada en 生词.'},'context_token')
   if vid:
    # Positions refer to literal text of this occurrence, with Python Unicode code points.
    off=tok.find(token)
    if off>=0:
     start=cursor+off;end=start+len(token)
     link={'vocab_id':vid,'phrase_id':pid,'phrase_evidence_id':oid,'surface':token,'start':start,'end':end,'relation':'lexical_token','method':'editorial_tokenization','lesson':x['lesson'],'source_id':x['source_id'],'page':x['page']}
     occ_links.append(link);q['vocab_ids']=stable_unique(q['vocab_ids']+[vid])
  cursor+=len(tok)
 for ch in stable_unique(c for c in x['hanzi'] if cjk(c)):
  cid='c-'+ch;q['hanzi_ids'].append(cid) if cid not in q['hanzi_ids'] else None
 # Phrase-to-exercise links require a matching sequence in an item, not merely a shared page.
 for ee in E:
  if ee['source_id']==x['source_id'] and ee['page']==x['page']:
   for item in ee['items']:
    if len(clean(x['hanzi']))>3 and clean(x['hanzi']) in clean(item['text_source']):
     q['exercise_ids']=stable_unique(q['exercise_ids']+[ee['id']]);break

# A documented multi-token expression may span adjacent annotated tokens. Boundaries
# prevent false lexical links such as 工 inside 工作 or 一 inside 一共.
occ_by=collections.defaultdict(list)
for link in occ_links:occ_by[link['phrase_evidence_id']].append(link)
for witness in pe:
    existing=occ_by[witness['id']]
    starts={t['start'] for t in existing};ends={t['end'] for t in existing}
    known={t['vocab_id'] for t in existing}
    for entry in list(voc.values()):
        term=entry['hanzi']
        if len(term)<2 or entry['id'] in known or not any(r!='phrase_context' for r in entry['roles']):continue
        offset=0
        while True:
            a=witness['hanzi'].find(term,offset)
            if a<0:break
            b=a+len(term);offset=a+1
            if a in starts and b in ends:
                link={'vocab_id':entry['id'],'phrase_id':witness['phrase_id'],'phrase_evidence_id':witness['id'],'surface':term,'start':a,'end':b,'relation':'documented_expression_span','method':'match_at_annotated_token_boundaries','lesson':witness['lesson'],'source_id':witness['source_id'],'page':witness['page']}
                occ_links.append(link)
                pp=phrases[witness['phrase_id']];pp['vocab_ids']=stable_unique(pp['vocab_ids']+[entry['id']])
# Word/phrase index deduplicated per pair; exact occurrence spans are kept independently.
for vid,pid in sorted(set((x['vocab_id'],x['phrase_id']) for x in occ_links)):
 evidence=[x['phrase_evidence_id'] for x in occ_links if x['vocab_id']==vid and x['phrase_id']==pid]
 relations=stable_unique(x['relation'] for x in occ_links if x['vocab_id']==vid and x['phrase_id']==pid)
 wordlinks.append({'vocab_id':vid,'phrase_id':pid,'relation':relations[0] if len(relations)==1 else 'multiple_attested_relations','relations':relations,'evidence_ids':stable_unique(evidence)})
# Separable 上…课 is a construction relation, not falsely a contiguous surface match.
if 'v-上课' in voc:
 for pid,q in phrases.items():
  if 'v-上' in q['vocab_ids'] and 'v-课' in q['vocab_ids'] and re.search(r'上.{1,8}课',q['hanzi']):
   wordlinks.append({'vocab_id':'v-上课','phrase_id':pid,'relation':'discontinuous_construction','evidence_ids':q['evidence_ids'],'method':'editorial_rule_assisted_needs_review'})

# Prefer an explicit textbook gloss, but never overwrite or conceal alternate source readings.
priority={'core_textbook':0,'supplementary_textbook':1,'proper_name':2,'classroom_extension':3,'teacher_extension':3,'workbook_context':4,'worksheet_sequence':5}
by_v=collections.defaultdict(list)
for link in wordlinks:by_v[link['vocab_id']].append(link)
by_pe={x['id']:x for x in pe}
for q in voc.values():
 for field,variants in [('pinyin','pinyin_variants'),('spanish','spanish_variants')]:
  arr=sorted(q[variants],key=lambda z:priority.get(z.get('role'),9))
  q[field]=arr[0]['value'] if arr else None
  q[field+'_status']='source_based_selection_see_variants' if arr else 'not_supplied_in_extracted_evidence'
 q['roles']=stable_unique(q['roles']);q['source_refs']=stable_unique(q['source_refs'])
 q['listed_as_vocabulary']=any(r not in ['phrase_context','numeral_in_context','worksheet_sequence'] for r in q['roles'])
 q['phrase_ids']=stable_unique(x['phrase_id'] for x in by_v[q['id']])
 q['phrase_count']=len(q['phrase_ids'])
 candidates=[]
 for pid in q['phrase_ids']:
  pp=phrases[pid]
  if any(by_pe[ei]['kind'] in valid_examples and by_pe[ei]['review_status']=='source_transcribed' for ei in pp['evidence_ids']):
   candidates.append(pp)
 candidates.sort(key=lambda x:(not bool(re.search('[。？！!?！]',x['hanzi'])),not any('BOOK' in z for z in x['source_refs']),len(clean(x['hanzi'])),x['id']))
 q['primary_phrase_id']=candidates[0]['id'] if candidates else None
 q['primary_phrase']=candidates[0]['hanzi'] if candidates else None
 q['primary_phrase_status']='editorial_selection_of_attested_example' if candidates else 'no_attested_positive_example_selected'
 q['hanzi_ids']=['c-'+c for c in stable_unique(c for c in q['hanzi'] if cjk(c))]
 # A literal phrase is not the same entity as its dictionary headword even when it contains the same glyphs.
 if q['roles']==['phrase_context']:q['kind']='context_token'
 if all(r in ['phrase_context','numeral_in_context'] for r in q['roles']) and re.fullmatch('[一二三四五六七八九十百千万两零]+',q['hanzi']):q['kind']='number_expression'

# Character inventory retains every worksheet row and each source's own radical/reading/count.
char={};he=[]
for i,x in enumerate(H,1):
 cid='c-'+x['hanzi'];ee=dict(x,id=f'HE-{i:05d}',hanzi_id=cid);he.append(ee)
 if cid not in char:char[cid]={'id':cid,'hanzi':x['hanzi'],'source_refs':[],'lessons':[],'worksheet_refs':[],'evidence_ids':[],'readings':[],'radicals':[],'stroke_counts':[],'structures':[]}
 z=char[cid];rr=ref(x['source_id'],x['page']);z['source_refs']=stable_unique(z['source_refs']+[rr]);z['lessons']=sorted(set(z['lessons']+[x['lesson']]));z['evidence_ids'].append(ee['id'])
 if source_by[x['source_id']]['kind']=='worksheet':z['worksheet_refs']=stable_unique(z['worksheet_refs']+[rr])
 for a,b in [('pinyin_source','readings'),('radical_source','radicals'),('stroke_count_source','stroke_counts'),('structure_source','structures')]:
  if x.get(a) is not None:z[b].append({'value':x[a],'evidence_id':ee['id']})
writing_char_count=len(char)
# Every referenced glyph exists as an entity, including encountered-but-not-assigned glyphs.
for pp in phrases.values():
 for cid in pp['hanzi_ids']:
  if cid not in char:char[cid]={'id':cid,'hanzi':cid[2:],'source_refs':[],'lessons':[],'worksheet_refs':[],'evidence_ids':[],'readings':[],'radicals':[],'stroke_counts':[],'structures':[]}
  cc=char[cid];cc['encounter_source_refs']=stable_unique(cc.get('encounter_source_refs',[])+pp['source_refs'])
for qq in voc.values():
 for cid in qq['hanzi_ids']:
  if cid not in char:char[cid]={'id':cid,'hanzi':cid[2:],'source_refs':[],'lessons':[],'worksheet_refs':[],'evidence_ids':[],'readings':[],'radicals':[],'stroke_counts':[],'structures':[]}
for cc in char.values():cc['source_writing_target']=bool(cc['evidence_ids'])
for q in voc.values():
 for cid in q['hanzi_ids']:glyphlinks.append({'vocab_id':q['id'],'hanzi_id':cid,'relation':'contains_character','writing_evidence_available':bool(char[cid]['evidence_ids'])})
 # This is coverage of component glyphs, not proof the whole word was assigned as a worksheet word.
 q['worksheet_sequence_refs']=stable_unique(ref(x['source_id'],x['page']) for x in WS if (x.get('text') or x.get('hanzi') or x.get('word'))==q['hanzi'])
 q['worksheet_glyph_coverage']='all' if q['hanzi_ids'] and all(cid in char and char[cid]['worksheet_refs'] for cid in q['hanzi_ids']) else 'partial' if any(cid in char and char[cid]['worksheet_refs'] for cid in q['hanzi_ids']) else 'none'
for z in char.values():
 z['vocab_ids']=[q['id'] for q in voc.values() if z['id'] in q['hanzi_ids']]
 z['phrase_ids']=[q['id'] for q in phrases.values() if z['id'] in q['hanzi_ids']]

# Grammar records aggregate a concept without erasing independent textbook/PPT formulations.
gram={};ge=[];gp=[]
for i,x in enumerate(G,1):
 gid='GR-'+x['key'];ev=dict(x,id=f'GE-{i:04d}',grammar_id=gid);ge.append(ev)
 if gid not in gram:gram[gid]={'id':gid,'label':x['label_source'],'lessons':[],'evidence_ids':[],'source_refs':[],'phrase_ids':[]}
 q=gram[gid];q['lessons']=sorted(set(q['lessons']+[x['lesson']]));q['evidence_ids'].append(ev['id']);q['source_refs']=stable_unique(q['source_refs']+[ref(x['source_id'],x['page'])])
 for exx in x['examples']:
  pid=textid('PH-',exx)
  if pid in phrases:
   gp.append({'grammar_id':gid,'phrase_id':pid,'grammar_evidence_id':ev['id'],'relation':'example_listed_in_grammar_annotation','method':'source_based_editorial_alignment'})
   q['phrase_ids']=stable_unique(q['phrase_ids']+[pid]);phrases[pid]['grammar_ids']=stable_unique(phrases[pid]['grammar_ids']+[gid])

# Runtime coverage is a read-only snapshot. No assertion about production deployment or playable audio.
rv={1:'你 好 我 叫 请问 请 问 什么 名字 姓 认识 很 高兴 也 在 吗 进 坐 谢谢 最近 怎么样 呢 忙 不 太 他 困 渴 饿 累 还行 马马虎虎 她 您 们 我们 你们 他们 她们 是 贵 马大为 宋华 丁力波 林娜'.split(),2:'老师 你们 早上 这 是 朋友 刚 到 贵姓 哪 国 人 学习 汉语 再见 美国 北京 陈 中国 秘鲁 英国 德国 法国 日本 西班牙 加拿大 墨西哥 澳大利亚 会 说 英语 法语 德语 俄语 日语 西班牙语 韩语 看 那 都 要 上海 王小云 饺子 包子 大 小 和 米饭 面条 喜欢 吃 点心 好吃 喝 咖啡 茶 水 可乐 牛奶 饮料 面包 果汁'.split(),3:'家 有 几 口 的 照片 做 工作 医生 弟弟 哥哥 一共 个 两 姐姐 还 谁 妹妹 没有 没 狗 贝贝 爸爸 妈妈 爷爷 奶奶 外公 外婆 姥姥 姥爷 真 漂亮 张 女儿 今年 年 岁 今天 天 钢琴 课 孩子 啊 晚上 陆雨平'.split()}
ru={
'1.1':'你好我叫什么请问名字姓认识很高兴也老师再见早上午下晚安一二三四五六七八九十百千您',
'1.2':'你在吗请问进坐谢最近怎么样很好我忙呢不太他也困渴饿累',
'2.1':'陈老师你们早上好这那是谁我朋友他刚到北京您贵姓哪国人学生学习汉语再见美中国秘鲁英国德国法国日本西班牙加拿大墨西哥澳大利亚会说俄韩',
'2.2':'点心好吃爸爸上海喜欢米饭妈妈北京面条饺子包大小看这那都要和王云喝水茶咖啡可乐牛奶饮料果汁',
'3.1':'家有几口的照片做工作医生弟哥哥一共个两姐还谁妹没狗贝爸妈张爷奶外公婆姥猫只',
'3.2':'真漂亮喝茶咖啡张女儿今年岁今天钢琴课孩子啊晚上英语中国陆雨平可爱男帅餐厅去找会弹'}
legacy=set('力言木羊井土林');runtime_chars=set(''.join(ru.values()))
extras={'作业':([1,3],'ppt'),'厕所':([1],'ppt'),'可以':([1],'ppt'),'去':([1],'ppt'),'早饭':([2],'ppt'),'女朋友':([2],'ppt'),'甜品':([2],'ppt'),'学生':([2],'ppt'),'老人':([2],'ppt'),'男朋友':([2],'ppt'),'语言':([2],'ppt'),'家人':([3],'ppt'),'小狗':([3],'ppt'),'小猫':([3],'ppt'),'可爱':([3],'ppt'),'大学老师':([3],'example_only'),'现在':([3],'example_only'),'工人':([3],'example_only'),'工作日':([3],'example_only'),'卡片':([3],'example_only')}
rp={1:['你好！','我叫马大为。','请问，你叫什么名字？','我姓宋，叫宋华。','认识你很高兴。','认识你我也很高兴。','林娜在吗？','请进。','请坐。','谢谢。','你最近怎么样？','我很好。你呢？','我很忙。','你忙吗？','我不太忙。','大为好吗？','他也很好。','您好！','你们好！'],2:['陈老师，早上好！','这是我朋友，他刚到北京。','请问，您贵姓？','你是哪国人？','我是美国人。','我在北京学习汉语。','我会说汉语和西班牙语。','我爸爸妈妈都是上海人。','我喜欢吃米饭和面条。','那是什么？','这是包子，那是饺子。','包子和饺子我都要。','你喝茶还是咖啡？'],3:['你家有几口人？','我家有四口人。','这是我家的照片。','你爸爸做什么工作？','我爸爸是医生。','他不是我弟弟，是我哥哥。','我家一共有六个人。','我有两个姐姐。','你家还有谁？','我没有妹妹。','贝贝是我们家的狗。','这张照片真漂亮。','你女儿今年几岁？','她今天晚上有钢琴课。']}
coverage=[]
for q in voc.values():
 zh=q['hanzi'];vl=[l for l,words in rv.items() if zh in words];chars=[c for c in zh if cjk(c)];missing=stable_unique(c for c in chars if c not in runtime_chars)
 if vl:game='registered_from_runtime_vocabulary'
 elif zh in extras:game='context_only_not_playable' if extras[zh][1]=='example_only' else 'registered_extra_bank'
 elif any(clean(zh)==clean(t) for items in rp.values() for t in items):game='registered_runtime_sentence'
 elif len(chars)==1 and zh in runtime_chars|legacy:game='registered_character_bank'
 else:game='not_registered_in_inspected_bank'
 row={'vocab_id':q['id'],'hanzi':zh,'vocabulary_lessons':vl,'hanzi_canonical_coverage':'all' if chars and not missing else 'partial' if any(c in runtime_chars for c in chars) else 'none','missing_canonical_glyphs':missing,'legacy_only_glyphs':[c for c in chars if c in legacy],'game_bank_status':game,'game_lessons':vl or extras.get(zh,([],None))[0] or ([l for l,items in rp.items() if any(clean(zh)==clean(t) for t in items)] if game=='registered_runtime_sentence' else [int(min(u for u,seq in ru.items() if zh in seq)[0])] if len(chars)==1 and zh in runtime_chars else [1] if zh in legacy else []),'production_verified':False,'audio_verified':False,'snapshot_commit':SHA,'code_refs':[BASE+'seed/vocabulary.ts',BASE+'seed/curriculum.ts',BASE+'data/lesson1-hanzi.json',BASE+'data/reto-mixto.ts']}
 coverage.append(row);q['runtime']=row
for q in phrases.values():q['runtime_sentence_lessons']=[l for l,items in rp.items() if any(clean(x)==q['normalized_text'] for x in items)]
for ch in char.values():ch['runtime_units']=[u for u,chs in ru.items() if ch['hanzi'] in chs];ch['runtime_legacy_only']=ch['hanzi'] in legacy
for d in D:
 d['phrase_ids']=stable_unique(x['phrase_id'] for x in pe if x.get('dialogue_id')==d['id'])

# Readable master matrix, not a falsely binary all-sources check mark.
matrix=[]
for q in voc.values():
 refs={kind:[] for kind in ['textbook','workbook','class_presentation','worksheet']}
 for r in q['source_refs']:
  sid=r.split(':p')[0];kind=source_by[sid]['kind']
  if kind in refs:refs[kind].append(r)
 row={'id':q['id'],'hanzi':q['hanzi'],'pinyin':q['pinyin'],'spanish':q['spanish'],'kind':q['kind'],'lessons':q['lessons'],'roles':q['roles'],'theory':refs['textbook'],'practice':refs['workbook'],'ppt':refs['class_presentation'],'worksheet_sequence':q['worksheet_sequence_refs'],'worksheet_glyph_coverage':q['worksheet_glyph_coverage'],'phrase_count':q['phrase_count'],'phrase_ids':q['phrase_ids'],'primary_phrase_id':q['primary_phrase_id'],'primary_phrase':q['primary_phrase'],'ming_vocabulary':q['runtime']['vocabulary_lessons'],'ming_hanzi':q['runtime']['hanzi_canonical_coverage'],'ming_game_bank':q['runtime']['game_bank_status'],'missing_ming_glyphs':q['runtime']['missing_canonical_glyphs'],'pinyin_status':q['pinyin_status'],'spanish_status':q['spanish_status']}
 matrix.append(row)
# Complete page inventory, with truthful granularity. No blanket audit_complete flag.
page_rows=[]
for s in S:
 for pg in range(1,s['pages']+1):
  vv=[x['id'] for x in ve if x['source_id']==s['id'] and x['page']==pg]
  pp=[x['id'] for x in pe if x['source_id']==s['id'] and x['page']==pg]
  hh=[x['id'] for x in he if x['source_id']==s['id'] and x['page']==pg]
  ee=[x['id'] for x in E if x['source_id']==s['id'] and x['page']==pg]
  gg=[x['id'] for x in ge if x['source_id']==s['id'] and x['page']==pg]
  status='structured_extract' if vv or pp or hh or gg else 'activity_index' if ee else 'native_text_available' if s['kind']=='class_presentation' else 'inventory_only'
  if s['id']=='SRC-WB-01-02' and pg==18:status='blank_excluded'
  page_rows.append({'id':ref(s['id'],pg),'source_id':s['id'],'pdf_page':pg,'printed_page':(None if s['id']=='SRC-BOOK-01-02' and pg<44 else pg+s['printed_page_offset'] if s['printed_page_offset'] is not None else None),'status':status,'vocabulary_evidence_ids':vv,'phrase_evidence_ids':pp,'hanzi_evidence_ids':hh,'grammar_evidence_ids':gg,'exercise_ids':ee,'complete_literal_page_transcription':False})

# Native extraction cache is source data, not a dependency on original PDFs.
transcripts=PACK['native_transcripts']

stats={'source_count':len(S),'pdf_pages':sum(x['pages'] for x in S),'vocabulary_entries':len(voc),'listed_vocabulary_entries':sum(x['listed_as_vocabulary'] for x in voc.values()),'context_only_entries':sum(not x['listed_as_vocabulary'] for x in voc.values()),'vocabulary_evidence':len(ve),'phrases_unique':len(phrases),'phrase_source_occurrences':len(pe),'word_phrase_links':len(wordlinks),'word_phrase_occurrence_spans':len(occ_links),'hanzi_entities_total':len(char),'hanzi_with_writing_source_evidence':writing_char_count,'hanzi_evidence_rows':len(he),'worksheet_rows_or_glyph_occurrences':sum(source_by[x['source_id']]['kind']=='worksheet' for x in he),'worksheet_sequences':len(WS),'new_worksheet_rows':sum(x['source_id']=='SRC-HANZI-03-2' for x in he),'new_worksheet_unique_glyphs':len(set(x['hanzi'] for x in he if x['source_id']=='SRC-HANZI-03-2')),'grammar_concepts':len(gram),'grammar_source_records':len(ge),'grammar_phrase_links':len(gp),'dialogue_source_witnesses':len(D),'exercise_sets':len(E),'workbook_exercise_sets':sum(source_by[x['source_id']]['kind']=='workbook' for x in E),'exercise_sets_index_only':sum(x['answer_status']=='index_only' for x in E),'runtime_vocabulary_unique':len(set(sum(rv.values(),[]))),'runtime_canonical_hanzi':len(runtime_chars),'runtime_sentence_count':sum(map(len,rp.values())),'source_notes':len(N)}
manifest={'version':'2.0.0','scope':'Curricular L1-L3; foundations kept separately','snapshot_date':'2026-09-23','runtime_snapshot_commit':SHA,'stats':stats,'authority':'User-supplied documents; source-specific variants retained. Runtime is a separate read-only code snapshot.','closure':{'all_21_sources_registered':True,'all_9_worksheet_files_row_inventory':True,'new_ppt_32_native_and_structured_extract':True,'main_textbook_vocabulary_and_supplementary_lists':True,'main_dialogues_source_witnesses':True,'all_inventoried_activity_records_populated':all(bool(e['items']) for e in E),'all_book_pages_literally_transcribed':False,'original_listening_audio_supplied':False,'production_deployment_verified':False},'reading_order':['index.json','query.py --help','vocabulary','matrix','phrases','word_phrase_links','hanzi','grammar','exercises','notes','page_inventory'],'schema_notes':{'null':'Not supplied or not confirmed; never invent to fill null.','source_based_selection':'Display choice among attested variants, not a silent source correction.','phrase_id':'Stable SHA-256 prefix of punctuation/whitespace-normalized source text; source occurrences keep original witness and tokens.','page_numbering':'PDF 1-based. Printed page is optional and distinct.','word_phrase_links':'Editorial lexical tokens; character containment stored separately.','exercise_keys':'No original audio answers manufactured. Visual inventory, printed passage and open-response are distinct task types; populated records do not certify full-page literal transcription.','native_transcripts':'Read as extraction cache; hidden text and layout can remain. Not validated dictionary data.','runtime':'Registration or eligibility only; not actual play success, deployed URL or available audio.'}}
TABLES={'sources':S,'vocabulary':list(voc.values()),'vocabulary_evidence':ve,'phrases':list(phrases.values()),'phrase_evidence':pe,'word_phrase_links':wordlinks,'word_phrase_spans':occ_links,'word_hanzi_links':glyphlinks,'hanzi':list(char.values()),'hanzi_evidence':he,'worksheet_sequences':WS,'dialogues':D,'grammar':list(gram.values()),'grammar_evidence':ge,'grammar_phrase_links':gp,'exercises':E,'radicals':RAD,'notes':N,'foundations':F,'runtime_coverage':coverage,'matrix':matrix,'page_inventory':page_rows,'native_transcripts':transcripts}
for name,rows in TABLES.items():save(name,rows)
save('index',manifest)
for name in ['matrix','vocabulary','phrases','word_phrase_links','word_phrase_spans','hanzi','hanzi_evidence','grammar','grammar_evidence','exercises','sources','notes','runtime_coverage','page_inventory']:
 rows=TABLES[name];cols=stable_unique(k for r in rows for k in r);tsv(name,cols,rows)
# Referential and source-span integrity checks, independent of linguistic judgement.
errors=[]
def check(condition,msg):
 if not condition:errors.append(msg)
for n,rows in TABLES.items():
 ids=[r['id'] for r in rows if 'id' in r];check(len(ids)==len(set(ids)),f'duplicate IDs {n}')
for n in ['vocabulary_evidence','phrase_evidence','hanzi_evidence','grammar_evidence','exercises']:
 for row in TABLES[n]:check(row['source_id'] in source_by and 1<=row['page']<=source_by[row['source_id']]['pages'],f'bad source page {n} {row.get("id")}')
for row in occ_links:
 pp=by_pe[row['phrase_evidence_id']];check(pp['hanzi'][row['start']:row['end']]==row['surface'],f'span mismatch {row}');check(row['vocab_id'] in voc and row['phrase_id'] in phrases,'dangling lexical FK')
for row in wordlinks:check(row['vocab_id'] in voc and row['phrase_id'] in phrases,'dangling word-phrase FK')
for row in glyphlinks:check(row['vocab_id'] in voc and row['hanzi_id'] in char,'dangling word-Hanzi FK')
for row in gp:check(row['grammar_id'] in gram and row['phrase_id'] in phrases,'dangling grammar FK')
check(stats['new_worksheet_rows']==36,'new worksheet must have exactly 36 source rows')
check(len(rv[1])==45 and len(rv[2])==63 and len(rv[3])==45,'runtime vocab snapshot counts')
check(stats['runtime_vocabulary_unique']==151,'runtime unique vocabulary')
check(len(runtime_chars)==192,'runtime canonical characters')
for row in wordlinks:
 if row['vocab_id']=='v-工作':check('工作' in phrases[row['phrase_id']]['hanzi'],'false 工作 link')
 if clean(phrases[row['phrase_id']]['hanzi'])=='我家一共有六口人':check(row['vocab_id']!='v-个','口/个 conflated')
for n,rows in TABLES.items():
 if n not in ['native_transcripts','notes']:
  check('演示文稿是一种实用的工' not in json.dumps(rows,ensure_ascii=False),'template promoted to normalized content')
validation={'passed':not errors,'errors':errors,'checks':['unique table IDs','source/page bounds','lexical span equality','lexical, Hanzi and grammar foreign keys','36 new worksheet rows','151 runtime vocabulary entries','192 runtime canonical Hanzi','工作 lexical regression','口 vs 个 regression','template exclusion'],'limits':'Structural validation is not an external linguistic review or a test of the web app.'}
save('validation',validation)
print(json.dumps(stats,ensure_ascii=False,indent=2));print(json.dumps(validation,ensure_ascii=False))
if errors:raise SystemExit(1)
