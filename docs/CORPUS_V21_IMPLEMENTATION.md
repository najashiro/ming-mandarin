# Integración del corpus v2.1

## Arquitectura y publicación

`scripts/export-corpus-v21.py` valida y exporta la base con `query.py`, y después
construye `data/corpus-v21-public.json` mediante listas explícitas de campos. La
huella SHA-256 cubre la proyección canónica. El artefacto público no contiene
fuentes, páginas, evidencias, estados editoriales ni material de evaluación de
radicales; la trazabilidad completa permanece en `MING_KNOWLEDGE/v2`.

## Cobertura

- **Vocabulario y frases:** 217 entradas con pinyin y español documentados, y 635
  frases publicables. Los IDs `v-…`, `c-…` y `PH-…` no se reasignan.
- **Diálogos:** seis grupos (L1–L3, Texto 1/Texto 2), cada uno con una versión
  principal y su variante cuando existe. Los turnos no se mezclan.
- **Hanzi:** mantiene progreso y escritura manual. El selector busca únicamente
  por pinyin local desde una letra; se retiraron filtros de dominio y contenido
  de radicales. `tab=Componentes` redirige al panel «Palabras y frases».
- **Radicales:** ocho definiciones explícitas, con relaciones Hanzi cuyo estado es
  `documented_in_course_source`. No se exportan bancos, candidatos ni respuestas
  del examen.
- **Audio:** el sincronizador añade cada turno como clip completo al manifiesto.
  La generación usa `gpt-4o-mini-tts` y voz `marin`; dry-run y reanudación evitan
  llamadas para archivos existentes. La revisión de bytes no sustituye escucha humana.

## Mapa y compatibilidad

Las frases nuevas conservan `PH-…`; las frases históricas `s-l…` continúan en sus
consumidores actuales y no se reinterpretan por posición. Los enlaces Hanzi usan
`?character=…&focus=glyph`, y el retorno al turno se transmite como URL interna.
No se hicieron migraciones de usuarios, cambios de RLS ni despliegues.

## Audio bloqueado o pendiente

El inventario exacto se obtiene con `pnpm audio:manifest` y
`pnpm audio:generate --dry-run`. Un clip solo se considera listo si su MP3 existe
y pasa `pnpm audio:verify`; cualquier falta de `OPENAI_API_KEY`, cuota o red debe
registrarse como bloqueo y nunca como audio generado.

## Validaciones

Se ejecutan la validación y tests Python del corpus, la prueba unitaria de la
proyección, lint, TypeScript, suite Vitest y build. La comprobación visual móvil
debe cubrir 360, 390 y 430 px en el preview del PR.
