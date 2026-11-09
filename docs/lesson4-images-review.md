# Lección 4 · imágenes y Reto Mixto

## Revisión del 4 de noviembre de 2026

El catálogo de administración acompaña ahora las **114 palabras publicadas de L4**. El inventario combinado tiene 52 palabras con recurso, de las cuales **33 están aprobadas en los manifiestos locales** (antes, 21 de las 73 publicadas). Las decisiones remotas vigentes de Administración siguen prevaleciendo. Las 19 imágenes pendientes y las 62 palabras sin recurso no se presentan como imágenes aprobadas; muchas son nociones abstractas o sentidos gramaticales.

- Cuatro fotografías nuevas, generadas con ImageGen integrado: `学校` (edificio escolar genérico), `女生` (alumna adulta estudiando), `运动` (ejemplo de ejercicio físico) y `手机` (teléfono celular). Se inspeccionaron sujetos completos, alfa, encuadre y ausencia de texto. No se afirma revisión humana independiente.
- Una composición determinista nueva para `昨天`: día anterior a HOY. No asigna intervalos horarios inventados a los períodos del día.
- Dos fotografías existentes revisadas para apoyo contextual: `去` y `说`. Se conservaron sus archivos y prompts; el desplazamiento no distingue por sí solo ir de venir y la conversación no identifica un idioma. Ninguno de estos siete recursos habilita reconocimiento aislado.
- La ampliación textual recupera además cinco imágenes compartidas ya aprobadas: `书`, `唱歌`, `蛇`, `参加` y `教`.
- `门` en esta lección es **clasificador de asignaturas**: no se generó ni vinculó una fotografía de una puerta.

Los PNG maestros y WebP normalizados nuevos están en `public/images/vocabulary/lesson4/`:

| Palabra | Archivo WebP | Tamaño |
| --- | --- | ---: |
| 学校 | `school-fb3205ec9e42.webp` | 76,232 bytes |
| 女生 | `female-student-9f8c5bf06fec.webp` | 131,000 bytes |
| 运动 | `exercise-e7956616852d.webp` | 63,010 bytes |
| 手机 | `mobile-phone-403c2b496311.webp` | 30,978 bytes |
| 昨天 | `yesterday-4beb14604956.webp` | 10,646 bytes |

Los prompts exactos usados y la receta determinista están en `docs/lesson4-image-prompts.json`. El importador conserva los hashes del archivo y prompt, sincroniza el plan al ampliar el corpus y admite `--structured --only=v-昨天` para no regenerar otros recursos. La normalización calcula el contorno desde el alfa visible con margen: el ruido casi transparente (alfa 1) del fondo generado ya no reduce inadvertidamente el tamaño del sujeto. La revisión real de tarjetas móviles detectó el botón de giro sobre el teléfono y la cara del atleta: el teléfono termina en x=1360/1618 y el atleta ocupa como máximo 700 px de alto, anclado a y=960. Estos encuadres liberan la esquina del control conservando la figura completa y el texto.

Validación de esta revisión: 21 pruebas de integridad y publicación de imágenes, revisión de hashes y alfa de cada asset L4, inspección visual de las cinco imágenes nuevas y las dos reutilizadas. Las pruebas comprueban que el plan incluye todas las palabras publicadas y que los apoyos contextuales no se usan como preguntas de reconocimiento aislado. Los derivados de tamaño para la web se generan mediante `scripts/prepare-vocabulary-image-sizes.mjs`, conservando intactos los maestros y sus aprobaciones.

## Registro anterior

Solicitud del usuario: completar los recursos compatibles con el corpus, registrar los prompts en administración y usar el vocabulario aprobado en Reto Mixto.

## Recursos

