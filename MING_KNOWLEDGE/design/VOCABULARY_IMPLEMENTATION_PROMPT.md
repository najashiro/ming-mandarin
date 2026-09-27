# Prompt reutilizable · Vocabulario Míng

Este prompt implementa el estándar
`ming-vocabulary-transparent-subject-golden-v2`, versión `2.0.0`. Guardarlo no
ejecuta generación de imágenes ni cambia por sí mismo el runtime.

## Prompt de implementación

```text
Trabaja en Míng para aplicar el estándar visual de Vocabulario aprobado:
ming-vocabulary-transparent-subject-golden-v2, versión 2.0.0.

FUENTE DE VERDAD
1. Lee AGENTS.md, MING_KNOWLEDGE/AGENTS.md,
   MING_KNOWLEDGE/design/VOCABULARY_STYLE.md y
   MING_KNOWLEDGE/design/vocabulary-style.json.
2. Inspecciona la referencia
   MING_KNOWLEDGE/design/references/vocabulary-transparent-subject-approved.png.
   Es una maqueta de interfaz: no extraigas de ella contenido curricular ni la
   recortes para crear assets.
3. Usa solo datos curriculares auditados. No inventes Hanzi, pinyin,
   traducciones, ejemplos ni relaciones.

OBJETIVO VISUAL
Una tarjeta horizontal marfil de proporción áurea con el texto abajo a la
izquierda, controles en las esquinas y un sujeto fotográfico aislado a la
derecha. El asset del sujeto tiene transparencia real. El color de la tarjeta,
los textos, cualquier degradado y todos los controles son HTML/CSS.

No reutilices el estilo anterior de fotografía a sangre con habitación china,
bokeh o fondo ambiental. No hornees un fondo blanco o marfil dentro del asset.

GEOMETRÍA
La tarjeta completa tiene ancho/alto 1.61803398875. Referencia 400 × 247.2136
px. CSS base: box-sizing:border-box; width:100%; max-width:25rem;
aspect-ratio:1.61803398875 / 1. Radio 18 px, borde #e5e0d6, superficie #fffdf8
y sombra discreta. Usa una columna a 320–430 px. Con zoom o contenido largo,
permite crecimiento vertical; no recortes texto ni lo reduzcas para forzar la
proporción.

IMAGEN TRANSPARENTE
Renderiza la imagen como una capa independiente. Usa object-fit:contain y
posición focal a la derecha. Zona normal del sujeto x=46–96%, y=3–96%; zona
segura de texto x=4–43%, y=55–94%. Conserva completas orejas, patas, cola,
instrumentos, platos, asas y extremos. No permitas que el sujeto invada los
controles superiores o el texto.

Los maestros son PNG con canal alfa; WebP con alfa puede ser derivado web.
Objetivo 1618 × 1000 px. Si la API entrega un tamaño cercano, normaliza después
sobre un lienzo transparente de esa proporción, sin deformar ni cortar. Se
permite una sombra de contacto tenue y semitransparente, nunca un suelo opaco.
Rechaza archivos con fondo blanco, píxeles opacos en las esquinas, halos de
recorte, texto, UI, marcas, logos o elementos secundarios dominantes.

TIPOGRAFÍA Y CONTROLES
Hanzi frontal 43.2 px (38.4 px móvil), peso 500, #173b32. Pinyin 16 px,
#466451. Español 11.52 px, #746f68. Audio transparente de 44 px con icono jade
#315848 de 20 px junto al Hanzi. Favorito arriba a la izquierda y giro arriba a
la derecha, transparentes, con foco visible y aria-label. No hornees ninguno de
estos elementos en la imagen.

REVERSO Y COMPORTAMIENTO
Conserva el reverso salvia #e6eee5, jerarquía de frase, énfasis #b34424, audio
real y «Otro ejemplo» con #f5f8f2 y borde #c4d1c0. Oculta allí el audio de la
palabra; conserva el audio de frase cuando exista y los enlaces Hanzi. No
reintroduzcas procedencia ni «escritura». Reinicia al anverso en los eventos
definidos por el JSON. Conserva IDs, favoritos, progreso, búsqueda, audio y
relaciones pedagógicas auditadas; no descubras ejemplos por substring. No
modifiques corpus, Supabase ni producción.

VERIFICACIÓN
Comprueba proporción, transparencia real, halos y recorte con gato, perro,
baozi, piano, objetos claros y oscuros. Prueba la misma imagen sobre varios
colores de tarjeta: solo el sujeto y su sombra de contacto deben permanecer.
Revisa anverso/reverso en 320, 375, 390, 430, 768 y 1280 px en Chromium y
WebKit, además de teclado, contraste, texto al 200 % y movimiento reducido.
Registra prompt, versión de estilo, ruta y estado de revisión de cada asset.
```

## Prompt maestro para cada imagen

Reemplazar las variables únicamente con datos auditados. Cada solicitud produce
un asset de sujeto; nunca una tarjeta terminada.

```text
Use case: photorealistic educational vocabulary cutout.
Project: MÍNG, active Mandarin vocabulary.
Style ID: ming-vocabulary-transparent-subject-golden-v2.

Create ONE photorealistic isolated subject illustrating {AUDITED_MEANING}.
Main subject: {SUBJECT_DESCRIPTION_AND_COMPLETE_PARTS}.
It must be immediately recognizable to a beginner learning Mandarin.

OUTPUT AND TRANSPARENCY
Deliver a clean PNG cutout with a genuine transparent alpha background.
There must be no white, ivory, gray, colored, studio, indoor or outdoor
background. Transparent pixels must extend to every canvas edge and corner.
Do not simulate transparency with a checkerboard. Preserve fine hair, steam and
edge detail without a white or dark halo.

COMPOSITION
Horizontal golden-ratio canvas, target 1618 × 1000 px or the nearest supported
landscape size. Place the complete subject toward the center-right, generally
inside x=46–96% and y=3–96%. Reserve transparent negative space on the left,
especially x=4–43% and y=55–94%, for live HTML text. Keep both upper corners
clear for UI controls. Do not crop, distort or unnaturally miniaturize the
subject. The application may normalize the result onto a 1618 × 1000 transparent
canvas after generation.

APPEARANCE
Natural premium product or animal photography, realistic proportions and
materials, sharp subject, calm diffuse daylight, gentle contrast and accurate
color. A subtle soft contact shadow with partial transparency is allowed to
ground the subject. No opaque floor, wall, room, scenery or decorative props.

AVOID
Text, Chinese characters, pinyin, captions, UI, buttons, speaker icons, stars,
arrows, watermarks, brands, logos, frames, cards, colored rectangles, gradients,
collages, extra dominant subjects, cut-off body parts, cartoon or illustration.

Deliver only the isolated transparent subject. The application renders the
card color, typography, gradients and controls with accessible HTML/CSS.
```

## Variantes de control visual

| Sujeto | Descripción para la variable |
| --- | --- |
| Baozi | Tres bollos al vapor y su plato cerámico completos; pliegues y vapor sutil visibles. |
| Perro | Un golden retriever sentado; cabeza, orejas, patas y cola completas. |
| Gato | Un gato doméstico sentado; cabeza, orejas, patas y cola completas. |
| Piano | Un piano vertical negro sin marca; tapa, teclado, patas y pedales completos. |

Estas variantes comprueban composición y transparencia; no agregan contenido
curricular. Una respuesta exitosa de la API no equivale a un asset aprobado:
debe pasar revisión de alfa, encuadre y renderizado sobre la tarjeta.
