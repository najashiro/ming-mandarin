# Lección 4 · integración web

Fuente de verdad: corpus 2.2.0 integrado. La implementación conserva los IDs históricos y separa las lecturas aisladas de Hanzi de la pronunciación contextual.

## Flujo de datos

`scripts/export-lesson4-web.py` reutiliza `export-corpus-v22.py.build()` y las tablas tipadas de `query.py`; produce `data/lesson4-public.json` sin escribir el corpus. `--check` compara la proyección completa reproducible. No se consulta ningún PDF.

`lib/active-corpus.ts` conserva la proyección histórica v2.1 y añade L4. Los consumidores existentes (`lib/corpus-v21.ts`, `lib/vocabulary.ts`, `lib/vocabulary-examples.ts`) usan este adaptador. El nombre histórico del primer módulo se conserva para no romper sus imports. `seed/lesson4.ts` adapta la misma exportación a los contratos de práctica. No hay cambios de Supabase, migraciones de progreso ni despliegue.

Cobertura de L4: las **63 entradas de las tres listas del libro** están publicadas, junto con 10 entradas adicionales con apoyos documentados; 2 diálogos canónicos (27 turnos), 19 registros explicativos del libro, 6 lecturas, 62 conjuntos de actividades y 54 caracteres de las hojas. Las unidades 4.1/4.2 tienen 33/26 caracteres con repeticiones compartidas. Se añadieron 27 archivos técnicos de Hanzi Writer; cuatro de los caracteres nuevos ya tenían assets de consulta.

Rutas: `/study/l4` y `/study/l1-l2-l3-l4`, con `vocabulary`, `dialogues`, `grammar`, `hanzi`, `radicals`, `readings`, `exercises`, `games`, `daily` y `exam`. Los selectores de catálogo, Vocabulario Mix, Reto Mixto y Hanzi incluyen L4. Los juegos visuales de escenas, conversación y detective conservan sus bancos anteriores y no se ofrecen en L4: faltan escenas/segmentaciones pedagógicas aprobadas para esos formatos. En L4 se ofrecen vocabulario, audio, escritura y el juego de horas.

Las relaciones radical–carácter proceden de los campos explícitos de las hojas; las definiciones existentes se reutilizan solo cuando coincide el glifo exacto. Los nombres o recuentos no documentados permanecen vacíos/nulos. No se asignan radicales a palabras de varios caracteres.

## Lecturas y evaluación

Los diálogos solo incluyen `DLG-L4-BOOK-T1/T2`. No se mezclan turnos de presentaciones. La ausencia de traducción o pinyin no oculta el texto chino ni autoriza completar datos.

Las lecturas contextuales seleccionadas por el corpus incluyen `只 zhǐ` y `差 chà`; el laboratorio Hanzi conserva `只 zhī` y `差 chā`. El reproductor resuelve por texto **y lectura** cuando se proporciona pinyin. Se conservan IDs `v-…`, `c-…` y `PH-…`, así como la introducción histórica de caracteres compartidos.

La práctica automática utiliza significado/pinyin del vocabulario documentado y 7 frases cuyos bloques reconstruyen exactamente el texto a partir de `word_phrase_spans`. No se inventa segmentación. Los exámenes L4 y L1–L4 usan vocabulario/pinyin; las unidades 4.1/4.2 evalúan trazos técnicos. Las actividades originales se muestran para trabajo abierto, sin atribuirles claves automáticas. Seis necesitan grabaciones originales no suministradas y se indican como pendientes. El TTS de estudio no sustituye esas grabaciones ni sus respuestas.

## Audio

```sh
pnpm corpus:l4
pnpm audio:l4:prepare
pnpm audio:l4
pnpm audio:l4:verify
```

`data/lesson4-audio.json` registra 156 clips (palabras, ejemplos con apoyos, turnos, lecturas completas y lecturas aisladas de caracteres), deduplicados por texto/pinyin con SHA-256 para nombres estables. Los MP3 están en `public/audio/mandarin/l4-*.mp3`. Se reutiliza el generador existente y la voz `marin`, modelo `gpt-4o-mini-tts`. Variables privadas: `OPENAI_API_KEY`, `OPENAI_TTS_VOICE`, `OPENAI_TTS_MODEL`; `OPENAI_ENV_FILE` permite señalar un archivo local externo. Por defecto se lee `.env.audio.local`. Nunca exponer estas variables al cliente. La generación es una llamada de pago explícita y omite archivos existentes; `--force --ids-file=…` permite repetir una selección exacta.

