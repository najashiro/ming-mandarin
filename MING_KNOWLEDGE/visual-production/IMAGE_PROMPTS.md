# Míng · Prompts de imágenes con fondo transparente

> Catálogo editorial preparado. No se han generado imágenes ni se ha cambiado la web.

**337 tarjetas cubiertas:** 305 con prompt y 32 sin imagen propia.
**243 recetas visuales distintas.** Las repetidas pueden compartir recurso tras revisión; no son sinónimos ni cambios curriculares.
**17 países** tienen lugar representativo y bandera. Se deben aportar y validar referencias auténticas antes de generar.

## Cómo utilizar este archivo

Buscar el Hanzi o su ID. El bloque de cada entrada es el prompt completo. La clasificación y el sentido proceden del corpus; la escena es una propuesta editorial de Míng. No incluir este catálogo en el paquete del alumno.

El archivo solo contiene el sujeto o la escena recortada. Fondo y controles pertenecen a la tarjeta. No debe renderizarse un fondo blanco ni una cuadrícula para simular alfa. La herramienta futura debe soportar transparencia y se debe verificar el archivo resultante.

Para `visual_grammar`, generar elementos, no un diagrama final de conteo. Las instrucciones de composición son separadas y necesitan comprobaciones deterministas. Para `phrase_context`, la ilustración acompaña un ejemplo compatible: no representa la palabra por sí sola.

La candidatura de quiz se conserva de la clasificación; ningún recurso está habilitado ni validado todavía. Generar requiere otra orden y presupuesto. No se asignan tamaños ni se modifica el diseño existente.

## Conteos

| Clasificación | Entradas |
| --- | ---: |
| `literal_photo` | 47 |
| `action_scene` | 24 |
| `concept_scene` | 115 |
| `visual_grammar` | 47 |
| `phrase_context` | 72 |
| `none` | 32 |

## Revisión de cada recurso futuro

- El recurso tiene canal alfa y píxeles exteriores realmente transparentes; no es un JPG con fondo blanco.
- No hay cuadrícula pintada, gradiente, tarjeta, iconos o rótulos dentro del recurso.
- El primer plano es visible; no se acepta un archivo completamente transparente.
- Pelo, dedos, orejas, patas, contorno y posibles transparencias se revisan sobre fondos claro y oscuro.
- El referente coincide con el sentido documentado, no solo con caracteres compartidos.
- Ningún candidato se habilita en el juego sin revisar el recurso real y sus respuestas equivalentes.
- Todo monumento o bandera requiere referencia auténtica, incluso en escenas de procedencia personal.

## literal_photo

### 人 · rén — persona

ID: `v-人` · Riesgo: `medium` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-8fb72b68a7c8bf99` · Perfil: `object`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Objeto cotidiano completo, con materiales verosímiles y sin palabras impresas. El objeto debe ser el protagonista, no una persona utilizándolo ni su entorno.

ESCENA ESPECÍFICA: Una persona adulta ficticia de cuerpo completo en postura natural, ropa cotidiana neutra y expresión tranquila, sin herramientas profesionales ni otro protagonista.

CONTROL SEMÁNTICO: No atribuir nombre, nacionalidad, profesión ni personalidad por apariencia.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No atribuir nombre, nacionalidad, profesión ni personalidad por apariencia.

### 点心 · diǎnxin — bocadillos

ID: `v-点心` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-f3a34182452406c9` · Perfil: `food`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Fotografía gastronómica muy realista y apetitosa: textura comestible, cocción y humedad naturales, brillo moderado y porción plausible. Recipiente sencillo cuando sea necesario; sin mesa completa ni guarniciones que oculten la preparación. Vapor solo si el alimento se sirve caliente.

ESCENA ESPECÍFICA: Un surtido pequeño de bocadillos chinos en vajilla sencilla: un baozi, dos jiaozi y una pieza pequeña de pastel, todos visibles y sin que una sola preparación domine.

CONTROL SEMÁNTICO: Se enseña una categoría; no usar solo un jiaozi ni afirmar que toda variante de 点心 es un postre dulce.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Se enseña una categoría; no usar solo un jiaozi ni afirmar que toda variante de 点心 es un postre dulce.

### 米饭 · mǐfàn — arroz cocido

ID: `v-米饭` · Riesgo: `low` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-c468231e7a246672` · Perfil: `food`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Fotografía gastronómica muy realista y apetitosa: textura comestible, cocción y humedad naturales, brillo moderado y porción plausible. Recipiente sencillo cuando sea necesario; sin mesa completa ni guarniciones que oculten la preparación. Vapor solo si el alimento se sirve caliente.

ESCENA ESPECÍFICA: Un cuenco sencillo de cerámica clara lleno de arroz blanco cocido recién servido; granos individuales suaves y ligeramente brillantes, textura esponjosa y un rastro mínimo de vapor.

CONTROL SEMÁNTICO: La imagen solo cubre la acepción arroz cocido; para comida genérica se necesita la frase. No exigir esta forma frente a 米饭 mediante la imagen. No arroz crudo, frito ni ingredientes de colores; el cuenco no debe esconder los granos.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No arroz crudo, frito ni ingredientes de colores; el cuenco no debe esconder los granos.

### 饭 · fàn — arroz cocido; comida

ID: `v-饭` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-c468231e7a246672` · Perfil: `food`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Fotografía gastronómica muy realista y apetitosa: textura comestible, cocción y humedad naturales, brillo moderado y porción plausible. Recipiente sencillo cuando sea necesario; sin mesa completa ni guarniciones que oculten la preparación. Vapor solo si el alimento se sirve caliente.

ESCENA ESPECÍFICA: Un cuenco sencillo de cerámica clara lleno de arroz blanco cocido recién servido; granos individuales suaves y ligeramente brillantes, textura esponjosa y un rastro mínimo de vapor.

CONTROL SEMÁNTICO: La imagen solo cubre la acepción arroz cocido; para comida genérica se necesita la frase. No exigir esta forma frente a 米饭 mediante la imagen. No arroz crudo, frito ni ingredientes de colores; el cuenco no debe esconder los granos.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** La imagen solo cubre la acepción arroz cocido; para comida genérica se necesita la frase. No exigir esta forma frente a 米饭 mediante la imagen.

### 面条儿 · miàntiáor — tallarines

ID: `v-面条儿` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-21c553a55177fba4` · Perfil: `food`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Fotografía gastronómica muy realista y apetitosa: textura comestible, cocción y humedad naturales, brillo moderado y porción plausible. Recipiente sencillo cuando sea necesario; sin mesa completa ni guarniciones que oculten la preparación. Vapor solo si el alimento se sirve caliente.

ESCENA ESPECÍFICA: Un cuenco de fideos de trigo largos cocidos, ligeramente ondulados y apetitosos, con unos pocos fideos elevados por palillos; preparación sencilla que mantenga visible el alimento.

CONTROL SEMÁNTICO: El erhua no se representa visualmente; no fingir que esta comida difiere de 面条. No espagueti occidental como único referente ni ingredientes protagonistas. La misma imagen sirve a 面条儿.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** El erhua no se representa visualmente; no fingir que esta comida difiere de 面条.

### 饺子 · jiǎozi — jiaozi; ravioles

ID: `v-饺子` · Riesgo: `low` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-46db261bdad339a5` · Perfil: `food`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Fotografía gastronómica muy realista y apetitosa: textura comestible, cocción y humedad naturales, brillo moderado y porción plausible. Recipiente sencillo cuando sea necesario; sin mesa completa ni guarniciones que oculten la preparación. Vapor solo si el alimento se sirve caliente.

ESCENA ESPECÍFICA: Un plato sencillo con jiaozi cocidos: piezas de masa fina en media luna, pliegues definidos, brillo húmedo natural y una pieza discretamente abierta que muestre el relleno cocinado.

CONTROL SEMÁNTICO: No baozi redondos, gyoza frita como único referente ni salsa que oculte la forma.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No baozi redondos, gyoza frita como único referente ni salsa que oculte la forma.

### 包子 · bāozi — baozi; bollo relleno al vapor

ID: `v-包子` · Riesgo: `low` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-7ac75cab57c74a2b` · Perfil: `food`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Fotografía gastronómica muy realista y apetitosa: textura comestible, cocción y humedad naturales, brillo moderado y porción plausible. Recipiente sencillo cuando sea necesario; sin mesa completa ni guarniciones que oculten la preparación. Vapor solo si el alimento se sirve caliente.

ESCENA ESPECÍFICA: Tres baozi blancos suaves recién cocidos al vapor, con cierre plegado en la parte superior; uno abierto parcialmente muestra relleno cocinado jugoso. Plato sobrio y vapor ligero.

CONTROL SEMÁNTICO: No pan de hamburguesa ni empanadilla de media luna; conservar la masa blanca esponjosa.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No pan de hamburguesa ni empanadilla de media luna; conservar la masa blanca esponjosa.

### 面包 · miànbāo — pan

ID: `v-面包` · Riesgo: `low` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-9620de654bc055e4` · Perfil: `food`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Fotografía gastronómica muy realista y apetitosa: textura comestible, cocción y humedad naturales, brillo moderado y porción plausible. Recipiente sencillo cuando sea necesario; sin mesa completa ni guarniciones que oculten la preparación. Vapor solo si el alimento se sirve caliente.

ESCENA ESPECÍFICA: Una hogaza pequeña de pan de trigo dorado y dos rebanadas contiguas que muestran miga porosa y corteza crujiente, sin relleno ni envase.

CONTROL SEMÁNTICO: No hamburguesa, baozi o pastel; evitar harina excesiva que parezca polvo artificial.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No hamburguesa, baozi o pastel; evitar harina excesiva que parezca polvo artificial.

### 汉堡包 · hànbǎobāo — hamburguesa

ID: `v-汉堡包` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-27517b4cb9147855` · Perfil: `food`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Fotografía gastronómica muy realista y apetitosa: textura comestible, cocción y humedad naturales, brillo moderado y porción plausible. Recipiente sencillo cuando sea necesario; sin mesa completa ni guarniciones que oculten la preparación. Vapor solo si el alimento se sirve caliente.

ESCENA ESPECÍFICA: Una hamburguesa real apetitosa, pan tostado con sésamo, carne cocinada visible, lechuga y tomate frescos y queso discretamente fundido, sin envoltorio.

CONTROL SEMÁNTICO: No añadir rasgos falsos para distinguirla de 汉堡; evitar exceso de ingredientes o grasa artificial. No logotipos ni torre imposible; 汉堡包 es una variante válida del mismo referente.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No añadir rasgos falsos para distinguirla de 汉堡; evitar exceso de ingredientes o grasa artificial.

### 比萨饼 · bǐsàbǐng — pizza

ID: `v-比萨饼` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-a57706dec0244982` · Perfil: `food`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Fotografía gastronómica muy realista y apetitosa: textura comestible, cocción y humedad naturales, brillo moderado y porción plausible. Recipiente sencillo cuando sea necesario; sin mesa completa ni guarniciones que oculten la preparación. Vapor solo si el alimento se sirve caliente.

ESCENA ESPECÍFICA: Una pizza real de masa horneada, queso fundido, salsa de tomate visible y borde dorado, con una porción separada junto al resto sobre un soporte mínimo.

CONTROL SEMÁNTICO: No intentar distinguir visualmente esta forma de 披萨; no logos ni caja impresa. No masa de plástico ni queso interminable. 比萨饼 también nombra esta comida.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No intentar distinguir visualmente esta forma de 披萨; no logos ni caja impresa.

### 照片 · zhàopiàn — foto; imagen

ID: `v-照片` · Riesgo: `medium` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-0f4fd31a816c849e` · Perfil: `object`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Objeto cotidiano completo, con materiales verosímiles y sin palabras impresas. El objeto debe ser el protagonista, no una persona utilizándolo ni su entorno.

ESCENA ESPECÍFICA: Dos fotografías impresas con borde fino, una ligeramente delante de otra; la imagen principal muestra un paisaje natural sencillo y el grosor del papel es visible.

CONTROL SEMÁNTICO: El foco es el objeto fotografía, no el paisaje contenido; no marco decorativo ni texto.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** El foco es el objeto fotografía, no el paisaje contenido; no marco decorativo ni texto.

### 狗 · gǒu — perro

ID: `v-狗` · Riesgo: `low` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-c13eb6597ada863a` · Perfil: `animal`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Fotografía de animal doméstico tierno pero anatómicamente real: pelaje con detalle, expresión tranquila, postura natural, ojos proporcionados y cuerpo reconocible. Nada de disfraz, lazo, juguetes protagonistas ni exageración de ojos.

ESCENA ESPECÍFICA: Un perro doméstico adulto de tamaño mediano, pelaje crema, sentado y atento, con expresión amistosa, hocico y orejas naturales y cuerpo completo.

CONTROL SEMÁNTICO: No cachorro deliberado ni disfraz; no ocultar el cuerpo detrás de accesorios.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No cachorro deliberado ni disfraz; no ocultar el cuerpo detrás de accesorios.

### 茶 · chá — té

ID: `v-茶` · Riesgo: `medium` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-ed9162736802ecf6` · Perfil: `drink`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Fotografía realista de bebida: transparencia, menisco, burbujas, crema, temperatura y condensación físicamente coherentes. Recipiente sin marca; acompañamiento mínimo que ayude a identificar el ingrediente. No sustituir la bebida por el nombre de una marca.

ESCENA ESPECÍFICA: Una taza transparente de té ámbar claro con algunas hojas secas de té al lado, líquido reconocible, calor suave y sin azúcar o fruta dominante.

CONTROL SEMÁNTICO: No café oscuro, agua sola ni infusión de frutas como único referente.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No café oscuro, agua sola ni infusión de frutas como único referente.

### 咖啡 · kāfēi — café

ID: `v-咖啡` · Riesgo: `low` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-695078c32282e0cf` · Perfil: `drink`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Fotografía realista de bebida: transparencia, menisco, burbujas, crema, temperatura y condensación físicamente coherentes. Recipiente sin marca; acompañamiento mínimo que ayude a identificar el ingrediente. No sustituir la bebida por el nombre de una marca.

ESCENA ESPECÍFICA: Una taza pequeña de café espresso con crema marrón avellana visible, cerámica sencilla, reflejos reales y dos granos de café discretos junto a la base.

CONTROL SEMÁNTICO: No té ni taza vacía; no logotipo, corazón dibujado o leche que oculte el café.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No té ni taza vacía; no logotipo, corazón dibujado o leche que oculte el café.

### 钢琴 · gāngqín — piano

ID: `v-钢琴` · Riesgo: `low` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-37031517d16e964f` · Perfil: `object`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Objeto cotidiano completo, con materiales verosímiles y sin palabras impresas. El objeto debe ser el protagonista, no una persona utilizándolo ni su entorno.

ESCENA ESPECÍFICA: Un piano acústico de cola compacto real con tapa entreabierta, teclado, tres pedales y patas visibles, madera oscura bien iluminada y sin pianista.

CONTROL SEMÁNTICO: No sintetizador ni teclado de juguete; no cortar teclas, patas o pedales.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No sintetizador ni teclado de juguete; no cortar teclas, patas o pedales.

### 橙汁 · chéngzhī — jugo de naranja

ID: `v-橙汁` · Riesgo: `medium` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-ea08c54dc91115d3` · Perfil: `drink`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Fotografía realista de bebida: transparencia, menisco, burbujas, crema, temperatura y condensación físicamente coherentes. Recipiente sin marca; acompañamiento mínimo que ayude a identificar el ingrediente. No sustituir la bebida por el nombre de una marca.

ESCENA ESPECÍFICA: Un vaso transparente de jugo de naranja recién exprimido, color naranja natural y ligera pulpa visible, con media naranja jugosa pegada visualmente al conjunto.

CONTROL SEMÁNTICO: No refresco artificial, bebida de mango ni decoraciones de cóctel; la fruta ayuda a identificar el ingrediente.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No refresco artificial, bebida de mango ni decoraciones de cóctel; la fruta ayuda a identificar el ingrediente.

### 可乐 · kělè — coca cola

ID: `v-可乐` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-5aaed5a2dd3d4ef1` · Perfil: `drink`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Fotografía realista de bebida: transparencia, menisco, burbujas, crema, temperatura y condensación físicamente coherentes. Recipiente sin marca; acompañamiento mínimo que ayude a identificar el ingrediente. No sustituir la bebida por el nombre de una marca.

ESCENA ESPECÍFICA: Un vaso de refresco de cola marrón oscuro con burbujas pequeñas, hielo real y condensación moderada; sin botella ni etiqueta de marca.

CONTROL SEMÁNTICO: Representa cola genérica; no atribuir una marca precisa al líquido ni inventar su logotipo.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Representa cola genérica; no atribuir una marca precisa al líquido ni inventar su logotipo.

### 牛奶 · niúnǎi — leche

ID: `v-牛奶` · Riesgo: `medium` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-cf21ca8f3e467a1e` · Perfil: `drink`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Fotografía realista de bebida: transparencia, menisco, burbujas, crema, temperatura y condensación físicamente coherentes. Recipiente sin marca; acompañamiento mínimo que ayude a identificar el ingrediente. No sustituir la bebida por el nombre de una marca.

ESCENA ESPECÍFICA: Un vaso de leche blanca con reflejos suaves y una pequeña jarra de vidrio detrás, ambos completos y sin etiquetas.

CONTROL SEMÁNTICO: El blanco no demuestra que sea leche de vaca; no utilizar esta pista para penalizar una bebida de soja sin contexto.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** El blanco no demuestra que sea leche de vaca; no utilizar esta pista para penalizar una bebida de soja sin contexto.

### 豆浆 · dòujiāng — leche de soja

ID: `v-豆浆` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-a5b016915c286746` · Perfil: `drink`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Fotografía realista de bebida: transparencia, menisco, burbujas, crema, temperatura y condensación físicamente coherentes. Recipiente sin marca; acompañamiento mínimo que ayude a identificar el ingrediente. No sustituir la bebida por el nombre de una marca.

ESCENA ESPECÍFICA: Un vaso de bebida de soja color marfil con un pequeño cuenco de soja seca y algunas semillas al lado, todo como un único grupo realista.

CONTROL SEMÁNTICO: No confundir con leche solo por color; las semillas deben ser soja real y no garbanzos.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No confundir con leche solo por color; las semillas deben ser soja real y no garbanzos.

### 水 · shuǐ — agua

ID: `v-水` · Riesgo: `medium` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-866ef82f11645bc7` · Perfil: `drink`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Fotografía realista de bebida: transparencia, menisco, burbujas, crema, temperatura y condensación físicamente coherentes. Recipiente sin marca; acompañamiento mínimo que ayude a identificar el ingrediente. No sustituir la bebida por el nombre de una marca.

ESCENA ESPECÍFICA: Un vaso de agua limpia y transparente con refracción natural y una jarra pequeña sin etiqueta; apariencia cotidiana, sin hielo ornamental ni ingredientes.

CONTROL SEMÁNTICO: No prometer que un líquido transparente sea identificable sin contexto; evitar gotas gigantes o efectos irreales.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No prometer que un líquido transparente sea identificable sin contexto; evitar gotas gigantes o efectos irreales.

### 厕所 · cè suǒ — baño

ID: `v-厕所` · Riesgo: `medium` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-79fab4d70c79fb21` · Perfil: `object`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Objeto cotidiano completo, con materiales verosímiles y sin palabras impresas. El objeto debe ser el protagonista, no una persona utilizándolo ni su entorno.

ESCENA ESPECÍFICA: Un pequeño conjunto sanitario limpio: inodoro de cerámica y lavabo con grifo, objetos completos sobre transparencia, sin persona ni paredes de baño.

CONTROL SEMÁNTICO: No contenido invasivo, suciedad, puertas con texto o señales que sustituyan el referente.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No contenido invasivo, suciedad, puertas con texto o señales que sustituyan el referente.

### 书 · shū — libro

ID: `v-书` · Riesgo: `low` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-da0162af5409a7f2` · Perfil: `object`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Objeto cotidiano completo, con materiales verosímiles y sin palabras impresas. El objeto debe ser el protagonista, no una persona utilizándolo ni su entorno.

ESCENA ESPECÍFICA: Un libro físico de tapa dura ligeramente abierto que muestre páginas y lomo; cubierta lisa sin título y páginas sin escritura legible.

CONTROL SEMÁNTICO: No cuaderno de espiral, tableta ni tarjeta; no inventar títulos.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No cuaderno de espiral, tableta ni tarjeta; no inventar títulos.

### 面条 · miàntiáo — fideos; tallarines

ID: `v-面条` · Riesgo: `medium` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-21c553a55177fba4` · Perfil: `food`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Fotografía gastronómica muy realista y apetitosa: textura comestible, cocción y humedad naturales, brillo moderado y porción plausible. Recipiente sencillo cuando sea necesario; sin mesa completa ni guarniciones que oculten la preparación. Vapor solo si el alimento se sirve caliente.

ESCENA ESPECÍFICA: Un cuenco de fideos de trigo largos cocidos, ligeramente ondulados y apetitosos, con unos pocos fideos elevados por palillos; preparación sencilla que mantenga visible el alimento.

CONTROL SEMÁNTICO: El erhua no se representa visualmente; no fingir que esta comida difiere de 面条. No espagueti occidental como único referente ni ingredientes protagonistas. La misma imagen sirve a 面条儿.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No espagueti occidental como único referente ni ingredientes protagonistas. La misma imagen sirve a 面条儿.

### 炸猪肉面包 · Zhá zhūròu miànbāo — pan con carne de cerdo frita

ID: `v-炸猪肉面包` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-890c8dcbcf15be12` · Perfil: `food`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Fotografía gastronómica muy realista y apetitosa: textura comestible, cocción y humedad naturales, brillo moderado y porción plausible. Recipiente sencillo cuando sea necesario; sin mesa completa ni guarniciones que oculten la preparación. Vapor solo si el alimento se sirve caliente.

ESCENA ESPECÍFICA: Un pan abierto relleno de trozos de cerdo frito cocinado, corteza dorada y carne jugosa visible, presentado como sándwich sencillo y creíble.

CONTROL SEMÁNTICO: La carne no es identificable con certeza solo por la foto; no atribuir esta preparación a una tradición nacional no documentada.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** La carne no es identificable con certeza solo por la foto; no atribuir esta preparación a una tradición nacional no documentada.

### 肉夹馍 · Ròu jiā mó — pan chino relleno de carne

ID: `v-肉夹馍` · Riesgo: `medium` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-3c9265a52be5fa83` · Perfil: `food`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Fotografía gastronómica muy realista y apetitosa: textura comestible, cocción y humedad naturales, brillo moderado y porción plausible. Recipiente sencillo cuando sea necesario; sin mesa completa ni guarniciones que oculten la preparación. Vapor solo si el alimento se sirve caliente.

ESCENA ESPECÍFICA: Un roujiamo real: pan plano redondo horneado abierto y relleno generosamente de carne guisada picada jugosa, con textura del pan y del relleno visibles.

CONTROL SEMÁNTICO: No sustituir por hamburguesa de pan con sésamo, baozi al vapor o pita genérica; verificar referencia culinaria.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No sustituir por hamburguesa de pan con sésamo, baozi al vapor o pita genérica; verificar referencia culinaria.

### 汉堡 · hànbăo — hamburguesa

ID: `v-汉堡` · Riesgo: `medium` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-27517b4cb9147855` · Perfil: `food`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Fotografía gastronómica muy realista y apetitosa: textura comestible, cocción y humedad naturales, brillo moderado y porción plausible. Recipiente sencillo cuando sea necesario; sin mesa completa ni guarniciones que oculten la preparación. Vapor solo si el alimento se sirve caliente.

ESCENA ESPECÍFICA: Una hamburguesa real apetitosa, pan tostado con sésamo, carne cocinada visible, lechuga y tomate frescos y queso discretamente fundido, sin envoltorio.

CONTROL SEMÁNTICO: No añadir rasgos falsos para distinguirla de 汉堡; evitar exceso de ingredientes o grasa artificial. No logotipos ni torre imposible; 汉堡包 es una variante válida del mismo referente.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No logotipos ni torre imposible; 汉堡包 es una variante válida del mismo referente.

### 披萨 · pīsà — pizza

ID: `v-披萨` · Riesgo: `medium` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-a57706dec0244982` · Perfil: `food`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Fotografía gastronómica muy realista y apetitosa: textura comestible, cocción y humedad naturales, brillo moderado y porción plausible. Recipiente sencillo cuando sea necesario; sin mesa completa ni guarniciones que oculten la preparación. Vapor solo si el alimento se sirve caliente.

ESCENA ESPECÍFICA: Una pizza real de masa horneada, queso fundido, salsa de tomate visible y borde dorado, con una porción separada junto al resto sobre un soporte mínimo.

CONTROL SEMÁNTICO: No intentar distinguir visualmente esta forma de 披萨; no logos ni caja impresa. No masa de plástico ni queso interminable. 比萨饼 también nombra esta comida.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No masa de plástico ni queso interminable. 比萨饼 también nombra esta comida.

### 热狗 · règǒu — hot dog

ID: `v-热狗` · Riesgo: `low` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-931a2985414adc17` · Perfil: `food`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Fotografía gastronómica muy realista y apetitosa: textura comestible, cocción y humedad naturales, brillo moderado y porción plausible. Recipiente sencillo cuando sea necesario; sin mesa completa ni guarniciones que oculten la preparación. Vapor solo si el alimento se sirve caliente.

ESCENA ESPECÍFICA: Un hot dog real: salchicha cocinada dentro de pan alargado suave, con una pequeña línea de mostaza y textura apetecible, sin envase.

CONTROL SEMÁNTICO: No animal ni interpretación literal de perro caliente; no marcas comerciales.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No animal ni interpretación literal de perro caliente; no marcas comerciales.

### 寿司 · shòu sī — sushi

ID: `v-寿司` · Riesgo: `medium` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-71ba8b615df71638` · Perfil: `food`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Fotografía gastronómica muy realista y apetitosa: textura comestible, cocción y humedad naturales, brillo moderado y porción plausible. Recipiente sencillo cuando sea necesario; sin mesa completa ni guarniciones que oculten la preparación. Vapor solo si el alimento se sirve caliente.

ESCENA ESPECÍFICA: Un pequeño conjunto reconocible de sushi con dos nigiri y tres maki, arroz compacto visible, nori y pescado de aspecto fresco, sobre plato sencillo.

CONTROL SEMÁNTICO: No representar únicamente sashimi o arroz; no mezclar con comida china para ambientar.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No representar únicamente sashimi o arroz; no mezclar con comida china para ambientar.

### 甜品 · tián pĭn — solo postres dulces, como los que se comen al final de una comida

ID: `v-甜品` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-1e34a5c354980390` · Perfil: `food`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Fotografía gastronómica muy realista y apetitosa: textura comestible, cocción y humedad naturales, brillo moderado y porción plausible. Recipiente sencillo cuando sea necesario; sin mesa completa ni guarniciones que oculten la preparación. Vapor solo si el alimento se sirve caliente.

ESCENA ESPECÍFICA: Tres postres dulces de tipos distintos en pequeños recipientes: una porción de pastel, una tartaleta y un pudin, claramente agrupados como categoría.

CONTROL SEMÁNTICO: No una sola tarta como respuesta obligatoria ni platos salados; la imagen requiere la palabra o frase para fijar la categoría.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No una sola tarta como respuesta obligatoria ni platos salados; la imagen requiere la palabra o frase para fijar la categoría.

### 蛋挞 · dàntà — tartaletas de huevo

ID: `v-蛋挞` · Riesgo: `medium` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-b23f9570f6cb2d23` · Perfil: `food`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Fotografía gastronómica muy realista y apetitosa: textura comestible, cocción y humedad naturales, brillo moderado y porción plausible. Recipiente sencillo cuando sea necesario; sin mesa completa ni guarniciones que oculten la preparación. Vapor solo si el alimento se sirve caliente.

ESCENA ESPECÍFICA: Dos tartaletas de huevo recién horneadas, masa laminada dorada, crema amarilla cuajada con brillo natural y una pieza partida para mostrar el interior.

CONTROL SEMÁNTICO: No cupcake, flan sin masa ni fruta dominante; consultar apariencia real de una tartaleta de huevo.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No cupcake, flan sin masa ni fruta dominante; consultar apariencia real de una tartaleta de huevo.

### 筷子 · kuàizi — palillos para comer

ID: `v-筷子` · Riesgo: `low` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-974dd82de0721ee4` · Perfil: `object`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Objeto cotidiano completo, con materiales verosímiles y sin palabras impresas. El objeto debe ser el protagonista, no una persona utilizándolo ni su entorno.

ESCENA ESPECÍFICA: Un par de palillos de madera real apoyados oblicuamente sobre un pequeño soporte sencillo, puntas y extremos completos.

CONTROL SEMÁNTICO: No cubiertos occidentales, comida protagonista ni mano que cambie el foco a usar.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No cubiertos occidentales, comida protagonista ni mano que cambie el foco a usar.

### 果汁 · guǒ zhī — jugo de fruta

ID: `v-果汁` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-f79b815176504498` · Perfil: `drink`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Fotografía realista de bebida: transparencia, menisco, burbujas, crema, temperatura y condensación físicamente coherentes. Recipiente sin marca; acompañamiento mínimo que ayude a identificar el ingrediente. No sustituir la bebida por el nombre de una marca.

ESCENA ESPECÍFICA: Dos vasos pequeños de jugos de frutas diferentes, uno naranja y otro rojo, junto a sus frutas cortadas en cantidad mínima, como categoría de jugos.

CONTROL SEMÁNTICO: No usar solo naranja para exigir la palabra genérica frente a 橙汁; no bebidas alcohólicas.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No usar solo naranja para exigir la palabra genérica frente a 橙汁; no bebidas alcohólicas.

### 饮料 · yĭnliào — bebidas

ID: `v-饮料` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-0e3ce6d430ef3e72` · Perfil: `drink`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Fotografía realista de bebida: transparencia, menisco, burbujas, crema, temperatura y condensación físicamente coherentes. Recipiente sin marca; acompañamiento mínimo que ayude a identificar el ingrediente. No sustituir la bebida por el nombre de una marca.

ESCENA ESPECÍFICA: Un grupo breve de bebidas distintas: vaso de agua, taza de té y vaso de jugo, con los tres recipientes igualmente reconocibles.

CONTROL SEMÁNTICO: No una única taza ni marcas; la categoría bebidas necesita apoyo textual y no es una respuesta visual única.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No una única taza ni marcas; la categoría bebidas necesita apoyo textual y no es una respuesta visual única.

### 苹果 · píngguŏ — manzana

ID: `v-苹果` · Riesgo: `low` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-bab4a2d64d0205c1` · Perfil: `food`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Fotografía gastronómica muy realista y apetitosa: textura comestible, cocción y humedad naturales, brillo moderado y porción plausible. Recipiente sencillo cuando sea necesario; sin mesa completa ni guarniciones que oculten la preparación. Vapor solo si el alimento se sirve caliente.

ESCENA ESPECÍFICA: Una manzana roja fresca completa con una hoja discreta y una mitad al lado que muestre pulpa húmeda clara y semillas naturales.

CONTROL SEMÁNTICO: No logotipo tecnológico, corazón estilizado ni otras frutas protagonistas.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No logotipo tecnológico, corazón estilizado ni otras frutas protagonistas.

### 卡片 · kǎpiàn — tarjeta

ID: `v-卡片` · Riesgo: `medium` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-85a833faf5f76640` · Perfil: `object`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Objeto cotidiano completo, con materiales verosímiles y sin palabras impresas. El objeto debe ser el protagonista, no una persona utilizándolo ni su entorno.

ESCENA ESPECÍFICA: Tres tarjetas rígidas lisas de papel grueso, ligeramente superpuestas, con esquinas y grosor visibles, sin texto ni detalles comerciales.

CONTROL SEMÁNTICO: No convertirlas en naipes, documentos personales o tarjetas bancarias; distinguir el objeto de sus contenidos.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No convertirlas en naipes, documentos personales o tarjetas bancarias; distinguir el objeto de sus contenidos.

### 小狗 · xiǎo ɡǒu — perrito

ID: `v-小狗` · Riesgo: `medium` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-b1e9c5d76f9d02f0` · Perfil: `animal`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Fotografía de animal doméstico tierno pero anatómicamente real: pelaje con detalle, expresión tranquila, postura natural, ojos proporcionados y cuerpo reconocible. Nada de disfraz, lazo, juguetes protagonistas ni exageración de ojos.

ESCENA ESPECÍFICA: Un perrito joven de pelaje miel, patas pequeñas y cuerpo completo, en una postura tranquila y curiosa, sin accesorios.

CONTROL SEMÁNTICO: No caricaturizar proporciones; no confundir una raza adulta pequeña con la idea de cría sin contexto.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No caricaturizar proporciones; no confundir una raza adulta pequeña con la idea de cría sin contexto.

### 猫 · māo — gato

ID: `v-猫` · Riesgo: `low` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-ac7e093d77fc87af` · Perfil: `animal`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Fotografía de animal doméstico tierno pero anatómicamente real: pelaje con detalle, expresión tranquila, postura natural, ojos proporcionados y cuerpo reconocible. Nada de disfraz, lazo, juguetes protagonistas ni exageración de ojos.

