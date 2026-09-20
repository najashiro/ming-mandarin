# Codex Cloud: configuración de Míng

Conecta GitHub en [Codex Cloud](https://chatgpt.com/codex), selecciona `najashiro/ming-mandarin` y crea un entorno sobre `main` (tras fusionar el PR de preparación). La computadora local puede permanecer apagada: el código vive en GitHub; Vercel mantiene su despliegue desde GitHub y Supabase sigue siendo el backend.

## Runtime y scripts

Node >= 22.13; `packageManager` fija pnpm 11.19.0. No actualices el lockfile al configurar el entorno.

Setup Script:

```bash
corepack enable
pnpm install --frozen-lockfile
```

Maintenance Script:

```bash
corepack enable
pnpm install --frozen-lockfile
```

El setup necesita acceso a npm para instalar paquetes. `next build` descarga Noto Serif SC desde Google Fonts si la fuente no está en caché. Para tareas que ejecutan build, configura Internet del agente en **On**, lista de dominios **None** más `fonts.googleapis.com` y `fonts.gstatic.com`, y métodos `GET`, `HEAD`, `OPTIONS`; para otras tareas puede quedar en **Off**. Para E2E instala Chromium y WebKit porque `playwright.config.ts` prueba ambos: `pnpm exec playwright install --with-deps chromium webkit`. No se instalan durante setup normal.

## Variables

Las pruebas ordinarias deben usar valores de desarrollo sin acceso a producción. No copies secretos reales de Vercel ni Supabase al entorno Cloud. `.env.example` incluye nombres y valores de ejemplo seguros.

| Variable | Tipo | Uso | Build | Test | Runtime | Sensible |
| --- | --- | --- | --- | --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | pública | URL cliente Supabase | opcional | opcional | sí | no |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | pública | clave publicable cliente | opcional | opcional | sí | no |
| `SUPABASE_URL` | privada | override URL servidor | no | no | opcional | no |
| `SUPABASE_PUBLISHABLE_KEY` | privada | override clave publicable servidor | no | no | opcional | no |
| `SUPABASE_SECRET_KEY` | privada | operaciones servidor | no | no | sí para APIs protegidas | sí |
| `SUPABASE_SERVICE_ROLE_KEY` | privada | alias legado de clave servidor | no | no | opcional | sí |
| `NEXT_PUBLIC_SITE_URL` | pública | URL canónica | opcional | no | opcional | no |
| `ADMIN_EMAILS` | privada | acceso admin | no | no | sí para admin | datos personales |
| `COMMUNITY_ENABLED` | privada | interruptor comunidad | no | no | opcional | no |
| `COMMUNITY_THREAD_LIMIT` | privada | límite de hilos | no | no | opcional | no |
| `COMMUNITY_REPLY_LIMIT` | privada | límite de respuestas | no | no | opcional | no |
| `OPENAI_API_KEY` | privada | generación/verificación de audio, no runtime normal | no | no | no | sí |
| `OPENAI_TTS_VOICE` | privada | override de voz al generar audio | no | no | no | no |
| `VERCEL_URL`, `VERCEL_PROJECT_PRODUCTION_URL` | plataforma | fallback de URL canónica | opcional | no | opcional | no |
| `PLAYWRIGHT_EXTERNAL_SERVER`, `PLAYWRIGHT_REUSE_SERVER`, `CAPTURE_FAMILY` | pruebas | control E2E | no | opcional | no | no |

`NODE_ENV` es estándar de Node/Next. Los scripts de audio leen opcionalmente `.env.audio.local`, que está ignorado. Nunca ejecutes `audio:generate`, `audio:time`, `audio:verify` con clave real durante setup o pruebas ordinarias.

## Validación y seguridad

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm audit:pinyin
pnpm audit:reto-mixto
```

`pnpm test:e2e` arranca un servidor local sobre el build y necesita Chromium/WebKit; no apuntes pruebas a producción. El build usa `next/font/google`, por lo que puede necesitar Internet. No ejecutes migraciones Supabase, seeds, TTS ni deploys durante setup.

Las migraciones versionadas son `0001_lesson_1.sql` hasta `0006_time_game.sql`. Su estado de aplicación en producción no está verificado. No cambies RLS ni uses la clave secreta de producción para pruebas. Consulta `AGENTS.md` y `MING_KNOWLEDGE/index.json` antes de cambios curriculares; para cambios técnicos abre solamente los archivos concretos. Nunca subas PDF originales o `Base de Datos/`.

## Flujo

Desde navegador crea una tarea Cloud en el repo, revisa diff y validaciones, abre PR hacia `main` y fusiona cuando corresponda. Vercel despliega desde GitHub con su configuración existente. Guarda credenciales únicamente en sus plataformas respectivas; para tareas que requieran datos reales, crea un proyecto Supabase separado de desarrollo.
