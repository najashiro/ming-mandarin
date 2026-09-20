# MING_KNOWLEDGE v1.0.0

Base curricular normalizada de **Míng · Mandarín activo**.

## Estado
- 19 fuentes auditadas.
- 498 páginas PDF inventariadas.
- 214 entradas de vocabulario/currículo.
- 46 frases clave.
- 8 registros de diálogo normalizados: 2 extractos verificados de Lección 1 y 6 diálogos verificados de Lecciones 2–3.
- 24 puntos gramaticales.
- 123 caracteres Hanzi indexados.
- 14 grupos de radicales/componentes auditados.
- 108 conjuntos/páginas de práctica indexados.
- 13 patrones canónicos de ejercicios.
- 10 grupos de material visual.
- Todas las hojas Hanzi registradas y separadas por lección.
- Inventario semántico de contenido visual sin duplicar los PDF.

## Propósito
Evitar que Codex vuelva a reconstruir el currículo releyendo cientos de páginas PDF en cada tarea.

## Inicio rápido para Codex
1. `index.json`
2. `lessons/lesson-XX.json`
3. manifiesto del dominio necesario (`data/vocabulary.json`, `data/grammar.json`, `data/hanzi.json`)
4. únicamente los shards indicados por esos manifiestos

Los PDF originales siguen siendo la fuente final de autoridad, pero se consultan solo por excepción.

## Optimización para agentes
Vocabulario, gramática y Hanzi están fragmentados por lección. `data/dialogues.json`, `data/phrases.json` y `data/radicals.json` son datasets compactos que pueden cargarse directamente. El inventario de 498 páginas vive en `sources/page-audit/` dividido por fuente.
