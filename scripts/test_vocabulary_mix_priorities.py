"""Semantic safeguards for corpus statistics; run with Python unittest."""
import importlib.util
from pathlib import Path
import unittest

path = Path(__file__).with_name("build-vocabulary-mix-priorities.py")
spec = importlib.util.spec_from_file_location("mix_priorities", path)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class VocabularyMixStatisticsTests(unittest.TestCase):
    def test_compounds_do_not_count_as_their_character_substrings(self):
        lexicon = {"v-猫": {"id": "v-猫", "hanzi": "猫"}, "v-小猫": {"id": "v-小猫", "hanzi": "小猫"}}
        segment = module.make_segmenter(lexicon, [], {})
        tokens, gaps = segment("小猫，猫。")
        self.assertEqual([token[0] for token in tokens], ["v-小猫", "v-猫"])
        self.assertEqual(gaps, [])

    def test_unknown_text_is_a_gap_not_a_new_word(self):
        segment = module.make_segmenter({}, [], {})
        tokens, gaps = segment("猫！")
        self.assertEqual(tokens, [])
        self.assertEqual(gaps, ["猫"])

    def test_absent_observations_preserve_curricular_importance(self):
        principal, _ = module.role_value([{"list_type": "new_vocabulary"}])
        contextual, _ = module.role_value([])
        self.assertGreater(principal, contextual)

    def test_statistics_keep_editorial_grammar_separate(self):
        catalog, _ = module.load_catalog()
        contexts, _, _ = module.collect_contexts(catalog)
        self.assertTrue(any(key[0] == 4 and key[1] == "grammar" for key in contexts))
        for lesson in (5, 6):
            self.assertTrue(any(key[0] == lesson and key[1] == "editorialGrammar" for key in contexts))
            self.assertFalse(any(key[0] == lesson and key[1] == "grammar" for key in contexts))


if __name__ == "__main__":
    unittest.main()
