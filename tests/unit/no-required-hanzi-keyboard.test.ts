import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(path, 'utf8');

describe('Chinese answers do not require an IME', () => {
  it('uses blocks rather than Hanzi inputs in game production modes', () => {
    for (const path of [
      'components/games/hanzi-lab/WordListening.tsx',
      'components/games/story-detective/StoryDetective.tsx',
      'components/games/live-scene/LiveSceneGame.tsx',
      'components/games/conversation/ConversationGame.tsx',
    ]) expect(read(path), path).not.toContain('hanziInputClass');
  });

  it('gives scored Hanzi answers an explicit server-generated block response', () => {
    expect(read('lib/server/persistence.ts')).toContain("responseType: question.options ? 'choice' as const : chineseBlocks ? 'hanzi_blocks'");
    expect(read('components/ExamClient.tsx')).toContain("question.responseType === 'hanzi_blocks'");
  });
});
