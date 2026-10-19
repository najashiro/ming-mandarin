import { describe, expect, it } from 'vitest';
import { conversationMissionsForScope, isConversationResponseAccepted } from '@/data/conversation-missions';
import { gamesContent } from '@/data/games-curriculum';
import { curriculumScopes } from '@/seed/curriculum';

describe('guided conversation missions', () => {
  for (const scope of curriculumScopes) it(`${scope}: uses complete source turns and curricular distractors`, () => {
    const content = gamesContent(scope);
    const existingChinese = new Set([...content.sentences.map(item => item.hanzi), ...content.conversations.map(item => item.answer.hanzi)]);
    for (const mission of conversationMissionsForScope(scope)) {
      expect(content.definition.lessonIds).toContain(mission.lesson);
      expect(mission.turns.length).toBeGreaterThan(0);
      for (const turn of mission.turns) {
        expect(content.conversations).toContainEqual(turn.challenge);
        expect(turn.choices.length).toBeGreaterThan(1);
        expect(turn.choices.every(choice => existingChinese.has(choice))).toBe(true);
        expect(turn.choices.filter(choice => isConversationResponseAccepted(turn.challenge, choice))).toHaveLength(1);
        for (const answer of turn.challenge.acceptedResponses) expect(isConversationResponseAccepted(turn.challenge, answer)).toBe(true);
      }
    }
  });

  it('preserves the presentation order and keeps unrelated roles separate', () => {
    expect(conversationMissionsForScope('l1')[0].turns.map(turn => turn.challenge.id)).toEqual(['rm-conv-l1-hello', 'rm-conv-l1-name', 'rm-conv-l1-meet']);
    const lesson2 = conversationMissionsForScope('l2');
    expect(lesson2.find(mission => mission.id === 'saludo-clase')?.role).toBe('El profesor Chen');
    expect(lesson2.find(mission => mission.id === 'apellido')?.role).toBe('Song Hua');
    const family = conversationMissionsForScope('l3')[0];
    expect(family.turns[0].challenge.answer.hanzi).toBe('我家有四口人。');
    expect(family.turns.map(turn => turn.challenge.id)).not.toContain('rm-conv-l3-sisters');
    expect(conversationMissionsForScope('l4')).toEqual([]);
  });

  it('accepts documented short answers and punctuation, without accepting another role', () => {
    const surname = conversationMissionsForScope('l2').find(mission => mission.id === 'apellido')!.turns[0].challenge;
    expect(isConversationResponseAccepted(surname, '我 姓 宋。')).toBe(true);
    expect(isConversationResponseAccepted(surname, '我叫马大为。')).toBe(false);
    expect(isConversationResponseAccepted(surname, '')).toBe(false);
  });
});
