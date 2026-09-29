# Lección 4 · cierre documental v2.2.0

La base documental de los seis PDF vigentes está extraída e integrada en la consulta global L1–L4. Esta entrega no implementa la interfaz del capítulo ni genera audios, imágenes o respuestas dependientes de grabaciones ausentes.

## Fuentes actuales

| Fuente | PDF | Páginas impresas |
|---|---:|---|
| Libro Basico 1 - Lección 4.pdf | 25 | 113–137 |
| Libro de Ejercicios Basico 1 - Lección 4.pdf | 11 | 29–39 |
| Presentación 4.1 | 43 | — |
| Presentación 4.2 | 34 | — |
| Hanzi 4.1 | 4 | — |
| Hanzi 4.2 | 4 | — |

Total: **121 páginas**, **295 bloques curriculares** y **3.870 campos indexados**. `page-coverage.tsv` enumera cada página y sus bloques; los campos completos se consultan en `document_blocks` / `document_items`. Las imágenes se documentan mediante transcripción de tablas, etiquetas y relaciones visibles, más descripciones editoriales separadas; no se almacenan escaneos ni se afirma reproducir facsímiles o SVG de trazos.

## Contenido estructurado

- Vocabulario del libro: **63 filas**, **56 entradas numeradas + 7 subentradas**, tres listas. Las repeticiones y sus páginas son evidencia, no palabras nuevas ficticias.
- Vocabulario L4 con evidencia propia: **115 IDs**, de los que **86 son adiciones** a los 346 anteriores; los contextuales se distinguen de las listas impresas.
- Frases con evidencia L4: **660 IDs**; **656 nuevos** y cuatro compartidos con L1–L3. Contenido de celdas, preguntas y contraejemplos no se convierte automáticamente en oración positiva.
- **62 conjuntos/continuaciones de ejercicios**, **251 ítems**, **6 lecturas**, **3 modelos de escritura**, **25 tablas no léxicas** y **38 registros visuales**.
- **94 apariciones de objetivos de escritura**: 66 filas de las hojas y 28 registros del libro/cuaderno. Hay 54 caracteres distintos en las dos hojas; los otros caracteres encontrados no se convierten en objetivos de escritura.
- Los dos diálogos principales del libro: **27 turnos canónicos**; otros 27 turnos docentes se conservan exclusivamente como testigos secundarios.
- Gramática, notas, fonética, radicales, estructuras, autoevaluación y cultura conservan sus campos y relaciones de origen. Los registros gramaticales fuente no se contabilizan como conceptos únicos deduplicados.

## Consulta sin releer PDF

```sh
python3 MING_KNOWLEDGE/v2/query.py --summary
python3 MING_KNOWLEDGE/v2/query.py --word 只 --lesson 4 --limit 8
python3 MING_KNOWLEDGE/v2/query.py --word 点 --lesson 4 --limit 8
python3 MING_KNOWLEDGE/v2/query.py --table document_blocks --lesson 4 --limit 20
python3 MING_KNOWLEDGE/v2/query.py --source SRC-WB-04 --page 9 --limit 20
python3 MING_KNOWLEDGE/v2/query.py --table readings --lesson 4 --limit 20
python3 MING_KNOWLEDGE/v2/lesson4/audit.py --canonical-dialogues --limit 100
python3 MING_KNOWLEDGE/v2/lesson4/audit.py --release-check
```

El paquete `documents/manifest.json` usa fragmentos base64+xz comprobados por SHA-256, como el paquete base anterior: contiene JSON curricular, **no bytes de PDF/imágenes**. `compile_v22.py` los expande a tablas legibles bajo `.cache-v22/`; no cargar los fragmentos codificados en el contexto del agente.

## Autoridad y preservación

Se aplica `../../SOURCE_AUTHORITY.json`: los libros básico y de ejercicios prevalecen sobre las presentaciones y hojas para un mismo contexto. No hay un orden arbitrario para contradicciones entre los dos libros. Los diálogos principales son íntegramente los del libro (宋华; 七点半我回学校; 我学英语). Las variantes docentes permanecen para auditoría, sin mezclarse en el banco principal.

Las lecturas aisladas 差 chā y 只 zhī de las hojas siguen intactas. Para el contexto L4 se seleccionan las del libro: 差 chà, 只 zhǐ, 时间 shíjiān e 意思 yìsi. `lesson4_selection` conserva el contexto explícito, sin destruir las lecturas/sentidos de L1–L3.

Los nombres corregidos y la eliminación de la página impresa 120 duplicada están registrados en `source-revisions.json`. La paginación actual del texto es consecutiva: PDF8=120, PDF9=121 y PDF16=128. Los IDs anteriores se preservan.

## Límites documentales, no trabajo de extracción omitido

No se suministraron grabaciones originales. Sus instrucciones, opciones y huecos sí están registrados; las respuestas no se fabrican. Tampoco son claves oficiales las respuestas manuscritas. Los pinyin/español ausentes en los originales permanecen nulos y separados de las anotaciones editoriales. Completar esos apoyos para cada nueva ficha es una capa posterior, no transcripción de la fuente.

Las afirmaciones culturales se conservan como contenido del material, no como cifras contemporáneas verificadas externamente. El texto nativo oculto por una imagen queda solo en la caché, no se promueve a contenido visible del alumno. Marcas de agua, publicidad y celdas de caligrafía repetidas no generan entradas léxicas.

## Integración y validación

`query.py` integra L4 en el corpus global; `query_v21.py` mantiene la base anterior reproducible. No se debilitaron sus pruebas: los lotes previos de traducción, pinyin, radicales y clasificación visual se comprueban en su ámbito original y las nuevas pruebas comprueban la unión y las regresiones.

`python3 scripts/export-corpus-v22.py --check` verifica la proyección v2.2 por huella reproducible. El exportador genera un archivo de trabajo ignorado; **no cambia el import de la aplicación**. `scripts/export-corpus-v21.py --check` sigue comprobando que el contenido público anterior no fue alterado.

El resultado de cierre depende de las fuentes, los vínculos y las pruebas globales, no de fijar una etiqueta `ready` a mano. Ver `../RELEASE_2_2_0.md` para resultados y alcance. Revisión realizada por el modelo; no se afirma auditoría lingüística humana independiente.
