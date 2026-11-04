# Generación de recursos L5 · 3 de noviembre de 2026 (Lima)

Se hicieron **38 generaciones de imagen**: 30 iniciales y 8 revisiones de encuadre. Se publican 30 imágenes diferentes para 35 palabras. Modelo autorizado: `gpt-image-1.5`, calidad media, 1536 × 1024, fondo transparente, mediante el CLI de la habilidad ImageGen.

El componente de salida de imágenes se estima en **US$1.90**: 38 × US$0.05. A ello se suman los tokens de los prompts (24 804 caracteres; no son tokens), a US$5 por millón de tokens. [Tarifa oficial del modelo](https://developers.openai.com/api/docs/models/gpt-image-1.5).

Se hicieron **260 solicitudes de voz**: 255 clips, 4 regeneraciones por señal insuficiente y 1 prueba inicial de clave. Los 255 MP3 publicados suman **628.104 segundos (10.47 minutos)**. `gpt-4o-mini-tts`, voz marin: US$0.60 por millón de tokens de texto y US$12 por millón de tokens de audio. [Tarifa oficial](https://developers.openai.com/api/docs/models/gpt-4o-mini-tts).

**El gasto total facturado no está disponible en estos resultados.** El CLI no guardó el campo de uso de imágenes y las respuestas MP3 no proporcionan tokens facturados. No se debe presentar US$1.90 como total de la tarea: corresponde solo a la salida estimada de imágenes. Para conciliar exactamente entrada, audio, caché e impuestos hay que consultar Usage/Billing de la cuenta OpenAI. El registro JSON conserva los conteos medidos y las tarifas sin inventar consumo de tokens.

Maestros PNG locales: `output/imagegen/lesson5/` (incluye versiones descartadas). Derivados web versionados: `public/images/vocabulary/lesson5/`. Prompts finales: `docs/lesson5-image-prompts.json`; hashes: `docs/lesson5-image-assets.json`. Audio publicado: `public/audio/mandarin/l5-*.mp3`; manifiesto: `data/lesson5-audio.json`.

La clave se guarda exclusivamente en `.env.audio.local`, ignorado por Git y con permisos 600. No se necesita enviar la clave al navegador ni a Vercel para reproducir estos archivos estáticos.
