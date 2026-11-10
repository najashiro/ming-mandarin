# Escondites: preguntas y respuestas habladas

La mejora añade siete grabaciones estáticas: una pregunta por personaje y tres respuestas al elegir un escondite. Las 22 grabaciones previas, sus IDs y sus entradas del manifiesto se conservan. No se modifica el corpus, los objetivos de escritura ni el progreso.

| Situación | Chino | Pinyin | Español |
| --- | --- | --- | --- |
| Conejo | 兔子在哪儿？ | Tùzi zài nǎr? | ¿Dónde está el conejo? |
| Perro | 狗在哪儿？ | Gǒu zài nǎr? | ¿Dónde está el perro? |
| Gato | 猫在哪儿？ | Māo zài nǎr? | ¿Dónde está el gato? |
| Tortuga | 乌龟在哪儿？ | Wūguī zài nǎr? | ¿Dónde está la tortuga? |
| Acierto | 答对了！ | Dá duì le! | ¡Acertaste! |
| Primer error | 答错了，再试试！ | Dá cuò le, zài shìshi! | No acertaste. ¡Inténtalo otra vez! |
| Segundo error | 答错了。 | Dá cuò le. | No acertaste. |

`data/hide-and-seek-language.json` es la fuente compartida para interfaz y preparación de audio. Estos enunciados, su pinyin y sus traducciones completas son adaptación editorial Míng; no son citas ni respuestas oficiales del libro. 狗 y 猫 conservan las lecturas `v-狗` y `v-猫` de `data/lessons123-public.json`; 乌龟 conserva `wūguī` de la lectura L6 `r-l6-turtles`. 兔子 es vocabulario de personaje adicional, verificado en el [Diccionario conciso del Ministerio de Educación](https://dict.concised.moe.edu.tw/dictView.jsp?ID=11569&la=0&powerMode=0), con 子 neutro. Las respuestas usan 答 «responder» con los complementos de resultado 对 «correcto» y 错 «equivocado»; no se usa 都 (*dōu*, «todos») para indicar un acierto.

`hideQuestion` y `hideQuestionAudio` seleccionan la pregunta del personaje actual. `hideRoundAudio` mantiene únicamente la pista: el consumidor antepone la pregunta en una sola secuencia. `hideFeedback` y `hideFeedbackAudio` distinguen acierto, error con otro intento y error final, para no invitar a reintentar una ronda ya terminada.

Preparación reproducible sin llamadas pagadas:

```sh
node scripts/prepare-hide-and-seek-audio.mjs
node scripts/generate-pronunciation-audio.mjs --scope=hide-and-seek --dry-run
pnpm exec vitest run tests/unit/hide-and-seek-audio.test.ts tests/unit/hide-and-seek.test.ts
```

Las siete grabaciones nuevas fueron solicitadas por el usuario. Se generaron con el generador existente, con voz `marin` y MP3 estáticos. `docs/hide-and-seek-audio-review.json` registra la transcripción automática y SHA-256 de cada grabación nueva. Esta comprobación no es una revisión humana independiente ni certifica por sí sola todos los tonos. Las pruebas unitarias comprueban cobertura de personajes, variantes de respuesta, archivos reales y orden de las pistas del nivel final.
