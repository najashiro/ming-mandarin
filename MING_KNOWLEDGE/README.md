# MING_KNOWLEDGE

**Versión:** 0.1.0  
**Fecha:** 2026-09-16  
**Cobertura actual:** fonética inicial + Lecciones 1, 2 y 3.

## Objetivo

`MING_KNOWLEDGE` es la base curricular normalizada de **Míng · Mandarín activo**.
Evita que ChatGPT/Codex tenga que releer todos los PDF cada vez que necesita
vocabulario, gramática, diálogos, Hanzi o patrones de ejercicios.

Los PDF siguen siendo la **fuente original de verdad**. Este paquete es una capa
estructurada para consulta rápida y para alimentar la aplicación.

## Regla de consulta

1. Consultar primero `index.json`.
2. Ir a `lessons/lesson-XX.json` para saber qué registros corresponden a la lección.
3. Consultar los archivos de `data/`.
4. Abrir los PDF originales **solo** cuando:
   - falta información;
   - existe un conflicto;
   - el registro tiene estado pendiente;
   - el usuario solicita verificar el original.

## Estado de esta versión

Esta v0.1 es una **primera normalización sustancial**, no una transcripción exhaustiva
de todas las páginas. El archivo `data/unresolved.json` contiene la cola de auditoría.

## Estructura

- `index.json`: puerta de entrada.
- `curriculum/`: mapa curricular humano.
- `lessons/`: índice por lección.
- `data/vocabulary.json`: vocabulario normalizado.
- `data/grammar.json`: reglas y ejemplos.
- `data/dialogues.json`: diálogos verificados.
- `data/hanzi.json`: índice de caracteres.
- `data/exercises.json`: taxonomía de ejercicios.
- `data/exam-patterns.json`: estructura de evaluación real.
- `data/media-index.json`: referencias semánticas a imágenes/diagramas.
- `sources/sources.json`: registro y huellas SHA-256 de las fuentes.
- `data/unresolved.json`: pendientes de auditoría.

## Integración recomendada

Ubicar esta carpeta en la raíz del repositorio:

```text
ming-mandarin/
├── AGENTS.md
├── MING_KNOWLEDGE/
└── ...
```

Luego hacer que `AGENTS.md` obligue a los agentes a consultar este corpus antes de
abrir los PDF.
