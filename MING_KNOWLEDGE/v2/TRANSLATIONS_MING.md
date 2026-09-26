# Traducciones Míng: capa editorial separada

## Autorización y alcance

El usuario autorizó expresamente preparar traducciones españolas para las palabras y frases registradas que carecían de español, conservar el campo **`traduccion_ming`** para control interno y mostrar en la web una traducción sin indicar si procede del material o de Míng.

Esta operación no inventa nuevas palabras, frases chinas, pinyin, radicales, respuestas de ejercicio ni evidencias documentales. Traduce el texto chino existente. El modelo preparó y comprobó las traducciones; **no hay revisión humana independiente certificada**.

Lote `ming-es-20260925-01`, base `d6352ddfb6498286a0991f198279ac093883e466`. Los conteos definitivos y su comprobación se generan en `audits/translations-ming-20260925.json` y `.md`.

## Almacenamiento y resolución

El corpus sigue siendo una base en este mismo repositorio:

```text
pack documental inalterado
  → radicales documentados
  → auditoría de tablas y hojas
  → traducciones editoriales Míng
  → exportación para la web
```

`translations-ming.json` identifica el lote, su autorización, método, limitaciones, notas y cuatro archivos TSV. Los TSV contienen pares de **texto chino exacto / traduccion_ming**. No se acepta una entrada sin registro original, una clave repetida ni una traducción vacía. Al compilar se resuelven los identificadores canónicos `v-…` y `PH-…`; no se cambian IDs ni se hacen asociaciones por parecido textual.

Cada entrada del corpus reconstruido tiene:

- `spanish` y `spanish_variants`, cuando ya existían: datos documentales conservados.
- `traduccion_ming`: texto editorial del lote, o `null` si no se preparó una traducción adicional.
- `traduccion_ming_meta`: método, control, hash del texto chino y limitaciones internas.
- `spanish_display`: valor resuelto para publicación, sin reemplazar los campos anteriores.

La selección es: **español documental no vacío → traducción Míng de respaldo → null**. Las variantes de las fuentes no se rellenan con traducciones generadas. Si en el futuro se recupera una traducción documental, tendrá prioridad y la elaboración Míng podrá conservarse en el historial interno.

El JSON público contiene **solo `spanish`**, además de los campos de contenido/currículo ya existentes. No recibe `traduccion_ming`, autores, métodos, notas, páginas, nombres de PDF ni etiquetas de procedencia. No se añade ninguna insignia visible «traducido por Míng».

La capa es determinista: **compilar no llama a una API de traducción**. Todas las traducciones de este lote están versionadas y la huella de caché incorpora sus bytes reales.

## Casos de referencia

- `真厉害！` → `¡Qué impresionante!`.
- `这张照片真漂亮！` → `¡Esta foto es realmente bonita!`.
- `我家有五口人。` → `En mi familia somos cinco.`.
- `厉害` → `impresionante; muy hábil`, por su contexto elogioso.

Los dos ejemplos con 真 siguen perteneciendo a distintas lecciones documentales. Traducirlos no altera sus relaciones léxicas ni las reglas locales de exclusividad por lecciones.

## Control de contenido

El lote incluye glosas de los nueve fragmentos de segmentación ya existentes y de los ocho contraejemplos, **solo para control interno**. No se convierten en palabras autónomas o ejemplos positivos. El chino, sus clases y sus referencias no se corrigen silenciosamente. Las tres plantillas con puntos suspensivos conservan la elipsis; no se completan respuestas.

Las notas internas registran, entre otros casos, la alternancia 她/他 en una frase de la presentación y el conteo de cinco personas más Beibei en otro registro: la traducción no cambia el original para reconciliarlo. La transcripción china original permanece intacta.

Los nombres propios se conservan o transliteran, sin atribuir esa decisión al pinyin impreso. Los sentidos de palabras polisémicas se limitan a su contexto, por ejemplo 系 como departamento universitario y 上 en asistir a clase.

**Tener traducción no equivale a tener pinyin, audio, imagen o ficha Hanzi.** La exportación de vocabulario mantiene su requisito de pinyin registrado. Los campos y los medios faltantes no se generan en esta tarea. Tampoco se altera la clasificación curricular, el motor Hanzi, el progreso, Supabase o la rama local del usuario.

«Interno» describe el uso editorial, no permisos de seguridad: este repositorio es público. No guardar secretos ni información personal adicional.

## Consultar y reproducir

Desde la raíz, con Python >= 3.10 (`python` o `python3` según el equipo):

```bash
python MING_KNOWLEDGE/v2/query.py --phrase '真厉害！' --full
python MING_KNOWLEDGE/v2/query.py --word 厉害 --full
python MING_KNOWLEDGE/v2/query.py --table translations_ming --limit 20
python MING_KNOWLEDGE/v2/query.py --table translations_ming_summary
python MING_KNOWLEDGE/v2/query.py --validate
python scripts/export-corpus-v21.py
python MING_KNOWLEDGE/v2/translations_ming.py --check --write-reports
python scripts/export-corpus-v21.py --check
python MING_KNOWLEDGE/v2/audit_source_tables.py --check
python -m unittest discover -s MING_KNOWLEDGE/v2 -p 'test_*.py'
```

Para la web local basta integrar los cambios y seguir consumiendo `spanish` del JSON público. No se debe sustituir por un campo limitado al español documental ni cargar los TSV editoriales en el navegador. No editar a mano `data/corpus-v21-public.json`.