ESCENA ESPECÍFICA: Un gato doméstico adulto gris de pelo corto sentado serenamente, cuerpo completo, orejas erguidas, bigotes finos, ojos naturales y cola visible junto a las patas. Cercano y tierno como la referencia del usuario, sin copiar una identidad animal concreta.

CONTROL SEMÁNTICO: No cortar orejas, patas o cola; no convertirlo en gatito, tigre o mascota con nombre; sin cesta ni habitación.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No cortar orejas, patas o cola; no convertirlo en gatito, tigre o mascota con nombre; sin cesta ni habitación.

### 马 · mǎ — caballo

ID: `v-马` · Riesgo: `low` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-b567f89dbfaa32fc` · Perfil: `animal`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Fotografía de animal doméstico tierno pero anatómicamente real: pelaje con detalle, expresión tranquila, postura natural, ojos proporcionados y cuerpo reconocible. Nada de disfraz, lazo, juguetes protagonistas ni exageración de ojos.

ESCENA ESPECÍFICA: Un caballo real de pelaje castaño claro, cuerpo completo de perfil tres cuartos, mirada tranquila y crin natural, en postura relajada sobre un apoyo mínimo transparente.

CONTROL SEMÁNTICO: No silla de montar protagonista; esta imagen corresponde al animal, nunca al apellido Ma.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No silla de montar protagonista; esta imagen corresponde al animal, nunca al apellido Ma.

### 地图 · dìtú — mapa

ID: `v-地图` · Riesgo: `medium` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-d80a7a5359ef0b2e` · Perfil: `object`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Objeto cotidiano completo, con materiales verosímiles y sin palabras impresas. El objeto debe ser el protagonista, no una persona utilizándolo ni su entorno.

ESCENA ESPECÍFICA: Un mapa físico plegado de papel, abierto parcialmente para mostrar una geografía esquemática sin nombres ni fronteras reclamadas; pliegues y papel reales.

CONTROL SEMÁNTICO: La pregunta sería mapa como objeto, no identificar un país; no publicar cartografía inventada como referencia exacta.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** La pregunta sería mapa como objeto, no identificar un país; no publicar cartografía inventada como referencia exacta.

### 炒饭 · chăo fàn — arroz frito

ID: `v-炒饭` · Riesgo: `medium` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-5c78e1a5fd58b9d5` · Perfil: `food`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Fotografía gastronómica muy realista y apetitosa: textura comestible, cocción y humedad naturales, brillo moderado y porción plausible. Recipiente sencillo cuando sea necesario; sin mesa completa ni guarniciones que oculten la preparación. Vapor solo si el alimento se sirve caliente.

ESCENA ESPECÍFICA: Un cuenco de arroz frito con granos separados dorados, pequeños trozos de huevo y cebollín, acabado recién salteado y sabroso.

CONTROL SEMÁNTICO: No arroz blanco simple, sopa ni exceso de salsa; los granos deben seguir siendo reconocibles.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No arroz blanco simple, sopa ni exceso de salsa; los granos deben seguir siendo reconocibles.

### 名片 · míngpiàn — tarjeta de presentación

ID: `v-名片` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-3ce5f8d2385b36b9` · Perfil: `object`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Objeto cotidiano completo, con materiales verosímiles y sin palabras impresas. El objeto debe ser el protagonista, no una persona utilizándolo ni su entorno.

ESCENA ESPECÍFICA: Una persona entrega una tarjeta pequeña de presentación con diseño completamente en blanco a otra mano; manos y tarjeta naturales y claramente visibles.

CONTROL SEMÁNTICO: Sin datos personales, nombres, teléfonos o marcas; la función se comprende en contexto, no por una tarjeta blanca sola.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Sin datos personales, nombres, teléfonos o marcas; la función se comprende en contexto, no por una tarjeta blanca sola.

### 餐厅 · cāntīng — restaurante; comedor

ID: `v-餐厅` · Riesgo: `medium` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-ae685e4d0daa20d6` · Perfil: `place`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Recorte fotográfico arquitectónico reconocible del referente indicado. Mantén su estructura real y solo una base local mínima que lo sostenga; sin cielo, horizonte, fondo urbano panorámico ni decoración turística adicional.

ESCENA ESPECÍFICA: Un pequeño conjunto recortado de restaurante real: dos mesas puestas con vajilla, sillas y un mostrador de servicio discreto, con acceso reconocible pero sin paredes de fondo ni letreros.

CONTROL SEMÁNTICO: No usar solo un plato; no inventar un restaurante real, logotipo o paisaje urbano.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No usar solo un plato; no inventar un restaurante real, logotipo o paisaje urbano.

### 北京烤鸭 · Běijīng kǎoyā — pato laqueado de Pekín

ID: `v-北京烤鸭` · Riesgo: `medium` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-e3e1c737874d58e7` · Perfil: `food`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Fotografía gastronómica muy realista y apetitosa: textura comestible, cocción y humedad naturales, brillo moderado y porción plausible. Recipiente sencillo cuando sea necesario; sin mesa completa ni guarniciones que oculten la preparación. Vapor solo si el alimento se sirve caliente.

ESCENA ESPECÍFICA: Pato laqueado de Pekín servido en láminas: piel fina lacada color caoba y carne cocinada visibles, acompañado de pocas crepes finas y pepino, sin mesa completa.

CONTROL SEMÁNTICO: No pollo asado genérico; la piel y el corte deben corresponder al plato real, sin exceso de accesorios.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No pollo asado genérico; la piel y el corte deben corresponder al plato real, sin exceso de accesorios.

### 手 · shǒu — mano

ID: `v-手` · Riesgo: `low` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-c17fa0720349b0ee` · Perfil: `object`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Objeto cotidiano completo, con materiales verosímiles y sin palabras impresas. El objeto debe ser el protagonista, no una persona utilizándolo ni su entorno.

ESCENA ESPECÍFICA: Una mano adulta ficticia completa, palma visible, cinco dedos naturales ligeramente separados y muñeca parcialmente visible, postura relajada sin gesto lingüístico específico.

CONTROL SEMÁNTICO: No dedos extra, corte abrupto de dedos, puño, señal de saludo ni accesorio que compita con la parte del cuerpo.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No dedos extra, corte abrupto de dedos, puño, señal de saludo ni accesorio que compita con la parte del cuerpo.

### 酒 · jiǔ — bebida alcohólica

ID: `v-酒` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-71b20564f92ffa5f` · Perfil: `drink`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Fotografía realista de bebida: transparencia, menisco, burbujas, crema, temperatura y condensación físicamente coherentes. Recipiente sin marca; acompañamiento mínimo que ayude a identificar el ingrediente. No sustituir la bebida por el nombre de una marca.

ESCENA ESPECÍFICA: Un vaso pequeño con bebida ámbar y una botella sin marca, presentación neutra de vocabulario adulto, sin personas consumiendo ni ambiente festivo.

CONTROL SEMÁNTICO: La imagen no certifica alcohol ni un tipo concreto; no promoción de marca, exceso o intoxicación.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** La imagen no certifica alcohol ni un tipo concreto; no promoción de marca, exceso o intoxicación.

### 小猫 · xiǎomāo — gatito; gato pequeño

ID: `v-小猫` · Riesgo: `medium` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-948cedcc26ce7864` · Perfil: `animal`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Fotografía de animal doméstico tierno pero anatómicamente real: pelaje con detalle, expresión tranquila, postura natural, ojos proporcionados y cuerpo reconocible. Nada de disfraz, lazo, juguetes protagonistas ni exageración de ojos.

ESCENA ESPECÍFICA: Un gatito doméstico joven pequeño, de proporciones naturales, sentado con las patas juntas y expresión curiosa. Pelaje suave con detalle y cola completa.

CONTROL SEMÁNTICO: No ojos gigantes ni miniatura de juguete; el tamaño solo no demuestra edad y la frase debe aportar el matiz.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No ojos gigantes ni miniatura de juguete; el tamaño solo no demuestra edad y la frase debe aportar el matiz.

## action_scene

### 问 · wèn — preguntar

ID: `v-问` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-4a55f1a103249ebb` · Perfil: `action`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Escena fotográfica de una acción legible: personas ficticias, postura y manos completas, instante representativo y solo el objeto necesario. Gesto ligeramente enfatizado para enseñar, no mímica absurda ni caricatura. El sujeto y sus pocos accesorios forman un único recorte transparente.

ESCENA ESPECÍFICA: Dos adultos ficticios dialogan: uno se inclina ligeramente y extiende una mano abierta con expresión interrogativa; el otro escucha atento y no está hablando.

CONTROL SEMÁNTICO: No signo de pregunta flotante, interrogatorio agresivo ni afirmar que el gesto distingue preguntar de hablar sin frase.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No signo de pregunta flotante, interrogatorio agresivo ni afirmar que el gesto distingue preguntar de hablar sin frase.

### 进 · jìn — entrar

ID: `v-进` · Riesgo: `medium` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-148c31d1377736c2` · Perfil: `action`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Escena fotográfica de una acción legible: personas ficticias, postura y manos completas, instante representativo y solo el objeto necesario. Gesto ligeramente enfatizado para enseñar, no mímica absurda ni caricatura. El sujeto y sus pocos accesorios forman un único recorte transparente.

ESCENA ESPECÍFICA: Una persona atraviesa un marco de puerta sencillo hacia el interior indicado por una silla próxima al otro lado; el paso delantero y la mirada marcan la entrada.

CONTROL SEMÁNTICO: No habitación pintada ni confundir entrar con salir; validar dirección de los pies y mirada.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No habitación pintada ni confundir entrar con salir; validar dirección de los pies y mirada.

### 坐 · zuò — sentarse

ID: `v-坐` · Riesgo: `medium` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-a5a5df18963e42f1` · Perfil: `action`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Escena fotográfica de una acción legible: personas ficticias, postura y manos completas, instante representativo y solo el objeto necesario. Gesto ligeramente enfatizado para enseñar, no mímica absurda ni caricatura. El sujeto y sus pocos accesorios forman un único recorte transparente.

ESCENA ESPECÍFICA: Una persona adulta ficticia sentada erguida en una silla sencilla, con rodillas flexionadas, pies apoyados y asiento visible.

CONTROL SEMÁNTICO: No sofá de descanso, somnolencia ni flotación del cuerpo; la silla es solo apoyo funcional.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No sofá de descanso, somnolencia ni flotación del cuerpo; la silla es solo apoyo funcional.

### 到 · dào — alcanzar; llegar

ID: `v-到` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-e2d7bb7c0514ac0e` · Perfil: `action`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Escena fotográfica de una acción legible: personas ficticias, postura y manos completas, instante representativo y solo el objeto necesario. Gesto ligeramente enfatizado para enseñar, no mímica absurda ni caricatura. El sujeto y sus pocos accesorios forman un único recorte transparente.

ESCENA ESPECÍFICA: Una viajera adulta ficticia acaba de detenerse junto a una entrada sencilla con su maleta apoyada y expresión de llegada; otra persona la recibe.

CONTROL SEMÁNTICO: Sin aeropuerto de fondo ni texto; el matiz de llegar necesita contexto temporal, no solo caminar.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Sin aeropuerto de fondo ni texto; el matiz de llegar necesita contexto temporal, no solo caminar.

### 学习 · xuéxí — estudiar; aprender

ID: `v-学习` · Riesgo: `medium` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-58b7f923901a99d0` · Perfil: `action`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Escena fotográfica de una acción legible: personas ficticias, postura y manos completas, instante representativo y solo el objeto necesario. Gesto ligeramente enfatizado para enseñar, no mímica absurda ni caricatura. El sujeto y sus pocos accesorios forman un único recorte transparente.

ESCENA ESPECÍFICA: Una persona adulta estudia atentamente en un pequeño escritorio con libro abierto, cuaderno y lápiz; compara una página con sus notas sin texto legible.

CONTROL SEMÁNTICO: La imagen también representa 学习; no fingir diferencia visual entre las dos formas. No leer por ocio, copiar caracteres falsos ni pose escolar infantil obligatoria.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No leer por ocio, copiar caracteres falsos ni pose escolar infantil obligatoria.

### 学 · xué — estudiar; generalmente acompañado de un objeto

ID: `v-学` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-58b7f923901a99d0` · Perfil: `action`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Escena fotográfica de una acción legible: personas ficticias, postura y manos completas, instante representativo y solo el objeto necesario. Gesto ligeramente enfatizado para enseñar, no mímica absurda ni caricatura. El sujeto y sus pocos accesorios forman un único recorte transparente.

ESCENA ESPECÍFICA: Una persona adulta estudia atentamente en un pequeño escritorio con libro abierto, cuaderno y lápiz; compara una página con sus notas sin texto legible.

CONTROL SEMÁNTICO: La imagen también representa 学习; no fingir diferencia visual entre las dos formas. No leer por ocio, copiar caracteres falsos ni pose escolar infantil obligatoria.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** La imagen también representa 学习; no fingir diferencia visual entre las dos formas.

### 吃 · chī — comer

ID: `v-吃` · Riesgo: `medium` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-45fbbd4f1c5a4e6d` · Perfil: `action`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Escena fotográfica de una acción legible: personas ficticias, postura y manos completas, instante representativo y solo el objeto necesario. Gesto ligeramente enfatizado para enseñar, no mímica absurda ni caricatura. El sujeto y sus pocos accesorios forman un único recorte transparente.

ESCENA ESPECÍFICA: Una persona adulta ficticia lleva un bocado pequeño con palillos a la boca desde un cuenco sencillo; boca y manos naturales muestran claramente la acción de comer.

CONTROL SEMÁNTICO: No mostrar solo hambre ni bebida; no tapar el instante de contacto con el alimento.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No mostrar solo hambre ni bebida; no tapar el instante de contacto con el alimento.

### 看 · kàn — mirar; ver

ID: `v-看` · Riesgo: `medium` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-d26cdfc7700846d4` · Perfil: `action`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Escena fotográfica de una acción legible: personas ficticias, postura y manos completas, instante representativo y solo el objeto necesario. Gesto ligeramente enfatizado para enseñar, no mímica absurda ni caricatura. El sujeto y sus pocos accesorios forman un único recorte transparente.

ESCENA ESPECÍFICA: Una persona adulta dirige claramente la mirada hacia una fotografía que sostiene otra persona; cabeza y ojos orientados al objeto visible.

CONTROL SEMÁNTICO: No libro que convierta la acción en leer ni búsqueda de un objeto perdido.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No libro que convierta la acción en leer ni búsqueda de un objeto perdido.

### 做 · zuò — hacer

ID: `v-做` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-be4690c8558db3ea` · Perfil: `action`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Escena fotográfica de una acción legible: personas ficticias, postura y manos completas, instante representativo y solo el objeto necesario. Gesto ligeramente enfatizado para enseñar, no mímica absurda ni caricatura. El sujeto y sus pocos accesorios forman un único recorte transparente.

ESCENA ESPECÍFICA: Una persona adulta concentra manos y mirada en construir un pequeño objeto de madera sobre una superficie mínima, mostrando una actividad manual real.

CONTROL SEMÁNTICO: Solo apoyo del verbo general hacer: no exigir 做 frente al nombre de la actividad concreta.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Solo apoyo del verbo general hacer: no exigir 做 frente al nombre de la actividad concreta.

### 工作 · gōngzuò — trabajar/trabajo; empleo

ID: `v-工作` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-5a521ccfe7010b0e` · Perfil: `action`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Escena fotográfica de una acción legible: personas ficticias, postura y manos completas, instante representativo y solo el objeto necesario. Gesto ligeramente enfatizado para enseñar, no mímica absurda ni caricatura. El sujeto y sus pocos accesorios forman un único recorte transparente.

ESCENA ESPECÍFICA: Una persona adulta trabaja en una tarea concreta con documentos sin texto legible y ordenador sin contenido visible; postura activa y profesional, sin oficina de fondo.

CONTROL SEMÁNTICO: No presentar un traje como definición de trabajo ni equiparar todo trabajo al de oficina.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No presentar un traje como definición de trabajo ni equiparar todo trabajo al de oficina.

### 喝 · hē — beber

ID: `v-喝` · Riesgo: `medium` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-7d9fb7242b28e1db` · Perfil: `action`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Escena fotográfica de una acción legible: personas ficticias, postura y manos completas, instante representativo y solo el objeto necesario. Gesto ligeramente enfatizado para enseñar, no mímica absurda ni caricatura. El sujeto y sus pocos accesorios forman un único recorte transparente.

ESCENA ESPECÍFICA: Una persona adulta ficticia levanta un vaso de agua hasta los labios y toma un sorbo, con mano, borde del vaso y postura de beber claramente visibles.

CONTROL SEMÁNTICO: No escena de sed con vaso vacío ni sujeto simplemente sosteniendo la bebida.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No escena de sed con vaso vacío ni sujeto simplemente sosteniendo la bebida.

### 做饭 · zuò fàn — cocinar; preparar la comida

ID: `v-做饭` · Riesgo: `medium` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-530d225611240b5a` · Perfil: `action`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Escena fotográfica de una acción legible: personas ficticias, postura y manos completas, instante representativo y solo el objeto necesario. Gesto ligeramente enfatizado para enseñar, no mímica absurda ni caricatura. El sujeto y sus pocos accesorios forman un único recorte transparente.

ESCENA ESPECÍFICA: Una persona adulta remueve alimentos cocinándose en una sartén sobre un módulo mínimo de cocina; cuchara, sartén y gesto de preparación visibles.

CONTROL SEMÁNTICO: No confundir cocinar con comer o servir; utensilios seguros y alimentos ya en proceso de cocción.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No confundir cocinar con comer o servir; utensilios seguros y alimentos ya en proceso de cocción.

### 画画 · huà huà — dibujar; pintar

ID: `v-画画` · Riesgo: `medium` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-72f3d8500a4b2bd3` · Perfil: `action`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Escena fotográfica de una acción legible: personas ficticias, postura y manos completas, instante representativo y solo el objeto necesario. Gesto ligeramente enfatizado para enseñar, no mímica absurda ni caricatura. El sujeto y sus pocos accesorios forman un único recorte transparente.

ESCENA ESPECÍFICA: Una persona adulta dibuja una naturaleza muerta sencilla con lápiz sobre papel, con la mano en contacto con el dibujo y el objeto modelo cercano.

CONTROL SEMÁNTICO: No letras ni caracteres; distinguir dibujar de escribir, sin estudio artístico de fondo.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No letras ni caracteres; distinguir dibujar de escribir, sin estudio artístico de fondo.

### 用 · yòng — usar; utilizar

ID: `v-用` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-4ed330a7bcd12b85` · Perfil: `action`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Escena fotográfica de una acción legible: personas ficticias, postura y manos completas, instante representativo y solo el objeto necesario. Gesto ligeramente enfatizado para enseñar, no mímica absurda ni caricatura. El sujeto y sus pocos accesorios forman un único recorte transparente.

ESCENA ESPECÍFICA: Primer plano de unas manos adultas usando correctamente palillos para tomar un bocado de un plato sencillo, mostrando herramienta y función.

CONTROL SEMÁNTICO: La escena apoya usar palillos, no define por sí sola usar; no promoverla a pregunta sin complemento.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** La escena apoya usar palillos, no define por sí sola usar; no promoverla a pregunta sin complemento.

### 上课 · shàng kè — asistir a clase; dar clase

ID: `v-上课` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-18105b79afc49426` · Perfil: `action`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Escena fotográfica de una acción legible: personas ficticias, postura y manos completas, instante representativo y solo el objeto necesario. Gesto ligeramente enfatizado para enseñar, no mímica absurda ni caricatura. El sujeto y sus pocos accesorios forman un único recorte transparente.

ESCENA ESPECÍFICA: Una persona adulta aprende sentada frente a un docente que explica con un libro abierto sin texto visible; pequeño conjunto de mesa y sillas aisladas.

CONTROL SEMÁNTICO: Distinguir recibir una clase de estudiar solo; no atribuir una asignatura por apariencia.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Distinguir recibir una clase de estudiar solo; no atribuir una asignatura por apariencia.

### 弹 · tán — tocar al piano

ID: `v-弹` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-84780ec35ba24d34` · Perfil: `action`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Escena fotográfica de una acción legible: personas ficticias, postura y manos completas, instante representativo y solo el objeto necesario. Gesto ligeramente enfatizado para enseñar, no mímica absurda ni caricatura. El sujeto y sus pocos accesorios forman un único recorte transparente.

ESCENA ESPECÍFICA: Una persona adulta toca un piano real con ambas manos sobre teclas correctas; el torso y el teclado son visibles y la postura es natural.

CONTROL SEMÁNTICO: La imagen también representa 弹钢琴; no usar otro instrumento ni dedos deformados. No piano sin intérprete ni docente que convierta la escena en clase; comprobar contacto de los dedos.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** La imagen también representa 弹钢琴; no usar otro instrumento ni dedos deformados.

### 弹钢琴 · tán gāngqín — tocar al piano

ID: `v-弹钢琴` · Riesgo: `medium` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-84780ec35ba24d34` · Perfil: `action`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Escena fotográfica de una acción legible: personas ficticias, postura y manos completas, instante representativo y solo el objeto necesario. Gesto ligeramente enfatizado para enseñar, no mímica absurda ni caricatura. El sujeto y sus pocos accesorios forman un único recorte transparente.

ESCENA ESPECÍFICA: Una persona adulta toca un piano real con ambas manos sobre teclas correctas; el torso y el teclado son visibles y la postura es natural.

CONTROL SEMÁNTICO: La imagen también representa 弹钢琴; no usar otro instrumento ni dedos deformados. No piano sin intérprete ni docente que convierta la escena en clase; comprobar contacto de los dedos.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No piano sin intérprete ni docente que convierta la escena en clase; comprobar contacto de los dedos.

### 去 · qù — ir

ID: `v-去` · Riesgo: `medium` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-a7360cf74295c6f0` · Perfil: `action`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Escena fotográfica de una acción legible: personas ficticias, postura y manos completas, instante representativo y solo el objeto necesario. Gesto ligeramente enfatizado para enseñar, no mímica absurda ni caricatura. El sujeto y sus pocos accesorios forman un único recorte transparente.

ESCENA ESPECÍFICA: Una persona adulta camina desde otra persona que queda atrás hacia una puerta sencilla situada delante, mirada y pasos dirigidos al destino.

CONTROL SEMÁNTICO: No llegada ya completada ni entrar con un pie dentro; la referencia espacial debe quedar clara.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No llegada ya completada ni entrar con un pie dentro; la referencia espacial debe quedar clara.

### 找 · zhǎo — buscar

ID: `v-找` · Riesgo: `medium` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-5d0c645bee639a19` · Perfil: `action`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Escena fotográfica de una acción legible: personas ficticias, postura y manos completas, instante representativo y solo el objeto necesario. Gesto ligeramente enfatizado para enseñar, no mímica absurda ni caricatura. El sujeto y sus pocos accesorios forman un único recorte transparente.

ESCENA ESPECÍFICA: Una persona adulta busca unas llaves levantando un pequeño bolso y mirando debajo; las llaves están parcialmente visibles para el observador pero aún no para el personaje.

CONTROL SEMÁNTICO: No gesto de leer ni lupa teatral; evitar que el objeto clave sea imposible de encontrar.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No gesto de leer ni lupa teatral; evitar que el objeto clave sea imposible de encontrar.

### 看书 · kàn shū — leer un libro; leer

ID: `v-看书` · Riesgo: `medium` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-15e4bff6cc11c3ee` · Perfil: `action`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Escena fotográfica de una acción legible: personas ficticias, postura y manos completas, instante representativo y solo el objeto necesario. Gesto ligeramente enfatizado para enseñar, no mímica absurda ni caricatura. El sujeto y sus pocos accesorios forman un único recorte transparente.

ESCENA ESPECÍFICA: Una persona adulta lee tranquilamente un libro físico abierto que sostiene con ambas manos; mirada fija en las páginas sin letras legibles.

CONTROL SEMÁNTICO: No escritura, tableta ni libro cerrado; aceptar que el mismo gesto admite varias expresiones de lectura.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No escritura, tableta ni libro cerrado; aceptar que el mismo gesto admite varias expresiones de lectura.

### 看电影 · kàn diànyǐng — ver una película

ID: `v-看电影` · Riesgo: `medium` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-c4eeae561e5cb4dc` · Perfil: `action`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Escena fotográfica de una acción legible: personas ficticias, postura y manos completas, instante representativo y solo el objeto necesario. Gesto ligeramente enfatizado para enseñar, no mímica absurda ni caricatura. El sujeto y sus pocos accesorios forman un único recorte transparente.

ESCENA ESPECÍFICA: Dos adultos sentados en butacas sencillas miran atentamente una pantalla mínima recortada con una escena cinematográfica genérica sin personajes reconocibles ni texto.

CONTROL SEMÁNTICO: No fotogramas de películas reales, marcas, televisión doméstica protagonista ni sala de cine como fondo completo.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No fotogramas de películas reales, marcas, televisión doméstica protagonista ni sala de cine como fondo completo.

### 唱歌 · chàng gē — cantar

ID: `v-唱歌` · Riesgo: `medium` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-6c21343599123dbb` · Perfil: `action`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Escena fotográfica de una acción legible: personas ficticias, postura y manos completas, instante representativo y solo el objeto necesario. Gesto ligeramente enfatizado para enseñar, no mímica absurda ni caricatura. El sujeto y sus pocos accesorios forman un único recorte transparente.

ESCENA ESPECÍFICA: Una persona adulta canta con un micrófono sencillo, boca y respiración naturales, una mano acompaña expresivamente la melodía; postura relajada y emotiva.

CONTROL SEMÁNTICO: No escenario, público, notas musicales dibujadas ni famoso reconocible; distinguir de hablar con micrófono mediante la actuación.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No escenario, público, notas musicales dibujadas ni famoso reconocible; distinguir de hablar con micrófono mediante la actuación.

### 说 · shuō — hablar; decir

ID: `v-说` · Riesgo: `medium` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-52236d45c1e4ca5b` · Perfil: `action`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Escena fotográfica de una acción legible: personas ficticias, postura y manos completas, instante representativo y solo el objeto necesario. Gesto ligeramente enfatizado para enseñar, no mímica absurda ni caricatura. El sujeto y sus pocos accesorios forman un único recorte transparente.

ESCENA ESPECÍFICA: Una persona adulta habla con naturalidad a otra que escucha, boca articulando y manos en gesto explicativo suave; ambos en un recorte conjunto.

CONTROL SEMÁNTICO: No micrófono de cantante, signo de interrogación ni burbuja con letras.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No micrófono de cantante, signo de interrogación ni burbuja con letras.

### 吃饭 · chī fàn — comer; tomar una comida

ID: `v-吃饭` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-19d8ddac39ba8be2` · Perfil: `action`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Escena fotográfica de una acción legible: personas ficticias, postura y manos completas, instante representativo y solo el objeto necesario. Gesto ligeramente enfatizado para enseñar, no mímica absurda ni caricatura. El sujeto y sus pocos accesorios forman un único recorte transparente.

ESCENA ESPECÍFICA: Una persona adulta toma una comida sencilla con cuenco de arroz, plato pequeño y palillos; se ve el gesto de llevar comida a la boca.

CONTROL SEMÁNTICO: La misma imagen puede evocar 吃; usar la expresión en contexto, no exigir una variante única.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** La misma imagen puede evocar 吃; usar la expresión en contexto, no exigir una variante única.

## concept_scene

### 你 · nǐ — tú

ID: `v-你` · Riesgo: `medium` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-05d1eff065d8a690` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Dos adultos ficticios conversan. El hablante, reconocible por la boca articulando, indica con mano abierta a un único interlocutor frente a él; el destinatario escucha y se mira con el hablante.

CONTROL SEMÁNTICO: No mano apuntando fuera de escena ni destinatario señalándose; diferenciar de yo y de él sin añadir texto.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No mano apuntando fuera de escena ni destinatario señalándose; diferenciar de yo y de él sin añadir texto.

### 我 · wǒ — yo; mí

ID: `v-我` · Riesgo: `medium` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-fa324db6ad0ae0e4` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Dos adultos ficticios conversan. La persona que está hablando se señala claramente el centro de su propio pecho con un dedo, mientras su interlocutor escucha con la boca cerrada. Miradas y torso orientados entre sí.

CONTROL SEMÁNTICO: Debe verse quién habla; no espejo, mano del espectador ni dedo apuntando a la otra persona. El gesto no debe parecer dolor de pecho.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Debe verse quién habla; no espejo, mano del espectador ni dedo apuntando a la otra persona. El gesto no debe parecer dolor de pecho.

### 认识 · rènshi — conocer

ID: `v-认识` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-187ec85b8502bf56` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Dos adultos se encuentran y muestran reconocimiento mutuo, sonrisas naturales y un saludo cercano; uno reconoce al otro antes del contacto de manos.

CONTROL SEMÁNTICO: Una sonrisa no prueba conocimiento previo; usar la escena solo con el enunciado correspondiente.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Una sonrisa no prueba conocimiento previo; usar la escena solo con el enunciado correspondiente.

### 高兴 · gāoxìng — contento

ID: `v-高兴` · Riesgo: `medium` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-49dcc9e2566dec76` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Una persona adulta expresa alegría franca tras una buena noticia: sonrisa espontánea, ojos naturales y manos ligeramente elevadas en satisfacción, sin objeto premio.

CONTROL SEMÁNTICO: No confundir con saludo cortés, risa exagerada o satisfacción por comida.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No confundir con saludo cortés, risa exagerada o satisfacción por comida.

### 谢谢 · xièxie — agradecer; gracias

ID: `v-谢谢` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-1bd9335aa2082ae1` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Una persona recibe de otra un objeto cotidiano que se le había caído y responde con expresión sincera de agradecimiento, mano sobre el pecho y contacto visual.

CONTROL SEMÁNTICO: No reverencia estereotipada ni gesto de pedir; la secuencia ayuda pero la palabra la aporta el contexto.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No reverencia estereotipada ni gesto de pedir; la secuencia ayuda pero la palabra la aporta el contexto.

### 忙 · máng — ocupado/a

ID: `v-忙` · Riesgo: `medium` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-cec5d1f1c45f8e19` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Una persona adulta atiende dos tareas visibles en un pequeño escritorio: sostiene un teléfono sin pantalla visible mientras organiza varios documentos y un cuaderno abierto.

CONTROL SEMÁNTICO: Mostrar ocupación, no sufrimiento ni agotamiento; no letras o números en los papeles.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Mostrar ocupación, no sufrimiento ni agotamiento; no letras o números en los papeles.

### 他 · tā — él

ID: `v-他` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-02442c3b827e4471` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Tres adultos ficticios forman una conversación: un hablante se dirige a su interlocutor y señala a un tercer hombre situado separado de ambos, que no está participando en el turno.

CONTROL SEMÁNTICO: La tercera persona no es el destinatario; no retrato aislado ni inferencias de género mediante ropa estereotipada.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** La tercera persona no es el destinatario; no retrato aislado ni inferencias de género mediante ropa estereotipada.

### 困 · kùn — soñoliento/a

ID: `v-困` · Riesgo: `medium` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-f3c9a7feada3b3f7` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Una persona adulta bosteza suavemente, con párpados pesados y mano cerca de la boca, sentada junto a una almohada sencilla como indicio secundario.

CONTROL SEMÁNTICO: No equiparar sueño con dolor, enfermedad o cansancio tras ejercicio; no cuerpo dormido como única pista.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No equiparar sueño con dolor, enfermedad o cansancio tras ejercicio; no cuerpo dormido como única pista.

### 渴 · kě — sediento; tener sed

ID: `v-渴` · Riesgo: `medium` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-b1ec34a651ac6a9d` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Una persona adulta mira con deseo un vaso de agua aún sin beberlo, labios ligeramente secos y mano extendida hacia el vaso; gesto de necesidad claro y moderado.

CONTROL SEMÁNTICO: No vaso ya en los labios, que sería beber; no deshidratación extrema ni síntomas médicos dramáticos.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No vaso ya en los labios, que sería beber; no deshidratación extrema ni síntomas médicos dramáticos.

### 饿 · è — hambriento; tener hambre

ID: `v-饿` · Riesgo: `medium` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-b158fe3b5d099561` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Una persona adulta mira un plato sencillo aún sin comer y apoya suavemente una mano en el abdomen, con expectativa natural de comida.

CONTROL SEMÁNTICO: No dolor abdominal ni persona ya comiendo; no exageración corporal o estigmatización.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No dolor abdominal ni persona ya comiendo; no exageración corporal o estigmatización.

### 累 · lèi — cansado/a

ID: `v-累` · Riesgo: `medium` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-641c21f7c765bc9a` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Una persona adulta descansa después de esfuerzo físico leve, hombros relajados y manos apoyadas en las rodillas, con toalla pequeña al lado y respiración recuperándose.

