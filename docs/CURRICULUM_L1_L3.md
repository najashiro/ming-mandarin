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

`seed/curriculum.ts` es el punto de composición. L1 conserva sus archivos e IDs (`v-*`, `s-*`, `g-*`, `c-*`); L2/L3 usan prefijos de lección en ejercicios y oraciones. Los caracteres compartidos conservan el mismo ID `c-<hanzi>`, por lo que el progreso anterior sigue siendo válido.

## Cobertura pedagógica

- L1: saludos, presentación personal, apellido/nombre, estados, preguntas con 吗/呢, predicado adjetival, 不/不太 y 也.
- L2: nacionalidad y país, idiomas, presentación de terceros, 是/不是, 什么/谁/哪, 也/都, 和, 喜欢, 要/不要, 会 y 刚; alimentos y bebidas.
- L3: familia, fotografía, profesiones, 有/没有, posesión con 的, 口/个/张, 两, 谁/几, 还, edad con 今年…岁 y diálogo de hospitalidad.

## Audio y Hanzi

- `data/mandarin-audio.json` registra cada clip por texto, pinyin auditado y lección.
- `public/audio/mandarin/` contiene los MP3 generados; una entrada compartida se reutiliza mediante normalización del texto chino.
- No existe fallback curricular a `speechSynthesis`.
- `public/hanzi-data/manifest.json` y los JSON por carácter contienen los trazos locales. Las hojas Hanzi determinan el inventario; no convierten automáticamente cada carácter en una entrada de vocabulario.

## Persistencia

Las tablas existentes aceptan IDs de contenido sin una migración destructiva. El alcance se guarda en `exam_sessions.lesson_id`; las sesiones antiguas continúan resolviéndose como L1. Práctica, SRS y cuaderno de errores filtran el inventario presentado por alcance, mientras el dominio de un concepto compartido se conserva.

## Regla editorial

Los PDF de `Base de Datos/` son fuentes maestras locales y están excluidos de Git. Cualquier ampliación debe registrar un `SourceRef`, regenerar los manifiestos, ejecutar la validación de audio/Hanzi y pasar typecheck, lint, unit, build y E2E.
