# Integración de la lección 6

La lección 6 está integrada localmente en `/study/l6` y en el alcance acumulado `/study/l1-l2-l3-l4-l5-l6`. Incluye vocabulario, Hanzi y trazos, diálogos, gramática, lecturas, ejercicios, prácticas del cuaderno, conversación, reto mixto y examen. Se conservan los alcances, identificadores y recursos anteriores.

## Corpus y contraste

- 74 entradas de vocabulario, 31 turnos de diálogo y 76 frases enlazadas.
- 29 objetivos de escritura, 8 puntos de gramática, 4 lecturas y 38 actividades documentales.
- 93 páginas inventariadas: 22 del libro básico, 9 del cuaderno y 62 de la presentación.
- 11 observaciones de contraste documentadas con páginas PDF y páginas impresas cuando existen, en [SOURCE_REVIEW.md](../MING_KNOWLEDGE/v2/lesson6/SOURCE_REVIEW.md).

Los libros prevalecen sobre la presentación. Las variaciones de mapas y situaciones se conservan por actividad; no se convierten en contradicciones artificiales. Las lecturas canónicas existentes se mantienen. Los campos de fuente y las traducciones, explicaciones y adaptaciones editoriales Míng se distinguen. Los 16 retos interactivos del cuaderno son adaptaciones editoriales, no respuestas oficiales.

La fuente editable y las instrucciones de exportación están en [el directorio de la lección](../MING_KNOWLEDGE/v2/lesson6/README.md). Los PDF y escaneos originales no se publican en la web.

## Recursos pendientes

Faltan las grabaciones originales 2-06-01 a 2-06-08 y 06-1 a 06-3, una clave oficial de respuestas y una ficha independiente de Hanzi. Cinco grupos de actividades requieren audio original y permanecen señalados. El laberinto y la ilustración de la fiesta requieren consultar la página original; no se reprodujeron sus imágenes. No se generaron audios ni fotografías nuevos.

## Verificación

- TypeScript y compilación de producción: correctos.
- 387 pruebas unitarias y 188 pruebas Python del corpus: correctas.
- 21 pruebas de navegador de las lecciones 5 y 6: correctas en Chromium, Chromium móvil y WebKit iPhone. Incluyen navegación histórica L1–L5, módulos L6, vocabulario, trazos, conversación y tres modalidades del cuaderno.
- Exportaciones históricas y L6, auditorías documentales y validación de referencias L6: correctas.
- Lint: cero errores; una advertencia preexistente en `tmp/lesson5/verify-deployed.mjs`.

Los cambios son locales. No se realizó un despliegue de producción. Se conservaron las modificaciones que ya estaban presentes en el espacio de trabajo.
