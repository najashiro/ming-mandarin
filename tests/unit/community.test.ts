import { describe, expect, it } from 'vitest';
import { communityContextLabel, communityTags, isActiveCommunityBan, isCommunityRateLimited, isCommunityVisibleStatus, normalizeCommunityContext, normalizePlainText, safeCommunityRoute, titleSimilarity, validateReplyBody, validateThreadInput } from '@/lib/community/domain';

describe('Comunidad V1', () => {
  const context = { lessonId: 1, section: 'grammar' as const, concept: '很', skill: 'grammar' as const, route: '/lesson/1/grammar?concept=%E5%BE%88' };

  it('normaliza contexto y genera tags controlados', () => {
    expect(normalizeCommunityContext(context)).toEqual(context);
    expect(communityTags(context)).toEqual(['lesson:1', 'section:grammar', 'concept:很', 'skill:grammar']);
    expect(communityContextLabel(context)).toBe('Lección 1 · Gramática · 很 · Gramática');
    expect(() => normalizeCommunityContext({ ...context, section: 'social' as never })).toThrow();
  });

  it('solo acepta rutas internas de lecciones', () => {
    expect(safeCommunityRoute('/lesson/1/hanzi?character=好')).toBe('/lesson/1/hanzi?character=%E5%A5%BD');
    expect(() => safeCommunityRoute('https://example.com')).toThrow();
    expect(() => safeCommunityRoute('//example.com/lesson/1')).toThrow();
  });

  it('valida título y texto plano sin HTML interpretado', () => {
    expect(validateThreadInput({ title: '¿Por qué usamos 很?', body: 'No entiendo su función en 我很好.' })).toMatchObject({ title: '¿Por qué usamos 很?' });
    expect(normalizePlainText('<script>alert(1)</script>', 100)).toBe('<script>alert(1)</script>');
    expect(() => validateThreadInput({ title: 'Ayuda', body: 'Una explicación suficientemente larga.' })).toThrow();
    expect(validateReplyBody(' 可以。 ')).toBe('可以。');
  });

  it('detecta preguntas similares sin IA', () => {
    expect(titleSimilarity('¿Por qué usamos 很 con 好?', '¿Por qué se usa 很 con adjetivos?')).toBeGreaterThan(.3);
    expect(titleSimilarity('Orden de trazos de 好', 'Pronunciación de z')).toBe(0);
  });

  it('deriva visibilidad, bloqueos y límites temporales', () => {
    const now = new Date('2026-08-27T12:00:00Z');
    expect(isCommunityVisibleStatus('active')).toBe(true);
    expect(isCommunityVisibleStatus('hidden', false, false)).toBe(false);
    expect(isCommunityVisibleStatus('hidden', false, true)).toBe(true);
    expect(isActiveCommunityBan({ startsAt: '2026-08-27T10:00:00Z', endsAt: null }, now)).toBe(true);
    expect(isActiveCommunityBan({ startsAt: '2026-08-27T10:00:00Z', revokedAt: '2026-08-27T11:00:00Z' }, now)).toBe(false);
    expect(isCommunityRateLimited(['2026-08-27T11:55:00Z', '2026-08-27T11:58:00Z', '2026-08-27T11:59:00Z'], 3, 600_000, now)).toBe(true);
  });
});
