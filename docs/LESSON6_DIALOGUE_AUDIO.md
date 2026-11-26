# Audios de diálogos L6 · 2026-11-26

El usuario pidió completar los audios pendientes en la sección Diálogos de la lección 6. El lote cubre las 31 intervenciones de sus dos diálogos: conserva 15 grabaciones existentes y añade 16 MP3 de práctica generados con IA. No cambia el texto, pinyin, traducciones, IDs ni respuestas del corpus.

Los nuevos audios se registran en `data/lesson6-dialogue-audio.json`; el resolver solo habilita los archivos de `data/lesson6-dialogue-audio-available.json`. La lección y sus repasos acumulados comparten la misma resolución por texto y lectura. Las grabaciones previas conservan precedencia.

## Verificación

- Los 16 archivos se decodifican y contienen señal audible; duración conjunta: 63,6 segundos.
- Transcripción independiente: 14 coincidencias completas y dos diferencias revisadas. 三十五 equivale al número 35 mostrado; la transcripción omitió el primer 有 de una repetición, pero dos comprobaciones de audio confirman ambos 有 con una pausa.
- Revisión automatizada de los 16 clips y cinco comprobaciones focalizadas. Se regeneraron las dos frases con pronunciaciones poco claras de 宿舍楼 y 前边 y se revisaron sus nuevos hashes.
- Los informes vinculan cada decisión al SHA-256, texto y pinyin del archivo actual. No se afirma revisión humana independiente ni certificación exhaustiva de tonos.
- El corpus L6 y su exportación permanecen válidos. La preparación del lote es reproducible antes y después de registrar disponibilidad.
- Pasan lint, TypeScript, las 592 pruebas unitarias de 54 archivos y la compilación de producción. El build usa el runtime Node local compatible con los complementos nativos de Next.js.
- Chromium de escritorio, Chromium móvil y WebKit iPhone reproducen los 31 turnos con audio nativo: 93 reproducciones comprobadas, todos los MP3 servidos correctamente, cero indicadores de audio pendiente y cero errores de página. Las capturas están en `test-results/lesson6-dialogue-audio-*/lesson6-dialogue-audio.png`.

La evidencia se guarda en `lesson6-dialogue-audio-{reuse,verification,transcription,listening-review,review,repairs}.json` dentro de esta carpeta. Las instrucciones de reparación persisten y se reaplican al preparar el manifiesto.

## Mantenimiento

```sh
pnpm audio:l6:dialogues:prepare
pnpm audio:l6:dialogues:verify
```

La preparación y la verificación sin opciones son locales. La generación requiere autorización y credenciales locales. `--transcribe` realiza llamadas de verificación; `--publish` registra disponibilidad local únicamente tras verificar señal, transcripción y revisión vigente. No despliega la web.

La actualización se prepara en `codex/lesson6-dialogue-audio-20261126` sobre `abd9d38`, la versión más reciente del trabajo local de Míng. No se fusiona a `main` ni se publica producción como parte de esta preparación.
