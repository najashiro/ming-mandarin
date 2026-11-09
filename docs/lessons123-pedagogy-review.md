# Diagramas didácticos L1–L3

Se crearon 26 diagramas SVG originales y sus derivados WebP. El usuario autorizó expresamente flechas, pinyin y etiquetas dentro de las imágenes didácticas; esta decisión amplía el estándar previo de fotografías sin texto para estos recursos.

- Hanzi y pinyin de encabezados: `data/lessons123-public.json`.
- Ejemplos gramaticales: frases enlazadas del mismo corpus, registradas por ID en `lessons123-pedagogy-recipes.json`.
- Aquí/allí incluyen un hablante como referencia; los años usan desplazamientos relativos, sin depender del año del calendario.
- Las horas son ejemplos, y lunes–viernes se presenta como una semana laboral habitual, no como una regla universal.
- 死 se contextualiza en 我累死了, como intensificador; 在 representa presencia, 是 identificación, y 会 una habilidad aprendida.
- La imagen de 一下 contiene la apertura literal 你说一下 del ejemplo más largo, que se conserva íntegro en la receta.

Los 26 resultados se inspeccionaron visualmente a 400 px de ancho: chino, marcas tonales, flechas, legibilidad y separación de la zona de texto de la tarjeta. Se corrigieron las flechas de las líneas de tiempo para que los nodos no ocultaran su punta. El alfa de las esquinas y de los primeros 700 px del lienzo se valida automáticamente. Revisión del modelo; no revisión humana independiente.

Todos son apoyos explicativos y tienen `imageQuizEligible: false`. No se modificaron fotografías ni se utilizaron servicios de pago. Los WebP de 1618 × 1000 suman 666 004 bytes; la preparación global de tamaños puede generar derivados más pequeños.

Regeneración: `node scripts/prepare-lessons123-pedagogy.mjs`. Los recursos que cambian vuelven a `pending_review`; ejecutar `--approve` solo después de la inspección visual. Comprobación reproducible de SVG, WebP, alfa, manifiesto y prompts: `node scripts/prepare-lessons123-pedagogy.mjs --check`. La rasterización usa Arial Unicode MS en este entorno; repetir en el mismo entorno conserva los hashes de los WebP.
