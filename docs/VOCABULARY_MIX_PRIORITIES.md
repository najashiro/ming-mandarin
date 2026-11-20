# Prioridades de Vocabulario Mix

Esta capa determina la composición de Easy, Medium y Hard con los mismos datos
para todos los alumnos. Es una política editorial reproducible basada en el
material registrado del curso. No es frecuencia general del mandarín ni una
medición de dificultad cognitiva. No consulta aciertos, errores, favoritos,
historial, vencimientos ni cuentas de usuario.

## Archivos y actualización

- `scripts/build-vocabulary-mix-priorities.py`: generador sin red ni APIs pagadas.
- `data/vocabulary-mix-priorities.json`: grupos y puntuaciones por palabra y
  alcance. Es el único resultado que se incorpora al cliente.
- `docs/vocabulary-mix-priorities.tsv`: tabla de auditoría por palabra/lección,
  con contextos, ocurrencias, rol curricular, puntuación, confianza, método y
  referencias de evidencia. Puede abrirse en una hoja de cálculo.
- `docs/vocabulary-mix-priorities-report.json`: cobertura y tamaños de grupos.
- `lib/vocabulary-priorities.ts`: consulta de la política generada.

Regenerar con `python3 scripts/build-vocabulary-mix-priorities.py`; comprobar
vigencia con el mismo comando y `--check`. El generador solo escribe sus tres
resultados; utiliza la caché documental normal de `query.py` sin modificar las
fuentes ni las exportaciones curriculares. El fingerprint identifica los
vínculos, contextos y conjuntos de palabras que sustentan la clasificación.

El repaso general tiene 520 palabras. La unión de todos los alcances tiene 522:
`v-陈明` y `v-功夫熊猫` pertenecen a catálogos de lección pero no al acumulado según
el adaptador existente. Esta capa conserva esa elegibilidad y los IDs; no agrega
ni retira vocabulario. Las pruebas comparan cada alcance con `getVocabularyMixSet`.

## Qué se cuenta

L1–L4 utilizan `phrase_evidence`, `word_phrase_spans` y `grammar_phrase_links`
de la consulta canónica v2.2 ampliada. Se admiten libros y cuadernos; se excluyen
PPT, hojas Hanzi, exámenes, contraejemplos y registros con revisión pendiente.
Los spans deben ser tokens léxicos y corresponder literalmente al texto
registrado. Los vínculos pedagógicos heredados, los componentes de caracteres,
`examplePhraseIds` y los ejemplos editoriales añadidos no son ocurrencias.

Las categorías documentales son diálogo, gramática, lectura y práctica/otros
enunciados registrados. Esta última incluye las frases clave, tablas y
colocaciones: no afirma que cada fila proceda de un ejercicio calificado.
Una misma frase puede estar documentada en diálogo y gramática, y contribuir a
ambas señales. El total de contextos únicos elimina ese solapamiento.

Dentro de cada lección y categoría se deduplica el texto normalizando puntuación
y espacios. Así una copia de un diálogo no multiplica su peso. `*_contexts`
cuenta enunciados únicos que contienen el token; `*_occurrences` cuenta sus
tokens dentro de esos enunciados, usando el máximo entre testigos duplicados.
Por tanto **no son totales de todas las apariciones impresas**. Se conservan las
referencias de los testigos para reconstruir cada resultado.

L5–L6 registran diálogos y lecturas, pero no una anotación léxica completa. Para
ellos se crea una segmentación derivada y separada usando el lexicón registrado,
con coincidencia más larga y tokens no solapados. Esto evita contar `猫` dentro
de `小猫`, o un carácter dentro de todos sus compuestos. Las frases clave con
tokens explícitos conservan sus fronteras. Las lagunas léxicas se omiten y su
cantidad queda en el informe: no se inventan palabras para llenarlas. Estos
conteos tienen confianza `derived_lexical_counts`, inferior a los spans
registrados de L1–L4, y pueden requerir revisión de segmentación.

Los ejemplos de gramática L5–L6 proceden de explicaciones editoriales. Su señal
se guarda en `editorial_grammar_contexts`, con peso reducido; **nunca** se suma a
las ocurrencias documentales de gramática. Las actividades con instrucciones
editoriales se excluyen del conteo. La cobertura es parcial, no una
transcripción exhaustiva de los libros. `curricular_only` significa que no hay
contextos documentales computables: no demuestra que la palabra sea rara.

