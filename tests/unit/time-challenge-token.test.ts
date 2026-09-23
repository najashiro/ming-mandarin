import { describe, expect, it } from 'vitest';
import { issueTimeChallengeToken, verifyTimeChallengeToken } from '@/lib/time-challenge-token';

describe('signed time challenge token', () => {
  it('accepts a signed four minute challenge once the tolerance threshold has passed', () => {
    const start = 1_780_000_000_000;
    const token = issueTimeChallengeToken('test-secret', 'hard', start, '123e4567-e89b-12d3-a456-426614174000');
    expect(verifyTimeChallengeToken(token, 'test-secret', start + 234_999)).toBeNull();
    expect(verifyTimeChallengeToken(token, 'test-secret', start + 235_000)).toEqual({ id: '123e4567-e89b-12d3-a456-426614174000', startedAt: start, rules:'hard',durationSeconds:240,rulesVersion:3 });
    expect(verifyTimeChallengeToken(token, 'test-secret', start + 20 * 60_000 + 1)).toBeNull();
  });

  it('rejects tampered tokens and a different signing key', () => {
    const start = 1_780_000_000_000;
    const token = issueTimeChallengeToken('test-secret', 'normal', start, '123e4567-e89b-12d3-a456-426614174000');
    expect(verifyTimeChallengeToken(token, 'another-secret', start + 420_000)).toBeNull();
    expect(verifyTimeChallengeToken(token.replace('174000', '174001'), 'test-secret', start + 420_000)).toBeNull();
  });
});
