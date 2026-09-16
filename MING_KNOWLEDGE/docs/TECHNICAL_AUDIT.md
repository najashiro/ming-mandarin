# Auditoría técnica final — MING_KNOWLEDGE v1.0.0

Fecha: 2026-09-16

## Alcance

Revisión de integridad estructural del paquete curricular antes de integrarlo a `main`: manifiestos, shards, IDs, referencias internas, esquemas, conteos, auditoría de fuentes y codificación UTF-8.

## Resultado

**PASS** — no quedan bloqueadores conocidos para integrar v1.0.0.

## Verificaciones

- 19 fuentes registradas y 498 páginas auditadas.
- Los 19 manifiestos de auditoría están presentes y marcados como completos.
- 214 entradas de vocabulario distribuidas en 6 shards.
- 24 puntos gramaticales.
- 8 registros de diálogo y 46 frases clave.
- 123 caracteres Hanzi y 14 grupos de radicales/componentes.
- 108 conjuntos/páginas de práctica y 13 patrones de ejercicios.
- Los manifiestos de Lecciones 1–3 resuelven a shards, diálogos, frases y fuentes existentes.
- Los esquemas de lección y fuente coinciden con la estructura v1.0.0.
- `data/unresolved.json` no contiene elementos bloqueantes.

## Correcciones realizadas durante la auditoría

1. Se reconstruyó `data/vocabulary/lesson-03-part-2.json`, que presentaba mojibake/corrupción de codificación, conservando 41 registros (VOC-0174 a VOC-0214) y su trazabilidad a las fuentes originales.
2. Se eliminó `data/source-map.json`, remanente de una estructura anterior cuyos IDs ya no coincidían con los IDs canónicos de v1.0.
3. Se alineó `schemas/lesson.schema.json` con los manifiestos reales de Lecciones 1–3.
4. Se reforzó `schemas/source.schema.json` para representar los campos usados por `sources/sources.json`.
5. Se normalizó `data/hanzi.json` con versión, rutas canónicas y referencia explícita a `data/radicals.json`.
6. Se sincronizaron los conteos y las rutas documentadas en `index.json`, `README.md`, `CODEX_USAGE.md`, `VALIDATION.json` y `CHANGELOG.md`.

## Nota sobre la rama

La rama de trabajo conserva el nombre histórico `ming-knowledge-v0.1.0`. Esto no define la versión del paquete: `MING_KNOWLEDGE/VERSION` y los manifiestos canónicos declaran `1.0.0`. El nombre de la rama no es un bloqueador técnico.

## Regla de autoridad

La base normalizada optimiza la consulta de Codex. Ante discrepancias, reproducción literal, trazos o contenido visual, prevalece la fuente original indicada por la trazabilidad.
