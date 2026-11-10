# Escondites: audio y vocabulario dentro de la ruta L1–L6

La revisión aprobada el 10 de noviembre de 2026 utiliza animales documentados antes de L6 y respuestas breves ya presentes en el corpus. No cambia el corpus, sus IDs, objetivos de escritura ni progreso. Las preguntas completas y las pistas son combinaciones editoriales Míng para practicar la gramática L6; no se presentan como citas ni respuestas oficiales del libro.

| Uso | Chino | Pinyin | Español | Evidencia del término |
| --- | --- | --- | --- | --- |
| Conejo | 兔 | tù | conejo | L5, libro básico, PDF 18; etiqueta contextual del zodiaco, `v-兔` |
| Perro | 狗 | gǒu | perro | L3, libro básico, PDF 4 / impresa 91; vocabulario principal, `v-狗` |
| Gato | 猫 | māo | gato | L3.1, PPT, PDF 24; extensión de aula en 一只猫, `v-猫` |
| Ratón | 老鼠 | lǎoshǔ | ratón | L5, libro básico, PDF 16; vocabulario suplementario, `v-老鼠` |
| Acierto | 对！ | Duì! | ¡Correcto! | L2.2, PPT, PDF 23; respuesta impresa 对; además palabra formal L4 |
| Error | 不对。 | Bú duì. | Incorrecto. | L2.2, PPT, PDF 23; respuesta impresa 不对 |

Los animales se consultan en `data/lessons123-public.json` y `MING_KNOWLEDGE/v2/lesson5/content.json` (proyección `data/lesson5-public.json`). La glosa de 兔 es editorial; su carácter y pinyin están documentados. La evidencia de 对 / 不对 es el registro `EX-SRC-PPT-02-2-023-true-false` del corpus normalizado, con `answer_status: answers_printed`. 对 también figura en `MING_KNOWLEDGE/v2/lesson4/textbook-vocabulary.tsv`, tabla `L4-T1`, fila documental 13.1, PDF 4 / impresa 116. El pinyin del feedback y su puntuación son presentación editorial: 不 se pronuncia bú ante el cuarto tono de 对.

`data/hide-and-seek-language.json` comparte texto, pinyin, español y referencias entre interfaz y preparación de audio. Las preguntas son 兔在哪儿？, 狗在哪儿？, 猫在哪儿？ y 老鼠在哪儿？. La tortuga, 兔子 y las expresiones 答对了 / 答错了 / 再试试 dejan de formar parte del contenido activo de este juego. Los archivos de audio históricos permanecen intactos para conservar referencias anteriores.

`hideAnimal` y `hideAnimalAudio` proporcionan el nombre aislado y reutilizan los MP3 existentes de L3/L5. `hideQuestion` y `hideQuestionAudio` seleccionan la pregunta del personaje actual. `hideRoundAudio` mantiene únicamente la pista; la interfaz antepone la pregunta en una sola secuencia. `hideFeedback` y `hideFeedbackAudio` resuelven 对！ para acierto y 不对。 para ambos errores, sin vocabulario adicional. La grabación de 对 se reutiliza de L4.

Se generan únicamente tres MP3 nuevos, solicitados como parte de esta revisión: 兔在哪儿？, 老鼠在哪儿？ y 不对。 Los otros 24 clips del manifiesto activo se conservan byte por byte. Los cinco audios aislados reutilizados permanecen en `/audio/mandarin/` y no se duplican ni regeneran.

Preparación y comprobación reproducibles sin llamadas pagadas:

```sh
node scripts/prepare-hide-and-seek-audio.mjs
node scripts/generate-pronunciation-audio.mjs --scope=hide-and-seek --dry-run
node scripts/verify-hide-and-seek-audio.mjs
pnpm exec vitest run tests/unit/hide-and-seek-audio.test.ts tests/unit/hide-and-seek.test.ts
```

Con generación autorizada, el generador existente usa voz `marin`, modelo `gpt-4o-mini-tts` y salida MP3. `scripts/verify-hide-and-seek-audio.mjs --transcribe` realiza la revisión automática autorizada. `docs/hide-and-seek-audio-review.json` guarda hashes, transcripción sin texto esperado suministrado al reconocedor y métricas de señal PCM de los diez audios de animales, preguntas y feedback activos. No es una revisión humana independiente ni certifica por sí sola todos los tonos. Las pruebas unitarias comprueban las palabras y pinyin contra las proyecciones del corpus, los MP3 reales y el orden de las dos pistas del nivel final.

Las tres grabaciones nuevas coinciden literalmente con la transcripción automática. Los audios aislados existentes de 兔 y 猫 produjeron transcripciones latinas ambiguas al verificarse solos; una segunda comprobación de los cuatro MP3 de animales concatenados, separados por medio segundo de silencio y sin aportar el texto esperado, reconoció exactamente «兔、狗、猫、老鼠». El informe conserva ambos resultados individuales y la comprobación de secuencia, sin ocultar la limitación del reconocedor para sílabas aisladas.
