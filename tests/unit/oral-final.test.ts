import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import dialogue from '@/data/rehearsals/oral-final.json';
import request from '../../.github/audio-requests/oral-final.json';

const turn = (number: number) => dialogue.turns[number - 1];

describe('Ensayo oral no listado', () => {
  it('conserva los 29 turnos, dos interlocutores y participación 15/14', () => {
    expect(dialogue.turns).toHaveLength(29);
    expect(new Set(dialogue.turns.map(item => item.id)).size).toBe(29);
    dialogue.turns.forEach((item, index) => {
      expect(item.speaker).toBe(index % 2 ? 'shen' : 'you');
      for (const value of [item.hanzi, item.pinyin, item.spanish]) expect(value.trim().length).toBeGreaterThan(0);
    });
  });
  it('preserva datos personales del guion y no inventa el nombre chino de Shen', () => {
    expect(dialogue.speakers[0].hanzi).toBe('尤世洛');
    expect(dialogue.speakers[1].hanzi).toBeNull();
    expect(turn(4).hanzi).toContain('Shěn Bówén');
    expect(turn(10).hanzi).toContain('三十一岁');
    expect(turn(11).hanzi).toContain('三十四岁');
    expect(turn(19).hanzi).toContain('土木工程师');
    expect(turn(20).hanzi).toContain('电气工程师');
  });
  it('respeta 汉字课 de L4, horarios, Bìlǔ, 面条儿 y la corrección de 和', () => {
    expect(turn(15).hanzi).toContain('你明天几点有课？');
    expect(turn(16).hanzi).toContain('下午两点有汉语课');
    expect(turn(17).hanzi).toBe('我明天晚上七点有汉字课。');
    expect(turn(17).pinyin).toContain('Hànzì kè');
    expect(turn(8).pinyin).toContain('Bìlǔ');
    expect(turn(27).hanzi).toContain('面条儿');
    expect(turn(24).hanzi).toBe('我爸爸是警察，妈妈是老师。你爸爸妈妈做什么工作？');
    const source = readFileSync('MING_KNOWLEDGE/v2/lesson4/dialogue-turns.tsv', 'utf8');
    expect(source).toContain('你明天几点有课？');
    expect(source).toContain('十点四十有汉字课');
  });
  it('limita el lote de pago al texto autorizado y reutiliza el saludo repetido', () => {
    const canonical = dialogue.turns.map(({ id, hanzi, pinyin }) => ({ id, hanzi, pinyin }));
    expect(createHash('sha256').update(JSON.stringify(canonical)).digest('hex')).toBe(request.textFingerprint);
    expect(new Set(dialogue.turns.map(item => `${item.hanzi}|${item.pinyin}`)).size).toBe(28);
    expect(request.model).toBe('gpt-4o-mini-tts');
    expect(request.voice).toBe('marin');
    expect(request.maxUniqueClips).toBe(28);
  });
  it('no anuncia el enlace en navegación, catálogo ni sitemap', () => {
    expect(dialogue.slug).toMatch(/^oral-[a-f0-9]{32}$/);
    for (const file of ['components/SiteShell.tsx', 'components/CurriculumNav.tsx', 'app/page.tsx', 'app/sitemap.ts', 'public/sitemap.xml', 'public/robots.txt']) {
      if (existsSync(file)) expect(readFileSync(file, 'utf8')).not.toContain(dialogue.slug);
    }
    const page = readFileSync('app/ensayo/[slug]/page.tsx', 'utf8');
    expect(page).toContain('index: false');
    expect(page).toContain('slug !== dialogue.slug');
    const client = readFileSync('components/rehearsals/OralRehearsal.tsx', 'utf8');
    expect(client).not.toContain('OPENAI_API_KEY');
    expect(client).not.toContain('speechSynthesis');
    expect(client).not.toContain('api.openai.com');
    expect(client).toContain('LinkedChineseText');
    expect(client).toContain('SpeakButton');
  });
});
