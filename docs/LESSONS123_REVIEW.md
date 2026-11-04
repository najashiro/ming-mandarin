# Revisión de lecciones 1–3 · 4 de noviembre de 2026

Se releyeron visualmente las páginas curriculares del libro de lecciones 1–2 y las 24 páginas del libro de lección 3, junto con sus cuadernos. Las presentaciones y hojas se contrastaron como fuentes secundarias. Los informes y referencias por página están en `MING_KNOWLEDGE/v2/lessons123/`.

## Resultado curricular

- 337 tarjetas con Hanzi, pinyin, español y al menos un ejemplo completo.
- 79 frases añadidas o recuperadas: 20 transcripciones documentales y 59 ejemplos editoriales separados de la fuente.
- 91 enlaces pedagógicos explícitos; 40 enlaces léxicos documentales recuperados.
- 48 registros de corrección de lectura/traducción, sin reescribir las variantes ni los testigos históricos.
- Prioridad: libro/cuaderno, luego presentación y finalmente apoyo editorial. Las relaciones como 没 → 没有朋友 se registran como pedagógicas y no se inventan tokens por substring.
- IDs y progreso conservados. La exportación histórica v2.1 sigue reproducible; la aplicación consume `data/lessons123-public.json` a través de `lib/active-corpus.ts`.

## Imágenes

Se inspeccionaron las 263 fotos pendientes; 193 se habilitaron como apoyo tras revisión del modelo. Las 70 restantes tenían ambigüedades, referencias pendientes o cantidades incorrectas. La nueva capa contiene 72 recursos: 71 diagramas vectoriales y una escena de entrada generada con `image_gen`. Todos los 305 términos clasificados para apoyo visual disponen ahora de un recurso aprobado localmente. Las 32 entradas con clasificación `none` conservan su ficha textual completa.

Los diagramas usan flechas, cantidades exactas, líneas temporales relativas, banderas verificadas y pinyin. El usuario autorizó expresamente estas anotaciones. Las imágenes que muestran la respuesta llevan `imageQuizEligible:false`. La revisión del modelo no se presenta como validación humana independiente. Las retiradas administrativas y sus hashes siguen teniendo prioridad.

La escena generada está en `public/images/vocabulary/lessons123/enter-annotated.png`. El prompt y el método están en `docs/lessons123-generated-prompts.json`. Los SVG editables, recetas y fuentes de los restantes recursos están en las carpetas/catálogos `lessons123-*`.

## Carga y resiliencia

Los recursos grandes tienen variantes estáticas de 400, 800 y 1200 px con hash de contenido. Los SVG menores se sirven directamente. En la medición local, los originales con variantes suman 31,73 MB y sus versiones para pantalla a 2× suman 7,57 MB: reducción aproximada del 76 %. Esto mide bytes transferibles, no promete un tiempo fijo de carga en producción.

La primera tarjeta solicita su imagen con prioridad. Si falta una variante, se reintenta el original; un fallo transitorio no oculta la imagen durante toda la visita. Las consultas de publicación tienen límites de espera y recuperación. Una caída de la base de revisiones no vuelve a publicar imágenes retiradas.

## Verificación de la publicación aislada

La copia de publicación parte de `fc59621` (el mismo árbol que `19607d1`) y añade exclusivamente la revisión L1–L3, sus imágenes y las mejoras compartidas necesarias para cargarlas. Las fuentes, proyecciones y páginas de L4/L5 conservan su versión de esa base; no se incluye el trabajo de L4 que seguía en curso en otro hilo.

- Suite completa JavaScript: 335 pruebas correctas en 32 archivos.
- ESLint, TypeScript y compilación de producción Next.js/Turbopack correctos; 52 páginas generadas.
- 175 pruebas Python del corpus correctas.
- Proyección L1–L3 reproducible: 337 palabras, 714 frases; fingerprint `eab7a6e5c92eb1a16e8460572eeb8d4434a72019a61a93377951714b832101b4`.
- Los 305 términos L1–L3 con apoyo visual tienen recurso aprobado en el catálogo local. La publicación sigue aplicando las decisiones administrativas.
- Imágenes adaptativas regeneradas sobre esta selección aislada: 317 originales con variantes y 931 archivos WebP; comprobación `--check` y sus dos pruebas unitarias correctas.

Estas comprobaciones corresponden a la copia local preparada para publicar. Los tests de navegador de imágenes y tarjetas se incluyen para su ejecución posterior sobre esta misma copia o el despliegue.

Las correcciones de tipografía del pinyin conservan grabaciones existentes cuando la lectura no cambia. Los cambios reales de tono/final no se vinculan a un audio incompatible. No se generó TTS ni se modificó Supabase. Esta revisión no despliega producción.

## Reproducción

```sh
python3 MING_KNOWLEDGE/v2/query.py --validate
python3 scripts/export-lessons123-web.py --check
python3 scripts/export-corpus-v21.py --check
python3 scripts/export-corpus-v22.py --check
python3 -m unittest discover -s MING_KNOWLEDGE/v2 -p 'test_*.py'
node scripts/prepare-lessons123-pedagogy.mjs --check
node scripts/prepare-lessons123-geography.mjs --check
node scripts/prepare-vocabulary-image-sizes.mjs --check
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```
