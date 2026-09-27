# MING_KNOWLEDGE · instrucciones para agentes

Diseño de Vocabulario: consulta `design/VOCABULARY_STYLE.md`, `design/vocabulary-style.json` y `design/VOCABULARY_IMPLEMENTATION_PROMPT.md` antes de cambiar fichas o generar sus fotografías. Es el estándar visual por defecto aprobado; está separado del corpus y no se debe mezclar con evidencia curricular. La imagen de referencia es orientativa; la geometría exacta está en el JSON. Guardar el estándar no equivale a aplicarlo en runtime.

Base activa v2.1: empieza con `v2/index.json`, `v2/SOURCE_AUDIT.md`, `v2/TRANSLATIONS_MING.md`, `v2/PINYIN_MING.md`, `v2/VISUAL_MING.md`, `v2/RADICALS.md` y `v2/README.md`.
Usa `v2/query.py` para palabra, frase, radical, Hanzi o fuente/página concreta.
No releas PDF ni vuelques base64 por defecto. El lector es offline y sin API pagada.

Las tablas 生词 y 补充词语 están en `v2/source-tables.json`; sus relaciones derivadas se consultan como `textbook_table_rows` y `curriculum_links`. Filtra lección y tipo de lista sobre el mismo vínculo, no sobre arrays agregados independientes. Los nombres propios también pueden pertenecer a Palabras nuevas. Las hojas Hanzi mantienen sus testigos en `worksheet_occurrences`, independientes de las unidades de la UI.

Preserva variantes y referencias; separa fuente y anotación editorial. Un `null`
no autoriza a inventar pinyin de fuente, traducción de fuente, radical o respuesta.
No conviertas caracteres encontrados en objetivos de escritura ni contraejemplos en ejemplos.

El usuario autorizó el lote editorial `ming-es-20260925-01`: traducciones españolas del texto chino registrado en el campo separado `traduccion_ming`. Consulta `v2/TRANSLATIONS_MING.md`. Nunca incorporarlas a `spanish_source` ni `spanish_variants`. El español documental tiene prioridad; la web recibe solo `spanish` resuelto, sin autor, método o procedencia. Las glosas de contraejemplos y fragmentos mal segmentados quedan solo para control. No afirmar revisión humana si solo fue comprobación del modelo.

Posteriormente el usuario autorizó `ming-pinyin-20260925-01`: pinyin editorial faltante y el vínculo pedagógico explícito 猫 → 小猫. Consulta `v2/PINYIN_MING.md`. `pinyin_ming` no reemplaza ni se mezcla con `pinyin_source`, `pinyin` documental o `pinyin_variants`; la web recibe únicamente `pinyin` resuelto. Los ejemplos globales se consultan con `--word 猫 --examples` o `pedagogical_example_links`. En la web usa `examplePhraseIds` / `exampleVocabIds` o `publicExamplesForVocabulary`; no hagas descubrimiento por substring ni cambies los `vocabIds` originales. No hay autorización implícita para generar audios, imágenes ni claves de ejercicio.

La clasificación visual editorial está en `v2/VISUAL_MING.md` y `v2/visual/vocabulary.tsv`, lote `visual-ming-20260925-01`. Clasifica todo el vocabulario publicado sin alterar sus significados, lecciones o elegibilidad. Consulta `visual_ming` / `visual_ming_summary` mediante `query.py`. Las notas justificativas quedan internas; la proyección exporta solo `visual_mode`, `image_support`, `image_quiz_eligible` y `ambiguity_risk` dentro de `visual_ming`. Un quiz elegible es candidato sujeto a validar cada recurso futuro, no una imagen aprobada. Esta capa no incluye prompts, tamaños, diseño ni autorización de generación. Las palabras nuevas deben clasificarse expresamente, sin una categoría automática de respaldo.

Para radicales, distingue definición explícita del libro, campo 部首 de hoja y
pregunta de examen/cuaderno. Los candidatos de respuesta no son claves oficiales.
Consulta correcciones y evidencias antes de usar valores del pack base o de v1.

La base no es la interfaz ni el contenido desplegado. No cambies runtime, audio,
Supabase o progreso por actualizar fuentes. No fusiones a main sin autorización.
La cobertura de código es una instantánea, no una comprobación de producción.

Al actualizar el corpus, regenera con `python scripts/export-corpus-v21.py` y comprueba `python MING_KNOWLEDGE/v2/audit_source_tables.py --check`, `python MING_KNOWLEDGE/v2/translations_ming.py --check`, `python MING_KNOWLEDGE/v2/pinyin_ming.py --check` y `python MING_KNOWLEDGE/v2/visual_ming.py --check`; nunca edites a mano la exportación pública. No envíes referencias de PDF/página a las tarjetas del alumno. Este repositorio es público: interno no significa privado ni autoriza almacenar secretos.

Conserva v1 como legado. Sigue además `v2/AGENTS.md` y las reglas de la raíz.
