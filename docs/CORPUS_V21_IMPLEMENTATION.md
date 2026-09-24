# Integración del corpus v2.1

## Corrección posterior del PR #8

- **Commit de partida:** `1b1e9a3`.
- **Commit de entrega funcional:** `5de3891` (este informe se actualiza en el
  commit documental inmediatamente posterior, dentro del mismo PR #8).
- **Diálogos:** `scripts/export-corpus-v21.py` selecciona expresamente los seis
  testigos `-BOOK-` y enlaza cada turno con `phrase_evidence` mediante diálogo,
  número de turno, texto y hablante. Ya no publica variantes PPT ni empareja una
  lista deduplicada por posición. La pantalla muestra nombre chino, pinyin del
  hablante cuando existe, color estable por identidad y audio compacto solo si
  el archivo está realmente disponible.
- **Hanzi:** `LinkedChineseText` aplica la fuente hospedada dentro de cada enlace.
  El destino global es `#hanzi-detail-start`; la selección cierra el teclado,
  actualiza la URL y encuadra la tarjeta superior sin esperar la geometría ni
  provocar un segundo salto al cargarse Hanzi Writer.
- **Radicales:** la vista única se agrupa por lección y cada ejemplo conserva su
  lección documental y lectura disponible. Los ejemplos sin pinyin documentado
  no se publican ni se completan por inferencia.
- **Audio:** hay 43 clips de turnos del libro pendientes. El índice
  `mandarin-audio-available.json` evita ofrecer botones para archivos ausentes.
  `.github/workflows/generate-corpus-v21-audio.yml` es manual, está restringido a
  `codex/implementar-integracion-del-corpus-v2.1`, exige la confirmación
  `GENERATE_43_BOOK_DIALOGUES`, usa el secreto solo en el paso TTS, verifica MP3
  con ffmpeg/ffprobe y hace push normal a esa misma rama.

### Pruebas reales de la corrección

- Corpus: `query.py --validate` y 13 pruebas Python aprobadas.
- Aplicación: lint, TypeScript, 171 pruebas Vitest y build aprobados.
- HTML de producción: comprobados dos textos L1 sin variantes, nombres con
  pinyin, vista única de radicales y presencia de `#hanzi-detail-start`.
- Audio: dry-run confirma 43 faltantes y 382 archivos disponibles. La generación
  pagada no se ejecutó desde Codex: `gh auth status` informa que no hay sesión de
  GitHub, por lo que no existe permiso para despachar el workflow.
- Capturas: no disponibles en este entorno. Playwright no tiene navegador y tanto
  su CDN como los repositorios de paquetes respondieron HTTP 403 al intentar
  instalar Chromium. Las pruebas E2E dirigidas quedan versionadas para ejecutarse
  en CI/preview con navegador.

### Acción mínima del propietario

Después de subir estos commits a la rama del PR #8, abrir **Actions → Generate
corpus v2.1 book-dialogue audio → Run workflow**, seleccionar exactamente
`codex/implementar-integracion-del-corpus-v2.1` y escribir
`GENERATE_43_BOOK_DIALOGUES`. No hay que copiar el secreto, crear otra clave,
fusionar a `main` ni ejecutar el workflow desde un fork.

### Pendientes ajenos a esta pasada

No se reauditaron ni rediseñaron bancos de juegos, contratos de examen,
puntuaciones, dificultad, sesiones o persistencia. La corrección conserva esos
módulos; cualquier déficit previo allí sigue fuera del alcance de esta pasada.

## Arquitectura y publicación

`scripts/export-corpus-v21.py` valida y exporta la base con `query.py`, y después
construye `data/corpus-v21-public.json` mediante listas explícitas de campos. La
huella SHA-256 cubre la proyección canónica. El artefacto público no contiene
fuentes, páginas, evidencias, estados editoriales ni material de evaluación de
radicales; la trazabilidad completa permanece en `MING_KNOWLEDGE/v2`.

## Cobertura

- **Vocabulario y frases:** 217 entradas con pinyin y español documentados, y 635
  frases publicables. Los IDs `v-…`, `c-…` y `PH-…` no se reasignan.
- **Diálogos:** seis textos del libro (L1–L3, Texto 1/Texto 2), sin variantes
  PPT en la proyección pública. Los turnos no se mezclan.
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
