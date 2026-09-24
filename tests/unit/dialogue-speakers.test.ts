import { describe, expect, it } from 'vitest';
import corpus from '@/data/corpus-v21-public.json';
import { dialogueSpeakerFor, dialogueSpeakers } from '@/data/dialogue-speakers';

describe('dialogue speaker presentation registry', () => {
  it('covers every published speaker explicitly', () => {
    const published = new Set(corpus.dialogues.flatMap((dialogue) => dialogue.turns.map((turn) => turn.speaker)));
    expect([...published].sort()).toEqual(dialogueSpeakers.map((speaker) => speaker.name).sort());
    expect([...published].every((name) => dialogueSpeakerFor(name))).toBe(true);
  });

  it('keeps fixed, unique colors for the confirmed identities', () => {
    expect(dialogueSpeakerFor('马大为')).toMatchObject({ token: 'jade', background: '#E7F2E9', accent: '#2B6650' });
    expect(dialogueSpeakerFor('宋华')).toMatchObject({ token: 'azul', background: '#E7EFFA', accent: '#3C6598' });
    expect(dialogueSpeakerFor('马大为')?.background).not.toBe(dialogueSpeakerFor('宋华')?.background);
    expect(new Set(dialogueSpeakers.map((speaker) => speaker.token)).size).toBe(dialogueSpeakers.length);
    expect(new Set(dialogueSpeakers.map((speaker) => speaker.background)).size).toBe(dialogueSpeakers.length);
  });

  it('normalizes only harmless formatting and never gives unknown names a fallback identity', () => {
    expect(dialogueSpeakerFor('  马大为。 ')).toBe(dialogueSpeakerFor('马大为'));
    expect(dialogueSpeakerFor('陈')).toBeUndefined();
    expect(dialogueSpeakerFor('A')).toBeUndefined();
  });
});
