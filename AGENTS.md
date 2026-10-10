# Míng · Mandarín activo — instrucciones del repositorio

La base curricular normalizada del proyecto está en `MING_KNOWLEDGE/`.

Antes de diseñar o modificar fichas de Vocabulario, consulta `MING_KNOWLEDGE/design/VOCABULARY_STYLE.md` y `MING_KNOWLEDGE/design/vocabulary-style.json`. Guardan el estándar visual aprobado, el tamaño por defecto de la tarjeta completa (proporción áurea horizontal), la referencia elegida y el prompt reutilizable. Son decisiones de diseño, no contenido curricular ni prueba de implementación.

La aplicación usa Next.js 16, React 19, TypeScript, Supabase y Vercel. Usa Node >= 22.13 y pnpm 11.19.0. Instalación: `corepack enable` y `pnpm install --frozen-lockfile`. Valida con `pnpm lint`, `pnpm typecheck`, `pnpm test` y `pnpm build`; ejecuta las auditorías específicas cuando corresponda.

Antes de modificar contenido curricular, vocabulario, Hanzi, gramática, diálogos, ejercicios, juegos o exámenes, sigue las reglas de `MING_KNOWLEDGE/AGENTS.md`.

No releas todos los PDF por defecto. Consulta primero `MING_KNOWLEDGE/index.json` y los archivos de datos necesarios.

Para contenido curricular, consulta solo los shards pertinentes. No inventes vocabulario, gramática, pinyin, radicales, traducciones ni fuentes. Usa PDF original únicamente si falta información, hay conflicto, se requiere imagen/trazo o verificación literal. No publiques PDF, escaneos ni la carpeta `Base de Datos/` en este repositorio público.

Los Hanzi Writer usan assets versionados en `public/hanzi-data/`. El audio de mandarín se reproduce desde MP3 estáticos en `public/audio/`; no regeneres TTS ni hagas llamadas de pago salvo pedido expreso. Prioriza móvil/iPhone, accesibilidad y controles táctiles. Conserva los IDs de currículo, Hanzi y progreso; cualquier cambio de ID requiere una migración diseñada.

No publiques `.env*`, claves, tokens ni contraseñas. Nunca expongas secretos en `NEXT_PUBLIC_*`. No ejecutes migraciones, cambios de RLS ni despliegues en producción sin autorización. Trabaja cada cambio en su propia rama y ejecuta las validaciones pertinentes. Codex puede preparar, revisar y, con permisos suficientes de GitHub, fusionar un PR expresamente autorizado por el usuario; nunca debe fusionar a `main` por iniciativa propia.

## Corpus activo L1–L4

La versión activa es **2.2.0**, bajo `MING_KNOWLEDGE/v2/` (el nombre de la carpeta no indica la versión menor). Sigue `active_version`, `entrypoint` y `manifest` del índice principal. `data/` y `lessons/` de primer nivel son legado v1; su cobertura L1–L3 no limita el corpus activo.

Para L4 lee `MING_KNOWLEDGE/v2/lesson4/README.md` y aplica `MING_KNOWLEDGE/SOURCE_AUTHORITY.json`. Consulta `python MING_KNOWLEDGE/v2/query.py --summary`, `--word <hanzi> --lesson 4 --limit 8` y `--validate`. Los libros básico y de ejercicios prevalecen para su contexto sobre las presentaciones y hojas complementarias.

Antes de afirmar que falta una lección, comprueba el índice activo y la versión local frente a `origin/main`. Distingue la disponibilidad documental de su implementación en la interfaz; una ausencia en `seed/` o una ruta no demuestra ausencia en el corpus. Conserva cambios locales al sincronizar.

En Windows activa UTF-8 antes de usar consultas, validadores o exportadores: `$env:PYTHONUTF8='1'` y `$env:PYTHONIOENCODING='utf-8'`. Conserva los archivos del corpus con finales LF (`.gitattributes`) para no invalidar sus sumas de verificación.
