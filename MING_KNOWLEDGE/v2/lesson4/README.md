# Lección 4 — candidato del corpus v2.2.0

**Estado: borrador con extracción estructurada parcial. No es todavía la base completa para construir el capítulo 4.**

La versión objetivo de esta ampliación es **2.2.0**; **2.1.0** identifica exclusivamente la base anterior. El directorio `v2/` conserva la familia de estructura y las rutas existentes: no hace falta renombrarlo a `v2.2/`. La versión de esquema de estos archivos (`1.0.0`) tampoco es la versión del corpus.

## Qué se verificó y añadió

Se cotejaron nuevamente bytes, SHA-256 y número de páginas de los seis PDF del proyecto con el manifiesto de la PR #22. Coinciden los seis. Son **122 páginas físicas**. Esto acredita identidad documental, no transcripción literal completa de 122 páginas.

| Archivo | Cobertura real |
| --- | --- |
| `textbook-vocabulary.tsv` | Tres listas del libro: 56 entradas numeradas y 7 subentradas explícitas, 63 filas. Incluye Hanzi, pinyin, categoría impresa, español, colocaciones y localizador. No son necesariamente 63 palabras nuevas respecto de L1–L3. |
| `worksheet-rows.tsv` | Las 66 filas de las dos hojas de escritura: 35 + 31, con 54 caracteres distintos. Conserva cada repetición, lectura aislada, 部首, número de trazos y estructura. No incluye todavía todas las tablas de escritura del libro/cuaderno ni convierte el dibujo de trazos en un recurso animado. |
| `dialogue-turns.tsv` | Cuatro testigos documentales de los dos diálogos principales: libro T1/T2 y presentaciones T1/T2. Total: 54 turnos, con hablantes y pinyin de cada testigo. |
| `grammar-source.json` | 13 resúmenes derivados de las fuentes: seis bloques de gramática y siete notas. No son 13 conceptos canónicos nuevos ni una transcripción de todos sus ejercicios. |
| `discrepancies.json` | 20 observaciones de identidad, duplicación, variantes, desajustes y límites de evidencia. No todas son errores lingüísticos. |
| `audit.py`, `test_audit.py` | Consulta acotada sin red ni API de pago; comprobaciones de integridad y regresión del suplemento. |

## Hallazgos que no deben perderse

- Los nombres de los libros están intercambiados: el archivo llamado **Libro de Ejercicios** es el texto (26 páginas); **Libro Basico** es el cuaderno (11). Los IDs siguen el contenido real, conservando los nombres originales.
- El texto repite la página impresa **120** en las páginas PDF **8 y 9**. No duplicar su contenido al compilar.
- El primer diálogo del libro usa **宋华** y el de la presentación 4.1 usa **丁力波**. La lectura de la presentación 4.2 vuelve a usar 宋华. Cada ejercicio debe consultar su propio testigo.
- En el segundo diálogo, el libro dice **七点半我回学校** y la presentación **七点半我们回学校**. También se conserva **学** frente a **学习**. No fabricar un diálogo híbrido.
- Las hojas registran **差 chā**, **只 zhī** y **思 sī**. Las palabras contextualizadas registran **差 chà**, **只 zhǐ** y **意思 yìsi**. Una lectura aislada no se concatena automáticamente para crear audio de palabras.
- La tabla de la presentación 4.1 PDF 20 imprime **时间 shījiān**; el libro PDF 4 y la ficha de la presentación PDF 32 registran **shíjiān**. El turno final de la presentación 4.1 PDF 41 omite `xí` en su pinyin aunque tiene 练习; otro turno de la presentación 4.2 PDF 27 omite `de`. Estos desajustes están registrados, no resueltos silenciosamente en `pinyin_source`.
- La tabla horaria del libro PDF 10 exige **零** con minutos menores a diez y presenta **两点零五分**. La presentación 4.1 PDF 9 admite variantes con y sin 〇, conservando 分. La condición del libro **no** dice «si se omite 分». Ambos materiales mantienen **两点十分** para 2:10 y hablan de omitir 分 para valores **mayores que diez**.
- El campo 部首 de la hoja de 累 es **田**; la presentación explica **糸**. Conservar las dos clases de evidencia, sin adjudicar a la palabra completa el radical de un componente.
- No hay grabaciones originales de los ejercicios de escucha. Los números de pista y las respuestas manuscritas no son grabaciones ni claves docentes verificadas.
- Los datos culturales de las diapositivas sobre educación/Gaokao quedan como afirmaciones del material, no como estadísticas actuales verificadas externamente.

## Consultas sin releer los PDF

Desde la raíz del repositorio:

```sh
python3 MING_KNOWLEDGE/v2/lesson4/audit.py --word 时间
python3 MING_KNOWLEDGE/v2/lesson4/audit.py --hanzi 差
python3 MING_KNOWLEDGE/v2/lesson4/audit.py --dialogue DLG-L4-BOOK-T2
python3 MING_KNOWLEDGE/v2/lesson4/audit.py --issues --limit 20
python3 MING_KNOWLEDGE/v2/lesson4/audit.py --pages --source SRC-WB-04
python3 MING_KNOWLEDGE/v2/lesson4/audit.py --validate
python3 -m unittest discover -s MING_KNOWLEDGE/v2/lesson4 -p 'test_*.py' -v
```

`--pages` inventaría las 122 posiciones físicas e indica dónde hay filas TSV. **No** afirma que el contenido íntegro de cada página esté transcrito. La consulta global antigua `v2/query.py` sigue limitada a L1–L3; esta consulta del suplemento no la sustituye ni certifica su integración.

Comprobación opcional, únicamente con los PDF privados en el equipo:

```sh
python3 MING_KNOWLEDGE/v2/lesson4/audit.py --validate --pdf-dir '/ruta/privada/de/los/pdf'
```

## Resultado de esta revisión — 2026-09-29

Se ejecutaron localmente **13 pruebas de regresión: PASS**, la comprobación de integridad del suplemento: **PASS**, y las comparaciones de SHA-256/bytes de los seis PDF: **6/6 coincidentes**. El número de páginas se obtuvo además de los PDF con PyMuPDF.

El control `--release-check` devuelve deliberadamente **código 3** mientras `ready_for_chapter4=false`. Aprobar integridad no acredita extracción exhaustiva, corrección fonética independiente, validación global de v2, compilación de la web, funcionamiento de audio ni producción. Las pruebas globales y las de la web **no se ejecutaron en esta revisión**. No se afirma revisión humana independiente.

## Cierre necesario antes de publicar v2.2.0 como base completa

1. Completar el inventario y la transcripción itemizada del cuaderno y de las actividades, lecturas, modelos, fonética y cultura del libro. El registro del cuaderno por hash no equivale a extraer sus ejercicios.
2. Completar todas las ampliaciones y el texto educativo de imágenes/tablas en las presentaciones; conservar testigos y discrepancias.
3. Resolver separadamente la proyección de pinyin para el alumno; no modificar el pinyin documental para ocultar un error impreso.
4. Integrar la ampliación en el compilador y la consulta global, con los IDs existentes, enlaces léxicos y ubicación por página. No fusionar tablas por coincidencia de caracteres.
5. Regenerar la proyección con los scripts existentes y ejecutar las auditorías y pruebas globales exigidas por `MING_KNOWLEDGE/AGENTS.md`. Actualizar los índices activos y sus conteos desde resultados reales, no cambiando solo un número de versión.

No se modifica ni se publica la web en este PR. No se incluyen PDF, escaneos, recursos de pago, claves, Supabase ni progreso. No fusionar a `main` sin autorización explícita.
