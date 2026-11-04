# Relectura de la lección 3 - 4 de noviembre de 2026

Se revisaron visualmente las 24 páginas del libro (88-111 impresas) y las 9 del cuaderno (19-27 impresas). Se leyó el texto nativo de las presentaciones 3.1 y 3.2 completas y se cotejaron visualmente las páginas utilizadas para las correcciones y ampliaciones. También se revisaron visualmente las 7 páginas de las dos hojas Hanzi. Las rutas, hashes, páginas y método están registrados en `lesson3-review.json`. Los escaneos se mantienen únicamente en la carpeta temporal ignorada.

## Qué faltaba

Las 44 filas de vocabulario nuevo y las 18 suplementarias del libro ya están representadas por IDs existentes. Había 27 entradas asociadas a la lección 3 sin un ejemplo enlazado. Ninguna frase de la exportación pública de L3 tenía pinyin o español nulo; el problema de las tarjetas era principalmente la ausencia de relaciones con ejemplos y algunas lecturas defectuosas heredadas de las presentaciones.

La capa incorpora 27 frases nuevas: 13 transcripciones documentales y 14 ejemplos de elaboración editorial. Añade 31 enlaces explícitos con vocabulario, incluidos dos a frases que ya existían. Tras aplicar esos enlaces no queda ninguna de las 27 entradas sin ejemplo. No se cambian IDs anteriores.

## Prioridad del libro

Se recuperaron colocaciones de las tablas: 没有朋友, 一天, 两天, 很晚, 不晚, 王先生, 陆雨平先生, 喜欢橙汁, 不喝可乐, 喜欢喝豆浆 y 女儿很漂亮. La lectura nǎinai de 奶奶 se toma de la página 24 del libro, por encima de năinai en el texto de la PPT. También se recupera el testigo primario de 爷爷, 外公 y 外婆, que antes dependían del registro de la presentación.

Las lecturas aisladas de las hojas Hanzi (漂 piāo, 子 zǐ) no sustituyen las contextuales del libro (漂亮 piàoliang, 孩子 háizi).

La definición de 啊 se completa con la glosa del libro: puede aparecer detrás de un verbo, adjetivo u oración. Se mantienen los significados y categorías de currículo; las menciones culturales no pasan a ser automáticamente palabras nuevas.

Del cuaderno se recupera la pregunta 这个车牌号是多少？ sin copiar el número de la matrícula. El nombre 玛丽 obtiene el pinyin impreso Mǎlì y se enlaza a la oración completa de traducción ya registrada. Se enlaza 电影 a su uso explícito en 看电影 y 女 a la subentrada 女儿, sin deducir relaciones nuevas por búsqueda de caracteres.

## Correcciones editoriales

后年 aparece como hòuniá en la propia PPT: la lectura corregida hòunián queda en `pinyin_ming`, nunca en un campo de fuente. Se normalizan 小狗, 作业, 昨天 y 明天. Las frases 你会弹钢琴吗？ y 我去上英语课。 dejan de mostrar letras de pinyin mal codificadas. Se corrige la redacción española de 弹 y 弹钢琴 a «tocar un instrumento, como el piano» y «tocar el piano».

Los términos que solo estaban aislados reciben ejemplos sencillos de Míng: servicios y profesiones, abuelos, trabajo, años relativos, ayer, mediodía y buscar. Cada composición tiene `origin: ming_editorial_example`, `source_refs: []` y `basis_refs` del vocabulario/patrón que se practica. No se presenta como una cita del libro ni como una clave oficial.

## Validación y límites

Se comprobaron IDs de vocabulario, IDs únicos de frases, pinyin y español completos, fuentes separadas por origen y cobertura de las 27 entradas sin ejemplo. La revisión es del modelo, sin afirmar una revisión lingüística humana independiente. No se completaron huecos, claves de escucha ni respuestas a imágenes; no se incorporaron respuestas manuscritas. La integración de la capa en el compilador y la proyección web corresponde al cambio global L1-L3.
