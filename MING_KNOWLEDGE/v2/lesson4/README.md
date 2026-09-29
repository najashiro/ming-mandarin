# Lección 4 — candidato del corpus v2.2.0

Estado: extracción estructurada parcial. La revisión de fuentes y la política de selección no completan ni publican el capítulo 4.

## Revisión de archivos y autoridad — 2026-09-29

El usuario corrigió los nombres y eliminó la copia duplicada de la página impresa 120. Se verificaron nuevamente los seis PDF locales por SHA-256, tamaño y número de páginas.

| Fuente | Nombre actual | Páginas PDF | Páginas impresas |
|---|---|---:|---|
| SRC-BOOK-04 | Libro Basico 1 - Lección 4.pdf | 25 | 113–137 |
| SRC-WB-04 | Libro de Ejercicios Basico 1 - Lección 4.pdf | 11 | 29–39 |
| SRC-PPT-04-1 | Presentación 4.1 | 43 | No aplicable |
| SRC-PPT-04-2 | Presentación 4.2 | 34 | No aplicable |
| SRC-HANZI-04-1 | Hanzi 4.1 | 4 | No aplicable |
| SRC-HANZI-04-2 | Hanzi 4.2 | 4 | No aplicable |

Total actual: **121 páginas físicas**. El libro tiene una sola impresa 120, en PDF 8; PDF 9 es la impresa 121. El cuaderno conserva SHA-256 y bytes anteriores: solo fue renombrado. El libro tiene nueva huella por la edición; no se afirma una comparación binaria integral con el PDF antiguo.

`source-revisions.json` conserva nombres, hashes y mapa anteriores. Las antiguas PDF 8/9 remiten a PDF 8 actual; las antiguas PDF 10–26 remiten a PDF 9–25. Los localizadores actuales de vocabulario, gramática y observaciones se migraron; sus identificadores y texto documental permanecen. Los conteos históricos de 122 páginas no describen los archivos actuales.

## Selección aprobada por el usuario

Consultar `../../SOURCE_AUTHORITY.json` y `selection-policy.json`.

- Los libros básico y de ejercicios son las fuentes primarias. En el mismo punto y contexto prevalecen sobre presentaciones y hojas. Los ejercicios conservan su libro de origen; un conflicto genuino entre ambos libros se documenta, no se resuelve inventando información.
- Los dos diálogos principales seleccionados son **DLG-L4-BOOK-T1** y **DLG-L4-BOOK-T2**, con **27 turnos**. Se mantiene 宋华, 七点半我回学校 y 我学英语 tal como figuran en el libro. No mezclar versiones ni generar preguntas del capítulo a partir del diálogo alternativo de la presentación.
- Las versiones de las presentaciones se conservan como **27 turnos secundarios**, para trazabilidad, no como diálogo principal del capítulo. `dialogue-turns.tsv` conserva los 54 turnos originales.
- Las lecturas aisladas de hojas no definen la pronunciación de palabras: 差 chà, 只 zhǐ, 时间 shíjiān e 意思 yìsi se seleccionan por evidencia contextual del libro. Las lecturas de las hojas se preservan en sus campos originales, sin concatenación automática ni generación de audio.
- La tabla horaria del libro está ahora en PDF 9/impresa 121. Sus reglas son la referencia del capítulo; las variantes de la presentación se guardan como secundarias, no se declaran universalmente inválidas.
- No sobrescribir pinyin documental ni atribuir correcciones al original. Una errata o ausencia en el propio libro todavía requiere registro y resolución separada. No inventar claves de escucha ni tratar escritura manuscrita como clave docente.

## Cobertura estructurada que se conserva

63 filas de vocabulario del libro (56 entradas numeradas y 7 subentradas); 66 filas de hojas Hanzi (54 caracteres distintos); cuatro testigos de diálogos con 54 turnos; 13 resúmenes de gramática/notas; 20 observaciones de auditoría. Estos números no significan 63 palabras nuevas frente a L1–L3 ni transcripción completa de los seis documentos.

## Consulta y pruebas

```sh
python3 MING_KNOWLEDGE/v2/lesson4/audit.py --authority
python3 MING_KNOWLEDGE/v2/lesson4/audit.py --canonical-dialogues --limit 100
python3 MING_KNOWLEDGE/v2/lesson4/audit.py --dialogue DLG-L4-BOOK-T2
python3 MING_KNOWLEDGE/v2/lesson4/audit.py --dialogue DLG-L4-PPT1-T1
python3 MING_KNOWLEDGE/v2/lesson4/audit.py --word 差
python3 MING_KNOWLEDGE/v2/lesson4/audit.py --hanzi 差
python3 MING_KNOWLEDGE/v2/lesson4/audit.py --pages --source SRC-BOOK-04
python3 MING_KNOWLEDGE/v2/lesson4/audit.py --validate --pdf-dir /ruta/privada
python3 -m unittest discover -s MING_KNOWLEDGE/v2/lesson4 -p 'test_*.py' -v
```

Resultado local de esta revisión: **25 pruebas PASS**, integridad del suplemento PASS y **6/6 hashes/tamaños actuales coincidentes**. `--release-check` mantiene código 3: `ready_for_chapter4=false`. Las pruebas globales de v2 y las de la web no se ejecutaron en esta revisión. No se afirma revisión lingüística humana independiente.

## Versionado y trabajo pendiente

**2.2.0** es la versión objetivo; **2.1.0** sigue siendo la base activa L1–L3 hasta integrar y validar la ampliación. `v2/` es la familia de estructura, no el número de versión menor. El esquema documental 1.0.0 no es la versión del corpus.

Continúa pendiente completar ejercicios, lecturas, modelos, fonética, cultura y ampliaciones visuales; resolver la proyección contextual de pinyin; integrar en compilador/consulta global conservando IDs; regenerar la proyección con los scripts existentes y ejecutar auditorías completas. El lector local ya aplica la selección de diálogos del libro; el exportador global y la web aún no están integrados.

No se incluyen PDF, escaneos, secretos, cambios de audio, Supabase, progreso ni despliegue. No fusionar a main sin autorización explícita.
