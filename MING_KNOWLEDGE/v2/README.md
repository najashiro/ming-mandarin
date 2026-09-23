# MÍNG · Corpus enlazado L1–L3 · v2.0.0

Base de consulta de fuentes, **no cambio del contenido desplegado de la app**.
Corte documental y de código: 23-09-2026. Instantánea de `main`:
`b952c16360cd85c25205b49db5c23c543f553dcd`.

## Consultar sin PDF y sin cargar todo en el contexto

Python 3.10+; solo biblioteca estándar. Desde la raíz del repositorio:

```bash
python3 MING_KNOWLEDGE/v2/query.py --summary
python3 MING_KNOWLEDGE/v2/query.py --word 喜欢 --limit 8
python3 MING_KNOWLEDGE/v2/query.py --word 工作 --limit 8
python3 MING_KNOWLEDGE/v2/query.py --phrase '你今年多大？'
python3 MING_KNOWLEDGE/v2/query.py --source SRC-PPT-03-2 --page 6 --limit 10
python3 MING_KNOWLEDGE/v2/query.py --table hanzi_evidence --lesson 3 --limit 20
python3 MING_KNOWLEDGE/v2/query.py --table matrix --lesson 3 --fields id,hanzi,phrase_count,ming_vocabulary,ming_hanzi
python3 MING_KNOWLEDGE/v2/query.py --validate
python3 MING_KNOWLEDGE/v2/query.py --export /tmp/ming-corpus-tables
```

La primera consulta comprueba hashes y construye las tablas en `.cache/`; las
siguientes reutilizan esa caché. No necesita `pip install`, Internet, API de IA,
base de datos, credenciales ni los PDF. `--offset` permite paginar. Usa `--full`
solo cuando necesites todos los testigos y variantes de un registro.

## Inventario

| Dominio | Registros | Qué se cuenta |
|---|---:|---|
| Fuentes | 21 | Libros, cuadernos, PPT, hojas Hanzi y patrón de examen |
| Páginas inventariadas | 540 | Incluye el bloque fonético previo, separado del currículo |
| Registro de vocabulario/expresiones | 346 | 293 entradas listadas y 53 tokens contextuales; no 346 palabras nuevas |
| Enunciados únicos | 643 | Frases, fragmentos, lecturas, ejercicios y contraejemplos |
| Testigos de enunciados | 839 | Se mantiene cada fuente/página/versión |
| Relaciones palabra–enunciado | 3305 | Tokens y expresiones; no mera coincidencia de caracteres |
| Ocurrencias con posiciones | 4511 | Posiciones Unicode sobre el testigo literal |
| Entidades Hanzi encontradas | 325 | No equivale a una lista de escritura obligatoria |
| Hanzi con evidencia de escritura | 164 | Evidencias de libro/hojas; el rol de cada fuente se conserva |
| Filas/testigos Hanzi | 336 | Incluye reapariciones y variantes |
| Conceptos gramaticales | 45 | 47 formulaciones documentales, sin fusionar silenciosamente |
| Testigos de diálogos principales | 12 | Seis diálogos en libro y sus versiones de PPT |
| Conjuntos de actividad | 122 | Consignas, ítems, textos enlazados o estímulos visuales |
| Familias de ejercicios de cuaderno | 54 | 18 por lección |
| Observaciones | 29 | Variantes, contexto, exclusiones y límites |

Las dos fuentes nuevas son `SRC-PPT-03-2` (38 páginas) y
`SRC-HANZI-03-2` (4 páginas). La hoja contiene **36 filas y 28 glifos distintos**.
En la instantánea de Míng, `明` y `昨` no están entre los 192 Hanzi canónicos;
esto no afirma que sean los únicos glifos faltantes del corpus completo.

## Tablas enlazadas

`query.py --export` genera JSON y, para las tablas de consulta, TSV UTF-8.

- **matrix / vocabulary / vocabulary_evidence**: palabra, lecturas, español,
  rol por lección, teoría, práctica, PPT, hoja exacta, frase principal y estado en Míng.
