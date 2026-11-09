# Publicación de la revisión L4 · 2026-11-04

La revisión basada en los PDF de la lección 4 está publicada en producción. Incluye las mejoras revisadas de L1–L3 y conserva los juegos de cuaderno que ya estaban publicados.

- Sitio: https://ming-mandarin-gamma.vercel.app
- Lección: https://ming-mandarin-gamma.vercel.app/study/l4/vocabulary
- Despliegue: `dpl_J92b5TV2qP1w2Yo5mCRh4ftGQnNS`, estado `READY`, alias de producción confirmado sin errores.
- URL inmutable: https://ming-mandarin-a68w29nmy-najashiro.vercel.app
- Rama: `codex/publish-lesson4-20261104`.
- Commit: `68eaa1e6b61a323e7bb76332fe4b17dc01237e80`.
- Árbol: `cb0f88394f2812eb1e0e51f195e78c43c4bb283c`.
- El commit combina la revisión L1–L4 (`2ef4d407a60ec3aa3e178014f2a2d755d81584d5`) con los juegos publicados (`058a20216edf24afb0a7a0cf2856e14a75d1232d`).
- Compilación de Vercel: aproximadamente 62 segundos.

## Validación

El snapshot combinado pasó 368 pruebas unitarias, la compilación de producción y 12 pruebas de los juegos en Chromium y WebKit. La revisión documental y sus comprobaciones anteriores están en `LESSON4_PDF_REVIEW.md` y `LESSON4_WEB.md`.

En el dominio de producción pasaron las 22 comprobaciones funcionales: 11 en Chromium de escritorio y 11 en WebKit móvil. Se verificaron 114 tarjetas, pinyin y traducciones recuperadas, siete tablas gramaticales y 57 ayudas de lectura, seis lecturas, 62 actividades, 25 caracteres del libro y cuatro imágenes nuevas con variantes estáticas y caché inmutable. No se registraron errores de consola ni de ejecución del navegador. La consulta de logs del nuevo despliegue tampoco mostró entradas de nivel error o fatal en la ventana de diez minutos consultada.

La prueba inicial registró cancelaciones de descargas durante la navegación rápida en WebKit. Los 34 recursos únicos fueron comprobados por separado mediante GET real: todos respondieron HTTP 200 con contenido válido. Al repetir esperando a que terminaran las descargas de cada página, quedó una cancelación de una variante de imagen; todas las comprobaciones funcionales volvieron a pasar. El indicador estricto `passed` de ese script permanece en false porque trata cualquier cancelación como fallo; no equivale a un recurso inaccesible. Se conservan los reportes originales sin alterar.

Las rutas de L1 (进), L3 (后年) y los juegos de cuaderno L4 respondieron HTTP 200 con el contenido esperado. Las imágenes comprobadas descargaron entre 3,4 y 11,3 kB en escritorio y entre 16,3 y 59,5 kB en móvil de alta densidad.

Evidencias locales (ignoradas por Git):

- `tmp/lesson4-production-check/report.json`
- `tmp/lesson4-production-check/resource-recheck.json`
- `tmp/lesson4-production-check-settled/report.json`

Las verificaciones de producción solo efectuaron GET/HEAD con contextos nuevos; se bloquearon escrituras de analítica y almacenamiento del navegador. La publicación no ejecutó migraciones, cambios de RLS ni regeneración de audio. No se fusionó la rama a `main`. No se publicaron los PDF ni `Base de Datos/`.
