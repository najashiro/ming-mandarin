"""References apply to identity-context scenes too, not to every fictitious place."""
import copy
import unittest
from image_prompts import build, load_inputs, validate_inputs


class ReferenceClarityTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.inputs = load_inputs()
        cls.payload = build(*cls.inputs)
        cls.entries = {row['vocab_id']: row for row in cls.payload['entries']}
        cls.units = {row['production_unit_id']: row for row in cls.payload['production_units']}

    def test_flags_in_nationality_context_need_reference(self):
        for vid in ('v-美国人', 'v-俄罗斯人'):
            unit = self.units[self.entries[vid]['production_unit_id']]
            self.assertTrue(unit['requires_authentic_flag_reference'])
            self.assertFalse(self.entries[vid]['image_quiz_enabled'])

    def test_city_context_needs_real_landmark(self):
        for vid in ('v-北京', 'v-上海', 'v-西安', 'v-广州', 'v-北京人'):
            unit = self.units[self.entries[vid]['production_unit_id']]
            self.assertTrue(unit['requires_authentic_landmark_reference'])

    def test_fictitious_restaurant_is_not_an_authentic_landmark_claim(self):
        row = self.entries['v-餐厅']
        self.assertEqual(row['required_reference_types'], [])

    def test_country_cannot_omit_flag_review(self):
        public, recipes, policy, internal = copy.deepcopy(self.inputs)
        policy['reference_requirements']['v-中国'] = ['landmark']
        with self.assertRaisesRegex(ValueError, 'country needs both'):
            validate_inputs(public, recipes, policy, internal)

    def test_all_references_remain_unverified_not_falsely_approved(self):
        for unit in self.units.values():
            if unit['required_reference_types']:
                self.assertEqual(unit['reference_status'], 'not_supplied_not_verified')
                self.assertFalse(unit['image_validated'])

    def test_last_two_inventory_items_have_specific_prompts(self):
        self.assertEqual(self.entries['v-手']['profile'], 'object')
        self.assertIn('cinco dedos', self.entries['v-手']['prompt_es'])
        self.assertEqual(self.entries['v-电影']['profile'], 'people')
        self.assertFalse(self.entries['v-电影']['image_quiz_candidate'])


if __name__ == '__main__':
    unittest.main()