- **phrases / phrase_evidence / word_phrase_links / word_phrase_spans**:
  enunciado canónico, versiones documentales y relaciones con posiciones.
- **hanzi / hanzi_evidence / worksheet_sequences / word_hanzi_links**:
  glifos, lecturas/radicales/trazos según fuente, secuencias de hoja y componentes escritos.
- **grammar / grammar_evidence / grammar_phrase_links / dialogues / exercises**:
  formulaciones, ejemplos, turnos, tareas, huecos y estados de respuesta.
- **sources / page_inventory / notes / foundations / native_transcripts /
  runtime_coverage**: procedencia, granularidad, diferencias y comparación de código.

`v-<hanzi>` y `c-<carácter>` conservan el esquema estable de la app. Los IDs de
frase v2 se derivan del texto normalizado por puntuación/espacios. Los IDs `PH-001`
a `PH-046` de la base v1 no se sobreescriben ni se reinterpretan como estos IDs v2.
El testigo documental conserva el texto y la segmentación anotada. La selección
de un ejemplo principal es editorial y no sustituye a los demás ejemplos.

## Reglas de evidencia

1. `null` significa que el dato no consta en la extracción confirmada. No rellenar
   pinyin, español, radicales ni respuestas y atribuirlos falsamente al documento.
2. El pinyin/las glosas que se seleccionan para mostrar conservan todas sus variantes.
   Una traducción futura de elaboración propia deberá marcarse como editorial.
3. `工作` no se enlaza a `我爸爸是医生` por afinidad temática. `六口人` no se
   tokeniza con `个`. Se distingue palabra/expresión de carácter integrante.
4. Una secuencia escrita en la hoja es distinta de tener todos sus glifos en hojas
   separadas. Tampoco todo carácter encontrado es un objetivo de escritura.
5. Contraejemplos, preguntas de corrección y huecos no se convierten en ejemplos
   positivos o claves oficiales. Las tareas abiertas no tienen una respuesta única.
6. `runtime_coverage` indica registro/elegibilidad en el código inspeccionado, no
   reproducción real, éxito de juego, presencia en cada modo ni despliegue verificado.

## Límites explícitos

No es una transcripción facsimilar de cada página completa. Las actividades
visuales tienen descripciones y objetivos, no copias de fotos, flechas de trazo o
coordenadas dibujadas. El material cultural/decorativo y el bloque fonético previo
no se transforman automáticamente en vocabulario evaluable de L1–L3.
Los 122 conjuntos están poblados; su tipo distingue texto impreso, inventario
visual, actividad abierta y ejercicio con respuesta no suministrada.

No se suministraron los audios originales de escucha. No se han inventado sus
claves. La caché nativa de PPT puede conservar orden de extracción imperfecto:
**no es un diccionario validado**; usar primero las tablas estructuradas.
No se publican los PDF, escaneos, respuestas manuscritas, nota/nombre del alumno,
contactos personales ni claves/API. El teléfono de un ejemplo de la PPT fonética
se omite en la caché textual.

La validación incluida comprueba IDs, fuentes/páginas, enlaces y posiciones;
**no certifica una revisión lingüística externa ni pruebas funcionales de la web**.

## Almacenamiento, revisión y mantenimiento

Los registros fuente están en `source/pack-*.b64`. Son fragmentos de un archivo
XZ que contiene **solo JSON**, no código. `source/manifest.json` incluye SHA-256
por fragmento, archivo comprimido y JSON recuperado, además de recuentos de filas.
No abras la cadena base64 en el contexto del modelo: utiliza el lector.

Para inspeccionar o editar los registros sin PDF:

```bash
python3 MING_KNOWLEDGE/v2/pack.py --unpack /tmp/ming-source-records
```

`compile.py` reconstruye determinísticamente la matriz y las relaciones.
No hay importaciones de esta base en `app/`, `components/`, `seed/` ni en juegos.
Integrar contenido en la app, generar audio y decidir objetivos evaluables es una
operación posterior, con revisión y pruebas propias.
