# Míng · Mandarín activo

Plataforma responsive y persistente para la Lección 1 **你最近怎么样？**. Incluye vocabulario trazable, pinyin y tonos, escucha sintética `zh-CN`, gramática, diálogos, lectura, hanzi, 28 juegos, SRS por dimensión, cuaderno de errores, examen de 100 puntos, certificado PNG verificable y ranking opt-in.

## Arquitectura

- **UI:** Vinext/React/TypeScript, CSS responsive propio y rutas App Router.
- **Backend operativo en Sites:** handlers de servidor, ChatGPT Auth, D1 (`DB`) y R2 (`FILES`). La calificación, elegibilidad del certificado y ranking no dependen de valores enviados por el cliente.
- **Contenido:** `seed/` contiene el corpus auditado; cada registro conserva archivo y página. Al entrar el primer usuario, `seedLessonContent()` carga idempotentemente vocabulario, frases, gramática, caracteres y ejercicios en D1.
- **Persistencia:** dominio, estabilidad, próxima revisión, intentos, errores, examen, logros, certificados y preferencias.
- **Offline:** el service worker cachea las rutas públicas estudiadas. Los intentos de práctica sin red se guardan localmente y se reenvían al recuperar conexión. El examen oficial nunca funciona offline.

## Requisitos y ejecución local

1. Instala Node.js 22.13+ y pnpm.
2. Ejecuta `pnpm install`.
3. Copia `.env.example` a `.env.local` solo si quieres limitar administradores.
4. Ejecuta `pnpm run build` una vez para generar el artefacto y la configuración local.
5. Aplica la migración D1 con `pnpm run db:local:migrate`.
6. Inicia `pnpm run dev` y abre `http://localhost:3000`.

Sites ofrece en local la cuenta de prueba `seedy@sites.test`. No guardes claves reales en el repositorio.

## Base, seed y storage

La migración canónica está en `drizzle/0000_sharp_purple_man.sql`. La compilación la copia a `dist/.openai/drizzle/` para que Sites la aplique al entorno publicado. Los datos de la lección se siembran de forma idempotente desde los archivos TypeScript auditables; no se crean alumnos, notas ni ranking ficticios.

Un resultado 100/100 crea una fila única por intento, un código `L1-XXXXXXXX` y el logro `FIRST_LESSON_MASTER`. El navegador dibuja un PNG 1600×1000; el servidor vuelve a comprobar usuario y nota, valida firma/tamaño, calcula SHA-256, sube a R2 y guarda ruta/hash. Un 87/100 no genera reconocimiento.

## Pruebas

- `pnpm test`: Vitest para pinyin, SRS, examen 87/100 y 100/100, corpus y empate de ranking.
- `pnpm test:e2e`: Playwright desktop y móvil para rutas, arcade, persistencia, cuaderno de errores, examen real, rechazo de score manipulado, PNG, R2 y ranking.
- `pnpm run typecheck`: TypeScript estricto.
- `pnpm run lint`: ESLint.
- `pnpm run build`: build de producción.

Playwright requiere `playwright install chromium` la primera vez.

## Despliegue en Sites

El archivo `.openai/hosting.json` declara los bindings lógicos `DB` y `FILES`. Compila, conserva `dist/.openai/drizzle`, guarda una versión y despliega mediante Sites. La autenticación y los valores reales de D1/R2 son gestionados por la plataforma; no deben copiarse a `.env`.

## Alternativa Supabase

El entorno objetivo ya ofrece infraestructura administrada, por eso la aplicación activa usa ChatGPT Auth + D1/R2. Para portarla a otro host se incluye `supabase/migrations/0001_lesson_1.sql` con tablas, índices, RLS, logro y bucket privado.

1. Crea un proyecto Supabase.
2. Ejecuta la migración desde SQL Editor o CLI.
3. Configura las variables `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` y `SUPABASE_CERTIFICATES_BUCKET`.
4. Implementa un adaptador que respete la interfaz de `lib/server/persistence.ts`; usa `auth.uid()` como `profiles.id` y rutas de storage `USER_UUID/CERTIFICATE_CODE.png`.
5. Mantén la service-role exclusivamente en servidor. Las respuestas correctas y `solution_server` nunca deben salir al navegador desde Supabase.

La migración Supabase es una ruta de portabilidad, no un selector de backend activo. Declararlo así evita simular persistencia en un servicio que el despliegue actual no usa.

## Límites conocidos que requieren revisión humana

- Los cinco PDFs no incluyen archivos de audio: toda reproducción está marcada como **voz sintética**, nunca como audio oficial.
- El lienzo 米字格 valida el conteo de trazos y ofrece guía/ghost mode; la evaluación geométrica automática de orden, inicio y dirección queda como mejora futura con datos locales de trazos. No califica caligrafía con falsa precisión.
- Conviene que el docente confirme la naturalidad de TTS, la explicación pedagógica de 很 frente a la simplificación de clase y los nombres de radicales antes de un uso institucional.
- La Lección 2 no se usa como núcleo comunicativo; solo las presentaciones fonéticas previas refuerzan prerrequisitos.
