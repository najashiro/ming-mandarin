# Vocabulario: partición exclusiva, búsqueda global y reversos globales

Rama: `feat/vocabulary-active-mix`. Cambios locales sobre la integración del corpus auditado; sin commit nuevo, push ni despliegue. Puerto 3100: http://localhost:3100/study/l1/vocabulary.

## Conjuntos y contadores

| Selector | Palabras |
|---|---:|
| Lección 1 | 64 |
| Lección 2 | 88 |
| Lección 3 | 61 |
| Acumulado | 213 |

L1 ∩ L2 = 0, L1 ∩ L3 = 0, L2 ∩ L3 = 0. **64 + 88 + 61 = 213** IDs únicos. Las pruebas contrastan la unión con toda la elegibilidad documental previa; no se añadieron ni eliminaron palabras del conjunto total.

Los conjuntos se construyen una sola vez, en `lib/vocabulary.ts`, a partir de `selectVocabulary` y sus `curriculumLinks`. `getVocabularySet` devuelve los conjuntos exclusivos ya calculados. `getVocabularyLesson(item)` consulta el mapa creado a la vez que esos mismos conjuntos; nunca usa el mínimo del array agregado de lecciones. Los conteos de pantalla derivan de las listas, no de estas cifras escritas en el informe.

| Palabra | Lección canónica |
|---|---|
| 你 | L1 |
| 马马虎虎 | L1 |
| 中国 | L2 |
| 宠物 | L3 |
| 真 | L2 |

La pertenencia documental China L3/nueva se conserva: la exclusividad solo organiza esta sección. El selector tiene exactamente L1, L2, L3 y Acumulado; Acumulado usa la ruta existente `/study/l1-l2-l3/vocabulary`. El antiguo acceso combinado L1+L2 abre esta vista Acumulado.

## Búsqueda y navegación

- `searchGlobalVocabulary(query)`, en `lib/vocabulary.ts`, siempre consulta `accumulatedVocabulary` con la normalización existente: Hanzi, pinyin con/sin tonos, números, separación y español.
- Las sugerencias muestran palabra, pinyin, significado y L1/L2/L3 canónica. No dependen de la lección visible ni del filtro de favoritos.
- `navigateToVocabularyWord(id)`, en `components/vocabulary/ActiveVocabulary.tsx`, calcula lección y página, limpia query y filtros de vista, sale de Mix si hace falta, cierra el desplegable y actualiza la ruta dentro de la aplicación. No abre otra pestaña ni hace una recarga de documento.
- Un efecto espera a que la tarjeta exista y el estado esté cargado: scroll suave (instantáneo con movimiento reducido), foco accesible y contorno temporal de 1,8 segundos. La URL conserva lección, página y tarjeta; la recarga conserva la lección.
- Tras seleccionar se muestra la lista completa de esa lección, con su paginación de 24 entradas, no una única palabra filtrada. Se limpia el filtro visual de favoritos para poder llegar a cualquier resultado; los favoritos guardados no se borran.
- Mientras se escribe, las sugerencias son globales y la cuadrícula mantiene el filtro local preexistente; elegir una sugerencia realiza la navegación curricular.

## Mix, favoritos e historial

Mix aplica primero la partición exclusiva y después Básico/Hard dentro de ese conjunto. `getVocabularySet(scope, level)` centraliza ambas decisiones. Favoritos sigue filtrando el conjunto actual; en Acumulado filtra todos los favoritos sin duplicarlos.

`reconcileMixSession` conserva historial ya respondido y progreso. En sesiones antiguas retira solo las tarjetas pendientes que ahora pertenecen a otra lección y oculta una respuesta revelada si cambió la tarjeta actual. Nunca puntúa una tarjeta retirada como fallo. Las sesiones conformes mantienen exactamente su estado. No se modifica la clave de almacenamiento ni los IDs.

## Ejemplos globales

`examplesForWord(word)` es la única selección usada por los reversos de Explorar y Mix. Recorre el índice generado desde `phrases.vocabIds` y sus vínculos curriculares positivos de todas las lecciones; no usa substring ni filtra por lección canónica/seleccionada. `examplesForScope` queda solo para informes documentales y pruebas de fuentes.

Se excluyen consignas abiertas, premisas, distractores, transformaciones, ejercicios sin respuesta, contraejemplos y plantillas con huecos/ellipsis. Solo se admiten tipos documentales positivos y se deduplica mediante los IDs únicos de la proyección.

