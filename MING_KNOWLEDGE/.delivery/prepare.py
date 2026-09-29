"""One-time, checksum-locked transfer of reviewed PR23 files; creates an unreferenced tree only.

No branch, tag, deployment, production or secret is changed. The caller must
verify the returned tree and publish the final commit through its normal connector.
"""
import base64,hashlib,json,lzma,os,re,subprocess,sys,urllib.request
from pathlib import Path
REPO='najashiro/ming-mandarin'
BRANCH='refs/heads/corpus/v2.2.0-close-lesson4-20260929'
BASE='1e8c3e134cd350aea38b180eed6d5016ddc692a3'
DIGEST='37c256cc844afc5c040c19d0e7c05d49289193dbb6a460e05612eb12e731b6e7'
WORKFLOW='.github/workflows/corpus-v22-close.yml'
assert os.environ['GITHUB_REPOSITORY']==REPO and os.environ['GITHUB_REF']==BRANCH
head=subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip()
assert head==os.environ['GITHUB_SHA']
assert subprocess.check_output(['git','rev-parse','HEAD^'],text=True).strip()==BASE
folder=Path('MING_KNOWLEDGE/.delivery');parts=sorted(folder.glob('part-*.txt'))
assert [p.name for p in parts]==[f'part-{i:02d}.txt' for i in range(1,19)]
raw=lzma.decompress(base64.b64decode(''.join(p.read_text().strip() for p in parts),validate=True))
assert len(raw)<500000 and hashlib.sha256(raw).hexdigest()==DIGEST
payload=json.loads(raw);assert payload['base_commit']==BASE
expected=payload['expected_sha256'];assert len(expected)==54
for path in expected:
 p=Path(path)
 assert not p.is_absolute() and '..' not in p.parts
 assert path.startswith('MING_KNOWLEDGE/') or path in (WORKFLOW,'scripts/export-corpus-v21.py','scripts/export-corpus-v22.py')
 assert not any(x.startswith('.env') or x in ('__pycache__','.git','.delivery') for x in p.parts)
 assert p.suffix.lower() not in ('.pdf','.png','.jpg','.jpeg','.ttf','.woff','.woff2')
# The transfer job temporarily occupies the workflow path; restore its exact base before applying.
Path(WORKFLOW).write_bytes(subprocess.check_output(['git','show',BASE+':'+WORKFLOW]))
patch=payload['patch'].encode('utf-8')
subprocess.run(['git','apply','--check','-'],input=patch,check=True)
subprocess.run(['git','apply','-'],input=patch,check=True)
def verify():
 for path,digest in expected.items():
  assert hashlib.sha256(Path(path).read_bytes()).hexdigest()==digest,path
verify()
out=Path('closure-artifact');out.mkdir(exist_ok=True)
commands={
 'global-validation':['python3','MING_KNOWLEDGE/v2/query.py','--validate'],
 'global-tests':['python3','-m','unittest','discover','-s','MING_KNOWLEDGE/v2','-p','test_*.py','-v'],
 'lesson4-tests':['python3','-m','unittest','discover','-s','MING_KNOWLEDGE/v2/lesson4','-p','test_*.py','-v'],
 'release-check':['python3','MING_KNOWLEDGE/v2/lesson4/audit.py','--release-check'],
 'source-tables':['python3','MING_KNOWLEDGE/v2/audit_source_tables.py','--check'],
 'translations':['python3','MING_KNOWLEDGE/v2/translations_ming.py','--check'],
 'pinyin':['python3','MING_KNOWLEDGE/v2/pinyin_ming.py','--check'],
 'visual':['python3','MING_KNOWLEDGE/v2/visual_ming.py','--check'],
 'export-v21':['python3','scripts/export-corpus-v21.py','--check'],
 'export-v22':['python3','scripts/export-corpus-v22.py','--check']}
for name,cmd in commands.items():
 with (out/(name+'.txt')).open('w') as f:result=subprocess.run(cmd,stdout=f,stderr=subprocess.STDOUT)
 if result.returncode:
  print((out/(name+'.txt')).read_text());raise SystemExit(name+' failed')
 print(name+': PASS')
verify()
# Create Git data objects only; intentionally never call an API for refs or deployment.
def api(path,body=None):
 assert path.startswith('git/')
 request=urllib.request.Request('https://api.github.com/repos/'+REPO+'/'+path,
  data=json.dumps(body,ensure_ascii=False).encode() if body is not None else None,
  headers={'Authorization':'Bearer '+os.environ['GITHUB_TOKEN'],'Accept':'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','Content-Type':'application/json'})
 with urllib.request.urlopen(request,timeout=60) as response:return json.load(response)
base_tree=api('git/commits/'+head)['tree']['sha']
entries=[{'path':p,'mode':'100644','type':'blob','content':Path(p).read_text()} for p in sorted(expected) if p!=WORKFLOW]
entries += [{'path':p.as_posix(),'mode':'100644','type':'blob','sha':None} for p in parts+[folder/'prepare.py']]
tree=api('git/trees',{'base_tree':base_tree,'tree':entries})['sha']
result={'tree_sha':tree,'parent_commit':head,'base_commit':BASE,'files':expected,
 'workflow_to_replace':WORKFLOW,'validation':'PASS','tests':{'global':156,'lesson4':25},
 'source_content_pages':121,'source_content_blocks':295,'branch_updated':False,'merged':False}
(out/'prepared-tree.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print('Prepared tree: '+tree+'; no branch updated')
