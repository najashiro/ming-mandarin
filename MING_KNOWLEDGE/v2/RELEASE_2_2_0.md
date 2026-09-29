# Corpus 2.2.0 · cierre documental de lección 4

Fecha: 2026-09-29. Base: PR22 fusionada; cierre: PR23. **Documentación curricular lista para implementar el capítulo 4**, no implementación de la interfaz. No fusionar ni desplegar automáticamente.

## Resultado

Se extrajo el contenido curricular de los seis PDF vigentes: **121 páginas, 295 bloques y 3.870 campos indexados**. El inventario completo se consulta en `lesson4/page-coverage.tsv`. Los seis tamaños, cantidades de páginas y SHA-256 fueron comprobados contra los PDF corregidos del proyecto. No se utilizó OCR ni una fuente externa para sustituir el material.

La consulta global integra **27 fuentes / 661 páginas / 432 entradas léxicas / 1.299 frases**, manteniendo los identificadores y valores documentales/editoriales preexistentes de L1–L3. Las 86 entradas léxicas añadidas incluyen contextos y ampliaciones docentes: no se presentan todas como vocabulario básico del libro.

L4 contiene tres listas del libro (63 filas, 56 entradas + 7 subentradas), 62 conjuntos o continuaciones de ejercicios con 251 ítems, seis lecturas, tres modelos escritos, 25 tablas no léxicas, 38 registros visuales y 94 apariciones de objetivos de escritura. Los dos diálogos canónicos del libro tienen 27 turnos. Los 27 turnos docentes alternativos permanecen como evidencia secundaria.

Los registros de gramática son bloques documentales enlazados, no un conteo artificial de conceptos semánticos únicos. Cada ejercicio conserva instrucciones, ítems, opciones, huecos y localizadores, distinguiendo claves impresas y tareas abiertas.

## Autoridad y límites

Libros básico y de ejercicios como fuentes primarias; conflicto entre ambos se registra, no se inventa un desempate. No mezclar turnos ni preguntas de distintas versiones. Las hojas Hanzi se usan como evidencia de escritura y lectura aislada, no para ensamblar pronunciación contextual. Se mantienen los casos 差/只 y la selección contextual del libro mediante `lesson4_selection`.

El texto corregido tiene 25 páginas (113–137) y el cuaderno 11 (29–39). No se reincorpora la página 120 duplicada; los nombres actuales y el historial se mantienen separados.

**Los PDF no incluyen todos los apoyos de la futura interfaz.** En los 115 IDs con evidencia propia de L4, 89 tienen pinyin documental seleccionado y 82 español documental seleccionado; 121 de las 660 frases vinculadas a L4 tienen pinyin impreso registrado. El resto sigue localizable y extraído, sin inventar campos ni atribuir lecturas editoriales al original. Las claves que requieren las grabaciones ausentes no se generan. Esto no es una certificación lingüística humana independiente.

Las ilustraciones, relojes, horarios y matrices se documentan mediante sus datos y descripciones separadas; no se publican escaneos ni se recrean assets de trazos. Las cifras culturales son afirmaciones del material, no investigación actualizada.

## Validación ejecutada localmente

| Comprobación | Resultado |
|---|---|
| `query.py --validate` | PASS: fuentes, relaciones, paginación, referencias y regresiones |
| Pruebas `unittest` de v2 | **156 PASS**: 122 históricas + 34 integradas |
| Pruebas `unittest` de lesson4 | **25 PASS** |
| `lesson4/audit.py --validate --pdf-dir ...` | PASS, **6/6** identidades PDF |
| `lesson4/audit.py --release-check` | **PASS / código 0**, después de validar el corpus integrado |
| `audit_source_tables.py --check` | PASS, lote histórico preservado |
| `translations_ming.py --check` | PASS, lote histórico preservado |
| `pinyin_ming.py --check` | PASS, lote histórico preservado |
| `visual_ming.py --check` | PASS, lote histórico preservado |
| `export-corpus-v21.py --check` | PASS: proyección anterior sin cambios |
| `export-corpus-v22.py --check` | PASS: proyección reproducible |

La proyección nueva tiene huella `be022d17c65fe5e2d9cc578d8dddccb17f093aa3307c52c1e5b994064ab9ce64`. Dos reconstrucciones independientes dieron el mismo resultado. El workflow de cierre vuelve a ejecutar los controles sobre el commit publicado; sus artefactos identifican el SHA exacto. Los resultados locales no deben confundirse con un despliegue en Vercel.

`query_v21.py` fija el ámbito de los lotes aprobados anteriores. Sus pruebas no fueron debilitadas: se mantienen intactas sus aserciones de contenido. `test_v22.py` comprueba adicionalmente la unión, el mismo contenido de los 63/66/54 registros auditados de PR22, los enlaces, la selección canónica, la ausencia de respuestas inventadas y el rechazo de un paquete adulterado o de un nuevo hueco léxico no revisado.

## Uso por la implementación web

```sh
python3 MING_KNOWLEDGE/v2/query.py --summary
python3 MING_KNOWLEDGE/v2/query.py --table document_blocks --lesson 4 --limit 20
python3 MING_KNOWLEDGE/v2/query.py --source SRC-BOOK-04 --page 19 --limit 20
python3 MING_KNOWLEDGE/v2/query.py --word 只 --lesson 4 --limit 8
python3 scripts/export-corpus-v22.py --out /tmp/corpus-v22-public.json
```

La exportación omite procedencia de las tarjetas del alumno y conserva contextos polisémicos. **No cambia el import actual de la aplicación**, no genera audios/imágenes, no toca Supabase/progreso y no despliega. Una tarea posterior de capítulo 4 consumirá este corpus, completará apoyos editoriales explícitos cuando falten y validará su propia interfaz y recursos.
