# MING_KNOWLEDGE · instrucciones para agentes

Base activa v2.1: empieza con `v2/index.json`, `v2/SOURCE_AUDIT.md`, `v2/TRANSLATIONS_MING.md`, `v2/RADICALS.md` y `v2/README.md`.
Usa `v2/query.py` para palabra, frase, radical, Hanzi o fuente/página concreta.
No releas PDF ni vuelques base64 por defecto. El lector es offline y sin API pagada.

Las tablas 生词 y 补充词语 están en `v2/source-tables.json`; sus relaciones derivadas se consultan como `textbook_table_rows` y `curriculum_links`. Filtra lección y tipo de lista sobre el mismo vínculo, no sobre arrays agregados independientes. Los nombres propios también pueden pertenecer a Palabras nuevas. Las hojas Hanzi mantienen sus testigos en `worksheet_occurrences`, independientes de las unidades de la UI.

Preserva variantes y referencias; separa fuente y anotación editorial. Un `null`
no autoriza a inventar pinyin, traducción de fuente, radical o respuesta. No conviertas
caracteres encontrados en objetivos de escritura ni contraejemplos en ejemplos.

El usuario autorizó el lote editorial `ming-es-20260925-01`: traducciones españolas del texto chino registrado en el campo separado `traduccion_ming`. Consulta `v2/TRANSLATIONS_MING.md`. Nunca incorporarlas a `spanish_source` ni `spanish_variants`. El español documental tiene prioridad; la web recibe solo `spanish` resuelto, sin autor, método o procedencia. Las glosas de contraejemplos y fragmentos mal segmentados quedan solo para control. No afirmar revisión humana si solo fue comprobación del modelo. Esta autorización no comprende generar pinyin, audio, imágenes ni claves de ejercicio.

Para radicales, distingue definición explícita del libro, campo 部首 de hoja y
pregunta de examen/cuaderno. Los candidatos de respuesta no son claves oficiales.
Consulta correcciones y evidencias antes de usar valores del pack base o de v1.

La base no es la interfaz ni el contenido desplegado. No cambies runtime, audio,
Supabase o progreso por actualizar fuentes. No fusiones a main sin autorización.
La cobertura de código es una instantánea, no una comprobación de producción.

Al actualizar el corpus, regenera con `python scripts/export-corpus-v21.py` y comprueba `python MING_KNOWLEDGE/v2/audit_source_tables.py --check` y `python MING_KNOWLEDGE/v2/translations_ming.py --check`; nunca edites a mano la exportación pública. No envíes referencias de PDF/página a las tarjetas del alumno. Este repositorio es público: interno no significa privado ni autoriza almacenar secretos.

Conserva v1 como legado. Sigue además `v2/AGENTS.md` y las reglas de la raíz.