CONTROL SEMÁNTICO: No bostezo ni necesidad de dormir como rasgo principal; distinguir del estado ocupado.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No bostezo ni necesidad de dormir como rasgo principal; distinguir del estado ocupado.

### 她 · tā — ella

ID: `v-她` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-f02c88388510b159` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Tres adultos ficticios forman una conversación: un hablante se dirige a su interlocutor y señala a una tercera mujer situada separada de ambos, que no está participando en el turno.

CONTROL SEMÁNTICO: La referencia debe quedar clara en la frase; no retrato aislado ni gestos ambiguos hacia quien escucha.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** La referencia debe quedar clara en la frase; no retrato aislado ni gestos ambiguos hacia quien escucha.

### 老师 · lǎoshī — profesor/a

ID: `v-老师` · Riesgo: `medium` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-94fb43d0e011e391` · Perfil: `profession`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Persona ficticia en una tarea profesional, con ropa apropiada, instrumentos y gesto funcional coherentes. La indumentaria acompaña la acción, no es prueba suficiente del cargo. Evita disfraces, logos, insignias inventadas y asignar todos los cargos de autoridad a un mismo género.

ESCENA ESPECÍFICA: Una docente adulta ficticia con ropa profesional cotidiana explica un libro abierto sin letras a dos estudiantes que la miran, mano señalando el punto de estudio.

CONTROL SEMÁNTICO: No bata académica o pizarra llena de escritura falsa; ropa sola no demuestra ser profesora.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No bata académica o pizarra llena de escritura falsa; ropa sola no demuestra ser profesora.

### 早上 · zǎoshang — mañana

ID: `v-早上` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-698c63bec38f762b` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Una persona inicia el día estirándose junto a una cama reducida a almohada y manta, con taza sencilla cerca; luz natural suave sobre los sujetos.

CONTROL SEMÁNTICO: La iluminación por sí sola no fija la hora; usar contexto temporal, sin sol o cielo opaco detrás.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** La iluminación por sí sola no fija la hora; usar contexto temporal, sin sol o cielo opaco detrás.

### 你们 · nǐmen — vosotros; ustedes

ID: `v-你们` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-cb190567235d838d` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Un hablante adulto se dirige a dos interlocutores claramente separados de él, con un gesto amplio hacia ambos; los dos receptores miran al hablante.

CONTROL SEMÁNTICO: No incluir al hablante en el grupo señalado ni representar una multitud indistinta.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No incluir al hablante en el grupo señalado ni representar una multitud indistinta.

### 这 · zhè — esto

ID: `v-这` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-435bf0cfdfb5721b` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Una hablante adulta sostiene cerca de sí una taza concreta y la señala mientras otra persona la mira; otro objeto secundario está más lejos sin competir.

CONTROL SEMÁNTICO: Proximidad respecto del hablante, no tamaño; no usar la escena para exigir esta forma frente a 这是.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Proximidad respecto del hablante, no tamaño; no usar la escena para exigir esta forma frente a 这是.

### 朋友 · péngyou — amigo/a

ID: `v-朋友` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-c140e7c63c55f640` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Dos amigos adultos ficticios comparten una conversación cercana y distendida sentados en dos sillas sencillas, con gestos recíprocos de confianza.

CONTROL SEMÁNTICO: No contacto romántico ni aspecto de familiares; la foto no certifica amistad por sí sola.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No contacto romántico ni aspecto de familiares; la foto no certifica amistad por sí sola.

### 您 · nín — usted

ID: `v-您` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-b5e50f59a5e924a1` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Dos adultos ficticios mantienen una conversación cortés; uno solicita la atención del otro con postura abierta, distancia respetuosa y gesto amable.

CONTROL SEMÁNTICO: La cortesía no se deduce de edad, traje o reverencia; el tratamiento respetuoso lo fija la frase.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** La cortesía no se deduce de edad, traje o reverencia; el tratamiento respetuoso lo fija la frase.

### 国 · guó — país

ID: `v-国` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-846ff8761096b6c0` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Un globo terráqueo físico sin rótulos junto a varios pequeños contornos geográficos como elementos separados que se validarán antes de componer.

CONTROL SEMÁNTICO: El globo no equivale al sustantivo país por sí solo; no fronteras inventadas ni bandera única como definición.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** El globo no equivale al sustantivo país por sí solo; no fronteras inventadas ni bandera única como definición.

### 再见 · zàijiàn — adiós

ID: `v-再见` · Riesgo: `medium` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-c64af83f822e52ac` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Dos adultos se despiden: uno se aleja con el torso hacia la salida y gira la cabeza para levantar la mano a quien queda, que devuelve el gesto.

CONTROL SEMÁNTICO: El movimiento es de separación, no de encuentro; sin puerta o ciudad de fondo.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** El movimiento es de separación, no de encuentro; sin puerta o ciudad de fondo.

### 北京 · Běijīng — Beijing

ID: `v-北京` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-688aea226b9b8905` · Perfil: `place`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Recorte fotográfico arquitectónico reconocible del referente indicado. Mantén su estructura real y solo una base local mínima que lo sostenga; sin cielo, horizonte, fondo urbano panorámico ni decoración turística adicional.

ESCENA ESPECÍFICA: El Templo del Cielo de Pekín, con el Salón de Oración por las Buenas Cosechas y su techo circular azul característico, en recorte arquitectónico completo.

CONTROL SEMÁNTICO: No confundir una ciudad con todo el país ni añadir banderas que oculten la diferencia; validar referencia arquitectónica.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No confundir una ciudad con todo el país ni añadir banderas que oculten la diferencia; validar referencia arquitectónica.

**Referencias auténticas pendientes antes de generar:** landmark.

### 美国 · Měiguó — Estados Unidos

ID: `v-美国` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-6269bf75e969634a` · Perfil: `country`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta de geografía fotorrealista: recorte arquitectónico o natural fiel del lugar indicado y una bandera nacional en un asta discreta al lado, sin colocarla sobre el monumento. El terreno indispensable puede ser una pequeña base recortada; todo el exterior es alfa transparente. La bandera necesita referencia auténtica validada, no símbolos inventados; si el modelo no preserva escudo, proporciones u orientación, incorporar después la bandera auténtica con composición controlada. No sustituir un país por la apariencia de sus habitantes.

ESCENA ESPECÍFICA: La Estatua de la Libertad completa sobre su pedestal, sin ciudad detrás, acompañada a un lado por una bandera oficial de Estados Unidos en asta discreta.

CONTROL SEMÁNTICO: Verificar antorcha, corona y referencia auténtica de bandera con estrellas y franjas correctas; no añadir personas como símbolo de nacionalidad.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Verificar antorcha, corona y referencia auténtica de bandera con estrellas y franjas correctas; no añadir personas como símbolo de nacionalidad.

**Referencias auténticas pendientes antes de generar:** flag, landmark.

### 好吃 · hǎochī — delicioso; riquísimo; sabroso

ID: `v-好吃` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-a35843aaa0af94ba` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Una persona prueba un pequeño bocado de comida y muestra satisfacción natural por su sabor, ojos relajados y sonrisa leve tras probarlo.

CONTROL SEMÁNTICO: No una comida sola ni gesto de hambre; el juicio de sabor requiere contexto.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No una comida sola ni gesto de hambre; el juicio de sabor requiere contexto.

### 爸爸 · bàba — papá

ID: `v-爸爸` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-952b6ce845536758` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Un padre ficticio comparte con su hijo una actividad cotidiana cercana, agachándose a su altura para ayudarle a cerrar una mochila; ambos miran el mismo gesto.

CONTROL SEMÁNTICO: La relación es una escena editorial, no deducida de edad o ropa; necesita marco familiar y no retrato aislado.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** La relación es una escena editorial, no deducida de edad o ropa; necesita marco familiar y no retrato aislado.

### 喜欢 · xǐhuan — gustar

ID: `v-喜欢` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-6ef3cef98f0011df` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Una persona elige con alegría moderada un libro entre dos actividades posibles, acercándolo hacia sí; el otro objeto permanece secundario.

CONTROL SEMÁNTICO: Preferencia no equivale a amor, necesidad o compra; no corazón dibujado como respuesta.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Preferencia no equivale a amor, necesidad o compra; no corazón dibujado como respuesta.

### 妈妈 · māma — mamá; madre

ID: `v-妈妈` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-35f764d7d6a4668d` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Una madre ficticia ayuda a su hija a preparar una mochila para salir, a la misma altura y con interacción afectuosa natural.

CONTROL SEMÁNTICO: No limitar maternidad a cocina ni inferir parentesco solo por apariencia; usar el contexto familiar.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No limitar maternidad a cocina ni inferir parentesco solo por apariencia; usar el contexto familiar.

### 大 · dà — grande

ID: `v-大` · Riesgo: `medium` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-25f25c5768fcf257` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Dos objetos cotidianos del mismo tipo, por ejemplo dos cuencos iguales salvo por tamaño; una mano indica claramente el mayor y ambos quedan completos.

CONTROL SEMÁNTICO: La comparación debe ser entre referentes equivalentes; no usar un elefante frente a un ratón ni confundir cantidad.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** La comparación debe ser entre referentes equivalentes; no usar un elefante frente a un ratón ni confundir cantidad.

### 小 · xiǎo — pequeño

ID: `v-小` · Riesgo: `medium` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-25cf7df6e182c8ad` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Dos objetos cotidianos del mismo tipo, por ejemplo dos cuencos iguales salvo por tamaño; una mano indica claramente el menor y ambos quedan completos.

CONTROL SEMÁNTICO: No representar juventud o poca cantidad en lugar de tamaño relativo.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No representar juventud o poca cantidad en lugar de tamaño relativo.

### 那 · nà — pronombre demostrativo; aquello

ID: `v-那` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-d116c2a41fce77ba` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Una hablante adulta señala un objeto situado claramente más lejos de ella que una taza próxima; un interlocutor sigue su dirección de mirada.

CONTROL SEMÁNTICO: No confundir distancia con tamaño; mantener ambos referentes en el recorte sin pintar una habitación.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No confundir distancia con tamaño; mantener ambos referentes en el recorte sin pintar una habitación.

### 上海 · Shànghǎi — Shanghái

ID: `v-上海` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-64b253e14b5309d2` · Perfil: `place`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Recorte fotográfico arquitectónico reconocible del referente indicado. Mantén su estructura real y solo una base local mínima que lo sostenga; sin cielo, horizonte, fondo urbano panorámico ni decoración turística adicional.

ESCENA ESPECÍFICA: La Torre de la Perla Oriental de Shanghái con sus esferas y estructura características, recortada completa y sin edificios de fondo.

CONTROL SEMÁNTICO: No inventar una torre genérica; solo apoyo para la ciudad y no pregunta de geografía por silueta sin enseñanza previa.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No inventar una torre genérica; solo apoyo para la ciudad y no pregunta de geografía por silueta sin enseñanza previa.

**Referencias auténticas pendientes antes de generar:** landmark.

### 中国 · Zhōngguó — China

ID: `v-中国` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-010361e22cc969bd` · Perfil: `country`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta de geografía fotorrealista: recorte arquitectónico o natural fiel del lugar indicado y una bandera nacional en un asta discreta al lado, sin colocarla sobre el monumento. El terreno indispensable puede ser una pequeña base recortada; todo el exterior es alfa transparente. La bandera necesita referencia auténtica validada, no símbolos inventados; si el modelo no preserva escudo, proporciones u orientación, incorporar después la bandera auténtica con composición controlada. No sustituir un país por la apariencia de sus habitantes.

ESCENA ESPECÍFICA: Un tramo reconocible de la Gran Muralla China con una torre de vigilancia y sección escalonada de muralla sobre una pequeña base de relieve, junto a la bandera oficial de China.

CONTROL SEMÁNTICO: Verificar la arquitectura y las cinco estrellas de la bandera; sin cielo, montañas extensas ni pagodas ajenas al referente.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Verificar la arquitectura y las cinco estrellas de la bandera; sin cielo, montañas extensas ni pagodas ajenas al referente.

**Referencias auténticas pendientes antes de generar:** flag, landmark.

### 西班牙 · Xībānyá — España

ID: `v-西班牙` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-3d920c5f97b89dce` · Perfil: `country`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta de geografía fotorrealista: recorte arquitectónico o natural fiel del lugar indicado y una bandera nacional en un asta discreta al lado, sin colocarla sobre el monumento. El terreno indispensable puede ser una pequeña base recortada; todo el exterior es alfa transparente. La bandera necesita referencia auténtica validada, no símbolos inventados; si el modelo no preserva escudo, proporciones u orientación, incorporar después la bandera auténtica con composición controlada. No sustituir un país por la apariencia de sus habitantes.

ESCENA ESPECÍFICA: La basílica de la Sagrada Familia de Barcelona en recorte arquitectónico fiel, con sus torres características, junto a la bandera nacional oficial de España.

CONTROL SEMÁNTICO: Usar referencia actual del edificio; no inventar torres y no confundir la bandera nacional con una autonómica. Escudo solo desde referencia auténtica.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Usar referencia actual del edificio; no inventar torres y no confundir la bandera nacional con una autonómica. Escudo solo desde referencia auténtica.

**Referencias auténticas pendientes antes de generar:** flag, landmark.

### 法国 · Fǎguó — Francia

ID: `v-法国` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-3090cd050aa78b64` · Perfil: `country`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta de geografía fotorrealista: recorte arquitectónico o natural fiel del lugar indicado y una bandera nacional en un asta discreta al lado, sin colocarla sobre el monumento. El terreno indispensable puede ser una pequeña base recortada; todo el exterior es alfa transparente. La bandera necesita referencia auténtica validada, no símbolos inventados; si el modelo no preserva escudo, proporciones u orientación, incorporar después la bandera auténtica con composición controlada. No sustituir un país por la apariencia de sus habitantes.

ESCENA ESPECÍFICA: La Torre Eiffel completa con estructura metálica fiel y base visible, acompañada por la bandera oficial francesa en asta separada.

CONTROL SEMÁNTICO: No sustituir la torre por un dibujo genérico; comprobar orden azul, blanco y rojo desde el asta.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No sustituir la torre por un dibujo genérico; comprobar orden azul, blanco y rojo desde el asta.

**Referencias auténticas pendientes antes de generar:** flag, landmark.

### 德国 · Déguó — Alemania

ID: `v-德国` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-1ce88a8cb89e7ed9` · Perfil: `country`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta de geografía fotorrealista: recorte arquitectónico o natural fiel del lugar indicado y una bandera nacional en un asta discreta al lado, sin colocarla sobre el monumento. El terreno indispensable puede ser una pequeña base recortada; todo el exterior es alfa transparente. La bandera necesita referencia auténtica validada, no símbolos inventados; si el modelo no preserva escudo, proporciones u orientación, incorporar después la bandera auténtica con composición controlada. No sustituir un país por la apariencia de sus habitantes.

ESCENA ESPECÍFICA: La Puerta de Brandeburgo con sus columnas y cuadriga reconocibles en recorte arquitectónico realista, junto a la bandera nacional alemana.

CONTROL SEMÁNTICO: Verificar forma del monumento y franjas horizontales negra, roja y dorada; no añadir emblemas inventados.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Verificar forma del monumento y franjas horizontales negra, roja y dorada; no añadir emblemas inventados.

**Referencias auténticas pendientes antes de generar:** flag, landmark.

### 加拿大 · Jiānádà — Canadá

ID: `v-加拿大` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-186b22c70bf19b69` · Perfil: `country`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta de geografía fotorrealista: recorte arquitectónico o natural fiel del lugar indicado y una bandera nacional en un asta discreta al lado, sin colocarla sobre el monumento. El terreno indispensable puede ser una pequeña base recortada; todo el exterior es alfa transparente. La bandera necesita referencia auténtica validada, no símbolos inventados; si el modelo no preserva escudo, proporciones u orientación, incorporar después la bandera auténtica con composición controlada. No sustituir un país por la apariencia de sus habitantes.

ESCENA ESPECÍFICA: La torre CN de Toronto, completa y fiel, sobre una base mínima, junto a la bandera oficial de Canadá.

CONTROL SEMÁNTICO: Validar silueta y hoja de arce de la bandera con referencia; no añadir traje, animal o rostro como definición de canadiense.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Validar silueta y hoja de arce de la bandera con referencia; no añadir traje, animal o rostro como definición de canadiense.

**Referencias auténticas pendientes antes de generar:** flag, landmark.

### 英国 · Yīngguó — Reino Unido; Inglaterra

ID: `v-英国` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-c4ee2860c21dfe75` · Perfil: `country`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta de geografía fotorrealista: recorte arquitectónico o natural fiel del lugar indicado y una bandera nacional en un asta discreta al lado, sin colocarla sobre el monumento. El terreno indispensable puede ser una pequeña base recortada; todo el exterior es alfa transparente. La bandera necesita referencia auténtica validada, no símbolos inventados; si el modelo no preserva escudo, proporciones u orientación, incorporar después la bandera auténtica con composición controlada. No sustituir un país por la apariencia de sus habitantes.

ESCENA ESPECÍFICA: La torre Elizabeth del Parlamento de Londres, reconocible por su arquitectura y reloj, junto a la bandera Union Flag del Reino Unido.

CONTROL SEMÁNTICO: No llamar Inglaterra al conjunto por la imagen ni usar la cruz inglesa en lugar de la Union Flag; números del reloj solo mediante referencia/composición fiable.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No llamar Inglaterra al conjunto por la imagen ni usar la cruz inglesa en lugar de la Union Flag; números del reloj solo mediante referencia/composición fiable.

**Referencias auténticas pendientes antes de generar:** flag, landmark.

### 澳大利亚 · Àodàlìyà — Australia

ID: `v-澳大利亚` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-4004de7a09f7b161` · Perfil: `country`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta de geografía fotorrealista: recorte arquitectónico o natural fiel del lugar indicado y una bandera nacional en un asta discreta al lado, sin colocarla sobre el monumento. El terreno indispensable puede ser una pequeña base recortada; todo el exterior es alfa transparente. La bandera necesita referencia auténtica validada, no símbolos inventados; si el modelo no preserva escudo, proporciones u orientación, incorporar después la bandera auténtica con composición controlada. No sustituir un país por la apariencia de sus habitantes.

ESCENA ESPECÍFICA: La Ópera de Sídney con sus cubiertas de conchas blancas sobre una base mínima, acompañada por la bandera nacional australiana.

CONTROL SEMÁNTICO: Verificar estrellas y cantón de la bandera; no sustituir el país por un canguro ni añadir puerto de fondo.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Verificar estrellas y cantón de la bandera; no sustituir el país por un canguro ni añadir puerto de fondo.

**Referencias auténticas pendientes antes de generar:** flag, landmark.

### 俄罗斯 · Éluósī — Rusia

ID: `v-俄罗斯` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-ec8a24e94702648b` · Perfil: `country`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta de geografía fotorrealista: recorte arquitectónico o natural fiel del lugar indicado y una bandera nacional en un asta discreta al lado, sin colocarla sobre el monumento. El terreno indispensable puede ser una pequeña base recortada; todo el exterior es alfa transparente. La bandera necesita referencia auténtica validada, no símbolos inventados; si el modelo no preserva escudo, proporciones u orientación, incorporar después la bandera auténtica con composición controlada. No sustituir un país por la apariencia de sus habitantes.

ESCENA ESPECÍFICA: La catedral de San Basilio de Moscú con sus cúpulas multicolores fieles al edificio, junto a la bandera nacional rusa.

CONTROL SEMÁNTICO: No mezclarla con edificios inventados ni símbolos soviéticos; verificar franjas blanca, azul y roja.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No mezclarla con edificios inventados ni símbolos soviéticos; verificar franjas blanca, azul y roja.

**Referencias auténticas pendientes antes de generar:** flag, landmark.

### 日本 · Rìběn — Japón

ID: `v-日本` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-f357d1380d13b57a` · Perfil: `country`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta de geografía fotorrealista: recorte arquitectónico o natural fiel del lugar indicado y una bandera nacional en un asta discreta al lado, sin colocarla sobre el monumento. El terreno indispensable puede ser una pequeña base recortada; todo el exterior es alfa transparente. La bandera necesita referencia auténtica validada, no símbolos inventados; si el modelo no preserva escudo, proporciones u orientación, incorporar después la bandera auténtica con composición controlada. No sustituir un país por la apariencia de sus habitantes.

ESCENA ESPECÍFICA: El monte Fuji como forma natural recortada con cumbre nevada y laderas limitadas a su silueta, junto a la bandera nacional japonesa.

CONTROL SEMÁNTICO: No fondo de cielo ni paisaje extendido; verificar círculo rojo y no usar bandera de sol naciente militar.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No fondo de cielo ni paisaje extendido; verificar círculo rojo y no usar bandera de sol naciente militar.

**Referencias auténticas pendientes antes de generar:** flag, landmark.

### 韩国 · Hánguó — Corea del Sur

ID: `v-韩国` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-50416a900c031469` · Perfil: `country`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta de geografía fotorrealista: recorte arquitectónico o natural fiel del lugar indicado y una bandera nacional en un asta discreta al lado, sin colocarla sobre el monumento. El terreno indispensable puede ser una pequeña base recortada; todo el exterior es alfa transparente. La bandera necesita referencia auténtica validada, no símbolos inventados; si el modelo no preserva escudo, proporciones u orientación, incorporar después la bandera auténtica con composición controlada. No sustituir un país por la apariencia de sus habitantes.

ESCENA ESPECÍFICA: El pabellón Gyeonghoeru del palacio Gyeongbokgung de Seúl, con techo y pilares fieles, en recorte arquitectónico junto a la bandera oficial de Corea del Sur.

CONTROL SEMÁNTICO: Referencia obligatoria del taegeuk y los cuatro trigramas; no aproximarlos ni cambiar de país. Sin lago o ciudad de fondo.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Referencia obligatoria del taegeuk y los cuatro trigramas; no aproximarlos ni cambiar de país. Sin lago o ciudad de fondo.

**Referencias auténticas pendientes antes de generar:** flag, landmark.

### 泰国 · Tàiguó — Tailandia

ID: `v-泰国` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-50ae73c5e3c80ac8` · Perfil: `country`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta de geografía fotorrealista: recorte arquitectónico o natural fiel del lugar indicado y una bandera nacional en un asta discreta al lado, sin colocarla sobre el monumento. El terreno indispensable puede ser una pequeña base recortada; todo el exterior es alfa transparente. La bandera necesita referencia auténtica validada, no símbolos inventados; si el modelo no preserva escudo, proporciones u orientación, incorporar después la bandera auténtica con composición controlada. No sustituir un país por la apariencia de sus habitantes.

ESCENA ESPECÍFICA: La torre central del templo Wat Arun de Bangkok, con su silueta y detalle realistas, acompañada por la bandera nacional tailandesa.

CONTROL SEMÁNTICO: Verificar bandas roja, blanca, azul central ancha, blanca y roja; no mezclar arquitectura de otros templos.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Verificar bandas roja, blanca, azul central ancha, blanca y roja; no mezclar arquitectura de otros templos.

**Referencias auténticas pendientes antes de generar:** flag, landmark.

### 印度 · Yìndù — India

ID: `v-印度` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-6494eb0e176d35ce` · Perfil: `country`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta de geografía fotorrealista: recorte arquitectónico o natural fiel del lugar indicado y una bandera nacional en un asta discreta al lado, sin colocarla sobre el monumento. El terreno indispensable puede ser una pequeña base recortada; todo el exterior es alfa transparente. La bandera necesita referencia auténtica validada, no símbolos inventados; si el modelo no preserva escudo, proporciones u orientación, incorporar después la bandera auténtica con composición controlada. No sustituir un país por la apariencia de sus habitantes.

ESCENA ESPECÍFICA: El Taj Mahal con su cúpula central y minaretes, recorte de mármol fiel al monumento, junto a la bandera oficial de India.

CONTROL SEMÁNTICO: Validar rueda Ashoka y franjas de bandera; no inventar arquitectura ni representar una religión como identidad de toda la población.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Validar rueda Ashoka y franjas de bandera; no inventar arquitectura ni representar una religión como identidad de toda la población.

**Referencias auténticas pendientes antes de generar:** flag, landmark.

### 埃及 · Āijí — Egipto

ID: `v-埃及` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-ea3cf45d99fd425d` · Perfil: `country`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta de geografía fotorrealista: recorte arquitectónico o natural fiel del lugar indicado y una bandera nacional en un asta discreta al lado, sin colocarla sobre el monumento. El terreno indispensable puede ser una pequeña base recortada; todo el exterior es alfa transparente. La bandera necesita referencia auténtica validada, no símbolos inventados; si el modelo no preserva escudo, proporciones u orientación, incorporar después la bandera auténtica con composición controlada. No sustituir un país por la apariencia de sus habitantes.

ESCENA ESPECÍFICA: Las pirámides principales de Guiza en un conjunto compacto sobre una pequeña base de arena recortada, junto a la bandera nacional egipcia.

CONTROL SEMÁNTICO: Sin desierto extendido ni cielo; verificar águila y bandera auténticas, no usar símbolos ficticios como escudo.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Sin desierto extendido ni cielo; verificar águila y bandera auténticas, no usar símbolos ficticios como escudo.

**Referencias auténticas pendientes antes de generar:** flag, landmark.

### 同学 · tóngxué — compañero de clase; compañero de escuela

ID: `v-同学` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-9d1a0bec6fd1b3de` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Dos estudiantes adultos ficticios sentados juntos comparan un ejercicio en cuadernos y escuchan al mismo docente visible de forma secundaria.

CONTROL SEMÁNTICO: Ser amigos o llevar mochila no prueba que sean compañeros; la relación depende de clase compartida.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Ser amigos o llevar mochila no prueba que sean compañeros; la relación depende de clase compartida.

### 家 · jiā — familia; casa

ID: `v-家` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-3556f7322aa3e263` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Un pequeño grupo familiar ficticio junto a una maqueta sencilla de su casa, en interacción cotidiana afectuosa, con el hogar y la relación familiar equilibrados.

CONTROL SEMÁNTICO: La palabra tiene acepciones de casa y familia; escoger la frase compatible, sin suponer que toda casa implica ese parentesco.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** La palabra tiene acepciones de casa y familia; escoger la frase compatible, sin suponer que toda casa implica ese parentesco.

### 医生 · yīshēng — doctor/a

ID: `v-医生` · Riesgo: `medium` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-f812a5e524031853` · Perfil: `profession`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Persona ficticia en una tarea profesional, con ropa apropiada, instrumentos y gesto funcional coherentes. La indumentaria acompaña la acción, no es prueba suficiente del cargo. Evita disfraces, logos, insignias inventadas y asignar todos los cargos de autoridad a un mismo género.

ESCENA ESPECÍFICA: Una médica adulta ficticia con bata clara sobre ropa clínica y estetoscopio examina respetuosamente la respiración de un paciente adulto vestido, ambos en recorte compacto.

CONTROL SEMÁNTICO: No instrumental invasivo, logotipo de cruz o bata sin tarea; comprobar anatomía y uso del estetoscopio.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No instrumental invasivo, logotipo de cruz o bata sin tarea; comprobar anatomía y uso del estetoscopio.

### 弟弟 · dìdi — hermano menor

ID: `v-弟弟` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-001d586e62afaf01` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Dos hermanos ficticios comparten un libro: el menor está claramente referido por el mayor que lo presenta a un interlocutor, con diferencia de edad relativa moderada.

CONTROL SEMÁNTICO: No pequeño igual a hermano menor sin contexto; no convertir a un niño solo en parentesco.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No pequeño igual a hermano menor sin contexto; no convertir a un niño solo en parentesco.

### 哥哥 · gēge — hermano mayor

ID: `v-哥哥` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-fdac6dadfd422667` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Dos hermanos ficticios comparten una actividad: el menor presenta al mayor mediante un gesto claro, ambos con vínculo familiar contextual.

CONTROL SEMÁNTICO: No confundir edad con estatura ni usar adulto solo; parentesco explícito en la frase.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No confundir edad con estatura ni usar adulto solo; parentesco explícito en la frase.

### 姐姐 · jiějie — hermana mayor

ID: `v-姐姐` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-f622a4a40def8a16` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Dos hermanas ficticias comparten una actividad; la menor señala con afecto a su hermana mayor al presentarla a otra persona.

CONTROL SEMÁNTICO: No usar belleza, ropa o estatura como prueba de hermana mayor; contexto necesario.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No usar belleza, ropa o estatura como prueba de hermana mayor; contexto necesario.

### 谁 · shéi — quién

ID: `v-谁` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-9a512a3e0cc3044f` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Una persona pregunta por otra entre dos adultos presentes, gesto interrogativo dirigido a la identidad de una persona y no a un objeto.

CONTROL SEMÁNTICO: No signo de pregunta, rostro oculto o sospecha criminal; solo apoyo de una pregunta documentada.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No signo de pregunta, rostro oculto o sospecha criminal; solo apoyo de una pregunta documentada.

### 妹妹 · mèimei — hermana menor

ID: `v-妹妹` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-533561b43f501cf7` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Dos hermanas ficticias comparten una actividad; la mayor presenta a la menor mediante un gesto amable y dirección clara de mirada.

CONTROL SEMÁNTICO: No retrato aislado ni considerar cualquier niña hermana menor.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No retrato aislado ni considerar cualquier niña hermana menor.

### 漂亮 · piàoliang — hermoso; bonito

ID: `v-漂亮` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-fe3e2b330d811515` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Una persona contempla con admiración una fotografía impresa de un jardín natural armonioso; el gesto expresa valoración estética sin centrarse en un cuerpo.

CONTROL SEMÁNTICO: No imponer un tipo de rostro como belleza ni convertir una flor aislada en la definición de bonito.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No imponer un tipo de rostro como belleza ni convertir una flor aislada en la definición de bonito.

### 女儿 · nǚ’ér — hija

ID: `v-女儿` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-7c16b15701576cbd` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Una madre o un padre ficticio presenta a su hija a otra persona, con mano abierta dirigida hacia ella y relación afectuosa visible.

CONTROL SEMÁNTICO: La niña sola no significa hija; no atribuir parentesco a personas reales.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** La niña sola no significa hija; no atribuir parentesco a personas reales.

### 女 · nǚ — femenino

ID: `v-女` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-735bcf58a876095a` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Una mujer adulta ficticia en actividad cotidiana neutra, postura natural y ropa sencilla, sin atributos profesionales o familiares.

CONTROL SEMÁNTICO: No atribuir género por estereotipos de color o vestido; el recurso acompaña el uso lingüístico, no evalúa identidad.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No atribuir género por estereotipos de color o vestido; el recurso acompaña el uso lingüístico, no evalúa identidad.

### 课 · kè — clase; lección; curso

ID: `v-课` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-2873a1c129e4019e` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Un docente y dos estudiantes adultos ficticios participan en una lección con libro y cuaderno sin texto legible, formando un único grupo aislado.

CONTROL SEMÁNTICO: La clase no equivale a edificio escolar, materia o duración; usar el significado que corresponde a la frase.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** La clase no equivale a edificio escolar, materia o duración; usar el significado que corresponde a la frase.

### 孩子 · háizi — niño/a

ID: `v-孩子` · Riesgo: `medium` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-0bf9fad8eeb64653` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Un niño ficticio de edad escolar juega tranquilamente con un pequeño bloque de madera, cuerpo completo y ropa cotidiana apropiada.

CONTROL SEMÁNTICO: La imagen cubre niño como etapa vital, no hijo respecto de alguien ni edad exacta.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** La imagen cubre niño como etapa vital, no hijo respecto de alguien ni edad exacta.

### 晚上 · wǎnshang — noche

ID: `v-晚上` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-af7c1e4ced468d72` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Una persona adulta realiza una actividad tranquila junto a una lámpara de mesa encendida y un libro, en un pequeño conjunto aislado con sensación de final del día.

CONTROL SEMÁNTICO: No fondo nocturno negro ni afirmar hora por una lámpara; la frase establece el momento.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No fondo nocturno negro ni afirmar hora por una lámpara; la frase establece el momento.

### 律师 · lǜshī — abogado/a

ID: `v-律师` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-4d29eb26e315c20d` · Perfil: `profession`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Persona ficticia en una tarea profesional, con ropa apropiada, instrumentos y gesto funcional coherentes. La indumentaria acompaña la acción, no es prueba suficiente del cargo. Evita disfraces, logos, insignias inventadas y asignar todos los cargos de autoridad a un mismo género.

ESCENA ESPECÍFICA: Una abogada adulta ficticia con traje sobrio revisa un expediente liso y explica un documento a un cliente ante una pequeña mesa sin texto legible.

CONTROL SEMÁNTICO: No mazo judicial, toga de juez ni afirmar que cualquier traje identifica abogacía; la frase confirma la profesión.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No mazo judicial, toga de juez ni afirmar que cualquier traje identifica abogacía; la frase confirma la profesión.

### 记者 · jìzhě — reportero/a

ID: `v-记者` · Riesgo: `medium` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-a3a103bb0bcf6cdd` · Perfil: `profession`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Persona ficticia en una tarea profesional, con ropa apropiada, instrumentos y gesto funcional coherentes. La indumentaria acompaña la acción, no es prueba suficiente del cargo. Evita disfraces, logos, insignias inventadas y asignar todos los cargos de autoridad a un mismo género.

