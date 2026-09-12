import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { retoMixtoAudit, retoMixtoConversations, retoMixtoCorpus, retoMixtoModes } from '@/data/reto-mixto';
import { audioForMandarinText } from '@/lib/mandarin-audio';
import { buildRetoMixtoDeck, insertRetry, isSilentRetoMixtoToken, primaryRetoMixtoHanziTarget, retryQuestion } from '@/lib/reto-mixto';

describe('Reto Mixto', () => {
  it('mantiene un corpus maestro deduplicado, trazable y completo', () => {
    expect(new Set(retoMixtoCorpus.map((entry) => entry.id)).size).toBe(retoMixtoCorpus.length);
    expect(new Set(retoMixtoCorpus.map((entry) => entry.hanzi)).size).toBe(retoMixtoCorpus.length);
    expect(retoMixtoCorpus.every((entry) => entry.hanzi && entry.pinyin && entry.meaningEs && entry.sources.length && entry.sourceTypes.length)).toBe(true);
    expect(retoMixtoCorpus.some((entry) => entry.category === 'supplementary')).toBe(true);
    expect(retoMixtoCorpus.some((entry) => entry.category === 'ppt')).toBe(true);
    expect(retoMixtoCorpus.some((entry) => entry.category === 'hanzi')).toBe(true);
    expect(retoMixtoCorpus.some((entry) => entry.category === 'phrase')).toBe(true);
    expect(retoMixtoCorpus.some((entry) => entry.category === 'example_only')).toBe(true);
    expect(retoMixtoCorpus.some((entry) => entry.sourceTypes.includes('workbook'))).toBe(true);
    expect(retoMixtoCorpus.some((entry) => entry.sourceTypes.includes('phonetics_presentation'))).toBe(true);
    expect(retoMixtoCorpus.some((entry) => entry.sourceTypes.includes('hanzi_worksheet'))).toBe(true);
    expect(retoMixtoAudit).toMatchObject({
      totalUnique: 350,
      playable: 345,
      excludedExamples: 5,
      imageable: 36,
      withAudio: 350,
      conversations: 10,
      byLesson: { 1: 110, 2: 143, 3: 105 },
      byCategory: { core: 131, supplementary: 10, ppt: 25, hanzi: 133, phrase: 46, example_only: 5 },
      bySourceType: { textbook: 231, class_presentation: 193, phonetics_presentation: 5, hanzi_worksheet: 22, workbook: 46 },
    });
  });

  it('tiene audio estático para todo el corpus e imágenes WebP para cada ítem visualizable', () => {
    for (const entry of retoMixtoCorpus) {
      expect(entry.audioSrc, `audio de ${entry.hanzi}`).toMatch(/^\/audio\/(mandarin|pinyin)\/.+\.mp3$/);
      expect(existsSync(path.join(process.cwd(), 'public', entry.audioSrc)), `archivo de audio de ${entry.hanzi}`).toBe(true);
      if (!entry.imageable) continue;
      expect(entry.imageSrc, `imagen de ${entry.hanzi}`).toMatch(/^\/images\/games\/reto-mixto\/.+\.webp$/);
      const file = path.join(process.cwd(), 'public', entry.imageSrc!);
      expect(existsSync(file), `archivo de imagen de ${entry.hanzi}`).toBe(true);
      expect(statSync(file).size).toBeGreaterThan(10_000);
    }
    expect(retoMixtoAudit.imageable).toBe(36);
    expect(retoMixtoAudit.withAudio).toBe(retoMixtoAudit.totalUnique);
    const visualEntries = retoMixtoCorpus.filter((entry) => entry.imageable);
    expect(new Set(visualEntries.map((entry) => `${entry.imageSrc}:${entry.familyTarget ?? ''}`)).size).toBe(visualEntries.length);
  });

  it('reutiliza una familia canónica y distingue abuelos y hermanos con distractores relacionales', () => {
    const targets = {
      爸爸: 'baba', 妈妈: 'mama', 爷爷: 'yeye', 奶奶: 'nainai', 外公: 'waigong', 外婆: 'waipo',
      哥哥: 'gege', 姐姐: 'jiejie', 弟弟: 'didi', 妹妹: 'meimei', 女儿: 'nver',
    } as const;
    const familyEntries = Object.entries(targets).map(([hanzi, target]) => {
      const entry = retoMixtoCorpus.find((item) => item.hanzi === hanzi);
      expect(entry?.familyTarget).toBe(target);
      expect(entry?.imageSrc).toBe('/images/games/reto-mixto/family/family-master.webp');
      return entry!;
    });
    expect(new Set(familyEntries.map((entry) => entry.familyTarget)).size).toBe(11);
    expect(new Set(familyEntries.map((entry) => entry.imageSrc)).size).toBe(1);
    expect(retoMixtoCorpus.find((entry) => entry.hanzi === '家人')).toMatchObject({ imageSrc: familyEntries[0].imageSrc, familyTarget: undefined });
    expect(new Set(familyEntries.filter((entry) => ['爷爷', '奶奶', '外公', '外婆'].includes(entry.hanzi)).map((entry) => entry.distractorGroup))).toEqual(new Set(['family-grandparents']));
    expect(new Set(familyEntries.filter((entry) => ['哥哥', '姐姐', '弟弟', '妹妹'].includes(entry.hanzi)).map((entry) => entry.distractorGroup))).toEqual(new Set(['family-siblings']));
    const grandparentDeck = buildRetoMixtoDeck(retoMixtoCorpus, retoMixtoConversations, [1, 2, 3], 10, () => 0.76);
    const grandparentOptions = grandparentDeck[1].optionIds.map((id) => retoMixtoCorpus.find((entry) => entry.id === id)?.hanzi);
    expect(grandparentDeck[1].mode).toBe('hanzi-image');
    expect(new Set(grandparentOptions)).toEqual(new Set(['爷爷', '奶奶', '外公', '外婆']));

    const siblingDeck = buildRetoMixtoDeck(retoMixtoCorpus, retoMixtoConversations, [1, 2, 3], 10, () => 0.56);
    const siblingOptions = siblingDeck[2].optionIds.map((id) => retoMixtoCorpus.find((entry) => entry.id === id)?.hanzi);
    expect(siblingDeck[2].mode).toBe('hanzi-image');
    expect(new Set(siblingOptions)).toEqual(new Set(['哥哥', '姐姐', '弟弟', '妹妹']));
  });

  it('solo enlaza a fichas Hanzi que existen en la plataforma', () => {
    const manifest = JSON.parse(readFileSync(path.join(process.cwd(), 'public', 'hanzi-data', 'manifest.json'), 'utf8')) as Record<string, { available: boolean }>;
    for (const entry of retoMixtoCorpus) {
      for (const character of entry.hanziTargets) {
        expect(manifest[character]?.available, `ficha Hanzi de ${character}`).toBe(true);
        expect(existsSync(path.join(process.cwd(), 'public', 'hanzi-data', `${character}.json`)), `datos Hanzi de ${character}`).toBe(true);
      }
    }
  });

  it('resuelve un único destino Hanzi, ejemplos contextuales y audios de interacción', () => {
    for (const entry of retoMixtoCorpus) {
      expect(primaryRetoMixtoHanziTarget(entry)).toBe(entry.hanziTargets.includes(entry.hanzi) ? entry.hanzi : entry.hanziTargets[0]);
      for (const token of entry.tokens ?? []) {
        if (isSilentRetoMixtoToken(token)) expect(audioForMandarinText(token)).toBeUndefined();
        else expect(audioForMandarinText(token), `audio de la ficha ${token}`).toMatch(/^\/audio\/(mandarin|pinyin)\/.+\.mp3$/);
      }
    }
    for (const conversation of retoMixtoConversations) {
      expect(audioForMandarinText(conversation.promptHanzi), `audio de pregunta ${conversation.promptHanzi}`).toMatch(/^\/audio\/mandarin\/.+\.mp3$/);
    }
    expect(isSilentRetoMixtoToken('。')).toBe(true);
    expect(isSilentRetoMixtoToken('？！')).toBe(true);
    expect(isSilentRetoMixtoToken('我')).toBe(false);

    const tired = retoMixtoCorpus.find((entry) => entry.hanzi === '累');
    expect(tired?.usageExample).toMatchObject({ hanzi: '他很累。', pinyin: 'Tā hěn lèi.', meaningEs: 'Él está muy cansado.' });
    expect(tired?.usageExample?.audioSrc).toMatch(/^\/audio\/mandarin\/.+\.mp3$/);
  });

  it('genera una sesión equilibrada con cuatro opciones exactas', () => {
    const deck = buildRetoMixtoDeck(retoMixtoCorpus, retoMixtoConversations, [1, 2, 3], 30, () => 0.42);
    expect(deck).toHaveLength(30);
    expect(new Set(deck.map((question) => question.mode))).toEqual(new Set(retoMixtoModes));
    for (const question of deck) {
      if (question.mode === 'construct-response') {
        expect(question.optionIds).toHaveLength(0);
        expect(question.conversationId).toBeTruthy();
        expect(retoMixtoConversations.find((conversation) => conversation.id === question.conversationId)).toBeTruthy();
        expect(retoMixtoCorpus.find((entry) => entry.id === question.entryId)?.tokens?.length).toBeGreaterThan(1);
      }
      else expect(question.optionIds).toHaveLength(4);
      expect(question.mode === 'construct-response' || question.optionIds.includes(question.entryId)).toBe(true);
      if (question.mode === 'hanzi-image' || question.mode === 'audio-image') {
        expect(question.optionIds.every((id) => retoMixtoCorpus.find((entry) => entry.id === id)?.imageable)).toBe(true);
      }
    }
  });

  it('respeta estrictamente el filtro de lección en preguntas, distractores y reintentos', () => {
    for (const lessons of [[1], [2], [3], [1, 2], [1, 2, 3]] as const) {
      const lessonIds = [...lessons] as Array<1 | 2 | 3>;
      const deck = buildRetoMixtoDeck(retoMixtoCorpus, retoMixtoConversations, lessonIds, 30, () => 0.61);
      expect(deck).toHaveLength(30);
      for (const question of deck) {
        expect(question.lessonIds).toEqual(lessonIds);
        expect(retoMixtoCorpus.find((entry) => entry.id === question.entryId)?.lessons.some((lesson) => lessonIds.includes(lesson)), `${lessonIds.join('+')} · ${question.id}`).toBe(true);
        for (const optionId of question.optionIds) {
          expect(retoMixtoCorpus.find((entry) => entry.id === optionId)?.lessons.some((lesson) => lessonIds.includes(lesson))).toBe(true);
        }
      }
      const retry = retryQuestion(deck[0], retoMixtoCorpus, retoMixtoConversations, () => 0.55);
      for (const optionId of retry.optionIds) {
        expect(retoMixtoCorpus.find((entry) => entry.id === optionId)?.lessons.some((lesson) => lessonIds.includes(lesson))).toBe(true);
      }
    }
  });

  it('reintroduce un error entre tres y seis rondas más tarde y cambia de modo cuando puede', () => {
    const deck = buildRetoMixtoDeck(retoMixtoCorpus, retoMixtoConversations, [1, 2, 3], 10, () => 0.35);
    const retry = retryQuestion(deck[0], retoMixtoCorpus, retoMixtoConversations, () => 0.5);
    const reinforced = insertRetry(deck, 0, retry, () => 0.5);
    const position = reinforced.findIndex((question) => question.id === retry.id);
    expect(position).toBeGreaterThanOrEqual(4);
    expect(position).toBeLessThanOrEqual(7);
    expect(retry.retryOf).toBe(deck[0].id);
    const entry = retoMixtoCorpus.find((candidate) => candidate.id === deck[0].entryId)!;
    if (entry.playableModes.length > 1) expect(retry.mode).not.toBe(deck[0].mode);
  });

  it('no usa síntesis de voz ni muestra detalles técnicos al estudiante', () => {
    const component = readFileSync(path.join(process.cwd(), 'components', 'RetoMixto.tsx'), 'utf8');
    expect(component).not.toContain('speechSynthesis');
    expect(component).not.toContain('voz IA');
    expect(component).not.toContain('audio IA');
    expect(component).not.toContain('sin voz china');
  });
});
