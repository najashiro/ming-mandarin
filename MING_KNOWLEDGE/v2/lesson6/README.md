# Lección 6 · 图书馆在食堂北边 · extensión 2.4.0

Fuente editable: `content.json`. Contraste: `SOURCE_REVIEW.md`. Inventario: `page-coverage.json` (93 páginas). Testigos secundarios: `presentation-witnesses.json`.

La extensión añade 74 entradas de vocabulario (54 de listas principales y subentradas, 15 suplementarias y 5 contextuales), 31 turnos de diálogo, 76 frases enlazadas, 8 puntos de gramática, 4 lecturas, 29 objetivos de escritura, 3 radicales definidos, 38 actividades documentales y 4 objetivos de autoevaluación. El contenido de fuente y la elaboración editorial se separan por campos y `origin`.

Los 16 retos del cuaderno, las prácticas de vocabulario y las 4 intervenciones del juego de conversación son adaptaciones Míng. No son claves oficiales. Los 5 grupos de actividades que requieren audio original permanecen abiertos y señalados. No se generó audio ni imágenes.

Comandos desde la raíz:

```sh
python3 scripts/export-lesson6-web.py
python3 scripts/export-lesson6-web.py --check
python3 MING_KNOWLEDGE/v2/query.py --lesson 6 --word 图书馆 --examples
python3 MING_KNOWLEDGE/v2/query.py --lesson 6 --validate
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

La web integra `/study/l6` y `/study/l1-l2-l3-l4-l5-l6`. Se conservan todos los alcances antiguos. `lib/active-corpus.ts` une las extensiones sin reemplazar lecturas antiguas; las fichas L6 muestran su contexto local. Los JSON L1–L5 siguen exportándose de sus propias fuentes.

No se publican PDF ni escaneos. El registro documental histórico 2.2 continúa conservando su alcance L1–L4; 2.4 identifica esta extensión, no una recompilación de sus tablas históricas. Consulta la proyección L6 por el lector global con `--lesson 6`.
