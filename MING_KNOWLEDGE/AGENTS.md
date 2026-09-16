# Míng · MANDARÍN — reglas de consulta curricular v1.0

1. Leer `index.json`.
2. Identificar la lección y abrir únicamente sus shards en `lessons/` y `data/`.
3. No releer PDF originales por defecto.
4. Abrir una fuente original solo si falta un dato, existe conflicto, se necesita una imagen o el usuario pide verificación literal.
5. Distinguir `core_textbook`, `supplementary_textbook`, `classroom_extension` y `preview_next_lesson`; no mezclarlos silenciosamente.
6. Si hay discrepancia, el PDF original prevalece y la corrección debe conservar trazabilidad.
7. Para ejercicios, usar `data/exercises.json` + `data/exercise-sets.json`; para patrones de evaluación usar `data/exam-patterns.json`.
8. Para radicales/Hanzi, usar `data/radicals.json` y `data/hanzi/`; abrir hojas Hanzi solo para comprobar trazos o forma visual.
