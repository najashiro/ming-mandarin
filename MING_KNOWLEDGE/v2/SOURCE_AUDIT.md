# Corpus v2.1: listas del libro y hojas Hanzi

## Una base documental, varias vistas derivadas

Todo el código y los registros normalizados están en este repositorio. Los PDF privados originales NO están en Git. `source/pack-*.b64` conserva el JSON documental original y sus hashes; `source-tables.json` añade un inventario cotejado visualmente y nueve recuperaciones explícitas de pinyin. `query.py` reconstruye el pack, aplica la extensión de radicales y después `source_audit.py`.

La palabra **interno** describe el uso editorial, no un control de acceso: este repositorio es público. Nunca almacenar aquí secretos, notas personales del alumno ni escaneos. Los metadatos de documento/página quedan fuera del JSON que reciben las tarjetas del alumno.

`data/corpus-v21-public.json` es una exportación reproducible, NO otra fuente de verdad manual. Su versión curricular sigue siendo 2.1.0 y `sourceAuditVersion` identifica esta ampliación compatible. La UI y los motores antiguos no se reescriben en esta auditoría.

## Qué se ha cotejado

Seis tablas **生词 / Palabras nuevas** (Texto 1 y Texto 2 de cada lección) y tres tablas **补充词语 / Palabras suplementarias**, L1–L3. Son 147 entradas numeradas y 12 subentradas explícitas: 159 registros de tabla, no necesariamente 159 palabras distintas.

| Lección | Nuevas, incluidas subentradas | Suplementarias | Total de registros |
|---|---:|---:|---:|
| 1 | 30 | 7 | 37 |
| 2 | 43 | 17 | 60 |
| 3 | 44 | 18 | 62 |

La introducción fonética tiene numeración propia y no se mezcla con estas lecciones. El inventario conserva página PDF, página impresa, tabla, número de entrada, subentrada y texto. No se convierte cada carácter de una palabra en una entrada independiente: solo se enumeran las subentradas impresas.

Las nueve hojas Hanzi se cotejan por página y por multiconjunto de caracteres: las repeticiones se conservan. Son 229 apariciones de caracteres, no 229 glifos distintos. Para 太 se verifica además el testigo exacto: `SRC-HANZI-01-3`, PDF 2, fila 4, `tài`, 4 trazos. El nombre de la hoja 1.3 es independiente de la unidad 1.2 del motor (Lección 1, Texto 2).

## Cómo filtrar correctamente

No combinar por separado `lessons.includes(3)` y `roles.includes('core_textbook')`: esas listas agregadas no dicen qué rol pertenece a cada lección.

Utilizar `curriculum_links` en la base documental o `curriculumLinks` en la exportación. Comprobar las condiciones sobre el MISMO vínculo:

```ts
entry.curriculumLinks.some(link =>
  link.lesson === selectedLesson && link.list_type === 'new_vocabulary'
)
```

- `new_vocabulary`: fila incluida expresamente en una tabla 生词 del libro.
- `supplementary_vocabulary`: fila de una tabla 补充词语.
- `entry_kind`: `headword` o `subentry`, según la numeración impresa.
- `role`: conserva además la función/naturaleza original (`proper_name`, `core_textbook`, `phrase_context`, etc.). Un nombre propio puede ser parte de una tabla de Palabras nuevas; no lo excluyas solo porque su rol es `proper_name`.
- Una aparición dentro de una frase no declara que la palabra se introduzca allí. `list_type: null` no significa que sea suplementaria ni nueva: no hay una pertenencia a las tablas auditadas para ese testigo.

Ejemplos de regresión: 马马虎虎 es suplementaria en L1, PDF 54 / impresa 53, entrada 6; la columna impresa dice `Adj.`, no `Adv.`. 中国 es suplementaria en L2 y aparece en Palabras nuevas de L3: ambas asociaciones se mantienen sin aplanarlas.

## Consultar con Codex, sin releer los PDF

Usar `python` o `python3` según el intérprete instalado (Python >= 3.10, solo biblioteca estándar):

```bash
python MING_KNOWLEDGE/v2/query.py --summary
python MING_KNOWLEDGE/v2/query.py --word 马马虎虎 --limit 5
python MING_KNOWLEDGE/v2/query.py --hanzi 太 --full
python MING_KNOWLEDGE/v2/query.py --source SRC-HANZI-01-3 --page 2 --limit 100
python MING_KNOWLEDGE/v2/query.py --table textbook_table_rows --lesson 1 --limit 100
python MING_KNOWLEDGE/v2/query.py --table source_pinyin_recoveries --limit 100
```

La consulta abreviada de frases relacionadas ahora incluye pinyin y su estado. La ausencia de un campo en una vista abreviada no debe interpretarse como ausencia de evidencia. Los registros completos conservan las variantes y sus testigos. La caché se invalida al cambiar cualquier parte real del pack, el lector, el compilador o el inventario de auditoría.

## Regenerar y validar

```bash
python MING_KNOWLEDGE/v2/query.py --validate
python scripts/export-corpus-v21.py
python MING_KNOWLEDGE/v2/audit_source_tables.py --check --write-reports
python scripts/export-corpus-v21.py --check
python -m unittest discover -s MING_KNOWLEDGE/v2 -p 'test_*.py'
```

El inventario esperado está transcrito de las páginas, NO generado a partir de las mismas filas que se verifican. Las pruebas incluyen casos negativos: palabra ausente, lección incorrecta, rol incorrecto, pinyin ausente y evidencia duplicada.

## Límites y continuidad

Los 159 registros de las tablas ya existían en el pack. La corrección añade su estructura explícita, comprueba el pinyin registrado y evita perder sus relaciones al exportar. La prueba de glosa española comprueba presencia del dato existente; no constituye una retranscripción literal de todas las definiciones ni de todos los ejemplos marginales.

Se recuperan nueve pinyin de testigos concretos (PPT 3.1, PDF 13; libro L3, PDF 19). No se copia el pinyin del libro a un testigo de PPT que no lo imprime completo. No se inventa ninguna traducción, radical ni clave de ejercicio. El informe generado muestra los campos que todavía carecen de evidencia extraída en el conjunto del corpus.

`writingSourceEvidence` y `worksheetEvidence` son evidencia documental; NO significan que un audio, una ficha del motor, una imagen o un asset de trazos funcione. Los enlaces/recursos runtime siguen necesitando su comprobación propia. Las imágenes, audios, base Supabase y progreso del alumno no se alteran en este cambio.
