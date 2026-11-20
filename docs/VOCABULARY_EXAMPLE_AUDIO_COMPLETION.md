# Vocabulario Mix · audio de los ejemplos

Revisión del 20 de noviembre de 2026 sobre la versión publicada `b9cfd316a468bab847ddbfe7f46c409865646b47`.

En la ficha de 卧室, el reverso mostraba «我家有两个卧室。» con pinyin y traducción, pero no ofrecía audio. La revisión anterior había completado las palabras del anverso; las oraciones seleccionadas para el reverso mantenían una cobertura independiente e incompleta. El componente ocultaba el control cuando no encontraba una grabación de la oración y su lectura exactas.

Esta corrección cubre todos los ejemplos que devuelve `examplesForVocabularyCard`, incluidos los fragmentos documentados, las oraciones seleccionadas de pasajes largos, las variantes de cada lección y las fichas que las sesiones de Mix resuelven desde el catálogo activo. No cambia los textos, pinyin, traducciones, enlaces curriculares, IDs ni progreso guardado.

## Cobertura y corrección

- 1.135 lecturas únicas de ejemplos del catálogo y de todos los ámbitos de vocabulario.
- 1.125 lecturas alcanzables en Vocabulario Mix.
- 451 grabaciones nuevas y 2 grabaciones existentes reutilizadas por texto y pronunciación exactos.
- 1.135 MP3 utilizados: todos presentes, decodificables y con señal audible.
- Cero ejemplos pendientes de audio y cero archivos rotos o silenciosos.

Los dos recursos reutilizados son «说汉语» del material de Reto Mixto y «你喜欢吃什么？» del ensayo oral. Se comparten archivos ya existentes; no se recortan grabaciones nuevas ni se ensamblan sílabas. Las lecturas conservan tonos y sílabas neutras. Los recursos previos mantienen su prioridad.

## Comprobaciones

La decodificación y el análisis de señal PCM abarcan los 1.135 archivos. Los 451 nuevos tienen transcripción automática independiente y revisión de sus diferencias: 419 coincidencias literales, 21 escrituras homófonas, 10 etiquetas de interlocutor omitidas y 1 representación numérica equivalente; no quedan casos pendientes. Los hashes de todos los informes corresponden a los MP3 finales.

La comprobación es automática: no acredita escucha humana ni verificación fonética humana independiente. La señal confirma que el archivo contiene sonido; la transcripción aporta una comprobación adicional del contenido pronunciado.

Pasan 491 pruebas unitarias y 33 casos de Vocabulario Mix entre Chromium, móvil y WebKit iPhone. Las regresiones incluyen la oración de 卧室, los ejemplos de 睡觉, los cambios de ejemplo, reproducción real, pausa y reanudación. El estado de publicación en producción se verifica por separado; este documento registra la corrección y las pruebas locales.

## Comandos reproducibles

Desde la raíz del repositorio, con las dependencias instaladas:

```sh
pnpm audio:vocabulary:examples:audit --signal --output docs/vocabulary-example-audio-audit.json
pnpm audio:vocabulary:examples:verify
pnpm test
pnpm build
pnpm exec playwright test vocabulary-mix.spec.ts
```

El verificador se ejecuta sin llamadas de pago por defecto. La generación requiere la acción explícita `node scripts/generate-pronunciation-audio.mjs --scope=vocabulary-examples`; `--dry-run` comprueba el lote sin generar. La transcripción remota se activa únicamente con `node scripts/verify-vocabulary-example-audio.mjs --transcribe`. Las credenciales no se incluyen en el repositorio ni en el navegador. `--publish` del verificador registra localmente los archivos que superaron la verificación completa de señal; no despliega la web.

Informes de esta revisión:

- `vocabulary-example-audio-audit.json`: selección real de ejemplos, cobertura, rutas, hashes y señal.
- `vocabulary-example-audio-verification.json`: señal y hashes de las 451 grabaciones nuevas.
- `vocabulary-example-audio-transcription.json`: transcripciones independientes vinculadas al audio final.
- `vocabulary-example-audio-review.json`: clasificación de coincidencias y diferencias de transcripción, sin pendientes.
