# Lección 5 · segunda presentación · 2026-11-06

## Archivo y método

Se materializó en la Mac el PDF exacto `第5课 - 2 祝你生日快乐.pdf` mediante Library. Tiene 54 páginas y 4 812 042 bytes; SHA-256 `d2190ba5d900ad38902bb1f29d5cbdfdb683f16bcddc466736f2e47f412c2e24`. El PDF y su recibo de identidad están en la carpeta privada de referencias, fuera del repositorio. Solo se versionan los datos curriculares pertinentes y su trazabilidad.

Se extrajo el texto de las 54 páginas y se inspeccionaron visualmente las páginas pertinentes a los ejemplos, ejercicios y conflictos. Se cotejaron las discrepancias con las páginas 7, 8, 12, 13, 18 y 19 del libro y la página 5 del cuaderno. Las referencias siguientes son páginas PDF, contadas desde 1. Es una revisión del modelo, no una revisión humana independiente.

## Decisiones documentales

| Presentación | Fuente primaria | Decisión |
| --- | --- | --- |
| 38 | Libro 13 (impresa 150), ejercicio II(3) | El contexto y el banco usan 她. La respuesta añadida con 他 no se adopta. La reconstrucción con 她 se registra como decisión editorial, sin atribuirle una clave impresa. |
| 41 | Libro 7–8 (impresas 144–145) | El brindis final corresponde a 大家. Las lecturas contextuales son 教 jiāo, 的 de y 还 hái; se conservan frente a jiào, dì y huán superpuestos. 咱们 zánmen y 干杯 gānbēi coinciden y no se registran como errores de esta presentación. |
| 43 | Libro 18 (impresa 155), diálogo 2 de 2-05-08 | Se conserva 属马／我也属马, con edades 18 y 30. 属龙 pertenece a la variante de la presentación. La práctica nueva adapta el texto impreso, sin afirmar que se haya escuchado la pista. |
| 50 | Cuaderno 5 (impresa 45), ejercicio 7(5) | La parte subrayada es 我 en 我就是马大为. La respuesta superpuesta 你是马大为吗？ pregunta sí/no. Se aclara el objetivo de la actividad y no se publica una clave oficial inventada. |
| 54 | Libro 19 (impresa 156), lectura II | La profesora tiene 35 años, 属牛; su hija tiene dos. El párrafo no fija un año de referencia. 1991 y 属龙 no se convierten en claves de nacimiento/signo. Se conservan las preguntas con una indicación de la información que falta. |

El último turno del diálogo de edad termina literalmente en 我今年30。; la actividad mantiene ese texto, sin añadir 岁 como si estuviera impreso. El cumpleaños de Lin Qiang conserva otro contexto: 1988, 32 años y 25 de octubre.

## Cambios en el corpus y la web

- Dos gramáticas: frecuencia con 常常／不常 y ofrecimiento con 来 + verbo.
- Seis ejemplos adicionales de 一下, con evidencia por ejemplo y objeto opcional en el patrón.
- Ocho actividades abiertas (`L5-task-30`–`L5-task-37`): completar vocabulario, peticiones breves, hábitos, 送／教, presentación personal y tres conversaciones escritas.
- Dos actividades existentes aclaran el foco de una pregunta y los límites de inferir fechas/signos; sus IDs se conservan.
- Siete registros de corrección nuevos conservan testigos primarios y secundarios. Los casos sin respuesta determinada mantienen `preferred: null`.
- Validación de referencias contra el archivo y número de páginas correctos, sin limitar artificialmente el manifiesto a cuatro fuentes.
- Proyección reproducible con campos explícitos; las evidencias y decisiones editoriales no se muestran en la interfaz del alumno.

El resultado tiene 13 gramáticas y 37 actividades. Se conservan las 87 palabras, 111 frases enlazadas, 27 turnos, 69 objetivos de escritura, cuatro lecturas y 22 frases de construcción. No se modifican IDs existentes, progreso, base de datos, imágenes ni grabaciones.

## Audio y validación

Los 255 clips y sus manifiestos se conservan. El fingerprint del manifiesto identifica el corpus usado al generar el audio; no se reescribe para aparentar una generación nueva. La prueba compara el inventario completo de texto, pinyin, ID y archivo con las filas que necesitan audio y verifica disponibilidad y cobertura en runtime.

La revisión se comprueba con la exportación `--check`, `query.py --lesson 5 --validate`, las pruebas documentales, lint, TypeScript, pruebas unitarias, build y el flujo L5 de Playwright en escritorio y móvil. La comprobación web sigue datos del corpus → proyección → currículo → páginas de gramática y ejercicios, incluyendo el diálogo canónico, audio existente y ausencia de desbordamiento horizontal. Los resultados de ejecución se documentan en el PR; este documento no certifica un despliegue.
