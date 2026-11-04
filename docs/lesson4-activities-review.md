# Lección 4: actividades con sus premisas

Revisión: 4 de noviembre de 2026. Se abrieron las 11 páginas del PDF original del libro de ejercicios (páginas impresas 29–39), incluidas ampliaciones de las páginas 6, 7 y 9. Es un PDF de imágenes: la extracción nativa no devuelve texto. Los renders y el informe por página quedan en `tmp/pdfs/workbook/`; ningún escaneo se publica en la web.

`scripts/lesson4_activities.py` mantiene las 62 actividades y sus identificadores: 27 del libro de texto, 24 del libro de ejercicios y 11 de las presentaciones. Conserva `title`, `texts` y `requiresOriginalAudio`, y añade una estructura para las 251 consignas, las opciones rotuladas, los subrayados, las sustituciones y los modelos impresos. Los dos libros se presentan antes de las diapositivas.

## Premisas restituidas

| Actividad | Material necesario |
| --- | --- |
| BOOK 01-03 | Cuatro relojes a–d, reconstruidos con SVG: 2:00, 8:00, 3:30 y 10:10. Lectura visual confirmada de PDF 1. |
| BOOK 17-03 | Horario completo de 林娜, 11 filas, bloque 17-02. |
| BOOK 18-01 | Descripciones accesibles de ambas escenas, verificadas en PDF 18; la segunda muestra los corredores en un bocadillo. |
| BOOK 19-03 y 20-02 | Lecturas 19-02 y 20-01 junto a sus preguntas. |
| BOOK 20-04 | Las dos partes del horario personal: 20-05 y 21-01, nueve filas en total. |
| BOOK 21-02 | Modelo de escritura 21-03. |
| WB 02-03 | Tabla Horario/Actividad de 02-04, diez filas con casillas aún vacías. |
| WB 06-03 | Cuadrícula 07-01, cuatro filas y cinco columnas. |
| WB 09-02 y 10-01 | Lecturas 09-01 y 09-03 junto a sus preguntas y apoyos de lengua. |
| WB 10-02 | Horario de clases 10-03 y ambos paneles de símbolos 10-04, con descripción accesible. |
| WB 11-01 | Texto visible de la cabecera del periódico 11-02. |
| WB 11-03 | Modelo de escritura 11-04 y vínculo de regreso a la entrevista. |
| PPT 1, 03-01 y 12-01 | Descripciones documentadas de sus relojes, sin convertir posiciones ambiguas en minutos exactos. |

Las descripciones de escenas y los subrayados de las invitaciones de BOOK 20-03 se verificaron con el revisor de las páginas 14–25 del libro. La primera escena describe una invitación al cine y «Vale»; la segunda una propuesta de correr rechazada. No se necesita inferir el género de los personajes para trabajar los diálogos.

## Presentación y límites

`DocumentaryActivities` es un componente de servidor. Los datos ampliados residen en `data/lesson4-study-reference.json`, separado del corpus que usa el cliente de tarjetas. Las tablas emplean HTML semántico y desplazamiento horizontal local; las opciones se presentan por separado; las traducciones y soluciones ya impresas en las presentaciones tienen desplegables propios. No se añaden claves, calificación automática ni respuestas manuscritas. Ocho actividades conservan su dependencia de la grabación original.

La revisión visual detectó discrepancias documentales en los pronombres de WB 09 y WB 10, y en el tono de `xuésheng` de WB 06 y WB 07. Las corrige la capa documental/editorial; el generador de actividades consume esa misma capa y no mantiene otra transcripción paralela. La lectura de `只 zhǐ` y los cinco desgloses de caracteres de WB 03 se comunicaron al responsable del módulo de caracteres.

## Comprobación

- `tests/unit/lesson4-activities.test.ts`: seis pruebas de integridad, premisas y renderizado semántico.
- `tests/e2e/lesson4-activities.spec.ts`: apertura y uso de actividades a 320 px, lectura/traducción, opciones, símbolos, relojes y regresión de las actividades de la lección 5.
- TypeScript, ESLint de los componentes y compilación del helper Python.

Las capturas de la prueba de navegador se guardan en `test-results/`; no son contenido publicado.