ESCENA ESPECÍFICA: Una periodista adulta ficticia con chaqueta práctica sostiene un micrófono sin logo mientras entrevista a otra persona; pequeña grabadora visible como apoyo.

CONTROL SEMÁNTICO: No confundir con cantante o entrevistada; no titulares, marcas de canal o credenciales falsas.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No confundir con cantante o entrevistada; no titulares, marcas de canal o credenciales falsas.

### 服务员 · fúwùyuán — camarero/a

ID: `v-服务员` · Riesgo: `medium` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-12dd29d1e86abc3a` · Perfil: `profession`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Persona ficticia en una tarea profesional, con ropa apropiada, instrumentos y gesto funcional coherentes. La indumentaria acompaña la acción, no es prueba suficiente del cargo. Evita disfraces, logos, insignias inventadas y asignar todos los cargos de autoridad a un mismo género.

ESCENA ESPECÍFICA: Un camarero adulto ficticio con camisa sencilla y delantal limpio ofrece un plato sobre una bandeja a un cliente, mirada y manos dirigidas al servicio.

CONTROL SEMÁNTICO: No cocinero preparando comida ni uniforme como única pista; bandeja y tarea deben ser coherentes.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No cocinero preparando comida ni uniforme como única pista; bandeja y tarea deben ser coherentes.

### 经理 · jīnglǐ — gerente

ID: `v-经理` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-dca7be4ae50a7dc0` · Perfil: `profession`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Persona ficticia en una tarea profesional, con ropa apropiada, instrumentos y gesto funcional coherentes. La indumentaria acompaña la acción, no es prueba suficiente del cargo. Evita disfraces, logos, insignias inventadas y asignar todos los cargos de autoridad a un mismo género.

ESCENA ESPECÍFICA: Una gerente adulta ficticia con chaqueta de trabajo y ropa formal moderada coordina una reunión breve, mostrando un plan sin texto a dos colegas que la escuchan.

CONTROL SEMÁNTICO: No trono corporativo, superioridad gestual ni cargo inferido solo del traje; contexto obligatorio.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No trono corporativo, superioridad gestual ni cargo inferido solo del traje; contexto obligatorio.

### 工程师 · gōngchéngshī — ingeniero/a

ID: `v-工程师` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-3bafef08144a2ae7` · Perfil: `profession`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Persona ficticia en una tarea profesional, con ropa apropiada, instrumentos y gesto funcional coherentes. La indumentaria acompaña la acción, no es prueba suficiente del cargo. Evita disfraces, logos, insignias inventadas y asignar todos los cargos de autoridad a un mismo género.

ESCENA ESPECÍFICA: Una ingeniera adulta ficticia con casco, chaleco de seguridad y camisa de trabajo revisa un plano sin letras y una pequeña maqueta de puente, comparando medidas con instrumento sencillo.

CONTROL SEMÁNTICO: No obrero con martillo como único símbolo; casco, tarea técnica y contexto juntos, sin atribuir especialidad universal.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No obrero con martillo como único símbolo; casco, tarea técnica y contexto juntos, sin atribuir especialidad universal.

### 学生 · xuésheng — estudiante

ID: `v-学生` · Riesgo: `medium` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-dc5cbfec96332646` · Perfil: `profession`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Persona ficticia en una tarea profesional, con ropa apropiada, instrumentos y gesto funcional coherentes. La indumentaria acompaña la acción, no es prueba suficiente del cargo. Evita disfraces, logos, insignias inventadas y asignar todos los cargos de autoridad a un mismo género.

ESCENA ESPECÍFICA: Una estudiante adulta ficticia con ropa cotidiana y mochila discreta toma notas frente a un libro mientras escucha a una docente parcialmente visible.

CONTROL SEMÁNTICO: No uniforme obligatorio ni edad como prueba del rol; no texto inventado en las páginas.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No uniforme obligatorio ni edad como prueba del rol; no texto inventado en las páginas.

### 商人 · shāngrén — comerciante

ID: `v-商人` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-bb3e67d850a9dc7a` · Perfil: `profession`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Persona ficticia en una tarea profesional, con ropa apropiada, instrumentos y gesto funcional coherentes. La indumentaria acompaña la acción, no es prueba suficiente del cargo. Evita disfraces, logos, insignias inventadas y asignar todos los cargos de autoridad a un mismo género.

ESCENA ESPECÍFICA: Una comerciante adulta ficticia con ropa de trabajo cotidiana revisa una pequeña muestra de mercancía y conversa con un comprador sobre el intercambio, sin dinero impreso visible.

CONTROL SEMÁNTICO: No traje genérico como definición ni confundir vendedor y cliente; contexto de comercio necesario.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No traje genérico como definición ni confundir vendedor y cliente; contexto de comercio necesario.

### 男朋友 · nánpéngyou — novio

ID: `v-男朋友` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-2ade0e2e9091832e` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Una pareja adulta ficticia comparte un gesto romántico moderado, manos entrelazadas y miradas afectuosas; una persona presenta al hombre como pareja dentro del contexto.

CONTROL SEMÁNTICO: No bodas, anillos como prueba ni afirmar estado civil por apariencia; no usar la escena como respuesta visual única.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No bodas, anillos como prueba ni afirmar estado civil por apariencia; no usar la escena como respuesta visual única.

### 女朋友 · nǚpéngyou — novia

ID: `v-女朋友` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-e595116dabdc0157` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Una pareja adulta ficticia comparte un gesto romántico moderado, manos entrelazadas y miradas afectuosas; una persona presenta a la mujer como pareja dentro del contexto.

CONTROL SEMÁNTICO: No boda, estereotipos de ropa ni confundir automáticamente novia con esposa.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No boda, estereotipos de ropa ni confundir automáticamente novia con esposa.

### 帅 · shuài — guapo

ID: `v-帅` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-9b678a2af7803715` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Una persona adulta ficticia arregla con naturalidad su chaqueta sencilla mientras otra expresa admiración moderada; apariencia cotidiana cuidada, no modelo idealizado.

CONTROL SEMÁNTICO: No fijar un cuerpo, etnia o rostro como definición universal de atractivo.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No fijar un cuerpo, etnia o rostro como definición universal de atractivo.

### 作业 · zuò yè — tarea

ID: `v-作业` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-931e1c6b5f869eea` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Una estudiante adulta resuelve una tarea en un cuaderno con lápiz, consultando un libro cercano; un pequeño reloj liso puede acompañar la sesión de estudio en casa.

CONTROL SEMÁNTICO: Sin escritura generada ni aula completa; diferenciar tarea asignada de estudio libre mediante la frase.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Sin escritura generada ni aula completa; diferenciar tarea asignada de estudio libre mediante la frase.

### 我们 · wǒmen — nosotros

ID: `v-我们` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-a9b13b02a1a98453` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Tres adultos están juntos; uno está hablando y hace un gesto inclusivo desde su pecho hacia sus dos acompañantes, mientras una cuarta persona escucha frente a ellos.

CONTROL SEMÁNTICO: El grupo incluye al hablante y excluye al destinatario representado; sin símbolos o etiquetas.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** El grupo incluye al hablante y excluye al destinatario representado; sin símbolos o etiquetas.

### 他们 · tāmen — ellos

ID: `v-他们` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-4472c5c2421e97ff` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Un hablante y su interlocutor observan a otro pequeño grupo de adultos separado de ellos; el hablante señala claramente ese grupo sin incluirse.

CONTROL SEMÁNTICO: No confundir con ustedes; la frase determina el pronombre, no la ropa o apariencia.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No confundir con ustedes; la frase determina el pronombre, no la ropa o apariencia.

### 她们 · tāmen — ellas

ID: `v-她们` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-f017a097b4cfa723` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Un hablante y su interlocutor observan a un grupo separado de dos mujeres adultas ficticias; el hablante indica a ese grupo y no se incluye.

CONTROL SEMÁNTICO: No utilizar apariencia como única prueba gramatical; contexto obligatorio para tercera persona plural.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No utilizar apariencia como única prueba gramatical; contexto obligatorio para tercera persona plural.

### 早饭 · zǎo fàn — desayuno

ID: `v-早饭` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-e3f6fbdfaa47c382` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Una persona adulta se dispone a desayunar con una comida sencilla de cuenco, pan y bebida, junto a un reloj de esfera lisa para contexto temporal posterior.

CONTROL SEMÁNTICO: Ningún alimento es exclusivo del desayuno; no usar menú completo ni letras dentro de la imagen.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Ningún alimento es exclusivo del desayuno; no usar menú completo ni letras dentro de la imagen.

### 老 · lǎo — viejo

ID: `v-老` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-5f2cd39a5a66ecff` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Dos versiones de un mismo objeto cotidiano de madera, una nueva y otra con desgaste real moderado; mano que señala el objeto usado.

CONTROL SEMÁNTICO: Solo apoyar la acepción viejo del contexto elegido; no trasladar deterioro a personas ni a 老朋友.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Solo apoyar la acepción viejo del contexto elegido; no trasladar deterioro a personas ni a 老朋友.

### 老人 · lǎorén — mayor

ID: `v-老人` · Riesgo: `medium` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-e92accea5584a520` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Una persona mayor ficticia activa y serena cuida una pequeña planta en maceta, manos naturales y expresión amable.

CONTROL SEMÁNTICO: No asociar vejez con fragilidad, enfermedad, bastón obligatorio o incapacidad.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No asociar vejez con fragilidad, enfermedad, bastón obligatorio o incapacidad.

### 秘鲁 · Bìlǔ — Perú

ID: `v-秘鲁` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-9eabbb5b32adc0c0` · Perfil: `country`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta de geografía fotorrealista: recorte arquitectónico o natural fiel del lugar indicado y una bandera nacional en un asta discreta al lado, sin colocarla sobre el monumento. El terreno indispensable puede ser una pequeña base recortada; todo el exterior es alfa transparente. La bandera necesita referencia auténtica validada, no símbolos inventados; si el modelo no preserva escudo, proporciones u orientación, incorporar después la bandera auténtica con composición controlada. No sustituir un país por la apariencia de sus habitantes.

ESCENA ESPECÍFICA: Las terrazas y construcciones de piedra de Machu Picchu en un recorte natural reconocible, con la montaña característica limitada a la silueta del conjunto y la bandera civil peruana roja y blanca al lado.

CONTROL SEMÁNTICO: No confundir con Chichén Itzá; utilizar la bandera civil sin inventar escudo, sin cielo o paisaje de relleno.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No confundir con Chichén Itzá; utilizar la bandera civil sin inventar escudo, sin cielo o paisaje de relleno.

**Referencias auténticas pendientes antes de generar:** flag, landmark.

### 墨西哥 · mò xī ɡē — México

ID: `v-墨西哥` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-06baea3561383862` · Perfil: `country`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta de geografía fotorrealista: recorte arquitectónico o natural fiel del lugar indicado y una bandera nacional en un asta discreta al lado, sin colocarla sobre el monumento. El terreno indispensable puede ser una pequeña base recortada; todo el exterior es alfa transparente. La bandera necesita referencia auténtica validada, no símbolos inventados; si el modelo no preserva escudo, proporciones u orientación, incorporar después la bandera auténtica con composición controlada. No sustituir un país por la apariencia de sus habitantes.

ESCENA ESPECÍFICA: La pirámide de Kukulkán en Chichén Itzá, con sus cuatro escalinatas y templo superior reconocibles, junto a la bandera nacional de México.

CONTROL SEMÁNTICO: Verificar el escudo mexicano con referencia auténtica; no sustituir el monumento por una pirámide egipcia.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Verificar el escudo mexicano con referencia auténtica; no sustituir el monumento por una pirámide egipcia.

**Referencias auténticas pendientes antes de generar:** flag, landmark.

### 爷爷 · yéye — abuelo paterno

ID: `v-爷爷` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-d14cbbd1704cb139` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Tres generaciones ficticias: un abuelo, su hijo adulto y el hijo o hija de este, con gestos que facilitan seguir la relación entre los tres.

CONTROL SEMÁNTICO: Para distinguir abuelo paterno hay que añadir la relación mediante contexto o composición validada; no basta una persona mayor.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Para distinguir abuelo paterno hay que añadir la relación mediante contexto o composición validada; no basta una persona mayor.

### 奶奶 · năinai — abuela paterna

ID: `v-奶奶` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-7b91d7ad8320a464` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Tres generaciones ficticias: una abuela, su hijo adulto y el hijo o hija de este, en una interacción familiar cálida y compacta.

CONTROL SEMÁNTICO: No identificar rama paterna por ropa o posición; el vínculo debe ser explícito fuera de la fotografía.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No identificar rama paterna por ropa o posición; el vínculo debe ser explícito fuera de la fotografía.

### 外公 · wàigōng — abuelo materno

ID: `v-外公` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-63bd19a64ca24478` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Tres generaciones ficticias: un abuelo, su hija adulta y el hijo o hija de esta, en una interacción familiar cotidiana y compacta.

CONTROL SEMÁNTICO: La rama materna requiere contexto; 姥爷 comparte el referente y no se distingue por imagen. No inventar una diferencia visual respecto de 外公; la variante es lingüística.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** La rama materna requiere contexto; 姥爷 comparte el referente y no se distingue por imagen.

### 外婆 · wàipó — abuela materna

ID: `v-外婆` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-7fc9f2cf0edd6529` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Tres generaciones ficticias: una abuela, su hija adulta y el hijo o hija de esta, en una interacción familiar cálida y compacta.

CONTROL SEMÁNTICO: La rama materna requiere contexto; 姥姥 comparte el referente y no se distingue por imagen. No inventar una diferencia visual respecto de 外婆; la variante es lingüística.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** La rama materna requiere contexto; 姥姥 comparte el referente y no se distingue por imagen.

### 姥姥 · lǎolao — abuela materna; norte de China

ID: `v-姥姥` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-7fc9f2cf0edd6529` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Tres generaciones ficticias: una abuela, su hija adulta y el hijo o hija de esta, en una interacción familiar cálida y compacta.

CONTROL SEMÁNTICO: La rama materna requiere contexto; 姥姥 comparte el referente y no se distingue por imagen. No inventar una diferencia visual respecto de 外婆; la variante es lingüística.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No inventar una diferencia visual respecto de 外婆; la variante es lingüística.

### 姥爷 · lǎoye — abuelo materno; norte de China

ID: `v-姥爷` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-63bd19a64ca24478` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Tres generaciones ficticias: un abuelo, su hija adulta y el hijo o hija de esta, en una interacción familiar cotidiana y compacta.

CONTROL SEMÁNTICO: La rama materna requiere contexto; 姥爷 comparte el referente y no se distingue por imagen. No inventar una diferencia visual respecto de 外公; la variante es lingüística.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No inventar una diferencia visual respecto de 外公; la variante es lingüística.

### 外国 · wàiguó — país extranjero

ID: `v-外国` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-940cfa6605554f93` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Una persona ficticia observa un mapa plegado y dos referencias geográficas separadas, sin bandera asignada por apariencia ni nombres impresos.

CONTROL SEMÁNTICO: Extranjero requiere país de referencia explícito en la frase; no existe aspecto físico extranjero.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Extranjero requiere país de referencia explícito en la frase; no existe aspecto físico extranjero.

### 外国人 · wàiguórén — persona extranjera

ID: `v-外国人` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-8b2bbe1407a08922` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Dos adultos ficticios conversan junto a dos mapas de referencia separados; sus apariencias son cotidianas y no se usan como código de nacionalidad.

CONTROL SEMÁNTICO: La procedencia debe estar establecida por el contexto, no por rostro, ropa, color de piel o ubicación física.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** La procedencia debe estar establecida por el contexto, no por rostro, ropa, color de piel o ubicación física.

### 爱 · ài — amar; querer mucho

ID: `v-爱` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-64de9cc7335ec986` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Dos personas adultas ficticias se abrazan con afecto cálido y natural, manos y rostros visibles, sin símbolos añadidos.

CONTROL SEMÁNTICO: No corazón flotante ni asumir relación romántica si la frase habla de familia; el contexto determina el afecto.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No corazón flotante ni asumir relación romántica si la frase habla de familia; el contexto determina el afecto.

### 家人 · jiā rén — familiares; miembros de la familia

ID: `v-家人` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-906e1098c0bebf52` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Tres generaciones ficticias de una familia comparten una actividad doméstica sencilla en grupo compacto, con interacción recíproca y pocos objetos.

CONTROL SEMÁNTICO: La familia es una escena construida, no inferencia sobre personas reales; no multitud de invitados indistinguible.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** La familia es una escena construida, no inferencia sobre personas reales; no multitud de invitados indistinguible.

### 可爱 · kě'ài — tierno; adorable

ID: `v-可爱` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-31f581be532fc0ea` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Una persona mira enternecida a un gatito realista que descansa cerca, expresión de cariño moderada y animal claramente secundario al vínculo de valoración.

CONTROL SEMÁNTICO: No ojos enormes ni identificar tierno con pequeño en todos los casos; no usar la imagen para exigir el adjetivo sin contexto.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No ojos enormes ni identificar tierno con pequeño en todos los casos; no usar la imagen para exigir el adjetivo sin contexto.

### 大学 · dàxué — universidad

ID: `v-大学` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-25261a96eabe4e93` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Un pequeño grupo de estudiantes adultos consulta libros frente a una maqueta mínima de un edificio universitario contemporáneo sin rótulos.

CONTROL SEMÁNTICO: No inventar una universidad identificable ni diferenciar universidad de instituto solo por una fachada.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No inventar una universidad identificable ni diferenciar universidad de instituto solo por una fachada.

### 工人 · gōngrén — obrero; trabajador

ID: `v-工人` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-2536ba2f7823df68` · Perfil: `profession`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Persona ficticia en una tarea profesional, con ropa apropiada, instrumentos y gesto funcional coherentes. La indumentaria acompaña la acción, no es prueba suficiente del cargo. Evita disfraces, logos, insignias inventadas y asignar todos los cargos de autoridad a un mismo género.

ESCENA ESPECÍFICA: Un trabajador adulto ficticio con mono de trabajo, gafas de protección apropiadas y guantes ajusta una pieza real de máquina con una herramienta adecuada.

CONTROL SEMÁNTICO: No traje de ingeniero ni uso inseguro; ropa y tarea ilustran, no certifican una profesión real.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No traje de ingeniero ni uso inseguro; ropa y tarea ilustran, no certifican una profesión real.

### 儿子 · érzi — hijo

ID: `v-儿子` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-fdd8b5237b8f2735` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Una madre o un padre ficticio presenta a su hijo a otra persona, que escucha con atención, en una pequeña escena familiar.

CONTROL SEMÁNTICO: El niño solo no significa hijo; contexto lingüístico de parentesco obligatorio.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** El niño solo no significa hijo; contexto lingüístico de parentesco obligatorio.

### 小孩子 · xiǎo háizi — niño pequeño; niños pequeños

ID: `v-小孩子` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-daafe7e8cf9b1bd2` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Un niño pequeño ficticio en una actividad de juego cotidiana, cuerpo completo y proporciones reales, sin juguetes abundantes.

CONTROL SEMÁNTICO: No exigir esta forma frente a 孩子 solo por apariencia; no exagerar rasgos infantiles.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No exigir esta forma frente a 孩子 solo por apariencia; no exagerar rasgos infantiles.

### 钢琴课 · gāngqín kè — clase de piano

ID: `v-钢琴课` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-8971d7f473b64c27` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Una profesora de piano adulta y su estudiante adulto comparten un teclado real; la profesora señala una posición mientras el estudiante practica.

CONTROL SEMÁNTICO: Distinguir enseñanza de solo tocar; no letras, partituras ilegibles ni manos imposibles.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Distinguir enseñanza de solo tocar; no letras, partituras ilegibles ni manos imposibles.

### 中午 · zhōngwǔ — al mediodía

ID: `v-中午` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-699298fadf50cee7` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Una persona adulta prepara una pausa a mitad de su jornada junto a una comida sencilla y un reloj de esfera completamente lisa destinado a composición posterior.

CONTROL SEMÁNTICO: La hora se agrega determinísticamente fuera del generador; un almuerzo no define por sí solo mediodía.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** La hora se agrega determinísticamente fuera del generador; un almuerzo no define por sí solo mediodía.

### 下午 · xiàwǔ — en la tarde

ID: `v-下午` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-08274291e3dadf56` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Una persona adulta retoma una actividad de lectura junto a taza y reloj de esfera lisa, conjunto cotidiano para un contexto de tarde.

CONTROL SEMÁNTICO: Sin hora pintada ni atardecer como única prueba; requiere referencia temporal externa.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Sin hora pintada ni atardecer como única prueba; requiere referencia temporal externa.

### 阿根廷 · Āgēntíng — Argentina

ID: `v-阿根廷` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-d9dc5ec3c0e4f4e6` · Perfil: `country`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta de geografía fotorrealista: recorte arquitectónico o natural fiel del lugar indicado y una bandera nacional en un asta discreta al lado, sin colocarla sobre el monumento. El terreno indispensable puede ser una pequeña base recortada; todo el exterior es alfa transparente. La bandera necesita referencia auténtica validada, no símbolos inventados; si el modelo no preserva escudo, proporciones u orientación, incorporar después la bandera auténtica con composición controlada. No sustituir un país por la apariencia de sus habitantes.

ESCENA ESPECÍFICA: El Obelisco de Buenos Aires completo sobre una pequeña base recortada, junto a la bandera nacional argentina con su Sol de Mayo auténtico.

CONTROL SEMÁNTICO: No añadir futbolistas como identidad del país; verificar sol y bandas celeste, blanca y celeste.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No añadir futbolistas como identidad del país; verificar sol y bandas celeste, blanca y celeste.

**Referencias auténticas pendientes antes de generar:** flag, landmark.

### 学院 · xuéyuàn — instituto; facultad

ID: `v-学院` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-28d5d672b27998fb` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Un grupo de estudiantes y una docente adultos trabajan en un pequeño módulo académico con libro y maqueta de edificio sin rótulos.

CONTROL SEMÁNTICO: La imagen solo apoya la institución, no demuestra que sea instituto o facultad frente a universidad.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** La imagen solo apoya la institución, no demuestra que sea instituto o facultad frente a universidad.

### 男生 · nánshēng — chico

ID: `v-男生` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-cc12d57a432eb42e` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Un estudiante varón ficticio joven adulto sostiene un cuaderno y participa en una conversación académica con otro estudiante.

CONTROL SEMÁNTICO: No inferir categoría por uniforme o aspecto físico exclusivamente; contexto social o escolar necesario.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No inferir categoría por uniforme o aspecto físico exclusivamente; contexto social o escolar necesario.

### 电影 · diànyǐng — película; cine

ID: `v-电影` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-b5b6549239cd8802` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Una pantalla portátil de cine recortada con una escena ficticia sencilla sin personajes reconocibles y un pequeño carrete de película como apoyo secundario.

CONTROL SEMÁNTICO: No cartel o título de película real; el conjunto apoya película como contenido y no una respuesta única sobre sala, pantalla o ver.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No cartel o título de película real; el conjunto apoya película como contenido y no una respuesta única sobre sala, pantalla o ver.

### 宠物 · chǒngwù — mascota

ID: `v-宠物` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-00859e1578222b98` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Una persona ficticia cuida con afecto a un gato y un perro domésticos juntos, con un pequeño cuenco de cuidado compartiendo la escena.

CONTROL SEMÁNTICO: Se pretende la categoría mascota, no solo gato o perro; no imagen aislada para respuesta léxica única.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Se pretende la categoría mascota, no solo gato o perro; no imagen aislada para respuesta léxica única.

### 车牌号 · chēpáihào — número de placa de matrícula

ID: `v-车牌号` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-8733b8bb7cfbbcf1` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: La parte trasera recortada de un automóvil genérico con placa totalmente en blanco; una mano señala específicamente la placa y no el vehículo entero.

CONTROL SEMÁNTICO: El número se añade solo mediante composición ficticia autorizada; no matrículas reales, marcas ni cifras generadas.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** El número se añade solo mediante composición ficticia autorizada; no matrículas reales, marcas ni cifras generadas.

### 俄罗斯人 · Éluósīrén — ruso; persona de Rusia

ID: `v-俄罗斯人` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-132ddde3c1da7da4` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Una persona adulta ficticia se presenta junto a un pequeño recurso geográfico de Rusia y su bandera auténtica aportada como referencia; la persona viste ropa cotidiana.

CONTROL SEMÁNTICO: La imagen es una presentación editorial de procedencia, no evidencia de nacionalidad de una persona real ni estereotipo de ropa.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** La imagen es una presentación editorial de procedencia, no evidencia de nacionalidad de una persona real ni estereotipo de ropa.

**Referencias auténticas pendientes antes de generar:** flag.

### 西安 · Xī’ān — Xi'an

ID: `v-西安` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-733c6e65c376c471` · Perfil: `place`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Recorte fotográfico arquitectónico reconocible del referente indicado. Mantén su estructura real y solo una base local mínima que lo sostenga; sin cielo, horizonte, fondo urbano panorámico ni decoración turística adicional.

ESCENA ESPECÍFICA: La Torre de la Campana de Xi'an en recorte arquitectónico fiel, con su plataforma y cubiertas tradicionales reconocibles.

CONTROL SEMÁNTICO: Verificar una referencia real; no confundir con torres de otras ciudades ni inventar rótulos.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Verificar una referencia real; no confundir con torres de otras ciudades ni inventar rótulos.

**Referencias auténticas pendientes antes de generar:** landmark.

### 广州 · Guǎngzhōu — Guangzhou; Cantón

ID: `v-广州` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-ff352d031eb13d71` · Perfil: `place`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Recorte fotográfico arquitectónico reconocible del referente indicado. Mantén su estructura real y solo una base local mínima que lo sostenga; sin cielo, horizonte, fondo urbano panorámico ni decoración turística adicional.

ESCENA ESPECÍFICA: La Torre de Cantón con su silueta retorcida característica y base visible, recortada sin ciudad de fondo.

CONTROL SEMÁNTICO: No sustituirla por la Perla Oriental ni inventar rotulación; el nombre de la ciudad se enseña por contexto.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No sustituirla por la Perla Oriental ni inventar rotulación; el nombre de la ciudad se enseña por contexto.

**Referencias auténticas pendientes antes de generar:** landmark.

### 你好 · nǐ hǎo — hola

ID: `v-你好` · Riesgo: `medium` · Candidata a quiz: sí, condicionada a revisión.

Receta: `IMG-06f1fe8e6fd342ba` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Dos adultos se aproximan al encontrarse y uno levanta una mano en saludo amistoso, con contacto visual y postura de acercamiento.

CONTROL SEMÁNTICO: No persona marchándose; el saludo se diferencia de despedirse por la dirección de la interacción.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No persona marchándose; el saludo se diferencia de despedirse por la dirección de la interacción.

### 您好 · Nín hǎo — hola; saludo respetuoso a usted

ID: `v-您好` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-e5f5d31c0d46f021` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Dos adultos se encuentran y se saludan con atención y cortesía, gesto de mano contenido y contacto visual natural.

CONTROL SEMÁNTICO: No afirmar respeto por ser el destinatario anciano; la distinción respecto de 你好 debe enseñarse lingüísticamente.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No afirmar respeto por ser el destinatario anciano; la distinción respecto de 你好 debe enseñarse lingüísticamente.

### 你们好 · Nǐmen hǎo — hola a todos; saludo a varias personas

ID: `v-你们好` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-25af77250756a997` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Una persona adulta llega y saluda con mano abierta a un grupo de tres personas que la miran y responden al saludo.

CONTROL SEMÁNTICO: No hablante incluido entre los destinatarios; sin texto o número de personas incorrecto en una actividad de conteo.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No hablante incluido entre los destinatarios; sin texto o número de personas incorrecto en una actividad de conteo.

### 晚安 · wǎn ān — buenas noches; saludo de despedida antes de dormir

ID: `v-晚安` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-be7f293c4929fe33` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Dos personas se despiden tranquilamente antes de dormir: una está junto a una almohada y manta sencillas y la otra hace un gesto suave de despedida.

CONTROL SEMÁNTICO: No luna como única pista ni escena de encuentro nocturno; no confundir con 晚上好.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No luna como única pista ni escena de encuentro nocturno; no confundir con 晚上好.

### 这儿 · zhèr — aquí

ID: `v-这儿` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-e8b5434c4154a23a` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Una persona adulta señala con la mano abierta el lugar inmediato junto a sus pies, mientras otra observa; pequeño apoyo local de suelo recortado solo bajo los pies.

CONTROL SEMÁNTICO: No ubicar aquí en un lugar fijo del mundo; el referente depende de quien habla.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No ubicar aquí en un lugar fijo del mundo; el referente depende de quien habla.

### 那儿 · nàr — allí; allá

ID: `v-那儿` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-6e58b04395e1b247` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Una persona adulta señala un lugar claramente separado de su posición donde está una silla; la distancia entre persona y silla es visible sobre transparencia.

CONTROL SEMÁNTICO: No paisaje de fondo ni un dedo sin referencia; el lugar remoto no debe confundirse con el objeto silla.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No paisaje de fondo ni un dedo sin referencia; el lugar remoto no debe confundirse con el objeto silla.

### 大家 · dàjiā — todos; todo el mundo

ID: `v-大家` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-9f7c1d9f06b0a6ea` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Una persona adulta saluda de forma inclusiva a un grupo variado de personas ficticias, todas pendientes de la interacción.

CONTROL SEMÁNTICO: No confundir todos con pronombres plurales o con una cantidad exacta; usar enunciado compatible.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No confundir todos con pronombres plurales o con una cantidad exacta; usar enunciado compatible.

### 孩子们 · háizimen — los niños

ID: `v-孩子们` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-38628b8c76a8d822` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Un pequeño grupo de niños ficticios juega cooperativamente con pocos bloques, todos claramente visibles y con ropa cotidiana.

CONTROL SEMÁNTICO: No asociar número preciso a un plural general; la frase aporta el sufijo plural.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No asociar número preciso a un plural general; la frase aporta el sufijo plural.

### 班 · bān — clase; grupo de estudiantes

ID: `v-班` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-c7804377606cb3bc` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Un docente y varios estudiantes adultos ficticios forman un grupo de clase compartiendo un único ejercicio, con pocos cuadernos y sillas recortadas.

CONTROL SEMÁNTICO: No edificio de aula ni compañeros que no comparten actividad; el grupo no define por sí solo el lexema.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No edificio de aula ni compañeros que no comparten actividad; el grupo no define por sí solo el lexema.

### 上午 · shàngwǔ — por la mañana; antes del mediodía

ID: `v-上午` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-68a8c4543c5de97d` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Una persona adulta estudia después de iniciar el día, con cuaderno, lápiz y un reloj de esfera lisa para añadir posteriormente una referencia de mañana.

CONTROL SEMÁNTICO: No distinguir de 早上 por una pose inventada; el contexto establece antes del mediodía.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No distinguir de 早上 por una pose inventada; el contexto establece antes del mediodía.

### 北京人 · Běijīng rén — persona de Pekín

ID: `v-北京人` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-36410acf28b55d2b` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Una persona adulta ficticia se presenta junto a una reproducción validada y secundaria del Templo del Cielo como referencia geográfica de Pekín.

CONTROL SEMÁNTICO: Un monumento cercano no prueba origen; la frase indica procedencia, nunca los rasgos personales.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Un monumento cercano no prueba origen; la frase indica procedencia, nunca los rasgos personales.

**Referencias auténticas pendientes antes de generar:** landmark.

### 美国人 · Měiguó rén — estadounidense

ID: `v-美国人` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-b6665d9fca83810d` · Perfil: `people`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica con personas ficticias y una interacción clara. Diferencia hablante, destinatario, acción y objeto mediante mirada y gestos naturales deliberadamente claros. Diversidad de edades adultas y apariencias entre recursos; no estereotipos de origen, género o estatus. No simular la identidad de personas nombradas en el material.

ESCENA ESPECÍFICA: Una persona adulta ficticia se presenta junto a una pequeña bandera estadounidense auténtica usada como referencia geográfica, con ropa cotidiana neutra.

CONTROL SEMÁNTICO: No asociar nacionalidad con rasgos físicos ni confundir visitar un país con ser de él; solo apoyo contextual.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No asociar nacionalidad con rasgos físicos ni confundir visitar un país con ser de él; solo apoyo contextual.

**Referencias auténticas pendientes antes de generar:** flag.

## visual_grammar

### 们 · men — sufijo plural

ID: `v-们` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-23cf0eaf59d0d506` · Perfil: `structured`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Genera únicamente elementos fotográficos recortables para el apoyo estructurado descrito. Las cantidades exactas, flechas, relaciones temporales, textos y marcas de referencia se componen después de forma determinista; no se confía su precisión al generador de imagen. Nada de números, letras, diagramas falsamente completos o fechas inventadas dentro del recurso base.

