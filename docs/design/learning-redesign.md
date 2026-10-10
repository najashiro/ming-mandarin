# Míng: experiencia de aprendizaje L1–L4

Base: `main` en `d864a8f`, corpus aprobado 2.2.0. Se conserva el contenido,
las relaciones, los IDs, el audio y las fichas de vocabulario existentes.

La portada concentra el acceso a las cuatro lecciones, la práctica por habilidad
y los juegos. `/course` organiza las cuatro lecciones y un repaso general;
`/practice` permite elegir alcance antes de entrar a una actividad. Cada ruta
de lección propone un orden de estudio y mantiene acceso a todos sus recursos,
incluidos radicales, lecturas y ejercicios de L4. Las cantidades de vocabulario
proceden del mismo adaptador que las fichas del alumno.

La última sección visitada se recuerda solo en este navegador. No representa
dominio, finalización ni progreso académico. La lectura/escritura de localStorage
tolera navegadores que lo bloquean y acepta únicamente rutas curriculares conocidas.

Se retiraron de la portada la ruta duplicada de doce módulos, las estadísticas
de infraestructura, la jerga de SRS y el ranking como objetivo principal. Las
funciones originales siguen accesibles desde sus rutas y el pie de página.

## Identidad visual

Papel cálido `#f7f5ef`, jade oscuro `#1a4233`, terracota `#ac4e34` y superficies
salvia, durazno, arena y gris verdoso. Tipografía editorial en títulos, interfaz
con fuentes del sistema y fuente Hanzi existente. CSS específico en
`app/learning.css`, sin modificar la geometría aprobada de vocabulario.

Navegación inferior de cinco destinos en móvil, selector compacto de lección
que conserva la actividad, estado activo, áreas táctiles
de al menos 44 px, zona segura de iPhone, enlace para saltar al contenido,
foco visible y compatibilidad con movimiento reducido.

## Ilustración de portada

- Archivo publicado: `public/images/ming-study.webp` (1536 × 1024).
- Generación: herramienta integrada imagegen; sin llamadas TTS nuevas.
- Revisión: inspección visual por el agente, aceptada para uso decorativo.
- Derivado: WebP calidad 84. No se usa como evidencia curricular ni pregunta.
- Textos, botones y pronunciación se presentan con HTML y audio existentes.

Prompt de generación:

> Use case: illustration-story. Create a polished editorial illustration for the
> hero of Míng, an adult beginner Mandarin learning web app. Wide landscape 3:2
> composition, quiet contemporary East Asian study corner in a restrained
> mid-century gouache and paper-cut style, tactile subtle paper grain,
> sophisticated and welcoming, not childish clipart, not photorealistic. A large
> round terracotta sun in a pale warm cream sky, a sculptural dark forest-jade
> pine branch framing upper right, distant soft sage mountains seen through a
> circular window, an open blank ivory notebook and one slender calligraphy brush
> on a terracotta desk at bottom, a small jade ceramic cup. A little red-orange
> bird resting on the window ledge adds warmth. Deliberate bold silhouettes,
> harmonious negative space, soft dusty sage green, deep forest green #193d35,
> muted vermilion #c86143, warm paper #f7f5ef. No text, no letters, no Chinese
> glyphs, no watermarks, no UI, no borders. This is a decorative companion image
> for a learning dashboard; full-bleed composition filling the image with all key
> elements inside the central 85 percent, careful aesthetically balanced flat
> editorial art.

## Comprobación

`tests/e2e/learning-design.spec.ts` cubre navegación, selección de L4, retorno a
la ruta, continuidad local, destinos inválidos, almacenamiento bloqueado,
teclado y desbordamiento entre 320 y 1440 px. Las suites existentes comprueban
diálogos, audio, imágenes y regresiones de las lecciones.

Validación de la primera iteración (9 de octubre de 2026):

- Corpus 2.2.0: `query.py --validate`, sin errores y con consulta global L1–L4.
- `pnpm lint`, `pnpm typecheck`, `pnpm test` (284 pruebas) y `pnpm build` correctos.
- 66 pruebas de navegador sobre compilación de producción: diseño, diálogos,
  escritura Hanzi y L4 en Chromium, Android y WebKit iPhone. Todas correctas.
- 2 pruebas adicionales de navegación pública, correctas en escritorio y móvil.
- Revisión visual a 320, 390, 768 y 1440 px; sin desbordamiento horizontal.
- `graphify update .` actualizado mediante AST, sin llamadas de pago.

Los enlaces de navegación y las páginas de exploración desactivan la precarga
especulativa de Next.js. Cada actividad se solicita al abrirla; esto evita
descargas innecesarias y cancelaciones de solicitudes en Safari móvil.

## Revisión de filtros y juegos

La selección pública ofrece Lección 1, Lección 2, Lección 3, Lección 4 y
Repaso general. Los enlaces anteriores siguen abriendo su conjunto original
con nombres legibles, sin presentar combinaciones numéricas como opciones.
No se migran ni eliminan IDs, favoritos ni registros de progreso.

El catálogo explica la habilidad y el objetivo de cada juego. Al abrir una
actividad se oculta el catálogo y el foco pasa al juego; al cerrar, regresa al
botón que lo abrió. Cambiar de lección crea una sesión con el contenido de ese
alcance. Escena Viva, Conversación e Historia Detective mantienen el contenido
L1–L3 existente y lo indican en el repaso general; no se anuncian como L4.

Las modalidades Reconocer, Construir y Producir corresponden a elegir,
ordenar bloques barajados y escribir una respuesta propia. Hanzi muestra solo
las modalidades aplicables a cada tarea. El alumno mantiene la modalidad
elegida y puede reiniciar una sesión; los resultados distinguen aciertos y
elementos pendientes. Completar una escritura después de ver su corrección
se registra como práctica con ayuda, sin convertirla en acierto independiente.

En el juego de la hora, la ayuda presenta un ejemplo fijo del material
existente. La corrección espera a que el alumno pulse Continuar y permite
escuchar los modelos. El reto informa que sus cuatro minutos incluyen ayuda
y revisión; el modo de práctica permanece sin límite de tiempo.

Validación de la revisión de juegos:

- Lint, TypeScript y compilación de producción correctos; 287 pruebas unitarias.
- Una matriz de 186 casos detectó incidencias de audio manual, doble clic en
  Safari, carga de selectores y un margen que alteraba la ficha móvil. Todas
  fueron corregidas. Las pruebas de escritura se actualizaron para seguir el
  audio realmente planteado por el corpus vigente, conservando trazos reales.
- Comprobación final: 77 casos correctos en Chromium, Android y WebKit iPhone,
  incluyendo filtros, producción escrita, escritura asistida, reinicio por
  lección, errores de audio, doble clic, fichas y navegación pública.
- Ayuda, reloj continuo y corrección del juego de la hora: 12 casos correctos
  en los tres navegadores durante la matriz, sin cambios posteriores del motor.
- Capturas e inspección visual del catálogo y actividades en laptop y móvil;
  grafo AST actualizado, sin modificar corpus ni regenerar audio.
