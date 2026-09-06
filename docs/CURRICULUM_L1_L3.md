# Currículo auditado L1–L3

Este documento describe la arquitectura editorial interna. La interfaz del alumno no muestra nombres de PDF ni páginas.

## Alcances

| Alcance | Lecciones incluidas | Uso |
| --- | --- | --- |
| `l1` | 1 | Ruta histórica sin cambios de IDs |
| `l2` | 2 | Nacionalidad, lenguas, comida y pedidos |
| `l3` | 3 | Familia, profesiones, clasificadores y edad |
| `l1-l2` | 1, 2 | Repaso acumulativo deduplicado |
| `l1-l2-l3` | 1, 2, 3 | Corpus completo deduplicado |

`seed/characters.ts` genera una sola entidad por carácter desde las seis unidades declaradas en `data/lesson1-hanzi.json`; `seed/curriculum.ts` compone los alcances. Los caracteres compartidos conservan el mismo ID `c-<hanzi>`, por lo que el progreso anterior sigue siendo válido.

## Unidades Hanzi

| Unidad | Texto | Hanzi visibles | Hanzi introducidos |
| --- | --- | ---: | ---: |
| 1.1 | Lección 1 · Texto 1 | 40 | 40 |
| 1.2 | Lección 1 · Texto 2 | 24 | 18 |
| 2.1 | Lección 2 · Texto 1 | 55 | 43 |
| 2.2 | Lección 2 · Texto 2 | 41 | 36 |
| 3.1 | Lección 3 · Texto 1 | 36 | 30 |
| 3.2 | Lección 3 · Texto 2 | 39 | 25 |

El total canónico es 192. “Visibles” incluye repaso; “introducidos” cuenta solo `introducedIn`. El panel protegido `/admin/content` genera la tabla interna completa con carácter, pinyin, significado, primera unidad, reapariciones, rol y fuente.

## Cobertura pedagógica

- L1: saludos, presentación personal, apellido/nombre, estados, preguntas con 吗/呢, predicado adjetival, 不/不太 y 也.
- L2: nacionalidad y país, idiomas, presentación de terceros, 是/不是, 什么/谁/哪, 也/都, 和, 喜欢, 要/不要, 会 y 刚; alimentos y bebidas.
- L3: familia, fotografía, profesiones, 有/没有, posesión con 的, 口/个/张, 两, 谁/几, 还, edad con 今年…岁 y diálogo de hospitalidad.

## Audio y Hanzi

- `data/mandarin-audio.json` registra cada clip por texto, pinyin auditado y lección; los 192 Hanzi canónicos tienen MP3 individual.
- `public/audio/mandarin/` contiene los MP3 generados; una entrada compartida se reutiliza mediante normalización del texto chino.
- No existe fallback curricular a `speechSynthesis`.
- `public/hanzi-data/manifest.json` y los JSON por carácter contienen los trazos locales. Las hojas Hanzi determinan el inventario; no convierten automáticamente cada carácter en una entrada de vocabulario.

## Persistencia

Las tablas existentes aceptan IDs de contenido sin una migración destructiva. El alcance se guarda en `exam_sessions.lesson_id`; las sesiones antiguas continúan resolviéndose como L1. Práctica, SRS y cuaderno de errores filtran el inventario presentado por alcance, mientras el dominio de un concepto compartido se conserva.

## Regla editorial

Los PDF de `Base de Datos/` son fuentes maestras locales y están excluidos de Git. Cualquier ampliación debe registrar un `SourceRef`, regenerar los manifiestos, ejecutar la validación de audio/Hanzi y pasar typecheck, lint, unit, build y E2E.
