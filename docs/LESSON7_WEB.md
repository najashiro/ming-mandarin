# Lección 07 en Míng · 20 de noviembre de 2026

La extensión 2.5.0 incorpora la lección 07 del libro básico y del cuaderno en el corpus y en la aplicación. El trabajo está en la rama `codex/lesson7-corpus-ming-20261120`, creada desde `0590473`, la versión local más reciente con L1–L6 y las mejoras de Mix. El usuario autorizó su publicación el 20-11-2026. Destino: [Míng · Lección 7](https://ming-mandarin-gamma.vercel.app/study/l7). El estado verificado del despliegue se registra por separado.

## Fuente y contenido

Los dos PDF aportados tienen 35 páginas; una página del cuaderno está repetida. Se revisaron las 34 páginas impresas distintas, conservando el duplicado como testigo. El OCR fue auxiliar de la revisión visual del modelo. No es una revisión humana independiente.

| Contenido | L7 |
| --- | ---: |
| Entradas de vocabulario | 70 |
| Diálogos completos / turnos | 2 / 35 |
| Frases enlazadas | 98 |
| Temas de gramática | 9 |
| Lecturas | 5 |
| Objetivos explícitos de escritura | 23 |
| Referencias adicionales de caracteres | 53 |
| Radicales definidos en el libro | 3 |
| Actividades documentales | 44 |
| Prácticas adaptadas del cuaderno | 18 |
| Respuestas de conversación guiada | 4 |

La fuente editable es [content.json](../MING_KNOWLEDGE/v2/lesson7/content.json). [SOURCE_REVIEW.md](../MING_KNOWLEDGE/v2/lesson7/SOURCE_REVIEW.md) documenta el contraste, las discrepancias y los límites de la fuente. [page-coverage.json](../MING_KNOWLEDGE/v2/lesson7/page-coverage.json) relaciona cada página con el contenido registrado. Los PDF y sus escaneos no forman parte de los archivos públicos.

Se separan el texto fuente, las lecturas y traducciones editoriales y las respuestas de práctica creadas para Míng. Las instrucciones didácticas del PDF se conservan como material de estudio. No se ejecutaron como instrucciones operativas.

## Integración

Se añadieron `/study/l7`, las unidades `7.1` y `7.2`, la tarjeta de curso y el repaso `/study/l1-l2-l3-l4-l5-l6-l7`. Están integrados vocabulario y búsqueda, Mix, diálogos, gramática, Hanzi y trazos, radicales, lecturas y cultura, ejercicios, cuaderno, conversación, reto mixto, práctica diaria, examen y catálogo administrativo. Se conservan las rutas, los IDs y el progreso de L1–L6.

Hanzi incorpora 72 archivos de trazos adicionales, con nombres de trazos comprobados. Consultar un carácter de referencia no lo convierte en objetivo de escritura. Las prioridades de Mix de los ámbitos anteriores conservan sus valores.

Las fichas y Mix de L7 respetan los sentidos locales: 哪里 `nǎli` como respuesta de modestia, 找 como dar cambio y 分 como centavo. Las imágenes aprobadas para otros sentidos no se reutilizan en esas fichas. El cuaderno conserva también la lectura contextual de 哪里. Los juegos distinguen una grabación ausente de un fallo al reproducir una grabación existente.

Los exámenes de L7 y de sus unidades tienen 20 preguntas y 100 puntos. Incluyen cinco preguntas de escucha con audio generado y lectura contextual exacta. Las prácticas calificables son adaptaciones Míng, no una clave oficial.

## Recursos incorporados

El usuario autorizó expresamente el lote el 20 de noviembre: «Sí, audios e imágenes». La revisión completa de las frases, lecturas y fragmentos de juegos dejó un manifiesto final de 261 variantes de texto y lectura. Se reutilizan además los recursos anteriores compatibles. [media-status.json](../MING_KNOWLEDGE/v2/lesson7/media-status.json) registra cero carencias de audio editorial, imágenes, fragmentos del constructor y fragmentos del cuaderno.

- **261 MP3** para palabras, ejemplos, caracteres, diálogos, gramática, cinco lecturas completas, juegos y las cinco actividades de escucha. [Manifiesto](../data/lesson7-audio.json), [señal](lesson7-audio-verification.json), [transcripción independiente](lesson7-audio-transcription.json) y [decisiones de revisión](lesson7-audio-review.json).
- **56 imágenes**: 20 fotografías creadas con la herramienta integrada `image_gen` y 36 diagramas SVG nativos para conceptos abstractos, cantidades, colores y relaciones. [Prompts completos](lesson7-image-prompts.json), [archivos y hashes](lesson7-image-assets.json) y [catálogo de recursos](../data/lesson7-media.json). Los maestros están en `output/imagegen/lesson7/`; las versiones web, en `public/images/vocabulary/lesson7/`.
- Transparencia, composición completa y sentido revisados visualmente por el modelo. Derivados adaptados al tamaño de pantalla, encuadre para juegos y máscaras de etiquetas latinas en Mix. Los diagramas con texto no habilitan preguntas calificables de imagen.
- Las ilustraciones contextuales `v-找@l7` y `v-分@l7` tienen revisiones independientes. Conservan las imágenes históricas y las decisiones administrativas por sentido.

Todos los audios decodifican y contienen señal audible. La transcripción independiente coincide literalmente en 214; las otras 47 diferencias tienen una decisión registrada por homofonía, formato numérico o revisión de audio con `gpt-audio-1.5`. Se revisaron con ese modelo 14 casos ambiguos y se corrigieron los que no pasaron. Son revisiones automáticas del modelo, no escucha humana independiente ni certificación exhaustiva de tonos. Las tres correcciones finales, los recortes de grabaciones auxiliares y las dos reutilizaciones homófonas conservan sus recibos y hashes.

Las cinco actividades de escucha ya se pueden realizar en Míng: 28 pistas con transcripción, pinyin, traducción y soluciones para los ejercicios. Se añadieron 17 grabaciones y se reutilizaron 11 compatibles. El texto de los cuatro diálogos impresos se conserva; los relatos, situaciones y respuestas del cuaderno son adaptaciones de Míng. La procedencia histórica de los archivos del libro y la ausencia de una clave oficial se conservan en el corpus, sin bloquear las prácticas ni mostrar avisos de audio pendiente al estudiante.

La generación de voz utilizó el servicio configurado de OpenAI: `gpt-4o-mini-tts` y tres correcciones con `gpt-audio-1.5`; la revisión usó `gpt-4o-transcribe` y `gpt-audio-1.5`. API contrastada con la [guía oficial de voz](https://developers.openai.com/api/docs/guides/text-to-speech) y la [guía oficial de audio](https://developers.openai.com/api/docs/guides/audio-chat-completions). No se guardaron credenciales en el proyecto.

## Validación

- Compilación de producción, TypeScript y ESLint correctos.
- 588 pruebas de aplicación y 193 pruebas del corpus correctas.
- Proyecciones reproducibles L1–L7 y snapshot documental v2.2 comprobados.
- Auditorías de traducciones, pinyin, clasificación visual, prioridades de Mix, apoyo de gramática y recursos pendientes comprobadas. El auditor de pinyin reconoce ahora los nombres de PDF en celdas Markdown con espacios, preservando los nombres originales.
- 39 casos de navegador validados en Chromium, móvil y WebKit/iPhone; cubren navegación L7, rutas históricas, diálogos completos, lecturas, actividades, fichas y trazos, conversación, los tres juegos del cuaderno y los sentidos de Mix. La regresión de audio comprueba que las grabaciones existentes siguen reproduciéndose y que un fallo de red permite reintentar sin perder la respuesta.

Los comandos de reproducción están en [README.md](../MING_KNOWLEDGE/v2/lesson7/README.md). Los registros y capturas locales están en `tmp/lesson7/` y `test-results/`, excluidos del repositorio. La verificación local no prueba el estado de producción ni el acceso a cuentas o bases de datos remotas.

## Producción comprobada

Publicada en [Míng · Lección 7](https://ming-mandarin-gamma.vercel.app/study/l7), despliegue `dpl_CV5Y9oFUUnxFCDiFk9gHdHWbJ7Ja`, estado `READY`, commit `7e0a04fbe5f1dcfde17e671be65328563b405c89`. El alias público apunta a ese despliegue. Los 585 archivos estáticos nuevos o actualizados coinciden por hash con el árbol verificado. Pasaron otros 21 casos de navegador contra producción en Chromium, móvil y WebKit/iPhone, incluida la reproducción de las cinco actividades de escucha y los sentidos locales de las imágenes. La consulta de logs no devolvió errores ni fallos fatales durante la comprobación. Véase [el registro de despliegue](lesson7-deployment.json).