- 18 recursos nuevos: seis fotografías generadas con ImageGen integrado (correr, levantarse, jugar a la pelota, escuchar, almuerzo y cena) y doce composiciones deterministas (hoy, mañana, mañana del día, tarde, hora en punto, mitad, cuarto de hora, minuto, cero y comparaciones de cantidad).
- Se conservan televisión y dormir: 20 recursos propios de L4. Con el catálogo compartido hay 35 palabras de L4 con recurso y 21 aprobadas en el manifiesto local. Las revisiones vigentes de Supabase prevalecen sobre este manifiesto.
- PNG maestros y WebP derivados: `public/images/vocabulary/lesson4/`. Cada recurso tiene SHA-256 del archivo y del prompt; transparencia real, esquinas transparentes y sujeto completo comprobados. La primera variante de levantarse se descartó por recorte del brazo.
- Prompts y decisiones de las 73 palabras publicadas: `docs/lesson4-image-prompts.json`. Las 38 sin recurso aparecen en el plan de administración; no son aprobaciones ni imágenes generadas. El registro `none` sigue sin imagen.
- Los platos son ejemplos de comida, no una distinción visual universal entre almuerzo y cena. Los diagramas son apoyos editoriales, no reproducciones del libro. No se incorporaron animales ni días de la semana ajenos al vocabulario L4 publicado.
- Revisión realizada por el modelo bajo la autorización del usuario para recursos sin contradicción; no se afirma revisión humana independiente.

## Juego y administración

Reto Mixto consulta las mismas aprobaciones vigentes que Vocabulario. Una imagen oculta, pendiente, obsoleta o inaccesible no reaparece desde el catálogo histórico del juego. Todas las imágenes aprobadas del vocabulario se consideran en su alcance: reconocimiento cuando son aptas, y apoyo tras responder cuando requieren contexto.

La revisión individual de televisión, dormir, correr y jugar a la pelota habilita su recurso concreto para reconocimiento en L4. Esta evaluación del recurso se guarda en `imageQuizEligible`, sin reescribir la clasificación curricular conservadora del corpus. Los demás recursos nuevos solo sirven de apoyo. Se excluyen distractores con el mismo Hanzi, imágenes idénticas o relaciones ambiguas conocidas; los modos de opciones y sus reintentos necesitan cuatro opciones distintas.

L4 combina imagen→Hanzi, Hanzi→imagen, audio→Hanzi, audio→imagen y construcción con los tokens de las siete frases exportadas. No se inventaron diálogos, traducciones ni claves de escucha. Los IDs existentes y los audios se conservan.

Administración incluye el filtro L4, pertenencia a varias lecciones, prompts de recursos generados y el plan de palabras todavía sin imagen. Las aprobaciones siguen vinculadas al archivo y prompt exactos. El encuadre del juego se calcula desde el alfa y centra el sujeto sin alterar la imagen aprobada.

## Reproducibilidad

```powershell
node scripts/lesson4-images.mjs --prepare
node scripts/complete-lesson4-images.mjs --structured
# Aprobar solo después de inspeccionar la composición:
node scripts/complete-lesson4-images.mjs --structured --approve
# Para importar una fotografía inspeccionada, conservar el prompt EXACTO utilizado:
node scripts/complete-lesson4-images.mjs --word=v-跑步 --input=archivo.png --prompt-file=prompt.txt --approve
node scripts/prepare-vocabulary-game-framing.mjs
```

Estos scripts trabajan sin llamadas de generación, claves ni escrituras a Supabase. La generación fotográfica se hizo con ImageGen integrado. `--prepare` conserva los prompts de recursos ya existentes; no sustituirlos por una receta nueva sin regenerar y revisar la imagen.

## Validación

- `pnpm lint`, `pnpm typecheck`, `pnpm test` (279 pruebas) y `pnpm build`.
- `PYTHONUTF8=1 python scripts/export-lesson4-web.py --check`: proyección del corpus intacta.
- Administración: seis casos aprobados en Chromium y WebKit (filtro, aprobación, recarga, ocultación, correcciones, autorización y fallo del almacenamiento), con backend de prueba local.
- Reto Mixto L4: reconocimiento, construcción, alcance y retirada de imágenes probados en Chromium y WebKit con emulación de iPhone.
- La suite general L4 pasó en Chromium. En WebKit, las pruebas generales de navegación registraron cancelaciones de precarga RSC al cambiar de página; la de MP3 no observó avance de reproducción. Esas dos comprobaciones siguen fallando en este entorno; no se presentan como verificadas.

No se ejecutaron migraciones, cambios de RLS ni escrituras en la base de producción. Publicar la rama no equivale a fusionarla ni desplegar producción.
