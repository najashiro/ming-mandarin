"""Integrated release checks; legacy tests remain pinned to their original v2.1 batches."""
import copy, csv, hashlib, importlib.util, json, shutil, subprocess, sys, tempfile, unittest
from pathlib import Path
from unittest.mock import patch
import compile_v22, query, query_v21

ROOT=Path(__file__).resolve().parent
L4=ROOT/'lesson4'

class IntegratedV22Tests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        query.ensure_cache(True)
        cls.pages=query.read_table('document_pages')
        cls.blocks=query.read_table('document_blocks')
        cls.vocab={r['id']:r for r in query.read_table('vocabulary')}
        cls.phrases={r['id']:r for r in query.read_table('phrases')}
        cls.evidence=query.read_table('phrase_evidence')
        spec=importlib.util.spec_from_file_location('export_v22_test',ROOT.parents[1]/'scripts/export-corpus-v22.py')
        cls.exporter=importlib.util.module_from_spec(spec);spec.loader.exec_module(cls.exporter)
        cls.public=cls.exporter.build()

    def test_real_global_version(self):
        self.assertEqual(query.read_table('index')['version'],'2.2.0')
        v=query.read_table('validation');self.assertTrue(v['passed'],v['errors'])
        self.assertTrue(v['global_query_integrated']);self.assertTrue(v['ready_for_chapter4'])
    def test_all_121_pages_and_295_substantive_blocks(self):
        self.assertEqual(len(self.pages),121);self.assertEqual(len(self.blocks),295)
        self.assertTrue(all(p['blocks'] for p in self.pages))
        self.assertEqual(len({(p['source_id'],p['page']) for p in self.pages}),121)
    def test_page_counts_by_source(self):
        expected={'SRC-BOOK-04':25,'SRC-WB-04':11,'SRC-PPT-04-1':43,'SRC-PPT-04-2':34,'SRC-HANZI-04-1':4,'SRC-HANZI-04-2':4}
        for sid,n in expected.items():self.assertEqual(sorted(p['page'] for p in self.pages if p['source_id']==sid),list(range(1,n+1)))
    def test_corrected_printed_pages(self):
        self.assertEqual([p['printed_page'] for p in self.pages if p['source_id']=='SRC-BOOK-04'],list(range(113,138)))
    def test_all_three_textbook_lists(self):
        rows=[r for r in query.read_table('textbook_table_rows') if r['lesson']==4]
        self.assertEqual(len(rows),63);self.assertEqual(sum(r['subentry_index']==0 for r in rows),56)
        self.assertEqual(len([t for t in query.read_table('textbook_tables') if t.get('lesson')==4]),3)
    def test_audited_vocabulary_witnesses_unchanged(self):
        with (L4/'textbook-vocabulary.tsv').open() as f:old=list(csv.DictReader(f,delimiter='\t'))
        new=[r for r in query.read_table('vocabulary_evidence') if r.get('lesson')==4 and r['source_id']=='SRC-BOOK-04' and r.get('list_id')]
        self.assertEqual(len(old),len(new))
        for row in old:
            n=next(n for n in new if n['list_id']==row['list_id'] and n['number']==int(row['number']) and n['subentry']==int(row['subentry']))
            for k in ('hanzi','pinyin_source','spanish_source','pos_source','collocations_source','parent_hanzi'):self.assertEqual(n[k],row[k])
    def test_all_54_dialogue_turns_match_audited_tsv(self):
        with (L4/'dialogue-turns.tsv').open() as f:old=list(csv.DictReader(f,delimiter='\t'))
        new={(d['id'],str(t['turn'])):t for d in query.read_table('dialogues') if d['lesson']==4 for t in d['turns']}
        self.assertEqual(len(new),54)
        for row in old:
            for key in ('hanzi','pinyin_source','speaker_source'):
                self.assertEqual(row[key],new[(row['dialogue_id'],row['turn'])][key])
    def test_all_66_worksheet_fields_match_audited_tsv(self):
        with (L4/'worksheet-rows.tsv').open() as f:old=list(csv.DictReader(f,delimiter='\t'))
        new={(r['source_id'],str(r['page']),str(r['row'])):r for r in query.read_table('writing_target_occurrences') if r['kind']=='worksheet'}
        for row in old:
            for key in ('hanzi','pinyin_source','radical_source','strokes_source','structure_source'):
                self.assertEqual(row[key],str(new[(row['source_id'],row['pdf_page'],row['row'])][key]))
    def test_sixty_six_worksheet_rows_and_book_workbook_writing(self):
        rows=query.read_table('writing_target_occurrences')
        self.assertEqual(len(rows),94);self.assertEqual(sum(r['kind']=='worksheet' for r in rows),66)
        self.assertEqual(len({r['hanzi'] for r in rows if r['kind']=='worksheet'}),54)
    def test_worksheet_readings_are_not_changed(self):
        rows=query.read_table('writing_target_occurrences')
        self.assertTrue(any(r['hanzi']=='差' and r.get('pinyin_source')=='chā' for r in rows))
        self.assertTrue(any(r['hanzi']=='只' and r.get('pinyin_source')=='zhī' for r in rows))
    def test_contextual_readings_follow_book(self):
        for word,pinyin in [('差','chà'),('只','zhǐ'),('时间','shíjiān'),('意思','yìsi')]:
            s=self.vocab['v-'+word]['lesson4_selection'];self.assertEqual(s['pinyin'],pinyin);self.assertEqual(s['source_id'],'SRC-BOOK-04')
    def test_previous_classifier_reading_preserved(self):
        old=next(r for r in query_v21.read_table('vocabulary') if r['id']=='v-只')
        self.assertEqual(self.vocab['v-只']['pinyin'],old['pinyin'])
        self.assertEqual(self.vocab['v-只']['spanish'],old['spanish'])
    def test_all_legacy_identifiers_and_documentary_values_survive(self):
        for name in ('vocabulary','phrases','hanzi','dialogues','exercises','grammar'):
            new={r['id']:r for r in query.read_table(name)}
            for row in query_v21.read_table(name):
                self.assertIn(row['id'],new)
                for key in ('hanzi','pinyin','spanish','pinyin_ming','traduccion_ming','turns','items'):
                    if key in row:self.assertEqual(row[key],new[row['id']].get(key))
    def test_canonical_dialogues_are_27_book_turns(self):
        ds=[d for d in query.read_table('dialogues') if d['lesson']==4 and d['canonical']]
        self.assertEqual(len(ds),2);self.assertEqual(sum(len(d['turns']) for d in ds),27)
        self.assertEqual(ds[0]['turns'][0]['speaker_source'],'宋华')
        d=next(d for d in ds if d['id'].endswith('T2'))
        self.assertIn('七点半我回学校',d['turns'][2]['hanzi']);self.assertEqual(d['turns'][13]['hanzi'],'我学英语。')
    def test_secondary_dialogues_preserved_but_not_exported(self):
        ds=[d for d in query.read_table('dialogues') if d['lesson']==4]
        self.assertEqual(sum(len(d['turns']) for d in ds),54)
        self.assertTrue(all('-BOOK-' in d['id'] for d in self.public['dialogues']))
    def test_every_exercise_item_is_present(self):
        self.assertEqual(len([e for e in query.read_table('exercises') if e['lesson']==4]),62)
        self.assertEqual(len(query.read_table('exercise_items')),251)
    def test_audio_dependent_answers_are_not_manufactured(self):
        ex=[b for b in self.blocks if b['kind']=='exercise' and 'audio' in b.get('answer_status','')]
        self.assertGreater(len(ex),0)
        for b in ex:self.assertFalse(b['source_answer_key_supplied']);self.assertNotIn('answers',b)
    def test_printed_ppt_answers_stay_separate_from_open_prompts(self):
        b=next(b for b in self.blocks if b['id']=='L4-PPT-04-1-34-01')
        self.assertEqual(b['printed_insertions_source'][0],['上午','特别'])
        self.assertTrue(b['source_answer_key_supplied']);self.assertFalse(b['automatic_grading_approved'])
    def test_readings_models_tables_and_visuals_integrated(self):
        for name,n in [('readings',6),('writing_models',3),('source_tables',25),('visual_evidence',38),('hanzi_structures',2)]:self.assertEqual(len(query.read_table(name)),n)
    def test_culture_is_source_claim_not_external_verification(self):
        b=next(b for b in self.blocks if b['id']=='L4-PPT-04-2-20-01')
        self.assertEqual(b['text_source'],'');self.assertIn('not_current',b['factual_status'])
    def test_no_native_template_claims_or_source_locators_in_public_cards(self):
        s=json.dumps(self.public,ensure_ascii=False)
        for term in ('10M+','100%','source_id','pdf_page','.pdf','native_text_source'):self.assertNotIn(term,s)
    def test_primary_clock_rule_retained(self):
        b=next(b for b in self.blocks if b['id']=='L4-BOOK-04-09-06')
        self.assertIn('零',b['rows_source'][1][1]);self.assertEqual(b['rows_source'][2][1],'两点十分')
        self.assertIn('mayor a 10',b['rows_source'][3][2])
    def test_supplementary_vocabulary_current_location(self):
        rows=[r for r in query.read_table('textbook_table_rows') if r.get('table_id')=='TB-L4-SUP']
        self.assertEqual(len(rows),17);self.assertEqual({(r['page'],r['printed_page']) for r in rows},{(16,128)})
    def test_new_radicals_and_assessment_without_key(self):
        catalog={r['radical']:r for r in query.read_table('radical_catalog')}
        self.assertEqual(catalog['刂']['name_source'],'立刀旁');self.assertEqual(catalog['日']['name_source'],'日字旁')
        items=[r for r in query.read_table('radical_assessment_items') if r.get('lesson')==4]
        self.assertEqual(len(items),10)
        self.assertTrue(all(r['radical_candidate'] is None and not r['source_answer_key_supplied'] for r in items))
    def test_global_radical_and_word_hanzi_matrices_updated(self):
        self.assertEqual(len(query.read_table('radical_catalog')),len(query.read_table('radical_matrix')))
        self.assertTrue(any(l['vocab_id']=='v-语法' for l in query.read_table('word_hanzi_links')))
        self.assertGreater(len(query.read_table('grammar_phrase_links')),60)
    def test_no_cat_lexeme_inside_film_title(self):
        spans=query.read_table('word_phrase_spans');e={r['id']:r for r in self.evidence}
        film=[r for r in spans if r.get('lesson')==4 and r['vocab_id']=='v-功夫熊猫']
        self.assertGreater(len(film),0)
        for r in film:
            self.assertFalse(any(x.get('phrase_evidence_id')==r['phrase_evidence_id'] and x['vocab_id']=='v-猫' and r['start']<=x['start']<r['end'] for x in spans))
    def test_literal_span_integrity(self):
        e={r['id']:r for r in self.evidence}
        for r in query.read_table('word_phrase_spans'):
            if r.get('lesson')==4:self.assertEqual(e[r['phrase_evidence_id']]['hanzi'][r['start']:r['end']],r['surface'])
    def test_counterexamples_not_published_as_positive_phrases(self):
        for r in self.public['phrases']:self.assertNotIn('counterexample',r['kinds'])
    def test_new_visual_classifications_explicit_and_no_assets_claimed(self):
        old={r['id'] for r in query_v21.read_table('vocabulary')}
        for r in self.public['vocabulary']:
            if r['id'] not in old:self.assertIsNotNone(r['visual_ming']);self.assertFalse(r['visual_ming']['image_quiz_eligible'])
        self.assertFalse(self.public['availability']['generated_audio']);self.assertFalse(self.public['availability']['generated_images'])
    def test_source_pack_corruption_is_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            p=Path(tmp);shutil.copytree(L4/'documents',p/'documents')
            manifest=json.loads((p/'documents/manifest.json').read_text());part=p/manifest['parts'][0]['path']
            part.write_text(part.read_text()+'bad')
            with patch.object(compile_v22,'L4',p):
                with self.assertRaisesRegex(ValueError,'hash mismatch'):compile_v22.source_documents()
    def test_source_pack_path_escape_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            p=Path(tmp);shutil.copytree(L4/'documents',p/'documents')
            m=json.loads((p/'documents/manifest.json').read_text());m['parts'][0]['path']='../escape.b64'
            (p/'documents/manifest.json').write_text(json.dumps(m))
            with patch.object(compile_v22,'L4',p):
                with self.assertRaisesRegex(ValueError,'escapes'):compile_v22.source_documents()
    def test_unreviewed_lexical_content_rejected(self):
        cfg=json.loads((L4/'lexical-links.json').read_text())
        with self.assertRaisesRegex(ValueError,'Unreviewed lexical gap'):
            compile_v22.lexical_annotations({},[dict(id='X',hanzi='未知',source_id='SRC-BOOK-04',page=1,lesson=4,kind='example')],cfg)
    def test_exact_contextual_cli_and_optional_alias(self):
        for word,reading in [('只','zhǐ'),('点','diǎn (zhōng)')]:
            r=json.loads(subprocess.check_output([sys.executable,str(ROOT/'query.py'),'--word',word,'--lesson','4','--limit','1'],text=True))
            self.assertTrue(r['found']);self.assertEqual(r['word']['pinyin'],reading)
    def test_source_query_includes_full_document_blocks(self):
        r=json.loads(subprocess.check_output([sys.executable,str(ROOT/'query.py'),'--source','SRC-WB-04','--page','9','--limit','100'],text=True))
        self.assertGreater(r['tables']['document_blocks']['total'],0)
        self.assertEqual(r['tables']['readings']['total'],2)

if __name__=='__main__':unittest.main()
