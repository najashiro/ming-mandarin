# Producción visual Míng · Catálogo de prompts

## Entrada principal

- **[IMAGE_PROMPTS.md](IMAGE_PROMPTS.md)**: archivo para leer, buscar un Hanzi y copiar su prompt completo.
- **[IMAGE_PROMPTS.json](IMAGE_PROMPTS.json)**: el mismo catálogo, estructurado por `vocab_id`, con todas las tarjetas, recetas compartibles, restricciones y decisiones sin imagen.
- [summary.json](summary.json): conteos reproducibles.

Esta entrega prepara instrucciones. **No genera ni aprueba imágenes, no llama a servicios de pago y no cambia la web.** Los textos chinos, el pinyin, las traducciones, los ejemplos y la clasificación editorial existente permanecen intactos.

## Estilo solicitado el 27 de septiembre

El recurso es el sujeto recortado, no la tarjeta: transparencia auténtica de canal alfa, realismo fotográfico cálido, materiales naturales, animales tiernos sin caricaturizar, comida apetitosa, bebidas creíbles y personas ficticias en acciones cotidianas comprensibles. La tarjeta aporta el fondo. No generar marfil, blanco, gradientes, cuadrícula, estrellas, botones, letras ni bordes de UI dentro de la imagen.

Esta instrucción para recursos futuros sustituye la ambientación de fondo del antiguo prompt fotográfico cuando se utilice ESTE catálogo. No reescribe los archivos de diseño de tarjetas ni impone dimensiones, proporciones o distribución a la interfaz.

Los países se representan mediante **un lugar reconocible y su bandera nacional**, no mediante caras, trajes o estereotipos. El lugar y bandera son decisiones editoriales, no información extraída de los PDF. Antes de ejecutar la generación se necesitan referencias auténticas y se debe validar bandera y arquitectura. Para escudos, trigramas o detalles que el modelo altere, incorporar después un recurso auténtico con composición controlada. No aceptar una bandera aproximada como correcta.

Las profesiones combinan **ropa adecuada + herramienta + acción**. Un médico atiende; una periodista entrevista; una ingeniera revisa un plano y una maqueta. Trajes y uniformes no demuestran profesión, especialidad o jerarquía. Estas escenas no modifican `image_quiz_eligible`.

## No forzar una imagen a todas las palabras

Cada entrada pública queda representada en el catálogo. Las de clasificación `none` tienen `prompt_es: null` y su motivo editorial, en lugar de un retrato inventado o una metáfora engañosa. Permanecen en Vocabulario.

- `phrase_context`: la escena acompaña una frase COMPATIBLE del corpus; no identifica por sí sola la palabra abstracta. Idiomas no se representan con banderas. Las ilustraciones de nombres de mascotas no son retratos documentales.
- `visual_grammar`: se preparan ELEMENTOS. Conteos exactos, relaciones temporales, marcas, flechas y texto requieren composición posterior determinista. La IA no decide cuántos objetos cuenta el alumno.
- `image_quiz_eligible`: se conserva la candidatura editorial. Todos los recursos siguen con `image_quiz_enabled: false` hasta disponer de imágenes realmente revisadas. No confundir un prompt con una imagen aprobada.

La base de la escena es editorial. No hay nuevas oraciones chinas ni ilustraciones falsamente atribuidas al libro. `documented_example_ids` son vínculos existentes para elegir después un ejemplo compatible, no una afirmación de que toda frase vinculada describa la escena.

## Reutilización sin confundir palabras

Las recetas con **perfil y escena exactamente iguales** comparten una `production_unit_id`; el prompt combina sus restricciones. Eso permite reutilizar una imagen aprobada entre 面条/面条儿, 汉堡/汉堡包 o variantes de parentesco, sin fusionar IDs, afirmar sinonimia universal ni cambiar el progreso.

También se puede compartir un elemento de conteo o calendario. Las instrucciones de composición de cada palabra permanecen distintas: ayer no utiliza la misma marca temporal que mañana, aunque ambos reutilicen una página de calendario vacía.

Los conteos de recetas son un inventario, no un presupuesto de generación. Una unidad puede necesitar varias referencias, composición o reintentos; los recursos existentes se revisan antes de generar sustitutos. Este catálogo no autoriza gasto.

## Archivos fuente y reproducibilidad

- `prompt-policy.json`: restricciones comunes, perfiles y límites.
- `recipes-scenes.tsv`: decisiones específicas para referentes, acciones, personas, países y profesiones.
- `recipes-context.tsv`: escenas de apoyo para palabras contextuales.
- `recipes-structured.tsv`: elementos de apoyo y composición posterior de gramática/cantidades.
- `image_prompts.py`: compila exclusivamente los tres archivos de salida, sin editar corpus ni imágenes.
- `test_image_prompts.py`: cobertura, conservación, casos problemáticos y reproducibilidad.

Se consulta la clasificación autorizada en `../v2/visual/vocabulary.tsv` y el corpus público actual. No se duplica su fuente de verdad en componentes React. Una entrada publicable sin receta y sin decisión `none` hace fallar la validación con su ID.

```bash
python MING_KNOWLEDGE/visual-production/image_prompts.py --word 猫
python MING_KNOWLEDGE/visual-production/image_prompts.py --word 中国
python MING_KNOWLEDGE/visual-production/image_prompts.py --word 和
python MING_KNOWLEDGE/visual-production/image_prompts.py --word 吗
python MING_KNOWLEDGE/visual-production/image_prompts.py --write
python MING_KNOWLEDGE/visual-production/image_prompts.py --check
python -m unittest discover -s MING_KNOWLEDGE/visual-production -p 'test_*.py'
```

`--write` genera JSON y Markdown, **no imágenes**. La versión preparada del catálogo está comprometida para consultarla sin ejecutar el compilador. La comprobación falla si cambian las fuentes y el catálogo queda obsoleto.

## Revisión obligatoria de los recursos futuros

Comprobar canal alfa, exterior transparente, primer plano visible, bordes sobre superficies claras/oscuras, anatomía, utensilios y alimento correctos, números exactos tras composición, fidelidad de monumento/bandera, ausencia de texto y claridad semántica. No basta que el generador devuelva un archivo PNG.

Preparación y comprobación editorial por el modelo; no se afirma validación artística con alumnos ni revisión lingüística humana independiente. El repositorio es público: interno describe su función, no privacidad. Ninguna nota de estos archivos debe mostrarse como texto de las tarjetas.
