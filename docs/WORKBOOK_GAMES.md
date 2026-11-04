# Juegos del cuaderno

La sección `/study/[scope]/games/workbook` adapta ejercicios de los cuadernos de las lecciones 1–5 en tres juegos. Se abre desde los tres accesos nuevos del catálogo de juegos y conserva los alcances individuales y acumulativos existentes.

| Juego | Retos | Objetivo |
| --- | ---: | --- |
| Constructor de frases | 25 | Ordenar todos los bloques para expresar una idea dada. |
| El carácter que falta | 25 | Discriminar caracteres parecidos dentro de una frase. |
| Conecta la conversación | 30 | Elegir una respuesta coherente con una pregunta o situación. |

Cada lección ofrece 16 retos. Las sesiones tienen hasta seis preguntas sin repetición inicial. El repaso acumulativo incluye una pregunta de cada lección antes de repetir una lección. Las opciones y los bloques se barajan al comenzar en el navegador, sin aleatoriedad durante el render inicial del servidor. Los bloques repetidos conservan identidades independientes.

## Decisiones pedagógicas

- Las pistas son opcionales y se contabilizan por separado. Las explicaciones aparecen después de responder; el constructor muestra también el pinyin y la traducción de la frase modelo.
- Los errores vuelven una sola vez después de la primera vuelta. Una transición explícita oculta las soluciones antes de comenzar ese repaso. Un error persistente queda pendiente y permite iniciar otra sesión dirigida.
- El resumen distingue aciertos al primer intento, intentos con pista y respuestas recuperadas. Los aciertos con ayuda no se presentan como recuerdo autónomo. El resultado se conserva durante la sesión; no se inventan XP, ranking ni progreso sincronizado.
- La corrección ignora espacios y puntuación. Solo admite la respuesta modelo y las variantes expresamente enumeradas; no acepta respuestas parciales. Las alternativas de orden usan exactamente los mismos caracteres.
- Se revisaron los distractores de los emparejamientos al convertirlos en preguntas independientes. Por ejemplo, una pregunta general sobre el estado de alguien no ofrece dos estados válidos como si solo uno fuera correcto.
- Las edades de las conversaciones mantienen el contexto temporal del libro. No se recalculan con la fecha actual.

## Contenido y trazabilidad

`lib/workbook-games.ts` conserva el banco y un mapa separado `workbookQuestionEvidence` con archivo, página y actividad de origen. Las soluciones, segmentaciones, ayudas y explicaciones constituyen adaptaciones editoriales de Míng, no claves oficiales ni revisión docente independiente. No se usan anotaciones manuscritas como autoridad de corrección ni se califican actividades que necesitan el audio original no suministrado.

La página del servidor pasa únicamente `getWorkbookQuestions(scope)` al cliente. Los componentes importan los tipos del banco con `import type`; las referencias documentales no se serializan como datos del alumno. No se publican PDF ni escaneos.

La interfaz es pública, funciona sin cuenta y no requiere cambios de base de datos, generación de audio ni servicios pagados. Usa controles táctiles, teclado, foco visible, mensajes de corrección accesibles y un diseño sin cronómetro.

## Validación

Pruebas unitarias: `tests/unit/workbook-games.test.ts` y `tests/unit/workbook-session.test.ts`. Comprueban cobertura, fuentes, respuestas, variantes, caracteres repetidos, separación de referencias y muestreo equilibrado.

Pruebas de navegador: `pnpm exec playwright test --config=playwright.workbook.config.ts`, después de compilar. Cubren catálogo, los tres juegos, pistas, error y recuperación, errores persistentes, sesiones dirigidas, cambio de lección, foco y anchuras de 320, 390 y 1280 píxeles en Chromium y WebKit/iPhone.

Antes de publicar, validar `pnpm lint`, `pnpm typecheck`, `pnpm test` y `pnpm build` sobre producción más únicamente los archivos de esta funcionalidad. Los cambios editoriales previos sin commit quedan fuera de esta publicación.
