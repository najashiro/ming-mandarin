# Lección 4 · corpus 2.2.0

La extracción documental está integrada: consulta `../query.py`, no los PDF ni los fragmentos base64 por defecto. Comienza con `README.md`, `manifest.json` y `page-coverage.tsv`. `../query_v21.py` es exclusivamente la instantánea L1–L3.

Aplica `../../SOURCE_AUTHORITY.json` y `selection-policy.json`. Conserva los dos diálogos completos del libro como canónicos, las variantes docentes como evidencia y las lecturas aisladas de hojas separadas de la pronunciación contextual. Una prioridad documental no permite inventar datos ausentes.

Las 121 páginas y 295 bloques contienen instrucciones, ítems, opciones, huecos, tablas, lecturas, modelos, gramática, fonética, cultura y objetivos de escritura. No confundir un campo descriptivo/editorial con una transcripción literal. El pinyin/español no impreso y las claves de escucha sin audio siguen sin inventarse.

Los TSV de la PR22 permanecen como controles de regresión y trazabilidad; el paquete completo es `documents/manifest.json`. No editar `.cache-v22/` ni la proyección pública manualmente. Tras cambios ejecuta la validación global, las pruebas v2 y lesson4, y ambos exportadores en modo --check. No publicar PDF, escaneos, secretos ni recursos pagados, ni cambiar runtime, Supabase o progreso. No fusionar ni desplegar por iniciativa propia.