## Puntuación y clasificación inicial

Se calcula una puntuación local por palabra/lección:

```text
prioridad = rol curricular
          + 6 × log(1 + contextos de diálogo)
          + 4 × log(1 + contextos de gramática documental)
          + 2 × log(1 + contextos de lectura)
          + 1 × log(1 + contextos de práctica)
          + 1 × log(1 + ejemplos editoriales de gramática)
          + 1,5 × número de categorías documentales con evidencia
```

El rol vale 12 para vocabulario principal, 10 para repaso esencial, 4 para
complementario y 1 para contextual. Es un prior explícito: una palabra principal
sin conteos disponibles conserva su relevancia curricular. El logaritmo limita
el dominio de las palabras omnipresentes. Los coeficientes son decisiones
iniciales ajustables, no resultados de un experimento con alumnos.

Se normaliza cada puntuación a 0–100 respecto al máximo de su lección. Para un
alcance acumulado se usa la mejor relevancia local, más hasta 5 puntos por
presencia en otras lecciones seleccionadas. Así una lección con más registros
no pesa automáticamente más que otra. Solo se consideran las lecciones del
alcance elegido.

Dentro de cada alcance, el 35 % superior pertenece a **núcleo** (`core`), el
siguiente 35 % a **consolidación** y el 30 % restante a **ampliación**
(`extension`), redondeando los dos límites hacia arriba. Los empates usan el ID
estable para obtener resultados reproducibles. Estas bandas expresan prioridad
relativa en ese alcance: ampliación no equivale a una dificultad demostrada ni
a rareza confirmada cuando faltan datos.

La clasificación no cambia al alternar la ayuda visual. El motor selecciona
sin reposición dentro de cada grupo y aplica estos cupos de partida:

| Nivel | Núcleo | Consolidación | Ampliación |
|---|---:|---:|---:|
| Easy | 70 % | 20 % | 10 % |
| Medium | 30 % | 50 % | 20 % |
| Hard | 10 % | 30 % | 60 % |

Cuando un grupo no alcanza para llenar su cupo, el motor completa con grupos
disponibles del mismo alcance sin duplicar palabras. La puntuación queda
disponible para auditoría; en esta versión no pondera el azar dentro del grupo.
Las nuevas palabras aún no clasificadas se consideran consolidación con
puntuación cero, y la prueba de cobertura impide publicar una tabla incompleta.

## Límites de interpretación

El nivel de contenido es independiente de la presentación con/sin imagen. Las
opciones iniciales son Medium y Sin imagen. El alumno no ve referencias
documentales, etiquetas de confianza ni detalles del algoritmo en sus tarjetas.
No se modifican las fuentes, los IDs de vocabulario ni el progreso existente.

### Apoyo visual en Mix

«Con imagen» muestra el recurso aprobado y publicado de la palabra junto al
carácter. No aplica `imageQuizEligible`: ese indicador también excluye imágenes
ambiguas que siguen siendo útiles como apoyo, y se conserva para los quizzes
visuales. El selector no cambia el banco ni los cupos de la ronda.

Antes de revelar la respuesta, una capa de presentación cubre las etiquetas
latinas (pinyin y español) de los diagramas. Las coordenadas se derivan de sus
fuentes SVG; los diagramas de conteo, tres diagramas L4 sin SVG guardado y la
ilustración anotada de 进 tienen regiones explícitas.
`scripts/build-vocabulary-mix-image-masks.mjs --check`
comprueba la tabla. Cada máscara se vincula al archivo y SHA publicados, sin
editar los recursos originales. Al revelar se muestra la tarjeta completa.
Una imagen retirada o que falla al cargar mantiene la palabra jugable y muestra
«Imagen no disponible para esta palabra».

El reparto 35/35/30 de la tabla y los cupos de partida son parámetros distintos:
el primero organiza el banco disponible; el segundo determina qué proporción
practica el alumno. Se podrán recalibrar con una revisión editorial de la tabla
sin atribuirles supuesta dificultad personal.
