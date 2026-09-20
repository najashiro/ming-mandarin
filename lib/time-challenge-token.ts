import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';

const uuid = /^[0-9a-f-]{36}$/i;
const minimumDurationMs = 415_000;
const maximumDurationMs = 20 * 60_000;

export function issueTimeChallengeToken(secret: string, now = Date.now(), id = randomUUID()) {
  const payload = `${id}.${now}`;
  const signature = createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

export function verifyTimeChallengeToken(token: string, secret: string, now = Date.now()) {
  const [id, timestamp, signature, extra] = token.split('.');
  if (extra || !uuid.test(id ?? '') || !/^\d{13}$/.test(timestamp ?? '') || !signature) return null;
  const startedAt = Number(timestamp);
  const elapsed = now - startedAt;
  if (elapsed < minimumDurationMs || elapsed > maximumDurationMs) return null;
  const expected = createHmac('sha256', secret).update(`${id}.${timestamp}`).digest();
  let supplied: Buffer;
  try { supplied = Buffer.from(signature, 'base64url'); } catch { return null; }
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return null;
  return { id, startedAt };
}
