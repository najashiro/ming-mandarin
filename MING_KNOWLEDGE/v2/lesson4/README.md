# Lección 4 · cierre documental v2.2.0

## Revisión de apoyos y tarjetas · 2026-11-04

La revisión autorizada por el usuario añade `language-support.json`: 42 apoyos
léxicos y 287 apoyos de frases, más 37 glosas de caracteres con su lectura
aislada exacta. `lesson4_support.py` los aplica como campos editoriales separados.
Esta capa editorial preserva testigos, variantes, IDs, listas del libro y lecturas
de las hojas. Las correcciones de transcripción detectadas en la relectura de PDF
se registran aparte, como se explica más abajo. Las traducciones ya registradas de los 27 turnos del libro también se
resuelven en los ejemplos de las tarjetas; antes solo aparecían en Diálogos.

La web pasa de 73 a **114 entradas L4** con pinyin y español completos. La
secuencia 汉西英 sigue identificando los idiomas de una carrera dentro de su
frase, y no se publica como palabra independiente. Los ejemplos de libro/cuaderno
L4 se presentan primero; luego los libros de lecciones anteriores y, finalmente,
los testigos complementarios. No se borran ejemplos por su procedencia.

**326 de las 328 frases publicadas** tienen pinyin y español completos, incluidas
las seis lecturas. Las dos restantes son plantillas incompletas con huecos o
elipsis: se conservan documentalmente y se excluyen de ejemplos de tarjetas.
99 de las 114 palabras tienen ejemplos fuente elegibles y completos; las otras
15, entre ellas 上 y 下, no reciben frases inventadas. Los 54 caracteres de las hojas
tienen una glosa para su lectura propia: 只 zhī como clasificador y 差 chā como
diferencia se mantienen separados de las palabras contextuales 只 zhǐ y 差 chà.

Las correcciones visibles de pinyin conservan el valor original y una razón
explícita, por ejemplo `Hàizì` → `Hànzì` y `Xiàzài` → `Xiànzài`. Las glosas
españolas o de pronunciación incrustadas en el chino se eliminan únicamente del
campo editorial `hanzi_display`. Dos traducciones recuperadas de notas del libro
tienen prioridad sobre el apoyo editorial, con su localizador propio.

El exportador genera también `data/lesson4-audio-aliases.json`: ocho
enlaces a grabaciones existentes para cuatro lecturas que antes no tenían pinyin
escrito, tres ejemplos con correcciones ortográficas de pinyin y una lectura con
tres correcciones gráficas 他→她. Esta última exige el input original exacto y
el mismo pinyin documental; las otras exigen identidad del texto chino. Todas
requieren disponibilidad del archivo. No se
genera audio ni se relaja la selección de lecturas de palabras polisémicas.

### Relectura visual de los PDF originales

`book-review.json` registra el cotejo visual de las páginas PDF 1–13 del libro
(impresas 113–125) y ocho vínculos de colocaciones con sus filas de vocabulario.
La selección de `十点十分` usa el testigo completo de la página 7; conserva sin
rellenar el testigo `十点十分____` del ejercicio de la página 1 y su ID compartido.
Las tarjetas también recuperan la categoría gramatical impresa.

`source-corrections.json` conserva seis correcciones exactas de campos: los tres
pronombres femeninos de la lectura 陈明 (cuaderno PDF 9), el pronombre y pinyin
de su pregunta ② (PDF 10), `xuésheng` neutro en PDF 6/7 y dos transcripciones
literales del artículo cultural (libro PDF 24). El paquete de extracción original
permanece congelado. `lesson4_source_corrections.py` valida los valores anteriores
antes de aplicar la corrección, mantiene cinco IDs publicados de frases y testigos
y recompila sus vínculos léxicos con 她/她们. No se corrige 他们 fuera de esos campos.

Las tablas de consulta `lesson4_source_corrections`, `lesson4_book_review` y
`lesson4_grammar_table_support` exponen la trazabilidad. Las regresiones están en
`test_lesson4_pdf_reread.py`; no se han añadido claves de escucha.

Consulta `query.py --table lesson4_language_support`,
`--table lesson4_character_support` o `--word 每天 --lesson 4`.
La validación incluye `test_lesson4_support.py`, las pruebas documentales
anteriores y `scripts/export-lesson4-web.py --check`. Esta revisión no certifica
revisión lingüística humana independiente ni un despliegue en producción.

Los apartados siguientes documentan el cierre y las ampliaciones anteriores.

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

## Dos ejemplos recuperados (2026-10-02)

`example-support.json` registra dos asociaciones pedagógicas limitadas a frases
concretas: 回 mediante 回学校 en `PH-f9131d33151602a9`, y
里卡多帕尔玛大学 mediante el nombre completo del Instituto Confucio en
`PH-05f97f56e77b1b66`. `lesson4_examples.py` las valida y aplica después de
compilar los testigos L4. No hay herencia por substring ni transitividad; los
IDs, tokens léxicos, listas y asignaciones curriculares se conservan.

El español de 回 se recupera literalmente de la primera línea de la nota
`L4-BOOK-04-07-01` (PDF 7, impresa 119); su localizador queda separado del
turno del diálogo en PDF 6. El pinyin y español de la universidad son apoyo
editorial autorizado, en `pinyin_ming` y `traduccion_ming`, sin alterar campos
ni variantes documentales. No se afirma revisión lingüística humana
independiente. Su alcance es el ejemplo de vocabulario; no habilita por sí
solo un nuevo ejercicio de ordenar frases.

La exportación reproducible resuelve los apoyos, sin mostrar sus metadatos al
alumno. La traducción documental tiene prioridad también al mostrar el turno
canónico. Las fichas L4 con ejemplos pasan de 70 a 72 de 73; 下 sigue sin un
ejemplo aprobado. El nombre largo no se añade al vocabulario publicado.
