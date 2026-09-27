# Visual Míng — clasificación editorial del vocabulario

## Alcance autorizado

Se clasifica cada entrada de vocabulario que ya cumple los requisitos de publicación del corpus. Es una decisión editorial sobre qué apoyo visual sirve al significado registrado, no una propiedad atribuida al libro ni una nueva extracción documental.

Esta entrega **no genera imágenes, prompts de generación, audio ni cambios de interfaz**. Tampoco añade medidas, proporciones, estilos, rutas de recursos o aprobaciones artísticas. Las decisiones de diseño existentes permanecen separadas y no se modifican.

Lote inicial: `visual-ming-20260925-01`; base inspeccionada: `ad159330f24c7a7142daef6fc9ab22deed9c07f8`.

## Taxonomía

| Valor | Criterio semántico | Ejemplos |
|---|---|---|
| `literal_photo` | Referente concreto que admite representación literal. No garantiza respuesta única. | 猫、狗、米饭、咖啡、书 |
| `action_scene` | Acción representable mediante una situación observable. | 吃、喝、做饭、看书 |
| `concept_scene` | Relación humana, deíctica, social, espacial o conceptual que necesita contexto. | 我、你、爸爸、朋友、宠物 |
| `visual_grammar` | Relación estructurada, clasificación, cantidad o referencia temporal. | 只、张、口、个、一共、今年 |
| `phrase_context` | La función o el matiz se comprende dentro de un enunciado, no como imagen aislada. | 真、很、也、马马虎虎、汉语 |
| `none` | No conviene una imagen propia para recuperar el registro. La palabra sigue disponible para aprendizaje textual. | 吗、的、呢、了、马大为 |

Estas categorías no son cuotas. La distribución resulta de leer y clasificar los registros concretos; no se ajusta a porcentajes estimados de un piloto.

## Campos por entrada

Dentro del corpus reconstruido, cada palabra publicada tiene `visual_ming`:

- `visual_mode`: uno de los seis valores anteriores.
- `image_support`: admite apoyo visual. Para `phrase_context` es apoyo de su frase, no una imagen propia de la palabra; para `visual_grammar` es apoyo estructurado.
- `image_quiz_eligible`: **candidatura editorial** para una futura práctica imagen → palabra. No significa que exista una imagen ni que haya sido probada o aprobada.
- `ambiguity_risk`: `low`, `medium` o `high`; riesgo de recuperar otro concepto o una variante léxica igualmente válida.
- `notes`: justificación semántica interna de la decisión, incluyendo polisemia y relaciones que no deben inferirse de la apariencia.

La web recibe solo los cuatro primeros campos bajo `visual_ming`. Las notas, método y estado de control no entran en la proyección pública. Ningún componente de UI se cambia ni comienza a usar estas etiquetas en esta entrega.

## Decisiones editoriales relevantes

- **我 / 你:** escena conceptual y candidatura condicional al quiz; hay que distinguir hablante y destinatario. **他 / 她** conservan apoyo conceptual pero no se proponen como quiz de imagen aislada.
- **和, 只, 张, 口, 个:** apoyo estructurado, no pregunta aislada de imagen. **口** se clasifica por su uso de contar integrantes de familia, no por una boca; **只** por `zhī`, no por el adverbio `zhǐ`.
- **真 / 很 / 太 / 都 / 也:** contexto de frase. **吗 / 的 / 呢 / 了 / 不:** sin imagen propia, manteniendo su práctica lingüística.
- **猫 / 宠物:** un gato es un referente concreto; mascota es una relación o categoría que no se recupera inequívocamente de un gato solo.
- **约翰 / 贝贝:** apoyo del relato de sus mascotas, no retratos de personas elegidas por asociación con el nombre. Otros nombres propios quedan sin una imagen propia que finja identificarlos.
- **Países, nacionalidades e idiomas:** no se deducen de rasgos físicos. La geografía puede tener apoyo conceptual; una lengua requiere contexto lingüístico y no se reduce a una bandera.
- **Familia y profesiones:** una foto aislada no establece parentesco, cargo o especialidad. La ambigüedad queda registrada.
- **Variantes equivalentes:** 面条 / 面条儿, 汉堡 / 汉堡包 y 披萨 / 比萨饼 comparten referentes. Antes de usar un recurso en un quiz hay que admitir alternativas válidas o recurrir a contexto; no penalizar la variante correcta por una imagen que no las distingue.
- **Sentidos del curso:** 上 se trata en el uso de asistir a clase, 系 como departamento universitario, 死 como intensificador en su contexto y 马马虎虎 como expresión idiomática. No se generan significados literales engañosos por concatenar dibujos de caracteres.

## Fuente de verdad e integración

`visual-ming.json` registra alcance, método y limitaciones. `visual/vocabulary.tsv` contiene todas las decisiones explícitas ligadas al ID `v-…` y al texto chino exacto. No hay clasificación automática por número de caracteres, procedencia PPT, substring o una categoría de respaldo para palabras sin revisar.

`query.py` incorpora `visual_ming.py` después de pinyin, traducciones y ejemplos. Se conservan sin cambios los campos documentales y los testigos originales. El contenido clasificado se consulta en `vocabulary`, `matrix` y la tabla `visual_ming`; los conteos en `visual_ming_summary`.

La caché incluye los bytes del archivo de clasificación. Cuando se incorpore nuevo vocabulario público, la validación fallará con sus IDs faltantes hasta que se clasifique expresamente. Los fragmentos que ya estaban excluidos no se publican por recibir metadatos visuales; las palabras con `none` tampoco se eliminan del catálogo.

`export-corpus-v21.py` añade únicamente los cuatro campos públicos de clasificación a cada palabra. No modifica Hanzi, pinyin, español, lecciones, ejemplos, diálogos ni radicales. No editar manualmente la salida.

## Consultar y comprobar

Desde la raíz, con Python 3.10+ (`python` o `python3`):

```bash
python MING_KNOWLEDGE/v2/query.py --word 猫 --full
python MING_KNOWLEDGE/v2/query.py --word 和 --full
python MING_KNOWLEDGE/v2/query.py --table visual_ming --limit 20
python MING_KNOWLEDGE/v2/query.py --table visual_ming_summary
python MING_KNOWLEDGE/v2/query.py --validate
python scripts/export-corpus-v21.py
python MING_KNOWLEDGE/v2/visual_ming.py --check --write-reports
python scripts/export-corpus-v21.py --check
python MING_KNOWLEDGE/v2/visual_ming.py --check --check-reports
python -m unittest discover -s MING_KNOWLEDGE/v2 -p 'test_*.py'
```

Los informes `audits/visual-ming-20260925.json` y `.md` enumeran todas las entradas y sus motivos; los conteos se calculan, no se usan como constantes de la UI.

## Límites

Esta clasificación fue preparada y comprobada por el modelo. No equivale a validación con alumnos, revisión humana independiente ni certeza de que una imagen específica funcionará. Una futura imagen necesita control de significado y de respuestas aceptables antes de habilitarse en el juego. No se autoriza gasto ni generación por el hecho de tener `image_quiz_eligible: true`.

El término interno describe su función editorial; el repositorio es público. No guardar secretos en estos campos. La aprobación de una PR de clasificación no acredita implementación ni despliegue de imágenes.
