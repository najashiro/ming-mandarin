# MING_KNOWLEDGE v1.0.0

Base curricular normalizada de **Míng · Mandarín activo**.

## Estado
- 19 fuentes auditadas.
- 498 páginas PDF inventariadas.
- 206 entradas de vocabulario/currículo.
- 46 frases clave.
- 8 diálogos principales completos.
- 24 puntos gramaticales.
- 14 radicales/grupos de radical auditados.
- 92 conjuntos de ejercicios indexados.
- Todas las hojas Hanzi registradas y separadas por lección.
- Inventario semántico de contenido visual + lista de cada página que requiere referencia visual.

## Propósito
Evitar que Codex vuelva a reconstruir el currículo releyendo cientos de páginas PDF en cada tarea.

## Inicio rápido para Codex
1. `index.json`
2. `lessons/lesson-XX.json`
3. archivo(s) concretos en `data/`

Los PDF originales siguen siendo la fuente final de autoridad, pero se consultan solo por excepción.

## Optimización para agentes
Los datasets grandes están **sharded** por lección o tipo. Los archivos `data/vocabulary.json`, `data/phrases.json`, `data/grammar.json`, `data/exercise-sets.json` y `data/source-map.json` son índices ligeros. El inventario de 498 páginas vive en `sources/page-audit/` dividido por fuente.
