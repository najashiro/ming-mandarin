# MING_KNOWLEDGE

## Base activa de fuentes: v2.0.0

Para el corpus L1–L3, incluidas la **PPT 3.2** y la **hoja Hanzi 3.2**, empieza en
[`v2/README.md`](v2/README.md) y [`v2/index.json`](v2/index.json).

```bash
python3 MING_KNOWLEDGE/v2/query.py --word 喜欢 --limit 8
python3 MING_KNOWLEDGE/v2/query.py --source SRC-PPT-03-2 --page 6
python3 MING_KNOWLEDGE/v2/query.py --validate
```

La v2 contiene evidencia fuente y construye tablas enlazadas sin PDF, Internet,
credenciales ni API pagadas. Mantiene vocabulario, enunciados, Hanzi, gramática,
diálogos, ejercicios, variantes y cobertura del código separados.

**Esto no amplía automáticamente el contenido de la web.** Es una base de consulta
para decidir después qué debe integrarse en la aplicación.

## Legado v1

Las carpetas `data/`, `lessons/`, `curriculum/` y `sources/` preexistentes se conservan
sin borrarlas para trazabilidad. Sus cifras antiguas (214 entradas, 123 Hanzi,
46 frases, 19 fuentes) describen aquella versión, no el estado de v2 ni el estado
funcional de la web. Los IDs de frase v1 no se reutilizan para frases diferentes.

El alcance y los límites de extracción/revisión se explican en `v2/README.md`.
