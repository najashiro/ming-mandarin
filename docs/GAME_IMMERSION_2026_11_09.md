# Audio y refuerzo de juegos · 2026-11-09

Base de publicación: `01eaaab776d73eae7c1d67a9319382430d6daf3e`, la versión L6 en producción. Rama aislada: `codex/immersive-games-20261109`.

El usuario pidió corregir y publicar Constructor de frases, El carácter que falta, Conecta la conversación, Organiza el cumpleaños y Conversación; autorizó usar su clave para los audios faltantes.

- Cada ficha u opción seleccionada reproduce su audio desde el gesto del alumno. Al comprobar se escucha la frase modelo completa, también como corrección de un error.
- Las conversaciones reproducen la frase inicial y conservan un botón junto a ella para repetir o iniciar si el navegador bloquea el sonido automático.
- Un solo foco de reproducción impide voces simultáneas. Se cancela al avanzar, cambiar de nivel/misión o cerrar; un fallo ofrece reintentar sin perder la respuesta.
- El refuerzo presenta Hanzi grande, pinyin de 18 px y traducción de 15 px mediante dos controles independientes. Las ayudas quedan ocultas en cada nueva ronda. Se conservan enlaces Hanzi del cumpleaños y las reglas de progreso.
- El carácter que falta muestra y reproduce la frase completada, no solo la letra elegida. Las 96 preguntas del cuaderno L1–L6 disponen de lectura y traducción.
- Se corrigió el desbordamiento intrínseco del selector de lección en WebKit a 320 px.

## Contenido y audio

`data/workbook-language-support.json` añade una capa de apoyo al banco editorial existente, sin cambiar chino, soluciones aceptadas, IDs, fuentes ni proyecciones del corpus. Reutiliza coincidencias exactas con las lecturas/traducciones públicas; las frases completadas y respuestas adaptadas que no tenían coincidencia recibieron apoyo editorial de Míng siguiendo las convenciones de `MING_KNOWLEDGE/v2/PINYIN_MING.md` y `TRANSLATIONS_MING.md`. No se atribuyen a una clave oficial ni a una revisión humana independiente. El contexto histórico de 2020 se conserva en las explicaciones de edad.

151 MP3 suplementarios (~6 MB), generados con la API autorizada, `gpt-4o-mini-tts`, voz `marin`. La clave se leyó del entorno local y nunca se incluye en el navegador ni en Git. No hay llamadas de pago al jugar. El manifiesto es `data/game-audio.json`; solo se registran archivos verificados en `game-audio-available.json`.

Todos los archivos se decodificaron en Chromium, verificando duración y señal RMS (`docs/game-audio-signal.json`). Se transcribieron automáticamente los 151 clips y se refinaron 19 con guías de pronunciación; se volvió a comprobar el grupo de caracteres aislados. Las transcripciones de sílabas aisladas pueden contener homófonos, variantes tradicionales y errores de reconocimiento; esta comprobación no certifica pronunciación humana. Los informes brutos y scripts de diagnóstico temporales quedan fuera de Git.

Generación explícita: `node scripts/generate-pronunciation-audio.mjs --scope=games` (requiere la clave configurada y autorización para gasto). Verificación local sin API: `node scripts/verify-game-audio.mjs --publish`. La cobertura de todos los textos utilizados se valida en `tests/unit/game-audio-feedback.test.ts`.

## Validación

- Lint, TypeScript y compilación de producción.
- 390 pruebas unitarias.
- 30 pruebas Playwright en Chromium y WebKit/iPhone: audio real, aciertos y errores, ayudas, reinicios, duplicados, recuperación y diseño a 320/390/1280 px.
- No se fusiona a main; la publicación usa el commit de esta rama sobre la versión ya desplegada.
