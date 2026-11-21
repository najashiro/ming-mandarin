"""L7 preserves source boundaries, duplicate witnesses and explicit lexical links."""
import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent

class Lesson7SourceTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = json.loads((ROOT / 'lesson7/content.json').read_text())
        cls.coverage = json.loads((ROOT / 'lesson7/page-coverage.json').read_text())

    def test_complete_inventory_and_duplicate(self):
        self.assertEqual(len(self.coverage), 35)
        self.assertEqual(len({(r['source'], r['printedPage']) for r in self.coverage}), 34)
        duplicate = [r for r in self.coverage if r['duplicateOf']]
        self.assertEqual([(r['source'], r['pdfPage'], r['duplicateOf']) for r in duplicate], [('workbook', 3, 2)])
        self.assertEqual(sum(s['pages'] for s in self.data['sources'].values()), 35)
        for s in self.data['sources'].values():
            self.assertRegex(s['sha256'], r'^[a-f0-9]{64}$')

    def test_source_references_and_editorial_separation(self):
        sources = {s['file']: s for s in self.data['sources'].values()}
        def walk(value):
            if isinstance(value, dict):
                if 'file' in value and 'pdfPage' in value:
                    self.assertIn(value['file'], sources)
                    self.assertTrue(1 <= value['pdfPage'] <= sources[value['file']]['pages'])
                for child in value.values():
                    walk(child)
            elif isinstance(value, list):
                for child in value:
                    walk(child)
        walk(self.data)
        for word in self.data['vocabulary']:
            self.assertEqual(word['example']['origin'], 'editorial_study_example')
            self.assertEqual(word['example']['vocabIds'], [word['id']])
            self.assertIn(word['hanzi'], word['example']['hanzi'])
        self.assertFalse(self.data['policy']['originalAudioSupplied'])
        self.assertFalse(self.data['policy']['officialAnswerKeySupplied'])
        self.assertTrue(all(r['officialAnswerKey'] is None and not r['automaticGrading'] for r in self.data['documentaryExercises']))

    def test_vocabulary_lists_and_writing_targets(self):
        words = self.data['vocabulary']
        self.assertEqual(len({w['id'] for w in words}), 70)
        self.assertEqual(sum(w['role'] == 'core_textbook' for w in words), 47)
        self.assertEqual(sum(w['role'] == 'supplementary_textbook' for w in words), 17)
        self.assertEqual(sum(w['role'] == 'context_only' for w in words), 6)
        self.assertEqual({w['hanzi'] for w in words if w['entry_kind'] == 'subentry'}, set('员左黑绿错卡'))
        self.assertEqual({c['hanzi'] for c in self.data['characters']}, set('果草且衣手宜钱衬衫裤打折斤买块卡千价试想适员百'))
        self.assertEqual([len(d['turns']) for d in self.data['dialogues']], [17, 18])
        for dialogue in self.data['dialogues']:
            self.assertEqual([r['turn'] for r in dialogue['turns']], list(range(1, len(dialogue['turns']) + 1)))

    def test_games_are_distinct_adaptations_of_non_listening_tasks(self):
        exercises = {r['id']: r for r in self.data['documentaryExercises']}
        self.assertEqual(len(self.data['workbookGames']), 18)
        for game in self.data['workbookGames']:
            self.assertEqual(game['answerOrigin'], 'ming_adaptation')
            self.assertFalse(exercises[game['sourceExerciseId']]['requiresOriginalAudio'])
        self.assertEqual({r['mode'] for r in self.data['workbookGames']}, {'order', 'complete', 'dialogue'})
        self.assertIn('955,70', next(r for r in self.data['corrections'] if r['id'] == 'L7-02')['decision'])

    def test_generated_listening_practice_does_not_forge_source_audio(self):
        activities = [r for r in self.data['documentaryExercises'] if r['requiresOriginalAudio']]
        self.assertEqual(len(activities), 5)
        self.assertEqual(sum(len(r['listeningPractice']['tracks']) for r in activities), 28)
        self.assertEqual(self.data['pending'], [])
        for activity in activities:
            practice = activity['listeningPractice']
            self.assertEqual(practice['origin'], 'ming_generated_practice')
            self.assertEqual(practice['answerOrigin'], 'ming_practice_only')
            self.assertEqual(practice['recordingOrigin'], 'ai_generated')
            self.assertIsNone(activity['officialAnswerKey'])
            for track in practice['tracks']:
                self.assertTrue(track['hanzi'] and track['pinyin'] and track['spanish'])
                if track['task']:
                    self.assertTrue(track['answer'])

if __name__ == '__main__':
    unittest.main()
