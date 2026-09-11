# Auditoría del corpus · Reto Mixto L1–L3

Auditoría cerrada el 11 de septiembre de 2026. El corpus se reconstruyó desde los PDF locales, el currículo tipado y los manifiestos estáticos de audio/Hanzi. No se utilizó el total histórico de 113 como fuente de verdad.

## Fuentes revisadas

| Grupo | Archivos | Páginas | Resultado |
| --- | ---: | ---: | --- |
| Presentaciones de fonética | `0.1 拼音第一节`, `0.2 语音 谢谢` | 114 | Vocabulario inicial conservado; sílabas de práctica y avisos de plantilla excluidos como material no léxico. |
| Presentación L1 | `1.1 你最近怎么样` | 75 | Vocabulario, dos textos, frases de interacción y ampliaciones de estados. |
| Presentaciones L2 | `2.1 你是哪国人`, `2.2 你是哪国人啊` | 97 | Vocabulario central, países, idiomas, alimentos, bebidas y términos exclusivos de clase. |
| Presentación L3 | `3.1 你家有几口人` | 46 | Familia, profesiones, clasificadores y ampliación explícita de animales. |
| Hojas Hanzi | `Hanzi Leccion 1.1` a `Hanzi Leccion 3.1` | 22 | Caracteres canónicos y siete objetivos históricos conservados con procedencia. |
| Libros básicos | Lecciones 1–2 y Lección 3 | 113 | Listas de palabras, textos completos, pinyin y contexto pedagógico. |
| Cuadernos de ejercicios | Lecciones 1–2 y Lección 3 | 27 | Evidencia de práctica y frases; no apareció una lista léxica exclusiva que justificara inflar el corpus. |
| **Total** | **18 PDF** | **494** | Extracción textual en presentaciones y revisión visual de las páginas escaneadas. |

## Corpus canónico deduplicado

Se combinaron 419 candidatos brutos: 152 entradas de vocabulario estructurado, 21 términos de presentación auditados, 199 Hanzi (192 curriculares y 7 históricos), 46 frases curriculares y una evidencia conversacional adicional. La fusión por escritura china consolidó 69 repeticiones entre fuentes.

| Categoría canónica | Entradas únicas |
| --- | ---: |
| `core` | 131 |
| `supplementary` | 10 |
| `ppt` | 25 |
| `hanzi` | 133 |
| `workbook` | 0 exclusivas; su procedencia queda fusionada en 46 frases |
| `phrase` | 46 |
| `example_only` | 5 |
| **Total único** | **350** |

Los cinco `example_only` se conservan para trazabilidad, pero no entran al juego. El corpus jugable contiene 345 entradas.

### Cobertura por lección

Una misma entrada puede pertenecer a más de una lección cuando reaparece; por eso estas filas no se suman para obtener el total único.

| Lección | Entradas relacionadas |
| --- | ---: |
| L1 | 110 |
| L2 | 143 |
| L3 | 105 |

### Cobertura por tipo de fuente

| Tipo de fuente | Entradas con esa procedencia |
| --- | ---: |
| Libro básico | 231 |
| Presentación de clase | 193 |
| Presentación de fonética | 5 |
| Hoja Hanzi | 22 |
| Cuaderno de ejercicios | 46 |

## Términos recuperados de fuentes de clase

Además del corpus que ya estaba estructurado, la auditoría incorporó `作业`, `厕所`, `可以`, `去`, `早饭`, `女朋友`, `甜品`, `学生`, `老人`, `男朋友`, `语言`, `家人`, `小狗`, `小猫` y `可爱` como entradas jugables de presentación. `大学老师`, `现在`, `工人`, `工作日` y `卡片` se conservaron como ejemplos contextuales no jugables porque la fuente los utiliza para ilustrar una estructura o familia léxica, no como lista evaluable.

Las ampliaciones obligatorias ya presentes se mantuvieron: `困`, `渴`, `饿`, `累`, `还行`, `马马虎虎`, `加拿大`, `墨西哥`, `澳大利亚`, `姥姥` y `姥爷`, junto con el resto de las extensiones tipadas del currículo.

## Duplicados y exclusiones

- Se fusionaron por escritura china, acumulando lecciones y referencias de libro, PPT, hoja Hanzi y cuaderno.
- Se mantuvo una sola lectura pedagógica por entrada, tomada del pinyin auditado del curso.
- Las frases conservan puntuación y bloques pedagógicos; no sustituyen a las listas de vocabulario.
- Se excluyeron del juego sílabas aisladas de fonética, instrucciones, avisos legales de plantillas, encabezados y artefactos de OCR.
- No se añadieron `午饭`, `晚饭`, `汉堡包`, `比萨饼`, `橙汁`, `豆浆`, `工程师`, `律师`, `记者` ni `服务员`: la revisión de los 18 PDF no permitió validarlos como vocabulario explícitamente enseñado en este corpus L1–L3.
- Los cinco ejemplos contextuales permanecen visibles para la auditoría interna, con `playableModes: []`.

## Medios y cobertura funcional

| Recurso | Total | Faltantes |
| --- | ---: | ---: |
| Audio estático asociado al corpus | 350 | 0 |
| Imágenes IA 1:1 WebP | 36 | 0 |
| Entradas visualizables | 36 | 0 |
| Destinos Hanzi locales | Todos los objetivos declarados | 0 objetivos inválidos |
| Conversaciones auditadas | 10 | 0 respuestas sin entrada canónica |

El banco visual cubre 36 entradas concretas en alimentos, bebidas, familia, relaciones, animales, estados, objetos y lugares. Cada archivo representa una sola respuesta canónica para evitar ambigüedad entre sinónimos o derivados cercanos. Las imágenes se generaron con la herramienta integrada de imágenes: fotografía realista, fondo cálido limpio, composición 1:1, un concepto inequívoco, sin texto, logos ni marcas de agua.

## Regla de mantenimiento

`data/reto-mixto.ts` es la fuente canónica del juego. Una ampliación debe añadir procedencia, lectura, significado, audio estático y destinos Hanzi antes de entrar en un modo jugable. `npm run audit:reto-mixto` bloquea IDs duplicados, escrituras duplicadas, campos vacíos, medios ausentes, opciones incompletas y regresiones a síntesis de voz.
