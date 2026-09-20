# AGENTS.md — Míng · Mandarín activo

## Project
Míng is a Next.js 16 + React 19 + TypeScript Mandarin-learning app deployed on Vercel with Supabase.

## Source of truth
- Curriculum and traceability: `seed/curriculum.ts`, `docs/CURRICULUM_L1_L3.md`, `docs/SOURCE_AUDIT_L1_L3.md`.
- Game-specific audits: `docs/GAMES_AUDIT.md`, `docs/GAMES_DELIVERY.md`, `docs/RETO_MIXTO_CORPUS_AUDIT.md`.
- Hanzi data: local files under `public/hanzi-data/`.
- Pronunciation audio: static files under `public/audio/pinyin/`.

Do not invent Mandarin vocabulary, grammar, pinyin, radicals, translations, lesson placement, or source-page references. Preserve curriculum traceability. If a requested change needs source material that is not represented in the repository, say so instead of guessing.

## Package manager and runtime
- Node.js: >= 22.13.0
- Package manager: pnpm
- Install: `corepack enable && pnpm install --frozen-lockfile`

## Validation
Run the smallest relevant checks while iterating. Before declaring a substantial code change complete, run as many of these as are relevant:
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- `pnpm audit:reto-mixto` for Reto Mixto changes
- `pnpm audit:pinyin` for pinyin/curriculum changes

For browser/E2E work, install Chromium only when needed:
`pnpm exec playwright install --with-deps chromium`
Then run `pnpm test:e2e`.

## Safety and secrets
- Never commit `.env.local`, API keys, Supabase service/secret keys, admin passwords, or tokens.
- Never place server secrets in `NEXT_PUBLIC_*` variables.
- Production secrets belong in Vercel/Supabase, not in GitHub.
- Do not regenerate OpenAI TTS audio unless the task explicitly requests it.
- Do not upload course/textbook PDFs or scans to this public repository.

## Product constraints
- Mobile/iPhone behavior is a first-class requirement.
- Preserve existing progress IDs and curriculum IDs unless a migration is explicitly designed.
- Keep public study flows functional without requiring admin credentials.
- Avoid replacing static pronunciation audio with device `speechSynthesis`.
- Keep accessibility and touch targets in mind for games.

## Git workflow
Work on the task branch supplied by Codex. Keep changes scoped. Do not rewrite unrelated files. Summarize changed files and validation results at the end.