El orden prioriza pinyin documentado, frases breves (hasta 30 caracteres), traducción disponible y menor longitud, con desempate estable por ID. No hay preferencia por la lección visible. Los campos null se omiten; no se copian apoyos de una frase distinta ni se inventan. Los audios existentes y enlaces Hanzi válidos mantienen su funcionamiento. Una palabra sin ejemplos elegibles conserva su ficha de palabra y no ofrece un giro vacío.

### 真: todas las frases, en orden del reverso

Lección canónica: **L2**. Principal: **真厉害！**. El primer clic en «Otro ejemplo» muestra **中国的孩子真忙！** de L3; los clics siguientes recorren toda esta lista sin mover la tarjeta de L2.

| Orden | Frase | Lección documental | Pinyin documentado |
|---|---|---|---|
| 1 | 真厉害！ | L2 | Sí |
| 2 | 中国的孩子真忙！ | L3 | Sí |
| 3 | 您好！你们家真漂亮！ | L3 | Sí |
| 4 | 这张照片真漂亮！这是你女儿吗？ | L3 | Sí |
| 5 | 这张照片是谁？是你哥哥吗？真帅！ | L3 | Sí |
| 6 | 真好 | L3 | No consta para este registro |
| 7 | 真漂亮！ | L3 | No consta para este registro |
| 8 | 真好吃！ | L3 | No consta para este registro |
| 9 | 你女儿真漂亮！ | L3 | No consta para este registro |
| 10 | 这张照片真漂亮！ | L3 | No consta para este registro |

La frase independiente **这张照片真漂亮！** existe, pero su registro tiene pinyin null. Se ofrece como ejemplo secundario sin mensaje editorial. La versión completa **这张照片真漂亮！这是你女儿吗？** sí tiene pinyin documentado y aparece antes. No se altera el corpus ni se copia parcialmente su pinyin a otro registro. No hay traducción documental en estas diez entradas, por lo que no se presenta ninguna traducción inventada.

### Comprobación de otras tres palabras

| Palabra | Canónica | Ejemplos globales | Lecciones documentales | Principal | Siguiente |
|---|---|---:|---|---|---|
| 你 | L1 | 96 | L1, L2, L3 | 你忙吗？ | 你要什么？ |
| 我 | L1 | 172 | L1, L2, L3 | 我很好。 | 我也很好。 |
| 好 | L1 | 37 | L1, L2, L3 | 我很好。 | 我也很好。 |

Las listas completas, IDs, pinyin, traducciones y lecciones de las cuatro palabras están en [vocabulary-partition-examples.json](vocabulary-partition-examples.json).

Caso 宠物: sigue elegible y asignada a L3. Su única frase enlazada es una consigna abierta de entrevista; se excluye del reverso según la nueva regla. El contexto de práctica revisado de Mix sigue siendo una actividad distinta, no una supuesta respuesta documental a esa pregunta.

## Validación

- `query.py --validate`, `audit_source_tables.py --check`, `export-corpus-v21.py --check`: OK.
- `pnpm lint`, `pnpm typecheck`, `pnpm test`: OK; **215 pruebas unitarias** en 18 archivos. Se usa `--config.verifyDepsBeforeRun=false` con las dependencias bloqueadas instaladas.
- Compilación local: OK.
- Navegadores: las primeras **42 pruebas** de Chromium/WebKit pasan, incluidas navegación L1→L2, L1→L3, L3→L1, L2→L1 y Acumulado→L1, teclado/IME, foco, resaltado, URL/recarga, ejemplos globales y permanencia de favoritos/progreso/posición.
- Prueba adicional de migración de una cola antigua de Mix: OK en Chromium y WebKit; repetición del flujo de evaluación: OK. Total: 44 casos únicos de navegador verificados (42 iniciales y 2 adicionales; 2 casos repetidos tras el ajuste final).
- `git diff --check`: OK. `MING_KNOWLEDGE` y `data/corpus-v21-public.json` no se modificaron en esta tarea.

## Archivos principales

`lib/vocabulary.ts`, `lib/vocabulary-review.ts`, `components/vocabulary/ActiveVocabulary.tsx`, `VocabularyCard.tsx`, `VocabularyMix.tsx`, `vocabulary.css`, `app/study/[scope]/vocabulary/page.tsx`, las pruebas de vocabulario y el informe de cobertura. El informe `vocabulary-coverage.json` distingue los conteos documentales (`counts`) de los exclusivos de pantalla (`exclusiveCatalog`) y exporta `canonicalLessons`.
