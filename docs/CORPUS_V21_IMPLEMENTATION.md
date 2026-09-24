# Integración del corpus v2.1

## Cierre posterior al último preview

- **HEAD disponible al iniciar esta pasada:** `8e0b46c`. El hash observado en el
  preview (`482125945bb4da911adf7ba3a8666a81194e797d`) no estaba presente en el
  repositorio local, por lo que no se hizo reset ni se descartaron cambios.
- **Activación puntual de audio:** el archivo
  `.github/audio-requests/pr8-book-dialogues.json` fija un ID único, alcance,
  modelo, voz, formato, 43 IDs y la huella
  `291abde8e368636d43e02d15170dfd41ef2050276afcdab93f32fe703b360c90`.
  Solo un push de ese archivo a la rama del PR activa el workflow; pushes de CSS,
  componentes o MP3 no lo activan.
- **Alcance pagado:** el generador acepta `--ids-file`, exige coincidencia exacta
  y escribe checkpoints atómicos. El workflow hace checkout de `github.sha`,
  valida la solicitud, genera solo los IDs aún ausentes, conserva checkpoints
  como artefacto ante fallos, verifica decodificación/duración y publica mediante
  push normal únicamente solicitud, manifiestos y MP3 autorizados.
- **Estado real:** la solicitud queda en `requested`; en este entorno no hay
  remoto Git ni sesión `gh`, así que no se pudo producir el push que dispara
  Actions. Los 43 MP3 continúan pendientes y no se consideran generados.
- **Encuadre Hanzi:** se eliminó la compensación CSS fija. Cada solicitud mide el
  borde inferior real de `.topbar` y coloca `#hanzi-detail-start` a 6 px; una
  única corrección adicional responde al cierre del teclado mediante
  `visualViewport`, y las solicitudes anteriores se cancelan al cambiar rápido.
  Se compactaron solamente las separaciones tarjeta–pestañas–visor y se añadió
  soporte de safe area a la navegación inferior, sin reducir glifo ni cuadrícula.
- **Teclado chino obligatorio:** se comprobaron y corrigieron `WordListening`,
  Historia detective, Escena viva y Conversación: sus respuestas Hanzi usan
  selección o bloques en todos los niveles. `PracticeEngine` usa bloques cuando
  la respuesta esperada es china. Los exámenes reciben del servidor un
  `responseType` explícito y bloques barajados sin serializar la clave; pinyin,
  español y números conservan entradas de texto, y la calificación sigue en el
  servidor. Escritura manual no se modificó.

### Verificación de esta pasada

- `query.py --validate` y 13 pruebas Python: aprobadas.
- TypeScript, ESLint, 174 pruebas Vitest y `next build`: aprobados.
- Dry-run con el archivo autorizado: 43 seleccionados, 43 pendientes y ningún
  registro ajeno. No realizó llamadas pagadas.
- E2E/capturas: las regresiones miden una separación de 4–8 px, reselección, dos
  selecciones rápidas y ausencia de segundo salto. No se ejecutaron localmente
  porque el contenedor sigue sin navegador y las descargas externas de Chromium
  están bloqueadas; deben ejecutarse en Actions/preview después del push.

### Paso externo aún necesario

El **Push** de los commits de esta pasada a
`codex/implementar-integracion-del-corpus-v2.1` es la activación autorizada,
porque incluye por primera vez el archivo de solicitud. Debe realizarse con una
credencial que permita disparar workflows; un push efectuado con un token que
suprima eventos no iniciará Actions. Tras la ejecución todavía deben comprobarse
el run identificable, el commit automático de MP3, el preview de ese commit y la
reproducción. La verificación técnica no equivale a una escucha humana de la
pronunciación.

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
  `.github/workflows/generate-corpus-v21-audio.yml` acepta la solicitud puntual
  por push en `codex/implementar-integracion-del-corpus-v2.1`, usa el secreto solo
  en el paso TTS, verifica MP3 con ffmpeg/ffprobe y hace push normal a esa rama.

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

La acción mínima vigente es el push descrito en «Paso externo aún necesario»;
no hay que copiar el secreto, crear otra clave ni fusionar a `main`.

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
