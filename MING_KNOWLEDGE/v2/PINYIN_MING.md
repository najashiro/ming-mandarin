# Pinyin Míng y ejemplos globales por composición

## Pedido y alcance

El usuario autorizó preparar el pinyin editorial que faltaba y conectar los ejemplos de 小猫 con la tarjeta de 猫. Se conserva el texto chino existente y su organización documental. Esta capa no agrega frases, pinyin atribuido a una fuente, audios, imágenes ni trazos. Las lecturas fueron preparadas y comprobadas por el modelo; no hay revisión humana independiente certificada.

Base: `e82c09e1f1790edbde6c0ef7b949ab2371175807`, después del PR #10. Lote: `ming-pinyin-20260925-01`.

Se prepararon **70 lecturas de palabras/expresiones y 434 de frases/enunciados: 504 registros**. Los conteos reproducidos se guardan en `audits/pinyin-ming-20260925.json` y `.md`. De los 79 registros de vocabulario y 441 enunciados sin pinyin documental registrado, quedan sin rellenar nueve fragmentos léxicos mal segmentados y siete contraejemplos. Un octavo contraejemplo ya tenía pinyin de fuente y se conserva. Ninguno se promueve al catálogo del alumno.

## Una base, dos procedencias de lectura

```text
pack y testigos originales
  → radicales y auditoría de tablas
  → traducciones Míng (PR #10)
  → pinyin Míng (este lote)
  → vínculos pedagógicos explícitos
  → exportación reproducible para la web
```

Cada registro reconstruido mantiene `pinyin`, `pinyin_status` y `pinyin_variants` como estaban. Los nuevos campos son `pinyin_ming`, `pinyin_ming_meta` y `pinyin_display`. Nunca se añade una elaboración a `pinyin_source` ni a las variantes documentales.

Selección: **lectura documental no vacía → lectura Míng de respaldo → null**. Una recuperación futura de pinyin documental tiene prioridad; la lectura editorial puede conservarse para control.

La web recibe solo **`pinyin` y `spanish` resueltos**, sin etiquetas de procedencia, método, revisión, páginas ni nombres de PDF. No debe consultar exclusivamente `pinyin_variants`, ni cargar los TSV internos. `interno` describe el uso editorial, no una protección de acceso: el repositorio sigue siendo público.

## Convención del pinyin editorial

El lote usa marcas tonales, tonos neutros sin marca y ortografía por palabras. Conserva el tono tercero léxico, sin representar 3+3 como dos tonos distintos en la escritura. En 一 y 不 representa los cambios habituales para ayudar a leer: `Yì zhī māo`, `yí ge`, `bú shì`. Es una convención didáctica de este lote, no una normalización impuesta a los materiales.

Se distingue erhua (`zhèr`, `nàr`, `miàntiáor`) de 女儿 (`nǚ'ér`). Se mantienen los nombres latinos, elipsis, orden de palabras y pronombres chinos. Se leen las cifras según el contexto: 18 años, tres personas y 2026 como año. Las notas de `pinyin-ming.json` registran decisiones puntuales. No se corrige silenciosamente 他们 por 它们 ni una inconsistencia numérica de la fuente.

Que falte un pinyin registrado no demuestra que no esté impreso en alguna página: aquí se añade apoyo editorial autorizado, no una nueva auditoría literal de todas las fuentes. Tampoco el pinyin certifica la corrección gramatical de cada enunciado fuente.

## 猫: una relación semántica explícita, no búsqueda por caracteres

`lexical-compositions.json` registra únicamente el vínculo revisado **猫 → 小猫**: 小猫 conserva el sentido de gato y añade pequeño/afectivo. Se verifica la partición 小 + 猫 y los IDs de las palabras. No hay descubrimiento por substring, por radical, por tema, ni herencia transitiva.

Las relaciones originales se conservan:

- `v-猫` está vinculado léxicamente a `一只猫`.
- `v-小猫` está vinculado léxicamente a `你有小猫吗？` y `我有两只小猫，他们很可爱。`.

La tabla nueva `pedagogical_example_links` conserva esos ejemplos directos y añade dos vínculos pedagógicos para 猫, con `via_vocab_id: v-小猫`. No altera `word_phrase_links`, `word_phrase_spans`, `vocab_ids`, `phrase_ids`, lecciones ni listas nuevas/suplementarias.

El caso 熊猫 se prueba como negativo: compartir 猫 no autoriza a tratarlo como ejemplo de gato. Cada composición adicional necesita una decisión semántica explícita.

## Contrato para Codex local

La exportación añade:

- En cada palabra: **`examplePhraseIds`**, lista ordenada de ejemplos globales.
- En cada frase: **`exampleVocabIds`**, los objetivos léxicos/pedagógicos elegibles para ese ejemplo.
- `vocabIds` conserva solo los tokens léxicos originales; no se lo debe sobrescribir para simular herencia.

Usar **`publicExamplesForVocabulary('v-猫')`**, de `lib/vocabulary-examples.ts`, o resolver `examplePhraseIds` contra todo el catálogo de frases. Esa función devuelve los tres ejemplos de 猫, con pinyin y español. No recibe `selectedLesson`, no mueve el selector ni cambia las reglas de exclusividad del catálogo. Los ejemplos de 真 siguen cruzando L2 y L3.

Los ejemplos directos se priorizan; después, los de la composición revisada. Las evidencias repetidas no duplican una tarjeta. Los contraejemplos, plantillas con huecos y premisas de verdadero/falso sin otro uso positivo no se recomiendan como ejemplos completos. El corpus documental no se borra por estas reglas de presentación.

La rama local del usuario no se modifica desde este PR. Tras fusionarlo, hay que integrar main y adaptar su componente de reverso para usar el contrato anterior. **No basta con actualizar pinyin si el componente sigue buscando únicamente en `phrase.vocabIds`.**

## Consultar y validar

```bash
python MING_KNOWLEDGE/v2/query.py --word 猫 --examples --limit 10
python MING_KNOWLEDGE/v2/query.py --word 小猫 --full
python MING_KNOWLEDGE/v2/query.py --phrase '一只猫' --full
python MING_KNOWLEDGE/v2/query.py --table pinyin_ming_summary
python MING_KNOWLEDGE/v2/query.py --table lexical_examples_summary
python MING_KNOWLEDGE/v2/query.py --validate
python scripts/export-corpus-v21.py
python MING_KNOWLEDGE/v2/pinyin_ming.py --check --write-reports
python MING_KNOWLEDGE/v2/translations_ming.py --check
python MING_KNOWLEDGE/v2/audit_source_tables.py --check
python scripts/export-corpus-v21.py --check
python -m unittest discover -s MING_KNOWLEDGE/v2 -p 'test_*.py'
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Los archivos del lote están versionados; compilar no llama a un modelo ni a una API de pago. No se editan los JSON generados a mano. Los informes anteriores son fotografías históricas de sus lotes; el informe nuevo incluye la cobertura actual de pinyin y la proyección resultante.
