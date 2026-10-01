# Ensayo oral no listado · You Shiluo / Shen Bowen

## Alcance y fuente

Página independiente solicitada expresamente por el usuario el 30-sep-2026. Se usa su borrador personal de 29 turnos y la revisión de esta conversación, contrastada primero con MING_KNOWLEDGE/index.json (base 2.2.0). No es un diálogo del libro y no se añade al corpus, a los juegos, al vocabulario ni al progreso.

Referencias internas relevantes: MING_KNOWLEDGE/v2/lesson4/dialogue-turns.tsv, DLG-L4-BOOK-T1 turnos 1/3/4 (你明天做什么, 你明天几点有课, 汉字课), y las reglas de MING_KNOWLEDGE/AGENTS.md / SOURCE_AUTHORITY.json. El libro y los ejercicios prevalecen; una lectura aislada de hoja Hanzi no sustituye la pronunciación contextual.

Cambios editoriales respecto del borrador: pinyin con tonos y español; preguntas explícitas por la hora en 15/16; se conserva 汉字课 en 17 y 面条儿 en 27; se elimina 和 entre las dos oraciones en 24; se reducen devoluciones de pregunta y posesivos redundantes sin quitar turnos. Se conserva 最近怎么样, las edades 31/34 y las profesiones elegidas por el usuario. Las especialidades profesionales y datos personales proceden del guion; no se atribuyen al libro.

El usuario confirmó 尤世洛. Solo proporcionó Shěn Bówén en pinyin: NO se inventan sus caracteres. La línea 4 conserva ese nombre en pinyin dentro del texto; el TTS recibe instrucciones para pronunciarlo en mandarín. Cuando se confirme su escritura, actualizar el texto y obtener autorización para el nuevo lote de audio. Los caracteres con ficha disponible usan LinkedChineseText; no se inventan fichas ni enlaces rotos para glifos no soportados.

## Acceso

Ruta: `/ensayo/oral-dd5ec37486bb08ba4ea6a9bd372431a2`.

No se agrega enlace desde navegación, inicio, corpus, buscador, juegos o sitemap. La ruta comprueba exactamente el slug y devuelve notFound para otro valor. Usa metadatos y cabecera X-Robots-Tag noindex/nofollow/noarchive/nosnippet, además de Referrer-Policy no-referrer. No se bloquea el rastreo mediante una regla robots que impediría leer noindex.

Es un enlace NO LISTADO, no autenticación ni confidencialidad. Quien obtenga la URL podrá abrirla y este repositorio es público. Los MP3 tampoco son secretos. No usar para datos sensibles. No se modifica ninguna política de Supabase ni se añade contraseña.

## Interfaz

Reutiliza SiteShell, LessonHeader, LinkedChineseText, PinyinText, SpeakButton y la estructura/clases de Diálogos. Caracteres arriba, pinyin debajo y traducción debajo del pinyin. Controles independientes, visibles inicialmente; ambas capas pueden ocultarse. Hanzi abre en otra pestaña con returnTo y ancla al turno. Audio por turno, reproducción de todos y velocidad 0.8/1.0. Un solo audio activo mediante el coordinador ya existente. CSS aislado, móvil/iPhone y controles de 44px.

## Audio autorizado

Misma configuración que Míng: gpt-4o-mini-tts / marin / MP3. 29 turnos, 28 clips únicos porque el saludo se reutiliza. Se genera cada intervención completa, no se ensamblan sílabas. La clave vive exclusivamente en secrets.OPENAI_API_KEY del job de GitHub; el cliente solo reproduce MP3 y nunca llama a OpenAI ni speechSynthesis.

La solicitud `.github/audio-requests/oral-final.json` fija el texto por SHA-256, modelo, voz, límite de clips y caracteres. `scripts/oral-final-audio.mjs --check` es offline. `--generate` es la única operación de pago; no regenera archivos existentes. Las salidas son content-addressed y no pueden sustituirse por audio de una versión de texto distinta. `--publish` registra solo archivos decodificables con duración y SHA-256; `--verify` coteja los 29 turnos. La verificación técnica no equivale a escuchar y aprobar la pronunciación humana.

El workflow solo actúa en `codex/oral-final-unlisted-20260930` dentro de este repositorio. No usa pull_request_target ni publica en main. En caso de fallo guarda MP3 y pruebas como artifacts para no desperdiciar una generación completada.

## Validación

- `node scripts/oral-final-audio.mjs --check` (sin API).
- `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.
- `node scripts/oral-final-audio.mjs --verify` después del lote.
- `pnpm exec playwright test --config playwright.oral-final.config.ts`: Chromium escritorio y WebKit iPhone, 29 turnos, toggles independientes, enlaces/anclas Hanzi, noindex, 404 de slug incorrecto, MP3 servidos, reproducción excluyente sin API y capturas.

No afirmar que la PR, los checks, los audios o el despliegue están terminados hasta comprobar el resultado correspondiente. El merge requiere autorización del usuario.

## Reparación de audio · 1-oct-2026

El usuario informó que los turnos 22 y 25 estaban incompletos y pidió completarlos. La transcripción automática de los MP3 anteriores confirmó que ambos omitían la pregunta final. Se generaron únicamente estos dos turnos completos con Marin, añadiendo una instrucción de continuidad; sus nuevas rutas evitan reutilizar los archivos anteriores desde caché. El texto del diálogo y los otros 27 turnos se conservan.

`request.repair` limita la generación a los IDs solicitados. Las instrucciones adicionales forman parte del hash de cada clip, por lo que `--publish` y `--verify` siguen verificando las rutas correctas. El lote vuelve a quedar `completed` tras publicar el manifiesto; repetir `--generate` con todos los archivos presentes no genera llamadas de pago.

La evidencia antes/después está en `docs/oral-audio-repair-20261001.json`: transcripción sin proporcionar el texto esperado, comparación normalizando puntuación y variantes tradicionales/simplificadas, duraciones y SHA-256. Ambos clips nuevos coinciden con la intervención completa. Es una comprobación automática de contenido, no una certificación humana de pronunciación.
