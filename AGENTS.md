# Míng · Mandarín activo — instrucciones del repositorio

La base curricular normalizada del proyecto está en `MING_KNOWLEDGE/`.

La aplicación usa Next.js 16, React 19, TypeScript, Supabase y Vercel. Usa Node >= 22.13 y pnpm 11.19.0. Instalación: `corepack enable` y `pnpm install --frozen-lockfile`. Valida con `pnpm lint`, `pnpm typecheck`, `pnpm test` y `pnpm build`; ejecuta las auditorías específicas cuando corresponda.

Antes de modificar contenido curricular, vocabulario, Hanzi, gramática, diálogos, ejercicios, juegos o exámenes, sigue las reglas de `MING_KNOWLEDGE/AGENTS.md`.

No releas todos los PDF por defecto. Consulta primero `MING_KNOWLEDGE/index.json` y los archivos de datos necesarios.

Para contenido curricular, consulta solo los shards pertinentes. No inventes vocabulario, gramática, pinyin, radicales, traducciones ni fuentes. Usa PDF original únicamente si falta información, hay conflicto, se requiere imagen/trazo o verificación literal. No publiques PDF, escaneos ni la carpeta `Base de Datos/` en este repositorio público.

Los Hanzi Writer usan assets versionados en `public/hanzi-data/`. El audio de mandarín se reproduce desde MP3 estáticos en `public/audio/`; no regeneres TTS ni hagas llamadas de pago salvo pedido expreso. Prioriza móvil/iPhone, accesibilidad y controles táctiles. Conserva los IDs de currículo, Hanzi y progreso; cualquier cambio de ID requiere una migración diseñada.

No publiques `.env*`, claves, tokens ni contraseñas. Nunca expongas secretos en `NEXT_PUBLIC_*`. No ejecutes migraciones, cambios de RLS ni despliegues en producción sin autorización. Trabaja cada cambio en su propia rama y ejecuta las validaciones pertinentes. Codex puede preparar, revisar y, con permisos suficientes de GitHub, fusionar un PR expresamente autorizado por el usuario; nunca debe fusionar a `main` por iniciativa propia.
