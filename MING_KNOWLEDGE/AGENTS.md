# MING_KNOWLEDGE · instrucciones para agentes

Diseño de Vocabulario: consulta `design/VOCABULARY_STYLE.md`, `design/vocabulary-style.json` y `design/VOCABULARY_IMPLEMENTATION_PROMPT.md` antes de cambiar fichas o generar sus fotografías. Es el estándar visual por defecto aprobado; está separado del corpus y no se debe mezclar con evidencia curricular. La imagen de referencia es orientativa; la geometría exacta está en el JSON. Guardar el estándar no equivale a aplicarlo en runtime.

Base activa v2.1: empieza con `v2/index.json`, `v2/SOURCE_AUDIT.md`, `v2/RADICALS.md` y `v2/README.md`.
Usa `v2/query.py` para palabra, frase, radical, Hanzi o fuente/página concreta.
No releas PDF ni vuelques base64 por defecto. El lector es offline y sin API pagada.

Las tablas 生词 y 补充词语 están en `v2/source-tables.json`; sus relaciones derivadas se consultan como `textbook_table_rows` y `curriculum_links`. Filtra lección y tipo de lista sobre el mismo vínculo, no sobre arrays agregados independientes. Los nombres propios también pueden pertenecer a Palabras nuevas. Las hojas Hanzi mantienen sus testigos en `worksheet_occurrences`, independientes de las unidades de la UI.

Preserva variantes y referencias; separa fuente y anotación editorial. Un `null`
no autoriza a inventar pinyin, traducción, radical o respuesta. No conviertas
caracteres encontrados en objetivos de escritura ni contraejemplos en ejemplos.

Para radicales, distingue definición explícita del libro, campo 部首 de hoja y
pregunta de examen/cuaderno. Los candidatos de respuesta no son claves oficiales.
Consulta correcciones y evidencias antes de usar valores del pack base o de v1.

La base no es la interfaz ni el contenido desplegado. No cambies runtime, audio,
Supabase o progreso por actualizar fuentes. No fusiones a main sin autorización.
La cobertura de código es una instantánea, no una comprobación de producción.

Al actualizar el corpus, regenera con `python scripts/export-corpus-v21.py` y comprueba `python MING_KNOWLEDGE/v2/audit_source_tables.py --check`; nunca edites a mano la exportación pública. No envíes referencias de PDF/página a las tarjetas del alumno. Este repositorio es público: interno no significa privado ni autoriza almacenar secretos.

Conserva v1 como legado. Sigue además `v2/AGENTS.md` y las reglas de la raíz.
