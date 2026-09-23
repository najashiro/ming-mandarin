# MING_KNOWLEDGE

## Base activa de fuentes: v2.1.0

Corpus L1–L3, incluidas PPT/Hanzi 3.2 y una dimensión curricular de radicales.
Empieza en [`v2/index.json`](v2/index.json), [`v2/RADICALS.md`](v2/RADICALS.md)
y [`v2/README.md`](v2/README.md), que conserva la descripción del corpus base v2.0.

```bash
python3 MING_KNOWLEDGE/v2/query.py --word 喜欢 --limit 8
python3 MING_KNOWLEDGE/v2/query.py --radical 讠 --limit 3
python3 MING_KNOWLEDGE/v2/query.py --hanzi 语
python3 MING_KNOWLEDGE/v2/query.py --table radical_matrix --limit 12
python3 MING_KNOWLEDGE/v2/query.py --validate
```

La consulta construye base y extensión sin PDF, Internet, credenciales ni API
pagada. Las tablas enlazan vocabulario, frases, Hanzi, gramática, ejercicios,
radicales, fuentes y cobertura del código.

Radicales: 38 formas registradas; 8 definiciones explícitas de libro; 77 campos
部首 de hojas; 40 caracteres preguntados, incluidos 10 del examen. Las respuestas
propuestas se distinguen de las fuentes y no se convierten en claves oficiales.

**Esto no amplía automáticamente la web ni sus juegos.** Es una base de consulta
para decidir después qué integrar en la aplicación. No modifica Supabase.

## Legado y trazabilidad

Las carpetas v1 `data/`, `lessons/`, `curriculum/` y `sources/` se conservan.
Sus antiguos conteos (214 entradas, 123 Hanzi, 46 frases, 19 fuentes) no describen
v2 ni la funcionalidad actual de la web. Los IDs antiguos no se reutilizan para
frases diferentes. El pack v2.0 sigue intacto; `radical_corrections` documenta las
correcciones verificadas y `radicals_legacy_v2` conserva la extracción anterior.