ESCENA ESPECÍFICA: Una persona adulta ficticia de cuerpo completo y aspecto cotidiano, como elemento fotográfico individual que pueda reutilizarse en un grupo.

CONTROL SEMÁNTICO: El plural humano lo determina la construcción; no escribir sufijos ni confundir plural con un número fijo.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** El plural humano lo determina la construcción; no escribir sufijos ni confundir plural con un número fijo.

**Composición posterior controlada:** Componer contraste entre una persona y un grupo; la aplicación añade la forma lingüística. No usar como prueba de imagen aislada.

### 和 · hé — y; con

ID: `v-和` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-bbfcbb091c496342` · Perfil: `structured`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Genera únicamente elementos fotográficos recortables para el apoyo estructurado descrito. Las cantidades exactas, flechas, relaciones temporales, textos y marcas de referencia se componen después de forma determinista; no se confía su precisión al generador de imagen. Nada de números, letras, diagramas falsamente completos o fechas inventadas dentro del recurso base.

ESCENA ESPECÍFICA: Dos elementos separados sobre alfa: un cuenco de arroz cocido y un cuenco de fideos, ambos reales y reconocibles, sin símbolos entre ellos.

CONTROL SEMÁNTICO: No presentar alternativa de elección ni destacar un alimento sobre el otro; no generar signo más o texto.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No presentar alternativa de elección ni destacar un alimento sobre el otro; no generar signo más o texto.

**Composición posterior controlada:** Unir ambos referentes como coexistentes; conjunción y ejemplo se renderizan fuera de la imagen. El conjunto por sí solo no identifica 和.

### 有 · yǒu — tener; haber

ID: `v-有` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-0f87cc5d454e3f15` · Perfil: `structured`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Genera únicamente elementos fotográficos recortables para el apoyo estructurado descrito. Las cantidades exactas, flechas, relaciones temporales, textos y marcas de referencia se componen después de forma determinista; no se confía su precisión al generador de imagen. Nada de números, letras, diagramas falsamente completos o fechas inventadas dentro del recurso base.

ESCENA ESPECÍFICA: Una mano adulta ficticia que sostiene un libro físico sencillo, junto a una versión de esa mano vacía como elemento separado, sin texto.

CONTROL SEMÁNTICO: No confundir poseer con querer o recibir; la ausencia no debe parecer un fallo de carga. No convertir ausencia en una prohibición; no dibujar una cruz roja como definición única.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No confundir poseer con querer o recibir; la ausencia no debe parecer un fallo de carga.

**Composición posterior controlada:** Componer contraste posesión/ausencia con referentes idénticos. Indicar el caso estudiado mediante texto real del ejemplo, no letras generadas.

### 几 · jǐ — cuánto

ID: `v-几` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-cf488b05a0864388` · Perfil: `structured`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Genera únicamente elementos fotográficos recortables para el apoyo estructurado descrito. Las cantidades exactas, flechas, relaciones temporales, textos y marcas de referencia se componen después de forma determinista; no se confía su precisión al generador de imagen. Nada de números, letras, diagramas falsamente completos o fechas inventadas dentro del recurso base.

ESCENA ESPECÍFICA: Una única ficha de conteo de madera lisa y redondeada, con volumen real y sin marcas, fotografiada como elemento aislado completo.

CONTROL SEMÁNTICO: Dos objetos no distinguen 二 de 两; no confiar el conteo al modelo. La foto de dos unidades no distingue 两 de 二; el clasificador y la construcción son obligatorios. No cantidad aproximada ni cifras generadas. No cantidad aproximada ni símbolos numéricos añadidos por IA. No decena aproximada ni etiqueta numérica inventada. No dedos de manos generadas como único mecanismo de conteo. No dos fichas, números ni texto; el nombre del objeto no debe convertirse en respuesta exigida. No fichas extra parcialmente cortadas. No figuras que sugieran otra cantidad por solapamiento. No generar sumas, números o totales a ojo; el cálculo se realiza con datos controlados. No inferir treinta años de un rostro. No intentar que la IA produzca cien objetos correctos de una vez ni saturar una foto. No pedir al modelo que dibuje varias cantidades simultáneamente. No pedir mil objetos generados ni una multitud como sustituto de mil. No persona anciana como imagen de setenta y cinco. No producir una cantidad aleatoria ni añadir signo de pregunta; la pregunta debe permanecer sin respuesta inventada. No reloj o edad de persona como definición del número. No una persona que parezca de cierta edad ni número pintado por IA. Sin número impreso ni cuatro objetos dibujados de forma no verificable. Una cantidad visible no distingue 多少 de 几; no responder automáticamente al ejercicio.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No producir una cantidad aleatoria ni añadir signo de pregunta; la pregunta debe permanecer sin respuesta inventada.

**Composición posterior controlada:** Repetir una cantidad controlada adecuada al ejemplo de 几 y mantener la interrogación en texto. No sustituir por 多少 sin contexto.

### 口 · kǒu — clasificador usado principalmente para indicar el número de personas en una familia

ID: `v-口` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-30b75dd7577fc2b2` · Perfil: `structured`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Genera únicamente elementos fotográficos recortables para el apoyo estructurado descrito. Las cantidades exactas, flechas, relaciones temporales, textos y marcas de referencia se componen después de forma determinista; no se confía su precisión al generador de imagen. Nada de números, letras, diagramas falsamente completos o fechas inventadas dentro del recurso base.

ESCENA ESPECÍFICA: Tres recortes fotográficos separados de familiares ficticios: una madre, un padre y una hija, con ropa cotidiana y expresiones naturales.

CONTROL SEMÁNTICO: No boca, labios o dientes para el clasificador familiar; no asumir que los retratos aislados prueban parentesco.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No boca, labios o dientes para el clasificador familiar; no asumir que los retratos aislados prueban parentesco.

**Composición posterior controlada:** Componer la cantidad exacta de integrantes que indique el ejemplo, con relación familiar explícita. Verificar cantidad y no convertirlo en quiz de imagen aislada.

### 一共 · yígòng — en total

ID: `v-一共` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-cf488b05a0864388` · Perfil: `structured`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Genera únicamente elementos fotográficos recortables para el apoyo estructurado descrito. Las cantidades exactas, flechas, relaciones temporales, textos y marcas de referencia se componen después de forma determinista; no se confía su precisión al generador de imagen. Nada de números, letras, diagramas falsamente completos o fechas inventadas dentro del recurso base.

ESCENA ESPECÍFICA: Una única ficha de conteo de madera lisa y redondeada, con volumen real y sin marcas, fotografiada como elemento aislado completo.

CONTROL SEMÁNTICO: Dos objetos no distinguen 二 de 两; no confiar el conteo al modelo. La foto de dos unidades no distingue 两 de 二; el clasificador y la construcción son obligatorios. No cantidad aproximada ni cifras generadas. No cantidad aproximada ni símbolos numéricos añadidos por IA. No decena aproximada ni etiqueta numérica inventada. No dedos de manos generadas como único mecanismo de conteo. No dos fichas, números ni texto; el nombre del objeto no debe convertirse en respuesta exigida. No fichas extra parcialmente cortadas. No figuras que sugieran otra cantidad por solapamiento. No generar sumas, números o totales a ojo; el cálculo se realiza con datos controlados. No inferir treinta años de un rostro. No intentar que la IA produzca cien objetos correctos de una vez ni saturar una foto. No pedir al modelo que dibuje varias cantidades simultáneamente. No pedir mil objetos generados ni una multitud como sustituto de mil. No persona anciana como imagen de setenta y cinco. No producir una cantidad aleatoria ni añadir signo de pregunta; la pregunta debe permanecer sin respuesta inventada. No reloj o edad de persona como definición del número. No una persona que parezca de cierta edad ni número pintado por IA. Sin número impreso ni cuatro objetos dibujados de forma no verificable. Una cantidad visible no distingue 多少 de 几; no responder automáticamente al ejercicio.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No generar sumas, números o totales a ojo; el cálculo se realiza con datos controlados.

**Composición posterior controlada:** Componer dos grupos y su unión; verificar que el total coincide con las partes. La aplicación expresa en total en su oración.

### 个 · gè — clasificador de uso general

ID: `v-个` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-66bd71eac1bfaca2` · Perfil: `structured`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Genera únicamente elementos fotográficos recortables para el apoyo estructurado descrito. Las cantidades exactas, flechas, relaciones temporales, textos y marcas de referencia se componen después de forma determinista; no se confía su precisión al generador de imagen. Nada de números, letras, diagramas falsamente completos o fechas inventadas dentro del recurso base.

ESCENA ESPECÍFICA: Una manzana real completa y una persona adulta ficticia como dos elementos separados, sin textos o símbolos.

CONTROL SEMÁNTICO: No presentar un objeto como definición universal del clasificador; seleccionar solo combinaciones válidas del corpus.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No presentar un objeto como definición universal del clasificador; seleccionar solo combinaciones válidas del corpus.

**Composición posterior controlada:** Seleccionar un referente adecuado al ejemplo con 个 y repetirlo con cantidad exacta; nunca adjudicar este clasificador automáticamente a cualquier objeto.

### 两 · liǎng — dos

ID: `v-两` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-cf488b05a0864388` · Perfil: `structured`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Genera únicamente elementos fotográficos recortables para el apoyo estructurado descrito. Las cantidades exactas, flechas, relaciones temporales, textos y marcas de referencia se componen después de forma determinista; no se confía su precisión al generador de imagen. Nada de números, letras, diagramas falsamente completos o fechas inventadas dentro del recurso base.

ESCENA ESPECÍFICA: Una única ficha de conteo de madera lisa y redondeada, con volumen real y sin marcas, fotografiada como elemento aislado completo.

CONTROL SEMÁNTICO: Dos objetos no distinguen 二 de 两; no confiar el conteo al modelo. La foto de dos unidades no distingue 两 de 二; el clasificador y la construcción son obligatorios. No cantidad aproximada ni cifras generadas. No cantidad aproximada ni símbolos numéricos añadidos por IA. No decena aproximada ni etiqueta numérica inventada. No dedos de manos generadas como único mecanismo de conteo. No dos fichas, números ni texto; el nombre del objeto no debe convertirse en respuesta exigida. No fichas extra parcialmente cortadas. No figuras que sugieran otra cantidad por solapamiento. No generar sumas, números o totales a ojo; el cálculo se realiza con datos controlados. No inferir treinta años de un rostro. No intentar que la IA produzca cien objetos correctos de una vez ni saturar una foto. No pedir al modelo que dibuje varias cantidades simultáneamente. No pedir mil objetos generados ni una multitud como sustituto de mil. No persona anciana como imagen de setenta y cinco. No producir una cantidad aleatoria ni añadir signo de pregunta; la pregunta debe permanecer sin respuesta inventada. No reloj o edad de persona como definición del número. No una persona que parezca de cierta edad ni número pintado por IA. Sin número impreso ni cuatro objetos dibujados de forma no verificable. Una cantidad visible no distingue 多少 de 几; no responder automáticamente al ejercicio.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** La foto de dos unidades no distingue 两 de 二; el clasificador y la construcción son obligatorios.

**Composición posterior controlada:** Duplicar exactamente dos veces y acompañar de una construcción documentada con clasificador; mantener distinto el ejercicio numeral de 二.

### 没有 · méiyǒu — no; no hay; no tener

ID: `v-没有` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-0f87cc5d454e3f15` · Perfil: `structured`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Genera únicamente elementos fotográficos recortables para el apoyo estructurado descrito. Las cantidades exactas, flechas, relaciones temporales, textos y marcas de referencia se componen después de forma determinista; no se confía su precisión al generador de imagen. Nada de números, letras, diagramas falsamente completos o fechas inventadas dentro del recurso base.

ESCENA ESPECÍFICA: Una mano adulta ficticia que sostiene un libro físico sencillo, junto a una versión de esa mano vacía como elemento separado, sin texto.

CONTROL SEMÁNTICO: No confundir poseer con querer o recibir; la ausencia no debe parecer un fallo de carga. No convertir ausencia en una prohibición; no dibujar una cruz roja como definición única.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No convertir ausencia en una prohibición; no dibujar una cruz roja como definición única.

**Composición posterior controlada:** Usar el lado de ausencia del contraste, manteniendo el mismo objeto que en 有. No alterar el predicado documental.

### 张 · zhāng — clasificador para objetos planos

ID: `v-张` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-7849ed461230d091` · Perfil: `structured`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Genera únicamente elementos fotográficos recortables para el apoyo estructurado descrito. Las cantidades exactas, flechas, relaciones temporales, textos y marcas de referencia se componen después de forma determinista; no se confía su precisión al generador de imagen. Nada de números, letras, diagramas falsamente completos o fechas inventadas dentro del recurso base.

ESCENA ESPECÍFICA: Una fotografía impresa, una tarjeta lisa y una hoja de papel como elementos separados, cada uno con grosor y bordes físicos reales, sin letras.

CONTROL SEMÁNTICO: No apellido Zhang ni una mano extendida como significado; no inventar documentos personales.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No apellido Zhang ni una mano extendida como significado; no inventar documentos personales.

**Composición posterior controlada:** Escoger el objeto plano de la frase y la cantidad exacta; conservar el clasificador como texto real externo a la imagen.

### 今年 · jīnnián — este año

ID: `v-今年` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-a86382141b4f9aa9` · Perfil: `structured`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Genera únicamente elementos fotográficos recortables para el apoyo estructurado descrito. Las cantidades exactas, flechas, relaciones temporales, textos y marcas de referencia se componen después de forma determinista; no se confía su precisión al generador de imagen. Nada de números, letras, diagramas falsamente completos o fechas inventadas dentro del recurso base.

ESCENA ESPECÍFICA: Una página de calendario de papel completamente en blanco con una pequeña pestaña física lisa separada, materiales realistas y sin fechas.

CONTROL SEMÁNTICO: Día como unidad del curso, no cielo o clima; no ambigüedad resuelta inventando una acepción. No año absoluto fijo ni escena histórica como sustituto. No año fijo ni fotografía envejecida para significar año pasado. No celebración o animal zodiacal como equivalencia de año; no calendario inventado. No confundir con mañana ni cambiar el pinyin documental en esta tarea. No confundir mañana temporal con la franja matinal; no fecha fija. No fijar el año actual a 2026 ni al año de generación; no fechas inventadas. No imponer lunes a viernes como calendario universal; evitar marcas de festivos no verificadas. No paisaje futurista ni año fijo. No sepia, sombra nocturna o tiempo atmosférico como significado de ayer. No sol, clima o fecha fija como hoy; la referencia debe poder cambiar sin regenerar la imagen.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No fijar el año actual a 2026 ni al año de generación; no fechas inventadas.

**Composición posterior controlada:** Construir una secuencia de años relativa a un año de referencia explícito y seleccionar el año central; textos calculados determinísticamente.

### 年 · nián — año

ID: `v-年` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-a86382141b4f9aa9` · Perfil: `structured`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Genera únicamente elementos fotográficos recortables para el apoyo estructurado descrito. Las cantidades exactas, flechas, relaciones temporales, textos y marcas de referencia se componen después de forma determinista; no se confía su precisión al generador de imagen. Nada de números, letras, diagramas falsamente completos o fechas inventadas dentro del recurso base.

ESCENA ESPECÍFICA: Una página de calendario de papel completamente en blanco con una pequeña pestaña física lisa separada, materiales realistas y sin fechas.

CONTROL SEMÁNTICO: Día como unidad del curso, no cielo o clima; no ambigüedad resuelta inventando una acepción. No año absoluto fijo ni escena histórica como sustituto. No año fijo ni fotografía envejecida para significar año pasado. No celebración o animal zodiacal como equivalencia de año; no calendario inventado. No confundir con mañana ni cambiar el pinyin documental en esta tarea. No confundir mañana temporal con la franja matinal; no fecha fija. No fijar el año actual a 2026 ni al año de generación; no fechas inventadas. No imponer lunes a viernes como calendario universal; evitar marcas de festivos no verificadas. No paisaje futurista ni año fijo. No sepia, sombra nocturna o tiempo atmosférico como significado de ayer. No sol, clima o fecha fija como hoy; la referencia debe poder cambiar sin regenerar la imagen.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No celebración o animal zodiacal como equivalencia de año; no calendario inventado.

**Composición posterior controlada:** Representar una unidad anual con meses o referencia temporal añadidos por composición controlada, sin fecha fija.

### 岁 · suì — año de edad

ID: `v-岁` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-caea77a3ca5c32ec` · Perfil: `structured`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Genera únicamente elementos fotográficos recortables para el apoyo estructurado descrito. Las cantidades exactas, flechas, relaciones temporales, textos y marcas de referencia se componen después de forma determinista; no se confía su precisión al generador de imagen. Nada de números, letras, diagramas falsamente completos o fechas inventadas dentro del recurso base.

ESCENA ESPECÍFICA: Una vela de cumpleaños sencilla sin encender y una pequeña base de pastel neutro como elementos separados, con materiales reales y sin números.

CONTROL SEMÁNTICO: Comparte concepto con 年龄; no inventar una distinción visual ni número exacto. No asignar edad a una cara ni inferir cifra por arrugas; no diferencia visual artificial frente a 岁数. No deducir edad de apariencia o de velas generadas aleatoriamente; no confundir con año del calendario.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No deducir edad de apariencia o de velas generadas aleatoriamente; no confundir con año del calendario.

**Composición posterior controlada:** Usar edad y cantidad controladas solo cuando el ejemplo las indique; textos y repeticiones se componen después.

### 今天 · jīntiān — hoy

ID: `v-今天` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-a86382141b4f9aa9` · Perfil: `structured`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Genera únicamente elementos fotográficos recortables para el apoyo estructurado descrito. Las cantidades exactas, flechas, relaciones temporales, textos y marcas de referencia se componen después de forma determinista; no se confía su precisión al generador de imagen. Nada de números, letras, diagramas falsamente completos o fechas inventadas dentro del recurso base.

ESCENA ESPECÍFICA: Una página de calendario de papel completamente en blanco con una pequeña pestaña física lisa separada, materiales realistas y sin fechas.

CONTROL SEMÁNTICO: Día como unidad del curso, no cielo o clima; no ambigüedad resuelta inventando una acepción. No año absoluto fijo ni escena histórica como sustituto. No año fijo ni fotografía envejecida para significar año pasado. No celebración o animal zodiacal como equivalencia de año; no calendario inventado. No confundir con mañana ni cambiar el pinyin documental en esta tarea. No confundir mañana temporal con la franja matinal; no fecha fija. No fijar el año actual a 2026 ni al año de generación; no fechas inventadas. No imponer lunes a viernes como calendario universal; evitar marcas de festivos no verificadas. No paisaje futurista ni año fijo. No sepia, sombra nocturna o tiempo atmosférico como significado de ayer. No sol, clima o fecha fija como hoy; la referencia debe poder cambiar sin regenerar la imagen.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No sol, clima o fecha fija como hoy; la referencia debe poder cambiar sin regenerar la imagen.

**Composición posterior controlada:** Representar tres días relativos y seleccionar el día de referencia central. No incluir fechas personales ni texto generado.

### 天 · tiān — día

ID: `v-天` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-a86382141b4f9aa9` · Perfil: `structured`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Genera únicamente elementos fotográficos recortables para el apoyo estructurado descrito. Las cantidades exactas, flechas, relaciones temporales, textos y marcas de referencia se componen después de forma determinista; no se confía su precisión al generador de imagen. Nada de números, letras, diagramas falsamente completos o fechas inventadas dentro del recurso base.

ESCENA ESPECÍFICA: Una página de calendario de papel completamente en blanco con una pequeña pestaña física lisa separada, materiales realistas y sin fechas.

CONTROL SEMÁNTICO: Día como unidad del curso, no cielo o clima; no ambigüedad resuelta inventando una acepción. No año absoluto fijo ni escena histórica como sustituto. No año fijo ni fotografía envejecida para significar año pasado. No celebración o animal zodiacal como equivalencia de año; no calendario inventado. No confundir con mañana ni cambiar el pinyin documental en esta tarea. No confundir mañana temporal con la franja matinal; no fecha fija. No fijar el año actual a 2026 ni al año de generación; no fechas inventadas. No imponer lunes a viernes como calendario universal; evitar marcas de festivos no verificadas. No paisaje futurista ni año fijo. No sepia, sombra nocturna o tiempo atmosférico como significado de ayer. No sol, clima o fecha fija como hoy; la referencia debe poder cambiar sin regenerar la imagen.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Día como unidad del curso, no cielo o clima; no ambigüedad resuelta inventando una acepción.

**Composición posterior controlada:** Componer una unidad de día dentro de una secuencia temporal contextual; las etiquetas reales quedan fuera del generador.

### 杯 · bēi — taza; vaso

ID: `v-杯` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-07fbecdaadc61acc` · Perfil: `structured`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Genera únicamente elementos fotográficos recortables para el apoyo estructurado descrito. Las cantidades exactas, flechas, relaciones temporales, textos y marcas de referencia se componen después de forma determinista; no se confía su precisión al generador de imagen. Nada de números, letras, diagramas falsamente completos o fechas inventadas dentro del recurso base.

ESCENA ESPECÍFICA: Una taza sencilla y un vaso transparente vacíos como elementos separados, completos, con materiales cotidianos realistas.

CONTROL SEMÁNTICO: No exigir el clasificador a partir del recipiente solo; no añadir líquidos incompatibles con el ejemplo.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No exigir el clasificador a partir del recipiente solo; no añadir líquidos incompatibles con el ejemplo.

**Composición posterior controlada:** Seleccionar taza o vaso y bebida del enunciado; componer número exacto y expresión con 杯 externamente.

### 一点儿 · yì diǎnr — un poco

ID: `v-一点儿` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-849ddb777e24ed2f` · Perfil: `structured`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Genera únicamente elementos fotográficos recortables para el apoyo estructurado descrito. Las cantidades exactas, flechas, relaciones temporales, textos y marcas de referencia se componen después de forma determinista; no se confía su precisión al generador de imagen. Nada de números, letras, diagramas falsamente completos o fechas inventadas dentro del recurso base.

ESCENA ESPECÍFICA: Un cuenco transparente vacío y otro idéntico con una pequeña porción visible de arroz cocido, como dos elementos recortados.

CONTROL SEMÁNTICO: Pequeña cantidad, no tamaño del recipiente; no tratar un poco de idioma como arroz literal.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Pequeña cantidad, no tamaño del recipiente; no tratar un poco de idioma como arroz literal.

**Composición posterior controlada:** Usar la comparación solo con un sentido cuantificable compatible; para capacidad lingüística mantener apoyo contextual, nunca una equivalencia literal.

### 只 · zhī — clasificador para animales

ID: `v-只` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-a9d9a8b52b0db398` · Perfil: `structured`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Genera únicamente elementos fotográficos recortables para el apoyo estructurado descrito. Las cantidades exactas, flechas, relaciones temporales, textos y marcas de referencia se componen después de forma determinista; no se confía su precisión al generador de imagen. Nada de números, letras, diagramas falsamente completos o fechas inventadas dentro del recurso base.

ESCENA ESPECÍFICA: Un gato doméstico adulto completo y un perro doméstico adulto completo como dos elementos recortados separados, ambos tranquilos y realistas.

CONTROL SEMÁNTICO: Clasificador de animales zhī, no adverbio solo; no número de animales decidido por el modelo.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Clasificador de animales zhī, no adverbio solo; no número de animales decidido por el modelo.

**Composición posterior controlada:** Reutilizar preferentemente los animales ya aprobados, repetir exactamente según 一只猫 o 三只狗 y añadir el clasificador como texto real externo.

### 现在 · xiànzài — ahora; en este momento

ID: `v-现在` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-05c29ec04e93af30` · Perfil: `structured`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Genera únicamente elementos fotográficos recortables para el apoyo estructurado descrito. Las cantidades exactas, flechas, relaciones temporales, textos y marcas de referencia se componen después de forma determinista; no se confía su precisión al generador de imagen. Nada de números, letras, diagramas falsamente completos o fechas inventadas dentro del recurso base.

ESCENA ESPECÍFICA: Un reloj físico de escritorio con esfera lisa sin números ni agujas y una pequeña ficha de posición separada, realismo de materiales.

CONTROL SEMÁNTICO: Un reloj no define ahora; no hora falsa ni instante fijo dentro del recurso.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Un reloj no define ahora; no hora falsa ni instante fijo dentro del recurso.

**Composición posterior controlada:** Componer un punto presente respecto de antes/después; cualquier hora debe proceder de la tarea y no del generador.

### 工作日 · gōngzuòrì — día laborable

ID: `v-工作日` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-a86382141b4f9aa9` · Perfil: `structured`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Genera únicamente elementos fotográficos recortables para el apoyo estructurado descrito. Las cantidades exactas, flechas, relaciones temporales, textos y marcas de referencia se componen después de forma determinista; no se confía su precisión al generador de imagen. Nada de números, letras, diagramas falsamente completos o fechas inventadas dentro del recurso base.

ESCENA ESPECÍFICA: Una página de calendario de papel completamente en blanco con una pequeña pestaña física lisa separada, materiales realistas y sin fechas.

CONTROL SEMÁNTICO: Día como unidad del curso, no cielo o clima; no ambigüedad resuelta inventando una acepción. No año absoluto fijo ni escena histórica como sustituto. No año fijo ni fotografía envejecida para significar año pasado. No celebración o animal zodiacal como equivalencia de año; no calendario inventado. No confundir con mañana ni cambiar el pinyin documental en esta tarea. No confundir mañana temporal con la franja matinal; no fecha fija. No fijar el año actual a 2026 ni al año de generación; no fechas inventadas. No imponer lunes a viernes como calendario universal; evitar marcas de festivos no verificadas. No paisaje futurista ni año fijo. No sepia, sombra nocturna o tiempo atmosférico como significado de ayer. No sol, clima o fecha fija como hoy; la referencia debe poder cambiar sin regenerar la imagen.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No imponer lunes a viernes como calendario universal; evitar marcas de festivos no verificadas.

**Composición posterior controlada:** Señalar días laborales según un calendario de ejemplo explícito y su contexto, con marcas añadidas de forma determinista.

### 前年 · qiánnián — el año antepasado

ID: `v-前年` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-a86382141b4f9aa9` · Perfil: `structured`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Genera únicamente elementos fotográficos recortables para el apoyo estructurado descrito. Las cantidades exactas, flechas, relaciones temporales, textos y marcas de referencia se componen después de forma determinista; no se confía su precisión al generador de imagen. Nada de números, letras, diagramas falsamente completos o fechas inventadas dentro del recurso base.

ESCENA ESPECÍFICA: Una página de calendario de papel completamente en blanco con una pequeña pestaña física lisa separada, materiales realistas y sin fechas.

CONTROL SEMÁNTICO: Día como unidad del curso, no cielo o clima; no ambigüedad resuelta inventando una acepción. No año absoluto fijo ni escena histórica como sustituto. No año fijo ni fotografía envejecida para significar año pasado. No celebración o animal zodiacal como equivalencia de año; no calendario inventado. No confundir con mañana ni cambiar el pinyin documental en esta tarea. No confundir mañana temporal con la franja matinal; no fecha fija. No fijar el año actual a 2026 ni al año de generación; no fechas inventadas. No imponer lunes a viernes como calendario universal; evitar marcas de festivos no verificadas. No paisaje futurista ni año fijo. No sepia, sombra nocturna o tiempo atmosférico como significado de ayer. No sol, clima o fecha fija como hoy; la referencia debe poder cambiar sin regenerar la imagen.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No año absoluto fijo ni escena histórica como sustituto.

**Composición posterior controlada:** En una secuencia de cinco años relativa a uno central, seleccionar el desplazamiento -2. Las etiquetas se calculan con la referencia de estudio.

### 去年 · qùnián — el año pasado

ID: `v-去年` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-a86382141b4f9aa9` · Perfil: `structured`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Genera únicamente elementos fotográficos recortables para el apoyo estructurado descrito. Las cantidades exactas, flechas, relaciones temporales, textos y marcas de referencia se componen después de forma determinista; no se confía su precisión al generador de imagen. Nada de números, letras, diagramas falsamente completos o fechas inventadas dentro del recurso base.

ESCENA ESPECÍFICA: Una página de calendario de papel completamente en blanco con una pequeña pestaña física lisa separada, materiales realistas y sin fechas.

CONTROL SEMÁNTICO: Día como unidad del curso, no cielo o clima; no ambigüedad resuelta inventando una acepción. No año absoluto fijo ni escena histórica como sustituto. No año fijo ni fotografía envejecida para significar año pasado. No celebración o animal zodiacal como equivalencia de año; no calendario inventado. No confundir con mañana ni cambiar el pinyin documental en esta tarea. No confundir mañana temporal con la franja matinal; no fecha fija. No fijar el año actual a 2026 ni al año de generación; no fechas inventadas. No imponer lunes a viernes como calendario universal; evitar marcas de festivos no verificadas. No paisaje futurista ni año fijo. No sepia, sombra nocturna o tiempo atmosférico como significado de ayer. No sol, clima o fecha fija como hoy; la referencia debe poder cambiar sin regenerar la imagen.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No año fijo ni fotografía envejecida para significar año pasado.

**Composición posterior controlada:** Seleccionar el desplazamiento -1 respecto del año de referencia dentro de una secuencia controlada.

### 明年 · míngnián — el año próximo; el año que viene

ID: `v-明年` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-a86382141b4f9aa9` · Perfil: `structured`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Genera únicamente elementos fotográficos recortables para el apoyo estructurado descrito. Las cantidades exactas, flechas, relaciones temporales, textos y marcas de referencia se componen después de forma determinista; no se confía su precisión al generador de imagen. Nada de números, letras, diagramas falsamente completos o fechas inventadas dentro del recurso base.

ESCENA ESPECÍFICA: Una página de calendario de papel completamente en blanco con una pequeña pestaña física lisa separada, materiales realistas y sin fechas.

CONTROL SEMÁNTICO: Día como unidad del curso, no cielo o clima; no ambigüedad resuelta inventando una acepción. No año absoluto fijo ni escena histórica como sustituto. No año fijo ni fotografía envejecida para significar año pasado. No celebración o animal zodiacal como equivalencia de año; no calendario inventado. No confundir con mañana ni cambiar el pinyin documental en esta tarea. No confundir mañana temporal con la franja matinal; no fecha fija. No fijar el año actual a 2026 ni al año de generación; no fechas inventadas. No imponer lunes a viernes como calendario universal; evitar marcas de festivos no verificadas. No paisaje futurista ni año fijo. No sepia, sombra nocturna o tiempo atmosférico como significado de ayer. No sol, clima o fecha fija como hoy; la referencia debe poder cambiar sin regenerar la imagen.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No paisaje futurista ni año fijo.

**Composición posterior controlada:** Seleccionar el desplazamiento +1 respecto del año de referencia, con etiquetas calculadas externamente.

### 后年 · hòuniá — dentro de dos años

ID: `v-后年` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-a86382141b4f9aa9` · Perfil: `structured`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Genera únicamente elementos fotográficos recortables para el apoyo estructurado descrito. Las cantidades exactas, flechas, relaciones temporales, textos y marcas de referencia se componen después de forma determinista; no se confía su precisión al generador de imagen. Nada de números, letras, diagramas falsamente completos o fechas inventadas dentro del recurso base.

ESCENA ESPECÍFICA: Una página de calendario de papel completamente en blanco con una pequeña pestaña física lisa separada, materiales realistas y sin fechas.

CONTROL SEMÁNTICO: Día como unidad del curso, no cielo o clima; no ambigüedad resuelta inventando una acepción. No año absoluto fijo ni escena histórica como sustituto. No año fijo ni fotografía envejecida para significar año pasado. No celebración o animal zodiacal como equivalencia de año; no calendario inventado. No confundir con mañana ni cambiar el pinyin documental en esta tarea. No confundir mañana temporal con la franja matinal; no fecha fija. No fijar el año actual a 2026 ni al año de generación; no fechas inventadas. No imponer lunes a viernes como calendario universal; evitar marcas de festivos no verificadas. No paisaje futurista ni año fijo. No sepia, sombra nocturna o tiempo atmosférico como significado de ayer. No sol, clima o fecha fija como hoy; la referencia debe poder cambiar sin regenerar la imagen.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No confundir con mañana ni cambiar el pinyin documental en esta tarea.

**Composición posterior controlada:** Seleccionar el desplazamiento +2 respecto del año de referencia dentro de cinco unidades controladas.

### 年龄 · niánlíng — edad

ID: `v-年龄` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-caea77a3ca5c32ec` · Perfil: `structured`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Genera únicamente elementos fotográficos recortables para el apoyo estructurado descrito. Las cantidades exactas, flechas, relaciones temporales, textos y marcas de referencia se componen después de forma determinista; no se confía su precisión al generador de imagen. Nada de números, letras, diagramas falsamente completos o fechas inventadas dentro del recurso base.

