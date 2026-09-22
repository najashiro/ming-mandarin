# Míng · traspaso rápido

## Estado y arquitectura

Aplicación Next.js 16 / React 19 / TypeScript, pnpm 11.19.0, Node >= 22.13. Supabase ofrece autenticación, progreso, comunidad y ranking; Vercel sirve la aplicación. La rama `main` ya contiene `MING_KNOWLEDGE` v1.0.0. Despliegue: GitHub → Vercel → producción.

**Codex Cloud environment: CONFIGURADO Y VALIDADO.** La primera tarea Cloud terminó en **PASS** sobre `c723de931b7421be4e7c59f9696f8ce36fe8601a`, con Node v22.22.2 y pnpm 11.19.0 confirmados. E2E y las funciones reales de Supabase no se validaron.

## Rutas y funciones

`app/` contiene páginas y APIs. `app/study/[scope]/` organiza estudio, juegos, vocabulario, gramática, diálogos, Hanzi y examen. `app/api/` contiene progreso, autenticación, comunidad, ranking y juego de la hora. `components/` contiene UI y juegos; `seed/curriculum.ts` alimenta contenido existente. No cambies IDs de progreso sin migración.

## Currículo, juegos y Hanzi

Lee `MING_KNOWLEDGE/AGENTS.md` y `MING_KNOWLEDGE/index.json` antes de tocar contenido; abre solo shards pertinentes. No releas todos los PDF. Los juegos recientes incluyen `现在几点？` con audio pregrabado, entrada por caracteres y ranking; el micrófono está oculto. `public/hanzi-data/` contiene assets Hanzi Writer versionados; `scripts/sync-hanzi-data.mjs` los sincroniza, pero no se necesita ejecutarlo en cada setup.

## Audio

MP3 estáticos en `public/audio/pinyin/` y `public/audio/mandarin/`; manifiestos junto al audio y scripts `scripts/sync-*-audio-manifest.mjs`, `generate-pronunciation-audio.mjs`, `verify-pronunciation-audio.mjs`. La generación usa `gpt-4o-mini-tts`, voz predeterminada `marin`, una vez; la app reproduce archivos publicados. La generación requiere `OPENAI_API_KEY` y no forma parte de setup.

## Supabase, Vercel y pruebas

`supabase/migrations/` contiene seis migraciones (`0001`–`0006`); estado aplicado en producción no verificado. No ejecutes migraciones ni pruebas contra producción. Vercel sigue conectado a GitHub; no requiere cambio para Cloud. Pruebas: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`; auditorías `pnpm audit:pinyin` y `pnpm audit:reto-mixto`; E2E con Playwright Chromium/WebKit y servidor local. Ver `docs/CODEX_CLOUD_SETUP.md`.

## Flujo de trabajo

Flujo recomendado: Cloud/local → rama → pruebas → PR → merge → `main`. GitHub es el punto de sincronización entre Codex Cloud y Codex local. Evita trabajar simultáneamente desde Local y Cloud sobre la misma rama. Riesgos conocidos: build depende de Google Fonts; E2E necesita navegadores; Cloud no debe recibir secretos de producción ni archivos de `Base de Datos/`.
