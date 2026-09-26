# Audio de Vocabulario · 25 de septiembre de 2026

Generación solicitada expresamente por el usuario para todas las palabras y
oraciones de Vocabulario. Se reutilizaron 273 recursos y se generaron 642 MP3
con OpenAI `gpt-4o-mini-tts`, voz `marin`. Cobertura: 337 palabras publicadas
y 578 recursos de ejemplo, deduplicados por texto chino y lectura.

Los ejemplos proceden del adaptador de la aplicación y de `examplePhraseIds`.
Las nuevas instrucciones de voz incluyen el pinyin del corpus como referencia
de pronunciación; no se modificó el corpus. Cada frase se graba completa.

Los botones existentes resuelven por texto y lectura a los archivos estáticos.
El registro de disponibilidad se actualiza solo tras comprobar decodificación
y señal. Esta comprobación técnica no equivale a una revisión humana de tonos.
La interfaz identifica la voz como generada por IA.

Resultado: 915/915 recursos decodificados con señal, sin faltantes. Dos salidas
iniciales casi silenciosas (昨天 y 系) se regeneraron antes de registrarlas.
Pasaron 230 pruebas unitarias, lint, typecheck y build; las pruebas de navegador
cubren los botones nuevos, descarga real de MP3, recuperación ante errores,
reproducción exclusiva y persistencia en Chromium y WebKit.

## Mantenimiento

1. `node scripts/vocabulary-resources.mjs --limit=1000 --report=docs/vocabulary-resources.json`
2. `node scripts/prepare-vocabulary-audio.mjs` prepara manifiesto y cuatro listas
   locales de faltantes, sin llamadas pagadas.
3. Con autorización de generación y la clave en el entorno, ejecutar
   `node scripts/generate-pronunciation-audio.mjs --ids-file=tmp/vocabulary/audio-batch-N.json`
   para cada lista N=0–3. Los archivos existentes no se regeneran.
4. Repetir el informe de recursos y ejecutar
   `node scripts/verify-vocabulary-audio.mjs --include-pending --publish`.
   Solo publica disponibilidad si está completo y sin fallos.
5. Actualizar el informe de recursos y compilar la aplicación para consumir
   el manifiesto actualizado. La prueba `vocabulary-audio-coverage.test.ts`
   exige un archivo para cada palabra y cada ejemplo del corpus público.

Documentación del proveedor:
https://developers.openai.com/api/docs/guides/text-to-speech

No se guardaron claves en el repositorio. Los cambios y audios permanecen locales.
