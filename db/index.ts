import { env } from 'cloudflare:workers';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

export { schema };

export function getDb() {
  if (!env.DB) {
    throw new Error(
      'Cloudflare D1 binding `DB` is unavailable. Set the `d1` field in .openai/hosting.json to `DB` or let your control plane inject the real binding values before using the database.',
    );
  }

  return drizzle(env.DB, { schema });
}

export function getBindings() {
  if (!env.DB || !env.FILES) throw new Error('Los bindings DB y FILES son obligatorios.');
  return { DB: env.DB, FILES: env.FILES };
}
