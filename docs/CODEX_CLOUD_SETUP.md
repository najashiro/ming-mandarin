# Codex Cloud setup for Míng

This repository is prepared to be worked on from Codex Cloud without keeping a local computer running.

## 1. Create the cloud environment
In Codex Cloud, connect GitHub and authorize only the repository `najashiro/ming-mandarin`. Create an environment for the repository and use `main` as the normal base branch.

Pin Node.js 22.13 or newer.

### Setup script
```bash
corepack enable
pnpm install --frozen-lockfile
```

### Maintenance script
```bash
corepack enable
pnpm install --frozen-lockfile
```

Codex Cloud caches prepared environments, so later tasks should start faster.

## 2. Environment variables
For normal coding, linting, unit tests and most builds, do not copy production credentials into Codex.

Safe development values can be used when a command only requires the variables to exist:

```text
NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_placeholder
SUPABASE_SECRET_KEY=sb_secret_placeholder
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_EMAILS=admin@example.com
COMMUNITY_ENABLED=false
COMMUNITY_THREAD_LIMIT=3
COMMUNITY_REPLY_LIMIT=12
```

If a task truly needs live Supabase data, use a separate development/staging Supabase project rather than the production secret.

Keep the production Supabase secret, Vercel credentials, OpenAI API key and admin passwords out of the repository and out of normal Codex agent context.

## 3. Internet access
Leave agent internet access disabled for normal application work. The setup script can still install dependencies. Enable limited internet only for a task that genuinely needs an external service.

## 4. Normal validation
For substantial changes:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

For browser tests, install Chromium only when required:

```bash
pnpm exec playwright install --with-deps chromium
pnpm test:e2e
```

## 5. Educational source material
Do not upload the Instituto Confucio/textbook PDFs or scans into this public repository.

Codex should work from the normalized repository knowledge:
- `seed/curriculum.ts`
- `docs/CURRICULUM_L1_L3.md`
- `docs/SOURCE_AUDIT_L1_L3.md`
- the game audit documents
- the Hanzi and static audio assets already committed

When new lessons arrive, first convert the relevant material into the normalized curriculum/knowledge layer with traceability, then let Codex implement product changes from that layer.

## 6. Working from the mine
Once the GitHub repository and Cloud environment are connected, the local PC does not need to remain on. Start a Codex Cloud task from the web, review the diff, request follow-ups, and open a pull request. Vercel can continue deploying from GitHub according to the repository's existing deployment configuration.

## 7. Recommended task pattern
Give each task one outcome and require validation, for example:

```text
Implement <feature> in Míng. Read AGENTS.md and the relevant curriculum/audit docs first. Do not invent curriculum content. Keep the change mobile-first. Run lint, typecheck, relevant tests and build. Return a concise summary, validation results and any remaining risks.
```