ESCENA ESPECÍFICA: Una vela de cumpleaños sencilla sin encender y una pequeña base de pastel neutro como elementos separados, con materiales reales y sin números.

CONTROL SEMÁNTICO: Comparte concepto con 年龄; no inventar una distinción visual ni número exacto. No asignar edad a una cara ni inferir cifra por arrugas; no diferencia visual artificial frente a 岁数. No deducir edad de apariencia o de velas generadas aleatoriamente; no confundir con año del calendario.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No asignar edad a una cara ni inferir cifra por arrugas; no diferencia visual artificial frente a 岁数.

**Composición posterior controlada:** Representar edad únicamente con el dato del ejemplo, diferenciándola del año de calendario; ninguna edad personal se inventa.

### 岁数 · suìshù — edad; número de años de edad

ID: `v-岁数` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-caea77a3ca5c32ec` · Perfil: `structured`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Genera únicamente elementos fotográficos recortables para el apoyo estructurado descrito. Las cantidades exactas, flechas, relaciones temporales, textos y marcas de referencia se componen después de forma determinista; no se confía su precisión al generador de imagen. Nada de números, letras, diagramas falsamente completos o fechas inventadas dentro del recurso base.

ESCENA ESPECÍFICA: Una vela de cumpleaños sencilla sin encender y una pequeña base de pastel neutro como elementos separados, con materiales reales y sin números.

CONTROL SEMÁNTICO: Comparte concepto con 年龄; no inventar una distinción visual ni número exacto. No asignar edad a una cara ni inferir cifra por arrugas; no diferencia visual artificial frente a 岁数. No deducir edad de apariencia o de velas generadas aleatoriamente; no confundir con año del calendario.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Comparte concepto con 年龄; no inventar una distinción visual ni número exacto.

**Composición posterior controlada:** Reutilizar el apoyo de edad con el enunciado de esta entrada; datos y etiquetas reales mediante composición posterior.

### 昨天 · zuó tiān — ayer

ID: `v-昨天` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-a86382141b4f9aa9` · Perfil: `structured`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Genera únicamente elementos fotográficos recortables para el apoyo estructurado descrito. Las cantidades exactas, flechas, relaciones temporales, textos y marcas de referencia se componen después de forma determinista; no se confía su precisión al generador de imagen. Nada de números, letras, diagramas falsamente completos o fechas inventadas dentro del recurso base.

ESCENA ESPECÍFICA: Una página de calendario de papel completamente en blanco con una pequeña pestaña física lisa separada, materiales realistas y sin fechas.

CONTROL SEMÁNTICO: Día como unidad del curso, no cielo o clima; no ambigüedad resuelta inventando una acepción. No año absoluto fijo ni escena histórica como sustituto. No año fijo ni fotografía envejecida para significar año pasado. No celebración o animal zodiacal como equivalencia de año; no calendario inventado. No confundir con mañana ni cambiar el pinyin documental en esta tarea. No confundir mañana temporal con la franja matinal; no fecha fija. No fijar el año actual a 2026 ni al año de generación; no fechas inventadas. No imponer lunes a viernes como calendario universal; evitar marcas de festivos no verificadas. No paisaje futurista ni año fijo. No sepia, sombra nocturna o tiempo atmosférico como significado de ayer. No sol, clima o fecha fija como hoy; la referencia debe poder cambiar sin regenerar la imagen.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No sepia, sombra nocturna o tiempo atmosférico como significado de ayer.

**Composición posterior controlada:** Seleccionar el desplazamiento -1 en una secuencia de días relativa al día de referencia.

### 明天 · míng tiān — mañana

ID: `v-明天` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-a86382141b4f9aa9` · Perfil: `structured`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Genera únicamente elementos fotográficos recortables para el apoyo estructurado descrito. Las cantidades exactas, flechas, relaciones temporales, textos y marcas de referencia se componen después de forma determinista; no se confía su precisión al generador de imagen. Nada de números, letras, diagramas falsamente completos o fechas inventadas dentro del recurso base.

ESCENA ESPECÍFICA: Una página de calendario de papel completamente en blanco con una pequeña pestaña física lisa separada, materiales realistas y sin fechas.

CONTROL SEMÁNTICO: Día como unidad del curso, no cielo o clima; no ambigüedad resuelta inventando una acepción. No año absoluto fijo ni escena histórica como sustituto. No año fijo ni fotografía envejecida para significar año pasado. No celebración o animal zodiacal como equivalencia de año; no calendario inventado. No confundir con mañana ni cambiar el pinyin documental en esta tarea. No confundir mañana temporal con la franja matinal; no fecha fija. No fijar el año actual a 2026 ni al año de generación; no fechas inventadas. No imponer lunes a viernes como calendario universal; evitar marcas de festivos no verificadas. No paisaje futurista ni año fijo. No sepia, sombra nocturna o tiempo atmosférico como significado de ayer. No sol, clima o fecha fija como hoy; la referencia debe poder cambiar sin regenerar la imagen.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No confundir mañana temporal con la franja matinal; no fecha fija.

**Composición posterior controlada:** Seleccionar el desplazamiento +1 en una secuencia de días relativa al día de referencia.

### 系 · xì — departamento universitario

ID: `v-系` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-31f19a509d94f78e` · Perfil: `structured`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Genera únicamente elementos fotográficos recortables para el apoyo estructurado descrito. Las cantidades exactas, flechas, relaciones temporales, textos y marcas de referencia se componen después de forma determinista; no se confía su precisión al generador de imagen. Nada de números, letras, diagramas falsamente completos o fechas inventadas dentro del recurso base.

ESCENA ESPECÍFICA: Una maqueta arquitectónica neutra de un edificio académico y tres módulos menores separados, todos sin rótulos y con apariencia material real.

CONTROL SEMÁNTICO: Departamento universitario, no atar ni sistema genérico; no inventar nombres de facultades.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Departamento universitario, no atar ni sistema genérico; no inventar nombres de facultades.

**Composición posterior controlada:** Componer la relación universidad y departamentos usando estructura válida del ejemplo; textos y conexiones se añaden controladamente.

### 一 · yī — uno

ID: `v-一` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-cf488b05a0864388` · Perfil: `structured`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Genera únicamente elementos fotográficos recortables para el apoyo estructurado descrito. Las cantidades exactas, flechas, relaciones temporales, textos y marcas de referencia se componen después de forma determinista; no se confía su precisión al generador de imagen. Nada de números, letras, diagramas falsamente completos o fechas inventadas dentro del recurso base.

ESCENA ESPECÍFICA: Una única ficha de conteo de madera lisa y redondeada, con volumen real y sin marcas, fotografiada como elemento aislado completo.

CONTROL SEMÁNTICO: Dos objetos no distinguen 二 de 两; no confiar el conteo al modelo. La foto de dos unidades no distingue 两 de 二; el clasificador y la construcción son obligatorios. No cantidad aproximada ni cifras generadas. No cantidad aproximada ni símbolos numéricos añadidos por IA. No decena aproximada ni etiqueta numérica inventada. No dedos de manos generadas como único mecanismo de conteo. No dos fichas, números ni texto; el nombre del objeto no debe convertirse en respuesta exigida. No fichas extra parcialmente cortadas. No figuras que sugieran otra cantidad por solapamiento. No generar sumas, números o totales a ojo; el cálculo se realiza con datos controlados. No inferir treinta años de un rostro. No intentar que la IA produzca cien objetos correctos de una vez ni saturar una foto. No pedir al modelo que dibuje varias cantidades simultáneamente. No pedir mil objetos generados ni una multitud como sustituto de mil. No persona anciana como imagen de setenta y cinco. No producir una cantidad aleatoria ni añadir signo de pregunta; la pregunta debe permanecer sin respuesta inventada. No reloj o edad de persona como definición del número. No una persona que parezca de cierta edad ni número pintado por IA. Sin número impreso ni cuatro objetos dibujados de forma no verificable. Una cantidad visible no distingue 多少 de 几; no responder automáticamente al ejercicio.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No dos fichas, números ni texto; el nombre del objeto no debe convertirse en respuesta exigida.

**Composición posterior controlada:** Usar exactamente 1 unidad, validar el conteo y contextualizar el numeral fuera de la imagen.

### 二 · èr — dos

ID: `v-二` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-cf488b05a0864388` · Perfil: `structured`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Genera únicamente elementos fotográficos recortables para el apoyo estructurado descrito. Las cantidades exactas, flechas, relaciones temporales, textos y marcas de referencia se componen después de forma determinista; no se confía su precisión al generador de imagen. Nada de números, letras, diagramas falsamente completos o fechas inventadas dentro del recurso base.

ESCENA ESPECÍFICA: Una única ficha de conteo de madera lisa y redondeada, con volumen real y sin marcas, fotografiada como elemento aislado completo.

CONTROL SEMÁNTICO: Dos objetos no distinguen 二 de 两; no confiar el conteo al modelo. La foto de dos unidades no distingue 两 de 二; el clasificador y la construcción son obligatorios. No cantidad aproximada ni cifras generadas. No cantidad aproximada ni símbolos numéricos añadidos por IA. No decena aproximada ni etiqueta numérica inventada. No dedos de manos generadas como único mecanismo de conteo. No dos fichas, números ni texto; el nombre del objeto no debe convertirse en respuesta exigida. No fichas extra parcialmente cortadas. No figuras que sugieran otra cantidad por solapamiento. No generar sumas, números o totales a ojo; el cálculo se realiza con datos controlados. No inferir treinta años de un rostro. No intentar que la IA produzca cien objetos correctos de una vez ni saturar una foto. No pedir al modelo que dibuje varias cantidades simultáneamente. No pedir mil objetos generados ni una multitud como sustituto de mil. No persona anciana como imagen de setenta y cinco. No producir una cantidad aleatoria ni añadir signo de pregunta; la pregunta debe permanecer sin respuesta inventada. No reloj o edad de persona como definición del número. No una persona que parezca de cierta edad ni número pintado por IA. Sin número impreso ni cuatro objetos dibujados de forma no verificable. Una cantidad visible no distingue 多少 de 几; no responder automáticamente al ejercicio.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Dos objetos no distinguen 二 de 两; no confiar el conteo al modelo.

**Composición posterior controlada:** Duplicar exactamente 2 unidades; usar tarea numeral documentada, no imponer 二 en una construcción que requiere 两.

### 三 · sān — tres

ID: `v-三` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-cf488b05a0864388` · Perfil: `structured`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Genera únicamente elementos fotográficos recortables para el apoyo estructurado descrito. Las cantidades exactas, flechas, relaciones temporales, textos y marcas de referencia se componen después de forma determinista; no se confía su precisión al generador de imagen. Nada de números, letras, diagramas falsamente completos o fechas inventadas dentro del recurso base.

ESCENA ESPECÍFICA: Una única ficha de conteo de madera lisa y redondeada, con volumen real y sin marcas, fotografiada como elemento aislado completo.

CONTROL SEMÁNTICO: Dos objetos no distinguen 二 de 两; no confiar el conteo al modelo. La foto de dos unidades no distingue 两 de 二; el clasificador y la construcción son obligatorios. No cantidad aproximada ni cifras generadas. No cantidad aproximada ni símbolos numéricos añadidos por IA. No decena aproximada ni etiqueta numérica inventada. No dedos de manos generadas como único mecanismo de conteo. No dos fichas, números ni texto; el nombre del objeto no debe convertirse en respuesta exigida. No fichas extra parcialmente cortadas. No figuras que sugieran otra cantidad por solapamiento. No generar sumas, números o totales a ojo; el cálculo se realiza con datos controlados. No inferir treinta años de un rostro. No intentar que la IA produzca cien objetos correctos de una vez ni saturar una foto. No pedir al modelo que dibuje varias cantidades simultáneamente. No pedir mil objetos generados ni una multitud como sustituto de mil. No persona anciana como imagen de setenta y cinco. No producir una cantidad aleatoria ni añadir signo de pregunta; la pregunta debe permanecer sin respuesta inventada. No reloj o edad de persona como definición del número. No una persona que parezca de cierta edad ni número pintado por IA. Sin número impreso ni cuatro objetos dibujados de forma no verificable. Una cantidad visible no distingue 多少 de 几; no responder automáticamente al ejercicio.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No pedir al modelo que dibuje varias cantidades simultáneamente.

**Composición posterior controlada:** Componer exactamente 3 copias y verificar el total.

### 四 · sì — cuatro

ID: `v-四` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-cf488b05a0864388` · Perfil: `structured`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Genera únicamente elementos fotográficos recortables para el apoyo estructurado descrito. Las cantidades exactas, flechas, relaciones temporales, textos y marcas de referencia se componen después de forma determinista; no se confía su precisión al generador de imagen. Nada de números, letras, diagramas falsamente completos o fechas inventadas dentro del recurso base.

ESCENA ESPECÍFICA: Una única ficha de conteo de madera lisa y redondeada, con volumen real y sin marcas, fotografiada como elemento aislado completo.

CONTROL SEMÁNTICO: Dos objetos no distinguen 二 de 两; no confiar el conteo al modelo. La foto de dos unidades no distingue 两 de 二; el clasificador y la construcción son obligatorios. No cantidad aproximada ni cifras generadas. No cantidad aproximada ni símbolos numéricos añadidos por IA. No decena aproximada ni etiqueta numérica inventada. No dedos de manos generadas como único mecanismo de conteo. No dos fichas, números ni texto; el nombre del objeto no debe convertirse en respuesta exigida. No fichas extra parcialmente cortadas. No figuras que sugieran otra cantidad por solapamiento. No generar sumas, números o totales a ojo; el cálculo se realiza con datos controlados. No inferir treinta años de un rostro. No intentar que la IA produzca cien objetos correctos de una vez ni saturar una foto. No pedir al modelo que dibuje varias cantidades simultáneamente. No pedir mil objetos generados ni una multitud como sustituto de mil. No persona anciana como imagen de setenta y cinco. No producir una cantidad aleatoria ni añadir signo de pregunta; la pregunta debe permanecer sin respuesta inventada. No reloj o edad de persona como definición del número. No una persona que parezca de cierta edad ni número pintado por IA. Sin número impreso ni cuatro objetos dibujados de forma no verificable. Una cantidad visible no distingue 多少 de 几; no responder automáticamente al ejercicio.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Sin número impreso ni cuatro objetos dibujados de forma no verificable.

**Composición posterior controlada:** Componer exactamente 4 copias y verificar el total.

### 五 · wǔ — cinco

ID: `v-五` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-cf488b05a0864388` · Perfil: `structured`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Genera únicamente elementos fotográficos recortables para el apoyo estructurado descrito. Las cantidades exactas, flechas, relaciones temporales, textos y marcas de referencia se componen después de forma determinista; no se confía su precisión al generador de imagen. Nada de números, letras, diagramas falsamente completos o fechas inventadas dentro del recurso base.

ESCENA ESPECÍFICA: Una única ficha de conteo de madera lisa y redondeada, con volumen real y sin marcas, fotografiada como elemento aislado completo.

CONTROL SEMÁNTICO: Dos objetos no distinguen 二 de 两; no confiar el conteo al modelo. La foto de dos unidades no distingue 两 de 二; el clasificador y la construcción son obligatorios. No cantidad aproximada ni cifras generadas. No cantidad aproximada ni símbolos numéricos añadidos por IA. No decena aproximada ni etiqueta numérica inventada. No dedos de manos generadas como único mecanismo de conteo. No dos fichas, números ni texto; el nombre del objeto no debe convertirse en respuesta exigida. No fichas extra parcialmente cortadas. No figuras que sugieran otra cantidad por solapamiento. No generar sumas, números o totales a ojo; el cálculo se realiza con datos controlados. No inferir treinta años de un rostro. No intentar que la IA produzca cien objetos correctos de una vez ni saturar una foto. No pedir al modelo que dibuje varias cantidades simultáneamente. No pedir mil objetos generados ni una multitud como sustituto de mil. No persona anciana como imagen de setenta y cinco. No producir una cantidad aleatoria ni añadir signo de pregunta; la pregunta debe permanecer sin respuesta inventada. No reloj o edad de persona como definición del número. No una persona que parezca de cierta edad ni número pintado por IA. Sin número impreso ni cuatro objetos dibujados de forma no verificable. Una cantidad visible no distingue 多少 de 几; no responder automáticamente al ejercicio.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No dedos de manos generadas como único mecanismo de conteo.

**Composición posterior controlada:** Componer exactamente 5 copias, agrupadas con claridad y conteo verificable.

### 六 · liù — seis

ID: `v-六` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-cf488b05a0864388` · Perfil: `structured`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Genera únicamente elementos fotográficos recortables para el apoyo estructurado descrito. Las cantidades exactas, flechas, relaciones temporales, textos y marcas de referencia se componen después de forma determinista; no se confía su precisión al generador de imagen. Nada de números, letras, diagramas falsamente completos o fechas inventadas dentro del recurso base.

ESCENA ESPECÍFICA: Una única ficha de conteo de madera lisa y redondeada, con volumen real y sin marcas, fotografiada como elemento aislado completo.

CONTROL SEMÁNTICO: Dos objetos no distinguen 二 de 两; no confiar el conteo al modelo. La foto de dos unidades no distingue 两 de 二; el clasificador y la construcción son obligatorios. No cantidad aproximada ni cifras generadas. No cantidad aproximada ni símbolos numéricos añadidos por IA. No decena aproximada ni etiqueta numérica inventada. No dedos de manos generadas como único mecanismo de conteo. No dos fichas, números ni texto; el nombre del objeto no debe convertirse en respuesta exigida. No fichas extra parcialmente cortadas. No figuras que sugieran otra cantidad por solapamiento. No generar sumas, números o totales a ojo; el cálculo se realiza con datos controlados. No inferir treinta años de un rostro. No intentar que la IA produzca cien objetos correctos de una vez ni saturar una foto. No pedir al modelo que dibuje varias cantidades simultáneamente. No pedir mil objetos generados ni una multitud como sustituto de mil. No persona anciana como imagen de setenta y cinco. No producir una cantidad aleatoria ni añadir signo de pregunta; la pregunta debe permanecer sin respuesta inventada. No reloj o edad de persona como definición del número. No una persona que parezca de cierta edad ni número pintado por IA. Sin número impreso ni cuatro objetos dibujados de forma no verificable. Una cantidad visible no distingue 多少 de 几; no responder automáticamente al ejercicio.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No cantidad aproximada ni cifras generadas.

**Composición posterior controlada:** Componer exactamente 6 copias y verificar el total.

### 七 · qī — siete

ID: `v-七` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-cf488b05a0864388` · Perfil: `structured`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Genera únicamente elementos fotográficos recortables para el apoyo estructurado descrito. Las cantidades exactas, flechas, relaciones temporales, textos y marcas de referencia se componen después de forma determinista; no se confía su precisión al generador de imagen. Nada de números, letras, diagramas falsamente completos o fechas inventadas dentro del recurso base.

ESCENA ESPECÍFICA: Una única ficha de conteo de madera lisa y redondeada, con volumen real y sin marcas, fotografiada como elemento aislado completo.

CONTROL SEMÁNTICO: Dos objetos no distinguen 二 de 两; no confiar el conteo al modelo. La foto de dos unidades no distingue 两 de 二; el clasificador y la construcción son obligatorios. No cantidad aproximada ni cifras generadas. No cantidad aproximada ni símbolos numéricos añadidos por IA. No decena aproximada ni etiqueta numérica inventada. No dedos de manos generadas como único mecanismo de conteo. No dos fichas, números ni texto; el nombre del objeto no debe convertirse en respuesta exigida. No fichas extra parcialmente cortadas. No figuras que sugieran otra cantidad por solapamiento. No generar sumas, números o totales a ojo; el cálculo se realiza con datos controlados. No inferir treinta años de un rostro. No intentar que la IA produzca cien objetos correctos de una vez ni saturar una foto. No pedir al modelo que dibuje varias cantidades simultáneamente. No pedir mil objetos generados ni una multitud como sustituto de mil. No persona anciana como imagen de setenta y cinco. No producir una cantidad aleatoria ni añadir signo de pregunta; la pregunta debe permanecer sin respuesta inventada. No reloj o edad de persona como definición del número. No una persona que parezca de cierta edad ni número pintado por IA. Sin número impreso ni cuatro objetos dibujados de forma no verificable. Una cantidad visible no distingue 多少 de 几; no responder automáticamente al ejercicio.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No cantidad aproximada ni símbolos numéricos añadidos por IA.

**Composición posterior controlada:** Componer exactamente 7 copias y verificar el total.

### 八 · bā — ocho

ID: `v-八` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-cf488b05a0864388` · Perfil: `structured`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Genera únicamente elementos fotográficos recortables para el apoyo estructurado descrito. Las cantidades exactas, flechas, relaciones temporales, textos y marcas de referencia se componen después de forma determinista; no se confía su precisión al generador de imagen. Nada de números, letras, diagramas falsamente completos o fechas inventadas dentro del recurso base.

ESCENA ESPECÍFICA: Una única ficha de conteo de madera lisa y redondeada, con volumen real y sin marcas, fotografiada como elemento aislado completo.

CONTROL SEMÁNTICO: Dos objetos no distinguen 二 de 两; no confiar el conteo al modelo. La foto de dos unidades no distingue 两 de 二; el clasificador y la construcción son obligatorios. No cantidad aproximada ni cifras generadas. No cantidad aproximada ni símbolos numéricos añadidos por IA. No decena aproximada ni etiqueta numérica inventada. No dedos de manos generadas como único mecanismo de conteo. No dos fichas, números ni texto; el nombre del objeto no debe convertirse en respuesta exigida. No fichas extra parcialmente cortadas. No figuras que sugieran otra cantidad por solapamiento. No generar sumas, números o totales a ojo; el cálculo se realiza con datos controlados. No inferir treinta años de un rostro. No intentar que la IA produzca cien objetos correctos de una vez ni saturar una foto. No pedir al modelo que dibuje varias cantidades simultáneamente. No pedir mil objetos generados ni una multitud como sustituto de mil. No persona anciana como imagen de setenta y cinco. No producir una cantidad aleatoria ni añadir signo de pregunta; la pregunta debe permanecer sin respuesta inventada. No reloj o edad de persona como definición del número. No una persona que parezca de cierta edad ni número pintado por IA. Sin número impreso ni cuatro objetos dibujados de forma no verificable. Una cantidad visible no distingue 多少 de 几; no responder automáticamente al ejercicio.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No figuras que sugieran otra cantidad por solapamiento.

**Composición posterior controlada:** Componer exactamente 8 copias sin ocultar unidades y verificar el total.

### 九 · jiǔ — nueve

ID: `v-九` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-cf488b05a0864388` · Perfil: `structured`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Genera únicamente elementos fotográficos recortables para el apoyo estructurado descrito. Las cantidades exactas, flechas, relaciones temporales, textos y marcas de referencia se componen después de forma determinista; no se confía su precisión al generador de imagen. Nada de números, letras, diagramas falsamente completos o fechas inventadas dentro del recurso base.

ESCENA ESPECÍFICA: Una única ficha de conteo de madera lisa y redondeada, con volumen real y sin marcas, fotografiada como elemento aislado completo.

CONTROL SEMÁNTICO: Dos objetos no distinguen 二 de 两; no confiar el conteo al modelo. La foto de dos unidades no distingue 两 de 二; el clasificador y la construcción son obligatorios. No cantidad aproximada ni cifras generadas. No cantidad aproximada ni símbolos numéricos añadidos por IA. No decena aproximada ni etiqueta numérica inventada. No dedos de manos generadas como único mecanismo de conteo. No dos fichas, números ni texto; el nombre del objeto no debe convertirse en respuesta exigida. No fichas extra parcialmente cortadas. No figuras que sugieran otra cantidad por solapamiento. No generar sumas, números o totales a ojo; el cálculo se realiza con datos controlados. No inferir treinta años de un rostro. No intentar que la IA produzca cien objetos correctos de una vez ni saturar una foto. No pedir al modelo que dibuje varias cantidades simultáneamente. No pedir mil objetos generados ni una multitud como sustituto de mil. No persona anciana como imagen de setenta y cinco. No producir una cantidad aleatoria ni añadir signo de pregunta; la pregunta debe permanecer sin respuesta inventada. No reloj o edad de persona como definición del número. No una persona que parezca de cierta edad ni número pintado por IA. Sin número impreso ni cuatro objetos dibujados de forma no verificable. Una cantidad visible no distingue 多少 de 几; no responder automáticamente al ejercicio.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No fichas extra parcialmente cortadas.

**Composición posterior controlada:** Componer exactamente 9 copias y verificar el total.

### 十 · shí — diez

ID: `v-十` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-cf488b05a0864388` · Perfil: `structured`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Genera únicamente elementos fotográficos recortables para el apoyo estructurado descrito. Las cantidades exactas, flechas, relaciones temporales, textos y marcas de referencia se componen después de forma determinista; no se confía su precisión al generador de imagen. Nada de números, letras, diagramas falsamente completos o fechas inventadas dentro del recurso base.

ESCENA ESPECÍFICA: Una única ficha de conteo de madera lisa y redondeada, con volumen real y sin marcas, fotografiada como elemento aislado completo.

CONTROL SEMÁNTICO: Dos objetos no distinguen 二 de 两; no confiar el conteo al modelo. La foto de dos unidades no distingue 两 de 二; el clasificador y la construcción son obligatorios. No cantidad aproximada ni cifras generadas. No cantidad aproximada ni símbolos numéricos añadidos por IA. No decena aproximada ni etiqueta numérica inventada. No dedos de manos generadas como único mecanismo de conteo. No dos fichas, números ni texto; el nombre del objeto no debe convertirse en respuesta exigida. No fichas extra parcialmente cortadas. No figuras que sugieran otra cantidad por solapamiento. No generar sumas, números o totales a ojo; el cálculo se realiza con datos controlados. No inferir treinta años de un rostro. No intentar que la IA produzca cien objetos correctos de una vez ni saturar una foto. No pedir al modelo que dibuje varias cantidades simultáneamente. No pedir mil objetos generados ni una multitud como sustituto de mil. No persona anciana como imagen de setenta y cinco. No producir una cantidad aleatoria ni añadir signo de pregunta; la pregunta debe permanecer sin respuesta inventada. No reloj o edad de persona como definición del número. No una persona que parezca de cierta edad ni número pintado por IA. Sin número impreso ni cuatro objetos dibujados de forma no verificable. Una cantidad visible no distingue 多少 de 几; no responder automáticamente al ejercicio.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No decena aproximada ni etiqueta numérica inventada.

**Composición posterior controlada:** Componer un grupo de exactamente 10 unidades y conservar su conteo verificable.

### 百 · bǎi — cien

ID: `v-百` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-cf488b05a0864388` · Perfil: `structured`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Genera únicamente elementos fotográficos recortables para el apoyo estructurado descrito. Las cantidades exactas, flechas, relaciones temporales, textos y marcas de referencia se componen después de forma determinista; no se confía su precisión al generador de imagen. Nada de números, letras, diagramas falsamente completos o fechas inventadas dentro del recurso base.

ESCENA ESPECÍFICA: Una única ficha de conteo de madera lisa y redondeada, con volumen real y sin marcas, fotografiada como elemento aislado completo.

CONTROL SEMÁNTICO: Dos objetos no distinguen 二 de 两; no confiar el conteo al modelo. La foto de dos unidades no distingue 两 de 二; el clasificador y la construcción son obligatorios. No cantidad aproximada ni cifras generadas. No cantidad aproximada ni símbolos numéricos añadidos por IA. No decena aproximada ni etiqueta numérica inventada. No dedos de manos generadas como único mecanismo de conteo. No dos fichas, números ni texto; el nombre del objeto no debe convertirse en respuesta exigida. No fichas extra parcialmente cortadas. No figuras que sugieran otra cantidad por solapamiento. No generar sumas, números o totales a ojo; el cálculo se realiza con datos controlados. No inferir treinta años de un rostro. No intentar que la IA produzca cien objetos correctos de una vez ni saturar una foto. No pedir al modelo que dibuje varias cantidades simultáneamente. No pedir mil objetos generados ni una multitud como sustituto de mil. No persona anciana como imagen de setenta y cinco. No producir una cantidad aleatoria ni añadir signo de pregunta; la pregunta debe permanecer sin respuesta inventada. No reloj o edad de persona como definición del número. No una persona que parezca de cierta edad ni número pintado por IA. Sin número impreso ni cuatro objetos dibujados de forma no verificable. Una cantidad visible no distingue 多少 de 几; no responder automáticamente al ejercicio.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No intentar que la IA produzca cien objetos correctos de una vez ni saturar una foto.

**Composición posterior controlada:** Componer 10 grupos de 10 de forma determinista o una representación de centena validada; el valor se explica con texto real.

### 千 · qiān — mil

ID: `v-千` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-cf488b05a0864388` · Perfil: `structured`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Genera únicamente elementos fotográficos recortables para el apoyo estructurado descrito. Las cantidades exactas, flechas, relaciones temporales, textos y marcas de referencia se componen después de forma determinista; no se confía su precisión al generador de imagen. Nada de números, letras, diagramas falsamente completos o fechas inventadas dentro del recurso base.

ESCENA ESPECÍFICA: Una única ficha de conteo de madera lisa y redondeada, con volumen real y sin marcas, fotografiada como elemento aislado completo.

CONTROL SEMÁNTICO: Dos objetos no distinguen 二 de 两; no confiar el conteo al modelo. La foto de dos unidades no distingue 两 de 二; el clasificador y la construcción son obligatorios. No cantidad aproximada ni cifras generadas. No cantidad aproximada ni símbolos numéricos añadidos por IA. No decena aproximada ni etiqueta numérica inventada. No dedos de manos generadas como único mecanismo de conteo. No dos fichas, números ni texto; el nombre del objeto no debe convertirse en respuesta exigida. No fichas extra parcialmente cortadas. No figuras que sugieran otra cantidad por solapamiento. No generar sumas, números o totales a ojo; el cálculo se realiza con datos controlados. No inferir treinta años de un rostro. No intentar que la IA produzca cien objetos correctos de una vez ni saturar una foto. No pedir al modelo que dibuje varias cantidades simultáneamente. No pedir mil objetos generados ni una multitud como sustituto de mil. No persona anciana como imagen de setenta y cinco. No producir una cantidad aleatoria ni añadir signo de pregunta; la pregunta debe permanecer sin respuesta inventada. No reloj o edad de persona como definición del número. No una persona que parezca de cierta edad ni número pintado por IA. Sin número impreso ni cuatro objetos dibujados de forma no verificable. Una cantidad visible no distingue 多少 de 几; no responder automáticamente al ejercicio.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No pedir mil objetos generados ni una multitud como sustituto de mil.

**Composición posterior controlada:** Usar agrupación decimal controlada de 10 centenas y representación abstracta validada; no fotografía densa de mil piezas.

### 多少 · duōshao — cuánto; cuántos

ID: `v-多少` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-cf488b05a0864388` · Perfil: `structured`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Genera únicamente elementos fotográficos recortables para el apoyo estructurado descrito. Las cantidades exactas, flechas, relaciones temporales, textos y marcas de referencia se componen después de forma determinista; no se confía su precisión al generador de imagen. Nada de números, letras, diagramas falsamente completos o fechas inventadas dentro del recurso base.

ESCENA ESPECÍFICA: Una única ficha de conteo de madera lisa y redondeada, con volumen real y sin marcas, fotografiada como elemento aislado completo.

CONTROL SEMÁNTICO: Dos objetos no distinguen 二 de 两; no confiar el conteo al modelo. La foto de dos unidades no distingue 两 de 二; el clasificador y la construcción son obligatorios. No cantidad aproximada ni cifras generadas. No cantidad aproximada ni símbolos numéricos añadidos por IA. No decena aproximada ni etiqueta numérica inventada. No dedos de manos generadas como único mecanismo de conteo. No dos fichas, números ni texto; el nombre del objeto no debe convertirse en respuesta exigida. No fichas extra parcialmente cortadas. No figuras que sugieran otra cantidad por solapamiento. No generar sumas, números o totales a ojo; el cálculo se realiza con datos controlados. No inferir treinta años de un rostro. No intentar que la IA produzca cien objetos correctos de una vez ni saturar una foto. No pedir al modelo que dibuje varias cantidades simultáneamente. No pedir mil objetos generados ni una multitud como sustituto de mil. No persona anciana como imagen de setenta y cinco. No producir una cantidad aleatoria ni añadir signo de pregunta; la pregunta debe permanecer sin respuesta inventada. No reloj o edad de persona como definición del número. No una persona que parezca de cierta edad ni número pintado por IA. Sin número impreso ni cuatro objetos dibujados de forma no verificable. Una cantidad visible no distingue 多少 de 几; no responder automáticamente al ejercicio.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Una cantidad visible no distingue 多少 de 几; no responder automáticamente al ejercicio.

**Composición posterior controlada:** Preparar un conjunto controlado según la frase y su pregunta de cantidad. La forma interrogativa la añade la aplicación.

### 本 · běn — clasificador de libros

ID: `v-本` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-96629c1bcbcf15e6` · Perfil: `structured`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Genera únicamente elementos fotográficos recortables para el apoyo estructurado descrito. Las cantidades exactas, flechas, relaciones temporales, textos y marcas de referencia se componen después de forma determinista; no se confía su precisión al generador de imagen. Nada de números, letras, diagramas falsamente completos o fechas inventadas dentro del recurso base.

