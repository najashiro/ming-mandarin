"""Offline tests for authored image prompts, coverage and preservation of the corpus."""
from __future__ import annotations
import copy
import hashlib
import json
from pathlib import Path
import tempfile
import unittest
from image_prompts import build, load_inputs, validate_inputs, read_recipes, markdown, digest, PUBLIC


class ImagePromptTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.inputs = load_inputs()
        cls.payload = build(*cls.inputs)
        cls.by_id = {r['vocab_id']: r for r in cls.payload['entries']}
        cls.units = {r['production_unit_id']: r for r in cls.payload['production_units']}

    def test_exact_public_coverage(self):
        public, recipes, _, _ = self.inputs
        self.assertEqual({r['id'] for r in public['vocabulary']}, set(self.by_id))
        self.assertEqual(len(self.by_id), len(self.payload['entries']))
        self.assertEqual(len(recipes), sum(r['prompt_es'] is not None for r in self.payload['entries']))

    def test_all_previous_word_fields_remain_identical(self):
        for source in self.inputs[0]['vocabulary']:
            entry = self.by_id[source['id']]
            for field in ('hanzi', 'pinyin', 'spanish', 'visual_ming'):
                self.assertEqual(source[field], entry[field])
            self.assertEqual(source['examplePhraseIds'], entry['documented_example_ids'])

    def test_builder_does_not_mutate_inputs(self):
        values = copy.deepcopy(self.inputs)
        before = copy.deepcopy(values)
        build(*values)
        self.assertEqual(values, before)

    def test_builder_does_not_write_public_file(self):
        before = PUBLIC.read_bytes()
        build(*self.inputs)
        self.assertEqual(PUBLIC.read_bytes(), before)

    def test_missing_recipe_is_an_error(self):
        public, recipes, policy, internal = copy.deepcopy(self.inputs)
        recipes.pop('v-猫')
        with self.assertRaisesRegex(ValueError, 'missing=.*v-猫'):
            validate_inputs(public, recipes, policy, internal)

    def test_none_cannot_receive_an_invented_image(self):
        public, recipes, policy, internal = copy.deepcopy(self.inputs)
        recipes['v-吗'] = dict(recipes['v-猫'], hanzi='吗', vocab_id='v-吗')
        with self.assertRaisesRegex(ValueError, 'extra=.*v-吗'):
            validate_inputs(public, recipes, policy, internal)

    def test_none_has_null_prompt_and_reason(self):
        for entry in self.payload['entries']:
            if entry['visual_ming']['visual_mode'] == 'none':
                self.assertIsNone(entry['prompt_es'])
                self.assertIsNone(entry['production_unit_id'])
                self.assertTrue(entry['no_image_reason'])
                self.assertFalse(entry['image_quiz_candidate'])
        for key in ('v-吗', 'v-的', 'v-不', 'v-马大为', 'v-梅西'):
            self.assertIsNone(self.by_id[key]['prompt_es'])

    def test_classification_cannot_be_overridden(self):
        public, recipes, policy, internal = copy.deepcopy(self.inputs)
        row = next(w for w in public['vocabulary'] if w['id'] == 'v-和')
        row['visual_ming']['image_quiz_eligible'] = True
        with self.assertRaisesRegex(ValueError, 'classification mismatch'):
            validate_inputs(public, recipes, policy, internal)

    def test_no_generation_authorized(self):
        self.assertFalse(self.payload['generation_authorized'])
        self.assertEqual(self.payload['summary']['images_generated'], 0)
        for unit in self.units.values():
            self.assertFalse(unit['generation_authorized'])
            self.assertFalse(unit['image_generated'])
            self.assertFalse(unit['image_validated'])
        public, recipes, policy, internal = copy.deepcopy(self.inputs)
        policy['rules']['generate_images_now'] = True
        with self.assertRaisesRegex(ValueError, 'not authorized'):
            validate_inputs(public, recipes, policy, internal)

    def test_transparency_and_separation_from_ui(self):
        for unit in self.units.values():
            self.assertEqual(unit['background'], 'transparent_alpha')
            prompt = unit['prompt_es']
            for needle in ('canal alfa', 'no pintes fondo blanco', 'Sin marco', 'sin texto'):
                if needle == 'sin texto':
                    self.assertIn('No escribir el nombre', prompt)
                else:
                    self.assertIn(needle, prompt)
            self.assertIn('cuadrícula', prompt)
        self.assertIn('realmente transparentes', ' '.join(self.payload['alpha_and_semantic_qa']))

    def test_cat_semantics(self):
        entry = self.by_id['v-猫']
        self.assertEqual(entry['profile'], 'animal')
        self.assertIn('adulto gris', entry['prompt_es'])
        self.assertIn('orejas', entry['semantic_cautions_es'])
        self.assertNotEqual(entry['production_unit_id'], self.by_id['v-小猫']['production_unit_id'])

    def test_food_and_drink_profiles(self):
        for key in ('v-米饭', 'v-饺子', 'v-包子'):
            self.assertEqual(self.by_id[key]['profile'], 'food')
        for key in ('v-咖啡', 'v-茶', 'v-橙汁'):
            self.assertEqual(self.by_id[key]['profile'], 'drink')
        self.assertIn('no marcas', self.by_id['v-热狗']['semantic_cautions_es'].lower())

    def test_pronouns_distinguish_speaker(self):
        self.assertIn('propio pecho', self.by_id['v-我']['prompt_es'])
        self.assertIn('único interlocutor', self.by_id['v-你']['prompt_es'])
        self.assertFalse(self.by_id['v-他']['image_quiz_candidate'])
        self.assertFalse(self.by_id['v-她']['image_quiz_candidate'])

    def test_professions_include_action_not_only_uniform(self):
        for key in ('v-医生', 'v-律师', 'v-工程师', 'v-经理', 'v-老师', 'v-服务员'):
            self.assertEqual(self.by_id[key]['profile'], 'profession')
            self.assertIn('La indumentaria acompaña la acción', self.by_id[key]['prompt_es'])
        self.assertIn('No mazo judicial', self.by_id['v-律师']['semantic_cautions_es'])

    def test_countries_have_landmark_and_flag(self):
        expected = {'美国', '中国', '西班牙', '法国', '德国', '加拿大', '英国', '澳大利亚', '俄罗斯', '日本', '韩国', '泰国', '印度', '埃及', '秘鲁', '墨西哥', '阿根廷'}
        actual = {e['hanzi'] for e in self.payload['entries'] if e['profile'] == 'country'}
        self.assertEqual(expected, actual)
        for term in expected:
            entry = self.by_id['v-' + term]
            unit = self.units[entry['production_unit_id']]
            self.assertIn('bandera', entry['prompt_es'])
            self.assertTrue(unit['requires_authentic_flag_reference'])
            self.assertTrue(unit['requires_authentic_landmark_reference'])
            self.assertFalse(entry['image_quiz_candidate'])
        self.assertIn('Gran Muralla', self.by_id['v-中国']['prompt_es'])
        self.assertIn('Machu Picchu', self.by_id['v-秘鲁']['prompt_es'])
        self.assertIn('Union Flag', self.by_id['v-英国']['prompt_es'])

    def test_languages_are_not_country_quizzes(self):
        for key in ('v-汉语', 'v-中文', 'v-英语', 'v-法语', 'v-西班牙语'):
            row = self.by_id[key]
            self.assertEqual(row['profile'], 'context')
            self.assertFalse(row['image_quiz_candidate'])
            self.assertNotIn('país representativo', row['prompt_es'])

    def test_same_referent_can_share_art_without_merging_ids(self):
        for a, b in (('v-面条', 'v-面条儿'), ('v-汉堡', 'v-汉堡包'), ('v-披萨', 'v-比萨饼'), ('v-外婆', 'v-姥姥')):
            self.assertNotEqual(a, b)
            self.assertEqual(self.by_id[a]['production_unit_id'], self.by_id[b]['production_unit_id'])
            self.assertEqual(self.by_id[a]['prompt_es'], self.by_id[b]['prompt_es'])

    def test_grammar_uses_controlled_composition(self):
        for row in self.payload['entries']:
            if row['visual_ming']['visual_mode'] == 'visual_grammar':
                self.assertEqual(row['profile'], 'structured')
                self.assertTrue(row['composition_instructions_es'])
                self.assertFalse(row['image_quiz_candidate'])
        self.assertIn('No boca', self.by_id['v-口']['semantic_cautions_es'])
        self.assertIn('3 copias', self.by_id['v-三']['composition_instructions_es'])
        self.assertEqual(self.by_id['v-三']['production_unit_id'], self.by_id['v-七']['production_unit_id'])

    def test_relative_dates_remain_relative(self):
        self.assertIn('-1', self.by_id['v-昨天']['composition_instructions_es'])
        self.assertIn('+1', self.by_id['v-明天']['composition_instructions_es'])
        self.assertIn('-2', self.by_id['v-前年']['composition_instructions_es'])
        self.assertIn('+2', self.by_id['v-后年']['composition_instructions_es'])

    def test_special_senses(self):
        self.assertIn('No caballos ni tigres', self.by_id['v-马马虎虎']['semantic_cautions_es'])
        self.assertIn('no muerte', self.by_id['v-死']['semantic_cautions_es'])
        self.assertIn('no generar un hombre', self.by_id['v-约翰']['semantic_cautions_es'])
        self.assertIn('no flecha hacia arriba', self.by_id['v-上']['semantic_cautions_es'])

    def test_summary_balances(self):
        s = self.payload['summary']
        self.assertEqual(s['vocabulary_entries'], s['entries_with_prompt'] + s['without_own_image'])
        self.assertEqual(s['vocabulary_entries'], sum(s['counts_by_visual_mode'].values()))
        self.assertEqual(s['entries_with_prompt'], sum(s['counts_by_profile'].values()))
        self.assertEqual(s['distinct_visual_recipes'], len(self.units))
        self.assertLess(s['distinct_visual_recipes'], s['entries_with_prompt'])

    def test_reproducible_catalog_and_markdown(self):
        self.assertEqual(self.payload, build(*self.inputs))
        text = markdown(self.payload)
        for row in self.payload['entries']:
            self.assertIn('`' + row['vocab_id'] + '`', text)
        self.assertEqual(text, markdown(build(*self.inputs)))

    def test_fingerprint_covers_entire_payload(self):
        row = copy.deepcopy(self.payload)
        actual = row.pop('fingerprint')
        self.assertEqual(actual, digest(row))


if __name__ == '__main__':
    unittest.main()
