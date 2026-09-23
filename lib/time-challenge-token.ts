import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { TIME_CHALLENGE_SECONDS, TIME_RULES_VERSION, type TimeRuleMode } from '@/data/time-game';

const uuid = /^[0-9a-f-]{36}$/i;
const minimumDurationMs = (TIME_CHALLENGE_SECONDS - 5) * 1000;
const maximumDurationMs = 20 * 60_000;

export function issueTimeChallengeToken(secret: string, rules:TimeRuleMode='normal', now = Date.now(), id = randomUUID()) {
  const payload = `${id}.${now}.${rules}.${TIME_CHALLENGE_SECONDS}.${TIME_RULES_VERSION}`;
  const signature = createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

export function verifyTimeChallengeToken(token: string, secret: string, now = Date.now()) {
  const [id, timestamp, rules, duration, version, signature, extra] = token.split('.');
  if (extra || !uuid.test(id ?? '') || !/^\d{13}$/.test(timestamp ?? '') || !['normal','hard'].includes(rules??'') || Number(duration)!==TIME_CHALLENGE_SECONDS || Number(version)!==TIME_RULES_VERSION || !signature) return null;
  const startedAt = Number(timestamp);
  const elapsed = now - startedAt;
  if (elapsed < minimumDurationMs || elapsed > maximumDurationMs) return null;
  const expected = createHmac('sha256', secret).update(`${id}.${timestamp}.${rules}.${duration}.${version}`).digest();
  let supplied: Buffer;
  try { supplied = Buffer.from(signature, 'base64url'); } catch { return null; }
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return null;
  return { id, startedAt, rules:rules as TimeRuleMode, durationSeconds:Number(duration), rulesVersion:Number(version) };
}