ESCENA ESPECÍFICA: Un libro físico completo de cubierta lisa y páginas visibles, sin título, ilustrado como objeto recortado reutilizable.

CONTROL SEMÁNTICO: No árbol o raíz por el carácter; una foto de libro sola corresponde al sustantivo, no al clasificador.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No árbol o raíz por el carácter; una foto de libro sola corresponde al sustantivo, no al clasificador.

**Composición posterior controlada:** Repetir el libro en cantidad exacta según el ejemplo con 本; clasificador y frase se muestran como texto real.

### 二十 · èrshí — veinte

ID: `v-二十` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-cf488b05a0864388` · Perfil: `structured`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Genera únicamente elementos fotográficos recortables para el apoyo estructurado descrito. Las cantidades exactas, flechas, relaciones temporales, textos y marcas de referencia se componen después de forma determinista; no se confía su precisión al generador de imagen. Nada de números, letras, diagramas falsamente completos o fechas inventadas dentro del recurso base.

ESCENA ESPECÍFICA: Una única ficha de conteo de madera lisa y redondeada, con volumen real y sin marcas, fotografiada como elemento aislado completo.

CONTROL SEMÁNTICO: Dos objetos no distinguen 二 de 两; no confiar el conteo al modelo. La foto de dos unidades no distingue 两 de 二; el clasificador y la construcción son obligatorios. No cantidad aproximada ni cifras generadas. No cantidad aproximada ni símbolos numéricos añadidos por IA. No decena aproximada ni etiqueta numérica inventada. No dedos de manos generadas como único mecanismo de conteo. No dos fichas, números ni texto; el nombre del objeto no debe convertirse en respuesta exigida. No fichas extra parcialmente cortadas. No figuras que sugieran otra cantidad por solapamiento. No generar sumas, números o totales a ojo; el cálculo se realiza con datos controlados. No inferir treinta años de un rostro. No intentar que la IA produzca cien objetos correctos de una vez ni saturar una foto. No pedir al modelo que dibuje varias cantidades simultáneamente. No pedir mil objetos generados ni una multitud como sustituto de mil. No persona anciana como imagen de setenta y cinco. No producir una cantidad aleatoria ni añadir signo de pregunta; la pregunta debe permanecer sin respuesta inventada. No reloj o edad de persona como definición del número. No una persona que parezca de cierta edad ni número pintado por IA. Sin número impreso ni cuatro objetos dibujados de forma no verificable. Una cantidad visible no distingue 多少 de 几; no responder automáticamente al ejercicio.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No reloj o edad de persona como definición del número.

**Composición posterior controlada:** Componer 2 grupos exactos de 10 unidades y comprobar 20 en total.

### 三十 · sānshí — treinta

ID: `v-三十` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-cf488b05a0864388` · Perfil: `structured`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Genera únicamente elementos fotográficos recortables para el apoyo estructurado descrito. Las cantidades exactas, flechas, relaciones temporales, textos y marcas de referencia se componen después de forma determinista; no se confía su precisión al generador de imagen. Nada de números, letras, diagramas falsamente completos o fechas inventadas dentro del recurso base.

ESCENA ESPECÍFICA: Una única ficha de conteo de madera lisa y redondeada, con volumen real y sin marcas, fotografiada como elemento aislado completo.

CONTROL SEMÁNTICO: Dos objetos no distinguen 二 de 两; no confiar el conteo al modelo. La foto de dos unidades no distingue 两 de 二; el clasificador y la construcción son obligatorios. No cantidad aproximada ni cifras generadas. No cantidad aproximada ni símbolos numéricos añadidos por IA. No decena aproximada ni etiqueta numérica inventada. No dedos de manos generadas como único mecanismo de conteo. No dos fichas, números ni texto; el nombre del objeto no debe convertirse en respuesta exigida. No fichas extra parcialmente cortadas. No figuras que sugieran otra cantidad por solapamiento. No generar sumas, números o totales a ojo; el cálculo se realiza con datos controlados. No inferir treinta años de un rostro. No intentar que la IA produzca cien objetos correctos de una vez ni saturar una foto. No pedir al modelo que dibuje varias cantidades simultáneamente. No pedir mil objetos generados ni una multitud como sustituto de mil. No persona anciana como imagen de setenta y cinco. No producir una cantidad aleatoria ni añadir signo de pregunta; la pregunta debe permanecer sin respuesta inventada. No reloj o edad de persona como definición del número. No una persona que parezca de cierta edad ni número pintado por IA. Sin número impreso ni cuatro objetos dibujados de forma no verificable. Una cantidad visible no distingue 多少 de 几; no responder automáticamente al ejercicio.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No inferir treinta años de un rostro.

**Composición posterior controlada:** Componer 3 grupos exactos de 10 unidades y comprobar 30 en total.

### 二十五 · èrshíwǔ — veinticinco

ID: `v-二十五` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-cf488b05a0864388` · Perfil: `structured`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Genera únicamente elementos fotográficos recortables para el apoyo estructurado descrito. Las cantidades exactas, flechas, relaciones temporales, textos y marcas de referencia se componen después de forma determinista; no se confía su precisión al generador de imagen. Nada de números, letras, diagramas falsamente completos o fechas inventadas dentro del recurso base.

ESCENA ESPECÍFICA: Una única ficha de conteo de madera lisa y redondeada, con volumen real y sin marcas, fotografiada como elemento aislado completo.

CONTROL SEMÁNTICO: Dos objetos no distinguen 二 de 两; no confiar el conteo al modelo. La foto de dos unidades no distingue 两 de 二; el clasificador y la construcción son obligatorios. No cantidad aproximada ni cifras generadas. No cantidad aproximada ni símbolos numéricos añadidos por IA. No decena aproximada ni etiqueta numérica inventada. No dedos de manos generadas como único mecanismo de conteo. No dos fichas, números ni texto; el nombre del objeto no debe convertirse en respuesta exigida. No fichas extra parcialmente cortadas. No figuras que sugieran otra cantidad por solapamiento. No generar sumas, números o totales a ojo; el cálculo se realiza con datos controlados. No inferir treinta años de un rostro. No intentar que la IA produzca cien objetos correctos de una vez ni saturar una foto. No pedir al modelo que dibuje varias cantidades simultáneamente. No pedir mil objetos generados ni una multitud como sustituto de mil. No persona anciana como imagen de setenta y cinco. No producir una cantidad aleatoria ni añadir signo de pregunta; la pregunta debe permanecer sin respuesta inventada. No reloj o edad de persona como definición del número. No una persona que parezca de cierta edad ni número pintado por IA. Sin número impreso ni cuatro objetos dibujados de forma no verificable. Una cantidad visible no distingue 多少 de 几; no responder automáticamente al ejercicio.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No una persona que parezca de cierta edad ni número pintado por IA.

**Composición posterior controlada:** Componer 2 decenas y 5 unidades; verificar 25 en total.

### 七十五 · qīshíwǔ — setenta y cinco

ID: `v-七十五` · Riesgo: `medium` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-cf488b05a0864388` · Perfil: `structured`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Genera únicamente elementos fotográficos recortables para el apoyo estructurado descrito. Las cantidades exactas, flechas, relaciones temporales, textos y marcas de referencia se componen después de forma determinista; no se confía su precisión al generador de imagen. Nada de números, letras, diagramas falsamente completos o fechas inventadas dentro del recurso base.

ESCENA ESPECÍFICA: Una única ficha de conteo de madera lisa y redondeada, con volumen real y sin marcas, fotografiada como elemento aislado completo.

CONTROL SEMÁNTICO: Dos objetos no distinguen 二 de 两; no confiar el conteo al modelo. La foto de dos unidades no distingue 两 de 二; el clasificador y la construcción son obligatorios. No cantidad aproximada ni cifras generadas. No cantidad aproximada ni símbolos numéricos añadidos por IA. No decena aproximada ni etiqueta numérica inventada. No dedos de manos generadas como único mecanismo de conteo. No dos fichas, números ni texto; el nombre del objeto no debe convertirse en respuesta exigida. No fichas extra parcialmente cortadas. No figuras que sugieran otra cantidad por solapamiento. No generar sumas, números o totales a ojo; el cálculo se realiza con datos controlados. No inferir treinta años de un rostro. No intentar que la IA produzca cien objetos correctos de una vez ni saturar una foto. No pedir al modelo que dibuje varias cantidades simultáneamente. No pedir mil objetos generados ni una multitud como sustituto de mil. No persona anciana como imagen de setenta y cinco. No producir una cantidad aleatoria ni añadir signo de pregunta; la pregunta debe permanecer sin respuesta inventada. No reloj o edad de persona como definición del número. No una persona que parezca de cierta edad ni número pintado por IA. Sin número impreso ni cuatro objetos dibujados de forma no verificable. Una cantidad visible no distingue 多少 de 几; no responder automáticamente al ejercicio.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No persona anciana como imagen de setenta y cinco.

**Composición posterior controlada:** Componer 7 decenas y 5 unidades; verificar 75 en total sin unidades ocultas.

## phrase_context

### 好 · hǎo — bueno; bien; vale

ID: `v-好` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-43f09d0bfe9a5fe3` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Dos adultos ficticios conversan; uno responde con expresión tranquila de bienestar y gesto suave de conformidad, sin entusiasmo desproporcionado.

CONTROL SEMÁNTICO: Bueno, bien y vale son usos distintos: seleccionar un ejemplo compatible, no una sonrisa como definición universal.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Bueno, bien y vale son usos distintos: seleccionar un ejemplo compatible, no una sonrisa como definición universal.

### 叫 · jiào — llamarse; llamar

ID: `v-叫` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-ea27818c658c350c` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Una persona adulta ficticia se presenta a otra señalándose el pecho, mientras la segunda escucha interesada; pequeño intercambio social cotidiano.

CONTROL SEMÁNTICO: No tarjeta con nombre inventado ni retrato que supuestamente identifique un nombre. Representar llamarse, no gritar, telefonear o invocar a alguien; el nombre lo aporta el texto real del ejemplo.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Representar llamarse, no gritar, telefonear o invocar a alguien; el nombre lo aporta el texto real del ejemplo.

### 请问 · qǐngwèn — podría preguntar; disculpe

ID: `v-请问` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-83baf311ff8c5536` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Una persona adulta solicita amablemente atención a otra antes de preguntar, con mano abierta, ligera inclinación y expresión cortés, sin señales escritas.

CONTROL SEMÁNTICO: No interrogatorio o saludo genérico como significado único; la cortesía está en la frase.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No interrogatorio o saludo genérico como significado único; la cortesía está en la frase.

### 请 · qǐng — por favor; solicitar; invitar

ID: `v-请` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-48068ab4513abab6` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Una persona adulta invita cortésmente a otra a sentarse en una silla sencilla, indicando el asiento con mano abierta y gesto acogedor.

CONTROL SEMÁNTICO: Solo apoyar el uso de invitación del ejemplo; no afirmar que todas las apariciones de por favor implican sentarse.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Solo apoyar el uso de invitación del ejemplo; no afirmar que todas las apariciones de por favor implican sentarse.

### 什么 · shénme — qué

ID: `v-什么` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-8bcdd42df33bf211` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Una persona adulta pregunta a otra por el contenido de dos objetos cotidianos cercanos, mirando el referente y extendiendo una mano interrogativa.

CONTROL SEMÁNTICO: Sin signo de pregunta ni etiqueta; la escena no distingue qué de cuál sin la oración.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Sin signo de pregunta ni etiqueta; la escena no distingue qué de cuál sin la oración.

### 名字 · míngzi — nombre

ID: `v-名字` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-ea27818c658c350c` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Una persona adulta ficticia se presenta a otra señalándose el pecho, mientras la segunda escucha interesada; pequeño intercambio social cotidiano.

CONTROL SEMÁNTICO: No tarjeta con nombre inventado ni retrato que supuestamente identifique un nombre. Representar llamarse, no gritar, telefonear o invocar a alguien; el nombre lo aporta el texto real del ejemplo.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No tarjeta con nombre inventado ni retrato que supuestamente identifique un nombre.

### 姓 · xìng — apellido; apellidarse

ID: `v-姓` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-1779a24ba29a5021` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Dos adultos ficticios intercambian una presentación formal con una tarjeta totalmente en blanco sostenida entre ambos.

CONTROL SEMÁNTICO: Apellido respetuoso, no caro: no dinero, joyas, precios ni datos personales. No escribir nombres; distinguir apellido de nombre de pila mediante el enunciado, no la imagen. No escribir un apellido inventado ni inferir tratamiento por edad; pregunta textual necesaria.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No escribir nombres; distinguir apellido de nombre de pila mediante el enunciado, no la imagen.

### 很 · hěn — muy

ID: `v-很` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-6b73731404257bcb` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Una persona expresa alegría clara pero natural al escuchar a su interlocutor, con sonrisa espontánea y manos relajadas.

CONTROL SEMÁNTICO: La intensidad depende de la frase; no usar un medidor dibujado ni convertir muy en sonrisa.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** La intensidad depende de la frase; no usar un medidor dibujado ni convertir muy en sonrisa.

### 也 · yě — también

ID: `v-也` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-7d447aa741290d60` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Dos adultos ficticios participan sucesivamente en la misma acción sencilla de estudiar, cada uno con un libro, mientras uno indica que comparte la actividad del otro.

CONTROL SEMÁNTICO: La coincidencia necesita dos proposiciones; no usarla para exigir también frente a todos.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** La coincidencia necesita dos proposiciones; no usarla para exigir también frente a todos.

### 在 · zài — estar

ID: `v-在` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-ec0735cff1755c75` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Una persona adulta permanece visible junto a una silla y marco de puerta sencillos, mientras otra pregunta por su presencia.

CONTROL SEMÁNTICO: Apoya estar o presencia; no mezclar con todos los usos aspectuales de 在 ni dibujar la palabra.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Apoya estar o presencia; no mezclar con todos los usos aspectuales de 在 ni dibujar la palabra.

### 最近 · zuìjìn — últimamente; recientemente

ID: `v-最近` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-4ecc4d4d3468361d` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: La misma persona adulta aparece en una pequeña secuencia de actividades recientes de estudio, trabajo y descanso; unidades separables sin rótulos o fechas.

CONTROL SEMÁNTICO: El periodo reciente se establece fuera del recurso; no inventar una fecha fija ni confundir con ahora.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** El periodo reciente se establece fuera del recurso; no inventar una fecha fija ni confundir con ahora.

### 怎么样 · zěnmeyàng — cómo es; cómo está/están

ID: `v-怎么样` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-4d42b357eebab969` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Dos adultos ficticios conversan; uno pregunta con atención y el otro responde con un gesto moderado sobre cómo se siente.

CONTROL SEMÁNTICO: No una emoción extrema como respuesta única; el recurso apoya preguntar por estado o valoración.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No una emoción extrema como respuesta única; el recurso apoya preguntar por estado o valoración.

### 太 · tài — demasiado; extremadamente

ID: `v-太` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-8fe89b7f45a7a80a` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Una persona adulta muestra estar excesivamente ocupada al intentar atender varias tareas sencillas a la vez, con expresión de sobrecarga moderada y objetos plausibles.

CONTROL SEMÁNTICO: El exceso depende del ejemplo; no dolor ni tamaño físico como equivalencia de demasiado.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** El exceso depende del ejemplo; no dolor ni tamaño físico como equivalencia de demasiado.

### 还行 · hái xíng — no está mal

ID: `v-还行` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-bb9427050cb9d618` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Una persona adulta responde a otra con gesto de valoración intermedia: mano horizontal movida ligeramente y expresión de aceptación moderada, sin disgusto extremo.

CONTROL SEMÁNTICO: La imagen no distingue expresiones equivalentes de regular o más o menos; usar el enunciado. No caballos ni tigres: es una expresión idiomática. No exigir esta forma frente a 还行 mediante la misma imagen.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** La imagen no distingue expresiones equivalentes de regular o más o menos; usar el enunciado.

### 马马虎虎 · mǎmǎhūhū — más o menos; regular

ID: `v-马马虎虎` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-bb9427050cb9d618` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Una persona adulta responde a otra con gesto de valoración intermedia: mano horizontal movida ligeramente y expresión de aceptación moderada, sin disgusto extremo.

CONTROL SEMÁNTICO: La imagen no distingue expresiones equivalentes de regular o más o menos; usar el enunciado. No caballos ni tigres: es una expresión idiomática. No exigir esta forma frente a 还行 mediante la misma imagen.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No caballos ni tigres: es una expresión idiomática. No exigir esta forma frente a 还行 mediante la misma imagen.

### 早 · zǎo — temprano

ID: `v-早` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-190ef362a59ca083` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Una persona llega a una cita antes que otra, junto a una silla vacía y reloj de esfera lisa para una referencia posterior.

CONTROL SEMÁNTICO: Temprano no equivale siempre a amanecer; las horas o el saludo deben establecerse con el contexto real.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Temprano no equivale siempre a amanecer; las horas o el saludo deben establecerse con el contexto real.

### 是 · shì — ser; es; son

ID: `v-是` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-843d9771988e3b09` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Una persona presenta a otra indicando con mano abierta quién es, mientras un tercero escucha; recorte limpio sin nombres escritos.

CONTROL SEMÁNTICO: La cópula no tiene objeto propio: una presentación acompaña una frase y no define todos sus usos.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** La cópula no tiene objeto propio: una presentación acompaña una frase y no define todos sus usos.

### 刚 · gāng — recién

ID: `v-刚` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-6fa23794d3d2208a` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Una persona recién llegada deja su maleta en el suelo junto a otra que la recibe; un gesto de transición sugiere llegada reciente.

CONTROL SEMÁNTICO: El componente reciente se expresa con el ejemplo, no una marca temporal inventada. El instante reciente necesita apoyo de la frase; no cuantificar minutos ni confundir con la acción de llegar solamente.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** El instante reciente necesita apoyo de la frase; no cuantificar minutos ni confundir con la acción de llegar solamente.

### 贵姓 · guìxìng — el apellido de uno; su apellido

ID: `v-贵姓` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-1779a24ba29a5021` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Dos adultos ficticios intercambian una presentación formal con una tarjeta totalmente en blanco sostenida entre ambos.

CONTROL SEMÁNTICO: Apellido respetuoso, no caro: no dinero, joyas, precios ni datos personales. No escribir nombres; distinguir apellido de nombre de pila mediante el enunciado, no la imagen. No escribir un apellido inventado ni inferir tratamiento por edad; pregunta textual necesaria.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Apellido respetuoso, no caro: no dinero, joyas, precios ni datos personales.

### 哪 · nǎ — cuál

ID: `v-哪` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-b8da06eb6ddd853f` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Una persona adulta observa dos tarjetas u objetos semejantes y pide al interlocutor identificar uno mediante mano abierta.

CONTROL SEMÁNTICO: No resolver automáticamente cuál; la pregunta y selección singular se establecen con el ejemplo. Sin flecha que resuelva la respuesta; la frase distingue cuál de qué y de cuántos.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Sin flecha que resuelva la respuesta; la frase distingue cuál de qué y de cuántos.

### 汉语 · Hànyǔ — idioma chino; generalmente se refiere al mandarín

ID: `v-汉语` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-3e66c1f13219bd9c` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Dos adultos ficticios practican una lengua con un libro sin texto legible y audífonos sobre una pequeña mesa; uno habla y el otro escucha.

CONTROL SEMÁNTICO: Apoya lenguaje como actividad, no identifica un sistema lingüístico sin el contenido verbal. Extranjero es relativo al hablante; no identificar una lengua como universalmente extranjera. La lengua inglesa la identifica el enunciado o audio, no bandera o cara del hablante. La variedad estándar de mandarín no es visible; requiere contenido oral y lingüístico real. No Torre Eiffel o bandera como definición de francés; la frase o el audio identifican la lengua. No apariencia de los hablantes ni bandera; distinguir la lengua mediante el enunciado real. No bandera ni apariencia como idioma; el contenido lingüístico de la aplicación identifica mandarín. No bandera o decoración de caracteres; comparte referente con 汉语 en el curso y requiere texto real externo. No bandera, traje o aspecto personal para identificar alemán; usar contexto lingüístico. No ciudad o bandera como equivalencia del idioma ruso; requiere texto o audio externo. No identificar coreano por apariencia o bandera; no generar escritura falsa para explicarlo. No pizza o monumento como definición de una lengua; requiere un ejemplo verbal. No reducir español a España ni a una bandera; la lengua tiene que identificarse lingüísticamente.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No bandera ni apariencia como idioma; el contenido lingüístico de la aplicación identifica mandarín.

### 都 · dōu — todos; ambos

ID: `v-都` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-8f453fd9d60f54df` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Un grupo pequeño de adultos ficticios participa en la misma actividad de estudiar, todos atentos con un libro, sin una persona excluida.

CONTROL SEMÁNTICO: La totalidad se interpreta dentro de una proposición; no confundir con también o con un número exacto.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** La totalidad se interpreta dentro de una proposición; no confundir con también o con un número exacto.

### 要 · yào — querer; gustar; me/le gustaría

ID: `v-要` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-ad41ac008f7fa180` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Una persona adulta indica cortésmente a quien la atiende la bebida que desea entre una taza y un vaso, todavía sin recibirla.

CONTROL SEMÁNTICO: Deseo o pedido no equivale a poseer o beber; no añadir precios o marcas.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Deseo o pedido no equivale a poseer o beber; no añadir precios o marcas.

### 还 · hái — además

ID: `v-还` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-81cf983ab38f30ab` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Una persona muestra un libro y después añade otro objeto de estudio a su conjunto, con gesto de incorporación visible.

CONTROL SEMÁNTICO: Representar adición en contexto, no devolver ni otro sentido homógrafo de 还.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Representar adición en contexto, no devolver ni otro sentido homógrafo de 还.

### 贝贝 · Bèibei — Beibei; un nombre

ID: `v-贝贝` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-6549c3b15a399ab7` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Un perro pequeño ficticio está cerca de una persona que lo presenta afectuosamente a su interlocutor.

CONTROL SEMÁNTICO: Ilustración editorial de una mascota, no retrato documentado de Beibei; una imagen no permite inferir su nombre.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Ilustración editorial de una mascota, no retrato documentado de Beibei; una imagen no permite inferir su nombre.

### 真 · zhēn — verdaderamente; verdadero

ID: `v-真` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-4af016cfa287443c` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Una persona mira con admiración una fotografía impresa que sostiene otra, con reacción espontánea de sorpresa agradable; la fotografía muestra un paisaje bello sencillo.

CONTROL SEMÁNTICO: La imagen acompaña el elogio del ejemplo sobre una foto, no representa literalmente realmente ni autentica una fotografía.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** La imagen acompaña el elogio del ejemplo sobre una foto, no representa literalmente realmente ni autentica una fotografía.

### 晚 · wǎn — tarde

ID: `v-晚` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-7df75dd9bf6c29a8` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Una persona adulta llega después de que otra ya haya empezado una actividad, con reloj de esfera lisa para una referencia temporal añadida después.

CONTROL SEMÁNTICO: Tarde relativo, no necesariamente la franja de la tarde o la noche; no horas generadas.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Tarde relativo, no necesariamente la franja de la tarde o la noche; no horas generadas.

### 英语 · Yīngyǔ — idioma inglés

ID: `v-英语` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-3e66c1f13219bd9c` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Dos adultos ficticios practican una lengua con un libro sin texto legible y audífonos sobre una pequeña mesa; uno habla y el otro escucha.

CONTROL SEMÁNTICO: Apoya lenguaje como actividad, no identifica un sistema lingüístico sin el contenido verbal. Extranjero es relativo al hablante; no identificar una lengua como universalmente extranjera. La lengua inglesa la identifica el enunciado o audio, no bandera o cara del hablante. La variedad estándar de mandarín no es visible; requiere contenido oral y lingüístico real. No Torre Eiffel o bandera como definición de francés; la frase o el audio identifican la lengua. No apariencia de los hablantes ni bandera; distinguir la lengua mediante el enunciado real. No bandera ni apariencia como idioma; el contenido lingüístico de la aplicación identifica mandarín. No bandera o decoración de caracteres; comparte referente con 汉语 en el curso y requiere texto real externo. No bandera, traje o aspecto personal para identificar alemán; usar contexto lingüístico. No ciudad o bandera como equivalencia del idioma ruso; requiere texto o audio externo. No identificar coreano por apariencia o bandera; no generar escritura falsa para explicarlo. No pizza o monumento como definición de una lengua; requiere un ejemplo verbal. No reducir español a España ni a una bandera; la lengua tiene que identificarse lingüísticamente.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** La lengua inglesa la identifica el enunciado o audio, no bandera o cara del hablante.

### 先生 · xiānsheng — Sr.; señor; caballero; marido

ID: `v-先生` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-d8ca525dc86699f8` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Dos adultos ficticios mantienen una conversación formal cordial, con postura respetuosa y vestimenta cotidiana cuidada.

CONTROL SEMÁNTICO: No deducir esposa o estado civil por ropa o anillo; el tratamiento debe quedar en el texto del ejemplo. No inferir señor, caballero o marido de un rostro; elegir el sentido documental mediante la frase.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No inferir señor, caballero o marido de un rostro; elegir el sentido documental mediante la frase.

### 太太 · tàitai — Sra.; señora; esposa

ID: `v-太太` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-d8ca525dc86699f8` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Dos adultos ficticios mantienen una conversación formal cordial, con postura respetuosa y vestimenta cotidiana cuidada.

CONTROL SEMÁNTICO: No deducir esposa o estado civil por ropa o anillo; el tratamiento debe quedar en el texto del ejemplo. No inferir señor, caballero o marido de un rostro; elegir el sentido documental mediante la frase.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No deducir esposa o estado civil por ropa o anillo; el tratamiento debe quedar en el texto del ejemplo.

### 干嘛 · gàn má — qué haces

ID: `v-干嘛` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-26d092726d9dfe68` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Una persona adulta pregunta a otra qué está haciendo mientras observa su actividad manual sencilla sobre una mesa mínima.

CONTROL SEMÁNTICO: La diferencia respecto de 干嘛 es lingüística, no visual; no inventar una acción distinta para distinguirlas. No exigir esta fórmula coloquial frente a otras preguntas visualmente equivalentes.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No exigir esta fórmula coloquial frente a otras preguntas visualmente equivalentes.

### 干啥 · gàn shá — qué estás haciendo; muy coloquial

ID: `v-干啥` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-26d092726d9dfe68` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Una persona adulta pregunta a otra qué está haciendo mientras observa su actividad manual sencilla sobre una mesa mínima.

CONTROL SEMÁNTICO: La diferencia respecto de 干嘛 es lingüística, no visual; no inventar una acción distinta para distinguirlas. No exigir esta fórmula coloquial frente a otras preguntas visualmente equivalentes.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** La diferencia respecto de 干嘛 es lingüística, no visual; no inventar una acción distinta para distinguirlas.

### 贵 · guì — precioso; caro

ID: `v-贵` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-88e4fcaed85e0035` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Una persona considera un objeto cotidiano de aspecto elaborado y reacciona con sorpresa moderada ante una tarjeta de precio completamente en blanco.

CONTROL SEMÁNTICO: Solo para la acepción caro; el precio se añade de forma controlada y no se aplica a 贵姓.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Solo para la acepción caro; el precio se añade de forma controlada y no se aplica a 贵姓.

### 哪儿 · nǎr — dónde

ID: `v-哪儿` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-5df655ecf01f7d0d` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Una persona consulta a otra una ubicación sobre un mapa plegado sin rótulos, con gesto interrogativo dirigido al lugar.

CONTROL SEMÁNTICO: No marcar una respuesta inventada; dónde requiere enunciado y no se deduce del mapa solo.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No marcar una respuesta inventada; dónde requiere enunciado y no se deduce del mapa solo.

### 老朋友 · lǎo péngyou — viejos amigos

ID: `v-老朋友` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-47b946d821f27c96` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Dos amigos adultos ficticios se reencuentran con calidez mientras sostienen una fotografía antigua de ellos mismos en una etapa anterior, sin texto.

CONTROL SEMÁNTICO: Antigüedad de amistad, no amigos necesariamente ancianos; fotografía interior ficticia y no dato documental del libro.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Antigüedad de amistad, no amigos necesariamente ancianos; fotografía interior ficticia y no dato documental del libro.

### 语言 · yǔ yán — idiomas

ID: `v-语言` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-3e66c1f13219bd9c` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Dos adultos ficticios practican una lengua con un libro sin texto legible y audífonos sobre una pequeña mesa; uno habla y el otro escucha.

CONTROL SEMÁNTICO: Apoya lenguaje como actividad, no identifica un sistema lingüístico sin el contenido verbal. Extranjero es relativo al hablante; no identificar una lengua como universalmente extranjera. La lengua inglesa la identifica el enunciado o audio, no bandera o cara del hablante. La variedad estándar de mandarín no es visible; requiere contenido oral y lingüístico real. No Torre Eiffel o bandera como definición de francés; la frase o el audio identifican la lengua. No apariencia de los hablantes ni bandera; distinguir la lengua mediante el enunciado real. No bandera ni apariencia como idioma; el contenido lingüístico de la aplicación identifica mandarín. No bandera o decoración de caracteres; comparte referente con 汉语 en el curso y requiere texto real externo. No bandera, traje o aspecto personal para identificar alemán; usar contexto lingüístico. No ciudad o bandera como equivalencia del idioma ruso; requiere texto o audio externo. No identificar coreano por apariencia o bandera; no generar escritura falsa para explicarlo. No pizza o monumento como definición de una lengua; requiere un ejemplo verbal. No reducir español a España ni a una bandera; la lengua tiene que identificarse lingüísticamente.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Apoya lenguaje como actividad, no identifica un sistema lingüístico sin el contenido verbal.

### 中文 · zhōnɡ wén — chino

ID: `v-中文` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-3e66c1f13219bd9c` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Dos adultos ficticios practican una lengua con un libro sin texto legible y audífonos sobre una pequeña mesa; uno habla y el otro escucha.

CONTROL SEMÁNTICO: Apoya lenguaje como actividad, no identifica un sistema lingüístico sin el contenido verbal. Extranjero es relativo al hablante; no identificar una lengua como universalmente extranjera. La lengua inglesa la identifica el enunciado o audio, no bandera o cara del hablante. La variedad estándar de mandarín no es visible; requiere contenido oral y lingüístico real. No Torre Eiffel o bandera como definición de francés; la frase o el audio identifican la lengua. No apariencia de los hablantes ni bandera; distinguir la lengua mediante el enunciado real. No bandera ni apariencia como idioma; el contenido lingüístico de la aplicación identifica mandarín. No bandera o decoración de caracteres; comparte referente con 汉语 en el curso y requiere texto real externo. No bandera, traje o aspecto personal para identificar alemán; usar contexto lingüístico. No ciudad o bandera como equivalencia del idioma ruso; requiere texto o audio externo. No identificar coreano por apariencia o bandera; no generar escritura falsa para explicarlo. No pizza o monumento como definición de una lengua; requiere un ejemplo verbal. No reducir español a España ni a una bandera; la lengua tiene que identificarse lingüísticamente.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No bandera o decoración de caracteres; comparte referente con 汉语 en el curso y requiere texto real externo.

### 法语 · Făyǔ — francés

ID: `v-法语` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-3e66c1f13219bd9c` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Dos adultos ficticios practican una lengua con un libro sin texto legible y audífonos sobre una pequeña mesa; uno habla y el otro escucha.

CONTROL SEMÁNTICO: Apoya lenguaje como actividad, no identifica un sistema lingüístico sin el contenido verbal. Extranjero es relativo al hablante; no identificar una lengua como universalmente extranjera. La lengua inglesa la identifica el enunciado o audio, no bandera o cara del hablante. La variedad estándar de mandarín no es visible; requiere contenido oral y lingüístico real. No Torre Eiffel o bandera como definición de francés; la frase o el audio identifican la lengua. No apariencia de los hablantes ni bandera; distinguir la lengua mediante el enunciado real. No bandera ni apariencia como idioma; el contenido lingüístico de la aplicación identifica mandarín. No bandera o decoración de caracteres; comparte referente con 汉语 en el curso y requiere texto real externo. No bandera, traje o aspecto personal para identificar alemán; usar contexto lingüístico. No ciudad o bandera como equivalencia del idioma ruso; requiere texto o audio externo. No identificar coreano por apariencia o bandera; no generar escritura falsa para explicarlo. No pizza o monumento como definición de una lengua; requiere un ejemplo verbal. No reducir español a España ni a una bandera; la lengua tiene que identificarse lingüísticamente.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No Torre Eiffel o bandera como definición de francés; la frase o el audio identifican la lengua.

