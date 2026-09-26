# Prompt reutilizable · Vocabulario Míng

Este prompt implementa el estándar `ming-vocabulary-immersive-zh-golden-v1`.
Su almacenamiento no ejecuta los pasos ni cambia por sí mismo la web.
Leer primero [`VOCABULARY_STYLE.md`](VOCABULARY_STYLE.md) y los valores de
[`vocabulary-style.json`](vocabulary-style.json).

## Prompt de implementación

```text
Trabaja en Míng para aplicar el estándar visual de Vocabulario aprobado:
ming-vocabulary-immersive-zh-golden-v1, versión 1.1.0.

FUENTE DE VERDAD
1. Lee AGENTS.md, MING_KNOWLEDGE/AGENTS.md y
   MING_KNOWLEDGE/design/VOCABULARY_STYLE.md.
2. Carga MING_KNOWLEDGE/design/vocabulary-style.json. Sus valores mandan sobre
   proporciones aproximadas de cualquier captura o maqueta.
3. Inspecciona MING_KNOWLEDGE/design/references/vocabulary-immersive-zh-approved.png.
   Es la segunda propuesta de la última tanda: tarjetas horizontales con
   fotografía inmersiva, fondos chinos difuminados y traducción pequeña.
4. Usa los datos curriculares auditados y las relaciones públicas resueltas.
   No revises PDF por defecto ni inventes frases, pinyin o traducciones.

OBJETIVO VISUAL
Una ficha compacta y coherente en toda la sección: fotografía realista a sangre,
sujeto nítido y completo, ambiente chino sobrio muy desenfocado, degradado marfil
suave bajo el texto, Hanzi protagonista, pinyin secundario, traducción pequeña
y tenue. Audio sin fondo junto al carácter. Sin rectángulo interior
de imagen, marco blanco, pie de foto separado o fila adicional de botones.

GEOMETRÍA OBLIGATORIA
La ficha completa tiene ancho/alto 1.61803398875. Referencia 400 × 247.2136 px.
CSS: box-sizing:border-box; width:100%; max-width:25rem;
aspect-ratio:1.61803398875 / 1. El alto se calcula, no se fija a un valor único.
Foto, texto y controles están incluidos en esa proporción. Radio 18 px.
Rejilla responsive: ancho útil por ficha de al menos 288 px cuando sea posible;
una columna a 320–430 px; separación 12–16 px; relleno del texto 12–16 px.
Usa la misma geometría por defecto en fichas con y sin foto y en ambas caras.
Con zoom, contenido largo o reversos extensos, permite crecimiento vertical
accesible. Nunca cortes texto ni lo hagas ilegible para forzar la proporción.

FOTOGRAFÍAS
Revisa cada asset existente. Los cuadrados con fondo visible o encuadre que
corta perro, gato, piano u otros sujetos deben reemplazarse al ejecutar la
generación autorizada. Usa el prompt fotográfico que acompaña este documento.
Genera una imagen individual por palabra, sin interfaz, texto ni marcas.
Fondo chino elegante: madera, celosías, cerámica celadón, bambú, luz cálida,
pocos elementos. Fondo con bokeh en TODOS los casos, sujeto perfectamente nítido.
Reserva abajo a la izquierda espacio para etiquetas y arriba para controles.
Conserva todo el sujeto: orejas, patas y cola en animales; teclado, tapa,
patas y pedales en el piano; alimento y recipiente completos.
Usa cover solo con imágenes ya compuestas para el formato y posición focal
verificada. No uses contain que produzca rectángulos ni blur sobre todo el asset.
Las fotos finales viven en el repositorio y el manifiesto conserva IDs y
metadatos. Crea archivos versionados; no cambies recursos de otros juegos
indirectamente al sobrescribir imágenes compartidas.

TIPOGRAFÍA Y CONTROLES
Hanzi frontal 43.2 px (38.4 px móvil), peso 500, #173b32.
Pinyin 16 px, peso 400, #466451; conservar tonos legibles.
Español 11.52 px (0.72rem), peso 400, #746f68: tercer nivel, nunca igual al pinyin.
Usa fuentes ya cargadas en Míng; no hornees textos ni botones en imágenes.
Audio: área transparente de 44 px, icono jade #315848 de 20 px.
Favoritos arriba a la izquierda, giro arriba a la derecha, fondo transparente, áreas táctiles de 44 px. No tapar el sujeto ni anidar botones.
Asegura foco visible fuera del recorte de la foto, teclado y aria-label.
Conserva estados de reproducción y favorito; no dibujes controles ficticios.
Refuerza el degradado si el texto tenue pierde contraste sobre la fotografía.

REVERSO PEDAGÓGICO
Fondo #e6eee5; palabra estudiada a 24 px, peso 400 y #687169, sin su audio.
Frase china a 28 px (26 px móvil); énfasis solo en la palabra/tramo estudiado
en negrita #b34424. Usa vínculos léxicos/pedagógicos auditados y no descubrimiento
de ejemplos por substring. Pinyin 16 px, traducción 11.52 px tenue.
Audio de frase a su lado si existe. «Otro ejemplo» pequeño visualmente pero
con área táctil 44 px. Conserva enlaces individuales a Hanzi disponibles.
No añadas procedencia, botón escritura ni explicaciones técnicas para alumnos.

COMPORTAMIENTO
Reinicia las caras al cambiar filtro, lección, favoritos, página, activar o
escribir en el buscador, seleccionar resultado y recargar. Favoritos y progreso
siguen guardados; las caras no. Conserva IDs, búsqueda global, lecciones,
partición exclusiva, ejemplos globales y funciones de Vocabulario Mix.
No modifiques corpus, Supabase, audio ni progreso como parte de un cambio visual.

IMPLEMENTACIÓN Y VERIFICACIÓN
Inspecciona primero los componentes reales y sus pruebas. La rama local de
vocabulario puede contener avances aún no presentes en main; no los descartes.
Centraliza los tokens; no pegues CSS específico por palabra o lección.
Separa superficie fotográfica, gradiente, textos y controles accesibles.
No uses la captura aprobada como fotografía de producción.
Comprueba tarjetas normales con ancho/alto=phi (tolerancia 0.01), y documenta
excepciones de contenido largo/zoom. Verifica 320, 375, 390, 430, 768 y 1280 px
en Chromium y WebKit: anverso, reverso, audio, filtros, búsqueda, favoritos,
recarga, enlaces Hanzi, imágenes fallidas y progreso. Revisa perro, gato,
piano, baozi y vocablos largos. Incluye teclado, contraste y texto al 200 %.
Ejecuta los checks pertinentes del repositorio y adjunta capturas finales.
Indica qué se implementó y qué recursos siguen pendientes; no afirmes que
guardar esta especificación equivale a desplegar la interfaz.
```

