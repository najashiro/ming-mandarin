# Revisión L1–L2 del 4 de noviembre de 2026

El lote `ming-lessons12-review-20261104` completa las tarjetas sin alterar los
identificadores existentes ni el corpus histórico v2.1. Las correcciones y
ejemplos viven en `lesson12-review.json`; el compilador activo y su proyección
web deben consumirlos. Las referencias usan páginas PDF, numeradas desde 1.

## Fuentes revisadas

- Libro L1–L2: inspección visual de todas las páginas PDF 44–88, que contienen
  las dos lecciones completas. La introducción fonética anterior no se volvió
  a auditar como parte de este lote.
- Cuaderno L1–L2: inspección visual de las páginas PDF 1–18, incluida la página
  final vacía. No se reconstruye audio de escucha ni se rellenan ejercicios.
- Presentaciones: comprobación acotada de los suplementos que originaban
  tarjetas sin ejemplos y de sus lecturas. Las páginas concretas y el método
  quedan en `reviewed_sources`. Esto no certifica una relectura integral de las
  presentaciones.

El libro y el cuaderno tienen prioridad. Las diapositivas se usan para
ampliaciones que no están en las tablas del libro. Ninguna ilustración del PDF
se publica ni se reutiliza como imagen de producción.

## Hallazgos y cambios

Las tablas de palabras nuevas y suplementarias del libro L1–L2 ya estaban
incluidas en el corpus. Los problemas principales eran colocaciones omitidas,
vínculos ausentes y ejemplos incompletos desde el punto de vista de la tarjeta.

Se recuperan siete expresiones impresas: `吃饭` (libro p70), `同学和老师`,
`面包很好吃`, `喜欢吃汉堡包`, `汉堡包和比萨饼` (libro p78), y `这是比萨饼。`,
`我喜欢吃面包。` (cuaderno p15). Las dos últimas ya están impresas en la
actividad; no son respuestas inventadas para sus huecos. El pinyin y el español
añadidos se registran como apoyo editorial separado.

Se enlazan explícitamente cinco casos donde existía la frase pero la tarjeta
no podía seleccionarla: `们` → `你们好！`, `同学` → `这是我同学，你们认识吗？`,
`干嘛` → `干嘛呢？`, `干啥` → `在干啥？` y `死` → `我累死了。`. Los vínculos de
`们` y `死` son morfológicos y contextuales; no habilitan herencia automática
por coincidencia de caracteres.

Los 45 ejemplos editoriales cubren países, idiomas, saludos y vocabulario de
ampliación sin ejemplo literal recuperable. Usan construcciones sencillas
estudiadas. `origin: ming_editorial_example`, `source_refs: []` y `basis_refs`
distinguen el ejemplo creado de la evidencia de sus palabras y patrones.
Estos ejemplos no son claves oficiales ni amplían la elegibilidad curricular.

Hay 18 ajustes de vocabulario y 15 de frases. Corrigen signos breves usados
como marcas tonales (`Făyǔ`, `hànbăo`, `yĭnliào`, `píngguŏ`, `chăo fàn`), la
`ɡ` tipográfica, separación de sílabas y `mén` en `你们学习中文。`, que debe ser
`men` neutro. Las variantes documentales permanecen intactas. Las glosas de
`老人`, `老朋友`, `贵姓` y `甜品` se hacen más precisas o legibles, en campos
editoriales, sin atribuirlas a una tabla impresa.

## Comprobaciones

- 52 frases nuevas o recuperadas con carácter, pinyin y español completos.
- 58 enlaces pedagógicos explícitos; todos apuntan a vocabulario existente y
  a una frase existente o declarada en este lote.
- IDs `PH-` calculados con la normalización estable del corpus; ningún ID
  histórico se cambia. El integrador debe hacer *upsert* cuando una frase
  recuperada ya exista en la ampliación L4.
- Todas las tarjetas y registros públicos con presencia L1 o L2 quedan con
  ejemplo tras combinar este lote con L3. Los cuatro casos compartidos
  `可乐`, `作业`, `爷爷` y `外公` se delegaron al lote L3 para evitar duplicados.
- Los registros que antes eran solo apoyo o estaban pendientes conservan ese
  rol. Añadirles un ejemplo no los promueve a palabras nuevas del libro.

La revisión lingüística fue realizada por el modelo. No se afirma una revisión
humana independiente, una validación de producción o una disponibilidad de
audio para las frases nuevas. Las cifras anteriores describen el lote, no el
total del sitio ni el total de imágenes.
