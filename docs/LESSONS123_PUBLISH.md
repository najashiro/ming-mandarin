# Publicación de L1–L3 · 2026-11-04

Producción: https://ming-mandarin-gamma.vercel.app

La versión conjunta `68eaa1e6b61a323e7bb76332fe4b17dc01237e80` está READY en Vercel (`dpl_J92b5TV2qP1w2Yo5mCRh4ftGQnNS`). Incluye las mejoras L1–L3, L4 y los juegos del cuaderno. Se compararon los datos L1–L3, sus cinco catálogos visuales, todos los assets nuevos y el código de entrega: son idénticos al snapshot aislado revisado.

Snapshot L1–L3: commit `30875a1ddf3d2ed03e392adefbac45f8f3d7edfe`, árbol `c0073222b98c2d11b5a9ccdd6d48c36e121c0f94`, [PR #38](https://github.com/najashiro/ming-mandarin/pull/38). Sus 1.119 archivos cambiados se verificaron por hash al subirlos. Se validaron 335 pruebas JavaScript, 175 pruebas Python, lint, TypeScript, exportaciones reproducibles y build de producción. El despliegue separado `dpl_6iaMf6NJDdj4mvDDh6d54VJPCXfo` se canceló antes de finalizar al detectar la publicación conjunta más reciente; no sustituyó el dominio público.

Verificación de producción: los 72 recursos nuevos responden HTTP 200 y sus SHA-256 coinciden. Se comprobaron seis tarjetas con Hanzi, pinyin, español y ejemplo completo en Chromium y WebKit/iPhone. No se detectaron errores reales de JavaScript. Los originales pequeños que Safari elige para algunos diagramas no son fallos de la selección responsiva.

## Aprobaciones de imágenes

Las aprobaciones históricas de 到, 汉语 y 进 apuntaban a archivos y prompts antiguos. Se comprobó que sus prompts eran los valores originales, sin correcciones administrativas adicionales. Con la autorización de publicar los cambios se actualizaron únicamente esas tres aprobaciones mediante la función existente `save_vocabulary_image_review`, con control de revisión y de hashes previos. Pasaron de revisión 1 a 2; el revisor se dejó nulo para no atribuir una revisión humana independiente. Se guardó copia de las filas anteriores en `/tmp/ming-lessons123-image-approvals-before.json`.

Las decisiones explícitas `no_image` de 很, 太 y 在 permanecen intactas en revisión 1. Sus nuevos archivos están desplegados pero no se muestran en las tarjetas. No se ejecutaron migraciones, cambios de RLS, generación de TTS ni cambios de progreso.

Confirmación final: API pública HTTP 200 con 328 imágenes, incluidas 69 de las 72 nuevas. Las 12 comprobaciones de tarjetas pasan; 到 y 汉语 responden con el archivo exacto y 进 muestra su nueva imagen en ambos navegadores. Las tres exclusiones restantes corresponden a `no_image`. Evidencia local en `tmp/lessons123-review/ming-lessons123-publication-final.json`.
