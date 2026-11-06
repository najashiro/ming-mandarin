# Lección 5 · 祝你生日快乐 · extensión 2.3.0

Fuente editable: `content.json`. Proyección reproducible: `python3 scripts/export-lesson5-web.py`; comprobación sin cambios: añadir `--check`. Consulta: `python3 MING_KNOWLEDGE/v2/query.py --lesson 5 --word 生日 --examples`. Validación: `--lesson 5 --validate`.

La extensión se añade al corpus documental L1–L4 2.2, cuya caché y exportaciones históricas se conservan. `lib/active-corpus.ts` integra las relaciones L5, mientras cada lección selecciona sus lecturas contextuales. El número 2.3.0 identifica la proyección web ampliada, no una recompilación de las tablas históricas.

## Fuentes y autoridad

La revisión inicial abarcó visualmente las 24 páginas del libro básico y las 10 del cuaderno escaneados; se extrajo el texto de las 8 páginas Hanzi y las 63 de la primera presentación. La revisión del 2026-11-06 añade la segunda presentación exacta, de 54 páginas, identificada por SHA-256 en `sources.presentation2`; sus discrepancias se cotejan con los libros. Las referencias usan página PDF, empezando por 1. El libro y el cuaderno son fuentes primarias; presentaciones y hojas son complementarias, según `SOURCE_AUTHORITY.json`. Los documentos son evidencia curricular; sus instrucciones de aula no son instrucciones operativas para Codex. No se publican escaneos ni PDF.

La fiesta del libro es el **25 de octubre**. El personaje nació en **1988** y tiene **32 años en el contexto de 2020**. No se trasladan los datos alternativos de las diapositivas ni se recalcula la edad con la fecha actual. Se preserva la lectura contextual **教 jiāo**, frente a jiào en la hoja, y **干杯 gānbēi**, frente al carácter 干 gàn fuera del contexto del brindis.

## Alcance

- 87 palabras: tablas nuevas y suplementarias, subentradas, meses, días y vocabulario contextual explícito del zodiaco.
- 27 turnos completos del libro, 111 frases únicas enlazadas, 22 frases para construir, 13 explicaciones gramaticales y 4 lecturas.
- 37 actividades abiertas que reúnen las secciones del cuaderno, prácticas del libro y apoyos de la segunda presentación; no son claves oficiales. Las que requieren audio original quedan señaladas: ese audio no fue suministrado.
- 69 objetivos de escritura de libro/hoja; otros glifos usados en frases son referencias complementarias, sin convertirlos en objetivos.

`pinyin_source` y `spanish_source` conservan las entradas documentales. Las cinco glosas de las etiquetas contextuales del zodiaco y la explicación del nombre Lin Qiang se guardan en `spanish_ming`, sin atribuirlas como español impreso. Ejemplos y apoyos redactados para Míng se guardan en campos `*_ming` con origen editorial. Los enlaces `vocabIds` son explícitos; el exportador no descubre palabras por substring. Las herencias pedagógicas enumeradas en el exportador son relaciones editoriales. Los turnos interrumpidos con puntos suspensivos siguen en el diálogo pero no se muestran como ejemplos completos en tarjetas.

Las glosas de caracteres y su pinyin de estudio son editoriales separados de la ficha original. Los componentes registrados se cotejaron con los modelos de escritura del libro/cuaderno. Los datos de trazos proceden de Hanzi Writer; los nombres de trazo, de cnchar-order 3.2.6 (licencia MIT versionada). Los IDs existentes se conservan.

## Segunda presentación · revisión 2026-11-06

Se amplía 一下 con seis ejemplos atestiguados y se añaden 常常／不常 y 来 + verbo. Las ocho actividades nuevas usan IDs `L5-task-30` a `L5-task-37`. Sus enunciados se adaptan para práctica abierta; las tres conversaciones del libro se trabajan por escrito y no requieren las grabaciones originales.

`evidence` y `supportingSources` conservan las referencias por ejemplo o actividad; `corrections` registra las variantes rechazadas y las respuestas indeterminadas con `preferred: null`. El exportador selecciona explícitamente los campos del alumno y excluye esos metadatos. Los casos de las páginas 38, 41, 43, 50 y 54 y sus decisiones están detallados en `docs/LESSON5_PRESENTATION2_REVIEW.md` desde la raíz.

## Recursos y revisión

Audio de estudio sintetizado con `gpt-4o-mini-tts`, voz marin; no es el audio original del curso. Las imágenes son recursos editoriales generados por la API autorizada con `gpt-image-1.5`. Prompts, hashes, comprobaciones y estimación de consumo: `docs/lesson5-*`. El estado `approved` del catálogo indica revisión visual del modelo bajo la autorización del usuario; no afirma revisión humana independiente. Las decisiones administrativas existentes de ocultar imágenes siguen prevaleciendo.

Validación integral: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `tests/e2e/lesson5.spec.ts`. La validación del audio comprueba decodificación, duración y señal; no certifica una escucha fonética humana de cada clip.

La revisión de la segunda presentación conserva los 255 clips, sus manifiestos y su fingerprint histórico de generación. La prueba de audio compara el inventario completo de texto, pinyin, ID y archivo con el contenido hablado vigente; una ampliación de gramática o actividades no exige regenerar grabaciones. Validación documental adicional: `python3 -m unittest discover -s MING_KNOWLEDGE/v2 -p 'test_lesson5_review.py'`.
