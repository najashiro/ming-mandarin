import { statSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import lesson6 from '@/data/lesson6-public.json';
import manifest from '@/data/lesson6-dialogue-audio.json';
import available from '@/data/lesson6-dialogue-audio-available.json';
import { publicCorpusForScope } from '@/lib/corpus-v21';
import { audioForMandarinText } from '@/lib/mandarin-audio';

const turns = lesson6.dialogues.flatMap(dialogue => dialogue.turns);

describe('audio completo de los diálogos de la lección 6', () => {
  it('resuelve cada intervención con su texto y lectura publicados a un MP3 existente', () => {
    expect(turns).toHaveLength(31);
    for (const dialogue of lesson6.dialogues) {
      for (const turn of dialogue.turns) {
        const context = `${dialogue.id}:${turn.turn} ${turn.hanzi} (${turn.pinyin})`;
        expect(turn.pinyin, context).toBeTruthy();
        const src = audioForMandarinText(turn.hanzi, turn.pinyin);
        expect(src, context).toMatch(/^\/audio\/[a-z0-9/-]+\.mp3$/);
        expect(statSync(`public${src}`).size, context).toBeGreaterThan(1024);
      }
    }
  });

  it('mantiene el mismo audio en la lección y los repasos acumulados', () => {
    for (const scope of ['l6', 'l1-l2-l3-l4-l5-l6', 'l1-l2-l3-l4-l5-l6-l7'] as const) {
      const dialogues = publicCorpusForScope(scope).dialogues.filter(dialogue => dialogue.lesson === 6);
      expect(dialogues.map(dialogue => dialogue.id), scope).toEqual(lesson6.dialogues.map(dialogue => dialogue.id));
      for (const dialogue of dialogues) {
        for (const turn of dialogue.turns) {
          const original = lesson6.dialogues.find(row => row.id === dialogue.id)!.turns.find(row => row.turn === turn.turn)!;
          expect(audioForMandarinText(turn.hanzi, turn.pinyin), `${scope}:${dialogue.id}:${turn.turn}`)
            .toBe(audioForMandarinText(original.hanzi, original.pinyin));
        }
      }
    }
  });

  it('publica únicamente archivos completos para intervenciones de los diálogos', () => {
    expect(manifest.clips.length).toBeGreaterThan(0);
    expect(new Set(manifest.clips.map(clip => clip.file)).size).toBe(manifest.clips.length);
    expect(new Set(available.files)).toEqual(new Set(manifest.clips.map(clip => clip.file)));
    for (const clip of manifest.clips) {
      expect(turns.some(turn => turn.hanzi === clip.input && turn.pinyin === clip.expectedPinyin), clip.id).toBe(true);
      expect(statSync(`public/audio/mandarin/${clip.file}`).size, clip.id).toBeGreaterThan(1024);
      expect(audioForMandarinText(clip.input, clip.expectedPinyin), clip.id).toBe(`/audio/mandarin/${clip.file}`);
    }
  });

  it('no sustituye tonos o números por una grabación con otra lectura', () => {
    const greeting = turns.find(turn => turn.hanzi === '你好，请问食堂在哪儿？')!;
    expect(audioForMandarinText(greeting.hanzi, greeting.pinyin)).toBeDefined();
    expect(audioForMandarinText(greeting.hanzi, greeting.pinyin.replace('shítáng', 'shītáng'))).toBeUndefined();
    const address = turns.find(turn => turn.hanzi.includes('35号'))!;
    expect(audioForMandarinText(address.hanzi, address.pinyin)).toBeDefined();
    expect(audioForMandarinText(address.hanzi.replace('35号', '36号'), address.pinyin.replace('sānshíwǔ', 'sānshíliù'))).toBeUndefined();
  });
});