## Prompt maestro para cada fotografía

Reemplazar las variables con una palabra y un significado ya auditados. Cada
solicitud produce **una fotografía**, nunca una tarjeta con texto. La generación
de nuevos assets debe estar incluida en el encargo de implementación; este
archivo no dispara llamadas ni guarda credenciales.

```text
Use case: photorealistic-natural / educational vocabulary asset.
Project: MÍNG, active Mandarin vocabulary.
Style ID: ming-vocabulary-immersive-zh-golden-v1.

Create ONE photorealistic photograph illustrating {AUDITED_MEANING}.
Main subject: {SUBJECT_DESCRIPTION_AND_COMPLETE_PARTS}.
The subject must be immediately recognizable for a beginner learning Mandarin.

Composition: a horizontal golden rectangle, width:height approximately
1.618:1, target master 1618 × 1000 pixels or the nearest supported landscape
resolution. The web card will enforce the exact outer ratio with CSS.
Compose for that ratio from the start. Subject toward center-right, generally
inside x=42–94% and y=16–88%, adjusted for the complete subject. Preserve
safe margins around ears, paws, tails, instrument edges, dishes and handles.
Reserve quiet low-detail negative space at lower left (x=4–40%, y=58–94%)
for text added later in HTML. Keep both upper corners quiet for UI controls.
Do not crop the learning subject. Do not distort or miniaturize it unnaturally.

Setting: a tasteful contemporary Chinese home or tea-room appropriate to the
subject. Subtle warm timber lattice windows, pale plaster, bamboo or a celadon
vase, soft natural daylight. Use only a few contextual details. Maintain
consistent warm ivory, muted jade and natural wood tones across the series.

Optics: main subject sharply focused, distant background strongly defocused
with shallow depth of field and creamy natural bokeh, similar to refined food
photography. This applies equally to animals, food and instruments. Preserve
realistic depth, contact shadows and soft warm light. No global blur on the
subject, no cutout halo and no obvious pasted-on background.

Lighting: diffuse daylight, gentle contrast, no harsh shadows, calm premium
editorial photography. Pale quiet lower-left background for a subtle ivory
gradient to be added by the website. Full-bleed photographic scene with no
frame, matte, internal border or separate white caption panel.

Avoid: text, Chinese characters, pinyin, captions, UI, buttons, speaker icons,
stars, arrows, watermarks, brand names/logos, collages, extra dominant subjects,
cut-off body parts, floating objects, exaggerated red festival decorations,
dragons, cartoon/illustration style, busy sharp background.

Deliver only the photograph. The application will render all text, gradients
and controls as accessible HTML/CSS. Match the approved reference's photographic
style and depth of field, without reproducing its embedded UI or typography.
```

Variantes de sujeto para comprobar la consistencia visual (no son contenido
curricular nuevo):

| Sujeto | Descripción para la variable |
| --- | --- |
| Baozi | Tres bollos al vapor sobre plato cerámico, pliegues y vapor sutil visibles; plato completo. |
| Perro | Un golden retriever sentado, cabeza, orejas, patas y cola completas; fondo chino muy difuminado. |
| Gato | Un gato doméstico sentado, cabeza, orejas, patas y cola completas; misma luz y grado de desenfoque. |
| Piano | Un piano vertical negro sin marca; tapa, teclado, patas y pedales completos; ambiente chino discreto y difuminado. |

Guardar el prompt utilizado, estilo/versión, ruta del asset y estado de revisión
en los metadatos de producción. Comprobar el encuadre renderizado antes de
marcar un recurso como listo; una generación exitosa no garantiza su ajuste.

## Ajuste aprobado: 25 de septiembre de 2026

Hanzi principal +20 % (43.2 px; 38.4 px móvil), traducción −10 % adicional (11.52 px), pinyin sin cambios (16 px). Botones de la ficha transparentes, sin fondo ni sombra, con área táctil de 44 px y foco visible. Eliminar el panel blanco localizado detrás del texto; conservar únicamente la transición global suave de la fotografía a la izquierda. Estas indicaciones sustituyen los fondos de controles descritos en la versión inicial.