El verificador decodifica cada MP3 en Chromium, comprueba duración/RMS y solo después publica `data/lesson4-audio-available.json`. El informe está en `docs/lesson4-audio-signal.json`; `docs/lesson4-audio-retry.json` registra los fallos. No hay síntesis ni ensamblaje de sílabas en cliente. Si un recurso falta, no se anuncia como disponible; un fallo de red muestra el estado de reintento del reproductor existente. La verificación de señal no equivale a una auditoría fonética humana.

## Imágenes

Se seleccionaron dos sujetos suficientemente claros para fichas transparentes: 电视 y 睡觉. Cada uno tiene PNG maestro y WebP en `public/images/vocabulary/lesson4/`. No se habilitan como preguntas basadas solo en imagen: `visual_ming.image_quiz_eligible` es falso para ambos. El resto conserva sus imágenes existentes revisadas o la tarjeta de texto.

```sh
pnpm images:l4 --prepare
pnpm images:l4 --word=v-电视 --input=/ruta/a/imagen.png
pnpm images:l4 --word=v-睡觉 --input=/ruta/a/imagen.png
```

La preparación escribe los prompts y las decisiones por palabra en `docs/lesson4-image-prompts.json`. Para regenerar, usar cada prompt con ImageGen y fondo transparente; importar el PNG inspeccionado con el segundo comando. La importación comprueba alfa/esquinas y normaliza sin recortar ni umbralizar los bordes. `data/lesson4-media.json` registra estilo, ruta, dimensiones, hashes y revisión del modelo, sin afirmar revisión humana.

La UI y Administración combinan estos registros/prompts con los existentes y mantienen la publicación mediante el servicio de revisión actual. Un fallo de Supabase sigue ocultando imágenes para no resucitar recursos retirados. No se modifica ese comportamiento. El test de imagen en navegador simula la respuesta de ese servicio con el manifiesto aprobado; la prueba de persistencia existente verifica sus decisiones por separado. Ante un fallo del archivo, la tarjeta conserva Hanzi, pinyin, traducción y audio.

## Límites documentales

- 42 registros contextuales/docentes carecen de pinyin o español contextual completo y quedan inventariados en `pending`; ninguna de las 63 entradas del libro está excluida.
- Solo 10 palabras L4 tienen ejemplos vinculados con pinyin y traducción completos. No se fabrican ejemplos para las demás.
- Las lecturas y algunos turnos no tienen traducción/pinyin completos; se muestra lo disponible.
- Los nombres técnicos de trazos no presentes en el catálogo anterior permanecen pendientes. La animación y el orden de trazos locales sí funcionan.
- No se suministró audio original del cuaderno. Las seis actividades afectadas quedan expresamente pendientes.

## Validación reproducible

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm corpus:l4:check
python -X utf8 scripts/export-corpus-v22.py --check
python -X utf8 MING_KNOWLEDGE/v2/query.py --validate
python -X utf8 MING_KNOWLEDGE/v2/lesson4/audit.py --release-check
node scripts/run-e2e.mjs lesson4.spec.ts --workers=1
node scripts/run-e2e.mjs lesson4.spec.ts corpus-corrections.spec.ts hanzi-focus.spec.ts vocabulary-mix.spec.ts public.spec.ts --workers=2
```

`tests/unit/lesson4.test.ts` comprueba cobertura, canonicidad, lecturas, archivos registrados, ausencia de claves fabricadas y práctica/exámenes. Las pruebas históricas conservan sus conteos L1–L3, bancos del Reto Mixto y protección del motor/visuales. `tests/e2e/lesson4.spec.ts` recorre rutas, comprueba límites horizontales, contenido, reproducción real, carga/fallo de imagen y navegación histórica en escritorio, móvil y WebKit/iPhone. Las capturas se guardan en `test-results/`.

El buscador Hanzi se habilita tras la hidratación para evitar perder la primera consulta en iPhone. Playwright usa `127.0.0.1`, igual que el servidor E2E, para que las solicitudes de navegación de WebKit compartan la dirección de escucha.

Resultado de la integración: 269 tests unitarios y 107 casos E2E aprobados; cuatro casos se omiten por estar destinados a otro perfil. Lint, typecheck, build, las validaciones del corpus y las dos comprobaciones de exportación pasan. Las pruebas públicas antiguas se actualizaron a los controles que ya estaban presentes en `main` (pestaña «Palabras y frases» y selección curricular sin filtros de estado), manteniendo persistencia, trazos, audio y geometría responsive. Se verificó la señal de los 156 MP3 y se inspeccionaron las fichas con imágenes en escritorio y móvil.