### 德语 · Déyǔ — alemán

ID: `v-德语` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-3e66c1f13219bd9c` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Dos adultos ficticios practican una lengua con un libro sin texto legible y audífonos sobre una pequeña mesa; uno habla y el otro escucha.

CONTROL SEMÁNTICO: Apoya lenguaje como actividad, no identifica un sistema lingüístico sin el contenido verbal. Extranjero es relativo al hablante; no identificar una lengua como universalmente extranjera. La lengua inglesa la identifica el enunciado o audio, no bandera o cara del hablante. La variedad estándar de mandarín no es visible; requiere contenido oral y lingüístico real. No Torre Eiffel o bandera como definición de francés; la frase o el audio identifican la lengua. No apariencia de los hablantes ni bandera; distinguir la lengua mediante el enunciado real. No bandera ni apariencia como idioma; el contenido lingüístico de la aplicación identifica mandarín. No bandera o decoración de caracteres; comparte referente con 汉语 en el curso y requiere texto real externo. No bandera, traje o aspecto personal para identificar alemán; usar contexto lingüístico. No ciudad o bandera como equivalencia del idioma ruso; requiere texto o audio externo. No identificar coreano por apariencia o bandera; no generar escritura falsa para explicarlo. No pizza o monumento como definición de una lengua; requiere un ejemplo verbal. No reducir español a España ni a una bandera; la lengua tiene que identificarse lingüísticamente.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No bandera, traje o aspecto personal para identificar alemán; usar contexto lingüístico.

### 俄语 · Éyǔ — ruso

ID: `v-俄语` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-3e66c1f13219bd9c` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Dos adultos ficticios practican una lengua con un libro sin texto legible y audífonos sobre una pequeña mesa; uno habla y el otro escucha.

CONTROL SEMÁNTICO: Apoya lenguaje como actividad, no identifica un sistema lingüístico sin el contenido verbal. Extranjero es relativo al hablante; no identificar una lengua como universalmente extranjera. La lengua inglesa la identifica el enunciado o audio, no bandera o cara del hablante. La variedad estándar de mandarín no es visible; requiere contenido oral y lingüístico real. No Torre Eiffel o bandera como definición de francés; la frase o el audio identifican la lengua. No apariencia de los hablantes ni bandera; distinguir la lengua mediante el enunciado real. No bandera ni apariencia como idioma; el contenido lingüístico de la aplicación identifica mandarín. No bandera o decoración de caracteres; comparte referente con 汉语 en el curso y requiere texto real externo. No bandera, traje o aspecto personal para identificar alemán; usar contexto lingüístico. No ciudad o bandera como equivalencia del idioma ruso; requiere texto o audio externo. No identificar coreano por apariencia o bandera; no generar escritura falsa para explicarlo. No pizza o monumento como definición de una lengua; requiere un ejemplo verbal. No reducir español a España ni a una bandera; la lengua tiene que identificarse lingüísticamente.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No ciudad o bandera como equivalencia del idioma ruso; requiere texto o audio externo.

### 日语 · Rìyǔ — japonés

ID: `v-日语` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-3e66c1f13219bd9c` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Dos adultos ficticios practican una lengua con un libro sin texto legible y audífonos sobre una pequeña mesa; uno habla y el otro escucha.

CONTROL SEMÁNTICO: Apoya lenguaje como actividad, no identifica un sistema lingüístico sin el contenido verbal. Extranjero es relativo al hablante; no identificar una lengua como universalmente extranjera. La lengua inglesa la identifica el enunciado o audio, no bandera o cara del hablante. La variedad estándar de mandarín no es visible; requiere contenido oral y lingüístico real. No Torre Eiffel o bandera como definición de francés; la frase o el audio identifican la lengua. No apariencia de los hablantes ni bandera; distinguir la lengua mediante el enunciado real. No bandera ni apariencia como idioma; el contenido lingüístico de la aplicación identifica mandarín. No bandera o decoración de caracteres; comparte referente con 汉语 en el curso y requiere texto real externo. No bandera, traje o aspecto personal para identificar alemán; usar contexto lingüístico. No ciudad o bandera como equivalencia del idioma ruso; requiere texto o audio externo. No identificar coreano por apariencia o bandera; no generar escritura falsa para explicarlo. No pizza o monumento como definición de una lengua; requiere un ejemplo verbal. No reducir español a España ni a una bandera; la lengua tiene que identificarse lingüísticamente.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No apariencia de los hablantes ni bandera; distinguir la lengua mediante el enunciado real.

### 西班牙语 · Xībānyá yǔ — español

ID: `v-西班牙语` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-3e66c1f13219bd9c` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Dos adultos ficticios practican una lengua con un libro sin texto legible y audífonos sobre una pequeña mesa; uno habla y el otro escucha.

CONTROL SEMÁNTICO: Apoya lenguaje como actividad, no identifica un sistema lingüístico sin el contenido verbal. Extranjero es relativo al hablante; no identificar una lengua como universalmente extranjera. La lengua inglesa la identifica el enunciado o audio, no bandera o cara del hablante. La variedad estándar de mandarín no es visible; requiere contenido oral y lingüístico real. No Torre Eiffel o bandera como definición de francés; la frase o el audio identifican la lengua. No apariencia de los hablantes ni bandera; distinguir la lengua mediante el enunciado real. No bandera ni apariencia como idioma; el contenido lingüístico de la aplicación identifica mandarín. No bandera o decoración de caracteres; comparte referente con 汉语 en el curso y requiere texto real externo. No bandera, traje o aspecto personal para identificar alemán; usar contexto lingüístico. No ciudad o bandera como equivalencia del idioma ruso; requiere texto o audio externo. No identificar coreano por apariencia o bandera; no generar escritura falsa para explicarlo. No pizza o monumento como definición de una lengua; requiere un ejemplo verbal. No reducir español a España ni a una bandera; la lengua tiene que identificarse lingüísticamente.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No reducir español a España ni a una bandera; la lengua tiene que identificarse lingüísticamente.

### 韩语 · Hányǔ — coreano

ID: `v-韩语` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-3e66c1f13219bd9c` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Dos adultos ficticios practican una lengua con un libro sin texto legible y audífonos sobre una pequeña mesa; uno habla y el otro escucha.

CONTROL SEMÁNTICO: Apoya lenguaje como actividad, no identifica un sistema lingüístico sin el contenido verbal. Extranjero es relativo al hablante; no identificar una lengua como universalmente extranjera. La lengua inglesa la identifica el enunciado o audio, no bandera o cara del hablante. La variedad estándar de mandarín no es visible; requiere contenido oral y lingüístico real. No Torre Eiffel o bandera como definición de francés; la frase o el audio identifican la lengua. No apariencia de los hablantes ni bandera; distinguir la lengua mediante el enunciado real. No bandera ni apariencia como idioma; el contenido lingüístico de la aplicación identifica mandarín. No bandera o decoración de caracteres; comparte referente con 汉语 en el curso y requiere texto real externo. No bandera, traje o aspecto personal para identificar alemán; usar contexto lingüístico. No ciudad o bandera como equivalencia del idioma ruso; requiere texto o audio externo. No identificar coreano por apariencia o bandera; no generar escritura falsa para explicarlo. No pizza o monumento como definición de una lengua; requiere un ejemplo verbal. No reducir español a España ni a una bandera; la lengua tiene que identificarse lingüísticamente.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No identificar coreano por apariencia o bandera; no generar escritura falsa para explicarlo.

### 意大利语 · yì dà lì yǔ — idioma italiano

ID: `v-意大利语` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-3e66c1f13219bd9c` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Dos adultos ficticios practican una lengua con un libro sin texto legible y audífonos sobre una pequeña mesa; uno habla y el otro escucha.

CONTROL SEMÁNTICO: Apoya lenguaje como actividad, no identifica un sistema lingüístico sin el contenido verbal. Extranjero es relativo al hablante; no identificar una lengua como universalmente extranjera. La lengua inglesa la identifica el enunciado o audio, no bandera o cara del hablante. La variedad estándar de mandarín no es visible; requiere contenido oral y lingüístico real. No Torre Eiffel o bandera como definición de francés; la frase o el audio identifican la lengua. No apariencia de los hablantes ni bandera; distinguir la lengua mediante el enunciado real. No bandera ni apariencia como idioma; el contenido lingüístico de la aplicación identifica mandarín. No bandera o decoración de caracteres; comparte referente con 汉语 en el curso y requiere texto real externo. No bandera, traje o aspecto personal para identificar alemán; usar contexto lingüístico. No ciudad o bandera como equivalencia del idioma ruso; requiere texto o audio externo. No identificar coreano por apariencia o bandera; no generar escritura falsa para explicarlo. No pizza o monumento como definición de una lengua; requiere un ejemplo verbal. No reducir español a España ni a una bandera; la lengua tiene que identificarse lingüísticamente.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No pizza o monumento como definición de una lengua; requiere un ejemplo verbal.

### 会 · huì — saber hacer algo

ID: `v-会` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-37c8d4f0108fb5c8` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Una persona adulta demuestra con soltura cómo usar palillos a otra que aprende, gesto competente y objeto funcional visibles.

CONTROL SEMÁNTICO: La acción ilustra una capacidad aprendida solo dentro de la frase; no distingue poder de hacer por sí misma.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** La acción ilustra una capacidad aprendida solo dentro de la frase; no distingue poder de hacer por sí misma.

### 厉害 · lì hài — impresionante; muy hábil

ID: `v-厉害` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-8f8adba0fcb7b302` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Una persona adulta observa con admiración a otra que resuelve hábilmente una tarea musical sencilla con un piano, sin espectáculo ni celebridad.

CONTROL SEMÁNTICO: Elogio de habilidad, no peligro o amenaza; no inventar un personaje del libro.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Elogio de habilidad, no peligro o amenaza; no inventar un personaje del libro.

### 普通话 · pǔtōnghuà — mandarín estándar

ID: `v-普通话` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-3e66c1f13219bd9c` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Dos adultos ficticios practican una lengua con un libro sin texto legible y audífonos sobre una pequeña mesa; uno habla y el otro escucha.

CONTROL SEMÁNTICO: Apoya lenguaje como actividad, no identifica un sistema lingüístico sin el contenido verbal. Extranjero es relativo al hablante; no identificar una lengua como universalmente extranjera. La lengua inglesa la identifica el enunciado o audio, no bandera o cara del hablante. La variedad estándar de mandarín no es visible; requiere contenido oral y lingüístico real. No Torre Eiffel o bandera como definición de francés; la frase o el audio identifican la lengua. No apariencia de los hablantes ni bandera; distinguir la lengua mediante el enunciado real. No bandera ni apariencia como idioma; el contenido lingüístico de la aplicación identifica mandarín. No bandera o decoración de caracteres; comparte referente con 汉语 en el curso y requiere texto real externo. No bandera, traje o aspecto personal para identificar alemán; usar contexto lingüístico. No ciudad o bandera como equivalencia del idioma ruso; requiere texto o audio externo. No identificar coreano por apariencia o bandera; no generar escritura falsa para explicarlo. No pizza o monumento como definición de una lengua; requiere un ejemplo verbal. No reducir español a España ni a una bandera; la lengua tiene que identificarse lingüísticamente.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** La variedad estándar de mandarín no es visible; requiere contenido oral y lingüístico real.

### 方言 · fāngyán — dialecto; variedad regional de una lengua

ID: `v-方言` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-adfc702c302dbecb` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Dos adultos ficticios conversan junto a un mapa plegado sin rótulos y un pequeño grabador, como apoyo a una conversación sobre variedades de lengua.

CONTROL SEMÁNTICO: No inferir variedad regional por rostro; las muestras lingüísticas deben venir del contenido externo, no de la imagen.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No inferir variedad regional por rostro; las muestras lingüísticas deben venir del contenido externo, no de la imagen.

### 外语 · wàiyǔ — idioma extranjero

ID: `v-外语` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-3e66c1f13219bd9c` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Dos adultos ficticios practican una lengua con un libro sin texto legible y audífonos sobre una pequeña mesa; uno habla y el otro escucha.

CONTROL SEMÁNTICO: Apoya lenguaje como actividad, no identifica un sistema lingüístico sin el contenido verbal. Extranjero es relativo al hablante; no identificar una lengua como universalmente extranjera. La lengua inglesa la identifica el enunciado o audio, no bandera o cara del hablante. La variedad estándar de mandarín no es visible; requiere contenido oral y lingüístico real. No Torre Eiffel o bandera como definición de francés; la frase o el audio identifican la lengua. No apariencia de los hablantes ni bandera; distinguir la lengua mediante el enunciado real. No bandera ni apariencia como idioma; el contenido lingüístico de la aplicación identifica mandarín. No bandera o decoración de caracteres; comparte referente con 汉语 en el curso y requiere texto real externo. No bandera, traje o aspecto personal para identificar alemán; usar contexto lingüístico. No ciudad o bandera como equivalencia del idioma ruso; requiere texto o audio externo. No identificar coreano por apariencia o bandera; no generar escritura falsa para explicarlo. No pizza o monumento como definición de una lengua; requiere un ejemplo verbal. No reducir español a España ni a una bandera; la lengua tiene que identificarse lingüísticamente.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Extranjero es relativo al hablante; no identificar una lengua como universalmente extranjera.

### 印加可乐 · yìnjiā kělè — Inca Kola

ID: `v-印加可乐` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-bfa2660297273bda` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Un vaso de refresco amarillo dorado con burbujas reales y botella lisa sin marca al lado, como apoyo del ejemplo de bebida.

CONTROL SEMÁNTICO: El líquido amarillo no autentica Inca Kola. No inventar su logotipo: usar solo contexto textual o futura referencia autorizada de envase real.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** El líquido amarillo no autentica Inca Kola. No inventar su logotipo: usar solo contexto textual o futura referencia autorizada de envase real.

### 有意思 · yǒuyìsi — interesante

ID: `v-有意思` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-edabe603b94eede5` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Una persona adulta examina con curiosidad una fotografía o un objeto curioso sencillo mientras conversa con otra, atención visible y sorpresa moderada.

CONTROL SEMÁNTICO: Interesante es una valoración contextual; no obligar a identificarla mediante un rostro sorprendido.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Interesante es una valoración contextual; no obligar a identificarla mediante un rostro sorprendido.

### 多大 · duōdà — qué edad; qué tamaño

ID: `v-多大` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-528c32ab4c4814bd` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Dos adultos ficticios conversan sobre la edad de un familiar mostrado en una fotografía pequeña, con gesto de pregunta y sin números visibles.

CONTROL SEMÁNTICO: La imagen no revela una edad; elegir el sentido de edad o tamaño según la frase, sin inventar una respuesta.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** La imagen no revela una edad; elegir el sentido de edad o tamaño según la frase, sin inventar una respuesta.

### 英语课 · Yīngyǔ kè — clase de inglés

ID: `v-英语课` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-31d97f8b920307c9` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Una docente y dos estudiantes adultos practican conversación con libros sin letras y audífonos sobre una mesa mínima, claramente en una actividad de enseñanza.

CONTROL SEMÁNTICO: La asignatura chino no se deduce de la apariencia del docente ni de escritura falsa; la aporta la aplicación. La asignatura inglés no se deduce de rostros o banderas; la establece el contexto real fuera de la imagen.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** La asignatura inglés no se deduce de rostros o banderas; la establece el contexto real fuera de la imagen.

### 汉语课 · Hànyǔ kè — clase de chino

ID: `v-汉语课` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-31d97f8b920307c9` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Una docente y dos estudiantes adultos practican conversación con libros sin letras y audífonos sobre una mesa mínima, claramente en una actividad de enseñanza.

CONTROL SEMÁNTICO: La asignatura chino no se deduce de la apariencia del docente ni de escritura falsa; la aporta la aplicación. La asignatura inglés no se deduce de rostros o banderas; la establece el contexto real fuera de la imagen.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** La asignatura chino no se deduce de la apariencia del docente ni de escritura falsa; la aporta la aplicación.

### 约翰 · Yuēhàn — John

ID: `v-约翰` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-e900f5b01ca11c61` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Un perro doméstico ficticio está junto a la persona que lo presenta cariñosamente a otra, animal completo y expresión tranquila.

CONTROL SEMÁNTICO: John es una mascota en la lectura; no generar un hombre ni afirmar que este sea el aspecto documental del perro.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** John es una mascota en la lectura; no generar un hombre ni afirmar que este sea el aspecto documental del perro.

### 有名 · yǒumíng — famoso

ID: `v-有名` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-3518dd340828cf01` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Una persona ficticia presenta a un pequeño grupo una maqueta de un edificio universitario sin rótulos, que despierta reconocimiento e interés.

CONTROL SEMÁNTICO: La fama es conocimiento social, no una propiedad visible; no retratos de celebridades o marcas como respuesta.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** La fama es conocimiento social, no una propiedad visible; no retratos de celebridades o marcas como respuesta.

### 哪一个 · nǎ yí ge — cuál

ID: `v-哪一个` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-b8da06eb6ddd853f` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Una persona adulta observa dos tarjetas u objetos semejantes y pide al interlocutor identificar uno mediante mano abierta.

CONTROL SEMÁNTICO: No resolver automáticamente cuál; la pregunta y selección singular se establecen con el ejemplo. Sin flecha que resuelva la respuesta; la frase distingue cuál de qué y de cuántos.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No resolver automáticamente cuál; la pregunta y selección singular se establecen con el ejemplo.

### 可是 · kěshì — pero

ID: `v-可是` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-1dbf43d015499180` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Una persona muestra gusto por un plato y rechazo moderado por otro en una pequeña comparación de dos momentos, sin símbolos ni palabras.

CONTROL SEMÁNTICO: El contraste necesita dos proposiciones; no convertir un gesto de rechazo en la conjunción pero.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** El contraste necesita dos proposiciones; no convertir un gesto de rechazo en la conjunción pero.

### 早上好 · zǎo shàng hǎo — Buenos días

ID: `v-早上好` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-eb8bb95e19c0a3c3` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Dos adultos ficticios se encuentran y saludan al comenzar su jornada, con una taza y un reloj de esfera lisa como apoyos secundarios.

CONTROL SEMÁNTICO: No crear una distinción visual artificial frente a 早上好; la hora y forma lingüística son externas. Saludo y franja horaria se establecen mediante contexto; no sol o amanecer que sustituya la expresión.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Saludo y franja horaria se establecen mediante contexto; no sol o amanecer que sustituya la expresión.

### 上午好 · shàng wǔ hǎo — Buenos días

ID: `v-上午好` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-eb8bb95e19c0a3c3` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Dos adultos ficticios se encuentran y saludan al comenzar su jornada, con una taza y un reloj de esfera lisa como apoyos secundarios.

CONTROL SEMÁNTICO: No crear una distinción visual artificial frente a 早上好; la hora y forma lingüística son externas. Saludo y franja horaria se establecen mediante contexto; no sol o amanecer que sustituya la expresión.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No crear una distinción visual artificial frente a 早上好; la hora y forma lingüística son externas.

### 下午好 · xià wǔ hǎo — Buenas tardes

ID: `v-下午好` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-48be02523f3424fe` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Dos adultos ficticios se encuentran y se saludan junto a sus objetos de trabajo y un reloj liso para una referencia posterior de tarde.

CONTROL SEMÁNTICO: No hora pintada ni luz cálida como prueba; tiene que verse saludo, no despedida.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No hora pintada ni luz cálida como prueba; tiene que verse saludo, no despedida.

### 晚上好 · wǎn shàng hǎo — Buenas noches

ID: `v-晚上好` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-f148eb07ed572986` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Dos adultos ficticios se saludan al encontrarse junto a una lámpara de mesa encendida, en una escena calmada sin dormitorio.

CONTROL SEMÁNTICO: Saludo de encuentro nocturno, no despedida para dormir ni fondo negro opaco.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Saludo de encuentro nocturno, no despedida para dormir ni fondo negro opaco.

### 刚到 · gāng dào — acabar de llegar

ID: `v-刚到` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-6fa23794d3d2208a` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Una persona recién llegada deja su maleta en el suelo junto a otra que la recibe; un gesto de transición sugiere llegada reciente.

CONTROL SEMÁNTICO: El componente reciente se expresa con el ejemplo, no una marca temporal inventada. El instante reciente necesita apoyo de la frase; no cuantificar minutos ni confundir con la acción de llegar solamente.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** El componente reciente se expresa con el ejemplo, no una marca temporal inventada.

### 这是 · zhè shì — este es; esta es; esto es

ID: `v-这是` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-900e3efb2a08e81f` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Una hablante adulta sostiene cerca un libro y lo muestra a su interlocutor con mano abierta, realizando una identificación de un objeto presente.

CONTROL SEMÁNTICO: Sin nombre escrito en el libro; la construcción necesita su complemento real y no se resuelve con gesto aislado.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Sin nombre escrito en el libro; la construcción necesita su complemento real y no se resuelve con gesto aislado.

### 那是 · nà shì — ese es; esa es; aquello es

ID: `v-那是` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-d15ec9c846224655` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Una hablante adulta señala un objeto alejado de ella y lo identifica para su interlocutor, manteniendo a ambos y al referente visibles.

CONTROL SEMÁNTICO: No confundir con aquí ni con un objeto cercano; el predicado nominal lo aporta la frase.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No confundir con aquí ni con un objeto cercano; el predicado nominal lo aporta la frase.

### 您贵姓 · nín guì xìng — ¿cuál es su apellido?; pregunta respetuosa

ID: `v-您贵姓` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-1779a24ba29a5021` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Dos adultos ficticios intercambian una presentación formal con una tarjeta totalmente en blanco sostenida entre ambos.

CONTROL SEMÁNTICO: Apellido respetuoso, no caro: no dinero, joyas, precios ni datos personales. No escribir nombres; distinguir apellido de nombre de pila mediante el enunciado, no la imagen. No escribir un apellido inventado ni inferir tratamiento por edad; pregunta textual necesaria.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No escribir un apellido inventado ni inferir tratamiento por edad; pregunta textual necesaria.

### 哪国人 · nǎ guó rén — de qué país; de qué nacionalidad

ID: `v-哪国人` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-3e1c91be203fccdc` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Dos adultos ficticios conversan sobre procedencia junto a un mapa sin etiquetas; uno pregunta con gesto amable y el otro escucha.

CONTROL SEMÁNTICO: No bandera que responda por anticipado ni deducir nacionalidad de apariencia.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No bandera que responda por anticipado ni deducir nacionalidad de apariencia.

### 可以 · kěyǐ — poder; estar permitido

ID: `v-可以` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-f7eddb21679f4539` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Una persona solicita permiso para usar una silla o libro y otra acepta con mano abierta y gesto de autorización tranquila.

CONTROL SEMÁNTICO: El permiso se explica en el enunciado; no confundir automáticamente con capacidad aprendida o valoración positiva.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** El permiso se explica en el enunciado; no confundir automáticamente con capacidad aprendida o valoración positiva.

### 死 · sǐ — morir; en 累死了, intensifica el cansancio

ID: `v-死` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-0cfbcf728b23a075` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Una persona adulta ficticia se deja caer suavemente en una silla tras una jornada agotadora, hombros relajados y expresión de gran cansancio, sin lesión.

CONTROL SEMÁNTICO: En este uso intensifica cansancio: no muerte, violencia, cadáver, peligro ni escena médica.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** En este uso intensifica cansancio: no muerte, violencia, cadáver, peligro ni escena médica.

### 一下 · yíxià — un momento; un poco; suaviza una petición

ID: `v-一下` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-a7a517b8b18352de` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Una persona pide brevemente la atención de otra mediante gesto suave de mano mientras la segunda pausa su actividad.

CONTROL SEMÁNTICO: Brevedad o atenuación requieren frase; no reloj con un segundo exacto o cantidad uno como equivalente.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Brevedad o atenuación requieren frase; no reloj con un segundo exacto o cantidad uno como equivalente.

### 孔子学院 · Kǒngzǐ Xuéyuàn — Instituto Confucio

ID: `v-孔子学院` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-ac5438438a154158` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Dos adultos ficticios participan en una clase de mandarín con docente y libros sin letras visibles, ambiente reducido a los sujetos y una mesa mínima.

CONTROL SEMÁNTICO: No inventar fachada, logo o identidad del Instituto Confucio; usar el nombre documentado externamente.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** No inventar fachada, logo o identidad del Instituto Confucio; usar el nombre documentado externamente.

### 上 · shàng — asistir a; tomar, en 上课

ID: `v-上` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

Receta: `IMG-6381db7f540ffeda` · Perfil: `context`.

<details>
<summary>Mostrar prompt completo</summary>

```text
Crea únicamente el recurso visual educativo descrito, aislado sobre transparencia auténtica de canal alfa. Acabado fotográfico editorial fotorrealista, cálido, limpio y natural, con materiales y anatomía creíbles. Un foco semántico dominante y solo los elementos necesarios para entenderlo. Conserva completos los rasgos identificadores del sujeto. La tarjeta de la aplicación añadirá su propio fondo: no pintes fondo blanco, marfil, gris, degradado, paisaje de relleno ni cuadrícula de transparencia. Sin marco, tarjeta, bordes redondeados, interfaz, botones, iconos de audio, letras, Hanzi, pinyin, rótulos ni marcas de agua. Evita halos y bordes recortados; solo admite una sombra de contacto discreta y semitransparente, nunca un suelo opaco extendido.

Viñeta fotográfica que acompaña un uso contextual, no representación literal de una palabra abstracta. Mantén el significado descrito y no intentes hacerlo inequívoco añadiendo texto. La frase, pinyin y traducción los renderiza la aplicación fuera del archivo de imagen. La escena no se utiliza como pregunta de imagen aislada.

ESCENA ESPECÍFICA: Una persona adulta se incorpora a una pequeña actividad de clase, con docente y estudiante visibles y libro abierto sin letras.

CONTROL SEMÁNTICO: Asistir a clase en este registro; no flecha hacia arriba, cima o piso superior.

No producir una captura de interfaz ni una tarjeta terminada. No escribir el nombre de la palabra. No añadir objetos protagonistas ajenos al concepto, duplicaciones accidentales, manos con dedos extra, caras deformadas, comida plástica, rasgos animales caricaturescos ni marcas comerciales inventadas. No insertar la estrella de favoritos ni la flecha de giro de la referencia. No fingir transparencia con un patrón de cuadros. No añadir textos para explicar una escena ambigua.
```

</details>

**Control de significado:** Asistir a clase en este registro; no flecha hacia arriba, cima o piso superior.

## none

### 马大为 · Mǎ Dàwéi — Ma Dawei; estudiante estadounidense

ID: `v-马大为` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

**Sin imagen propia.** Nombre propio del material; una apariencia inventada no identifica ese nombre.

### 宋华 · Sòng Huá — Song Hua; estudiante chino

ID: `v-宋华` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

**Sin imagen propia.** Nombre propio del material; no asociar un retrato arbitrario como respuesta única.

### 吗 · ma — partícula modal interrogativa

ID: `v-吗` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

**Sin imagen propia.** Partícula interrogativa; trabajar la oración, no una imagen propia de un signo de pregunta.

### 呢 · ne — partícula modal para formular preguntas elípticas

ID: `v-呢` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

**Sin imagen propia.** Partícula de pregunta elíptica; el referente depende del turno anterior.

### 不 · bù — no

ID: `v-不` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

**Sin imagen propia.** Negación gramatical de un predicado; no confundir con 没有 ni con una señal genérica de prohibición.

### 丁力波 · Dīng Lìbō — Ding Libo; estudiante canadiense

ID: `v-丁力波` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

**Sin imagen propia.** Nombre propio; no se deduce de rasgos personales o nacionalidad aparente.

### 林娜 · Lín Nà — Lin Na; estudiante británica

ID: `v-林娜` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

**Sin imagen propia.** Nombre propio; conservar su presentación textual, sin retrato arbitrario como pista única.

### 陈 · Chén — Chen; un apellido

ID: `v-陈` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

**Sin imagen propia.** Apellido en el material; no ilustrar un significado aislado del carácter como si fuera el nombre.

### 王小云 · Wáng Xiǎoyún — Wang Xiaoyun; estudiante china

ID: `v-王小云` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

**Sin imagen propia.** Nombre de personaje del material; una imagen sin presentación no permite recuperarlo.

### 的 · de — partícula posesiva o modificadora

ID: `v-的` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

**Sin imagen propia.** Partícula posesiva o modificadora; se practica mediante relaciones dentro de una frase.

### 没 · méi — no

ID: `v-没` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

**Sin imagen propia.** Negación dependiente del predicado; un símbolo de prohibición no define su uso.

### 啊 · a — partícula modal utilizada detrás de un verbo; añade un tono de confirmación

ID: `v-啊` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

**Sin imagen propia.** Partícula de matiz discursivo; una expresión facial no determina ese uso.

### 陆雨平 · Lù Yǔpíng — Lu Yuping; reportero chino

ID: `v-陆雨平` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

**Sin imagen propia.** Nombre propio del material; no sustituir su presentación por una apariencia inventada.

### 马丽 · Mǎ Lì — Mary

ID: `v-马丽` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

**Sin imagen propia.** Nombre propio; no inferible de un retrato sin presentación.

### 张华 · Zhāng Huá — Zhang Hua; nombre propio

ID: `v-张华` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

**Sin imagen propia.** Nombre propio del cuaderno; no identificable mediante retrato inventado.

### 大卫 · Dàwèi — Dawei; nombre propio

ID: `v-大卫` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

**Sin imagen propia.** Nombre propio; no asociarlo automáticamente a una persona real o personaje visual.

### 宋 · Sòng — Song; apellido

ID: `v-宋` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

**Sin imagen propia.** Apellido Song según el material; no ilustrar una dinastía como si fuera el nombre de la persona.

### 力波 · Lìbō — Libo; nombre propio

ID: `v-力波` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

**Sin imagen propia.** Nombre Libo; no se deduce de apariencia o significado separado de sus caracteres.

### 大为 · Dàwéi — Dawei; nombre propio

ID: `v-大为` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

**Sin imagen propia.** Nombre Dawei; conservar su función nominal dentro de la presentación.

### 小云 · Xiǎoyún — Xiaoyun; nombre propio

ID: `v-小云` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

**Sin imagen propia.** Nombre Xiaoyun; no representar literalmente una nube pequeña para enseñar el nombre.

### 了 · le — partícula que indica, según el contexto, un cambio de situación o una acción completada

ID: `v-了` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

**Sin imagen propia.** Partícula aspectual o de cambio de situación; necesita contraste de enunciados.

### 王 · Wáng — Wang; apellido

ID: `v-王` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

**Sin imagen propia.** Apellido Wang en el corpus; no representar un rey para ese sentido nominal.

### 陆 · Lù — Lu; apellido

ID: `v-陆` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

**Sin imagen propia.** Apellido Lu; no ilustrar un terreno como si fuera el nombre propio.

### 梅西 · Méixī — Messi; nombre propio

ID: `v-梅西` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

**Sin imagen propia.** Nombre de persona real; una imagen sintética no certifica identidad ni es una definición léxica.

### 李 · Lǐ — Li; apellido

ID: `v-李` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

**Sin imagen propia.** Apellido Li en el curso; no representar una ciruela por el significado aislado del carácter.

### 张王冉 · Zhāng Wángrǎn — Zhang Wangran; nombre propio

ID: `v-张王冉` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

**Sin imagen propia.** Nombre propio documentado; no reconstruir ni inferir apariencia personal.

### 成龙 · Chéng Lóng — Cheng Long; nombre propio

ID: `v-成龙` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

**Sin imagen propia.** Nombre propio de persona real; no sustituir identidad por rasgos de una imagen generada.

### 巩俐 · Gǒng Lì — Gong Li; nombre propio

ID: `v-巩俐` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

**Sin imagen propia.** Nombre propio de persona real; una apariencia sintética no identifica ese nombre.

### 姚明 · Yáo Míng — Yao Ming; nombre propio

ID: `v-姚明` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

**Sin imagen propia.** Nombre propio; altura o actividad deportiva no bastan para establecer identidad.

### 马云 · Mǎ Yún — Ma Yun; nombre propio

ID: `v-马云` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

**Sin imagen propia.** Nombre propio; no ilustrar caballos y nubes ni inventar un retrato como evidencia.

### 林 · Lín — Lin; apellido

ID: `v-林` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

**Sin imagen propia.** Apellido Lin; no representar un bosque para enseñar el apellido del personaje.

### 玛丽 · Mǎlì — Mali; nombre propio

ID: `v-玛丽` · Riesgo: `high` · Candidata a quiz: no; apoyo contextual o estructurado.

**Sin imagen propia.** Nombre propio; no confundirlo ni fusionarlo con otra grafía del corpus.
