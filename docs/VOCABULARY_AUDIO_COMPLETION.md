# Vocabulario y Vocabulario Mix · audio completo

Revisión del 20 de noviembre de 2026 sobre la versión publicada `5b3fd75569b95d7cc2058096e460a0b7f8bb0bad`.

El botón de «教学楼» no aparecía porque el resolver común no incluía su grabación del juego Direcciones. Además, varias incorporaciones de vocabulario y dos lecturas corregidas carecían de grabación.

La corrección reutiliza 15 grabaciones exactas de Direcciones/Escondites y añade 47 MP3 estáticos para las lecturas faltantes de las seis lecciones. El usuario solicitó revisar y corregir las palabras sin audio y publicar. Se conserva la voz generada por IA, la selección curricular, los IDs y el progreso. La coincidencia exige texto y pinyin; no elimina tonos ni sustituye lecturas de homógrafos. Las grabaciones existentes conservan su prioridad.

## Cobertura verificada

- Catálogo activo: 560 palabras.
- Catálogo y variantes específicas de las lecciones: 568 combinaciones de ID, texto y pinyin.
- Mix acumulado L1–L6: 520 palabras; unión de variantes de todos sus ámbitos: 530.
- MP3 únicos utilizados: 562. Ningún recurso faltante, roto o sin señal audible.
- 47 grabaciones nuevas comprobadas mediante transcripción automática independiente: 16 coincidencias literales, 28 escrituras tradicionales equivalentes y 3 homófonos equivalentes. Se repararon clips sin señal o con reconocimiento discrepante antes de publicar. Esta comprobación automática no equivale a una revisión fonética humana.

## Validación reproducible

`pnpm audio:vocabulary:audit --signal --output docs/vocabulary-audio-audit.json` comprueba el catálogo real, todos los ámbitos de Vocabulario/Mix, lectura exacta, existencia, hashes y señal PCM.

La generación es explícita mediante `node scripts/generate-pronunciation-audio.mjs --scope=vocabulary`. Omite archivos existentes; `--dry-run` no llama a la API. El manifiesto disponible solo incluye archivos verificados. Las credenciales permanecen fuera del repositorio y del navegador.

Validaciones de esta revisión: ESLint, TypeScript, build de producción, 488 pruebas unitarias y 27 casos de Vocabulario Mix entre Chromium, móvil y WebKit iPhone. La regresión de 教学楼 verifica MP3 real y reproducción nativa en pregunta/respuesta. La secuencia 教学楼→体育馆 verifica detener audio, fallback manual cuando se bloquea autoplay y pausa/recarga/reanudación sin perder progreso.

Informes: `vocabulary-audio-audit.json`, `vocabulary-completion-audio-signal.json` y `vocabulary-audio-transcription.json`. El alcance de cobertura completa es vocabulario; los ejemplos y frases del corpus mantienen su cobertura independiente.
