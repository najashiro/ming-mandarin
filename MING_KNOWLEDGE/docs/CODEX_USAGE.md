# Uso eficiente con Codex

Prompt recomendado:

> Antes de trabajar, lee `MING_KNOWLEDGE/index.json`.
> Consulta solamente la lección y los dominios necesarios.
> Para vocabulario, gramática o Hanzi, abre primero su manifiesto y después únicamente los shards indicados.
> No abras los PDF originales salvo que falte información, exista una discrepancia, se necesite una imagen o se requiera reproducción literal.
> No inventes contenido curricular.
> Al terminar, indica qué registros de MING_KNOWLEDGE utilizaste.

## Ruta de consulta

- **Vocabulario:** `data/vocabulary.json` → shard(s) de la lección.
- **Gramática:** `data/grammar.json` → shard de la lección.
- **Hanzi:** `data/hanzi.json` → shard de la lección; `data/radicals.json` para los grupos de radicales auditados.
- **Diálogos y frases:** `data/dialogues.json` y `data/phrases.json` son datasets compactos.
- **Ejercicios:** `data/exercises.json` + `data/exercise-sets.json`.
- **Patrones de evaluación:** `data/exam-patterns.json`.
- **Material visual:** `data/media-index.json` y, solo cuando haga falta la imagen, la página original indicada.

## Ejemplos

- Para un bug visual: normalmente no necesita leer MING_KNOWLEDGE.
- Para Reto Mixto L1-L3: consultar `curriculum/progression.json`, los manifiestos y shards de vocabulario/gramática necesarios, `data/exercises.json` y `data/exam-patterns.json`.
- Para Hanzi: consultar `data/hanzi.json`, el shard correspondiente y `data/radicals.json`; abrir la hoja PDF solo para comprobar trazos o forma visual.
- Para China Adventure: consultar progresión, vocabulario y diálogos de las lecciones implicadas; no todo el libro.

Esto reduce contexto repetido y evita que el agente vuelva a interpretar cientos de páginas.
